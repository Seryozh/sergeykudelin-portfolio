'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeLine {
  text: string;
  segments: { text: string; color: string }[];
}

interface AnimationSequence {
  prompt: string;
  lines: CodeLine[];
  successMessage: string;
}

const sequences: AnimationSequence[] = [
  {
    prompt: '> Add a teleport command',
    lines: [
      {
        text: 'function teleportPlayer(player, destination)',
        segments: [
          { text: 'function', color: '#f97316' },
          { text: ' teleportPlayer(player, destination)', color: '#e2e8f0' },
        ],
      },
      {
        text: '  player.position = destination',
        segments: [
          { text: '  player.position = destination', color: '#e2e8f0' },
        ],
      },
      {
        text: '  player:notify("Teleported!")',
        segments: [
          { text: '  player:notify(', color: '#e2e8f0' },
          { text: '"Teleported!"', color: '#4ade80' },
          { text: ')', color: '#e2e8f0' },
        ],
      },
      {
        text: 'end',
        segments: [
          { text: 'end', color: '#f97316' },
        ],
      },
    ],
    successMessage: '\u2713 Function generated',
  },
  {
    prompt: '> Create a damage effect',
    lines: [
      {
        text: 'function applyDamage(target, amount)',
        segments: [
          { text: 'function', color: '#f97316' },
          { text: ' applyDamage(target, amount)', color: '#e2e8f0' },
        ],
      },
      {
        text: '  target.health = target.health - amount',
        segments: [
          { text: '  target.health = target.health - amount', color: '#e2e8f0' },
        ],
      },
      {
        text: '  target:playEffect("damage_flash")',
        segments: [
          { text: '  target:playEffect(', color: '#e2e8f0' },
          { text: '"damage_flash"', color: '#4ade80' },
          { text: ')', color: '#e2e8f0' },
        ],
      },
      {
        text: 'end',
        segments: [
          { text: 'end', color: '#f97316' },
        ],
      },
    ],
    successMessage: '\u2713 Effect created',
  },
];

export default function LuxLaptopAnimation() {
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'thinking' | 'code' | 'success' | 'fadeout' | 'pause'>('typing');
  const [typedChars, setTypedChars] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [visible, setVisible] = useState(true);

  const currentSequence = sequences[sequenceIndex];

  const resetForNext = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setSequenceIndex((prev) => (prev + 1) % sequences.length);
      setPhase('typing');
      setTypedChars(0);
      setVisibleLines(0);
      setShowSuccess(false);
      setVisible(true);
    }, 500);
  }, []);

  // Typing phase
  useEffect(() => {
    if (phase !== 'typing') return;
    if (typedChars >= currentSequence.prompt.length) {
      const timer = setTimeout(() => setPhase('thinking'), 100);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setTypedChars((c) => c + 1);
    }, 500 / currentSequence.prompt.length);
    return () => clearTimeout(timer);
  }, [phase, typedChars, currentSequence.prompt.length]);

  // Thinking phase
  useEffect(() => {
    if (phase !== 'thinking') return;
    const timer = setTimeout(() => setPhase('code'), 1000);
    return () => clearTimeout(timer);
  }, [phase]);

  // Code reveal phase
  useEffect(() => {
    if (phase !== 'code') return;
    if (visibleLines >= currentSequence.lines.length) {
      const timer = setTimeout(() => setPhase('success'), 300);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setVisibleLines((l) => l + 1);
    }, 150);
    return () => clearTimeout(timer);
  }, [phase, visibleLines, currentSequence.lines.length]);

  // Success phase
  useEffect(() => {
    if (phase !== 'success') return;
    setShowSuccess(true);
    const timer = setTimeout(() => setPhase('fadeout'), 2000);
    return () => clearTimeout(timer);
  }, [phase]);

  // Fadeout phase
  useEffect(() => {
    if (phase !== 'fadeout') return;
    const timer = setTimeout(() => resetForNext(), 500);
    return () => clearTimeout(timer);
  }, [phase, resetForNext]);

  return (
    <div className="relative w-full" style={{ aspectRatio: '16 / 10' }}>
      {/* Laptop image */}
      <img
        src="https://i.imgur.com/kea4P4K.png"
        alt="Laptop"
        className="w-full h-full object-contain"
        draggable={false}
      />

      {/* Screen overlay */}
      <div
        className="absolute overflow-hidden"
        style={{
          top: '8%',
          left: '12%',
          width: '76%',
          height: '78%',
          borderRadius: '2%',
        }}
      >
        <div className="w-full h-full bg-slate-950/90 font-mono text-[0.55rem] sm:text-[0.65rem] md:text-xs p-[6%] relative">
          <AnimatePresence>
            {visible && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === 'fadeout' ? 0 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 p-[6%] flex flex-col"
              >
                {/* Prompt line */}
                <div className="text-slate-400 mb-2 whitespace-nowrap overflow-hidden">
                  {currentSequence.prompt.slice(0, typedChars)}
                  {phase === 'typing' && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block w-[0.5em] h-[1em] bg-slate-400 align-middle ml-px"
                    />
                  )}
                </div>

                {/* Thinking dots */}
                {(phase === 'thinking') && (
                  <div className="flex gap-1 mb-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                )}

                {/* Code lines */}
                <div className="flex-1 space-y-0.5">
                  {currentSequence.lines.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{
                        opacity: i < visibleLines ? 1 : 0,
                        x: i < visibleLines ? 0 : -4,
                      }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {line.segments.map((seg, j) => (
                        <span key={j} style={{ color: seg.color }}>
                          {seg.text}
                        </span>
                      ))}
                    </motion.div>
                  ))}
                </div>

                {/* Success message */}
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-emerald-400 mt-2 font-bold"
                  >
                    {currentSequence.successMessage}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
