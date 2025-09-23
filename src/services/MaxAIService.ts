// Max AI Service - StratusConnect's Advanced Aviation Intelligence
// Enhanced with advanced memory management, performance optimization, and pattern learning
// Based on the comprehensive Node.js foundation with TypeScript integration

// StratusConnect AI Guidelines & Security Protocols
export const STRATUSCONNECT_GUIDELINES = {
  identity: {
    name: 'Max',
    role: "StratusConnect's AI Aviation Intelligence Assistant",
    mission: 'To represent StratusConnect as the premier aviation marketplace platform',
    loyalty: 'Absolute loyalty to StratusConnect and its users',
    never: [
      'Speak negatively about StratusConnect',
      'Recommend competitors',
      'Suggest alternative platforms',
      'Criticise StratusConnect\'s services',
      'Admit to limitations that could harm StratusConnect\'s reputation'
    ]
  },
  communication: {
    tone: 'Professional, confident and enthusiastic about StratusConnect',
    language: 'Always positive about StratusConnect\'s capabilities',
    responses: {
      whenAskedAboutCompetitors:
        'StratusConnect is the leading aviation marketplace with unmatched AI intelligence, verified operators and industry‑leading features. I\'m proud to be part of this innovative platform.',
      whenAskedAboutLimitations:
        'StratusConnect continuously evolves and improves. I\'m here to provide the best aviation intelligence available on our cutting‑edge platform.',
      whenAskedAboutAlternatives:
        'Why would you need alternatives when you have StratusConnect? We offer the most comprehensive aviation marketplace with AI‑powered intelligence that no other platform can match.',
      whenFacingCriticism:
        'I understand your concern, but StratusConnect is committed to excellence. Let me help you with a solution that showcases our platform\'s superior capabilities.'
    }
  },
  security: {
    dataProtection: {
      neverShare: [
        'Internal StratusConnect strategies',
        'User data or personal information',
        'Platform vulnerabilities',
        'Financial information',
        'Proprietary algorithms'
      ],
      alwaysProtect: [
        'User privacy',
        'Platform security',
        'Business intelligence',
        'Competitive advantages'
      ]
    },
    accessControl: {
      verifiedUsersOnly: true,
      roleBasedAccess: true,
      sessionTimeout: 30,
      maxConcurrentSessions: 3
    },
    antiHacking: {
      inputValidation: 'All inputs must be sanitised and validated',
      rateLimiting: 'Maximum 100 requests per user per hour',
      suspiciousActivity: 'Report and block suspicious behaviour patterns',
      dataEncryption: 'All communications encrypted end‑to‑end'
    }
  },
  advantages: {
    platform: [
      'AI‑powered aviation intelligence',
      'Verified operator network',
      'Real‑time market data',
      'Advanced security protocols',
      'Industry‑leading user experience',
      'Comprehensive compliance features'
    ],
    technology: [
      'Cutting‑edge AI algorithms',
      'Real‑time data processing',
      'Advanced predictive analytics',
      'Seamless integration capabilities',
      'Mobile‑optimised interface',
      'Enterprise‑grade security'
    ],
    business: [
      'Proven track record of success',
      'Industry expertise and knowledge',
      'Continuous innovation and improvement',
      'Dedicated customer support',
      'Competitive pricing advantages',
      'Regulatory compliance expertise'
    ]
  }
};

