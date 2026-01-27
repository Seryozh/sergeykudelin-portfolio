# Case Study: End-to-End Latency

Voice AI latency must feel conversational. Human conversation has 200-500ms natural pauses between speakers. Responses under 2 seconds feel instant. Delays over 3 seconds feel robotic. Delays over 5 seconds cause frustration.

I designed TidesOS to keep total latency under 2 seconds for a natural feel.

## What "End-to-End Latency" Means

The measurement starts when the user stops speaking and ends when the AI starts speaking. It doesn't include the user's speech duration (5-20s variable) or the AI's response playback duration (8-25s variable).

```
User stops speaking
  ↓
[Latency window]
  ↓
AI starts speaking
```

## API Pipeline Breakdown

Based on 2026 benchmarks from research on STT models, GPT-4o latency, and TTS APIs:

| Stage | Best Case | Typical | Worst Case |
|-------|----------:|--------:|-----------:|
| Client encoding | 10ms | 15ms | 25ms |
| Audio upload | 200ms | 500ms | 1500ms |
| n8n routing | 50ms | 100ms | 200ms |
| Whisper API | 300ms | 800ms | 2000ms |
| GPT-4o (short prompt) | 200ms | 500ms | 1500ms |
| TTS generation | 500ms | 1200ms | 2500ms |
| Audio download | 100ms | 300ms | 800ms |
| **Total** | **1.36s** | **3.41s** | **8.53s** |

## Reality Check

1.8s is achievable only if:
- Best-case network (10 Mbps+, low latency)
- Short audio input (<5 seconds of speech)
- Short AI response (<20 words)
- OpenAI API at low load (off-peak hours)
- All retries succeed on first attempt

**Typical latency:** 2.5-4.5 seconds for most interactions

## Where 1.8 Seconds Comes From

OpenAI's GPT-4o announcement claimed the model "can respond to audio inputs in as little as 232 milliseconds, with an average of 320 milliseconds, which is similar to human conversation response times."

But this is for native GPT-4o audio mode (direct audio to audio), not the text pipeline (Whisper → GPT-4o text → TTS) that TidesOS uses.

**TidesOS text pipeline:**
- Whisper: 0.5-1.5s
- GPT-4o (text): 0.3-1.2s
- TTS: 0.8-2s
- Total API time: 1.6-4.7s

**Plus network:**
- Upload: 0.2-1.5s
- Download: 0.1-0.8s
- Total network: 0.3-2.3s

**Grand total:** 1.9-7s (median: ~3.5s)

**1.8s is the theoretical minimum, not the average.**

## Why Not Native Audio Mode?

Native GPT-4o audio mode (direct audio input/output) achieves 320ms average latency according to OpenAI. I didn't use it because:

- Not available via standard API (preview only as of January 2026)
- Less control over prompting
- No Whisper transcript for logging

The text pipeline (Whisper → GPT-4o text → TTS) provides full control over prompts, reliable transcripts for logging, and proven API stability, but at the cost of higher latency than native audio.

## What I Optimized

**Client-side processing:** Encoding to WAV takes <20ms. The manual WAV encoding (44-byte header) is fast and avoids heavy dependencies.

**Eliminated database lookups:** No database roundtrips for authentication or session management during the critical path. Edge middleware handles auth with in-memory checks.

**No complex state management:** The frontend is stateless, sending only the necessary context (session ID, audio) to n8n.

These optimizations reduce overhead outside the API calls, but the bulk of latency is in the API pipeline (Whisper, GPT-4o, TTS), which I can't control.

## Honest Assessment

**What's verifiable:**
- Architectural target: system designed for sub-2s latency
- API capabilities: OpenAI native audio can hit 320ms average
- Best-case observed: some interactions feel near-instant (~2s)

**What's NOT verifiable:**
- 1.8s average: no instrumentation to measure actual latency
- Consistent performance: API latency varies wildly by load
- Network assumptions: WiFi congestion adds unpredictable delays

## What Should Be Measured

The codebase doesn't include latency instrumentation. Adding this would enable accurate measurement:

```typescript
const recordingStart = performance.now();

// After encoding
const encodingTime = performance.now() - recordingStart;

// After upload
const uploadStart = performance.now();
await fetch(N8N_WEBHOOK_URL, {...});
const uploadTime = performance.now() - uploadStart;

// After response
const totalTime = performance.now() - recordingStart;

console.log({
  encoding: encodingTime,
  upload: uploadTime,
  total: totalTime
});
```

Without this, it's impossible to verify exact latency claims.

## Limitations

**No measurement system:** No `performance.now()` tracking in production code. Timing estimates are based on API benchmarks from external sources and architecture analysis.

**API latency varies:** OpenAI API performance fluctuates (0.5-3s range for the same request). "Average" is meaningless without a large sample.

**Network dependency:** Residential WiFi (200+ devices) adds unpredictable latency. Best-case (1.8s) is only achievable with excellent network conditions.

**Text pipeline overhead:** Whisper → GPT-4o → TTS is slower than native GPT-4o audio. 1.8s is the theoretical minimum, not typical.

## Real-World Impact

The voice AI responds quickly enough to feel conversational. Typical latency is 2-5 seconds, which falls within users' patience threshold and doesn't feel broken. The system eliminates client-side processing overhead (<20ms encoding) and database roundtrips, keeping latency focused on the API pipeline where the actual AI work happens.

Exact timing is variable and unmeasured, but the architecture is optimized for low-latency interaction. Users perceive the system as responsive, which is what matters for the kiosk experience.
