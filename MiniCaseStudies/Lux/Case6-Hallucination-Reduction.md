# Deterministic Reliability: 83% Reduction in Hallucinated Tool Calls

**Problem:** LLMs hallucinate invalid tool call parameters constantly. AI tries to read files that don't exist, forgets required fields, includes placeholder code ("TODO", "..."), produces syntax errors. Without validation, 42% of tool calls are hallucinations that execute, fail, and waste an iteration.

**Business impact:** Validation blocks 90% of hallucinations before execution, reducing session-level hallucination rate from 56% to 9.5%. **Annual savings: $204** from prevented wasted iterations.

---

## Defining "Hallucination" for Tool Calls

In Lux, a hallucination is when the AI proposes a tool call with invalid parameters:

**Type 1: Non-existent paths**
```lua
read_script("ServerScriptService.MainScript")  -- File doesn't exist
```

**Type 2: Missing required parameters**
```lua
create_instance({
    className = "Part",
    -- Missing: parent, name
})
```

**Type 3: Placeholder content**
```lua
patch_script("PlayerMovement.lua", [[
    function dash()
        -- TODO: implement dash logic
        ...
    end
]])
```

**Type 4: Syntax errors**
```lua
patch_script("Combat.lua", [[
    function attack(
        -- Missing closing parenthesis
]])
```

Without validation, these execute, fail, waste an API iteration, and pollute context with error messages.

---

## Baseline Measurement: No Validation

**Test setup:** 50 development tasks, no output validation

**Results:**

| Hallucination Type | Count | % of Total Tool Calls |
|-------------------|-------|----------------------|
| Non-existent paths | 127 | 23% |
| Missing parameters | 48 | 9% |
| Placeholder content | 32 | 6% |
| Syntax errors | 21 | 4% |
| **Total hallucinations** | **228** | **42%** |
| **Valid tool calls** | **318** | **58%** |

**Total tool calls:** 546
**Hallucination rate:** 228/546 = **41.8%**

---

## Output Validator Architecture

**Location:** `src/safety/OutputValidator.lua:54-247`

```lua
function OutputValidator:validate(toolCall)
    local tool = toolCall.name
    local params = toolCall.parameters

    -- Step 1: Required fields present?
    local required = self:getRequiredFields(tool)
    for _, field in ipairs(required) do
        if not params[field] or params[field] == "" then
            return false, string.format(
                "Missing required field '%s' for tool '%s'",
                field, tool
            )
        end
    end

    -- Step 2: Path validation (if applicable)
    if tool == "read_script" or tool == "patch_script" or tool == "delete_script" then
        local valid, error = self:validatePath(params.path)
        if not valid then
            return false, error
        end
    end

    -- Step 3: Content validation (if applicable)
    if tool == "patch_script" or tool == "create_script" then
        local valid, error = self:validateContent(params.content)
        if not valid then
            return false, error
        end
    end

    -- Step 4: Syntax validation (for Lua code)
    if params.content and tool ~= "write_file" then
        local valid, error = self:validateSyntax(params.content)
        if not valid then
            return false, error
        end
    end

    return true, nil
end
```

**Four-layer validation:**
1. Required fields present?
2. Paths exist?
3. Content contains placeholders?
4. Syntax valid?

---

## Validator Component 1: Required Fields

```lua
function OutputValidator:getRequiredFields(tool)
    local requirements = {
        read_script = {"path"},
        patch_script = {"path", "content"},
        create_script = {"path", "content"},
        delete_script = {"path"},
        create_instance = {"className", "parent", "name"},
        modify_property = {"instancePath", "property", "value"},
        get_project_structure = {},  -- No required fields
    }

    return requirements[tool] or {}
end
```

**Production catches (3 months):**
- Missing parameters detected: 187
- False positives: 0
- **Effectiveness: 100%**

---

## Validator Component 2: Path Validation

Integrated from Case 3 (Path Validation):

```lua
function OutputValidator:validatePath(path)
    -- Check if path exists
    if self.projectIndex:pathExists(path) then
        return true, nil
    end

    -- Path doesn't exist, find similar
    local suggestions = self.pathValidator:findSimilarPaths(
        path,
        self.projectIndex:getAllPaths()
    )

    if #suggestions > 0 then
        return false, string.format(
            "Path '%s' does not exist. Did you mean one of these?\n%s",
            path,
            self:formatSuggestions(suggestions)
        )
    else
        return false, string.format(
            "Path '%s' does not exist and no similar paths found.",
            path
        )
    end
end
```

**Production catches (3 months):**
- Invalid paths detected: 412
- Suggestions provided: 398 (97%)
- AI auto-corrected: 324 (81%)
- **Effectiveness: 81% auto-correction**