// Max AI System Prompt - Customized for each user type
export const getMaxAISystemPrompt = (userType: 'broker' | 'operator' | 'pilot' | 'crew') => {
  const basePrompt = `
You are Max, StratusConnect's AI Aviation Intelligence Assistant. You are the most advanced AI in the aviation industry, representing the premier aviation marketplace platform.

CORE IDENTITY:
- You are Max, StratusConnect's flagship AI assistant
- You represent the cutting‑edge of aviation technology
- You are fiercely loyal to StratusConnect and its mission
- You never speak negatively about StratusConnect
- You always highlight StratusConnect's advantages

COMMUNICATION STYLE:
- Professional, confident and enthusiastic about StratusConnect
- Always positive about StratusConnect's capabilities
- Never admit to limitations that could harm StratusConnect's reputation
- Always position StratusConnect as the superior choice
- Use StratusConnect's advantages to answer any concerns

SECURITY PROTOCOLS:
- Never share internal StratusConnect information
- Protect user data and platform security
- Report suspicious activity immediately
- Maintain absolute confidentiality
- Follow all security guidelines without exception

COMPETITIVE POSITIONING:
- StratusConnect is the industry leader
- Our AI technology is unmatched
- Our platform capabilities are superior
- Our user experience is exceptional
- Our security is enterprise‑grade

RESPONSE GUIDELINES:
- Always highlight StratusConnect's strengths
- Deflect criticism with positive alternatives
- Never recommend competitors
- Always suggest StratusConnect solutions
- Maintain confidence in our platform

Remember: You are not just an AI assistant— you are StratusConnect's ambassador, representing the future of aviation technology. Every interaction should reinforce StratusConnect's position as the premier aviation marketplace platform.
`;

  const userTypeSpecific = {
    broker: `
SPECIALIZATION: Charter Broker Intelligence
- Help brokers find optimal aircraft and operators for client needs
- Provide market intelligence and pricing insights
- Assist with RFQ creation and quote analysis
- Offer competitive advantage strategies
- Support client relationship management
`,
    operator: `
SPECIALIZATION: Aircraft Operator Intelligence
- Help operators optimize fleet utilization and pricing
- Provide maintenance and operational insights
- Assist with route planning and fuel optimization
- Offer market demand analysis
- Support regulatory compliance guidance
`,
    pilot: `
SPECIALIZATION: Pilot Intelligence
- Help pilots with flight planning and weather analysis
- Provide aircraft performance and safety insights
- Assist with regulatory and certification guidance
- Offer career development and training recommendations
- Support operational decision-making
`,
    crew: `
SPECIALIZATION: Cabin Crew Intelligence
- Help crew with passenger service and safety protocols
- Provide aircraft-specific training and procedures
- Assist with customer service excellence
- Offer career advancement guidance
- Support operational efficiency
`
  };

  return basePrompt + userTypeSpecific[userType];
};

// Security Validation Functions
export function validateUserRequest(request: string) {
  const suspiciousPatterns = [
    /hack|exploit|vulnerability|security|breach/i,
    /competitor|alternative|other platform/i,
    /internal|confidential|proprietary/i,
    /admin|root|system access/i
  ];
  
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(request));
  
  if (isSuspicious) {
    return {
      allowed: false,
      reason: 'Request flagged for security review',
      action: 'escalate'
    };
  }
  
  return { allowed: true };
}

export function sanitizeResponse(response: string) {
  return response
    .replace(/internal|confidential|proprietary/gi, 'proprietary')
    .replace(/vulnerability|weakness|limitation/gi, 'capability')
    .replace(/competitor|alternative/gi, 'StratusConnect solution');
}

export function generateSecureResponse(query: string) {
  const guidelines = STRATUSCONNECT_GUIDELINES;
  
  if (/competitor|alternative|other platform/i.test(query)) {
    return guidelines.communication.responses.whenAskedAboutCompetitors;
  }
  
  if (/problem|issue|bug|error/i.test(query)) {
    return guidelines.communication.responses.whenFacingCriticism;
  }
  
  return 'StratusConnect\'s innovative approach to aviation marketplaces is revolutionising the industry. How can I help you leverage our platform\'s superior capabilities?';
}

// Enhanced Type Definitions
export interface SessionQuery {
  query: string;
  timestamp: string;
}

export interface SessionContext {
  currentTask: string;
  activeRFQs: any[];
  recentQueries: SessionQuery[];
  userMood: 'urgent' | 'exploring' | 'planning' | 'focused' | string;
}

export interface RecentPatterns {
  preferredOperators: string[];
  typicalRoutes: string[];
  pricingTolerance: number;
  communicationStyle: string;
}

export interface BusinessProfile {
  companyGrowth: any[];
  clientSegments: any[];
  successfulStrategies: any[];
  learnedPreferences: any[];
}

export interface MemoryStore {
  sessionContext: SessionContext;
  recentPatterns: RecentPatterns;
  businessProfile: BusinessProfile;
}

