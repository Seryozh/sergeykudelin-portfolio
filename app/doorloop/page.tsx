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

export default function DoorLoopPage() {
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'playing' | 'error'>('idle');
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const recordingFormatRef = useRef<{ mimeType: string; extension: string }>({ mimeType: 'audio/webm', extension: 'webm' });
  const isRecordingRef = useRef(false);

  const N8N_WEBHOOK_URL = 'https://sergeykudelin.app.n8n.cloud/webhook/voice-agent';

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

  const startRecording = async (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default to avoid double-firing on mobile
    e.preventDefault();
    
    // Guard against starting if already recording
    if (isRecordingRef.current) return;
    isRecordingRef.current = true;

    // Clear previous state
    setTranscript('');
    setAiResponse('');
    setErrorMessage('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Try to find a supported format, fallback to browser default if none found
      const types = [
        { mime: 'audio/webm;codecs=opus', ext: 'webm' },
        { mime: 'audio/mp4', ext: 'mp4' },
        { mime: 'audio/aac', ext: 'aac' },
        { mime: 'audio/webm', ext: 'webm' },
        { mime: 'audio/mpeg', ext: 'mp3' }
      ];

      let options: MediaRecorderOptions = {};
      let detectedExt = 'webm';

      for (const type of types) {
        if (MediaRecorder.isTypeSupported(type.mime)) {
          options = { mimeType: type.mime };
          detectedExt = type.ext;
          break;
        }
      }

      // Create recorder - if options is empty, browser uses its default format
      console.log('[DEBUG] MediaRecorder options:', options);
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      
      // Get the actual mimeType the browser is using (may differ from what we requested)
      const actualMimeType = mediaRecorderRef.current.mimeType || 'audio/webm';
      const actualExt = actualMimeType.includes('mp4') ? 'mp4' : 
                        actualMimeType.includes('webm') ? 'webm' : 
                        actualMimeType.includes('aac') ? 'aac' : detectedExt;
      
      console.log('[DEBUG] Actual audio format:', actualMimeType, actualExt);
      recordingFormatRef.current = { mimeType: actualMimeType, extension: actualExt };
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = sendAudioToN8N;
      mediaRecorderRef.current.start();
      setStatus('recording');

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

  const stopRecording = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default to avoid double-firing on mobile
    e.preventDefault();
    
    // Guard against stopping if not recording
    if (!isRecordingRef.current) return;
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      // Stop all tracks on the stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setStatus('processing');

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
    
    isRecordingRef.current = false;
  };

  const sendAudioToN8N = async () => {
    const { mimeType, extension } = recordingFormatRef.current;
    const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
    
    console.log('[DEBUG] Audio blob size:', audioBlob.size, 'bytes, type:', mimeType);
    
    // Check for empty audio
    if (audioBlob.size === 0) {
      setErrorMessage('No audio recorded. Please hold longer.');
      setStatus('error');
      return;
    }

    const formData = new FormData();
    formData.append('audio', audioBlob, `voice_input.${extension}`);
    formData.append('company', 'DoorLoop');

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      console.log('[DEBUG] Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      // Parse JSON response: { audio: "base64_string", text: "AI response" }
      const data = await response.json();
      console.log('[DEBUG] Response data:', data);

      // Store AI response text
      if (data.text) {
        setAiResponse(data.text);
      }

      // Play audio from base64
      if (data.audio) {
        const audioSource = `data:audio/mpeg;base64,${data.audio}`;
        const audio = new Audio(audioSource);

        audio.onerror = (e) => {
          console.error('[DEBUG] Audio playback error:', e);
          setErrorMessage('Audio playback failed');
          setStatus('error');
        };

        setStatus('playing');
        setTranscript('');
        audio.play();
        audio.onended = () => {
          setStatus('idle');
          setTimeout(() => setAiResponse(''), 3000);
        };
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

  const dismissError = () => {
    setStatus('idle');
    setErrorMessage('');
  };

  const getOrbColors = () => {
    switch (status) {
      case 'recording':
        return {
          primary: '#ef4444',
          secondary: '#dc2626',
          glow: 'rgba(239, 68, 68, 0.6)',
        };
      case 'processing':
        return {
          primary: '#f59e0b',
          secondary: '#8b5cf6',
          glow: 'rgba(245, 158, 11, 0.6)',
        };
      case 'playing':
        return {
          primary: '#10b981',
          secondary: '#059669',
          glow: 'rgba(16, 185, 129, 0.6)',
        };
      case 'error':
        return {
          primary: '#ef4444',
          secondary: '#991b1b',
          glow: 'rgba(239, 68, 68, 0.6)',
        };
      default:
        return {
          primary: '#3b82f6',
          secondary: '#1d4ed8',
          glow: 'rgba(59, 130, 246, 0.4)',
        };
    }
  };

  const colors = getOrbColors();

  const statusText = {
    idle: 'Tap & Hold to Speak',
    recording: 'Listening...',
    processing: 'Thinking...',
    playing: 'Speaking...',
    error: 'Error',
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f] p-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900/50" />

      {/* Glassmorphism Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 text-center z-10"
      >
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-8 py-4 shadow-2xl">
          <h1 className="text-2xl font-semibold text-white tracking-[0.15em] uppercase">
            DoorLoop
          </h1>
          <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-2" />
          <p className="text-white/40 text-xs uppercase tracking-[0.2em] mt-2">
            Candidate AI Agent
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
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl px-6 py-3">
              <p className="text-white/80 text-lg font-light italic">
                "{transcript}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Orb */}
      <div className="relative flex items-center justify-center">
        {/* Outer glow rings */}
        <motion.div
          className="absolute w-72 h-72 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          }}
          animate={{
            scale: status === 'idle' ? [1, 1.1, 1] : status === 'recording' ? [1, 1.2, 1] : status === 'processing' ? [1, 1.15, 1] : [1, 1.3, 1],
            opacity: status === 'idle' ? [0.3, 0.5, 0.3] : [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: status === 'recording' ? 0.8 : status === 'processing' ? 0.6 : 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Secondary pulse ring */}
        <motion.div
          className="absolute w-56 h-56 rounded-full border"
          style={{ borderColor: `${colors.primary}40` }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: status === 'recording' ? 1 : 2.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />

        {/* Sound wave rings for speaking state */}
        <AnimatePresence>
          {status === 'playing' && (
            <>
              <motion.div
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                className="absolute w-48 h-48 rounded-full border border-emerald-500/30"
              />
              <motion.div
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
                className="absolute w-48 h-48 rounded-full border border-emerald-500/30"
              />
              <motion.div
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
                className="absolute w-48 h-48 rounded-full border border-emerald-500/30"
              />
            </>
          )}
        </AnimatePresence>

        {/* Main Orb Button */}
        <motion.button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          onMouseLeave={(e) => {
            if (status === 'recording') stopRecording(e);
          }}
          className="relative z-10 w-40 h-40 rounded-full cursor-pointer focus:outline-none"
          style={{
            background: status === 'processing'
              ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
              : `radial-gradient(circle at 30% 30%, ${colors.primary}, ${colors.secondary})`,
            boxShadow: `0 0 60px ${colors.glow}, inset 0 0 30px rgba(255,255,255,0.1)`,
          }}
          animate={{
            scale: status === 'idle' ? [1, 1.02, 1] : status === 'recording' ? [1, 1.05, 1] : 1,
          }}
          transition={{
            scale: {
              duration: status === 'recording' ? 0.5 : 3,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Inner shine */}
          <div
            className="absolute inset-2 rounded-full opacity-50"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)',
            }}
          />

          {/* Processing spinner - continuous rotation */}
          <AnimatePresence>
            {status === 'processing' && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 0.2 },
                  rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                }}
              >
                <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Microphone icon */}
          <AnimatePresence>
            {(status === 'idle' || status === 'recording') && (
              <motion.svg
                className="absolute inset-0 m-auto w-14 h-14 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: status === 'recording' ? [1, 1.1, 1] : 1
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  opacity: { duration: 0.15 },
                  scale: { duration: 0.5, repeat: status === 'recording' ? Infinity : 0 }
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
                className="absolute inset-0 m-auto w-14 h-14 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: [1, 1.1, 1] }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  opacity: { duration: 0.15 },
                  scale: { duration: 0.6, repeat: Infinity }
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
                className="absolute inset-0 m-auto w-14 h-14 text-white"
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
              className="backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-2xl px-6 py-4 shadow-2xl cursor-pointer"
              onClick={dismissError}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-red-500" />
                  <p className="text-white/90 text-base leading-relaxed">
                    {errorMessage}
                  </p>
                </div>
                <p className="text-white/50 text-sm text-center mt-2">
                  💻 Try using a PC/laptop for best experience
                </p>
                <p className="text-white/30 text-xs text-center">
                  Tap to dismiss
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
            <div className="backdrop-blur-xl bg-white/5 border border-emerald-500/20 rounded-2xl px-6 py-4 shadow-2xl">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-white/90 text-base leading-relaxed">
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
            className="absolute bottom-32 flex items-end justify-center gap-1 h-12"
          >
            {[...Array(9)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-emerald-500 rounded-full"
                animate={{ height: [8, 32, 16, 40, 8] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Text */}
      <motion.div
        className="absolute bottom-20 text-center"
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
            className="text-white/60 text-lg font-light tracking-wide"
          >
            {statusText[status]}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence>
          {status === 'idle' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/30 text-xs mt-2 tracking-wider"
            >
              Release to send
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
    </main>
  );
}
