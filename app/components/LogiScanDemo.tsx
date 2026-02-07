'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ArrowRight, Camera, Upload, Brain, CheckCircle2, AlertTriangle, Copy, Info } from 'lucide-react';

interface Detection {
  id: string;
  apt: string;
  last4: string;
  status: 'matched' | 'orphan' | 'duplicate';
  confidence: number;
  box: { top: string; left: string; width: string; height: string };
  note: string;
}

const DETECTIONS: Detection[] = [
  { id: 'd1', apt: 'N04W', last4: '9679', status: 'matched', confidence: 98, box: { top: '8%', left: '5%', width: '28%', height: '22%' }, note: 'Successfully matched to package list.' },
  { id: 'd2', apt: 'N04O', last4: '3728', status: 'matched', confidence: 96, box: { top: '8%', left: '38%', width: '26%', height: '22%' }, note: 'Successfully matched to package list.' },
  { id: 'd3', apt: 'C14K', last4: '5501', status: 'matched', confidence: 97, box: { top: '8%', left: '70%', width: '26%', height: '22%' }, note: 'Successfully matched to package list.' },
  { id: 'd4', apt: 'N08N', last4: '0062', status: 'orphan', confidence: 75, box: { top: '38%', left: '5%', width: '28%', height: '22%' }, note: 'Sticker found but not in your imported list. Tracking partially obscured.' },
  { id: 'd5', apt: 'C22B', last4: '4821', status: 'matched', confidence: 94, box: { top: '38%', left: '38%', width: '26%', height: '22%' }, note: 'Successfully matched to package list.' },
  { id: 'd6', apt: 'N03X', last4: '9679', status: 'duplicate', confidence: 92, box: { top: '38%', left: '70%', width: '26%', height: '22%' }, note: 'This sticker was already detected in a previous photo.' },
  { id: 'd7', apt: 'C01K', last4: '1184', status: 'matched', confidence: 99, box: { top: '68%', left: '5%', width: '28%', height: '22%' }, note: 'Successfully matched to package list.' },
  { id: 'd8', apt: 'C08Q', last4: '7390', status: 'matched', confidence: 95, box: { top: '68%', left: '38%', width: '26%', height: '22%' }, note: 'Successfully matched to package list.' },
];

