'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white p-6 relative overflow-hidden">
      
      {/* Background Gradient Blob */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center max-w-2xl"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Sergey Kudelin
        </h1>
        <p className="text-slate-400 text-lg md:text-xl mb-12 tracking-wide">
          AI Automation Engineer & Full-Stack Developer
        </p>

        {/* The TidesOS Call to Action */}
        <div className="group relative inline-block">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-amber-500 rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
          <Link
            href="/tidesos"
            className="relative flex items-center gap-3 px-8 py-4 bg-slate-900 rounded-lg border border-slate-800 hover:bg-slate-800 transition-all duration-300"
          >
            <div className="bg-amber-500/10 p-2 rounded-md">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <div className="text-left">
              <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Live Demo</p>
              <p className="text-white font-medium text-lg">TidesOS NightOps Agent</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-transform ml-4" />
          </Link>
        </div>

        <p className="mt-16 text-slate-600 text-sm">
          Built with Next.js 15, n8n, and OpenAI
        </p>
      </motion.div>
    </main>
  );
}