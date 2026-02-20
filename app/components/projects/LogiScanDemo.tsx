'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, RotateCcw } from 'lucide-react';

// ─── Scan data ────────────────────────────────────────────────────────────────

interface BoundingBox {
  top: string; left: string; w: string; h: string;
  color: string; label: string; track: string;
  status: 'matched' | 'orphan' | 'unreadable';
}

const BOXES: BoundingBox[] = [
  { top: '12%', left: '8%',  w: '28%', h: '36%', color: '#22c55e', label: 'C08Q', track: '9679', status: 'matched' },
  { top: '10%', left: '54%', w: '38%', h: '28%', color: '#22c55e', label: 'C14K', track: '3728', status: 'matched' },
  { top: '55%', left: '14%', w: '30%', h: '32%', color: '#f97316', label: 'C22B', track: '5501', status: 'orphan' },
  { top: '56%', left: '58%', w: '28%', h: '30%', color: '#ef4444', label: '???',  track: '????', status: 'unreadable' },
];

interface ScanResult {
  apt: string; last4: string; carrier: string; confidence: number;
  status: 'matched' | 'orphan' | 'unreadable' | 'duplicate';
}

const SCAN_RESULTS: ScanResult[] = [
  { apt: 'C08Q', last4: '9679', carrier: 'UPS',    confidence: 98, status: 'matched' },
  { apt: 'C14K', last4: '3728', carrier: 'FedEx',  confidence: 96, status: 'matched' },
  { apt: 'B22F', last4: '4401', carrier: 'USPS',   confidence: 99, status: 'matched' },
  { apt: 'A09R', last4: '1152', carrier: 'Amazon', confidence: 97, status: 'matched' },
  { apt: 'C22B', last4: '5501', carrier: 'UPS',    confidence: 74, status: 'orphan' },
  { apt: '—',    last4: '????', carrier: '?',      confidence: 0,  status: 'unreadable' },
];

