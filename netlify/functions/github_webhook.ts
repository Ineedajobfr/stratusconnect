import { Octokit } from "@octokit/rest";
import { createHmac, timingSafeEqual } from "crypto";
import { OpenAI } from "openai";
import { createClient } from "@supabase/supabase-js";

export const config = { path: "/api/github-webhook" };

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

function verify(sig: string | null, raw: string) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET!;
  const expected = "sha256=" + createHmac("sha256", secret).update(raw).digest("hex");
  return !!sig && timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export default async (req: Request) => {
  const raw = await req.text();
  const sig = req.headers.get("x-hub-signature-256");
  if (!verify(sig, raw)) return new Response("Bad signature", { status: 401 });

  const event = JSON.parse(raw);
  const kind = req.headers.get("x-github-event");
  if (kind !== "pull_request") return new Response("OK");

  const action = event.action;
  if (action !== "opened" && action !== "synchronize" && action !== "reopened") {
    return new Response("OK");
  }

  const pr = event.pull_request;
  const repoFull = event.repository.full_name as string;
  const [owner, repo] = repoFull.split("/");
  const prNumber = pr.number as number;

  const octo = new Octokit({ auth: process.env.GITHUB_TOKEN! });
  const { data: files } = await octo.pulls.listFiles({ owner, repo, pull_number: prNumber });

  const diffPreview = files
    .slice(0, 20)
    .map((f) => `File: ${f.filename}\n${f.patch?.slice(0, 1200) ?? ""}`)
    .join("\n\n");

  const prompt =
`You are a senior reviewer for a regulated aviation marketplace with React, TypeScript, Supabase.
Find bugs, security risks, RLS issues, performance footguns, and accessibility problems.
Respond with a concise bulleted review and code suggestions where useful.

${diffPreview}`;

  const ai = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [{ role: "user", content: prompt }],
  });

  const review = ai.choices[0].message?.content ?? "No findings.";

  await supabase.from("agent_reports").insert({
    agent: "code_reviewer",
    topic: `PR ${prNumber} ${repoFull}`,
    summary: review,
    details: { files: files.length },
    severity: "low",
  });

  await octo.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body: review,
  });

  return new Response("OK");
};
