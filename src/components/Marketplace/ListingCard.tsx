// ============================================================================
// src/components/Marketplace/ListingCard.tsx
// ============================================================================

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  DollarSign, 
  Calendar, 
  Plane, 
  Users, 
  MapPin,
  Fuel,
  CheckCircle,
  AlertTriangle,
  GitCompare,
  Save,
  Eye,
  Shield,
  Zap,
  Clock,
  TrendingUp,
  Award,
  Leaf,
  Target,
  Timer
} from 'lucide-react';
import { Listing, money, pricePerNm, dealScore, scoreLabel, estimateCO2Tonnes, computeFees } from '@/lib/marketplace';

interface ListingCardProps {
  listing: Listing;
  onCompare: (listing: Listing) => void;
  onSave: (listing: Listing) => void;
  onView: (listing: Listing) => void;
  onBook: (listing: Listing) => void;
  canCompare: boolean;
  canSave: boolean;
  isDemoMode: boolean;
}

export default function ListingCard({
  listing,
  onCompare,
  onSave,
  onView,
  onBook,
  canCompare,
  canSave,
  isDemoMode
}: ListingCardProps) {
  const score = dealScore(listing);
  const scoreInfo = scoreLabel(score);
  const ppm = pricePerNm(listing.priceMinor, listing.distanceNm);
  const co2 = estimateCO2Tonnes(listing.distanceNm, listing.seats);
  const fees = computeFees(listing.priceMinor);

  return (
    <Card className="terminal-card hover:terminal-glow transition-all">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 mb-2">
              {listing.operatorVerified ? (
                <CheckCircle className="w-5 h-5 text-white" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              )}
              <span className="text-foreground">{listing.operator}</span>
              <span className="text-gunmetal">•</span>
              <span className="text-gunmetal">{listing.aircraft}</span>
            </CardTitle>
            
            <div className="flex items-center gap-2 text-gunmetal mb-2">
              <MapPin className="w-4 h-4" />
              <span>{listing.from} → {listing.to}</span>
              <span className="text-sm">({listing.distanceNm} nm)</span>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Badge className={`${scoreInfo.tone} bg-opacity-20`}>
                {scoreInfo.label} ({score})
              </Badge>
              {listing.emptyLeg && (
                <Badge className="bg-blue-900/20 text-blue-400 border-blue-500/30">
                  Empty Leg
                  {listing.discountPct && ` -${listing.discountPct}%`}
                </Badge>
              )}
              {listing.operatorVerified && (
                <Badge className="bg-green-900/20 text-green-400 border-green-500/30">
                  Verified
                </Badge>
              )}
              {listing.safetyRating && listing.safetyRating !== 'Not Rated' && (
                <Badge className="bg-purple-100 text-purple-800">
                  <Award className="w-3 h-3 mr-1" />
                  {listing.safetyRating}
                </Badge>
              )}
              {listing.wyvernStatus && listing.wyvernStatus !== 'Not Certified' && (
                <Badge className="bg-indigo-100 text-indigo-800">
                  <Shield className="w-3 h-3 mr-1" />
                  {listing.wyvernStatus}
                </Badge>
              )}
              {listing.instantQuote && (
                <Badge className="bg-yellow-900/20 text-yellow-400 border-yellow-500/30">
                  <Zap className="w-3 h-3 mr-1" />
                  Instant Quote
                </Badge>
              )}
              {listing.autoMatch && (
                <Badge className="bg-orange-100 text-orange-800">
                  <Target className="w-3 h-3 mr-1" />
                  Auto-Match
                </Badge>
              )}
              {listing.tags?.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-foreground">
              {money(listing.priceMinor, listing.currency)}
            </div>
            <div className="text-gunmetal text-sm">
              {listing.seats} seats • {listing.currency}
            </div>
            {ppm && (
              <div className="text-gunmetal text-sm">
                {money(ppm, listing.currency)}/nm
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Flight Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <div className="text-sm font-medium text-gunmetal">Date</div>
            <div className="text-foreground font-mono text-sm">
              {new Date(listing.date).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gunmetal">Rating</div>
            <div className="text-foreground flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              {listing.rating}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gunmetal">CO2 Est.</div>
            <div className="text-foreground text-sm flex items-center gap-1">
              <Leaf className="w-3 h-3 text-white" />
              {listing.carbonPerPax ? `${listing.carbonPerPax} t/pax` : `${co2} t/pax`}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gunmetal">Distance</div>
            <div className="text-foreground text-sm">
              {listing.distanceNm.toLocaleString()} nm
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        {(listing.p50Response || listing.completionRate) && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {listing.p50Response && (
              <div>
                <div className="text-sm font-medium text-gunmetal flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Response Time
                </div>
                <div className="text-foreground text-sm">
                  {listing.p50Response} min avg
                </div>
              </div>
            )}
            {listing.completionRate && (
              <div>
                <div className="text-sm font-medium text-gunmetal flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Completion Rate
                </div>
                <div className="text-foreground text-sm">
                  {listing.completionRate}%
                </div>
              </div>
            )}
            {listing.instantQuote && (
              <div>
                <div className="text-sm font-medium text-gunmetal flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  Quote Speed
                </div>
                <div className="text-foreground text-sm text-white">
                  Instant
                </div>
              </div>
            )}
            {listing.autoMatch && (
              <div>
                <div className="text-sm font-medium text-gunmetal flex items-center gap-1">
                  <Target className="w-3 h-3 text-orange-500" />
                  Auto-Match
                </div>
                <div className="text-foreground text-sm text-white">
                  Enabled
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fee Breakdown */}
        <div className="bg-slate-800 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-white" />
            <span className="font-semibold text-foreground">FCA Compliant Fee Structure</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gunmetal">Total Price:</span>
              <div className="font-mono font-semibold">
                {money(listing.priceMinor, listing.currency)}
              </div>
            </div>
            <div>
              <span className="text-gunmetal">Platform Fee (7%):</span>
              <div className="font-mono font-semibold text-red-600">
                -{money(fees.platformFeeMinor, listing.currency)}
              </div>
            </div>
            <div>
              <span className="text-gunmetal">Net to Operator:</span>
              <div className="font-mono font-semibold text-white">
                {money(fees.toOperatorMinor, listing.currency)}
              </div>
            </div>
            <div>
              <span className="text-gunmetal">Price/NM:</span>
              <div className="font-mono font-semibold">
                {ppm ? money(ppm, listing.currency) : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => onCompare(listing)}
            variant="outline"
            size="sm"
            disabled={!canCompare}
          >
            <GitCompare className="w-4 h-4 mr-2" />
            Compare
          </Button>
          
          <Button
            onClick={() => onSave(listing)}
            variant="outline"
            size="sm"
            disabled={!canSave}
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          
          <Button
            onClick={() => onView(listing)}
            variant="outline"
            size="sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          
          <Button
            onClick={() => onBook(listing)}
            size="sm"
            className="btn-terminal-accent"
            disabled={!listing.operatorVerified}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Book Now
          </Button>
        </div>

        {/* Compliance Notice */}
        {isDemoMode && (
          <div className="mt-4 p-3 bg-slate-800 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-yellow-800 text-sm font-medium">Demo Mode</p>
                <p className="text-yellow-700 text-xs">
                  In production, booking would redirect to Stripe Connect for FCA compliant payment processing.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
