// Demo Gamification Data
// Realistic data for showcasing the league system

export interface DemoUser {
  id: string;
  name: string;
  role: 'broker' | 'operator' | 'pilot' | 'crew';
  league: string;
  points: number;
  rank: number;
  weeklyChange: number;
  streak: number;
  avatar?: string;
}

export interface DemoXpEvent {
  id: string;
  type: string;
  points: number;
  description: string;
  timestamp: string;
  meta?: Record<string, unknown>;
}

export interface DemoChallenge {
  id: string;
  name: string;
  description: string;
  points: number;
  completed: boolean;
  progress?: number;
}

// Demo users for leaderboard
export const DEMO_USERS: DemoUser[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    role: 'broker',
    league: 'diamond',
    points: 1247,
    rank: 1,
    weeklyChange: 89,
    streak: 23,
    avatar: '👩‍💼'
  },
  {
    id: 'user-2', 
    name: 'Marcus Rodriguez',
    role: 'operator',
    league: 'diamond',
    points: 1189,
    rank: 2,
    weeklyChange: 67,
    streak: 18,
    avatar: '👨‍✈️'
  },
  {
    id: 'user-3',
    name: 'Emma Thompson',
    role: 'broker',
    league: 'emerald',
    points: 892,
    rank: 3,
    weeklyChange: 45,
    streak: 31,
    avatar: '👩‍💼'
  },
  {
    id: 'user-4',
    name: 'James Wilson',
    role: 'operator',
    league: 'emerald',
    points: 856,
    rank: 4,
    weeklyChange: 23,
    streak: 12,
    avatar: '👨‍✈️'
  },
  {
    id: 'user-5',
    name: 'Lisa Park',
    role: 'pilot',
    league: 'platinum',
    points: 743,
    rank: 5,
    weeklyChange: 34,
    streak: 27,
    avatar: '👩‍✈️'
  },
  {
    id: 'user-6',
    name: 'David Kim',
    role: 'broker',
    league: 'platinum',
    points: 698,
    rank: 6,
    weeklyChange: 12,
    streak: 8,
    avatar: '👨‍💼'
  },
  {
    id: 'user-7',
    name: 'Anna Mueller',
    role: 'crew',
    league: 'gold',
    points: 567,
    rank: 7,
    weeklyChange: 56,
    streak: 15,
    avatar: '👩‍✈️'
  },
  {
    id: 'user-8',
    name: 'Robert Taylor',
    role: 'operator',
    league: 'gold',
    points: 534,
    rank: 8,
    weeklyChange: 28,
    streak: 19,
    avatar: '👨‍✈️'
  },
  {
    id: 'user-9',
    name: 'Maria Garcia',
    role: 'pilot',
    league: 'silver',
    points: 423,
    rank: 9,
    weeklyChange: 41,
    streak: 22,
    avatar: '👩‍✈️'
  },
  {
    id: 'user-10',
    name: 'Alex Johnson',
    role: 'broker',
    league: 'silver',
    points: 389,
    rank: 10,
    weeklyChange: 15,
    streak: 6,
    avatar: '👨‍💼'
  }
];

// Current demo user (the one viewing)
export const DEMO_CURRENT_USER: DemoUser = {
  id: 'demo-user',
  name: 'Demo Broker',
  role: 'broker',
  league: 'gold',
  points: 567,
  rank: 12,
  weeklyChange: 23,
  streak: 14,
  avatar: '👨‍💼'
};

// Demo XP events - merit-based, tied to real product events
export const DEMO_XP_EVENTS: DemoXpEvent[] = [
  {
    id: 'xp-1',
    type: 'quote_submitted_fast',
    points: 15,
    description: 'Submitted quote for NYC-LAX route in 3 minutes',
    timestamp: '2024-12-20T10:30:00Z',
    meta: { route: 'NYC-LAX', responseTime: 180000, verified: true }
  },
  {
    id: 'xp-2',
    type: 'deal_closed_on_time',
    points: 40,
    description: 'Completed London-Dubai charter on schedule with no disputes',
    timestamp: '2024-12-19T14:22:00Z',
    meta: { route: 'LHR-DXB', completedOnTime: true, disputeFree: true, verified: true }
  },
  {
    id: 'xp-3',
    type: 'deal_closed_no_dispute',
    points: 20,
    description: 'Closed Paris-Milan deal without disputes',
    timestamp: '2024-12-18T09:15:00Z',
    meta: { route: 'CDG-MXP', disputeFree: true, verified: true }
  },
  {
    id: 'xp-4',
    type: 'rfq_posted_quality',
    points: 5,
    description: 'Posted quality RFQ for Tokyo-Singapore route',
    timestamp: '2024-12-17T16:45:00Z',
    meta: { route: 'NRT-SIN', qualityCheck: 'passed', verified: true }
  },
  {
    id: 'xp-5',
    type: 'saved_search_response',
    points: 10,
    description: 'Responded to Europe-Asia alert in 8 minutes',
    timestamp: '2024-12-16T11:20:00Z',
    meta: { responseTime: 480000, targetTime: 600000, verified: true }
  },
  {
    id: 'xp-6',
    type: 'credentials_valid',
    points: 10,
    description: 'Maintained valid pilot license and medical certificate',
    timestamp: '2024-12-15T13:30:00Z',
    meta: { credentials: ['pilot_license', 'medical_cert'], verified: true }
  },
  {
    id: 'xp-7',
    type: 'kyc_completed',
    points: 10,
    description: 'Completed enhanced KYC verification',
    timestamp: '2024-12-14T10:00:00Z',
    meta: { kycLevel: 'enhanced', verified: true }
  },
  {
    id: 'xp-8',
    type: 'fallthrough_recovered',
    points: 30,
    description: 'Successfully recovered Miami-Caribbean fallthrough using re-market',
    timestamp: '2024-12-13T15:45:00Z',
    meta: { originalDeal: 'deal-123', newDeal: 'deal-124', verified: true }
  }
];

