import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFile(resolve(root, path), "utf8");
const readJson = async (path) => JSON.parse(await read(path));

const [content, css, component, page, layout, prompt, brief, decisions, acceptance] = await Promise.all([
  readJson("content/site.json"),
  read("app/globals.css"),
  read("app/components/SergeyPortfolio.tsx"),
  read("app/page.tsx"),
  read("app/layout.tsx"),
  read("design/SELF_PROMPT.md"),
  read("design/BRIEF.md"),
  read("design/DECISIONS.md"),
  read("design/ACCEPTANCE.md"),
]);

const requireString = (value, label) => {
  assert.equal(typeof value, "string", `${label} must be a string`);
  assert.ok(value.trim().length > 0, `${label} must not be empty`);
};

const requireStringArray = (value, length, label) => {
  assert.ok(Array.isArray(value), `${label} must be an array`);
  assert.equal(value.length, length, `${label} must contain ${length} values`);
  value.forEach((item, index) => requireString(item, `${label}[${index}]`));
};

for (const path of [
  "design/SELF_PROMPT.md",
  "design/BRIEF.md",
  "design/DECISIONS.md",
  "design/ACCEPTANCE.md",
]) {
  await access(resolve(root, path));
}

for (const field of ["identity", "fyxed", "futureclinic", "close"]) {
  assert.ok(content[field] && typeof content[field] === "object", `Missing content object: ${field}`);
}
for (const field of ["company", "role", "introduction", "title", "inherited", "repair", "proposal", "unknowns", "boundary", "actions", "states"]) {
  assert.ok(content.fyxed[field], `Missing Fyxed field: ${field}`);
}
assert.equal(content.fyxed.actions.length, 3, "Fyxed requires two actions and a reset");
assert.equal(content.fyxed.states.length, 3, "Fyxed requires three announced states");
assert.equal(content.fyxed.unknowns.items.length, 2, "The public proof gap uses two concrete tests");
assert.match(content.fyxed.title, /repair changed who the product had to ask/i, "The opening must express the actor change");
assert.match(content.fyxed.proposal.body, /\?$/, "Owner-paid financing must remain a question");
assert.match(content.fyxed.boundary, /proposed/i, "The Fyxed thesis must be marked as proposed");
assert.match(content.fyxed.boundary, /unverified/i, "The owner-paid path must be marked as unverified");
assert.equal(content.futureclinic.paragraphs.length, 2, "FutureClinic uses a separate two-paragraph structure");
assert.match(content.futureclinic.boundary, /stay out/i, "FutureClinic requires a plain publication boundary");
assert.match(content.close.githubUrl, /^https:\/\/github\.com\/Seryozh\//, "GitHub URL must remain verified");
requireString(content.identity.name, "identity.name");
requireString(content.identity.role, "identity.role");
requireStringArray(content.fyxed.introduction, 2, "fyxed.introduction");
for (const field of ["title", "boundary"]) requireString(content.fyxed[field], `fyxed.${field}`);
for (const group of ["inherited", "repair", "proposal"]) {
  requireString(content.fyxed[group].title, `fyxed.${group}.title`);
  requireString(content.fyxed[group].body, `fyxed.${group}.body`);
}
requireString(content.fyxed.unknowns.title, "fyxed.unknowns.title");
requireStringArray(content.fyxed.unknowns.items, 2, "fyxed.unknowns.items");
requireStringArray(content.fyxed.actions, 3, "fyxed.actions");
requireStringArray(content.fyxed.states, 3, "fyxed.states");
for (const field of ["company", "role", "title", "boundary"]) requireString(content.futureclinic[field], `futureclinic.${field}`);
requireStringArray(content.futureclinic.paragraphs, 2, "futureclinic.paragraphs");
assert.match(
  content.fyxed.introduction.join(" "),
  /rent timing and repair funding as separate programs/i,
  "Public copy must keep the two Fyxed programs separate",
);

const publicSource = [css, component, page, layout, JSON.stringify(content)].join("\n");
for (const [pattern, label] of [
  [/Newsreader|IBM_Plex_Mono/i, "decorative font role"],
  [/Decision Trace|Field Entry/i, "legacy design-system language"],
  [/RegistrationMark|route-key|case-number|stage-counter/i, "technical theater"],
  [/linear-gradient|radial-gradient|conic-gradient/i, "gradient styling"],
  [/border-radius\s*:/i, "rounded component styling"],
  [/\bparallax\b|custom cursor|scroll reveal/i, "generic motion"],
  [/aria-expanded|aria-pressed/i, "incorrect multi-step control semantics"],
  [/guarantee|guaranteed/i, "guarantee language"],
  [/BRIEF\s*\/\s*BUILD\s*\/\s*REVIEW/i, "faux workflow artifact"],
]) {
  assert.doesNotMatch(publicSource, pattern, `Public surface contains prohibited ${label}`);
}

assert.match(css, /--correction:\s*#174fd1/i, "Correction color is missing");
assert.doesNotMatch(css, /#f05023|--route:/i, "The generic orange route must stay deleted");
assert.match(css, /\.thesis-action button\s*\{[\s\S]*?display:\s*none;/, "The base control must be hidden");
assert.match(css, /\[data-enhanced="true"\][\s\S]*?\.thesis-action button\s*\{[\s\S]*?display:\s*grid;/, "Hydration must reveal the control");
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/, "Reduced-motion state is missing");
assert.match(css, /@media print/, "Print state is missing");
assert.match(component, /useSyncExternalStore/, "Progressive enhancement snapshot is missing");
assert.match(component, /nextThesisStage/, "The tested thesis state transition is missing");
assert.match(component, /tabIndex=\{-1\}/, "Safari skip-target focus is missing");
assert.match(component, /aria-describedby=\{statusId\}/, "The action must identify its live status");
assert.match(component, /aria-live="polite"/, "State changes need a polite announcement");
assert.match(component, /aria-hidden=\{enhanced && stage < 1/, "The hidden owner proposal must leave the accessibility tree");
assert.match(component, /function FyxedThesis/, "The Fyxed interaction must remain bespoke");
assert.match(component, /function FutureClinicNote/, "FutureClinic must remain structurally separate");
assert.doesNotMatch(component, /headline\.before|headline\.turn|headline\.interruption/, "The opening cannot use a swappable emphasis schema");
assert.match(prompt, /There is no portfolio-wide visual metaphor/, "The revised source prompt is missing");
assert.match(brief, /Evidence to decision/, "The evidence table is missing");
assert.match(decisions, /11\/20 hostile review/, "The rejected foldout iteration must stay documented");
assert.match(acceptance, /18 of 20/, "The critique threshold is missing");

console.log("Portfolio specificity and truth contract validated.");
