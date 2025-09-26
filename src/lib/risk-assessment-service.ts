// Risk Assessment Service - Industry Standard Implementation
// FCA Compliant Aviation Platform

export interface RiskFactors {
  aircraft: {
    type: string;
    age: number;
    maintenance: {
      lastInspection: string;
      hoursSinceInspection: number;
      airworthinessDirectives: number;
      incidents: number;
    };
    operator: {
      id: string;
      name: string;
      rating: number;
      experience: number;
      fleetSize: number;
      safetyRecord: {
        incidents: number;
        accidents: number;
        violations: number;
        lastIncident: string | null;
      };
    };
  };
  route: {
    from: string;
    to: string;
    waypoints: string[];
    distance: number;
    airspace: string[];
    terrain: 'flat' | 'mountainous' | 'coastal' | 'urban';
    weather: {
      conditions: string[];
      wind: number;
      visibility: number;
      ceiling: number;
    };
  };
  flight: {
    duration: number;
    timeOfDay: 'day' | 'night' | 'dawn' | 'dusk';
    season: 'spring' | 'summer' | 'fall' | 'winter';
    specialEvents: string[];
  };
  crew: {
    captain: {
      experience: number;
      certifications: string[];
      recentTraining: string;
      hours: number;
    };
    firstOfficer: {
      experience: number;
      certifications: string[];
      recentTraining: string;
      hours: number;
    };
  };
}

export interface RiskAssessment {
  overallScore: number; // 0-100, higher is safer
  riskLevel: 'low' | 'moderate' | 'high' | 'severe';
  categories: {
    aircraft: {
      score: number;
      factors: string[];
      recommendations: string[];
    };
    operator: {
      score: number;
      factors: string[];
      recommendations: string[];
    };
    route: {
      score: number;
      factors: string[];
      recommendations: string[];
    };
    weather: {
      score: number;
      factors: string[];
      recommendations: string[];
    };
    crew: {
      score: number;
      factors: string[];
      recommendations: string[];
    };
  };
  alerts: {
    id: string;
    type: 'safety' | 'compliance' | 'weather' | 'maintenance';
    severity: 'low' | 'moderate' | 'high' | 'critical';
    title: string;
    description: string;
    recommendation: string;
  }[];
  recommendations: string[];
  compliance: {
    fca: boolean;
    easa: boolean;
    faa: boolean;
    icao: boolean;
    issues: string[];
  };
}

class RiskAssessmentService {
  // Main risk assessment method
  async assessRisk(factors: RiskFactors): Promise<RiskAssessment> {
    try {
      // Assess each category
      const aircraftRisk = this.assessAircraftRisk(factors.aircraft);
      const operatorRisk = this.assessOperatorRisk(factors.aircraft.operator);
      const routeRisk = this.assessRouteRisk(factors.route);
      const weatherRisk = this.assessWeatherRisk(factors.route.weather);
      const crewRisk = this.assessCrewRisk(factors.crew);
      
      // Calculate overall score
      const overallScore = this.calculateOverallScore({
        aircraft: aircraftRisk.score,
        operator: operatorRisk.score,
        route: routeRisk.score,
        weather: weatherRisk.score,
        crew: crewRisk.score
      });
      
      // Determine risk level
      const riskLevel = this.determineRiskLevel(overallScore);
      
      // Generate alerts
      const alerts = this.generateAlerts(factors, {
        aircraft: aircraftRisk,
        operator: operatorRisk,
        route: routeRisk,
        weather: weatherRisk,
        crew: crewRisk
      });
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(factors, {
        aircraft: aircraftRisk,
        operator: operatorRisk,
        route: routeRisk,
        weather: weatherRisk,
        crew: crewRisk
      });
      
      // Check compliance
      const compliance = this.checkCompliance(factors);
      
      return {
        overallScore,
        riskLevel,
        categories: {
          aircraft: aircraftRisk,
          operator: operatorRisk,
          route: routeRisk,
          weather: weatherRisk,
          crew: crewRisk
        },
        alerts,
        recommendations,
        compliance
      };
    } catch (error) {
      console.error('Error assessing risk:', error);
      throw error;
    }
  }

