import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (path) => JSON.parse(await readFile(resolve(root, path), "utf8"));

const [
  manifest,
  manifestSchema,
  tokens,
  motion,
  components,
  acceptance,
  content,
  contentSchema,
  packageJson,
  css,
  page,
  home,
  layout,
] = await Promise.all([
  readJson("design-system/manifest.json"),
  readJson("design-system/manifest.schema.json"),
  readJson("design-system/tokens.json"),
  readJson("design-system/motion.json"),
  readJson("design-system/components.json"),
  readJson("design-system/acceptance.json"),
  readJson("content/site.json"),
  readJson("content/site.schema.json"),
  readJson("package.json"),
  readFile(resolve(root, "app/globals.css"), "utf8"),
  readFile(resolve(root, "app/components/DecisionTracePortfolio.tsx"), "utf8"),
  readFile(resolve(root, "app/page.tsx"), "utf8"),
  readFile(resolve(root, "app/layout.tsx"), "utf8"),
]);

const ajv = new Ajv2020({ allErrors: true, strict: false });
const validateSchema = (schema, data, label) => {
  const validate = ajv.compile(schema);
  assert.ok(
    validate(data),
    `${label} failed schema validation:\n${ajv.errorsText(validate.errors, { separator: "\n" })}`,
  );
};

const cssDeclaration = (variable, value) => `${variable}: ${value}`;
const hasCssDeclaration = (source, variable, value) => source.includes(cssDeclaration(variable, value));
const assertCssToken = (source, variable, value, label) => {
  const declaration = cssDeclaration(variable, value);
  assert.ok(source.includes(declaration), `${label} should declare ${declaration}`);
};
const extractMediaBlock = (source, breakpoint) => {
  const marker = `@media (max-width: ${breakpoint})`;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `Missing media query ${marker}`);
  const open = source.indexOf("{", start);
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(open + 1, index);
  }
  assert.fail(`Unclosed media query ${marker}`);
};

validateSchema(manifestSchema, manifest, "Design-system manifest");
validateSchema(contentSchema, content, "Portfolio content");

assert.equal(manifest.status, "locked", "Design-system manifest must be locked");
for (const document of [tokens, motion, components, acceptance]) {
  assert.equal(document.version, manifest.version, "All design-system document versions must match");
}
assert.equal(content.system.version, manifest.version, "Visible specimen version must match manifest");
assert.equal(packageJson.version, manifest.version, "Package version must match manifest");
assert.ok(manifest.requiredChecks.includes("npm test"), "Manifest must require the full test suite");
assert.ok(manifest.requiredChecks.includes("npm run typecheck"), "Manifest must require type checking");

const expectedStates = ["signal", "decision", "artifact", "proof", "unknown"];
assert.deepEqual(manifest.allowedTraceStates, expectedStates, "Trace state enum changed unexpectedly");

const caseIds = new Set(content.cases.map((item) => item.id));
const flowCaseIds = content.flows.map((flow) => flow.caseId);
assert.equal(new Set(flowCaseIds).size, flowCaseIds.length, "Case flow IDs must be unique");
for (const flow of content.flows) {
  assert.ok(caseIds.has(flow.caseId), `Flow ${flow.caseId} requires a matching case index row`);
  assert.ok(flow.trace.some((step) => step.kind === "unknown"), `Flow ${flow.caseId} requires a boundary node`);
  assert.equal(new Set(flow.trace.map((step) => step.id)).size, flow.trace.length, `Flow ${flow.caseId} step IDs must be unique`);
}
for (const item of content.cases) {
  const hasFlow = flowCaseIds.includes(item.id);
  assert.equal(
    item.href,
    hasFlow ? `#case-${item.id}` : null,
    `Case ${item.id} link must reflect whether a flow exists`,
  );
}

const allTraceSteps = content.flows.flatMap((flow) => flow.trace);

for (const relativePath of manifest.readOrder) {
  await access(resolve(root, "design-system", relativePath));
}

const evidenceIds = content.evidence.map((item) => item.id);
assert.equal(new Set(evidenceIds).size, evidenceIds.length, "Evidence IDs must be unique");
const evidenceById = new Map(content.evidence.map((item) => [item.id, item]));

