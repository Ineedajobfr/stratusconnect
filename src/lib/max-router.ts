// Max Router - Intelligent model routing for Stratus Assist
// Routes tasks to the best free model for each job
// FCA Compliant Aviation Platform

import { AviationContext } from './stratus-assist-policy';

export type Intent =
  | "reassure"
  | "intake"
  | "tools"
  | "pricing"
  | "availability"
  | "summary"
  | "policy"
  | "general";

export type ModelSlot = "primary" | "reasoning" | "summary";

export function detectIntent(userMsg: string, ctx: Partial<AviationContext>): Intent {
  const u = userMsg.toLowerCase();

  // Reassurance queries
  if (/are you real|real\?|exist|real bot|are you a bot/.test(u)) {
    return "reassure";
  }

  // Help requests without full context
  if (/help|can you|assist|support/.test(u) && !hasAllIntake(ctx)) {
    return "intake";
  }

  // Pricing and budget queries
  if (/price|quote|budget|cost|gbp|£|expensive|cheap|afford/.test(u)) {
    return "pricing";
  }

  // Availability and aircraft queries
  if (/availability|slot|hold|aircraft|g\d{3,4}|gulfstream|falcon|citation|legacy|phenom|global|challenger|bombardier|cessna|embraer/.test(u)) {
    return "availability";
  }

  // Summary and recap requests
  if (/summary|recap|brief|overview|summarize/.test(u)) {
    return "summary";
  }

  // Policy and compliance queries
  if (/policy|rules|guardrails|terms|compliance|regulation|safety/.test(u)) {
    return "policy";
  }

  // Tool usage (when context is complete)
  if (hasAllIntake(ctx) && (/book|confirm|proceed|go ahead|yes|ok/.test(u))) {
    return "tools";
  }

  return "general";
}

export function routeModel(intent: Intent): ModelSlot {
  // Reasoning model for complex tasks requiring tool calls
  if (intent === "availability" || intent === "pricing" || intent === "tools") {
    return "reasoning";
  }

  // Summary model for long-form content and compliance
  if (intent === "summary" || intent === "policy") {
    return "summary";
  }

  // Primary model for general dialogue and intake
  return "primary";
}

export function getModelName(slot: ModelSlot): string {
  switch (slot) {
    case "primary":
      return "llama3:8b";
    case "reasoning":
      return "llama3:8b"; // Use Llama 3 for reasoning too
    case "summary":
      return "gemma3:4b"; // Use the Gemma 3 you have
    default:
      return "llama3:8b";
  }
}

function hasAllIntake(ctx: Partial<AviationContext>): boolean {
  return !!(ctx.aircraft && ctx.origin && ctx.destination && ctx.date && ctx.pax && ctx.budget_gbp);
}

// Model capabilities mapping
export const MODEL_CAPABILITIES = {
  "llama3:8b": {
    name: "Llama 3 8B",
    strengths: ["dialogue", "intake", "reassurance", "general_chat", "reasoning", "pricing", "availability"],
    context_length: 8192,
    speed: "fast"
  },
  "gemma3:4b": {
    name: "Gemma 3 4B",
    strengths: ["summarization", "compliance", "policy", "long_form", "efficient"],
    context_length: 8192,
    speed: "very_fast"
  }
};

// Intent-based routing with confidence scoring
export function getRoutingDecision(userMsg: string, ctx: Partial<AviationContext>): {
  intent: Intent;
  modelSlot: ModelSlot;
  modelName: string;
  confidence: number;
  reasoning: string;
} {
  const intent = detectIntent(userMsg, ctx);
  const modelSlot = routeModel(intent);
  const modelName = getModelName(modelSlot);
  
  // Calculate confidence based on intent clarity
  let confidence = 0.8;
  let reasoning = `Intent: ${intent}, Model: ${modelName}`;

  // Boost confidence for clear intents
  if (intent === "reassure" || intent === "pricing" || intent === "availability") {
    confidence = 0.95;
    reasoning += " (high confidence)";
  } else if (intent === "general") {
    confidence = 0.6;
    reasoning += " (fallback routing)";
  }

  return {
    intent,
    modelSlot,
    modelName,
    confidence,
    reasoning
  };
}

