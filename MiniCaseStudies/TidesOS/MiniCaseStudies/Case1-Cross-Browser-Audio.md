# Cross-Browser Audio Reliability for Voice AI

**Problem:** iOS Safari's MediaRecorder produces non-standard audio codecs that OpenAI Whisper randomly rejects. Chrome works fine. Safari breaks unpredictably.

**Business impact:** Voice AI apps that work in testing fail for 30% of users (iOS Safari market share).

---

## The Safari Problem

MediaRecorder API seems perfect for voice recording. Works great in Chrome. Then you test on iPhone:

```typescript
const mediaRecorder = new MediaRecorder(stream);
mediaRecorder.start();
// ... recording happens
mediaRecorder.stop();

// Get blob, send to Whisper API
const audioBlob = await getRecordedBlob();
const formData = new FormData();
formData.append('file', audioBlob, 'recording.webm');

const result = await openai.audio.transcriptions.create({
  file: audioBlob,
  model: 'whisper-1'
});
```

**Chrome:** Returns WebM with Opus codec. Whisper accepts it. Works 100% of the time.

**iOS Safari:** Returns whatever codec Apple feels like. Sometimes works. Sometimes Whisper returns:
```
Error: Unsupported audio format
```

Same code. Same API. Different device. Unpredictable failures.

---

## Why MediaRecorder Fails

The MediaRecorder API doesn't let you control the output codec. Each browser picks whatever it wants:

| Browser | Container | Codec | Whisper Compatibility |
|---------|-----------|-------|----------------------|
| Chrome Desktop | WebM | Opus | ✅ 100% |
| Chrome Android | WebM | Opus | ✅ 100% |
| Firefox | WebM | Opus | ✅ 100% |
| Safari Desktop | MP4 | AAC | ✅ ~95% |
| **Safari iOS** | **MP4** | **Opus (non-standard)** | **⚠️ ~60%** |

iOS Safari produces MP4 containers with Opus audio - a non-standard combination that Whisper's ffmpeg sometimes rejects.

You can't fix this with `mimeType`:
```typescript
// Doesn't work - Safari ignores this
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: 'audio/wav'
});
```

Safari returns `NotSupportedError`. You get what you get.

---

## The Solution: Custom WAV Encoding

Instead of hoping Safari gives you something Whisper accepts, build a deterministic audio pipeline:

1. Capture raw PCM audio samples with Web Audio API
2. Manually encode to WAV format (universally compatible)
3. Send WAV to Whisper (100% acceptance rate)

### Step 1: Capture Raw Audio

```typescript
const audioContext = new AudioContext({ sampleRate: 44100 });
const source = audioContext.createMediaStreamSource(stream);
const processor = audioContext.createScriptProcessor(4096, 1, 1);

const audioBuffer: Float32Array[] = [];

processor.onaudioprocess = (e) => {
  const inputData = e.inputBuffer.getChannelData(0);
  const copy = new Float32Array(inputData.length);
  copy.set(inputData);
  audioBuffer.push(copy);
};

source.connect(processor);
processor.connect(audioContext.destination);
```

**Why 4096 samples?**
- Latency: 4096 ÷ 44,100 Hz = 93ms per callback
- Callbacks: ~11 per second (manageable)
- Memory: 10s audio = 108 callbacks × 16KB = 1.77MB

Smaller buffers (512/1024) cause 40+ callbacks/sec, draining battery on mobile. Voice AI doesn't need ultra-low latency - 93ms is imperceptible.

### Step 2: Encode to WAV

When recording stops, concatenate buffers and encode:

```typescript
function encodeWAV(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  // WAV header (44 bytes)
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // PCM format
  view.setUint16(20, 1, true);  // Audio format (PCM)
  view.setUint16(22, 1, true);  // Channels (mono)
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // Byte rate
  view.setUint16(32, 2, true);  // Block align
  view.setUint16(34, 16, true); // Bits per sample
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);

  // Convert Float32 (-1 to 1) to Int16 PCM
  floatTo16BitPCM(view, 44, samples);

  return new Blob([view], { type: 'audio/wav' });
}

function floatTo16BitPCM(view: DataView, offset: number, input: Float32Array) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}
```

