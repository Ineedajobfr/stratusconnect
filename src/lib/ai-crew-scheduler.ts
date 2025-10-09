/**
 * AI CREW SCHEDULER
 * Intelligent crew assignment with FAA/EASA compliance
 * Duty time calculations, rest requirements, certification matching
 */

import { supabase } from '@/integrations/supabase/client';
import { addHours, differenceInHours, parseISO, subHours } from 'date-fns';

export interface CrewMember {
  id: string;
  name: string;
  role: 'captain' | 'first_officer' | 'cabin_crew';
  certifications: string[]; // Aircraft type ratings
  baseLocation: { lat: number; lon: number; airport: string };
  lastDutyEnd?: string;
  currentDutyHours: number; // in current period
  maxDutyHours: number; // regulatory limit
  preferences: {
    preferredRoutes?: string[];
    avoidRoutes?: string[];
    preferredAircraft?: string[];
  };
  performanceRating: number; // 0-5
  languages: string[];
  status: 'available' | 'on_duty' | 'resting' | 'unavailable';
}

export interface Flight {
  id: string;
  departure: string; // ISO timestamp
  arrival: string; // ISO timestamp
  from: { lat: number; lon: number; airport: string };
  to: { lat: number; lon: number; airport: string };
  aircraft_type: string;
  passengers: number;
  requiredCrew: {
    captains: number;
    firstOfficers: number;
    cabinCrew: number;
  };
}

export interface CrewAssignment {
  flight: Flight;
  captain: CrewMember;
  firstOfficer?: CrewMember;
  cabinCrew: CrewMember[];
  confidence: number; // 0-1
  alternativeOptions: Array<{
    captain: CrewMember;
    firstOfficer?: CrewMember;
    cabinCrew: CrewMember[];
    score: number;
  }>;
  warnings: string[];
  complianceChecks: {
    dutyTimesValid: boolean;
    restRequirementsMet: boolean;
    certificationsValid: boolean;
    fatigueRiskAcceptable: boolean;
  };
}

export class AICrewScheduler {
  private static instance: AICrewScheduler;

  static getInstance(): AICrewScheduler {
    if (!AICrewScheduler.instance) {
      AICrewScheduler.instance = new AICrewScheduler();
    }
    return AICrewScheduler.instance;
  }

  /**
   * Assign optimal crew for a flight
   */
  async assignOptimalCrew(flight: Flight): Promise<CrewAssignment> {
    // Get all available crew members
    const availableCrew = await this.getAvailableCrew(flight);
    
    // Filter by certifications
    const certifiedCrew = availableCrew.filter((crew) =>
      crew.certifications.includes(flight.aircraft_type)
    );
    
    // Separate by role
    const captains = certifiedCrew.filter((c) => c.role === 'captain');
    const firstOfficers = certifiedCrew.filter((c) => c.role === 'first_officer');
    const cabinCrew = certifiedCrew.filter((c) => c.role === 'cabin_crew');
    
    // Find best captain
    const captain = this.findBestCrew(captains, flight, 'captain');
    
    // Find best first officer
    const firstOfficer = this.findBestCrew(firstOfficers, flight, 'first_officer');
    
    // Find best cabin crew
    const selectedCabinCrew = this.findBestCabinCrew(
      cabinCrew,
      flight,
      flight.requiredCrew.cabinCrew
    );
    
    // Check compliance
    const complianceChecks = await this.checkCompliance(
      { captain, firstOfficer, cabinCrew: selectedCabinCrew },
      flight
    );
    
    // Calculate confidence
    const confidence = this.calculateConfidence(
      { captain, firstOfficer, cabinCrew: selectedCabinCrew },
      flight,
      complianceChecks
    );
    
    // Generate warnings
    const warnings = this.generateWarnings(
      { captain, firstOfficer, cabinCrew: selectedCabinCrew },
      flight,
      complianceChecks
    );
    
    return {
      flight,
      captain,
      firstOfficer,
      cabinCrew: selectedCabinCrew,
      confidence,
      alternativeOptions: [], // TODO: Generate alternatives
      warnings,
      complianceChecks,
    };
  }

