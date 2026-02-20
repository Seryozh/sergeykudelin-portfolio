'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Play, RotateCcw, CheckCircle2, Star } from 'lucide-react';

type Phase = 'discovery' | 'intelligence' | 'verification' | 'enrichment' | 'outreach';

interface LogLine {
  id: number;
  phase: Phase;
  type: 'header' | 'line' | 'typewriter';
  text: string;
  costDelta?: number;
}

const LINES: LogLine[] = [
  // Phase 1: Discovery (~$0.008)
  { id: 0,  phase: 'discovery',    type: 'header',     text: '🔍  Phase 1: Discovery  ·  scanning YouTube' },
  { id: 1,  phase: 'discovery',    type: 'line',       text: '   query: "board certified dermatologist skincare"' },
  { id: 2,  phase: 'discovery',    type: 'line',       text: '   query: "dermatologist explains treatment 2024"' },
  { id: 3,  phase: 'discovery',    type: 'line',       text: '→  @DrSandraLee     2.1M subs  ·  847 videos', costDelta: 0.002 },
  { id: 4,  phase: 'discovery',    type: 'line',       text: '→  @DermDoctor      847K subs  ·  412 videos', costDelta: 0.002 },
  { id: 5,  phase: 'discovery',    type: 'line',       text: '→  @BoardCertDerm   312K subs  ·  203 videos', costDelta: 0.002 },
  { id: 6,  phase: 'discovery',    type: 'line',       text: '→  @DrShereene      198K subs  ·  dropped (low engagement)', costDelta: 0.002 },
  { id: 7,  phase: 'discovery',    type: 'line',       text: '✓  4 found  ·  top 3 selected by engagement score' },

  // Phase 2: Intelligence (~$0.006)
  { id: 8,  phase: 'intelligence', type: 'header',     text: '🧠  Phase 2: Intelligence  ·  resolving real identities' },
  { id: 9,  phase: 'intelligence', type: 'line',       text: '→  @DrSandraLee  =>  Sandra Lee, MD  [high confidence]', costDelta: 0.002 },
  { id: 10, phase: 'intelligence', type: 'line',       text: '   About page  ·  bio link  ·  Wikipedia cross-ref' },
  { id: 11, phase: 'intelligence', type: 'line',       text: '→  @DermDoctor   =>  Muneeb Shah, DO  [high confidence]', costDelta: 0.002 },
  { id: 12, phase: 'intelligence', type: 'line',       text: '   Instagram  ·  Doximity profile  ·  conference bio' },
  { id: 13, phase: 'intelligence', type: 'line',       text: '→  @BoardCertDerm =>  Rachel Kim, DO  [medium confidence]', costDelta: 0.002 },
  { id: 14, phase: 'intelligence', type: 'line',       text: '   LinkedIn  ·  NPI name match  ·  email domain' },
  { id: 15, phase: 'intelligence', type: 'line',       text: '✓  3/3 resolved  ·  @DrShereene dropped (confidence < 0.7)' },

  // Phase 3: Verification ($0.000)
  { id: 16, phase: 'verification', type: 'header',     text: '✅  Phase 3: Verification  ·  NPI Registry lookup' },
  { id: 17, phase: 'verification', type: 'line',       text: '→  Sandra Lee, MD  ·  NPI #1932748501  ·  ACTIVE  ·  Dermatology  =>  Gold' },
  { id: 18, phase: 'verification', type: 'line',       text: '→  Muneeb Shah, DO ·  NPI #1245678903  ·  ACTIVE  ·  Dermatology  =>  Gold' },
  { id: 19, phase: 'verification', type: 'line',       text: '→  Rachel Kim, DO  ·  NPI #1867453021  ·  ACTIVE  ·  Internal Med  =>  Silver' },
  { id: 20, phase: 'verification', type: 'line',       text: '✓  3/3 verified  ·  $0.000  (government registry)' },

  // Phase 4: Enrichment (~$0.018)
  { id: 21, phase: 'enrichment',   type: 'header',     text: '📬  Phase 4: Enrichment  ·  building contact profiles' },
  { id: 22, phase: 'enrichment',   type: 'line',       text: '→  Sandra Lee:   email ✓  (regex from YouTube bio)', costDelta: 0.004 },
  { id: 23, phase: 'enrichment',   type: 'line',       text: '                LinkedIn ✓  ·  Doximity ✓  ·  practice address ✓' },
  { id: 24, phase: 'enrichment',   type: 'line',       text: '→  Muneeb Shah:  email ✓  (Hunter.io  ·  94% confidence)', costDelta: 0.007 },
  { id: 25, phase: 'enrichment',   type: 'line',       text: '                LinkedIn ✓  ·  Doximity ✓  ·  conference speaker ✓' },
  { id: 26, phase: 'enrichment',   type: 'line',       text: '→  Rachel Kim:   phone ✓  (NPI fallback  ·  practice number)', costDelta: 0.007 },
  { id: 27, phase: 'enrichment',   type: 'line',       text: '                LinkedIn ✓  ·  Doximity ✓  ·  email partial' },
  { id: 28, phase: 'enrichment',   type: 'line',       text: '✓  Profiles complete  ·  running total: $0.026' },

  // Phase 5: Outreach (~$0.013)
  { id: 29, phase: 'outreach',     type: 'header',     text: '📝  Phase 5: Outreach  ·  personalizing messages' },
  { id: 30, phase: 'outreach',     type: 'line',       text: '→  Sandra Lee  [Gold · monetization angle]:' },
  { id: 31, phase: 'outreach',     type: 'typewriter', text: '"Dr. Lee, your 2.1M subscribers trust your clinical judgment. Give them a direct line to book with you."', costDelta: 0.005 },
  { id: 32, phase: 'outreach',     type: 'line',       text: '→  Muneeb Shah  [Gold · credibility angle]:' },
  { id: 33, phase: 'outreach',     type: 'typewriter', text: '"Dr. Shah, your evidence-based content converts. Telehealth closes the gap between viewers and patients."', costDelta: 0.004 },
  { id: 34, phase: 'outreach',     type: 'line',       text: '→  Rachel Kim  [Silver · growth angle]:' },
  { id: 35, phase: 'outreach',     type: 'typewriter', text: '"Dr. Kim, 312K viewers already trust your judgment. Converting 0.1% to patients is 312 new consultations."', costDelta: 0.004 },
];

