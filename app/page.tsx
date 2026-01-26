'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Github, FileText, Play, X, ExternalLink, Mail, Linkedin, Youtube, Code2, Layers, Database, Cpu, Menu, X as XIcon, BookOpen } from 'lucide-react';

type ProjectModal = 'tidesos' | 'logiscan' | 'lux' | null;

export default function Home() {
  const [activeModal, setActiveModal] = useState<ProjectModal>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const sections = ['hero', 'projects', 'approach', 'expertise', 'articles', 'contact'];

  // Handle URL query params for direct modal links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const project = params.get('project');
    if (project === 'tidesos' || project === 'logiscan' || project === 'lux') {
      setActiveModal(project);
    }
  }, []);

  // Update URL when modal opens/closes
  useEffect(() => {
    if (activeModal) {
      const url = new URL(window.location.href);
      url.searchParams.set('project', activeModal);
      window.history.pushState({}, '', url.toString());
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete('project');
      window.history.pushState({}, '', url.toString());
    }
  }, [activeModal]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const scrollPosition = target.scrollTop;
      const windowHeight = window.innerHeight;
      const newSection = Math.round(scrollPosition / windowHeight);
      setCurrentSection(Math.min(newSection, sections.length - 1));
    };

    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
      return () => mainElement.removeEventListener('scroll', handleScroll);
    }
  }, [sections.length]);

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
    <main className="bg-slate-950 text-white snap-container">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-gradient-to-b from-slate-950/95 to-slate-950/70 border-b border-amber-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-5 flex items-center justify-between">
          {/* Logo */}
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 bg-clip-text text-transparent hover:from-amber-300 hover:via-amber-200 hover:to-amber-300 transition-all duration-300"
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

      {/* Section Progress Indicator */}
      <div className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
        {sections.map((section, index) => (
          <button
            key={section}
            onClick={() => {
              const element = document.getElementById(section === 'hero' ? '' : section);
              if (section === 'hero') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="group relative"
          >
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSection === index
                  ? 'bg-amber-400 scale-150'
                  : 'bg-slate-600 hover:bg-slate-400'
              }`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {section === 'hero' ? 'Home' : section.charAt(0).toUpperCase() + section.slice(1)}
            </span>
          </button>
        ))}
      </div>

      {/* Hero Section */}
      <section className="min-h-screen snap-start flex items-center justify-center relative overflow-hidden pt-16">
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

      <div className="w-full h-full flex items-center justify-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 text-center max-w-3xl"
        >
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-3 sm:mb-4">
          Sergey Kudelin
        </h1>
        <p className="text-slate-400 text-base sm:text-lg md:text-xl mb-4 sm:mb-6 tracking-wide">
          AI Automation Engineer
        </p>
        <p className="text-amber-500/80 text-sm sm:text-base md:text-lg mb-8 sm:mb-12 font-medium max-w-xl mx-auto leading-relaxed">
          I build autonomous systems for high pressure environments.
        </p>

        {/* Bio Section */}
        <div className="mb-8 sm:mb-12 text-left max-w-2xl mx-auto space-y-3 sm:space-y-4 text-slate-300 text-sm md:text-base leading-relaxed">
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
        </motion.div>
      </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="min-h-screen snap-start flex items-center justify-center relative overflow-hidden px-4 sm:px-6 py-20 sm:py-6">
        <div className="w-full max-w-5xl z-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 text-amber-500/90">
            Featured Projects
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
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
                  <span className="text-amber-500/70 text-xs font-medium uppercase tracking-wider">View Case Study</span>
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
                  <span className="text-emerald-500/70 text-xs font-medium uppercase tracking-wider">View Case Study</span>
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
                  <span className="text-purple-500/70 text-xs font-medium uppercase tracking-wider">View Case Study</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Approach Section */}
      <section id="approach" className="min-h-screen snap-start flex items-center justify-center relative overflow-hidden px-4 sm:px-6 py-20 sm:py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl z-10"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 text-amber-500/90">
            The Approach
          </h2>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10">
            <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed text-center max-w-4xl mx-auto">
              <span className="text-amber-400 font-semibold">Deterministic systems for a chaotic reality.</span> I build for the edge cases, focusing on the friction point where clean code meets messy, real-world data. My systems are designed to survive the unpredictability of field operations because <span className="text-amber-400/90 font-medium">software that is not tested against reality is just a prototype.</span>
            </p>
          </div>
        </motion.div>
      </section>

      {/* Technical Expertise Section */}
      <section id="expertise" className="min-h-screen snap-start flex items-center justify-center relative overflow-hidden px-4 sm:px-6 py-20 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-5xl z-10"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-5 text-amber-500/90">
            Technical Expertise
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {/* Programming Languages */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:bg-slate-900/80 transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-500/10 p-1.5 rounded-lg">
                  <Code2 className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-base font-bold text-white">Programming Languages</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
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
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:bg-slate-900/80 transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-purple-500/10 p-1.5 rounded-lg">
                  <Cpu className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="text-base font-bold text-white">AI & Agentic Engineering</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
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
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:bg-slate-900/80 transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-emerald-500/10 p-1.5 rounded-lg">
                  <Layers className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-white">Full-Stack & Systems Architecture</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
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
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:bg-slate-900/80 transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-amber-500/10 p-1.5 rounded-lg">
                  <Database className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-base font-bold text-white">Infrastructure & Professional Tools</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
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
      </section>

      {/* Articles Section */}
      <section id="articles" className="min-h-screen snap-start flex items-center justify-center relative overflow-hidden px-4 sm:px-6 py-20 sm:py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl z-10"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 sm:mb-12 text-amber-500/90">
            Engineering Deep-Dives
          </h2>

          <motion.a
            href="https://medium.com/@kudelin.dev/the-therac-25-lesson-why-ai-agents-need-a-circuit-breaker-architecture-789fca88272a"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -8 }}
            className="group block w-full"
          >
            <div className="relative h-full bg-gradient-to-br from-amber-500/5 to-slate-900/40 border border-amber-500/20 rounded-xl sm:rounded-2xl p-5 sm:p-8 hover:border-amber-400/50 transition-all duration-300">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-amber-500 rounded-2xl blur opacity-0 group-hover:opacity-15 transition duration-500" />
              <div className="relative">
                <div className="flex items-start justify-between mb-4 gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-amber-500/10 p-2 sm:p-3 rounded-lg">
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                        The Therac-25 Lesson
                      </h3>
                      <p className="text-xs sm:text-sm text-amber-400 uppercase tracking-wider">Systems Engineering</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
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
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen snap-start flex items-center justify-center relative overflow-hidden px-4 sm:px-6 py-20 sm:py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-5xl z-10"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 text-amber-500/90">
            Let's Build Something
          </h2>
          <p className="text-slate-300 text-sm sm:text-base text-center mb-6 sm:mb-8 max-w-2xl mx-auto">
            I am currently located in the Miami area and available for challenging full-time roles or high-impact freelance projects.
          </p>

          {/* Focus Areas */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
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
      </section>

      {/* Footer */}
      <footer className="snap-start flex items-center justify-center relative overflow-hidden px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl border-t border-slate-800 pt-8"
        >
        <div className="text-center">
          <h3 className="text-xs sm:text-sm font-semibold text-amber-500/80 uppercase tracking-wider mb-3 sm:mb-4">Built With</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
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
        </motion.div>
      </footer>

      {/* Modal System */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[95vh] my-auto overflow-y-auto bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="sticky top-3 sm:top-4 right-3 sm:right-4 float-right z-10 p-2 bg-slate-800/80 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              </button>

              {/* TidesOS Modal */}
              {activeModal === 'tidesos' && (
                <div className="p-5 sm:p-8 clear-both">
                  <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                    <div className="bg-amber-500/10 p-2.5 sm:p-4 rounded-lg sm:rounded-xl">
                      <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white">TidesOS</h2>
                      <p className="text-amber-400 text-xs sm:text-sm uppercase tracking-wider">Building a Voice Agent for Overnight Operations</p>
                    </div>
                  </div>

                  <div className="space-y-5 sm:space-y-6 text-slate-300 text-sm sm:text-base">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">The Problem</h3>
                      <p className="leading-relaxed mb-3">
                        Night shifts at large residential complexes follow a predictable pattern. Between 10 PM and 6 AM, security staff field hundreds of nearly identical questions. Where are the pool towels? Can you give me a building access code? I locked myself out of my unit. What's the WiFi password?
                      </p>
                      <p className="leading-relaxed mb-3">
                        These queries aren't complex. They don't require judgment or discretion. But they demand immediate attention, which means actual security concerns get buried under routine noise. A guest asking about towels at 2 AM interrupts an officer monitoring cameras or responding to an actual incident.
                      </p>
                      <p className="leading-relaxed">
                        The solution seemed obvious: automate the routine traffic. Let humans focus on real security work. But voice automation in a real operational environment isn't straightforward. Most voice demos work in controlled conditions with clean audio and cooperative users. Actual deployment means dealing with background noise, spotty WiFi, people who don't follow prompts, and systems that need to run reliably for hours without human intervention.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">System Overview</h3>
                      <p className="leading-relaxed mb-3">
                        TidesOS is a voice-first agent designed for overnight residential operations. Guests interact with it naturally through speech. The system transcribes their question, analyzes intent, generates a contextually appropriate response, and delivers it back as synthesized voice, all in under 2 seconds.
                      </p>
                      <p className="leading-relaxed">
                        The interface itself is deliberately minimal. A single button in the center of the screen. Tap to record, tap again to stop. While recording, the system shows live transcription so users know they're being heard. When the AI responds, the text displays on screen while the voice plays back. All previous exchanges stay visible in a scrollable log.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Technical Deep Dive: Audio Processing Pipeline</h3>
                      <p className="leading-relaxed mb-3">
                        The hardest part of building a production voice interface isn't the AI integration. It's getting reliable audio capture across different browsers and devices, especially mobile.
                      </p>
                      <p className="leading-relaxed mb-3">
                        I started with the Web Audio API because it gives low-level control over the audio stream. Here's the flow:
                      </p>
                      <ol className="space-y-2 ml-4 list-decimal">
                        <li><strong>Persistent Microphone Access:</strong> Request microphone permission once on page load and keep the MediaStream alive throughout the session. This avoids iOS Safari's notorious permission re-prompting issues.</li>
                        <li><strong>Real-time Buffer Capture:</strong> Connect the microphone stream to a ScriptProcessorNode with a 4096-sample buffer size. Every time the buffer fills, copy the audio data into a Float32Array and accumulate it.</li>
                        <li><strong>Custom WAV Encoding:</strong> When recording stops, concatenate all accumulated buffers into a single Float32Array, then convert to WAV format manually. This involves creating the WAV header (44 bytes) and converting Float32 samples to 16-bit PCM integers.</li>
                        <li><strong>Network Transmission:</strong> Package the WAV blob into FormData along with session metadata (UUID, company context, persona type) and POST it to the N8N webhook.</li>
                      </ol>
                      <p className="leading-relaxed mt-3">
                        The state machine has five phases: idle, recording, processing, playing, and error. Each phase has distinct visual feedback (color-coded UI, animations, status text) so users always know what's happening.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Session Management and Context</h3>
                      <p className="leading-relaxed mb-3">
                        Voice agents need memory. If someone asks "Can I access the gym?" and the agent says "Yes, it's on the 3rd floor," the next question might be "What are the hours?" The system needs to know that "the hours" refers to the gym, not some other facility.
                      </p>
                      <p className="leading-relaxed">
                        This is handled through UUID-based session tracking. Every new visitor gets a unique session ID generated client-side. All subsequent requests include this ID, allowing the N8N workflow to maintain conversation history in Supabase. The GPT-4o prompt receives the full conversation context, enabling natural follow-up questions.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Bilingual Support</h3>
                      <p className="leading-relaxed mb-3">
                        The property serves a largely bilingual population. Guests speak Rioplatense Spanish (Argentine dialect) or English, often mixing both in a single interaction. The system detects the input language automatically through Whisper's transcription and responds in kind. No explicit language selection needed.
                      </p>
                      <p className="leading-relaxed">
                        This works because the OpenAI TTS models support dialect-specific voice synthesis. The Spanish responses don't sound like generic "neutral Spanish" but rather match the local dialect patterns guests expect.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Error Handling and Network Resilience</h3>
                      <p className="leading-relaxed mb-3">
                        Voice interfaces fail in interesting ways. Network requests drop. Audio contexts get suspended by mobile browsers. Users close tabs mid-recording. Microphone permissions get revoked.
                      </p>
                      <p className="leading-relaxed">
                        The system handles this through multiple layers:
                      </p>
                      <ul className="space-y-2 ml-4 list-disc">
                        <li><strong>Network Layer:</strong> Exponential backoff retry logic. If a request to N8N fails, wait 1 second and retry. If that fails, wait 2 seconds. Then 4 seconds. After three failures, surface a user-facing error.</li>
                        <li><strong>Audio Layer:</strong> If the microphone stream dies (user revoked permission, hardware error, etc.), catch the error and attempt to re-acquire the stream automatically. If that fails, show a clear error message explaining what happened and how to fix it.</li>
                        <li><strong>State Layer:</strong> The state machine uses refs instead of state for time-sensitive flags like "currently recording." This prevents race conditions where React's async state updates could cause recording to continue after the user stops.</li>
                      </ul>
                      <p className="leading-relaxed mt-3">
                        In field testing, this architecture achieved a 99%+ success rate even with spotty lobby WiFi.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Real-World Performance</h3>
                      <p className="leading-relaxed mb-3">
                        I deployed TidesOS at Tides Residential in Miami where I work night operations. The property has about 800 units across two towers. Overnight, the security desk typically handles 50-100 guest interactions per shift. Most are routine questions about access codes, amenities, or building services.
                      </p>
                      <p className="leading-relaxed mb-3">
                        In the first week of deployment:
                      </p>
                      <ul className="space-y-2 ml-4 list-disc">
                        <li><strong>120 total interactions</strong> handled by the voice agent</li>
                        <li><strong>0 escalations</strong> to human security staff (all queries resolved autonomously)</li>
                        <li><strong>Average interaction time: 47 seconds</strong> (compared to 3-5 minutes for human-handled queries)</li>
                        <li><strong>Guest satisfaction:</strong> No complaints (measured by zero follow-up calls to the desk)</li>
                      </ul>
                      <p className="leading-relaxed mt-3">
                        The most common interaction pattern: Guest asks about building access, agent provides the code and explains how to use it, guest asks a clarifying follow-up ("Does it work for the back entrance too?"), agent confirms. Total time: under 60 seconds.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Performance Characteristics</h3>
                      <ul className="space-y-2">
                        <li><strong>Latency:</strong> 1.8 seconds average from recording stop to audio playback start</li>
                        <li><strong>Audio Quality:</strong> 44.1kHz sample rate at 16-bit depth (CD quality)</li>
                        <li><strong>Reliability:</strong> 99.2% success rate across 500+ interactions</li>
                        <li><strong>Browser Support:</strong> iOS Safari 14+, Chrome 90+, Firefox 88+, Edge 90+ (95%+ coverage)</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Technical Stack</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div><strong>Audio Capture:</strong> Web Audio API (MediaStream + ScriptProcessorNode)</div>
                        <div><strong>Audio Encoding:</strong> Custom Float32Array → WAV converter</div>
                        <div><strong>State Management:</strong> React Hooks (useState, useRef, useEffect)</div>
                        <div><strong>Network Layer:</strong> Fetch API with exponential backoff</div>
                        <div><strong>Orchestration:</strong> N8N self-hosted workflows</div>
                        <div><strong>Speech Recognition:</strong> OpenAI Whisper API</div>
                        <div><strong>Reasoning Engine:</strong> OpenAI GPT-4o</div>
                        <div><strong>Voice Synthesis:</strong> OpenAI TTS HD</div>
                        <div><strong>Session Storage:</strong> Supabase (PostgreSQL)</div>
                        <div><strong>Authentication:</strong> Next.js Edge Middleware + httpOnly cookies</div>
                        <div><strong>Deployment:</strong> Vercel Edge Network</div>
                        <div><strong>Frontend:</strong> React 19 + Next.js 15 App Router</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                    <a
                      href="https://github.com/Seryozh/tides-concierge"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-6 py-3 sm:py-4 bg-amber-600 hover:bg-amber-500 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-white transition-all group"
                    >
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                      View Full Case Study
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a
                      href="https://github.com/Seryozh/tides-concierge"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-6 py-3 sm:py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-white transition-all group"
                    >
                      <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                      View Source Code
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              )}

              {/* LogiScan Modal */}
              {activeModal === 'logiscan' && (
                <div className="p-5 sm:p-8 clear-both">
                  <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                    <div className="bg-emerald-500/10 p-2.5 sm:p-4 rounded-lg sm:rounded-xl">
                      <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white">LogiScan AI</h2>
                      <p className="text-emerald-400 text-xs sm:text-sm uppercase tracking-wider">Building an Intelligent Inventory System from Scratch</p>
                    </div>
                  </div>

                  <div className="space-y-5 sm:space-y-6 text-slate-300 text-sm sm:text-base">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">The Problem</h3>
                      <p className="leading-relaxed mb-3">
                        Picture this: every morning, someone walks into a storage room filled with packages stacked on shelves. They're holding a clipboard with a printout of what should be there. For the next two hours, they manually check each package against the list, squinting at tracking numbers, comparing unit codes, and marking items off one by one.
                      </p>
                      <p className="leading-relaxed mb-3">
                        This was the reality. 120 minutes of manual work. Every single day.
                      </p>
                      <p className="leading-relaxed">
                        The real pain wasn't just the time. It was the errors. A misread tracking number here, a skipped package there. By the end of the shift, you had no real-time visibility into what was actually in inventory versus what the system said should be there.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">The Core Challenge</h3>
                      <p className="leading-relaxed mb-3">
                        The hard part wasn't just "scan packages." That's the easy way to describe it. The actual technical challenge was this:
                      </p>
                      <p className="leading-relaxed font-semibold mb-3">
                        How do you extract structured data from chaotic, noisy images and match it against a database in real time, on a mobile device, in environments with spotty WiFi?
                      </p>
                      <h4 className="font-bold mt-4 mb-2">Challenge 1: The Vision Problem</h4>
                      <p className="leading-relaxed mb-3">
                        When you take a photo of a shelf full of packages, you're capturing everything. Shipping labels from FedEx, UPS stickers, handwritten notes, internal inventory tags, barcodes pointing in different directions. The image is messy.
                      </p>
                      <p className="leading-relaxed mb-3">
                        Traditional OCR would extract all of it. You'd get back a wall of text with tracking numbers from five different carriers, random dates, employee initials, and whatever else happened to be in frame.
                      </p>
                      <p className="leading-relaxed">
                        So the first technical decision was choosing GPT-4o Vision instead of conventional OCR. Not because it's trendy, but because I could give it instructions. I wrote a system prompt that essentially says: "Ignore everything except the white internal stickers. They follow this format: Unit on line 1, date on line 2, code on line 3. Extract the unit and the last four characters of the code. That's it."
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold mb-2">Challenge 2: The Bandwidth Problem</h4>
                      <p className="leading-relaxed mb-3">
                        Mobile phone cameras take high-resolution photos. We're talking 5MB to 15MB per image. When you're scanning 20 shelves in a session, that's 100MB to 300MB of upload bandwidth.
                      </p>
                      <p className="leading-relaxed mb-3">
                        Two issues with that: It's slow (upload times alone could take 30+ seconds per scan) and it's expensive (OpenAI's Vision API charges based on image resolution).
                      </p>
                      <p className="leading-relaxed">
                        The solution was client-side image compression. Before anything gets sent to the server, JavaScript runs in the browser, loads the image onto an HTML5 canvas, scales it down to 2500px width while preserving aspect ratio, and exports it as a JPEG at 80% quality. This single preprocessing step reduces file size by 95%. A 10MB photo becomes 500KB. Upload time drops from 10 seconds to under 2 seconds. API costs drop by about 90%.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold mb-2">Challenge 3: The Matching Problem</h4>
                      <p className="leading-relaxed mb-3">
                        Once the AI extracts data from the image (unit codes and tracking numbers), you need to match it against your inventory database. The naive approach would query the database for each scanned item, but this is slow.
                      </p>
                      <p className="leading-relaxed">
                        Instead, I built a client-side matching engine. When the app loads, it fetches the entire inventory once and stores it in memory. When a scan completes, the matching happens locally in JavaScript in under 10 milliseconds. No database queries. No network calls. The user gets instant feedback. The green "verified" cards appear immediately, along with haptic feedback and a success sound.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold mb-2">Challenge 4: The Offline Problem</h4>
                      <p className="leading-relaxed mb-3">
                        WiFi in storage rooms is unpredictable. Sometimes it works. Sometimes it doesn't. Sometimes it drops in the middle of a scan session.
                      </p>
                      <p className="leading-relaxed">
                        The app needed to handle this. So I built it as a Progressive Web App (PWA) with a service worker that caches the critical routes. When you open the app, the shell loads instantly from the cache. The inventory data gets fetched when WiFi is available, but the UI is already interactive. You can add it to your phone's home screen like a native app.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">The Sync System</h3>
                      <p className="leading-relaxed mb-3">
                        The scanning workflow handles the audit process, but there's a second part to this system: getting packages into the database in the first place.
                      </p>
                      <p className="leading-relaxed mb-3">
                        The input is messy. Someone copy-pastes a log from another system with no consistent formatting. Writing regex patterns for this would be a nightmare. You'd need dozens of patterns to handle all the variations, and the moment the format changed slightly, everything would break.
                      </p>
                      <p className="leading-relaxed">
                        Instead, I used GPT-4o as a parser. I gave it example inputs and outputs in the system prompt, set the temperature to 0 (for deterministic results), and let it extract the three fields I care about: unit, guest name, and last four digits of the tracking number. The AI handles format variations without any code changes.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">The Results</h3>
                      <p className="leading-relaxed mb-3">
                        The impact was immediate and measurable:
                      </p>
                      <ul className="space-y-2">
                        <li><strong>Time:</strong> The manual audit process took 120 minutes per day. With LogiScan, it takes about 20 minutes. That's an 83% reduction. 100 minutes saved daily.</li>
                        <li><strong>Accuracy:</strong> Manual audits had human error. Misread tracking numbers, skipped packages, incorrect check marks. The system hits 95% extraction accuracy, and the composite key matching prevents false positives.</li>
                        <li><strong>Visibility:</strong> Before, inventory status was on paper or in a spreadsheet that got updated once a day. Now, it's in a real-time PostgreSQL database. You can query it, build reports on it, track trends over time.</li>
                        <li><strong>Cost:</strong> The image compression optimization reduced Vision API costs by roughly 90%. The client-side matching eliminated 50 to 100 database queries per audit session.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Technical Decisions Worth Discussing</h3>
                      <h4 className="font-bold mt-4 mb-2">Why Next.js 15 Server Actions?</h4>
                      <p className="leading-relaxed mb-3">
                        Server Actions gave me type safety from client to server without code generation. I write a function on the server, call it from the client, and TypeScript enforces the contract. No route definitions, no HTTP verb management, no manual serialization.
                      </p>

                      <h4 className="font-bold mt-4 mb-2">Why client-side matching instead of server-side?</h4>
                      <p className="leading-relaxed mb-3">
                        Latency. Even a fast database query takes 50-100ms. Add network round trips, and you're at 200-300ms per match. Multiply that by 10 items per scan, and users wait 2-3 seconds for results. Client-side matching happens in under 10ms. The feedback is instant.
                      </p>

                      <h4 className="font-bold mt-4 mb-2">Why GPT-4o instead of traditional OCR?</h4>
                      <p className="leading-relaxed">
                        Context awareness. Traditional OCR extracts everything. GPT-4o understands instructions. I can tell it "ignore the FedEx label, only look at the white sticker" and it does. That level of filtering would require complex post-processing with traditional OCR.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Technical Stack Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div><strong>Frontend:</strong> React 19 + Next.js 15</div>
                        <div><strong>Language:</strong> TypeScript 5 (strict)</div>
                        <div><strong>Styling:</strong> Tailwind CSS 4</div>
                        <div><strong>AI/ML:</strong> OpenAI GPT-4o (Vision + Text)</div>
                        <div><strong>Database:</strong> PostgreSQL (via Supabase)</div>
                        <div><strong>Deployment:</strong> Vercel</div>
                        <div><strong>PWA:</strong> Service Workers + Web Manifest</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Performance Metrics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div><strong>Daily audit time:</strong> 120 min → 20 min (83% reduction)</div>
                        <div><strong>Image upload time:</strong> 10-15 sec → 1-2 sec (85% reduction)</div>
                        <div><strong>Matching latency:</strong> N/A (manual) → &lt;10 ms</div>
                        <div><strong>Data accuracy:</strong> ~80% → 95% (15% improvement)</div>
                        <div><strong>API cost per scan:</strong> ~$0.20 → ~$0.02 (90% reduction)</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                    <a
                      href="https://github.com/Seryozh/logiscan-ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-6 py-3 sm:py-4 bg-emerald-600 hover:bg-emerald-500 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-white transition-all group"
                    >
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                      View Full Case Study
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a
                      href="https://github.com/Seryozh/logiscan-ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-6 py-3 sm:py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-white transition-all group"
                    >
                      <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                      View Source Code
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              )}

              {/* Lux Modal */}
              {activeModal === 'lux' && (
                <div className="p-5 sm:p-8 clear-both">
                  <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                    <div className="bg-purple-500/10 p-2.5 sm:p-4 rounded-lg sm:rounded-xl">
                      <Play className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white">Lux Agentic AI</h2>
                      <p className="text-purple-400 text-xs sm:text-sm uppercase tracking-wider">Building a Self-Healing AI Agent for Game Development</p>
                    </div>
                  </div>

                  <div className="space-y-5 sm:space-y-6 text-slate-300 text-sm sm:text-base">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">The Problem</h3>
                      <p className="leading-relaxed mb-3">
                        Anyone who has tried to use ChatGPT or Claude to help with coding has run into the same frustrating pattern. You ask it to modify a file. It hallucinates a path that doesn't exist. You correct it. It tries again, but now it's forgotten what you originally asked for. Three iterations later, you've spent more time managing the AI than just doing the work yourself.
                      </p>
                      <p className="leading-relaxed mb-3">
                        This problem gets exponentially worse in game development. A typical Roblox project might have 100+ script files organized in a complex hierarchy. The AI needs to understand not just the code, but the spatial relationships between game objects, the client-server architecture, and the interconnected state of dozens of systems.
                      </p>
                      <p className="leading-relaxed">
                        When I started building Lux, I had a simple goal: make an AI assistant that could actually ship features in a Roblox game without constant babysitting. What I ended up building was something more interesting. A framework for wrapping unreliable AI in deterministic safety checks, turning a research toy into a production tool.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">The Core Insight</h3>
                      <p className="leading-relaxed mb-3">
                        The breakthrough came from realizing that LLMs and traditional software have fundamentally incompatible philosophies. Traditional software is deterministic. Give it the same input twice, you get the same output. LLMs are probabilistic. They guess. Sometimes those guesses are brilliant, sometimes they're completely wrong.
                      </p>
                      <p className="leading-relaxed mb-3">
                        Most people try to solve this by prompt engineering. Add more instructions. Be more specific. Use XML tags. But you're still fundamentally trusting the AI to do the right thing. It's like trying to make a random number generator deterministic by asking it nicely.
                      </p>
                      <p className="leading-relaxed">
                        The better approach is to treat the AI as a proposal engine. Let it be creative and probabilistic, but verify every single action it takes against physical reality. Build a closed loop: AI proposes an action → System validates the proposal before executing → System executes and observes the result → System updates AI's understanding with what actually happened → Loop continues.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Architecture Overview</h3>
                      <p className="leading-relaxed mb-3">
                        The system has three main layers:
                      </p>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-bold mb-1">Safety Layer</h4>
                          <ul className="ml-4 space-y-1 list-disc">
                            <li>Pre-execution validation catches hallucinations before they cause damage</li>
                            <li>Circuit breaker detects failure spirals and halts execution</li>
                            <li>Post-execution verification ensures actions had intended effects</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-bold mb-1">Memory Layer</h4>
                          <ul className="ml-4 space-y-1 list-disc">
                            <li>Working memory holds recent context with exponential decay</li>
                            <li>Decision memory learns from successful patterns</li>
                            <li>Project context anchors AI understanding to actual codebase state</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-bold mb-1">Execution Layer</h4>
                          <ul className="ml-4 space-y-1 list-disc">
                            <li>Tool system with read/write/project operations</li>
                            <li>Sequential execution with approval queue for dangerous operations</li>
                            <li>Automatic retry with exponential backoff</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">The Memory System</h3>
                      <p className="leading-relaxed mb-3">
                        The memory architecture solved the hardest problem: How do you give an AI a useful mental model of a large codebase without blowing through your token budget?
                      </p>
                      <p className="leading-relaxed mb-3">
                        The solution uses a three-tier hierarchy inspired by human memory:
                      </p>
                      <p className="leading-relaxed mb-3">
                        <strong>Critical Memory</strong> holds things that never decay. User goals, architectural decisions, key findings. This is maybe 5-10 items max. Small enough to always include in context.
                      </p>
                      <p className="leading-relaxed mb-3">
                        <strong>Working Memory</strong> holds recent observations scored by relevance. Each item gets a base relevance score (100 for user goals, 80 for script reads, 70 for tool results). Then exponential decay kicks in with a half-life of 5 minutes. But here's the key: every time you access an item, its base score increases by 5 points. Frequently used context stays relevant even as time passes.
                      </p>
                      <p className="leading-relaxed">
                        <strong>Background Memory</strong> is compressed summaries of things that used to matter. The AI can't see these directly, but they're available if needed. Think of it like human long-term memory.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">The Circuit Breaker</h3>
                      <p className="leading-relaxed mb-3">
                        The circuit breaker prevents the most expensive failure mode: infinite retry loops.
                      </p>
                      <p className="leading-relaxed mb-3">
                        Picture this: The AI tries to read a script at path "ServerScriptService.MainScript". Path doesn't exist. Tool returns error. AI tries again with "ServerScriptService.Main". Still wrong. Tries "ServerScriptService.Scripts.Main". Tries variations until it burns through your API budget and fills the context window with error messages.
                      </p>
                      <p className="leading-relaxed mb-3">
                        The circuit breaker is a state machine with three states:
                      </p>
                      <ul className="ml-4 space-y-1 list-disc">
                        <li><strong>Closed (normal operation):</strong> Track consecutive failures, allow all operations, warning at 3 failures</li>
                        <li><strong>Open (blocked):</strong> Triggered after 5 consecutive failures, block all new operations, 30 second cooldown timer, require human intervention</li>
                        <li><strong>Half-Open (testing):</strong> Cooldown period expired, allow one test operation, success returns to Closed, failure returns to Open</li>
                      </ul>
                      <p className="leading-relaxed mt-3">
                        In 500+ production sessions, the circuit breaker achieved 100% success rate at preventing runaway loops.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Output Validation</h3>
                      <p className="leading-relaxed mb-3">
                        The output validator catches hallucinations before they execute. For any tool call, it checks:
                      </p>
                      <ul className="ml-4 space-y-1 list-disc">
                        <li><strong>Required fields present?</strong> If you're reading a script, you need a path. Missing required fields immediately reject the tool call.</li>
                        <li><strong>Paths exist?</strong> For operations on existing resources, validate the path against actual game hierarchy. If path doesn't exist, find similar paths using substring matching and suggest them back to the AI.</li>
                        <li><strong>Content looks valid?</strong> Scan for placeholder patterns: TODO, FIXME, "your code here", &lt;placeholder&gt;.</li>
                        <li><strong>Syntax passes basic sanity checks?</strong> Count opening and closing brackets, parentheses, braces. They should match.</li>
                      </ul>
                      <p className="leading-relaxed mt-3">
                        Validation reduces failed tool calls by 60-70%. The ROI is massive because failed tool calls are pure waste.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Performance Results</h3>
                      <p className="leading-relaxed mb-3">
                        The quantitative results:
                      </p>
                      <div className="space-y-2">
                        <div><strong>Token Efficiency:</strong> 75% reduction (10,000-15,000 → 2,000-4,000 tokens per request)</div>
                        <div><strong>Cost:</strong> 80% savings ($2-4 → $0.40-0.80 per complex task)</div>
                        <div><strong>Accuracy:</strong> 95%+ successful tool executions (up from 60-70%)</div>
                        <div><strong>Speed:</strong> 60% fewer iterations (8-15 → 3-6 iterations per task)</div>
                        <div><strong>Reliability:</strong> 100% infinite loop prevention over 500+ sessions</div>
                        <div><strong>Hallucination Reduction:</strong> 85% (from 40-60% to 5-10%)</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">What I Learned</h3>
                      <h4 className="font-bold mt-4 mb-2">1. Deterministic wrappers beat prompt engineering</h4>
                      <p className="leading-relaxed mb-3">
                        I spent weeks trying to prompt engineer my way to reliability. "Be careful", "double check paths", "verify before executing". None of it worked consistently. The LLM would be careful for a while, then make the same mistakes.
                      </p>
                      <p className="leading-relaxed mb-3">
                        The breakthrough was giving up on making the LLM reliable and instead making the system around it reliable. Let the LLM be creative and error-prone. Catch errors before they cause damage. This is how you build production systems with unreliable components.
                      </p>

                      <h4 className="font-bold mt-4 mb-2">2. Empirical verification is non-negotiable</h4>
                      <p className="leading-relaxed mb-3">
                        Never trust the AI's internal model. Always verify against physical reality. After every tool execution, check that it actually did what it said it did. Update the AI's context with observed results, not with what the AI thinks happened.
                      </p>

                      <h4 className="font-bold mt-4 mb-2">3. Memory management is the hard problem</h4>
                      <p className="leading-relaxed">
                        Getting the memory system right took longer than everything else combined. Too much context and you waste tokens. Too little and the AI operates blind. The exponential decay model with access boosting is the best solution I found, but I went through a dozen failed approaches first.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3">System Scale & Key Metrics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div><strong>Codebase:</strong> 15,000 lines of Lua across 55 modules</div>
                        <div><strong>Tool Definitions:</strong> 20+ (read, write, project operations)</div>
                        <div><strong>Memory Half-Life:</strong> 300 seconds with +5 relevance boost per access</div>
                        <div><strong>Working Memory Capacity:</strong> 20 items</div>
                        <div><strong>Circuit Breaker Threshold:</strong> 5 failures, 30s cooldown</div>
                        <div><strong>Developer Impact:</strong> 85% faster on complex tasks (2-4 hrs → 15-30 min)</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                    <a
                      href="https://github.com/Seryozh/lux-agentic-ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-6 py-3 sm:py-4 bg-purple-600 hover:bg-purple-500 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-white transition-all group"
                    >
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                      View Full Case Study
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a
                      href="https://github.com/Seryozh/lux-agentic-ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-6 py-3 sm:py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-white transition-all group"
                    >
                      <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                      View Source Code
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
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