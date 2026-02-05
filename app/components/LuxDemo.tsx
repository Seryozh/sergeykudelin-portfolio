'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ArrowRight, Cpu, Globe, Terminal, Info, Monitor } from 'lucide-react';

const STEPS = [
  { 
    id: 0, 
    title: 'Initial State', 
    desc: 'System is idle, awaiting user input.',
    narration: 'The system is ready. Both the game plugin and the AI backend are standing by.',
    technicalDetail: 'Backend: FastAPI server running; Plugin: Lua event loop active.',
    code: '-- Awaiting input...',
    lang: 'lua',
    label: ''
  },
  { 
    id: 1, 
    title: 'User Sends Request', 
    desc: 'User types: "Add a health bar". Plugin sends request to Backend.',
    narration: 'The user asks for a new feature. The plugin packages this request and sends it to our cloud backend.',
    technicalDetail: 'HTTP POST request with session_id and user_prompt.',
    code: 'Backend.sendChat(sessionId, "Add a health bar", projectMap, apiKey)',
    lang: 'lua',
    label: 'User Prompt'
  },
  { 
    id: 2, 
    title: 'Backend Invokes Agent', 
    desc: 'Backend starts AI agent processing using LangGraph.',
    narration: 'The backend receives the request and hands it off to the AI Agent, which begins planning the necessary steps.',
    technicalDetail: 'LangGraph orchestration starts a new stateful thread.',
    code: 'agent_response = await run_agent(session, user_message)',
    lang: 'python',
    label: 'Invoke Agent'
  },
  { 
    id: 3, 
    title: 'Agent Pauses & Waits', 
    desc: 'The AI needs more information before it can continue.',
    narration: 'Think of it like hitting a roadblock: "I need to see the player script before I can help. Let me wait here until it arrives."',
    technicalDetail: 'Implemented via asyncio.Event() with 30s timeout. The thread is suspended.',
    code: 'await asyncio.wait_for(event.wait(), timeout=30)  # BLOCKS HERE',
    lang: 'python',
    label: ''
  },
  { 
    id: 4, 
    title: 'Plugin Polls', 
    desc: 'Plugin polls every 100ms: "Do you need anything?"',
    narration: 'Since the game cannot receive incoming calls, the plugin "checks in" every 100ms to see if the AI has any questions.',
    technicalDetail: 'Standard polling loop to bypass one-way HTTP constraint.',
    code: 'local pollData = Backend.poll(sessionId)\ntask.wait(0.1)  -- 100ms',
    lang: 'lua',
    label: 'GET /poll'
  },
  { 
    id: 5, 
    title: 'Plugin Receives Request', 
    desc: 'Backend responds to poll with the pending data request.',
    narration: 'The backend tells the plugin: "Yes! I need the source code for the PlayerScript."',
    technicalDetail: 'Poll response contains a list of pending_requests for the client.',
    code: '{\n  "pending_requests": [\n    {"type": "get_full_script", "target": "PlayerScript"}\n  ]\n}',
    lang: 'json',
    label: 'Data Request'
  },
  { 
    id: 6, 
    title: 'Plugin Responds', 
    desc: 'Plugin reads script from game and sends it back to Backend.',
    narration: 'The plugin reads the script directly from the game engine and sends it back to the cloud.',
    technicalDetail: 'HTTP POST to /respond with script content and MD5 hash.',
    code: 'Backend.respond(sessionId, requestId, {\n    source = source,\n    hash = hash\n})',
    lang: 'lua',
    label: 'Script Content'
  },
  { 
    id: 7, 
    title: 'Event Triggers', 
    desc: 'Backend triggers event.set(), waking the blocked agent.',
    narration: 'The data has arrived! The backend "wakes up" the AI agent so it can finish its work.',
    technicalDetail: 'event.set() is called, allowing the suspended asyncio task to resume.',
    code: 'event = session.fulfilled_responses[request_id]\nevent.set()  # WAKES THE AGENT',
    lang: 'python',
    label: 'event.set()'
  },
  { 
    id: 8, 
    title: 'Agent Continues', 
    desc: 'Agent resumes with the data and generates final actions.',
    narration: 'The AI now has the code it needed. It analyzes it and generates the final set of game modifications.',
    technicalDetail: 'Agent state is updated with tool output; LangGraph proceeds to next node.',
    code: 'data = session.fulfilled_data.pop(request_id)\n# ... generates actions ...',
    lang: 'python',
    label: ''
  },
  { 
    id: 9, 
    title: 'Response Sent', 
    desc: 'Agent sends response with generated actions to the Plugin.',
    narration: 'The AI is done! It sends back a list of actions, like "Create a UI Frame" and "Update this script."',
    technicalDetail: 'Final response includes a list of structured Action objects.',
    code: '{\n  "message": "I\'ll add a health bar...",\n  "actions": [{ "type": "create_instance", ... }]\n}',
    lang: 'json',
    label: 'Action List'
  },
  { 
    id: 10, 
    title: 'Complete', 
    desc: 'User reviews and applies actions. Task finished.',
    narration: 'The user sees the proposed changes, clicks "Apply", and the game is updated instantly.',
    technicalDetail: 'Client-side execution of the action list via Lua executor.',
    code: '-- Task Complete',
    lang: 'lua',
    label: ''
  }
];

