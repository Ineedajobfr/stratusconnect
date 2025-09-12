// Re-market on Fall Through - Auto-broadcast to Best Fit Operators
// FCA Compliant Aviation Platform

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  Clock, 
  Target, 
  Users, 
  Plane,
  CheckCircle,
  AlertTriangle,
  Timer,
  Zap,
  Star,
  MapPin,
  Calendar
} from 'lucide-react';

export interface FallThroughDeal {
  id: string;
  originalDealId: string;
  reason: 'cancelled' | 'expired' | 'rejected' | 'payment_failed';
  originalOperator: string;
  originalQuote: number;
  currency: string;
  route: string;
  aircraft: string;
  seats: number;
  departureTime: string;
  createdAt: string;
  status: 'pending' | 'broadcasting' | 'quoted' | 'accepted' | 'expired';
  timeLimit: number; // hours
  expiresAt: string;
}

export interface ReMarketMatch {
  id: string;
  operator: string;
  operatorVerified: boolean;
  rating: number;
  responseTime: number; // minutes
  quote: number;
  currency: string;
  aircraft: string;
  seats: number;
  availability: string;
  matchScore: number;
  contactedAt: string;
  respondedAt?: string;
  status: 'contacted' | 'responded' | 'accepted' | 'declined' | 'expired';
}

export interface ReMarketOnFallThroughProps {
  dealId: string;
  onDealReMatched: (deal: FallThroughDeal, match: ReMarketMatch) => void;
}

