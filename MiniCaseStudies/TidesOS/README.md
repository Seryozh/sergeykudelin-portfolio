## The Problem

Night shifts at large residential complexes follow a predictable pattern. Between 10 PM and 6 AM, security staff field hundreds of nearly identical questions. Where are the pool towels? Can you give me a building access code? I locked myself out of my unit. What's the WiFi password?

These queries aren't complex. They don't require judgment or discretion. But they demand immediate attention, which means actual security concerns get buried under routine noise. A guest asking about towels at 2 AM interrupts an officer monitoring cameras or responding to an actual incident.

The solution seemed obvious: automate the routine traffic. Let humans focus on real security work. But voice automation in a real operational environment isn't straightforward. Most voice demos work in controlled conditions with clean audio and cooperative users. Actual deployment means dealing with background noise, spotty WiFi, people who don't follow prompts, and systems that need to run reliably for hours without human intervention.

## System Overview

TidesOS is a voice-first agent designed for overnight residential operations. Guests interact with it naturally through speech. The system transcribes their question, analyzes intent, generates a contextually appropriate response, and delivers it back as synthesized voice, all in under 2 seconds.

The interface itself is deliberately minimal. A single button in the center of the screen. Tap to record, tap again to stop. While recording, the system shows live transcription so users know they're being heard. When the AI responds, the text displays on screen while the voice plays back. All previous exchanges stay visible in a scrollable log.

## Technical Deep Dive: Audio Processing Pipeline

The hardest part of building a production voice interface isn't the AI integration. It's getting reliable audio capture across different browsers and devices, especially mobile.

I started with the Web Audio API because it gives low-level control over the audio stream. Here's the flow:

1. **Persistent Microphone Access:** Request microphone permission once on page load and keep the MediaStream alive throughout the session. This avoids iOS Safari's notorious permission re-prompting issues.

2. **Real-time Buffer Capture:** [Connect the microphone stream to a ScriptProcessorNode with a 4096-sample buffer size.](case1-4096-audio-buffer.md) Every time the buffer fills, copy the audio data into a Float32Array and accumulate it.

3. **Custom WAV Encoding:** [When recording stops, concatenate all accumulated buffers into a single Float32Array, then convert to WAV format manually.](case2-manual-wav-encoding.md) This involves creating the WAV header (44 bytes) and converting Float32 samples to 16-bit PCM integers. The MediaRecorder API would be simpler, but it's less reliable across browsers and gives you less control over the output format.

4. **Network Transmission:** Package the WAV blob into FormData along with session metadata (UUID, company context, persona type) and POST it to the N8N webhook.

The state machine has five phases: idle, recording, processing, playing, and error. Each phase has distinct visual feedback (color-coded UI, animations, status text) so users always know what's happening.

## Session Management and Context

Voice agents need memory. If someone asks "Can I access the gym?" and the agent says "Yes, it's on the 3rd floor," the next question might be "What are the hours?" The system needs to know that "the hours" refers to the gym, not some other facility.

This is handled through UUID-based session tracking. Every new visitor gets a unique session ID generated client-side. All subsequent requests include this ID, allowing the N8N workflow to maintain conversation history in Supabase. The GPT-4o prompt receives the full conversation context, enabling natural follow-up questions.

The system also passes company and persona parameters. This tells the AI whether to respond as Tides security staff (factual, protocol-focused) or some other role. Different properties could deploy the same codebase with different operational rules just by changing these parameters.

## Bilingual Support

The property serves a largely bilingual population. Guests speak Rioplatense Spanish (Argentine dialect) or English, often mixing both in a single interaction. The system detects the input language automatically through Whisper's transcription and responds in kind. No explicit language selection needed.

This works because the OpenAI TTS models support dialect-specific voice synthesis. The Spanish responses don't sound like generic "neutral Spanish" but rather match the local dialect patterns guests expect.

## Error Handling and Network Resilience

Voice interfaces fail in interesting ways. Network requests drop. Audio contexts get suspended by mobile browsers. Users close tabs mid-recording. Microphone permissions get revoked.

The system handles this through multiple layers:

- **Network Layer:** [Exponential backoff retry logic.](case3-exponential-backoff.md) If a request to N8N fails, wait 1 second and retry. If that fails, wait 2 seconds. Then 4 seconds. After three failures, surface a user-facing error. This handles temporary network hiccups without bothering the user.

- **Audio Layer:** If the microphone stream dies (user revoked permission, hardware error, etc.), catch the error and attempt to re-acquire the stream automatically. If that fails, show a clear error message explaining what happened and how to fix it.

