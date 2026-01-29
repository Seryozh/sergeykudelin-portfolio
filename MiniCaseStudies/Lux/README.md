# Lux: AI Coding Assistant for Roblox

## What It Is

Lux is an AI coding assistant for Roblox game development. It runs inside Roblox Studio, understands the full codebase structure (100+ Lua scripts), and helps developers add features, fix bugs, and refactor code through natural language instructions. Unlike generic coding assistants, Lux is specifically designed for Roblox's unique environment—it understands Instance hierarchies, RemoteEvents, DataStores, and other Roblox-specific APIs.

The core challenge was reliability. LLMs hallucinate constantly: wrong file paths, incomplete code with "TODO" placeholders, missing function parameters, infinite error loops. Lux wraps the LLM in deterministic safety layers (circuit breakers, output validators, path validators) that catch errors before execution and help the AI self-correct automatically.

---

## Technical Challenges & How I Solved Them

### 1. Cost Optimization: Context Token Explosion

**The problem:** AI coding assistants need codebase context. Sending all 100 scripts every request = 10,000-15,000 tokens per request ($0.037 cost). Over a 30-request development session, that's $1.11 just for context. The AI only needs 10-15% of the codebase for any given task, but how do you know which files matter?

**The solution:** Semantic relevance scoring. For each task, score every script based on: keyword matching (×10 points), path matching (×25 points), recent edits (×15 points, decaying), capability matching (×15 points), and historical error tracking (×20 points). Sort by score, take top N files until token budget exhausted. This selects 12-18 files (~2,900 tokens) instead of all 100.

**The result:** 76% token reduction (12,450 → 2,980 tokens per request). Cost drops from $1.11 to $0.27 per session. Annual savings: $1,008. Accuracy maintained at 96% (no degradation from selective context).

### 2. Deterministic Reliability: Infinite Loop Prevention

**The problem:** LLMs get stuck in error loops. AI tries wrong file path → fails → tries variation → fails → repeats 20-50 times, burning $0.60-1.50 in API costs and filling context with error messages. Early testing showed 12% of sessions hit infinite loops before manual intervention.

**The solution:** Hystrix circuit breaker pattern. Track consecutive failures. At 3 failures, show warning. At 5 failures, open circuit and block operations for 30 seconds. After cooldown, enter half-open state (allow one test operation). If test succeeds, close circuit and resume. If test fails, re-open circuit.

**The result:** 100% detection, 0% false positives across 127 production sessions and 14 circuit trips. Every trip was a legitimate infinite loop. Warnings at 3 failures enabled proactive user intervention in 43% of cases, preventing circuit trips entirely.

### 3. Deterministic Reliability: Path Hallucination Reduction

**The problem:** LLMs hallucinate file paths constantly. In a codebase with hierarchical paths like `ServerScriptService.Core.Systems.Combat.WeaponManager`, the AI guesses wrong 37% of the time. Typos, missing components, abbreviations—errors requiring 4.2 API iterations on average to correct.

**The solution:** Component-based similarity scoring with Levenshtein distance. When AI proposes invalid path, split into components, score each known path by exact matches (×25), fuzzy matches edit distance ≤2 (×15), substring matches (×10), and structural similarity bonuses. Return top 3 suggestions with scores. AI sees correct path and self-corrects on next iteration.

**The result:** 69% reduction in user interventions (71% → 21.5%). Auto-correction rate of 78.5%. Average iterations to correct drops from 4.2 to 1.3. Annual savings: $936 from reduced error-related iterations.

### 4. Infrastructure: Exponential Memory Decay

**The problem:** Including all session history in every request costs 10,000 tokens ($0.03 per request). Including nothing means AI has amnesia and contradicts earlier decisions. Need adaptive memory that keeps recent/relevant items, discards stale items.

**The solution:** Exponential decay with 5-minute half-life. Formula: `relevance = base × (0.5 ^ (timeSinceAccess / 300))`. Items decay over time but get boosted (+5 base score) on each access. When working memory exceeds 20 items, compact: keep top 15 by relevance, archive bottom 5 as compressed summaries.

**The result:** 61% cost reduction while maintaining 96% accuracy. Token count drops from 6,200 to 2,400 per request. User reminders reduced 91%. Memory naturally prioritizes what matters through usage patterns.

### 5. Deterministic Reliability: Hallucination Reduction via Validation

**The problem:** 42% of tool calls have hallucinated parameters (non-existent paths, missing fields, placeholder code, syntax errors). Without validation, these execute, fail, waste an iteration, and pollute context with error messages.

**The solution:** Four-layer output validation before execution. Layer 1: Required fields present? Layer 2: Paths exist (with similarity suggestions)? Layer 3: Content contains placeholders ("TODO", "...")? Layer 4: Syntax valid (bracket matching, Lua grammar)? If validation fails, return specific error with suggestions. AI self-corrects 87% of the time on first retry.

**The result:** 83% hallucination reduction at session level (56% → 9.5%). 94% reduction at tool-call level (42% → 2.4%). AI self-corrects 98% of failures when given specific validation feedback. Annual savings: $204 from prevented wasted iterations.

---

## Technical Stack

| Component | Technology |
|-----------|------------|
| Runtime | Roblox Studio (Luau) |
| AI Model | Claude 3.5 Sonnet |
| Architecture | Safety layers + Memory system + Tool executor |
| Memory | Exponential decay (5-min half-life) |
| Validation | Path validator + Output validator + Circuit breaker |
| Context Selection | Semantic relevance scoring |

---

## Deep Dives Available

Want to see the engineering details? Full case studies with measured results:

### Cost Optimization
- **[76% Token Reduction Through Semantic Context](Case1-Token-Efficiency.md)** - Relevance scoring, keyword/path/recency/capability matching, $1,008/year savings

### Deterministic Reliability
- **[100% Infinite Loop Prevention (Circuit Breaker)](Case2-Circuit-Breaker.md)** - Hystrix pattern, threshold tuning, 0% false positives across 127 sessions
- **[69% Path Failure Reduction (Path Validation)](Case3-Path-Validation.md)** - Levenshtein distance, component-based scoring, 78.5% auto-correction
- **[83% Hallucination Reduction (Output Validation)](Case6-Hallucination-Reduction.md)** - Four-layer validation, 98% AI self-correction rate

### Infrastructure Piping
- **[Exponential Memory Decay (5-Min Half-Life)](Case4-Memory-Decay.md)** - Decay formula, compaction mechanics, 61% cost reduction

---

**Total Production Sessions:** 127-200 (varies by measurement)
**Tool Calls Validated:** 1,456
**Circuit Breaker Trips:** 14 (100% legitimate, 0% false positives)
**Annual Cost Savings:** $2,714 (combined across all optimizations)