const TOTAL_COST = LINES.reduce((s, l) => s + (l.costDelta ?? 0), 0);

const PHASE_COLOR: Record<Phase, string> = {
  discovery:    'text-blue-400',
  intelligence: 'text-violet-400',
  verification: 'text-emerald-400',
  enrichment:   'text-amber-400',
  outreach:     'text-rose-400',
};

const PHASE_HEADER_COLOR: Record<Phase, string> = {
  discovery:    'text-blue-300',
  intelligence: 'text-violet-300',
  verification: 'text-emerald-300',
  enrichment:   'text-amber-300',
  outreach:     'text-rose-300',
};

interface Doctor {
  initials: string;
  gradient: string;
  name: string;
  title: string;
  subs: string;
  handle: string;
  tier: 'Gold' | 'Silver';
  npi: string;
  specialty: string;
  contactLabel: string;
  contact: string;
  linkedin: string;
  hook: string;
}

const DOCTORS: Doctor[] = [
  {
    initials: 'SL',
    gradient: 'from-violet-500 to-fuchsia-500',
    name: 'Sandra Lee, MD',
    title: 'Board-Certified Dermatologist',
    subs: '2.1M YouTube',
    handle: '@DrSandraLee',
    tier: 'Gold',
    npi: '#1932748501',
    specialty: 'Dermatology',
    contactLabel: 'Email',
    contact: 'sandra@drpimplepopper.com',
    linkedin: '/in/sandralee-md',
    hook: 'Your 2.1M subscribers trust your clinical judgment. Give them a direct line to book with you.',
  },
  {
    initials: 'MS',
    gradient: 'from-blue-500 to-violet-500',
    name: 'Muneeb Shah, DO',
    title: 'Board-Certified Dermatologist',
    subs: '847K YouTube',
    handle: '@DermDoctor',
    tier: 'Gold',
    npi: '#1245678903',
    specialty: 'Dermatology',
    contactLabel: 'Email',
    contact: 'muneeb@dermdr.com',
    linkedin: '/in/muneebshah-do',
    hook: 'Your evidence-based content converts viewers into patients. Telehealth closes that gap.',
  },
  {
    initials: 'RK',
    gradient: 'from-indigo-400 to-blue-500',
    name: 'Rachel Kim, DO',
    title: 'Internal Medicine Physician',
    subs: '312K YouTube',
    handle: '@BoardCertDerm',
    tier: 'Silver',
    npi: '#1867453021',
    specialty: 'Internal Medicine',
    contactLabel: 'Phone',
    contact: '(practice number)',
    linkedin: '/in/rachelkim-do',
    hook: '312K viewers already trust your judgment. Converting 0.1% to patients is 312 new consultations.',
  },
];

