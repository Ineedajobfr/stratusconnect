import { createClient } from "@supabase/supabase-js";
import { Octokit } from "@octokit/rest";
import { createHash } from "crypto";

export const config = { schedule: "@daily" };
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);

function sha256Hex(s: string) { 
  return createHash("sha256").update(s).digest("hex"); 
}

function merkleRoot(hashes: string[]) {
  if (hashes.length === 0) return null;
  let level = hashes.slice();
  while (level.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] ?? left;
      next.push(sha256Hex(left + right));
    }
    level = next;
  }
  return level[0];
}

export default async () => {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: certs } = await supabase.from("certificates").select("id, digest, created_at").gt("created_at", since);

  const leaves = (certs ?? []).map(c => sha256Hex(c.id + c.digest));
  const root = merkleRoot(leaves);
  const payload = {
    ts: new Date().toISOString(),
    count: certs?.length ?? 0,
    root,
    leaves: leaves.slice(0, 50)  // do not publish all if large, keep summary public
  };

  const octo = new Octokit({ auth: process.env.GITHUB_TOKEN! });
  const gistId = process.env.GITHUB_GIST_ID!;
  const filename = `stratus-anchors-${new Date().toISOString().slice(0,10)}.json`;

  await octo.gists.update({
    gist_id: gistId,
    files: { [filename]: { content: JSON.stringify(payload, null, 2) } }
  });

  // store root on each cert issued today for quick linkage
  if (root) {
    const ids = (certs ?? []).map(c => c.id);
    await supabase.from("certificates").update({ 
      anchor_root: root, 
      anchor_ts: new Date().toISOString() 
    }).in("id", ids);
  }

  await supabase.from("ledger").insert({ 
    type: "anchor.publish", 
    subject: "daily", 
    payload: { root, count: payload.count } 
  });

  return new Response("OK");
};
