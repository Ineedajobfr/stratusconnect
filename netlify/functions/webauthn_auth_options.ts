import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { createClient } from "@supabase/supabase-js";

export const config = { path: "/api/webauthn/auth-options" };
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);
const rpID = new URL(process.env.SUPABASE_URL!).hostname;

export default async (req: Request) => {
  const { email } = await req.json();
  if (!email) return new Response("Missing", { status: 400 });
  
  const { data: admin } = await supabase.from("admin_accounts").select("id").eq("email", email).limit(1);
  if (!admin?.length) return new Response("No admin", { status: 404 });

  const { data: creds } = await supabase.from("admin_credentials").select("credential_id").eq("admin_id", admin[0].id);

  const opts = await generateAuthenticationOptions({
    rpID,
    allowCredentials: (creds ?? []).map(c => ({ id: c.credential_id, type: "public-key" as const })),
    userVerification: "required",
  });

  return new Response(JSON.stringify({ options: opts, adminId: admin[0].id }), { headers: { "Content-Type": "application/json" } });
};
