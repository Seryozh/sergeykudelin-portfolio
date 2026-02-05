'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ExternalLink, Zap, ShieldCheck, BarChart3, Code2, Layers, X as XIcon, Play } from 'lucide-react';

interface LuxDescriptionProps {
  onOpenDemo?: () => void;
}

export default function LuxDescription({ onOpenDemo }: LuxDescriptionProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Handle scroll to update URL hash
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['lux-polling-bridge', 'lux-refactor', 'lux-hash-verification'];
      const visibleSection = sections.find(id => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= window.innerHeight / 2;
      });
      if (visibleSection && window.location.hash !== `#${visibleSection}`) {
        window.history.replaceState(null, '', `#${visibleSection}`);
      }
    };

    const container = document.querySelector('.custom-scrollbar');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium">
          <Zap className="w-4 h-4" />
          1,500+ Active Installations
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Lux
        </h1>
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-xl text-slate-300 leading-relaxed">
            Lux is a production-grade AI agent designed to bridge the gap between natural language and complex game engine APIs. 
            It allows developers to build, modify, and debug games in plain English by autonomously analyzing project structures and executing precise modifications.
          </p>
          <p className="text-slate-400 leading-relaxed">
            Originally built as a monolithic assistant, Lux v2.0 represents a complete architectural overhaul. 
            It solves the critical challenge of bidirectional communication on platforms with strict one-way HTTP constraints, 
            enabling a seamless "human-in-the-loop" experience where the AI can ask questions and request data mid-execution.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-8">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div className="text-2xl font-bold text-amber-400">1,500+</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Downloads</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div className="text-2xl font-bold text-emerald-400">v2.0</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Latest Release</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 col-span-2 md:col-span-1">
            <div className="text-2xl font-bold text-blue-400">100-300ms</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Tool Latency</div>
          </div>
        </div>
      </section>

      {/* The Architectural Refactor */}
      <section id="lux-refactor" className="space-y-8 scroll-mt-24">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Layers className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">The Architectural Transformation</h2>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 text-lg leading-relaxed">
            The first version of Lux was a 22,000-line monolithic Lua plugin. Everything lived
            in one file: AI logic, project scanning, action execution, even API calls. It worked,
            but it was fragile, hard to debug, and exposed API keys in client code.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            {/* Before */}
            <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/20">
              <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                <XIcon className="w-5 h-5" />
                Version 1: Monolith
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• 22,000 lines of Lua (one file)</li>
                <li>• API keys exposed in client</li>
                <li>• No session management</li>
                <li>• Fragile error handling</li>
                <li>• Hard to test/debug</li>
              </ul>
            </div>

            {/* After */}
            <div className="p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Version 2: Clean Architecture
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• 2,237 lines total (3 layers)</li>
                <li>• Lua: UI & execution (1,424 LOC)</li>
                <li>• FastAPI: Orchestration (813 LOC)</li>
                <li>• LangGraph: AI agent logic</li>
                <li>• Secure, testable, maintainable</li>
              </ul>
            </div>
          </div>

          <p className="text-slate-300 text-lg leading-relaxed">
            The refactor took the system from "it works on my machine" to production-ready. 
            By separating concerns, I achieved a{' '}
            <span className="text-emerald-400 font-bold">90% reduction in code complexity</span>.
            API keys stay server-side, sessions are managed with TTL-based cleanup, and
            the polling bridge pattern enables real-time communication.
            {' '}
            <button
              onClick={() => toggleExpanded('refactor-comparison')}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              [{expandedSections.has('refactor-comparison') ? 'Hide' : 'Show'} Comparison →]
            </button>
          </p>

          <AnimatePresence>
            {expandedSections.has('refactor-comparison') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 p-4 bg-slate-800/50 rounded-lg overflow-hidden"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase mb-2">V1: Monolithic API Call</div>
                    <pre className="text-xs text-slate-400 font-mono bg-slate-950 p-3 rounded border border-slate-800">
                      <code>{`-- Lua (Client)
local response = HttpService:PostAsync(
    "https://api.openai.com/v1/chat/completions",
    HttpService:JSONEncode({
        model = "gpt-4",
        messages = { ... },
        -- API KEY EXPOSED HERE
    }),
    Enum.HttpContentType.ApplicationJson,
    false,
    { ["Authorization"] = "Bearer " .. API_KEY }
)`}</code>
                    </pre>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-emerald-500 uppercase mb-2">V2: Secure Orchestration</div>
                    <pre className="text-xs text-emerald-400/80 font-mono bg-slate-950 p-3 rounded border border-emerald-500/20">
                      <code>{`# Python (Backend)
@router.post("/chat")
async def chat(request: ChatRequest):
    # API Key is secure in env vars
    agent = create_lux_agent(settings.OPENROUTER_KEY)
    return await agent.ainvoke(request.message)`}</code>
                    </pre>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* The Polling Bridge */}
      <section id="lux-polling-bridge" className="space-y-8 scroll-mt-24">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <Code2 className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">The Polling Bridge Pattern</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-slate-300">
            <p>
              Roblox plugins face a strict platform constraint: they can only make <strong>outbound</strong> HTTP requests. They cannot receive incoming connections or use WebSockets.
            </p>
            <p>
              I engineered a{' '}
              <a
                href="#lux-polling-bridge"
                className="text-amber-400 underline hover:text-amber-300"
              >
                polling bridge pattern
              </a>
              {' '}that enables bidirectional communication over this one-way constraint.{' '}
              <button
                onClick={() => toggleExpanded('polling-code')}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                [{expandedSections.has('polling-code') ? 'Hide' : 'Show'} Code →]
              </button>
            </p>

            <AnimatePresence>
              {expandedSections.has('polling-code') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 p-4 bg-slate-800/50 rounded-lg overflow-hidden"
                >
                  <pre className="text-sm text-slate-300 font-mono overflow-x-auto">
                    <code>{`# Python backend
event = asyncio.Event()
session.fulfilled_responses[rid] = event

# Agent blocks until plugin responds
await asyncio.wait_for(event.wait(), timeout=30)

# When plugin responds via /respond:
event.set()  # WAKES THE AGENT`}</code>
                  </pre>
                  <a
                    href="https://github.com/Seryozh/lux-agentic-ai/blob/main/backend/session.py"
                    target="_blank"
                    className="text-xs text-blue-400 hover:underline mt-2 inline-block"
                  >
                    View full implementation on GitHub →
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 font-mono text-sm">
            <div className="text-slate-500 mb-4"># Backend (Python)</div>
            <div className="text-blue-400">await</div> <div className="text-white">asyncio.wait_for(</div>
            <div className="pl-4 text-white">event.wait(),</div>
            <div className="pl-4 text-white">timeout=</div><div className="text-amber-400 inline">30</div>
            <div className="text-white">)</div>
            <div className="mt-6 text-slate-500 mb-4">-- Plugin (Lua)</div>
            <div className="text-blue-400">while</div> <div className="text-white">isProcessing</div> <div className="text-blue-400">do</div>
            <div className="pl-4 text-white">local data = Backend.poll(id)</div>
            <div className="pl-4 text-white">task.wait(</div><div className="text-amber-400 inline">0.1</div><div className="text-white">)</div>
            <div className="text-blue-400">end</div>
          </div>
        </div>
      </section>

      {/* Hash Verification */}
      <section id="lux-hash-verification" className="space-y-8 scroll-mt-24">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Hash-Verified Modifications</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-slate-300">
            <p>
              To prevent concurrent edit conflicts, I architected a hash-verification system using MD5 content hashing.
              {' '}
              <button
                onClick={() => toggleExpanded('hash-code')}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                [{expandedSections.has('hash-code') ? 'Hide' : 'Show'} Code →]
              </button>
            </p>

            <AnimatePresence>
              {expandedSections.has('hash-code') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 p-4 bg-slate-800/50 rounded-lg overflow-hidden"
                >
                  <pre className="text-sm text-slate-300 font-mono overflow-x-auto">
                    <code>{`# Python (Action Generation)
action = ModifyScriptAction(
    path=script_path,
    new_source=new_code,
    original_hash=current_hash  # Captured before editing
)`}</code>
                  </pre>
                  <pre className="text-sm text-emerald-400/80 font-mono overflow-x-auto mt-2">
                    <code>{`-- Lua (Execution)
if computeHash(script.Source) == action.original_hash then
    script.Source = action.new_source
else
    warn("Concurrent edit detected!")
end`}</code>
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>

            <ul className="space-y-3">
              {[
                'Agent reads script source and hash',
                'Agent generates modification action',
                'Executor verifies current hash matches original',
                'Changes applied only on successful match'
              ].map((step, i) => (
                <li key={i} className="flex gap-3 items-start text-sm">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-950 rounded-xl p-6 border border-slate-800">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-xs font-mono text-slate-400">get_full_script</span>
                <span className="text-xs font-mono text-emerald-400">hash: a3f2c1...</span>
              </div>
              <div className="flex justify-center">
                <div className="w-0.5 h-8 bg-slate-800" />
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-xs font-mono text-slate-400">modify_script</span>
                <span className="text-xs font-mono text-blue-400">verify: a3f2c1...</span>
              </div>
              <div className="flex justify-center">
                <div className="w-0.5 h-8 bg-slate-800" />
              </div>
              <div className="flex justify-between items-center p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <span className="text-xs font-bold text-emerald-400 uppercase">Success</span>
                <span className="text-xs text-emerald-400/80">Changes Applied</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Try it out section */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6">
        <h3 className="text-2xl font-bold text-white">See the Architecture in Action</h3>
        <p className="text-slate-400 max-w-xl mx-auto">
          The best way to understand the Polling Bridge pattern is to watch it work. 
          I've built an interactive simulation that visualizes the real-time communication between the game engine and the AI agent.
        </p>
        <button 
          onClick={() => {
            console.log('Opening demo from description...');
            onOpenDemo?.();
          }}
          className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-slate-950 rounded-xl font-bold hover:bg-amber-400 transition-all group"
        >
          Launch Interactive Demo
          <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
        </button>
      </section>

      {/* CTA */}
      <section className="pt-12 border-t border-slate-800 flex flex-col md:flex-row gap-4 justify-center">
        <a 
          href="https://github.com/Seryozh/lux-agentic-ai" 
          target="_blank" 
          className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-amber-400 transition-colors"
        >
          View on GitHub
          <ExternalLink className="w-4 h-4" />
        </a>
      </section>
    </div>
  );
}
