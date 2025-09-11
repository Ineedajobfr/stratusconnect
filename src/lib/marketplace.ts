// StratusConnect — Advanced Marketplace Demo
// React 18, TypeScript, Tailwind, shadcn ui optional
// Drop these files into your repo. Use alongside the Compliant Demo Terminals Pack.
// Route: src/pages/DemoMarketplace.tsx
// Helpers and components included below in one file for delivery. Split into files in your project.

// ============================================================================
// src/lib/marketplace.ts  helpers and mock data
// ============================================================================
export type Currency = "GBP" | "EUR" | "USD";
export interface Listing {
  id: string;
  from: string; // IATA
  to: string;   // IATA
  date: string; // ISO date
  aircraft: string;
  seats: number;
  priceMinor: number; // pennies or cents
  currency: Currency;
  operator: string;
  operatorVerified: boolean;
  emptyLeg: boolean;
  distanceNm: number; // nautical miles
  rating: number; // 1..5
  discountPct?: number;
  tags?: string[];
  // New competitive features
  safetyRating?: 'ARGUS Gold' | 'ARGUS Silver' | 'ARGUS Platinum' | 'Not Rated';
  wyvernStatus?: 'WYVERN Elite' | 'WYVERN Certified' | 'Not Certified';
  carbonPerPax?: number; // tonnes CO2 per passenger
  instantQuote?: boolean;
  p50Response?: number; // minutes to first quote
  completionRate?: number; // percentage
  autoMatch?: boolean;
}

export function money(minor: number, currency: Currency) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(minor / 100);
}

export function pricePerNm(minor: number, distanceNm: number) {
  if (!distanceNm) return null;
  return Math.round((minor / distanceNm)); // minor unit per NM
}

export function dealScore(l: Listing) {
  // Enhanced score with safety ratings, performance metrics, and competitive features
  const ppm = pricePerNm(l.priceMinor, l.distanceNm) ?? 0;
  let score = 0;
  
  // Base verification and empty leg bonuses
  score += l.operatorVerified ? 10 : 0;
  score += l.emptyLeg ? 8 : 0;
  
  // Safety rating bonuses (ARGUS/WYVERN)
  if (l.safetyRating === 'ARGUS Platinum') score += 15;
  else if (l.safetyRating === 'ARGUS Gold') score += 12;
  else if (l.safetyRating === 'ARGUS Silver') score += 8;
  else if (l.safetyRating === 'Not Rated') score -= 5;
  
  if (l.wyvernStatus === 'WYVERN Elite') score += 10;
  else if (l.wyvernStatus === 'WYVERN Certified') score += 6;
  
  // Performance metrics
  if (l.p50Response && l.p50Response <= 5) score += 10;
  else if (l.p50Response && l.p50Response <= 10) score += 5;
  else if (l.p50Response && l.p50Response > 15) score -= 5;
  
  if (l.completionRate && l.completionRate >= 99) score += 8;
  else if (l.completionRate && l.completionRate >= 97) score += 5;
  else if (l.completionRate && l.completionRate < 95) score -= 3;
  
  // Instant quote and auto-match bonuses
  if (l.instantQuote) score += 5;
  if (l.autoMatch) score += 3;
  
  // Price competitiveness (cheaper is better)
  score += Math.max(0, 20 - Math.min(20, Math.floor(ppm / 50)));
  
  // Urgency bonus (sooner flights rank higher)
  const daysOut = Math.max(0, Math.floor((new Date(l.date).getTime() - Date.now()) / 86400000));
  score += Math.max(0, 10 - Math.min(10, daysOut));
  
  return Math.min(100, score * 3);
}

export function scoreLabel(score: number) {
  if (score >= 200) return { label: "Exceptional", tone: "text-emerald-400" };
  if (score >= 150) return { label: "Excellent", tone: "text-emerald-400" };
  if (score >= 110) return { label: "Strong", tone: "text-lime-300" };
  if (score >= 80) return { label: "Fair", tone: "text-yellow-300" };
  return { label: "Weak", tone: "text-red-300" };
}

