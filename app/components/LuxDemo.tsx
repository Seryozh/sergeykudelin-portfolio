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
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scaling logic to fit screen
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const windowHeight = window.innerHeight;
        const targetWidth = 1200; // Base design width
        const targetHeight = 800; // Base design height
        
        const widthScale = containerWidth / targetWidth;
        const heightScale = (windowHeight * 0.8) / targetHeight;
        
        setScale(Math.min(widthScale, heightScale, 1));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= STEPS.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 4000 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const step = STEPS[currentStep];

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center justify-center overflow-hidden">
      <div 
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'top center',
          width: '1200px',
          transition: 'transform 0.3s ease-out'
        }}
        className="space-y-8 py-8"
      >
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-amber-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "circOut" }}
          />
        </div>

        {/* Visualization Area */}
        <div className="bg-slate-950 rounded-3xl p-16 border border-slate-800 relative overflow-hidden min-h-[400px] flex flex-col justify-center shadow-2xl">
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

          <div className="relative flex justify-between items-center max-w-5xl mx-auto w-full px-12">
            {/* Plugin */}
            <div className="flex flex-col items-center gap-6 z-10">
              <motion.div 
                animate={{ 
                  borderColor: [1, 4, 5, 6, 10].includes(currentStep) ? '#fbbf24' : '#1e293b',
                  scale: [1, 4, 5, 6, 10].includes(currentStep) ? 1.1 : 1,
                  boxShadow: [1, 4, 5, 6, 10].includes(currentStep) ? '0 0 40px rgba(251, 191, 36, 0.2)' : 'none'
                }}
                className="w-32 h-32 rounded-[2rem] bg-slate-900 border-2 flex items-center justify-center transition-all duration-500"
              >
                <Terminal className="w-14 h-14 text-slate-400" />
              </motion.div>
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Plugin (Lua)</span>
            </div>

            {/* Backend */}
            <div className="flex flex-col items-center gap-6 z-10">
              <motion.div 
                animate={{ 
                  borderColor: [1, 2, 5, 7, 9].includes(currentStep) ? '#10b981' : '#1e293b',
                  scale: [1, 2, 5, 7, 9].includes(currentStep) ? 1.1 : 1,
                  boxShadow: [1, 2, 5, 7, 9].includes(currentStep) ? '0 0 40px rgba(16, 185, 129, 0.2)' : 'none'
                }}
                className="w-32 h-32 rounded-[2rem] bg-slate-900 border-2 flex items-center justify-center transition-all duration-500"
              >
                <Globe className="w-14 h-14 text-slate-400" />
              </motion.div>
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Backend (API)</span>
            </div>

            {/* Agent */}
            <div className="flex flex-col items-center gap-6 z-10">
              <motion.div 
                animate={{ 
                  borderColor: [2, 3, 7, 8, 9].includes(currentStep) ? '#8b5cf6' : '#1e293b',
                  scale: [2, 3, 7, 8, 9].includes(currentStep) ? 1.1 : 1,
                  backgroundColor: currentStep === 3 ? '#450a0a' : '#0f172a',
                  boxShadow: [2, 3, 7, 8, 9].includes(currentStep) ? '0 0 40px rgba(139, 92, 246, 0.2)' : 'none'
                }}
                className="w-32 h-32 rounded-[2rem] bg-slate-900 border-2 flex items-center justify-center relative transition-all duration-500"
              >
                <Cpu className="w-14 h-14 text-slate-400" />
                <AnimatePresence>
                  {currentStep === 3 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute -top-4 -right-4 bg-red-500 text-[11px] font-black px-4 py-1.5 rounded-full text-white shadow-xl"
                    >
                      PAUSED
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">AI Agent</span>
            </div>

            {/* Simplified Centered Arrows */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <AnimatePresence mode="wait">
                {/* Left Arrow (Plugin <-> Backend) */}
                {[1, 4, 5, 6, 9].includes(currentStep) && (
                  <motion.div 
                    key={`arrow-left-${currentStep}`}
                    initial={{ opacity: 0, x: [1, 6].includes(currentStep) ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: [1, 6].includes(currentStep) ? 50 : -50 }}
                    className="absolute left-[28%] flex flex-col items-center gap-3"
                  >
                    <div className="px-4 py-1.5 bg-slate-900/80 border border-slate-700 rounded-lg text-[11px] font-bold text-white whitespace-nowrap shadow-xl backdrop-blur-sm">
                      {step.label}
                    </div>
                    <ArrowRight className={`w-10 h-10 text-amber-400 ${[5, 9].includes(currentStep) ? 'rotate-180' : ''}`} />
                  </motion.div>
                )}

                {/* Right Arrow (Backend <-> Agent) */}
                {[2, 7].includes(currentStep) && (
                  <motion.div 
                    key={`arrow-right-${currentStep}`}
                    initial={{ opacity: 0, x: currentStep === 2 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: currentStep === 2 ? 50 : -50 }}
                    className="absolute right-[28%] flex flex-col items-center gap-3"
                  >
                    <div className="px-4 py-1.5 bg-slate-900/80 border border-slate-700 rounded-lg text-[11px] font-bold text-white whitespace-nowrap shadow-xl backdrop-blur-sm">
                      {step.label}
                    </div>
                    <ArrowRight className="w-10 h-10 text-emerald-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Info & Code Area */}
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="px-4 py-1.5 rounded-full bg-slate-800 text-slate-400 text-[11px] font-black uppercase tracking-widest">Step {currentStep + 1} / {STEPS.length}</span>
                <h3 className="text-3xl font-bold text-white tracking-tight">{step.title}</h3>
              </div>
              <button 
                onClick={() => setShowTechnical(!showTechnical)}
                className="flex items-center gap-2 text-[11px] font-black text-slate-500 hover:text-amber-400 transition-colors uppercase tracking-widest"
              >
                <Info className="w-4 h-4" />
                {showTechnical ? 'Hide' : 'Show'} Technical Details
              </button>
            </div>
            
            <div className="space-y-6">
              <p className="text-slate-300 text-xl font-medium leading-relaxed">
                {step.desc}
              </p>
              
              <div className="p-6 bg-slate-900/50 rounded-3xl border border-slate-800/50 shadow-inner">
                <p className="text-slate-400 text-base italic leading-relaxed">
                  "{step.narration}"
                </p>
              </div>

              <AnimatePresence>
                {showTechnical && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-400 font-mono overflow-hidden shadow-2xl"
                  >
                    <span className="text-amber-500 font-bold uppercase tracking-widest text-[10px] block mb-2">Implementation Detail</span>
                    {step.technicalDetail}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
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
                  onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
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
                <div className="flex bg-slate-900 rounded-2xl p-1.5 border border-slate-800">
                  {[0.5, 1, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={`px-6 py-2.5 rounded-xl text-[11px] font-black transition-all ${speed === s ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {s}X
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 rounded-[2.5rem] border border-slate-800 overflow-hidden flex flex-col shadow-2xl">
            <div className="px-8 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">{step.lang}</span>
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
              </div>
            </div>
            <div className="p-12 font-mono text-base overflow-x-auto flex-1 custom-scrollbar">
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
