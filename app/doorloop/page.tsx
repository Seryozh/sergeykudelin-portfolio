'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, PauseCircle } from 'lucide-react';

export default function DoorLoopPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f] p-6 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900/50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 text-center max-w-lg"
      >
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-8 py-10 shadow-2xl">
          <PauseCircle className="w-16 h-16 text-blue-400/60 mx-auto mb-6" />

          <h1 className="text-2xl font-semibold text-white tracking-wide mb-3">
            DoorLoop Agent
          </h1>
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-4" />

          <p className="text-white/50 text-sm uppercase tracking-wider mb-6">
            Project Paused
          </p>

          <p className="text-white/70 text-base leading-relaxed mb-8">
            This project has been reworked and evolved into <span className="text-amber-400 font-medium">TidesOS</span> — a Night Operations voice agent with enhanced capabilities.
          </p>

          <Link
            href="/tidesos"
            className="inline-flex items-center gap-3 px-6 py-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 hover:bg-amber-500/20 transition-all duration-300 group"
          >
            <span className="font-medium">Check out TidesOS</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
