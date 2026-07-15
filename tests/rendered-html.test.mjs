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
  ["/", "I built for FutureClinic before I worked there."],
  ["/work/futureclinic", "The proof I built before the role became a much larger product."],
  ["/work/fyxed", "Growth work got useful when it reached the repair bill."],
  ["/resume", "Sergey Kudelin"],
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

test("renders the case presentation controls and evidence boundaries", async () => {
  for (const pathname of ["/work/futureclinic", "/work/fyxed"]) {
    const response = await render(pathname);
    const html = await response.text();
    assert.match(html, /Present this case/i);
    assert.match(html, /Evidence boundary/i);
    assert.match(html, /Scene 01/i);
    assert.match(html, /aria-label="Scene 1 of 5"/i);
    assert.match(html, /class="player-scene-number"[^>]*>05<\/span>/i);
    assert.match(html, /<dialog\b/i);
  }
});

test("keeps the retired strategy brief out of the public route set", async () => {
  const response = await render("/brief");
  assert.equal(response.status, 404);
});

test("redirects the retired static portfolio URLs", async () => {
  const redirects = [
    ["/journey.html", "/work/futureclinic"],
    ["/creators-showcase.html", "/work/futureclinic"],
    ["/outreach-showcase.html", "/work/futureclinic"],
    ["/resume.html", "/resume"],
    ["/resume.pdf", "/sergey-kudelin-resume.pdf"],
    ["/recommendation.pdf", "/futureclinic-recommendation.pdf"],
  ];

  for (const [pathname, destination] of redirects) {
    const response = await render(pathname);
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), destination);
  }
});

test("returns the custom 404", async () => {
  const response = await render("/this-page-does-not-exist");
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /This page is not here/);
});

test("renders the updated resume proof points", async () => {
  const response = await render("/resume");
  const html = await response.text();
  assert.match(html, /200,000 subscribers/i);
  assert.match(html, /Misc facts about me/i);
  assert.match(html, /broken-screen MacBook/i);
  assert.match(html, /remote agent host over SSH/i);
  assert.match(html, /orchestrating AI systems around real tasks/i);
  assert.doesNotMatch(html, /machine underneath it/i);
  assert.match(html, /University of Florida/i);
  assert.match(html, /Florida International University/i);
  assert.match(html, /245 YouTube channels/i);
  assert.match(html, /3,600 property-management companies/i);
  assert.match(html, /original end-to-end/i);
  assert.match(html, /The product is live today/i);
  assert.doesNotMatch(html, /first working version/i);
  assert.doesNotMatch(html, /core engine/i);
  assert.doesNotMatch(html, /live request/i);
  assert.doesNotMatch(html, /first meeting booked through outbound/i);
});

test("keeps public routes free of private source markers", async () => {
  for (const [pathname] of routes) {
    const response = await render(pathname);
    const html = await response.text();
    assert.doesNotMatch(html, /\/Users\/|drive\.google\.com|fyxed-ops|doctor-preview-pages/i);
  }
});

test("publishes the bespoke social card metadata", async () => {
  const response = await render("/");
  const html = await response.text();
  assert.match(html, /property="og:image"[^>]+content="https:\/\/sergeykudelin\.com\/og\.png"/i);
  assert.match(html, /name="twitter:image"[^>]+content="https:\/\/sergeykudelin\.com\/og\.png"/i);
});
