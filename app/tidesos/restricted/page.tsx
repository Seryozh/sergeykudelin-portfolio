'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Mail, Linkedin, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RestrictedAccess() {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === 'tides_exclusive_2026') {
      router.push('/tidesos?key=tides_exclusive_2026');
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full z-10"
      >
        {/* Warning Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <AlertTriangle className="w-8 h-8 text-red-400" />
          <h1 className="text-3xl md:text-4xl font-black text-red-400 uppercase tracking-tight">
            Restricted Access
          </h1>
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>

        {/* Main Card */}
        <div className="bg-slate-900/60 border-2 border-red-500/30 rounded-2xl p-8 md:p-10 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl md:text-2xl font-bold text-white">
              TidesOS Operational Environment
            </h2>
          </div>

          <div className="space-y-4 text-slate-300 leading-relaxed mb-8">
            <p className="text-base">
              <span className="text-red-400 font-semibold">Public Access Disabled:</span> To view the technical case study and live demo, please use the secure link provided in my outreach or resume.
            </p>
            <p className="text-base">
              <span className="text-amber-400 font-semibold">Hiring Managers:</span> If you found this via my main portfolio, the access link was included in my application materials. Alternatively, enter your access code below or request a key via LinkedIn.
            </p>
          </div>

          {/* Access Code Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="access-code" className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Security Access Code
              </label>
              <input
                id="access-code"
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Enter your access code"
                className={`w-full px-4 py-3 bg-slate-950 border ${
                  error ? 'border-red-500' : 'border-slate-700'
                } rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors font-mono`}
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-2 font-semibold"
                >
                  Invalid access code. Please check your credentials.
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-amber-600 hover:bg-amber-500 rounded-xl font-semibold text-white transition-all group"
            >
              <Lock className="w-5 h-5" />
              Authenticate & Access
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 border-t border-slate-700" />

          {/* Contact Options */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">
              Request Access
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="mailto:sergey@sergeykudelin.com?subject=TidesOS Access Request"
                className="flex items-center justify-center gap-3 px-6 py-3 bg-slate-800 border border-slate-700 rounded-xl hover:border-amber-500/50 hover:bg-slate-700 transition-all group"
              >
                <Mail className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
                <span className="text-slate-300 group-hover:text-white text-sm font-medium transition-colors">
                  Email Request
                </span>
              </a>
              <a
                href="https://www.linkedin.com/in/sergey-kudelin/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-6 py-3 bg-slate-800 border border-slate-700 rounded-xl hover:border-amber-500/50 hover:bg-slate-700 transition-all group"
              >
                <Linkedin className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
                <span className="text-slate-300 group-hover:text-white text-sm font-medium transition-colors">
                  LinkedIn DM
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Back to Portfolio */}
        <motion.a
          href="/"
          className="block text-center mt-8 text-slate-400 hover:text-amber-400 transition-colors text-sm"
          whileHover={{ x: -5 }}
        >
          ← Back to Portfolio
        </motion.a>
      </motion.div>
    </main>
  );
}
