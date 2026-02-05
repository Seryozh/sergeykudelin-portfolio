'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail, Linkedin, Youtube, Github, Code2, Layers, Database, Cpu, Menu, X as XIcon, BookOpen, Zap, ExternalLink, Play } from 'lucide-react';
import Overlay from './components/Overlay';
import LuxDescription from './components/LuxDescription';
import LuxDemo from './components/LuxDemo';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [activeOverlay, setActiveOverlay] = useState<'lux-description' | 'lux-demo' | null>(null);

  const sections = ['hero', 'lux', 'approach', 'expertise', 'articles', 'contact'];

  // When opening modal
  const openModal = (type: 'lux-description' | 'lux-demo') => {
    setActiveOverlay(type);
    window.history.pushState(null, '', `#${type}`);
  };

  // When closing modal
  const closeModal = () => {
    setActiveOverlay(null);
    window.history.pushState(null, '', '#lux');
  };

  // Handle URL hash for deep linking
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#lux-demo') {
        setActiveOverlay('lux-demo');
      } else if (hash.startsWith('#lux-')) {
        setActiveOverlay('lux-description');
        // Small delay to allow modal to open before scrolling
        setTimeout(() => {
          const element = document.getElementById(hash.substring(1));
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
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
    { label: 'Lux', id: 'lux' },
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

      {/* Lux Project Section */}
      <section id="lux" className="min-h-screen snap-start flex items-center justify-center relative overflow-hidden px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl z-10"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium">
                  <Zap className="w-4 h-4" />
                  Flagship Project
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  Lux
                </h2>
                <p className="text-xl text-slate-400 leading-relaxed">
                  Agentic AI system for natural language game development.
                  Solving bidirectional communication over one-way protocols.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="text-2xl font-bold text-amber-400">1,500+</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Downloads</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="text-2xl font-bold text-emerald-400">v2.0</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Latest Release</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => openModal('lux-description')}
                  className="flex-1 px-8 py-4 bg-amber-500 text-slate-950 rounded-xl font-bold hover:bg-amber-400 transition-all flex items-center justify-center gap-2 group"
                >
                  Read More
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => openModal('lux-demo')}
                  className="flex-1 px-8 py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  Interactive Demo
                  <Play className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative group cursor-pointer" onClick={() => openModal('lux-demo')}>
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-300 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('/lux-preview.png')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" />
                <div className="z-10 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 shadow-2xl shadow-amber-500/50 group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-current" />
                  </div>
                  <span className="text-sm font-bold text-white uppercase tracking-widest">Watch Simulation</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
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
      {/* Overlays */}
      <Overlay
        isOpen={activeOverlay === 'lux-description'}
        onClose={() => setActiveOverlay(null)}
        title="Lux: Technical Deep Dive"
      >
        <LuxDescription />
      </Overlay>

      <Overlay
        isOpen={activeOverlay === 'lux-demo'}
        onClose={() => setActiveOverlay(null)}
        title="Interactive Polling Bridge Demo"
      >
        <LuxDemo />
      </Overlay>

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
    </main>
  );
}
