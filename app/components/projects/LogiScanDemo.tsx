'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ArrowRight, Camera, Upload, Brain, CheckCircle2, Info, AlertTriangle, Copy } from 'lucide-react';

interface Detection {
  id: string;
  apt: string;
  last4: string;
  status: 'matched' | 'orphan' | 'duplicate';
  confidence: number;
  box: { top: string; left: string; width: string; height: string };
  note: string;
}

// Positions matched to the actual package photo (rtXV6df.png)
const DETECTIONS: Detection[] = [
  { id: 'd1', apt: 'C08Q', last4: '9679', status: 'matched', confidence: 98, box: { top: '15%', left: '8%', width: '35%', height: '35%' }, note: 'Matched to imported manifest.' },
  { id: 'd2', apt: 'C14K', last4: '3728', status: 'matched', confidence: 96, box: { top: '12%', left: '52%', width: '40%', height: '30%' }, note: 'Matched to imported manifest.' },
  { id: 'd3', apt: 'C22B', last4: '5501', status: 'orphan', confidence: 75, box: { top: '55%', left: '15%', width: '32%', height: '32%' }, note: 'Sticker found but not in your imported list. Tracking partially obscured by tape.' },
  { id: 'd4', apt: '???', last4: '????', status: 'duplicate', confidence: 42, box: { top: '58%', left: '58%', width: '30%', height: '28%' }, note: 'Already detected in previous photo. Label damaged.' },
];

const STATUS_COLORS: Record<string, { border: string; bg: string; label: string }> = {
  matched: { border: '#22c55e', bg: 'rgba(34,197,94,0.15)', label: 'MATCHED' },
  orphan: { border: '#f97316', bg: 'rgba(249,115,22,0.15)', label: 'ORPHAN' },
  duplicate: { border: '#eab308', bg: 'rgba(234,179,8,0.15)', label: 'DUPLICATE' },
};

