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
          .resume-page {
            padding: 0.3in 0.45in !important;
            max-width: 100% !important;
            margin: 0 !important;
          }
          a { color: #1d4ed8 !important; text-decoration: underline !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 0; size: letter; }
          .projects-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 0 1.5rem !important;
          }
          .project-entry { break-inside: avoid; }
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
        className="resume-page max-w-[8.5in] mx-auto bg-white text-slate-900 px-10 py-9 min-h-screen mt-14 print:mt-0"
        style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", lineHeight: 1.35 }}
      >

        {/* Header */}
        <header className="border-b-2 border-slate-900 pb-3 mb-3">
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
        <section className="mb-3">
          <h2 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Summary</h2>
          <p className="text-[11px] text-slate-700">
            Builder and growth operator who moves between systems and audiences with equal fluency. Grew a YouTube channel
            to 200K subscribers through algorithmic iteration and retention engineering, then shipped production AI tools
            directly to that community: Lux has 2,000+ installs. Deployed an AI vision tool at my workplace that cut a
            90-minute daily process to 10 minutes, and built an AI physician-discovery pipeline chaining 6 APIs into
            automated outreach. Whether designing LangGraph agent systems or optimizing click-through rates, the goal is the same: measurable outcomes.
          </p>
        </section>

        {/* Skills */}
        <section className="mb-3">
          <h2 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Skills</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-0.5 text-[11px] text-slate-700">
            <div><span className="font-bold text-slate-900">Languages:</span> Python, TypeScript, Lua/Luau, JavaScript, SQL</div>
            <div><span className="font-bold text-slate-900">AI &amp; LLM:</span> LangGraph, LangChain, Gemini 3 Flash, Claude, OpenRouter, Tool-Use Agents, RAG</div>
            <div><span className="font-bold text-slate-900">Backend:</span> FastAPI, Redis, SSE Streaming, JWT Auth, Node.js, Railway</div>
            <div><span className="font-bold text-slate-900">Frontend:</span> React 19, Next.js, Tailwind CSS 4, Framer Motion, Canvas API</div>
            <div><span className="font-bold text-slate-900">Growth:</span> Content Strategy, A/B Testing, Retention Optimization, Algorithmic Distribution, SEO</div>
            <div><span className="font-bold text-slate-900">Growth Tools:</span> Exa AI, PostHog, Apollo.io, Figma, HeyGen</div>
          </div>
        </section>

        {/* Projects — single column in browser, 2-column in print via .projects-grid */}
        <section className="mb-3">
          <h2 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Projects</h2>
          <div className="projects-grid space-y-3 print:space-y-0">

            {/* Lux */}
            <div className="project-entry mb-0 print:mb-2">
              <div className="flex items-baseline justify-between">
                <h3 className="text-[12.5px] font-bold text-slate-900">Lux: Agentic AI Coding Assistant</h3>
                <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">2025 - Present</span>
              </div>
              <p className="text-[10px] text-slate-500 mb-0.5">
                Python · FastAPI · LangGraph · Gemini 3 Flash · Redis · SSE · JWT ·{' '}
                <a href={`${BASE}/#lux`} className="text-blue-600 hover:underline">Portfolio</a>{' · '}
                <a href="https://github.com/Seryozh/RobloxAgenticAI" className="text-blue-600 hover:underline">GitHub</a>
              </p>
              <ul className="list-disc list-outside ml-4 text-[11px] text-slate-700 space-y-0.5">
                <li>
                  Production agentic AI system with 2,000+ installs; gives LLMs full read/write access to a live game engine via natural language
                </li>
                <li>
                  <a href={`${BASE}/?project=lux&section=lux-token-optimization`} className="text-blue-600 hover:underline">Progressive tool architecture</a>{' '}
                  cut per-request token usage from ~65,000 to ~5,500 through 3-level lazy exploration
                </li>
                <li>
                  Evolved through{' '}
                  <a href={`${BASE}/?project=lux&section=lux-production`} className="text-blue-600 hover:underline">3 architecture versions</a>:{' '}
                  Lua monolith to 3-layer split to SSE streaming with Redis, JWT, Fernet-encrypted keys, and 3-stage validation
                </li>
              </ul>
            </div>

            {/* Derm Hunter */}
            <div className="project-entry mb-0 print:mb-2">
              <div className="flex items-baseline justify-between">
                <h3 className="text-[12.5px] font-bold text-slate-900">Derm Hunter (Clinic Pulse): AI Outreach Pipeline</h3>
                <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">2025 - Present</span>
              </div>
              <p className="text-[10px] text-slate-500 mb-0.5">
                Next.js · TypeScript · Claude · Exa AI · NPI Registry · Hunter.io ·{' '}
                <a href={`${BASE}/#clinicpulse`} className="text-blue-600 hover:underline">Portfolio</a>
              </p>
              <ul className="list-disc list-outside ml-4 text-[11px] text-slate-700 space-y-0.5">
                <li>
                  6-API automated pipeline:{' '}
                  <a href={`${BASE}/?project=clinicpulse&section=clinicpulse-discovery`} className="text-blue-600 hover:underline">YouTube discovery</a>,{' '}
                  <a href={`${BASE}/?project=clinicpulse&section=clinicpulse-intelligence`} className="text-blue-600 hover:underline">Claude identity extraction</a>,{' '}
                  <a href={`${BASE}/?project=clinicpulse&section=clinicpulse-verification`} className="text-blue-600 hover:underline">NPI verification</a>,{' '}
                  <a href={`${BASE}/?project=clinicpulse&section=clinicpulse-enrichment`} className="text-blue-600 hover:underline">contact enrichment</a>,{' '}
                  <a href={`${BASE}/?project=clinicpulse&section=clinicpulse-outreach`} className="text-blue-600 hover:underline">outreach generation</a>
                </li>
                <li>
                  Real-time dashboard with per-doctor source attribution, cost tracking, and conversion projections; configurable for any specialty or platform
                </li>
              </ul>
            </div>

            {/* LogiScan */}
            <div className="project-entry mb-0 print:mb-2">
              <div className="flex items-baseline justify-between">
                <h3 className="text-[12.5px] font-bold text-slate-900">LogiScan: AI Vision Package Verification</h3>
                <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">Jan 2026 - Present</span>
              </div>
              <p className="text-[10px] text-slate-500 mb-0.5">
                TypeScript · React 19 · Vite · Gemini 3 Flash · Agentic Vision · Canvas API ·{' '}
                <a href="https://logiscan.me" className="text-blue-600 hover:underline">logiscan.me</a>{' · '}
                <a href="https://github.com/Seryozh/logiscan" className="text-blue-600 hover:underline">GitHub</a>
              </p>
              <ul className="list-disc list-outside ml-4 text-[11px] text-slate-700 space-y-0.5">
                <li>
                  Deployed at my workplace; reduced nightly package audits from ~90 min to ~10 min, an ~85% reduction on a task performed every shift
                </li>
                <li>
                  <a href={`${BASE}/?project=logiscan&section=logiscan-agentic-vision`} className="text-blue-600 hover:underline">Agentic Vision</a>:{' '}
                  AI writes and executes Python mid-inference to extract codes and self-validate, eliminating common misread errors
                </li>
                <li>
                  <a href={`${BASE}/?project=logiscan&section=logiscan-matching`} className="text-blue-600 hover:underline">5-state matching algorithm</a>{' '}
                  (matched, duplicate, orphan, unreadable, ambiguous); zero-backend, 100% client-side at ~$0.002/scan
                </li>
              </ul>
            </div>

            {/* Portfolio Website */}
            <div className="project-entry mb-0">
              <div className="flex items-baseline justify-between">
                <h3 className="text-[12.5px] font-bold text-slate-900">Portfolio Website: sergeykudelin.com</h3>
                <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">2025</span>
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
                  Deep-linkable sections allow this resume to hyperlink directly to specific technical write-ups for hiring managers
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* Professional Experience */}
        <section className="mb-3">
          <h2 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Professional Experience</h2>

          {/* YouTube */}
          <div className="mb-2">
            <div className="flex items-baseline justify-between">
              <h3 className="text-[12.5px] font-bold text-slate-900">Creator &amp; Growth Researcher | @SergeCode, YouTube</h3>
              <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">2018 - Present</span>
            </div>
            <ul className="list-disc list-outside ml-4 text-[11px] text-slate-700 space-y-0.5 mt-0.5">
              <li>Grew channel from 0 to 200,000 subscribers organically; top video reached 5.3M views</li>
              <li>
                Developed algorithmic distribution intuition through years of A/B testing thumbnails, titles, and retention hooks, then applied the same frameworks to product launches
              </li>
              <li>
                Evaluated brand sponsorship pitches firsthand; identified tool gaps in the developer community and built Lux to fill them — 2,000+ installs
              </li>
            </ul>
          </div>

          {/* Tides Condo */}
          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-[12.5px] font-bold text-slate-900">Operations &amp; Concierge | Tides Condo, Hollywood FL</h3>
              <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">Mar 2024 - Present</span>
            </div>
            <ul className="list-disc list-outside ml-4 text-[11px] text-slate-700 space-y-0.5 mt-0.5">
              <li>
                Identified operational bottleneck: nightly package audits taking up to 90 minutes per shift using pen-and-paper
              </li>
              <li>
                Designed and deployed{' '}
                <a href={`${BASE}/?project=logiscan`} className="text-blue-600 hover:underline">LogiScan</a>,
                reducing the process to ~10 minutes, an ~85% time reduction, now used every shift
              </li>
            </ul>
          </div>
        </section>

        {/* Education + Interests row */}
        <div className="grid grid-cols-2 gap-x-8">
          <section>
            <h2 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Education</h2>
            <div className="flex items-baseline justify-between">
              <h3 className="text-[11px] font-bold text-slate-900">Florida International University, CS</h3>
              <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">2022 - 2024</span>
            </div>
            <p className="text-[10.5px] text-slate-600 mt-0.5">
              Data Structures, Systems Programming, Computer Architecture, AI, Databases
            </p>
          </section>

          <section>
            <h2 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Interests</h2>
            <p className="text-[11px] text-slate-700">
              AI agent architectures · Algorithmic content distribution · Real-time systems · Developer tools · Open source
            </p>
          </section>
        </div>

      </div>
    </>
  );
}