  // Assess aircraft risk
  private assessAircraftRisk(aircraft: RiskFactors['aircraft']): {
    score: number;
    factors: string[];
    recommendations: string[];
  } {
    let score = 100;
    const factors: string[] = [];
    const recommendations: string[] = [];
    
    // Age factor
    if (aircraft.age > 20) {
      score -= 15;
      factors.push('Aircraft age over 20 years');
      recommendations.push('Consider newer aircraft for long-haul flights');
    } else if (aircraft.age > 15) {
      score -= 10;
      factors.push('Aircraft age 15-20 years');
    }
    
    // Maintenance factor
    if (aircraft.maintenance.hoursSinceInspection > 100) {
      score -= 20;
      factors.push('Overdue maintenance inspection');
      recommendations.push('Schedule maintenance inspection before flight');
    } else if (aircraft.maintenance.hoursSinceInspection > 50) {
      score -= 10;
      factors.push('Maintenance inspection due soon');
    }
    
    // Airworthiness directives
    if (aircraft.maintenance.airworthinessDirectives > 5) {
      score -= 15;
      factors.push('Multiple outstanding airworthiness directives');
      recommendations.push('Address all airworthiness directives before flight');
    } else if (aircraft.maintenance.airworthinessDirectives > 2) {
      score -= 8;
      factors.push('Some outstanding airworthiness directives');
    }
    
    // Incident history
    if (aircraft.maintenance.incidents > 3) {
      score -= 25;
      factors.push('High incident rate');
      recommendations.push('Consider alternative aircraft with better safety record');
    } else if (aircraft.maintenance.incidents > 1) {
      score -= 12;
      factors.push('Some incident history');
    }
    
    return {
      score: Math.max(0, score),
      factors,
      recommendations
    };
  }

