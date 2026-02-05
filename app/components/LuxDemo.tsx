'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
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
  const [speed, setSpeed] = useState(0.5); // Slower by default
  const [showTechnical, setShowTechnical] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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
    }, 4000 / speed); // Slower default timing

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const step = STEPS[currentStep];

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  if (isMobile) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto">
          <Monitor className="w-8 h-8 text-amber-500" />
        </div>
        <h3 className="text-xl font-bold text-white">Desktop Experience Recommended</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          The interactive architecture simulation is designed for larger screens to show the real-time communication flow and code synchronization.
        </p>
        <p className="text-amber-500/80 text-xs font-bold uppercase tracking-widest">
          Please switch to a desktop device
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-amber-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.5, ease: "circOut" }}
        />
      </div>

      {/* Visualization Area */}
      <div className="bg-slate-950 rounded-2xl p-12 border border-slate-800 relative overflow-hidden min-h-[450px] flex flex-col justify-center">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <div className="relative flex justify-between items-center max-w-4xl mx-auto w-full">
          {/* Plugin */}
          <div className="flex flex-col items-center gap-4 z-10">
            <motion.div 
              animate={{ 
                borderColor: [1, 4, 5, 6, 10].includes(currentStep) ? '#fbbf24' : '#1e293b',
                scale: [1, 4, 5, 6, 10].includes(currentStep) ? 1.1 : 1,
                boxShadow: [1, 4, 5, 6, 10].includes(currentStep) ? '0 0 30px rgba(251, 191, 36, 0.2)' : 'none'
              }}
              className="w-28 h-28 rounded-3xl bg-slate-900 border-2 flex items-center justify-center transition-colors duration-500"
            >
              <Terminal className="w-12 h-12 text-slate-400" />
            </motion.div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Plugin (Lua)</span>
          </div>

          {/* Backend */}
          <div className="flex flex-col items-center gap-4 z-10">
            <motion.div 
              animate={{ 
                borderColor: [1, 2, 5, 7, 9].includes(currentStep) ? '#10b981' : '#1e293b',
                scale: [1, 2, 5, 7, 9].includes(currentStep) ? 1.1 : 1,
                boxShadow: [1, 2, 5, 7, 9].includes(currentStep) ? '0 0 30px rgba(16, 185, 129, 0.2)' : 'none'
              }}
              className="w-28 h-28 rounded-3xl bg-slate-900 border-2 flex items-center justify-center transition-colors duration-500"
            >
              <Globe className="w-12 h-12 text-slate-400" />
            </motion.div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Backend (API)</span>
          </div>

          {/* Agent */}
          <div className="flex flex-col items-center gap-4 z-10">
            <motion.div 
              animate={{ 
                borderColor: [2, 3, 7, 8, 9].includes(currentStep) ? '#8b5cf6' : '#1e293b',
                scale: [2, 3, 7, 8, 9].includes(currentStep) ? 1.1 : 1,
                backgroundColor: currentStep === 3 ? '#450a0a' : '#0f172a',
                boxShadow: [2, 3, 7, 8, 9].includes(currentStep) ? '0 0 30px rgba(139, 92, 246, 0.2)' : 'none'
              }}
              className="w-28 h-28 rounded-3xl bg-slate-900 border-2 flex items-center justify-center relative transition-colors duration-500"
            >
              <Cpu className="w-12 h-12 text-slate-400" />
              <AnimatePresence>
                {currentStep === 3 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute -top-3 -right-3 bg-red-500 text-[10px] font-black px-3 py-1 rounded-full text-white shadow-lg"
                  >
                    PAUSED
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">AI Agent</span>
          </div>

          {/* Animated Arrows with Labels */}
          <div className="absolute inset-0 pointer-events-none">
            <AnimatePresence mode="wait">
              {/* Plugin -> Backend */}
              {currentStep === 1 && (
                <motion.div 
                  key="p-b"
                  initial={{ left: '15%', opacity: 0 }}
                  animate={{ left: '40%', opacity: 1 }}
                  exit={{ left: '45%', opacity: 0 }}
                  className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
                >
                  <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-[10px] font-bold text-amber-400 whitespace-nowrap">
                    {STEPS[1].label}
                  </div>
                  <ArrowRight className="w-8 h-8 text-amber-400" />
                </motion.div>
              )}
              {/* Backend -> Agent */}
              {currentStep === 2 && (
                <motion.div 
                  key="b-a"
                  initial={{ left: '50%', opacity: 0 }}
                  animate={{ left: '75%', opacity: 1 }}
                  exit={{ left: '80%', opacity: 0 }}
                  className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
                >
                  <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] font-bold text-emerald-400 whitespace-nowrap">
                    {STEPS[2].label}
                  </div>
                  <ArrowRight className="w-8 h-8 text-emerald-400" />
                </motion.div>
              )}
              {/* Backend -> Plugin (Poll Response) */}
              {currentStep === 5 && (
                <motion.div 
                  key="b-p"
                  initial={{ left: '45%', opacity: 0 }}
                  animate={{ left: '20%', opacity: 1 }}
                  exit={{ left: '15%', opacity: 0 }}
                  className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
                >
                  <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] font-bold text-emerald-400 whitespace-nowrap">
                    {STEPS[5].label}
                  </div>
                  <ArrowRight className="w-8 h-8 text-emerald-400 rotate-180" />
                </motion.div>
              )}
              {/* Plugin -> Backend (Respond) */}
              {currentStep === 6 && (
                <motion.div 
                  key="p-b-r"
                  initial={{ left: '15%', opacity: 0 }}
                  animate={{ left: '40%', opacity: 1 }}
                  exit={{ left: '45%', opacity: 0 }}
                  className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
                >
                  <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-[10px] font-bold text-amber-400 whitespace-nowrap">
                    {STEPS[6].label}
                  </div>
                  <ArrowRight className="w-8 h-8 text-amber-400" />
                </motion.div>
              )}
              {/* Backend -> Agent (Event Set) */}
              {currentStep === 7 && (
                <motion.div 
                  key="b-a-e"
                  initial={{ left: '50%', opacity: 0 }}
                  animate={{ left: '75%', opacity: 1 }}
                  exit={{ left: '80%', opacity: 0 }}
                  className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
                >
                  <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] font-bold text-emerald-400 whitespace-nowrap">
                    {STEPS[7].label}
                  </div>
                  <ArrowRight className="w-8 h-8 text-emerald-400" />
                </motion.div>
              )}
              {/* Backend -> Plugin (Final Actions) */}
              {currentStep === 9 && (
                <motion.div 
                  key="b-p-a"
                  initial={{ left: '45%', opacity: 0 }}
                  animate={{ left: '20%', opacity: 1 }}
                  exit={{ left: '15%', opacity: 0 }}
                  className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
                >
                  <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] font-bold text-emerald-400 whitespace-nowrap">
                    {STEPS[9].label}
                  </div>
                  <ArrowRight className="w-8 h-8 text-emerald-400 rotate-180" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Info & Code Area */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest">Step {currentStep + 1} / {STEPS.length}</span>
              <h3 className="text-2xl font-bold text-white tracking-tight">{step.title}</h3>
            </div>
            <button 
              onClick={() => setShowTechnical(!showTechnical)}
              className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 hover:text-amber-400 transition-colors uppercase tracking-widest"
            >
              <Info className="w-3 h-3" />
              {showTechnical ? 'Hide' : 'Show'} Technical Details
            </button>
          </div>
          
          <div className="space-y-4">
            <p className="text-slate-300 text-lg font-medium leading-relaxed">
              {step.desc}
            </p>
            
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50">
              <p className="text-slate-400 text-sm italic leading-relaxed">
                "{step.narration}"
              </p>
            </div>

            <AnimatePresence>
              {showTechnical && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 font-mono overflow-hidden"
                >
                  <span className="text-amber-500 font-bold uppercase tracking-widest text-[10px] block mb-1">Implementation Detail</span>
                  {step.technicalDetail}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 flex-wrap">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="p-3 bg-slate-800 text-white rounded-xl disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-700 transition-all active:scale-95"
              >
                <ArrowRight className="w-6 h-6 rotate-180" />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-8 py-3 rounded-xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400 transition-all active:scale-95 flex items-center gap-3 shadow-lg shadow-amber-500/20"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                {isPlaying ? 'PAUSE' : 'PLAY'}
              </button>
              <button
                onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
                disabled={currentStep === STEPS.length - 1}
                className="p-3 bg-slate-800 text-white rounded-xl disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-700 transition-all active:scale-95"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center gap-6">
              <button 
                onClick={handleRestart}
                className="p-3 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all active:scale-95"
                title="Restart"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
              <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800">
                {[0.5, 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${speed === s ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {s}X
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col shadow-2xl">
          <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{step.lang}</span>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/20" />
              <div className="w-2 h-2 rounded-full bg-amber-500/20" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
            </div>
          </div>
          <div className="p-8 font-mono text-sm overflow-x-auto flex-1 custom-scrollbar">
            <pre className="text-emerald-400/90 leading-relaxed">
              <code>{step.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