export default function LuxDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.5);
  const [showTechnical, setShowTechnical] = useState(false);
  const [scale, setScale] = useState(1);
  const [slideProgress, setSlideProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const STEP_DURATION = 4000 / speed;

  // Overhauled scaling logic: Fit-to-Screen
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Base design dimensions
        const baseWidth = 1200;
        const baseHeight = 850; 
        
        // Calculate scale to fit both width and height with strict padding
        const widthScale = (windowWidth * 0.9) / baseWidth;
        const heightScale = (windowHeight * 0.75) / baseHeight;
        
        // Cap scale to ensure it never over-zooms or overflows
        const newScale = Math.min(widthScale, heightScale, 0.85);
        setScale(Math.max(newScale, 0.35));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Slide progress timer
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
  }, [isPlaying, currentStep, speed]);

  // Step transition logic
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
  }, [isPlaying, currentStep, speed]);

  const step = STEPS[currentStep];

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setSlideProgress(0);
  };

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-start overflow-hidden min-h-[500px]">
      <div 
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'top center',
          width: '1200px',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        className="space-y-8 py-4"
      >
        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex flex-col shadow-inner">
          <div className="flex-1 flex">
            <motion.div 
              className="h-full bg-amber-500/30"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "circOut" }}
            />
          </div>
          <div className="h-1.5 w-full bg-slate-900">
            <motion.div 
              className="h-full bg-amber-500 shadow-[0_0_10px_#fbbf24]"
              style={{ width: `${slideProgress}%` }}
            />
          </div>
        </div>

        {/* Visualization Area with SVG Overlay for Guaranteed Centering */}
        <div className="bg-slate-950 rounded-[3rem] p-16 border border-slate-800 relative overflow-hidden min-h-[450px] flex flex-col justify-center shadow-2xl">
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="relative flex justify-between items-center max-w-5xl mx-auto w-full px-16">
            {/* Plugin Node */}
            <div id="node-plugin" className="flex flex-col items-center gap-6 z-10 w-40">
              <motion.div 
                animate={{ 
                  borderColor: [1, 4, 5, 6, 10].includes(currentStep) ? '#fbbf24' : '#1e293b',
                  scale: [1, 4, 5, 6, 10].includes(currentStep) ? 1.15 : 1,
                  boxShadow: [1, 4, 5, 6, 10].includes(currentStep) ? '0 0 50px rgba(251, 191, 36, 0.3)' : 'none'
                }}
                className="w-36 h-36 rounded-[2.5rem] bg-slate-900 border-2 flex items-center justify-center transition-all duration-500"
              >
                <Terminal className="w-16 h-16 text-slate-400" />
              </motion.div>
              <span className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em]">Plugin (Lua)</span>
            </div>

            {/* Backend Node */}
            <div id="node-backend" className="flex flex-col items-center gap-6 z-10 w-40">
              <motion.div 
                animate={{ 
                  borderColor: [1, 2, 5, 7, 9].includes(currentStep) ? '#10b981' : '#1e293b',
                  scale: [1, 2, 5, 7, 9].includes(currentStep) ? 1.15 : 1,
                  boxShadow: [1, 2, 5, 7, 9].includes(currentStep) ? '0 0 50px rgba(16, 185, 129, 0.3)' : 'none'
                }}
                className="w-36 h-36 rounded-[2.5rem] bg-slate-900 border-2 flex items-center justify-center transition-all duration-500"
              >
                <Globe className="w-16 h-16 text-slate-400" />
              </motion.div>
              <span className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em]">Backend (API)</span>
            </div>

            {/* Agent Node */}
            <div id="node-agent" className="flex flex-col items-center gap-6 z-10 w-40">
              <motion.div 
                animate={{ 
                  borderColor: [2, 3, 7, 8, 9].includes(currentStep) ? '#8b5cf6' : '#1e293b',
                  scale: [2, 3, 7, 8, 9].includes(currentStep) ? 1.15 : 1,
                  backgroundColor: currentStep === 3 ? '#450a0a' : '#0f172a',
                  boxShadow: [2, 3, 7, 8, 9].includes(currentStep) ? '0 0 50px rgba(139, 92, 246, 0.3)' : 'none'
                }}
                className="w-36 h-36 rounded-[2.5rem] bg-slate-900 border-2 flex items-center justify-center relative transition-all duration-500"
              >
                <Cpu className="w-16 h-16 text-slate-400" />
                <AnimatePresence>
                  {currentStep === 3 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute -top-5 -right-5 bg-red-500 text-[12px] font-black px-5 py-2 rounded-full text-white shadow-2xl"
                    >
                      PAUSED
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <span className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em]">AI Agent</span>
            </div>

            {/* SVG Overlay for Guaranteed Centering */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 5 }}>
              {/* Left Path (Plugin <-> Backend) */}
              <AnimatePresence>
                {[1, 4, 5, 6, 9].includes(currentStep) && (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Static Path Line */}
                    <line x1="30%" y1="45%" x2="45%" y2="45%" stroke="rgba(251, 191, 36, 0.1)" strokeWidth="2" strokeDasharray="4 4" />
                    
                    {/* Moving Packet */}
                    <motion.circle
                      r="6"
                      fill="#fbbf24"
                      filter="blur(2px)"
                      initial={{ cx: [5, 9].includes(currentStep) ? "45%" : "30%" }}
                      animate={{ cx: [5, 9].includes(currentStep) ? "30%" : "45%" }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      cy="45%"
                      className="shadow-[0_0_15px_#fbbf24]"
                    />

                    {/* Label Container - Centered between 30% and 45% (Midpoint: 37.5%) */}
                    <foreignObject x="30%" y="30%" width="15%" height="40">
                      <div className="flex items-center justify-center h-full">
                        <div className="px-5 py-2 bg-slate-900/95 border border-slate-700 rounded-xl text-[12px] font-bold text-white whitespace-nowrap shadow-2xl backdrop-blur-md">
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
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Static Path Line */}
                    <line x1="55%" y1="45%" x2="70%" y2="45%" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="2" strokeDasharray="4 4" />
                    
                    {/* Moving Packet */}
                    <motion.circle
                      r="6"
                      fill="#10b981"
                      filter="blur(2px)"
                      initial={{ cx: "55%" }}
                      animate={{ cx: "70%" }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      cy="45%"
                      className="shadow-[0_0_15px_#10b981]"
                    />

                    {/* Label Container - Centered between 55% and 70% (Midpoint: 62.5%) */}
                    <foreignObject x="55%" y="30%" width="15%" height="40">
                      <div className="flex items-center justify-center h-full">
                        <div className="px-5 py-2 bg-slate-900/95 border border-slate-700 rounded-xl text-[12px] font-bold text-white whitespace-nowrap shadow-2xl backdrop-blur-md">
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

        {/* Info & Code Area */}
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="px-4 py-1.5 rounded-full bg-slate-800 text-slate-400 text-[12px] font-black uppercase tracking-widest">Step {currentStep + 1} / {STEPS.length}</span>
                <h3 className="text-3xl font-bold text-white tracking-tight">{step.title}</h3>
              </div>
              <button 
                onClick={() => setShowTechnical(!showTechnical)}
                className="flex items-center gap-2 text-[12px] font-black text-slate-500 hover:text-amber-400 transition-colors uppercase tracking-widest"
              >
                <Info className="w-4 h-4" />
                {showTechnical ? 'Hide' : 'Show'} Technical Details
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-slate-300 text-xl font-medium leading-relaxed">
                {step.desc}
              </p>
              
              <div className="p-6 bg-slate-900/50 rounded-[2rem] border border-slate-800/50 shadow-inner">
                <p className="text-slate-400 text-lg italic leading-relaxed">
                  "{step.narration}"
                </p>
              </div>

              <AnimatePresence>
                {showTechnical && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-sm text-slate-400 font-mono overflow-hidden shadow-2xl"
                  >
                    <span className="text-amber-500 font-bold uppercase tracking-widest text-[11px] block mb-2">Implementation Detail</span>
                    {step.technicalDetail}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-8 pt-2">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => { setCurrentStep(Math.max(0, currentStep - 1)); setSlideProgress(0); }}
                  disabled={currentStep === 0}
                  className="p-4 bg-slate-800 text-white rounded-2xl disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-700 transition-all active:scale-90"
                >
                  <ArrowRight className="w-8 h-8 rotate-180" />
                </button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-12 py-4 rounded-2xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400 transition-all active:scale-95 flex items-center gap-4 shadow-2xl shadow-amber-500/30"
                >
                  {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                  {isPlaying ? 'PAUSE' : 'PLAY'}
                </button>
                <button
                  onClick={() => { setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1)); setSlideProgress(0); }}
                  disabled={currentStep === STEPS.length - 1}
                  className="p-4 bg-slate-800 text-white rounded-2xl disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-700 transition-all active:scale-90"
                >
                  <ArrowRight className="w-8 h-8" />
                </button>
              </div>

              <div className="flex items-center gap-8">
                <button 
                  onClick={handleRestart}
                  className="p-4 rounded-2xl bg-slate-800 text-slate-400 hover:text-white transition-all active:scale-90"
                  title="Restart"
                >
                  <RotateCcw className="w-8 h-8" />
                </button>
                <div className="flex bg-slate-900 rounded-2xl p-2 border border-slate-800">
                  {[0.5, 1, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSpeed(s); setSlideProgress(0); }}
                      className={`px-7 py-3 rounded-xl text-[12px] font-black transition-all ${speed === s ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {s}X
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 rounded-[3rem] border border-slate-800 overflow-hidden flex flex-col shadow-2xl">
            <div className="px-10 py-5 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
              <span className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em]">{step.lang}</span>
              <div className="flex gap-2.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
              </div>
            </div>
            <div className="p-14 font-mono text-lg overflow-x-auto flex-1 custom-scrollbar">
              <pre className="text-emerald-400/90 leading-relaxed">
                <code>{step.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
