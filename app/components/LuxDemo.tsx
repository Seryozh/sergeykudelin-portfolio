'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ArrowRight, Cpu, Globe, Terminal } from 'lucide-react';

const STEPS = [
  { 
    id: 0, 
    title: 'Initial State', 
    desc: 'System is idle, awaiting user input.',
    code: '-- Awaiting input...',
    lang: 'lua'
  },
  { 
    id: 1, 
    title: 'User Sends Request', 
    desc: 'User types: "Add a health bar". Plugin sends request to Backend.',
    code: 'Backend.sendChat(sessionId, "Add a health bar", projectMap, apiKey)',
    lang: 'lua'
  },
  { 
    id: 2, 
    title: 'Backend Invokes Agent', 
    desc: 'Backend starts AI agent processing using LangGraph.',
    code: 'agent_response = await run_agent(session, user_message)',
    lang: 'python'
  },
  { 
    id: 3, 
    title: 'Agent Blocks on Event', 
    desc: 'Agent needs PlayerScript to proceed. It creates an event and blocks.',
    code: 'await asyncio.wait_for(event.wait(), timeout=30)  # BLOCKS HERE',
    lang: 'python'
  },
  { 
    id: 4, 
    title: 'Plugin Polls', 
    desc: 'Plugin polls every 100ms: "Do you need anything?"',
    code: 'local pollData = Backend.poll(sessionId)\ntask.wait(0.1)  -- 100ms',
    lang: 'lua'
  },
  { 
    id: 5, 
    title: 'Plugin Receives Request', 
    desc: 'Backend responds to poll with the pending data request.',
    code: '{\n  "pending_requests": [\n    {"type": "get_full_script", "target": "PlayerScript"}\n  ]\n}',
    lang: 'json'
  },
  { 
    id: 6, 
    title: 'Plugin Responds', 
    desc: 'Plugin reads script from game and sends it back to Backend.',
    code: 'Backend.respond(sessionId, requestId, {\n    source = source,\n    hash = hash\n})',
    lang: 'lua'
  },
  { 
    id: 7, 
    title: 'Event Triggers', 
    desc: 'Backend triggers event.set(), waking the blocked agent.',
    code: 'event = session.fulfilled_responses[request_id]\nevent.set()  # WAKES THE AGENT',
    lang: 'python'
  },
  { 
    id: 8, 
    title: 'Agent Continues', 
    desc: 'Agent resumes with the data and generates final actions.',
    code: 'data = session.fulfilled_data.pop(request_id)\n# ... generates actions ...',
    lang: 'python'
  },
  { 
    id: 9, 
    title: 'Response Sent', 
    desc: 'Agent sends response with generated actions to the Plugin.',
    code: '{\n  "message": "I\'ll add a health bar...",\n  "actions": [{ "type": "create_instance", ... }]\n}',
    lang: 'json'
  },
  { 
    id: 10, 
    title: 'Complete', 
    desc: 'User reviews and applies actions. Task finished.',
    code: '-- Task Complete',
    lang: 'lua'
  }
];

export default function LuxDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

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
    }, 3000 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const step = STEPS[currentStep];

  return (
    <div className="space-y-8">
      {/* Visualization Area */}
      <div className="bg-slate-950 rounded-2xl p-8 border border-slate-800 relative overflow-hidden min-h-[400px] flex flex-col justify-center">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <div className="relative flex justify-between items-center max-w-3xl mx-auto w-full">
          {/* Plugin */}
          <div className="flex flex-col items-center gap-4 z-10">
            <motion.div 
              animate={{ 
                borderColor: [1, 4, 5, 6, 10].includes(currentStep) ? '#fbbf24' : '#1e293b',
                scale: [1, 4, 5, 6, 10].includes(currentStep) ? 1.05 : 1
              }}
              className="w-24 h-24 rounded-2xl bg-slate-900 border-2 flex items-center justify-center shadow-xl"
            >
              <Terminal className="w-10 h-10 text-slate-400" />
            </motion.div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Plugin (Lua)</span>
          </div>

          {/* Backend */}
          <div className="flex flex-col items-center gap-4 z-10">
            <motion.div 
              animate={{ 
                borderColor: [1, 2, 5, 7, 9].includes(currentStep) ? '#10b981' : '#1e293b',
                scale: [1, 2, 5, 7, 9].includes(currentStep) ? 1.05 : 1
              }}
              className="w-24 h-24 rounded-2xl bg-slate-900 border-2 flex items-center justify-center shadow-xl"
            >
              <Globe className="w-10 h-10 text-slate-400" />
            </motion.div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Backend (API)</span>
          </div>

          {/* Agent */}
          <div className="flex flex-col items-center gap-4 z-10">
            <motion.div 
              animate={{ 
                borderColor: [2, 3, 7, 8, 9].includes(currentStep) ? '#8b5cf6' : '#1e293b',
                scale: [2, 3, 7, 8, 9].includes(currentStep) ? 1.05 : 1,
                backgroundColor: currentStep === 3 ? '#450a0a' : '#0f172a'
              }}
              className="w-24 h-24 rounded-2xl bg-slate-900 border-2 flex items-center justify-center shadow-xl relative"
            >
              <Cpu className="w-10 h-10 text-slate-400" />
              {currentStep === 3 && (
                <motion.div 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-[10px] font-black px-2 py-1 rounded-md text-white"
                >
                  BLOCKED
                </motion.div>
              )}
            </motion.div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">AI Agent</span>
          </div>

          {/* Animated Arrows */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Plugin -> Backend */}
            {currentStep === 1 && (
              <motion.div 
                initial={{ left: '15%', opacity: 0 }}
                animate={{ left: '45%', opacity: 1 }}
                className="absolute top-1/2 -translate-y-12 w-8 h-8 text-amber-400"
              >
                <ArrowRight className="w-8 h-8" />
              </motion.div>
            )}
            {/* Backend -> Agent */}
            {currentStep === 2 && (
              <motion.div 
                initial={{ left: '50%', opacity: 0 }}
                animate={{ left: '80%', opacity: 1 }}
                className="absolute top-1/2 -translate-y-12 w-8 h-8 text-emerald-400"
              >
                <ArrowRight className="w-8 h-8" />
              </motion.div>
            )}
            {/* Backend -> Plugin (Poll Response) */}
            {currentStep === 5 && (
              <motion.div 
                initial={{ left: '45%', opacity: 0 }}
                animate={{ left: '15%', opacity: 1 }}
                className="absolute top-1/2 -translate-y-12 w-8 h-8 text-emerald-400 rotate-180"
              >
                <ArrowRight className="w-8 h-8" />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Info & Code Area */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-xs font-bold">STEP {currentStep + 1}</span>
            <h3 className="text-xl font-bold text-white">{step.title}</h3>
          </div>
          <p className="text-slate-400 leading-relaxed">
            {step.desc}
          </p>
          
          {/* Controls */}
          <div className="flex items-center gap-4 pt-4">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button 
              onClick={() => { setCurrentStep(0); setIsPlaying(false); }}
              className="p-3 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
            <div className="flex bg-slate-800 rounded-lg p-1">
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors ${speed === s ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
          <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{step.lang}</span>
          </div>
          <div className="p-6 font-mono text-sm overflow-x-auto flex-1">
            <pre className="text-emerald-400">
              <code>{step.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
