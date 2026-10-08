import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../middleware.js", import.meta.url), "utf8");
const { default: middleware } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
const TOKEN_KEY = "PORTFOLIO_TELEGRAM_BOT_TOKEN";
const CHAT_KEY = "PORTFOLIO_TELEGRAM_CHAT_ID";
const HUMAN_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";

function setup(t, fetchImpl) {
  const oldFetch = globalThis.fetch;
  const oldWarn = console.warn;
  const oldInfo = console.info;
  const oldToken = process.env[TOKEN_KEY];
  const oldChat = process.env[CHAT_KEY];
  process.env[TOKEN_KEY] = "test-secret-only";
  process.env[CHAT_KEY] = "12345";
  const calls = [], warnings = [], infos = [], pending = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options, body: JSON.parse(options.body) });
    return fetchImpl ? fetchImpl(url, options, calls.length) : Response.json({ ok: true });
  };
  console.warn = (...args) => warnings.push(args);
  console.info = (...args) => infos.push(args);
  t.after(() => {
    globalThis.fetch = oldFetch;
    console.warn = oldWarn;
    console.info = oldInfo;
    if (oldToken === undefined) delete process.env[TOKEN_KEY]; else process.env[TOKEN_KEY] = oldToken;
    if (oldChat === undefined) delete process.env[CHAT_KEY]; else process.env[CHAT_KEY] = oldChat;
  });
  return { calls, warnings, infos, pending, context: { waitUntil(promise) { pending.push(promise); } } };
}

function request(path = "/", headers = {}, options = {}) {
  return new Request(`https://sergeykudelin.com${path}`, {
    headers: { "user-agent": HUMAN_UA, ...headers }, ...options,
  });
}

test("human visit reports canonical destination, safe source, geo, device and ET time", async (t) => {
  const state = setup(t);
  const response = await middleware(request("/portfolio/ai-team.html?secret=omit", {
    referer: "https://www.linkedin.com/feed/?secret=omit#fragment",
    "x-vercel-ip-city": "New%20York", "x-vercel-ip-country-region": "NY", "x-vercel-ip-country": "US",
  }), state.context);
  await Promise.all(state.pending);
  assert.equal(response.headers.get("x-middleware-next"), "1");
  assert.equal(state.calls.length, 1);
  assert.match(state.calls[0].body.text, /Посетитель/);
  assert.match(state.calls[0].body.text, /Переход на страницу/);
  assert.match(state.calls[0].body.text, /Куда: https:\/\/sergeykudelin.com\/portfolio\/ai-team.html\n/);
  assert.match(state.calls[0].body.text, /Откуда: https:\/\/www.linkedin.com\/feed\/\n/);
  assert.match(state.calls[0].body.text, /New York, NY, US/);
  assert.match(state.calls[0].body.text, /Chrome, компьютер/);
  assert.match(state.calls[0].body.text, /Время: .+ ET/);
  assert.doesNotMatch(state.calls[0].body.text, /secret|fragment/);
  assert.deepEqual(state.calls[0].body.link_preview_options, { is_disabled: true });
  assert.equal(state.calls[0].body.parse_mode, undefined);
  assert.ok(state.calls[0].options.signal instanceof AbortSignal);
  assert.equal(state.infos.length, 0);
});

test("known documents are labeled and PDF range follow-ups do not duplicate opens", async (t) => {
  const state = setup(t);
  for (const path of ["/resume", "/resume.pdf", "/recommendation.pdf", "/work/ai-storyboard.pdf", "/skill", "/skill.md", "/man.txt"]) {
    await middleware(request(path), state.context);
  }
  await middleware(request("/resume.pdf", { range: "bytes=100-200" }), state.context);
  await middleware(request("/work/ai-storyboard.pdf", { range: "bytes=0-65535" }), state.context);
  await Promise.all(state.pending);
  assert.equal(state.calls.length, 7);
  for (const call of state.calls) assert.match(call.body.text, /Открытие \/ скачивание документа/);
});

