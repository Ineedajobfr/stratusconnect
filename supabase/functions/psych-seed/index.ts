import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if items already exist
    const { count, error: countError } = await supabase
      .from('psych_items')
      .select('id', { count: 'exact', head: true });

    if (countError) {
      console.error('Count error', countError);
    }

    if ((count || 0) > 0) {
      return json({ ok: true, seeded: false, message: 'Items already present' });
    }

    const moduleIds = await getModuleIds();
    const batches = buildBatches(moduleIds);

    for (const batch of batches) {
      const { error } = await supabase.from('psych_items').insert(batch);
      if (error) throw error;
    }

    return json({ ok: true, seeded: true });
  } catch (e) {
    console.error('Seed error', e);
    return json({ error: String(e) }, 500);
  }
});

function json(obj: any, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { ...corsHeaders, 'content-type': 'application/json' } });
}

async function getModuleId(code: string) {
  const { data, error } = await supabase
    .from('psych_modules')
    .select('id')
    .eq('code', code)
    .single();
  if (error || !data) throw new Error(`Module ${code} not found`);
  return data.id;
}

async function getModuleIds() {
  const [big5, risk, decision, sjt, integrity] = await Promise.all([
    getModuleId('big5'),
    getModuleId('risk'),
    getModuleId('decision'),
    getModuleId('sjt'),
    getModuleId('integrity'),
  ]);
  return { big5, risk, decision, sjt, integrity };
}

