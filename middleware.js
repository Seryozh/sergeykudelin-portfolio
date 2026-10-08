// Only known pages/documents notify Telegram; static assets and unknown URLs pass through.
// The existing Soda image alert remains separate, including its Florida exclusion.
export const config = { matcher: ["/:path*"] };

const NTFY = "https://ntfy.sh/", TOPIC = "sk-soda-fbbe0263c226";
const CANONICAL_ORIGIN = "https://sergeykudelin.com";
const PRODUCTION_HOSTS = new Set([
  "sergeykudelin.com", "www.sergeykudelin.com", "sergeykudelin-portfolio.vercel.app",
]);
const PAGE_PATHS = new Set([
  // /portfolio/ is only a meta-refresh shell; its destination / sends the alert.
  "/", "/index.html",
  "/soda", "/soda/", "/soda/index.html",
  ...[
    "content-for-doctors", "youtube", "lead-research", "slack-assistant", "ai-team",
    "second-brain", "email-outreach", "repair-offers",
  ].map((name) => `/portfolio/${name}.html`),
]);
const DOCUMENT_PATHS = new Set([
  "/resume", "/resume.pdf", "/recommendation.pdf", "/work/ai-storyboard.pdf",
  "/skill", "/skill.md", "/man.txt",
]);

function clean(value, length = 180) {
  return String(value || "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, length);
}

function decodeCity(value) {
  try { return clean(decodeURIComponent(value || "")); }
  catch { return clean(value); }
}

function referrerSource(value) {
  try {
    const referrer = new URL(value);
    if (referrer.protocol === "https:" || referrer.protocol === "http:") {
      return clean(`${referrer.origin}${referrer.pathname}`, 350);
    }
  } catch { /* A hidden or malformed referrer is normal. */ }
  return "не указан (прямой переход или источник скрыт)";
}

function browserDevice(ua) {
  const browser = /Edg(?:e|A|iOS)?\//i.test(ua) ? "Edge"
    : /OPR\/|Opera/i.test(ua) ? "Opera"
    : /SamsungBrowser\//i.test(ua) ? "Samsung Internet"
    : /Firefox\/|FxiOS\//i.test(ua) ? "Firefox"
    : /Chrome\/|CriOS\//i.test(ua) ? "Chrome"
    : /Safari\//i.test(ua) ? "Safari"
    : /curl/i.test(ua) ? "curl"
    : /wget/i.test(ua) ? "wget"
    : "не определён";
  const device = /iPad|Tablet|Android(?!.*Mobile)/i.test(ua) ? "планшет"
    : /Mobile|iPhone|iPod|Windows Phone/i.test(ua) ? "телефон" : "компьютер";
  return `${browser}, ${device}`;
}

function isSpeculative(request) {
  return ["purpose", "sec-purpose", "x-purpose", "x-moz"].some((name) =>
    /prefetch|prerender/i.test(request.headers.get(name) || ""));
}

function isBot(ua) {
  return /bot\b|crawler|spider|slurp|bingpreview|facebookexternalhit|facebot|whatsapp|skypeuripreview|headlesschrome|curl|wget|httpie|python-requests|go-http-client|lighthouse|pagespeed|uptimerobot/i.test(ua);
}

function notificationText(request, url, ua) {
  const h = request.headers;
  const location = [decodeCity(h.get("x-vercel-ip-city")), clean(h.get("x-vercel-ip-country-region")), clean(h.get("x-vercel-ip-country"))].filter(Boolean).join(", ") || "не определено";
  const time = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "America/New_York", dateStyle: "short", timeStyle: "medium",
  }).format(new Date());
  const marker = url.searchParams.get("notification_test") === "1" ? "[TEST] " : "";
  const action = DOCUMENT_PATHS.has(url.pathname) ? "Открытие / скачивание документа" : "Переход на страницу";
  const campaign = ["utm_source", "utm_medium", "utm_campaign"]
    .map((key) => [key, clean(url.searchParams.get(key), 100)])
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${value}`).join("; ");
  return [
    `${marker}${isBot(ua) ? "🤖 Бот / предпросмотр" : "👀 Посетитель"} · портфолио`,
    `Действие: ${action}`,
    `Куда: ${CANONICAL_ORIGIN}${clean(url.pathname, 350)}`,
    `Откуда: ${referrerSource(h.get("referer"))}`,
    ...(campaign ? [`Кампания: ${campaign}`] : []),
    `Место (примерно): ${location}`,
    `Браузер и устройство: ${browserDevice(ua)}`,
    `Время: ${time} ET`,
  ].join("\n");
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function sendTelegram(token, chatId, text) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    let retryMs = null;
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, link_preview_options: { is_disabled: true } }),
        signal: controller.signal,
      });
      const result = await response.json();
      if (response.ok && result.ok === true) {
        if (text.startsWith("[TEST] ")) {
          const messageId = Number(result.result?.message_id);
          console.info("Portfolio Telegram test delivered", {
            messageId: Number.isSafeInteger(messageId) ? messageId : null,
          });
        }
        return;
      }
      const code = Number(result.error_code) || response.status;
      const retryAfter = Number(result.parameters?.retry_after);
      if (attempt === 0 && code === 429 && Number.isFinite(retryAfter) && retryAfter >= 0 && retryAfter <= 3) {
        retryMs = Math.max(250, retryAfter * 1000);
      } else if (attempt === 0 && code >= 500) {
        retryMs = 500;
      } else {
        console.warn("Portfolio Telegram notification failed", { code });
      }
    } catch {
      // Never log the exception: fetch errors may contain the URL and bot token.
      if (attempt === 0) retryMs = 500;
      else console.warn("Portfolio Telegram notification failed", { reason: "network-or-timeout" });
    } finally {
      clearTimeout(timeout);
    }
    if (retryMs === null) return;
    await delay(retryMs);
  }
}

async function sodaNotification(request, url, ua) {
  const h = request.headers;
  const country = h.get("x-vercel-ip-country") || "?";
  const region = h.get("x-vercel-ip-country-region") || "";
  const city = decodeCity(h.get("x-vercel-ip-city")) || "?";
  const test = url.searchParams.has("test");
  if (!test && country === "US" && region === "FL") return;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    await fetch(NTFY, {
      method: "POST", signal: controller.signal,
      body: JSON.stringify({
        topic: TOPIC,
        title: `${test ? "TEST " : ""}Soda page opened: ${city}, ${region} ${country}`,
        message: ua.slice(0, 200) || "no user agent", tags: ["eyes"],
      }),
    });
  } catch { /* The legacy alert must never affect the page. */ }
  finally { clearTimeout(timeout); }
}

function keepAlive(context, promise) {
  if (typeof context?.waitUntil === "function") {
    context.waitUntil(promise);
    return;
  }
  return promise;
}

export default async function middleware(request, context) {
  const url = new URL(request.url);
  const ua = request.headers.get("user-agent") || "";
  const rewrite = url.pathname === "/" && /curl|wget|httpie/i.test(ua);
  const response = new Response(null, { headers: rewrite
    ? { "x-middleware-rewrite": new URL("/man.txt", request.url).toString() }
    : { "x-middleware-next": "1" },
  });
  if (request.method !== "GET" || isSpeculative(request)) return response;

  if (url.pathname === "/soda/thinking-terminal.png") {
    await keepAlive(context, sodaNotification(request, url, ua));
  }
  const token = process.env.PORTFOLIO_TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.PORTFOLIO_TELEGRAM_CHAT_ID?.trim();
  const isDocument = PAGE_PATHS.has(url.pathname) || DOCUMENT_PATHS.has(url.pathname);
  // PDF viewers fetch byte ranges after the initial document navigation.
  const range = request.headers.get("range");
  if (token && chatId && PRODUCTION_HOSTS.has(url.hostname) && isDocument && !range) {
    await keepAlive(context, sendTelegram(token, chatId, notificationText(request, url, ua)));
  }
  return response;
}
