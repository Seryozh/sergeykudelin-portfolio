"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import motionSystem from "@/design-system/motion.json";

type TraceKind = "signal" | "decision" | "artifact" | "proof" | "unknown";

type Source = {
  evidenceId: string;
  staticId: string;
  title: string;
  meta: string;
  quote: string;
  note: string;
  state: string;
  proofStatus: string;
};

type TraceStep = {
  id: string;
  number: string;
  kind: TraceKind;
  label: string;
  date: string;
  title: string;
  body: string;
  claim: {
    status: "verified" | "supported" | "internal" | "unproven";
    evidenceIds: string[];
    publicSafe: boolean;
  };
  source?: Source;
};

type DecisionDiffContent = {
  inheritedLabel: string;
  inheritedTitle: string;
  inheritedBody: string;
  reframedLabel: string;
  reframedTitle: string;
  reframedBody: string;
};

type ArtifactBase = {
  evidenceId: string;
  contextLabel: string;
  type: string;
  title: string;
  footer: string;
  status: string;
  caption: string;
  provenance: string;
  callouts: string[];
};

type RepairStatementArtifact = ArtifactBase & {
  variant: "repair-statement";
  amount: string;
  surfaceLabel: string;
  property: string;
  description: string;
  choices: Array<{ index: string; label: string; value: string; active: boolean }>;
};

type WorkflowSystemArtifact = ArtifactBase & {
  variant: "workflow-system";
  summary: string;
  stages: Array<{
    index: string;
    label: string;
    detail: string;
    state: "complete" | "active" | "queued";
  }>;
  output: { label: string; title: string; detail: string };
};

type SourceImageArtifact = ArtifactBase & {
  variant: "source-image";
  image: { src: string; alt: string; width: number; height: number };
};

type ArtifactContent = RepairStatementArtifact | WorkflowSystemArtifact | SourceImageArtifact;

type CaseFlowContent = {
  caseId: string;
  caseLabel: string;
  introPrimary: string;
  introEmphasis: string;
  introBody: string;
  diff: DecisionDiffContent;
  artifact: ArtifactContent;
  validation: { evidenceId: string; quote: string; label: string; status: string };
  boundary: { label: string; title: string; body: string };
  transfer: { label: string; primary: string; emphasis: string; note: string };
  trace: TraceStep[];
};

export type SiteContent = {
  system: { name: string; version: string; status: string };
  hero: {
    eyebrow: string;
    titleLines: string[];
    thesis: string;
    note: string;
  };
  cases: Array<{
    id: string;
    index: string;
    company: string;
    role: string;
    decision: string;
    proof: string;
    href: string | null;
    linkState: string;
  }>;
  flows: CaseFlowContent[];
};

const typeLabels: Record<TraceKind, string> = {
  signal: "Observed",
  decision: "Changed",
  artifact: "Built",
  proof: "Confirmed",
  unknown: "Unproven",
};

function RegistrationMark({ label }: { label: string }) {
  return (
    <span className="registration-mark" aria-hidden="true">
      <span />
      {label}
    </span>
  );
}

