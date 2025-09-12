// Backhaul and Empty Leg Auto-Match
// FCA Compliant Aviation Platform

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Plane, 
  Clock, 
  MapPin, 
  DollarSign, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target
} from 'lucide-react';

export interface EmptyLeg {
  id: string;
  operatorId: string;
  operatorName: string;
  aircraft: string;
  from: string;
  to: string;
  departureDate: string;
  departureTime: string;
  seats: number;
  basePrice: number;
  currency: string;
  distanceNm: number;
  verified: boolean;
  rating: number;
  lastMinute: boolean;
  backhaul: boolean;
}

export interface RFQMatch {
  rfqId: string;
  emptyLegId: string;
  matchScore: number;
  priceToWin: number;
  netToOperator: number;
  savings: number;
  confidence: 'low' | 'medium' | 'high';
  reasons: string[];
}

export interface BackhaulMatcherProps {
  rfqId: string;
  from: string;
  to: string;
  departureDate: string;
  passengers: number;
  onMatch: (match: RFQMatch) => void;
}

export function BackhaulMatcher({ rfqId, from, to, departureDate, passengers, onMatch }: BackhaulMatcherProps) {
  const [emptyLegs, setEmptyLegs] = useState<EmptyLeg[]>([]);
  const [matches, setMatches] = useState<RFQMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchRadius, setSearchRadius] = useState(100); // NM

  useEffect(() => {
    findMatches();
  }, [from, to, departureDate, passengers, searchRadius, findMatches]);

  const findMatches = useCallback(async () => {
    setLoading(true);
    
    // Free tier: Use mock data instead of real API calls
    const mockEmptyLegs: EmptyLeg[] = [
      {
        id: 'EL_001',
        operatorId: 'OP_001',
        operatorName: 'Elite Aviation',
        aircraft: 'Gulfstream G650',
        from: 'LHR',
        to: 'JFK',
        departureDate: '2024-01-20',
        departureTime: '14:30',
        seats: 12,
        basePrice: 450000, // £4,500
        currency: 'GBP',
        distanceNm: 3000,
        verified: true,
        rating: 4.8,
        lastMinute: false,
        backhaul: true
      },
      {
        id: 'EL_002',
        operatorId: 'OP_002',
        operatorName: 'SkyBridge',
        aircraft: 'Citation X',
        from: 'LGW',
        to: 'JFK',
        departureDate: '2024-01-20',
        departureTime: '16:00',
        seats: 6,
        basePrice: 320000, // £3,200
        currency: 'GBP',
        distanceNm: 3000,
        verified: true,
        rating: 4.6,
        lastMinute: true,
        backhaul: false
      },
      {
        id: 'EL_003',
        operatorId: 'OP_003',
        operatorName: 'Crown Jets',
        aircraft: 'Global 6000',
        from: 'LHR',
        to: 'EWR',
        departureDate: '2024-01-21',
        departureTime: '09:00',
        seats: 12,
        basePrice: 380000, // £3,800
        currency: 'GBP',
        distanceNm: 3000,
        verified: false,
        rating: 4.3,
        lastMinute: false,
        backhaul: true
      }
    ];

    // Filter and score matches
    const filteredLegs = emptyLegs.filter(leg => 
      isWithinRadius(leg.from, from) && 
      isWithinRadius(leg.to, to) &&
      isWithinDateRange(leg.departureDate, departureDate) &&
      leg.seats >= passengers
    );

    const scoredMatches = filteredLegs.map(leg => calculateMatch(leg));
    
    setEmptyLegs(filteredLegs);
    setMatches(scoredMatches.sort((a, b) => b.matchScore - a.matchScore));
    setLoading(false);
  }, [from, to, departureDate, passengers, searchRadius]);

  const isWithinRadius = (airport1: string, airport2: string) => {
    // Simplified distance check - in production would use actual coordinates
    return Math.abs(airport1.charCodeAt(0) - airport2.charCodeAt(0)) < 2;
  };

  const isWithinDateRange = (legDate: string, rfqDate: string) => {
    const leg = new Date(legDate);
    const rfq = new Date(rfqDate);
    const diffDays = Math.abs(leg.getTime() - rfq.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 1; // Within 1 day
  };

  const calculateMatch = (leg: EmptyLeg): RFQMatch => {
    let score = 0;
    const reasons: string[] = [];
    
    // Base score for empty leg
    score += 50;
    reasons.push('Empty leg available');
    
    // Backhaul bonus
    if (leg.backhaul) {
      score += 30;
      reasons.push('Backhaul opportunity');
    }
    
    // Verification bonus
    if (leg.verified) {
      score += 20;
      reasons.push('Verified operator');
    }
    
    // Rating bonus
    if (leg.rating >= 4.5) {
      score += 15;
      reasons.push('High-rated operator');
    }
    
    // Last minute bonus
    if (leg.lastMinute) {
      score += 10;
      reasons.push('Last minute availability');
    }
    
    // Price calculation
    const platformFee = Math.round(leg.basePrice * 0.07);
    const netToOperator = leg.basePrice - platformFee;
    const savings = Math.round(leg.basePrice * 0.15); // 15% savings estimate
    const priceToWin = leg.basePrice - savings;
    
    // Price competitiveness
    if (priceToWin < leg.basePrice * 0.9) {
      score += 25;
      reasons.push('Competitive pricing');
    }
    
    const confidence = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';
    
    return {
      rfqId,
      emptyLegId: leg.id,
      matchScore: Math.min(100, score),
      priceToWin,
      netToOperator,
      savings,
      confidence,
      reasons
    };
  };

  const proposeMatch = (match: RFQMatch) => {
    onMatch(match);
    console.log('Match Proposed:', match);
  };

  return (
    <div className="space-y-4">
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Auto-Match Results
            {loading && <Badge variant="outline">Searching...</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {matches.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Plane className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No empty legs or backhauls found for this route</p>
              <p className="text-sm">Try expanding your search radius or date range</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match, index) => {
                const leg = emptyLegs.find(l => l.id === match.emptyLegId);
                if (!leg) return null;
                
                return (
                  <Card key={match.emptyLegId} className={`p-4 ${
                    match.confidence === 'high' ? 'border-green-200 bg-slate-800' :
                    match.confidence === 'medium' ? 'border-yellow-200 bg-slate-800' :
                    'border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{leg.operatorName}</h3>
                          <Badge variant="outline" className={
                            match.confidence === 'high' ? 'text-white' :
                            match.confidence === 'medium' ? 'text-yellow-600' :
                            'text-gray-600'
                          }>
                            {match.matchScore}% match
                          </Badge>
                          {leg.verified && (
                            <Badge variant="outline" className="text-blue-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {leg.backhaul && (
                            <Badge variant="outline" className="text-purple-600">
                              Backhaul
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div className="flex items-center gap-1">
                            <Plane className="w-4 h-4 text-gray-500" />
                            <span>{leg.aircraft}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span>{leg.from} → {leg.to}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>{leg.departureDate} {leg.departureTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-gray-500" />
                            <span>{leg.rating}/5.0</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-600">Base Price: </span>
                            <span className="font-medium">£{(leg.basePrice / 100).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Price to Win: </span>
                            <span className="font-medium text-white">£{(match.priceToWin / 100).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Net to Operator: </span>
                            <span className="font-medium">£{(match.netToOperator / 100).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Savings: </span>
                            <span className="font-medium text-blue-600">£{(match.savings / 100).toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {match.reasons.map((reason, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {reason}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <Button
                          onClick={() => proposeMatch(match)}
                          size="sm"
                          className={
                            match.confidence === 'high' ? 'bg-green-600 hover:bg-green-700' :
                            match.confidence === 'medium' ? 'bg-yellow-600 hover:bg-yellow-700' :
                            'bg-gray-600 hover:bg-gray-700'
                          }
                        >
                          <Target className="w-4 h-4 mr-2" />
                          Propose
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
