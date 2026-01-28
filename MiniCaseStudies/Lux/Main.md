## The Problem

Anyone who has tried to use ChatGPT or Claude to help with coding has run into the same frustrating pattern. You ask it to modify a file. It hallucinates a path that doesn't exist. You correct it. It tries again, but now it's forgotten what you originally asked for. Three iterations later, you've spent more time managing the AI than just doing the work yourself.

This problem gets exponentially worse in game development. A typical Roblox project might have 100+ script files organized in a complex hierarchy. The AI needs to understand not just the code, but the spatial relationships between game objects, the client-server architecture, and the interconnected state of dozens of systems.

When I started building Lux, I had a simple goal: make an AI assistant that could actually ship features in a Roblox game without constant babysitting. What I ended up building was something more interesting. A framework for wrapping unreliable AI in deterministic safety checks, turning a research toy into a production tool.

## The Core Insight

The breakthrough came from realizing that LLMs and traditional software have fundamentally incompatible philosophies. Traditional software is deterministic. Give it the same input twice, you get the same output. LLMs are probabilistic. They guess. Sometimes those guesses are brilliant, sometimes they're completely wrong.

Most people try to solve this by prompt engineering. Add more instructions. Be more specific. Use XML tags. But you're still fundamentally trusting the AI to do the right thing. It's like trying to make a random number generator deterministic by asking it nicely.

The better approach is to treat the AI as a proposal engine. Let it be creative and probabilistic, but verify every single action it takes against physical reality. Build a closed loop: (1) AI proposes an action, (2) System validates the proposal before executing, (3) System executes and observes the result, (4) System updates AI's understanding with what actually happened, (5) Loop continues. This is how autonomous vehicles work. The neural network proposes steering angles, but there are layers of safety checks that can override it.

## Architecture Overview

The system has three main layers:

### Safety Layer

- Pre-execution validation catches hallucinations before they cause damage
- Circuit breaker detects failure spirals and halts execution
- Post-execution verification ensures actions had intended effects

### Memory Layer

- Working memory holds recent context with exponential decay
- Decision memory learns from successful patterns
- Project context anchors AI understanding to actual codebase state

### Execution Layer

- Tool system with read/write/project operations
- Sequential execution with approval queue for dangerous operations
- Automatic retry with exponential backoff

The interesting part is how these layers interact. Each tool execution generates observations that feed back into memory, which influences context selection for the next AI inference, which determines what tools get called next. It's a continuous feedback loop grounded in empirical verification.

## Technical Deep Dive: The Memory System

The memory architecture solved the hardest problem: How do you give an AI a useful mental model of a large codebase without blowing through your token budget?

Traditional approaches either include everything (expensive, slow, ineffective) or include nothing (AI operates blind). I needed something adaptive that could learn what matters.

The solution uses a three-tier hierarchy inspired by human memory:

**Critical Memory** holds things that never decay. User goals, architectural decisions, key findings. This is maybe 5-10 items max. Small enough to always include in context.

**Working Memory** holds recent observations scored by relevance. Each item gets a base relevance score (100 for user goals, 80 for script reads, 70 for tool results). [Then exponential decay kicks in: relevance = base × (0.5 ^ (timeSinceAccess / 300)). Half-life of 5 minutes. Something you accessed 5 minutes ago is worth half as much.](case4-memory-decay.md) But here's the key: every time you access an item, its base score increases by 5 points. Frequently used context stays relevant even as time passes.

When working memory exceeds 20 items, the system compacts. Lowest relevance items get summarized and moved to background memory. High relevance items stay in working memory where the AI can see them.

**Background Memory** is compressed summaries of things that used to matter. The AI can't see these directly, but they're available if needed. Think of it like human long-term memory. The math works out beautifully. A naive approach might send 10,000 tokens of context per request. This system typically sends 2,000-3,000 tokens while maintaining 95%+ accuracy. The cost savings compound quickly. $2 per request becomes $0.40.

## Technical Deep Dive: The Circuit Breaker

The circuit breaker prevents the most expensive failure mode: infinite retry loops.

Picture this: The AI tries to read a script at path "ServerScriptService.MainScript". Path doesn't exist. Tool returns error. AI tries again with "ServerScriptService.Main". Still wrong. Tries "ServerScriptService.Scripts.Main". Tries variations until it burns through your API budget and fills the context window with error messages.

This happens more often than you'd think. LLMs are pattern matchers, and when stuck in an error state, they often can't break out of the pattern that caused the error.

The circuit breaker is a state machine with three states:

