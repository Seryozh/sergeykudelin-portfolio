'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Home, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DoorloopEvolution() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full z-10"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-4"
          >
            <Shield className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-black text-amber-400 mb-4 tracking-tight">
            The Project Evolution
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-light">
            From Prototyping to TidesOS Architecture
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-slate-900/60 border border-amber-500/20 rounded-2xl p-8 md:p-12 backdrop-blur-sm mb-8">
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p className="text-lg">
              The initial Voice AI architecture served as a high-speed proof of execution. It has since been evolved and hardened into <span className="text-amber-400 font-semibold">TidesOS</span>, a standalone, production-grade autonomous voice firewall. This system is built for high-security facility operations, utilizing encrypted session persistence to handle complex guest traffic and proprietary operational data.
            </p>

            <div className="border-t border-slate-700/50 pt-6 mt-6 space-y-5">
              <div>
                <h3 className="text-amber-400 font-semibold text-lg mb-2">Persistent Context & Security</h3>
                <p className="text-base">
                  Integrated encrypted conversation history to allow the agent to "remember" previous guest inputs securely. This creates a natural, multi-turn interaction while ensuring all session data is sandboxed to prevent logic leakage between concurrent guest sessions.
                </p>
              </div>

              <div>
                <h3 className="text-amber-400 font-semibold text-lg mb-2">Hardened State Management</h3>
                <p className="text-base">
                  Developed a stateful, session-based architecture to maintain operational flow. This ensures the AI can handle complex follow-up questions without losing intent, even in the "chaotic reality" of overnight operational bottlenecks.
                </p>
              </div>

              <div>
                <h3 className="text-amber-400 font-semibold text-lg mb-2">Infrastructure Integrity</h3>
                <p className="text-base">
                  Transitioned from a stateless "proof-of-action" into a dedicated system designed for high-security environments where the interaction between AI and human judgment is critical.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            onClick={() => router.push('/tidesos?key=tides_exclusive_2026')}
            className="flex items-center justify-center gap-3 px-8 py-5 bg-amber-600 hover:bg-amber-500 rounded-xl font-semibold text-white transition-all duration-300 group shadow-lg shadow-amber-500/20"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Shield className="w-5 h-5" />
            View TidesOS Case Study
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            onClick={() => router.push('/')}
            className="flex items-center justify-center gap-3 px-8 py-5 bg-slate-800 border border-slate-700 hover:border-amber-500/50 hover:bg-slate-700 rounded-xl font-semibold text-slate-300 hover:text-white transition-all duration-300 group"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Home className="w-5 h-5" />
            Back to Portfolio
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </motion.div>
    </main>
  );
}
