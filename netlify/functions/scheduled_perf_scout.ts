import { createClient } from "@supabase/supabase-js";

export const config = { schedule: "@hourly" };

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

function scoreEvent(e: any) {
  if (e.type === "api.trace" && e.payload?.durationMs > 800) return true;
  if (e.type === "page.view" && e.payload?.ttfbMs > 400) return true;
  return false;
}

export default async () => {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("events")
    .select("id,type,payload")
    .gt("occurred_at", since)
    .in("type", ["api.trace", "page.view"]);

  if (error) throw error;

  const slow = (data ?? []).filter(scoreEvent);

  if (slow.length === 0) return new Response("OK");

  const suggestions = slow.slice(0, 50).map((e) => {
    if (e.type === "api.trace") {
      const endpoint = e.payload?.endpoint ?? "unknown";
      return `Endpoint ${endpoint} slow. Consider index review or cache for query keys shown in trace.`;
    }
    if (e.type === "page.view") {
      const route = e.payload?.route ?? "unknown";
      return `Page ${route} has slow TTFB. Consider static generation or server hints.`;
    }
    return "General performance issue";
  });

  await supabase.from("agent_reports").insert({
    agent: "perf_scout",
    topic: "Performance findings",
    summary: suggestions.join("\n"),
    details: { count: slow.length },
    severity: "low",
  });

  return new Response("OK");
};