const STEPS = [
  {
    id: 0,
    title: 'Ready to Scan',
    desc: 'The system is loaded. A concierge is about to verify tonight\'s package deliveries.',
    narration: 'LogiScan is open on a phone. The concierge has a shelf full of packages to verify against tonight\'s delivery manifest.',
    technicalDetail: 'React 19 + Vite 7 PWA. Zero backend. All state in localStorage with 300ms debounced persistence.',
    phase: 'idle',
    visibleDetections: 0,
    code: '// LogiScan ready\n// State: sessionStore (localStorage)\n// Backend: none (zero-server architecture)',
    lang: 'typescript',
  },
  {
    id: 1,
    title: 'Import Package Manifest',
    desc: 'Concierge pastes the delivery list from the building management system.',
    narration: 'The manifest is a tab-separated export from the building\'s package tracking system. LogiScan\'s parser handles messy formatting automatically.',
    technicalDetail: 'parsePackageList() handles tab/space separation, extracts apartment codes via regex, pulls last-4 from tracking numbers. 12 unit tests cover edge cases.',
    phase: 'importing',
    visibleDetections: 0,
    code: '// parsePackageList(rawText)\n// Input: "N04W Unit\\tUPS - 1ZA827...9679 MARIA"\n// Output: { apartment: "N04W", last4: "9679",\n//          carrier: "UPS", status: "pending" }',
    lang: 'typescript',
  },
  {
    id: 2,
    title: 'Manifest Loaded',
    desc: '8 packages imported. 0 errors. Ready to scan.',
    narration: 'The parser successfully extracted all 8 packages with apartment codes, carrier info, and tracking numbers. Zero errors on this batch.',
    technicalDetail: 'Combo-key deduplication (apt+last4) prevents duplicate entries. Each package gets a unique ID and "pending" status.',
    phase: 'loaded',
    visibleDetections: 0,
    code: '// 8 packages parsed successfully\n// Combo keys: ["N04W-9679", "N04O-3728",\n//   "C14K-5501", "C22B-4821", "C01K-1184",\n//   "C08Q-7390", "N08W-2255", "C03H-6619"]',
    lang: 'typescript',
  },
  {
    id: 3,
    title: 'Take Photo',
    desc: 'Concierge points the phone camera at the package shelf and takes a photo.',
    narration: 'One photo captures multiple packages at once. The image is compressed client-side (1920px max, 0.85 JPEG quality) before being sent to the AI.',
    technicalDetail: 'Client-side compression via canvas. Max dimension 1920px, JPEG quality 0.85. Reduces upload size by ~60% without losing label legibility.',
    phase: 'photo',
    visibleDetections: 0,
    code: '// capturePhoto()\n// 1. Canvas resize: max 1920px\n// 2. JPEG compression: quality 0.85\n// 3. Size: ~800KB (from ~2.2MB)\n// 4. Send to Gemini 3 Flash Vision',
    lang: 'typescript',
  },
  {
    id: 4,
    title: 'AI Processing',
    desc: 'Gemini 3 Flash analyzes the image with agentic vision and code execution.',
    narration: 'The AI doesn\'t just OCR the labels. It reasons about what it sees - validating that "9679" is a tracking number, not a date or apartment code.',
    technicalDetail: 'Gemini 3 Flash Agentic Vision with code execution. The model writes and runs validation code mid-inference. Cost: ~$0.002 per image.',
    phase: 'processing',
    visibleDetections: 0,
    code: '// Gemini 3 Flash (Agentic Vision)\n// DETECT: Find all package stickers\n// EXTRACT: Apartment, tracking, date, initials\n// REASON: "9679 is tracking, not a year"\n// VALIDATE: Run code to cross-check fields\n// Cost: ~$0.002',
    lang: 'typescript',
  },
  {
    id: 5,
    title: 'Detections Appear',
    desc: 'Bounding boxes start appearing on the photo. 3 packages identified so far.',
    narration: 'The AI returns normalized coordinates (0-1) for each detected sticker. The canvas overlay converts these to pixel positions with color-coded status borders.',
    technicalDetail: 'BoundingBoxOverlay renders on HTML canvas. Coordinates normalized 0-1, scaled to display size. Status colors: green=matched, orange=orphan, yellow=duplicate, red=unreadable.',
    phase: 'detecting',
    visibleDetections: 3,
    code: '// BoundingBoxOverlay.tsx\nconst STATUS_COLORS = {\n  matched:   "#22c55e",  // green\n  orphan:    "#f97316",  // orange\n  duplicate: "#eab308",  // yellow\n  unreadable:"#ef4444",  // red\n};',
    lang: 'typescript',
  },
  {
    id: 6,
    title: 'Matching Algorithm',
    desc: 'All 8 stickers detected. Running 5-state matching against the imported manifest.',
    narration: 'Each detection is matched against the package list using apartment + last-4 combo keys. The algorithm handles duplicates, orphans, and ambiguous matches.',
    technicalDetail: 'matchDetections() runs combo-key matching. 5 states: matched (found in list), duplicate (already counted), orphan (not in list), unreadable (null fields), ambiguous (multiple matches). 17 unit tests.',
    phase: 'matching',
    visibleDetections: 8,
    code: '// matchDetections(packages, detections)\n// For each detection:\n//   1. Check readable (apt && last4 != null)\n//   2. Build combo key: `${apt}-${last4}`\n//   3. Find pending packages with same key\n//   4. 0 matches = orphan\n//   5. 1 match = matched (set "found")\n//   6. 2+ matches = ambiguous',
    lang: 'typescript',
  },
  {
    id: 7,
    title: 'Results Dashboard',
    desc: '6 matched. 1 orphan. 1 duplicate. Verification complete in under 30 seconds.',
    narration: 'The concierge sees the full breakdown instantly. The orphan package needs manual investigation. The duplicate was already scanned in a previous photo.',
    technicalDetail: 'Results persisted to localStorage. Session state includes all photos, detections, and match results. Exportable for record-keeping.',
    phase: 'complete',
    visibleDetections: 8,
    code: '// RESULTS:\n// Matched:   6 packages  (green)\n// Orphan:    1 package   (orange)\n// Duplicate: 1 detection (yellow)\n//\n// Time: ~28 seconds\n// Cost: $0.002\n// Previous method: 30-60 minutes',
    lang: 'typescript',
  },
];

