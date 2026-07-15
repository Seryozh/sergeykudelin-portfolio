"use client";

import { useState, type KeyboardEvent } from "react";
import { track } from "./analytics";

const tabs = [
  { id: "creators", label: "FutureClinic Creators" },
  { id: "previews", label: "Doctor Preview Pages" },
  { id: "nikola", label: "Nikola" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function ArtifactTabs() {
  const [active, setActive] = useState<TabId>("creators");

  function select(id: TabId) {
    setActive(id);
    track("case_artifact_select", {
      case_id: "futureclinic",
      artifact_id: id,
    });
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;

    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;

    event.preventDefault();
    const target = document.getElementById(`artifact-tab-${tabs[next].id}`);
    target?.focus();
  }

  return (
    <div className="artifact-shell">
      <div className="artifact-tabs" role="tablist" aria-label="FutureClinic artifacts">
        {tabs.map((tab, index) => (
          <button
            className="artifact-tab"
            id={`artifact-tab-${tab.id}`}
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`artifact-panel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => select(tab.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section
        className="artifact-panel"
        id="artifact-panel-creators"
        role="tabpanel"
        aria-labelledby="artifact-tab-creators"
        hidden={active !== "creators"}
      >
        <div className="product-window">
          <div className="window-bar" aria-hidden="true">
            <span className="window-dots"><i /><i /><i /></span>
            <span className="window-address">futurecliniccreators.com</span>
            <span />
          </div>
          <div className="creators-ui">
            <aside className="creator-sidebar" aria-hidden="true">
              <div className="creator-logo"><i /> FutureClinic Creators</div>
              <ol className="creator-steps">
                <li className="is-active" data-step="1">Topics</li>
                <li data-step="2">Titles</li>
                <li data-step="3">Thumbnail</li>
                <li data-step="4">Questions</li>
                <li data-step="5">Script</li>
                <li data-step="6">Export</li>
              </ol>
            </aside>
            <div className="creator-main">
              <p className="artifact-kicker">Step 1 of 6 / Topics</p>
              <h3>Choose your next video</h3>
              <p>
                Search demand, channel gaps, and the doctor&apos;s own voice stay
                in the same working context.
              </p>
              <div className="topic-list">
                <div className="topic-row">
                  <span>1</span><span><strong>What actually changes after 40?</strong><small>Audience question / strong channel fit</small></span><span className="topic-score">8.7</span>
                </div>
                <div className="topic-row">
                  <span>2</span><span><strong>The routine I would stop recommending</strong><small>Contrarian opening / high comment intent</small></span><span className="topic-score">8.2</span>
                </div>
                <div className="topic-row">
                  <span>3</span><span><strong>When a symptom is worth asking about</strong><small>Clinical scope / patient conversion path</small></span><span className="topic-score">7.9</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="artifact-footnote">
          Sanitized reconstruction based on the first implementation I built.
        </p>
      </section>

      <section
        className="artifact-panel"
        id="artifact-panel-previews"
        role="tabpanel"
        aria-labelledby="artifact-tab-previews"
        hidden={active !== "previews"}
      >
        <div className="preview-grid">
          <div className="doctor-preview" aria-label="Synthetic personalized doctor preview page">
            <span className="doctor-brand">FutureClinic</span>
            <h4>Dr. Lena, your clinic is ready.</h4>
            <p>
              A personalized view built around the doctor&apos;s specialty,
              content, and audience questions.
            </p>
            <span className="doctor-chip">Personal preview / synthetic</span>
          </div>
          <div className="preview-copy">
            <p className="artifact-kicker">Acquisition as product</p>
            <h3>Show the doctor their version.</h3>
            <p>
              Each physician received a tailored clinic page and a founder
              video made for that person. I also built the review and publishing
              workflow behind the pages.
            </p>
          </div>
        </div>
      </section>

      <section
        className="artifact-panel"
        id="artifact-panel-nikola"
        role="tabpanel"
        aria-labelledby="artifact-tab-nikola"
        hidden={active !== "nikola"}
      >
        <div className="nikola-grid">
          <div className="approval-card">
            <div className="approval-head"><i /> Nikola / Draft review</div>
            <div className="approval-body">
              <span>Research complete</span>
              <h4>Personalized draft is ready</h4>
              <p>
                Identity was checked against public medical records. The draft
                references the creator&apos;s actual channel and waits here for a
                person to review it.
              </p>
              <div className="approval-actions" aria-label="Example approval controls">
                <span>Create Gmail draft</span><span>Needs changes</span>
              </div>
            </div>
          </div>
          <div className="nikola-copy">
            <p className="artifact-kicker">Human-approved AI</p>
            <h3>The agent knew where it had to stop.</h3>
            <p>
              Nikola handled research and prepared personalized drafts. Every
              outbound action stayed behind review in the version I handed off.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
