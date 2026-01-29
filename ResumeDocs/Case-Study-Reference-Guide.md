# Case Study Reference Guide for Resume AI Bot

This document provides URLs and descriptions for all technical case studies. Use these to hyperlink specific claims in resume bullet points.

## Direct URL Structure

All case studies use query parameters:
- Format: `https://sergeykudelin.com/?project={project}&proof={proof-id}`
- Projects: `tidesos`, `logiscan`, `lux`
- The URL opens the modal and loads the specific case study automatically

## Lux - AI Coding Assistant

### Case Study 1: Token Efficiency (Cost Optimization)
**Direct URL:** https://sergeykudelin.com/?project=lux&proof=case1-token-efficiency

**What it covers:** Explains how semantic relevance scoring reduced context token consumption from 12,450 to 2,980 tokens per request (76% reduction) by intelligently selecting only relevant files from a 100+ script codebase. Details the scoring algorithm using keyword matching (×10 points), path matching (×25 points), recent edits (×15 points, decaying), capability matching (×15 points), and historical error tracking (×20 points). Measured annual savings: $1,008 while maintaining 96% accuracy.

**Use for claims about:** Context optimization, token efficiency, semantic scoring, cost reduction, algorithmic file selection.

---

### Case Study 2: Circuit Breaker (Deterministic Reliability)
**Direct URL:** https://sergeykudelin.com/?project=lux&proof=case2-circuit-breaker

**What it covers:** Details implementation of Hystrix circuit breaker pattern to prevent infinite LLM error loops. Explains state machine (CLOSED/OPEN/HALF_OPEN), threshold tuning (3 failures = warning, 5 failures = open), 30-second cooldown, and half-open test operations. Production results: 100% detection rate, 0% false positives across 127 sessions, 14 legitimate circuit trips, 43% proactive user intervention at warning stage.

**Use for claims about:** Circuit breaker implementation, infinite loop prevention, distributed systems patterns, reliability engineering, state machines.

---

### Case Study 3: Path Validation (Deterministic Reliability)
**Direct URL:** https://sergeykudelin.com/?project=lux&proof=case3-path-validation

**What it covers:** Explains component-based path similarity scoring using Levenshtein distance algorithm to suggest corrections when AI hallucinates file paths. Details scoring system: exact matches (×25), fuzzy matches with edit distance ≤2 (×15), substring matches (×10), structural similarity bonuses. Results: 69% reduction in user interventions (71% → 21.5%), 78.5% auto-correction rate, average iterations to correct drops from 4.2 to 1.3. Annual savings: $936.

**Use for claims about:** Levenshtein distance, path validation, fuzzy matching, auto-correction, algorithm implementation.

---

### Case Study 4: Memory Decay (Infrastructure Piping)
**Direct URL:** https://sergeykudelin.com/?project=lux&proof=case4-memory-decay

**What it covers:** Details exponential decay memory system with formula `relevance = base × (0.5 ^ (timeSinceAccess / 300))` for 5-minute half-life. Explains access boosting (+5 per access), compaction mechanics (keep top 15, archive bottom 5 when exceeding 20 items), and measured effectiveness. Results: 61% cost reduction (6,200 → 2,400 tokens per request), 96% accuracy maintained, 91% reduction in user reminders.

**Use for claims about:** Memory management, exponential decay, cache eviction, context optimization, half-life formulas.

---

### Case Study 6: Hallucination Reduction (Deterministic Reliability)
**Direct URL:** https://sergeykudelin.com/?project=lux&proof=case6-hallucination-reduction

**What it covers:** Explains four-layer output validation system applied before tool execution: Layer 1 (required fields), Layer 2 (path existence with suggestions), Layer 3 (placeholder detection for "TODO", "...", etc.), Layer 4 (syntax validation with bracket matching). Results: 83% hallucination reduction at session level (56% → 9.5%), 94% reduction at tool-call level (42% → 2.4%), 98% AI self-correction rate when given specific feedback. Annual savings: $204.

**Use for claims about:** Output validation, hallucination reduction, compiler-style validation, multi-layer validation, AI self-correction.

---

## TidesOS - Voice-First Operational Interface

### Case Study 1: Cross-Browser Audio Reliability (Deterministic Reliability)
**Direct URL:** https://sergeykudelin.com/?project=tidesos&proof=case1-cross-browser-audio

