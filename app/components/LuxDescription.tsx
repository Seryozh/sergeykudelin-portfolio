'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ExternalLink, Zap, ShieldCheck, BarChart3, Code2 } from 'lucide-react';

export default function LuxDescription() {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium">
          <Zap className="w-4 h-4" />
          1,500+ Active Installations
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Lux (Luxembourg)
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          A production AI system that lets developers build games in plain English. 
          Describe what you want, and an autonomous agent analyzes your project, 
          generates code, and executes changes—all in real-time.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-8">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div className="text-2xl font-bold text-amber-400">1,500+</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Downloads</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div className="text-2xl font-bold text-emerald-400">90%</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Cost Reduction</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 col-span-2 md:col-span-1">
            <div className="text-2xl font-bold text-blue-400">100-300ms</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Tool Latency</div>
          </div>
        </div>
      </section>

      {/* The Innovation */}
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
              This breaks traditional AI agent patterns where the backend needs to request data from the client mid-execution.
            </p>
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
              <h4 className="text-amber-400 font-bold mb-2">The Solution</h4>
              <p className="text-sm">
                I engineered a novel polling bridge using <code>asyncio.Event()</code> synchronization. The agent blocks execution and waits for the plugin to poll and provide the required data.
              </p>
            </div>
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

      {/* Cost Optimization */}
      <section id="lux-cost-optimization" className="space-y-8 scroll-mt-24">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">90% Cost Reduction</h2>
        </div>
        
        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-around gap-8">
            <div className="text-center space-y-2">
              <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">Naive Approach</div>
              <div className="text-3xl font-bold text-slate-400 line-through">65,000 tokens</div>
              <div className="text-xs text-slate-500">Full codebase per request</div>
            </div>
            <div className="text-4xl text-slate-700 hidden md:block">→</div>
            <div className="text-center space-y-2">
              <div className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Lux (Lazy Loading)</div>
              <div className="text-4xl font-black text-white">5,500 tokens</div>
              <div className="text-xs text-emerald-500/80 font-medium">90% reduction in API costs</div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-700 text-slate-400 text-sm leading-relaxed">
            I implemented a <strong>progressive disclosure architecture</strong>. Instead of sending the entire codebase, Lux sends a top-level project map. The agent then uses specialized tools to explore only the scripts it needs, loading data on-demand.
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
              To prevent concurrent edit conflicts in a production environment, I architected a hash-verification system using MD5 content hashing.
            </p>
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

      {/* Metrics Dashboard */}
      <section id="lux-metrics" className="space-y-8 scroll-mt-24">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-500/10">
            <BarChart3 className="w-6 h-6 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Verified Metrics</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Metric</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Value</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Source / Proof</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { m: 'Active Installations', v: '1,500+', p: 'Roblox Creator Store Stats' },
                { m: 'Polling Interval', v: '100ms', p: 'Main.server.lua:390' },
                { m: 'Tool Timeout', v: '30s', p: 'config.py:9' },
                { m: 'Session TTL', v: '1 hour', p: 'config.py:10' },
                { m: 'Token Reduction', v: '~90%', p: '65k → 5.5k tokens' },
                { m: 'Backend LOC', v: '813 lines', p: 'Python / FastAPI' },
                { m: 'Plugin LOC', v: '1,424 lines', p: 'Lua / Roblox' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                  <td className="py-4 px-4 text-white font-medium">{row.m}</td>
                  <td className="py-4 px-4 text-amber-400 font-bold">{row.v}</td>
                  <td className="py-4 px-4 text-slate-400 italic">{row.p}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-12 border-t border-slate-800 flex flex-col md:flex-row gap-4 justify-center">
        <a 
          href="https://github.com/Seryozh" 
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
