'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Camera, CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';

// ─── Shelf Audit data ────────────────────────────────────────────────────────
interface ScanResult {
  apt: string;
  last4: string;
  status: 'matched' | 'orphan';
  confidence: number;
}

const SCAN_RESULTS: ScanResult[] = [
  { apt: 'C08Q', last4: '9679', status: 'matched', confidence: 98 },
  { apt: 'C14K', last4: '3728', status: 'matched', confidence: 96 },
  { apt: 'B22F', last4: '4401', status: 'matched', confidence: 99 },
  { apt: 'A09R', last4: '1152', status: 'matched', confidence: 97 },
  { apt: 'D03T', last4: '8847', status: 'matched', confidence: 95 },
  { apt: 'C22B', last4: '5501', status: 'orphan', confidence: 72 },
];

// ─── Package Sync data ───────────────────────────────────────────────────────
const RAW_LOG = `C08Q Unit\tUPS - 1ZA9840W129679 Maria S
C14K Unit\tFedEx - 781234563728 John D
B22F Room\tUSPS - 9400111234564401 Ana L
A09R Apt\tAmazon - TBA1234561152 Robert M
D03T Unit\tUPS - 1ZB2230W258847 Yuki T`;

interface ParsedPackage {
  unit: string;
  guest: string;
  carrier: string;
  last4: string;
  status: 'synced';
}

const PARSED: ParsedPackage[] = [
  { unit: 'C08Q', guest: 'Maria S', carrier: 'UPS', last4: '9679', status: 'synced' },
  { unit: 'C14K', guest: 'John D', carrier: 'FedEx', last4: '3728', status: 'synced' },
  { unit: 'B22F', guest: 'Ana L', carrier: 'USPS', last4: '4401', status: 'synced' },
  { unit: 'A09R', guest: 'Robert M', carrier: 'Amazon', last4: '1152', status: 'synced' },
  { unit: 'D03T', guest: 'Yuki T', carrier: 'UPS', last4: '8847', status: 'synced' },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width: 'min(100%, 220px)' }}>
      {/* Phone shell */}
      <div className="bg-slate-800 rounded-[2rem] p-2.5 border-2 border-slate-700 shadow-xl shadow-slate-950/50">
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-1.5 bg-slate-700 rounded-full z-10" />
        {/* Screen */}
        <div className="bg-slate-950 rounded-[1.6rem] overflow-hidden" style={{ aspectRatio: '9/16', maxHeight: '280px' }}>
          {children}
        </div>
      </div>
      {/* Home bar */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-600 rounded-full" />
    </div>
  );
}

function ShelfAuditTab() {
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'results'>('idle');
  const prefersReducedMotion = useReducedMotion();

  const startScan = () => {
    setPhase('scanning');
    const delay = prefersReducedMotion ? 200 : 1800;
    setTimeout(() => setPhase('results'), delay);
  };

  const reset = () => setPhase('idle');

  return (
    <div className="space-y-5">
      <PhoneFrame>
        {/* Camera view */}
        <div className="relative w-full h-full bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col">
          {phase === 'idle' && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 p-4 pt-8">
              <Camera className="w-10 h-10 text-slate-700" />
              <span className="text-[9px] text-slate-600 uppercase tracking-widest font-bold text-center">
                Point at shelf
              </span>
            </div>
          )}

          {phase === 'scanning' && (
            <div className="flex-1 relative overflow-hidden">
              {/* Simulated shelf/packages background */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-800/60 to-slate-900/80" />
              {/* Scan line */}
              <motion.div
                className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                initial={{ top: '5%' }}
                animate={{ top: ['5%', '95%', '5%'] }}
                transition={prefersReducedMotion ? {} : { duration: 1.6, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="px-3 py-1.5 bg-emerald-900/80 border border-emerald-500/40 rounded-full"
                  animate={prefersReducedMotion ? {} : { opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  <span className="text-[9px] font-black text-emerald-300 uppercase tracking-wider">Scanning...</span>
                </motion.div>
              </div>
            </div>
          )}

          {phase === 'results' && (
            <div className="flex-1 overflow-y-auto p-2 pt-5 space-y-1.5">
              {SCAN_RESULTS.map((r, i) => (
                <motion.div
                  key={i}
                  initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.07, duration: 0.2 }}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[9px] font-bold ${
                    r.status === 'matched'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                      : 'bg-orange-500/10 border border-orange-500/30 text-orange-300'
                  }`}
                >
                  {r.status === 'matched' ? (
                    <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  )}
                  <span className="flex-1 font-mono">{r.apt} · {r.last4}</span>
                  <span className="opacity-60">{r.confidence}%</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Bottom bar */}
          {phase !== 'scanning' && (
            <div className="p-3 border-t border-slate-800">
              {phase === 'idle' ? (
                <button
                  onClick={startScan}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-black text-[10px] transition-all active:scale-95 min-h-[36px]"
                >
                  Scan Shelf
                </button>
              ) : (
                <button
                  onClick={reset}
                  className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-black text-[10px] transition-all active:scale-95 flex items-center justify-center gap-1.5 min-h-[36px]"
                >
                  <RotateCcw className="w-3 h-3" />
                  Scan Again
                </button>
              )}
            </div>
          )}
        </div>
      </PhoneFrame>

      {/* Results summary */}
      <AnimatePresence>
        {phase === 'results' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <div className="text-xl font-black text-emerald-400">5</div>
                <div className="text-[9px] font-bold text-emerald-400/70 uppercase">Matched</div>
              </div>
              <div className="text-center p-2.5 bg-orange-500/10 rounded-xl border border-orange-500/20">
                <div className="text-xl font-black text-orange-400">1</div>
                <div className="text-[9px] font-bold text-orange-400/70 uppercase">Missing</div>
              </div>
              <div className="text-center p-2.5 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="text-xl font-black text-white">6</div>
                <div className="text-[9px] font-bold text-slate-500 uppercase">Scanned</div>
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900/50 rounded-lg border border-slate-800/50">
              <span className="text-[10px] text-slate-500">Cost</span>
              <span className="text-[10px] font-black text-emerald-400">$0.002</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PackageSyncTab() {
  const [phase, setPhase] = useState<'idle' | 'parsing' | 'done'>('idle');
  const prefersReducedMotion = useReducedMotion();

  const handleSync = () => {
    setPhase('parsing');
    const delay = prefersReducedMotion ? 200 : 1200;
    setTimeout(() => setPhase('done'), delay);
  };

  const reset = () => setPhase('idle');

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {phase !== 'done' ? (
          <motion.div
            key="input"
            initial={phase === 'idle' ? {} : { opacity: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            {/* Raw log input */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-3 py-1.5 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">raw package log</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/30" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500/30" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
                </div>
              </div>
              <div className="p-3 font-mono text-[10px] text-slate-400 leading-relaxed whitespace-pre overflow-x-auto">
                {RAW_LOG}
              </div>
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
              {phase === 'parsing' ? 'Parsing...' : 'Sync Packages →'}
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
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="px-3 py-2 text-left text-slate-600 font-black uppercase tracking-wider">Unit</th>
                      <th className="px-3 py-2 text-left text-slate-600 font-black uppercase tracking-wider">Guest</th>
                      <th className="px-3 py-2 text-left text-slate-600 font-black uppercase tracking-wider">Carrier</th>
                      <th className="px-3 py-2 text-left text-slate-600 font-black uppercase tracking-wider">Last 4</th>
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
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Success badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-sm font-bold text-emerald-300">5 packages synced to database</span>
            </motion.div>

            <button
              onClick={reset}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 min-h-[48px]"
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
