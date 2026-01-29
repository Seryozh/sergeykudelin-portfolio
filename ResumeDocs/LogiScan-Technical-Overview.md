# LogiScan: AI-Powered Package Verification System - Technical Overview

## Project Summary

LogiScan is a mobile-first Progressive Web App (PWA) for hotel mailroom package auditing. Staff use their phones to photograph package shelves, and GPT-4o Vision automatically extracts unit codes and tracking numbers from package labels. The app matches scanned items against inventory in real-time, displaying verified packages (green) and missing packages (red). A typical audit session covers 17 scans with 5-7 items per scan, reducing audit time from 20+ minutes of manual clipboard checking to 3-4 minutes of scanning.

The system runs as a PWA with no app store installation required. All package matching happens client-side for instant feedback (sub-1ms), even with spotty WiFi. AI extraction runs server-side via Next.js Server Actions. The app has processed 400+ scans over 2 weeks of production testing.

## Core Architecture

**Frontend:** React 19 + Next.js 15
**AI Vision:** OpenAI GPT-4o Vision API
**Image Processing:** HTML5 Canvas API
**Database:** PostgreSQL (Supabase)
**Deployment:** Vercel
**PWA:** Service Workers + Web Manifest

The system emphasizes cost optimization and infrastructure piping to minimize AI costs and eliminate database bottlenecks.

## Technical Achievements

### Cost Optimization

**Vision API Token Reduction (87%)**
- Problem: iPhone photos are 12MP (4032×3024 pixels), which GPT-4o Vision processes as 42,837 tokens at $2.50 per million input tokens = $0.107 per scan; 17 scans per audit = $1.82 per session, unsustainable for daily internal tool ($480/year)
- Solution: Client-side image compression before upload using HTML5 Canvas to resize to 2500px width and export as JPEG at 80% quality; compression happens instantly in browser before image leaves device
- Validation: 100% extraction parity (no quality loss for label reading)
- Result: Token count reduced 87% (42,837 → 5,525 tokens), cost per scan drops to $0.014
- Annual savings: $418
- Secondary benefit: Upload time drops from 16 seconds to 0.8 seconds on hotel WiFi

### Infrastructure Piping

**Client-Side Architecture & N+1 Query Elimination (98.8% query reduction)**
- Problem: Traditional server-side validation requires database query for each scanned item; 17 scans × 5 items = 85 queries per audit session; each query adds 50-200ms latency = 4-12 seconds wasted time plus high database load
- Solution: Client-side architecture fetches entire inventory once on page load and stores in React state (~100 packages, 8KB); when scan completes, match locally using JavaScript array search (O(n) complexity, n=100)
- Result: Query reduction from 86 → 1 per audit (98.8% reduction), matching happens in <1ms, instant visual feedback, zero network dependency for matching
- Additional benefit: Database connection pool never exhausted even with concurrent users

## Production Metrics

- **Total Scans:** 400+ over 2 weeks of production testing
- **Average Audit Time:** 3-4 minutes (down from 20+ minutes manual)
- **Cost per Audit:** $0.24 (down from $1.82 without optimization)
- **Extraction Accuracy:** 100% parity between compressed and uncompressed images
- **Matching Latency:** <1ms client-side
- **Database Queries per Audit:** 1 (down from 86)

## Key Engineering Patterns Applied

1. **Client-Side Image Compression** - HTML5 Canvas API for pre-upload optimization
2. **Client-Side Data Architecture** - Eliminating N+1 query problem through local state
3. **Progressive Web App (PWA)** - No installation, works like native app
4. **Algorithm Complexity Analysis** - O(n) array search vs O(1) hash lookup trade-offs

## Resume-Relevant Highlights

- Reduced AI vision costs 87% through client-side image optimization while maintaining 100% accuracy
- Eliminated N+1 query problem (98.8% reduction) through client-side architecture design
- Built Progressive Web App with instant deployment, no app store friction
- Achieved sub-1ms matching latency through algorithmic optimization
- Saved $418/year in operational costs through intelligent compression
- Reduced audit time from 20+ minutes to 3-4 minutes (83% time savings)
