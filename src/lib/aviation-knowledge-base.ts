// Comprehensive Aviation Knowledge Base for AI Assistant
export interface AircraftData {
  id: string;
  manufacturer: string;
  model: string;
  type: 'jet' | 'turboprop' | 'helicopter' | 'piston';
  capacity: {
    passengers: number;
    crew: number;
  };
  range: number; // nautical miles
  speed: number; // knots
  fuelCapacity: number; // gallons
  operatingCosts: {
    hourly: number;
    daily: number;
  };
  certifications: string[];
  commonRoutes: string[];
  marketPosition: 'entry' | 'mid' | 'premium' | 'ultra-luxury';
}

export interface AirportData {
  icao: string;
  iata: string;
  name: string;
  city: string;
  country: string;
  coordinates: [number, number];
  elevation: number;
  runways: Array<{
    length: number;
    width: number;
    surface: string;
  }>;
  facilities: string[];
  restrictions: string[];
  popularDestinations: string[];
}

export interface RegulationData {
  authority: 'FAA' | 'EASA' | 'ICAO' | 'CAA';
  category: string;
  title: string;
  description: string;
  requirements: string[];
  penalties: string[];
  lastUpdated: string;
}

export interface MarketData {
  segment: string;
  currentTrend: 'up' | 'down' | 'stable';
  averageRates: {
    hourly: number;
    daily: number;
    weekly: number;
  };
  demandFactors: string[];
  seasonalPatterns: Record<string, number>;
  keyPlayers: string[];
  growthProjection: number;
}

// Aircraft Database
export const aircraftDatabase: AircraftData[] = [
  {
    id: 'g650er',
    manufacturer: 'Gulfstream',
    model: 'G650ER',
    type: 'jet',
    capacity: { passengers: 19, crew: 4 },
    range: 7500,
    speed: 516,
    fuelCapacity: 48000,
    operatingCosts: { hourly: 6500, daily: 52000 },
    certifications: ['FAA', 'EASA', 'ICAO'],
    commonRoutes: ['TEB-LHR', 'LAX-NRT', 'JFK-LHR'],
    marketPosition: 'ultra-luxury'
  },
  {
    id: 'g550',
    manufacturer: 'Gulfstream',
    model: 'G550',
    type: 'jet',
    capacity: { passengers: 16, crew: 4 },
    range: 6750,
    speed: 488,
    fuelCapacity: 42000,
    operatingCosts: { hourly: 5500, daily: 44000 },
    certifications: ['FAA', 'EASA'],
    commonRoutes: ['TEB-LHR', 'LAX-NRT'],
    marketPosition: 'premium'
  },
  {
    id: 'global7500',
    manufacturer: 'Bombardier',
    model: 'Global 7500',
    type: 'jet',
    capacity: { passengers: 19, crew: 4 },
    range: 7700,
    speed: 516,
    fuelCapacity: 50000,
    operatingCosts: { hourly: 7000, daily: 56000 },
    certifications: ['FAA', 'EASA', 'ICAO'],
    commonRoutes: ['TEB-LHR', 'LAX-NRT', 'JFK-LHR'],
    marketPosition: 'ultra-luxury'
  },
  {
    id: 'challenger350',
    manufacturer: 'Bombardier',
    model: 'Challenger 350',
    type: 'jet',
    capacity: { passengers: 12, crew: 3 },
    range: 3200,
    speed: 470,
    fuelCapacity: 20000,
    operatingCosts: { hourly: 3500, daily: 28000 },
    certifications: ['FAA', 'EASA'],
    commonRoutes: ['TEB-MIA', 'LAX-DFW'],
    marketPosition: 'mid'
  },
  {
    id: 'phenom300e',
    manufacturer: 'Embraer',
    model: 'Phenom 300E',
    type: 'jet',
    capacity: { passengers: 9, crew: 2 },
    range: 2000,
    speed: 464,
    fuelCapacity: 12000,
    operatingCosts: { hourly: 2500, daily: 20000 },
    certifications: ['FAA', 'EASA'],
    commonRoutes: ['TEB-ATL', 'LAX-DEN'],
    marketPosition: 'entry'
  },
  {
    id: 'kingair350i',
    manufacturer: 'Beechcraft',
    model: 'King Air 350i',
    type: 'turboprop',
    capacity: { passengers: 11, crew: 2 },
    range: 1800,
    speed: 312,
    fuelCapacity: 8000,
    operatingCosts: { hourly: 1500, daily: 12000 },
    certifications: ['FAA', 'EASA'],
    commonRoutes: ['TEB-ATL', 'LAX-DEN'],
    marketPosition: 'entry'
  }
];

