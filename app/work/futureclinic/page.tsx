import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { ProjectPlayer } from "../../components/ProjectPlayer";
import { TrackPageView } from "../../components/TrackPageView";
import { TrackedLink } from "../../components/TrackedLink";

export const metadata: Metadata = {
  title: "FutureClinic: Building Before the Role",
  description:
    "How Sergey Kudelin built proof for FutureClinic, then built the original FutureClinic Creators implementation and its acquisition systems.",
  alternates: { canonical: "/work/futureclinic" },
};

export default function FutureClinicCase() {
  return (
    <>
      <TrackPageView pageType="case" caseId="futureclinic" />
      <a className="skip-link" href="#main">
        Skip to the case study
      </a>
      <Header current="work" />

      <main className="case-file-page" id="main">
        <header className="case-file-cover shell">
          <div className="case-file-meta">
            <span>Case 01</span>
            <span>FutureClinic / YC F24</span>
            <span>GTM Engineer / Contract</span>
            <span>Mar to May 2026</span>
          </div>
          <div className="case-file-title">
            <p className="studio-label">Product and acquisition systems</p>
            <h1>The proof I built before the role became a much larger product.</h1>
          </div>
          <p className="case-file-deck">
            I started with a physician-discovery system built for the hiring
            process. Inside the company, my creator background became useful
            product context. I built the original end-to-end FutureClinic
            Creators implementation and the acquisition workflow around it.
          </p>
        </header>

        <section className="case-reel-wrap shell" aria-labelledby="futureclinic-reel-title">
          <div className="case-reel-intro">
            <p className="studio-label">Guided case</p>
            <div>
              <h2 id="futureclinic-reel-title">Five scenes. About four minutes.</h2>
              <p>
                Use the inline controls, or open presentation mode for a clean
                interview walkthrough.
              </p>
            </div>
          </div>
          <ProjectPlayer project="futureclinic" />
        </section>

        <section className="proof-shelf shell" aria-labelledby="proof-shelf-title">
          <header className="proof-shelf-head">
            <p className="studio-label">Public proof</p>
            <h2 id="proof-shelf-title">The sources you can open yourself.</h2>
          </header>

          <div className="proof-shelf-grid">
            <article className="proof-card proof-card-featured">
              <p className="proof-card-index">01 / Pre-hire build</p>
              <h3>Derm Hunter</h3>
              <p>
                A public physician-creator discovery pipeline. Its documented
                run found 245 creator channels and verified 68 physicians in 14
                minutes.
              </p>
              <p className="proof-card-boundary">
                One system run. It measures system behavior only. Customer
                outcomes remain unknown.
              </p>
              <TrackedLink
                className="studio-link studio-link-dark"
                href="https://github.com/Seryozh/derm-hunter"
                eventName="proof_open"
                eventProperties={{
                  case_id: "futureclinic",
                  proof_id: "derm_hunter",
                  destination_type: "github",
                }}
              >
                Open the repository <span aria-hidden="true">↗</span>
              </TrackedLink>
            </article>

            <article className="proof-card">
              <p className="proof-card-index">02 / Product continuity</p>
              <h3>FutureClinic Creators is live.</h3>
              <p>
                The current product confirms that the product line exists
                today. Current adoption and later code lineage require separate
                evidence.
              </p>
              <TrackedLink
                className="studio-link studio-link-dark"
                href="https://www.futurecliniccreators.com/login"
                eventName="proof_open"
                eventProperties={{
                  case_id: "futureclinic",
                  proof_id: "creators_live",
                  destination_type: "product",
                }}
              >
                Open the live product <span aria-hidden="true">↗</span>
              </TrackedLink>
            </article>

            <article className="proof-card proof-card-quote">
              <p className="proof-card-index">03 / Founder reference</p>
              <blockquote>
                <p>“Phenomenal work.”</p>
                <cite>Dr. Usama Syed, FutureClinic founder</cite>
              </blockquote>
              <TrackedLink
                className="studio-link studio-link-dark"
                href="/futureclinic-recommendation.pdf"
                eventName="proof_open"
                eventProperties={{
                  case_id: "futureclinic",
                  proof_id: "founder_recommendation",
                  destination_type: "pdf",
                }}
              >
                Read the recommendation <span aria-hidden="true">↗</span>
              </TrackedLink>
            </article>
          </div>
        </section>

        <section className="case-close shell" aria-labelledby="futureclinic-close-title">
          <p className="studio-label">What this case shows</p>
          <div>
            <h2 id="futureclinic-close-title">
              I can use context outside the job description to make the product
              better.
            </h2>
            <p>
              The useful part was knowing which creative decisions had to stay
              visible to the doctor, then building the system around those
              decisions.
            </p>
          </div>
        </section>

        <nav className="case-next-studio shell" aria-label="Next case study">
          <span>Next / current work</span>
          <Link href="/work/fyxed">Fyxed / Repair workflow ↗</Link>
        </nav>
      </main>

      <Footer />
    </>
  );
}