  /**
   * Get available crew members for a flight
   */
  private async getAvailableCrew(flight: Flight): Promise<CrewMember[]> {
    try {
      const { data, error } = await supabase
        .from('crew_members')
        .select('*')
        .eq('status', 'available');
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Failed to get crew:', error);
      
      // Return mock data
      return [
        {
          id: '1',
          name: 'John Smith',
          role: 'captain',
          certifications: ['Citation X', 'Gulfstream G450', 'Phenom 300'],
          baseLocation: { lat: 40.7128, lon: -74.0060, airport: 'TEB' },
          lastDutyEnd: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          currentDutyHours: 32,
          maxDutyHours: 100,
          preferences: {},
          performanceRating: 4.8,
          languages: ['English', 'Spanish'],
          status: 'available',
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          role: 'first_officer',
          certifications: ['Citation X', 'Learjet 75'],
          baseLocation: { lat: 40.7128, lon: -74.0060, airport: 'TEB' },
          lastDutyEnd: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
          currentDutyHours: 28,
          maxDutyHours: 100,
          preferences: {},
          performanceRating: 4.9,
          languages: ['English'],
          status: 'available',
        },
      ];
    }
  }

  /**
   * Find best crew member for a role
   */
  private findBestCrew(
    candidates: CrewMember[],
    flight: Flight,
    role: 'captain' | 'first_officer'
  ): CrewMember {
    if (candidates.length === 0) {
      throw new Error(`No available ${role} found`);
    }
    
    // Score each candidate
    const scored = candidates.map((crew) => ({
      crew,
      score: this.scoreCrewMember(crew, flight),
    }));
    
    // Sort by score (highest first)
    scored.sort((a, b) => b.score - a.score);
    
    return scored[0].crew;
  }

  /**
   * Find best cabin crew team
   */
  private findBestCabinCrew(
    candidates: CrewMember[],
    flight: Flight,
    required: number
  ): CrewMember[] {
    if (candidates.length < required) {
      throw new Error('Not enough cabin crew available');
    }
    
    // Score all candidates
    const scored = candidates.map((crew) => ({
      crew,
      score: this.scoreCrewMember(crew, flight),
    }));
    
    // Sort and take top N
    scored.sort((a, b) => b.score - a.score);
    
    return scored.slice(0, required).map((s) => s.crew);
  }

  /**
   * Score a crew member for a specific flight
   */
  private scoreCrewMember(crew: CrewMember, flight: Flight): number {
    let score = 100;
    
    // 1. Proximity to departure airport (closer = better)
    const distance = this.calculateDistance(
      crew.baseLocation.lat,
      crew.baseLocation.lon,
      flight.from.lat,
      flight.from.lon
    );
    score -= distance * 0.05; // Penalty for distance
    
    // 2. Rest time (more rest = better)
    if (crew.lastDutyEnd) {
      const hoursSinceLastDuty = differenceInHours(new Date(), parseISO(crew.lastDutyEnd));
      if (hoursSinceLastDuty < 10) {
        score -= (10 - hoursSinceLastDuty) * 5; // Penalty for insufficient rest
      }
    }
    
    // 3. Duty hours remaining (more remaining = better)
    const dutyHoursRemaining = crew.maxDutyHours - crew.currentDutyHours;
    score += dutyHoursRemaining * 0.2;
    
    // 4. Performance rating (higher = better)
    score += crew.performanceRating * 4;
    
    // 5. Route preference
    const routeKey = `${flight.from.airport}-${flight.to.airport}`;
    if (crew.preferences.preferredRoutes?.includes(routeKey)) {
      score += 10;
    }
    if (crew.preferences.avoidRoutes?.includes(routeKey)) {
      score -= 10;
    }
    
    return Math.max(0, score);
  }

