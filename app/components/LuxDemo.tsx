'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ArrowRight, Cpu, Globe, Terminal, Info } from 'lucide-react';

const STEPS = [
  { 
    id: 0, 
    title: 'Initial State', 
    desc: 'System is idle, awaiting user input.',
    narration: 'The system is ready. Both the game plugin and the AI backend are standing by.',
    technicalDetail: 'Backend: FastAPI server running; Plugin: Lua event loop active.',
    code: '-- Awaiting input...',
    lang: 'lua'
  },
  { 
    id: 1, 
    title: 'User Sends Request', 
    desc: 'User types: "Add a health bar". Plugin sends request to Backend.',
    narration: 'The user asks for a new feature. The plugin packages this request and sends it to our cloud backend.',
    technicalDetail: 'HTTP POST request with session_id and user_prompt.',
    code: 'Backend.sendChat(sessionId, "Add a health bar", projectMap, apiKey)',
    lang: 'lua'
  },
  { 
    id: 2, 
    title: 'Backend Invokes Agent', 
    desc: 'Backend starts AI agent processing using LangGraph.',
    narration: 'The backend receives the request and hands it off to the AI Agent, which begins planning the necessary steps.',
    technicalDetail: 'LangGraph orchestration starts a new stateful thread.',
    code: 'agent_response = await run_agent(session, user_message)',
    lang: 'python'
  },
  { 
    id: 3, 
    title: 'Agent Pauses & Waits', 
    desc: 'The AI needs more information before it can continue.',
    narration: 'Think of it like hitting a roadblock: "I need to see the player script before I can help. Let me wait here until it arrives."',
    technicalDetail: 'Implemented via asyncio.Event() with 30s timeout. The thread is suspended.',
    code: 'await asyncio.wait_for(event.wait(), timeout=30)  # BLOCKS HERE',
    lang: 'python'
  },
  { 
    id: 4, 
    title: 'Plugin Polls', 
    desc: 'Plugin polls every 100ms: "Do you need anything?"',
    narration: 'Since the game cannot receive incoming calls, the plugin "checks in" every 100ms to see if the AI has any questions.',
    technicalDetail: 'Standard polling loop to bypass one-way HTTP constraint.',
    code: 'local pollData = Backend.poll(sessionId)\ntask.wait(0.1)  -- 100ms',
    lang: 'lua'
  },
  { 
    id: 5, 
    title: 'Plugin Receives Request', 
    desc: 'Backend responds to poll with the pending data request.',
    narration: 'The backend tells the plugin: "Yes! I need the source code for the PlayerScript."',
    technicalDetail: 'Poll response contains a list of pending_requests for the client.',
    code: '{\n  "pending_requests": [\n    {"type": "get_full_script", "target": "PlayerScript"}\n  ]\n}',
    lang: 'json'
  },
  { 
    id: 6, 
    title: 'Plugin Responds', 
    desc: 'Plugin reads script from game and sends it back to Backend.',
    narration: 'The plugin reads the script directly from the game engine and sends it back to the cloud.',
    technicalDetail: 'HTTP POST to /respond with script content and MD5 hash.',
    code: 'Backend.respond(sessionId, requestId, {\n    source = source,\n    hash = hash\n})',
    lang: 'lua'
  },
  { 
    id: 7, 
    title: 'Event Triggers', 
    desc: 'Backend triggers event.set(), waking the blocked agent.',
    narration: 'The data has arrived! The backend "wakes up" the AI agent so it can finish its work.',
    technicalDetail: 'event.set() is called, allowing the suspended asyncio task to resume.',
    code: 'event = session.fulfilled_responses[request_id]\nevent.set()  # WAKES THE AGENT',
    lang: 'python'
  },
  { 
    id: 8, 
    title: 'Agent Continues', 
    desc: 'Agent resumes with the data and generates final actions.',
    narration: 'The AI now has the code it needed. It analyzes it and generates the final set of game modifications.',
    technicalDetail: 'Agent state is updated with tool output; LangGraph proceeds to next node.',
    code: 'data = session.fulfilled_data.pop(request_id)\n# ... generates actions ...',
    lang: 'python'
  },
  { 
    id: 9, 
    title: 'Response Sent', 
    desc: 'Agent sends response with generated actions to the Plugin.',
    narration: 'The AI is done! It sends back a list of actions, like "Create a UI Frame" and "Update this script."',
    technicalDetail: 'Final response includes a list of structured Action objects.',
    code: '{\n  "message": "I\'ll add a health bar...",\n  "actions": [{ "type": "create_instance", ... }]\n}',
    lang: 'json'
  },
  { 
    id: 10, 
    title: 'Complete', 
    desc: 'User reviews and applies actions. Task finished.',
    narration: 'The user sees the proposed changes, clicks "Apply", and the game is updated instantly.',
    technicalDetail: 'Client-side execution of the action list via Lua executor.',
    code: '-- Task Complete',
    lang: 'lua'
  }
];

export default function LuxDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showTechnical, setShowTechnical] = useState(false);

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

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

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
                  PAUSED
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-xs font-bold">STEP {currentStep + 1}</span>
              <h3 className="text-xl font-bold text-white">{step.title}</h3>
            </div>
            <button 
              onClick={() => setShowTechnical(!showTechnical)}
              className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-amber-400 transition-colors"
            >
              <Info className="w-3 h-3" />
              {showTechnical ? 'Hide' : 'Show'} Technical Details
            </button>
          </div>
          
          <p className="text-slate-300 font-medium leading-relaxed">
            {step.desc}
          </p>
          
          <p className="text-slate-400 text-sm italic leading-relaxed border-l-2 border-slate-800 pl-4">
            {step.narration}
          </p>

          {showTechnical && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 text-xs text-slate-400 font-mono"
            >
              <span className="text-amber-500 font-bold">Technical:</span> {step.technicalDetail}
            </motion.div>
          )}
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="p-2 bg-slate-800 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-6 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors flex items-center gap-2"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
                disabled={currentStep === STEPS.length - 1}
                className="p-2 bg-slate-800 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={handleRestart}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Restart"
              >
                <RotateCcw className="w-5 h-5" />
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
