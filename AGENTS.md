# Portfolio implementation contract

Read `DESIGN_SYSTEM.md`, then `design-system/manifest.json`, before changing any visible surface.

This portfolio uses one visual system called **Decision Trace**. It shows product judgment as a causal sequence: signal, decision, artifact, proof, boundary. The design must feel like a warm editorial decision log, not a SaaS landing page or a forensic evidence board.

The current `/` route is intentionally a living design-system specimen. Its Replay control, visible version labels, component ledger, token strip, and placeholder warnings are review scaffolding. When real case content is approved, move that scaffolding to `/system` or remove it from the public route. Do not mistake the specimen chrome for the final portfolio information architecture.

## Non-negotiable rules

1. Reuse an existing component and change content before inventing a pattern.
2. Every trace node must map to a documented event or explicit placeholder.
3. Keep claims and evidence separate. Never turn an inference into a verified outcome.
4. Use semantic color only: signal blue, decision vermilion, proof green, unknown taupe.
5. Keep artifacts flat, sharp, and large. No device frames.
6. Keep motion purposeful and one-time. No parallax, ambient loops, floating layers, custom cursor, marquee, or scroll hijacking.
7. Preserve reading order on mobile. Evidence must follow the claim it supports in the DOM.
8. Every published case ends with an attribution boundary.
9. Do not add rounded bento cards, gradients, glow, glass effects, fake terminals, fake redactions, or decorative 3D.
10. Do not write final case copy into JSX. Put content in `content/`.
11. Add cases through `content.flows`. Artifact evidence must use a closed `repair-statement`, `workflow-system`, or `source-image` variant.
12. Keep the evidence registry server-only. Every rendered claim must be public-safe and link only to public evidence.

## Required change sequence

For a new visual pattern, change files in this order:

1. Add or amend a token in `design-system/tokens.json` or `design-system/motion.json`.
2. Add the component contract to `design-system/components.json`.
3. Add a visible specimen to the living system page.
4. Implement the reusable component.
5. Add or update an acceptance rule.
6. Increment the design-system version in `design-system/manifest.json`.

Run `npm run validate:design`, `npm run typecheck`, `npm run lint`, and `npm run build` before handoff.