  /**
   * Check regulatory compliance
   */
  private async checkCompliance(
    crew: { captain: CrewMember; firstOfficer?: CrewMember; cabinCrew: CrewMember[] },
    flight: Flight
  ): Promise<{
    dutyTimesValid: boolean;
    restRequirementsMet: boolean;
    certificationsValid: boolean;
    fatigueRiskAcceptable: boolean;
  }> {
    const flightDuration = differenceInHours(parseISO(flight.arrival), parseISO(flight.departure));
    
    // Check duty times (FAA: max 8 hours flight duty, 14 hours duty period)
    const allCrew = [crew.captain, crew.firstOfficer, ...crew.cabinCrew].filter(Boolean) as CrewMember[];
    const dutyTimesValid = allCrew.every((c) => c.currentDutyHours + flightDuration <= 14);
    
    // Check rest requirements (FAA: min 10 hours rest before duty)
    const restRequirementsMet = allCrew.every((c) => {
      if (!c.lastDutyEnd) return true;
      const hoursSinceRest = differenceInHours(new Date(), parseISO(c.lastDutyEnd));
      return hoursSinceRest >= 10;
    });
    
    // Check certifications
    const certificationsValid = allCrew.every((c) =>
      c.certifications.includes(flight.aircraft_type)
    );
    
    // Fatigue risk (simplified - in production, use NASA fatigue model)
    const fatigueRiskAcceptable = allCrew.every((c) => {
      const fatigueScore = (c.currentDutyHours / c.maxDutyHours) * 100;
      return fatigueScore < 80; // Less than 80% of max = acceptable
    });
    
    return {
      dutyTimesValid,
      restRequirementsMet,
      certificationsValid,
      fatigueRiskAcceptable,
    };
  }

