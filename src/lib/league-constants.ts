// Merit-based scoring system - every Merit Point tied to real product events
export const XP_RULES: Record<string, number> = {
  // Brokers
  rfq_posted_quality: 5,           // Post RFQ that passes quality checks
  saved_search_response: 10,       // Act on saved search alert within target time
  quote_accepted: 25,              // Get a quote accepted
  deal_closed_on_time: 40,         // Close deal on time with no dispute
  
  // Operators  
  quote_submitted_fast: 15,        // Submit quote within target time window
  quote_accepted: 25,              // Have quote accepted
  flight_completed_on_time: 40,    // Complete flight on time
  deal_closed_no_dispute: 20,      // Close with no dispute
  fallthrough_recovered: 30,       // Recover fallthrough using re-market
  
  // Pilots & Crew
  credentials_valid: 10,           // Keep credentials valid
  assignment_completed_on_time: 25, // Accept and complete assignments on time
  positive_review_received: 15,    // Receive verified positive counterpart review
  
  // Everyone
  kyc_completed: 10,               // Complete KYC
  compliance_status_clean: 5,      // Maintain clean compliance status
  community_helpful: 10,           // Admin-awarded for real help in dispute/rescue
};

// Promotions/demotions at season end (top/bottom %)
export const PROMOTE_TOP_PCT = 0.20;      // top 20% up one league
export const DEMOTE_BOTTOM_PCT = 0.20;    // bottom 20% down one league
export const STARTING_LEAGUE_CODE = "bronze";

// Command Rating progression thresholds (Merit Points needed to stay in rating)
export const LEAGUE_THRESHOLDS: Record<string, number> = {
  bronze: 0,
  silver: 100,
  gold: 250,
  platinum: 500,
  emerald: 750,
  diamond: 1000,
};

// Weekly Merit Point targets - clear, achievable, tied to real performance
export const WEEKLY_CHALLENGES = [
  { 
    code: "rfq_quality_week", 
    label: "Post 3 quality RFQs this week", 
    points: 15,
    description: "Quality RFQs that pass basic checks drive marketplace activity"
  },
  { 
    code: "fast_response_week", 
    label: "Respond to 2 saved search alerts within 10 minutes", 
    points: 20,
    description: "Quick responses to opportunities show reliability"
  },
  { 
    code: "on_time_completion_week", 
    label: "Complete 2 deals on time with no disputes", 
    points: 80,
    description: "On-time, dispute-free completion builds trust and reputation"
  },
  { 
    code: "credentials_current_week", 
    label: "Keep all credentials valid and current", 
    points: 10,
    description: "Current credentials ensure compliance and safety"
  },
  { 
    code: "compliance_clean_week", 
    label: "Maintain clean compliance status", 
    points: 5,
    description: "Clean compliance status is required for all activities"
  },
];

// Command Rating colors for UI
export const LEAGUE_COLORS: Record<string, string> = {
  bronze: "43 74% 66%",
  silver: "217 10% 75%", 
  gold: "38 92% 50%",
  platinum: "208 26% 44%",
  emerald: "173 58% 39%",
  diamond: "27 87% 67%"
};

// Command Rating icons
export const LEAGUE_ICONS: Record<string, string> = {
  bronze: "medal",
  silver: "star",
  gold: "trophy",
  platinum: "crown",
  emerald: "gem",
  diamond: "shield"
};
