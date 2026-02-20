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
      <section id="logiscan-overview" className="text-center space-y-6 scroll-mt-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
          <Zap className="w-4 h-4" />
          Live at logiscan.me
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          LogiScan
        </h1>
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-xl text-slate-300 leading-relaxed">
            Self-initiated workplace automation project deployed at Tides Condo. Zero-backend AI vision system using Gemini Agentic Vision with code execution to automate package verification. Implements 5-state matching algorithm, canvas-based bounding boxes, duplicate detection across multi-photo scans, and real-time confidence scoring.
          </p>
          <p className="text-slate-400 leading-relaxed">
            Identified operational bottleneck: 90 minutes/night spent manually reading package stickers and cross-referencing against digital manifest.
            Designed and deployed production solution reducing verification time by ~85% (90 min → 10 min) at $0.002/scan—10x cheaper than traditional OCR APIs.
            Built with React 19, TypeScript, Tailwind v4. Deployed on Vercel.
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
      <section id="logiscan-problem" className="space-y-8 scroll-mt-24">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/10">
            <Package className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">The Workplace Problem</h2>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 text-lg leading-relaxed">
            Residential buildings receive <span className="text-amber-400 font-bold">50-200+ packages daily</span>.
            Manual verification process: staff read each physical sticker (apartment code + tracking number), search digital manifest, mark as received.
            Process takes <span className="text-red-400 font-bold">30-90 minutes nightly</span> with 15-20% error rate from misread codes and transposed digits.
            Repetitive, error-prone, opportunity for automation.
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
              Traditional OCR extracts text but lacks semantic understanding. Sticker: "C08Q 9679 01/30/2026 MJ"—which is apartment code? Tracking number? Date? Standard OCR APIs return raw strings without context.
            </p>
            <p>
              Solution: <span className="text-purple-400 font-bold">Gemini 3 Flash Agentic Vision with code execution</span>.
              AI doesn't just read—it <em>reasons</em> via multi-step Think→Act→Observe→Validate loop.
              Writes and executes Python code to parse structured data from each sticker, self-validates output to prevent errors (e.g., extracting years as tracking #s).
              Temperature 1.0, top-K 40 for creative problem-solving on varied label formats.{' '}
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
// VALIDATE: "9679 is tracking, not a year -confirmed"`}</code>
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
                { step: 'VALIDATE', text: '"9679 is tracking, not a year -confirmed"', color: 'text-purple-400' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <span className={`text-xs font-black ${item.color} min-w-[70px]`}>{item.step}</span>
                  <span className="text-xs text-slate-400 italic">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 flex items-center gap-3">
              <span className="text-xs font-bold text-emerald-400">COST</span>
              <span className="text-xs text-emerald-400/80">~$0.002 per image -cheaper than traditional OCR APIs</span>
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
              Designed <span className="text-amber-400 font-bold">5-state classification algorithm</span> beyond simple binary matching.
              Handles edge cases: duplicates across multi-photo scans (same package detected twice), ambiguous matches (multiple packages with same apartment+tracking combo),
              orphan packages (readable but not in manifest), and unreadable labels. Each state → unique UI color + user action workflow.{' '}
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
              Duplicate detection via <code className="text-amber-400 bg-slate-800/50 px-1.5 py-0.5 rounded text-xs">apartment:last4</code> composite keys
              prevents double-counting across multi-photo scans. State transitions validated with{' '}
              <span className="text-white font-semibold">17 test cases</span> covering edge cases, re-matching scenarios, and concurrent modifications.
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
              Implemented real-time canvas-based bounding box overlay with per-state color coding.
              AI returns normalized coordinates (0-1 range) → converted to pixel-accurate canvas positions with responsive scaling.
              Handles viewport size changes, high-DPI displays, and touch interactions.
              Click any box → modal with parsed details (apartment, tracking, confidence, AI notes).{' '}
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
            <div className="relative aspect-video">
              {/* SVG shelf background */}
              <div className="absolute inset-0">
                <svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                  <rect width="400" height="225" fill="#0f172a"/>
                  <rect x="0" y="115" width="400" height="7" fill="#1e293b"/>
                  <rect x="0" y="209" width="400" height="16" fill="#0a0f18"/>
                  {/* Package 1: top-left */}
                  <rect x="38" y="32" width="122" height="79" fill="#3d2b1f" rx="2"/>
                  <rect x="39" y="33" width="120" height="77" fill="#4a3420" rx="2"/>
                  <rect x="49" y="46" width="80" height="36" fill="#f8fafc" rx="2"/>
                  <rect x="54" y="51" width="2" height="16" fill="#334155"/><rect x="58" y="51" width="1" height="16" fill="#334155"/>
                  <rect x="61" y="51" width="3" height="16" fill="#334155"/><rect x="66" y="51" width="1" height="16" fill="#334155"/>
                  <rect x="69" y="51" width="2" height="16" fill="#334155"/><rect x="73" y="51" width="3" height="16" fill="#334155"/>
                  <rect x="54" y="71" width="65" height="5" fill="#cbd5e1" rx="1"/>
                  {/* Package 2: top-right */}
                  <rect x="218" y="25" width="144" height="70" fill="#2d2219" rx="2"/>
                  <rect x="219" y="26" width="142" height="68" fill="#382a1f" rx="2"/>
                  <rect x="229" y="37" width="92" height="38" fill="#f8fafc" rx="2"/>
                  <rect x="234" y="42" width="2" height="18" fill="#334155"/><rect x="238" y="42" width="1" height="18" fill="#334155"/>
                  <rect x="241" y="42" width="3" height="18" fill="#334155"/><rect x="246" y="42" width="2" height="18" fill="#334155"/>
                  <rect x="250" y="42" width="1" height="18" fill="#334155"/><rect x="253" y="42" width="3" height="18" fill="#334155"/>
                  <rect x="258" y="42" width="2" height="18" fill="#334155"/>
                  <rect x="234" y="63" width="75" height="5" fill="#cbd5e1" rx="1"/>
                  {/* Package 3: bottom-left */}
                  <rect x="78" y="122" width="114" height="68" fill="#3d2b1f" rx="2"/>
                  <rect x="79" y="123" width="112" height="66" fill="#4a3420" rx="2"/>
                  <rect x="88" y="134" width="80" height="36" fill="#f8fafc" rx="2"/>
                  <rect x="93" y="139" width="2" height="16" fill="#334155"/><rect x="97" y="139" width="1" height="16" fill="#334155"/>
                  <rect x="100" y="139" width="3" height="16" fill="#334155"/><rect x="105" y="139" width="2" height="16" fill="#334155"/>
                  <rect x="109" y="139" width="1" height="16" fill="#334155"/>
                  <rect x="93" y="158" width="65" height="5" fill="#cbd5e1" rx="1"/>
                  {/* Package 4: bottom-right, damaged sticker */}
                  <rect x="238" y="129" width="102" height="63" fill="#1e1810" rx="2"/>
                  <rect x="239" y="130" width="100" height="61" fill="#252014" rx="2"/>
                  <rect x="247" y="140" width="70" height="34" fill="#fef2f2" rx="2"/>
                  <rect x="252" y="145" width="2" height="14" fill="#94a3b8"/><rect x="256" y="145" width="1" height="14" fill="#94a3b8"/>
                  <rect x="259" y="145" width="3" height="14" fill="#cbd5e1"/>
                  <line x1="272" y1="146" x2="295" y2="158" stroke="#ef4444" strokeWidth="2"/>
                  <line x1="295" y1="146" x2="272" y2="158" stroke="#ef4444" strokeWidth="2"/>
                  <rect x="252" y="162" width="56" height="5" fill="#fca5a5" rx="1"/>
                </svg>
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

      {/* Production Results */}
      <section id="logiscan-impact" className="space-y-8 scroll-mt-24">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Camera className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Production Deployment & Impact</h2>
        </div>

        <p className="text-slate-300 text-lg leading-relaxed">
          Live production screenshots from LogiScan deployed at Tides Condo.
          Demonstrates different detection states handling real-world edge cases: matched packages, orphan detection (readable but not in manifest), duplicate prevention across multi-photo scans.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Matched */}
          <motion.div
            className="rounded-xl border border-emerald-500/20 overflow-hidden bg-slate-950"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="p-3 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm font-bold text-emerald-400">Matched (Happy Path)</span>
            </div>
            <div className="relative">
              <img
                src="https://i.imgur.com/O9k22vW.png"
                alt="LogiScan matched detection - green bounding boxes on successfully identified packages"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
            <div className="p-3 space-y-1">
              <div className="text-xs text-emerald-400 font-bold">6 packages matched</div>
              <div className="text-[11px] text-slate-400">Green bounding boxes on identified labels. 98% confidence. Apartment codes and tracking numbers extracted.</div>
            </div>
          </motion.div>

          {/* Orphan */}
          <motion.div
            className="rounded-xl border border-orange-500/20 overflow-hidden bg-slate-950"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-3 bg-orange-500/10 border-b border-orange-500/20 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm font-bold text-orange-400">Orphan (Error Handling)</span>
            </div>
            <div className="relative">
              <img
                src="https://i.imgur.com/ZX0NVJc.png"
                alt="LogiScan orphan detection - orange box on package not in manifest"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
            <div className="p-3 space-y-1">
              <div className="text-xs text-orange-400 font-bold">Sticker found but not in list</div>
              <div className="text-[11px] text-slate-400">75% confidence. Notes: &ldquo;Tracking number and initials partially obscured by white paper.&rdquo;</div>
            </div>
          </motion.div>

          {/* Duplicate */}
          <motion.div
            className="rounded-xl border border-yellow-500/20 overflow-hidden bg-slate-950"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="p-3 bg-yellow-500/10 border-b border-yellow-500/20 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-sm font-bold text-yellow-400">Duplicate (Prevention)</span>
            </div>
            <div className="relative">
              <img
                src="https://i.imgur.com/PFSa1ME.png"
                alt="LogiScan duplicate detection - yellow box on already-counted package"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
            <div className="p-3 space-y-1">
              <div className="text-xs text-yellow-400 font-bold">Already detected in previous photo</div>
              <div className="text-[11px] text-slate-400">Prevents double-counting during multi-photo scans. Notes location: &ldquo;Top right shelf, oriented vertically.&rdquo;</div>
            </div>
          </motion.div>
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
              Architectural decision: <span className="text-blue-400 font-bold">100% client-side execution</span>.
              Zero backend servers. Zero database. Photos and package data (containing PII: names, addresses, tracking #s) never transmitted except to AI API.
              Deployed as static site on Vercel—$0/month infrastructure cost.
            </p>
            <p>
              State management: React Context + useReducer (Redux pattern) with localStorage persistence and 300ms debounced writes.
              Image compression client-side (max 1920px width, 0.85 JPEG quality) before AI processing.
              Privacy by architecture, not policy.{' '}
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
                    <code>{`// sessionStore.tsx -State Management
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
                'No server, no database -$0 infrastructure',
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

      {/* CTA */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6">
        <h3 className="text-2xl font-bold text-white">Live Production Deployment</h3>
        <p className="text-slate-400 max-w-xl mx-auto">
          Self-initiated workplace automation project deployed at logiscan.me. Used daily at Tides Condo to verify 50-200+ packages in ~10 minutes (previously 90 minutes).
          BYOK model (Gemini/Vision/OpenRouter). Zero backend, $0/month hosting, privacy by architecture.
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