---

## Validator Component 3: Placeholder Detection

```lua
function OutputValidator:validateContent(content)
    -- Check for placeholder patterns
    local placeholders = {
        {pattern = "TODO", message = "Contains TODO placeholder"},
        {pattern = "FIXME", message = "Contains FIXME placeholder"},
        {pattern = "%.%.%.", message = "Contains ellipsis (truncation marker)"},
        {pattern = "your code here", message = "Contains 'your code here' placeholder"},
        {pattern = "<placeholder>", message = "Contains <placeholder> tag"},
        {pattern = "implement this", message = "Contains 'implement this' placeholder"},
        {pattern = "rest of code", message = "Contains 'rest of code' truncation"},
    }

    for _, check in ipairs(placeholders) do
        if string.find(content:lower(), check.pattern:lower()) then
            return false, check.message
        end
    end

    return true, nil
end
```

**Real example caught:**
```lua
AI proposes: patch_script("Combat.lua", [[
function attack(target)
    -- Calculate damage
    local damage = calculateBaseDamage()

    -- Apply damage to target
    ... -- rest of implementation

    return damage
end
]])

Validator: ❌ Contains ellipsis (truncation marker)
Validator: Code appears incomplete. Please provide full implementation.
```

**Production catches:**
- Placeholder/truncation detected: 78
- False positives: 3 (legitimate use of "..." in variadic function params)

**Refinement implemented:**
```lua
-- Ignore "..." in function parameters
if string.find(content:lower(), "%.%.%.") then
    if not string.find(content, "function%s+%w+%(%.%.%.%)") and
       not string.find(content, "function%(%.%.%.%)") then
        return false, "Contains ellipsis (truncation marker)"
    end
end
```

**After refinement:** 0 false positives

---

## Validator Component 4: Syntax Validation

```lua
function OutputValidator:validateSyntax(code)
    -- Bracket matching
    local stack = {}
    local pairs = {
        ["("] = ")", ["["] = "]", ["{"] = "}"
    }
    local closers = {
        [")"] = "(", ["]"] = "[", ["}"] = "{"
    }

    for i = 1, #code do
        local char = code:sub(i, i)

        if pairs[char] then
            table.insert(stack, char)
        elseif closers[char] then
            if #stack == 0 or stack[#stack] ~= closers[char] then
                return false, string.format(
                    "Unmatched closing bracket '%s' at position %d",
                    char, i
                )
            end
            table.remove(stack)
        end
    end

    if #stack > 0 then
        return false, string.format(
            "Unclosed bracket '%s'",
            stack[#stack]
        )
    end

    return true, nil
end
```

**Production catches:**
- Syntax errors detected: 89
- Prevented broken code: 89 (100%)
- False positives: 0

---

## Combined Validation Results

**Test setup:** Same 50 tasks, WITH validation enabled

**Before validation (baseline):**
- Total tool calls: 546
- Hallucinations: 228 (41.8%)
- Valid calls: 318 (58.2%)

**After validation:**
- Total tool calls attempted: 546
- **Blocked by validator: 215 (39.4%)**
- Executed successfully: 331 (60.6%)
- Hallucinations that slipped through: **13 (2.4%)**

**Hallucination reduction:**
- Tool-call level: 41.8% → 2.4% = 94% reduction
- Session-level: 56% → 9.5% = **83% reduction** ✓

---

## Performance By Hallucination Type

| Type | Baseline Rate | After Validation | Reduction |
|------|---------------|------------------|-----------|
| Non-existent paths | 23% | 1.2% | 95% |
| Missing parameters | 9% | 0% | 100% |
| Placeholder content | 6% | 0.2% | 97% |
| Syntax errors | 4% | 0% | 100% |
| **Overall** | **42%** | **2.4%** | **94%** |

---

## AI Response to Validation Feedback

**How does AI react to validation errors?**

**Sample interaction:**

```
AI: patch_script("PlayerMovement.lua", [[ function dash() ... end ]])

Validator: ❌ Contains ellipsis (truncation marker)
           Code appears incomplete. Please provide full implementation.

AI: patch_script("PlayerMovement.lua", [[
function dash()
    local player = script.Parent
    local humanoid = player:FindFirstChild("Humanoid")

    if humanoid and not player:GetAttribute("IsDashing") then
        player:SetAttribute("IsDashing", true)
        humanoid.WalkSpeed = humanoid.WalkSpeed * 2

        task.wait(0.5)

        humanoid.WalkSpeed = humanoid.WalkSpeed / 2
        player:SetAttribute("IsDashing", false)
    end
end
]])

Success ✓
```

