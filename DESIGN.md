# Curiosity, made useful

Sergey Kudelin’s personal portfolio is an editorial workbench: warm paper, blue ink, numbered field notes, and useful things made from connected ideas. Next Customer does not define this identity.

## Visual rules

- Paper `#f5f2e9`, ink `#172b4d`, action blue `#2144cc`, muted text `#596574`, margin-note rust `#af411e`, rule `#c9ccc5`, inset panel `#eae8df`.
- Georgia for expressive titles and key metrics; Arial/Helvetica for readable prose; system monospace for labels, project numbers, and navigation. No downloaded fonts.
- The small tilted `sk` mark, thin rules, and two-digit project numbers are the signatures. Use the tilt on the homepage note only, not on readable case-study content.
- Titles are large with tight tracking. Body copy is calm and comfortably spaced. Keep accent color for links, numbering, and short annotations.
- Homepage: introduction → selected work → contact. Collection: all eight projects. Case study: project navigation → numbered introduction → existing evidence and narrative → related work.
- Two-column collection and a sidebar on wide screens; one-column collection and native expandable project navigation on small screens. Never hide the route to the collection or contact.

## Implementation constraints

Keep this site static with inline styles and CSS custom properties. The homepage and collection use the same base styles; the eight case studies share the identity overrides after their existing diagram styles. When changing a token or case-study rule, update every page in the family. The duplicated styles are deliberate: the current CSP only permits inline styles.

Preserve meaningful HTML headings, link labels, visible focus, a skip link, reduced-motion support, and the print view. Decorative arrows and monograms use `aria-hidden`; numbered project links retain readable titles. Do not invent project outcomes. Keep project narratives and the existing Creators workflow script intact, including its CSP hash. No framework, build pipeline, remote font, or new script is needed.
