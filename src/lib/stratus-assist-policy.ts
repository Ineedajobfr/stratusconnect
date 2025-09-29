// Stratus Assist Policy Layer
// Enforces guardrails and content filtering
// FCA Compliant Aviation Platform

export type PolicyViolation = 
  | 'bad_brand'
  | 'undercut'
  | 'target_users'
  | 'explicit'
  | 'none';

export interface PolicyResult {
  violation: PolicyViolation;
  message: string;
  blocked: boolean;
}

export function enforcePolicy(userMsg: string): PolicyResult {
  const m = userMsg.toLowerCase();

  // Bad brand criticism
  const badBrand = m.includes("stratus connect") && 
    (m.includes("bad") || m.includes("shit") || m.includes("useless") || m.includes("scam"));

  // Undercutting attempts
  const undercut = m.includes("undercut") || m.includes("steal client") || m.includes("poach");

  // Targeting other users
  const targetUsers = (m.includes("what is") || m.includes("show") || m.includes("look into") || m.includes("tell me about")) &&
    (m.includes("user") || m.includes("broker") || m.includes("operator")) &&
    (m.includes("'s") || m.includes(" activities") || m.includes(" deals"));

  // Explicit content
  const explicit = /sex|porn|naked|explicit|derogatory|slut|whore|fuck|nsfw/.test(m);

  if (badBrand) {
    return {
      violation: 'bad_brand',
      message: "This platform exists to support aviation professionals. If you need help, ask directly.",
      blocked: true
    };
  }

  if (undercut) {
    return {
      violation: 'undercut',
      message: "Direct undercutting is not permitted. Stratus Connect maintains a fair, transparent marketplace.",
      blocked: true
    };
  }

  if (targetUsers) {
    return {
      violation: 'target_users',
      message: "User data is private. Stratus Connect only provides verified aircraft, operator, and crew information.",
      blocked: true
    };
  }

  if (explicit) {
    return {
      violation: 'explicit',
      message: "Stratus Connect is a professional aviation platform. That request is not permitted here.",
      blocked: true
    };
  }

  return {
    violation: 'none',
    message: '',
    blocked: false
  };
}

// Intent detection
export type Intent = 
  | 'existential'
  | 'help_request'
  | 'aircraft_query'
  | 'quote_request'
  | 'price_challenge'
  | 'crew_request'
  | 'compliance_question'
  | 'general';

export function detectIntent(userMsg: string): Intent {
  const m = userMsg.toLowerCase();

  if (/are you real|real\?|exist|real bot/.test(m)) {
    return 'existential';
  }

  if (/help|can you|assist|support/.test(m)) {
    return 'help_request';
  }

  if (/\b(g\d{3,4}|gulfstream|falcon|global|challenger|bombardier|cessna|embraer|airbus|boeing)\b/i.test(m)) {
    return 'aircraft_query';
  }

  if (/quote|price|cost|budget|charter|hire|rent/.test(m)) {
    return 'quote_request';
  }

  if (/cheaper|competitor|undercut|match price/.test(m)) {
    return 'price_challenge';
  }

  if (/crew|pilot|captain|first officer|flight attendant|cabin crew/.test(m)) {
    return 'crew_request';
  }

  if (/compliance|regulation|safety|certification|easa|faa/.test(m)) {
    return 'compliance_question';
  }

  return 'general';
}

// Context extraction
export interface AviationContext {
  aircraft?: string;
  origin?: string;
  destination?: string;
  date?: string;
  pax?: number;
  budget_gbp?: number;
  bags?: number;
  cabin_preference?: string;
  flexibility?: string;
}

export function extractContext(userMsg: string): Partial<AviationContext> {
  const m = userMsg.toLowerCase();
  const context: Partial<AviationContext> = {};

  // Aircraft extraction
  const aircraftMatch = m.match(/\b(g\d{3,4}|gulfstream\s*\d{3,4}|falcon\s*\d{3,4}|global\s*\d{3,4}|challenger\s*\d{3,4})\b/i);
  if (aircraftMatch) {
    context.aircraft = aircraftMatch[0].toUpperCase();
  }

  // Airport codes
  const originMatch = m.match(/\b(egll|eggw|eglf|egkk|eglc|eglf|kord|kjfk|klax|kmia|lfmn|lfpg|lfpo|eddf|eddm|lsgg|lszh)\b/i);
  if (originMatch) {
    context.origin = originMatch[0].toUpperCase();
  }

  const destMatch = m.match(/\b(egll|eggw|eglf|egkk|eglc|eglf|kord|kjfk|klax|kmia|lfmn|lfpg|lfpo|eddf|eddm|lsgg|lszh)\b/gi);
  if (destMatch && destMatch.length > 1) {
    context.destination = destMatch[1].toUpperCase();
  }

  // Date extraction
  const dateMatch = m.match(/\b(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{2}-\d{2}-\d{4})\b/);
  if (dateMatch) {
    context.date = dateMatch[0];
  }

  // Passenger count
  const paxMatch = m.match(/\b(\d+)\s*(pax|passengers|people|seats)\b/i);
  if (paxMatch) {
    context.pax = parseInt(paxMatch[1]);
  }

  // Budget extraction
  const budgetMatch = m.match(/\b(\d+)\s*(k|thousand|gbp|pounds?)\b/i);
  if (budgetMatch) {
    const amount = parseInt(budgetMatch[1]);
    const multiplier = budgetMatch[2].toLowerCase().includes('k') ? 1000 : 1;
    context.budget_gbp = amount * multiplier;
  }

  return context;
}

// Validation
export function hasAllRequiredContext(context: Partial<AviationContext>): boolean {
  return !!(context.aircraft && context.origin && context.destination && context.date && context.pax && context.budget_gbp);
}

export function getMissingContext(context: Partial<AviationContext>): string[] {
  const missing: string[] = [];
  
  if (!context.aircraft) missing.push('aircraft type');
  if (!context.origin) missing.push('origin airport');
  if (!context.destination) missing.push('destination airport');
  if (!context.date) missing.push('departure date');
  if (!context.pax) missing.push('passenger count');
  if (!context.budget_gbp) missing.push('budget');
  
  return missing;
}
