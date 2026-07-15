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
                Growth Engineer who turns market research and customer
                conversations into working product experiments. Currently
                contracting with Fyxed after building FutureClinic Creators and
                its physician-acquisition systems.
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
                  Build and operate a source-backed market intelligence system
                  that reads property-management websites for payment signals
                  and links each qualified account to a verified decision-maker.
                </li>
                <li>
                  Turn repeated repair-funding signals from customer calls into
                  a PM-branded owner workflow, including private intake and case
                  review for a live repair.
                </li>
                <li>
                  Build and run the data and orchestration behind Fyxed&apos;s
                  outbound motion, which produced the company&apos;s first
                  outbound-booked meeting and shifted warm outreach toward text
                  after email underperformed.
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
                  Built the first working version of FutureClinic Creators
                  myself, including its backend and AI pipeline, then worked
                  with another engineer to take it into production. It is live
                  today.
                </li>
                <li>
                  Built Doctor Preview Pages and the internal review and
                  publishing workflow behind them, giving each physician creator
                  a custom clinic page and founder video made specifically for
                  them.
                </li>
                <li>
                  Built Nikola, an AI outreach agent in Slack that researched
                  physician creators and created personalized Gmail drafts only
                  after human approval.
                </li>
              </ul>
            </article>
          </section>

          <section className="resume-section" aria-labelledby="skills-heading">
            <h2 id="skills-heading">Skills</h2>
            <div className="skills-lines">
              <p><strong>Engineering</strong> TypeScript, Python, SQL, React, Next.js, FastAPI, Postgres, Supabase, Redis</p>
              <p><strong>AI systems</strong> Claude Agent SDK, OpenRouter, tool calling, human approval, state machines, audit logs</p>
              <p><strong>Growth systems</strong> Market research, enrichment, source verification, CRM design, campaign orchestration</p>
              <p><strong>Creator systems</strong> Audience research, idea selection, scripting workflows, thumbnail direction, voice modeling</p>
            </div>
          </section>

          <section className="resume-section" aria-labelledby="creator-heading">
            <h2 id="creator-heading">Creator background</h2>
            <p className="resume-background">
              Built and ran a Roblox YouTube channel before entering startups.
              That work trained my instincts for audience research, idea
              selection, scripts, thumbnails, and keeping content specific to
              the creator.
            </p>
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
