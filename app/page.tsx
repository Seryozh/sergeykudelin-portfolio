'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Github } from 'lucide-react';

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
        className="z-10 text-center max-w-3xl"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Sergey Kudelin
        </h1>
        <p className="text-slate-400 text-lg md:text-xl mb-6 tracking-wide">
          AI Automation Engineer
        </p>
        <p className="text-amber-500/80 text-base md:text-lg mb-12 font-medium max-w-xl mx-auto leading-relaxed">
          I build autonomous systems for high pressure environments.
        </p>

        {/* Bio Section */}
        <div className="mb-12 text-left max-w-2xl mx-auto space-y-4 text-slate-300 text-sm md:text-base leading-relaxed">
          <p>
            I'm a builder. I spent years growing a{' '}
            <a
              href="https://www.youtube.com/@SergeRoblox"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400/90 hover:text-amber-300 underline decoration-amber-500/30 hover:decoration-amber-400/60 transition-all"
            >
              YouTube channel to 200,000+ subscribers
            </a>
            , where I learned a simple truth: if you don't design for real human behavior, you lose.
          </p>
          <p>
            I bring that same focus to engineering. Right now, I work night operations at a major residential complex,
            but I treat it as a live testing ground. I build and stress-test autonomous agents against constant
            real-world data and messy human problems.
          </p>
          <p className="text-amber-400/90 font-medium">
            I build automation for operational bottlenecks. My software takes over the repetitive logic in high-volume
            environments so humans can focus on decisions that actually need judgment.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* The TidesOS Call to Action */}
          <div className="group relative">
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

          {/* GitHub Link */}
          <a
            href="https://github.com/Seryozh/tides-concierge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-4 bg-slate-900/60 border border-slate-700 rounded-lg hover:border-amber-500/50 hover:bg-slate-800/80 transition-all duration-300 group"
          >
            <Github className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
            <span className="text-slate-300 group-hover:text-white text-sm font-medium transition-colors">
              View Source Code
            </span>
          </a>
        </div>
      </motion.div>
    </main>
  );
}