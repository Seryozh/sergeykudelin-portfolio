'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// SpeechRecognition types
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export default function TidesOSPage() {
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'playing' | 'error'>('idle');
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [history, setHistory] = useState<any[]>([]);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const isRecordingRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const [hasMicPermission, setHasMicPermission] = useState(false);

  // Web Audio API refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);
  const audioBuffersRef = useRef<Float32Array[]>([]);

  const N8N_WEBHOOK_URL = 'https://sergeykudelin.app.n8n.cloud/webhook/voice-agent';

  // Request mic permission on page load and KEEP the stream alive
  useEffect(() => {
    const initMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        setHasMicPermission(true);
        console.log('[DEBUG] Microphone stream initialized and kept alive');
      } catch (err) {
        console.log('[DEBUG] Microphone permission denied:', err);
        setHasMicPermission(false);
      }
    };

    initMicrophone();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            interimTranscript += event.results[i][0].transcript;
          }
          setTranscript(interimTranscript);
        };

        recognition.onerror = (event) => {
          console.log('Speech recognition error:', event.error);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Toggle recording - tap to start, tap again to stop
  const handleButtonClick = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('[DEBUG] handleButtonClick, current status:', status);

    if (status === 'recording') {
      stopRecording();
      return;
    }

    if (status === 'processing' || status === 'playing') {
      return;
    }

    await startRecording();
  };

  // Helper function to convert Float32Array to WAV format
  const encodeWAV = (samples: Float32Array, sampleRate: number): Blob => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, samples.length * 2, true);

    let offset = 44;
    for (let i = 0; i < samples.length; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      offset += 2;
    }

    return new Blob([buffer], { type: 'audio/wav' });
  };

  const startRecording = async () => {
    setStatus('recording');
    isRecordingRef.current = true;

    setTranscript('');
    setAiResponse('');
    setErrorMessage('');
    audioBuffersRef.current = [];

    audioElementRef.current = new Audio();
    console.log('[DEBUG] Fresh audio element created for this session');

    try {
      let stream = streamRef.current;
      if (!stream || stream.getTracks().some(t => t.readyState === 'ended')) {
        console.log('[DEBUG] Getting new microphone stream');
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
      } else {
        console.log('[DEBUG] Using persistent microphone stream');
      }

      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
        console.log('[DEBUG] Created new AudioContext');
      }

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
        console.log('[DEBUG] Resumed AudioContext');
      }

      sourceNodeRef.current = audioContextRef.current.createMediaStreamSource(stream);

      const bufferSize = 4096;
      processorNodeRef.current = audioContextRef.current.createScriptProcessor(bufferSize, 1, 1);

      processorNodeRef.current.onaudioprocess = (e) => {
        if (isRecordingRef.current) {
          const inputData = e.inputBuffer.getChannelData(0);
          audioBuffersRef.current.push(new Float32Array(inputData));
        }
      };

      sourceNodeRef.current.connect(processorNodeRef.current);
      processorNodeRef.current.connect(audioContextRef.current.destination);

      console.log('[DEBUG] Web Audio API recording started');

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Already started or not supported
        }
      }
    } catch (err) {
      isRecordingRef.current = false;
      const errorMsg = err instanceof Error ? err.message : 'Microphone access denied';
      setErrorMessage(`Mic Error: ${errorMsg}`);
      setStatus('error');
    }
  };

  const stopRecording = () => {
    console.log('[DEBUG] stopRecording called');
    isRecordingRef.current = false;

    if (processorNodeRef.current) {
      processorNodeRef.current.disconnect();
      processorNodeRef.current = null;
    }

    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Already stopped
      }
    }

    setStatus('processing');
    sendAudioToN8N();
  };

  const sendAudioToN8N = async () => {
    const totalLength = audioBuffersRef.current.reduce((acc, buf) => acc + buf.length, 0);
    const combinedBuffer = new Float32Array(totalLength);
    let offset = 0;
    for (const buffer of audioBuffersRef.current) {
      combinedBuffer.set(buffer, offset);
      offset += buffer.length;
    }

    console.log('[DEBUG] Total audio samples:', totalLength);

    if (totalLength === 0) {
      setErrorMessage('No audio recorded. Please try again.');
      setStatus('error');
      return;
    }

    const sampleRate = audioContextRef.current?.sampleRate || 44100;
    const audioBlob = encodeWAV(combinedBuffer, sampleRate);
    console.log('[DEBUG] WAV blob size:', audioBlob.size, 'bytes');

    const recentHistory = history.slice(-6);

    const formData = new FormData();
    formData.append('audio', audioBlob, 'voice_input.wav');
    formData.append('company', 'TidesOS');
    formData.append('agent_persona', 'tides');
    formData.append('history', JSON.stringify(recentHistory));

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      console.log('[DEBUG] Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[DEBUG] Response data:', data);

      if (data.text) {
        setAiResponse(data.text);
      }

      if (data.text && data.userTranscript) {
        setHistory(prev => [
          ...prev,
          { role: 'user', content: data.userTranscript },
          { role: 'assistant', content: data.text },
        ]);
      }

      if (data.audio) {
        const audioSource = `data:audio/mpeg;base64,${data.audio}`;
        const audio = audioElementRef.current || new Audio();
        audio.src = audioSource;

        audio.onerror = (e) => {
          console.error('[DEBUG] Audio playback error:', e);
          setErrorMessage('Audio playback failed');
          setStatus('error');
        };

        audio.onended = async () => {
          try {
            const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = newStream;
            console.log('[DEBUG] New mic stream acquired after audio playback');
          } catch (e) {
            console.log('[DEBUG] Could not preemptively acquire mic stream:', e);
          }

          setStatus('idle');
          setTimeout(() => setAiResponse(''), 3000);
        };

        setStatus('playing');
        setTranscript('');

        try {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch((e) => {
              console.error('[DEBUG] Audio play() failed:', e);
              setErrorMessage('Audio playback blocked. Try using PC.');
              setStatus('error');
            });
          }
        } catch (e) {
          console.error('[DEBUG] Audio play error:', e);
          setErrorMessage('Audio playback failed');
          setStatus('error');
        }
      } else {
        console.warn('[DEBUG] No audio in response');
        setStatus('idle');
      }
    } catch (error) {
      console.error('[DEBUG] Fetch error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setErrorMessage(`${errorMsg}`);
      setStatus('error');
    }
  };

  const dismissError = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = newStream;
      console.log('[DEBUG] New mic stream acquired after dismissing error');
    } catch (e) {
      console.log('[DEBUG] Could not acquire mic stream:', e);
    }

    setStatus('idle');
    setErrorMessage('');
  };

  const getButtonGlow = () => {
    switch (status) {
      case 'recording':
        return '0 0 40px rgba(239, 68, 68, 0.8), 0 0 80px rgba(239, 68, 68, 0.4)';
      case 'processing':
      case 'playing':
        return '0 0 40px rgba(245, 158, 11, 0.8), 0 0 80px rgba(245, 158, 11, 0.4)';
      case 'error':
        return '0 0 40px rgba(239, 68, 68, 0.6), 0 0 60px rgba(239, 68, 68, 0.3)';
      default:
        return '0 0 20px rgba(245, 158, 11, 0.3), 0 0 40px rgba(245, 158, 11, 0.1)';
    }
  };

  const getButtonBg = () => {
    switch (status) {
      case 'recording':
        return 'radial-gradient(circle at 40% 35%, #dc2626, #991b1b)';
      case 'processing':
      case 'playing':
        return 'radial-gradient(circle at 40% 35%, #f59e0b, #b45309)';
      case 'error':
        return 'radial-gradient(circle at 40% 35%, #ef4444, #7f1d1d)';
      default:
        return 'radial-gradient(circle at 40% 35%, #374151, #1f2937)';
    }
  };

  const statusText = {
    idle: '[ READY ]',
    recording: '[ REC ● ]',
    processing: '[ PROCESSING... ]',
    playing: '[ TRANSMITTING ]',
    error: '[ ERROR ]',
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4 overflow-hidden font-mono">
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
        }}
      />

      {/* System Status Box - Top Left */}
      <div className="absolute top-4 left-4 z-20">
        <div className="border border-amber-500/30 bg-slate-900/80 rounded px-3 py-2 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-amber-500/80 text-[10px] uppercase tracking-widest">System Status</span>
          </div>
          <div className="text-amber-500/60 text-[11px] leading-relaxed">
            <div>SHIFT: <span className="text-amber-400">OVERNIGHT</span></div>
            <div>ZONE: <span className="text-amber-400">3801/3901</span></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 right-0 left-0 text-center z-10"
      >
        <div className="inline-block border border-amber-500/20 bg-slate-900/60 rounded px-6 py-3 backdrop-blur-sm">
          <h1 className="text-xl font-mono font-bold text-amber-500 tracking-[0.2em] uppercase">
            TidesOS v2.4
          </h1>
          <div className="w-12 h-px bg-amber-500/40 mx-auto mt-2" />
          <p className="text-amber-500/50 text-xs uppercase tracking-[0.25em] mt-2 font-mono">
            NightOps Agent
          </p>
        </div>
      </motion.div>

      {/* Live User Transcript */}
      <AnimatePresence mode="wait">
        {status === 'recording' && transcript && (
          <motion.div
            key="user-transcript"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-36 max-w-md text-center z-10 px-4"
          >
            <div className="border border-amber-500/20 bg-slate-900/80 rounded px-4 py-3 backdrop-blur-sm">
              <p className="text-amber-100/80 text-sm font-mono">
                &gt; {transcript}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Button */}
      <div className="relative flex items-center justify-center">
        {/* Outer pulse ring */}
        <AnimatePresence>
          {status === 'recording' && (
            <motion.div
              className="absolute w-52 h-52 rounded-full border-2 border-red-500/40"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(status === 'processing' || status === 'playing') && (
            <motion.div
              className="absolute w-52 h-52 rounded-full border-2 border-amber-500/40"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0, 0.4] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        {/* Main Button - Tactile physical button look */}
        <motion.button
          onClick={handleButtonClick}
          className="relative z-10 w-40 h-40 rounded-full cursor-pointer focus:outline-none border-4 border-slate-700/80"
          style={{
            background: getButtonBg(),
            boxShadow: getButtonGlow(),
          }}
          animate={{
            scale: status === 'recording' ? [1, 1.03, 1] : 1,
          }}
          transition={{
            scale: {
              duration: 0.6,
              repeat: status === 'recording' ? Infinity : 0,
              ease: "easeInOut",
            },
          }}
          whileTap={{ scale: 0.93 }}
        >
          {/* Button bezel / rim highlight */}
          <div
            className="absolute inset-1 rounded-full"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)',
            }}
          />

          {/* Inner button surface */}
          <div
            className="absolute inset-3 rounded-full border border-slate-600/30"
            style={{
              background: 'radial-gradient(circle at 40% 35%, rgba(255,255,255,0.05), transparent 60%)',
            }}
          />

          {/* Processing spinner */}
          <AnimatePresence>
            {status === 'processing' && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 0.2 },
                  rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                }}
              >
                <div className="w-14 h-14 border-3 border-amber-500/30 border-t-amber-400 rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Microphone icon */}
          <AnimatePresence>
            {(status === 'idle' || status === 'recording') && (
              <motion.svg
                className="absolute inset-0 m-auto w-12 h-12 text-amber-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: status === 'recording' ? [1, 1.1, 1] : 1,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  opacity: { duration: 0.15 },
                  scale: { duration: 0.5, repeat: status === 'recording' ? Infinity : 0 },
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </motion.svg>
            )}
          </AnimatePresence>

          {/* Speaker icon */}
          <AnimatePresence>
            {status === 'playing' && (
              <motion.svg
                className="absolute inset-0 m-auto w-12 h-12 text-amber-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: [1, 1.1, 1] }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  opacity: { duration: 0.15 },
                  scale: { duration: 0.6, repeat: Infinity },
                }}
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </motion.svg>
            )}
          </AnimatePresence>

          {/* Error icon */}
          <AnimatePresence>
            {status === 'error' && (
              <motion.svg
                className="absolute inset-0 m-auto w-12 h-12 text-red-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ opacity: { duration: 0.15 } }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Error Message Card */}
      <AnimatePresence>
        {status === 'error' && errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-44 max-w-lg mx-4 z-10"
          >
            <div
              className="border border-red-500/40 bg-slate-900/90 rounded px-5 py-3 backdrop-blur-sm cursor-pointer"
              onClick={dismissError}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500 animate-pulse" />
                  <p className="text-red-400/90 text-sm font-mono">
                    {errorMessage}
                  </p>
                </div>
                <p className="text-amber-500/40 text-xs text-center font-mono">
                  [ TAP TO DISMISS ]
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Response Card */}
      <AnimatePresence>
        {aiResponse && status === 'playing' && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-44 max-w-lg mx-4 z-10"
          >
            <div className="border border-amber-500/30 bg-slate-900/90 rounded px-5 py-3 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-500 animate-pulse" />
                <p className="text-amber-100/80 text-sm font-mono leading-relaxed">
                  {aiResponse}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Waveform visualization */}
      <AnimatePresence>
        {status === 'playing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-32 flex items-end justify-center gap-1 h-10"
          >
            {[...Array(9)].map((_, i) => (
              <motion.div
                key={i}
                className="w-0.5 bg-amber-500/70 rounded-full"
                animate={{ height: [6, 24, 12, 30, 6] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Text */}
      <motion.div
        className="absolute bottom-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={status}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="text-amber-500/70 text-sm font-mono tracking-widest"
          >
            {statusText[status]}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence>
          {status === 'recording' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
              className="text-red-400/50 text-[10px] mt-2 tracking-[0.3em] font-mono uppercase"
            >
              Audio Capture Active
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
