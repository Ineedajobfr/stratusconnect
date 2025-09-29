// Data Sources Configuration
// Realistic aviation data integration strategy
// FCA Compliant Aviation Platform

export interface DataSource {
  name: string;
  type: 'free' | 'premium' | 'enterprise';
  cost: string;
  dataTypes: string[];
  apiEndpoint?: string;
  rateLimit?: string;
  reliability: number;
  coverage: string[];
}

export interface DataIntegrationStrategy {
  tier: 'startup' | 'growth' | 'enterprise';
  monthlyCost: number;
  dataSources: DataSource[];
  capabilities: string[];
}

// FREE TIER - STARTUP LEVEL
export const startupDataSources: DataSource[] = [
  {
    name: 'OpenSky Network',
    type: 'free',
    cost: 'Free (with rate limits)',
    dataTypes: ['flight_tracking', 'aircraft_positions', 'flight_data'],
    apiEndpoint: 'https://opensky-network.org/api',
    rateLimit: '100 requests/minute',
    reliability: 0.85,
    coverage: ['Global', 'Real-time positions']
  },
  {
    name: 'FAA Data',
    type: 'free',
    cost: 'Free',
    dataTypes: ['aircraft_registry', 'pilot_certificates', 'airport_data'],
    apiEndpoint: 'https://www.faa.gov/data',
    rateLimit: 'No official limit',
    reliability: 0.95,
    coverage: ['US only', 'Official government data']
  },
  {
    name: 'Aviation Weather Center',
    type: 'free',
    cost: 'Free',
    dataTypes: ['weather_data', 'notams', 'tafs'],
    apiEndpoint: 'https://www.aviationweather.gov/api',
    rateLimit: '1000 requests/hour',
    reliability: 0.90,
    coverage: ['US', 'Weather forecasts']
  },
  {
    name: 'FlightRadar24',
    type: 'free',
    cost: 'Free (basic)',
    dataTypes: ['flight_tracking', 'aircraft_data'],
    apiEndpoint: 'https://www.flightradar24.com/api',
    rateLimit: 'Limited',
    reliability: 0.80,
    coverage: ['Global', 'Basic tracking']
  }
];

// PREMIUM TIER - GROWTH LEVEL
export const growthDataSources: DataSource[] = [
  ...startupDataSources,
  {
    name: 'FlightAware',
    type: 'premium',
    cost: '$50-$500/month',
    dataTypes: ['real_time_tracking', 'flight_history', 'aircraft_data', 'route_data'],
    apiEndpoint: 'https://flightaware.com/api',
    rateLimit: '1000 requests/hour',
    reliability: 0.95,
    coverage: ['Global', 'High accuracy']
  },
  {
    name: 'Aviation Edge',
    type: 'premium',
    cost: '$100-$300/month',
    dataTypes: ['aircraft_data', 'airport_data', 'airline_data', 'route_data'],
    apiEndpoint: 'https://aviation-edge.com/api',
    rateLimit: '500 requests/hour',
    reliability: 0.90,
    coverage: ['Global', 'Comprehensive aviation data']
  },
  {
    name: 'AeroAPI (FlightAware)',
    type: 'premium',
    cost: '$200-$1000/month',
    dataTypes: ['real_time_flights', 'aircraft_data', 'airport_data', 'weather'],
    apiEndpoint: 'https://aeroapi.flightaware.com/api',
    rateLimit: '5000 requests/hour',
    reliability: 0.98,
    coverage: ['Global', 'Enterprise grade']
  }
];

// ENTERPRISE TIER - FULL FEATURES
export const enterpriseDataSources: DataSource[] = [
  ...growthDataSources,
  {
    name: 'Bloomberg Terminal',
    type: 'enterprise',
    cost: '$27,660/year per terminal',
    dataTypes: ['financial_data', 'market_data', 'news', 'analytics'],
    apiEndpoint: 'Bloomberg Server API',
    rateLimit: 'Unlimited',
    reliability: 0.99,
    coverage: ['Global', 'Financial markets']
  },
  {
    name: 'Refinitiv (Thomson Reuters)',
    type: 'enterprise',
    cost: '$1,000-$5,000/month',
    dataTypes: ['market_data', 'news', 'analytics', 'financial_data'],
    apiEndpoint: 'Refinitiv Data Platform API',
    rateLimit: 'Unlimited',
    reliability: 0.99,
    coverage: ['Global', 'Financial markets']
  },
  {
    name: 'S&P Global Market Intelligence',
    type: 'enterprise',
    cost: '$500-$2,000/month',
    dataTypes: ['company_data', 'financial_data', 'market_intelligence'],
    apiEndpoint: 'S&P Global API',
    rateLimit: 'Unlimited',
    reliability: 0.98,
    coverage: ['Global', 'Company analysis']
  },
  {
    name: 'IATA Data',
    type: 'enterprise',
    cost: '$2,000-$10,000/month',
    dataTypes: ['airline_data', 'route_data', 'passenger_data', 'cargo_data'],
    apiEndpoint: 'IATA API',
    rateLimit: 'Unlimited',
    reliability: 0.99,
    coverage: ['Global', 'Industry data']
  }
];