for (const flow of content.flows) {
  const artifactSteps = flow.trace.filter((step) => step.kind === "artifact");
  assert.equal(artifactSteps.length, 1, `Flow ${flow.caseId} requires exactly one artifact trace node`);
  assert.ok(
    artifactSteps[0].claim.evidenceIds.includes(flow.artifact.evidenceId),
    `Flow ${flow.caseId} artifact node must reference ${flow.artifact.evidenceId}`,
  );
  assert.equal(
    evidenceById.get(flow.artifact.evidenceId)?.visibility,
    "public",
    `Flow ${flow.caseId} artifact evidence must be public`,
  );
  assert.equal(
    evidenceById.get(flow.validation.evidenceId)?.visibility,
    "public",
    `Flow ${flow.caseId} validation evidence must be public`,
  );
  if (flow.artifact.variant === "workflow-system") {
    assert.equal(
      new Set(flow.artifact.stages.map((stage) => stage.index)).size,
      flow.artifact.stages.length,
      `Workflow artifact ${flow.artifact.evidenceId} stage indexes must be unique`,
    );
    assert.equal(
      flow.artifact.stages.filter((stage) => stage.state === "active").length,
      1,
      `Workflow artifact ${flow.artifact.evidenceId} requires exactly one active stage`,
    );
  }
}

const artifactFixtures = {
  workflow: {
    variant: "workflow-system",
    evidenceId: "fixture-workflow",
    contextLabel: "PRODUCT OPERATIONS",
    type: "WORKFLOW / FIXTURE",
    title: "Workflow system",
    summary: "A schema fixture proving software workflows can be added through content.",
    stages: [
      { index: "01", label: "Brief", detail: "Defined", state: "complete" },
      { index: "02", label: "Build", detail: "In progress", state: "active" },
      { index: "03", label: "Review", detail: "Queued", state: "queued" },
    ],
    output: { label: "OUTPUT", title: "Working system", detail: "Replace with verified material." },
    footer: "CONTENT-DRIVEN VARIANT",
    status: "FIXTURE / NOT RENDERED",
    caption: "SCHEMA FIXTURE",
    provenance: "PLACEHOLDER",
    callouts: ["State is visible"],
  },
  image: {
    variant: "source-image",
    evidenceId: "fixture-image",
    contextLabel: "SOURCE ARTIFACT",
    type: "IMAGE / FIXTURE",
    title: "Native artifact",
    image: { src: "/fixture.png", alt: "Schema fixture", width: 1200, height: 800 },
    footer: "NATIVE SOURCE",
    status: "FIXTURE / NOT RENDERED",
    caption: "SCHEMA FIXTURE",
    provenance: "PLACEHOLDER",
    callouts: [],
  },
};
for (const [label, artifact] of Object.entries(artifactFixtures)) {
  validateSchema(contentSchema.$defs.artifact, artifact, `${label} artifact variant`);
}
const validateArtifactVariant = ajv.compile(contentSchema.$defs.artifact);
assert.equal(
  validateArtifactVariant({ ...artifactFixtures.workflow, amount: "$1" }),
  false,
  "Workflow variant must reject repair-statement fields",
);
assert.equal(
  validateArtifactVariant({ ...artifactFixtures.image, variant: "unknown-artifact" }),
  false,
  "Artifact schema must reject unknown variants",
);

for (const step of allTraceSteps) {
  assert.equal(step.claim.publicSafe, true, `Rendered trace claim ${step.id} must be public-safe`);
  if (step.source) {
    assert.ok(
      step.claim.evidenceIds.includes(step.source.evidenceId),
      `Source disclosure ${step.source.evidenceId} must be linked by claim ${step.id}`,
    );
  }
  for (const evidenceId of step.claim.evidenceIds) {
    const evidence = evidenceById.get(evidenceId);
    assert.ok(evidence, `Trace claim ${step.id} links missing evidence ${evidenceId}`);
    assert.equal(evidence.visibility, "public", `Rendered claim ${step.id} links non-public evidence`);
  }
  if (step.claim.status === "verified") {
    assert.ok(step.claim.evidenceIds.length > 0, `Verified claim ${step.id} requires evidence`);
    assert.ok(
      step.claim.evidenceIds.every((id) => evidenceById.get(id)?.status === "verified"),
      `Verified claim ${step.id} may link only verified evidence`,
    );
  }
}

const visiblePlaceholderLabels = new Map([
  ...allTraceSteps
    .filter((step) => step.source)
    .map((step) => [step.source.evidenceId, `${step.source.meta} ${step.source.note}`]),
  ...content.flows.flatMap((flow) => [
    [flow.artifact.evidenceId, `${flow.artifact.status} ${flow.artifact.provenance}`],
    [flow.validation.evidenceId, `${flow.validation.label} ${flow.validation.status}`],
  ]),
]);
for (const evidence of content.evidence.filter((item) => item.placeholder)) {
  assert.match(
    visiblePlaceholderLabels.get(evidence.id) ?? "",
    /placeholder|reconstruction|not live data/i,
    `Placeholder evidence ${evidence.id} must be labeled on the visible surface`,
  );
}

