"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { nextThesisStage } from "@/lib/thesis-state.js";

type ThesisStage = 0 | 1 | 2;

export type SiteContent = {
  identity: {
    name: string;
    role: string;
  };
  fyxed: {
    company: string;
    role: string;
    introduction: string[];
    title: string;
    inherited: {
      title: string;
      body: string;
    };
    repair: {
      title: string;
      body: string;
    };
    proposal: {
      title: string;
      body: string;
    };
    unknowns: {
      title: string;
      items: string[];
    };
    boundary: string;
    actions: string[];
    states: string[];
  };
  futureclinic: {
    company: string;
    role: string;
    title: string;
    paragraphs: string[];
    boundary: string;
  };
  close: {
    statement: string;
    githubLabel: string;
    githubUrl: string;
  };
};

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

function FyxedThesis({ content }: { content: SiteContent["fyxed"] }) {
  const [stage, setStage] = useState<ThesisStage>(0);
  const enhanced = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const statusId = useId().replaceAll(":", "");

  const advance = () => {
    setStage((current) => nextThesisStage(current));
  };

  return (
    <section
      className="fyxed-thesis"
      id="fyxed"
      data-enhanced={enhanced ? "true" : "false"}
      data-stage={stage}
      aria-labelledby="fyxed-title"
    >
      <div className="fyxed-introduction">
        <p><b>{content.company}</b><span>{content.role}</span></p>
        <div className="fyxed-introduction-copy">
          {content.introduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>

      <h1 id="fyxed-title" className="fyxed-title">{content.title}</h1>

      <div className="product-geometry">
        <section className="property-manager-path">
          <h2>{content.inherited.title}</h2>
          <p>{content.inherited.body}</p>
        </section>

        <section className="repair-interruption">
          <h2>{content.repair.title}</h2>
          <p>{content.repair.body}</p>
        </section>

        <section
          className="owner-proposal"
          aria-hidden={enhanced && stage < 1 ? "true" : undefined}
        >
          <h2>{content.proposal.title}</h2>
          <p>{content.proposal.body}</p>
        </section>
      </div>

      <div
        className="unknown-wrap"
        aria-hidden={enhanced && stage < 2 ? "true" : undefined}
      >
        <div className="unknown-inner">
          <section className="unknowns">
            <h2>{content.unknowns.title}</h2>
            <ul>
              {content.unknowns.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        </div>
      </div>

      <div className="thesis-action">
        <button type="button" aria-describedby={statusId} onClick={advance}>
          <span aria-hidden="true">{stage === 2 ? "↺" : "→"}</span>
          {content.actions[stage]}
        </button>
        <p>{content.boundary}</p>
      </div>
      <p className="sr-only" id={statusId} aria-live="polite">{content.states[stage]}</p>
    </section>
  );
}

function FutureClinicNote({ content }: { content: SiteContent["futureclinic"] }) {
  return (
    <section className="futureclinic-note" id="futureclinic" aria-labelledby="futureclinic-title">
      <header>
        <p><b>{content.company}</b><span>{content.role}</span></p>
        <h2 id="futureclinic-title">{content.title}</h2>
      </header>
      <div className="futureclinic-copy">
        {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <p className="futureclinic-boundary">{content.boundary}</p>
      </div>
    </section>
  );
}

export function SergeyPortfolio({ content }: { content: SiteContent }) {
  return (
    <div className="site-shell" id="top">
      <a className="skip-link" href="#main-content">Skip to the work</a>
      <header className="site-header">
        <a href="#top">{content.identity.name}</a>
        <span>{content.identity.role}</span>
        <a href={content.close.githubUrl} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
      </header>

      <main id="main-content" tabIndex={-1}>
        <FyxedThesis content={content.fyxed} />
        <FutureClinicNote content={content.futureclinic} />
      </main>

      <footer className="site-footer">
        <p>{content.close.statement}</p>
        <a href={content.close.githubUrl} target="_blank" rel="noreferrer">
          {content.close.githubLabel} <span aria-hidden="true">↗</span>
        </a>
      </footer>
    </div>
  );
}
