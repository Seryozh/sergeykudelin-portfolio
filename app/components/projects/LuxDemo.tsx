'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ArrowRight, Cpu, Globe, Terminal, Info, CheckCircle2 } from 'lucide-react';

const STEPS = [
  {
    id: 0,
    title: 'Initial State',
    desc: 'System is idle, awaiting user input.',
    narration: 'The system is ready. Both the game plugin and the AI backend are standing by.',
    technicalDetail: 'Backend: FastAPI server running; Plugin: Lua event loop active.',
    code: '-- Awaiting input...',
    lang: 'lua',
    label: '',
    gamePreview: 'idle',
  },
  {
    id: 1,
    title: 'User Sends Request',
    desc: 'User types: "Add a health bar". Plugin sends request to Backend.',
    narration: 'The user asks for a new feature. The plugin packages this request and sends it to our cloud backend.',
    technicalDetail: 'HTTP POST request with session_id and user_prompt.',
    code: 'Backend.sendChat(sessionId, "Add a health bar", projectMap, apiKey)',
    lang: 'lua',
    label: 'User Prompt',
    gamePreview: 'idle',
  },
  {
    id: 2,
    title: 'Backend Invokes Agent',
    desc: 'Backend starts AI agent processing using LangGraph.',
    narration: 'The backend receives the request and hands it off to the AI Agent, which begins planning the necessary steps.',
    technicalDetail: 'LangGraph orchestration starts a new stateful thread.',
    code: 'agent_response = await run_agent(session, user_message)',
    lang: 'python',
    label: 'Invoke Agent',
    gamePreview: 'thinking',
  },
  {
    id: 3,
    title: 'Agent Pauses & Waits',
    desc: 'The AI needs to see a script before it can continue.',
    narration: '"I need to see the player script before I can add the health bar. Let me wait here until it arrives."',
    technicalDetail: 'Implemented via asyncio.Event() with 30s timeout. The thread is suspended.',
    code: 'await asyncio.wait_for(event.wait(), timeout=30)  # BLOCKS HERE',
    lang: 'python',
    label: '',
    gamePreview: 'thinking',
  },
  {
    id: 4,
    title: 'Plugin Polls',
    desc: 'Plugin polls every 100ms: "Do you need anything?"',
    narration: 'Since the game cannot receive incoming calls, the plugin "checks in" every 100ms to see if the AI has any questions.',
    technicalDetail: 'Standard polling loop to bypass one-way HTTP constraint.',
    code: 'local pollData = Backend.poll(sessionId)\ntask.wait(0.1)  -- 100ms',
    lang: 'lua',
    label: 'GET /poll',
    gamePreview: 'thinking',
  },
  {
    id: 5,
    title: 'Plugin Receives Request',
    desc: 'Backend responds to poll with the pending data request.',
    narration: 'The backend tells the plugin: "Yes! I need the source code for the PlayerScript."',
    technicalDetail: 'Poll response contains a list of pending_requests for the client.',
    code: '{\n  "pending_requests": [\n    {"type": "get_full_script", "target": "PlayerScript"}\n  ]\n}',
    lang: 'json',
    label: 'Data Request',
    gamePreview: 'thinking',
  },
  {
    id: 6,
    title: 'Plugin Responds',
    desc: 'Plugin reads script from game and sends it back to Backend.',
    narration: 'The plugin reads the script directly from the game engine and sends it back to the cloud.',
    technicalDetail: 'HTTP POST to /respond with script content and MD5 hash.',
    code: 'Backend.respond(sessionId, requestId, {\n    source = scriptSource,\n    hash = md5(scriptSource)\n})',
    lang: 'lua',
    label: 'Script Content',
    gamePreview: 'thinking',
  },
  {
    id: 7,
    title: 'Event Triggers',
    desc: 'Backend triggers event.set(), waking the blocked agent.',
    narration: 'The data has arrived! The backend "wakes up" the AI agent so it can finish its work.',
    technicalDetail: 'event.set() is called, allowing the suspended asyncio task to resume.',
    code: 'event = session.fulfilled_responses[request_id]\nevent.set()  # WAKES THE AGENT',
    lang: 'python',
    label: 'event.set()',
    gamePreview: 'thinking',
  },
  {
    id: 8,
    title: 'Agent Generates Actions',
    desc: 'Agent resumes with the data and generates the modification plan.',
    narration: 'The AI now has the code it needed. It analyzes it and generates a set of composable game modifications.',
    technicalDetail: 'Agent state is updated with tool output; LangGraph proceeds to action generation.',
    code: '{\n  "actions": [\n    {"type": "create_instance", "name": "HealthBar"},\n    {"type": "create_script", "name": "HealthController"},\n    {"type": "set_property", "target": "HealthBar"}\n  ]\n}',
    lang: 'json',
    label: '',
    gamePreview: 'building',
  },
  {
    id: 9,
    title: 'Actions Sent to Plugin',
    desc: 'Agent sends structured actions back to the Plugin for user review.',
    narration: 'The AI sends back three actions: create a GUI frame, create a controller script, and set the bar properties.',
    technicalDetail: 'Final response includes a list of structured Action objects with hash verification.',
    code: '-- Plugin receives 3 actions:\n-- 1. create_instance "HealthBar" (Frame)\n-- 2. create_script "HealthController"\n-- 3. set_property Size, Color\n\n-- User reviews and clicks APPLY',
    lang: 'lua',
    label: 'Action List',
    gamePreview: 'building',
  },
  {
    id: 10,
    title: 'Applied!',
    desc: 'User clicks Apply. Actions execute. Health bar appears in game.',
    narration: 'The user reviews the proposed changes, clicks "Apply", and the health bar appears instantly in the game viewport.',
    technicalDetail: 'Client-side Lua executor applies each action atomically with hash verification.',
    code: '-- ✓ HealthBar created (Frame, 200x30)\n-- ✓ HealthController attached (Script)\n-- ✓ Properties set (green, animated)\n\n-- Task complete. 3 actions applied.',
    lang: 'lua',
    label: '',
    gamePreview: 'complete',
  }
];