assert.doesNotMatch(home, /\.\.\.siteContent|evidence\s*:/, "Public page props must explicitly omit the evidence registry");
assert.match(home, /flows:\s*siteContent\.flows/, "Public page props must select case flows explicitly");

const componentIds = new Set(components.components.map((component) => component.id));
for (const required of [
  "PortfolioHero",
  "CaseIndexRow",
  "TraceSpine",
  "DecisionNode",
  "EvidencePlate",
  "BoundaryNote",
  "SourceDrawer",
]) {
  assert.ok(componentIds.has(required), `Missing required component contract: ${required}`);
}

const implementationCache = new Map();
for (const component of components.components) {
  assert.ok(component.implementation, `${component.id} requires an implementation pointer`);
  const implementationPath = resolve(root, component.implementation.path);
  await access(implementationPath);
  let implementation = implementationCache.get(implementationPath);
  if (!implementation) {
    implementation = await readFile(implementationPath, "utf8");
    implementationCache.set(implementationPath, implementation);
  }
  assert.match(
    implementation,
    new RegExp(`export function ${component.implementation.export}\\b`),
    `${component.id} points to a missing export`,
  );
  assert.ok(
    css.includes(component.implementation.selector),
    `${component.id} points to a missing CSS specimen selector`,
  );
}

for (const [name, token] of Object.entries(tokens.color)) {
  assertCssToken(css.toLowerCase(), token.cssVariable, token.value.toLowerCase(), `CSS token drift: color.${name}`);
  assert.ok(css.includes(`var(${token.cssVariable})`), `Color token ${name} must be consumed`);
}

const typeRoles = ["display", "body", "mono"];
for (const role of typeRoles) {
  const token = tokens.type[role];
  assert.ok(layout.includes(token.nextFontExport), `Layout must import ${token.nextFontExport}`);
  assert.ok(layout.includes(`variable: "${token.cssVariable}"`), `Layout must bind ${token.cssVariable}`);
  assert.ok(css.includes(`var(${token.cssVariable})`), `CSS must consume type.${role}`);
}
for (const [name, token] of Object.entries(tokens.type).filter(([, value]) => value.cssVariable && value.value)) {
  assertCssToken(css, token.cssVariable, token.value, `CSS token drift: type.${name}`);
}
const approvedFontVariables = new Set(typeRoles.map((role) => tokens.type[role].cssVariable));
for (const match of css.matchAll(/font-family:\s*var\((--[a-z-]+)\)[^;]*;/g)) {
  assert.ok(approvedFontVariables.has(match[1]), `Unapproved font variable ${match[1]}`);
}
assert.equal(
  (css.match(/font-family:/g) ?? []).length,
  [...css.matchAll(/font-family:\s*var\((--[a-z-]+)\)[^;]*;/g)].length,
  "Every font-family declaration must use an approved role variable",
);
const approvedWeights = new Set(typeRoles.flatMap((role) => tokens.type[role].weights));
for (const match of css.matchAll(/font-weight:\s*(\d+)\s*;/g)) {
  assert.ok(approvedWeights.has(Number(match[1])), `Uncontracted font weight ${match[1]}`);
}

for (const [name, value] of Object.entries(tokens.space)) {
  assertCssToken(css, `--space-${name}`, value, `CSS token drift: space.${name}`);
}
for (const [name, token] of Object.entries(tokens.surface)) {
  assertCssToken(css, token.cssVariable, token.value, `CSS token drift: surface.${name}`);
  assert.ok(css.includes(`var(${token.cssVariable})`), `Surface token ${name} must be consumed`);
}

for (const [name, token] of Object.entries(tokens.grid.desktop)) {
  assertCssToken(css, token.cssVariable, token.value, `CSS token drift: grid.desktop.${name}`);
}
for (const breakpoint of ["tablet", "mobile"]) {
  const grid = tokens.grid[breakpoint];
  const block = extractMediaBlock(css, grid.breakpoint.value);
  for (const name of ["columns", "gutter", "pageEdge"]) {
    assertCssToken(block, grid[name].cssVariable, grid[name].value, `CSS token drift: grid.${breakpoint}.${name}`);
  }
}
assert.ok(css.includes("repeat(var(--grid-columns)"), "Page grids must consume --grid-columns");
assert.ok(css.includes("gap: var(--grid-gutter)"), "Page grids must consume --grid-gutter");
assert.ok(css.includes("var(--page-edge)"), "Page frames must consume --page-edge");
assert.ok(css.includes("var(--page-max)"), "Page frames must consume --page-max");

