// Advanced Pricing Engine - Industry Standard Implementation
// FCA Compliant Aviation Platform

import { weatherService } from './weather-service';

export interface PricingFactors {
  aircraft: string;
  distance: number;
  passengers: number;
  route: {
    from: string;
    to: string;
    waypoints: string[];
  };
  date: string;
  time: string;
  duration: number; // hours
  weather: {
    conditions: string[];
    wind: number;
    visibility: number;
    ceiling: number;
  };
  demand: {
    season: 'low' | 'medium' | 'high' | 'peak';
    dayOfWeek: number;
    timeOfDay: 'early' | 'morning' | 'afternoon' | 'evening' | 'night';
    specialEvents: string[];
  };
  operator: {
    rating: number;
    experience: number;
    location: string;
    fleetSize: number;
  };
  market: {
    fuelPrice: number;
    landingFees: number;
    handlingFees: number;
    crewCosts: number;
    insurance: number;
  };
}

export interface PricingBreakdown {
  basePrice: number;
  fuelCost: number;
  crewCost: number;
  landingFees: number;
  handlingFees: number;
  catering: number;
  insurance: number;
  weatherSurcharge: number;
  demandMultiplier: number;
  operatorPremium: number;
  subtotal: number;
  taxes: number;
  total: number;
  currency: string;
  validUntil: string;
  breakdown: {
    category: string;
    amount: number;
    percentage: number;
    description: string;
  }[];
}

class PricingEngine {
  // Main pricing calculation method
  async calculatePricing(factors: PricingFactors): Promise<PricingBreakdown> {
    try {
      // Get real-time market data
      const marketData = await this.getMarketData();
      
      // Calculate base pricing
      const basePrice = this.calculateBasePrice(factors, marketData);
      
      // Calculate fuel costs
      const fuelCost = this.calculateFuelCost(factors, marketData);
      
      // Calculate crew costs
      const crewCost = this.calculateCrewCost(factors, marketData);
      
      // Calculate landing fees
      const landingFees = await this.calculateLandingFees(factors);
      
      // Calculate handling fees
      const handlingFees = this.calculateHandlingFees(factors);
      
      // Calculate catering
      const catering = this.calculateCatering(factors);
      
      // Calculate insurance
      const insurance = this.calculateInsurance(factors, marketData);
      
      // Calculate weather surcharge
      const weatherSurcharge = this.calculateWeatherSurcharge(factors);
      
      // Calculate demand multiplier
      const demandMultiplier = this.calculateDemandMultiplier(factors);
      
      // Calculate operator premium
      const operatorPremium = this.calculateOperatorPremium(factors);
      
      // Calculate subtotal
      const subtotal = basePrice + fuelCost + crewCost + landingFees + handlingFees + 
                      catering + insurance + weatherSurcharge;
      
      // Apply multipliers
      const adjustedSubtotal = subtotal * demandMultiplier * operatorPremium;
      
      // Calculate taxes
      const taxes = this.calculateTaxes(adjustedSubtotal, factors);
      
      // Calculate total
      const total = adjustedSubtotal + taxes;
      
      // Generate breakdown
      const breakdown = this.generateBreakdown({
        basePrice,
        fuelCost,
        crewCost,
        landingFees,
        handlingFees,
        catering,
        insurance,
        weatherSurcharge,
        demandMultiplier,
        operatorPremium,
        subtotal: adjustedSubtotal,
        taxes,
        total
      });
      
      return {
        basePrice,
        fuelCost,
        crewCost,
        landingFees,
        handlingFees,
        catering,
        insurance,
        weatherSurcharge,
        demandMultiplier,
        operatorPremium,
        subtotal: adjustedSubtotal,
        taxes,
        total,
        currency: 'USD',
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        breakdown
      };
    } catch (error) {
      console.error('Error calculating pricing:', error);
      throw error;
    }
  }

  // Calculate base price based on aircraft and distance
  private calculateBasePrice(factors: PricingFactors, marketData: any): number {
    const aircraftRates: Record<string, number> = {
      'Gulfstream G650': 18.0,
      'Gulfstream G550': 16.0,
      'Gulfstream G450': 14.0,
      'Global 6000': 15.0,
      'Global 5000': 13.0,
      'Falcon 7X': 12.0,
      'Falcon 6X': 10.0,
      'Citation X': 8.0,
      'Citation X+': 9.0,
      'Challenger 350': 7.0,
      'Challenger 650': 8.5,
      'Phenom 300': 5.0,
      'Phenom 100': 4.0
    };
    
    const baseRate = aircraftRates[factors.aircraft] || 10.0;
    const distanceMultiplier = this.getDistanceMultiplier(factors.distance);
    const passengerMultiplier = Math.max(1, factors.passengers / 4); // Base on 4 passengers
    
    return Math.round(factors.distance * baseRate * distanceMultiplier * passengerMultiplier);
  }

