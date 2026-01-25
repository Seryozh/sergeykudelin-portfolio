'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white relative overflow-hidden p-6">
      {/* Background Gradient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center max-w-2xl"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-8"
        >
          <div className="text-7xl md:text-8xl font-black bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 bg-clip-text text-transparent">
            404
          </div>
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Page Not Found
        </h1>
        <p className="text-slate-400 text-lg mb-8">
          The page you're looking for doesn't exist or has been moved. No worries—let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-3 px-6 py-4 bg-amber-600 hover:bg-amber-500 rounded-xl font-semibold text-white transition-all group"
          >
            <Home className="w-5 h-5" />
            Back to Home
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <p className="text-slate-500 text-sm mt-12">
          If you believe this is an error, feel free to{' '}
          <a
            href="mailto:sergey@sergeykudelin.com"
            className="text-amber-400 hover:text-amber-300 underline transition-colors"
          >
            get in touch
          </a>
          .
        </p>
      </motion.div>
    </main>
  );
}