const durationVariables = {
  instant: "--dur-instant",
  micro: "--dur-micro",
  backdrop: "--dur-backdrop",
  state: "--dur-state",
  control: "--dur-control",
  context: "--dur-context",
  panelExit: "--dur-panel-exit",
  panel: "--dur-panel",
  reveal: "--dur-reveal",
  route: "--dur-route",
  traceIntro: "--dur-trace-intro",
  hero: "--dur-hero",
};
const reservedDurationTokens = new Set(["instant", "route"]);
for (const [name, value] of Object.entries(motion.durationMs)) {
  const variable = durationVariables[name];
  assert.ok(variable, `durationMs.${name} requires a CSS variable mapping`);
  assertCssToken(css, variable, `${value}ms`, `Motion token drift: durationMs.${name}`);
  if (!reservedDurationTokens.has(name)) {
    assert.ok(css.includes(`var(${variable})`), `Motion duration ${name} must be consumed`);
  }
}
const easingVariables = {
  enter: "--ease-enter",
  standard: "--ease-standard",
  route: "--ease-route",
  exit: "--ease-exit",
};
for (const [name, value] of Object.entries(motion.easing)) {
  const variable = easingVariables[name];
  assertCssToken(css, variable, value, `Motion token drift: easing.${name}`);
  if (name !== "route") assert.ok(css.includes(`var(${variable})`), `Motion easing ${name} must be consumed`);
}

const limitVariables = {
  heroTravelDesktopPx: "--travel-hero-desktop",
  heroTravelMobilePx: "--travel-hero-mobile",
  sectionTravelDesktopPx: "--travel-section-desktop",
  sectionTravelMobilePx: "--travel-section-mobile",
  hoverLiftPx: "--travel-hover",
};
for (const [name, variable] of Object.entries(limitVariables)) {
  assertCssToken(css, variable, `${motion.limits[name]}px`, `Motion token drift: limits.${name}`);
  assert.ok(css.includes(`var(${variable})`), `Motion limit ${name} must be consumed`);
}
for (const match of css.matchAll(/(?<![XY])scale\(\s*([0-9.]+)/g)) {
  assert.ok(
    Number(match[1]) <= 1 + motion.limits.maxScalePercent / 100,
    `Scale ${match[1]} exceeds maxScalePercent`,
  );
}

const entranceIds = new Set();
for (const item of motion.entrance) {
  assert.ok(!entranceIds.has(item.id), `Duplicate entrance id ${item.id}`);
  entranceIds.add(item.id);
  assert.equal(item.durationMs, motion.durationMs[item.durationToken], `Entrance ${item.id} duration token drift`);
  assertCssToken(css, item.delayCssVariable, `${item.atMs}ms`, `Entrance timing drift: ${item.id}`);
  assert.ok(css.includes(`var(${item.delayCssVariable})`), `Entrance ${item.id} delay must be consumed`);
}
assert.ok(
  Math.max(...motion.entrance.map((item) => item.atMs + item.durationMs)) <= motion.limits.maxEntranceTotalMs,
  "Entrance exceeds maxEntranceTotalMs",
);
const headlineEntrances = motion.entrance.filter((item) => item.id.startsWith("headline-"));
assert.ok(headlineEntrances.length <= motion.limits.maxStaggerItems, "Headline stagger exceeds maxStaggerItems");
assert.ok(
  Math.max(...headlineEntrances.map((item) => item.atMs)) - Math.min(...headlineEntrances.map((item) => item.atMs)) <=
    motion.limits.maxStaggerTotalMs,
  "Headline stagger exceeds maxStaggerTotalMs",
);
assert.match(css, /intro-navigation[\s\S]*?translateY\(-6px\)/, "Navigation entrance effect drifted");
assert.match(css, /intro-context[\s\S]*?translateY\(8px\)/, "Context entrance effect drifted");

for (const [name, value] of Object.entries({
  narrative: motion.chapterRules.narrativeDelayMs,
  artifact: motion.chapterRules.artifactDelayMs,
})) {
  const variable = `--chapter-${name}-delay`;
  assertCssToken(css, variable, `${value}ms`, `Chapter delay drift: ${name}`);
  assert.ok(css.includes(`var(${variable})`), `Chapter delay ${name} must be consumed`);
}
for (const property of ["enterAtViewportPercent", "activeAtViewportPercent"]) {
  assert.ok(page.includes(`motionSystem.chapterRules.${property}`), `Runtime must consume chapterRules.${property}`);
}
for (const state of motion.chapterStates) {
  assert.ok(page.includes(`"${state}"`), `Runtime must emit chapter state ${state}`);
}

for (const [name, value] of Object.entries({
  base: motion.trace.baseWidthPx,
  progress: motion.trace.progressWidthPx,
})) {
  const variable = `--trace-width-${name}`;
  assertCssToken(css, variable, `${value}px`, `Trace width drift: ${name}`);
  assert.ok(css.includes(`var(${variable})`), `Trace width ${name} must be consumed`);
}
for (const [name, value] of Object.entries({
  dormant: motion.trace.dormantNodePx,
  active: motion.trace.activeNodePx,
  complete: motion.trace.completeNodePx,
})) {
  const variable = `--trace-node-${name}`;
  assertCssToken(css, variable, `${value}px`, `Trace node drift: ${name}`);
  assert.ok(css.includes(`var(${variable})`), `Trace node ${name} must consume its token`);
}
for (const property of ["segmentStartViewportPercent", "segmentEndViewportPercent"]) {
  assert.ok(page.includes(`motionSystem.trace.${property}`), `Runtime must consume trace.${property}`);
}
assert.equal(motion.trace.scrollLinked, true, "Trace progress contract must remain scroll-linked");
assert.equal(motion.trace.delayedCatchup, false, "Trace progress must not lag scroll state");
assert.doesNotMatch(css, /\.trace-progress\s*\{[^}]*transition[^;}]*transform/s, "Trace progress may not ease behind scroll");

