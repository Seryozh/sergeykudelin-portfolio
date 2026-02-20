'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Overlay({ isOpen, onClose, title, children }: OverlayProps) {
  // Prevent scrolling when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Prevent bounce on iOS Safari
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = 'unset';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100]"
          />
          
          {/* Modal Container - Full screen on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 md:inset-4 lg:inset-6 xl:inset-10 bg-slate-900 border-0 md:border border-slate-800 rounded-none md:rounded-2xl z-[101] overflow-hidden flex flex-col shadow-2xl shadow-amber-500/5"
          >
            {/* Header - Touch-Friendly */}
            <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-3 border-b border-slate-800 bg-slate-900/50 flex-shrink-0">
              <h2 className="text-base md:text-lg font-bold text-white truncate pr-2">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close overlay"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content - Smooth Scrolling on iOS */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