const STATUS_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  matched: { border: '#22c55e', bg: 'rgba(34,197,94,0.15)', text: 'text-emerald-400' },
  orphan: { border: '#f97316', bg: 'rgba(249,115,22,0.15)', text: 'text-orange-400' },
  duplicate: { border: '#eab308', bg: 'rgba(234,179,8,0.15)', text: 'text-yellow-400' },
};

function ScanPreview({ phase, visibleDetections }: { phase: string; visibleDetections: number }) {
  const visible = DETECTIONS.slice(0, visibleDetections);

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden h-full flex flex-col">
      <div className="px-3 py-1.5 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between flex-shrink-0">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Scan Preview</span>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
        </div>
      </div>
      <div className="flex-1 relative min-h-[200px]">
        {/* Background image - package shelf */}
        {(phase === 'photo' || phase === 'processing' || phase === 'detecting' || phase === 'matching' || phase === 'complete') && (
          <div className="absolute inset-0 bg-[url('https://i.imgur.com/rtXV6df.png')] bg-cover bg-center">
            <div className="absolute inset-0 bg-slate-900/20" />
          </div>
        )}

        {/* Idle / Import states */}
        {(phase === 'idle' || phase === 'importing' || phase === 'loaded') && (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center">
            {phase === 'idle' && (
              <div className="text-center">
                <Camera className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <span className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">Awaiting Scan</span>
              </div>
            )}
            {phase === 'importing' && (
              <motion.div className="text-center" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <Upload className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-bold">Parsing Manifest...</span>
              </motion.div>
            )}
            {phase === 'loaded' && (
              <div className="text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-bold">8 Packages Loaded</span>
                <div className="mt-3 flex gap-1 justify-center">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-emerald-500/40"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.08 }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Processing overlay */}
        <AnimatePresence>
          {phase === 'processing' && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full backdrop-blur-sm"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] font-bold text-purple-400 uppercase">Gemini Analyzing...</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Camera flash effect */}
        <AnimatePresence>
          {phase === 'photo' && (
            <motion.div
              className="absolute inset-0 bg-white z-30"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </AnimatePresence>

        {/* Bounding boxes */}
        {visible.map((det, i) => {
          const colors = STATUS_COLORS[det.status];
          return (
            <motion.div
              key={det.id}
              className="absolute rounded border-2 z-10"
              style={{
                top: det.box.top,
                left: det.box.left,
                width: det.box.width,
                height: det.box.height,
                borderColor: colors.border,
                backgroundColor: colors.bg,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.12, duration: 0.3 }}
            >
              <div
                className="absolute -top-4 left-0 text-[7px] font-bold text-white px-1 py-0.5 rounded whitespace-nowrap"
                style={{ backgroundColor: colors.border }}
              >
                {det.apt} - {det.last4}
              </div>
              {det.status === 'orphan' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-[6px] font-black text-white">!</span>
                </div>
              )}
              {det.status === 'duplicate' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Copy className="w-1.5 h-1.5 text-white" />
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Results summary overlay */}
        <AnimatePresence>
          {phase === 'complete' && (
            <motion.div
              className="absolute bottom-2 left-2 right-2 z-20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-slate-900/90 backdrop-blur-sm rounded-lg p-2 border border-slate-700 flex items-center justify-between">
                <div className="flex gap-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[8px] font-bold text-emerald-400">6 Matched</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-[8px] font-bold text-orange-400">1 Orphan</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span className="text-[8px] font-bold text-yellow-400">1 Duplicate</span>
                  </div>
                </div>
                <span className="text-[8px] font-bold text-emerald-400">$0.002</span>
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
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const baseWidth = 1200;
        const baseHeight = 720;
        const widthScale = (windowWidth * 0.95) / baseWidth;
        const heightScale = (windowHeight * 0.92) / baseHeight;
        const newScale = Math.min(widthScale, heightScale, 1);
        setScale(Math.max(newScale, 0.35));
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      setSlideProgress(0);
      return;
    }
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / STEP_DURATION) * 100, 100);
      setSlideProgress(progress);
    }, 16);
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, speed, STEP_DURATION]);

  useEffect(() => {
    if (!isPlaying) return;
    const timeout = setTimeout(() => {
      setCurrentStep((prev) => {
        if (prev >= STEPS.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, STEP_DURATION);
    return () => clearTimeout(timeout);
  }, [isPlaying, currentStep, speed, STEP_DURATION]);

  const step = STEPS[currentStep];

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setSlideProgress(0);
  };

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          width: '1200px',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        className="space-y-3 py-1"
      >
        {/* Progress Bar */}
        <div className="w-full max-w-3xl mx-auto">
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-emerald-500 shadow-[0_0_8px_#22c55e]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + (slideProgress / 100)) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Main: Workflow + Scan Preview */}
        <div className="grid grid-cols-3 gap-4">
          {/* Workflow Pipeline - 2 cols */}
          <div className="col-span-2 bg-slate-950 rounded-[2rem] p-6 border border-slate-800 relative overflow-hidden min-h-[240px] flex flex-col justify-center shadow-2xl">
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                 style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="relative flex justify-between items-center max-w-3xl mx-auto w-full px-4">
              {/* Import Node */}
              <div className="flex flex-col items-center gap-3 z-10 w-24">
                <motion.div
                  animate={{
                    borderColor: [1, 2].includes(currentStep) ? '#10b981' : '#1e293b',
                    scale: [1, 2].includes(currentStep) ? 1.1 : 1,
                    boxShadow: [1, 2].includes(currentStep) ? '0 0 30px rgba(16, 185, 129, 0.3)' : 'none'
                  }}
                  className="w-20 h-20 rounded-[1.5rem] bg-slate-900 border-2 flex items-center justify-center transition-all duration-500"
                >
                  <Upload className="w-8 h-8 text-slate-400" />
                </motion.div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em]">Import</span>
              </div>

              {/* Camera Node */}
              <div className="flex flex-col items-center gap-3 z-10 w-24">
                <motion.div
                  animate={{
                    borderColor: [3].includes(currentStep) ? '#fbbf24' : '#1e293b',
                    scale: [3].includes(currentStep) ? 1.1 : 1,
                    boxShadow: [3].includes(currentStep) ? '0 0 30px rgba(251, 191, 36, 0.3)' : 'none'
                  }}
                  className="w-20 h-20 rounded-[1.5rem] bg-slate-900 border-2 flex items-center justify-center transition-all duration-500"
                >
                  <Camera className="w-8 h-8 text-slate-400" />
                </motion.div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em]">Capture</span>
              </div>

              {/* AI Node */}
              <div className="flex flex-col items-center gap-3 z-10 w-24">
                <motion.div
                  animate={{
                    borderColor: [4, 5, 6].includes(currentStep) ? '#8b5cf6' : '#1e293b',
                    scale: [4, 5, 6].includes(currentStep) ? 1.1 : 1,
                    boxShadow: [4, 5, 6].includes(currentStep) ? '0 0 30px rgba(139, 92, 246, 0.3)' : 'none'
                  }}
                  className="w-20 h-20 rounded-[1.5rem] bg-slate-900 border-2 flex items-center justify-center relative transition-all duration-500"
                >
                  <Brain className="w-8 h-8 text-slate-400" />
                  <AnimatePresence>
                    {currentStep === 4 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute -top-3 -right-3 bg-purple-500 text-[8px] font-black px-2 py-0.5 rounded-full text-white shadow-xl"
                      >
                        $0.002
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em]">AI Vision</span>
              </div>

              {/* Results Node */}
              <div className="flex flex-col items-center gap-3 z-10 w-24">
                <motion.div
                  animate={{
                    borderColor: [7].includes(currentStep) ? '#22c55e' : '#1e293b',
                    scale: [7].includes(currentStep) ? 1.1 : 1,
                    boxShadow: [7].includes(currentStep) ? '0 0 30px rgba(34, 197, 94, 0.3)' : 'none'
                  }}
                  className="w-20 h-20 rounded-[1.5rem] bg-slate-900 border-2 flex items-center justify-center relative transition-all duration-500"
                >
                  <CheckCircle2 className="w-8 h-8 text-slate-400" />
                  <AnimatePresence>
                    {currentStep === 7 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute -top-3 -right-3 bg-emerald-500 text-[8px] font-black px-2 py-0.5 rounded-full text-white shadow-xl"
                      >
                        DONE
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em]">Results</span>
              </div>

              {/* SVG connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 5 }}>
                {/* Import -> Camera */}
                <AnimatePresence>
                  {[1, 2, 3].includes(currentStep) && (
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <line x1="18%" y1="30%" x2="32%" y2="30%" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="2" strokeDasharray="6 4" />
                      <motion.circle r="3" fill="#10b981" filter="blur(1px)"
                        initial={{ cx: "18%" }} animate={{ cx: "32%" }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} cy="30%" />
                    </motion.g>
                  )}
                </AnimatePresence>

                {/* Camera -> AI */}
                <AnimatePresence>
                  {[3, 4, 5, 6].includes(currentStep) && (
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <line x1="43%" y1="30%" x2="57%" y2="30%" stroke="rgba(251, 191, 36, 0.15)" strokeWidth="2" strokeDasharray="6 4" />
                      <motion.circle r="3" fill="#fbbf24" filter="blur(1px)"
                        initial={{ cx: "43%" }} animate={{ cx: "57%" }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} cy="30%" />
                    </motion.g>
                  )}
                </AnimatePresence>

                {/* AI -> Results */}
                <AnimatePresence>
                  {[6, 7].includes(currentStep) && (
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <line x1="68%" y1="30%" x2="82%" y2="30%" stroke="rgba(34, 197, 94, 0.15)" strokeWidth="2" strokeDasharray="6 4" />
                      <motion.circle r="3" fill="#22c55e" filter="blur(1px)"
                        initial={{ cx: "68%" }} animate={{ cx: "82%" }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} cy="30%" />
                    </motion.g>
                  )}
                </AnimatePresence>
              </svg>
            </div>
          </div>

          {/* Scan Preview - 1 col */}
          <div className="col-span-1">
            <ScanPreview phase={step.phase} visibleDetections={step.visibleDetections} />
          </div>
        </div>

        {/* Info & Code */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-wider">{currentStep + 1}/{STEPS.length}</span>
                <h3 className="text-lg font-bold text-white tracking-tight">{step.title}</h3>
              </div>
              <button
                onClick={() => setShowTechnical(!showTechnical)}
                className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 hover:text-emerald-400 transition-colors uppercase tracking-wider"
              >
                <Info className="w-3 h-3" />
                {showTechnical ? 'Hide' : 'Show'} Details
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-slate-300 text-sm font-medium leading-snug">{step.desc}</p>
              <div className="p-2.5 bg-slate-900/50 rounded-xl border border-slate-800/50 shadow-inner">
                <p className="text-slate-400 text-xs italic leading-snug">&ldquo;{step.narration}&rdquo;</p>
              </div>
              <AnimatePresence>
                {showTechnical && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400 font-mono overflow-hidden shadow-xl"
                  >
                    <span className="text-emerald-500 font-bold uppercase tracking-widest text-[9px] block mb-1">Technical</span>
                    {step.technicalDetail}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={() => { setCurrentStep(Math.max(0, currentStep - 1)); setSlideProgress(0); }}
                disabled={currentStep === 0}
                className="p-2 bg-slate-800 text-white rounded-lg disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-700 transition-all active:scale-90"
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
                className="p-2 bg-slate-800 text-white rounded-lg disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-700 transition-all active:scale-90"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleRestart}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all active:scale-90"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800">
                {[0.5, 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSpeed(s); setSlideProgress(0); }}
                    className={`px-3 py-1 rounded text-[10px] font-black transition-all ${speed === s ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {s}X
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col shadow-2xl min-w-0">
            <div className="px-4 py-1.5 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center flex-shrink-0">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{step.lang}</span>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/30" />
                <div className="w-2 h-2 rounded-full bg-amber-500/30" />
                <div className="w-2 h-2 rounded-full bg-emerald-500/30" />
              </div>
            </div>
            <div className="p-3 font-mono text-sm flex-1 overflow-auto custom-scrollbar min-w-0">
              <pre className="text-emerald-400/90 leading-relaxed whitespace-pre-wrap break-all text-xs">
                <code>{step.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