const STATUS_STYLE: Record<string, { bg: string; border: string; text: string; label: string }> = {
  matched:     { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-300', label: 'Matched' },
  orphan:      { bg: 'bg-orange-500/10',  border: 'border-orange-500/30',  text: 'text-orange-300',  label: 'Orphan' },
  unreadable:  { bg: 'bg-red-500/10',     border: 'border-red-500/30',     text: 'text-red-300',     label: 'Unreadable' },
  duplicate:   { bg: 'bg-yellow-500/10',  border: 'border-yellow-500/30',  text: 'text-yellow-300',  label: 'Duplicate' },
};

// ─── Package Sync data ───────────────────────────────────────────────────────

const RAW_LOG = `C08Q Unit\tUPS - 1ZA9840W129679 Maria S
C14K Unit\tFedEx - 781234563728 John D
B22F Room\tUSPS - 9400111234564401 Ana L
A09R Apt\tAmazon - TBA1234561152 Robert M
D03T Unit\tUPS - 1ZB2230W258847 Yuki T`;

interface ParsedPackage {
  unit: string; guest: string; carrier: string; last4: string;
}

const PARSED: ParsedPackage[] = [
  { unit: 'C08Q', guest: 'Maria S',  carrier: 'UPS',    last4: '9679' },
  { unit: 'C14K', guest: 'John D',   carrier: 'FedEx',  last4: '3728' },
  { unit: 'B22F', guest: 'Ana L',    carrier: 'USPS',   last4: '4401' },
  { unit: 'A09R', guest: 'Robert M', carrier: 'Amazon', last4: '1152' },
  { unit: 'D03T', guest: 'Yuki T',   carrier: 'UPS',    last4: '8847' },
];

// ─── SVG Shelf Component ─────────────────────────────────────────────────────

function ShelfSVG() {
  return (
    <svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="225" fill="#0f172a"/>
      <rect x="0" y="115" width="400" height="7" fill="#1e293b"/>
      <rect x="0" y="209" width="400" height="16" fill="#0a0f18"/>
      {/* Package 1: top-left */}
      <rect x="28" y="26" width="122" height="85" fill="#3d2b1f" rx="2"/>
      <rect x="29" y="27" width="120" height="83" fill="#4a3420" rx="2"/>
      <rect x="39" y="40" width="80" height="38" fill="#f8fafc" rx="2"/>
      <rect x="44" y="45" width="2" height="18" fill="#334155"/><rect x="48" y="45" width="1" height="18" fill="#334155"/>
      <rect x="51" y="45" width="3" height="18" fill="#334155"/><rect x="56" y="45" width="1" height="18" fill="#334155"/>
      <rect x="59" y="45" width="2" height="18" fill="#334155"/><rect x="63" y="45" width="3" height="18" fill="#334155"/>
      <rect x="44" y="67" width="65" height="5" fill="#cbd5e1" rx="1"/>
      {/* Package 2: top-right */}
      <rect x="213" y="22" width="155" height="68" fill="#2d2219" rx="2"/>
      <rect x="214" y="23" width="153" height="66" fill="#382a1f" rx="2"/>
      <rect x="224" y="33" width="100" height="38" fill="#f8fafc" rx="2"/>
      <rect x="229" y="38" width="2" height="18" fill="#334155"/><rect x="233" y="38" width="1" height="18" fill="#334155"/>
      <rect x="236" y="38" width="3" height="18" fill="#334155"/><rect x="241" y="38" width="2" height="18" fill="#334155"/>
      <rect x="245" y="38" width="1" height="18" fill="#334155"/><rect x="248" y="38" width="3" height="18" fill="#334155"/>
      <rect x="253" y="38" width="2" height="18" fill="#334155"/>
      <rect x="229" y="59" width="85" height="5" fill="#cbd5e1" rx="1"/>
      {/* Package 3: bottom-left */}
      <rect x="54" y="122" width="120" height="72" fill="#3d2b1f" rx="2"/>
      <rect x="55" y="123" width="118" height="70" fill="#4a3420" rx="2"/>
      <rect x="65" y="135" width="85" height="38" fill="#f8fafc" rx="2"/>
      <rect x="70" y="140" width="2" height="18" fill="#334155"/><rect x="74" y="140" width="1" height="18" fill="#334155"/>
      <rect x="77" y="140" width="3" height="18" fill="#334155"/><rect x="82" y="140" width="2" height="18" fill="#334155"/>
      <rect x="86" y="140" width="1" height="18" fill="#334155"/>
      <rect x="70" y="161" width="70" height="5" fill="#cbd5e1" rx="1"/>
      {/* Package 4: bottom-right, damaged sticker */}
      <rect x="229" y="124" width="112" height="72" fill="#1e1810" rx="2"/>
      <rect x="230" y="125" width="110" height="70" fill="#252014" rx="2"/>
      <rect x="239" y="137" width="78" height="38" fill="#fef2f2" rx="2"/>
      <rect x="244" y="142" width="2" height="16" fill="#94a3b8"/><rect x="248" y="142" width="1" height="16" fill="#94a3b8"/>
      <rect x="251" y="142" width="3" height="16" fill="#cbd5e1"/>
      <line x1="264" y1="143" x2="290" y2="158" stroke="#ef4444" strokeWidth="2"/>
      <line x1="290" y1="143" x2="264" y2="158" stroke="#ef4444" strokeWidth="2"/>
      <rect x="244" y="161" width="60" height="5" fill="#fca5a5" rx="1"/>
    </svg>
  );
}

// ─── Shelf Audit Tab ──────────────────────────────────────────────────────────

function ShelfAuditTab() {
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [visibleBoxes, setVisibleBoxes] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const startScan = () => {
    setPhase('scanning');
    setVisibleBoxes(0);

    if (prefersReducedMotion) {
      setVisibleBoxes(BOXES.length);
      setTimeout(() => setPhase('done'), 200);
      return;
    }

    // Scan line runs ~1.5s, then boxes appear progressively
    const boxDelays = [1600, 2100, 2700, 3300];
    boxDelays.forEach((d, i) => {
      setTimeout(() => setVisibleBoxes(i + 1), d);
    });
    setTimeout(() => setPhase('done'), 3800);
  };

  const reset = () => {
    setPhase('idle');
    setVisibleBoxes(0);
  };

  const statusIcon = (status: string) => {
    if (status === 'matched') return <CheckCircle2 className="w-3 h-3 flex-shrink-0" />;
    if (status === 'orphan') return <AlertTriangle className="w-3 h-3 flex-shrink-0" />;
    return <XCircle className="w-3 h-3 flex-shrink-0" />;
  };

  return (
    <div className="space-y-4">
      {/* Shelf visual panel */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
        <div className="relative aspect-video">
          {/* SVG shelf background always visible */}
          <div className="absolute inset-0">
            <ShelfSVG />
          </div>

          {/* Bounding boxes (appear progressively during scan) */}
          {(phase === 'scanning' || phase === 'done') && BOXES.slice(0, visibleBoxes).map((box, i) => (
            <motion.div
              key={i}
              className="absolute rounded border-2"
              style={{
                top: box.top, left: box.left, width: box.w, height: box.h,
                borderColor: box.color,
                backgroundColor: box.color + '28',
              }}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="absolute -top-5 left-0 text-[9px] font-bold text-white px-1.5 py-0.5 rounded whitespace-nowrap"
                style={{ backgroundColor: box.color }}
              >
                {box.label} - {box.track}
              </div>
              {box.status === 'unreadable' && (
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[8px] font-black">!</div>
              )}
            </motion.div>
          ))}

          {/* Scan line */}
          {phase === 'scanning' && !prefersReducedMotion && (
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none z-10"
              initial={{ top: '5%' }}
              animate={{ top: ['5%', '95%', '5%'] }}
              transition={{ duration: 1.5, ease: 'linear', repeat: 1 }}
            />
          )}

          {/* Idle overlay */}
          {phase === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4" style={{ backgroundColor: 'rgba(15,23,42,0.65)' }}>
              <div className="text-slate-400 text-xs font-medium text-center">
                Import your package list, point at the shelf, tap scan.
              </div>
              <button
                onClick={startScan}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-black text-sm transition-all active:scale-95 min-h-[44px]"
              >
                Scan Shelf
              </button>
            </div>
          )}

          {/* Scanning label */}
          {phase === 'scanning' && (
            <motion.div
              className="absolute bottom-3 left-3"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <div className="px-3 py-1.5 bg-emerald-900/80 border border-emerald-500/40 rounded-full">
                <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider">Gemini scanning...</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {phase === 'done' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {/* Summary */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { val: '4', label: 'Matched',   color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                { val: '1', label: 'Orphan',    color: 'text-orange-400',  bg: 'bg-orange-500/10 border-orange-500/20' },
                { val: '1', label: 'Unreadable',color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20' },
                { val: '$0.002', label: 'Cost', color: 'text-slate-300',   bg: 'bg-slate-800/50 border-slate-700/50' },
              ].map((s, i) => (
                <div key={i} className={`text-center p-2.5 rounded-xl border ${s.bg}`}>
                  <div className={`text-lg font-black ${s.color}`}>{s.val}</div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Result rows */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-3 py-1.5 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Detection results</span>
                <span className="text-[9px] text-slate-600">6 packages</span>
              </div>
              <div className="divide-y divide-slate-800/50">
                {SCAN_RESULTS.map((r, i) => {
                  const style = STATUS_STYLE[r.status];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.2 }}
                      className={`flex items-center gap-2 px-3 py-2 ${style.bg} ${style.text}`}
                    >
                      {statusIcon(r.status)}
                      <span className="font-mono font-black text-[10px] w-10 flex-shrink-0">{r.apt}</span>
                      <span className="font-mono text-[10px] text-slate-400 flex-1">...{r.last4}</span>
                      <span className="text-[10px] text-slate-500 flex-shrink-0">{r.carrier}</span>
                      <span className={`text-[9px] font-black ml-auto flex-shrink-0 ${
                        r.confidence >= 90 ? 'text-emerald-400' : r.confidence >= 60 ? 'text-amber-400' : 'text-slate-600'
                      }`}>
                        {r.confidence > 0 ? `${r.confidence}%` : 'N/A'}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={reset}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 min-h-[44px]"
            >
              <RotateCcw className="w-4 h-4" />
              Scan Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Package Sync Tab ─────────────────────────────────────────────────────────

function PackageSyncTab() {
  const [phase, setPhase] = useState<'idle' | 'parsing' | 'done'>('idle');
  const prefersReducedMotion = useReducedMotion();

  const handleSync = () => {
    setPhase('parsing');
    const delay = prefersReducedMotion ? 100 : 1200;
    setTimeout(() => setPhase('done'), delay);
  };

  const reset = () => setPhase('idle');

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {phase !== 'done' ? (
          <motion.div
            key="input"
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            {/* Raw log */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-3 py-1.5 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">raw package log</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/30" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500/30" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
                </div>
              </div>
              <div className="p-3 font-mono text-[10px] text-slate-400 leading-relaxed whitespace-pre overflow-x-auto custom-scrollbar">
                {RAW_LOG}
              </div>
            </div>

            <div className="flex gap-3 text-[10px] text-slate-600 px-1">
              <span>5 rows detected</span>
              <span className="text-slate-700">·</span>
              <span>Gemini 3 Flash will parse identities</span>
            </div>

            <motion.button
              onClick={handleSync}
              disabled={phase === 'parsing'}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 rounded-xl font-black transition-all active:scale-95 flex items-center justify-center gap-2 min-h-[48px]"
              whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
            >
              {phase === 'parsing' ? (
                <motion.div
                  className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
              ) : null}
              {phase === 'parsing' ? 'Parsing with Gemini...' : 'Sync Packages'}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            {/* Parsed table */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-3 py-1.5 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em]">parsed · 5 packages</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="px-3 py-2 text-left text-slate-600 font-black uppercase tracking-wider">Unit</th>
                      <th className="px-3 py-2 text-left text-slate-600 font-black uppercase tracking-wider">Guest</th>
                      <th className="px-3 py-2 text-left text-slate-600 font-black uppercase tracking-wider">Carrier</th>
                      <th className="px-3 py-2 text-left text-slate-600 font-black uppercase tracking-wider">Last 4</th>
                      <th className="px-3 py-2 text-left text-slate-600 font-black uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PARSED.map((pkg, i) => (
                      <motion.tr
                        key={i}
                        initial={prefersReducedMotion ? {} : { opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="border-b border-slate-800/50 last:border-0"
                      >
                        <td className="px-3 py-2 font-black text-white font-mono">{pkg.unit}</td>
                        <td className="px-3 py-2 text-slate-300">{pkg.guest}</td>
                        <td className="px-3 py-2 text-slate-400">{pkg.carrier}</td>
                        <td className="px-3 py-2 font-mono text-emerald-400 font-bold">{pkg.last4}</td>
                        <td className="px-3 py-2">
                          <span className="text-[8px] font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full uppercase">synced</span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cost breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: '5 synced', color: 'text-emerald-400' },
                { label: '$0.002 total', color: 'text-amber-400' },
                { label: 'zero backend', color: 'text-slate-400' },
              ].map((s, i) => (
                <div key={i} className="py-2 bg-slate-800/40 rounded-lg border border-slate-700/50">
                  <div className={`text-[10px] font-black ${s.color}`}>{s.label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={reset}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 min-h-[44px]"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface LogiScanDemoProps {
  autoPlay?: boolean;
}

export default function LogiScanDemo({ autoPlay: _autoPlay = false }: LogiScanDemoProps) {
  const [activeTab, setActiveTab] = useState<'audit' | 'sync'>('audit');

  return (
    <div className="w-full max-w-lg mx-auto px-2 sm:px-0 py-2 space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-base font-black text-white">LogiScan</h3>
        <p className="text-xs text-slate-500">AI package verification — zero backend, $0.002/scan</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
        {(['audit', 'sync'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all min-h-[44px] ${
              activeTab === tab
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'audit' ? 'Shelf Audit' : 'Package Sync'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'audit' ? <ShelfAuditTab /> : <PackageSyncTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
