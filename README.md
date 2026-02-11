# Sergey Kudelin Portfolio

A modern, responsive portfolio website showcasing full-stack engineering projects with a focus on AI systems and production-grade applications.

**Live Site:** [sergeykudelin.com](https://sergeykudelin.com)

---

## Overview

This portfolio is built with Next.js 16, TypeScript, and Tailwind CSS. It features:

- **Immersive full-page scrolling** with snap points for each section
- **Interactive project showcases** with detailed descriptions and live demos
- **Animated terminal introduction** that expands on load
- **Project detail overlays** for deep-dives into Lux and LogiScan
- **Responsive design** optimized for all screen sizes
- **Smooth animations** powered by Framer Motion

## Featured Projects

### Lux
Agentic AI system for natural language game development. Built a bidirectional protocol layer that enables LLMs to read and modify game state in real-time. Deployed in production with 1,500+ active installations.

### LogiScan
AI vision system for automated package reconciliation. Computer vision + agentic AI reads shipping labels and matches them against manifests in seconds, reducing manual sorting from ~60 minutes to under 15 minutes per batch.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 16 (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Analytics:** [Vercel Analytics](https://vercel.com/analytics) & [Speed Insights](https://vercel.com/speed-insights)

## Project Structure

```
app/
├── sections/              # Page sections
│   ├── Hero.tsx           # Hero/intro with terminal
│   ├── LuxProject.tsx     # Lux project showcase
│   ├── LogiScanProject.tsx # LogiScan project showcase
│   ├── Expertise.tsx      # Skills & expertise
│   └── Contact.tsx        # Contact section
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Overlay.tsx    # Modal overlay component
│   │   └── TerminalIntro.tsx # Animated terminal
│   └── projects/          # Project-specific components
│       ├── LuxDescription.tsx
│       ├── LuxDemo.tsx
│       ├── LuxLaptopAnimation.tsx
│       ├── LogiScanDescription.tsx
│       └── LogiScanDemo.tsx
├── globals.css
├── layout.tsx
└── page.tsx               # Main entry point
```

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Seryozh/sergeykudelin-portfolio.git

# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```

## Deployment

The site is configured for deployment on Vercel with optimized build settings and security headers.

## Contact

- **Email:** sergey@sergeykudelin.com
- **LinkedIn:** [linkedin.com/in/sergeykudelin](https://linkedin.com/in/sergeykudelin)
- **GitHub:** [github.com/Seryozh](https://github.com/Seryozh)

---

Built with passion in Miami 🌴