// Airport Database
export const airportDatabase: AirportData[] = [
  {
    icao: 'KTEB',
    iata: 'TEB',
    name: 'Teterboro Airport',
    city: 'Teterboro',
    country: 'USA',
    coordinates: [40.8501, -74.0608],
    elevation: 9,
    runways: [
      { length: 7000, width: 150, surface: 'Asphalt' },
      { length: 6000, width: 150, surface: 'Asphalt' }
    ],
    facilities: ['FBO', 'Customs', 'Catering', 'Fuel'],
    restrictions: ['No scheduled commercial flights', 'Noise restrictions'],
    popularDestinations: ['LHR', 'NRT', 'LAX', 'MIA']
  },
  {
    icao: 'EGLL',
    iata: 'LHR',
    name: 'London Heathrow Airport',
    city: 'London',
    country: 'UK',
    coordinates: [51.4700, -0.4543],
    elevation: 83,
    runways: [
      { length: 12802, width: 150, surface: 'Asphalt' },
      { length: 12000, width: 150, surface: 'Asphalt' }
    ],
    facilities: ['FBO', 'Customs', 'Catering', 'Fuel', 'Maintenance'],
    restrictions: ['Slot restrictions', 'Noise restrictions'],
    popularDestinations: ['JFK', 'LAX', 'NRT', 'DXB']
  },
  {
    icao: 'KLAX',
    iata: 'LAX',
    name: 'Los Angeles International Airport',
    city: 'Los Angeles',
    country: 'USA',
    coordinates: [33.9425, -118.4081],
    elevation: 125,
    runways: [
      { length: 12091, width: 150, surface: 'Asphalt' },
      { length: 12091, width: 150, surface: 'Asphalt' }
    ],
    facilities: ['FBO', 'Customs', 'Catering', 'Fuel', 'Maintenance'],
    restrictions: ['Slot restrictions', 'Noise restrictions'],
    popularDestinations: ['JFK', 'LHR', 'NRT', 'HNL']
  }
];

// Regulation Database
export const regulationDatabase: RegulationData[] = [
  {
    authority: 'FAA',
    category: 'Part 135',
    title: 'Operating Requirements: Commuter and On Demand Operations',
    description: 'Regulates commercial operations of aircraft with 30 or fewer seats',
    requirements: [
      'Valid Air Carrier Certificate',
      'Operations Specifications',
      'Maintenance Program',
      'Training Program',
      'Drug and Alcohol Testing Program'
    ],
    penalties: ['Civil penalties up to $25,000 per violation', 'Certificate suspension/revocation'],
    lastUpdated: '2024-01-15'
  },
  {
    authority: 'FAA',
    category: 'Part 91',
    title: 'General Operating and Flight Rules',
    description: 'Basic operating rules for all aircraft operations',
    requirements: [
      'Valid pilot certificate',
      'Medical certificate',
      'Aircraft airworthiness certificate',
      'Registration',
      'Insurance'
    ],
    penalties: ['Civil penalties up to $15,000 per violation', 'Certificate suspension'],
    lastUpdated: '2024-02-01'
  },
  {
    authority: 'EASA',
    category: 'Part-ORO',
    title: 'Organisation Requirements for Air Operations',
    description: 'Requirements for commercial air transport operations in Europe',
    requirements: [
      'Air Operator Certificate',
      'Operations Manual',
      'Maintenance Control Manual',
      'Training Manual',
      'Safety Management System'
    ],
    penalties: ['Administrative fines', 'Certificate suspension/revocation'],
    lastUpdated: '2024-01-20'
  }
];

