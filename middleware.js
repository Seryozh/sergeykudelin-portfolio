// "/" : curl, wget and httpie get the plain-text man page instead of the site.
// "/soda/thinking-terminal.png" : the comic on the Soda page. Only a browser that actually renders the page loads it
// (email link scanners usually fetch the HTML alone), so each load pings Sergey's phone through ntfy with the
// visitor's approximate city from Vercel's IP geolocation. Visits from Florida (his own) are skipped; add ?test to the image URL to force a ping.
export const config = { matcher: ["/", "/soda/thinking-terminal.png"] };

const NTFY = "https://ntfy.sh/", TOPIC = "sk-soda-fbbe0263c226";

export default async function middleware(request) {
  const url = new URL(request.url);
  const ua = request.headers.get("user-agent") || "";
  if (url.pathname === "/") {
    if (/curl|wget|httpie/i.test(ua)) {
      return new Response(null, {
        headers: { "x-middleware-rewrite": new URL("/man.txt", request.url).toString() },
      });
    }
    return new Response(null, { headers: { "x-middleware-next": "1" } });
  }
  const h = request.headers;
  const country = h.get("x-vercel-ip-country") || "?";
  const region = h.get("x-vercel-ip-country-region") || "";
  const city = decodeURIComponent(h.get("x-vercel-ip-city") || "?");
  const test = url.searchParams.has("test");
  if (test || !(country === "US" && region === "FL")) {
    const ping = fetch(NTFY, {
      method: "POST",
      body: JSON.stringify({
        topic: TOPIC,
        title: `${test ? "TEST " : ""}Soda page opened: ${city}, ${region} ${country}`,
        message: ua.slice(0, 200) || "no user agent",
        tags: ["eyes"],
      }),
    }).catch(() => {});
    await Promise.race([ping, new Promise((r) => setTimeout(r, 1500))]);
  }
  return new Response(null, { headers: { "x-middleware-next": "1" } });
}
