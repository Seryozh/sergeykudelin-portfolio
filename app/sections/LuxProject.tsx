'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import LuxLaptopAnimation from '../components/projects/LuxLaptopAnimation';

interface LuxProjectProps {
  onReadMore: () => void;
  onOpenDemo: () => void;
}

export default function LuxProject({ onReadMore, onOpenDemo }: LuxProjectProps) {
  return (
    <section id="lux" className="min-h-screen snap-start flex items-center justify-center relative overflow-hidden px-4 sm:px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl z-10"
      >
        {/* Mobile-only title */}
        <h2 className="md:hidden text-4xl font-black text-white tracking-tight mb-5">
          Lux
        </h2>

        <div className="flex flex-col gap-6 md:grid md:grid-cols-[2fr_3fr] md:gap-12 md:items-center">
          {/* Text column — order 2 on mobile, left on desktop */}
          <div className="order-2 md:order-1 space-y-6">
            <div className="space-y-3">
              <h2 className="hidden md:block text-5xl font-black text-white tracking-tight">
                Lux
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                You describe a change in plain English. Lux reads your live game hierarchy, reasons through the relevant scripts, and streams back structured edits token by token, ready to apply with one click. Over 1,500 active installations.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onReadMore}
                className="flex-1 px-5 py-3 bg-amber-500 text-slate-950 rounded-xl font-bold hover:bg-amber-400 transition-all flex items-center justify-center gap-2 group whitespace-nowrap"
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

          {/* Visual — order 1 on mobile (appears after mobile title), right on desktop */}
          <div className="order-1 md:order-2 relative group cursor-pointer" onClick={onReadMore}>
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-300 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <LuxLaptopAnimation />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
