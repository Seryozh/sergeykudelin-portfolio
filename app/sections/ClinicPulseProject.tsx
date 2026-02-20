'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

interface ClinicPulseProjectProps {
  onReadMore: () => void;
  onOpenDemo: () => void;
}

export default function ClinicPulseProject({ onReadMore, onOpenDemo }: ClinicPulseProjectProps) {
  return (
    <section id="clinicpulse" className="min-h-screen snap-start flex items-center justify-center relative overflow-hidden px-4 sm:px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl z-10"
      >
        {/* Mobile-only title */}
        <h2 className="md:hidden text-4xl font-black text-white tracking-tight mb-5">
          Clinic Pulse
        </h2>

        <div className="flex flex-col gap-6 md:grid md:grid-cols-[2fr_3fr] md:gap-12 md:items-center">
          {/* Text column — order 2 on mobile, left on desktop */}
          <div className="order-2 md:order-1 space-y-6">
            <div className="space-y-3">
              <h2 className="hidden md:block text-5xl font-black text-white tracking-tight">
                Clinic Pulse
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                Influencer doctors bring their entire patient base to any platform they recommend, but finding the right ones takes hours of manual search. Clinic Pulse automates the hunt: discover YouTube physicians, verify their license, enrich contacts, generate personalized outreach. Dozens of qualified leads, for cents.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onReadMore}
                className="flex-1 px-5 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-500 transition-all flex items-center justify-center gap-2 group whitespace-nowrap"
              >
                Read More
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onOpenDemo}
                className="flex-1 px-5 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Demo
                <Play className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Visual — order 1 on mobile, right on desktop */}
          <div className="order-1 md:order-2 relative group cursor-pointer" onClick={onReadMore}>
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-fuchsia-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6">
              <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-5">Pipeline Run</div>
              <div className="space-y-3">
                {[
                  { icon: '🔍', label: 'Discovery',    detail: '@DrSandraLee · @DermDoctor · @BoardCertDerm', color: 'text-blue-400',    delay: 0.1 },
                  { icon: '🧠', label: 'Intelligence', detail: '"Dr. Pimple Popper" → Sandra Lee, MD',          color: 'text-violet-400', delay: 0.2 },
                  { icon: '✅', label: 'Verification', detail: 'NPI #1932748501 ACTIVE · Dermatology',           color: 'text-emerald-400', delay: 0.3 },
                  { icon: '📬', label: 'Enrichment',   detail: 'LinkedIn ✓  Doximity ✓  Email ✓',               color: 'text-amber-400',  delay: 0.4 },
                  { icon: '📝', label: 'Outreach',     detail: '"Dr. Lee, your 2.1M subscribers trust..."',     color: 'text-rose-400',   delay: 0.5 },
                ].map((phase, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: phase.delay }}
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                      {phase.icon}
                    </div>
                    <div className="min-w-0">
                      <div className={`text-xs font-black uppercase tracking-wider ${phase.color}`}>{phase.label}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">{phase.detail}</div>
                    </div>
                    <motion.div
                      className="ml-auto flex-shrink-0"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: phase.delay + 0.2 }}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        i === 0 ? 'bg-blue-400' :
                        i === 1 ? 'bg-violet-400' :
                        i === 2 ? 'bg-emerald-400' :
                        i === 3 ? 'bg-amber-400' :
                        'bg-rose-400'
                      }`} />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-4 gap-2">
                {[
                  { val: '5',     label: 'phases' },
                  { val: '3',     label: 'doctors' },
                  { val: '$0.04', label: 'total' },
                  { val: '~2min', label: 'runtime' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-sm font-black text-white">{stat.val}</div>
                    <div className="text-[9px] text-slate-600 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
