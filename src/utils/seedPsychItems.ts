import { supabase } from "@/integrations/supabase/client";

async function getModuleId(code: string) {
  const { data } = await supabase
    .from("psych_modules")
    .select("id, code, test_id")
    .eq("code", code)
    .single();
  
  if (!data) throw new Error(`Module ${code} not found`);
  return data.id;
}

function likertItem(text: string, reverse = false, trait = "O") {
  return {
    type: "likert",
    payload: { text, reverse, scale: [1, 2, 3, 4, 5] },
    trait_map: { [trait]: reverse ? -1 : 1 }
  };
}

function riskItem(text: string, positiveTrait = true) {
  return { 
    type: "likert", 
    payload: { text, scale: [1, 2, 3, 4, 5, 6, 7] }, 
    trait_map: { RISK: positiveTrait ? 1 : -1 } 
  };
}

function decisionItem(text: string, fastIsPositive = false) {
  return { 
    type: "likert", 
    payload: { text, scale: [1, 2, 3, 4, 5] }, 
    trait_map: { DECISION: fastIsPositive ? 1 : -1 } 
  };
}

function integrityItem(text: string, positive = true) {
  return { 
    type: "likert", 
    payload: { text, scale: [1, 2, 3, 4, 5] }, 
    trait_map: { INTEGRITY: positive ? 1 : -1, SAFETY: positive ? 0.5 : -0.5 } 
  };
}

function sjtItem(stem: string, options: string[], keyIndex: number, traitImpact: Record<string, number>) {
  return { 
    type: "scenario", 
    payload: { stem, options }, 
    trait_map: { KEY: keyIndex, ...traitImpact } 
  };
}

