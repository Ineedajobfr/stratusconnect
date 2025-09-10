import { createClient } from "@supabase/supabase-js";

export const config = { path: "/api/cert/revoke" };
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);

export default async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const { id, reason, amount_numeric, summary } = await req.json();
  if (!id || !summary) return new Response("Missing fields", { status: 400 });

  // Create high value transaction
  const txIns = await supabase.from("hv_transactions").insert({
    kind: "cert.revoke",
    target_id: id,
    summary,
    amount_numeric
  }).select("id").limit(1);
  
  if (txIns.error) return new Response(txIns.error.message, { status: 500 });
  const txId = txIns.data![0].id;

  // Check if this is a forced revoke (bypass approval for now)
  const url = new URL(req.url);
  const force = url.searchParams.get("force") === "1";
  if (!force) {
    return new Response(JSON.stringify({ txId, status: "pending_approval" }), { 
      headers: { "Content-Type": "application/json" } 
    });
  }

  const upd = await supabase.from("certificates").update({ status: "revoked" }).eq("id", id);
  if (upd.error) return new Response(upd.error.message, { status: 500 });

  // Ledger entry
  await supabase.from("ledger").insert({
    type: "cert.revoke",
    subject: id,
    payload: { reason: reason ?? "revoked" }
  });

  // Log revocation event
  await supabase.from("certificate_events").insert({
    certificate_id: id,
    event_type: "revoked",
    meta: { reason: reason ?? "revoked" },
  });

  return new Response(JSON.stringify({ txId, status: "revoked" }), { 
    headers: { "Content-Type": "application/json" } 
  });
};
