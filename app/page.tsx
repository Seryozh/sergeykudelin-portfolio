import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { PersonJsonLd } from "./components/PersonJsonLd";
import { TrackPageView } from "./components/TrackPageView";
import { TrackedLink } from "./components/TrackedLink";

export default function Home() {
  return (
    <>
      <PersonJsonLd />
      <TrackPageView pageType="portfolio" />
      <a className="skip-link" href="#main">
        Skip to the work
      </a>
      <Header />

      <main id="main" className="portfolio-main">
        <section className="cover shell" aria-labelledby="home-title">
          <div className="cover-ledger" aria-label="Current role">
            <span>Sergey Kudelin</span>
            <span>Growth Engineer</span>
            <span>Miami</span>
            <span className="cover-current">Current: Fyxed / Contract</span>
          </div>

          <div className="cover-copy">
            <p className="studio-label">Portfolio / 2026</p>
            <h1 id="home-title">
              I built for FutureClinic before I worked there.
            </h1>
            <p className="cover-deck">
              That is still how I work. I get close enough to the workflow to
              build the missing part.
            </p>
          </div>

          <div className="cover-actions" aria-label="Primary actions">
            <TrackedLink
              className="studio-link studio-link-primary"
              href="/work/futureclinic"
              eventName="case_view"
              eventProperties={{ case_id: "futureclinic", entry_surface: "hero" }}
            >
              Open the FutureClinic case <span aria-hidden="true">↗</span>
            </TrackedLink>
            <TrackedLink
              className="studio-link"
              href="/resume"
              eventName="resume_open"
              eventProperties={{ entry_surface: "hero" }}
            >
              Read the resume <span aria-hidden="true">↗</span>
            </TrackedLink>
          </div>

          <div className="cover-note">
            <span className="studio-label">What is here</span>
            <p>
              Two case files. Each one can open as a presentation when you want
              the short version.
            </p>
          </div>
        </section>

        <section className="work-index shell" id="work" aria-labelledby="work-title">
          <header className="work-index-head">
            <p className="studio-label">Selected work</p>
            <h2 id="work-title">The work, in the order I would present it.</h2>
          </header>

          <article className="work-file work-file-futureclinic">
            <div className="work-file-copy">
              <div className="work-file-meta">
                <span>Case 01</span>
                <span>FutureClinic / YC F24</span>
                <span>Mar to May 2026</span>
              </div>
              <p className="work-file-status">GTM Engineer / Contract</p>
              <h3>Creator context became product context.</h3>
              <p>
                I spent years making videos. At FutureClinic, that experience
                shaped an AI product for doctor-creators. I built the original
                end-to-end implementation, including its backend and AI
                pipeline.
              </p>
              <TrackedLink
                className="studio-link studio-link-dark"
                href="/work/futureclinic"
                eventName="case_view"
                eventProperties={{ case_id: "futureclinic", entry_surface: "home" }}
              >
                Run the case <span aria-hidden="true">↗</span>
              </TrackedLink>
            </div>

            <div className="work-file-artifact creator-poster" aria-label="Reconstruction of the FutureClinic Creators workflow">
              <div className="poster-topline">
                <span>FutureClinic Creators</span>
                <span>Original build / reconstruction</span>
              </div>
              <div className="creator-poster-body">
                <p className="studio-label">A doctor&apos;s channel enters here</p>
                <h4>One working context for the whole video.</h4>
                <ol className="creator-pipeline">
                  <li><span>01</span>Profile</li>
                  <li><span>02</span>Topics</li>
                  <li><span>03</span>Title</li>
                  <li><span>04</span>Thumbnail</li>
                  <li><span>05</span>Script</li>
                  <li><span>06</span>Export</li>
                </ol>
              </div>
              <p className="poster-caption">
                Reconstruction of the original workflow. No private product
                data is shown.
              </p>
            </div>
          </article>

          <article className="work-file work-file-fyxed">
            <div className="work-file-copy">
              <div className="work-file-meta">
                <span>Case 02</span>
                <span>Fyxed</span>
                <span>Jun 2026 to present</span>
              </div>
              <p className="work-file-status">Growth Engineer / Contract</p>
              <h3>Repair funding kept coming up.</h3>
              <p>
                I joined to work on growth. Real conversations kept returning
                to the same repair bill, so I reframed the owner experience
                around that document and built the product test around it.
              </p>
              <TrackedLink
                className="studio-link studio-link-dark"
                href="/work/fyxed"
                eventName="case_view"
                eventProperties={{ case_id: "fyxed", entry_surface: "home" }}
              >
                Open the current work <span aria-hidden="true">↗</span>
              </TrackedLink>
            </div>

            <div className="work-file-artifact repair-poster" aria-label="Synthetic reconstruction of the Fyxed repair workflow">
              <div className="poster-topline">
                <span>Repair file / Juniper House</span>
                <span>Prototype reconstruction</span>
              </div>
              <div className="repair-poster-body">
                <div className="repair-document">
                  <span className="repair-document-type">PDF</span>
                  <div>
                    <p>Vendor estimate</p>
                    <span>Fictional property / fictional amount</span>
                  </div>
                </div>
                <ol className="repair-flow">
                  <li className="is-done"><span>01</span>Repair captured</li>
                  <li className="is-active"><span>02</span>Owner choice</li>
                  <li><span>03</span>Manual review</li>
                </ol>
              </div>
              <p className="poster-caption">
                Reconstruction based on an internal prototype. No customer data
                is shown.
              </p>
            </div>
          </article>
        </section>

        <section className="origin shell" id="about" aria-labelledby="origin-title">
          <div className="origin-index">
            <p className="studio-label">Before startups</p>
            <span>Roblox / YouTube</span>
          </div>
          <div className="origin-copy">
            <h2 id="origin-title">I started by making videos.</h2>
            <p>
              I grew a Roblox YouTube channel to 200,000 subscribers. It taught
              me to notice what people choose and where a story loses them.
              That same judgment now shows up in the products I build.
            </p>
          </div>
          <div className="origin-note">
            <span className="studio-label">The through line</span>
            <p>
              Make something specific, then watch what happens. Change the work
              when the evidence changes.
            </p>
          </div>
        </section>

        <section className="contact-studio shell" id="contact" aria-labelledby="contact-title">
          <p className="studio-label">Contact</p>
          <h2 id="contact-title">The shortest way to reach me is email.</h2>
          <div className="contact-studio-links">
            <TrackedLink
              className="contact-email"
              href="mailto:sergey@sergeykudelin.com"
              eventName="contact_click"
              eventProperties={{ entry_surface: "home_footer" }}
            >
              sergey@sergeykudelin.com <span aria-hidden="true">↗</span>
            </TrackedLink>
            <TrackedLink
              className="studio-link studio-link-light"
              href="https://www.linkedin.com/in/sergeykudelin"
              eventName="external_profile_open"
              eventProperties={{ profile_id: "linkedin", entry_surface: "home_footer" }}
            >
              LinkedIn <span aria-hidden="true">↗</span>
            </TrackedLink>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
