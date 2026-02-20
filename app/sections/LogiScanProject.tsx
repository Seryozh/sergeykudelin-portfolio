'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, Camera } from 'lucide-react';

interface LogiScanProjectProps {
  onReadMore: () => void;
  onOpenDemo: () => void;
}

export default function LogiScanProject({ onReadMore, onOpenDemo }: LogiScanProjectProps) {
  return (
    <section id="logiscan" className="min-h-screen snap-start flex items-center justify-center relative overflow-hidden px-4 sm:px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl z-10"
      >
        {/* Mobile-only title */}
        <h2 className="md:hidden text-4xl font-black text-white tracking-tight mb-5">
          LogiScan
        </h2>

        <div className="flex flex-col gap-6 md:grid md:grid-cols-[2fr_3fr] md:gap-12 md:items-center">
          {/* Text column — order 2 on mobile, left on desktop */}
          <div className="order-2 md:order-1 space-y-6">
            <div className="space-y-3">
              <h2 className="hidden md:block text-5xl font-black text-white tracking-tight">
                LogiScan
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                90 minutes of nightly package audits down to 10. Point the phone at the shelf and tap scan: Gemini reads every sticker, cross-references the manifest mid-inference, and flags discrepancies instantly. $0.002 per scan, zero backend, zero data retention.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onReadMore}
                className="flex-1 px-5 py-3 bg-emerald-500 text-slate-950 rounded-xl font-bold hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 group whitespace-nowrap"
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
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden aspect-video">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://i.imgur.com/rtXV6df.png')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-slate-900/30" />
                <div className="relative w-full h-full p-6">
                  <motion.div
                    className="absolute rounded border-2"
                    style={{ top: '15%', left: '8%', width: '35%', height: '35%', borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)' }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="absolute -top-5 left-0 text-[9px] font-bold text-white bg-emerald-500 px-1.5 py-0.5 rounded">C08Q - 9679</div>
                  </motion.div>
                  <motion.div
                    className="absolute rounded border-2"
                    style={{ top: '12%', left: '52%', width: '40%', height: '30%', borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)' }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="absolute -top-5 left-0 text-[9px] font-bold text-white bg-emerald-500 px-1.5 py-0.5 rounded">C14K - 3728</div>
                  </motion.div>
                  <motion.div
                    className="absolute rounded border-2"
                    style={{ top: '55%', left: '15%', width: '32%', height: '32%', borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,0.1)' }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="absolute -top-5 left-0 text-[9px] font-bold text-white bg-orange-500 px-1.5 py-0.5 rounded">C22B - 5501</div>
                  </motion.div>
                  <motion.div
                    className="absolute rounded border-2"
                    style={{ top: '58%', left: '58%', width: '30%', height: '28%', borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)' }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <div className="absolute -top-5 left-0 text-[9px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded">??? - ????</div>
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center text-white text-[7px] font-black">!</div>
                  </motion.div>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                      className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Camera className="w-6 h-6 text-emerald-400" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
