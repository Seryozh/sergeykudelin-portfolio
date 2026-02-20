'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Play, RotateCcw, CheckCircle2, ExternalLink } from 'lucide-react';

interface LogLine {
  id: number;
  phase: 'discovery' | 'intelligence' | 'verification' | 'enrichment' | 'outreach';
  text: string;
  type: 'header' | 'line' | 'typewriter';
}

const ALL_LINES: LogLine[] = [
  { id: 0, phase: 'discovery', type: 'header', text: '🔍  Discovery — scanning YouTube...' },
  { id: 1, phase: 'discovery', type: 'line', text: '→ query: "board certified dermatologist routine"' },
  { id: 2, phase: 'discovery', type: 'line', text: '→ channel found: @DrSandraLee  (2.1M subs)' },
  { id: 3, phase: 'discovery', type: 'line', text: '→ channel found: @DermDoctor  (847K subs)' },
  { id: 4, phase: 'discovery', type: 'line', text: '→ channel found: @BoardCertDerm  (312K subs)' },
  { id: 5, phase: 'discovery', type: 'line', text: '✓  3 channels collected' },

  { id: 6, phase: 'intelligence', type: 'header', text: '🧠  Intelligence — extracting real identities...' },
  { id: 7, phase: 'intelligence', type: 'line', text: '→ "Dr. Pimple Popper" → Sandra Lee, MD  [high confidence]' },
  { id: 8, phase: 'intelligence', type: 'line', text: '→ "The Derm Doctor" → Muneeb Shah, DO  [high confidence]' },
  { id: 9, phase: 'intelligence', type: 'line', text: '→ "BoardCertDerm" → Rachel Kim, DO  [medium confidence]' },
  { id: 10, phase: 'intelligence', type: 'line', text: '✓  3 physicians identified' },

  { id: 11, phase: 'verification', type: 'header', text: '✅  Verification — NPI Registry lookup...' },
  { id: 12, phase: 'verification', type: 'line', text: '→ Sandra Lee MD  NPI #1932748501  ACTIVE · Dermatology  [Gold]' },
  { id: 13, phase: 'verification', type: 'line', text: '→ Muneeb Shah DO  NPI #1245678903  ACTIVE · Dermatology  [Gold]' },
  { id: 14, phase: 'verification', type: 'line', text: '→ Rachel Kim DO  NPI #1867453021  ACTIVE · Internal Med  [Silver]' },
  { id: 15, phase: 'verification', type: 'line', text: '✓  3/3 licenses verified' },

  { id: 16, phase: 'enrichment', type: 'header', text: '📬  Enrichment — building contact profiles...' },
  { id: 17, phase: 'enrichment', type: 'line', text: '→ Sandra Lee:  LinkedIn ✓  Doximity ✓  Email ✓  (YouTube regex)' },
  { id: 18, phase: 'enrichment', type: 'line', text: '→ Muneeb Shah:  LinkedIn ✓  Doximity ✓  Email ✓  (Hunter.io)' },
  { id: 19, phase: 'enrichment', type: 'line', text: '→ Rachel Kim:  LinkedIn ✓  Doximity ✓  Phone ✓  (NPI fallback)' },
  { id: 20, phase: 'enrichment', type: 'line', text: '✓  Contact profiles enriched' },

  { id: 21, phase: 'outreach', type: 'header', text: '📝  Outreach — generating personalized messages...' },
  { id: 22, phase: 'outreach', type: 'line', text: '→ Sandra Lee — Email (monetization angle):' },
  { id: 23, phase: 'outreach', type: 'typewriter', text: '"Dr. Lee, your 2.1M subscribers already trust your clinical judgment — Future Clinic lets them book with you."' },
];

const PHASE_COLORS: Record<string, string> = {
  discovery: 'text-blue-400',
  intelligence: 'text-violet-400',
  verification: 'text-emerald-400',
  enrichment: 'text-amber-400',
  outreach: 'text-rose-400',
};

const PHASE_HEADER_BG: Record<string, string> = {
  discovery: 'text-blue-300',
  intelligence: 'text-violet-300',
  verification: 'text-emerald-300',
  enrichment: 'text-amber-300',
  outreach: 'text-rose-300',
};

