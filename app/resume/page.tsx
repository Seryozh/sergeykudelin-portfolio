'use client';

import { useEffect } from 'react';

const BASE = 'https://sergeykudelin.com';

export default function ResumePage() {
  useEffect(() => {
    document.title = 'Sergey Kudelin - Resume';
  }, []);

  return (
    <>
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .resume-page { padding: 0.4in 0.5in !important; max-width: 100% !important; margin: 0 !important; }
          a { color: #1d4ed8 !important; text-decoration: underline !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 0; size: letter; }
        }
      `}</style>

      {/* Print / Download bar */}
      <div className="no-print fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-slate-400">Resume Preview</span>
        <div className="flex gap-3">
          <a href={BASE} className="text-sm text-blue-400 hover:text-blue-300">
            &larr; Back to Portfolio
          </a>
          <button
            onClick={() => window.print()}
            className="px-4 py-1.5 bg-amber-500 text-slate-950 text-sm font-bold rounded-lg hover:bg-amber-400 transition-colors"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div
        className="resume-page max-w-[8.5in] mx-auto bg-white text-slate-900 px-10 py-10 min-h-screen mt-14 print:mt-0"
        style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", lineHeight: 1.4 }}
      >

        {/* Header */}
        <header className="border-b-2 border-slate-900 pb-3 mb-4">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">SERGEY KUDELIN</h1>
          <p className="text-sm font-medium text-slate-600 mt-0.5">AI-Native Engineer · Agent Systems · Full-Stack · Growth</p>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-xs text-slate-500">
            <span>Hollywood, FL</span>
            <span>·</span>
            <a href="mailto:sergey@sergeykudelin.com" className="text-blue-600 hover:underline">sergey@sergeykudelin.com</a>
            <span>·</span>
            <a href={BASE} className="text-blue-600 hover:underline">sergeykudelin.com</a>
            <span>·</span>
            <a href="https://github.com/Seryozh" className="text-blue-600 hover:underline">github.com/Seryozh</a>
            <span>·</span>
            <a href="https://linkedin.com/in/sergey-kudelin" className="text-blue-600 hover:underline">linkedin.com/in/sergey-kudelin</a>
          </div>
        </header>

        {/* Summary */}
        <section className="mb-4">
          <h2 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Summary</h2>
          <p className="text-[11px] text-slate-700">
            Builder and growth operator who moves between systems and audiences with equal fluency. Grew a YouTube channel
            to 200K subscribers through algorithmic iteration and retention engineering, then shipped production AI tools
            directly to that community: Lux has 2,000+ installs on the Roblox Creator Store. Deployed an AI vision tool
            at my workplace that cut a 90-minute daily process to 10 minutes, and an AI physician-discovery pipeline that
            chains 6 APIs into automated outreach. Whether designing LangGraph agent systems or optimizing click-through
            rates, the goal is the same: measurable outcomes.
          </p>
        </section>

        {/* Skills */}
        <section className="mb-4">
          <h2 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Skills</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-0.5 text-[11px] text-slate-700">
            <div><span className="font-bold text-slate-900">Languages:</span> Python, TypeScript, Lua/Luau, JavaScript, SQL</div>
            <div><span className="font-bold text-slate-900">AI &amp; LLM:</span> LangGraph, LangChain, Gemini 3 Flash, Claude, OpenRouter, Tool-Use Agents, RAG</div>
            <div><span className="font-bold text-slate-900">Backend:</span> FastAPI, Redis, SSE Streaming, JWT Auth, Node.js, Railway</div>
            <div><span className="font-bold text-slate-900">Frontend:</span> React 19, Next.js, Tailwind CSS 4, Framer Motion, Canvas API</div>
            <div><span className="font-bold text-slate-900">Growth:</span> Content Strategy, A/B Testing, Retention Optimization, Algorithmic Distribution, SEO</div>
            <div><span className="font-bold text-slate-900">Growth Tools:</span> Exa AI, PostHog, Apollo.io, Figma, HeyGen</div>
            <div><span className="font-bold text-slate-900">Infrastructure:</span> Vercel, Railway, Redis, Docker, GitHub Actions</div>
            <div><span className="font-bold text-slate-900">Patterns:</span> Agentic AI, ReAct Loops, BYOK, Validation Pipelines, Streaming</div>
          </div>
        </section>

        {/* Projects */}
        <section className="mb-4">
          <h2 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Projects</h2>

          {/* Lux */}
          <div className="mb-3">
            <div className="flex items-baseline justify-between">
              <h3 className="text-[13px] font-bold text-slate-900">
                Lux: AI Coding Agent for Roblox Studio
              </h3>
              <span className="text-[10px] text-slate-500 whitespace-nowrap">2025 - Present</span>
            </div>
            <p className="text-[10px] text-slate-500 mb-0.5">
              Python · FastAPI · LangGraph · Gemini 3 Flash · Redis · SSE · JWT · Lua ·{' '}
              <a href={`${BASE}/#lux`} className="text-blue-600 hover:underline">Portfolio</a>{' · '}
              <a href="https://github.com/Seryozh/RobloxAgenticAI" className="text-blue-600 hover:underline">GitHub</a>
            </p>
            <ul className="list-disc list-outside ml-4 text-[11px] text-slate-700 space-y-0.5">
              <li>
                Built for the Roblox developer community I already reached through @SergeCode; a production agentic AI system
                (2,000+ installs) that gives LLMs full read/write access to a live game engine via natural language
              </li>
              <li>
                Designed a{' '}
                <a href={`${BASE}/?project=lux&section=lux-tool-system`} className="text-blue-600 hover:underline">progressive tool architecture</a>{' '}
                that reduced per-request token usage from ~65,000 to ~5,500 through 3-level lazy exploration
              </li>
              <li>
                Iterated through{' '}
                <a href={`${BASE}/?project=lux&section=lux-refactor`} className="text-blue-600 hover:underline">3 major architecture versions</a>:{' '}
                22,000-line Lua monolith to 3-layer client-server split to SSE streaming with Redis sessions, JWT auth, Fernet-encrypted keys, and a 3-stage validation pipeline
              </li>
            </ul>
          </div>

          {/* Derm Hunter */}
          <div className="mb-3">
            <div className="flex items-baseline justify-between">
              <h3 className="text-[13px] font-bold text-slate-900">
                Derm Hunter (Clinic Pulse): AI Physician Outreach Pipeline
              </h3>
              <span className="text-[10px] text-slate-500 whitespace-nowrap">2025 - Present</span>
            </div>
            <p className="text-[10px] text-slate-500 mb-0.5">
              Next.js · TypeScript · Claude · Exa AI · NPI Registry · Hunter.io · Snov.io ·{' '}
              <a href={`${BASE}/#clinicpulse`} className="text-blue-600 hover:underline">Portfolio</a>
            </p>
            <ul className="list-disc list-outside ml-4 text-[11px] text-slate-700 space-y-0.5">
              <li>
                Chains 6 APIs into one automated pipeline: YouTube discovery, Claude identity extraction, NPI license verification,
                Exa/Hunter.io contact enrichment, personalized outreach generation
              </li>
              <li>
                Built real-time dashboard with per-doctor source attribution, cost tracking, conversion projections, and proposed outreach messaging
              </li>
              <li>
                Architected as a configurable system that adapts to any medical specialty by swapping search queries, and any social platform by swapping the discovery layer
              </li>
            </ul>
          </div>

          {/* LogiScan */}
          <div className="mb-3">
            <div className="flex items-baseline justify-between">
              <h3 className="text-[13px] font-bold text-slate-900">
                LogiScan: AI Vision Package Verification
              </h3>
              <span className="text-[10px] text-slate-500 whitespace-nowrap">Jan 2026 - Present</span>
            </div>
            <p className="text-[10px] text-slate-500 mb-0.5">
              TypeScript · React 19 · Vite · Gemini 3 Flash · Agentic Vision · Canvas API ·{' '}
              <a href="https://logiscan.me" className="text-blue-600 hover:underline">logiscan.me</a>{' · '}
              <a href="https://github.com/Seryozh/logiscan" className="text-blue-600 hover:underline">GitHub</a>
            </p>
            <ul className="list-disc list-outside ml-4 text-[11px] text-slate-700 space-y-0.5">
              <li>
                Built and deployed at my workplace, reducing nightly package audits from ~90 minutes to ~10 minutes, an ~85% time reduction on a task performed every shift
              </li>
              <li>
                AI writes and executes Python to extract apartment codes and tracking numbers, then self-validates to prevent common misreads
              </li>
              <li>
                Implemented a 5-state matching algorithm (matched, duplicate, orphan, unreadable, ambiguous) with combo-key deduplication across multi-photo scans; zero-backend, runs 100% client-side at ~$0.002/scan
              </li>
            </ul>
          </div>

          {/* Portfolio Website */}
          <div className="mb-2">
            <div className="flex items-baseline justify-between">
              <h3 className="text-[13px] font-bold text-slate-900">
                Portfolio Website: sergeykudelin.com
              </h3>
              <span className="text-[10px] text-slate-500 whitespace-nowrap">2025</span>
            </div>
            <p className="text-[10px] text-slate-500 mb-0.5">
              Next.js · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion ·{' '}
              <a href={BASE} className="text-blue-600 hover:underline">sergeykudelin.com</a>
            </p>
            <ul className="list-disc list-outside ml-4 text-[11px] text-slate-700 space-y-0.5">
              <li>
                Interactive architecture demos simulate each project's core systems in real-time: game explorer tree, shelf scan with bounding boxes, AI pipeline with live cost counter
              </li>
              <li>
                Deep-linkable sections allow this resume to hyperlink directly to specific technical write-ups, letting hiring managers explore the exact architecture decision they care about
              </li>
            </ul>
          </div>
        </section>

        {/* Professional Experience */}
        <section className="mb-4">
          <h2 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Professional Experience</h2>

          {/* YouTube */}
          <div className="mb-3">
            <div className="flex items-baseline justify-between">
              <h3 className="text-[13px] font-bold text-slate-900">Creator &amp; Growth Researcher | @SergeCode, YouTube</h3>
              <span className="text-[10px] text-slate-500 whitespace-nowrap">2018 - Present</span>
            </div>
            <ul className="list-disc list-outside ml-4 text-[11px] text-slate-700 space-y-0.5 mt-0.5">
              <li>Grew channel from 0 to 200,000 subscribers organically; top video reached 5.3M views</li>
              <li>
                Developed algorithmic intuition through years of A/B testing thumbnails, titles, and retention hooks, then applied the same distribution frameworks to product launches
              </li>
              <li>
                Evaluated brand partnership and sponsorship pitches firsthand; built clear intuition for which outreach converts and why
              </li>
              <li>
                Identified tool gaps in the Roblox developer community from the inside and built Lux to fill them; 2,000+ installs
              </li>
            </ul>
          </div>

          {/* Tides Condo */}
          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-[13px] font-bold text-slate-900">Operations &amp; Concierge | Tides Condo, Hollywood FL</h3>
              <span className="text-[10px] text-slate-500 whitespace-nowrap">Mar 2024 - Present</span>
            </div>
            <ul className="list-disc list-outside ml-4 text-[11px] text-slate-700 space-y-0.5 mt-0.5">
              <li>
                Identified operational bottleneck: nightly package audits taking up to 90 minutes per shift using pen-and-paper verification
              </li>
              <li>
                Designed and deployed{' '}
                <a href={`${BASE}/?project=logiscan`} className="text-blue-600 hover:underline">LogiScan</a>,
                an AI vision tool that reduced the process to ~10 minutes, an ~85% time reduction, now used every shift
              </li>
            </ul>
          </div>
        </section>

        {/* Education */}
        <section className="mb-4">
          <h2 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Education</h2>
          <div className="flex items-baseline justify-between">
            <h3 className="text-[12px] font-bold text-slate-900">Florida International University, Computer Science</h3>
            <span className="text-[10px] text-slate-500 whitespace-nowrap">2022 - 2024</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-0.5">
            Coursework: Data Structures &amp; Algorithms, Systems Programming, Computer Architecture, AI, Database Management
          </p>
        </section>

        {/* Interests */}
        <section>
          <h2 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Interests</h2>
          <p className="text-[11px] text-slate-700">
            AI agent architectures · Algorithmic content distribution · Real-time systems · Developer tools · Open source
          </p>
        </section>

      </div>
    </>
  );
}