// Game Preview Component - shows visual result building up
function GamePreview({ state }: { state: string }) {
  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden h-full flex flex-col">
      <div className="px-3 py-1.5 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between flex-shrink-0">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Game Viewport</span>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
        </div>
      </div>
      <div className="flex-1 relative bg-gradient-to-b from-sky-950/30 to-slate-950 p-4 min-h-[140px]">
        {/* Ground plane */}
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-emerald-950/40 to-transparent" />
        <div className="absolute bottom-[38%] left-0 right-0 h-[1px] bg-emerald-500/10" />

        {/* Simple character silhouette */}
        <div className="absolute bottom-[40%] left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center">
            {/* Head */}
            <div className="w-5 h-5 rounded-full bg-slate-700 border border-slate-600" />
            {/* Body */}
            <div className="w-7 h-10 bg-slate-700 rounded-sm mt-0.5 border border-slate-600" />
            {/* Legs */}
            <div className="flex gap-1 mt-0.5">
              <div className="w-3 h-6 bg-slate-700 rounded-sm border border-slate-600" />
              <div className="w-3 h-6 bg-slate-700 rounded-sm border border-slate-600" />
            </div>
          </div>
        </div>

        {/* Health bar UI - appears during building/complete */}
        <AnimatePresence>
          {(state === 'building' || state === 'complete') && (
            <motion.div
              className="absolute top-3 left-3 right-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              {/* Health bar frame */}
              <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-2 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[8px] font-black text-slate-400 uppercase">HP</span>
                  <span className="text-[8px] text-emerald-400 font-bold">100/100</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: state === 'complete'
                        ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                        : 'linear-gradient(90deg, #374151, #4b5563)'
                    }}
                    initial={{ width: '0%' }}
                    animate={{
                      width: state === 'complete' ? '100%' : '60%',
                      background: state === 'complete'
                        ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                        : 'linear-gradient(90deg, #374151, #4b5563)'
                    }}
                    transition={{ duration: state === 'complete' ? 0.8 : 0.4, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Building indicator */}
              {state === 'building' && (
                <motion.div
                  className="mt-2 text-center"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="text-[8px] font-bold text-amber-400 uppercase tracking-wider">Generating UI...</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI thinking indicator */}
        <AnimatePresence>
          {state === 'thinking' && (
            <motion.div
              className="absolute top-3 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Cpu className="w-3 h-3 text-purple-400" />
                <span className="text-[8px] font-bold text-purple-400 uppercase">AI Processing</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion state */}
        <AnimatePresence>
          {state === 'complete' && (
            <motion.div
              className="absolute bottom-3 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span className="text-[8px] font-bold text-emerald-400 uppercase">3 actions applied</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Idle state label */}
        {state === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">Roblox Studio</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LuxDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.5);
  const [showTechnical, setShowTechnical] = useState(false);
  const [scale, setScale] = useState(1);
  const [slideProgress, setSlideProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const STEP_DURATION = 4000 / speed;

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const baseWidth = 1200;
        const baseHeight = 720;
        const widthScale = (windowWidth * 0.95) / baseWidth;
        const heightScale = (windowHeight * 0.92) / baseHeight;
        const newScale = Math.min(widthScale, heightScale, 1);
        setScale(Math.max(newScale, 0.35));
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      setSlideProgress(0);
      return;
    }
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / STEP_DURATION) * 100, 100);
      setSlideProgress(progress);
    }, 16);
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, speed, STEP_DURATION]);

  useEffect(() => {
    if (!isPlaying) return;
    const timeout = setTimeout(() => {
      setCurrentStep((prev) => {
        if (prev >= STEPS.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, STEP_DURATION);
    return () => clearTimeout(timeout);
  }, [isPlaying, currentStep, speed, STEP_DURATION]);

  const step = STEPS[currentStep];

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setSlideProgress(0);
  };

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          width: '1200px',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        className="space-y-3 py-1"
      >
        {/* Progress Bar */}
        <div className="w-full max-w-3xl mx-auto">
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-amber-500 shadow-[0_0_8px_#fbbf24]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + (slideProgress / 100)) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Main visualization: Architecture + Game Preview side by side */}
        <div className="grid grid-cols-3 gap-4">
          {/* Architecture Diagram - 2 cols */}
          <div className="col-span-2 bg-slate-950 rounded-[2rem] p-6 border border-slate-800 relative overflow-hidden min-h-[240px] flex flex-col justify-center shadow-2xl">
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                 style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="relative flex justify-between items-center max-w-3xl mx-auto w-full px-6">
              {/* Plugin Node */}
              <div className="flex flex-col items-center gap-3 z-10 w-28">
                <motion.div
                  animate={{
                    borderColor: [1, 4, 5, 6, 10].includes(currentStep) ? '#fbbf24' : '#1e293b',
                    scale: [1, 4, 5, 6, 10].includes(currentStep) ? 1.1 : 1,
                    boxShadow: [1, 4, 5, 6, 10].includes(currentStep) ? '0 0 30px rgba(251, 191, 36, 0.3)' : 'none'
                  }}
                  className="w-24 h-24 rounded-[1.5rem] bg-slate-900 border-2 flex items-center justify-center transition-all duration-500"
                >
                  <Terminal className="w-10 h-10 text-slate-400" />
                </motion.div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Plugin (Lua)</span>
              </div>

              {/* Backend Node */}
              <div className="flex flex-col items-center gap-3 z-10 w-28">
                <motion.div
                  animate={{
                    borderColor: [1, 2, 5, 7, 9].includes(currentStep) ? '#10b981' : '#1e293b',
                    scale: [1, 2, 5, 7, 9].includes(currentStep) ? 1.1 : 1,
                    boxShadow: [1, 2, 5, 7, 9].includes(currentStep) ? '0 0 30px rgba(16, 185, 129, 0.3)' : 'none'
                  }}
                  className="w-24 h-24 rounded-[1.5rem] bg-slate-900 border-2 flex items-center justify-center transition-all duration-500"
                >
                  <Globe className="w-10 h-10 text-slate-400" />
                </motion.div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Backend (API)</span>
              </div>

              {/* Agent Node */}
              <div className="flex flex-col items-center gap-3 z-10 w-28">
                <motion.div
                  animate={{
                    borderColor: [2, 3, 7, 8, 9].includes(currentStep) ? '#8b5cf6' : '#1e293b',
                    scale: [2, 3, 7, 8, 9].includes(currentStep) ? 1.1 : 1,
                    backgroundColor: currentStep === 3 ? '#450a0a' : '#0f172a',
                    boxShadow: [2, 3, 7, 8, 9].includes(currentStep) ? '0 0 30px rgba(139, 92, 246, 0.3)' : 'none'
                  }}
                  className="w-24 h-24 rounded-[1.5rem] bg-slate-900 border-2 flex items-center justify-center relative transition-all duration-500"
                >
                  <Cpu className="w-10 h-10 text-slate-400" />
                  <AnimatePresence>
                    {currentStep === 3 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute -top-3 -right-3 bg-red-500 text-[9px] font-black px-3 py-1 rounded-full text-white shadow-xl"
                      >
                        BLOCKED
                      </motion.div>
                    )}
                    {currentStep === 8 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute -top-3 -right-3 bg-emerald-500 text-[9px] font-black px-3 py-1 rounded-full text-white shadow-xl"
                      >
                        RESUMED
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">AI Agent</span>
              </div>

              {/* SVG Overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 5 }}>
                {/* Left Path (Plugin <-> Backend) */}
                <AnimatePresence>
                  {[1, 4, 5, 6, 9].includes(currentStep) && (
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <line x1="20%" y1="38%" x2="43%" y2="38%" stroke="rgba(251, 191, 36, 0.15)" strokeWidth="2" strokeDasharray="6 4" />
                      <motion.circle
                        r="4"
                        fill="#fbbf24"
                        filter="blur(1px)"
                        initial={{ cx: [5, 9].includes(currentStep) ? "43%" : "20%" }}
                        animate={{ cx: [5, 9].includes(currentStep) ? "20%" : "43%" }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        cy="38%"
                      />
                      <foreignObject x="20%" y="17%" width="23%" height="36" style={{ overflow: 'visible' }}>
                        <div className="flex items-center justify-center h-full w-full">
                          <div className="px-3 py-1 bg-slate-900/95 border border-slate-700 rounded-lg text-[10px] font-bold text-white whitespace-nowrap shadow-xl backdrop-blur-md">
                            {step.label}
                          </div>
                        </div>
                      </foreignObject>
                    </motion.g>
                  )}
                </AnimatePresence>

                {/* Right Path (Backend <-> Agent) */}
                <AnimatePresence>
                  {[2, 7].includes(currentStep) && (
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <line x1="57%" y1="38%" x2="80%" y2="38%" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="2" strokeDasharray="6 4" />
                      <motion.circle
                        r="4"
                        fill="#10b981"
                        filter="blur(1px)"
                        initial={{ cx: "57%" }}
                        animate={{ cx: "80%" }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        cy="38%"
                      />
                      <foreignObject x="57%" y="17%" width="23%" height="36" style={{ overflow: 'visible' }}>
                        <div className="flex items-center justify-center h-full w-full">
                          <div className="px-3 py-1 bg-slate-900/95 border border-slate-700 rounded-lg text-[10px] font-bold text-white whitespace-nowrap shadow-xl backdrop-blur-md">
                            {step.label}
                          </div>
                        </div>
                      </foreignObject>
                    </motion.g>
                  )}
                </AnimatePresence>
              </svg>
            </div>
          </div>

          {/* Game Preview - 1 col */}
          <div className="col-span-1">
            <GamePreview state={step.gamePreview} />
          </div>
        </div>

        {/* Info & Code Area */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-wider">{currentStep + 1}/{STEPS.length}</span>
                <h3 className="text-lg font-bold text-white tracking-tight">{step.title}</h3>
              </div>
              <button
                onClick={() => setShowTechnical(!showTechnical)}
                className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 hover:text-amber-400 transition-colors uppercase tracking-wider"
              >
                <Info className="w-3 h-3" />
                {showTechnical ? 'Hide' : 'Show'} Details
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-slate-300 text-sm font-medium leading-snug">
                {step.desc}
              </p>

              <div className="p-2.5 bg-slate-900/50 rounded-xl border border-slate-800/50 shadow-inner">
                <p className="text-slate-400 text-xs italic leading-snug">
                  &ldquo;{step.narration}&rdquo;
                </p>
              </div>

              <AnimatePresence>
                {showTechnical && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400 font-mono overflow-hidden shadow-xl"
                  >
                    <span className="text-amber-500 font-bold uppercase tracking-widest text-[9px] block mb-1">Technical</span>
                    {step.technicalDetail}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={() => { setCurrentStep(Math.max(0, currentStep - 1)); setSlideProgress(0); }}
                disabled={currentStep === 0}
                className="p-2 bg-slate-800 text-white rounded-lg disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-700 transition-all active:scale-90"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-5 py-2 rounded-lg bg-amber-500 text-slate-950 font-black hover:bg-amber-400 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-amber-500/30 text-sm"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                {isPlaying ? 'PAUSE' : 'PLAY'}
              </button>
              <button
                onClick={() => { setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1)); setSlideProgress(0); }}
                disabled={currentStep === STEPS.length - 1}
                className="p-2 bg-slate-800 text-white rounded-lg disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-700 transition-all active:scale-90"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleRestart}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all active:scale-90"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800">
                {[0.5, 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSpeed(s); setSlideProgress(0); }}
                    className={`px-3 py-1 rounded text-[10px] font-black transition-all ${speed === s ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {s}X
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col shadow-2xl min-w-0">
            <div className="px-4 py-1.5 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center flex-shrink-0">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{step.lang}</span>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/30" />
                <div className="w-2 h-2 rounded-full bg-amber-500/30" />
                <div className="w-2 h-2 rounded-full bg-emerald-500/30" />
              </div>
            </div>
            <div className="p-3 font-mono text-sm flex-1 overflow-auto custom-scrollbar min-w-0">
              <pre className="text-emerald-400/90 leading-relaxed whitespace-pre-wrap break-all text-xs">
                <code>{step.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