  // Assess operator risk
  private assessOperatorRisk(operator: RiskFactors['aircraft']['operator']): {
    score: number;
    factors: string[];
    recommendations: string[];
  } {
    let score = 100;
    const factors: string[] = [];
    const recommendations: string[] = [];
    
    // Rating factor
    if (operator.rating < 3.0) {
      score -= 30;
      factors.push('Low operator rating');
      recommendations.push('Consider alternative operator with better rating');
    } else if (operator.rating < 4.0) {
      score -= 15;
      factors.push('Below average operator rating');
    }
    
    // Experience factor
    if (operator.experience < 2) {
      score -= 20;
      factors.push('Low operator experience');
      recommendations.push('Verify operator has sufficient experience for route');
    } else if (operator.experience < 5) {
      score -= 10;
      factors.push('Moderate operator experience');
    }
    
    // Fleet size factor
    if (operator.fleetSize < 3) {
      score -= 15;
      factors.push('Small fleet size');
      recommendations.push('Verify backup aircraft availability');
    }
    
    // Safety record
    if (operator.safetyRecord.accidents > 0) {
      score -= 40;
      factors.push('Operator has accident history');
      recommendations.push('Consider alternative operator');
    }
    
    if (operator.safetyRecord.incidents > 5) {
      score -= 25;
      factors.push('High incident rate');
      recommendations.push('Review operator safety procedures');
    } else if (operator.safetyRecord.incidents > 2) {
      score -= 12;
      factors.push('Some incident history');
    }
    
    if (operator.safetyRecord.violations > 3) {
      score -= 20;
      factors.push('Multiple regulatory violations');
      recommendations.push('Verify operator compliance status');
    }
    
    // Recent incidents
    if (operator.safetyRecord.lastIncident) {
      const daysSinceIncident = Math.floor(
        (Date.now() - new Date(operator.safetyRecord.lastIncident).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceIncident < 30) {
        score -= 20;
        factors.push('Recent safety incident');
        recommendations.push('Review recent incident details');
      } else if (daysSinceIncident < 90) {
        score -= 10;
        factors.push('Recent safety incident (3 months)');
      }
    }
    
    return {
      score: Math.max(0, score),
      factors,
      recommendations
    };
  }

  // Assess route risk
  private assessRouteRisk(route: RiskFactors['route']): {
    score: number;
    factors: string[];
    recommendations: string[];
  } {
    let score = 100;
    const factors: string[] = [];
    const recommendations: string[] = [];
    
    // Distance factor
    if (route.distance > 5000) {
      score -= 10;
      factors.push('Long-haul flight');
      recommendations.push('Ensure adequate fuel reserves and crew rest');
    }
    
    // Terrain factor
    if (route.terrain === 'mountainous') {
      score -= 15;
      factors.push('Mountainous terrain');
      recommendations.push('Verify aircraft performance at altitude');
    } else if (route.terrain === 'coastal') {
      score -= 5;
      factors.push('Coastal route');
    }
    
    // Airspace factor
    if (route.airspace.includes('restricted')) {
      score -= 20;
      factors.push('Restricted airspace');
      recommendations.push('Verify airspace clearance and procedures');
    }
    
    if (route.airspace.includes('military')) {
      score -= 10;
      factors.push('Military airspace');
      recommendations.push('Coordinate with military air traffic control');
    }
    
    // International routes
    const isInternational = route.from.length === 4 && route.to.length === 4 && 
                           route.from[0] !== route.to[0];
    if (isInternational) {
      score -= 5;
      factors.push('International route');
      recommendations.push('Verify international flight clearances');
    }
    
    return {
      score: Math.max(0, score),
      factors,
      recommendations
    };
  }

  // Assess weather risk
  private assessWeatherRisk(weather: RiskFactors['route']['weather']): {
    score: number;
    factors: string[];
    recommendations: string[];
  } {
    let score = 100;
    const factors: string[] = [];
    const recommendations: string[] = [];
    
    // Weather conditions
    if (weather.conditions.includes('TS')) {
      score -= 30;
      factors.push('Thunderstorm activity');
      recommendations.push('Avoid thunderstorms, consider delay or alternate route');
    }
    
    if (weather.conditions.includes('FG')) {
      score -= 20;
      factors.push('Fog conditions');
      recommendations.push('Verify IFR capabilities and minimums');
    }
    
    if (weather.conditions.includes('SN')) {
      score -= 15;
      factors.push('Snow conditions');
      recommendations.push('Verify de-icing procedures and runway conditions');
    }
    
    if (weather.conditions.includes('RA')) {
      score -= 10;
      factors.push('Rain conditions');
      recommendations.push('Verify wet runway procedures');
    }
    
    // Wind conditions
    if (weather.wind > 30) {
      score -= 25;
      factors.push('High wind conditions');
      recommendations.push('Verify crosswind limits and runway selection');
    } else if (weather.wind > 20) {
      score -= 15;
      factors.push('Moderate wind conditions');
    }
    
    // Visibility
    if (weather.visibility < 1) {
      score -= 30;
      factors.push('Low visibility');
      recommendations.push('IFR conditions required, verify approach minimums');
    } else if (weather.visibility < 3) {
      score -= 15;
      factors.push('Reduced visibility');
    }
    
    // Ceiling
    if (weather.ceiling < 500) {
      score -= 25;
      factors.push('Very low ceiling');
      recommendations.push('Verify approach minimums and alternate requirements');
    } else if (weather.ceiling < 1000) {
      score -= 15;
      factors.push('Low ceiling');
    }
    
    return {
      score: Math.max(0, score),
      factors,
      recommendations
    };
  }

  // Assess crew risk
  private assessCrewRisk(crew: RiskFactors['crew']): {
    score: number;
    factors: string[];
    recommendations: string[];
  } {
    let score = 100;
    const factors: string[] = [];
    const recommendations: string[] = [];
    
    // Captain experience
    if (crew.captain.experience < 2) {
      score -= 25;
      factors.push('Low captain experience');
      recommendations.push('Consider more experienced captain for complex routes');
    } else if (crew.captain.experience < 5) {
      score -= 10;
      factors.push('Moderate captain experience');
    }
    
    // Captain hours
    if (crew.captain.hours > 1000) {
      score -= 15;
      factors.push('High captain flight hours');
      recommendations.push('Verify captain rest requirements');
    }
    
    // First officer experience
    if (crew.firstOfficer.experience < 1) {
      score -= 20;
      factors.push('Low first officer experience');
      recommendations.push('Consider more experienced first officer');
    }
    
    // Recent training
    const captainTrainingDays = Math.floor(
      (Date.now() - new Date(crew.captain.recentTraining).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (captainTrainingDays > 365) {
      score -= 15;
      factors.push('Captain training overdue');
      recommendations.push('Schedule captain recurrent training');
    }
    
    const foTrainingDays = Math.floor(
      (Date.now() - new Date(crew.firstOfficer.recentTraining).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (foTrainingDays > 365) {
      score -= 10;
      factors.push('First officer training overdue');
      recommendations.push('Schedule first officer recurrent training');
    }
    
    return {
      score: Math.max(0, score),
      factors,
      recommendations
    };
  }

  // Calculate overall score
  private calculateOverallScore(categoryScores: {
    aircraft: number;
    operator: number;
    route: number;
    weather: number;
    crew: number;
  }): number {
    // Weighted average with safety-critical categories having higher weight
    const weights = {
      aircraft: 0.25,
      operator: 0.30,
      route: 0.15,
      weather: 0.20,
      crew: 0.10
    };
    
    return Math.round(
      categoryScores.aircraft * weights.aircraft +
      categoryScores.operator * weights.operator +
      categoryScores.route * weights.route +
      categoryScores.weather * weights.weather +
      categoryScores.crew * weights.crew
    );
  }

  // Determine risk level
  private determineRiskLevel(score: number): 'low' | 'moderate' | 'high' | 'severe' {
    if (score >= 90) return 'low';
    if (score >= 75) return 'moderate';
    if (score >= 60) return 'high';
    return 'severe';
  }

  // Generate alerts
  private generateAlerts(factors: RiskFactors, categoryAssessments: any): any[] {
    const alerts: any[] = [];
    
    // Aircraft alerts
    if (categoryAssessments.aircraft.score < 70) {
      alerts.push({
        id: 'aircraft-risk',
        type: 'safety',
        severity: 'high',
        title: 'Aircraft Safety Risk',
        description: 'Aircraft has safety concerns that need attention',
        recommendation: 'Review aircraft maintenance and safety records'
      });
    }
    
    // Operator alerts
    if (categoryAssessments.operator.score < 70) {
      alerts.push({
        id: 'operator-risk',
        type: 'safety',
        severity: 'high',
        title: 'Operator Safety Risk',
        description: 'Operator has safety concerns that need attention',
        recommendation: 'Consider alternative operator or additional safety measures'
      });
    }
    
    // Weather alerts
    if (categoryAssessments.weather.score < 60) {
      alerts.push({
        id: 'weather-risk',
        type: 'weather',
        severity: 'critical',
        title: 'Weather Risk',
        description: 'Weather conditions pose significant risk',
        recommendation: 'Consider delay or alternate routing'
      });
    }
    
    // Compliance alerts
    if (!this.checkCompliance(factors).fca) {
      alerts.push({
        id: 'fca-compliance',
        type: 'compliance',
        severity: 'high',
        title: 'FCA Compliance Issue',
        description: 'Flight may not meet FCA compliance requirements',
        recommendation: 'Review FCA regulations and requirements'
      });
    }
    
    return alerts;
  }

  // Generate recommendations
  private generateRecommendations(factors: RiskFactors, categoryAssessments: any): string[] {
    const recommendations: string[] = [];
    
    // Add category-specific recommendations
    Object.values(categoryAssessments).forEach((assessment: any) => {
      recommendations.push(...assessment.recommendations);
    });
    
    // Add overall recommendations
    if (categoryAssessments.aircraft.score < 80) {
      recommendations.push('Consider alternative aircraft with better safety record');
    }
    
    if (categoryAssessments.operator.score < 80) {
      recommendations.push('Consider alternative operator with better safety record');
    }
    
    if (categoryAssessments.weather.score < 70) {
      recommendations.push('Monitor weather conditions closely and have backup plans');
    }
    
    return [...new Set(recommendations)]; // Remove duplicates
  }

  // Check compliance
  private checkCompliance(factors: RiskFactors): {
    fca: boolean;
    easa: boolean;
    faa: boolean;
    icao: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    
    // FCA compliance (UK)
    const fcaCompliant = factors.aircraft.operator.rating >= 4.0 && 
                        factors.aircraft.maintenance.airworthinessDirectives === 0;
    if (!fcaCompliant) issues.push('FCA: Operator rating or maintenance issues');
    
    // EASA compliance (EU)
    const easaCompliant = factors.aircraft.age < 25 && 
                         factors.aircraft.maintenance.hoursSinceInspection < 100;
    if (!easaCompliant) issues.push('EASA: Aircraft age or maintenance issues');
    
    // FAA compliance (US)
    const faaCompliant = factors.aircraft.operator.safetyRecord.accidents === 0 &&
                        factors.crew.captain.experience >= 2;
    if (!faaCompliant) issues.push('FAA: Safety record or crew experience issues');
    
    // ICAO compliance (International)
    const icaoCompliant = factors.aircraft.operator.safetyRecord.violations <= 2 &&
                         factors.crew.captain.hours >= 500;
    if (!icaoCompliant) issues.push('ICAO: Regulatory violations or crew hours issues');
    
    return {
      fca: fcaCompliant,
      easa: easaCompliant,
      faa: faaCompliant,
      icao: icaoCompliant,
      issues
    };
  }
}

export const riskAssessmentService = new RiskAssessmentService();
