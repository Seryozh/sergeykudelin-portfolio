import type { Metadata } from "next";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { TrackPageView } from "../components/TrackPageView";
import { TrackedLink } from "../components/TrackedLink";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Sergey Kudelin's resume: current Growth Engineer contract at Fyxed and GTM Engineering work at FutureClinic.",
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <>
      <TrackPageView pageType="resume" />
      <a className="skip-link" href="#main">Skip to the resume</a>
      <Header current="resume" />
      <main className="resume-page" id="main">
        <div className="resume-shell shell">
          <header className="resume-hero">
            <div>
              <p className="eyebrow"><span className="signal-dot" aria-hidden="true" />Growth Engineer / Miami</p>
              <h1>Sergey Kudelin</h1>
              <p className="resume-tagline">
                I build products and the GTM systems around them for early-stage
                teams. Currently contracting with Fyxed after working directly
                with FutureClinic&apos;s founder.
              </p>
            </div>
            <TrackedLink
              className="button button-dark resume-download"
              href="/sergey-kudelin-resume.pdf"
              eventName="resume_pdf_open"
              eventProperties={{ entry_surface: "resume_page" }}
            >
              Download PDF
            </TrackedLink>
          </header>

          <div className="resume-contact" aria-label="Contact details">
            <a href="mailto:kudelin.dev@gmail.com">kudelin.dev@gmail.com</a>
            <a href="https://sergeykudelin.com">sergeykudelin.com</a>
            <a href="https://www.linkedin.com/in/sergeykudelin">linkedin.com/in/sergeykudelin</a>
            <a href="https://github.com/Seryozh">github.com/Seryozh</a>
          </div>

          <section className="resume-section" aria-labelledby="experience-heading">
            <h2 id="experience-heading">Experience</h2>
            <article className="resume-role">
              <div className="resume-role-head">
                <h3>Growth Engineer / Fyxed</h3>
                <span className="resume-role-meta">Contract / Jun 2026 to present</span>
              </div>
              <p>Fintech for residential property managers.</p>
              <ul>
                <li>
                  Build a source-backed market intelligence system that reads
                  property-manager websites for payment signals and traces each
                  useful account to a verified decision-maker.
                </li>
                <li>
                  Turn repeated repair-funding signals from customer calls into
                  a PM-branded owner workflow, with the product surface and case
                  tooling needed to test the idea safely.
                </li>
                <li>
                  Built the operating layer behind Fyxed&apos;s early outbound
                  motion, which produced the company&apos;s first outbound-booked
                  meeting and moved warm outreach toward text after email
                  underperformed.
                </li>
              </ul>
            </article>

            <article className="resume-role">
              <div className="resume-role-head">
                <h3>GTM Engineer / FutureClinic, YC F24</h3>
                <span className="resume-role-meta">Contract / Mar to May 2026</span>
              </div>
              <p>Digital clinics and creator tools for physicians.</p>
              <ul>
                <li>
                  Built the first working version of FutureClinic Creators,
                  including the backend and AI pipeline, then worked with another
                  engineer to take it into production. The product is live today.
                </li>
                <li>
                  Built personalized Doctor Preview Pages and the internal review
                  and publishing workflow behind them, including individualized
                  founder-video generation for physician creators.
                </li>
                <li>
                  Built Nikola, a human-approved AI agent that researched doctors
                  and prepared personalized Gmail drafts while keeping every
                  outbound action behind review.
                </li>
              </ul>
            </article>
          </section>

          <section className="resume-section" aria-labelledby="skills-heading">
            <h2 id="skills-heading">Skills</h2>
            <div className="skills-lines">
              <p><strong>Engineering</strong> TypeScript, Python, SQL, React, Next.js, FastAPI, Postgres, Supabase, Redis</p>
              <p><strong>AI systems</strong> Claude Agent SDK, OpenRouter, tool calling, human approval, state machines, audit logs</p>
              <p><strong>Growth systems</strong> Enrichment, source verification, CRM design, campaign orchestration, deliverability</p>
            </div>
          </section>

          <section className="resume-section" aria-labelledby="education-heading">
            <h2 id="education-heading">Education</h2>
            <div className="resume-role-head">
              <h3>Computer Science / Florida International University</h3>
              <span className="resume-role-meta">Miami, FL</span>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
