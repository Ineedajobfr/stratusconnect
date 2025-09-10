// Deno runtime
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type ActionBody = {
  agent: string;
  action: string;
  target: string;
  patch: Record<string, unknown>;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE")!
  );

  const body = (await req.json()) as ActionBody;

  // minimal validation
  if (!body.agent || !body.action || !body.target || !body.patch) {
    return new Response("Invalid payload", { status: 400, headers: corsHeaders });
  }

  // check policy rules
  const { data: rules } = await supabase
    .from("policy_rules")
    .select("*")
    .eq("enabled", true);

  const deny = rules?.some((r) => r.effect === "deny" && r.scope === body.action);
  if (deny) return new Response("Denied by policy", { status: 403, headers: corsHeaders });

  // apply patch through guarded RPC
  const { error: rpcErr } = await supabase.rpc("apply_agent_patch", {
    p_patch: body.patch,
  });
  if (rpcErr) return new Response(rpcErr.message, { status: 400, headers: corsHeaders });

  await supabase.from("agent_actions").insert({
    agent: body.agent,
    action: body.action,
    target: body.target,
    patch: body.patch,
    status: "applied",
  });

  return new Response("OK", { headers: corsHeaders });
});
