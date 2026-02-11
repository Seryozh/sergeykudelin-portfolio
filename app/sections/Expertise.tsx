'use client';

import { motion } from 'framer-motion';
import { Code2, Cpu, Layers, Database } from 'lucide-react';

/**
 * Expertise Section - Displays technical skills in categorized cards
 * Organized into: Languages, AI Engineering, Full-Stack, and Infrastructure
 */
export default function Expertise() {
  const skills = [
    {
      icon: Code2,
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      title: 'Programming Languages',
      description: 'TypeScript/JavaScript, Python, SQL, Lua',
    },
    {
      icon: Cpu,
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      title: 'AI & Agentic Engineering',
      description: 'LLM integration (OpenAI, Anthropic), RAG & vector databases, agentic frameworks, prompt engineering',
    },
    {
      icon: Layers,
      iconColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      title: 'Full-Stack & Systems Architecture',
      description: 'Next.js, React, Node.js, serverless functions, RESTful APIs, PostgreSQL, Supabase, state management (React Context, Zustand)',
    },
    {
      icon: Database,
      iconColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      title: 'Infrastructure & Professional Tools',
      description: 'Docker, CI/CD (GitHub Actions, Vercel), workflow automation (n8n, Zapier), Git, Postman, Figma',
    },
  ];

  return (
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
          {skills.map((skill, index) => (
            <div
              key={index}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:bg-slate-900/80 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`${skill.bgColor} p-1.5 rounded-lg`}>
                  <skill.icon className={`w-4 h-4 ${skill.iconColor}`} />
                </div>
                <h3 className="text-base font-bold text-white">{skill.title}</h3>
              </div>
              <p className="text-sm text-slate-300">{skill.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