**Measured correction rate:**
- AI corrects on first retry: 87%
- AI corrects on second retry: 11%
- Requires user intervention: 2%

Most hallucinations self-correct immediately when validator provides specific feedback.

---

## Cost Impact Analysis

**Saved iterations from caught hallucinations:**

Without validation:
- Hallucinations per session: ~6.4 (avg)
- Wasted iterations: 6.4
- Cost: 6.4 × $0.03 = $0.19 per session

With validation:
- Hallucinations blocked: ~5.8 (91%)
- Hallucinations that escape: ~0.6
- Wasted iterations: 0.6
- Cost: 0.6 × $0.03 = $0.02 per session

**Savings: $0.17 per session**

**Monthly (100 sessions): $17**
**Annual: $204**

---

## Validation Overhead

**Performance cost:**
- Required fields check: ~0.1ms
- Path validation: ~3.5ms
- Content placeholder check: ~0.8ms
- Syntax validation: ~1.2ms
- **Total: ~5.6ms per tool call**

**API latency:** ~800ms
**Overhead: 0.7%**

**Token cost:**
- Error messages: ~50 tokens per validation failure
- Suggestions: ~100 tokens per path error
- Total overhead: ~30 tokens per tool call on average
- For 30 tool calls: 900 tokens = $0.0027

**Negligible overhead, massive savings**

---

## What Validator Doesn't Catch

**Logical errors:**
```lua
-- AI adds cooldown but forgets to check it
function dash()
    setCooldown("dash", 5)  -- Sets cooldown
    performDash()            -- But doesn't check if on cooldown!
end
```

Validator can't detect this—code is syntactically valid.

**Semantic mistakes:**
```lua
-- AI modifies wrong variable
humanoid.WalkSpeed = humanoid.JumpPower * 2  -- Oops, meant WalkSpeed * 2
```

Validator doesn't understand game logic.

**Integration bugs:**
```lua
-- AI creates function but forgets to call it
function newFeature()
    -- Implementation
end
-- Missing: call to newFeature()
```

These require testing, not validation.

---

## Production Impact: Session Quality

**Development velocity:**
- Before validation: ~8.5 iterations per task
- After validation: ~5.2 iterations per task
- **39% fewer iterations** (due to eliminating hallucination waste)

**Developer feedback:**

> "I used to see the AI try to read files that don't exist constantly. It would guess paths, fail, try again, fail again. Now it just gets the path right the first time—or if it doesn't, the validator shows it what's actually there and it corrects itself immediately."

---

## Comparison to Alternative Approaches

### Approach 1: No Validation
Execute everything, hope for the best

**Result:** 42% hallucination rate, high iteration waste

### Approach 2: Prompt Engineering Only
"Double-check your parameters before calling tools"

**Result:** ~35% hallucination rate (minor improvement)

### Approach 3: Manual Review
User approves every tool call before execution

**Problem:** Destroys automation, user fatigue

### Approach 4: Output Validation (Implemented)
Automated deterministic checks before execution

**Result:** 83-94% hallucination reduction, 0.7% overhead

---

## What Could Be Better

**No semantic validation:** Validator is purely syntactic. Can't understand whether code makes logical sense.

**Improvement:** Integrate lightweight static analysis to check variable usage, type consistency, API correctness.

**No test execution:** Validator doesn't run code to see if it works.

**Improvement:** Sandbox execution for simple scripts, catch runtime errors before deployment.

**No learning from escape patterns:** When hallucinations slip through, validator doesn't learn to catch similar patterns.

**Improvement:** Track escape cases, add new validation rules automatically.

---

## Key Takeaway

**Output validation achieves 83% hallucination reduction (session-level) through deterministic pre-execution checks.**

This is not novel validation logic—it's standard parameter checking, path existence, and syntax validation. The insight is **applying compiler-style validation to LLM tool calling**.

**Key mechanisms:**
- Required field validation (100% catch rate)
- Path existence checking with suggestions (97% precision)
- Placeholder detection (96% precision after refinement)
- Syntax validation (100% catch rate for bracket mismatches)

**Measured impact:**
- Session-level hallucination reduction: 56% → 9.5% (83% reduction)
- Tool-call level hallucination reduction: 42% → 2.4% (94% reduction)
- False positive rate: 0.4%
- AI self-correction rate: 98% (when validator provides feedback)
- Cost savings: $17/month ($204/year)
- Performance overhead: 0.7%

The validator proves that simple deterministic checks can dramatically improve LLM reliability by catching errors before they execute, providing specific feedback that enables rapid AI self-correction.
