"use client";

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  clampSceneIndex,
  focusSceneElement,
  type SceneSurface,
} from "./playerNavigation";

export type ProjectPlayerProps = {
  project: "futureclinic" | "fyxed";
};

type Scene = {
  navLabel: string;
  kicker: string;
  title: string;
  summary: string;
  proof: string;
  boundary: string;
};

type Project = {
  title: string;
  role: string;
  scenes: readonly Scene[];
};

const projects: Record<ProjectPlayerProps["project"], Project> = {
  futureclinic: {
    title: "FutureClinic",
    role: "GTM Engineer / Contract / March to May 2026",
    scenes: [
      {
        navLabel: "Pre-hire proof",
        kicker: "Scene 01 / Before the role",
        title: "Build the proof before asking for the role.",
        summary:
          "I built Derm Hunter for FutureClinic during the hiring process. It turned a broad physician search into a system the team could inspect.",
        proof:
          "A documented system run found 245 creator channels and verified 68 physicians in 14 minutes.",
        boundary:
          "The measurement covers one documented system run. Business results remain unknown.",
      },
      {
        navLabel: "Creator context",
        kicker: "Scene 02 / Product judgment",
        title: "Creator experience shaped the product decision.",
        summary:
          "Years spent making videos gave me a practical filter for ideas a creator might actually record. That context became useful when the product had to preserve a doctor's voice.",
        proof:
          "The original product direction kept creative choices inside one working flow so the doctor could review each step.",
        boundary:
          "This scene explains the product judgment behind the build. Adoption remains outside this scene.",
      },
      {
        navLabel: "Creators build",
        kicker: "Scene 03 / Original implementation",
        title: "Turn the creator workflow into a working product.",
        summary:
          "I built the original end-to-end FutureClinic Creators implementation, including the backend and AI pipeline.",
        proof:
          "The implementation carried the doctor's context through the creative workflow and kept review inside the product.",
        boundary:
          "The claim covers the original end-to-end implementation. Later production lineage remains separate.",
      },
      {
        navLabel: "Acquisition workflow",
        kicker: "Scene 04 / Acquisition as product",
        title: "Give each physician something concrete to review.",
        summary:
          "The acquisition workflow paired a tailored clinic preview with a founder video made for that physician. Nikola prepared personalized Gmail drafts and stopped for human approval.",
        proof:
          "The workflow made the proposed clinic visible before outreach and kept every draft behind a human approval gate.",
        boundary:
          "The evidence supports the personalized workflow and its approval gate. Conversion remains unknown.",
      },
      {
        navLabel: "Evidence boundary",
        kicker: "Scene 05 / Where the proof ends",
        title: "Keep the public story inside the evidence.",
        summary:
          "FutureClinic Creators is live today. A public founder recommendation is available as supporting evidence for the original work.",
        proof:
          "The original implementation and current product continuity can both be shown.",
        boundary:
          "Current adoption and conversion remain unknown. Later code lineage is tracked separately.",
      },
    ],
  },
  fyxed: {
    title: "Fyxed",
    role: "Growth Engineer / Contract / June 2026 to present",
    scenes: [
      {
        navLabel: "Learn the workflow",
        kicker: "Scene 01 / Getting oriented",
        title: "Learn how the repair bill moves.",
        summary:
          "I joined Fyxed as a contract Growth Engineer while the team was still learning the property-management workflow. The first task was making that workflow legible enough to act on.",
        proof:
          "Growth Engineer at Fyxed. Contract. June 2026 to present.",
        boundary:
          "This scene establishes the role and workflow context. Business outcomes sit outside this scene.",
      },
      {
        navLabel: "Market layer",
        kicker: "Scene 02 / Source-backed research",
        title: "Tie each GTM decision to a source.",
        summary:
          "I built a source-backed GTM layer that connects public market signals to the relevant company and decision-maker records.",
        proof:
          "The system covers roughly 3,600 property-management firms and 5,200 contacts.",
        boundary:
          "The counts describe system coverage. Demand and revenue remain outside the measurement.",
      },
      {
        navLabel: "Repair signal",
        kicker: "Scene 03 / Repeated conversation",
        title: "Follow the repair signal back to the owner experience.",
        summary:
          "I saw repair funding recur in real conversations and reframed the owner experience around an existing repair bill.",
        proof:
          "The repeated signal gave the team a concrete workflow tied to a recurring problem.",
        boundary:
          "Repair financing existed before I joined. My work covers the owner experience and the test around it.",
      },
      {
        navLabel: "Product test",
        kicker: "Scene 04 / Make the choice concrete",
        title: "Build the smallest complete case flow.",
        summary:
          "I built a PM-branded flow for the test, covering the owner choice through intake and manual review.",
        proof:
          "The prototype keeps the repair context with the supporting document and gives the team a case it can review manually.",
        boundary:
          "The evidence covers a prototype and case workflow. Commercial and financing outcomes remain open.",
      },
      {
        navLabel: "Evidence boundary",
        kicker: "Scene 05 / Current work",
        title: "Show where the active test stands today.",
        summary:
          "The work is active. The evidence supports a current prototype and learning from a real repair workflow.",
        proof:
          "The case flow exists and can be reviewed as a working product test.",
        boundary:
          "Launch status remains open. Financing and broader market outcomes remain unclaimed.",
      },
    ],
  },
};