function TypewriterLine({ text, onDone }: { text: string; onDone: () => void }) {
  const [displayed, setDisplayed] = useState('');
  const prefersReducedMotion = useReducedMotion();
  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayed(text);
      onDoneRef.current();
      return;
    }
    let i = 0;
    let timeoutId: ReturnType<typeof setTimeout>;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(iv);
        timeoutId = setTimeout(() => onDoneRef.current(), 500);
      }
    }, 20);
    return () => {
      clearInterval(iv);
      clearTimeout(timeoutId);
    };
  }, [text, prefersReducedMotion]);

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

function DoctorCard({ doctor, delay }: { doctor: Doctor; delay: number }) {
  const isGold = doctor.tier === 'Gold';
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-slate-900 border border-violet-500/20 rounded-xl p-3.5 flex flex-col gap-2.5"
    >
      <div className="flex items-start gap-2.5">
        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${doctor.gradient} flex items-center justify-center text-white text-[11px] font-black flex-shrink-0`}>
          {doctor.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-black text-white leading-tight">{doctor.name}</div>
          <div className="text-[10px] text-violet-400 leading-tight">{doctor.title}</div>
          <div className="text-[9px] text-slate-500 mt-0.5">{doctor.subs} · {doctor.handle}</div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 pt-0.5">
          {isGold
            ? <CheckCircle2 className="w-3 h-3 text-amber-400" />
            : <Star className="w-3 h-3 text-slate-400" />
          }
          <span className={`text-[9px] font-black uppercase ${isGold ? 'text-amber-400' : 'text-slate-400'}`}>
            {doctor.tier}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1">
        {[
          { label: 'NPI', val: doctor.npi },
          { label: 'Specialty', val: doctor.specialty },
          { label: doctor.contactLabel, val: doctor.contact },
          { label: 'LinkedIn', val: doctor.linkedin },
        ].map((f) => (
          <div key={f.label} className="bg-slate-800/70 rounded-lg px-2 py-1.5">
            <div className="text-[8px] text-slate-500 uppercase tracking-wider">{f.label}</div>
            <div className="text-[9px] text-white font-mono truncate">{f.val}</div>
          </div>
        ))}
      </div>

      <div className="bg-rose-500/5 border border-rose-500/20 rounded-lg px-2.5 py-2">
        <div className="text-[8px] font-black text-rose-400 uppercase tracking-wider mb-0.5">Outreach Hook</div>
        <div className="text-[10px] text-slate-300 italic leading-relaxed">&ldquo;{doctor.hook}&rdquo;</div>
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
        { val: '3 doctors', color: 'text-blue-400' },
        { val: `$${TOTAL_COST.toFixed(3)} total`, color: 'text-amber-400' },
        { val: '~90 sec', color: 'text-emerald-400' },
      ].map((s) => (
        <div key={s.val} className="text-center py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
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
  const [costUSD, setCostUSD] = useState(0);
  const [typewriterActive, setTypewriterActive] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const lineIndexRef = useRef(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const addNextRef = useRef<(() => void) | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const clearAll = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const onTypewriterDone = () => {
    setTypewriterActive(false);
    const t = setTimeout(() => addNextRef.current?.(), 400);
    timeoutsRef.current.push(t);
  };

  const finishPipeline = () => {
    const t1 = setTimeout(() => setShowCards(true), 300);
    const t2 = setTimeout(() => setShowStats(true), 700);
    const t3 = setTimeout(() => setDone(true), 800);
    timeoutsRef.current.push(t1, t2, t3);
  };

  const startPipeline = () => {
    setRunning(true);
    setDone(false);
    setVisibleLines([]);
    setCostUSD(0);
    setTypewriterActive(false);
    setShowCards(false);
    setShowStats(false);
    lineIndexRef.current = 0;

    if (prefersReducedMotion) {
      setVisibleLines([...LINES]);
      setCostUSD(TOTAL_COST);
      setShowCards(true);
      setShowStats(true);
      setDone(true);
      return;
    }

    const addNext = () => {
      const idx = lineIndexRef.current;
      if (idx >= LINES.length) {
        finishPipeline();
        return;
      }
      const line = LINES[idx];
      lineIndexRef.current++;
      setVisibleLines(prev => [...prev, line]);
      if (line.costDelta) {
        setCostUSD(prev => Math.round((prev + line.costDelta!) * 10000) / 10000);
      }
      setTimeout(() => {
        if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
      }, 30);
      if (line.type === 'typewriter') {
        setTypewriterActive(true);
        return;
      }
      const delay = line.type === 'header' ? 260 : 110;
      const t = setTimeout(addNext, delay);
      timeoutsRef.current.push(t);
    };

    addNextRef.current = addNext;
    addNext();
  };

  const reset = () => {
    clearAll();
    setRunning(false);
    setDone(false);
    setVisibleLines([]);
    setCostUSD(0);
    setTypewriterActive(false);
    setShowCards(false);
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
    <div className="w-full px-2 sm:px-0 py-2">
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
              Simulates a full run · YouTube discovery through personalized outreach
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
            <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">pipeline.ts</span>
              </div>
              <div className="flex items-center gap-3">
                {costUSD > 0 && (
                  <span className="text-[10px] font-mono text-amber-400/80">
                    ${costUSD.toFixed(3)}
                  </span>
                )}
                {!done ? (
                  <motion.div
                    className="flex items-center gap-1.5"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    <span className="text-[9px] font-black text-violet-400 uppercase">Running</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[9px] font-black text-emerald-400 uppercase">Complete</span>
                  </div>
                )}
              </div>
            </div>

            {/* Log lines */}
            <div
              ref={feedRef}
              className="p-4 font-mono text-[11px] leading-relaxed space-y-0.5 overflow-y-auto max-h-72 custom-scrollbar"
            >
              {visibleLines.map((line, i) => (
                <motion.div
                  key={line.id}
                  initial={prefersReducedMotion ? {} : { opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {line.type === 'header' ? (
                    <div className={`font-black mt-2 first:mt-0 ${PHASE_HEADER_COLOR[line.phase]}`}>
                      {line.text}
                    </div>
                  ) : line.type === 'typewriter' ? (
                    <div className="ml-2 mt-0.5">
                      {i === visibleLines.length - 1 && typewriterActive ? (
                        <TypewriterLine text={line.text} onDone={onTypewriterDone} />
                      ) : (
                        <span className="text-rose-300">{line.text}</span>
                      )}
                    </div>
                  ) : (
                    <div className={`ml-2 ${PHASE_COLOR[line.phase]}`}>
                      {line.text}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Running cursor */}
              {running && !done && !typewriterActive && visibleLines.length > 0 && visibleLines[visibleLines.length - 1]?.type !== 'typewriter' && (
                <motion.div
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="flex items-center gap-1 mt-1"
                >
                  <span className="text-slate-600">▍</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Doctor cards */}
      {showCards && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DOCTORS.map((doc, i) => (
            <DoctorCard key={doc.name} doctor={doc} delay={i * 0.12} />
          ))}
        </div>
      )}

      {/* Stats */}
      {showStats && <StatRow />}

      {/* Run again */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4"
          >
            <button
              onClick={() => { reset(); setTimeout(startPipeline, 80); }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold transition-all active:scale-95 text-sm min-h-[44px]"
            >
              <RotateCcw className="w-4 h-4" />
              Run Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
