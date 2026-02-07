'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ExternalLink, Zap, ShieldCheck, BarChart3, Eye, Layers, X as XIcon, Scan, Camera, Package, Brain } from 'lucide-react';

export default function LogiScanDescription() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
          <Zap className="w-4 h-4" />
          Live at logiscan.me
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          LogiScan
        </h1>
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-xl text-slate-300 leading-relaxed">
            A production AI vision system that automates package verification in multi-unit buildings.
            Point your camera at packages and agentic AI reads every sticker, matches them against
            your manifest, and shows color-coded results in real-time.
          </p>
          <p className="text-slate-400 leading-relaxed">
            Built to solve a real problem I witness every night at work: concierge staff spending
            30-60 minutes manually cross-referencing physical packages against digital records.
            LogiScan reduces that to under 5 minutes with near-zero error rate.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div className="text-2xl font-bold text-emerald-400">~$0.002</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Per Scan</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div className="text-2xl font-bold text-amber-400">5</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Detection States</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div className="text-2xl font-bold text-blue-400">29</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Tests Passing</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div className="text-2xl font-bold text-purple-400">0</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Backend Servers</div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/10">
            <Package className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">The Problem</h2>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 text-lg leading-relaxed">
            Multi-unit buildings receive <span className="text-amber-400 font-bold">50-200+ packages daily</span>.
            Staff manually read each physical sticker and cross-reference it against a digital log.
            It takes 30-60 minutes. Every day. With a 15-20% error rate because humans misread
            apartment codes and transpose tracking digits.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/20">
              <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                <XIcon className="w-5 h-5" />
                Before: Manual Process
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>&#8226; Look at sticker: &quot;C08Q, tracking ...9679&quot;</li>
                <li>&#8226; Open spreadsheet, Ctrl+F, find row</li>
                <li>&#8226; Mark as found, repeat 150 times</li>
                <li>&#8226; 30-60 min/day, 15-20% miss rate</li>
                <li>&#8226; Residents complain about missing packages</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                After: LogiScan
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>&#8226; Paste package list into LogiScan</li>
                <li>&#8226; Point camera at shelf, tap capture</li>
                <li>&#8226; AI reads all stickers in one shot</li>
                <li>&#8226; Color-coded results in seconds</li>
                <li>&#8226; Export remaining for follow-up</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Agentic Vision */}
      <section id="logiscan-agentic-vision" className="space-y-8 scroll-mt-24">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Gemini 3 Agentic Vision</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-slate-300">
            <p>
              Traditional OCR reads text but doesn&apos;t <em>understand</em> it. A sticker might say
              &quot;C08Q 9679 01/30/2026 MJ&quot; — which part is the apartment? The tracking number?
              The date? Standard OCR can&apos;t tell.
            </p>
            <p>
              LogiScan uses Gemini 3 Flash&apos;s <span className="text-purple-400 font-bold">Agentic Vision</span> — the
              AI doesn&apos;t just read, it <em>reasons</em>. It runs a multi-step Think-Act-Observe-Validate loop,
              writes Python code to parse sticker data, and self-validates to prevent common errors like
              extracting years as tracking numbers.{' '}
              <button
                onClick={() => toggleExpanded('agentic-code')}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                [{expandedSections.has('agentic-code') ? 'Hide' : 'Show'} Code &rarr;]
              </button>
            </p>

            <AnimatePresence>
              {expandedSections.has('agentic-code') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 p-4 bg-slate-800/50 rounded-lg overflow-hidden"
                >
                  <pre className="text-sm text-slate-300 font-mono overflow-x-auto">
                    <code>{`// gemini3AgenticVision.ts
const config = {
  model: "gemini-3-flash-preview",
  temperature: 1.0,
  topK: 40,
  maxOutputTokens: 8192,
  tools: [{ codeExecution: {} }],  // AI writes + runs Python
  toolConfig: {
    functionCallingConfig: { mode: 'AUTO' }
  }
};

// The AI reasons through each sticker:
// THINK: "I see 4 stickers on packages"
// ACT:   Execute Python to extract text per sticker
// OBSERVE: "Sticker 1: C08Q, tracking ...9679"
// VALIDATE: "9679 is tracking, not a year — confirmed"`}</code>
                  </pre>
                  <a
                    href="https://github.com/Seryozh/logiscan"
                    target="_blank"
                    className="text-xs text-blue-400 hover:underline mt-2 inline-block"
                  >
                    View full implementation on GitHub &rarr;
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 space-y-3">
            <div className="text-[10px] font-black text-purple-400 uppercase tracking-wider mb-4">AI Reasoning Pipeline</div>
            <div className="space-y-3">
              {[
                { step: 'THINK', text: '"I see 4 stickers on packages in this image"', color: 'text-blue-400' },
                { step: 'ACT', text: 'Execute Python to parse text per sticker region', color: 'text-amber-400' },
                { step: 'OBSERVE', text: '"Sticker 1 = C08Q, tracking ...9679, Jan 30"', color: 'text-emerald-400' },
                { step: 'VALIDATE', text: '"9679 is tracking, not a year — confirmed"', color: 'text-purple-400' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className={`text-xs font-black ${item.color} min-w-[70px]`}>{item.step}</span>
                  <span className="text-xs text-slate-400 italic">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 flex items-center gap-3">
              <span className="text-xs font-bold text-emerald-400">COST</span>
              <span className="text-xs text-emerald-400/80">~$0.002 per image — cheaper than traditional OCR APIs</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5-State Matching Algorithm */}
      <section id="logiscan-matching" className="space-y-8 scroll-mt-24">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <BarChart3 className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">5-State Matching Algorithm</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-slate-300">
            <p>
              Every AI detection is classified into one of <span className="text-amber-400 font-bold">5 states</span>.
              This isn&apos;t binary &quot;found or not found&quot; — the algorithm handles duplicates across
              multiple photos, ambiguous matches, and unreadable stickers. Each state drives a different
              UI color and user action.{' '}
              <button
                onClick={() => toggleExpanded('matching-code')}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                [{expandedSections.has('matching-code') ? 'Hide' : 'Show'} Code &rarr;]
              </button>
            </p>

            <AnimatePresence>
              {expandedSections.has('matching-code') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 p-4 bg-slate-800/50 rounded-lg overflow-hidden"
                >
                  <pre className="text-sm text-slate-300 font-mono overflow-x-auto">
                    <code>{`// matchingAlgorithm.ts
for (const detection of detections) {
  const { apartment, last4 } = detection;
  const comboKey = \`\${apartment}:\${last4}\`;

  if (!apartment || !last4)    → "unreadable"
  if (alreadyFound(comboKey))  → "duplicate"

  const matches = pendingPackages.filter(
    p => p.apartment === apartment
      && p.trackingLast4 === last4
  );

  if (matches.length === 0)    → "orphan"
  if (matches.length > 1)      → "ambiguous"
  if (matches.length === 1)    → "matched" ✓
}`}</code>
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-sm text-slate-400">
              Combo tracking via <code className="text-amber-400 bg-slate-800/50 px-1.5 py-0.5 rounded text-xs">apartment:last4</code> keys
              prevents the same sticker from being counted twice across multiple photos.
              Validated with <span className="text-white font-semibold">17 test cases</span> covering
              edge cases and re-matching scenarios.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { status: 'Matched', color: 'emerald', desc: 'Found in pending list', icon: '&#9679;' },
              { status: 'Duplicate', color: 'yellow', desc: 'Already counted in previous photo', icon: '&#9679;' },
              { status: 'Orphan', color: 'orange', desc: 'Readable but not in imported list', icon: '&#9679;' },
              { status: 'Unreadable', color: 'red', desc: 'AI couldn\'t parse apartment or tracking', icon: '&#9679;' },
              { status: 'Ambiguous', color: 'purple', desc: 'Multiple packages match same combo', icon: '&#9679;' },
            ].map((item) => (
              <div key={item.status} className={`p-4 rounded-xl bg-${item.color}-500/5 border border-${item.color}-500/20 flex items-center gap-4`}
                style={{
                  backgroundColor: `color-mix(in srgb, var(--color-${item.color}-500) 5%, transparent)`,
                  borderColor: `color-mix(in srgb, var(--color-${item.color}-500) 20%, transparent)`,
                }}
              >
                <div className={`w-4 h-4 rounded-full flex-shrink-0`}
                  style={{
                    backgroundColor: item.color === 'emerald' ? '#22c55e' :
                      item.color === 'yellow' ? '#eab308' :
                      item.color === 'orange' ? '#f97316' :
                      item.color === 'red' ? '#ef4444' : '#a855f7'
                  }}
                />
                <div>
                  <div className="text-sm font-bold text-white">{item.status}</div>
                  <div className="text-xs text-slate-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Canvas Bounding Box Overlay */}
      <section id="logiscan-overlay" className="space-y-8 scroll-mt-24">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Eye className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Canvas Detection Overlay</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-slate-300">
            <p>
              Real-time canvas-rendered bounding boxes with per-status color coding.
              The AI returns normalized coordinates (0-1), which get converted to pixel-accurate
              canvas positions with responsive scaling across all screen sizes.{' '}
              <button
                onClick={() => toggleExpanded('overlay-code')}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                [{expandedSections.has('overlay-code') ? 'Hide' : 'Show'} Code &rarr;]
              </button>
            </p>

            <AnimatePresence>
              {expandedSections.has('overlay-code') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 p-4 bg-slate-800/50 rounded-lg overflow-hidden"
                >
                  <pre className="text-sm text-slate-300 font-mono overflow-x-auto">
                    <code>{`// BoundingBoxOverlay.tsx
const STATUS_COLORS = {
  matched:    { bg: 'rgba(34,197,94,0.2)',  border: '#22c55e' },
  duplicate:  { bg: 'rgba(234,179,8,0.2)',  border: '#eab308' },
  orphan:     { bg: 'rgba(249,115,22,0.2)', border: '#f97316' },
  unreadable: { bg: 'rgba(239,68,68,0.2)',  border: '#ef4444' },
  ambiguous:  { bg: 'rgba(168,85,247,0.2)', border: '#a855f7' },
};

// Coordinate conversion:
// AI returns 0-1 → stored as 0-100% → scaled to canvas pixels
const x = (box.x / 100) * canvasWidth * scaleX;`}</code>
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>

            <ul className="space-y-3">
              {[
                'Color-coded boxes per detection status',
                'Click any box to view parsed details',
                'Low-confidence badge (< 0.9 threshold)',
                'Responsive scaling across all devices',
              ].map((step, i) => (
                <li key={i} className="flex gap-3 items-start text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual: Mock bounding box preview */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-slate-800 p-4">
              {/* Mock package photo area */}
              <div className="absolute inset-4 flex items-center justify-center">
                <div className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Package Photo Area</div>
              </div>

              {/* Mock bounding boxes */}
              <motion.div
                className="absolute rounded border-2"
                style={{ top: '15%', left: '10%', width: '30%', height: '35%', borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.15)' }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="absolute -top-5 left-0 text-[10px] font-bold text-white bg-emerald-500 px-1.5 py-0.5 rounded">
                  C08Q - 9679
                </div>
              </motion.div>

              <motion.div
                className="absolute rounded border-2"
                style={{ top: '12%', left: '55%', width: '35%', height: '30%', borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.15)' }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="absolute -top-5 left-0 text-[10px] font-bold text-white bg-emerald-500 px-1.5 py-0.5 rounded">
                  C14K - 3728
                </div>
              </motion.div>

              <motion.div
                className="absolute rounded border-2"
                style={{ top: '55%', left: '20%', width: '28%', height: '30%', borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,0.15)' }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="absolute -top-5 left-0 text-[10px] font-bold text-white bg-orange-500 px-1.5 py-0.5 rounded">
                  C22B - 5501
                </div>
              </motion.div>

              <motion.div
                className="absolute rounded border-2"
                style={{ top: '58%', left: '60%', width: '25%', height: '28%', borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.15)' }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="absolute -top-5 left-0 text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded">
                  ??? - ????
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[8px] font-black">!</div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Zero-Backend Architecture */}
      <section id="logiscan-architecture" className="space-y-8 scroll-mt-24">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Zero-Backend Architecture</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-slate-300">
            <p>
              The entire application runs <span className="text-blue-400 font-bold">100% client-side</span>.
              No server, no database, no backend infrastructure.
              Photos and package data never leave the device (except AI API calls).
            </p>
            <p>
              This was a deliberate architectural choice: package data contains
              names, addresses, and tracking numbers. By running entirely in the browser,
              privacy is guaranteed by architecture, not just policy.{' '}
              <button
                onClick={() => toggleExpanded('arch-details')}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                [{expandedSections.has('arch-details') ? 'Hide' : 'Show'} Details &rarr;]
              </button>
            </p>

            <AnimatePresence>
              {expandedSections.has('arch-details') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 p-4 bg-slate-800/50 rounded-lg overflow-hidden"
                >
                  <pre className="text-sm text-slate-300 font-mono overflow-x-auto">
                    <code>{`// sessionStore.tsx — State Management
// React Context + useReducer (Redux-style)
// localStorage persistence with 300ms debounce

const DEBOUNCE_MS = 300;

useEffect(() => {
  const timeout = setTimeout(() => {
    localStorage.setItem('session',
      JSON.stringify(state)
    );
  }, DEBOUNCE_MS);
  return () => clearTimeout(timeout);
}, [state]);`}</code>
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>

            <ul className="space-y-3">
              {[
                'No server, no database — $0 infrastructure',
                'Session persists in localStorage (300ms debounced)',
                'Images compressed client-side (1920px, 0.85 JPEG)',
                'Clear session = everything gone. Zero retention.',
              ].map((step, i) => (
                <li key={i} className="flex gap-3 items-start text-sm">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-950 rounded-xl p-6 border border-slate-800">
            <div className="text-[10px] font-black text-blue-400 uppercase tracking-wider mb-4">Architecture</div>
            <div className="space-y-3">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-xs font-bold text-emerald-400 mb-1">Client (Browser)</div>
                <div className="text-[11px] text-slate-400">React 19 + TypeScript + TailwindCSS 4 + Vite 7</div>
              </div>
              <div className="flex justify-center">
                <div className="w-0.5 h-6 bg-slate-800" />
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-xs font-bold text-amber-400 mb-1">State (localStorage)</div>
                <div className="text-[11px] text-slate-400">Context + useReducer, 300ms debounced saves</div>
              </div>
              <div className="flex justify-center">
                <div className="w-0.5 h-6 bg-slate-800" />
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-xs font-bold text-purple-400 mb-1">AI Vision APIs</div>
                <div className="text-[11px] text-slate-400">Gemini 3 Flash | Google Vision | OpenRouter</div>
              </div>
              <div className="flex justify-center">
                <div className="w-0.5 h-6 bg-slate-800" />
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <div className="text-xs font-bold text-emerald-400 mb-1">Deployment</div>
                <div className="text-[11px] text-emerald-400/80">Vercel static hosting | logiscan.me | $0/month</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack & Metrics */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-500/10">
            <Layers className="w-6 h-6 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">By the Numbers</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: '~4,300', label: 'Lines of TypeScript', color: 'text-white' },
            { value: '29/29', label: 'Tests Passing', color: 'text-emerald-400' },
            { value: '3', label: 'AI Providers', color: 'text-purple-400' },
            { value: '3', label: 'Export Formats', color: 'text-blue-400' },
            { value: '1920px', label: 'Max Image Width', color: 'text-amber-400' },
            { value: '0.85', label: 'JPEG Quality', color: 'text-slate-300' },
            { value: '0.9', label: 'Confidence Threshold', color: 'text-red-400' },
            { value: '300ms', label: 'Save Debounce', color: 'text-emerald-400' },
          ].map((metric) => (
            <div key={metric.label} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className={`text-lg font-bold ${metric.color}`}>{metric.value}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{metric.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6">
        <h3 className="text-2xl font-bold text-white">Try It Live</h3>
        <p className="text-slate-400 max-w-xl mx-auto">
          LogiScan is deployed and running at logiscan.me. Bring your own API key
          and scan real packages. Zero backend, zero cost, full privacy.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://logiscan.me"
            target="_blank"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-slate-950 rounded-xl font-bold hover:bg-emerald-400 transition-all group"
          >
            Open LogiScan
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <a
            href="https://github.com/Seryozh/logiscan"
            target="_blank"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-amber-400 transition-colors"
          >
            View on GitHub
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