// DATA INTEGRATION STRATEGIES
export const dataIntegrationStrategies: DataIntegrationStrategy[] = [
  {
    tier: 'startup',
    monthlyCost: 0,
    dataSources: startupDataSources,
    capabilities: [
      'Basic flight tracking',
      'Aircraft registry lookup',
      'Weather data',
      'Simple analytics',
      'Limited real-time data'
    ]
  },
  {
    tier: 'growth',
    monthlyCost: 500,
    dataSources: growthDataSources,
    capabilities: [
      'Real-time flight tracking',
      'Comprehensive aircraft data',
      'Route analysis',
      'Advanced analytics',
      'Historical data',
      'API integrations'
    ]
  },
  {
    tier: 'enterprise',
    monthlyCost: 5000,
    dataSources: enterpriseDataSources,
    capabilities: [
      'Bloomberg Terminal integration',
      'Real-time financial data',
      'Market intelligence',
      'Advanced analytics',
      'Unlimited API access',
      'Custom data feeds',
      'Enterprise support'
    ]
  }
];

// RECOMMENDED IMPLEMENTATION PLAN
export const implementationPlan = {
  phase1: {
    name: 'MVP Launch',
    duration: '1-2 months',
    cost: 0,
    dataSources: ['OpenSky Network', 'FAA Data', 'Aviation Weather'],
    features: ['Basic flight tracking', 'Aircraft lookup', 'Weather data']
  },
  phase2: {
    name: 'Enhanced Features',
    duration: '2-3 months',
    cost: 500,
    dataSources: ['FlightAware', 'Aviation Edge'],
    features: ['Real-time tracking', 'Route analysis', 'Advanced analytics']
  },
  phase3: {
    name: 'Enterprise Integration',
    duration: '3-6 months',
    cost: 5000,
    dataSources: ['Bloomberg Terminal', 'Refinitiv', 'IATA Data'],
    features: ['Financial data', 'Market intelligence', 'Custom analytics']
  }
};

// REALISTIC BUDGET BREAKDOWN
export const budgetBreakdown = {
  startup: {
    monthly: 0,
    yearly: 0,
    features: 'Basic functionality',
    recommendation: 'Start here, prove concept'
  },
  growth: {
    monthly: 500,
    yearly: 6000,
    features: 'Professional features',
    recommendation: 'Scale when you have revenue'
  },
  enterprise: {
    monthly: 5000,
    yearly: 60000,
    features: 'Bloomberg-level intelligence',
    recommendation: 'Only when you have serious funding'
  }
};

// QUICK WINS - IMMEDIATE IMPLEMENTATION
export const quickWins = [
  {
    source: 'OpenSky Network',
    cost: 'Free',
    implementation: '1 week',
    impact: 'High',
    description: 'Real-time aircraft tracking'
  },
  {
    source: 'FAA Data',
    cost: 'Free',
    implementation: '1 week',
    impact: 'Medium',
    description: 'Aircraft registry and pilot data'
  },
  {
    source: 'Aviation Weather',
    cost: 'Free',
    implementation: '1 week',
    impact: 'High',
    description: 'Weather data for route planning'
  },
  {
    source: 'FlightAware Basic',
    cost: '$50/month',
    implementation: '2 weeks',
    impact: 'Very High',
    description: 'Enhanced flight tracking'
  }
];

export default {
  startupDataSources,
  growthDataSources,
  enterpriseDataSources,
  dataIntegrationStrategies,
  implementationPlan,
  budgetBreakdown,
  quickWins
};
