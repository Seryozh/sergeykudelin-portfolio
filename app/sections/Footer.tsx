'use client';

import { motion } from 'framer-motion';

/**
 * Footer Section - Displays the tech stack used to build the portfolio
 * Shows frameworks and tools in a grid layout
 */
export default function Footer() {
  const techStack = [
    {
      category: 'Frontend',
      tools: 'React 19, Next.js 15',
    },
    {
      category: 'Styling',
      tools: 'Tailwind CSS',
    },
    {
      category: 'Animation',
      tools: 'Framer Motion',
    },
    {
      category: 'Icons',
      tools: 'Lucide React',
    },
  ];

  return (
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
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="bg-slate-900/40 border border-slate-800 rounded-lg p-4 hover:bg-slate-900/60 transition-colors"
              >
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{tech.category}</p>
                <p className="text-sm text-slate-200 font-medium">{tech.tools}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            Designed for performance. Built with modern web technologies. Deployed on Vercel.
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
