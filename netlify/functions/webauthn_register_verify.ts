import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { createClient } from "@supabase/supabase-js";

export const config = { path: "/api/webauthn/register-verify" };
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);
const rpID = new URL(process.env.SUPABASE_URL!).hostname;
const origin = process.env.PUBLIC_ORIGIN ?? "https://stratusconnect.com";

export default async (req: Request) => {
  const body = await req.json();

  const verification = await verifyRegistrationResponse({
    response: body,
    expectedChallenge: body.response.clientDataJSONChallenge, // send back what you used
    expectedOrigin: origin,
    expectedRPID: rpID,
  });

  if (!verification.verified || !verification.registrationInfo) {
    return new Response("Verification failed", { status: 400 });
  }

  const { registrationInfo } = verification;
  const adminId = body.user.id;

  await supabase.from("admin_credentials").insert({
    admin_id: adminId,
    credential_id: registrationInfo.credentialID,
    public_key: registrationInfo.credentialPublicKey.toString("base64"),
    counter: registrationInfo.counter,
    aaguid: registrationInfo.aaguid
  });

  return new Response("OK");
};