// Market Data
export const marketDatabase: MarketData[] = [
  {
    segment: 'Ultra-Long Range Jets',
    currentTrend: 'up',
    averageRates: { hourly: 6500, daily: 52000, weekly: 364000 },
    demandFactors: ['Corporate travel recovery', 'International business growth', 'Luxury market expansion'],
    seasonalPatterns: { 'Q1': 0.9, 'Q2': 1.1, 'Q3': 1.2, 'Q4': 0.8 },
    keyPlayers: ['Gulfstream', 'Bombardier', 'Dassault'],
    growthProjection: 8.5
  },
  {
    segment: 'Mid-Size Jets',
    currentTrend: 'stable',
    averageRates: { hourly: 3500, daily: 28000, weekly: 196000 },
    demandFactors: ['Regional business travel', 'Fractional ownership', 'Charter operations'],
    seasonalPatterns: { 'Q1': 0.95, 'Q2': 1.05, 'Q3': 1.1, 'Q4': 0.9 },
    keyPlayers: ['Bombardier', 'Cessna', 'Embraer'],
    growthProjection: 5.2
  },
  {
    segment: 'Light Jets',
    currentTrend: 'up',
    averageRates: { hourly: 2500, daily: 20000, weekly: 140000 },
    demandFactors: ['Entry-level market growth', 'Cost efficiency', 'Regional connectivity'],
    seasonalPatterns: { 'Q1': 0.9, 'Q2': 1.0, 'Q3': 1.1, 'Q4': 1.0 },
    keyPlayers: ['Embraer', 'Cessna', 'HondaJet'],
    growthProjection: 6.8
  },
  {
    segment: 'Turboprops',
    currentTrend: 'stable',
    averageRates: { hourly: 1500, daily: 12000, weekly: 84000 },
    demandFactors: ['Short-haul efficiency', 'Lower operating costs', 'Regional access'],
    seasonalPatterns: { 'Q1': 0.95, 'Q2': 1.0, 'Q3': 1.05, 'Q4': 1.0 },
    keyPlayers: ['Beechcraft', 'Pilatus', 'Daher'],
    growthProjection: 3.5
  }
];

// User Experience Learning Database
export interface UserExperience {
  userId: string;
  userType: 'broker' | 'operator' | 'pilot' | 'crew' | 'admin';
  query: string;
  response: string;
  rating: number; // 1-5
  feedback: string;
  timestamp: string;
  context: Record<string, any>;
}

export const userExperienceDatabase: UserExperience[] = [];

// AI Response Templates
export const responseTemplates = {
  aircraft: {
    specifications: (aircraft: AircraftData) => 
      `The ${aircraft.manufacturer} ${aircraft.model} is a ${aircraft.type} aircraft with a capacity of ${aircraft.capacity.passengers} passengers and ${aircraft.capacity.crew} crew. It has a range of ${aircraft.range} nautical miles and cruises at ${aircraft.speed} knots. Operating costs are approximately $${aircraft.operatingCosts.hourly.toLocaleString()} per hour.`,
    
    comparison: (aircraft1: AircraftData, aircraft2: AircraftData) =>
      `Comparing the ${aircraft1.manufacturer} ${aircraft1.model} vs ${aircraft2.manufacturer} ${aircraft2.model}: The ${aircraft1.model} has a range of ${aircraft1.range}nm vs ${aircraft2.range}nm, capacity of ${aircraft1.capacity.passengers} vs ${aircraft2.capacity.passengers} passengers, and hourly costs of $${aircraft1.operatingCosts.hourly.toLocaleString()} vs $${aircraft2.operatingCosts.hourly.toLocaleString()}.`,
    
    recommendation: (aircraft: AircraftData, requirements: any) =>
      `Based on your requirements, the ${aircraft.manufacturer} ${aircraft.model} would be an excellent choice. It offers ${aircraft.range}nm range, ${aircraft.capacity.passengers} passenger capacity, and is positioned in the ${aircraft.marketPosition} market segment.`
  },
  
  market: {
    analysis: (segment: MarketData) =>
      `The ${segment.segment} market is currently trending ${segment.currentTrend} with average rates of $${segment.averageRates.hourly.toLocaleString()}/hour. Key growth factors include ${segment.demandFactors.join(', ')}. The market is projected to grow ${segment.growthProjection}% annually.`,
    
    pricing: (segment: MarketData, route: string) =>
      `For ${segment.segment} on the ${route} route, expect rates around $${segment.averageRates.hourly.toLocaleString()}/hour. Seasonal variations show ${Object.entries(segment.seasonalPatterns).map(([q, factor]) => `${q}: ${(factor * 100).toFixed(0)}%`).join(', ')}.`
  },
  
  regulations: {
    compliance: (regulation: RegulationData) =>
      `For ${regulation.authority} ${regulation.category} compliance, you need: ${regulation.requirements.join(', ')}. Violations can result in ${regulation.penalties.join(' or ')}.`,
    
    updates: (regulation: RegulationData) =>
      `The ${regulation.title} was last updated on ${regulation.lastUpdated}. Key requirements include ${regulation.requirements.slice(0, 3).join(', ')}.`
  }
};

