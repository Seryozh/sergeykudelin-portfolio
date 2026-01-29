# TidesOS: Voice-First Operational Interface

## What It Is

TidesOS is a voice AI kiosk for overnight hotel operations. Guests walk up, ask questions ("Where are the pool towels?" "What's the WiFi password?" "Can you give me a building access code?"), and get instant voice responses. It runs 24/7 in hotel lobbies, handling routine inquiries so security staff can focus on actual security work.

The system uses OpenAI Whisper for speech recognition, GPT-4o for reasoning, and OpenAI TTS for voice synthesis. All audio processing happens in the browser using Web Audio API. The interface is deliberately minimal: one large button, live transcription during recording, and synchronized text during playback. It supports bilingual operation (English and Rioplatense Spanish) with automatic language detection.

---

## Technical Challenges & How I Solved Them

### 1. Cross-Browser Audio Reliability

**The problem:** iOS Safari's MediaRecorder API produces non-standard audio codecs that OpenAI Whisper randomly rejects. Chrome works 100% of the time. Safari fails 40% of the time on the same audio input.

**The solution:** Bypassed MediaRecorder entirely. Built custom WAV encoder using Web Audio API's ScriptProcessorNode to capture raw PCM audio, then manually constructed WAV headers and converted Float32 samples to 16-bit PCM. This gives deterministic format across all browsers. Also implemented persistent MediaStream pattern to avoid iOS Safari's aggressive permission revocation.

**The result:** 100% reliability across all browsers and devices. Zero codec-related failures in 500+ production sessions.

### 2. Network Resilience on Hotel WiFi

**The problem:** Hotel lobby WiFi is hostile. 30+ guests streaming Netflix, packet loss at 5-10%, latency spikes to 500-2000ms. Without retry logic, 15-18% of voice requests failed on first attempt, forcing users to manually retry.

**The solution:** Implemented exponential backoff retry (1s, 2s, 4s delays) with intelligent retry logic—retry 5xx server errors, skip 4xx client errors. Total retry window of 7 seconds fits within user patience threshold. Only retries transient failures, not permanent errors.

**The result:** User-visible failure rate dropped from 18% to 1.5%. Users perceive transient failures as "loading" rather than errors. No manual retries needed.

---

## Technical Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 19 + Next.js 15 |
| Audio Processing | Web Audio API (custom WAV encoding) |
| Speech Recognition | OpenAI Whisper |
| Reasoning | OpenAI GPT-4o |
| Voice Synthesis | OpenAI TTS HD |
| Orchestration | N8N self-hosted workflows |
| Session Storage | Supabase PostgreSQL |
| Deployment | Vercel Edge Network |

---

## Deep Dives Available

Want to see the engineering details? Full case studies with measured results:

### Deterministic Reliability
- **[Cross-Browser Audio Reliability](MiniCaseStudies/Case1-Cross-Browser-Audio.md)** - Custom WAV encoding, persistent MediaStream, iOS Safari quirks
- **[Exponential Backoff for Voice AI](MiniCaseStudies/Case2-Exponential-Backoff.md)** - 18% → 1.5% failure rate, hotel WiFi reliability

---

**Total Production Sessions:** 500+
**Uptime:** 24/7 deployment in production hotel
**Languages Supported:** English, Rioplatense Spanish (automatic detection)
