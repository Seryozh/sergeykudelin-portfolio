# Decision Trace

Decision Trace is the visual and interaction system for Sergey Kudelin's portfolio. Its purpose is to make product judgment visible without relying on inflated metrics. It follows the point where an inherited model stopped fitting, the signal that exposed the mismatch, the decision Sergey made, the artifact that made it tangible, the response it earned, and the limit of what can be claimed.

The system should feel editorial, tactile, precise, and alive. It should not feel like a courtroom, detective board, startup template, or design-tool showcase.

## 1. Story grammar

Each case uses four to six nodes selected from five states:

| State | Question answered | Color | Typical evidence |
| --- | --- | --- | --- |
| Signal | What did Sergey notice? | Signal blue | Call excerpt, behavior, product contradiction |
| Decision | What model did he change? | Decision vermilion | Reframe, bet, decision diff |
| Artifact | What made it real? | Ink | Shipped UI, workflow, diagram, commit |
| Proof | Who or what responded? | Proof green | Founder quote, usage, approval, observed result |
| Unknown | What remains unproven? | Unknown taupe | Attribution limit, missing adoption, open question |

The portfolio does not begin with a list of skills. It begins with a point of view, then lets cases prove it. Case pages follow this order:

1. Scope and strongest outcome.
2. Signal that did not fit the inherited model.
3. Decision that changed the model.
4. One to three artifacts at useful scale.
5. External response or defensible result.
6. Attribution boundary.
7. One sentence that transfers the capability into the next case.

## 2. Visual language

The base is warm paper with near-black ink, hairline rules, large Newsreader thought lines, IBM Plex Sans narrative text, and IBM Plex Mono provenance. Grain is quiet enough to disappear while reading. Registration crosses appear only at chapter boundaries.

Semantic accents do not belong to companies:

- Blue always means observed signal.
- Vermilion always means Sergey's decision.
- Green always means proof or outside validation.
- Taupe always means an unresolved boundary.
- Acid highlight is rare and restricted to annotation markers or text selection.

Artifacts sit flat on the page with a 3px radius and a restrained paper shadow. Do not put them into laptop, browser, or phone frames. Preserve their native color unless privacy requires an explicitly labeled reconstruction.

## 3. Layout and rhythm

Desktop uses a 16-column grid with a 1400px content maximum and 24px gutters:

- Columns 1 to 3: trace and case index.
- Columns 4 to 11: primary narrative.
- Columns 12 to 16: evidence and provenance.

Tablet uses eight columns. Mobile uses four conceptual columns with a 16px page edge and an in-flow trace at the left. Evidence immediately follows the claim it supports. No mobile carousel is allowed.

Major chapters use 128px to 176px of separation. Related text and evidence use 48px to 80px. Dense artifact moments alternate with empty paper. The intro occupies about 65 to 85 percent of the viewport, but it is not forced to exactly one screen.

Prose is capped at 66 characters per line. Decision statements are capped near 22 characters per line. A case contains one dominant thought line per viewport.

## 4. Component vocabulary

The public vocabulary is defined in `design-system/components.json`. The essential patterns are:

- `TraceSpine`: quiet reading progress and node navigation.
- `DecisionNode`: the chapter shell for one causal state.
- `SignalExcerpt`: sourced observation with disclosure.
- `DecisionDiff`: compact comparison between inherited and reframed models.
- `EvidencePlate`: an artifact at useful scale with provenance. Use a closed `repair-statement`, `workflow-system`, or `source-image` variant instead of inventing per-company markup.
- `ValidationQuote`: another person's exact words, visually carrying proof.
- `BoundaryNote`: explicit attribution limit with faint hatch.
- `CaseIndexRow`: one horizontal project entry, never a card grid.
- `SourceDrawer`: provenance on demand, closed by default.
- `TransferLine`: the capability carried into the next case.

## 5. Motion language

Motion exposes causality and navigation state. It never performs independently of the story.

The page structure renders immediately. The initial entrance reveals complete lines or blocks, not letters. It finishes within 950ms. As a chapter enters, its heading appears first, narrative follows 60ms later, and the artifact follows 120ms later. Entered content never hides or replays while scrolling backward.

The trace line tracks scroll progress directly. It has no spring, glow, traveling dot, or delayed catch-up. Hover lift is capped at 3px. Scale is capped at 1.5 percent. Hover movement is enabled only for fine pointers.

Drawers use 320ms entry and 220ms exit. Escape closes a drawer and returns focus to its trigger. Under reduced motion, content is immediately visible, transforms are removed, and the complete trace is drawn.

Full tokens and state transitions are in `design-system/motion.json`.

## 6. Content and credibility

The current living page deliberately uses placeholder and reconstructed material. A placeholder must say so on the surface. Before publication, every claim must be classified as one of:

- `verified`: directly supported by linked evidence.
- `supported`: defensible inference from linked evidence, phrased as inference.
- `internal`: approved or observed inside the company, with no external adoption implied.
- `unproven`: explicitly shown as a limit or open question.

Avoid unsupported totals, percentages, adoption claims, and false precision. Credibility should come from exact decisions, primary artifacts, Git history, attributed quotes, and honest boundaries.

## 7. Accessibility and failure behavior

The experience remains readable when JavaScript fails. Client code adds motion only after the server-rendered content exists. All controls are at least 44px, focus outlines are immediate, drawers expose state through ARIA, and color is paired with labels and node shapes.

The DOM follows reading order at every breakpoint. Mobile layout must not use CSS reordering to detach evidence from its claim. `prefers-reduced-motion` is a required state, not a polish pass.

## 8. Anti-patterns

Reject any proposal centered on:

- generic bento grids or rounded cards;
- device mockups around every artifact;
- ambient WebGL, 3D blobs, glow, glass, or gradients;
- fake terminals, stamps, redactions, red string, or legal-document theater;
- a literal evidence room as the site's identity;
- auto-playing prototypes, audio, or video;
- custom cursors, parallax, horizontal scroll galleries, or scroll hijacking;
- a different design language for each company;
- motion that contains information missing from the static page.

## 9. Model handoff procedure

Start at `design-system/manifest.json`. Read the referenced token, motion, component, and acceptance files. Reuse an existing pattern and update `content/` first. If a new pattern is truly necessary, follow the change sequence in `AGENTS.md` and increment the system version.

The living specimen on `/` is the canonical visual reference. Machine files describe the constraints; the specimen demonstrates their combined feel.

### Prototype chrome versus final portfolio

The current specimen deliberately exposes Replay, version status, the component ledger, token samples, and placeholder labels so the system can be judged before final content exists. Those elements are not part of the final recruiter-facing portfolio. Once verified case content replaces the placeholders, move the design-system demonstration to `/system` and let `/` contain only the portfolio thesis, case index, case narratives, transfer, resume, and contact paths.