// Smart Query Processing
export function processAviationQuery(query: string, userType: string): {
  category: string;
  confidence: number;
  response: string;
  data?: any;
} {
  const lowerQuery = query.toLowerCase();
  
  // Aircraft queries
  if (lowerQuery.includes('aircraft') || lowerQuery.includes('jet') || lowerQuery.includes('plane')) {
    const aircraft = aircraftDatabase.find(a => 
      lowerQuery.includes(a.model.toLowerCase()) || 
      lowerQuery.includes(a.manufacturer.toLowerCase())
    );
    
    if (aircraft) {
      return {
        category: 'aircraft',
        confidence: 0.9,
        response: responseTemplates.aircraft.specifications(aircraft),
        data: aircraft
      };
    }
  }
  
  // Market queries
  if (lowerQuery.includes('market') || lowerQuery.includes('pricing') || lowerQuery.includes('rates')) {
    const segment = marketDatabase.find(s => 
      lowerQuery.includes(s.segment.toLowerCase())
    );
    
    if (segment) {
      return {
        category: 'market',
        confidence: 0.8,
        response: responseTemplates.market.analysis(segment),
        data: segment
      };
    }
  }
  
  // Regulation queries
  if (lowerQuery.includes('regulation') || lowerQuery.includes('compliance') || lowerQuery.includes('faa') || lowerQuery.includes('easa')) {
    const regulation = regulationDatabase.find(r => 
      lowerQuery.includes(r.category.toLowerCase()) ||
      lowerQuery.includes(r.authority.toLowerCase())
    );
    
    if (regulation) {
      return {
        category: 'regulation',
        confidence: 0.85,
        response: responseTemplates.regulations.compliance(regulation),
        data: regulation
      };
    }
  }
  
  // Default response
  return {
    category: 'general',
    confidence: 0.5,
    response: `I understand you're asking about "${query}". As your StratusConnect AI assistant, I can help with aircraft specifications, market analysis, regulations, and platform guidance. Could you be more specific about what you'd like to know?`
  };
}

// Learning from user feedback
export function learnFromFeedback(experience: UserExperience): void {
  userExperienceDatabase.push(experience);
  
  // Simple learning algorithm - in production, this would be more sophisticated
  if (experience.rating >= 4) {
    // Positive feedback - reinforce similar responses
    console.log('Learning: Positive feedback received for query type:', experience.query);
  } else if (experience.rating <= 2) {
    // Negative feedback - improve response quality
    console.log('Learning: Negative feedback received, improving response quality for:', experience.query);
  }
}

// Get personalized recommendations based on user type
export function getPersonalizedRecommendations(userType: string, context: any): string[] {
  const recommendations: string[] = [];
  
  switch (userType) {
    case 'broker':
      recommendations.push('Check current market rates for your route');
      recommendations.push('Review aircraft availability for your dates');
      recommendations.push('Analyze competitor pricing strategies');
      break;
    case 'operator':
      recommendations.push('Optimize your fleet utilization');
      recommendations.push('Check maintenance schedules');
      recommendations.push('Review crew availability');
      break;
    case 'pilot':
      recommendations.push('Update your flight hours and certifications');
      recommendations.push('Check available assignments in your area');
      recommendations.push('Review weather conditions for your routes');
      break;
    case 'crew':
      recommendations.push('Update your availability calendar');
      recommendations.push('Check upcoming assignments');
      recommendations.push('Review training requirements');
      break;
    case 'admin':
      recommendations.push('Monitor system performance metrics');
      recommendations.push('Review user activity reports');
      recommendations.push('Check security alerts');
      break;
  }
  
  return recommendations;
}