export function ProjectPlayer({ project }: ProjectPlayerProps) {
  const projectData = projects[project];
  const [activeIndex, setActiveIndex] = useState(0);
  const reactId = useId();
  const instanceId = `player-${project}-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const inlineSceneRef = useRef<HTMLElement>(null);
  const presentationSceneRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const activeScene = projectData.scenes[activeIndex];
  const sceneCount = projectData.scenes.length;

  function focusSelectedScene(surface: SceneSurface) {
    requestAnimationFrame(() => {
      const scene =
        surface === "presentation"
          ? presentationSceneRef.current
          : inlineSceneRef.current;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      focusSceneElement(scene, prefersReducedMotion);
    });
  }

  function selectScene(index: number, surface: SceneSurface) {
    setActiveIndex(clampSceneIndex(index, sceneCount));
    focusSelectedScene(surface);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

    const target = event.target as HTMLElement;
    if (target.matches("input, textarea, select, [contenteditable='true']")) return;

    let nextIndex: number | undefined;

    if (event.key === "ArrowLeft") nextIndex = activeIndex - 1;
    else if (event.key === "ArrowRight") nextIndex = activeIndex + 1;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = sceneCount - 1;

    if (nextIndex === undefined) return;

    event.preventDefault();
    const surface = dialogRef.current?.contains(target)
      ? "presentation"
      : "inline";
    selectScene(nextIndex, surface);
  }

  function openPresentation() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;

    returnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : openButtonRef.current;

    dialog.showModal();
    requestAnimationFrame(() => closeButtonRef.current?.focus());
  }

  function closePresentation() {
    dialogRef.current?.close();
  }

  function handleDialogClose() {
    const returnTarget = returnFocusRef.current;
    returnFocusRef.current = null;

    if (returnTarget?.isConnected) returnTarget.focus();
    else openButtonRef.current?.focus();
  }

  function renderArtifact(): ReactNode {
    if (project === "futureclinic") {
      if (activeIndex === 0) {
        return (
          <div className="player-visual player-visual-derm" role="img" aria-label="Derm Hunter documented run summary">
            <div className="player-visual-bar"><span>derm-hunter / run</span><span>public proof</span></div>
            <div className="player-terminal-line"><span>discover</span><strong>245 channels</strong></div>
            <div className="player-terminal-line"><span>verify</span><strong>68 physicians</strong></div>
            <div className="player-terminal-line"><span>runtime</span><strong>14 minutes</strong></div>
            <p className="player-terminal-note">Uncertain identity matches stay blank.</p>
          </div>
        );
      }

      if (activeIndex === 1) {
        return (
          <div className="player-visual player-visual-timeline" role="img" aria-label="Creator decision timeline">
            <div className="player-visual-bar"><span>creator context</span><span>working notes</span></div>
            <div className="player-track-row"><span>channel</span><i /><strong>existing voice</strong></div>
            <div className="player-track-row"><span>idea</span><i /><strong>worth recording?</strong></div>
            <div className="player-track-row"><span>draft</span><i /><strong>doctor review</strong></div>
            <div className="player-track-row"><span>output</span><i /><strong>ready to record</strong></div>
          </div>
        );
      }

      if (activeIndex === 2) {
        return (
          <div className="player-visual player-visual-creators" role="img" aria-label="FutureClinic Creators six-step workflow reconstruction">
            <div className="player-visual-bar"><span>FutureClinic Creators</span><span>reconstruction</span></div>
            <div className="player-creator-card">
              <p>Doctor channel loaded</p>
              <strong>Choose the next useful video.</strong>
            </div>
            <ol className="player-mini-pipeline">
              <li className="is-active"><span>01</span>Topics</li>
              <li><span>02</span>Titles</li>
              <li><span>03</span>Thumbnail</li>
              <li><span>04</span>Questions</li>
              <li><span>05</span>Script</li>
              <li><span>06</span>Export</li>
            </ol>
          </div>
        );
      }

      if (activeIndex === 3) {
        return (
          <div className="player-visual player-visual-approval" role="img" aria-label="Synthetic doctor preview and human approval reconstruction">
            <div className="player-preview-card">
              <span>Personal preview / synthetic</span>
              <strong>Dr. Lena, your clinic preview is ready.</strong>
              <i aria-hidden="true" />
            </div>
            <div className="player-approval-card">
              <span>Nikola / draft review</span>
              <strong>Research complete</strong>
              <p>Waiting for human approval</p>
              <span className="player-approval-action">Create Gmail draft</span>
            </div>
          </div>
        );
      }

      return (
        <div className="player-visual player-visual-ledger" role="img" aria-label="FutureClinic public evidence boundary">
          <div className="player-visual-bar"><span>public evidence</span><span>July 2026</span></div>
          <dl>
            <div><dt>Original implementation</dt><dd className="is-supported">Supported</dd></div>
            <div><dt>Live product continuity</dt><dd className="is-supported">Supported</dd></div>
            <div><dt>Current adoption</dt><dd>Unknown</dd></div>
            <div><dt>Later code lineage</dt><dd>Separate</dd></div>
          </dl>
        </div>
      );
    }

    if (activeIndex === 0) {
      return (
        <div className="player-visual player-visual-workflow" role="img" aria-label="Property-management repair workflow map">
          <div className="player-visual-bar"><span>repair workflow</span><span>orientation</span></div>
          <ol>
            <li><span>01</span>PM receives the repair</li>
            <li><span>02</span>Owner sees the bill</li>
            <li><span>03</span>Information stays with the case</li>
            <li><span>04</span>Team reviews it manually</li>
          </ol>
        </div>
      );
    }

    if (activeIndex === 1) {
      return (
        <div className="player-visual player-visual-market" role="img" aria-label="Aggregate Fyxed GTM system coverage">
          <div className="player-visual-bar"><span>source-backed market layer</span><span>aggregate</span></div>
          <div className="player-market-count"><strong>~3,600</strong><span>property-management firms</span></div>
          <div className="player-market-count"><strong>~5,200</strong><span>contacts across dated snapshots</span></div>
          <p>Each useful record keeps its source attached.</p>
        </div>
      );
    }

    if (activeIndex === 2) {
      return (
        <div className="player-visual player-visual-signals" role="img" aria-label="Composite visualization of recurring repair signals">
          <div className="player-visual-bar"><span>signal pattern</span><span>composite</span></div>
          <ol>
            <li><time>01</time><span>Owner</span><strong>The repair creates a funding gap.</strong></li>
            <li><time>02</time><span>Property manager</span><strong>The delay becomes their operating problem.</strong></li>
            <li><time>03</time><span>Recurring signal</span><strong>The existing bill makes the workflow concrete.</strong></li>
          </ol>
        </div>
      );
    }

    if (activeIndex === 3) {
      return (
        <div className="player-visual player-visual-repair" role="img" aria-label="Synthetic repair choice workflow">
          <div className="player-visual-bar"><span>Juniper House / fictional</span><span>prototype</span></div>
          <div className="player-repair-file"><span>PDF</span><strong>Vendor estimate</strong><i>ready</i></div>
          <ol>
            <li className="is-done"><span>01</span>Repair captured</li>
            <li className="is-active"><span>02</span>Owner choice</li>
            <li><span>03</span>Manual review</li>
          </ol>
        </div>
      );
    }

    return (
      <div className="player-visual player-visual-ledger" role="img" aria-label="Fyxed current evidence boundary">
        <div className="player-visual-bar"><span>current evidence</span><span>July 2026</span></div>
        <dl>
          <div><dt>Source-backed GTM layer</dt><dd className="is-supported">Live</dd></div>
          <div><dt>Owner workflow prototype</dt><dd className="is-supported">Built</dd></div>
          <div><dt>Launch status</dt><dd>Open</dd></div>
          <div><dt>Financing outcome</dt><dd>Unclaimed</dd></div>
        </dl>
      </div>
    );
  }

  function renderScene(surface: SceneSurface): ReactNode {
    const sceneTitleId = `${instanceId}-${surface}-scene-title`;

    return (
      <article
        className="player-scene"
        id={`${instanceId}-${surface}-scene`}
        ref={surface === "presentation" ? presentationSceneRef : inlineSceneRef}
        aria-labelledby={sceneTitleId}
        aria-live="polite"
        aria-atomic="true"
      >
        <header className="player-scene-header">
          <div className="player-scene-heading">
            <p className="player-kicker">{activeScene.kicker}</p>
            <h3
              className="player-scene-title"
              data-player-scene-title
              id={sceneTitleId}
              tabIndex={-1}
            >
              {activeScene.title}
            </h3>
          </div>
          <p
            className="player-progress"
            aria-label={`Scene ${activeIndex + 1} of ${sceneCount}`}
          >
            {String(activeIndex + 1).padStart(2, "0")} / {String(sceneCount).padStart(2, "0")}
          </p>
        </header>

        <div className="player-stage-grid">
          <div className="player-stage-copy">
            <p className="player-summary">{activeScene.summary}</p>

            <dl className="player-evidence">
              <div className="player-evidence-item">
                <dt className="player-evidence-label">Observed proof</dt>
                <dd className="player-evidence-copy">{activeScene.proof}</dd>
              </div>
              <div className="player-evidence-item">
                <dt className="player-evidence-label">Evidence boundary</dt>
                <dd className="player-evidence-copy">{activeScene.boundary}</dd>
              </div>
            </dl>
          </div>
          {renderArtifact()}
        </div>
      </article>
    );
  }

  function renderControls(surface: SceneSurface): ReactNode {
    return (
      <div className="player-controls" aria-label={`${projectData.title} scene controls`}>
        <button
          className="player-control player-control-previous"
          type="button"
          onClick={() => selectScene(activeIndex - 1, surface)}
          disabled={activeIndex === 0}
          aria-controls={`${instanceId}-${surface}-scene`}
        >
          Previous scene
        </button>
        <button
          className="player-control player-control-next"
          type="button"
          onClick={() => selectScene(activeIndex + 1, surface)}
          disabled={activeIndex === sceneCount - 1}
          aria-controls={`${instanceId}-${surface}-scene`}
        >
          Next scene
        </button>
      </div>
    );
  }

  function renderSceneNavigation(surface: SceneSurface): ReactNode {
    return (
      <nav className="player-scene-nav" aria-label={`${projectData.title} scenes`}>
        <ol className="player-scene-list">
          {projectData.scenes.map((scene, index) => (
            <li className="player-scene-list-item" key={scene.navLabel}>
              <button
                className="player-scene-button"
                type="button"
                onClick={() => selectScene(index, surface)}
                aria-current={index === activeIndex ? "step" : undefined}
                aria-controls={`${instanceId}-${surface}-scene`}
              >
                <span className="player-scene-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="player-scene-nav-label">{scene.navLabel}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  return (
    <section
      className={`player-root player-root-${project}`}
      aria-labelledby={`${instanceId}-title`}
      aria-keyshortcuts="ArrowLeft ArrowRight Home End"
      onKeyDown={handleKeyDown}
    >
      <header className="player-header">
        <div className="player-heading">
          <p className="player-label">Case reel</p>
          <h2 className="player-title" id={`${instanceId}-title`}>
            {projectData.title}
          </h2>
          <p className="player-role">{projectData.role}</p>
        </div>
        <button
          className="player-present-button"
          type="button"
          ref={openButtonRef}
          onClick={openPresentation}
          aria-haspopup="dialog"
        >
          Present this case
        </button>
      </header>

      <div className="player-inline">
        {renderScene("inline")}
        {renderControls("inline")}
        {renderSceneNavigation("inline")}
        <p className="player-keyboard-hint">
          Use the arrow keys to move between scenes. Home opens the first scene. End opens the last.
        </p>
      </div>

      <dialog
        className="player-dialog"
        ref={dialogRef}
        aria-labelledby={`${instanceId}-dialog-title`}
        aria-keyshortcuts="ArrowLeft ArrowRight Home End Escape"
        onClose={handleDialogClose}
      >
        <div className="player-dialog-shell">
          <header className="player-dialog-header">
            <div className="player-dialog-heading">
              <p className="player-label">Presentation mode</p>
              <h2 className="player-dialog-title" id={`${instanceId}-dialog-title`}>
                {projectData.title}
              </h2>
              <p className="player-role">{projectData.role}</p>
            </div>
            <button
              className="player-dialog-close"
              type="button"
              ref={closeButtonRef}
              onClick={closePresentation}
            >
              Close presentation
            </button>
          </header>

          <div className="player-dialog-content">
            {renderScene("presentation")}
            {renderControls("presentation")}
            {renderSceneNavigation("presentation")}
            <p className="player-keyboard-hint">
              Use the arrow keys to move between scenes. Press Escape to close presentation mode.
            </p>
          </div>
        </div>
      </dialog>
    </section>
  );
}
