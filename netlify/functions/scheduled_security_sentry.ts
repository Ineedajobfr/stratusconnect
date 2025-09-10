import { createClient } from "@supabase/supabase-js";

export const config = { schedule: "@every 5m" };

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

export default async () => {
  const since = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("events")
    .select("id,type,subtype,occurred_at,payload,actor_id")
    .gt("occurred_at", since)
    .in("type", ["auth.login", "auth.mfa", "messages.sent", "marketplace.bid", "users.update"]);

  if (error) throw error;

  const suspicious = [];
  for (const e of data ?? []) {
    if (e.type === "messages.sent" && e.payload?.containsPhone === true) suspicious.push(e);
    if (e.type === "auth.login" && e.payload?.geoMismatch === true) suspicious.push(e);
    if (e.type === "marketplace.bid" && e.payload?.offPlatformContact === true) suspicious.push(e);
  }

  if (suspicious.length > 0) {
    await supabase.from("agent_reports").insert({
      agent: "security_sentry",
      topic: "Suspicious behaviour",
      summary: `Found ${suspicious.length} suspicious events in last five minutes`,
      details: { ids: suspicious.map((s) => s.id) },
      severity: "medium",
    });
  }

  return new Response("OK");
};
