export const config = { matcher: "/" };

export default function middleware(request) {
  const ua = request.headers.get("user-agent") || "";
  if (/curl|wget|httpie/i.test(ua)) {
    return new Response(null, {
      headers: {
        "x-middleware-rewrite": new URL("/resume.txt", request.url).toString(),
      },
    });
  }
  return new Response(null, { headers: { "x-middleware-next": "1" } });
}
