import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const CF_TURNSTILE_SECRET_KEY = Deno.env.get('CF_TURNSTILE_SECRET_KEY')!
const NOTION_API_KEY = Deno.env.get('NOTION_API_KEY') || ''
const NOTION_DATABASE_ID = Deno.env.get('NOTION_DATABASE_ID') || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
})

type Payload = {
  full_name?: string
  email: string
  phone?: string
  turnstileToken: string
  source?: string
}

async function verifyTurnstile(token: string, remoteIp?: string) {
  const form = new URLSearchParams()
  form.set('secret', CF_TURNSTILE_SECRET_KEY)
  form.set('response', token)
  if (remoteIp) form.set('remoteip', remoteIp)

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form
  })
  const data = await res.json()
  return data as { success: boolean; score?: number }
}

async function syncToNotion(input: { full_name?: string; email: string; phone?: string; source?: string }) {
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) return { ok: false, skipped: true }
  const props = {
    Name: { title: [{ text: { content: input.full_name || input.email } }] },
    Email: { email: input.email },
    Phone: input.phone ? { rich_text: [{ text: { content: input.phone } }] } : undefined,
    Source: input.source ? { rich_text: [{ text: { content: input.source } }] } : undefined,
    Status: { select: { name: 'Pending' } }
  }
  const body = { parent: { database_id: NOTION_DATABASE_ID }, properties: props }
  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const t = await res.text()
    return { ok: false, skipped: false, error: t }
  }
  return { ok: true, skipped: false }
}

Deno.serve(async (req) => {
  try {
    const remoteIp = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || undefined
    const payload = await req.json() as Payload
    if (!payload.email || !payload.turnstileToken) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })
    }

    const verify = await verifyTurnstile(payload.turnstileToken, remoteIp)
    if (!verify.success) {
      return new Response(JSON.stringify({ error: 'Turnstile failed' }), { status: 403 })
    }

    const ipHash = remoteIp ? await crypto.subtle.digest('SHA-256', new TextEncoder().encode(remoteIp)).then(b => {
      const hex = Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('')
      return hex
    }) : null

    const { error: insertErr } = await supabase
      .from('beta_signups')
      .insert({
        full_name: payload.full_name || null,
        email: payload.email,
        phone: payload.phone || null,
        source: payload.source || 'landing_about',
        status: 'pending',
        ip_hash: ipHash,
        turnstile_score: typeof verify.score === 'number' ? verify.score : null
      })

    if (insertErr) {
      if (insertErr.message?.includes('duplicate')) {
        return new Response(JSON.stringify({ ok: true, duplicate: true }), { status: 200 })
      }
      return new Response(JSON.stringify({ error: insertErr.message }), { status: 500 })
    }

    const notion = await syncToNotion({
      full_name: payload.full_name,
      email: payload.email,
      phone: payload.phone,
      source: payload.source
    })

    if (!notion.ok && !notion.skipped) {
      await supabase.from('beta_signups')
        .update({ notion_sync_status: 'fail', notes: 'Notion sync error' })
        .eq('email', payload.email)
    } else if (notion.ok) {
      await supabase.from('beta_signups')
        .update({ notion_sync_status: 'success' })
        .eq('email', payload.email)
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 })
  }
})
