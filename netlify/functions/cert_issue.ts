import { createClient } from "@supabase/supabase-js";
import nacl from "tweetnacl";
import { createHash, randomBytes } from "crypto";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";

export const config = { path: "/api/cert/issue" };

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);

function canonical(obj: any) {
  return JSON.stringify(obj, Object.keys(obj).sort());
}

function sha256Hex(data: string) {
  return createHash("sha256").update(data).digest("hex");
}

function b64ToUint8(b64: string) {
  return new Uint8Array(Buffer.from(b64, "base64"));
}

function uint8ToB64(u8: Uint8Array) {
  return Buffer.from(u8).toString("base64");
}

// Optional field encryption for sensitive claim fields
async function encryptField(plaintext: string, aad: string) {
  // AES GCM 256 with a random key per cert field, key wrapped is out of scope here
  const key = crypto.webcrypto.getRandomValues(new Uint8Array(32));
  const iv = crypto.webcrypto.getRandomValues(new Uint8Array(12));
  const algo = { name: "AES-GCM", iv, additionalData: new TextEncoder().encode(aad) };
  const k = await crypto.webcrypto.subtle.importKey("raw", key, "AES-GCM", false, ["encrypt"]);
  const ct = await crypto.webcrypto.subtle.encrypt(algo, k, new TextEncoder().encode(plaintext));
  return {
    enc: "AES-GCM-256",
    iv: Buffer.from(iv).toString("base64"),
    key_b64: Buffer.from(key).toString("base64"), // store only if you plan a secure wrap. else omit
    ciphertext: Buffer.from(ct).toString("base64"),
  };
}

async function buildPdf(cert: {
  id: string;
  cert_type: string;
  subject_name: string;
  issued_at: string;
  expires_at?: string | null;
  digest: string;
  signatures: string[];
  anchor_root?: string | null;
}) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]); // A4 portrait
  const fontTitle = await pdf.embedFont(StandardFonts.HelveticaBold);
  const fontBody = await pdf.embedFont(StandardFonts.Helvetica);

  const brand = process.env.PDF_BRAND_NAME ?? "Stratus Connect";
  const brandUrl = process.env.PDF_BRAND_URL ?? "https://stratusconnect.com";
  const verifyUrl = `${brandUrl}/verify?id=${cert.id}`;

  // QR code to verify
  const qrPng = await QRCode.toBuffer(verifyUrl, { errorCorrectionLevel: "H", margin: 0, width: 200 });
  const qrImg = await pdf.embedPng(qrPng);

  // layout
  page.drawText(brand, { x: 50, y: 770, size: 20, font: fontTitle, color: rgb(0.1, 0.1, 0.1) });
  page.drawText("Certificate of Accreditation", { x: 50, y: 720, size: 28, font: fontTitle });
  page.drawText(cert.cert_type, { x: 50, y: 690, size: 16, font: fontBody });

  page.drawText("Awarded to", { x: 50, y: 640, size: 12, font: fontBody, color: rgb(0.3, 0.3, 0.3) });
  page.drawText(cert.subject_name, { x: 50, y: 616, size: 22, font: fontTitle });

  page.drawText(`Issued: ${new Date(cert.issued_at).toUTCString()}`, { x: 50, y: 560, size: 12, font: fontBody });
  if (cert.expires_at) page.drawText(`Expires: ${new Date(cert.expires_at).toUTCString()}`, { x: 50, y: 542, size: 12, font: fontBody });

  page.drawText(`Certificate ID: ${cert.id}`, { x: 50, y: 510, size: 10, font: fontBody, color: rgb(0.3, 0.3, 0.3) });
  page.drawText(`Digest SHA-256: ${cert.digest}`, { x: 50, y: 494, size: 10, font: fontBody, color: rgb(0.3, 0.3, 0.3) });
  page.drawText(`Signatures: ${cert.signatures.map(s => s.slice(0, 16)).join(" , ")}...`, { x: 50, y: 478, size: 10, font: fontBody, color: rgb(0.3, 0.3, 0.3) });
  if (cert.anchor_root) page.drawText(`Anchor root: ${cert.anchor_root}`, { x: 50, y: 462, size: 10, font: fontBody, color: rgb(0.3, 0.3, 0.3) });

  page.drawText("Verify authenticity:", { x: 50, y: 440, size: 12, font: fontBody });
  page.drawText(verifyUrl, { x: 50, y: 424, size: 10, font: fontBody, color: rgb(0, 0.2, 0.6) });

  page.drawImage(qrImg, { x: 380, y: 520, width: 150, height: 150 });

  const pdfBytes = await pdf.save();
  return Buffer.from(pdfBytes);
}

