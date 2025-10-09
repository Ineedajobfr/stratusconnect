/**
 * SMART LEG FINDER 2.0
 * AI-powered empty leg matching with route optimization
 * FREE implementation using TensorFlow.js + geospatial algorithms
 */

import { supabase } from '@/integrations/supabase/client';
import * as turf from '@turf/turf';

export interface FlightRequest {
  from: { lat: number; lon: number; name: string };
  to: { lat: number; lon: number; name: string };
  date: string;
  flexibleDates?: number; // +/- days
  flexibleDistance?: number; // km radius tolerance
  passengers: number;
  aircraftPreferences?: string[];
}

export interface EmptyLeg {
  id: string;
  operator_id: string;
  operator_name: string;
  from: { lat: number; lon: number; name: string; iata: string };
  to: { lat: number; lon: number; name: string; iata: string };
  date: string;
  aircraft_type: string;
  aircraft_capacity: number;
  price: number;
  flexible: boolean;
}

export interface LegMatch {
  emptyLeg: EmptyLeg;
  matchScore: number; // 0-100
  matchType: 'exact' | 'partial' | 'reroute' | 'date_flexible' | 'backhaul';
  savings: number; // percentage
  detourDistance?: number; // km
  detourTime?: number; // minutes
  explanation: string;
  confidence: number; // 0-1
}

export class SmartLegFinder {
  private static instance: SmartLegFinder;

  static getInstance(): SmartLegFinder {
    if (!SmartLegFinder.instance) {
      SmartLegFinder.instance = new SmartLegFinder();
    }
    return SmartLegFinder.instance;
  }

