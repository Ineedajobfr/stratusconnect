export const XP_RULES: Record<string, number> = {
  rfq_posted: 5,
  quote_submitted_fast: 15,
  quote_accepted: 25,
  deal_completed_on_time: 40,
  dispute_free_deal: 20,
  kyc_completed: 10,
  credentials_up_to_date: 10,
  saved_search_hit_response: 10,
  fallthrough_recovered: 30,
  community_helpful: 10,
};

// Promotions/demotions at season end (top/bottom %)
export const PROMOTE_TOP_PCT = 0.20;      // top 20% up one league
export const DEMOTE_BOTTOM_PCT = 0.20;    // bottom 20% down one league
export const STARTING_LEAGUE_CODE = "bronze";

// League progression thresholds (points needed to stay in league)
export const LEAGUE_THRESHOLDS: Record<string, number> = {
  bronze: 0,
  silver: 100,
  gold: 250,
  platinum: 500,
  emerald: 750,
  diamond: 1000,
};

// Weekly challenges
export const WEEKLY_CHALLENGES = [
  { 
    code: "quote_submitted_fast", 
    label: "Submit a quote within 5 minutes", 
    points: 15,
    description: "Quick responses show reliability and professionalism"
  },
  { 
    code: "deal_completed_on_time", 
    label: "Complete a deal on time", 
    points: 40,
    description: "Meeting deadlines builds trust and reputation"
  },
  { 
    code: "dispute_free_deal", 
    label: "Close a dispute-free deal", 
    points: 20,
    description: "Quality service prevents disputes and builds relationships"
  },
  { 
    code: "saved_search_hit_response", 
    label: "Respond to a saved-search alert within 10 minutes", 
    points: 10,
    description: "Fast responses to opportunities show engagement"
  },
  { 
    code: "credentials_up_to_date", 
    label: "Keep credentials up to date", 
    points: 10,
    description: "Current credentials ensure compliance and safety"
  },
];

// League colors for UI
export const LEAGUE_COLORS: Record<string, string> = {
  bronze: "43 74% 66%",
  silver: "217 10% 75%", 
  gold: "38 92% 50%",
  platinum: "208 26% 44%",
  emerald: "173 58% 39%",
  diamond: "27 87% 67%"
};

// League icons
export const LEAGUE_ICONS: Record<string, string> = {
  bronze: "medal",
  silver: "star",
  gold: "trophy",
  platinum: "crown",
  emerald: "gem",
  diamond: "shield"
};
