import assert from "node:assert/strict";
import test from "node:test";
import { nextThesisStage } from "../lib/thesis-state.js";

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

test("opens directly on the Fyxed repair contradiction", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Sergey Kudelin \| Product vision and build<\/title>/i);
  assert.match(html, /At Fyxed, a repair changed who the product had to ask\./i);
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  assert.ok(main.indexOf("Fyxed") < main.indexOf("FutureClinic"), "Fyxed must be the opening case");
  assert.match(html, /Would the owner choose to cover the financing cost/);
  assert.match(html, /contractual and accounting validation/);
  assert.match(html, /owner-paid path is still unverified/i);
  assert.match(html, /data-enhanced="false"/i);
  assert.match(html, /Move the cost choice to the owner/);
  assert.match(html, /Founder attribution and usage outcomes stay out/i);
  assert.match(html, /https:\/\/github\.com\/Seryozh\/sergeykudelin-portfolio/);
  assert.doesNotMatch(html, /Decision Trace|Field Entry|FLOW SPECIMEN|CURRENT MAP STATE/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("cycles the Fyxed thesis through proposal, proof gap, and reset", () => {
  assert.equal(nextThesisStage(0), 1);
  assert.equal(nextThesisStage(1), 2);
  assert.equal(nextThesisStage(2), 0);
});

test("server output contains the complete static story and clean semantics", async () => {
  const response = await render();
  const html = await response.text();
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.match(html, /<main[^>]+id="main-content"[^>]+tabindex="-1"/i);
  assert.match(html, /<button[^>]+type="button"[^>]+aria-describedby="[^"]+"/i);
  assert.match(html, /aria-live="polite"/i);
  assert.doesNotMatch(html, /aria-expanded|aria-pressed/i);
  assert.match(html, /class="owner-proposal"/i);
  assert.match(html, /class="unknowns"/i);
  assert.match(html, /class="futureclinic-note"/i);
});
