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
}

export function money(minor: number, currency: Currency) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(minor / 100);
}

export function pricePerNm(minor: number, distanceNm: number) {
  if (!distanceNm) return null;
  return Math.round((minor / distanceNm)); // minor unit per NM
}

export function dealScore(l: Listing) {
  // Simple score. Lower price per NM, sooner date, empty leg discount, verified operator.
  const ppm = pricePerNm(l.priceMinor, l.distanceNm) ?? 0;
  let score = 0;
  score += l.operatorVerified ? 10 : 0;
  score += l.emptyLeg ? 8 : 0;
  score += Math.max(0, 20 - Math.min(20, Math.floor(ppm / 50))); // cheaper is better
  const daysOut = Math.max(0, Math.floor((new Date(l.date).getTime() - Date.now()) / 86400000));
  score += Math.max(0, 10 - Math.min(10, daysOut)); // sooner flights rank higher
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
  { id: "L1", from: "CDG", to: "LHR", date: addDaysISO(5), aircraft: "Gulfstream G550", seats: 8, priceMinor: 1500000, currency: "USD", operator: "Elite Aviation", operatorVerified: true, emptyLeg: true, distanceNm: 214, rating: 4.8, discountPct: 25, tags: ["Empty leg", "Popular"] },
  { id: "L2", from: "NYC", to: "MIA", date: addDaysISO(8), aircraft: "Citation X", seats: 6, priceMinor: 850000, currency: "USD", operator: "SkyBridge", operatorVerified: true, emptyLeg: true, distanceNm: 948, rating: 4.6, discountPct: 30, tags: ["Empty leg"] },
  { id: "L3", from: "LHR", to: "DXB", date: addDaysISO(21), aircraft: "Global 6000", seats: 12, priceMinor: 7800000, currency: "GBP", operator: "Crown Jets", operatorVerified: false, emptyLeg: false, distanceNm: 2960, rating: 4.3, tags: ["Long range"] },
  { id: "L4", from: "JFK", to: "LAX", date: addDaysISO(10), aircraft: "G650", seats: 12, priceMinor: 5200000, currency: "USD", operator: "Prime Wings", operatorVerified: true, emptyLeg: false, distanceNm: 2145, rating: 4.9, tags: ["Top rated"] },
  { id: "L5", from: "FRA", to: "ZUR", date: addDaysISO(3), aircraft: "Citation CJ4", seats: 4, priceMinor: 320000, currency: "EUR", operator: "Alpine Air", operatorVerified: true, emptyLeg: true, distanceNm: 180, rating: 4.5, discountPct: 40, tags: ["Empty leg", "Short range"] },
  { id: "L6", from: "LAX", to: "HNL", date: addDaysISO(15), aircraft: "Falcon 8X", seats: 10, priceMinor: 4200000, currency: "USD", operator: "Pacific Wings", operatorVerified: true, emptyLeg: false, distanceNm: 2550, rating: 4.7, tags: ["Long range", "Popular"] },
  { id: "L7", from: "LHR", to: "GVA", date: addDaysISO(7), aircraft: "Phenom 300", seats: 6, priceMinor: 180000, currency: "GBP", operator: "Swiss Air", operatorVerified: false, emptyLeg: false, distanceNm: 420, rating: 4.1, tags: ["Short range"] },
  { id: "L8", from: "MIA", to: "BOG", date: addDaysISO(12), aircraft: "Challenger 650", seats: 8, priceMinor: 1200000, currency: "USD", operator: "Latin Wings", operatorVerified: true, emptyLeg: true, distanceNm: 1200, rating: 4.4, discountPct: 20, tags: ["Empty leg", "International"] },
];

function addDaysISO(d: number) { 
  const t = new Date(); 
  t.setDate(t.getDate() + d); 
  return t.toISOString().slice(0, 10); 
}
