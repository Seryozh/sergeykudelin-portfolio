import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Decision Trace specimen", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Sergey Kudelin — Decision Trace<\/title>/i);
  assert.match(html, /The work is the/);
  assert.match(html, /FutureClinic/);
  assert.match(html, /Fyxed/);
  assert.match(html, /FLOW SPECIMEN/);
  assert.match(html, /ATTRIBUTION BOUNDARY/);
  assert.match(html, /CONTENT IS PLACEHOLDER/);
  assert.match(html, /class="case-row"[^>]*href="#case-futureclinic"[^>]*aria-label="FutureClinic: Open flow specimen"/i);
  assert.match(html, /data-artifact-variant="workflow-system"/i);
  assert.match(html, /data-artifact-variant="repair-statement"/i);
  assert.match(html, /<ol class="workflow-stages">/i);
  assert.match(html, /Production control room/i);
  assert.match(html, /\$4,860\.00/i);
  assert.match(html, /class="source-fallback"[^>]*id="fyxed-source-static-signal"/i);
  assert.match(html, /<dialog[^>]+id="source-drawer"/i);
  assert.doesNotMatch(html, /Placeholder excerpt created for the design-system specimen/i);
  assert.doesNotMatch(html, /"permission":"reconstruction-only"/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("renders semantic navigation and one top-level heading", async () => {
  const response = await render();
  const html = await response.text();
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.match(html, /<main[^>]+id="main-content"/i);
  assert.match(html, /aria-label="Primary navigation"/i);
  assert.match(html, /aria-label="CASE 02 \/ FYXED trace"/i);
  assert.match(html, /aria-controls="source-drawer"/i);
  assert.match(html, /aria-haspopup="dialog"/i);
});