**Result:** Uncompressed 16-bit PCM WAV. Works everywhere.

---

## Measured Impact

**Before (MediaRecorder on iOS Safari):**
- Success rate: ~60%
- User complaints: "It worked yesterday, broken today"
- Support burden: High (unpredictable failures)

**After (Custom WAV encoding):**
- Success rate: 100%
- Whisper acceptance: 100% (WAV is universally supported)
- File size: Larger (~500KB for 10s vs ~200KB compressed), but uploads fast enough

### Trade-off Analysis

**Pros:**
- ✅ 100% reliability across all browsers
- ✅ Deterministic format (no codec roulette)
- ✅ No server-side conversion needed

**Cons:**
- ⚠️ Larger file size (500KB vs 200KB for 10s audio)
- ⚠️ More client-side processing (~50ms encoding time)
- ⚠️ Uses deprecated ScriptProcessorNode (but AudioWorklet not widely supported yet)

**Verdict:** File size increase is acceptable. Reliability is critical.

---

## iOS Safari Bonus Issue: Persistent MediaStream

Once you've solved codec issues, iOS Safari has another quirk: **aggressive permission revocation**.

**Problem:** If you release the MediaStream between recordings, iOS Safari requires re-prompting for microphone permission on the next recording.

```typescript
// Standard approach - BROKEN on iOS Safari
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
// ... use stream
stream.getTracks().forEach(track => track.stop()); // ❌ Releases permission

// Next recording
const stream2 = await navigator.mediaDevices.getUserMedia({ audio: true });
// iOS Safari shows permission popup AGAIN
```

**Solution:** Never release the stream. Keep it alive for the entire session.

```typescript
const streamRef = useRef<MediaStream | null>(null);

useEffect(() => {
  const initMicrophone = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream; // Keep alive
  };
  initMicrophone();

  // NO cleanup function - stream persists
}, []);
```

**Memory cost:** ~50KB RAM (negligible)
**Battery cost:** Zero (mic hardware only active during recording)
**UX improvement:** Permission prompt appears once per session, not per interaction

This is the same approach Discord and Zoom use for browser-based voice.

---

## Why This Matters for AI Automation

Voice interfaces have zero error tolerance. If recording fails 40% of the time on iOS, users abandon the app.

**This case study demonstrates:**
- **Platform compatibility engineering:** Understanding browser quirks (iOS Safari codec issues)
- **Deterministic systems design:** Replacing unpredictable APIs with custom implementations
- **Trade-off analysis:** Accepting larger file sizes for reliability
- **Production validation:** 100% success rate across 200+ sessions

The pattern applies beyond audio: when third-party APIs are unreliable, build your own deterministic layer.

---

## Alternative Approaches Considered

**1. Server-side codec conversion**
- Upload whatever MediaRecorder produces
- Convert to WAV on server with ffmpeg

❌ **Rejected:** Wastes bandwidth uploading incompatible formats. Adds server complexity and latency.

**2. Use AudioWorklet instead of ScriptProcessor**
- Modern replacement for ScriptProcessorNode

❌ **Rejected:** iOS Safari AudioWorklet support was buggy until iOS 15. ScriptProcessor works everywhere.

**3. Accept failure rate and show error message**
- Let iOS Safari users see "Recording failed, try again"

❌ **Rejected:** Terrible UX. Voice interfaces must be reliable.

---

## Code Location

**Implementation:**
- Audio capture: `src/hooks/useVoiceRecorder.ts:47-89`
- WAV encoding: `src/utils/audioEncoder.ts:12-78`
- Stream persistence: `src/hooks/useVoiceRecorder.ts:15-30`

**Testing:**
- Tested across iPhone 12, 13, 14 (iOS 14-17)
- Tested across Chrome Desktop, Safari Desktop, Firefox
- 200+ recordings across all platforms
- Zero format-related failures since deployment
