import type { Metadata } from "next";
import Link from "next/link";
import { ArtifactTabs } from "../../components/ArtifactTabs";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { TrackPageView } from "../../components/TrackPageView";
import { TrackedLink } from "../../components/TrackedLink";

export const metadata: Metadata = {
  title: "FutureClinic Creators: Building the Proof Before the Job",
  description:
    "How Sergey Kudelin built FutureClinic Creators, personalized doctor previews, and a human-approved outreach agent.",
  alternates: { canonical: "/work/futureclinic" },
};

export default function FutureClinicCase() {
  return (
    <>
      <TrackPageView pageType="case" caseId="futureclinic" />
      <a className="skip-link" href="#main">Skip to the case study</a>
      <Header current="work" />
      <main className="case-page" id="main">
        <header className="case-hero shell">
          <div className="case-meta">
            <span>FutureClinic</span>
            <span>GTM Engineer / Contract</span>
            <span>March to May 2026</span>
          </div>
          <h1>I had spent years making videos. Here, that context became a product.</h1>
          <p className="case-deck">
            FutureClinic was building digital clinics for doctors. I worked
            closely with the founder and built the creator product, plus the
            acquisition systems around it.
          </p>
        </header>

        <div className="case-body shell">
          <section className="case-chapter" aria-labelledby="proof-title">
            <p className="case-overline">Before the role</p>
            <div className="case-chapter-content">
              <h2 id="proof-title">I built the proof before I had the job.</h2>
              <p>
                Derm Hunter found physician-creators on YouTube, checked their
                identity against the federal NPI Registry, and kept uncertain
                matches out. I built it specifically for FutureClinic during the
                hiring process.
              </p>
              <p>
                The repository and working demo made the conversation concrete.
                That proof helped create the opportunity to work with the team.
              </p>
              <div className="source-row">
                <TrackedLink
                  href="https://github.com/Seryozh/derm-hunter"
                  eventName="proof_open"
                  eventProperties={{ case_id: "futureclinic", proof_id: "derm_hunter", destination_type: "github" }}
                >
                  Derm Hunter on GitHub ↗
                </TrackedLink>
                <TrackedLink
                  href="https://futureclinic-growth.vercel.app"
                  eventName="proof_open"
                  eventProperties={{ case_id: "futureclinic", proof_id: "derm_hunter_demo", destination_type: "demo" }}
                >
                  Open the public demo ↗
                </TrackedLink>
              </div>
            </div>
          </section>

          <section className="case-chapter" aria-labelledby="creators-title">
            <p className="case-overline">The flagship build</p>
            <div className="case-chapter-content">
              <h2 id="creators-title">FutureClinic Creators</h2>
              <p>
                I understood the difference between content that is technically
                correct and content a creator would actually record. The product
                started with a doctor&apos;s existing channel and carried their
                voice through topics, scripts, and thumbnail direction.
              </p>
              <p>
                I built the first working version myself, including the backend
                and AI pipeline. After it proved the idea, I worked with another
                engineer to take it into production. The product is live today.
              </p>
            </div>
            <div className="case-artifact-wide">
              <ArtifactTabs />
            </div>
          </section>

          <section className="case-chapter" aria-labelledby="preview-title">
            <p className="case-overline">Acquisition as product</p>
            <div className="case-chapter-content">
              <h2 id="preview-title">The pitch became something each doctor could see.</h2>
              <p>
                A generic message did not show a physician what FutureClinic
                would look like for them. I built Doctor Preview Pages so each
                doctor received a custom clinic page and a personalized founder
                video. The internal review and publishing flow sat behind it.
              </p>
              <p>
                I kept the same rule in the outreach system. Nikola handled the
                repetitive research and prepared Gmail drafts, then stopped for
                human approval. It never sent on its own in the version I handed
                off.
              </p>
            </div>
          </section>

          <section className="case-chapter" aria-labelledby="boundary-title">
            <p className="case-overline">Proof boundary</p>
            <div className="case-chapter-content">
              <div className="proof-boundary">
                <p className="artifact-kicker">What the evidence supports</p>
                <h3 id="boundary-title">A real first implementation, a live product, and a clean handoff.</h3>
                <p>
                  The first complete Creators implementation is backed by my
                  repository history. The current product is publicly live.
                  Adoption and conversion were not documented cleanly enough
                  for this site, so I leave them out.
                </p>
              </div>
              <blockquote className="founder-quote">
                <p>
                  “Phenomenal work, the kind of product I was genuinely excited
                  to use myself.”
                </p>
                <cite>Dr. Usama Syed, founder of FutureClinic</cite>
              </blockquote>
              <div className="source-row">
                <TrackedLink
                  href="https://www.futurecliniccreators.com/login"
                  eventName="proof_open"
                  eventProperties={{ case_id: "futureclinic", proof_id: "creators_live", destination_type: "product" }}
                >
                  FutureClinic Creators ↗
                </TrackedLink>
                <TrackedLink
                  href="/futureclinic-recommendation.pdf"
                  eventName="proof_open"
                  eventProperties={{ case_id: "futureclinic", proof_id: "founder_recommendation", destination_type: "pdf" }}
                >
                  Read the recommendation ↗
                </TrackedLink>
              </div>
            </div>
          </section>

          <nav className="case-next" aria-label="Next case study">
            <span>Next / current work</span>
            <Link href="/work/fyxed">Fyxed: when GTM reaches the product ↗</Link>
          </nav>
        </div>
      </main>
      <Footer />
    </>
  );
}