const STEPS = [
  {
    id: 0,
    title: 'Ready',
    desc: 'A concierge starts their shift. 40+ packages arrived today. Time to verify.',
    narration: 'The old way: grab a clipboard, walk the shelf, check each package against a printed list. Takes 30-60 minutes. Tonight we\'re using LogiScan.',
    technical: 'Zero-backend PWA. React 19 + Vite 7. All state persisted to localStorage with 300ms debounced writes.',
    phase: 'idle',
    boxes: 0,
    activeBox: -1,
    code: '// Zero backend. Zero database.\n// Everything runs in the browser.\n// State: localStorage (300ms debounce)\n// Cost: $0',
  },
  {
    id: 1,
    title: 'Paste Manifest',
    desc: 'Copy tonight\'s delivery list from the building system. Paste it in.',
    narration: 'The building management system exports a messy tab-separated list. LogiScan\'s parser handles the chaos - weird spacing, missing fields, duplicate entries.',
    technical: '12 unit tests cover the parser. Handles tab and space separation, regex apartment extraction, tracking number validation, duplicate detection.',
    phase: 'importing',
    boxes: 0,
    activeBox: -1,
    code: '// parsePackageList(clipboard)\n//\n// "C08Q Unit\\tUPS - 1ZA...9679 MARIA"\n//  → { apt: "C08Q", last4: "9679",\n//     carrier: "UPS", status: "pending" }\n//\n// 8 packages parsed. 0 errors.',
  },
  {
    id: 2,
    title: 'Take Photo',
    desc: 'Point the phone at the shelf. One photo captures multiple packages.',
    narration: 'No need to scan one by one. The camera captures the whole shelf. Image gets compressed client-side before hitting the AI.',
    technical: 'Client-side canvas compression. Max 1920px, JPEG 0.85 quality. Reduces ~2.2MB to ~800KB without losing sticker legibility.',
    phase: 'flash',
    boxes: 0,
    activeBox: -1,
    code: '// Client-side compression\nconst canvas = document.createElement("canvas");\ncanvas.width = Math.min(img.width, 1920);\n// JPEG quality: 0.85\n// 2.2MB → 800KB\n// Sticker text still legible ✓',
  },
  {
    id: 3,
    title: 'AI Analyzes',
    desc: 'Gemini 3 Flash reads every sticker in the photo. Not just OCR - it reasons.',
    narration: '"Is 9679 a tracking number or a date? Let me check the format..." The AI writes and executes validation code mid-inference. This is agentic vision.',
    technical: 'Gemini 3 Flash with code execution enabled. The model self-validates by writing Python to cross-check extracted fields. Cost: ~$0.002 per image.',
    phase: 'scanning',
    boxes: 0,
    activeBox: -1,
    code: '// Gemini 3 Flash (Agentic Vision)\n//\n// DETECT  → find all stickers\n// EXTRACT → apartment, tracking, date\n// REASON  → "9679 is tracking, not year"\n// EXECUTE → runs validation code\n//\n// Cost: $0.002 per image',
  },
  {
    id: 4,
    title: 'First Detection',
    desc: 'C08Q - 9679. Matched. 98% confidence. Green box appears.',
    narration: 'The first bounding box locks onto a sticker. Apartment C08Q, last four digits 9679. Cross-referenced against the manifest - it\'s a match.',
    technical: 'Normalized coordinates (0-1) from AI converted to pixel positions. Canvas overlay renders color-coded borders per status.',
    phase: 'photo',
    boxes: 1,
    activeBox: 0,
    code: '// Detection 1:\n// apartment: "C08Q"\n// last4:     "9679"\n// confidence: 0.98\n// status:    "matched" ✓\n//\n// Combo key C08Q-9679 found in manifest',
  },
  {
    id: 5,
    title: 'More Matches',
    desc: 'C14K - 3728. Also matched. Two down, shelf is getting verified fast.',
    narration: 'Second package confirmed. The bounding boxes keep appearing. Each one is matched against the imported list in real-time using apartment + last-4 combo keys.',
    technical: 'matchDetections() uses combo-key matching: `${apartment}-${last4}`. O(n*m) but n and m are small (typically < 50). 17 unit tests cover all 5 states.',
    phase: 'photo',
    boxes: 2,
    activeBox: 1,
    code: '// Detection 2:\n// apartment: "C14K"\n// last4:     "3728"\n// confidence: 0.96\n// status:    "matched" ✓\n//\n// 2 of 8 packages verified',
  },
  {
    id: 6,
    title: 'Orphan Found',
    desc: 'C22B - 5501. Not in the list. Orange box. Needs investigation.',
    narration: 'This sticker was readable but doesn\'t match any package in tonight\'s manifest. Could be from yesterday, could be mislabeled. Flagged for the concierge to check manually.',
    technical: 'Orphan status: detection has valid apartment + last4 but no matching combo key in the package list. Notes include diagnostic info about scan quality.',
    phase: 'photo',
    boxes: 3,
    activeBox: 2,
    code: '// Detection 3:\n// apartment: "C22B"\n// last4:     "5501"\n// confidence: 0.75\n// status:    "ORPHAN" ⚠\n//\n// "Not in imported package list"\n// "Tracking partially obscured by tape"',
  },
  {
    id: 7,
    title: 'Duplicate Caught',
    desc: 'Already scanned in a previous photo. Yellow box. Prevented double-count.',
    narration: 'This label was already detected in the first photo the concierge took. Without this check, the same package would be counted twice - throwing off the whole inventory.',
    technical: 'Cross-photo deduplication via combo-key set. If a detection\'s combo key was already matched in a previous photo\'s session, it\'s marked as duplicate.',
    phase: 'photo',
    boxes: 4,
    activeBox: 3,
    code: '// Detection 4:\n// apartment: "???"\n// last4:     "????"\n// confidence: 0.42\n// status:    "DUPLICATE" ⚡\n//\n// "Already detected in previous photo"\n// "Label damaged - partial read only"',
  },
  {
    id: 8,
    title: 'Done. 28 Seconds.',
    desc: '2 matched. 1 orphan. 1 duplicate. What used to take an hour took half a minute.',
    narration: 'The concierge has a complete breakdown. Matched packages are confirmed, the orphan is flagged for follow-up, and the duplicate was caught before it could corrupt the count.',
    technical: 'Full session persisted to localStorage. Includes all photos, detections, match results, and timestamps. Zero data sent to any server.',
    phase: 'complete',
    boxes: 4,
    activeBox: -1,
    code: '// SESSION COMPLETE\n//\n// Matched:    2  ✓ (green)\n// Orphan:     1  ⚠ (orange)\n// Duplicate:  1  ⚡ (yellow)\n//\n// Time:  28 seconds\n// Cost:  $0.002\n// Old method: 30-60 minutes',
  },
];

