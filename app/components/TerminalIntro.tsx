'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TerminalIntro() {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setExpanded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 sm:mb-12">
      <div className="bg-slate-900/80 border border-slate-700/50 rounded-lg overflow-hidden font-mono text-sm leading-relaxed">
        {/* Terminal header bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/60 border-b border-slate-700/50">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className="ml-2 text-xs text-slate-500">about.md</span>
        </div>

        {/* Terminal content */}
        <div className="p-4 sm:p-6">
          {/* Command */}
          <div className="text-emerald-400">
            $ cat about.md
          </div>

          {/* Expanding content */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-4 text-slate-300">
                  <div>
                    <div className="text-amber-400 font-bold mb-1.5">## Role</div>
                    <p>
                      Full-stack engineer in Miami building production systems with AI.
                      I work across the stack, from frontend to backend infrastructure,
                      with a strong understanding of AI architecture and how to integrate
                      it into real products.
                    </p>
                  </div>

                  <div>
                    <div className="text-amber-400 font-bold mb-1.5">## Focus</div>
                    <p>
                      My work includes agentic systems, computer vision applications, and
                      automation pipelines. Most of my time goes into understanding how
                      systems fit together and why they fail.
                    </p>
                  </div>

                  <div>
                    <div className="text-amber-400 font-bold mb-1.5">## Direction</div>
                    <p>
                      I&apos;m always exploring new AI technology as it emerges. The field is
                      moving quickly and we&apos;re at the beginning of something that will
                      fundamentally change how software gets built. I want to be part of
                      pushing that forward and building things that matter.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Blinking cursor prompt */}
          <div className="mt-4 text-emerald-400 flex items-center">
            $&nbsp;
            <motion.span
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 1, repeat: Infinity, times: [0, 0.49, 0.5, 1] }}
              className="inline-block w-2 h-4 bg-emerald-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