**What it covers:** Details the iOS Safari MediaRecorder codec incompatibility problem (40% Whisper rejection rate) and solution through custom WAV encoder using Web Audio API's ScriptProcessorNode. Explains manual WAV header construction, Float32 to 16-bit PCM conversion, and persistent MediaStream pattern to avoid iOS permission revocation. Results: 100% reliability across all browsers, zero codec-related failures in 500+ production sessions.

**Use for claims about:** Cross-browser compatibility, custom audio encoding, WAV format engineering, iOS Safari quirks, Web Audio API.

---

### Case Study 2: Exponential Backoff (Deterministic Reliability)
**Direct URL:** https://sergeykudelin.com/?project=tidesos&proof=case2-exponential-backoff

**What it covers:** Explains exponential backoff retry implementation for hostile hotel WiFi environment (30+ concurrent guests, 5-10% packet loss, 500-2000ms latency spikes). Details retry logic with 1s, 2s, 4s delays, intelligent retry decisions (retry 5xx, skip 4xx), and 7-second total window fitting user patience threshold. Results: failure rate reduced from 18% to 1.5%, users perceive transient failures as loading, no manual retries needed.

**Use for claims about:** Exponential backoff, network resilience, retry logic, hostile network environments, AWS SDK patterns.

---

## LogiScan - AI-Powered Package Verification System

### Case Study 1: Vision API Cost Reduction (Cost Optimization)
**Direct URL:** https://sergeykudelin.com/?project=logiscan&proof=case1-vision-api-cost

**What it covers:** Details client-side image compression implementation using HTML5 Canvas API to reduce GPT-4o Vision token consumption. Explains token economics (12MP iPhone photo = 42,837 tokens at $2.50/million = $0.107/scan), compression strategy (resize to 2500px width, JPEG 80% quality), and validation methodology (100% extraction parity testing). Results: 87% token reduction (42,837 → 5,525 tokens), cost drops to $0.014/scan, annual savings $418, upload time drops from 16s to 0.8s.

**Use for claims about:** AI cost optimization, client-side compression, token economics, HTML5 Canvas API, GPT-4o Vision.

---

### Case Study 2: Client-Side Architecture (Infrastructure Piping)
**Direct URL:** https://sergeykudelin.com/?project=logiscan&proof=case2-client-side-architecture

**What it covers:** Explains N+1 query problem in traditional server-side validation (17 scans × 5 items = 85 queries, 50-200ms latency each = 4-12s wasted) and client-side solution. Details architecture: fetch entire inventory once on page load (~100 packages, 8KB), store in React state, match locally using JavaScript array search (O(n) complexity). Results: 98.8% query reduction (86 → 1 per audit), sub-1ms matching latency, instant feedback, database connection pool never exhausted.

**Use for claims about:** N+1 query elimination, client-side architecture, algorithm complexity, React state management, database optimization.

---

## Usage Instructions for Resume AI Bot

When generating resume bullet points:

1. **Match claims to case studies:** If a bullet point mentions "reduced costs 87%", hyperlink to the relevant case study URL
2. **Use specific numbers:** All case studies contain measured results - use exact percentages/dollar amounts
3. **Reference patterns:** When mentioning engineering patterns (circuit breaker, exponential backoff, Levenshtein distance), link to the case study that implements it
4. **Prioritize impact:** Lead with business impact (cost savings, reliability improvements, time savings) before technical details
5. **Avoid platform mentions:** Don't mention "Roblox" for Lux - focus on "AI coding assistant" or "production LLM system"

## Example Hyperlinked Bullet Point

**Without hyperlink:**
"Reduced AI vision costs by 87% through client-side image compression"

**With hyperlink:**
"Reduced AI vision costs by 87% through [client-side image compression](https://sergeykudelin.com/?project=logiscan&proof=case1-vision-api-cost)"

## Technical Credibility Markers

When writing bullet points, emphasize:
- **Measured results** (percentages, dollar amounts, time savings)
- **Production metrics** (session counts, user counts, uptime)
- **Standard patterns** (Hystrix, AWS SDK patterns, compiler-style validation)
- **Algorithms** (Levenshtein distance, exponential decay, semantic scoring)
- **Zero false positive rates** (circuit breaker, validation systems)
- **Business thinking** (annual savings, cost per operation, ROI)