export function ReMarketOnFallThrough({ dealId, onDealReMatched }: ReMarketOnFallThroughProps) {
  const [fallThroughDeals, setFallThroughDeals] = useState<FallThroughDeal[]>([]);
  const [reMarketMatches, setReMarketMatches] = useState<ReMarketMatch[]>([]);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Simulate fall through deals
  useEffect(() => {
    const mockFallThroughDeals: FallThroughDeal[] = [
      {
        id: 'FT_001',
        originalDealId: 'DEAL_123',
        reason: 'cancelled',
        originalOperator: 'Elite Aviation',
        originalQuote: 1500000,
        currency: 'GBP',
        route: 'LHR-CDG',
        aircraft: 'Gulfstream G550',
        seats: 8,
        departureTime: '2024-01-20T14:00:00Z',
        createdAt: new Date().toISOString(),
        status: 'pending',
        timeLimit: 2, // 2 hours
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'FT_002',
        originalDealId: 'DEAL_124',
        reason: 'expired',
        originalOperator: 'SkyBridge',
        originalQuote: 850000,
        currency: 'USD',
        route: 'NYC-MIA',
        aircraft: 'Citation X',
        seats: 6,
        departureTime: '2024-01-22T10:00:00Z',
        createdAt: new Date().toISOString(),
        status: 'broadcasting',
        timeLimit: 4, // 4 hours
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
      }
    ];

    setFallThroughDeals(mockFallThroughDeals);
  }, []);

  // Simulate re-market matches
  useEffect(() => {
    const mockMatches: ReMarketMatch[] = [
      {
        id: 'MATCH_001',
        operator: 'Prime Wings',
        operatorVerified: true,
        rating: 4.8,
        responseTime: 5,
        quote: 1450000,
        currency: 'GBP',
        aircraft: 'Gulfstream G550',
        seats: 8,
        availability: '2024-01-20T14:00:00Z',
        matchScore: 95,
        contactedAt: new Date().toISOString(),
        status: 'contacted'
      },
      {
        id: 'MATCH_002',
        operator: 'Crown Jets',
        operatorVerified: true,
        rating: 4.6,
        responseTime: 12,
        quote: 1480000,
        currency: 'GBP',
        aircraft: 'Gulfstream G550',
        seats: 8,
        availability: '2024-01-20T14:30:00Z',
        matchScore: 88,
        contactedAt: new Date().toISOString(),
        status: 'responded'
      },
      {
        id: 'MATCH_003',
        operator: 'Elite Aviation',
        operatorVerified: true,
        rating: 4.9,
        responseTime: 3,
        quote: 1520000,
        currency: 'GBP',
        aircraft: 'Gulfstream G550',
        seats: 8,
        availability: '2024-01-20T13:30:00Z',
        matchScore: 92,
        contactedAt: new Date().toISOString(),
        status: 'accepted'
      }
    ];

    setReMarketMatches(mockMatches);
  }, []);

  const startReMarketing = async (fallThroughDeal: FallThroughDeal) => {
    setIsBroadcasting(true);
    
    // Simulate API call to find best fit operators
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update deal status
    setFallThroughDeals(prev => prev.map(deal => 
      deal.id === fallThroughDeal.id 
        ? { ...deal, status: 'broadcasting' }
        : deal
    ));
    
    // Simulate finding matches
    const matches = await findBestFitOperators(fallThroughDeal);
    setReMarketMatches(prev => [...prev, ...matches]);
    
    setIsBroadcasting(false);
  };

  const findBestFitOperators = async (deal: FallThroughDeal): Promise<ReMarketMatch[]> => {
    // Simulate API call to find operators
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockMatches: ReMarketMatch[] = [
      {
        id: `MATCH_${Date.now()}_1`,
        operator: 'Prime Wings',
        operatorVerified: true,
        rating: 4.8,
        responseTime: 5,
        quote: Math.round(deal.originalQuote * 0.97), // 3% lower
        currency: deal.currency,
        aircraft: deal.aircraft,
        seats: deal.seats,
        availability: deal.departureTime,
        matchScore: 95,
        contactedAt: new Date().toISOString(),
        status: 'contacted'
      },
      {
        id: `MATCH_${Date.now()}_2`,
        operator: 'Crown Jets',
        operatorVerified: true,
        rating: 4.6,
        responseTime: 12,
        quote: Math.round(deal.originalQuote * 1.02), // 2% higher
        currency: deal.currency,
        aircraft: deal.aircraft,
        seats: deal.seats,
        availability: deal.departureTime,
        matchScore: 88,
        contactedAt: new Date().toISOString(),
        status: 'contacted'
      }
    ];
    
    return mockMatches;
  };

  const acceptMatch = (match: ReMarketMatch, fallThroughDeal: FallThroughDeal) => {
    // Update match status
    setReMarketMatches(prev => prev.map(m => 
      m.id === match.id 
        ? { ...m, status: 'accepted' }
        : m
    ));
    
    // Update deal status
    setFallThroughDeals(prev => prev.map(deal => 
      deal.id === fallThroughDeal.id 
        ? { ...deal, status: 'accepted' }
        : deal
    ));
    
    // Notify parent component
    onDealReMatched(fallThroughDeal, match);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'broadcasting':
        return 'bg-blue-100 text-blue-800';
      case 'quoted':
        return 'bg-green-100 text-green-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchStatusColor = (status: string) => {
    switch (status) {
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'responded':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency
    }).format(amount / 100);
  };

  const getTimeUntilExpiry = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    return Math.max(0, diffHours);
  };

  return (
    <div className="space-y-6">
      {/* Fall Through Deals */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Fall Through Deals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {fallThroughDeals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No fall through deals</p>
              <p className="text-sm">Deals that fall through will appear here for re-marketing</p>
            </div>
          ) : (
            <div className="space-y-4">
              {fallThroughDeals.map(deal => (
                <Card key={deal.id} className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">Deal #{deal.originalDealId}</h3>
                        <Badge className={getStatusColor(deal.status)}>
                          {deal.status}
                        </Badge>
                        <Badge variant="outline">
                          {deal.reason}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {deal.route} • {deal.aircraft} • {deal.seats} seats
                      </p>
                      <p className="text-sm text-gray-600">
                        Original: {deal.originalOperator} • {formatCurrency(deal.originalQuote, deal.currency)}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p>Departure: {new Date(deal.departureTime).toLocaleString()}</p>
                      <p className="text-red-600">
                        Expires in: {getTimeUntilExpiry(deal.expiresAt)}h
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Route</p>
                      <p className="font-semibold">{deal.route}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Aircraft</p>
                      <p className="font-semibold">{deal.aircraft}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Seats</p>
                      <p className="font-semibold">{deal.seats}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Original Quote</p>
                      <p className="font-semibold">{formatCurrency(deal.originalQuote, deal.currency)}</p>
                    </div>
                  </div>

                  {deal.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => startReMarketing(deal)}
                        disabled={isBroadcasting}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isBroadcasting ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Broadcasting...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Start Re-marketing
                          </>
                        )}
                      </Button>
                      <Button variant="outline">
                        <Clock className="w-4 h-4 mr-2" />
                        Set Reminder
                      </Button>
                    </div>
                  )}

                  {deal.status === 'broadcasting' && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Broadcasting to operators...</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Re-market Matches */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Re-market Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reMarketMatches.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No re-market matches</p>
              <p className="text-sm">Matches will appear here when operators respond</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reMarketMatches.map(match => (
                <Card key={match.id} className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{match.operator}</h3>
                        <Badge className={getMatchStatusColor(match.status)}>
                          {match.status}
                        </Badge>
                        {match.operatorVerified && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {match.aircraft} • {match.seats} seats • {formatCurrency(match.quote, match.currency)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Response time: {match.responseTime} min • Rating: {match.rating}/5
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-semibold text-white">
                        Match Score: {match.matchScore}%
                      </p>
                      <p className="text-gray-500">
                        Contacted: {new Date(match.contactedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Quote</p>
                      <p className="font-semibold">{formatCurrency(match.quote, match.currency)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Response Time</p>
                      <p className="font-semibold">{match.responseTime} min</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="font-semibold flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        {match.rating}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Availability</p>
                      <p className="font-semibold">
                        {new Date(match.availability).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {match.status === 'contacted' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => acceptMatch(match, fallThroughDeals[0])}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept Quote
                      </Button>
                      <Button size="sm" variant="outline">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Decline
                      </Button>
                    </div>
                  )}

                  {match.status === 'accepted' && (
                    <div className="flex items-center gap-2 text-white">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Quote accepted - Deal re-matched!</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
