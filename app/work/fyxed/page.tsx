import type { Metadata } from "next";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { TrackPageView } from "../../components/TrackPageView";
import { TrackedLink } from "../../components/TrackedLink";

export const metadata: Metadata = {
  title: "Fyxed: When GTM Reaches the Product",
  description:
    "Current contract work at Fyxed, where market signals became a PM-branded repair workflow and a concrete product test.",
  alternates: { canonical: "/work/fyxed" },
};

export default function FyxedCase() {
  return (
    <>
      <TrackPageView pageType="case" caseId="fyxed" />
      <a className="skip-link" href="#main">Skip to the case study</a>
      <Header current="work" />
      <main className="case-page" id="main">
        <header className="case-hero shell">
          <div className="case-meta">
            <span>Fyxed</span>
            <span>Growth Engineer / Contract</span>
            <span>June 2026 to present</span>
          </div>
          <h1>At Fyxed, growth keeps turning into product work.</h1>
          <p className="case-deck">
            I joined a fintech for property managers while the GTM motion was
            still being figured out. The job is current, and the useful part is
            getting close enough to the workflow to build the next real test.
          </p>
        </header>

        <div className="case-body shell">
          <section className="case-chapter" aria-labelledby="learn-title">
            <p className="case-overline">Getting oriented</p>
            <div className="case-chapter-content">
              <h2 id="learn-title">First, I had to make a niche market legible.</h2>
              <p>
                Property management has a lot of actors, financial constraints,
                and local rules. I built a source-backed market layer so every
                account and outreach decision stayed tied to evidence instead of
                a guess.
              </p>
              <p>
                That system reads public company sites for owner-payment signals
                and traces useful accounts to the person who actually owns the
                firm. It is the operating layer behind the GTM motion, and I am
                still building it.
              </p>
            </div>
          </section>

          <section className="case-chapter" aria-labelledby="signal-title">
            <p className="case-overline">The repeated signal</p>
            <div className="case-chapter-content">
              <h2 id="signal-title">Repairs kept showing up in the real conversations.</h2>
              <p>
                Different property managers kept describing the same event. A
                repair needed to happen, and the owner still had to decide how
                to cover it. That was sharper than another abstract financing
                message.
              </p>
              <p>
                I proposed a simple PM-branded owner workflow, then built the
                product surface and case tooling needed to test the framing. The
                founder approved the direction for testing.
              </p>
            </div>
          </section>

          <section className="case-chapter" aria-labelledby="artifact-title">
            <p className="case-overline">The product test</p>
            <div className="case-chapter-content">
              <h2 id="artifact-title">Make the next decision concrete.</h2>
              <p>
                The workflow collects the repair context and its supporting
                document, gives the owner a clear path inside the property
                manager&apos;s brand, and keeps the case together for manual review.
              </p>
            </div>
            <div className="case-artifact-wide fyxed-artifact" aria-label="Synthetic reconstruction of a repair review case">
              <div className="artifact-topline">
                <span className="artifact-brand"><i aria-hidden="true" /> Repair review</span>
                <span className="artifact-status">Current prototype</span>
              </div>
              <div className="repair-layout">
                <div className="repair-summary">
                  <p className="artifact-kicker">Case file / Redwood Court</p>
                  <h3>A repair needs a real next step.</h3>
                  <p>
                    The property manager can collect the estimate, give the
                    owner a clear decision, and keep the case together for
                    manual review.
                  </p>
                  <div className="document-row">
                    <span className="document-icon" aria-hidden="true">PDF</span>
                    <span><strong>Vendor estimate</strong><small>Attached to the private case</small></span>
                    <span className="check" aria-label="Complete">✓</span>
                  </div>
                </div>
                <ol className="repair-steps" aria-label="Repair workflow">
                  <li className="is-complete"><span>01</span><strong>Repair captured</strong><small>Estimate and context stay together.</small></li>
                  <li className="is-current"><span>02</span><strong>Owner decision</strong><small>A simple choice in the PM&apos;s brand.</small></li>
                  <li><span>03</span><strong>Manual review</strong><small>No approval is implied by the page.</small></li>
                </ol>
              </div>
              <p className="artifact-caption">
                Synthetic reconstruction based on an internal prototype. The
                company, property, and document are fictional.
              </p>
            </div>
          </section>

          <section className="case-chapter" aria-labelledby="fyxed-boundary-title">
            <p className="case-overline">Current boundary</p>
            <div className="case-chapter-content">
              <div className="proof-boundary">
                <p className="artifact-kicker">Where the work stands</p>
                <h3 id="fyxed-boundary-title">The workflow is real. The business result is still being tested.</h3>
                <p>
                  This is active contract work. A property manager brought the
                  team a live repair and asked for a concrete review. The
                  workflow has not produced a verified funded or repaid case, so
                  this page does not claim one.
                </p>
              </div>
            </div>
          </section>

          <nav className="case-next" aria-label="Next action">
            <span>See the compact version</span>
            <TrackedLink
              href="/resume"
              eventName="resume_open"
              eventProperties={{ entry_surface: "fyxed_case" }}
            >
              Open my resume ↗
            </TrackedLink>
          </nav>
        </div>
      </main>
      <Footer />
    </>
  );
}
