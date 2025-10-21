import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plane, 
  Target, 
  Star, 
  GitCompare, 
  FileText, 
  CheckCircle, 
  X,
  Clock,
  DollarSign
} from 'lucide-react';

interface Quote {
  id: string;
  operator: string;
  price: number;
  currency: string;
  validUntil: string;
  aircraft: string;
  verified: boolean;
  rating: number;
  responseTime: number;
  dealScore: number;
  fees: {
    basePrice: number;
    fuelSurcharge: number;
    handling: number;
    catering: number;
    total: number;
  };
}

interface RFQ {
  id: string;
  route: string;
  aircraft: string;
  date: string;
  price: number;
  currency: string;
  status: 'draft' | 'sent' | 'quoted' | 'accepted' | 'paid';
  quotes: Quote[];
  legs: number;
  passengers: number;
  specialRequirements: string;
}

interface RFQCardProps {
  rfq: RFQ;
  onAcceptQuote: (quoteId: string) => void;
  onRejectQuote: (quoteId: string, reason?: string) => void;
}

export function RFQCard({ rfq, onAcceptQuote, onRejectQuote }: RFQCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'accepted':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'quoted':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'sent':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'draft':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="terminal-card hover:terminal-glow animate-fade-in-up">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Plane className="w-5 h-5" />
              {rfq.route}
            </CardTitle>
            <p className="text-gunmetal">
              {rfq.aircraft} • {formatTime(rfq.date)} • {rfq.legs} leg(s) • {rfq.passengers} pax
            </p>
            {rfq.specialRequirements && (
              <p className="text-sm text-accent mt-1">📋 {rfq.specialRequirements}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(rfq.status)}>
              {rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
            </Badge>
            <Button size="sm" variant="outline" title="Compare quotes">
              <GitCompare className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {rfq.quotes.length > 0 ? (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Target className="w-4 h-4" />
              Quotes Received ({rfq.quotes.length})
            </h4>
            {rfq.quotes.map(quote => (
              <div key={quote.id} className="p-4 bg-terminal-card/50 rounded-lg border border-terminal-border hover:bg-terminal-card/70 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-foreground">{quote.operator}</p>
                      <p className="text-sm text-gunmetal">{quote.aircraft}</p>
                      <div className="flex items-center gap-2 text-xs text-gunmetal mt-1">
                        <Clock className="w-3 h-3" />
                        <span>Response: {quote.responseTime}m</span>
                        <span>•</span>
                        <span>Score: {quote.dealScore}/100</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{quote.rating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-accent">
                      {formatCurrency(quote.price, quote.currency)}
                    </p>
                    <p className="text-xs text-gunmetal">Valid until {formatTime(quote.validUntil)}</p>
                    {quote.verified && (
                      <Badge className="bg-green-500/20 text-green-400 text-xs mt-1">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Quote Actions */}
                <div className="flex gap-2 pt-3 border-t border-terminal-border">
                  <Button 
                    size="sm" 
                    className="btn-terminal-accent flex-1"
                    onClick={() => onAcceptQuote(quote.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept Quote
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="btn-terminal-secondary flex-1"
                    onClick={() => onRejectQuote(quote.id, 'Not suitable for this trip')}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>

                {/* Fee Breakdown */}
                <div className="mt-3 p-3 bg-terminal-card/30 rounded-lg">
                  <h5 className="text-xs font-semibold text-gunmetal mb-2">Fee Breakdown</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gunmetal">Base Price:</span>
                      <span className="text-foreground">{formatCurrency(quote.fees.basePrice, quote.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gunmetal">Fuel Surcharge:</span>
                      <span className="text-foreground">{formatCurrency(quote.fees.fuelSurcharge, quote.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gunmetal">Handling:</span>
                      <span className="text-foreground">{formatCurrency(quote.fees.handling, quote.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gunmetal">Catering:</span>
                      <span className="text-foreground">{formatCurrency(quote.fees.catering, quote.currency)}</span>
                    </div>
                    <div className="flex justify-between font-semibold col-span-2 pt-1 border-t border-terminal-border">
                      <span className="text-foreground">Total:</span>
                      <span className="text-accent">{formatCurrency(quote.fees.total, quote.currency)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gunmetal">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No quotes received yet</p>
            <p className="text-sm mt-2">Operators are reviewing your request</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