  // Calculate fuel costs
  private calculateFuelCost(factors: PricingFactors, marketData: any): number {
    const fuelConsumption: Record<string, number> = {
      'Gulfstream G650': 0.85,
      'Gulfstream G550': 0.80,
      'Gulfstream G450': 0.75,
      'Global 6000': 0.70,
      'Global 5000': 0.65,
      'Falcon 7X': 0.75,
      'Falcon 6X': 0.70,
      'Citation X': 0.60,
      'Citation X+': 0.65,
      'Challenger 350': 0.55,
      'Challenger 650': 0.60,
      'Phenom 300': 0.45,
      'Phenom 100': 0.40
    };
    
    const consumption = fuelConsumption[factors.aircraft] || 0.60;
    const fuelPrice = marketData.fuelPrice || 2.50; // per gallon
    const fuelUsed = factors.distance * consumption;
    
    return Math.round(fuelUsed * fuelPrice);
  }

  // Calculate crew costs
  private calculateCrewCost(factors: PricingFactors, marketData: any): number {
    const crewSize = this.getCrewSize(factors.aircraft);
    const hourlyRate = marketData.crewRate || 200; // per hour per crew member
    const flightHours = factors.duration;
    
    return Math.round(crewSize * hourlyRate * flightHours);
  }

  // Calculate landing fees
  private async calculateLandingFees(factors: PricingFactors): Promise<number> {
    const fees: Record<string, number> = {
      'KJFK': 500,
      'KLGA': 400,
      'KEWR': 450,
      'KORD': 600,
      'KMDW': 350,
      'KLAX': 550,
      'KSFO': 500,
      'KDFW': 400,
      'KATL': 350,
      'KMIA': 450
    };
    
    const departureFee = fees[factors.route.from] || 300;
    const arrivalFee = fees[factors.route.to] || 300;
    const waypointFees = factors.route.waypoints.reduce((total, waypoint) => 
      total + (fees[waypoint] || 200), 0
    );
    
    return departureFee + arrivalFee + waypointFees;
  }

  // Calculate handling fees
  private calculateHandlingFees(factors: PricingFactors): number {
    const baseHandling = 1000; // per leg
    const passengerHandling = factors.passengers * 50; // per passenger
    const specialHandling = factors.weather.conditions.includes('TS') ? 500 : 0;
    
    return baseHandling + passengerHandling + specialHandling;
  }

  // Calculate catering costs
  private calculateCatering(factors: PricingFactors): number {
    const baseCatering = 150; // per passenger per leg
    const premiumCatering = factors.passengers > 8 ? 200 : 150;
    const legCount = 1 + factors.route.waypoints.length;
    
    return factors.passengers * premiumCatering * legCount;
  }

  // Calculate insurance costs
  private calculateInsurance(factors: PricingFactors, marketData: any): number {
    const baseInsurance = 0.02; // 2% of base price
    const weatherMultiplier = factors.weather.conditions.includes('TS') ? 1.5 : 1.0;
    const distanceMultiplier = factors.distance > 3000 ? 1.2 : 1.0;
    
    return Math.round(factors.distance * 10 * baseInsurance * weatherMultiplier * distanceMultiplier);
  }

  // Calculate weather surcharge
  private calculateWeatherSurcharge(factors: PricingFactors): number {
    let surcharge = 0;
    
    if (factors.weather.conditions.includes('TS')) surcharge += 2000;
    if (factors.weather.conditions.includes('FG')) surcharge += 500;
    if (factors.weather.conditions.includes('SN')) surcharge += 1000;
    if (factors.weather.wind > 25) surcharge += 800;
    if (factors.weather.visibility < 1) surcharge += 600;
    if (factors.weather.ceiling < 1000) surcharge += 400;
    
    return surcharge;
  }

  // Calculate demand multiplier
  private calculateDemandMultiplier(factors: PricingFactors): number {
    let multiplier = 1.0;
    
    // Season multiplier
    switch (factors.demand.season) {
      case 'low': multiplier *= 0.8; break;
      case 'medium': multiplier *= 1.0; break;
      case 'high': multiplier *= 1.3; break;
      case 'peak': multiplier *= 1.6; break;
    }
    
    // Day of week multiplier
    if (factors.demand.dayOfWeek === 0 || factors.demand.dayOfWeek === 6) {
      multiplier *= 1.2; // Weekend premium
    }
    
    // Time of day multiplier
    switch (factors.demand.timeOfDay) {
      case 'early': multiplier *= 0.9; break;
      case 'morning': multiplier *= 1.1; break;
      case 'afternoon': multiplier *= 1.2; break;
      case 'evening': multiplier *= 1.1; break;
      case 'night': multiplier *= 0.8; break;
    }
    
    // Special events multiplier
    if (factors.demand.specialEvents.length > 0) {
      multiplier *= 1.5;
    }
    
    return Math.round(multiplier * 100) / 100;
  }

