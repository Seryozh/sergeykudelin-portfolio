'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, ExternalLink, Zap, Search, Brain, ShieldCheck,
  Mail, FileText, ArrowRight, Play
} from 'lucide-react';

interface ClinicPulseDescriptionProps {
  onOpenDemo?: () => void;
}

export default function ClinicPulseDescription({ onOpenDemo }: ClinicPulseDescriptionProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero */}
      <section className="text-center space-y-6 scroll-mt-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium">
          <Zap className="w-4 h-4" />
          Built in 2 nights for FutureClinic
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Clinic Pulse</h1>
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-xl text-slate-300 leading-relaxed">
            Multi-phase AI pipeline that turns YouTube search results into verified physician leads with ready-to-send personalized outreach — all for a few cents per doctor. Built in Next.js + TypeScript to prove a concept for FutureClinic: that finding high-influence medical creators doesn&apos;t require a lead-gen agency.
          </p>
          <p className="text-slate-400 leading-relaxed">
            Influencer doctors bring their entire patient audiences with them. A dermatologist with 2 million YouTube subscribers isn&apos;t just a content creator — they&apos;re a distribution channel. Finding them manually means hours on YouTube, cross-referencing LinkedIn, googling NPI numbers. This pipeline does it in minutes, end to end.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-8">
          {[
            { val: '5', label: 'Pipeline Phases', color: 'text-violet-400' },
            { val: 'NPI', label: 'License Verified', color: 'text-emerald-400' },
            { val: '$0.04', label: 'Per Run', color: 'text-amber-400' },
            { val: 'Haiku', label: 'ID Extraction', color: 'text-blue-400' },
            { val: 'Sonnet', label: 'Outreach Gen', color: 'text-rose-400' },
          ].map((m) => (
            <div key={m.label} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className={`text-2xl font-bold ${m.color}`}>{m.val}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Phase 1: Discovery */}
      <section className="space-y-8 scroll-mt-24">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Search className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Phase 1 — YouTube Discovery</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-slate-300">
            <p>
              The pipeline runs 10 hardcoded search queries against the YouTube Data API v3 — targeted specifically at clinical content, not beauty influencers. Queries like{' '}
              <code className="text-blue-400 bg-slate-800/50 px-1.5 py-0.5 rounded text-xs">&quot;board certified dermatologist skin cancer screening&quot;</code>{' '}
              and{' '}
              <code className="text-blue-400 bg-slate-800/50 px-1.5 py-0.5 rounded text-xs">&quot;dermatologist Mohs surgery patient education&quot;</code>{' '}
              surface physicians doing real medical content, not sponsored skincare.{' '}
              <button onClick={() => toggleExpanded('discovery')} className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                [{expandedSections.has('discovery') ? 'Hide' : 'Show'} Detail &rarr;]
              </button>
            </p>

            <AnimatePresence>
              {expandedSections.has('discovery') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-4 bg-slate-800/50 rounded-lg overflow-hidden"
                >
                  <pre className="text-sm text-slate-300 font-mono overflow-x-auto">
                    <code>{`// discover/route.ts
// 3 queries per run (configurable), up to 50 results each
const results = await searchDermVideos(query, 50)
// → unique channel IDs

const channels = await getChannelDetails(channelIds)
// → subscriber count, video count, uploads playlist

const recentVideos = await getRecentVideos(channelId, 5)
// → 5 most recent uploads with titles + publish dates`}</code>
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-sm text-slate-400">
              For each channel: subscriber count, total video count, 5 most recent video titles and publish dates. Output feeds directly into Phase 2 gating — channels with hidden subscriber counts pass through (some doctors keep counts private).
            </p>
          </div>

          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-2">
            <div className="text-[10px] font-black text-blue-400 uppercase tracking-wider mb-3">Discovery Output</div>
            {[
              { handle: '@DrSandraLee', subs: '2.1M subscribers', recent: '"Cyst removal close-up"' },
              { handle: '@DermDoctor', subs: '847K subscribers', recent: '"Melanoma warning signs"' },
              { handle: '@BoardCertDerm', subs: '312K subscribers', recent: '"Mohs surgery explained"' },
            ].map((ch, i) => (
              <div key={i} className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-xs font-bold text-white">{ch.handle}</div>
                <div className="text-[10px] text-blue-400 font-semibold">{ch.subs}</div>
                <div className="text-[10px] text-slate-500 italic mt-0.5">Recent: {ch.recent}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phase 2: Intelligence */}
      <section className="space-y-8 scroll-mt-24">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-500/10">
            <Brain className="w-6 h-6 text-violet-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Phase 2 — Identity Extraction</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-slate-300">
            <p>
              YouTube handles are useless for NPI lookup. Phase 2 passes each channel (title, description, subscriber count, video titles) to{' '}
              <span className="text-violet-400 font-bold">Claude Haiku</span> at temperature 0.1 to extract: real legal name, credentials (MD/DO/MBBS), specialty, board certification status, and confidence level. The{' '}
              <code className="text-violet-400 bg-slate-800/50 px-1.5 py-0.5 rounded text-xs">&quot;Dr. Pimple Popper&quot;</code>{' '}
              example is real — it reliably resolves to &quot;Sandra Lee, MD.&quot;{' '}
              <button onClick={() => toggleExpanded('extraction')} className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                [{expandedSections.has('extraction') ? 'Hide' : 'Show'} Code &rarr;]
              </button>
            </p>

            <AnimatePresence>
              {expandedSections.has('extraction') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-4 bg-slate-800/50 rounded-lg overflow-hidden"
                >
                  <pre className="text-sm text-slate-300 font-mono overflow-x-auto">
                    <code>{`// lib/name-extractor.ts
// Model: anthropic/claude-haiku-4.5
// Temperature: 0.1 (want reliable JSON)
// JSON mode output

interface ExtractedIdentity {
  firstName: string
  lastName: string
  credentials: string   // "MD" | "DO" | "MBBS"
  isDermatologist: boolean
  boardCertified: boolean
  confidence: "high" | "medium" | "low"
  countryCode: string
  state: string
}

// Gate 1 (pre-extraction):
// subscribers >= 5000 AND last upload < 90 days`}</code>
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800">
            <div className="text-[10px] font-black text-violet-400 uppercase tracking-wider mb-3">LLM Extraction</div>
            {[
              { from: '"Dr. Pimple Popper"', to: 'Sandra Lee, MD', conf: 'high', cert: true },
              { from: '"The Derm Doctor"', to: 'Muneeb Shah, DO', conf: 'high', cert: true },
              { from: '"Skincare by Dermdoc"', to: 'Rachel Kim, DO', conf: 'medium', cert: false },
            ].map((item, i) => (
              <div key={i} className="mb-3 last:mb-0">
                <div className="flex items-center gap-2 p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-slate-500 font-mono truncate">{item.from}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <ArrowRight className="w-3 h-3 text-violet-500 flex-shrink-0" />
                      <span className="text-xs font-bold text-white">{item.to}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${item.conf === 'high' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{item.conf}</span>
                    {item.cert && <span className="text-[9px] font-black text-blue-400">board cert.</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phase 3: NPI Verification */}
      <section className="space-y-8 scroll-mt-24">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Phase 3 — NPI License Verification</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-slate-300">
            <p>
              The NPI Registry is a free, no-auth federal API. Phase 3 runs a three-tier cascading search: last name + dermatology + state, then last name + dermatology (any state), then last name alone. A confidence scoring system assigns Gold/Silver/Bronze tiers.{' '}
              <button onClick={() => toggleExpanded('npi')} className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                [{expandedSections.has('npi') ? 'Hide' : 'Show'} Scoring &rarr;]
              </button>
            </p>

            <AnimatePresence>
              {expandedSections.has('npi') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-4 bg-slate-800/50 rounded-lg overflow-hidden"
                >
                  <pre className="text-sm text-slate-300 font-mono overflow-x-auto">
                    <code>{`// lib/scoring.ts
// Composite confidence score:
+15  LLM says medical doctor
+15  LLM says dermatologist
+10  Board certified
+25  NPI name match found
+10  NPI taxonomy = Dermatology
 +5  NPI status = Active

// Tier thresholds:
// Gold:   score >= 70 AND NPI match
// Silver: score >= 40
// Bronze: below 40`}</code>
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-wider mb-1">NPI Results</div>
            {[
              { name: 'Sandra Lee, MD', npi: '#1932748501', status: 'ACTIVE', tier: 'Gold', tax: 'Dermatology' },
              { name: 'Muneeb Shah, DO', npi: '#1245678903', status: 'ACTIVE', tier: 'Gold', tax: 'Dermatology' },
              { name: 'Rachel Kim, DO', npi: '#1867453021', status: 'ACTIVE', tier: 'Silver', tax: 'Internal Medicine' },
            ].map((doc, i) => (
              <div key={i} className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{doc.name}</span>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${doc.tier === 'Gold' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-400'}`}>{doc.tier}</span>
                </div>
                <div className="text-[10px] text-slate-500">NPI {doc.npi} · {doc.status}</div>
                <div className="text-[10px] text-emerald-400/70">{doc.tax}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phase 4: Contact Enrichment */}
      <section className="space-y-8 scroll-mt-24">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <Mail className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Phase 4 — Contact Enrichment</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-slate-300">
            <p>
              Waterfall approach, cheapest source first. YouTube description regex runs free. Then{' '}
              <span className="text-amber-400 font-bold">Exa AI</span> runs 3 parallel searches per doctor (LinkedIn, Doximity, practice website) with a surname disambiguation system to prevent false matches on common names. Hunter.io and Snov.io are used as fallbacks for email.
            </p>

            <div className="space-y-2">
              {[
                { source: 'YouTube desc. regex', cost: 'Free', detail: 'email, phone, LinkedIn, practice URL' },
                { source: 'Exa AI (neural)', cost: '~$0.015', detail: 'LinkedIn + Doximity + practice site' },
                { source: 'Hunter.io', cost: '50/mo free', detail: 'email via domain + name lookup' },
                { source: 'Snov.io', cost: '50/mo free', detail: 'email with confidence score' },
                { source: 'NPI fallback', cost: 'Free', detail: 'practice phone from registry' },
              ].map((src, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 bg-slate-900/50 rounded-lg border border-slate-800/50">
                  <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-[10px] font-black text-amber-400 flex-shrink-0">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white">{src.source}</div>
                    <div className="text-[10px] text-slate-500">{src.detail}</div>
                  </div>
                  <div className="text-[9px] font-black text-slate-500 flex-shrink-0">{src.cost}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800">
            <div className="text-[10px] font-black text-amber-400 uppercase tracking-wider mb-3">Enriched Profile</div>
            <div className="space-y-2">
              <div className="p-3 bg-slate-900 rounded-lg border border-amber-500/20">
                <div className="text-sm font-black text-white mb-2">Sandra Lee, MD</div>
                <div className="space-y-1.5">
                  {[
                    { field: 'Email', val: 'sandra@drpimplepopper.com', src: 'YouTube desc.', color: 'text-emerald-400' },
                    { field: 'LinkedIn', val: '/in/sandralee-md', src: 'Exa AI', color: 'text-blue-400' },
                    { field: 'Doximity', val: 'Profile found', src: 'Exa AI', color: 'text-violet-400' },
                    { field: 'Phone', val: '(310) 555-0143', src: 'NPI Registry', color: 'text-amber-400' },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 w-14 flex-shrink-0">{f.field}</span>
                      <span className={`text-[10px] font-mono ${f.color} flex-1 mx-2 truncate`}>{f.val}</span>
                      <span className="text-[9px] text-slate-600 flex-shrink-0">{f.src}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phase 5: Outreach */}
      <section className="space-y-8 scroll-mt-24">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10">
            <FileText className="w-6 h-6 text-rose-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Phase 5 — Personalized Outreach</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-slate-300">
            <p>
              <span className="text-rose-400 font-bold">Claude Sonnet</span> generates outreach conditioned on what contact channels actually exist for each doctor. If there&apos;s a Doximity profile, it writes a peer-to-peer physician message. If there&apos;s an email, it generates 3 variants with different angles: monetization, peer credibility, patient demand. Plus a follow-up.
            </p>
            <p className="text-sm text-slate-400">
              The system prompt frames Claude as writing for &quot;Future Clinic&quot; — a telehealth platform trying to onboard physician creators. The pitch angle: their existing YouTube audience already trusts their clinical judgment; Future Clinic gives those patients a way to book with them.
            </p>
          </div>

          <div className="bg-slate-950 rounded-xl p-5 border border-slate-800">
            <div className="text-[10px] font-black text-rose-400 uppercase tracking-wider mb-3">Generated Outreach · Email Variant 1</div>
            <div className="p-3 bg-slate-900 rounded-lg border border-rose-500/10">
              <div className="text-[11px] text-slate-300 leading-relaxed font-mono">
                <span className="text-slate-500">Subject: </span>Your 2.1M subscribers already trust you<br />
                <br />
                Dr. Lee,<br />
                <br />
                <span className="text-slate-400">Your dermatology audience isn&apos;t just an audience — they&apos;re patients looking for a physician they already trust. Future Clinic lets you turn that trust into bookings, on your schedule...</span>
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              {['Email ×3', 'Follow-up', 'LinkedIn', 'Doximity', 'Cold call'].map((t, i) => (
                <span key={i} className="text-[9px] font-black px-2 py-1 bg-rose-500/10 text-rose-400 rounded border border-rose-500/20">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6">
        <h3 className="text-2xl font-bold text-white">Watch the Pipeline Run</h3>
        <p className="text-slate-400 max-w-xl mx-auto">
          The interactive demo simulates a real pipeline run with live streaming log output, phase-by-phase progress, and a final doctor profile card. Everything is based on actual data shapes from production runs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onOpenDemo?.()}
            className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-500 transition-all group"
          >
            Run Demo
            <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
          </button>
          <a
            href="https://github.com/Seryozh/derm-hunter"
            target="_blank"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-violet-100 transition-colors"
          >
            View on GitHub
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href="https://futureclinic-growth.vercel.app"
            target="_blank"
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors"
          >
            Live Demo
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
