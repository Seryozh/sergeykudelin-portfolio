'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Github, FileText, Play, X, ExternalLink, Mail, Linkedin, Youtube, Code2, Layers, Database, Cpu, Menu, X as XIcon, BookOpen, ArrowLeft } from 'lucide-react';
import { MarkdownRenderer } from './components/MarkdownRenderer';

type ProjectModal = 'tidesos' | 'logiscan' | 'lux' | null;

export default function Home() {
  const [activeModal, setActiveModal] = useState<ProjectModal>(null);
  const [activeProof, setActiveProof] = useState<string | null>(null);
  const [proofContent, setProofContent] = useState<string>('');
  const [mainContent, setMainContent] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const projectPaths: Record<string, string> = {
    'tidesos': 'TidesOS',
    'logiscan': 'LogiScan',
    'lux': 'Lux',
  };

  const sections = ['hero', 'projects', 'approach', 'expertise', 'articles', 'contact'];

  // Handle URL query params for direct modal links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const project = params.get('project');
    const proof = params.get('proof');
    
    if (project === 'tidesos' || project === 'logiscan' || project === 'lux') {
      setActiveModal(project);
      
      if (proof) {
        setActiveProof(proof);
        loadProofContent(project, proof);
      }
    }
  }, []);

  // Update URL when modal opens/closes
  useEffect(() => {
    if (activeModal) {
      const url = new URL(window.location.href);
      url.searchParams.set('project', activeModal);
      
      if (activeProof) {
        url.searchParams.set('proof', activeProof);
      } else {
        url.searchParams.delete('proof');
      }
      
      window.history.pushState({}, '', url.toString());
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete('project');
      url.searchParams.delete('proof');
      window.history.pushState({}, '', url.toString());
    }
  }, [activeModal, activeProof]);

  // Load main case study content when modal opens
  const loadMainContent = async (project: string) => {
    try {
      const projectPath = projectPaths[project];
      if (!projectPath) return;

      const response = await fetch(`/api/proof?project=${projectPath}&proof=main`);
      if (response.ok) {
        const content = await response.text();
        setMainContent(content);
      }
    } catch (error) {
      console.error('Failed to load main content:', error);
    }
  };

  // Load main content when modal opens
  useEffect(() => {
    if (activeModal && !activeProof) {
      loadMainContent(activeModal);
    }
  }, [activeModal, activeProof]);

  // Load proof content from markdown files
  const loadProofContent = async (project: string, proof: string) => {
    try {
      const projectPath = projectPaths[project];
      if (!projectPath) return;

      const response = await fetch(`/api/proof?project=${projectPath}&proof=${proof}`);
      if (response.ok) {
        const content = await response.text();
        setProofContent(content);
      }
    } catch (error) {
      console.error('Failed to load proof content:', error);
    }
  };

  // Handle proof link clicks
  const handleProofClick = (proofId: string) => {
    setActiveProof(proofId);
    if (activeModal) {
      loadProofContent(activeModal, proofId);
    }
  };

  // Handle back from proof
  const handleBackFromProof = () => {
    setActiveProof(null);
    setProofContent('');
  };

  // Handle closing modal/proof
  const handleCloseModal = () => {
    if (activeProof) {
      handleBackFromProof();
    } else {
      setActiveModal(null);
      setActiveProof(null);
      setProofContent('');
      setMainContent('');
    }
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (activeProof) {
          handleBackFromProof();
        } else {
          setActiveModal(null);
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [activeProof]);

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
            onClick={() => {
              setActiveModal(null);
              setActiveProof(null);
              setProofContent('');
            }}
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
                onClick={handleCloseModal}
                className="sticky top-3 sm:top-4 right-3 sm:right-4 float-right z-10 p-2 bg-slate-800/80 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              </button>

              {/* Proof View */}
              <AnimatePresence mode="wait">
                {activeProof && proofContent && (
                  <motion.div
                    key="proof-view"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="p-5 sm:p-8 clear-both"
                  >
                    {/* Back Button */}
                    <button
                      onClick={handleBackFromProof}
                      className="flex items-center gap-2 mb-6 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-amber-300 hover:bg-slate-800/50 rounded-lg transition-all duration-300 border border-slate-700 hover:border-amber-500/50"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Case Study
                    </button>

                    <div className="space-y-5 sm:space-y-6 text-slate-300 text-sm sm:text-base">
                      <MarkdownRenderer 
                        content={proofContent} 
                        onLinkClick={handleProofClick}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* TidesOS Modal */}
              {activeModal === 'tidesos' && !activeProof && (
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
                    <MarkdownRenderer
                      content={mainContent}
                      onLinkClick={handleProofClick}
                      theme="amber"
                    />
                  </div>

                  <div className="flex justify-center mt-6 sm:mt-8">
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
              {activeModal === 'logiscan' && !activeProof && (
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
                    <MarkdownRenderer
                      content={mainContent}
                      onLinkClick={handleProofClick}
                      theme="emerald"
                    />
                  </div>

                  <div className="flex justify-center mt-6 sm:mt-8">
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
              {activeModal === 'lux' && !activeProof && (
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
                    <MarkdownRenderer
                      content={mainContent}
                      onLinkClick={handleProofClick}
                      theme="purple"
                    />
                  </div>

                  <div className="flex justify-center mt-6 sm:mt-8">
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