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
                I build working systems around market evidence. I joined
                FutureClinic after building a physician-discovery engine for
                the company before I had the job, then built the original
                FutureClinic Creators implementation. Now I am the Growth
                Engineer at Fyxed, where I build the data and product workflows
                behind GTM.
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
            <a href="mailto:sergey@sergeykudelin.com">sergey@sergeykudelin.com</a>
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
                  Built and now operate Fyxed&apos;s source-backed GTM data engine
                  across roughly 3,600 property-management companies and 5,200
                  contacts, linking payment signals to verified decision-makers.
                </li>
                <li>
                  Turned repeated repair-funding signals from customer calls
                  into a PM-branded owner payment choice, then built the private
                  intake and case-review workflow for the product test.
                </li>
                <li>
                  Built and now run Fyxed&apos;s outbound system, including CRM
                  architecture, enrichment, sequencing, and channel testing.
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
                  Built the original end-to-end FutureClinic Creators
                  implementation, including its backend and AI pipeline. The
                  product is live today.
                </li>
                <li>
                  Built Derm Hunter as proof of work before joining
                  FutureClinic. A documented run discovered 245 YouTube
                  channels and verified 68 physicians against NPI data in 14
                  minutes.
                </li>
                <li>
                  Built a personalized physician-acquisition workflow that
                  generated a custom clinic preview and founder video for each
                  prospect. Nikola handled prospect research in Slack and
                  created Gmail drafts only after human approval.
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

          <section className="resume-section" aria-labelledby="misc-heading">
            <h2 id="misc-heading">Misc facts about me</h2>
            <div className="skills-lines">
              <p><strong>Creator</strong> Grew a Roblox YouTube channel to 200,000 subscribers.</p>
              <p>
                <strong>AI systems</strong> I have a deep practical understanding
                of orchestrating AI systems around real tasks and finding where
                they remove the most manual work. Recently, I turned a
                broken-screen MacBook into a remote agent host over SSH.
              </p>
            </div>
          </section>

          <section className="resume-section" aria-labelledby="education-heading">
            <h2 id="education-heading">Education</h2>
            <article className="resume-role">
              <div className="resume-role-head">
                <h3>University of Florida</h3>
                <span className="resume-role-meta">2024-2025</span>
              </div>
              <p>Computer Science</p>
            </article>
            <article className="resume-role">
              <div className="resume-role-head">
                <h3>Florida International University</h3>
                <span className="resume-role-meta">2022-2023</span>
              </div>
              <p>Computer Science</p>
            </article>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
