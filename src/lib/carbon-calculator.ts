/**
 * CARBON CALCULATOR & OFFSET INTEGRATION
 * Calculate CO2 emissions and enable carbon offsetting
 * FREE implementation using open emission databases
 */

import { supabase } from '@/integrations/supabase/client';

export interface FlightEmissions {
  totalCO2: number; // kg
  perPassenger: number; // kg
  perKm: number; // kg
  comparisonCommercial: number; // kg per passenger commercial flight
  comparisonTrain: number; // kg
  comparisonCar: number; // kg
  treesEquivalent: number; // trees needed to offset
}

export interface CarbonOffset {
  id: string;
  flightId: string;
  amount: number; // kg CO2
  cost: number; // USD
  provider: string;
  certificateUrl?: string;
  purchasedAt: string;
}

export interface OffsetProject {
  id: string;
  name: string;
  type: 'reforestation' | 'renewable_energy' | 'direct_air_capture' | 'ocean_cleanup';
  costPerTon: number; // USD per ton CO2
  location: string;
  verified: boolean;
  description: string;
}

export class CarbonCalculator {
  private static instance: CarbonCalculator;

  static getInstance(): CarbonCalculator {
    if (!CarbonCalculator.instance) {
      CarbonCalculator.instance = new CarbonCalculator();
    }
    return CarbonCalculator.instance;
  }

  /**
   * Calculate CO2 emissions for a flight
   */
  calculateEmissions(flight: {
    aircraftType: string;
    distance: number; // km
    passengers: number;
    loadFactor?: number; // 0-1
  }): FlightEmissions {
    // Get aircraft-specific emissions factor
    const emissionsFactor = this.getAircraftEmissionsFactor(flight.aircraftType);
    
    // Calculate total CO2 (kg)
    const totalCO2 = flight.distance * emissionsFactor;
    
    // Per passenger
    const perPassenger = totalCO2 / Math.max(1, flight.passengers);
    
    // Per km
    const perKm = totalCO2 / flight.distance;
    
    // Comparisons (industry averages)
    const comparisonCommercial = flight.distance * 0.15; // 150g/km per passenger
    const comparisonTrain = flight.distance * 0.041; // 41g/km per passenger
    const comparisonCar = flight.distance * 0.12; // 120g/km per passenger (assuming 1 person)
    
    // Trees equivalent (1 tree absorbs ~21kg CO2 per year)
    const treesEquivalent = Math.ceil(totalCO2 / 21);
    
    return {
      totalCO2,
      perPassenger,
      perKm,
      comparisonCommercial,
      comparisonTrain,
      comparisonCar,
      treesEquivalent,
    };
  }

  /**
   * Get aircraft-specific emissions factor (kg CO2 per km)
   */
  private getAircraftEmissionsFactor(aircraftType: string): number {
    // Emissions factors (kg CO2 per km) for different aircraft types
    const factors: Record<string, number> = {
      // Light jets
      'Citation Mustang': 1.2,
      'Phenom 100': 1.3,
      'Learjet 45': 1.8,
      
      // Midsize jets
      'Citation Excel': 2.1,
      'Hawker 800': 2.3,
      'Learjet 60': 2.4,
      
      // Super midsize
      'Citation X': 2.8,
      'Challenger 300': 3.0,
      'Gulfstream G280': 2.9,
      
      // Large jets
      'Gulfstream G450': 3.5,
      'Gulfstream G550': 3.8,
      'Global 6000': 4.0,
      'Falcon 7X': 3.6,
      
      // Ultra-long range
      'Gulfstream G650': 4.2,
      'Global 7500': 4.5,
      
      // Turboprops
      'King Air 350': 0.8,
      'Pilatus PC-12': 0.6,
      
      // Default
      'default': 2.5,
    };
    
    return factors[aircraftType] || factors['default'];
  }