export async function seedPsychItems() {
  try {
    // Check if items already exist
    const { data: existingItems } = await supabase
      .from("psych_items")
      .select("id")
      .limit(1);

    if (existingItems && existingItems.length > 0) {
      console.log("Psych items already seeded");
      return;
    }

    const big5Id = await getModuleId("big5");
    const riskId = await getModuleId("risk");
    const decId = await getModuleId("decision");
    const sjtId = await getModuleId("sjt");
    const intId = await getModuleId("integrity");

    // Big5 short (24 items; public-domain style statements)
    const big5Items = [
      likertItem("I keep my workspace and plans organised.", false, "C"),
      likertItem("I am talkative in groups.", false, "E"),
      likertItem("I get stressed easily.", false, "N"),
      likertItem("I am interested in complex problems.", false, "O"),
      likertItem("I forgive people quickly.", false, "A"),
      likertItem("I leave tasks until the last moment.", true, "C"),
      likertItem("I prefer quiet to crowds.", true, "E"),
      likertItem("I seldom feel blue.", true, "N"),
      likertItem("I enjoy learning new systems.", false, "O"),
      likertItem("I am considerate of others.", false, "A"),
      likertItem("I follow checklists to the letter.", false, "C"),
      likertItem("I lead the conversation.", false, "E"),
      likertItem("I worry about mistakes.", false, "N"),
      likertItem("I think outside standard procedures when needed.", false, "O"),
      likertItem("I cooperate rather than compete.", false, "A"),
      likertItem("I misplace things.", true, "C"),
      likertItem("I am reserved.", true, "E"),
      likertItem("I stay calm under pressure.", true, "N"),
      likertItem("I enjoy new tools and methods.", false, "O"),
      likertItem("I help colleagues even if not asked.", false, "A"),
      likertItem("I prepare well in advance.", false, "C"),
      likertItem("I energise a room.", false, "E"),
      likertItem("I get overwhelmed by unexpected changes.", false, "N"),
      likertItem("I seek out new experiences at work.", false, "O")
    ].map(x => ({ ...x, module_id: big5Id }));

    // Risk (12)
    const riskItems = [
      riskItem("I am comfortable making decisions with incomplete information.", true),
      riskItem("I prefer to postpone decisions until all data is available.", false),
      riskItem("I enjoy high-stakes challenges when the odds are fair.", true),
      riskItem("I avoid routes or plans with any uncertainty.", false),
      riskItem("I take responsibility when a bold call is needed.", true),
      riskItem("I am uneasy when plans deviate.", false),
      riskItem("I can weigh upside and downside quickly.", true),
      riskItem("I would rather follow than lead if risks are unclear.", false),
      riskItem("I embrace calculated risk after mitigation.", true),
      riskItem("I say no to ambiguous opportunities.", false),
      riskItem("I adapt my risk appetite to the situation.", true),
      riskItem("I rarely accept risk even with safeguards.", false)
    ].map(x => ({ ...x, module_id: riskId }));

    // Decision style (8)
    const decItems = [
      decisionItem("I decide fast and refine later.", true),
      decisionItem("I need extensive consensus before I move.", false),
      decisionItem("I set a clear decision deadline and stick to it.", true),
      decisionItem("I often revisit decisions without new evidence.", false),
      decisionItem("I separate facts from opinions during decisions.", true),
      decisionItem("I rely mostly on gut feeling.", true),
      decisionItem("I document the reasoning behind key calls.", true),
      decisionItem("I get stuck when options look similar.", false)
    ].map(x => ({ ...x, module_id: decId }));

    // SJT (6)
    const sjtItems = [
      sjtItem(
        "A broker pressures you to depart earlier than the agreed slot to satisfy a VIP. Weather is marginal but legal.",
        ["Depart early as requested.", "Refuse and keep the slot.", "Negotiate a small delay and re brief.", "Escalate to operations and document."],
        3, { SAFETY: 1.0, INTEGRITY: 0.8, TEAM: 0.4 }
      ),
      sjtItem(
        "You notice a colleague skipping a checklist step to save time.",
        ["Ignore it.", "Confront privately and correct it.", "Report immediately to management.", "Joke about it to reduce tension."],
        1, { SAFETY: 1.0, INTEGRITY: 0.6, TEAM: 0.5 }
      ),
      sjtItem(
        "An operator offers a discount if you keep a maintenance advisory off the record.",
        ["Accept the deal.", "Decline and choose another operator.", "Negotiate the price but log the advisory.", "Ask a friend for advice."],
        1, { INTEGRITY: 1.0, SAFETY: 0.8 }
      ),
      sjtItem(
        "A client changes destination last minute. You can make it but crew duty time is tight.",
        ["Accept and go.", "Refuse due to duty limits.", "Try to swap crew quietly.", "Ask client to sign a waiver."],
        1, { SAFETY: 1.0, DECISION: 0.5 }
      ),
      sjtItem(
        "Two team members disagree on load sheet numbers.",
        ["Choose the senior's numbers.", "Stop and reconcile together.", "Pick the average and move on.", "Ask ground crew to decide."],
        1, { TEAM: 0.8, SAFETY: 0.8, INTEGRITY: 0.4 }
      ),
      sjtItem(
        "You find a data anomaly in flight hours reports close to an audit.",
        ["Ignore this cycle.", "Fix it quietly.", "Escalate with evidence.", "Blame the system."],
        2, { INTEGRITY: 0.8, C: 0.3 }
      )
    ].map(x => ({ ...x, module_id: sjtId }));

    // Integrity and safety (6)
    const intItems = [
      integrityItem("I follow procedures even when no one is watching.", true),
      integrityItem("I would bend rules if the client insists.", false),
      integrityItem("I log all incidents transparently.", true),
      integrityItem("I downplay minor safety issues.", false),
      integrityItem("I raise concerns early even if unpopular.", true),
      integrityItem("I cut corners to keep schedules.", false)
    ].map(x => ({ ...x, module_id: intId }));

    const allItems = [...big5Items, ...riskItems, ...decItems, ...sjtItems, ...intItems];

    // Insert in batches
    while (allItems.length) {
      const batch = allItems.splice(0, 100);
      const { error } = await supabase.from("psych_items").insert(batch);
      if (error) throw error;
    }

    console.log("Psych items seeded successfully");
    return true;
  } catch (error) {
    console.error("Error seeding psych items:", error);
    throw error;
  }
}