export function estimateCO2Tonnes(distanceNm: number, seats: number) {
  // Rough demo estimate. Not for production. Replace with real calculator later.
  const kgPerNm = 4.0; // placeholder factor
  const totalKg = kgPerNm * distanceNm;
  const perPaxTonnes = (totalKg / 1000) / Math.max(1, seats);
  return Number(perPaxTonnes.toFixed(2));
}

export function computeFees(priceMinor: number) {
  const platformFeeMinor = Math.round(priceMinor * 0.07);
  const toOperatorMinor = priceMinor - platformFeeMinor;
  return { platformFeeMinor, toOperatorMinor };
}

export const MOCK_LISTINGS: Listing[] = [
  // Premium ARGUS/WYVERN rated operators with safety badges
  { 
    id: "L1", 
    from: "CDG", 
    to: "LHR", 
    date: addDaysISO(5), 
    aircraft: "Gulfstream G650", 
    seats: 8, 
    priceMinor: 1500000, 
    currency: "USD", 
    operator: "Elite Aviation", 
    operatorVerified: true, 
    emptyLeg: true, 
    distanceNm: 214, 
    rating: 4.8, 
    discountPct: 25, 
    tags: ["Empty leg", "Popular", "ARGUS Gold", "WYVERN"],
    safetyRating: "ARGUS Gold",
    wyvernStatus: "WYVERN Certified",
    carbonPerPax: 0.8,
    instantQuote: true,
    p50Response: 3.2,
    completionRate: 98.5,
    autoMatch: true
  },
  { 
    id: "L2", 
    from: "NYC", 
    to: "MIA", 
    date: addDaysISO(8), 
    aircraft: "Citation X", 
    seats: 6, 
    priceMinor: 850000, 
    currency: "USD", 
    operator: "SkyBridge", 
    operatorVerified: true, 
    emptyLeg: true, 
    distanceNm: 948, 
    rating: 4.6, 
    discountPct: 30, 
    tags: ["Empty leg", "ARGUS Silver"],
    safetyRating: "ARGUS Silver",
    wyvernStatus: "Not Certified",
    carbonPerPax: 1.2,
    instantQuote: true,
    p50Response: 4.1,
    completionRate: 96.8,
    autoMatch: true
  },
  { 
    id: "L3", 
    from: "LHR", 
    to: "DXB", 
    date: addDaysISO(21), 
    aircraft: "Global 6000", 
    seats: 12, 
    priceMinor: 7800000, 
    currency: "GBP", 
    operator: "Crown Jets", 
    operatorVerified: false, 
    emptyLeg: false, 
    distanceNm: 2960, 
    rating: 4.3, 
    tags: ["Long range", "ARGUS Platinum"],
    safetyRating: "ARGUS Platinum",
    wyvernStatus: "WYVERN Elite",
    carbonPerPax: 2.1,
    instantQuote: false,
    p50Response: 8.5,
    completionRate: 99.2,
    autoMatch: false
  },
  { 
    id: "L4", 
    from: "JFK", 
    to: "LAX", 
    date: addDaysISO(10), 
    aircraft: "G650", 
    seats: 12, 
    priceMinor: 5200000, 
    currency: "USD", 
    operator: "Prime Wings", 
    operatorVerified: true, 
    emptyLeg: false, 
    distanceNm: 2145, 
    rating: 4.9, 
    tags: ["Top rated", "ARGUS Gold", "WYVERN Elite"],
    safetyRating: "ARGUS Gold",
    wyvernStatus: "WYVERN Elite",
    carbonPerPax: 1.8,
    instantQuote: true,
    p50Response: 2.1,
    completionRate: 99.7,
    autoMatch: true
  },
  // Additional listings with safety badges and carbon data
  { 
    id: "L5", 
    from: "LAX", 
    to: "HNL", 
    date: addDaysISO(12), 
    aircraft: "Bombardier Global 7500", 
    seats: 16, 
    priceMinor: 3200000, 
    currency: "USD", 
    operator: "Pacific Wings", 
    operatorVerified: true, 
    emptyLeg: true, 
    distanceNm: 2556, 
    rating: 4.7, 
    discountPct: 20, 
    tags: ["Empty leg", "ARGUS Gold", "WYVERN", "Long range"],
    safetyRating: "ARGUS Gold",
    wyvernStatus: "WYVERN Certified",
    carbonPerPax: 1.5,
    instantQuote: true,
    p50Response: 3.8,
    completionRate: 97.9,
    autoMatch: true
  },
  { 
    id: "L6", 
    from: "FRA", 
    to: "TEB", 
    date: addDaysISO(15), 
    aircraft: "Dassault Falcon 8X", 
    seats: 10, 
    priceMinor: 4200000, 
    currency: "EUR", 
    operator: "European Elite", 
    operatorVerified: true, 
    emptyLeg: false, 
    distanceNm: 3850, 
    rating: 4.5, 
    tags: ["ARGUS Silver", "Transatlantic"],
    safetyRating: "ARGUS Silver",
    wyvernStatus: "Not Certified",
    carbonPerPax: 2.3,
    instantQuote: false,
    p50Response: 6.2,
    completionRate: 95.4,
    autoMatch: false
  },
  { 
    id: "L7", 
    from: "MIA", 
    to: "SFO", 
    date: addDaysISO(7), 
    aircraft: "Gulfstream G550", 
    seats: 8, 
    priceMinor: 2800000, 
    currency: "USD", 
    operator: "Coast Aviation", 
    operatorVerified: true, 
    emptyLeg: true, 
    distanceNm: 2580, 
    rating: 4.4, 
    discountPct: 35, 
    tags: ["Empty leg", "ARGUS Gold", "WYVERN Elite"],
    safetyRating: "ARGUS Gold",
    wyvernStatus: "WYVERN Elite",
    carbonPerPax: 1.9,
    instantQuote: true,
    p50Response: 2.8,
    completionRate: 98.1,
    autoMatch: true
  },
  { 
    id: "L8", 
    from: "LHR", 
    to: "NCE", 
    date: addDaysISO(3), 
    aircraft: "Citation CJ4", 
    seats: 4, 
    priceMinor: 450000, 
    currency: "GBP", 
    operator: "Mediterranean Air", 
    operatorVerified: false, 
    emptyLeg: true, 
    distanceNm: 680, 
    rating: 4.2, 
    discountPct: 40, 
    tags: ["Empty leg", "Short haul", "No Safety Rating"],
    safetyRating: "Not Rated",
    wyvernStatus: "Not Certified",
    carbonPerPax: 0.6,
    instantQuote: false,
    p50Response: 12.3,
    completionRate: 89.2,
    autoMatch: false
  },
  { 
    id: "L9", 
    from: "JFK", 
    to: "LHR", 
    date: addDaysISO(18), 
    aircraft: "Boeing BBJ MAX", 
    seats: 20, 
    priceMinor: 8500000, 
    currency: "USD", 
    operator: "Atlantic Airways", 
    operatorVerified: true, 
    emptyLeg: false, 
    distanceNm: 3450, 
    rating: 4.6, 
    tags: ["ARGUS Platinum", "WYVERN Elite", "Large Group"],
    safetyRating: "ARGUS Platinum",
    wyvernStatus: "WYVERN Elite",
    carbonPerPax: 1.2,
    instantQuote: true,
    p50Response: 4.5,
    completionRate: 99.1,
    autoMatch: true
  },
  { 
    id: "L10", 
    from: "CDG", 
    to: "FCO", 
    date: addDaysISO(6), 
    aircraft: "Pilatus PC-24", 
    seats: 6, 
    priceMinor: 320000, 
    currency: "EUR", 
    operator: "Alpine Aviation", 
    operatorVerified: true, 
    emptyLeg: true, 
    distanceNm: 580, 
    rating: 4.1, 
    discountPct: 15, 
    tags: ["Empty leg", "ARGUS Silver", "Short haul"],
    safetyRating: "ARGUS Silver",
    wyvernStatus: "Not Certified",
    carbonPerPax: 0.4,
    instantQuote: true,
    p50Response: 3.7,
    completionRate: 94.8,
    autoMatch: true
  }
];

function addDaysISO(d: number) { 
  const t = new Date(); 
  t.setDate(t.getDate() + d); 
  return t.toISOString().slice(0, 10); 
}
