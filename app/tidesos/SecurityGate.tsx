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
    { text: 'Verifying access credentials...', delay: 500 },
    { text: 'Access granted. Loading project data...', delay: 1000 },
    { text: 'Initializing case study environment...', delay: 1500 },
    { text: 'Preparing interactive demo...', delay: 2000 },
    { text: 'Ready. Redirecting to TidesOS overview...', delay: 2500 },
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
          <Shield className="w-8 h-8 text-amber-400" />
          <h1 className="text-2xl md:text-3xl font-black text-amber-400 uppercase tracking-tight font-mono">
            Loading TidesOS
          </h1>
        </motion.div>

        {/* Terminal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900 border border-amber-500/30 rounded-xl p-6 md:p-8 shadow-2xl shadow-amber-500/10"
        >
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-amber-400 font-mono uppercase tracking-wider">
                Loading Progress
              </span>
              <span className="text-xs text-amber-400 font-mono">{progress}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
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
                  {s.text.includes('granted') || s.text.includes('Ready') ? (
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                      <motion.div
                        className="w-2 h-2 bg-amber-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    </div>
                  )}
                  <span
                    className={
                      s.text.includes('granted') || s.text.includes('Ready')
                        ? 'text-amber-400 font-semibold'
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
                className="text-amber-400"
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
          className="text-center mt-8 text-slate-500 text-xs font-mono tracking-wider"
        >
          Secure connection established
        </motion.p>
      </div>
    </motion.div>
  );
}