  // Calculate operator premium
  private calculateOperatorPremium(factors: PricingFactors): number {
    let multiplier = 1.0;
    
    // Rating multiplier
    if (factors.operator.rating >= 4.8) multiplier *= 1.2;
    else if (factors.operator.rating >= 4.5) multiplier *= 1.1;
    else if (factors.operator.rating < 4.0) multiplier *= 0.9;
    
    // Experience multiplier
    if (factors.operator.experience > 10) multiplier *= 1.1;
    else if (factors.operator.experience < 2) multiplier *= 0.9;
    
    // Fleet size multiplier (larger fleets = more reliable)
    if (factors.operator.fleetSize > 20) multiplier *= 1.05;
    else if (factors.operator.fleetSize < 5) multiplier *= 0.95;
    
    return Math.round(multiplier * 100) / 100;
  }

  // Calculate taxes
  private calculateTaxes(subtotal: number, factors: PricingFactors): number {
    const taxRate = 0.08; // 8% average tax rate
    return Math.round(subtotal * taxRate);
  }

  // Generate detailed breakdown
  private generateBreakdown(pricing: any): any[] {
    const breakdown = [
      {
        category: 'Base Price',
        amount: pricing.basePrice,
        percentage: (pricing.basePrice / pricing.total) * 100,
        description: 'Aircraft rental and basic service'
      },
      {
        category: 'Fuel Cost',
        amount: pricing.fuelCost,
        percentage: (pricing.fuelCost / pricing.total) * 100,
        description: 'Jet fuel based on distance and consumption'
      },
      {
        category: 'Crew Cost',
        amount: pricing.crewCost,
        percentage: (pricing.crewCost / pricing.total) * 100,
        description: 'Pilot and crew compensation'
      },
      {
        category: 'Landing Fees',
        amount: pricing.landingFees,
        percentage: (pricing.landingFees / pricing.total) * 100,
        description: 'Airport landing and departure fees'
      },
      {
        category: 'Handling Fees',
        amount: pricing.handlingFees,
        percentage: (pricing.handlingFees / pricing.total) * 100,
        description: 'Ground handling and services'
      },
      {
        category: 'Catering',
        amount: pricing.catering,
        percentage: (pricing.catering / pricing.total) * 100,
        description: 'Food and beverage service'
      },
      {
        category: 'Insurance',
        amount: pricing.insurance,
        percentage: (pricing.insurance / pricing.total) * 100,
        description: 'Aviation insurance coverage'
      },
      {
        category: 'Weather Surcharge',
        amount: pricing.weatherSurcharge,
        percentage: (pricing.weatherSurcharge / pricing.total) * 100,
        description: 'Additional costs for weather conditions'
      }
    ];
    
    if (pricing.demandMultiplier !== 1.0) {
      breakdown.push({
        category: 'Demand Premium',
        amount: pricing.subtotal * (pricing.demandMultiplier - 1),
        percentage: ((pricing.subtotal * (pricing.demandMultiplier - 1)) / pricing.total) * 100,
        description: 'Market demand adjustment'
      });
    }
    
    if (pricing.operatorPremium !== 1.0) {
      breakdown.push({
        category: 'Operator Premium',
        amount: pricing.subtotal * (pricing.operatorPremium - 1),
        percentage: ((pricing.subtotal * (pricing.operatorPremium - 1)) / pricing.total) * 100,
        description: 'Operator quality and reliability premium'
      });
    }
    
    breakdown.push({
      category: 'Taxes',
      amount: pricing.taxes,
      percentage: (pricing.taxes / pricing.total) * 100,
      description: 'Government taxes and fees'
    });
    
    return breakdown;
  }

  // Helper methods
  private getDistanceMultiplier(distance: number): number {
    if (distance < 500) return 1.2; // Short haul premium
    if (distance < 1500) return 1.0; // Medium haul
    if (distance < 3000) return 0.9; // Long haul efficiency
    return 0.8; // Ultra long haul efficiency
  }

  private getCrewSize(aircraft: string): number {
    const crewSizes: Record<string, number> = {
      'Gulfstream G650': 3,
      'Gulfstream G550': 3,
      'Gulfstream G450': 2,
      'Global 6000': 3,
      'Global 5000': 2,
      'Falcon 7X': 2,
      'Falcon 6X': 2,
      'Citation X': 2,
      'Citation X+': 2,
      'Challenger 350': 2,
      'Challenger 650': 2,
      'Phenom 300': 2,
      'Phenom 100': 2
    };
    return crewSizes[aircraft] || 2;
  }

  private async getMarketData(): Promise<any> {
    // In a real implementation, this would fetch live market data
    return {
      fuelPrice: 2.50,
      crewRate: 200,
      landingFees: 400,
      handlingFees: 1000,
      insurance: 0.02
    };
  }
}

export const pricingEngine = new PricingEngine();
