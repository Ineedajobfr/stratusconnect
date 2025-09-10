import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

export default async () => {
  // compact info level events older than seven days
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("events")
    .select("id, payload, severity")
    .lt("occurred_at", since)
    .eq("severity", "info")
    .limit(500);

  if (error) throw error;
  if (!data?.length) return new Response("OK");

  // delete or summarise. here we delete for simplicity
  const ids = data.map((d) => d.id);
  const { error: delErr } = await supabase.from("events").delete().in("id", ids);
  if (delErr) throw delErr;

  await supabase.from("agent_reports").insert({
    agent: "data_janitor",
    topic: "Event compaction",
    summary: `Compacted ${ids.length} info events older than seven days`,
    severity: "low",
  });

  return new Response("OK");
};
