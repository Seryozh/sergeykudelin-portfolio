# LogiScan: AI-Powered Package Verification System

## What It Is

LogiScan is a mobile-first package auditing tool for hotel mailrooms. Staff take photos of shelves with their phones, and GPT-4o Vision automatically extracts unit codes and tracking numbers from package labels. The app matches scanned items against inventory in real-time, showing verified packages (green) and missing packages (red). A typical audit session covers 17 scans with 5-7 items per scan, replacing 20+ minutes of manual clipboard checking with 3-4 minutes of scanning.

The system runs as a Progressive Web App—no app store, no installation. Open the URL, add to home screen, and it works like a native app. All matching happens client-side for instant feedback (sub-10ms), even with spotty WiFi. The AI extraction runs server-side via Next.js Server Actions.

---

## Technical Challenges & How I Solved Them

### 1. Vision API Cost Optimization

**The problem:** iPhone photos are 12MP (4032×3024 pixels), which GPT-4o Vision processes as 42,837 tokens. At $2.50 per million input tokens, that's $0.107 per scan. For 17 scans per audit, that's $1.82 per session—unsustainable for a daily internal tool ($480/year).

**The solution:** Client-side image compression before upload. JavaScript loads the image onto HTML5 Canvas, resizes to 2500px width, exports as JPEG at 80% quality. This happens instantly in the browser before the image even leaves the device. No quality loss for label reading (validated with 100% extraction parity), but file size drops 95%.

**The result:** Token count reduced 87% (42,837 → 5,525 tokens). Cost per scan: $0.014. Annual savings: $418. Upload time also dropped from 16 seconds to 0.8 seconds on typical hotel WiFi.

### 2. Eliminating the N+1 Query Problem

**The problem:** Traditional server-side validation requires a database query for each scanned item. 17 scans × 5 items = 85 queries per audit session. Each query adds 50-200ms latency. Total wasted time: 4-12 seconds per audit, plus high database load.

**The solution:** Client-side architecture. On page load, fetch entire inventory once and store in React state (~100 packages, 8KB). When scan completes, match locally using JavaScript array search. No database queries during scanning. Matching happens in <1ms.

**The result:** Query reduction from 86 → 1 per audit (98.8% reduction). Instant visual feedback. Zero network dependency for matching. Database connection pool never exhausted even with concurrent users.

---

## Technical Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 19 + Next.js 15 |
| AI Vision | OpenAI GPT-4o Vision API |
| Image Processing | HTML5 Canvas API |
| Database | PostgreSQL (Supabase) |
| Deployment | Vercel |
| PWA | Service Workers + Web Manifest |

---

## Deep Dives Available

Want to see the engineering details? Full case studies with measured results:

### Cost Optimization
- **[87% Vision API Cost Reduction](MiniCaseStudies/Case1-Vision-API-Cost.md)** - Client-side compression, token economics, quality validation

### Infrastructure Piping
- **[Client-Side Architecture & N+1 Elimination](MiniCaseStudies/Case2-Client-Side-Architecture.md)** - Sub-1ms matching, 98.8% query reduction, algorithm complexity analysis

---

**Total Scans:** 400+ over 2 weeks of production testing.
**Average Audit Time:** 3-4 minutes (down from 20+ minutes manual)
**Cost per Audit:** $0.24 (down from $1.82 without optimization)
