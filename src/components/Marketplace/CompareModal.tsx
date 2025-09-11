// ============================================================================
// src/components/Marketplace/CompareModal.tsx
// ============================================================================

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Star, 
  CheckCircle, 
  AlertTriangle,
  DollarSign,
  Calendar,
  Plane,
  Users,
  MapPin
} from 'lucide-react';
import { Listing, money, pricePerNm, dealScore, scoreLabel, computeFees } from '@/lib/marketplace';

interface CompareModalProps {
  listings: Listing[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (listing: Listing) => void;
}

export default function CompareModal({ 
  listings, 
  isOpen, 
  onClose, 
  onRemove 
}: CompareModalProps) {
  if (!isOpen || listings.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Compare Aircraft ({listings.length})
            </CardTitle>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-auto">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Operator</th>
                  <th className="text-left p-3 font-semibold">Aircraft</th>
                  <th className="text-left p-3 font-semibold">Route</th>
                  <th className="text-left p-3 font-semibold">Date</th>
                  <th className="text-left p-3 font-semibold">Seats</th>
                  <th className="text-left p-3 font-semibold">Price</th>
                  <th className="text-left p-3 font-semibold">Price/NM</th>
                  <th className="text-left p-3 font-semibold">Platform Fee</th>
                  <th className="text-left p-3 font-semibold">Net to Operator</th>
                  <th className="text-left p-3 font-semibold">Deal Score</th>
                  <th className="text-left p-3 font-semibold">Rating</th>
                  <th className="text-left p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => {
                  const score = dealScore(listing);
                  const scoreInfo = scoreLabel(score);
                  const ppm = pricePerNm(listing.priceMinor, listing.distanceNm);
                  const fees = computeFees(listing.priceMinor);

                  return (
                    <tr key={listing.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {listing.operatorVerified ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          )}
                          <span className="font-medium">{listing.operator}</span>
                        </div>
                        <div className="flex gap-1 mt-1">
                          {listing.emptyLeg && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              Empty Leg
                            </Badge>
                          )}
                          {listing.operatorVerified && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Plane className="w-4 h-4 text-gunmetal" />
                          <span>{listing.aircraft}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gunmetal" />
                          <span>{listing.from} → {listing.to}</span>
                        </div>
                        <div className="text-sm text-gunmetal">
                          {listing.distanceNm.toLocaleString()} nm
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gunmetal" />
                          <span className="font-mono text-sm">
                            {new Date(listing.date).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gunmetal" />
                          <span>{listing.seats}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-mono font-semibold">
                          {money(listing.priceMinor, listing.currency)}
                        </div>
                        <div className="text-sm text-gunmetal">
                          {listing.currency}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-mono text-sm">
                          {ppm ? money(ppm, listing.currency) : 'N/A'}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-mono text-sm text-red-600">
                          -{money(fees.platformFeeMinor, listing.currency)}
                        </div>
                        <div className="text-xs text-gunmetal">7%</div>
                      </td>
                      <td className="p-3">
                        <div className="font-mono text-sm text-green-600">
                          {money(fees.toOperatorMinor, listing.currency)}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={`${scoreInfo.tone} bg-opacity-20`}>
                          {scoreInfo.label} ({score})
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-mono text-sm">{listing.rating}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Button
                          onClick={() => onRemove(listing)}
                          variant="outline"
                          size="sm"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">Comparison Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gunmetal">Best Deal Score:</span>
                <div className="font-semibold">
                  {Math.max(...listings.map(l => dealScore(l)))}
                </div>
              </div>
              <div>
                <span className="text-gunmetal">Lowest Price:</span>
                <div className="font-semibold">
                  {money(Math.min(...listings.map(l => l.priceMinor)), listings[0]?.currency || 'USD')}
                </div>
              </div>
              <div>
                <span className="text-gunmetal">Verified Operators:</span>
                <div className="font-semibold">
                  {listings.filter(l => l.operatorVerified).length} / {listings.length}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
