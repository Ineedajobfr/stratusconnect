// Quote Composer with Price to Win and Margin Guard
// FCA Compliant Aviation Platform

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { calcDealFees } from '@/lib/fees';
import { 
  Calculator, 
  TrendingUp, 
  Shield, 
  Clock, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Target,
  Zap
} from 'lucide-react';

export interface QuoteComposerProps {
  rfqId: string;
  operatorId: string;
  route: string;
  aircraft: string;
  passengers: number;
  distanceNm: number;
  departureDate: string;
}

export interface PriceBand {
  min: number;
  max: number;
  suggested: number;
  confidence: 'low' | 'medium' | 'high';
}

export interface MarginBreakdown {
  baseRate: number;
  positioning: number;
  surcharges: number;
  taxes: number;
  fuel: number;
  crew: number;
  total: number;
  platformFee: number;
  netToOperator: number;
  margin: number;
}

export function QuoteComposer({ rfqId, operatorId, route, aircraft, passengers, distanceNm, departureDate }: QuoteComposerProps) {
  const [baseRate, setBaseRate] = useState(0);
  const [positioning, setPositioning] = useState(0);
  const [surcharges, setSurcharges] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [fuel, setFuel] = useState(0);
  const [crew, setCrew] = useState(0);
  const [cancellationTerms, setCancellationTerms] = useState('24h');
  const [expiryHours, setExpiryHours] = useState(24);
  const [notes, setNotes] = useState('');
  const [priceBand, setPriceBand] = useState<PriceBand | null>(null);
  const [marginBreakdown, setMarginBreakdown] = useState<MarginBreakdown | null>(null);

  // Calculate price band based on route, aircraft, and timing
  useEffect(() => {
    calculatePriceBand();
  }, [route, aircraft, distanceNm, departureDate, calculatePriceBand]);

  // Calculate margin breakdown when values change
  useEffect(() => {
    calculateMarginBreakdown();
  }, [baseRate, positioning, surcharges, taxes, fuel, crew, calculateMarginBreakdown]);

  const calculatePriceBand = useCallback(() => {
    // Free tier: Use mock data instead of ML/historical data
    const basePricePerNm = 2500; // £25 per NM base
    const urgencyMultiplier = getUrgencyMultiplier();
    const aircraftMultiplier = getAircraftMultiplier(aircraft);
    
    const basePrice = distanceNm * basePricePerNm * aircraftMultiplier;
    const minPrice = basePrice * 0.85 * urgencyMultiplier;
    const maxPrice = basePrice * 1.25 * urgencyMultiplier;
    const suggestedPrice = basePrice * 1.05 * urgencyMultiplier;
    
    setPriceBand({
      min: Math.round(minPrice),
      max: Math.round(maxPrice),
      suggested: Math.round(suggestedPrice),
      confidence: distanceNm > 500 ? 'high' : distanceNm > 200 ? 'medium' : 'low'
    });
  }, [route, aircraft, distanceNm, departureDate]);

  const getUrgencyMultiplier = () => {
    const daysUntilDeparture = Math.ceil((new Date(departureDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntilDeparture <= 1) return 1.4; // Last minute premium
    if (daysUntilDeparture <= 3) return 1.2; // Short notice
    if (daysUntilDeparture <= 7) return 1.1; // Week out
    return 1.0; // Normal booking
  };

  const getAircraftMultiplier = (aircraft: string) => {
    const multipliers: { [key: string]: number } = {
      'Gulfstream G650': 1.8,
      'Gulfstream G550': 1.5,
      'Global 6000': 1.4,
      'Citation X': 1.2,
      'Citation CJ3': 1.0,
      'Phenom 300': 0.9
    };
    return multipliers[aircraft] || 1.0;
  };

  const calculateMarginBreakdown = useCallback(() => {
    const total = baseRate + positioning + surcharges + taxes + fuel + crew;
    const { platform: platformFee, net: netToOperator } = calcDealFees(total);
    const margin = netToOperator - (fuel + crew); // Margin after direct costs
    
    setMarginBreakdown({
      baseRate,
      positioning,
      surcharges,
      taxes,
      fuel,
      crew,
      total,
      platformFee,
      netToOperator,
      margin
    });
  }, [baseRate, positioning, surcharges, taxes, fuel, crew]);

  const getMarginStatus = () => {
    if (!marginBreakdown) return { status: 'unknown', color: 'gray', icon: null };
    
    const marginPercentage = (marginBreakdown.margin / marginBreakdown.total) * 100;
    
    if (marginPercentage < 10) {
      return { status: 'danger', color: 'red', icon: AlertTriangle };
    } else if (marginPercentage < 20) {
      return { status: 'warning', color: 'yellow', icon: AlertTriangle };
    } else {
      return { status: 'good', color: 'green', icon: CheckCircle };
    }
  };

  const submitQuote = () => {
    const quote = {
      rfqId,
      operatorId,
      baseRate,
      positioning,
      surcharges,
      taxes,
      fuel,
      crew,
      total: marginBreakdown?.total || 0,
      platformFee: marginBreakdown?.platformFee || 0,
      netToOperator: marginBreakdown?.netToOperator || 0,
      cancellationTerms,
      expiryHours,
      notes,
      submittedAt: new Date().toISOString()
    };
    
    console.log('Quote Submitted:', quote);
  };

  const marginStatus = getMarginStatus();
  const MarginIcon = marginStatus.icon;

  return (
    <div className="space-y-6">
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Quote Composer - {route}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Band Suggestion */}
          {priceBand && (
            <Card className="p-4 bg-slate-800 border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Price to Win</h3>
                <Badge variant="outline" className="text-blue-600">
                  {priceBand.confidence} confidence
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Min: </span>
                  <span className="font-medium">£{(priceBand.min / 100).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Suggested: </span>
                  <span className="font-medium text-blue-600">£{(priceBand.suggested / 100).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Max: </span>
                  <span className="font-medium">£{(priceBand.max / 100).toLocaleString()}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Quote Builder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Quote Components</h3>
              
              <div>
                <Label htmlFor="baseRate">Base Rate (£)</Label>
                <Input
                  id="baseRate"
                  type="number"
                  value={baseRate}
                  onChange={(e) => setBaseRate(parseInt(e.target.value) || 0)}
                  placeholder="Enter base rate"
                />
              </div>
              
              <div>
                <Label htmlFor="positioning">Positioning (£)</Label>
                <Input
                  id="positioning"
                  type="number"
                  value={positioning}
                  onChange={(e) => setPositioning(parseInt(e.target.value) || 0)}
                  placeholder="Positioning costs"
                />
              </div>
              
              <div>
                <Label htmlFor="surcharges">Surcharges (£)</Label>
                <Input
                  id="surcharges"
                  type="number"
                  value={surcharges}
                  onChange={(e) => setSurcharges(parseInt(e.target.value) || 0)}
                  placeholder="Surcharges"
                />
              </div>
              
              <div>
                <Label htmlFor="taxes">Taxes (£)</Label>
                <Input
                  id="taxes"
                  type="number"
                  value={taxes}
                  onChange={(e) => setTaxes(parseInt(e.target.value) || 0)}
                  placeholder="Taxes"
                />
              </div>
              
              <div>
                <Label htmlFor="fuel">Fuel (£)</Label>
                <Input
                  id="fuel"
                  type="number"
                  value={fuel}
                  onChange={(e) => setFuel(parseInt(e.target.value) || 0)}
                  placeholder="Fuel costs"
                />
              </div>
              
              <div>
                <Label htmlFor="crew">Crew (£)</Label>
                <Input
                  id="crew"
                  type="number"
                  value={crew}
                  onChange={(e) => setCrew(parseInt(e.target.value) || 0)}
                  placeholder="Crew costs"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Terms & Conditions</h3>
              
              <div>
                <Label htmlFor="cancellation">Cancellation Terms</Label>
                <Select value={cancellationTerms} onValueChange={setCancellationTerms}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 hours</SelectItem>
                    <SelectItem value="48h">48 hours</SelectItem>
                    <SelectItem value="72h">72 hours</SelectItem>
                    <SelectItem value="7d">7 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="expiry">Quote Expiry (hours)</Label>
                <div className="space-y-2">
                  <Slider
                    value={[expiryHours]}
                    onValueChange={([value]) => setExpiryHours(value)}
                    max={168}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-600">
                    {expiryHours} hours ({Math.round(expiryHours / 24 * 10) / 10} days)
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional terms, conditions, or notes"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Margin Guard */}
          {marginBreakdown && (
            <Card className={`p-4 border-2 ${
              marginStatus.status === 'danger' ? 'border-red-200 bg-slate-800' :
              marginStatus.status === 'warning' ? 'border-yellow-200 bg-slate-800' :
              'border-green-200 bg-slate-800'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                {MarginIcon && <MarginIcon className={`w-5 h-5 text-${marginStatus.color}-600`} />}
                <h3 className={`font-semibold text-${marginStatus.color}-800`}>
                  Margin Guard
                </h3>
                <Badge variant="outline" className={`text-${marginStatus.color}-600`}>
                  {marginStatus.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total: </span>
                  <span className="font-medium">£{(marginBreakdown.total / 100).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Platform Fee (7%): </span>
                  <span className="font-medium">£{(marginBreakdown.platformFee / 100).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Net to Operator: </span>
                  <span className="font-medium">£{(marginBreakdown.netToOperator / 100).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Margin: </span>
                  <span className={`font-medium ${
                    marginStatus.status === 'danger' ? 'text-red-600' :
                    marginStatus.status === 'warning' ? 'text-yellow-600' :
                    'text-white'
                  }`}>
                    £{(marginBreakdown.margin / 100).toLocaleString()}
                  </span>
                </div>
              </div>
              
              {marginStatus.status === 'danger' && (
                <div className="mt-2 text-sm text-red-700">
                  ⚠️ Low margin detected. Consider adjusting pricing or reducing costs.
                </div>
              )}
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button variant="outline">Save Draft</Button>
            <Button onClick={submitQuote} disabled={!marginBreakdown || marginBreakdown.total === 0}>
              <Zap className="w-4 h-4 mr-2" />
              Submit Quote
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
