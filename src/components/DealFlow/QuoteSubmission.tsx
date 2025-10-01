// Quote Submission Tool - For operators to respond to RFQs
// Includes price calculator and aircraft selection

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plane, 
  DollarSign, 
  Calculator, 
  Send, 
  AlertCircle,
  CheckCircle,
  Fuel,
  Users,
  MapPin,
  Clock
} from 'lucide-react';

export interface RFQDetails {
  id: string;
  route: string;
  origin: string;
  destination: string;
  departureDate: string;
  passengers: number;
  luggage: number;
  specialRequirements?: string;
  catering?: string;
}

export interface Aircraft {
  id: string;
  tailNumber: string;
  model: string;
  category: string;
  seats: number;
  rangeNm: number;
  hourlyRate: number;
  status: 'available' | 'in_use' | 'maintenance';
}

interface QuoteSubmissionProps {
  rfq: RFQDetails;
  availableAircraft: Aircraft[];
  onSubmitQuote: (quote: QuoteData) => Promise<void>;
  onCancel?: () => void;
}

export interface QuoteData {
  rfqId: string;
  aircraftId: string;
  basePrice: number;
  fuelSurcharge: number;
  handling: number;
  catering: number;
  landingFees: number;
  crewCosts: number;
  total: number;
  currency: string;
  notes: string;
  validHours: number;
}