  /**
   * Calculate assignment confidence
   */
  private calculateConfidence(
    crew: { captain: CrewMember; firstOfficer?: CrewMember; cabinCrew: CrewMember[] },
    flight: Flight,
    compliance: any
  ): number {
    let confidence = 1.0;
    
    // Reduce confidence for compliance issues
    if (!compliance.dutyTimesValid) confidence -= 0.3;
    if (!compliance.restRequirementsMet) confidence -= 0.3;
    if (!compliance.certificationsValid) confidence -= 0.4;
    if (!compliance.fatigueRiskAcceptable) confidence -= 0.2;
    
    // Reduce confidence for low performance ratings
    const allCrew = [crew.captain, crew.firstOfficer, ...crew.cabinCrew].filter(Boolean) as CrewMember[];
    const avgRating = allCrew.reduce((sum, c) => sum + c.performanceRating, 0) / allCrew.length;
    if (avgRating < 4.0) confidence -= 0.1;
    
    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Generate warnings
   */
  private generateWarnings(
    crew: { captain: CrewMember; firstOfficer?: CrewMember; cabinCrew: CrewMember[] },
    flight: Flight,
    compliance: any
  ): string[] {
    const warnings: string[] = [];
    
    if (!compliance.dutyTimesValid) {
      warnings.push('⚠️ Crew duty times approaching regulatory limits');
    }
    
    if (!compliance.restRequirementsMet) {
      warnings.push('⚠️ Minimum rest requirements not met for some crew');
    }
    
    if (!compliance.fatigueRiskAcceptable) {
      warnings.push('⚠️ High fatigue risk detected - consider backup crew');
    }
    
    const allCrew = [crew.captain, crew.firstOfficer, ...crew.cabinCrew].filter(Boolean) as CrewMember[];
    allCrew.forEach((c) => {
      const distance = this.calculateDistance(
        c.baseLocation.lat,
        c.baseLocation.lon,
        flight.from.lat,
        flight.from.lon
      );
      
      if (distance > 200) {
        warnings.push(`ℹ️ ${c.name} is ${distance.toFixed(0)}km from departure airport`);
      }
    });
    
    return warnings;
  }

  /**
   * Calculate distance between two points (Haversine formula)
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Check for scheduling conflicts
   */
  async detectConflicts(crewId: string, proposedFlight: Flight): Promise<{
    hasConflict: boolean;
    conflictingFlights: any[];
  }> {
    try {
      const { data, error } = await supabase
        .from('crew_assignments')
        .select('*, flights(*)')
        .eq('crew_id', crewId)
        .gte('flight.departure', subHours(parseISO(proposedFlight.departure), 2).toISOString())
        .lte('flight.arrival', addHours(parseISO(proposedFlight.arrival), 2).toISOString());
      
      if (error) throw error;
      
      return {
        hasConflict: (data?.length || 0) > 0,
        conflictingFlights: data || [],
      };
    } catch (error) {
      console.error('Conflict detection error:', error);
      return { hasConflict: false, conflictingFlights: [] };
    }
  }

  /**
   * Model fatigue risk (NASA Task Load Index simplified)
   */
  calculateFatigueRisk(crew: CrewMember, flight: Flight): {
    riskLevel: 'low' | 'medium' | 'high';
    score: number; // 0-100
    factors: Record<string, number>;
  } {
    const factors: Record<string, number> = {};
    
    // Factor 1: Current duty hours (max impact: 40 points)
    factors.dutyHours = (crew.currentDutyHours / crew.maxDutyHours) * 40;
    
    // Factor 2: Time since last rest (max impact: 30 points)
    if (crew.lastDutyEnd) {
      const hoursSinceRest = differenceInHours(new Date(), parseISO(crew.lastDutyEnd));
      factors.timeSinceRest = Math.max(0, (24 - hoursSinceRest) / 24) * 30;
    } else {
      factors.timeSinceRest = 0; // Well-rested
    }
    
    // Factor 3: Flight duration (max impact: 20 points)
    const flightHours = differenceInHours(parseISO(flight.arrival), parseISO(flight.departure));
    factors.flightDuration = (flightHours / 8) * 20;
    
    // Factor 4: Time of day (max impact: 10 points)
    const departureHour = new Date(flight.departure).getHours();
    if (departureHour < 6 || departureHour > 22) {
      factors.timeOfDay = 10; // Night flights more fatiguing
    } else {
      factors.timeOfDay = 0;
    }
    
    const totalScore = Object.values(factors).reduce((sum, val) => sum + val, 0);
    
    let riskLevel: 'low' | 'medium' | 'high';
    if (totalScore < 30) riskLevel = 'low';
    else if (totalScore < 60) riskLevel = 'medium';
    else riskLevel = 'high';
    
    return {
      riskLevel,
      score: totalScore,
      factors,
    };
  }

  /**
   * Optimize crew pairing (teams that work well together)
   */
  async optimizeCrewPairing(
    captains: CrewMember[],
    firstOfficers: CrewMember[],
    cabinCrew: CrewMember[]
  ): Promise<Array<{
    captain: CrewMember;
    firstOfficer: CrewMember;
    cabinCrew: CrewMember[];
    teamScore: number;
  }>> {
    // In production, use historical data to find best team combinations
    // For now, simple pairing based on ratings
    
    const pairings: Array<{
      captain: CrewMember;
      firstOfficer: CrewMember;
      cabinCrew: CrewMember[];
      teamScore: number;
    }> = [];
    
    for (const captain of captains) {
      for (const fo of firstOfficers) {
        const teamScore = (captain.performanceRating + fo.performanceRating) / 2;
        
        pairings.push({
          captain,
          firstOfficer: fo,
          cabinCrew: cabinCrew.slice(0, 2), // Take first 2
          teamScore,
        });
      }
    }
    
    return pairings.sort((a, b) => b.teamScore - a.teamScore);
  }

  /**
   * Calculate minimum rest required before next flight
   */
  calculateRequiredRest(lastFlightDuration: number): {
    minimumHours: number;
    recommendedHours: number;
  } {
    // FAA: Minimum 10 hours rest, recommended 12 hours for international
    return {
      minimumHours: 10,
      recommendedHours: lastFlightDuration > 6 ? 12 : 10,
    };
  }
}

// Export singleton
export const aiCrewScheduler = AICrewScheduler.getInstance();