export function EvidencePlate({ artifact }: { artifact: ArtifactContent }) {
  const calloutClasses = ["one", "two", "three"];

  return (
    <figure className="artifact-figure reveal-child">
      <div className={`artifact-canvas artifact-${artifact.variant}`} data-artifact-variant={artifact.variant}>
        <div className="artifact-topline">
          <span>{artifact.contextLabel}</span>
          <span>{artifact.type}</span>
        </div>
        {artifact.variant === "repair-statement" ? (
          <>
            <div className="artifact-heading">
              <span>{artifact.title}</span>
              <strong>{artifact.amount}</strong>
            </div>
            <div className="artifact-detail">
              <span className="artifact-kicker">{artifact.surfaceLabel}</span>
              <p>{artifact.property}</p>
              <span>{artifact.description}</span>
            </div>
            <div className="artifact-rows">
              {artifact.choices.map((choice) => (
                <div className={choice.active ? "row-active" : undefined} key={choice.index}>
                  <span className="row-index">{choice.index}</span>
                  <span>{choice.label}</span>
                  <strong>{choice.value}</strong>
                </div>
              ))}
            </div>
          </>
        ) : artifact.variant === "workflow-system" ? (
          <div className="workflow-artifact">
            <div className="workflow-heading">
              <h4>{artifact.title}</h4>
              <p>{artifact.summary}</p>
            </div>
            <ol className="workflow-stages">
              {artifact.stages.map((stage) => (
                <li key={stage.index} data-stage-state={stage.state}>
                  <span>{stage.index}</span>
                  <div><strong>{stage.label}</strong><small>{stage.detail}</small></div>
                  <em>{stage.state}</em>
                </li>
              ))}
            </ol>
            <div className="workflow-output">
              <span>{artifact.output.label}</span>
              <strong>{artifact.output.title}</strong>
              <p>{artifact.output.detail}</p>
            </div>
          </div>
        ) : (
          <div className="artifact-image-wrap">
            <p>{artifact.title}</p>
            <Image
              src={artifact.image.src}
              alt={artifact.image.alt}
              width={artifact.image.width}
              height={artifact.image.height}
              unoptimized
            />
          </div>
        )}
        <div className="artifact-foot">
          <span>{artifact.footer}</span>
          <span>{artifact.status}</span>
        </div>
        {artifact.callouts.map((callout, index) => (
          <span className={`callout callout-${calloutClasses[index]}`} key={callout}>
            <b>{index + 1}</b> {callout}
          </span>
        ))}
      </div>
      <figcaption>
        <span>{artifact.caption}</span>
        <span>{artifact.provenance}</span>
      </figcaption>
      <ol className="artifact-legend">
        {artifact.callouts.map((callout, index) => (
          <li key={callout}><b>{index + 1}</b> {callout}</li>
        ))}
      </ol>
    </figure>
  );
}

export function DecisionDiff({ content }: { content: DecisionDiffContent }) {
  return (
    <div className="decision-diff reveal-child" aria-label="Decision model comparison">
      <div className="diff-state diff-muted">
        <span className="diff-label">{content.inheritedLabel}</span>
        <strong>{content.inheritedTitle}</strong>
        <p>{content.inheritedBody}</p>
      </div>
      <span className="diff-arrow" aria-hidden="true">→</span>
      <div className="diff-state diff-current">
        <span className="diff-label">{content.reframedLabel}</span>
        <strong>{content.reframedTitle}</strong>
        <p>{content.reframedBody}</p>
      </div>
    </div>
  );
}

export function SourceDrawer({
  source,
  onClosed,
}: {
  source: Source | null;
  onClosed: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [closing, setClosing] = useState(false);

  const requestClose = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog?.open || closing) return;
    setClosing(true);
    const exitDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : motionSystem.durationMs.panelExit;
    closeTimerRef.current = window.setTimeout(() => {
      dialog.close();
      setClosing(false);
      onClosed();
    }, exitDelay);
  }, [closing, onClosed]);

  useEffect(() => {
    if (!source) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [source]);

  useEffect(() => () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
  }, []);

  return (
    <dialog
      ref={dialogRef}
      id="source-drawer"
      className={`source-dialog${closing ? " is-closing" : ""}`}
      aria-labelledby="source-drawer-title"
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
    >
      <div className="source-drawer">
        <div className="drawer-header">
          <span>SOURCE DRAWER</span>
          <button ref={closeRef} onClick={requestClose}>
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        {source ? (
          <div className="drawer-body">
            <p className="drawer-meta">{source.meta}</p>
            <h2 id="source-drawer-title">{source.title}</h2>
            <blockquote>“{source.quote}”</blockquote>
            <p className="drawer-note">{source.note}</p>
            <dl>
              <div><dt>TYPE</dt><dd>Primary-source pattern</dd></div>
              <div><dt>STATE</dt><dd>{source.state}</dd></div>
              <div><dt>PROOF</dt><dd>{source.proofStatus}</dd></div>
            </dl>
          </div>
        ) : null}
      </div>
      <button
        className="drawer-dismiss-layer"
        aria-label="Close source details"
        onClick={requestClose}
      />
    </dialog>
  );
}