function TypewriterLine({ text, onDone }: { text: string; onDone: () => void }) {
  const [displayed, setDisplayed] = useState('');
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayed(text);
      onDone();
      return;
    }
    let i = 0;
    const iv = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(iv);
        setTimeout(onDone, 400);
      }
    }, 22);
    return () => clearInterval(iv);
  }, [text, onDone, prefersReducedMotion]);

  return (
    <span className="text-rose-300 font-mono">
      {displayed}
      {displayed.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-[2px] h-[12px] bg-rose-400 ml-0.5 align-middle"
        />
      )}
    </span>
  );
}

function DoctorCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mt-4 bg-slate-900 border border-violet-500/30 rounded-xl p-4 shadow-lg shadow-violet-500/5"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-black flex-shrink-0">
          SL
        </div>
        <div>
          <div className="text-sm font-black text-white">Sandra Lee, MD</div>
          <div className="text-[10px] text-violet-400 font-semibold">Board-Certified Dermatologist</div>
          <div className="text-[10px] text-slate-500">2.1M YouTube subscribers · @DrSandraLee</div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[9px] font-black text-emerald-400 uppercase">Gold</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 mb-3">
        {[
          { label: 'NPI', val: '#1932748501 · ACTIVE' },
          { label: 'Specialty', val: 'Dermatology' },
          { label: 'Email', val: 'sandra@drpimplepopper.com' },
          { label: 'LinkedIn', val: '/in/sandralee-md' },
        ].map((f, i) => (
          <div key={i} className="bg-slate-800/60 rounded-lg px-2.5 py-1.5">
            <div className="text-[9px] text-slate-500 uppercase tracking-wider">{f.label}</div>
            <div className="text-[10px] text-white font-mono truncate">{f.val}</div>
          </div>
        ))}
      </div>

      <div className="bg-rose-500/5 border border-rose-500/20 rounded-lg px-3 py-2">
        <div className="text-[9px] font-black text-rose-400 uppercase tracking-wider mb-1">Outreach Hook</div>
        <div className="text-[11px] text-slate-300 italic">
          &ldquo;Your 2.1M subscribers trust your clinical judgment — Future Clinic lets them book with you.&rdquo;
        </div>
      </div>
    </motion.div>
  );
}

function StatRow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-3 grid grid-cols-4 gap-2"
    >
      {[
        { val: '5 phases', color: 'text-violet-400' },
        { val: '3 doctors found', color: 'text-blue-400' },
        { val: '$0.04 total', color: 'text-amber-400' },
        { val: '~2 min runtime', color: 'text-emerald-400' },
      ].map((s, i) => (
        <div key={i} className="text-center py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <div className={`text-[10px] font-black ${s.color}`}>{s.val}</div>
        </div>
      ))}
    </motion.div>
  );
}

interface ClinicPulseDemoProps {
  autoPlay?: boolean;
}

