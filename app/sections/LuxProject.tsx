'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import LuxLaptopAnimation from '../components/projects/LuxLaptopAnimation';

interface LuxProjectProps {
  onReadMore: () => void;
  onOpenDemo: () => void;
}

/**
 * Lux Project Section - Showcases the Lux AI game development system
 * Features project description, stats, and interactive demo buttons
 */
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
        <div className="grid md:grid-cols-[2fr_3fr] gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                Lux
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed">
                You type &ldquo;add a health bar that drains when the player takes damage&rdquo; into a Roblox Studio widget. Lux reads your live game hierarchy, reasons through which scripts to modify, and streams back structured changes for you to review and apply — token by token, in real time. The engineering challenge: Roblox plugins can&apos;t receive incoming connections, so the agent suspends mid-thought via an async tool bridge until the plugin checks in. 1,500+ active installations on Roblox Creator Store.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onReadMore}
                className="flex-1 px-8 py-4 bg-amber-500 text-slate-950 rounded-xl font-bold hover:bg-amber-400 transition-all flex items-center justify-center gap-2 group"
              >
                Read More
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onOpenDemo}
                className="flex-1 px-8 py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
              >
                Interactive Demo
                <Play className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <LuxLaptopAnimation />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
