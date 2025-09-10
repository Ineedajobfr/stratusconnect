import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { createClient } from "@supabase/supabase-js";

export const config = { path: "/api/webauthn/auth-verify" };
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);
const rpID = new URL(process.env.SUPABASE_URL!).hostname;
const origin = process.env.PUBLIC_ORIGIN ?? "https://stratusconnect.com";

export default async (req: Request) => {
  const body = await req.json(); // { response, adminId }

  const { data: credRows } = await supabase.from("admin_credentials")
    .select("*").eq("admin_id", body.adminId);
  if (!credRows?.length) return new Response("No credentials", { status: 404 });

  const credential = credRows.find(c => c.credential_id === body.response.id);
  if (!credential) return new Response("Unknown credential", { status: 400 });

  const verification = await verifyAuthenticationResponse({
    response: body.response,
    expectedChallenge: body.response.clientDataJSONChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    authenticator: {
      credentialID: credential.credential_id,
      credentialPublicKey: Buffer.from(credential.public_key, "base64"),
      counter: credential.counter,
      transports: credential.transports ?? []
    }
  });

  if (!verification.verified) return new Response("Auth failed", { status: 401 });

  // update counter
  await supabase.from("admin_credentials").update({ counter: verification.authenticationInfo.newCounter })
    .eq("credential_id", credential.credential_id);

  return new Response(JSON.stringify({ ok: true, adminId: body.adminId }), { headers: { "Content-Type": "application/json" } });
};
