// Stratus Assist Domain Tools
// Aviation-specific tools for the chatbot
// FCA Compliant Aviation Platform

export type ToolResult<T> = 
  | { ok: true; data: T }
  | { ok: false; error: string };

export interface AvailabilityItem {
  operator_id: string;
  operator_name: string;
  aircraft_type: string;
  tail?: string;
  base_airport?: string;
  reposition_nm?: number;
  est_block_time_min?: number;
  notes?: string;
}

export interface PriceEstimate {
  operator_id: string;
  aircraft_type: string;
  est_price_gbp: number;
  breakdown: {
    flight: number;
    reposition: number;
    fees: number;
    margin: number;
  };
  constraints?: string[];
}

export interface PriceMatchResult {
  best_operator_id: string;
  rank: Array<{
    operator_id: string;
    score: number;
    note: string;
  }>;
  note: string;
}

export interface OperatorProfile {
  operator_id: string;
  name: string;
  home_bases: string[];
  safety_notes?: string;
  typical_turn_time_min?: number;
  contact_masked?: string;
}

export interface AircraftSpecs {
  type: string;
  manufacturer: string;
  model: string;
  seats: number;
  range_nm: number;
  mtow_lbs: number;
  baggage_cu_ft: number;
  noise_level: string;
  certification: string[];
}

// Tool 1: Aircraft Availability
export async function get_aircraft_availability(args: {
  aircraft_type?: string;
  origin?: string;
  destination?: string;
  depart_date?: string;
  pax?: number;
  budget_gbp?: number;
}): Promise<ToolResult<AvailabilityItem[]>> {
  try {
    // Simulate database call - replace with actual Supabase query
    const mockData: AvailabilityItem[] = [
      {
        operator_id: "op_1",
        operator_name: "SkyWest Executive",
        aircraft_type: "Gulfstream G550",
        base_airport: "EGLF",
        reposition_nm: 35,
        est_block_time_min: 120,
        notes: "IS-BAO Stage II certified"
      },
      {
        operator_id: "op_2",
        operator_name: "Albion Air",
        aircraft_type: "Gulfstream G550",
        base_airport: "EGGW",
        reposition_nm: 0,
        est_block_time_min: 115,
        notes: "ARGUS Gold rated"
      },
      {
        operator_id: "op_3",
        operator_name: "Blue Meridian",
        aircraft_type: "Gulfstream G550",
        base_airport: "LFPG",
        reposition_nm: 210,
        est_block_time_min: 125,
        notes: "Wyvern registered"
      }
    ];

    // Filter based on criteria
    let filtered = mockData;
    
    if (args.aircraft_type) {
      filtered = filtered.filter(item => 
        item.aircraft_type.toLowerCase().includes(args.aircraft_type!.toLowerCase())
      );
    }

    if (args.origin) {
      filtered = filtered.filter(item => 
        item.base_airport === args.origin || 
        (item.reposition_nm && item.reposition_nm < 100)
      );
    }

    return { ok: true, data: filtered };
  } catch (error: any) {
    return { ok: false, error: error.message || "availability_error" };
  }
}

// Tool 2: Price Estimation
export async function price_estimate(args: {
  operator_id: string;
  aircraft_type: string;
  origin: string;
  destination: string;
  depart_date: string;
  pax: number;
  extras?: {
    deice_risk?: boolean;
    wifi?: boolean;
    catering?: boolean;
  };
}): Promise<ToolResult<PriceEstimate>> {
  try {
    // Base pricing model - replace with actual pricing engine
    const baseRates: Record<string, number> = {
      "Gulfstream G550": 32000,
      "Gulfstream G650": 45000,
      "Falcon 7X": 28000,
      "Falcon 8X": 35000,
      "Global 6000": 38000,
      "Challenger 350": 18000,
      "Challenger 650": 22000
    };

    const baseRate = baseRates[args.aircraft_type] || 30000;
    
    // Reposition costs based on operator
    const repositionCosts: Record<string, number> = {
      "op_1": 2000, // SkyWest Executive
      "op_2": 0,    // Albion Air (home base)
      "op_3": 4000  // Blue Meridian (Paris)
    };

    const repositionFee = repositionCosts[args.operator_id] || 1000;
    const fees = 3000; // Landing, handling, etc.
    const margin = 2000; // Platform margin
    
    // Extras
    let extrasCost = 0;
    if (args.extras?.deice_risk) extrasCost += 500;
    if (args.extras?.wifi) extrasCost += 300;
    if (args.extras?.catering) extrasCost += 800;

    const total = baseRate + repositionFee + fees + margin + extrasCost;

    return {
      ok: true,
      data: {
        operator_id: args.operator_id,
        aircraft_type: args.aircraft_type,
        est_price_gbp: total,
        breakdown: {
          flight: baseRate,
          reposition: repositionFee,
          fees: fees + extrasCost,
          margin: margin
        },
        constraints: []
      }
    };
  } catch (error: any) {
    return { ok: false, error: error.message || "pricing_error" };
  }
}

