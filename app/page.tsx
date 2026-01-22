'use client';

import { useState, useRef } from 'react';
import { Mic, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'playing'>('idle');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingFormatRef = useRef<{ mimeType: string; extension: string }>({ mimeType: 'audio/webm', extension: 'webm' });

  // --- PASTE YOUR n8n WEBHOOK URL HERE ---
  // Note: Use the "Production" URL if you want it to work without clicking "Execute" every time.
  const N8N_WEBHOOK_URL = 'https://sergeykudelin.app.n8n.cloud/webhook/voice-agent';

  // 1. START RECORDING
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Detect supported format
      let mimeType = 'audio/webm';
      let extension = 'webm';

      const types = [
        { mime: 'audio/webm;codecs=opus', ext: 'webm' },
        { mime: 'audio/mp4', ext: 'mp4' },
        { mime: 'audio/aac', ext: 'aac' },
        { mime: 'audio/webm', ext: 'webm' }
      ];

      for (const type of types) {
        if (MediaRecorder.isTypeSupported(type.mime)) {
          mimeType = type.mime;
          extension = type.ext;
          break;
        }
      }

      recordingFormatRef.current = { mimeType, extension };
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = sendAudioToN8N;
      mediaRecorderRef.current.start();
      setStatus('recording');
    } catch (err) {
      alert("Microphone access denied.");
    }
  };

  // 2. STOP RECORDING
  const stopRecording = () => {
    if (mediaRecorderRef.current && status === 'recording') {
      mediaRecorderRef.current.stop();
      setStatus('processing');
    }
  };

  // 3. SEND TO N8N & PLAY RESPONSE
  const sendAudioToN8N = async () => {
    const { mimeType, extension } = recordingFormatRef.current;
    const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
    const formData = new FormData();
    formData.append('audio', audioBlob, `voice_input.${extension}`);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Network error');

      // --- THE MAGIC: Convert Binary to Audio ---
      const responseBlob = await response.blob();
      const audioUrl = URL.createObjectURL(responseBlob);
      const audio = new Audio(audioUrl);

      setStatus('playing');
      audio.play();

      audio.onended = () => setStatus('idle');

    } catch (error) {
      console.error(error);
      setStatus('idle');
      alert("Connection failed. Check n8n URL.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4 overflow-hidden selection:bg-none">

      {/* BRANDING */}
      <div className="absolute top-12 text-center">
        <h1 className="text-3xl font-bold text-white tracking-[0.2em]">THE TIDES</h1>
        <div className="w-12 h-1 bg-blue-500 mx-auto my-3"></div>
        <p className="text-slate-400 text-xs uppercase tracking-widest">Virtual Concierge Service</p>
      </div>

      {/* BUTTON UI */}
      <div className="relative">
        {status === 'recording' && (
          <motion.div
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: 2, opacity: [0, 0.5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
            className="absolute top-0 left-0 w-64 h-64 rounded-full bg-blue-500 z-0"
          />
        )}

        <motion.button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          whileTap={{ scale: 0.95 }}
          className={`relative z-10 flex items-center justify-center w-64 h-64 rounded-full shadow-2xl transition-all duration-500
            ${status === 'recording' ? 'bg-red-500 shadow-red-500/50' :
              status === 'processing' ? 'bg-amber-400 animate-pulse' :
              status === 'playing' ? 'bg-emerald-500' :
              'bg-blue-600 hover:bg-blue-500 shadow-blue-500/30'}
          `}
        >
          {status === 'processing' ? (
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
          ) : status === 'playing' ? (
            <Volume2 size={80} className="text-white" />
          ) : (
            <Mic size={80} className="text-white" />
          )}
        </motion.button>
      </div>

      {/* STATUS TEXT */}
      <p className="mt-12 text-slate-400 font-light text-xl tracking-wide h-8">
        {status === 'idle' && "Hold to Speak"}
        {status === 'recording' && "Listening..."}
        {status === 'processing' && "Consulting Concierge..."}
        {status === 'playing' && "Speaking..."}
      </p>
    </main>
  );
}
