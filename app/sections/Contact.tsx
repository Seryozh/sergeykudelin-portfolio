'use client';

import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Youtube } from 'lucide-react';

interface ContactProps {
  emailCopied: boolean;
  onCopyEmail: () => void;
}

/**
 * Contact Section - Displays contact information and social links
 * Includes email copy functionality and links to GitHub, LinkedIn, YouTube
 */
export default function Contact({ emailCopied, onCopyEmail }: ContactProps) {
  return (
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
          I'm currently available for full-time roles and high-impact contract projects.
        </p>

        {/* What I'm looking for */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">What I'm looking for:</h3>
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
            onClick={onCopyEmail}
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
            href="https://www.youtube.com/@SergeCode"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl hover:border-amber-500/50 hover:bg-slate-800 transition-all duration-300 group"
          >
            <Youtube className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
            <span className="text-slate-300 group-hover:text-white text-sm font-medium transition-colors">@SergeCode</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
