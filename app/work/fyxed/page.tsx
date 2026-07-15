import type { Metadata } from "next";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { ProjectPlayer } from "../../components/ProjectPlayer";
import { TrackPageView } from "../../components/TrackPageView";

export const metadata: Metadata = {
  title: "Fyxed: When Growth Reached the Repair Bill",
  description:
    "Sergey Kudelin's current Growth Engineer contract at Fyxed, covering the sourced GTM layer and a PM-branded repair workflow test.",
  alternates: { canonical: "/work/fyxed" },
};

export default function FyxedCase() {
  return (
    <>
      <TrackPageView pageType="case" caseId="fyxed" />
      <a className="skip-link" href="#main">
        Skip to the case study
      </a>
      <Header current="work" />

      <main className="case-file-page case-file-page-fyxed" id="main">
        <header className="case-file-cover shell">
          <div className="case-file-meta">
            <span>Case 02</span>
            <span>Fyxed</span>
            <span>Growth Engineer / Contract</span>
            <span>Jun 2026 to present</span>
          </div>
          <div className="case-file-title">
            <p className="studio-label">Current work / property-management fintech</p>
            <h1>Growth work got useful when it reached the repair bill.</h1>
          </div>
          <p className="case-file-deck">
            I build the source-backed GTM layer at Fyxed. The more interesting
            work starts when a real problem comes back through that layer. Repair
            funding kept recurring, so I turned the owner experience into a
            concrete product test.
          </p>
        </header>

        <section className="case-reel-wrap shell" aria-labelledby="fyxed-reel-title">
          <div className="case-reel-intro">
            <p className="studio-label">Guided case</p>
            <div>
              <h2 id="fyxed-reel-title">Five scenes. Current through July 2026.</h2>
              <p>
                The case stays honest about what exists today and what the test
                still has to prove.
              </p>
            </div>
          </div>
          <ProjectPlayer project="fyxed" />
        </section>

        <section className="working-file shell" aria-labelledby="working-file-title">
          <header className="working-file-head">
            <p className="studio-label">The working object</p>
            <div>
              <h2 id="working-file-title">A repair file with a real next action.</h2>
              <p>
                The reconstruction below uses a fictional company, property,
                amount, and address. It shows the interaction without exposing
                customer data or product terms.
              </p>
            </div>
          </header>

          <div className="repair-workbench" aria-label="Synthetic reconstruction of the Fyxed repair case workflow">
            <div className="repair-workbench-head">
              <div>
                <span className="studio-label">Case / Juniper House</span>
                <h3>Roof repair review</h3>
              </div>
              <span className="workbench-status">Prototype</span>
            </div>

            <div className="repair-workbench-grid">
              <section className="repair-workbench-document" aria-labelledby="document-title">
                <p className="studio-label">Supporting document</p>
                <div className="repair-document-card">
                  <span className="repair-document-type">PDF</span>
                  <div>
                    <h4 id="document-title">Vendor estimate</h4>
                    <p>Fictional amount / fictional vendor</p>
                  </div>
                  <span className="document-ready">Ready</span>
                </div>
                <dl className="case-facts">
                  <div><dt>Property</dt><dd>Juniper House</dd></div>
                  <div><dt>Owner status</dt><dd>Review requested</dd></div>
                  <div><dt>PM brand</dt><dd>Fictional</dd></div>
                  <div><dt>Decision</dt><dd>Manual</dd></div>
                </dl>
              </section>

              <section className="repair-workbench-flow" aria-labelledby="workflow-title">
                <p className="studio-label" id="workflow-title">Case path</p>
                <ol>
                  <li className="is-done"><span>01</span><div><strong>Repair captured</strong><p>The estimate and context stay together.</p></div></li>
                  <li className="is-done"><span>02</span><div><strong>Owner sees the choice</strong><p>The property manager remains the visible relationship.</p></div></li>
                  <li className="is-active"><span>03</span><div><strong>Information collected</strong><p>The case becomes complete enough for review.</p></div></li>
                  <li><span>04</span><div><strong>Manual decision</strong><p>The prototype makes no approval promise.</p></div></li>
                </ol>
              </section>
            </div>

            <p className="workbench-caption">
              Reconstruction based on an internal prototype. No customer,
              property, account, or underwriting data is shown.
            </p>
          </div>
        </section>

        <section className="case-close shell" aria-labelledby="fyxed-close-title">
          <p className="studio-label">Where it stands</p>
          <div>
            <h2 id="fyxed-close-title">The next proof has to come from the case.</h2>
            <p>
              The prototype exists, and the workflow is concrete enough to put
              in front of a property manager. Launch status, financing outcomes,
              and repeat use remain open.
            </p>
          </div>
        </section>

        <nav className="case-next-studio shell" aria-label="Previous case study">
          <span>Previous / flagship case</span>
          <a href="/work/futureclinic">FutureClinic / Creators ↗</a>
        </nav>
      </main>

      <Footer />
    </>
  );
}