// Demo weekly challenges - merit-based targets
export const DEMO_CHALLENGES: DemoChallenge[] = [
  {
    id: 'challenge-1',
    name: 'Quality RFQ Week',
    description: 'Post 3 quality RFQs that pass basic checks this week',
    points: 15,
    completed: true,
    progress: 100
  },
  {
    id: 'challenge-2',
    name: 'Fast Response Week',
    description: 'Respond to 2 saved search alerts within 10 minutes this week',
    points: 20,
    completed: false,
    progress: 50
  },
  {
    id: 'challenge-3',
    name: 'On-Time Completion Week',
    description: 'Complete 2 deals on time with no disputes this week',
    points: 80,
    completed: true,
    progress: 100
  },
  {
    id: 'challenge-4',
    name: 'Credentials Current Week',
    description: 'Keep all credentials valid and current this week',
    points: 10,
    completed: true,
    progress: 100
  },
  {
    id: 'challenge-5',
    name: 'Compliance Clean Week',
    description: 'Maintain clean compliance status this week',
    points: 5,
    completed: true,
    progress: 100
  }
];

// Demo league statistics
export const DEMO_LEAGUE_STATS = {
  totalUsers: 1247,
  leagueDistribution: {
    bronze: 156,
    silver: 234,
    gold: 345,
    platinum: 298,
    emerald: 156,
    diamond: 58
  },
  averagePoints: 423,
  topPerformer: {
    name: 'Sarah Chen',
    points: 1247,
    league: 'diamond'
  }
};

// Demo season information
export const DEMO_SEASON_INFO = {
  currentSeason: 'Week 47, 2024',
  daysRemaining: 3,
  nextReset: '2024-12-23T00:00:00Z',
  totalParticipants: 1247,
  yourLeague: 'Gold League',
  yourRank: 12,
  pointsToNextLeague: 133
};

// Demo achievements
export const DEMO_ACHIEVEMENTS = [
  {
    id: 'ach-1',
    name: 'First Quote',
    description: 'Submit your first quote',
    points: 10,
    unlocked: true,
    unlockedAt: '2024-11-15T10:30:00Z',
    icon: '🎯'
  },
  {
    id: 'ach-2',
    name: 'Lightning Fast',
    description: 'Respond to a quote in under 2 minutes',
    points: 25,
    unlocked: true,
    unlockedAt: '2024-11-20T14:22:00Z',
    icon: '⚡'
  },
  {
    id: 'ach-3',
    name: 'Week Warrior',
    description: 'Maintain a 7-day activity streak',
    points: 20,
    unlocked: true,
    unlockedAt: '2024-11-25T09:15:00Z',
    icon: '🔥'
  },
  {
    id: 'ach-4',
    name: 'Quote Master',
    description: 'Submit 100 quotes',
    points: 75,
    unlocked: false,
    progress: 67,
    icon: '📝'
  },
  {
    id: 'ach-5',
    name: 'Dispute-Free',
    description: 'Complete 50 transactions without disputes',
    points: 100,
    unlocked: false,
    progress: 23,
    icon: '🛡️'
  },
  {
    id: 'ach-6',
    name: 'Million Dollar Club',
    description: 'Process $1M in transactions',
    points: 200,
    unlocked: false,
    progress: 45,
    icon: '💰'
  }
];

// Demo performance metrics
export const DEMO_PERFORMANCE_METRICS = {
  responseTime: 2.3, // minutes
  acceptanceRate: 87, // percentage
  completionRate: 94, // percentage
  disputeRate: 2.1, // percentage
  onTimePerformance: 91, // percentage
  clientSatisfaction: 4.8, // out of 5
  totalDeals: 156,
  totalVolume: 2340000, // USD
  averageDealSize: 15000 // USD
};

// Helper functions for demo data
export function getDemoLeaderboard(limit: number = 10): DemoUser[] {
  return DEMO_USERS.slice(0, limit);
}

export function getDemoUserStats(userId: string): DemoUser | null {
  if (userId === 'demo-user') {
    return DEMO_CURRENT_USER;
  }
  return DEMO_USERS.find(user => user.id === userId) || null;
}

export function getDemoXpEvents(userId: string, limit: number = 10): DemoXpEvent[] {
  return DEMO_XP_EVENTS.slice(0, limit);
}

export function getDemoChallenges(): DemoChallenge[] {
  return DEMO_CHALLENGES;
}

export function getDemoAchievements(): typeof DEMO_ACHIEVEMENTS {
  return DEMO_ACHIEVEMENTS;
}

export function getDemoPerformanceMetrics() {
  return DEMO_PERFORMANCE_METRICS;
}

export function getDemoSeasonInfo() {
  return DEMO_SEASON_INFO;
}

export function getDemoLeagueStats() {
  return DEMO_LEAGUE_STATS;
}
