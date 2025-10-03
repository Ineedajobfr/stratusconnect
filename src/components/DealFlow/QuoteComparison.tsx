// Quote Comparison Tool - Side-by-side analysis for brokers
// Helps brokers compare multiple quotes for the same RFQ

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    AlertCircle,
    ArrowUpDown,
    Check,
    Clock,
    DollarSign,
    Plane,
    Shield,
    Star,
    TrendingDown,
    TrendingUp,
    X
} from 'lucide-react';
import { useState } from 'react';

export interface ComparisonQuote {
  id: string;
  operatorName: string;
  operatorRating: number;
  aircraft: string;
  aircraftCategory: string;
  price: number;
  currency: string;
  responseTime: number; // in minutes
  validUntil: string;
  verified: boolean;
  dealScore: number;
  fees: {
    basePrice: number;
    fuelSurcharge: number;
    handling: number;
    catering: number;
    landingFees: number;
    crewCosts: number;
    total: number;
  };
  features: string[];
  notes?: string;
  availability: 'immediate' | 'within_24h' | 'within_48h';
}

interface QuoteComparisonProps {
  quotes: ComparisonQuote[];
  onSelectQuote: (quoteId: string) => void;
  onRejectQuote: (quoteId: string) => void;
}

export function QuoteComparison({ quotes, onSelectQuote, onRejectQuote }: QuoteComparisonProps) {
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'responseTime' | 'dealScore'>('dealScore');
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);

  // Sort quotes based on selected criteria
  const sortedQuotes = [...quotes].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.fees.total - b.fees.total;
      case 'rating':
        return b.operatorRating - a.operatorRating;
      case 'responseTime':
        return a.responseTime - b.responseTime;
      case 'dealScore':
        return b.dealScore - a.dealScore;
      default:
        return 0;
    }
  });

  // Find best/worst values for highlighting
  const lowestPrice = Math.min(...quotes.map(q => q.fees.total));
  const highestRating = Math.max(...quotes.map(q => q.operatorRating));
  const fastestResponse = Math.min(...quotes.map(q => q.responseTime));
  const bestScore = Math.max(...quotes.map(q => q.dealScore));

  const toggleQuoteSelection = (quoteId: string) => {
    setSelectedQuotes(prev =>
      prev.includes(quoteId)
        ? prev.filter(id => id !== quoteId)
        : [...prev, quoteId]
    );
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (score >= 75) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (score >= 60) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'immediate':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Immediate</Badge>;
      case 'within_24h':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">24 Hours</Badge>;
      case 'within_48h':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">48 Hours</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <Card className="bg-terminal-card/50 border-terminal-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <ArrowUpDown className="w-5 h-5 text-accent" />
              Quote Comparison ({quotes.length} quotes)
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-[180px] bg-terminal-bg border-terminal-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-terminal-card border-terminal-border">
                    <SelectItem value="dealScore">Deal Score</SelectItem>
                    <SelectItem value="price">Price (Low to High)</SelectItem>
                    <SelectItem value="rating">Operator Rating</SelectItem>
                    <SelectItem value="responseTime">Response Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedQuotes.length > 0 && (
                <Badge variant="outline" className="text-accent border-accent/30">
                  {selectedQuotes.length} selected
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedQuotes.map((quote) => (
          <Card 
            key={quote.id}
            className={`bg-terminal-card/50 border-terminal-border transition-all duration-300 ${
              selectedQuotes.includes(quote.id) 
                ? 'ring-2 ring-accent shadow-lg shadow-accent/20' 
                : 'hover:border-accent/50'
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-foreground flex items-center gap-2">
                    {quote.operatorName}
                    {quote.verified && (
                      <Shield className="w-4 h-4 text-green-400" title="Verified Operator" />
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(quote.operatorRating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">({quote.operatorRating.toFixed(1)})</span>
                  </div>
                </div>
                <Badge className={getScoreBadgeColor(quote.dealScore)}>
                  Score: {quote.dealScore}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Price Highlight */}
              <div className="p-4 bg-terminal-bg/50 rounded-lg border border-terminal-border">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Price</div>
                    <div className="text-3xl font-bold text-foreground">
                      {quote.currency} {quote.fees.total.toLocaleString()}
                    </div>
                  </div>
                  {quote.fees.total === lowestPrice && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      Lowest
                    </Badge>
                  )}
                </div>
              </div>

              {/* Aircraft Info */}
              <div className="flex items-center gap-3 p-3 bg-terminal-bg/30 rounded-lg">
                <Plane className="w-5 h-5 text-accent" />
                <div>
                  <div className="font-semibold text-foreground">{quote.aircraft}</div>
                  <div className="text-sm text-muted-foreground">{quote.aircraftCategory}</div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-terminal-bg/30 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock className="w-4 h-4" />
                    Response Time
                  </div>
                  <div className={`font-semibold ${quote.responseTime === fastestResponse ? 'text-green-400' : 'text-foreground'}`}>
                    {quote.responseTime} min
                    {quote.responseTime === fastestResponse && ' ⚡'}
                  </div>
                </div>

                <div className="p-3 bg-terminal-bg/30 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <AlertCircle className="w-4 h-4" />
                    Availability
                  </div>
                  <div className="font-semibold text-foreground">
                    {getAvailabilityBadge(quote.availability)}
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-foreground">Price Breakdown:</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Base Price:</span>
                    <span className="font-mono">{quote.currency} {quote.fees.basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Fuel Surcharge:</span>
                    <span className="font-mono">{quote.currency} {quote.fees.fuelSurcharge.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Handling:</span>
                    <span className="font-mono">{quote.currency} {quote.fees.handling.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Catering:</span>
                    <span className="font-mono">{quote.currency} {quote.fees.catering.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Landing Fees:</span>
                    <span className="font-mono">{quote.currency} {quote.fees.landingFees.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Crew Costs:</span>
                    <span className="font-mono">{quote.currency} {quote.fees.crewCosts.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-foreground pt-2 border-t border-terminal-border">
                    <span>Total:</span>
                    <span className="font-mono">{quote.currency} {quote.fees.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              {quote.features.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-foreground">Included Features:</div>
                  <div className="space-y-1">
                    {quote.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-400" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {quote.notes && (
                <div className="p-3 bg-terminal-bg/30 rounded-lg">
                  <div className="text-sm text-muted-foreground">{quote.notes}</div>
                </div>
              )}

              {/* Valid Until */}
              <div className="text-xs text-muted-foreground text-center">
                Valid until: {new Date(quote.validUntil).toLocaleString()}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-terminal-border">
                <Button
                  variant="outline"
                  onClick={() => toggleQuoteSelection(quote.id)}
                  className={selectedQuotes.includes(quote.id) ? 'bg-accent/20 border-accent' : ''}
                >
                  {selectedQuotes.includes(quote.id) ? 'Selected' : 'Compare'}
                </Button>
                <Button
                  onClick={() => onSelectQuote(quote.id)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Accept
                </Button>
              </div>
              
              <Button
                variant="ghost"
                onClick={() => onRejectQuote(quote.id)}
                className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <X className="w-4 h-4 mr-2" />
                Reject Quote
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Summary */}
      {selectedQuotes.length >= 2 && (
        <Card className="bg-terminal-card/50 border-accent/50">
          <CardHeader>
            <CardTitle className="text-foreground">Side-by-Side Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-terminal-border">
                    <th className="text-left p-3 text-sm text-muted-foreground">Criteria</th>
                    {selectedQuotes.map(quoteId => {
                      const quote = quotes.find(q => q.id === quoteId);
                      return (
                        <th key={quoteId} className="text-center p-3 text-sm text-foreground">
                          {quote?.operatorName}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-terminal-border/50">
                    <td className="p-3 text-sm text-muted-foreground">Total Price</td>
                    {selectedQuotes.map(quoteId => {
                      const quote = quotes.find(q => q.id === quoteId);
                      return (
                        <td key={quoteId} className="text-center p-3">
                          <div className={`font-semibold ${quote?.fees.total === lowestPrice ? 'text-green-400' : 'text-foreground'}`}>
                            {quote?.currency} {quote?.fees.total.toLocaleString()}
                            {quote?.fees.total === lowestPrice && ' 🏆'}
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  <tr className="border-b border-terminal-border/50">
                    <td className="p-3 text-sm text-muted-foreground">Aircraft</td>
                    {selectedQuotes.map(quoteId => {
                      const quote = quotes.find(q => q.id === quoteId);
                      return (
                        <td key={quoteId} className="text-center p-3 text-foreground">
                          {quote?.aircraft}
                        </td>
                      );
                    })}
                  </tr>

                  <tr className="border-b border-terminal-border/50">
                    <td className="p-3 text-sm text-muted-foreground">Operator Rating</td>
                    {selectedQuotes.map(quoteId => {
                      const quote = quotes.find(q => q.id === quoteId);
                      return (
                        <td key={quoteId} className="text-center p-3">
                          <div className="flex items-center justify-center gap-1">
                            <Star className={`w-4 h-4 ${quote?.operatorRating === highestRating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                            <span className={quote?.operatorRating === highestRating ? 'text-yellow-400 font-semibold' : 'text-foreground'}>
                              {quote?.operatorRating.toFixed(1)}
                              {quote?.operatorRating === highestRating && ' 🏆'}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  <tr className="border-b border-terminal-border/50">
                    <td className="p-3 text-sm text-muted-foreground">Response Time</td>
                    {selectedQuotes.map(quoteId => {
                      const quote = quotes.find(q => q.id === quoteId);
                      return (
                        <td key={quoteId} className="text-center p-3">
                          <span className={quote?.responseTime === fastestResponse ? 'text-green-400 font-semibold' : 'text-foreground'}>
                            {quote?.responseTime} min
                            {quote?.responseTime === fastestResponse && ' ⚡'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  <tr className="border-b border-terminal-border/50">
                    <td className="p-3 text-sm text-muted-foreground">Deal Score</td>
                    {selectedQuotes.map(quoteId => {
                      const quote = quotes.find(q => q.id === quoteId);
                      return (
                        <td key={quoteId} className="text-center p-3">
                          <Badge className={quote ? getScoreBadgeColor(quote.dealScore) : ''}>
                            {quote?.dealScore}
                            {quote?.dealScore === bestScore && ' 🏆'}
                          </Badge>
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <td className="p-3 text-sm text-muted-foreground">Availability</td>
                    {selectedQuotes.map(quoteId => {
                      const quote = quotes.find(q => q.id === quoteId);
                      return (
                        <td key={quoteId} className="text-center p-3">
                          {quote && getAvailabilityBadge(quote.availability)}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Recommendation */}
            <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground mb-1">Recommendation</div>
                  <div className="text-sm text-muted-foreground">
                    Based on price, rating, and response time, <span className="text-accent font-semibold">{sortedQuotes[0]?.operatorName}</span> offers the best overall value.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Quotes Message */}
      {quotes.length === 0 && (
        <Card className="bg-terminal-card/50 border-terminal-border">
          <CardContent className="text-center py-12">
            <DollarSign className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Quotes Yet</h3>
            <p className="text-muted-foreground">Quotes from operators will appear here for comparison</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}