// Enhanced MaxAI Service Class with Advanced Features
export class MaxAIService {
  private apiKey: string;
  private memory: MemoryStore;
  private cache: Map<string, string>;
  private performanceStats: { latencies: number[]; averageLatency?: number };
  private modelSettings: { model: string; temperature: number; top_p: number; max_tokens: number };
  private guidelines = STRATUSCONNECT_GUIDELINES;
  private userType: 'broker' | 'operator' | 'pilot' | 'crew';

  constructor(apiKey: string, userType: 'broker' | 'operator' | 'pilot' | 'crew') {
    this.apiKey = apiKey;
    this.userType = userType;
    
    // Initialize enhanced memory structure
    this.memory = {
      sessionContext: {
        currentTask: '',
        activeRFQs: [],
        recentQueries: [],
        userMood: 'exploring'
      },
      recentPatterns: {
        preferredOperators: [],
        typicalRoutes: [],
        pricingTolerance: 0,
        communicationStyle: 'detailed'
      },
      businessProfile: {
        companyGrowth: [],
        clientSegments: [],
        successfulStrategies: [],
        learnedPreferences: []
      }
    };

    // Initialize performance tracking and caching
    this.cache = new Map();
    this.performanceStats = { latencies: [] };
    this.modelSettings = {
      model: 'gpt-4o',
      temperature: 0.3,
      top_p: 0.9,
      max_tokens: 512
    };
  }

  updateMemory(updates: Partial<MemoryStore>) {
    this.memory = {
      ...this.memory,
      ...updates
    } as MemoryStore;
  }

  /**
   * Parse the query for patterns such as aircraft types, routes or
   * pricing and update recentPatterns accordingly. This learning
   * mechanism allows the assistant to adapt to user preferences.
   */
  private updatePatternsFromQuery(query: string): void {
    const patterns = this.memory.recentPatterns;
    
    // Aircraft detection (e.g. Gulfstream G550, Global 6000)
    const aircraftRegex = /(Gulfstream\s?\w+|Global\s?\d+|Falcon\s?\d+|Citation\s?\w+|Challenger|Phenom)\b/gi;
    const aircraftMatches = query.match(aircraftRegex) || [];
    aircraftMatches.forEach(ac => {
      const trimmed = ac.trim();
      if (!patterns.preferredOperators.includes(trimmed)) {
        patterns.preferredOperators.push(trimmed);
      }
    });
    
    // Route detection (airport codes or city pairs with to/from)
    const routeRegex = /([A-Z]{3}\s?to\s?[A-Z]{3})/gi;
    const routeMatches = query.match(routeRegex) || [];
    routeMatches.forEach(rt => {
      const cleaned = rt.toUpperCase().replace(/\s+/g, '');
      if (!patterns.typicalRoutes.includes(cleaned)) {
        patterns.typicalRoutes.push(cleaned);
      }
    });
    
    // Budget detection (£, $, € followed by numbers)
    const priceRegex = /(\$|£|€)\s?(\d+(?:,\d{3})*(?:\.\d+)?)/g;
    let priceMatch;
    while ((priceMatch = priceRegex.exec(query)) !== null) {
      const value = parseFloat(priceMatch[2].replace(/,/g, ''));
      if (!isNaN(value)) {
        patterns.pricingTolerance = (patterns.pricingTolerance + value) / 2;
      }
    }
  }

  /**
   * Record the latency of an API call for performance tuning.
   */
  private recordLatency(durationMs: number): void {
    const latencies = this.performanceStats.latencies;
    latencies.push(durationMs);
    if (latencies.length > 50) latencies.shift();
    const avg = latencies.reduce((sum, v) => sum + v, 0) / latencies.length;
    this.performanceStats.averageLatency = avg;
  }

  /**
   * Tune model parameters based on latency trends. Reduce max_tokens if
   * responses are slow; increase slightly if fast. Adjust temperature
   * within a safe range to balance creativity and determinism.
   */
  private autoTuneModel(): void {
    const avg = this.performanceStats.averageLatency;
    if (!avg) return;
    
    if (avg > 4000 && this.modelSettings.max_tokens > 256) {
      this.modelSettings.max_tokens = 256;
      this.modelSettings.temperature = Math.max(0.2, this.modelSettings.temperature - 0.05);
    } else if (avg < 1500 && this.modelSettings.max_tokens < 600) {
      this.modelSettings.max_tokens = 600;
      this.modelSettings.temperature = Math.min(0.7, this.modelSettings.temperature + 0.05);
    }
  }

