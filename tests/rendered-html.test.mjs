import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

const routes = [
  ["/", "I get close to the problem, then build."],
  ["/work/futureclinic", "FutureClinic Creators"],
  ["/work/fyxed", "At Fyxed, growth keeps turning into product work."],
  ["/resume", "Sergey Kudelin"],
  ["/brief", "This site is part of the work."],
];

for (const [pathname, expected] of routes) {
  test(`renders ${pathname}`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    const html = await response.text();
    assert.match(html, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
    assert.match(html, /<meta[^>]+name="robots"[^>]+noindex/i);
    assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
    assert.doesNotMatch(html, /sergey-portrait|<img\b|<picture\b|rel="preload"[^>]+as="image"/i);
    assert.doesNotMatch(html, /15\s*%|12\s*%|—/);
    assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  });
}

test("returns the custom 404", async () => {
  const response = await render("/this-page-does-not-exist");
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /This page is not here/);
});

test("keeps public routes free of private source markers", async () => {
  for (const [pathname] of routes) {
    const response = await render(pathname);
    const html = await response.text();
    assert.doesNotMatch(html, /\/Users\/|drive\.google\.com|fyxed-ops|doctor-preview-pages/i);
  }
});
