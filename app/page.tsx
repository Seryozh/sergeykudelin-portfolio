import { ArtifactTabs } from "./components/ArtifactTabs";
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
      <main id="main">
        <section className="hero shell" aria-labelledby="home-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="signal-dot" aria-hidden="true" />
              Sergey Kudelin / Growth Engineer
            </p>
            <h1 id="home-title">I get close to the problem, then build.</h1>
            <p className="hero-lede">
              I work with early-stage teams when growth starts touching the
              product. Right now I am a contract Growth Engineer at Fyxed.
              Before that, I built creator and acquisition products with
              FutureClinic.
            </p>
            <div className="hero-actions" aria-label="Primary actions">
              <TrackedLink
                className="button button-dark"
                href="#work"
                eventName="case_view"
                eventProperties={{ case_id: "work_index", entry_surface: "hero" }}
              >
                See the work
              </TrackedLink>
              <TrackedLink
                className="text-link"
                href="/resume"
                eventName="resume_open"
                eventProperties={{ entry_surface: "hero" }}
              >
                Resume <span aria-hidden="true">↗</span>
              </TrackedLink>
            </div>
          </div>

          <aside className="hero-aside" aria-label="Current role and site context">
            <div className="current-role">
              <span className="aside-label">Current</span>
              <strong>Growth Engineer at Fyxed</strong>
              <span>Contract / Miami</span>
            </div>
            <p className="found-here">
              Most people find me on LinkedIn. This is the part with the work.
            </p>
            <TrackedLink
              className="quiet-link"
              href="/brief"
              eventName="brief_view"
              eventProperties={{ entry_surface: "hero" }}
            >
              Why the site works this way
            </TrackedLink>
          </aside>
        </section>

        <section className="case-section shell" id="work" aria-labelledby="futureclinic-title">
          <div className="section-intro">
            <p className="section-index">01 / FutureClinic</p>
            <div>
              <h2 id="futureclinic-title">
                A creator product, built close to the founder.
              </h2>
              <p>
                I built the first working version of FutureClinic Creators
                myself, including the backend and AI pipeline. Once it proved
                the idea, I worked with another engineer to take it into
                production. It is live today.
              </p>
              <TrackedLink
                className="case-link"
                href="/work/futureclinic"
                eventName="case_view"
                eventProperties={{ case_id: "futureclinic", entry_surface: "home" }}
              >
                How it came together <span aria-hidden="true">↗</span>
              </TrackedLink>
            </div>
          </div>
          <ArtifactTabs />
        </section>

        <section className="case-section fyxed-section shell" aria-labelledby="fyxed-title">
          <div className="section-intro">
            <p className="section-index">02 / Fyxed / Current</p>
            <div>
              <h2 id="fyxed-title">
                The interesting part started when repairs kept coming up.
              </h2>
              <p>
                I joined to work on growth. Customer calls kept pointing back
                to repair funding, so I turned that signal into a PM-branded
                owner workflow and built the version we could actually test.
              </p>
              <TrackedLink
                className="case-link"
                href="/work/fyxed"
                eventName="case_view"
                eventProperties={{ case_id: "fyxed", entry_surface: "home" }}
              >
                What I am working on now <span aria-hidden="true">↗</span>
              </TrackedLink>
            </div>
          </div>

          <div className="fyxed-artifact" aria-label="Synthetic reconstruction of the Fyxed repair workflow">
            <div className="artifact-topline">
              <span className="artifact-brand"><i aria-hidden="true" /> Repair review</span>
              <span className="artifact-status">Prototype</span>
            </div>
            <div className="repair-layout">
              <div className="repair-summary">
                <p className="artifact-kicker">Case file / Redwood Court</p>
                <h3>A repair needs a real next step.</h3>
                <p>
                  The property manager can collect the estimate, give the owner
                  a clear decision, and keep the case together for manual review.
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
              Synthetic reconstruction based on an internal prototype. No
              customer or property data is shown.
            </p>
          </div>
        </section>

        <section className="about-section shell" id="about" aria-labelledby="about-title">
          <div className="about-marker">
            <p className="section-index">A little context</p>
            <p className="about-location">Miami, FL</p>
          </div>
          <div className="about-copy">
            <h2 id="about-title">I started by making videos.</h2>
            <p>
              YouTube taught me how much tiny editorial decisions matter.
              Later I started building software because I wanted to test ideas
              without waiting for somebody else to make them real.
            </p>
            <p>
              That leaves me somewhere between growth and product. I am usually
              happiest while the brief is still moving and there is something
              concrete to put in front of people.
            </p>
          </div>
        </section>

        <section className="contact-section shell" id="contact" aria-labelledby="contact-title">
          <p className="section-index">Contact</p>
          <h2 id="contact-title">
            If the role needs someone who can learn the workflow and build the
            next test, email me.
          </h2>
          <div className="contact-actions">
            <TrackedLink
              className="button button-coral"
              href="mailto:kudelin.dev@gmail.com"
              eventName="contact_click"
              eventProperties={{ entry_surface: "home_footer" }}
            >
              kudelin.dev@gmail.com
            </TrackedLink>
            <TrackedLink
              className="text-link"
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
