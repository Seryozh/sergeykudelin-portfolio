'use client';

import { useState, useEffect } from 'react';
import Header from './sections/Header';
import Hero from './sections/Hero';
import LuxProject from './sections/LuxProject';
import LogiScanProject from './sections/LogiScanProject';
import ClinicPulseProject from './sections/ClinicPulseProject';
import Expertise from './sections/Expertise';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import Overlay from './components/ui/Overlay';
import LuxDescription from './components/projects/LuxDescription';
import LuxDemo from './components/projects/LuxDemo';
import LogiScanDescription from './components/projects/LogiScanDescription';
import LogiScanDemo from './components/projects/LogiScanDemo';
import ClinicPulseDescription from './components/projects/ClinicPulseDescription';
import ClinicPulseDemo from './components/projects/ClinicPulseDemo';

type OverlayType =
  | 'lux-description'
  | 'lux-demo'
  | 'logiscan-description'
  | 'logiscan-demo'
  | 'clinicpulse-description'
  | 'clinicpulse-demo'
  | null;

/**
 * Main Portfolio Page
 *
 * Features:
 * - Full-page scroll snap sections
 * - Section progress indicator
 * - Project detail overlays with deep linking via URL hash
 * - Auto-play demos when accessed via hash (#lux-demo, #logiscan-demo, #clinicpulse-demo)
 * - Mobile-responsive navigation
 */
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [activeOverlay, setActiveOverlay] = useState<OverlayType>(null);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  const sections = ['hero', 'lux', 'logiscan', 'clinicpulse', 'expertise', 'contact'];

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
    } else if (current.startsWith('#clinicpulse')) {
      window.history.pushState(null, '', '#clinicpulse');
    } else {
      window.history.pushState(null, '', '#lux');
    }
  };

  // Handle URL hash AND query params for deep linking to overlays with auto-play support
  useEffect(() => {
    const handleDeepLink = () => {
      const params = new URLSearchParams(window.location.search);
      const project = params.get('project');
      const section = params.get('section');

      if (project || section) {
        setShouldAutoPlay(false);
        if (project === 'lux' || section?.startsWith('lux-')) {
          setActiveOverlay('lux-description');
          if (section) {
            setTimeout(() => {
              const el = document.getElementById(section);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 300);
          }
        } else if (project === 'logiscan' || section?.startsWith('logiscan-')) {
          setActiveOverlay('logiscan-description');
          if (section) {
            setTimeout(() => {
              const el = document.getElementById(section);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 300);
          }
        } else if (project === 'clinicpulse' || section?.startsWith('clinicpulse-')) {
          setActiveOverlay('clinicpulse-description');
          if (section) {
            setTimeout(() => {
              const el = document.getElementById(section);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 300);
          }
        }
        return;
      }

      const hash = window.location.hash;
      if (hash === '#lux-demo') {
        setShouldAutoPlay(true);
        setActiveOverlay('lux-demo');
      } else if (hash === '#logiscan-demo') {
        setShouldAutoPlay(true);
        setActiveOverlay('logiscan-demo');
      } else if (hash === '#clinicpulse-demo') {
        setShouldAutoPlay(true);
        setActiveOverlay('clinicpulse-demo');
      } else if (hash === '#logiscan-description' || hash.startsWith('#logiscan-')) {
        setShouldAutoPlay(false);
        setActiveOverlay('logiscan-description');
        setTimeout(() => {
          const element = document.getElementById(hash.substring(1));
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (hash === '#clinicpulse-description' || hash.startsWith('#clinicpulse-')) {
        setShouldAutoPlay(false);
        setActiveOverlay('clinicpulse-description');
        setTimeout(() => {
          const element = document.getElementById(hash.substring(1));
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (hash.startsWith('#lux-')) {
        setShouldAutoPlay(false);
        setActiveOverlay('lux-description');
        setTimeout(() => {
          const element = document.getElementById(hash.substring(1));
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (hash) {
        setShouldAutoPlay(false);
        const element = document.getElementById(hash.substring(1));
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    handleDeepLink();
    window.addEventListener('hashchange', handleDeepLink);
    return () => window.removeEventListener('hashchange', handleDeepLink);
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
      if (element) element.scrollIntoView({ behavior: 'smooth' });
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
              {section === 'hero' ? 'Home' :
               section === 'clinicpulse' ? 'Clinic Pulse' :
               section.charAt(0).toUpperCase() + section.slice(1)}
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

      <ClinicPulseProject
        onReadMore={() => openModal('clinicpulse-description')}
        onOpenDemo={() => openModal('clinicpulse-demo')}
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
        title="Lux — Roblox AI Agent Demo"
      >
        <LuxDemo autoPlay={shouldAutoPlay} />
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
        title="LogiScan: AI Package Verification"
      >
        <LogiScanDemo autoPlay={shouldAutoPlay} />
      </Overlay>

      <Overlay
        isOpen={activeOverlay === 'clinicpulse-description'}
        onClose={closeModal}
        title="Clinic Pulse: Technical Deep Dive"
      >
        <ClinicPulseDescription onOpenDemo={() => {
          closeModal();
          setTimeout(() => openModal('clinicpulse-demo'), 100);
        }} />
      </Overlay>

      <Overlay
        isOpen={activeOverlay === 'clinicpulse-demo'}
        onClose={closeModal}
        title="Clinic Pulse: Pipeline Demo"
      >
        <ClinicPulseDemo autoPlay={shouldAutoPlay} />
      </Overlay>
    </main>
  );
}