- **State Layer:** The state machine uses refs instead of state for time-sensitive flags like "currently recording." This prevents race conditions where React's async state updates could cause recording to continue after the user stops.

- **Recovery Flows:** Every error state includes a dismiss action that resets the system to idle. Dismissing an error also attempts to pre-acquire a fresh microphone stream so the next interaction starts cleanly.

In field testing, this architecture achieved a 99%+ success rate even with spotty lobby WiFi.

## Cross-Browser Compatibility

Building for iOS Safari is its own special challenge. Safari doesn't support some audio APIs the same way Chrome does. It requires user gestures to resume audio contexts. It aggressively revokes microphone permissions between interactions if you're not careful.

[The solution: Detect vendor-prefixed APIs and fall back automatically, tie audio context resume calls to user interactions, never release the MediaStream between recordings,](case7-persistent-mediastream.md) and use touch-optimized button sizes (160x160px) to ensure reliable mobile taps. The same codebase runs on iOS Safari, Android Chrome, desktop Chrome/Firefox/Edge without conditional logic.

## Security Hardening

The system runs in a production environment with real guest data, so security isn't optional.

**Authentication:** [The demo is gated behind cookie-based authentication using Next.js Edge Middleware.](case5-edge-middleware-auth.md) Access requires a URL parameter key that sets an httpOnly cookie with a 7-day TTL. Edge middleware intercepts every request and validates the cookie before serving protected routes.

**HTTP Headers:** Standard OWASP protections are configured at the Next.js level: X-Content-Type-Options: nosniff prevents MIME confusion attacks, X-Frame-Options: DENY blocks clickjacking, X-XSS-Protection: 1; mode=block enables browser XSS filters, Strict-Transport-Security enforces HTTPS, and Permissions-Policy locks down camera/geolocation while allowing microphone.

**Data Handling:** Audio files never persist on disk. They're processed in memory and discarded immediately. Session data in Supabase uses row-level security policies. All communication happens over HTTPS with TLS 1.3.

## UI and Operational Design

The interface draws from industrial hardware aesthetics. Slate gray backgrounds, amber accents, monospace typography, scanline overlays. The goal was to look like operational equipment, not a consumer app.

The main interaction element is a large circular button that mimics a physical push-to-talk device. Different states have distinct colors: Idle (gray with subtle amber glow), Recording (bright red with pulsing animation), Processing (amber with rotating spinner), Playing (amber with waveform visualization), and Error (red with alert icon).

When recording, live transcription appears in a frosted glass card above the button. This provides immediate feedback that the system is capturing audio correctly. After the AI responds, the message displays in a similar card while the audio plays. All interactions get logged in a persistent chat history visible on desktop screens (toggleable on mobile).

## Performance Characteristics

**Latency:** [From the moment recording stops to the moment audio playback begins averages 1.8 seconds.](case6-interaction-speed.md) This breaks down as: Network upload (WAV file) ~200ms, Whisper transcription ~400ms, GPT-4o reasoning ~800ms, TTS generation ~300ms, Network download (audio blob) ~100ms, Audio decode + playback start ~200ms.

- **Audio Quality:** 44.1kHz sample rate at 16-bit depth (CD quality, overkill for voice, but eliminates any quality concerns)

- **Reliability:** [99.2% success rate in field testing](case9-success-rate.md) across 500+ interactions with varying network conditions, device types, and user behaviors

- **Browser Support:** Works on iOS Safari 14+, Chrome 90+, Firefox 88+, Edge 90+ (covers 95%+ of modern device combinations)

## Deployment and Infrastructure

The application runs on Vercel's edge network. Static assets get served from the CDN. Next.js middleware executes at edge locations globally for sub-10ms authentication checks. The React app itself uses Next.js 15's App Router with server components where possible.

N8N runs as a self-hosted workflow engine on a separate server. This handles the orchestration between Whisper, GPT-4o, and TTS. Keeping orchestration separate from the frontend means I can modify the AI pipeline without redeploying the interface.

Session data lives in Supabase (PostgreSQL with real-time subscriptions). Each session has a UUID primary key with associated metadata and message history. Row-level security ensures sessions are isolated from each other. The entire stack is stateless from the frontend's perspective.

## Real-World Performance

I deployed TidesOS at Tides Residential in Miami where I work night operations. The property has about 800 units across two towers. Overnight, the security desk typically handles 50-100 guest interactions per shift. Most are routine questions about access codes, amenities, or building services.

