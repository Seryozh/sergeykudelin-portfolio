# TidesOS: Voice-First Operational Interface - Technical Overview

## Project Summary

TidesOS is a 24/7 voice AI kiosk deployed in a production hotel lobby for overnight operations. Guests walk up to a touchscreen kiosk, press a button, ask questions ("Where are the pool towels?" "What's the WiFi password?" "Can you give me a building access code?"), and receive instant voice responses. The system handles routine inquiries autonomously, allowing security staff to focus on actual security work rather than answering repetitive questions.

The system processes 500+ production sessions with bilingual support (English and Rioplatense Spanish) using automatic language detection. All audio processing happens client-side in the browser using Web Audio API, with OpenAI Whisper for speech recognition, GPT-4o for reasoning, and OpenAI TTS for voice synthesis.

## Core Architecture

**Frontend:** React 19 + Next.js 15
**Audio Processing:** Web Audio API (custom WAV encoding)
**Speech Recognition:** OpenAI Whisper
**Reasoning:** OpenAI GPT-4o
**Voice Synthesis:** OpenAI TTS HD
**Orchestration:** N8N self-hosted workflows
**Session Storage:** Supabase PostgreSQL
**Deployment:** Vercel Edge Network

The system emphasizes deterministic reliability in a hostile network environment (hotel lobby WiFi with 30+ concurrent guests, 5-10% packet loss, 500-2000ms latency spikes).

## Technical Achievements

### Deterministic Reliability

**Cross-Browser Audio Reliability (100% success rate across all browsers)**
- Problem: iOS Safari's MediaRecorder API produces non-standard audio codecs that OpenAI Whisper randomly rejects (Chrome: 100% success, Safari: 60% success on same audio)
- Solution: Bypassed MediaRecorder entirely, built custom WAV encoder using Web Audio API's ScriptProcessorNode to capture raw PCM audio, manually constructed WAV headers and converted Float32 samples to 16-bit PCM
- Additional: Implemented persistent MediaStream pattern to avoid iOS Safari's aggressive microphone permission revocation
- Result: 100% reliability across all browsers and devices, zero codec-related failures in 500+ production sessions

**Network Resilience via Exponential Backoff (18% → 1.5% failure rate)**
- Problem: Hotel lobby WiFi is hostile environment with 30+ guests streaming Netflix, 5-10% packet loss, 500-2000ms latency spikes; without retry logic, 15-18% of voice requests failed on first attempt, forcing manual retries
- Solution: Implemented exponential backoff retry with 1s, 2s, 4s delays and intelligent retry logic (retry 5xx server errors, skip 4xx client errors); total 7-second retry window fits within user patience threshold
- Result: User-visible failure rate dropped from 18% to 1.5%, users perceive transient failures as "loading" rather than errors, no manual retries needed

## Production Metrics

- **Total Production Sessions:** 500+
- **Uptime:** 24/7 deployment in production hotel
- **Languages Supported:** English, Rioplatense Spanish (automatic detection)
- **Reliability:** 98.5% success rate in hostile network environment
- **Browser Support:** 100% reliability across Chrome, Safari, Firefox, Edge
- **Codec Failures:** 0 (after custom WAV encoder implementation)

## Key Engineering Patterns Applied

1. **Custom Audio Codec Engineering** - Manual WAV header construction and PCM conversion for cross-browser compatibility
2. **Exponential Backoff (AWS SDK pattern)** - Intelligent retry logic with transient vs permanent error detection
3. **Persistent Resource Management** - MediaStream persistence to avoid iOS permission revocation
4. **Progressive Web App (PWA)** - No app store, instant deployment via URL

## Resume-Relevant Highlights

- Deployed 24/7 production voice AI system serving real hotel guests with 98.5% reliability
- Solved cross-browser audio compatibility by building custom WAV encoder bypassing browser MediaRecorder APIs
- Achieved 100% reliability across all browsers (Chrome, Safari, Firefox, Edge) in production
- Reduced failure rate from 18% to 1.5% in hostile network environment through exponential backoff
- Implemented zero-installation PWA for instant deployment without app store friction
- Built bilingual support (English/Spanish) with automatic language detection