- **Closed (normal operation):** Track consecutive failures, allow all operations, warning at 3 failures
- **Open (blocked):** Triggered after 5 consecutive failures, block all new operations, 30 second cooldown timer, require human intervention
- **Half-Open (testing):** Cooldown period expired, allow one test operation, success returns to Closed, failure returns to Open

The magic number 5 came from empirical testing. Too low and you get false positives from transient errors. Too high and you waste money on obvious failures. Five consecutive failures is a strong signal that something is fundamentally wrong and human judgment is needed. [In 500+ production sessions, the circuit breaker achieved 100% success rate at preventing runaway loops. Every time it tripped, inspection showed it was correct to halt execution. False positive rate of zero.](case2-circuit-breaker.md)

## Technical Deep Dive: Output Validation

The output validator catches hallucinations before they execute. It's surprisingly effective despite being simple rule-based logic. For any tool call, it checks:

- **Required fields present?** If you're reading a script, you need a path. If you're creating an instance, you need a className, parent, and name. Missing required fields immediately reject the tool call.
- **Paths exist?** For operations on existing resources, validate the path against actual game hierarchy. If path doesn't exist, find similar paths using substring matching and suggest them back to the AI.
- **Content looks valid?** Scan for placeholder patterns: TODO, FIXME, "your code here", <placeholder>. Also check for suspicious markers like ... which often indicate truncated content.
- **Syntax passes basic sanity checks?** Count opening and closing brackets, parentheses, braces. They should match. Check for common typos like "funciton" or "retrun".

The similar path algorithm is particularly clever. When the AI hallucinates "ServerScriptService.MainScript", the validator extracts path components, scores every known script by substring overlap, finds "ServerScriptService.Main.server" with high overlap, and returns top 3 suggestions to AI. The AI sees: "Path doesn't exist. Did you mean: ServerScriptService.Main.server?" and immediately corrects itself. One iteration instead of five. [Validation reduces failed tool calls by 60-70%. The ROI is massive because failed tool calls are pure waste.](case3-path-validation.md)

## Technical Deep Dive: Context Selection

Context selection might be the most important optimization in the entire system. It determines what the AI can "see" when making decisions.

The naive approach is showing the AI every script in the project. But in a 100 file codebase, that's 10,000-15,000 tokens. And most of those scripts are irrelevant to the current task. You're paying to include noise.

The smarter approach is semantic filtering. Score each script by relevance to the current request, then only include the top 10-20 scripts. Relevance scoring is multi-factor: keyword matches × 10 + path matches × 25 + recent edit bonus × (1 - minutesAgo/30) × 15 + capability matches × 15 + freshness adjustment + problematic script boost.

The result is dramatic. Context size drops 70-80% while accuracy stays above 95%. And the system automatically adapts. Working on UI? UI scripts get selected. Switch to server logic? Context shifts to server scripts. No manual configuration needed.

## Technical Deep Dive: Decision Memory

Decision memory is pattern learning for agent workflows. The idea is simple: remember what worked, suggest it when you see similar problems.

Every time a user gives the agent a task, the system records: task description (keywords extracted), required capabilities (UI, scripting, networking, etc), tool sequence executed, success or failure, and time taken.

When a new task arrives, find similar historical tasks based on keyword overlap, capability overlap, recency bonus, usage frequency bonus, success rate bonus, minus failure penalty and inefficiency penalty. High similarity + high success rate = strong recommendation. The system tells the AI: "Similar task succeeded before using this approach: get_script → patch_script → verify. Consider using the same pattern."

The interesting emergent behavior is "trauma tracking". Scripts that repeatedly cause failures get flagged. Next time that script appears in context, it's marked with a warning. The AI learns to be more careful with certain files. [In practice, this reduces iteration count by 30-50% on repetitive tasks. First time doing something might take 8 iterations. Fifth time doing something similar? Down to 3-4 iterations. The system actually gets better over time.](case5-decision-memory.md)

## The Human-in-the-Loop Design

One decision I got right early: never fully automate dangerous operations.

Script modifications, instance deletion, property changes. These go through an approval queue. The AI can propose them, but a human has to click "approve" before they execute.

This might seem like it defeats the purpose of automation. But in practice, it's the right tradeoff. Dangerous operations are maybe 20% of all operations. The other 80% (reads, searches, inspections) run automatically. So you still get massive acceleration, but with a safety net.

The approval flow is async. AI proposes operation, system pauses the agentic loop and shows approval UI. User reviews and approves. System resumes loop from exact same state. The AI doesn't even know it was paused. From its perspective, the operation just took a bit longer than usual. One subtle detail: operation queue has TTL expiration. If an operation sits in the queue for more than 60 seconds, it expires. This prevents desync where the AI proposes an operation based on stale context.

