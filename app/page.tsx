'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail, Linkedin, Youtube, Github, Code2, Layers, Database, Cpu, Menu, X as XIcon, BookOpen, Zap, Play, Scan, Camera } from 'lucide-react';
import Overlay from './components/Overlay';
import LuxDescription from './components/LuxDescription';
import LuxDemo from './components/LuxDemo';
import LogiScanDescription from './components/LogiScanDescription';
import LogiScanDemo from './components/LogiScanDemo';
import TerminalIntro from './components/TerminalIntro';
import LuxLaptopAnimation from './components/LuxLaptopAnimation';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [activeOverlay, setActiveOverlay] = useState<'lux-description' | 'lux-demo' | 'logiscan-description' | 'logiscan-demo' | null>(null);

  const sections = ['hero', 'lux', 'logiscan', 'expertise', 'contact'];

  // When opening modal
  const openModal = (type: 'lux-description' | 'lux-demo' | 'logiscan-description' | 'logiscan-demo') => {
    setActiveOverlay(type);
    window.history.pushState(null, '', `#${type}`);
  };

  // When closing modal
  const closeModal = () => {
    setActiveOverlay(null);
    // Navigate back to the appropriate section
    const current = window.location.hash;
    if (current.startsWith('#logiscan')) {
      window.history.pushState(null, '', '#logiscan');
    } else {
      window.history.pushState(null, '', '#lux');
    }
  };

  // Handle URL hash for deep linking
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#lux-demo') {
        setActiveOverlay('lux-demo');
      } else if (hash === '#logiscan-demo') {
        setActiveOverlay('logiscan-demo');
      } else if (hash === '#logiscan-description' || hash.startsWith('#logiscan-')) {
        setActiveOverlay('logiscan-description');
        setTimeout(() => {
          const element = document.getElementById(hash.substring(1));
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
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
    { label: 'LogiScan', id: 'logiscan' },
    { label: 'Writing', id: 'writing', external: true },
    { label: 'Expertise', id: 'expertise' },
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
                onClick={() => {
                  if ('external' in item && item.external) {
                    window.open('https://medium.com/@kudelin.dev/the-therac-25-lesson-why-ai-agents-need-a-circuit-breaker-architecture-789fca88272a', '_blank');
                  } else {
                    scrollToSection(item.id);
                  }
                }}
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
                    onClick={() => {
                      if ('external' in item && item.external) {
                        window.open('https://medium.com/@kudelin.dev/the-therac-25-lesson-why-ai-agents-need-a-circuit-breaker-architecture-789fca88272a', '_blank');
                        setMobileMenuOpen(false);
                      } else {
                        scrollToSection(item.id);
                      }
                    }}
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
            <p className="text-slate-400 text-base sm:text-lg md:text-xl mb-8 sm:mb-12 tracking-wide">
              Full-Stack Engineer &bull; Miami
            </p>

            {/* Terminal Intro */}
            <TerminalIntro />
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
          <div className="grid md:grid-cols-[2fr_3fr] gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  Lux
                </h2>
                <p className="text-xl text-slate-400 leading-relaxed">
                  Agentic AI system for natural language game development. Built a bidirectional protocol layer that enables LLMs to read and modify game state in real-time, handling async communication over one-way message channels.
                </p>
                <p className="text-xl text-slate-400 leading-relaxed">
                  Deployed in production environments with 1,500+ active installations processing player interactions.
                </p>
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

            <div>
              <LuxLaptopAnimation />
            </div>
          </div>
        </motion.div>
      </section>

      {/* LogiScan Project Section */}
      <section id="logiscan" className="min-h-screen snap-start flex items-center justify-center relative overflow-hidden px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl z-10"
        >
          <div className="grid md:grid-cols-[3fr_2fr] gap-12 items-center">
            {/* Visual: Bounding box preview card — LEFT */}
            <div className="relative group cursor-pointer" onClick={() => openModal('logiscan-description')}>
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden aspect-video">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[url('https://i.imgur.com/rtXV6df.png')] bg-cover bg-center" />
                  <div className="absolute inset-0 bg-slate-900/30" />
                  <div className="relative w-full h-full p-6">
                    <motion.div
                      className="absolute rounded border-2"
                      style={{ top: '15%', left: '8%', width: '35%', height: '35%', borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)' }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="absolute -top-5 left-0 text-[9px] font-bold text-white bg-emerald-500 px-1.5 py-0.5 rounded">C08Q - 9679</div>
                    </motion.div>
                    <motion.div
                      className="absolute rounded border-2"
                      style={{ top: '12%', left: '52%', width: '40%', height: '30%', borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)' }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="absolute -top-5 left-0 text-[9px] font-bold text-white bg-emerald-500 px-1.5 py-0.5 rounded">C14K - 3728</div>
                    </motion.div>
                    <motion.div
                      className="absolute rounded border-2"
                      style={{ top: '55%', left: '15%', width: '32%', height: '32%', borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,0.1)' }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="absolute -top-5 left-0 text-[9px] font-bold text-white bg-orange-500 px-1.5 py-0.5 rounded">C22B - 5501</div>
                    </motion.div>
                    <motion.div
                      className="absolute rounded border-2"
                      style={{ top: '58%', left: '58%', width: '30%', height: '28%', borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)' }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      <div className="absolute -top-5 left-0 text-[9px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded">??? - ????</div>
                      <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center text-white text-[7px] font-black">!</div>
                    </motion.div>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <motion.div
                        className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Camera className="w-6 h-6 text-emerald-400" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text content — RIGHT */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  LogiScan
                </h2>
                <p className="text-xl text-slate-400 leading-relaxed">
                  AI vision system for automated package reconciliation. Computer vision + agentic AI reads shipping labels and matches them against manifests in seconds.
                </p>
                <p className="text-xl text-slate-400 leading-relaxed">
                  Reduces manual sorting from ~60 minutes to under 15 minutes per batch. Built on edge inference at ~$0.002 per scan.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => openModal('logiscan-description')}
                  className="flex-1 px-8 py-4 bg-emerald-500 text-slate-950 rounded-xl font-bold hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 group"
                >
                  Read More
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => openModal('logiscan-demo')}
                  className="flex-1 px-8 py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  Interactive Demo
                  <Play className="w-5 h-5" />
                </button>
              </div>
            </div>
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
              <p className="text-sm text-slate-300">
                TypeScript/JavaScript, Python, SQL, Lua
              </p>
            </div>

            {/* AI & Agentic Engineering */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:bg-slate-900/80 transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-purple-500/10 p-1.5 rounded-lg">
                  <Cpu className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="text-base font-bold text-white">AI & Agentic Engineering</h3>
              </div>
              <p className="text-sm text-slate-300">
                LLM integration (OpenAI, Anthropic), RAG & vector databases, agentic frameworks, prompt engineering
              </p>
            </div>

            {/* Full-Stack & Systems Architecture */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:bg-slate-900/80 transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-emerald-500/10 p-1.5 rounded-lg">
                  <Layers className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-white">Full-Stack & Systems Architecture</h3>
              </div>
              <p className="text-sm text-slate-300">
                Next.js, React, Node.js, serverless functions, RESTful APIs, PostgreSQL, Supabase, state management (React Context, Zustand)
              </p>
            </div>

            {/* Infrastructure & Professional Tools */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:bg-slate-900/80 transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-amber-500/10 p-1.5 rounded-lg">
                  <Database className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-base font-bold text-white">Infrastructure & Professional Tools</h3>
              </div>
              <p className="text-sm text-slate-300">
                Docker, CI/CD (GitHub Actions, Vercel), workflow automation (n8n, Zapier), Git, Postman, Figma
              </p>
            </div>
          </div>
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
            I&apos;m currently available for full-time roles and high-impact contract projects.
          </p>

          {/* What I'm looking for */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">What I&apos;m looking for:</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex gap-2">
                <span className="text-amber-400">•</span>
                <span>Production AI systems with real user impact</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">•</span>
                <span>Teams shipping agentic tools or automation infrastructure</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">•</span>
                <span>Projects where system design and failure modes matter</span>
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
        onClose={closeModal}
        title="Lux: Technical Deep Dive"
      >
        <LuxDescription onOpenDemo={() => {
          closeModal();
          setTimeout(() => openModal('lux-demo'), 100);
        }} />
      </Overlay>

      <Overlay
        isOpen={activeOverlay === 'lux-demo'}
        onClose={closeModal}
        title="Interactive Polling Bridge Demo"
      >
        <LuxDemo />
      </Overlay>

      <Overlay
        isOpen={activeOverlay === 'logiscan-description'}
        onClose={closeModal}
        title="LogiScan: Technical Deep Dive"
      >
        <LogiScanDescription />
      </Overlay>

      <Overlay
        isOpen={activeOverlay === 'logiscan-demo'}
        onClose={closeModal}
        title="LogiScan: Scanning Simulation"
      >
        <LogiScanDemo />
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
