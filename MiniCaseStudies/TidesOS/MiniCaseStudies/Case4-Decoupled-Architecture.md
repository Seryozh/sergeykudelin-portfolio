# Case Study: Decoupled AI Orchestration with n8n

Traditional voice AI architectures tightly couple frontend and AI logic. API keys live in the frontend bundle, model names are hardcoded in React components, and changing from GPT-4o to GPT-4o-mini requires a full redeployment. Non-technical team members can't update conversational prompts without engineering involvement.

I wanted to avoid this. The frontend should be a "dumb shell" that captures audio and plays responses. All intelligence—Whisper transcription, GPT-4o reasoning, TTS generation, prompt engineering—should live in a separate orchestration layer.

## Architecture

The frontend does four things:
1. Captures audio (Web Audio API)
2. Uploads WAV to n8n webhook
3. Receives audio response
4. Plays audio

That's it. No OpenAI SDK. No API keys. No prompt strings. The entire AI pipeline lives in n8n.

```
Frontend (Next.js + React)
  - Capture audio
  - Encode to WAV (44-byte header)
  - POST to n8n webhook
  - Play response audio

        ↓ Single HTTP POST ↓

n8n Workflow (Self-Hosted)
  1. Receive WAV via webhook
  2. Call OpenAI Whisper API (STT)
  3. Call GPT-4o with system prompt
  4. Call OpenAI TTS API
  5. Return audio blob + headers
```

## Implementation

**Location:** `app/tidesos/page.tsx:57, 286-302`

```typescript
const N8N_WEBHOOK_URL = 'https://sergeykudelin.app.n8n.cloud/webhook/chat';

const formData = new FormData();
formData.append('audio', audioBlob, 'voice_input.wav');
formData.append('company', 'TidesOS');
formData.append('agent_persona', 'tides');
formData.append('session_id', sessionIdRef.current);

const response = await fetch(N8N_WEBHOOK_URL, {
  method: 'POST',
  body: formData,
});
```

What's NOT in the frontend:
- No `import { OpenAI } from 'openai'`
- No API keys
- No model names
- No prompt engineering
- No retry logic for OpenAI APIs

What IS in the frontend:
- Audio capture and encoding
- Network retry (exponential backoff for the webhook call)
- Audio playback
- UI state management

## Why n8n?

**Rapid iteration:** Switching from GPT-4o to GPT-4o-mini takes 2 minutes in n8n (open workflow, change dropdown, save). With a monolithic architecture, it takes 20-30 minutes (update code, test, build, deploy to Vercel, verify).

**Security:** API keys never touch the frontend. They're stored in n8n's environment. Client-side API keys can be extracted from browser DevTools, allowing anyone to steal and abuse OpenAI credits.

**Non-technical prompt updates:** Product managers and operations staff can modify system prompts through n8n's visual editor. No code changes required.

**Independent testing:** I can test the AI pipeline in n8n's UI without running the frontend. Upload a test WAV file, click "Execute Workflow," see the Whisper transcript, GPT-4o response, and TTS audio—all without touching React.

## n8n Workflow (Simplified)

```
1. Webhook Trigger
   ↓
2. Whisper API
   Model: whisper-1
   Input: WAV file
   Output: text transcript
   ↓
3. GPT-4o
   Model: gpt-4o
   System prompt: "You are the overnight concierge..."
   Input: transcript + session history
   Output: response text
   ↓
4. TTS API
   Model: tts-1-hd
   Voice: alloy
   Output: audio blob (MP3)
   ↓
5. Return Response
   Headers: x-user-transcript, x-ai-message
   Body: audio blob
```

The system prompt lives in n8n, not the React codebase. Non-technical staff can update it via the visual editor. For example, adding Spanish language support requires editing one text field in n8n, not changing code.

## Benefits

**1. Security (API Keys Hidden)**

Before: API key in environment variable, visible in browser
```typescript
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY  // Exposed to client
});
```

