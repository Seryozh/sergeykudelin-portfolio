'use client';

import { motion } from 'framer-motion';
import TerminalIntro from '../components/ui/TerminalIntro';

/**
 * Hero Section - Main landing area with name, title, and terminal intro
 * Features animated background particles and gradient effects
 */
export default function Hero() {
  return (
    <section className="min-h-screen snap-start flex items-center justify-center relative overflow-hidden pt-16">
      {/* Floating Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/20 rounded-full"
            initial={{
              x: Math.random() * 1000,
              y: Math.random() * 1000,
              opacity: Math.random() * 0.5,
            }}
            animate={{
              x: Math.random() * 1000,
              y: Math.random() * 1000,
              opacity: [Math.random() * 0.5, Math.random() * 0.8, Math.random() * 0.5],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Background Gradient Blob */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full h-full flex items-center justify-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 text-center max-w-3xl"
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-3 sm:mb-4">
            Sergey Kudelin
          </h1>
          <p className="text-slate-400 text-base sm:text-lg md:text-xl mb-8 sm:mb-12 tracking-wide">
            AI-Native Engineer &bull; Miami
          </p>

          {/* Terminal Intro */}
          <TerminalIntro />
        </motion.div>
      </div>
    </section>
  );
}