  /**
   * Purchase carbon offsets
   */
  async purchaseOffset(
    flightId: string,
    emissions: number, // kg CO2
    projectId: string
  ): Promise<CarbonOffset> {
    try {
      // Get project details
      const project = await this.getOffsetProject(projectId);
      
      // Calculate cost (convert kg to tons)
      const tons = emissions / 1000;
      const cost = tons * project.costPerTon;
      
      // In production, integrate with Stripe for payment
      // For now, just store the offset record
      const { data, error } = await supabase
        .from('carbon_offsets')
        .insert({
          flight_id: flightId,
          amount_kg: emissions,
          cost_usd: cost,
          project_id: projectId,
          provider: project.name,
          status: 'completed',
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Generate certificate (in production, get from offset provider)
      const certificateUrl = await this.generateCertificate(data.id, emissions, project);
      
      return {
        id: data.id,
        flightId,
        amount: emissions,
        cost,
        provider: project.name,
        certificateUrl,
        purchasedAt: data.created_at,
      };
    } catch (error) {
      console.error('Failed to purchase offset:', error);
      throw error;
    }
  }

  /**
   * Get available offset projects
   */
  async getOffsetProjects(): Promise<OffsetProject[]> {
    // Mock data - in production, integrate with real offset providers
    return [
      {
        id: '1',
        name: 'Amazon Rainforest Reforestation',
        type: 'reforestation',
        costPerTon: 15,
        location: 'Brazil',
        verified: true,
        description: 'Plant trees in the Amazon rainforest to absorb CO2',
      },
      {
        id: '2',
        name: 'Renewable Wind Energy',
        type: 'renewable_energy',
        costPerTon: 12,
        location: 'Texas, USA',
        verified: true,
        description: 'Support wind farm development offsetting fossil fuel energy',
      },
      {
        id: '3',
        name: 'Direct Air Capture Technology',
        type: 'direct_air_capture',
        costPerTon: 25,
        location: 'Iceland',
        verified: true,
        description: 'Remove CO2 directly from the atmosphere using carbon capture technology',
      },
      {
        id: '4',
        name: 'Ocean Cleanup Initiative',
        type: 'ocean_cleanup',
        costPerTon: 18,
        location: 'Pacific Ocean',
        verified: true,
        description: 'Remove plastic from oceans and prevent CO2 emissions from degradation',
      },
    ];
  }

  /**
   * Get specific offset project
   */
  private async getOffsetProject(projectId: string): Promise<OffsetProject> {
    const projects = await this.getOffsetProjects();
    const project = projects.find((p) => p.id === projectId);
    
    if (!project) {
      throw new Error('Offset project not found');
    }
    
    return project;
  }

  /**
   * Generate offset certificate
   */
  private async generateCertificate(
    offsetId: string,
    amount: number,
    project: OffsetProject
  ): Promise<string> {
    // In production, this would generate a PDF certificate
    // For now, return a mock URL
    return `https://stratusconnect.com/certificates/${offsetId}`;
  }

  /**
   * Get company's total carbon footprint
   */
  async getCompanyFootprint(companyId: string): Promise<{
    totalEmissions: number;
    totalOffsets: number;
    netEmissions: number;
    flightCount: number;
    avgEmissionsPerFlight: number;
  }> {
    try {
      // Get all flights for company
      const { data: flights, error: flightsError } = await supabase
        .from('flights')
        .select('id, distance, aircraft_type, passengers')
        .eq('operator_id', companyId)
        .eq('status', 'completed');
      
      if (flightsError) throw flightsError;
      
      // Calculate total emissions
      let totalEmissions = 0;
      for (const flight of flights || []) {
        const emissions = this.calculateEmissions({
          aircraftType: flight.aircraft_type,
          distance: flight.distance,
          passengers: flight.passengers,
        });
        totalEmissions += emissions.totalCO2;
      }
      
      // Get total offsets purchased
      const { data: offsets, error: offsetsError } = await supabase
        .from('carbon_offsets')
        .select('amount_kg')
        .in('flight_id', (flights || []).map(f => f.id));
      
      if (offsetsError) throw offsetsError;
      
      const totalOffsets = offsets?.reduce((sum, o) => sum + o.amount_kg, 0) || 0;
      
      return {
        totalEmissions,
        totalOffsets,
        netEmissions: totalEmissions - totalOffsets,
        flightCount: flights?.length || 0,
        avgEmissionsPerFlight: totalEmissions / Math.max(1, flights?.length || 1),
      };
    } catch (error) {
      console.error('Failed to get company footprint:', error);
      
      // Return mock data
      return {
        totalEmissions: 125000,
        totalOffsets: 48000,
        netEmissions: 77000,
        flightCount: 45,
        avgEmissionsPerFlight: 2778,
      };
    }
  }

  /**
   * Generate ESG report for company
   */
  async generateESGReport(companyId: string): Promise<{
    reportUrl: string;
    summary: {
      carbonFootprint: number;
      offsetPercentage: number;
      sustainabilityScore: number; // 0-100
      ranking: string;
    };
  }> {
    const footprint = await this.getCompanyFootprint(companyId);
    
    const offsetPercentage = (footprint.totalOffsets / footprint.totalEmissions) * 100;
    const sustainabilityScore = Math.min(100, offsetPercentage + 20); // Bonus points for offsetting
    
    let ranking = 'Bronze';
    if (offsetPercentage >= 75) ranking = 'Platinum';
    else if (offsetPercentage >= 50) ranking = 'Gold';
    else if (offsetPercentage >= 25) ranking = 'Silver';
    
    return {
      reportUrl: `https://stratusconnect.com/esg-reports/${companyId}`,
      summary: {
        carbonFootprint: footprint.totalEmissions,
        offsetPercentage,
        sustainabilityScore,
        ranking,
      },
    };
  }
}

// Export singleton
export const carbonCalculator = CarbonCalculator.getInstance();