test("preview bots are explicitly labeled; curl root keeps its man-page rewrite", async (t) => {
  const state = setup(t);
  await middleware(request("/", { "user-agent": "LinkedInBot/1.0" }), state.context);
  const rewritten = await middleware(request("/", { "user-agent": "curl/8.0" }), state.context);
  await Promise.all(state.pending);
  assert.equal(state.calls.length, 2);
  assert.match(state.calls[0].body.text, /Бот \/ предпросмотр/);
  assert.match(state.calls[1].body.text, /Бот \/ предпросмотр/);
  assert.equal(rewritten.headers.get("x-middleware-rewrite"), "https://sergeykudelin.com/man.txt");
  assert.equal(rewritten.headers.get("x-middleware-next"), null);
});

test("assets, unknown pages, HEAD and speculative loads do not send Telegram", async (t) => {
  const state = setup(t);
  for (const path of ["/styles.css", "/favicon.ico", "/assets/logo.png", "/missing.html", "/api/visit", "/prototypes/notebook/", "/portfolio/ai-team"]) {
    await middleware(request(path), state.context);
  }
  await middleware(request("/", {}, { method: "HEAD" }), state.context);
  for (const headers of [{ purpose: "prefetch" }, { "sec-purpose": "prefetch;prerender" }, { "x-purpose": "prerender" }, { "x-moz": "prefetch" }]) {
    await middleware(request("/", headers), state.context);
  }
  await Promise.all(state.pending);
  assert.equal(state.calls.length, 0);
});

test("redirect-only portfolio entry paths only notify at their destination", async (t) => {
  const state = setup(t);
  for (const path of ["/portfolio", "/portfolio/", "/portfolio/index.html", "/"]) {
    await middleware(request(path), state.context);
  }
  await Promise.all(state.pending);
  assert.equal(state.calls.length, 1);
  assert.match(state.calls[0].body.text, /Куда: https:\/\/sergeykudelin.com\/\n/);
});

test("only verified public production hosts notify", async (t) => {
  const state = setup(t);
  for (const host of ["www.sergeykudelin.com", "sergeykudelin-portfolio.vercel.app", "random-preview.vercel.app", "localhost", "sergeykudelin.com.attacker.test"]) {
    await middleware(new Request(`https://${host}/`, { headers: { "user-agent": HUMAN_UA } }), state.context);
  }
  await Promise.all(state.pending);
  assert.equal(state.calls.length, 2);
  for (const call of state.calls) assert.match(call.body.text, /Куда: https:\/\/sergeykudelin.com\/\n/);
});

test("missing either credential quietly keeps serving pages", async (t) => {
  const state = setup(t);
  delete process.env[TOKEN_KEY];
  assert.equal((await middleware(request(), state.context)).headers.get("x-middleware-next"), "1");
  process.env[TOKEN_KEY] = "test-secret-only";
  delete process.env[CHAT_KEY];
  await middleware(request(), state.context);
  assert.equal(state.calls.length, 0);
  assert.equal(state.warnings.length, 0);
});

test("malformed geo/referrer are safe and real Florida visitors still notify", async (t) => {
  const state = setup(t);
  await middleware(request("/", {
    "x-vercel-ip-city": "%E0%A4%A", "x-vercel-ip-country-region": "FL", "x-vercel-ip-country": "US",
    referer: "javascript:doNotEchoThis()",
  }), state.context);
  await Promise.all(state.pending);
  assert.equal(state.calls.length, 1);
  assert.match(state.calls[0].body.text, /%E0%A4%A, FL, US/);
  assert.match(state.calls[0].body.text, /источник скрыт/);
  assert.doesNotMatch(state.calls[0].body.text, /doNotEchoThis/);
});

