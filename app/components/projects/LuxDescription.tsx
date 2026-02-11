'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, ExternalLink, Zap, ShieldCheck, BarChart3, Code2,
  Layers, X as XIcon, Play, Brain, Cpu, Globe, Terminal,
  ArrowRight, Package, Lock, Gauge, Radio, Shield, GitBranch
} from 'lucide-react';

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
            A production agentic AI system that lets game developers build, modify, and debug
            games entirely in plain English. Lux autonomously explores project structures, reads and writes code,
            and executes precise modifications inside Roblox Studio — all through a real-time SSE streaming connection.
          </p>
          <p className="text-slate-400 leading-relaxed">
            Three major architecture iterations. Started as a 22,000-line Lua monolith, evolved into a 3-layer system
            with a FastAPI backend and LangGraph agent, then rebuilt again with SSE streaming, Redis sessions, JWT
            authentication, encrypted API keys, a 3-stage validation pipeline, and diff-based script editing.
            Every version solved real engineering problems I hit at scale.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-8">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div className="text-2xl font-bold text-amber-400">1,500+</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Downloads</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div className="text-2xl font-bold text-emerald-400">v3.0</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Latest Release</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div className="text-2xl font-bold text-blue-400">3</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Arch Iterations</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div className="text-2xl font-bold text-purple-400">SSE</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Real-time Stream</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 col-span-2 md:col-span-1">
            <div className="text-2xl font-bold text-red-400">90%</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Token Reduction</div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/10">
            <Package className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">The Problem</h2>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 text-lg leading-relaxed">
            Roblox Studio has <span className="text-amber-400 font-bold">no native AI integration</span> and
            enforces a strict platform constraint: plugins can only make outbound HTTP requests.
            No WebSockets. No Server-Sent Events. No incoming connections of any kind.
            Traditional AI coding assistants (Copilot, Cursor) simply cannot work here.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/20">
              <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                <XIcon className="w-5 h-5" />
                Before: Manual Game Dev
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>&#8226; Read Roblox API docs for every property</li>
                <li>&#8226; Write Lua scripts from scratch</li>
                <li>&#8226; Debug by trial and error</li>
                <li>&#8226; No AI tools work inside Studio</li>
                <li>&#8226; Copy-paste from forums and hope</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                After: Lux
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>&#8226; Type &quot;Add a health bar with gradual regen&quot;</li>
                <li>&#8226; AI scans your project structure</li>
                <li>&#8226; Reads relevant scripts (hash-verified)</li>
                <li>&#8226; Generates precise modifications</li>
                <li>&#8226; You review and apply with one click</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The Polling Bridge Pattern */}
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
              This is the core architectural innovation. The AI agent can <em>pause mid-execution</em>,
              request data from the game engine, and <em>resume</em> once the plugin responds  -
              all over a one-way HTTP constraint. The plugin polls every 100ms; the backend uses{' '}
              <code className="text-amber-400 bg-slate-800/50 px-1.5 py-0.5 rounded text-xs">asyncio.Event()</code>{' '}
              to block until data arrives.{' '}
              <button
                onClick={() => toggleExpanded('polling-code')}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                [{expandedSections.has('polling-code') ? 'Hide' : 'Show'} Code &rarr;]
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
                  <div className="text-[10px] font-black text-emerald-500 uppercase mb-2">Python Backend</div>
                  <pre className="text-sm text-emerald-400/80 font-mono overflow-x-auto">
                    <code>{`# Agent needs data -creates event and BLOCKS
event = asyncio.Event()
session.fulfilled_responses[rid] = event
await asyncio.wait_for(event.wait(), timeout=30)

# When plugin responds via POST /respond:
event.set()  # WAKES THE AGENT
data = session.fulfilled_data.pop(rid)`}</code>
                  </pre>
                  <div className="mt-3 text-[10px] font-black text-amber-500 uppercase mb-2">Lua Plugin</div>
                  <pre className="text-sm text-amber-400/80 font-mono overflow-x-auto">
                    <code>{`-- Plugin polls every 100ms
while isProcessing do
    local pending = Backend.poll(sessionId)
    for _, req in ipairs(pending.requests) do
        local data = ScriptReader.handle(req)
        Backend.respond(sessionId, req.id, data)
    end
    task.wait(0.1)
end`}</code>
                  </pre>
                  <a
                    href="https://github.com/Seryozh/lux-agentic-ai/blob/main/backend/session.py"
                    target="_blank"
                    className="text-xs text-blue-400 hover:underline mt-2 inline-block"
                  >
                    View full implementation on GitHub &rarr;
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Animated Polling Bridge Visualization */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            <div className="relative p-6" style={{ minHeight: '280px' }}>
              <div className="text-[10px] font-black text-amber-400 uppercase tracking-wider mb-6">Live Architecture</div>

              {/* Three nodes with animated data flow */}
              <div className="flex justify-between items-start gap-2">
                {/* Plugin Node */}
                <div className="flex flex-col items-center gap-2 z-10">
                  <motion.div
                    animate={{ boxShadow: ['0 0 0px rgba(251,191,36,0)', '0 0 20px rgba(251,191,36,0.3)', '0 0 0px rgba(251,191,36,0)'] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                    className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-amber-500/30 flex items-center justify-center"
                  >
                    <Terminal className="w-7 h-7 text-amber-400" />
                  </motion.div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Plugin</span>
                  <span className="text-[8px] text-slate-600">Lua / Roblox</span>
                </div>

                {/* Backend Node */}
                <div className="flex flex-col items-center gap-2 z-10">
                  <motion.div
                    animate={{ boxShadow: ['0 0 0px rgba(16,185,129,0)', '0 0 20px rgba(16,185,129,0.3)', '0 0 0px rgba(16,185,129,0)'] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-emerald-500/30 flex items-center justify-center"
                  >
                    <Globe className="w-7 h-7 text-emerald-400" />
                  </motion.div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Backend</span>
                  <span className="text-[8px] text-slate-600">FastAPI</span>
                </div>

                {/* Agent Node */}
                <div className="flex flex-col items-center gap-2 z-10">
                  <motion.div
                    animate={{ boxShadow: ['0 0 0px rgba(139,92,246,0)', '0 0 20px rgba(139,92,246,0.3)', '0 0 0px rgba(139,92,246,0)'] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                    className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-purple-500/30 flex items-center justify-center"
                  >
                    <Brain className="w-7 h-7 text-purple-400" />
                  </motion.div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">AI Agent</span>
                  <span className="text-[8px] text-slate-600">LangGraph</span>
                </div>
              </div>

              {/* Flow steps */}
              <div className="mt-6 space-y-2">
                {[
                  { step: '1', text: 'User sends prompt via plugin', color: 'amber' },
                  { step: '2', text: 'Agent starts, needs project data', color: 'purple' },
                  { step: '3', text: 'Agent BLOCKS on asyncio.Event()', color: 'red' },
                  { step: '4', text: 'Plugin polls, gets request, reads game', color: 'amber' },
                  { step: '5', text: 'event.set() wakes agent, resumes', color: 'emerald' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0 ${
                      item.color === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                      item.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                      item.color === 'red' ? 'bg-red-500/20 text-red-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {item.step}
                    </div>
                    <span className="text-xs text-slate-400">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20 flex items-center gap-3">
                <span className="text-xs font-bold text-amber-400">LATENCY</span>
                <span className="text-xs text-amber-400/80">100-300ms round-trip despite one-way constraint</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agentic Tool System */}
      <section id="lux-tool-system" className="space-y-8 scroll-mt-24">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Cpu className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Progressive Tool Architecture</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-slate-300">
            <p>
              A naive approach would dump the entire project into context on every request  -
              that&apos;s <span className="text-red-400 font-bold">~65,000 tokens per request</span>.
              Instead, I designed a 3-level progressive exploration system where the agent starts cheap
              and only goes deeper when needed.{' '}
              <button
                onClick={() => toggleExpanded('tool-code')}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                [{expandedSections.has('tool-code') ? 'Hide' : 'Show'} Code &rarr;]
              </button>
            </p>

            <AnimatePresence>
              {expandedSections.has('tool-code') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 p-4 bg-slate-800/50 rounded-lg overflow-hidden"
                >
                  <pre className="text-sm text-slate-300 font-mono overflow-x-auto">
                    <code>{`# Tools bound to LLM via LangChain
llm_with_tools = llm.bind_tools([
    search_project,   # ~200 tokens
    list_children,    # ~100 tokens
    get_metadata,     # ~100 tokens
    get_full_script   # ~1,000 tokens (hash-verified)
])

# Agent calls tools progressively:
# 1. search_project("health bar") → finds PlayerScript
# 2. get_metadata("PlayerScript") → quick preview
# 3. get_full_script("PlayerScript") → full source + hash
# Only fetches what it actually needs.`}</code>
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-sm text-slate-400">
              The base cost is <span className="text-emerald-400 font-bold">~5,500 tokens/request</span> (project
              structure + conversation history). Tools execute in parallel via{' '}
              <code className="text-purple-400 bg-slate-800/50 px-1.5 py-0.5 rounded text-xs">asyncio.gather()</code>{' '}
              when the agent requests multiple at once.
            </p>
          </div>

          {/* Progressive hierarchy visualization */}
          <div className="space-y-3">
            {[
              {
                level: 'Level 1: Structure',
                desc: 'Top-level project map included in every request',
                cost: '~500 tokens',
                costLabel: 'FREE',
                color: 'emerald',
                tool: 'Project Map',
              },
              {
                level: 'Level 2: Discovery',
                desc: 'Semantic search, list children, get metadata',
                cost: '~100-200 tokens',
                costLabel: 'CHEAP',
                color: 'blue',
                tool: 'search / list / metadata',
              },
              {
                level: 'Level 3: Full Access',
                desc: 'Complete script source + content hash for verification',
                cost: '~1,000 tokens',
                costLabel: 'ON DEMAND',
                color: 'amber',
                tool: 'get_full_script',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="p-4 rounded-xl border flex items-start gap-4"
                style={{
                  backgroundColor: `color-mix(in srgb, var(--color-${item.color}-500) 5%, transparent)`,
                  borderColor: `color-mix(in srgb, var(--color-${item.color}-500) 20%, transparent)`,
                }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black ${
                  item.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                  item.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-amber-500/20 text-amber-400'
                }`}>
                  L{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{item.level}</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                      item.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                      item.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>{item.costLabel}</span>
                  </div>
                  <div className="text-xs text-slate-400">{item.desc}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="text-[10px] text-slate-500 bg-slate-800/50 px-1.5 py-0.5 rounded">{item.tool}</code>
                    <span className="text-[10px] text-slate-600">{item.cost}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Cost comparison callout */}
            <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-3">Token Cost Comparison</div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-red-400 font-bold">Naive approach</span>
                    <span className="text-red-400">65,000 tokens</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-red-500/40 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-emerald-400 font-bold">Lux progressive</span>
                    <span className="text-emerald-400">5,500 tokens</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-500/60 rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: '8.5%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3 text-center">
                <span className="text-lg font-black text-emerald-400">90% reduction</span>
                <span className="text-xs text-slate-500 block">in per-request token usage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8 Action Primitives */}
      <section id="lux-actions" className="space-y-8 scroll-mt-24">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Layers className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">8 Composable Action Primitives</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-slate-300">
            <p>
              Every game modification  - from adding a health bar to restructuring an entire
              codebase  - composes from 8 atomic operations. The AI generates a sequence of these
              actions; the user reviews them, then applies with one click.{' '}
              <button
                onClick={() => toggleExpanded('action-code')}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                [{expandedSections.has('action-code') ? 'Hide' : 'Show'} Example &rarr;]
              </button>
            </p>

            <AnimatePresence>
              {expandedSections.has('action-code') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 p-4 bg-slate-800/50 rounded-lg overflow-hidden"
                >
                  <pre className="text-sm text-slate-300 font-mono overflow-x-auto">
                    <code>{`// "Add a health bar" generates:
{
  "actions": [
    {
      "type": "create_instance",
      "target": "game.StarterGui",
      "class_name": "ScreenGui",
      "name": "HealthUI"
    },
    {
      "type": "create_instance",
      "target": "game.StarterGui.HealthUI",
      "class_name": "Frame",
      "name": "HealthBar",
      "properties": {
        "Size": [0, 200, 0, 30],    // → UDim2
        "BackgroundColor3": [34, 197, 94] // → Color3
      }
    },
    {
      "type": "create_script",
      "target": "game.StarterGui.HealthUI",
      "name": "HealthController",
      "source": "-- Script that updates bar width..."
    }
  ]
}`}</code>
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-sm text-slate-400">
              The type conversion system translates JSON arrays to Roblox types automatically:{' '}
              <code className="text-amber-400 bg-slate-800/50 px-1.5 py-0.5 rounded text-xs">[255,128,0]</code>{' '}
              &rarr; <code className="text-emerald-400 bg-slate-800/50 px-1.5 py-0.5 rounded text-xs">Color3.fromRGB()</code>,{' '}
              <code className="text-amber-400 bg-slate-800/50 px-1.5 py-0.5 rounded text-xs">[0,100,0,50]</code>{' '}
              &rarr; <code className="text-emerald-400 bg-slate-800/50 px-1.5 py-0.5 rounded text-xs">UDim2.new()</code>.
            </p>
          </div>

          {/* Action grid */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'set_property', desc: 'Modify attributes', icon: '🎨', color: 'amber' },
              { name: 'create_instance', desc: 'Add game objects', icon: '➕', color: 'emerald' },
              { name: 'delete_instance', desc: 'Remove objects', icon: '🗑️', color: 'red' },
              { name: 'move_instance', desc: 'Reparent in tree', icon: '📦', color: 'blue' },
              { name: 'clone_instance', desc: 'Duplicate objects', icon: '📋', color: 'purple' },
              { name: 'create_script', desc: 'Add new scripts', icon: '📝', color: 'emerald' },
              { name: 'modify_script', desc: 'Update code (hash)', icon: '✏️', color: 'amber' },
              { name: 'delete_script', desc: 'Remove scripts', icon: '❌', color: 'red' },
            ].map((action, i) => (
              <motion.div
                key={i}
                className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="text-lg mb-1">{action.icon}</div>
                <code className={`text-[10px] font-bold ${
                  action.color === 'amber' ? 'text-amber-400' :
                  action.color === 'emerald' ? 'text-emerald-400' :
                  action.color === 'red' ? 'text-red-400' :
                  action.color === 'blue' ? 'text-blue-400' :
                  'text-purple-400'
                }`}>{action.name}</code>
                <div className="text-[10px] text-slate-500 mt-0.5">{action.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architectural Transformation */}
      <section id="lux-refactor" className="space-y-8 scroll-mt-24">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">v1 &rarr; v2 &rarr; v3 Evolution</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-slate-300">
            <p>
              Version 1 was a <span className="text-red-400 font-bold">22,000-line monolithic Lua file</span>.
              Everything lived together: AI logic, API calls, project scanning, action execution.
              API keys were exposed in client code. It worked, but it was fragile, untestable, and insecure.
            </p>
            <p>
              Version 2 is a clean 3-layer architecture:{' '}
              <span className="text-amber-400 font-bold">Lua plugin</span> (UI + execution),{' '}
              <span className="text-emerald-400 font-bold">FastAPI backend</span> (orchestration + security),{' '}
              <span className="text-purple-400 font-bold">LangGraph agent</span> (AI reasoning).{' '}
              <button
                onClick={() => toggleExpanded('refactor-code')}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                [{expandedSections.has('refactor-code') ? 'Hide' : 'Show'} Code &rarr;]
              </button>
            </p>

            <AnimatePresence>
              {expandedSections.has('refactor-code') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 p-4 bg-slate-800/50 rounded-lg overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] font-black text-red-500 uppercase mb-2">V1: API Key in Client</div>
                      <pre className="text-xs text-red-400/70 font-mono bg-slate-950 p-3 rounded border border-red-500/20">
                        <code>{`-- Lua (Client)
HttpService:PostAsync(
  "api.openai.com/v1/...",
  { ["Authorization"] =
    "Bearer " .. API_KEY }
)
-- KEY EXPOSED ⚠️`}</code>
                      </pre>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-emerald-500 uppercase mb-2">V2: Secure Backend</div>
                      <pre className="text-xs text-emerald-400/80 font-mono bg-slate-950 p-3 rounded border border-emerald-500/20">
                        <code>{`# Python (Backend)
@router.post("/chat")
async def chat(req):
    agent = create_agent(
        settings.OPENROUTER_KEY
    )
    return await agent.ainvoke(
        req.message
    )`}</code>
                      </pre>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Visual transformation */}
          <div className="space-y-4">
            <motion.div
              className="p-5 rounded-xl bg-red-500/5 border border-red-500/20"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
                  <XIcon className="w-4 h-4" />
                  Version 1
                </h3>
                <span className="text-xs text-red-400/60">Monolith</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 bg-red-500/30 rounded-full flex-1" />
                <span className="text-xs text-red-400 font-bold whitespace-nowrap">22,000 LOC</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-2">1 file &bull; API keys exposed &bull; No sessions &bull; Untestable</div>
            </motion.div>

            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <ArrowRight className="w-5 h-5 text-slate-600 rotate-90" />
              </motion.div>
            </div>

            <motion.div
              className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Version 2
                </h3>
                <span className="text-xs text-emerald-400/60">3-Layer Architecture</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-3 bg-amber-500/30 rounded-full" style={{ width: '64%' }} />
                  <span className="text-[10px] text-amber-400 font-bold whitespace-nowrap">Lua: 1,424 LOC</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 bg-emerald-500/30 rounded-full" style={{ width: '36%' }} />
                  <span className="text-[10px] text-emerald-400 font-bold whitespace-nowrap">Python: 813 LOC</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 mt-2">3 layers &bull; BYOK model &bull; Polling bridge &bull; Testable</div>
            </motion.div>

            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <ArrowRight className="w-5 h-5 text-slate-600 rotate-90" />
              </motion.div>
            </div>

            <motion.div
              className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/20"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2">
                  <Radio className="w-4 h-4" />
                  Version 3
                </h3>
                <span className="text-xs text-blue-400/60">Production-Grade</span>
              </div>
              <div className="space-y-1 text-[10px] text-slate-400">
                <div>&#8226; SSE streaming (replaces polling for server→plugin)</div>
                <div>&#8226; Redis-backed sessions &bull; JWT auth &bull; Fernet-encrypted API keys</div>
                <div>&#8226; 3-stage validation: Schema → Lua syntax → Hash injection</div>
                <div>&#8226; Diff-based editing (search/replace, not full overwrite)</div>
                <div>&#8226; Rollback support &bull; Modular UI components &bull; Debug tooling</div>
              </div>
            </motion.div>
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
              When the AI modifies a script, it must prove the file hasn&apos;t changed since it was read.
              An MD5 content hash is captured at read time and verified before writing.
              If a human edited the file while the AI was processing, the modification is{' '}
              <span className="text-red-400 font-bold">rejected</span>  - preventing data loss.{' '}
              <button
                onClick={() => toggleExpanded('hash-code')}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                [{expandedSections.has('hash-code') ? 'Hide' : 'Show'} Code &rarr;]
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
                    <code>{`-- Lua (Executor)
if computeHash(script.Source) == action.original_hash then
    script.Source = action.new_source  -- Apply ✓
else
    warn("Concurrent edit detected!")  -- Reject ✗
end`}</code>
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>

            <ul className="space-y-3">
              {[
                'Agent reads script + captures content hash',
                'Agent generates modification with original_hash',
                'Executor verifies current hash matches',
                'Mismatch = rejection (no silent overwrites)',
              ].map((step, i) => (
                <li key={i} className="flex gap-3 items-start text-sm">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {/* Animated hash flow */}
          <div className="bg-slate-950 rounded-xl p-6 border border-slate-800">
            <div className="space-y-4">
              {[
                { label: 'get_full_script', detail: 'hash: a3f2c1...', color: 'slate', icon: '📖' },
                { label: 'Agent analyzes', detail: 'generates new code', color: 'purple', icon: '🧠' },
                { label: 'modify_script', detail: 'verify: a3f2c1...', color: 'blue', icon: '✏️' },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                >
                  <div className="flex justify-between items-center p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
                      <span>{item.icon}</span>
                      {item.label}
                    </span>
                    <span className={`text-xs font-mono ${
                      item.color === 'purple' ? 'text-purple-400' :
                      item.color === 'blue' ? 'text-blue-400' :
                      'text-emerald-400'
                    }`}>{item.detail}</span>
                  </div>
                  {i < 2 && (
                    <div className="flex justify-center py-1">
                      <div className="w-0.5 h-4 bg-slate-800" />
                    </div>
                  )}
                </motion.div>
              ))}

              <motion.div
                className="flex justify-center py-1"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="w-0.5 h-4 bg-slate-800" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 gap-2"
              >
                <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-center">
                  <span className="text-xs font-bold text-emerald-400 uppercase">Hash Match</span>
                  <div className="text-[10px] text-emerald-400/70 mt-1">Changes applied</div>
                </div>
                <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20 text-center">
                  <span className="text-xs font-bold text-red-400 uppercase">Mismatch</span>
                  <div className="text-[10px] text-red-400/70 mt-1">Edit rejected</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Lock className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Security & Session Architecture</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-slate-300">
            <p>
              Users bring their own API key (BYOK). In v3, keys are encrypted at rest using{' '}
              <span className="text-emerald-400 font-bold">Fernet symmetric encryption</span>,
              sessions are stored in <span className="text-blue-400 font-bold">Redis</span> with
              TTL-based expiry, and all endpoints are protected by{' '}
              <span className="text-purple-400 font-bold">JWT authentication</span>.
            </p>
            <ul className="space-y-3">
              {[
                'Fernet-encrypted API keys at rest (not plaintext)',
                'Redis-backed sessions with automatic TTL cleanup',
                'JWT auth on all API endpoints',
                '3-stage validation: Schema → Lua syntax → Hash injection',
                'All modifications require explicit user approval',
              ].map((step, i) => (
                <li key={i} className="flex gap-3 items-start text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-950 rounded-xl p-6 border border-slate-800">
            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-wider mb-4">Security Architecture</div>
            <div className="space-y-3">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-xs font-bold text-amber-400 mb-1">Plugin (Client)</div>
                <div className="text-[11px] text-slate-400">Lua UI + execution &bull; Key stored locally in plugin settings</div>
              </div>
              <div className="flex justify-center">
                <div className="w-0.5 h-6 bg-slate-800" />
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-xs font-bold text-emerald-400 mb-1">Backend (FastAPI)</div>
                <div className="text-[11px] text-slate-400">Key in session memory only &bull; TTL cleanup &bull; No disk writes</div>
              </div>
              <div className="flex justify-center">
                <div className="w-0.5 h-6 bg-slate-800" />
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-xs font-bold text-purple-400 mb-1">OpenRouter (LLM Gateway)</div>
                <div className="text-[11px] text-slate-400">Gemini Flash &bull; Claude &bull; GPT-4 &bull; User-selectable</div>
              </div>
              <div className="flex justify-center">
                <div className="w-0.5 h-6 bg-slate-800" />
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <div className="text-xs font-bold text-emerald-400 mb-1">Deployment</div>
                <div className="text-[11px] text-emerald-400/80">Railway cloud &bull; Auto-scaling &bull; Roblox Creator Store distribution</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* By the Numbers */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-500/10">
            <Gauge className="w-6 h-6 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">By the Numbers</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: '1,500+', label: 'Active Installs', color: 'text-amber-400' },
            { value: 'v3', label: 'Architecture Gen', color: 'text-white' },
            { value: '8', label: 'Action Primitives', color: 'text-blue-400' },
            { value: '5', label: 'Agent Tools', color: 'text-purple-400' },
            { value: 'SSE', label: 'Streaming Layer', color: 'text-amber-400' },
            { value: 'Redis', label: 'Session Store', color: 'text-emerald-400' },
            { value: 'JWT', label: 'Auth System', color: 'text-blue-400' },
            { value: '30s', label: 'Tool Timeout', color: 'text-red-400' },
            { value: 'Fernet', label: 'Key Encryption', color: 'text-purple-400' },
            { value: '1M', label: 'Context Window', color: 'text-slate-300' },
            { value: '0', label: 'Data Retained', color: 'text-emerald-400' },
            { value: '90%', label: 'Token Savings', color: 'text-amber-400' },
          ].map((metric) => (
            <div key={metric.label} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className={`text-lg font-bold ${metric.color}`}>{metric.value}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{metric.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* See it in action */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6">
        <h3 className="text-2xl font-bold text-white">See the Architecture in Action</h3>
        <p className="text-slate-400 max-w-xl mx-auto">
          Watch the polling bridge pattern work in real-time. The interactive simulation
          visualizes every step: user prompt, agent reasoning, data requests, event
          signaling, and final action generation.
        </p>
        <button
          onClick={() => {
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
          href="https://github.com/Seryozh/RobloxAgenticAI"
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