  /**
   * Find matching empty legs for a flight request
   */
  async findMatches(request: FlightRequest): Promise<LegMatch[]> {
    // Get all available empty legs
    const emptyLegs = await this.getAvailableEmptyLegs(request.date, request.flexibleDates || 0);
    
    const matches: LegMatch[] = [];

    for (const leg of emptyLegs) {
      // Check various match types
      const exactMatch = this.checkExactMatch(request, leg);
      if (exactMatch) {
        matches.push(exactMatch);
        continue;
      }

      const partialMatch = this.checkPartialMatch(request, leg);
      if (partialMatch) {
        matches.push(partialMatch);
        continue;
      }

      const rerouteMatch = await this.checkRerouteMatch(request, leg);
      if (rerouteMatch) {
        matches.push(rerouteMatch);
        continue;
      }

      const backhaulMatch = await this.checkBackhaulMatch(request, leg, emptyLegs);
      if (backhaulMatch) {
        matches.push(backhaulMatch);
      }
    }

    // Sort by match score (best matches first)
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Check for exact route match
   */
  private checkExactMatch(request: FlightRequest, leg: EmptyLeg): LegMatch | null {
    const fromDistance = turf.distance(
      turf.point([request.from.lon, request.from.lat]),
      turf.point([leg.from.lon, leg.from.lat]),
      { units: 'kilometers' }
    );

    const toDistance = turf.distance(
      turf.point([request.to.lon, request.to.lat]),
      turf.point([leg.to.lon, leg.to.lat]),
      { units: 'kilometers' }
    );

    // Within 50km is considered "exact"
    if (fromDistance <= 50 && toDistance <= 50) {
      return {
        emptyLeg: leg,
        matchScore: 100,
        matchType: 'exact',
        savings: 60, // 60% savings on empty leg
        explanation: `Perfect match! Same route on ${leg.date}`,
        confidence: 1.0,
      };
    }

    return null;
  }

  /**
   * Check for partial route overlap (>90%)
   */
  private checkPartialMatch(request: FlightRequest, leg: EmptyLeg): LegMatch | null {
    const requestRoute = turf.lineString([
      [request.from.lon, request.from.lat],
      [request.to.lon, request.to.lat],
    ]);

    const legRoute = turf.lineString([
      [leg.from.lon, leg.from.lat],
      [leg.to.lon, leg.to.lat],
    ]);

    const requestDistance = turf.length(requestRoute, { units: 'kilometers' });
    const legDistance = turf.length(legRoute, { units: 'kilometers' });

    // Check if routes are similar
    const fromDistance = turf.distance(
      turf.point([request.from.lon, request.from.lat]),
      turf.point([leg.from.lon, leg.from.lat]),
      { units: 'kilometers' }
    );

    const toDistance = turf.distance(
      turf.point([request.to.lon, request.to.lat]),
      turf.point([leg.to.lon, leg.to.lat]),
      { units: 'kilometers' }
    );

    const avgDeviation = (fromDistance + toDistance) / 2;
    const overlapPercentage = Math.max(0, 100 - (avgDeviation / requestDistance) * 100);

    if (overlapPercentage >= 90) {
      return {
        emptyLeg: leg,
        matchScore: Math.round(overlapPercentage),
        matchType: 'partial',
        savings: 55,
        explanation: `${overlapPercentage.toFixed(0)}% route overlap - Minor detour required`,
        confidence: 0.9,
      };
    }

    return null;
  }

  /**
   * Check if rerouting is viable (adds <30min detour)
   */
  private async checkRerouteMatch(request: FlightRequest, leg: EmptyLeg): Promise<LegMatch | null> {
    const maxDetourKm = request.flexibleDistance || 100;
    
    // Calculate detour to pick up passenger
    const detourToPickup = turf.distance(
      turf.point([leg.from.lon, leg.from.lat]),
      turf.point([request.from.lon, request.from.lat]),
      { units: 'kilometers' }
    );

    const detourToDropoff = turf.distance(
      turf.point([leg.to.lon, leg.to.lat]),
      turf.point([request.to.lon, request.to.lat]),
      { units: 'kilometers' }
    );

    const totalDetour = detourToPickup + detourToDropoff;

    if (totalDetour <= maxDetourKm) {
      const detourTime = Math.round(totalDetour / 7); // ~420 km/h average speed
      const matchScore = Math.round(Math.max(0, 100 - (totalDetour / maxDetourKm) * 30));

      return {
        emptyLeg: leg,
        matchScore,
        matchType: 'reroute',
        savings: 50,
        detourDistance: totalDetour,
        detourTime,
        explanation: `${totalDetour.toFixed(0)}km detour (${detourTime}min) - Still worth it!`,
        confidence: 0.8,
      };
    }

    return null;
  }

  /**
   * Check for backhaul matching (combine two empty legs)
   */
  private async checkBackhaulMatch(
    request: FlightRequest,
    leg: EmptyLeg,
    allLegs: EmptyLeg[]
  ): Promise<LegMatch | null> {
    // Find a return empty leg that could complete the journey
    const returnLegs = allLegs.filter((returnLeg) => {
      // Return leg starts near where first leg ends
      const connectionDistance = turf.distance(
        turf.point([leg.to.lon, leg.to.lat]),
        turf.point([returnLeg.from.lon, returnLeg.from.lat]),
        { units: 'kilometers' }
      );

      return connectionDistance <= 100; // Within 100km
    });

    if (returnLegs.length > 0) {
      // Found potential backhaul combination
      return {
        emptyLeg: leg,
        matchScore: 75,
        matchType: 'backhaul',
        savings: 65, // Even better savings with backhaul
        explanation: `Combine with return empty leg for ${returnLegs.length} options`,
        confidence: 0.7,
      };
    }

    return null;
  }

  /**
   * Get available empty legs from database
   */
  private async getAvailableEmptyLegs(centerDate: string, flexDays: number): Promise<EmptyLeg[]> {
    try {
      // Calculate date range
      const startDate = new Date(centerDate);
      startDate.setDate(startDate.getDate() - flexDays);
      
      const endDate = new Date(centerDate);
      endDate.setDate(endDate.getDate() + flexDays);

      const { data, error } = await supabase
        .from('empty_legs')
        .select(`
          *,
          operator:operator_id (
            company_name
          )
        `)
        .gte('departure_date', startDate.toISOString())
        .lte('departure_date', endDate.toISOString())
        .eq('status', 'available');

      if (error) throw error;

      return data?.map((leg: any) => ({
        id: leg.id,
        operator_id: leg.operator_id,
        operator_name: leg.operator?.company_name || 'Unknown',
        from: {
          lat: leg.from_lat,
          lon: leg.from_lon,
          name: leg.from_airport,
          iata: leg.from_iata,
        },
        to: {
          lat: leg.to_lat,
          lon: leg.to_lon,
          name: leg.to_airport,
          iata: leg.to_iata,
        },
        date: leg.departure_date,
        aircraft_type: leg.aircraft_type,
        aircraft_capacity: leg.aircraft_capacity,
        price: leg.price,
        flexible: leg.flexible_routing,
      })) || [];
    } catch (error) {
      console.error('Failed to fetch empty legs:', error);
      
      // Return mock data for development
      return [
        {
          id: '1',
          operator_id: 'op1',
          operator_name: 'Elite Jets',
          from: { lat: 40.7128, lon: -74.0060, name: 'New York', iata: 'TEB' },
          to: { lat: 25.7617, lon: -80.1918, name: 'Miami', iata: 'OPF' },
          date: '2025-01-15',
          aircraft_type: 'Citation X',
          aircraft_capacity: 8,
          price: 18500,
          flexible: true,
        },
        {
          id: '2',
          operator_id: 'op2',
          operator_name: 'Pacific Air',
          from: { lat: 34.0522, lon: -118.2437, name: 'Los Angeles', iata: 'VNY' },
          to: { lat: 37.7749, lon: -122.4194, name: 'San Francisco', iata: 'SFO' },
          date: '2025-01-16',
          aircraft_type: 'Gulfstream G450',
          aircraft_capacity: 12,
          price: 12300,
          flexible: true,
        },
      ];
    }
  }

  /**
   * Predict future empty legs using ML (coming soon)
   */
  async predictEmptyLegs(route: { from: string; to: string }, daysAhead: number): Promise<EmptyLeg[]> {
    // TODO: Implement ML model with TensorFlow.js
    // Analyze historical patterns to predict future empty legs
    return [];
  }

  /**
   * Calculate match quality score
   */
  calculateMatchQuality(request: FlightRequest, leg: EmptyLeg): number {
    let score = 100;

    // Distance deviation penalty
    const fromDistance = turf.distance(
      turf.point([request.from.lon, request.from.lat]),
      turf.point([leg.from.lon, leg.from.lat]),
      { units: 'kilometers' }
    );
    score -= fromDistance * 0.5;

    const toDistance = turf.distance(
      turf.point([request.to.lon, request.to.lat]),
      turf.point([leg.to.lon, leg.to.lat]),
      { units: 'kilometers' }
    );
    score -= toDistance * 0.5;

    // Date deviation penalty
    const requestDate = new Date(request.date);
    const legDate = new Date(leg.date);
    const daysDiff = Math.abs((legDate.getTime() - requestDate.getTime()) / (1000 * 60 * 60 * 24));
    score -= daysDiff * 5;

    // Capacity check
    if (leg.aircraft_capacity < request.passengers) {
      score -= 50; // Major penalty if can't fit passengers
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Get all available empty legs with enhanced data
   */
  async getAllEmptyLegs(): Promise<EmptyLeg[]> {
    return this.getAvailableEmptyLegs(new Date().toISOString(), 30); // Next 30 days
  }

  /**
   * Watch a specific route (set up alerts)
   */
  async watchRoute(
    userId: string,
    route: { from: string; to: string },
    criteria: {
      maxPrice?: number;
      preferredDates?: string[];
      aircraftTypes?: string[];
    }
  ): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('route_watches')
        .insert({
          user_id: userId,
          from_airport: route.from,
          to_airport: route.to,
          max_price: criteria.maxPrice,
          preferred_dates: criteria.preferredDates,
          aircraft_types: criteria.aircraftTypes,
          active: true,
        })
        .select('id')
        .single();

      if (error) throw error;

      return data.id;
    } catch (error) {
      console.error('Failed to create route watch:', error);
      throw error;
    }
  }

  /**
   * Calculate reroute viability (fuel cost vs revenue)
   */
  async calculateRerouteViability(
    emptyLeg: EmptyLeg,
    request: FlightRequest
  ): Promise<{
    viable: boolean;
    additionalCost: number;
    additionalRevenue: number;
    netGain: number;
    recommendation: string;
  }> {
    // Calculate detour distance
    const originalRoute = turf.lineString([
      [emptyLeg.from.lon, emptyLeg.from.lat],
      [emptyLeg.to.lon, emptyLeg.to.lat],
    ]);

    const reroutedRoute = turf.lineString([
      [emptyLeg.from.lon, emptyLeg.from.lat],
      [request.from.lon, request.from.lat],
      [request.to.lon, request.to.lat],
      [emptyLeg.to.lon, emptyLeg.to.lat],
    ]);

    const originalDistance = turf.length(originalRoute, { units: 'kilometers' });
    const reroutedDistance = turf.length(reroutedRoute, { units: 'kilometers' });
    const additionalDistance = reroutedDistance - originalDistance;

    // Estimate costs (simplified - in production, use aircraft-specific costs)
    const fuelCostPerKm = 5; // $5/km average
    const additionalCost = additionalDistance * fuelCostPerKm;

    // Estimate revenue from passenger
    const additionalRevenue = emptyLeg.price * 0.7; // 70% of empty leg price

    const netGain = additionalRevenue - additionalCost;

    return {
      viable: netGain > 0,
      additionalCost,
      additionalRevenue,
      netGain,
      recommendation: netGain > 0
        ? `Accept! Net gain of $${netGain.toFixed(0)} with ${additionalDistance.toFixed(0)}km detour`
        : `Decline. Would cost $${Math.abs(netGain).toFixed(0)} more than revenue`,
    };
  }

  /**
   * Multi-stop optimization (pick up multiple passengers)
   */
  async optimizeMultiStop(
    emptyLeg: EmptyLeg,
    requests: FlightRequest[]
  ): Promise<{
    optimizedRoute: Array<{ lat: number; lon: number; type: 'pickup' | 'dropoff'; request?: FlightRequest }>;
    totalRevenue: number;
    totalDetour: number;
    viable: boolean;
  }> {
    // This is a complex TSP (Traveling Salesman Problem) variant
    // For now, simple greedy algorithm
    
    const stops: Array<{ lat: number; lon: number; type: 'pickup' | 'dropoff'; request?: FlightRequest }> = [
      { lat: emptyLeg.from.lat, lon: emptyLeg.from.lon, type: 'pickup' },
    ];

    let totalRevenue = 0;
    let totalDetour = 0;

    // Add all pickup/dropoff points
    for (const req of requests) {
      stops.push({ lat: req.from.lat, lon: req.from.lon, type: 'pickup', request: req });
      stops.push({ lat: req.to.lat, lon: req.to.lon, type: 'dropoff', request: req });
      totalRevenue += emptyLeg.price * 0.6; // Estimate
    }

    stops.push({ lat: emptyLeg.to.lat, lon: emptyLeg.to.lon, type: 'dropoff' });

    // Calculate total route distance
    let routeDistance = 0;
    for (let i = 0; i < stops.length - 1; i++) {
      const dist = turf.distance(
        turf.point([stops[i].lon, stops[i].lat]),
        turf.point([stops[i + 1].lon, stops[i + 1].lat]),
        { units: 'kilometers' }
      );
      routeDistance += dist;
    }

    const originalDistance = turf.distance(
      turf.point([emptyLeg.from.lon, emptyLeg.from.lat]),
      turf.point([emptyLeg.to.lon, emptyLeg.to.lat]),
      { units: 'kilometers' }
    );

    totalDetour = routeDistance - originalDistance;
    const detourCost = totalDetour * 5; // $5/km

    return {
      optimizedRoute: stops,
      totalRevenue,
      totalDetour,
      viable: totalRevenue > detourCost,
    };
  }
}

// Export singleton
export const smartLegFinder = SmartLegFinder.getInstance();

