import { createClient } from "@supabase/supabase-js";

export const config = { path: "/api/hv/approve" };

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);

const REQUIRED = 2; // M of N approvals needed

export default async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const { txId, adminId, assertion } = await req.json();
  if (!txId || !adminId || !assertion) return new Response("Missing", { status: 400 });

  // at this point you should have validated assertion via webauthn_auth_verify flow on client
  await supabase.from("hv_approvals").insert({ tx_id: txId, admin_id: adminId, assertion });

  const { data: approvals } = await supabase.from("hv_approvals").select("id").eq("tx_id", txId);
  if ((approvals?.length ?? 0) >= REQUIRED) {
    await supabase.from("hv_transactions").update({ status: "approved" }).eq("id", txId);
    await supabase.from("ledger").insert({ 
      type: "tx.approved", 
      subject: txId, 
      payload: { approvals: approvals?.length ?? 0 } 
    });
    return new Response(JSON.stringify({ status: "approved", txId }), { 
      headers: { "Content-Type": "application/json" } 
    });
  }
  return new Response(JSON.stringify({ status: "pending", approvals: approvals?.length ?? 0 }), { 
    headers: { "Content-Type": "application/json" } 
  });
};