test("test query only adds a marker and never bypasses filtering", async (t) => {
  const state = setup(t, () => Response.json({ ok: true, result: { message_id: 42 } }));
  for (const path of ["/?notification_test=1", "/?notification_test=0", "/missing.html?notification_test=1"]) {
    await middleware(request(path), state.context);
  }
  await Promise.all(state.pending);
  assert.equal(state.calls.length, 2);
  assert.match(state.calls[0].body.text, /^\[TEST\]/);
  assert.doesNotMatch(state.calls[1].body.text, /\[TEST\]/);
  assert.deepEqual(state.infos, [["Portfolio Telegram test delivered", { messageId: 42 }]]);
});

test("only named UTM fields are included, bounded to a single line", async (t) => {
  const state = setup(t);
  const query = new URLSearchParams({
    utm_source: "linkedin\nforged line", utm_medium: "social", utm_campaign: "x".repeat(150),
    email: "private@example.com", token: "private-token",
  });
  await middleware(request(`/?${query}`), state.context);
  await Promise.all(state.pending);
  assert.match(state.calls[0].body.text, /Кампания: utm_source=linkedin forged line; utm_medium=social; utm_campaign=x{100}\n/);
  assert.doesNotMatch(state.calls[0].body.text, /private@example|private-token|x{101}/);
});

test("waitUntil returns the site response before notification completes", async (t) => {
  let finish;
  const unresolved = new Promise((resolve) => { finish = resolve; });
  const state = setup(t, () => unresolved);
  const response = await middleware(request(), state.context);
  assert.equal(response.headers.get("x-middleware-next"), "1");
  assert.equal(state.pending.length, 1);
  finish(Response.json({ ok: true }));
  await Promise.all(state.pending);
});

test("Telegram 429 retries once when retry_after fits the bound", async (t) => {
  const state = setup(t, (url, options, attempt) => attempt === 1
    ? Response.json({ ok: false, error_code: 429, parameters: { retry_after: 0 } }, { status: 429 })
    : Response.json({ ok: true }));
  await middleware(request(), state.context);
  await Promise.all(state.pending);
  assert.equal(state.calls.length, 2);
  assert.equal(state.warnings.length, 0);
});

test("long rate limits are bounded and errors never expose the bot token", async (t) => {
  const state = setup(t, () => Response.json({ ok: false, error_code: 429, description: "test-secret-only", parameters: { retry_after: 60 } }, { status: 429 }));
  const response = await middleware(request(), state.context);
  await Promise.all(state.pending);
  assert.equal(response.headers.get("x-middleware-next"), "1");
  assert.equal(state.calls.length, 1);
  assert.equal(state.warnings.length, 1);
  assert.doesNotMatch(JSON.stringify(state.warnings), /test-secret-only|api.telegram.org/);
});

test("network failures retry once and never break pages or leak exception URLs", async (t) => {
  const state = setup(t, () => { throw new Error("https://api.telegram.org/bottest-secret-only/sendMessage"); });
  const response = await middleware(request(), state.context);
  await Promise.all(state.pending);
  assert.equal(response.headers.get("x-middleware-next"), "1");
  assert.equal(state.calls.length, 2);
  assert.equal(state.warnings.length, 1);
  assert.doesNotMatch(JSON.stringify(state.warnings), /test-secret-only|api.telegram.org/);
});

test("legacy Soda ntfy runs in waitUntil and retains its Florida exclusion/test flag", async (t) => {
  const state = setup(t);
  await middleware(request("/soda/thinking-terminal.png", { "x-vercel-ip-country": "US", "x-vercel-ip-country-region": "FL" }), state.context);
  await middleware(request("/soda/thinking-terminal.png", { "x-vercel-ip-country": "DE", "x-vercel-ip-city": "Berlin" }), state.context);
  await middleware(request("/soda/thinking-terminal.png?test", { "x-vercel-ip-country": "US", "x-vercel-ip-country-region": "FL" }), state.context);
  await Promise.all(state.pending);
  assert.equal(state.calls.length, 2);
  assert.ok(state.calls.every((call) => call.url === "https://ntfy.sh/"));
  assert.match(state.calls[0].body.title, /Berlin/);
  assert.match(state.calls[1].body.title, /^TEST /);
  assert.equal(state.pending.length, 3);
});