export default function ClinicPulseDemo({ autoPlay = false }: ClinicPulseDemoProps) {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [visibleLines, setVisibleLines] = useState<LogLine[]>([]);
  const [typewriterActive, setTypewriterActive] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const lineIndexRef = useRef(0);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const clearAll = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const scheduleLines = () => {
    lineIndexRef.current = 0;
    const addNextLine = () => {
      const idx = lineIndexRef.current;
      if (idx >= ALL_LINES.length) return;
      const line = ALL_LINES[idx];
      lineIndexRef.current++;

      setVisibleLines(prev => [...prev, line]);
      setTimeout(() => {
        if (feedRef.current) {
          feedRef.current.scrollTop = feedRef.current.scrollHeight;
        }
      }, 20);

      if (line.type === 'typewriter') {
        setTypewriterActive(true);
        return; // onDone() of typewriter calls finishPipeline
      }

      const delay = prefersReducedMotion ? 0 : (line.type === 'header' ? 200 : 120);
      const t = setTimeout(addNextLine, delay);
      timeoutsRef.current.push(t);
    };
    addNextLine();
  };

  const finishPipeline = () => {
    setTypewriterActive(false);
    const t1 = setTimeout(() => setShowCard(true), 300);
    const t2 = setTimeout(() => setShowStats(true), 600);
    const t3 = setTimeout(() => setDone(true), 700);
    timeoutsRef.current.push(t1, t2, t3);
  };

  const startPipeline = () => {
    setRunning(true);
    setDone(false);
    setVisibleLines([]);
    setTypewriterActive(false);
    setShowCard(false);
    setShowStats(false);
    lineIndexRef.current = 0;
    scheduleLines();
  };

  const reset = () => {
    clearAll();
    setRunning(false);
    setDone(false);
    setVisibleLines([]);
    setTypewriterActive(false);
    setShowCard(false);
    setShowStats(false);
    lineIndexRef.current = 0;
  };

  useEffect(() => {
    if (autoPlay) {
      const t = setTimeout(startPipeline, 800);
      timeoutsRef.current.push(t);
    }
    return clearAll;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0 py-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-black text-white">Clinic Pulse Pipeline</h3>
          <p className="text-xs text-slate-500">Simulated run · real data shapes</p>
        </div>
        {running && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors text-xs font-bold min-h-[44px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Trigger button */}
      <AnimatePresence>
        {!running && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center gap-4 py-10"
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-2xl bg-violet-500/20"
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <button
                onClick={startPipeline}
                className="relative flex items-center gap-3 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-black text-base transition-all active:scale-95 shadow-lg shadow-violet-500/30 min-h-[56px]"
              >
                <Play className="w-5 h-5 fill-current" />
                Run Pipeline
              </button>
            </div>
            <p className="text-xs text-slate-600 text-center max-w-xs">
              Simulates a full run — YouTube discovery through personalized outreach generation
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live feed */}
      <AnimatePresence>
        {running && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden"
          >
            {/* Terminal header */}
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">pipeline.ts</span>
              </div>
              {!done && (
                <motion.div
                  className="flex items-center gap-1.5"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  <span className="text-[9px] font-black text-violet-400 uppercase">Running</span>
                </motion.div>
              )}
              {done && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[9px] font-black text-emerald-400 uppercase">Complete</span>
                </div>
              )}
            </div>

            {/* Log lines */}
            <div
              ref={feedRef}
              className="p-4 font-mono text-[11px] sm:text-xs leading-relaxed space-y-0.5 overflow-y-auto max-h-64 sm:max-h-72 custom-scrollbar"
            >
              {visibleLines.map((line, i) => (
                <motion.div
                  key={line.id}
                  initial={prefersReducedMotion ? {} : { opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {line.type === 'header' ? (
                    <div className={`font-black mt-2 first:mt-0 ${PHASE_HEADER_BG[line.phase]}`}>
                      {line.text}
                    </div>
                  ) : line.type === 'typewriter' ? (
                    <div className="ml-2">
                      {typewriterActive || i < visibleLines.length - 1 ? (
                        i === visibleLines.length - 1 && typewriterActive ? (
                          <TypewriterLine text={line.text} onDone={finishPipeline} />
                        ) : (
                          <span className="text-rose-300">{line.text}</span>
                        )
                      ) : (
                        <span className="text-rose-300">{line.text}</span>
                      )}
                    </div>
                  ) : (
                    <div className={`ml-2 ${PHASE_COLORS[line.phase]}`}>
                      {line.text}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Running cursor when no typewriter */}
              {running && !done && !typewriterActive && visibleLines.length > 0 && visibleLines[visibleLines.length - 1]?.type !== 'typewriter' && (
                <motion.div
                  className="flex items-center gap-1 mt-1"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >
                  <span className="text-slate-600">▍</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results card */}
      {showCard && <DoctorCard />}

      {/* Stats row */}
      {showStats && <StatRow />}

      {/* Run again */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 flex flex-col sm:flex-row gap-2"
          >
            <button
              onClick={() => { reset(); setTimeout(startPipeline, 80); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold transition-all active:scale-95 text-sm min-h-[44px]"
            >
              <RotateCcw className="w-4 h-4" />
              Run Again
            </button>
            <a
              href="https://futureclinic-growth.vercel.app"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all text-sm min-h-[44px]"
            >
              Live Demo
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