function ScanViewport({ phase, boxes, activeBox }: { phase: string; boxes: number; activeBox: number }) {
  const visible = DETECTIONS.slice(0, boxes);

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden h-full flex flex-col">
      <div className="px-3 py-1.5 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between flex-shrink-0">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
          {phase === 'complete' ? 'Results' : 'Camera Feed'}
        </span>
        <div className="flex gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${phase === 'complete' ? 'bg-emerald-500' : 'bg-red-500/50'}`} />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
        </div>
      </div>
      <div className="flex-1 relative min-h-[220px]">
        {/* Idle / Import */}
        {(phase === 'idle' || phase === 'importing') && (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center">
            {phase === 'idle' ? (
              <div className="text-center space-y-2">
                <Camera className="w-10 h-10 text-slate-700 mx-auto" />
                <span className="text-[9px] text-slate-600 uppercase tracking-widest font-bold block">No Photo Yet</span>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                  <Upload className="w-10 h-10 text-emerald-500 mx-auto" />
                </motion.div>
                <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-bold block">Parsing 8 Packages...</span>
                <div className="flex gap-1 justify-center">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2.5 h-2.5 rounded-sm bg-emerald-500/50"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Photo background */}
        {(phase === 'flash' || phase === 'scanning' || phase === 'photo' || phase === 'complete') && (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('https://i.imgur.com/rtXV6df.png')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-slate-900/10" />
          </div>
        )}

        {/* Camera flash */}
        <AnimatePresence>
          {phase === 'flash' && (
            <motion.div
              className="absolute inset-0 bg-white z-30"
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>

        {/* Scanning line effect */}
        <AnimatePresence>
          {phase === 'scanning' && (
            <>
              <motion.div
                className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent z-20"
                initial={{ top: '0%' }}
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="px-4 py-2 bg-purple-900/80 border border-purple-500/40 rounded-full backdrop-blur-sm"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <span className="text-[10px] font-black text-purple-300 uppercase tracking-wider">Gemini Analyzing</span>
                    <span className="text-[10px] text-purple-400/60">$0.002</span>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Bounding boxes */}
        {visible.map((det, i) => {
          const colors = STATUS_COLORS[det.status];
          const isActive = i === activeBox;
          return (
            <motion.div
              key={det.id}
              className="absolute z-10"
              style={{
                top: det.box.top,
                left: det.box.left,
                width: det.box.width,
                height: det.box.height,
              }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{
                opacity: 1,
                scale: 1,
                boxShadow: isActive ? `0 0 20px ${colors.border}40` : 'none',
              }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
            >
              <div
                className="absolute inset-0 rounded border-2"
                style={{ borderColor: colors.border, backgroundColor: colors.bg }}
              />
              {/* Label */}
              <div
                className="absolute -top-5 left-0 text-[8px] font-bold text-white px-1.5 py-0.5 rounded whitespace-nowrap"
                style={{ backgroundColor: colors.border }}
              >
                {det.apt} - {det.last4}
              </div>
              {/* Status icon */}
              {det.status === 'orphan' && (
                <motion.div
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.border }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <AlertTriangle className="w-2.5 h-2.5 text-white" />
                </motion.div>
              )}
              {det.status === 'duplicate' && (
                <motion.div
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.border }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Copy className="w-2.5 h-2.5 text-white" />
                </motion.div>
              )}
              {/* Active detail card */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="absolute -bottom-14 left-0 right-0 z-30"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    <div className="bg-slate-900/95 backdrop-blur-sm border rounded-md p-1.5 text-[7px]" style={{ borderColor: colors.border }}>
                      <div className="font-bold text-white">{colors.label} &bull; {det.confidence}%</div>
                      <div className="text-slate-400 mt-0.5 leading-tight">{det.note}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Final results overlay */}
        <AnimatePresence>
          {phase === 'complete' && (
            <motion.div
              className="absolute inset-0 z-20 flex items-end justify-center pb-3 px-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-full bg-slate-900/90 backdrop-blur-sm rounded-lg border border-emerald-500/30 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-black text-emerald-400 uppercase">Scan Complete</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">28s / $0.002</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-1.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                    <div className="text-lg font-black text-emerald-400">2</div>
                    <div className="text-[7px] font-bold text-emerald-400/70 uppercase">Matched</div>
                  </div>
                  <div className="text-center p-1.5 bg-orange-500/10 rounded border border-orange-500/20">
                    <div className="text-lg font-black text-orange-400">1</div>
                    <div className="text-[7px] font-bold text-orange-400/70 uppercase">Orphan</div>
                  </div>
                  <div className="text-center p-1.5 bg-yellow-500/10 rounded border border-yellow-500/20">
                    <div className="text-lg font-black text-yellow-400">1</div>
                    <div className="text-[7px] font-bold text-yellow-400/70 uppercase">Duplicate</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function LogiScanDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.5);
  const [showTechnical, setShowTechnical] = useState(false);
  const [scale, setScale] = useState(1);
  const [slideProgress, setSlideProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const STEP_DURATION = 4000 / speed;

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const ww = window.innerWidth;
        const wh = window.innerHeight;
        const ws = (ww * 0.95) / 1200;
        const hs = (wh * 0.92) / 720;
        setScale(Math.max(Math.min(ws, hs, 1), 0.35));
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isPlaying) { setSlideProgress(0); return; }
    const t0 = Date.now();
    const iv = setInterval(() => {
      setSlideProgress(Math.min(((Date.now() - t0) / STEP_DURATION) * 100, 100));
    }, 16);
    return () => clearInterval(iv);
  }, [isPlaying, currentStep, speed, STEP_DURATION]);

  useEffect(() => {
    if (!isPlaying) return;
    const to = setTimeout(() => {
      setCurrentStep((p) => {
        if (p >= STEPS.length - 1) { setIsPlaying(false); return p; }
        return p + 1;
      });
    }, STEP_DURATION);
    return () => clearTimeout(to);
  }, [isPlaying, currentStep, speed, STEP_DURATION]);

  const step = STEPS[currentStep];

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <div
        style={{ transform: `scale(${scale})`, transformOrigin: 'center center', width: '1200px', transition: 'transform 0.3s ease' }}
        className="space-y-3 py-1"
      >
        {/* Progress */}
        <div className="w-full max-w-3xl mx-auto">
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-emerald-500 shadow-[0_0_8px_#22c55e]"
              animate={{ width: `${((currentStep + slideProgress / 100) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-5 gap-4">
          {/* Pipeline + Info - 3 cols */}
          <div className="col-span-3 space-y-3">
            {/* Pipeline nodes */}
            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 opacity-10 pointer-events-none"
                   style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              <div className="relative flex justify-between items-center px-2">
                {[
                  { icon: Upload, label: 'Import', active: [1].includes(currentStep), color: '#10b981' },
                  { icon: Camera, label: 'Capture', active: [2].includes(currentStep), color: '#fbbf24' },
                  { icon: Brain, label: 'AI Vision', active: [3, 4, 5, 6, 7].includes(currentStep), color: '#8b5cf6' },
                  { icon: CheckCircle2, label: 'Results', active: [8].includes(currentStep), color: '#22c55e' },
                ].map((node, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 z-10 w-20">
                    <motion.div
                      animate={{
                        borderColor: node.active ? node.color : '#1e293b',
                        scale: node.active ? 1.1 : 1,
                        boxShadow: node.active ? `0 0 25px ${node.color}30` : 'none',
                      }}
                      className="w-16 h-16 rounded-2xl bg-slate-900 border-2 flex items-center justify-center transition-all duration-500"
                    >
                      <node.icon className="w-7 h-7 text-slate-400" />
                    </motion.div>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.15em]">{node.label}</span>
                  </div>
                ))}

                {/* Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                  {[
                    { x1: '16%', x2: '33%', active: currentStep >= 1 && currentStep <= 2, color: '#10b981' },
                    { x1: '40%', x2: '57%', active: currentStep >= 2 && currentStep <= 7, color: '#fbbf24' },
                    { x1: '64%', x2: '81%', active: currentStep >= 7, color: '#22c55e' },
                  ].map((line, i) => (
                    <AnimatePresence key={i}>
                      {line.active && (
                        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <line x1={line.x1} y1="40%" x2={line.x2} y2="40%" stroke={`${line.color}25`} strokeWidth="2" strokeDasharray="6 4" />
                          <motion.circle r="3" fill={line.color} filter="blur(1px)"
                            initial={{ cx: line.x1 }} animate={{ cx: line.x2 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} cy="40%" />
                        </motion.g>
                      )}
                    </AnimatePresence>
                  ))}
                </svg>
              </div>
            </div>

            {/* Info panel */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                      {currentStep + 1}/{STEPS.length}
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight">{step.title}</h3>
                  </div>
                  <button
                    onClick={() => setShowTechnical(!showTechnical)}
                    className="flex items-center gap-1 text-[9px] font-black text-slate-500 hover:text-emerald-400 transition-colors uppercase tracking-wider"
                  >
                    <Info className="w-3 h-3" />
                    {showTechnical ? 'Hide' : 'Tech'}
                  </button>
                </div>
                <p className="text-slate-300 text-xs font-medium leading-snug">{step.desc}</p>
                <div className="p-2 bg-slate-900/50 rounded-lg border border-slate-800/50">
                  <p className="text-slate-400 text-[11px] italic leading-snug">&ldquo;{step.narration}&rdquo;</p>
                </div>
                <AnimatePresence>
                  {showTechnical && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 overflow-hidden"
                    >
                      <span className="text-emerald-500 font-bold uppercase tracking-widest text-[8px] block mb-1">Technical</span>
                      {step.technical}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Code */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col shadow-xl">
                <div className="px-3 py-1 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">typescript</span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/30" />
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/30" />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
                  </div>
                </div>
                <div className="p-2.5 font-mono flex-1 overflow-auto">
                  <pre className="text-emerald-400/90 leading-relaxed whitespace-pre-wrap text-[10px]">
                    <code>{step.code}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => { setCurrentStep(Math.max(0, currentStep - 1)); setSlideProgress(0); }}
                disabled={currentStep === 0}
                className="p-2 bg-slate-800 text-white rounded-lg disabled:opacity-20 hover:bg-slate-700 transition-all active:scale-90"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-5 py-2 rounded-lg bg-emerald-500 text-slate-950 font-black hover:bg-emerald-400 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-emerald-500/30 text-sm"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                {isPlaying ? 'PAUSE' : 'PLAY'}
              </button>
              <button
                onClick={() => { setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1)); setSlideProgress(0); }}
                disabled={currentStep === STEPS.length - 1}
                className="p-2 bg-slate-800 text-white rounded-lg disabled:opacity-20 hover:bg-slate-700 transition-all active:scale-90"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setCurrentStep(0); setIsPlaying(false); setSlideProgress(0); }}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all active:scale-90"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800">
                {[0.5, 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSpeed(s); setSlideProgress(0); }}
                    className={`px-3 py-1 rounded text-[10px] font-black transition-all ${speed === s ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {s}X
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scan viewport - 2 cols */}
          <div className="col-span-2">
            <ScanViewport phase={step.phase} boxes={step.boxes} activeBox={step.activeBox} />
          </div>
        </div>
      </div>
    </div>
  );
}