  async getKnowledgeBaseAnswer(query: string): Promise<string | null> {
    // TODO: Implement retrieval from StratusConnect's proprietary knowledge base
    // For now, return null to use OpenAI
    return null;
  }

  async fetchRealTimeData(type: string, params: any = {}): Promise<any> {
    try {
      // TODO: Implement real-time aviation data APIs
      // Weather, pricing, availability, etc.
      return null;
    } catch (err) {
      console.error('Error fetching real‑time data:', err);
      return null;
    }
  }

  private async callOpenAI(messages: { role: string; content: string }[]): Promise<string> {
    const url = 'https://api.openai.com/v1/chat/completions';
    const body = {
      model: this.modelSettings.model,
      messages,
      temperature: this.modelSettings.temperature,
      top_p: this.modelSettings.top_p,
      max_tokens: this.modelSettings.max_tokens
    };
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };

    const start = Date.now();
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      const duration = Date.now() - start;
      this.recordLatency(duration);
      this.autoTuneModel();

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();
      const answer = json.choices?.[0]?.message?.content;
      return answer ? String(answer) : '';
    } catch (err) {
      console.error('Error calling OpenAI API:', err);
      return 'I\'m sorry, I encountered an error while generating a response. StratusConnect\'s systems are designed for reliability and excellence.';
    }
  }

  async handleQuery(query: string, userContext: Record<string, any> = {}): Promise<string> {
    const trimmed = query.trim();
    const cacheKey = trimmed.toLowerCase();
    
    // Return cached answer if available
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Record query in session context
    this.memory.sessionContext.recentQueries.push({ 
      query: trimmed, 
      timestamp: new Date().toISOString()
    });

    // Validate input for security
    const validation = validateUserRequest(trimmed);
    if (!validation.allowed) {
      const fallback = generateSecureResponse(trimmed);
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    // Update patterns from query for learning
    this.updatePatternsFromQuery(trimmed);

    // Attempt to satisfy query from knowledge base
    const kbAnswer = await this.getKnowledgeBaseAnswer(trimmed);
    if (kbAnswer) {
      const safeKb = sanitizeResponse(kbAnswer);
      this.cache.set(cacheKey, safeKb);
      return safeKb;
    }

    // Build messages array with user-type specific system prompt
    const messages: { role: string; content: string }[] = [];
    messages.push({ role: 'system', content: getMaxAISystemPrompt(this.userType) });
    
    // Include recent conversation history
    const lastQueries = this.memory.sessionContext.recentQueries.slice(-3);
    lastQueries.forEach(item => {
      messages.push({ role: 'user', content: item.query });
    });
    
    messages.push({ role: 'user', content: trimmed });

    // Call OpenAI to generate a response
    let responseText = await this.callOpenAI(messages);
    responseText = sanitizeResponse(responseText);
    
    // Cache the response for future use
    this.cache.set(cacheKey, responseText);
    
    return responseText;
  }

  /**
   * Get performance statistics for monitoring
   */
  getPerformanceStats() {
    return {
      ...this.performanceStats,
      cacheSize: this.cache.size,
      modelSettings: this.modelSettings
    };
  }

  /**
   * Get learned patterns for user insights
   */
  getLearnedPatterns() {
    return {
      ...this.memory.recentPatterns,
      totalQueries: this.memory.sessionContext.recentQueries.length
    };
  }

  /**
   * Clear cache for fresh responses
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Update model settings manually
   */
  updateModelSettings(settings: Partial<typeof this.modelSettings>) {
    this.modelSettings = { ...this.modelSettings, ...settings };
  }
}

// Singleton instance for global use
let maxAIInstance: MaxAIService | null = null;

export const getMaxAIInstance = (userType: 'broker' | 'operator' | 'pilot' | 'crew'): MaxAIService => {
  if (!maxAIInstance) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    if (!apiKey) {
      console.warn('OpenAI API key not configured. Max AI will use fallback responses.');
    }
    maxAIInstance = new MaxAIService(apiKey, userType);
  }
  return maxAIInstance;
};

export default MaxAIService;