In the first week of deployment:

- **120 total interactions** handled by the voice agent

- [0 escalations to human security staff (all queries resolved autonomously)](case10-zero-escalations.md)

- **Average interaction time: 47 seconds** (compared to 3-5 minutes for human-handled queries)

- **Guest satisfaction:** No complaints (measured by zero follow-up calls to the desk)

The system successfully handled edge cases like background noise (lobby music, other guests talking), accented English (Spanish speakers, European guests), code-switching between English and Spanish mid-conversation, and vague questions ("How do I get in?") that required disambiguation.

## What I Learned

- **Voice interfaces need to show what they're thinking:** [Silent processing feels broken.](case8-end-to-end-latency.md) Users need constant feedback about what state the system is in. Live transcription during recording, visual spinners during processing, and synchronized text during playback all contribute to the perception of responsiveness.

- **Mobile Safari is the final boss:** If it works on iOS Safari, it'll work everywhere. The combination of aggressive resource management, strict permission models, and quirky audio API behavior makes Safari the hardest target. But solving for Safari makes the system more robust overall.

- **Context is everything for voice agents:** Without session memory, every question has to be self-contained. Multi-turn conversations feel natural, but they require careful architecture.

- **Network resilience isn't optional:** In a perfect world with perfect WiFi, you don't need retry logic. In a hotel lobby at 2 AM with 30 guests streaming Netflix, network requests fail regularly. Exponential backoff retry makes the difference between a reliable system and one that randomly breaks.

- **Production reliability comes from handling errors you haven't seen yet:** Try/catch blocks everywhere, state validation before every transition, and null checks on every external resource.

## Technical Decisions and Trade-offs

### Why custom WAV encoding instead of MediaRecorder?

MediaRecorder is simpler but less reliable. Some browsers don't support it at all. Others support it but encode to formats that require server-side conversion. Building a custom encoder means I control the output format and can guarantee it works the same way everywhere.

### Why N8N instead of direct OpenAI API calls?

[Separation of concerns.](case4-decoupled-architecture.md) The frontend handles user interaction and audio processing. N8N handles AI orchestration. This means I can modify the AI pipeline (swap GPT-4o for Claude, add RAG lookups, change TTS providers) without touching the frontend.

### Why persistent MediaStream instead of acquiring it per interaction?

iOS Safari. If you release the microphone stream and then try to re-acquire it, Safari often requires a fresh permission prompt. Keeping the stream alive between interactions bypasses this issue entirely.

## Why This Matters

Voice agents are having a moment. Everyone wants to build them. But most demos don't work in production. They break when network conditions degrade. They fail on mobile devices. They don't handle errors gracefully. They lack the operational polish required for real deployment.

TidesOS isn't a demo. It's running in production, handling real guest traffic, in an environment I can't control (residential building with unpredictable WiFi and users who don't follow prompts). The system needs to work reliably because there's no fallback other than interrupting human security staff. That constraint drove every technical decision. The result is a system that demonstrates what production-grade voice AI actually requires: not just API integration, but audio engineering, network resilience, cross-browser compatibility, error handling, security, and operational polish.

## Technical Specifications Summary

| Component | Technology |
|-----------|------------|
| Audio Capture | Web Audio API (MediaStream + ScriptProcessorNode) |
| Audio Encoding | Custom Float32Array → WAV converter |
| State Management | React Hooks (useState, useRef, useEffect) |
| Network Layer | Fetch API with exponential backoff |
| Orchestration | N8N self-hosted workflows |
| Speech Recognition | OpenAI Whisper API |
| Reasoning Engine | OpenAI GPT-4o |
| Voice Synthesis | OpenAI TTS HD |
| Session Storage | Supabase (PostgreSQL) |
| Authentication | Next.js Edge Middleware + httpOnly cookies |
| Deployment | Vercel Edge Network |
| Frontend | React 19 + Next.js 15 App Router |
| Language | TypeScript 5 (strict mode) |
| Animation | Framer Motion 12 |

## Performance Metrics

| Metric | Value |
|--------|-------|
| End-to-end latency | 1.8s average |
| Success rate | 99.2% (500+ interactions) |
| Audio quality | 44.1kHz @ 16-bit |
| Browser coverage | 95%+ |
| Auth response time | <10ms |
| Network retry attempts | 3 (1s, 2s, 4s backoff) |
| Session persistence | 7 days |
| Error recovery time | <3s |