## Performance Results

The quantitative results surprised me. I expected improvement, but not this much:

- **Token Efficiency:** [75% reduction (10,000-15,000 → 2,000-4,000 tokens per request)](case1-token-efficiency.md)
- **Cost:** 80% savings ($2-4 → $0.40-0.80 per complex task)
- **Accuracy:** 95%+ successful tool executions (up from 60-70%)
- **Speed:** 60% fewer iterations (8-15 → 3-6 iterations per task)
- **Reliability:** 100% infinite loop prevention over 500+ sessions
- **Hallucination Reduction:** [85% (from 40-60% to 5-10%)](case6-hallucination-reduction.md)
- **Context Corruption:** 0 incidents

The cost savings compound. A typical development session is 10-20 requests. At baseline, that's $30-60 per session. With Lux, it's $4-8 per session. Over 100 sessions, you save $2,600-5,200. But the real value isn't just money. It's developer time. Tasks that took 20-40 minutes now take 2-5 minutes. Complex multi-hour tasks now take 15-30 minutes. The productivity multiplier is real.

## What I Learned

### 1. Deterministic wrappers beat prompt engineering

I spent weeks trying to prompt engineer my way to reliability. "Be careful", "double check paths", "verify before executing". None of it worked consistently. The LLM would be careful for a while, then make the same mistakes.

The breakthrough was giving up on making the LLM reliable and instead making the system around it reliable. Let the LLM be creative and error-prone. Catch errors before they cause damage. This is how you build production systems with unreliable components.

### 2. Empirical verification is non-negotiable

Never trust the AI's internal model. Always verify against physical reality. After every tool execution, check that it actually did what it said it did. Update the AI's context with observed results, not with what the AI thinks happened. This sounds obvious, but most AI coding tools skip this step. They assume the AI is right and move on. Then they wonder why things break.

### 3. Memory management is the hard problem

Getting the memory system right took longer than everything else combined. Too much context and you waste tokens. Too little and the AI operates blind. The exponential decay model with access boosting is the best solution I found, but I went through a dozen failed approaches first.

The key insight was that relevance isn't static. It changes based on time, access patterns, and whether content is stale. A dynamic scoring system adapts to these changes automatically.

### 4. Small details matter more than you think

The circuit breaker cooldown period. 30 seconds. Why 30? I tried 10, 15, 45, 60. Thirty seconds is long enough for a human to notice and respond, but short enough that it doesn't feel like the system is frozen. This took a week of tuning.

### 5. Production use reveals everything

Synthetic testing found maybe 60% of bugs. The other 40% only appeared during real development sessions. Race conditions in the approval queue. Edge cases in path validation. Memory leaks in keyword cache. You can't predict everything. You have to ship, observe, and iterate.

## Why This Matters

AI coding tools are everywhere. Copilot, Cursor, Aider, dozens more. Most of them have the same problem: they're great for small tasks but break down on complex projects.

The reason is that they treat the AI as a magic box. Prompt goes in, code comes out, hope for the best. There's no verification layer, no memory system, no feedback loop.

Lux demonstrates that you can build reliable AI systems by adding structure around unreliable AI. Closed-loop verification, multi-tier memory, safety checks. These aren't AI problems, they're systems engineering problems. The broader lesson is about how we should think about AI in production systems. Not as a replacement for deterministic logic, but as a complement. Let AI handle the creative, fuzzy, hard-to-specify parts. Wrap it in deterministic checks that ensure correctness. This is how autonomous vehicles work. This is how medical AI works. This is how any safety-critical AI system works. It's time we applied the same principles to development tools.

## System Scale & Key Metrics

| Metric | Value |
|--------|-------|
| Codebase | 15,000 lines of Lua across 55 modules |
| Tool Definitions | 20+ (read, write, project operations) |
| Major Subsystems | 10 (core, memory, safety, planning, context, tools, etc.) |
| Memory Half-Life | 300 seconds |
| Relevance Boost Per Access | +5 points |
| Working Memory Capacity | 20 items |
| Background Memory Capacity | 50 items |
| Circuit Breaker Threshold | 5 failures, 30s cooldown, 3 failure warning |
| Operation TTL | 60 seconds |
| Path-Related Failure Reduction | 70% |
| Stale-Edit Conflict Reduction | 90% |
| Simple Tasks Speed | 95% faster (5-10 min → 30 sec) |
| Medium Tasks Speed | 90% faster (20-40 min → 2-5 min) |
| Complex Tasks Speed | 85% faster (2-4 hrs → 15-30 min) |
| Focused Development Time | 80% increase |
