# TidesOS NightOps Agent
**Voice-First Concierge for Residential Operations**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20TidesOS-amber?style=for-the-badge)](https://sergeykudelin.com/tidesos)

---

## The Problem

Overnight operations at large residential complexes are defined by volume and repetition. Security teams get overwhelmed by hundreds of identical queries about keys, towels, and access codes. This buries actual security incidents under noise.

## The Solution

**TidesOS** is an autonomous voice firewall deployed at Tides Residential. It handles the initial operational traffic from 10 PM to 6 AM. This allows human security teams to focus on high-priority physical threats.

It enforces strict property protocols by distinguishing between operational tasks (Security) and hospitality requests (Caretaker) in real-time.

## Capabilities

**Fast Voice Interface:** Built for speed. Users speak naturally and the agent responds instantly in English or Rioplatense Spanish (mirroring the user's dialect).

**Contextual Memory:** Maintains state across long conversations. It remembers apartment numbers, names, and intent.

**Operational Firewall:** Automatically filters requests. It grants building access when appropriate but strictly denies unit access. It redirects guests to the correct third-party workflows for private issues.

**Production Ready:** Deployed in a live, high-traffic environment handling real-world acoustic conditions and ambiguous user intents.

## Tech Stack

**Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS

**Orchestration:** n8n (Self-Hosted Workflow Engine)

**Intelligence:** OpenAI GPT-4o (Reasoning) + Whisper (STT) + HD TTS

**Infrastructure:** Supabase, Vercel

## Setup

```bash
# Clone the repository
git clone https://github.com/Seryozh/tides-concierge.git

# Install dependencies
npm install

# Run the agent locally
npm run dev
```

## About

Built by [Sergey Kudelin](https://github.com/Seryozh). I build autonomous systems for high-pressure environments.

---

**Note:** This is a production system deployed in a live operational environment.
