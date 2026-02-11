'use client';

import { useEffect } from 'react';

const BASE = 'https://sergeykudelin.com';

export default function ResumePage() {
  useEffect(() => {
    document.title = 'Sergey Kudelin — Resume';
  }, []);

  return (
    <>
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .resume-page { padding: 0 !important; max-width: 100% !important; }
          a { color: #1d4ed8 !important; text-decoration: underline !important; }
          .print-break { page-break-before: always; }
        }
      `}</style>

      {/* Print / Download bar */}
      <div className="no-print fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-slate-400">Resume Preview</span>
        <div className="flex gap-3">
          <a
            href={BASE}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            ← Back to Portfolio
          </a>
          <button
            onClick={() => window.print()}
            className="px-4 py-1.5 bg-amber-500 text-slate-950 text-sm font-bold rounded-lg hover:bg-amber-400 transition-colors"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="resume-page max-w-[8.5in] mx-auto bg-white text-slate-900 px-8 py-12 md:px-12 md:py-16 min-h-screen mt-14 print:mt-0" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", lineHeight: 1.5 }}>

        {/* Header */}
        <header className="border-b-2 border-slate-900 pb-4 mb-6">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">SERGEY KUDELIN</h1>
          <p className="text-base font-medium text-slate-600 mt-1">Full-Stack Engineer · AI Systems · Real-Time Architecture</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-500">
            <span>Hollywood, FL</span>
            <span>·</span>
            <a href={BASE} className="text-blue-600 hover:underline">sergeykudelin.com</a>
            <span>·</span>
            <a href="https://github.com/Seryozh" className="text-blue-600 hover:underline">github.com/Seryozh</a>
            <span>·</span>
            <a href="https://linkedin.com/in/sergey-kudelin" className="text-blue-600 hover:underline">linkedin.com/in/sergey-kudelin</a>
          </div>
        </header>

        {/* Summary */}
        <section className="mb-6">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Summary</h2>
          <p className="text-sm text-slate-700">
            Self-taught engineer building production AI systems. Shipped an agentic coding assistant with 1,500+ installations 
            and an AI vision tool deployed at my workplace that cut a 90-minute manual process down to under 10 minutes. 
            I design systems where LLMs interact with real environments — game engines, cameras, live data — through 
            custom protocols, tool bridges, and validation pipelines. Looking for roles in AI engineering, 
            agent development, or applied ML infrastructure.
          </p>
        </section>

        {/* Technical Skills */}
        <section className="mb-6">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Technical Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm text-slate-700">
            <div><span className="font-bold text-slate-900">Languages:</span> Python, TypeScript, Lua/Luau, JavaScript</div>
            <div><span className="font-bold text-slate-900">AI &amp; LLM:</span> LangGraph, LangChain, Gemini, OpenRouter, Tool-Use Agents</div>
            <div><span className="font-bold text-slate-900">Backend:</span> FastAPI, Redis, SSE Streaming, JWT Auth, Railway</div>
            <div><span className="font-bold text-slate-900">Frontend:</span> React 19, Next.js 15, Tailwind CSS 4, Framer Motion</div>
            <div><span className="font-bold text-slate-900">Infrastructure:</span> Vercel, Railway, Redis, Docker</div>
            <div><span className="font-bold text-slate-900">Patterns:</span> Agentic AI, ReAct loops, Tool Bridges, BYOK, Validation Pipelines</div>
          </div>
        </section>

        {/* Projects */}
        <section className="mb-6">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Engineering Projects</h2>

          {/* Lux */}
          <div className="mb-5">
            <div className="flex items-baseline justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Lux — AI-Powered Game Development Agent
              </h3>
              <span className="text-xs text-slate-500 whitespace-nowrap">2025 — Present</span>
            </div>
            <p className="text-xs text-slate-500 mb-1">
              Python · FastAPI · LangGraph · Redis · Lua · SSE · JWT ·{' '}
              <a href={`${BASE}/#lux`} className="text-blue-600 hover:underline">Live Portfolio</a>{' · '}
              <a href="https://github.com/Seryozh/RobloxAgenticAI" className="text-blue-600 hover:underline">GitHub</a>
            </p>
            <ul className="list-disc list-outside ml-4 text-sm text-slate-700 space-y-1">
              <li>
                Built a production agentic AI system (1,500+ installs) that gives LLMs full read/write access to a live game engine via natural language — 
                the first tool of its kind for the Roblox platform
              </li>
              <li>
                Engineered an{' '}
                <a href={`${BASE}/?project=lux&section=lux-polling-bridge`} className="text-blue-600 hover:underline">async tool bridge</a>{' '}
                using <code className="text-xs bg-slate-100 px-1 rounded">asyncio.Event()</code> that lets the AI agent request data from the game engine mid-execution and block until it arrives, 
                enabling bidirectional communication over a one-way HTTP constraint
              </li>
              <li>
                Designed a{' '}
                <a href={`${BASE}/?project=lux&section=lux-tool-system`} className="text-blue-600 hover:underline">progressive tool architecture</a>{' '}
                that reduced per-request token usage by ~90% (65,000 → 5,500 tokens) through 3-level lazy exploration
              </li>
              <li>
                Iterated through{' '}
                <a href={`${BASE}/?project=lux&section=lux-refactor`} className="text-blue-600 hover:underline">3 major architecture versions</a>:{' '}
                22,000-line Lua monolith → 3-layer client-server split → SSE streaming with Redis sessions, JWT auth, Fernet-encrypted keys, and a 3-stage validation pipeline
              </li>
              <li>
                Implemented hash-verified script modifications, diff-based editing (search/replace vs full overwrite), rollback support, and Lua syntax validation to prevent the LLM from shipping broken code
              </li>
            </ul>
          </div>

          {/* LogiScan */}
          <div className="mb-5">
            <div className="flex items-baseline justify-between">
              <h3 className="text-base font-bold text-slate-900">
                LogiScan — AI Vision Package Verification
              </h3>
              <span className="text-xs text-slate-500 whitespace-nowrap">Jan 2026 — Present</span>
            </div>
            <p className="text-xs text-slate-500 mb-1">
              TypeScript · React 19 · Gemini 3 Flash · Agentic Vision · Canvas API ·{' '}
              <a href="https://logiscan.me" className="text-blue-600 hover:underline">logiscan.me</a>{' · '}
              <a href="https://github.com/Seryozh/logiscan" className="text-blue-600 hover:underline">GitHub</a>
            </p>
            <ul className="list-disc list-outside ml-4 text-sm text-slate-700 space-y-1">
              <li>
                Built and deployed an AI vision tool at my workplace that reduced nightly package audits from ~90 minutes to ~10 minutes — 
                an ~85% time reduction on a task performed every shift
              </li>
              <li>
                Leveraged Gemini 3 Flash&apos;s{' '}
                <a href={`${BASE}/?project=logiscan&section=logiscan-agentic-vision`} className="text-blue-600 hover:underline">agentic code execution</a>{' '}
                for structured label parsing — the AI writes and runs Python to extract apartment codes and tracking numbers, 
                then self-validates to prevent common misreads
              </li>
              <li>
                Implemented a{' '}
                <a href={`${BASE}/?project=logiscan&section=logiscan-matching`} className="text-blue-600 hover:underline">5-state matching algorithm</a>{' '}
                handling matched, duplicate, orphan, unreadable, and ambiguous detections with combo-key deduplication across multi-photo scans
              </li>
              <li>
                Zero-backend architecture — runs 100% client-side at ~$0.002/scan with privacy guaranteed by design. 
                29/29 tests passing including edge cases for re-matching and confidence thresholds
              </li>
            </ul>
          </div>

          {/* Portfolio Website */}
          <div className="mb-5">
            <div className="flex items-baseline justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Portfolio Website
              </h3>
              <span className="text-xs text-slate-500 whitespace-nowrap">2025</span>
            </div>
            <p className="text-xs text-slate-500 mb-1">
              Next.js 15 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion ·{' '}
              <a href={BASE} className="text-blue-600 hover:underline">sergeykudelin.com</a>
            </p>
            <ul className="list-disc list-outside ml-4 text-sm text-slate-700 space-y-1">
              <li>
                Designed and built a portfolio featuring interactive architecture demos that simulate each project&apos;s core systems in real-time
              </li>
              <li>
                Deep-linkable project sections allow this resume to hyperlink directly to specific technical write-ups
              </li>
            </ul>
          </div>
        </section>

        {/* Professional Experience */}
        <section className="mb-6">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Professional Experience</h2>

          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-base font-bold text-slate-900">Tides Condo, Hollywood FL — Operations &amp; Concierge</h3>
              <span className="text-xs text-slate-500 whitespace-nowrap">Mar 2024 — Present</span>
            </div>
            <ul className="list-disc list-outside ml-4 text-sm text-slate-700 space-y-1 mt-1">
              <li>
                Identified operational bottleneck: nightly package audits taking up to 90 minutes per shift using pen-and-paper verification
              </li>
              <li>
                Designed and deployed{' '}
                <a href={`${BASE}/?project=logiscan&section=logiscan-architecture`} className="text-blue-600 hover:underline">LogiScan</a>,
                an AI vision tool that reduced the process to ~10 minutes — an ~85% time reduction, now used every shift
              </li>
              <li>
                Demonstrated initiative to automate manual workflows with custom-built software deployed to production
              </li>
            </ul>
          </div>
        </section>

        {/* Interests */}
        <section>
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Interests</h2>
          <p className="text-sm text-slate-700">
            AI agent architectures · Real-time systems · Developer tools · Open source
          </p>
        </section>

      </div>
    </>
  );
}