// Tool 3: Price Matching
export async function price_match(args: {
  candidates: Array<{ operator_id: string; est_price_gbp: number }>;
  target_budget_gbp: number;
  tie_break?: "response_speed" | "aog_history" | "home_base_fit";
}): Promise<ToolResult<PriceMatchResult>> {
  try {
    // Sort by price
    const ranked = [...args.candidates].sort((a, b) => a.est_price_gbp - b.est_price_gbp);
    const best = ranked[0];

    // Calculate scores
    const scores = ranked.map((candidate, index) => {
      let score = 100 - (index * 10); // Base score decreases with rank
      
      // Budget fit bonus
      if (candidate.est_price_gbp <= args.target_budget_gbp) {
        score += 20;
      }

      // Tie-break logic
      if (args.tie_break === "home_base_fit" && index === 0) {
        score += 10;
      }

      return {
        operator_id: candidate.operator_id,
        score: Math.min(100, score),
        note: index === 0 ? "Best value" : "Alternative"
      };
    });

    const note = best.est_price_gbp <= args.target_budget_gbp 
      ? "Within budget" 
      : "Nearest to budget";

    return {
      ok: true,
      data: {
        best_operator_id: best.operator_id,
        rank: scores,
        note
      }
    };
  } catch (error: any) {
    return { ok: false, error: error.message || "match_error" };
  }
}

// Tool 4: Operator Profile
export async function get_operator_profile(args: {
  operator_id: string;
}): Promise<ToolResult<OperatorProfile>> {
  try {
    const profiles: Record<string, OperatorProfile> = {
      "op_1": {
        operator_id: "op_1",
        name: "SkyWest Executive",
        home_bases: ["EGLF"],
        typical_turn_time_min: 90,
        safety_notes: "IS-BAO Stage II certified",
        contact_masked: "***-***-****"
      },
      "op_2": {
        operator_id: "op_2",
        name: "Albion Air",
        home_bases: ["EGGW"],
        typical_turn_time_min: 75,
        safety_notes: "ARGUS Gold rated",
        contact_masked: "***-***-****"
      },
      "op_3": {
        operator_id: "op_3",
        name: "Blue Meridian",
        home_bases: ["LFPG"],
        typical_turn_time_min: 100,
        safety_notes: "Wyvern registered",
        contact_masked: "***-***-****"
      }
    };

    const profile = profiles[args.operator_id];
    if (!profile) {
      return { ok: false, error: "Operator not found" };
    }

    return { ok: true, data: profile };
  } catch (error: any) {
    return { ok: false, error: error.message || "operator_profile_error" };
  }
}

// Tool 5: Aircraft Specifications
export async function get_aircraft_specs(args: {
  aircraft_type: string;
}): Promise<ToolResult<AircraftSpecs>> {
  try {
    const specs: Record<string, AircraftSpecs> = {
      "Gulfstream G550": {
        type: "Gulfstream G550",
        manufacturer: "Gulfstream Aerospace",
        model: "G550",
        seats: 16,
        range_nm: 6750,
        mtow_lbs: 91000,
        baggage_cu_ft: 195,
        noise_level: "Stage 3",
        certification: ["FAA", "EASA", "TC"]
      },
      "Gulfstream G650": {
        type: "Gulfstream G650",
        manufacturer: "Gulfstream Aerospace",
        model: "G650",
        seats: 19,
        range_nm: 7500,
        mtow_lbs: 99600,
        baggage_cu_ft: 195,
        noise_level: "Stage 4",
        certification: ["FAA", "EASA", "TC"]
      },
      "Falcon 7X": {
        type: "Falcon 7X",
        manufacturer: "Dassault Aviation",
        model: "7X",
        seats: 16,
        range_nm: 5950,
        mtow_lbs: 70000,
        baggage_cu_ft: 140,
        noise_level: "Stage 3",
        certification: ["FAA", "EASA", "TC"]
      }
    };

    const spec = specs[args.aircraft_type];
    if (!spec) {
      return { ok: false, error: "Aircraft type not found" };
    }

    return { ok: true, data: spec };
  } catch (error: any) {
    return { ok: false, error: error.message || "aircraft_specs_error" };
  }
}

// Tool 6: Sanctions Check
export async function sanctions_check(args: {
  name: string;
  company?: string;
  country?: string;
}): Promise<ToolResult<{ clear: boolean; notes?: string }>> {
  try {
    // Simulate sanctions check - replace with actual API
    const blockedNames = ["john doe", "jane smith"]; // Example blocked names
    const blockedCompanies = ["bad company ltd"]; // Example blocked companies
    
    const nameMatch = blockedNames.some(name => 
      args.name.toLowerCase().includes(name)
    );
    
    const companyMatch = args.company && blockedCompanies.some(company => 
      args.company!.toLowerCase().includes(company)
    );

    if (nameMatch || companyMatch) {
      return {
        ok: true,
        data: {
          clear: false,
          notes: "Match found in sanctions database"
        }
      };
    }

    return {
      ok: true,
      data: {
        clear: true,
        notes: "No matches found in sanctions database"
      }
    };
  } catch (error: any) {
    return { ok: false, error: error.message || "sanctions_check_error" };
  }
}
