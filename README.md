# TidesOS NightOps Agent

> **A Voice-First Concierge That Runs an Apartment Complex Overnight**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20TidesOS-amber?style=for-the-badge)](https://tidesos.vercel.app/tidesos)

---

## The Problem

Running overnight operations at a residential property is brutal. You're fielding the same questions hundreds of times: "How do I get into the building?" "Can you give me towels?" "My key doesn't work." Meanwhile, actual security issues get buried under noise.

The traditional solution is hiring more staff. The smarter solution is building a system that handles the chaos so humans can focus on what matters.

## The Solution

**TidesOS** is a voice-first AI concierge deployed at Tides Residential (Buildings 3801 & 3901). It acts as an intelligent operational firewall, instantly distinguishing between requests the security team can actually handle and those that need to be routed elsewhere.

### What It Does

- **Speaks naturally** in English and Rioplatense Spanish, automatically detecting and mirroring the user's language
- **Remembers context** across the conversation (apartment numbers, names, previous requests)
- **Filters requests** by identifying what security can resolve vs. what needs escalation
- **Handles high-stress scenarios** with robust error recovery and auto-retry logic

### The Architecture

TidesOS uses a unique "Smuggler" pattern to ensure instant audio playback while preserving full conversation history:

```
User speaks → Audio captured as WAV
              ↓
           Sent to n8n webhook (Multipart Form Data)
              ↓
           Transcribed (Whisper API)
              ↓
           Reasoned (GPT-4o Mini)
              ↓
           Speech generated (OpenAI TTS)
              ↓
           Binary audio returned to frontend
              ↓
           Text "smuggled" in HTTP headers (x-user-transcript, x-ai-message)
              ↓
           Frontend plays audio instantly + updates chat history
```

**Why "Smuggler"?**
Returning audio as a binary response gives instant playback. But we still need the text for conversation history. Solution: encode the transcription and AI response into custom HTTP headers. The frontend gets both speed and memory without parsing delays.

## Operational Logic

TidesOS is programmed with strict protocols that mirror real-world security workflows:

### The Airbnb Firewall
The AI politely refuses requests for:
- Housekeeping (towels, soap, cleaning)
- Internal maintenance issues
- Amenity reservations

These are **Caretaker Tasks**, not security tasks. Guests are directed to contact their host.

### Access Control
The AI distinguishes between two types of access:

**Building Access (Lobby/Elevator):**
Security CAN remotely unlock these. The AI collects apartment numbers and coordinates with the guard.

**Unit Access (Apartment Door):**
Security CANNOT unlock these. The AI instructs users to check their email confirmation or call their host for the access code.

### Parking Protocol
For guest parking requests, TidesOS walks users through the exact workflow:
1. Valet parks the vehicle
2. User receives a white or yellow paper receipt
3. Leasing office (9 AM - 5 PM) exchanges it for a fob/tag
4. Valet retrieves the vehicle when needed

## Setup

### Prerequisites
- Node.js 18+
- n8n instance (self-hosted or cloud)
- OpenAI API access (Whisper, GPT-4o, TTS)

### Installation

```bash
# Clone the repository
git clone https://github.com/Seryozh/tides-concierge.git
cd tides-concierge

# Install dependencies
npm install

# Set environment variable
echo "NEXT_PUBLIC_N8N_WEBHOOK_URL=your_n8n_webhook_url" > .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000/tidesos](http://localhost:3000/tidesos) to access the agent.

### n8n Workflow Configuration

Your n8n workflow should:
1. Accept multipart form data (audio file + metadata)
2. Transcribe audio using OpenAI Whisper
3. Maintain session memory (use a sliding window buffer tied to `session_id`)
4. Generate responses using GPT-4o Mini with the operational protocols
5. Convert response to speech using OpenAI TTS
6. Return binary audio with text smuggled in headers:
   - `x-user-transcript`: URL-encoded user transcription
   - `x-ai-message`: URL-encoded AI response text

## Tech Stack

- **Frontend:** React + TypeScript
- **Workflow Engine:** n8n
- **AI Models:** OpenAI (Whisper, GPT-4o Mini, TTS)
- **Audio Processing:** Web Audio API + custom WAV encoding

## Live Demo

Try the live deployment: [TidesOS](https://tidesos.vercel.app/tidesos)

## About

Built by [Sergey Kudelin](https://github.com/Seryozh) — an AI automation engineer who builds digital employees that handle real-world chaos.

---

**Note:** This is a production system deployed in a live operational environment. The codebase prioritizes reliability and real-world robustness over demo aesthetics.
