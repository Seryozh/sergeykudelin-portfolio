'use client';

import { motion } from 'framer-motion';
import { Cpu, Code2, TrendingUp } from 'lucide-react';

const AI_TAGS = [
  'LangGraph', 'LangChain', 'ReAct Loops', 'Tool-Use Agents',
  'Claude', 'Gemini', 'OpenRouter', 'SSE Streaming',
  'Async Tool Bridges', 'RAG', 'Prompt Engineering',
];

const STACK_TAGS = [
  'Python', 'TypeScript', 'Lua', 'FastAPI',
  'Node.js', 'React', 'Next.js', 'Redis',
  'Docker', 'Vercel', 'Railway', 'JWT', 'Canvas API',
];

const GROWTH_TAGS = [
  'Content Strategy', 'A/B Testing', 'Retention Optimization',
  'Algorithmic Distribution', 'SEO', 'Thumbnail Optimization',
  'Creator Outreach', 'Brand Partnerships', 'Analytics',
];

function Tags({ tags, pillClass }: { tags: string[]; pillClass: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border ${pillClass}`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export default function Expertise() {
  return (
    <section id="expertise" className="min-h-screen snap-start flex items-center justify-center relative overflow-hidden px-4 sm:px-6 py-20 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-5xl z-10"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 text-amber-500/90">
          Stack &amp; Skills
        </h2>

        <div className="space-y-4">
          {/* Top row: AI + Full-Stack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* AI & Agents */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/70 border border-violet-500/20 rounded-2xl p-5"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 bg-violet-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Cpu className="w-4 h-4 text-violet-400" />
                </div>
                <h3 className="font-black text-white text-sm">AI &amp; Agent Engineering</h3>
              </div>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Design agentic systems where LLMs operate on live environments — game engines, cameras, live registries — through custom protocols, tool bridges, and validation pipelines.
              </p>
              <Tags tags={AI_TAGS} pillClass="bg-violet-500/10 text-violet-300 border-violet-500/20" />
            </motion.div>

            {/* Full-Stack Engineering */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/70 border border-blue-500/20 rounded-2xl p-5"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Code2 className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="font-black text-white text-sm">Full-Stack Engineering</h3>
              </div>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Build across the stack — FastAPI backends with Redis sessions and SSE streaming to React frontends with real-time data and zero-backend architectures.
              </p>
              <Tags tags={STACK_TAGS} pillClass="bg-blue-500/10 text-blue-300 border-blue-500/20" />
            </motion.div>
          </div>

          {/* Bottom: Growth & Distribution — full width */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/70 border border-amber-500/20 rounded-2xl p-5"
          >
            <div className="flex items-start justify-between mb-3 gap-4 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="font-black text-white text-sm">Growth &amp; Distribution</h3>
              </div>
              <div className="flex gap-5">
                <div className="text-right">
                  <div className="text-xl font-black text-amber-400 leading-none">200K</div>
                  <div className="text-[9px] text-slate-600 uppercase tracking-wider mt-0.5">subscribers</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-amber-400/70 leading-none">5.3M</div>
                  <div className="text-[9px] text-slate-600 uppercase tracking-wider mt-0.5">peak views</div>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Grew @SergeCode to 200K subscribers organically through years of A/B testing thumbnails, titles, and retention hooks. Built Lux for the exact Roblox developer community the channel reaches — 2,000+ installs.
            </p>
            <Tags tags={GROWTH_TAGS} pillClass="bg-amber-500/10 text-amber-300 border-amber-500/20" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