export default async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const {
    cert_type,
    subject_name,
    subject_email,
    subject_id,
    claims = {},
    expires_at = null,
    summary,
    amount_numeric
  } = await req.json();

  if (!cert_type || !subject_name || !summary) return new Response("Missing fields", { status: 400 });

  // Create a high value transaction gate
  const txIns = await supabase.from("hv_transactions").insert({
    kind: "cert.issue",
    target_id: null,
    summary,
    amount_numeric
  }).select("id").limit(1);
  
  if (txIns.error) return new Response(txIns.error.message, { status: 500 });
  const txId = txIns.data![0].id;

  // Check if this is a forced issue (bypass approval for now)
  const url = new URL(req.url);
  const force = url.searchParams.get("force") === "1";
  if (!force) {
    return new Response(JSON.stringify({ txId, status: "pending_approval" }), { 
      headers: { "Content-Type": "application/json" } 
    });
  }

  // Optional encrypt sensitive claim fields
  // Example: if claims.licenseNumber exists, encrypt it
  if (claims.licenseNumber) {
    claims.licenseNumber_enc = await encryptField(String(claims.licenseNumber), subject_name);
    delete claims.licenseNumber;
  }

  const payload = {
    cert_type,
    subject_name,
    subject_email: subject_email ?? null,
    subject_id: subject_id ?? null,
    claims,
    issued_at: new Date().toISOString(),
    expires_at,
  };

  const canon = canonical(payload);
  const digest = sha256Hex(canon);

  // Two independent signatures
  const sig1 = nacl.sign.detached(Buffer.from(digest, "hex"), b64ToUint8(process.env.ISSUER1_PRIVATE_KEY!));
  const sig2 = nacl.sign.detached(Buffer.from(digest, "hex"), b64ToUint8(process.env.ISSUER2_PRIVATE_KEY!));

  const signatures = [
    { kid: process.env.ISSUER1_KEY_ID!, sig: uint8ToB64(sig1) },
    { kid: process.env.ISSUER2_KEY_ID!, sig: uint8ToB64(sig2) }
  ];

  // insert record
  const { data: rows, error } = await supabase
    .from("certificates")
    .insert({
      cert_type,
      subject_id: subject_id ?? null,
      subject_name,
      subject_email: subject_email ?? null,
      claims,
      issued_by: "issuer-committee",
      key_id: "threshold-2of2",
      signature: "", // deprecated single signature field
      signatures,
      digest,
      expires_at,
      status: "active",
    })
    .select("id, created_at")
    .limit(1);

  if (error) return new Response(error.message, { status: 500 });
  const row = rows![0];

  // Ledger entry
  await supabase.from("ledger").insert({
    type: "cert.issue",
    subject: row.id,
    payload: { digest, cert_type, subject_name }
  });

  // build PDF
  const pdfBuffer = await buildPdf({
    id: row.id,
    cert_type,
    subject_name,
    issued_at: row.created_at,
    expires_at,
    digest,
    signatures: signatures.map(s => s.sig),
    anchor_root: null
  });

  // You can push to Supabase Storage, here we skip and return base64
  // Better: upload and store pdf_url on the row
  // const { data: upload } = await supabase.storage.from("certs").upload(`pdf/${row.id}.pdf`, pdfBuffer, { contentType: "application/pdf", upsert: true });

  await supabase.from("certificate_events").insert({
    certificate_id: row.id,
    event_type: "issued",
    meta: { by: "system" },
  });

  return new Response(
    JSON.stringify({
      id: row.id,
      txId,
      digest,
      signatures,
      key_id: "threshold-2of2",
      pdf_base64: pdfBuffer.toString("base64"),
    }),
    { headers: { "Content-Type": "application/json" } }
  );
};
