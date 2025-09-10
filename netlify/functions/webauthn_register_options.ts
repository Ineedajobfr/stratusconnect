import { generateRegistrationOptions } from "@simplewebauthn/server";
import { createClient } from "@supabase/supabase-js";

export const config = { path: "/api/webauthn/register-options" };

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);
const rpID = new URL(process.env.SUPABASE_URL!).hostname;

export default async (req: Request) => {
  const { email, displayName } = await req.json();
  if (!email || !displayName) return new Response("Missing", { status: 400 });

  let { data: admin } = await supabase.from("admin_accounts").select("*").eq("email", email).limit(1);
  if (!admin?.length) {
    const ins = await supabase.from("admin_accounts").insert({ email, display_name: displayName }).select("*").limit(1);
    admin = ins.data ?? [];
  }
  const adminId = admin![0].id;

  const { data: creds } = await supabase.from("admin_credentials").select("credential_id").eq("admin_id", adminId);

  const opts = await generateRegistrationOptions({
    rpName: "Stratus Connect",
    rpID,
    userID: adminId,
    userName: email,
    attestationType: "none",
    excludeCredentials: (creds ?? []).map(c => ({ id: c.credential_id, type: "public-key" as const })),
    authenticatorSelection: { userVerification: "required", residentKey: "preferred" }
  });

  return new Response(JSON.stringify(opts), { headers: { "Content-Type": "application/json" } });
};
