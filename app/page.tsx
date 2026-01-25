'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Github, FileText, Play, X, ExternalLink, Mail, Linkedin, Youtube, Code2, Layers, Database, Cpu, Menu, X as XIcon, BookOpen } from 'lucide-react';

type ProjectModal = 'tidesos' | 'logiscan' | 'lux' | null;

export default function Home() {
  const [activeModal, setActiveModal] = useState<ProjectModal>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('sergey@sergeykudelin.com');
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: 'Projects', id: 'projects' },
    { label: 'Approach', id: 'approach' },
    { label: 'Expertise', id: 'expertise' },
    { label: 'Articles', id: 'articles' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white relative overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-gradient-to-b from-slate-950/95 to-slate-950/70 border-b border-amber-500/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* Logo */}
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-2xl font-black bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 bg-clip-text text-transparent hover:from-amber-300 hover:via-amber-200 hover:to-amber-300 transition-all duration-300"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
          >
            SK
          </motion.button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-amber-300 transition-all duration-300 relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
                <span className="absolute bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-amber-400 to-amber-300 group-hover:w-full transition-all duration-300 rounded-full" />
              </motion.button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 text-slate-300 hover:text-amber-300 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? (
              <XIcon className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-amber-500/10 bg-slate-900/80 backdrop-blur-sm"
            >
              <nav className="flex flex-col p-4 gap-2">
                {navItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="px-4 py-3 text-sm font-semibold text-slate-300 hover:text-amber-300 hover:bg-amber-500/5 rounded-lg transition-all duration-300 text-left border border-transparent hover:border-amber-500/20"
                    whileHover={{ x: 6 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Add padding-top to main content to account for fixed header */}
      <div className="w-full pt-32 flex flex-col items-center justify-center p-6 relative overflow-hidden flex-1">
        {/* Floating Particles Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400/20 rounded-full"
              initial={{
                x: Math.random() * 1000,
                y: Math.random() * 1000,
                opacity: Math.random() * 0.5,
              }}
              animate={{
                x: Math.random() * 1000,
                y: Math.random() * 1000,
                opacity: [Math.random() * 0.5, Math.random() * 0.8, Math.random() * 0.5],
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        {/* Background Gradient Blob */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center max-w-3xl"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Sergey Kudelin
        </h1>
        <p className="text-slate-400 text-lg md:text-xl mb-6 tracking-wide">
          AI Automation Engineer
        </p>
        <p className="text-amber-500/80 text-base md:text-lg mb-12 font-medium max-w-xl mx-auto leading-relaxed">
          I build autonomous systems for high pressure environments.
        </p>

        {/* Bio Section */}
        <div className="mb-12 text-left max-w-2xl mx-auto space-y-4 text-slate-300 text-sm md:text-base leading-relaxed">
          <p>
            I'm a builder. I spent years growing a{' '}
            <a
              href="https://www.youtube.com/@SergeRoblox"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400/90 hover:text-amber-300 underline decoration-amber-500/30 hover:decoration-amber-400/60 transition-all"
            >
              YouTube channel to 200,000+ subscribers
            </a>
            , where I learned a simple truth: if you don't design for real human behavior, you lose.
          </p>
          <p>
            I bring that same focus to engineering. Right now, I work night operations at a major residential complex,
            but I treat it as a live testing ground. I build and stress-test autonomous agents against constant
            real-world data and messy human problems.
          </p>
          <p className="text-amber-400/90 font-medium">
            I build automation for operational bottlenecks. My software takes over the repetitive logic in high-volume
            environments so humans can focus on decisions that actually need judgment.
          </p>
        </div>

        {/* Featured Projects Section */}
        <div id="projects" className="w-full max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-amber-500/90">
            Featured Projects
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TidesOS Card */}
            <motion.div
              whileHover={{ y: -8 }}
              className="group relative cursor-pointer"
              onClick={() => setActiveModal('tidesos')}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
              <div className="relative h-full bg-slate-900 rounded-xl border border-slate-800 p-6 hover:bg-slate-800/80 transition-all duration-300 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-amber-500/10 p-3 rounded-lg">
                    <Sparkles className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">TidesOS</h3>
                    <p className="text-xs text-amber-400 uppercase tracking-wider">Voice Operations Agent</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-grow">
                  Autonomous voice firewall managing overnight guest traffic at a major residential complex.
                </p>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  whileHover={{ opacity: 1, height: 'auto' }}
                  className="overflow-hidden mb-4"
                >
                  <div className="pt-4 border-t border-amber-500/20">
                    <p className="text-xs text-amber-300 font-semibold mb-2 uppercase tracking-wider">Tech Stack</p>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-xs bg-amber-500/10 text-amber-300 px-2 py-1 rounded">Next.js 15</span>
                      <span className="text-xs bg-amber-500/10 text-amber-300 px-2 py-1 rounded">React</span>
                      <span className="text-xs bg-amber-500/10 text-amber-300 px-2 py-1 rounded">OpenAI Realtime</span>
                      <span className="text-xs bg-amber-500/10 text-amber-300 px-2 py-1 rounded">Web Audio API</span>
                    </div>
                  </div>
                </motion.div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-amber-500/70 text-xs font-medium uppercase tracking-wider">Live Demo</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.div>

            {/* LogiScan Card */}
            <motion.div
              whileHover={{ y: -8 }}
              className="group relative cursor-pointer"
              onClick={() => setActiveModal('logiscan')}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
              <div className="relative h-full bg-slate-900 rounded-xl border border-slate-800 p-6 hover:bg-slate-800/80 transition-all duration-300 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-emerald-500/10 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">LogiScan AI</h3>
                    <p className="text-xs text-emerald-400 uppercase tracking-wider">Computer Vision Inventory</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-grow">
                  Vision-based mobile tool that replaced a two-hour manual inventory audit with automated extraction.
                </p>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  whileHover={{ opacity: 1, height: 'auto' }}
                  className="overflow-hidden mb-4"
                >
                  <div className="pt-4 border-t border-emerald-500/20">
                    <p className="text-xs text-emerald-300 font-semibold mb-2 uppercase tracking-wider">Tech Stack</p>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-xs bg-emerald-500/10 text-emerald-300 px-2 py-1 rounded">Next.js 15</span>
                      <span className="text-xs bg-emerald-500/10 text-emerald-300 px-2 py-1 rounded">PWA</span>
                      <span className="text-xs bg-emerald-500/10 text-emerald-300 px-2 py-1 rounded">GPT-4o Vision</span>
                      <span className="text-xs bg-emerald-500/10 text-emerald-300 px-2 py-1 rounded">Supabase</span>
                    </div>
                  </div>
                </motion.div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-emerald-500/70 text-xs font-medium uppercase tracking-wider">Case Study</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.div>

            {/* Lux Card */}
            <motion.div
              whileHover={{ y: -8 }}
              className="group relative cursor-pointer"
              onClick={() => setActiveModal('lux')}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
              <div className="relative h-full bg-slate-900 rounded-xl border border-slate-800 p-6 hover:bg-slate-800/80 transition-all duration-300 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-500/10 p-3 rounded-lg">
                    <Play className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">Lux Agentic AI</h3>
                    <p className="text-xs text-purple-400 uppercase tracking-wider">Autonomous Coding Assistant</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-grow">
                  Self-healing coding framework for Roblox with 1,000+ downloads, tested via 200K+ subscriber YouTube channel.
                </p>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  whileHover={{ opacity: 1, height: 'auto' }}
                  className="overflow-hidden mb-4"
                >
                  <div className="pt-4 border-t border-purple-500/20">
                    <p className="text-xs text-purple-300 font-semibold mb-2 uppercase tracking-wider">Tech Stack</p>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-xs bg-purple-500/10 text-purple-300 px-2 py-1 rounded">TypeScript</span>
                      <span className="text-xs bg-purple-500/10 text-purple-300 px-2 py-1 rounded">Luau</span>
                      <span className="text-xs bg-purple-500/10 text-purple-300 px-2 py-1 rounded">GPT-4o</span>
                      <span className="text-xs bg-purple-500/10 text-purple-300 px-2 py-1 rounded">Agentic Systems</span>
                    </div>
                  </div>
                </motion.div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-purple-500/70 text-xs font-medium uppercase tracking-wider">Watch Video</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* The Approach Section */}
        <motion.div
          id="approach"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl mt-24"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-amber-500/90">
            The Approach
          </h2>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 md:p-10">
            <p className="text-slate-300 text-base md:text-lg leading-relaxed text-center max-w-4xl mx-auto">
              <span className="text-amber-400 font-semibold">Deterministic systems for a chaotic reality.</span> I build for the edge cases, focusing on the friction point where clean code meets messy, real-world data. My systems are designed to survive the unpredictability of field operations because <span className="text-amber-400/90 font-medium">software that is not tested against reality is just a prototype.</span>
            </p>
          </div>
        </motion.div>

        {/* Technical Expertise Section */}
        <motion.div
          id="expertise"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-5xl mt-24"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-amber-500/90">
            Technical Expertise
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Programming Languages */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:bg-slate-900/80 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <Code2 className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Programming Languages</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li>
                  <span className="text-blue-400 font-semibold">TypeScript / JavaScript:</span> Advanced proficiency in ES6+, asynchronous patterns, and type-safe application architecture.
                </li>
                <li>
                  <span className="text-blue-400 font-semibold">Python:</span> Automation scripts, data processing pipelines, and AI integrations using FastAPI and Flask.
                </li>
                <li>
                  <span className="text-blue-400 font-semibold">SQL:</span> Expert management of PostgreSQL, including complex joins, indexing strategies, and atomic transactions.
                </li>
                <li>
                  <span className="text-blue-400 font-semibold">Lua:</span> Specialized development for the Roblox engine, focusing on high-performance game logic and system automation.
                </li>
              </ul>
            </div>

            {/* AI & Agentic Engineering */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:bg-slate-900/80 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-500/10 p-2 rounded-lg">
                  <Cpu className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white">AI & Agentic Engineering</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li>
                  <span className="text-purple-400 font-semibold">Agentic Frameworks:</span> Designing closed-loop systems with recursive planning, tool-use, and self-correction logic.
                </li>
                <li>
                  <span className="text-purple-400 font-semibold">LLM Integration:</span> Extensive experience with OpenAI (GPT-4o/Vision), Anthropic, and OpenRouter APIs.
                </li>
                <li>
                  <span className="text-purple-400 font-semibold">RAG & Vector Data:</span> Implementing Retrieval-Augmented Generation using Supabase pgvector and semantic search.
                </li>
                <li>
                  <span className="text-purple-400 font-semibold">Prompt Engineering:</span> Crafting high-precision system prompts with strict schema adherence to ensure deterministic outputs.
                </li>
              </ul>
            </div>

            {/* Full-Stack & Systems Architecture */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:bg-slate-900/80 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-emerald-500/10 p-2 rounded-lg">
                  <Layers className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Full-Stack & Systems Architecture</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li>
                  <span className="text-emerald-400 font-semibold">Frontend:</span> Next.js 15 (App Router), React, Tailwind CSS, Framer Motion, and mobile-first PWA architecture.
                </li>
                <li>
                  <span className="text-emerald-400 font-semibold">Backend:</span> Node.js, serverless functions, and RESTful API design.
                </li>
                <li>
                  <span className="text-emerald-400 font-semibold">Database & Auth:</span> Full-scale Supabase implementation, including Realtime, Row Level Security (RLS), and complex Auth flows.
                </li>
                <li>
                  <span className="text-emerald-400 font-semibold">State Management:</span> Managing complex application states using React Context, Zustand, and persistent storage.
                </li>
              </ul>
            </div>

            {/* Infrastructure & Professional Tools */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:bg-slate-900/80 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-500/10 p-2 rounded-lg">
                  <Database className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Infrastructure & Professional Tools</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li>
                  <span className="text-amber-400 font-semibold">DevOps:</span> CI/CD via GitHub Actions, Vercel deployments, and environment configuration.
                </li>
                <li>
                  <span className="text-amber-400 font-semibold">Containers & Cloud:</span> Fundamental knowledge of Docker and managing serverless infrastructure.
                </li>
                <li>
                  <span className="text-amber-400 font-semibold">Workflow Automation:</span> Building enterprise-grade automations using n8n, Zapier, and custom webhooks.
                </li>
                <li>
                  <span className="text-amber-400 font-semibold">Engineering Tools:</span> Git, Postman, Cursor, and Figma for design-to-code workflows.
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Articles Section */}
        <motion.div
          id="articles"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl mt-24"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-amber-500/90">
            Engineering Deep-Dives
          </h2>

          <motion.a
            href="https://medium.com/@kudelin.dev/the-therac-25-lesson-why-ai-agents-need-a-circuit-breaker-architecture-789fca88272a"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -8 }}
            className="group block w-full"
          >
            <div className="relative h-full bg-gradient-to-br from-amber-500/5 to-slate-900/40 border border-amber-500/20 rounded-2xl p-8 hover:border-amber-400/50 transition-all duration-300">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-amber-500 rounded-2xl blur opacity-0 group-hover:opacity-15 transition duration-500" />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-500/10 p-3 rounded-lg">
                      <BookOpen className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                        The Therac-25 Lesson
                      </h3>
                      <p className="text-sm text-amber-400 uppercase tracking-wider">Systems Engineering</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>

                <p className="text-slate-300 text-base leading-relaxed mb-6">
                  Why AI Agents Need a "Circuit Breaker" Architecture. Moving beyond "Prompt Engineering" to "Systems Engineering" in autonomous coding agents. Learn how I built Lux with safety interlocks using principles from the Therac-25 disaster.
                </p>

                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span>4 min read</span>
                  <span>•</span>
                  <span>Jan 15, 2026</span>
                  <span>•</span>
                  <span className="text-amber-400 font-medium">Medium</span>
                </div>
              </div>
            </div>
          </motion.a>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          id="contact"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-5xl mt-24 mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-amber-500/90">
            Let's Build Something
          </h2>
          <p className="text-slate-300 text-center mb-8 max-w-2xl mx-auto">
            I am currently located in the Miami area and available for challenging full-time roles or high-impact freelance projects.
          </p>

          {/* Focus Areas */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Focus Areas</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex gap-2">
                <span className="text-amber-400">•</span>
                <span>Operational automation for high-volume environments.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">•</span>
                <span>Teams building AI agents for real-world deployment.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">•</span>
                <span>Projects where the interaction between AI and human judgment is critical.</span>
              </li>
            </ul>
          </div>

          {/* Contact Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={copyEmailToClipboard}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl hover:border-amber-500/50 hover:bg-slate-800 transition-all duration-300 group"
            >
              <Mail className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
              <span className="text-slate-300 group-hover:text-white text-sm font-medium transition-colors">
                {emailCopied ? 'Copied!' : 'Email'}
              </span>
            </button>
            <a
              href="https://github.com/Seryozh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl hover:border-amber-500/50 hover:bg-slate-800 transition-all duration-300 group"
            >
              <Github className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
              <span className="text-slate-300 group-hover:text-white text-sm font-medium transition-colors">GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/sergey-kudelin/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl hover:border-amber-500/50 hover:bg-slate-800 transition-all duration-300 group"
            >
              <Linkedin className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
              <span className="text-slate-300 group-hover:text-white text-sm font-medium transition-colors">LinkedIn</span>
            </a>
            <a
              href="https://www.youtube.com/@SergeRoblox"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl hover:border-amber-500/50 hover:bg-slate-800 transition-all duration-300 group"
            >
              <Youtube className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
              <span className="text-slate-300 group-hover:text-white text-sm font-medium transition-colors">YouTube</span>
            </a>
          </div>
        </motion.div>
      </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl mt-12 mb-8 border-t border-slate-800 pt-8"
      >
        <div className="text-center">
          <h3 className="text-sm font-semibold text-amber-500/80 uppercase tracking-wider mb-4">Built With</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 hover:bg-slate-900/60 transition-colors">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Frontend</p>
              <p className="text-sm text-slate-200 font-medium">React 19, Next.js 15</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 hover:bg-slate-900/60 transition-colors">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Styling</p>
              <p className="text-sm text-slate-200 font-medium">Tailwind CSS</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 hover:bg-slate-900/60 transition-colors">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Animation</p>
              <p className="text-sm text-slate-200 font-medium">Framer Motion</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 hover:bg-slate-900/60 transition-colors">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Icons</p>
              <p className="text-sm text-slate-200 font-medium">Lucide React</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Designed for performance. Built with modern web technologies. Deployed on Vercel.
          </p>
        </div>
      </motion.footer>

      {/* Modal System */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-slate-800/80 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>

              {/* TidesOS Modal */}
              {activeModal === 'tidesos' && (
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-amber-500/10 p-4 rounded-xl">
                      <Sparkles className="w-8 h-8 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">TidesOS</h2>
                      <p className="text-amber-400 text-sm uppercase tracking-wider">Voice-First Operations Agent</p>
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none space-y-4 text-slate-300">
                    <p className="text-base leading-relaxed">
                      TidesOS is a voice agent built to manage overnight guest traffic at a major residential complex in Miami where I currently work night operations. I use the environment as a live testing ground to stress-test autonomous systems in high-pressure scenarios.
                    </p>
                    <p className="text-base leading-relaxed">
                      The agent mirrors the user's language and handles routine requests according to property protocol. By acting as a voice-driven firewall for repetitive guest queries, the system allows security teams to focus on building safety during their shifts.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <a
                      href="/tidesos"
                      className="flex items-center justify-center gap-3 px-6 py-4 bg-amber-600 hover:bg-amber-500 rounded-xl font-semibold text-white transition-all group"
                    >
                      <Sparkles className="w-5 h-5" />
                      Launch Live Demo
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a
                      href="https://github.com/Seryozh/tides-concierge"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold text-white transition-all group"
                    >
                      <Github className="w-5 h-5" />
                      View Source Code
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              )}

              {/* LogiScan Modal */}
              {activeModal === 'logiscan' && (
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-emerald-500/10 p-4 rounded-xl">
                      <FileText className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">LogiScan AI</h2>
                      <p className="text-emerald-400 text-sm uppercase tracking-wider">Automating Inventory with Computer Vision</p>
                    </div>
                  </div>

                  <div className="space-y-6 text-slate-300">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">The Challenge</h3>
                      <p className="text-base leading-relaxed mb-3">
                        The residential facility faced a significant time-sink involving manual inventory audits.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex gap-2">
                          <span className="text-emerald-400">•</span>
                          <span><strong>Manual Labor:</strong> Matching incoming packages to resident units required two hours of focused manual entry every night.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-400">•</span>
                          <span><strong>Data Integrity:</strong> The repetitive nature of the task led to frequent typos and missed entries, resulting in unreliable logs.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-400">•</span>
                          <span><strong>Operational Lag:</strong> Without a digital real-time system, there was no immediate visibility into current inventory status.</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">The Strategy</h3>
                      <p className="text-base leading-relaxed mb-3">
                        I developed a mobile-first Progressive Web App (PWA) to replace the paper-and-pen workflow with a vision-driven automated system.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex gap-2">
                          <span className="text-emerald-400">•</span>
                          <span><strong>Field-Tested Prototyping:</strong> The system was built and stress-tested in the live, high-pressure environment of the hotel night shift.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-400">•</span>
                          <span><strong>Vision Pipeline:</strong> Instead of standard OCR, the tool uses GPT-4o Vision to extract data according to a strict schema.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-400">•</span>
                          <span><strong>Modern Stack:</strong> Built using Next.js 15 (App Router), Supabase for database management, and Tailwind CSS for the interface.</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">The Architecture</h3>
                      <p className="text-base leading-relaxed mb-3">
                        The technical foundation focuses on accuracy and speed in real-world conditions.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex gap-2">
                          <span className="text-emerald-400">•</span>
                          <span><strong>Schema Adherence:</strong> The vision logic is instructed to ignore irrelevant carrier noise (like FedEx or UPS labels) and extract only the specific internal unit stickers.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-400">•</span>
                          <span><strong>Atomic Sync:</strong> Using PostgreSQL composite keys ensures every scan is a single source of truth, preventing duplicate entries during high-volume periods.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-400">•</span>
                          <span><strong>Offline Readiness:</strong> A client-focused architecture allows the app to function in storage rooms and basements where Wi-Fi signals are often unreliable.</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">The Result</h3>
                      <p className="text-base leading-relaxed mb-3">
                        LogiScan transformed a tedious chore into a streamlined digital process.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex gap-2">
                          <span className="text-emerald-400">•</span>
                          <span><strong>Time Efficiency:</strong> The audit process was reduced from 120 minutes to approximately 20 minutes.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-400">•</span>
                          <span><strong>Error Elimination:</strong> Automated extraction removed human error from data entry, achieving a 95% data reliability rate.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-400">•</span>
                          <span><strong>Digital Logging:</strong> The tool generated a real-time, searchable log of all inventory, replacing a "pen and paper" process with high-integrity digital data.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <a
                      href="https://github.com/Seryozh/logiscan-ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold text-white transition-all group"
                    >
                      <Github className="w-5 h-5" />
                      View Source Code
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              )}

              {/* Lux Modal */}
              {activeModal === 'lux' && (
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-purple-500/10 p-4 rounded-xl">
                      <Play className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">Lux Agentic AI</h2>
                      <p className="text-purple-400 text-sm uppercase tracking-wider">Autonomous Coding Assistant</p>
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none space-y-4 text-slate-300 mb-6">
                    <p className="text-base leading-relaxed">
                      Lux is a powerful autonomous coding assistant for the Roblox engine. I leveraged my YouTube channel of 200,000 subscribers to release and field-test the framework, which has secured over 1,000 downloads to date.
                    </p>
                    <p className="text-base leading-relaxed">
                      It moves beyond basic code completion by executing changes directly in-engine and verifying results through a closed-loop agentic system. I designed Lux to be a self-healing assistant that ensures every edit is accurate and never loses sync with the game state.
                    </p>
                  </div>

                  {/* Video Embed */}
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 mb-6">
                    <iframe
                      src="https://www.youtube.com/embed/ejRCLfsfwD8"
                      title="Lux Agentic AI Demo"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <a
                      href="https://youtube.com/shorts/ejRCLfsfwD8?si=9SB3fuX88WBX_ddQ"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 px-6 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold text-white transition-all group"
                    >
                      <Play className="w-5 h-5" />
                      Watch on YouTube
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a
                      href="https://github.com/Seryozh/lux-agentic-ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold text-white transition-all group"
                    >
                      <Github className="w-5 h-5" />
                      View Source Code
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}