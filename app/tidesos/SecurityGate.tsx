'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Check, Lock } from 'lucide-react';

interface SecurityGateProps {
  onComplete: () => void;
}

export default function SecurityGate({ onComplete }: SecurityGateProps) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { text: '[INFO] Checking Security Key...', delay: 500 },
    { text: '[SUCCESS] Security Token Verified', delay: 1000 },
    { text: '[INFO] Establishing Encrypted Tunnel...', delay: 1500 },
    { text: '[INFO] Decrypting Session Context...', delay: 2000 },
    { text: '[ACCESS GRANTED] Redirecting to TidesOS Operations...', delay: 2500 },
  ];

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Step progression
    const timeouts = steps.map((_, index) =>
      setTimeout(() => {
        setStep(index + 1);
      }, steps[index].delay)
    );

    // Complete animation
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => {
      clearInterval(progressInterval);
      timeouts.forEach(clearTimeout);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center"
    >
      <div className="max-w-2xl w-full px-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-12"
        >
          <Shield className="w-8 h-8 text-emerald-400" />
          <h1 className="text-2xl md:text-3xl font-black text-emerald-400 uppercase tracking-tight font-mono">
            Security Verification
          </h1>
        </motion.div>

        {/* Terminal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900 border border-emerald-500/30 rounded-xl p-6 md:p-8 shadow-2xl shadow-emerald-500/10"
        >
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-emerald-400 font-mono uppercase tracking-wider">
                Authentication Progress
              </span>
              <span className="text-xs text-emerald-400 font-mono">{progress}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* Status Logs */}
          <div className="space-y-3 font-mono text-sm">
            <AnimatePresence>
              {steps.slice(0, step).map((s, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  {s.text.includes('SUCCESS') || s.text.includes('GRANTED') ? (
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : s.text.includes('INFO') ? (
                    <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                      <motion.div
                        className="w-2 h-2 bg-amber-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    </div>
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                  <span
                    className={
                      s.text.includes('SUCCESS')
                        ? 'text-emerald-400'
                        : s.text.includes('GRANTED')
                        ? 'text-emerald-300 font-bold'
                        : 'text-slate-300'
                    }
                  >
                    {s.text}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Blinking Cursor */}
            {step > 0 && (
              <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-emerald-400"
              >
                ▊
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 text-slate-500 text-xs font-mono uppercase tracking-wider"
        >
          Encrypted Connection • 256-bit AES
        </motion.p>
      </div>
    </motion.div>
  );
}