After: No API keys in frontend
```typescript
const response = await fetch(N8N_WEBHOOK_URL, {...});
```

**2. Rapid AI Updates**

Scenario: Switch GPT-4o to GPT-4o-mini for cost savings

Before (monolithic):
1. Update React code: `model: 'gpt-4o-mini'`
2. Run tests
3. Build Next.js bundle
4. Deploy to Vercel
5. Wait 3-5 minutes for deployment

Total: 20-30 minutes

After (decoupled):
1. Open n8n workflow
2. Click GPT-4o node
3. Change dropdown: `gpt-4o` → `gpt-4o-mini`
4. Click "Execute Workflow" to test
5. Save

Total: 2 minutes

**3. Multi-Tenant Flexibility**

The frontend sends metadata (company, persona), but n8n decides what to do with it:

```typescript
formData.append('company', 'TidesOS');
formData.append('agent_persona', 'tides');
```

In n8n:
```
If company === 'TidesOS' → Use concierge prompt
If company === 'OtherClient' → Use different prompt
```

One workflow can serve multiple clients with different conversational behaviors.

**4. Response Headers for Context**

Audio responses (body) can't include text metadata. I use headers to pass the transcript and AI response text back to the frontend for logging:

```typescript
const encodedUserText = response.headers.get('x-user-transcript');
const encodedAiText = response.headers.get('x-ai-message');

if (encodedUserText) {
  userText = decodeURIComponent(encodedUserText);
}
```

This lets the UI display the conversation text alongside the audio playback.

## Trade-offs

**Hardcoded webhook URL:** If the n8n URL changes, I need to redeploy the frontend. For a production system with multiple environments (dev/staging/prod), using an environment variable would be better. For a single deployment, hardcoding is fine.

**No webhook authentication:** Anyone with the URL can POST to the webhook. For a kiosk in a controlled environment, this is acceptable. For a public deployment, adding an `Authorization` header would prevent abuse.

**Dependency on n8n uptime:** If n8n crashes, the entire AI pipeline fails. The mitigation is running n8n on reliable infrastructure (in this case, n8n Cloud).

**Network latency overhead:** There's an extra hop (Frontend → n8n → OpenAI) compared to calling OpenAI directly. In practice, the overhead is minimal (~50-100ms for n8n processing).

## Real-World Impact

During development, I changed the system prompt multiple times to tune conversational tone. With the decoupled architecture, each iteration took ~2 minutes (edit in n8n, test, save). If the prompt had been hardcoded in React, each iteration would have required code changes, builds, and deployments—at least 30 minutes per iteration.

The decoupled architecture also made it trivial to experiment with different models. I tested GPT-4o-mini for cost savings by changing a single dropdown in n8n. No frontend changes required.

Keeping API keys out of the frontend eliminated the risk of credential exposure. The system prompt and conversational logic are hidden in the n8n workflow, not visible in the browser's source code.

## Version Flexibility

Switching models is a single dropdown change:
- Whisper: `whisper-1` → future `whisper-2`
- GPT: `gpt-4o` → `gpt-4.5` or `gpt-5`
- TTS: `tts-1-hd` → future `tts-2`

No frontend changes required. React code has zero model references.

## What Could Be Better

**No versioning:** The webhook URL is `/webhook/chat` with no version prefix. If I needed to make breaking changes to the n8n workflow, I'd break old frontend versions. A versioned API (`/webhook/v1/chat`) would allow backward compatibility. For a single deployment, this adds complexity without much benefit.

**Session management:** The frontend generates session UUIDs (`crypto.randomUUID()`), and n8n manages session history. This is a clean separation of concerns, but it means session state lives in two places (frontend for identity, backend for history).

The decoupled architecture enabled rapid iteration, secured credentials, and made prompt engineering accessible to non-developers. It's the foundation that makes TidesOS practical to maintain and evolve.
