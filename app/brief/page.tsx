import type { Metadata } from "next";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { TrackPageView } from "../components/TrackPageView";
import { TrackedLink } from "../components/TrackedLink";

export const metadata: Metadata = {
  title: "Why This Site Exists",
  description:
    "How Sergey Kudelin is treating LinkedIn and this portfolio as a small, measurable GTM system.",
  alternates: { canonical: "/brief" },
};

export default function BriefPage() {
  return (
    <>
      <TrackPageView pageType="brief" />
      <a className="skip-link" href="#main">Skip to the brief</a>
      <Header current="brief" />
      <main className="brief-page" id="main">
        <header className="brief-hero shell">
          <p className="eyebrow"><span className="signal-dot" aria-hidden="true" />A small GTM experiment</p>
          <h1>This site is part of the work.</h1>
          <p className="brief-deck">
            LinkedIn already led one recruiter to my profile before I had a
            meaningful audience. That is useful, but it is still one signal.
            This site is how I turn curiosity into something a person can check.
          </p>
          <div className="brief-grid" aria-label="LinkedIn to conversation loop">
            <div className="brief-step"><span>01</span><h2>Useful idea</h2><p>A post starts with work I can actually explain.</p></div>
            <div className="brief-step"><span>02</span><h2>Specific page</h2><p>The link lands on the case behind that idea.</p></div>
            <div className="brief-step"><span>03</span><h2>Visible proof</h2><p>The artifact answers what I personally built.</p></div>
            <div className="brief-step"><span>04</span><h2>Real conversation</h2><p>The right person has enough context to reach out.</p></div>
          </div>
        </header>

        <section className="brief-block shell" aria-labelledby="measurement-title">
          <p className="section-index">What counts</p>
          <div>
            <h2 id="measurement-title">I care about depth and the conversation after it.</h2>
            <p>
              A profile view is only the start. The useful question is whether
              the right person opens a case, looks at the proof, and wants to
              talk about the work.
            </p>
            <ul className="measurement-list">
              <li><strong>Source</strong><span>Profile, post, direct, or referral</span></li>
              <li><strong>Case depth</strong><span>Which work page they chose</span></li>
              <li><strong>Intent</strong><span>Resume and email actions</span></li>
              <li><strong>Outcome</strong><span>A qualified conversation, tracked privately</span></li>
            </ul>
          </div>
        </section>

        <section className="brief-block shell" aria-labelledby="current-test-title">
          <p className="section-index">Current test</p>
          <div>
            <h2 id="current-test-title">The portfolio should make one claim easier to believe.</h2>
            <p>
              I can enter an unfamiliar workflow, find the part that still does
              not make sense, and build the next useful test. FutureClinic shows
              the product depth. Fyxed shows the pattern continuing in my current
              role.
            </p>
            <div className="source-row">
              <TrackedLink
                href="/work/futureclinic"
                eventName="case_view"
                eventProperties={{ case_id: "futureclinic", entry_surface: "brief" }}
              >
                Start with FutureClinic ↗
              </TrackedLink>
              <TrackedLink
                href="/work/fyxed"
                eventName="case_view"
                eventProperties={{ case_id: "fyxed", entry_surface: "brief" }}
              >
                See the current Fyxed work ↗
              </TrackedLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
