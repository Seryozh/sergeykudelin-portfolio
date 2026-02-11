'use client';

import { useState, useEffect } from 'react';
import Header from './sections/Header';
import Hero from './sections/Hero';
import LuxProject from './sections/LuxProject';
import LogiScanProject from './sections/LogiScanProject';
import Expertise from './sections/Expertise';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import Overlay from './components/ui/Overlay';
import LuxDescription from './components/projects/LuxDescription';
import LuxDemo from './components/projects/LuxDemo';
import LogiScanDescription from './components/projects/LogiScanDescription';
import LogiScanDemo from './components/projects/LogiScanDemo';

type OverlayType = 'lux-description' | 'lux-demo' | 'logiscan-description' | 'logiscan-demo' | null;

/**
 * Main Portfolio Page
 * 
 * Features:
 * - Full-page scroll snap sections
 * - Section progress indicator
 * - Project detail overlays with deep linking via URL hash
 * - Mobile-responsive navigation
 */
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [activeOverlay, setActiveOverlay] = useState<OverlayType>(null);

  const sections = ['hero', 'lux', 'logiscan', 'expertise', 'contact'];

  // Open overlay modal and update URL hash for deep linking
  const openModal = (type: NonNullable<OverlayType>) => {
    setActiveOverlay(type);
    window.history.pushState(null, '', `#${type}`);
  };

  // Close overlay and navigate back to appropriate section
  const closeModal = () => {
    setActiveOverlay(null);
    const current = window.location.hash;
    if (current.startsWith('#logiscan')) {
      window.history.pushState(null, '', '#logiscan');
    } else {
      window.history.pushState(null, '', '#lux');
    }
  };

  // Handle URL hash for deep linking to overlays
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

  // Track scroll position for section indicator
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

  // Copy email to clipboard with visual feedback
  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('sergey@sergeykudelin.com');
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  // Navigate to a section by ID
  const scrollToSection = (id: string) => {
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <main className="bg-slate-950 text-white snap-container">
      {/* Fixed Header with Navigation */}
      <Header currentSection={currentSection} onNavigate={scrollToSection} />

      {/* Section Progress Indicator */}
      <div className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
        {sections.map((section, index) => (
          <button
            key={section}
            onClick={() => scrollToSection(section)}
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

      {/* Page Sections */}
      <Hero />
      
      <LuxProject 
        onReadMore={() => openModal('lux-description')}
        onOpenDemo={() => openModal('lux-demo')}
      />
      
      <LogiScanProject 
        onReadMore={() => openModal('logiscan-description')}
        onOpenDemo={() => openModal('logiscan-demo')}
      />
      
      <Expertise />
      
      <Contact 
        emailCopied={emailCopied}
        onCopyEmail={copyEmailToClipboard}
      />
      
      <Footer />

      {/* Project Detail Overlays */}
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
    </main>
  );
}
