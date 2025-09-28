// Demo Bots Event Recorder - Beta Terminal Testing
// FCA Compliant Aviation Platform - Proof of Life System

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type EventIn = {
  actor_id?: string;
  actor_role?: "broker"|"operator"|"pilot"|"crew";
  action: string;
  context?: string;
  object_type?: string;
  object_id?: string;
  payload?: Record<string, unknown>;
  client_tz?: string;
  client_ua?: string;
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const body = await req.json() as EventIn | EventIn[];
    const rows = Array.isArray(body) ? body : [body];

    // Log the event for debugging
    console.log(`Recording ${rows.length} demo events`);

    const res = await fetch(`${SUPABASE_URL}/rest/v1/demo_events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Prefer": "return=representation"
      },
      body: JSON.stringify(rows.map(r => ({
        ...r,
        recorded_by: "playwright",
        client_ua: req.headers.get("user-agent") || "demo-bot"
      })))
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Failed to insert events: ${res.status} ${errorText}`);
      return new Response(`Failed to insert events: ${res.status}`, { status: res.status });
    }

    const result = await res.json();
    console.log(`Successfully recorded ${result.length} events`);
    
    return new Response(JSON.stringify(result), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    console.error("Event recorder error:", e);
    return new Response(`Error: ${String(e)}`, { status: 500 });
  }
});