// Mutation probes prove representative contract families fail closed.
for (const [variable, value] of [
  [tokens.color.signal.cssVariable, tokens.color.signal.value.toLowerCase()],
  [tokens.surface.radiusSmall.cssVariable, tokens.surface.radiusSmall.value],
  [durationVariables.hero, `${motion.durationMs.hero}ms`],
  [easingVariables.enter, motion.easing.enter],
  [limitVariables.heroTravelDesktopPx, `${motion.limits.heroTravelDesktopPx}px`],
]) {
  const normalizedCss = variable.startsWith("--signal") ? css.toLowerCase() : css;
  const mutated = normalizedCss.replace(cssDeclaration(variable, value), cssDeclaration(variable, "__mutated__"));
  assert.equal(hasCssDeclaration(mutated, variable, value), false, `Mutation probe failed for ${variable}`);
}
assert.equal(approvedWeights.has(999), false, "Weight mutation probe must fail closed");
assert.equal(css.includes("@media (max-width: 9999px)"), false, "Breakpoint mutation probe must fail closed");

assert.match(css, /prefers-reduced-motion:\s*reduce/, "Reduced-motion rules are required");
assert.match(css, /prefers-reduced-motion:[\s\S]*animation-delay:\s*0ms\s*!important/, "Reduced motion must remove entrance delays");
assert.match(css, /focus-visible/, "Visible keyboard focus rules are required");
assert.match(page, /aria-current/, "Trace navigation must expose its active step");
assert.match(page, /aria-haspopup="dialog"/, "Evidence disclosure must announce its dialog");
assert.match(page, /\.showModal\(\)/, "Source drawer must use native modal behavior");
assert.match(page, /source-fallback/, "Evidence requires a no-JavaScript anchor fallback");

for (const forbidden of [
  /transition\s*:\s*all/i,
  /animation[^;]*infinite/i,
  /cursor\s*:\s*none/i,
  /scroll-snap-type/i,
]) {
  assert.doesNotMatch(css, forbidden, `Forbidden motion or interaction pattern found: ${forbidden}`);
}

for (const movedContent of [
  "CASE 02 / FYXED",
  "This is where another person’s exact words carry the proof.",
  "External adoption remains unproven.",
]) {
  assert.doesNotMatch(page, new RegExp(movedContent.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), "Case copy belongs in content/site.json");
}

assert.equal((page.match(/<h1\b/g) ?? []).length, 1, "The living specimen must contain exactly one h1");

console.log(`Decision Trace v${manifest.version} contract validated.`);
