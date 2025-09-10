import type { Context } from "https://edge.netlify.com";

export default async (req: Request, ctx: Context) => {
  const ua = req.headers.get("user-agent") ?? "";
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  
  // Block obvious attack tools
  if (ua.includes("sqlmap") || ua.includes("nikto") || ua.includes("nmap")) {
    return new Response("Forbidden", { status: 403 });
  }
  
  // Block suspicious patterns
  if (ua.includes("bot") && !ua.includes("googlebot") && !ua.includes("bingbot")) {
    // Allow legitimate bots but block suspicious ones
    if (ua.includes("scraper") || ua.includes("crawler")) {
      return new Response("Forbidden", { status: 403 });
    }
  }
  
  // Add security headers
  const response = await ctx.next();
  
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "no-referrer");
  
  return response;
};