function buildBatches(m: Record<string, string>) {
  const likert = (text: string, reverse = false, trait = 'O') => ({
    type: 'likert',
    payload: { text, reverse, scale: [1,2,3,4,5] },
    trait_map: { [trait]: reverse ? -1 : 1 }
  });
  const riskItem = (text: string, positive = true) => ({
    type: 'likert', payload: { text, scale: [1,2,3,4,5,6,7] }, trait_map: { RISK: positive ? 1 : -1 }
  });
  const decisionItem = (text: string, fastPositive = false) => ({
    type: 'likert', payload: { text, scale: [1,2,3,4,5] }, trait_map: { DECISION: fastPositive ? 1 : -1 }
  });
  const integrityItem = (text: string, positive = true) => ({
    type: 'likert', payload: { text, scale: [1,2,3,4,5] }, trait_map: { INTEGRITY: positive ? 1 : -1, SAFETY: positive ? 0.5 : -0.5 }
  });
  const sjt = (stem: string, options: string[], keyIndex: number, map: Record<string, number>) => ({
    type: 'scenario', payload: { stem, options }, trait_map: { KEY: keyIndex, ...map }
  });

  const big5Items = [
    likert('I keep my workspace and plans organised.', false, 'C'),
    likert('I am talkative in groups.', false, 'E'),
    likert('I get stressed easily.', false, 'N'),
    likert('I am interested in complex problems.', false, 'O'),
    likert('I forgive people quickly.', false, 'A'),
    likert('I leave tasks until the last moment.', true, 'C'),
    likert('I prefer quiet to crowds.', true, 'E'),
    likert('I seldom feel blue.', true, 'N'),
    likert('I enjoy learning new systems.', false, 'O'),
    likert('I am considerate of others.', false, 'A'),
    likert('I follow checklists to the letter.', false, 'C'),
    likert('I lead the conversation.', false, 'E'),
    likert('I worry about mistakes.', false, 'N'),
    likert('I think outside standard procedures when needed.', false, 'O'),
    likert('I cooperate rather than compete.', false, 'A'),
    likert('I misplace things.', true, 'C'),
    likert('I am reserved.', true, 'E'),
    likert('I stay calm under pressure.', true, 'N'),
    likert('I enjoy new tools and methods.', false, 'O'),
    likert('I help colleagues even if not asked.', false, 'A'),
    likert('I prepare well in advance.', false, 'C'),
    likert('I energise a room.', false, 'E'),
    likert('I get overwhelmed by unexpected changes.', false, 'N'),
    likert('I seek out new experiences at work.', false, 'O')
  ].map((x) => ({ ...x, module_id: m.big5 }));

  const riskItems = [
    riskItem('I am comfortable making decisions with incomplete information.', true),
    riskItem('I prefer to postpone decisions until all data is available.', false),
    riskItem('I enjoy high-stakes challenges when the odds are fair.', true),
    riskItem('I avoid routes or plans with any uncertainty.', false),
    riskItem('I take responsibility when a bold call is needed.', true),
    riskItem('I am uneasy when plans deviate.', false),
    riskItem('I can weigh upside and downside quickly.', true),
    riskItem('I would rather follow than lead if risks are unclear.', false),
    riskItem('I embrace calculated risk after mitigation.', true),
    riskItem('I say no to ambiguous opportunities.', false),
    riskItem('I adapt my risk appetite to the situation.', true),
    riskItem('I rarely accept risk even with safeguards.', false)
  ].map((x) => ({ ...x, module_id: m.risk }));

  const decItems = [
    decisionItem('I decide fast and refine later.', true),
    decisionItem('I need extensive consensus before I move.', false),
    decisionItem('I set a clear decision deadline and stick to it.', true),
    decisionItem('I often revisit decisions without new evidence.', false),
    decisionItem('I separate facts from opinions during decisions.', true),
    decisionItem('I rely mostly on gut feeling.', true),
    decisionItem('I document the reasoning behind key calls.', true),
    decisionItem('I get stuck when options look similar.', false)
  ].map((x) => ({ ...x, module_id: m.decision }));

  const sjtItems = [
    sjt(
      'A broker pressures you to depart earlier than the agreed slot to satisfy a VIP. Weather is marginal but legal.',
      ['Depart early as requested.', 'Refuse and keep the slot.', 'Negotiate a small delay and re brief.', 'Escalate to operations and document.'],
      3, { SAFETY: 1.0, INTEGRITY: 0.8, TEAM: 0.4 }
    ),
    sjt(
      'You notice a colleague skipping a checklist step to save time.',
      ['Ignore it.', 'Confront privately and correct it.', 'Report immediately to management.', 'Joke about it to reduce tension.'],
      1, { SAFETY: 1.0, INTEGRITY: 0.6, TEAM: 0.5 }
    ),
    sjt(
      'An operator offers a discount if you keep a maintenance advisory off the record.',
      ['Accept the deal.', 'Decline and choose another operator.', 'Negotiate the price but log the advisory.', 'Ask a friend for advice.'],
      1, { INTEGRITY: 1.0, SAFETY: 0.8 }
    ),
    sjt(
      'A client changes destination last minute. You can make it but crew duty time is tight.',
      ['Accept and go.', 'Refuse due to duty limits.', 'Try to swap crew quietly.', 'Ask client to sign a waiver.'],
      1, { SAFETY: 1.0, DECISION: 0.5 }
    ),
    sjt(
      'Two team members disagree on load sheet numbers.',
      ["Choose the senior's numbers.", 'Stop and reconcile together.', 'Pick the average and move on.', 'Ask ground crew to decide.'],
      1, { TEAM: 0.8, SAFETY: 0.8, INTEGRITY: 0.4 }
    ),
    sjt(
      'You find a data anomaly in flight hours reports close to an audit.',
      ['Ignore this cycle.', 'Fix it quietly.', 'Escalate with evidence.', 'Blame the system.'],
      2, { INTEGRITY: 0.8, C: 0.3 }
    )
  ].map((x) => ({ ...x, module_id: m.sjt }));

  const intItems = [
    integrityItem('I follow procedures even when no one is watching.', true),
    integrityItem('I would bend rules if the client insists.', false),
    integrityItem('I log all incidents transparently.', true),
    integrityItem('I downplay minor safety issues.', false),
    integrityItem('I raise concerns early even if unpopular.', true),
    integrityItem('I cut corners to keep schedules.', false)
  ].map((x) => ({ ...x, module_id: m.integrity }));

  const all = [...big5Items, ...riskItems, ...decItems, ...sjtItems, ...intItems];

  const batches: any[] = [];
  let index = 0;
  while (index < all.length) {
    batches.push(all.slice(index, index + 100));
    index += 100;
  }
  return batches;
}
