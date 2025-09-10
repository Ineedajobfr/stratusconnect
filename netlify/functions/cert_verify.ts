import { createClient } from "@supabase/supabase-js";
import nacl from "tweetnacl";
import { createHash } from "crypto";

export const config = { path: "/api/cert/verify" };

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);

function sha256Hex(s: string) {
  return createHash("sha256").update(s).digest("hex");
}

function b64ToU8(b64: string) {
  return new Uint8Array(Buffer.from(b64, "base64"));
}

function canonical(obj: any) {
  return JSON.stringify(obj, Object.keys(obj).sort());
}

export default async (req: Request) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return new Response("Missing id", { status: 400 });

  const { data: rows, error } = await supabase
    .from("certificates")
    .select("*")
    .eq("id", id)
    .limit(1);

  if (error) return new Response("Not found", { status: 404 });
  const cert = rows?.[0];
  if (!cert) return new Response("Not found", { status: 404 });

  const payload = {
    cert_type: cert.cert_type,
    subject_name: cert.subject_name,
    subject_email: cert.subject_email,
    subject_id: cert.subject_id,
    claims: cert.claims,
    issued_at: cert.created_at,
    expires_at: cert.expires_at,
  };
  const digest = sha256Hex(canonical(payload));

  const matchDigest = digest === cert.digest;

  // Threshold signatures - need at least 2 valid signatures
  const { data: keyRows } = await supabase
    .from("issuer_public_keys")
    .select("key_id, public_b64")
    .in("key_id", cert.signatures.map((s: any) => s.kid));

  let sigCount = 0;
  for (const s of cert.signatures as Array<{kid: string; sig: string}>) {
    const pkRow = keyRows?.find(k => k.key_id === s.kid);
    if (!pkRow) continue;
    const ok = nacl.sign.detached.verify(
      Buffer.from(digest, "hex"), 
      b64ToU8(s.sig), 
      b64ToU8(pkRow.public_b64)
    );
    if (ok) sigCount++;
  }
  const thresholdOk = sigCount >= 2;

  // Chain check
  const { data: ledgerRows } = await supabase
    .from("ledger")
    .select("*")
    .eq("subject", id)
    .order("created_at", { ascending: true });

  let chainOk = true;
  let prev = null as string | null;
  for (const r of ledgerRows ?? []) {
    const h = createHash("sha256").update(
      new Date(r.created_at).toISOString().replace('Z','.000Z') + 
      r.type + r.subject + 
      (r.payload ? JSON.stringify(r.payload) : '') + 
      (r.prev_hash ?? '')
    ).digest("hex");
    if (r.prev_hash !== prev) chainOk = false;
    if (r.row_hash !== h) chainOk = false;
    prev = r.row_hash;
  }

  const now = new Date();
  const expired = cert.expires_at ? now > new Date(cert.expires_at) : false;

  // Log verification attempt
  await supabase.from("certificate_events").insert({
    certificate_id: cert.id,
    event_type: "verified",
    meta: { 
      sigOk: thresholdOk, 
      matchDigest, 
      expired, 
      sigCount,
      chainOk,
      at: now.toISOString() 
    },
  });

  return new Response(
    JSON.stringify({
      id: cert.id,
      valid: matchDigest && thresholdOk && chainOk && cert.status === "active" && !expired,
      reason: {
        digest: matchDigest,
        signature: thresholdOk,
        chain: chainOk,
        status: cert.status,
        expired,
        sigCount
      },
      public: {
        cert_type: cert.cert_type,
        subject_name: cert.subject_name,
        issued_at: cert.created_at,
        expires_at: cert.expires_at,
        key_id: cert.key_id,
        anchor_root: cert.anchor_root
      },
    }),
    { headers: { "Content-Type": "application/json" } }
  );
};