function TraceCase({
  flow,
  activeSource,
  onOpenSource,
}: {
  flow: CaseFlowContent;
  activeSource: Source | null;
  onOpenSource: (source: Source, trigger: HTMLAnchorElement) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [activeStep, setActiveStep] = useState(flow.trace[0]?.id ?? "");
  const [enteredSteps, setEnteredSteps] = useState<Set<string>>(
    new Set(flow.trace.slice(0, 1).map((step) => step.id)),
  );
  const stepIndex = useMemo(
    () => new Map(flow.trace.map((step, index) => [step.id, index])),
    [flow.trace],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const chapters = Array.from(root.querySelectorAll<HTMLElement>("[data-trace-step]"));
    let ticking = false;

    const updateTrace = () => {
      ticking = false;
      const viewport = window.innerHeight;
      let active = chapters[0];
      const newlyEntered: string[] = [];
      chapters.forEach((chapter) => {
        const top = chapter.getBoundingClientRect().top;
        if (
          top <= viewport * (motionSystem.chapterRules.enterAtViewportPercent / 100) &&
          chapter.dataset.traceStep
        ) {
          newlyEntered.push(chapter.dataset.traceStep);
        }
        if (top <= viewport * (motionSystem.chapterRules.activeAtViewportPercent / 100)) {
          active = chapter;
        }
      });
      if (newlyEntered.length) {
        setEnteredSteps((current) => {
          const next = new Set([...current, ...newlyEntered]);
          return next.size === current.size ? current : next;
        });
      }
      if (active?.dataset.traceStep) setActiveStep(active.dataset.traceStep);

      if (chapters.length > 1 && progressRef.current) {
        const completedSegments = chapters.slice(1).reduce((total, chapter) => {
          const top = chapter.getBoundingClientRect().top;
          const segmentStart = motionSystem.trace.segmentStartViewportPercent / 100;
          const segmentRange =
            (motionSystem.trace.segmentStartViewportPercent -
              motionSystem.trace.segmentEndViewportPercent) /
            100;
          const segment = Math.min(
            1,
            Math.max(0, (viewport * segmentStart - top) / (viewport * segmentRange)),
          );
          return total + segment;
        }, 0);
        progressRef.current.style.transform = `scaleY(${completedSegments / (chapters.length - 1)})`;
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateTrace);
    };

    updateTrace();
    document.documentElement.classList.add("motion-ready");
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [flow.trace]);

  const activeIndex = stepIndex.get(activeStep) ?? 0;
  const activeKind = flow.trace[activeIndex]?.kind ?? "signal";

  return (
    <>
      <section
        className="flow-intro section-frame"
        id={`case-${flow.caseId}`}
        aria-labelledby={`${flow.caseId}-flow-title`}
      >
        <div className="section-label">
          <span>FLOW SPECIMEN / PLACEHOLDER CONTENT</span>
          <span>Scroll to trace causality</span>
        </div>
        <div className="flow-intro-grid">
          <p className="flow-counter">{flow.caseLabel}</p>
          <h2 id={`${flow.caseId}-flow-title`}>
            {flow.introPrimary}<br /><i>{flow.introEmphasis}</i>
          </h2>
          <p>{flow.introBody}</p>
        </div>
      </section>

      <div className="trace-layout section-frame" ref={rootRef}>
        <aside className="trace-navigation" aria-label={`${flow.caseLabel} trace`}>
          <div className="trace-sticky">
            <span className="trace-base" aria-hidden="true" />
            <span className="trace-progress" data-kind={activeKind} ref={progressRef} aria-hidden="true" />
            <ol>
              {flow.trace.map((step, index) => {
                const state = index < activeIndex
                  ? "complete"
                  : index === activeIndex
                    ? "active"
                    : enteredSteps.has(step.id)
                      ? "entered"
                      : "unseen";
                return (
                  <li key={step.id} data-state={state} data-kind={step.kind}>
                    <a
                      href={`#${flow.caseId}-${step.id}`}
                      aria-current={state === "active" ? "step" : undefined}
                    >
                      <span className="trace-node" aria-hidden="true" />
                      <span className="trace-id">{step.number}</span>
                      <span className="trace-name">{typeLabels[step.kind]}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>

        <div className="trace-content">
          {flow.trace.map((step, index) => {
            const state = index < activeIndex
              ? "complete"
              : index === activeIndex
                ? "active"
                : enteredSteps.has(step.id)
                  ? "entered"
                  : "unseen";
            const chapterId = `${flow.caseId}-${step.id}`;
            const fallbackId = step.source ? `${flow.caseId}-${step.source.staticId}` : "";
            return (
              <section
                className={`trace-chapter chapter-${step.kind} reveal`}
                id={chapterId}
                key={step.id}
                data-trace-step={step.id}
                data-kind={step.kind}
                data-entered={enteredSteps.has(step.id)}
                data-trace-state={state}
                aria-labelledby={`${chapterId}-title`}
              >
                <div className="chapter-meta">
                  <span>{step.number}</span>
                  <span>{step.date}</span>
                  <span>{step.label}</span>
                </div>
                <div className="chapter-main">
                  <h3 id={`${chapterId}-title`}>{step.title}</h3>
                  <p>{step.body}</p>

                  {step.kind === "signal" && step.source ? (
                    <div className="signal-excerpt reveal-child">
                      <span className="quote-mark" aria-hidden="true">“</span>
                      <blockquote>{step.source.quote}</blockquote>
                      <div>
                        <span>{step.source.meta}</span>
                        <a
                          className="evidence-trigger"
                          href={`#${fallbackId}`}
                          aria-expanded={activeSource?.evidenceId === step.source.evidenceId}
                          aria-controls="source-drawer"
                          aria-haspopup="dialog"
                          onClick={(event) => {
                            event.preventDefault();
                            onOpenSource(step.source as Source, event.currentTarget);
                          }}
                        >
                          Open evidence <span aria-hidden="true">↗</span>
                        </a>
                      </div>
                      <section className="source-fallback" id={fallbackId} aria-label="Source details fallback">
                        <span>{step.source.meta}</span>
                        <h4>{step.source.title}</h4>
                        <p>{step.source.note}</p>
                        <a href={`#${chapterId}`}>Close source details</a>
                      </section>
                    </div>
                  ) : null}

                  {step.kind === "decision" ? <DecisionDiff content={flow.diff} /> : null}
                  {step.kind === "artifact" ? <EvidencePlate artifact={flow.artifact} /> : null}

                  {step.kind === "proof" ? (
                    <figure className="validation-quote reveal-child">
                      <blockquote>“{flow.validation.quote}”</blockquote>
                      <figcaption>
                        <span>{flow.validation.label}</span>
                        <span>{flow.validation.status}</span>
                      </figcaption>
                    </figure>
                  ) : null}

                  {step.kind === "unknown" ? (
                    <div className="boundary-note reveal-child">
                      <div>
                        <span>{flow.boundary.label}</span>
                        <strong>{flow.boundary.title}</strong>
                      </div>
                      <p>{flow.boundary.body}</p>
                    </div>
                  ) : null}
                </div>
                <div className="chapter-side">
                  <span className="side-kind">{typeLabels[step.kind]}</span>
                  <RegistrationMark label={step.number.slice(1)} />
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}

export function DecisionTracePortfolio({ content }: { content: SiteContent }) {
  const sourceTriggerRef = useRef<HTMLAnchorElement | null>(null);
  const [source, setSource] = useState<Source | null>(null);
  const [introCycle, setIntroCycle] = useState(0);

  const closeSource = useCallback(() => {
    setSource(null);
    window.setTimeout(() => sourceTriggerRef.current?.focus(), 0);
  }, []);

  const openSource = (nextSource: Source, trigger: HTMLAnchorElement) => {
    sourceTriggerRef.current = trigger;
    setSource(nextSource);
  };
  const firstFlowTarget = content.flows[0] ? `#case-${content.flows[0].caseId}` : "#index";
  const closingFlow = content.flows.at(-1);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Sergey Kudelin, top of page">
          <span>SK</span>
          <b>Sergey Kudelin</b>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#index">Index</a>
          <a href={firstFlowTarget}>Flow</a>
          <a href="#grammar">Grammar</a>
        </nav>
        <button className="replay-button" onClick={() => setIntroCycle((cycle) => cycle + 1)}>
          Replay intro <span aria-hidden="true">↻</span>
        </button>
      </header>

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title" key={introCycle}>
          <div className="hero-context intro-item">
            <span>{content.system.name}</span>
            <span>V{content.system.version}</span>
            <span>{content.system.status}</span>
          </div>
          <div className="hero-copy">
            <p className="eyebrow intro-item">{content.hero.eyebrow}</p>
            <h1 id="hero-title">
              {content.hero.titleLines.map((line, index) => (
                <span className="title-line" key={`${index}-${line}`}>
                  <span>{line}</span>
                </span>
              ))}
            </h1>
            <p className="hero-thesis intro-item">{content.hero.thesis}</p>
          </div>
          <div className="hero-note intro-item">
            <RegistrationMark label="00" />
            <p>{content.hero.note}</p>
          </div>
          <div className="hero-rule" aria-hidden="true"><span /></div>
        </section>

        <section className="case-index section-frame" id="index" aria-labelledby="index-title">
          <div className="section-label">
            <span>INDEX / SELECTED WORK</span>
            <span>Two cases · two proof types</span>
          </div>
          <h2 id="index-title" className="sr-only">Selected work</h2>
          <div className="case-rows">
            {content.cases.map((item) => {
              const row = (
                <>
                  <span className="case-number">{item.index}</span>
                  <span className="case-company">{item.company}</span>
                  <span className="case-role">{item.role}</span>
                  <span className="case-decision">{item.decision}</span>
                  <span className="case-proof">{item.proof}</span>
                  <span className="case-arrow" aria-hidden="true">{item.href ? "↘" : "·"}</span>
                </>
              );
              return item.href ? (
                <a className="case-row" href={item.href} key={item.id} aria-label={`${item.company}: ${item.linkState}`}>
                  {row}
                </a>
              ) : (
                <div className="case-row case-row-static" key={item.id} aria-label={`${item.company}: ${item.linkState}`}>
                  {row}
                </div>
              );
            })}
          </div>
        </section>

        {content.flows.map((flow) => (
          <TraceCase
            flow={flow}
            activeSource={source}
            onOpenSource={openSource}
            key={flow.caseId}
          />
        ))}

        <section className="grammar section-frame" id="grammar" aria-labelledby="grammar-title">
          <div className="section-label">
            <span>SYSTEM GRAMMAR / REUSABLE PARTS</span>
            <span>Five states · one visual language</span>
          </div>
          <div className="grammar-heading">
            <h2 id="grammar-title">A small vocabulary.<br /><i>Strictly reused.</i></h2>
            <p>Future models should compose with these elements before inventing a new pattern. The contracts live beside the implementation.</p>
          </div>
          <div className="component-ledger">
            {[
              ["01", "Trace spine", "Navigation + causal progress", "Scroll-linked"],
              ["02", "Decision node", "One defensible change", "4–6 per case"],
              ["03", "Evidence plate", "Artifact at useful scale", "No device frame"],
              ["04", "Source drawer", "Provenance on demand", "Closed by default"],
              ["05", "Boundary note", "What remains unproven", "Required per case"],
            ].map(([index, name, purpose, behavior]) => (
              <div className="component-row" key={index}>
                <span>{index}</span>
                <strong>{name}</strong>
                <p>{purpose}</p>
                <code>{behavior}</code>
              </div>
            ))}
          </div>
          <div className="token-strip" aria-label="Semantic color tokens">
            {(["signal", "decision", "proof", "unknown"] as TraceKind[]).map((kind) => (
              <div key={kind} data-kind={kind}>
                <span className="token-swatch" />
                <span>{typeLabels[kind]}</span>
                <code>--{kind}</code>
              </div>
            ))}
          </div>
        </section>

        {closingFlow ? (
          <section className="closing section-frame">
            <p className="closing-kicker">{closingFlow.transfer.label}</p>
            <p className="closing-line">{closingFlow.transfer.primary}<br /><i>{closingFlow.transfer.emphasis}</i></p>
            <p className="closing-note">{closingFlow.transfer.note}</p>
            <a href="#top">Return to index <span aria-hidden="true">↑</span></a>
          </section>
        ) : null}
      </main>

      <footer className="site-footer">
        <span>DECISION TRACE / V{content.system.version}</span>
        <span>DESIGN SYSTEM SPECIMEN</span>
        <span>CONTENT IS PLACEHOLDER</span>
      </footer>

      <SourceDrawer source={source} onClosed={closeSource} />
    </div>
  );
}
