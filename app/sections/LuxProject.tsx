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
                Agentic AI system for natural language game development. Built a bidirectional protocol layer that enables LLMs to read and modify game state in real-time, handling async communication over one-way message channels.
              </p>
              <p className="text-xl text-slate-400 leading-relaxed">
                Deployed in production environments with 1,500+ active installations processing player interactions.
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