export function QuoteSubmission({ rfq, availableAircraft, onSubmitQuote, onCancel }: QuoteSubmissionProps) {
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Pricing inputs
  const [basePrice, setBasePrice] = useState(0);
  const [fuelSurcharge, setFuelSurcharge] = useState(0);
  const [handling, setHandling] = useState(500);
  const [catering, setCatering] = useState(0);
  const [landingFees, setLandingFees] = useState(0);
  const [crewCosts, setCrewCosts] = useState(0);
  const [notes, setNotes] = useState('');
  const [validHours, setValidHours] = useState(24);
  const [profitMargin, setProfitMargin] = useState(15); // percentage

  // Auto-calculate when aircraft changes
  useEffect(() => {
    if (selectedAircraft) {
      calculatePricing();
    }
  }, [selectedAircraft, profitMargin]);

  const calculatePricing = () => {
    if (!selectedAircraft) return;

    setIsCalculating(true);

    // Calculate distance (simplified - in reality would use actual route)
    const distance = 1000; // nm - placeholder
    const flightTime = distance / 450; // hours at average speed

    // Base price calculation
    const calculatedBasePrice = selectedAircraft.hourlyRate * flightTime * (1 + profitMargin / 100);
    setBasePrice(Math.round(calculatedBasePrice));

    // Fuel surcharge (approximately 30% of base)
    const calculatedFuel = Math.round(calculatedBasePrice * 0.30);
    setFuelSurcharge(calculatedFuel);

    // Catering estimate
    const cateringEstimate = rfq.passengers * 100; // $100 per passenger
    setCatering(cateringEstimate);

    // Landing fees (varies by airport)
    const landingEstimate = 1500; // placeholder
    setLandingFees(landingEstimate);

    // Crew costs (captain + first officer)
    const crewEstimate = flightTime * 150 * 2; // $150/hour per crew member
    setCrewCosts(Math.round(crewEstimate));

    setTimeout(() => setIsCalculating(false), 500);
  };

  const totalPrice = basePrice + fuelSurcharge + handling + catering + landingFees + crewCosts;

  const handleSubmit = async () => {
    if (!selectedAircraft) {
      alert('Please select an aircraft');
      return;
    }

    setIsSubmitting(true);

    const quoteData: QuoteData = {
      rfqId: rfq.id,
      aircraftId: selectedAircraft.id,
      basePrice,
      fuelSurcharge,
      handling,
      catering,
      landingFees,
      crewCosts,
      total: totalPrice,
      currency: 'USD',
      notes,
      validHours,
    };

    try {
      await onSubmitQuote(quoteData);
    } catch (error) {
      console.error('Failed to submit quote:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* RFQ Details Summary */}
      <Card className="bg-terminal-card/50 border-terminal-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <MapPin className="w-5 h-5 text-accent" />
            RFQ Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Route</div>
              <div className="font-semibold text-foreground">{rfq.route}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Date</div>
              <div className="font-semibold text-foreground">
                {new Date(rfq.departureDate).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Passengers</div>
              <div className="font-semibold text-foreground">{rfq.passengers}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Luggage</div>
              <div className="font-semibold text-foreground">{rfq.luggage} pieces</div>
            </div>
          </div>
          {rfq.specialRequirements && (
            <div className="mt-4 p-3 bg-terminal-bg/30 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Special Requirements:</div>
              <div className="text-sm text-foreground">{rfq.specialRequirements}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Aircraft Selection */}
      <Card className="bg-terminal-card/50 border-terminal-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Plane className="w-5 h-5 text-accent" />
            Select Aircraft
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableAircraft.filter(a => a.status === 'available' && a.seats >= rfq.passengers).map((aircraft) => (
              <div
                key={aircraft.id}
                onClick={() => setSelectedAircraft(aircraft)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedAircraft?.id === aircraft.id
                    ? 'bg-accent/20 border-accent'
                    : 'bg-terminal-bg/30 border-terminal-border hover:border-accent/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-foreground">{aircraft.model}</div>
                    <div className="text-sm text-muted-foreground">{aircraft.tailNumber}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {aircraft.seats} seats • {aircraft.rangeNm} nm range
                    </div>
                  </div>
                  {selectedAircraft?.id === aircraft.id && (
                    <CheckCircle className="w-5 h-5 text-accent" />
                  )}
                </div>
                <div className="mt-3 text-sm text-accent font-semibold">
                  ${aircraft.hourlyRate}/hour
                </div>
              </div>
            ))}
          </div>

          {availableAircraft.filter(a => a.status === 'available' && a.seats >= rfq.passengers).length === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No suitable aircraft available for this RFQ</p>
              <p className="text-sm text-muted-foreground mt-2">
                Required: {rfq.passengers}+ seats
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Price Calculator */}
      {selectedAircraft && (
        <Card className="bg-terminal-card/50 border-terminal-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Calculator className="w-5 h-5 text-accent" />
              Price Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profit Margin Slider */}
            <div>
              <Label className="text-foreground">Profit Margin: {profitMargin}%</Label>
              <input
                type="range"
                min="0"
                max="50"
                value={profitMargin}
                onChange={(e) => setProfitMargin(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-terminal-bg/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-accent" />
                  <span className="text-sm text-foreground">Base Price (Aircraft + Margin)</span>
                </div>
                <Input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-32 text-right bg-terminal-bg border-terminal-border text-foreground"
                />
              </div>

              <div className="flex justify-between items-center p-3 bg-terminal-bg/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-accent" />
                  <span className="text-sm text-foreground">Fuel Surcharge</span>
                </div>
                <Input
                  type="number"
                  value={fuelSurcharge}
                  onChange={(e) => setFuelSurcharge(Number(e.target.value))}
                  className="w-32 text-right bg-terminal-bg border-terminal-border text-foreground"
                />
              </div>

              <div className="flex justify-between items-center p-3 bg-terminal-bg/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-sm text-foreground">Handling Fees</span>
                </div>
                <Input
                  type="number"
                  value={handling}
                  onChange={(e) => setHandling(Number(e.target.value))}
                  className="w-32 text-right bg-terminal-bg border-terminal-border text-foreground"
                />
              </div>

              <div className="flex justify-between items-center p-3 bg-terminal-bg/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent" />
                  <span className="text-sm text-foreground">Catering</span>
                </div>
                <Input
                  type="number"
                  value={catering}
                  onChange={(e) => setCatering(Number(e.target.value))}
                  className="w-32 text-right bg-terminal-bg border-terminal-border text-foreground"
                />
              </div>

              <div className="flex justify-between items-center p-3 bg-terminal-bg/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-accent" />
                  <span className="text-sm text-foreground">Landing Fees</span>
                </div>
                <Input
                  type="number"
                  value={landingFees}
                  onChange={(e) => setLandingFees(Number(e.target.value))}
                  className="w-32 text-right bg-terminal-bg border-terminal-border text-foreground"
                />
              </div>

              <div className="flex justify-between items-center p-3 bg-terminal-bg/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent" />
                  <span className="text-sm text-foreground">Crew Costs</span>
                </div>
                <Input
                  type="number"
                  value={crewCosts}
                  onChange={(e) => setCrewCosts(Number(e.target.value))}
                  className="w-32 text-right bg-terminal-bg border-terminal-border text-foreground"
                />
              </div>
            </div>

            {/* Total */}
            <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-accent" />
                  <span className="text-lg font-semibold text-foreground">Total Quote</span>
                </div>
                <div className="text-3xl font-bold text-accent">
                  ${totalPrice.toLocaleString()}
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground text-right">
                USD • Valid for {validHours} hours
              </div>
            </div>

            {/* Quote Validity */}
            <div>
              <Label className="text-foreground">Quote Valid For (hours)</Label>
              <Select value={validHours.toString()} onValueChange={(value) => setValidHours(Number(value))}>
                <SelectTrigger className="mt-2 bg-terminal-bg border-terminal-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-terminal-card border-terminal-border">
                  <SelectItem value="12">12 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="48">48 hours</SelectItem>
                  <SelectItem value="72">72 hours</SelectItem>
                  <SelectItem value="168">7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Additional Notes */}
            <div>
              <Label className="text-foreground">Additional Notes (Optional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any special conditions, included amenities, or important information..."
                className="mt-2 bg-terminal-bg border-terminal-border text-foreground"
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-terminal-border">
              {onCancel && (
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 border-terminal-border text-foreground"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={handleSubmit}
                disabled={!selectedAircraft || isSubmitting || isCalculating}
                className="flex-1 bg-accent hover:bg-accent/80 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Quote
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Tips */}
      <Card className="bg-terminal-bg/20 border-terminal-border">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <div className="font-semibold text-foreground mb-2">Pricing Tips:</div>
              <ul className="space-y-1 list-disc list-inside">
                <li>Include all costs to avoid surprises</li>
                <li>Competitive pricing increases acceptance rate</li>
                <li>Fast response times earn bonus points</li>
                <li>Verified operators get 20% more visibility</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

