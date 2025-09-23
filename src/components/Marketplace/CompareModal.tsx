// ============================================================================
// src/components/Marketplace/CompareModal.tsx
// ============================================================================

import React, { useState, useMemo } from 'react';
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
  MapPin,
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  Shield,
  Zap,
  Target,
  BarChart3,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  Minus,
  Bookmark,
  Eye,
  GitCompare
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
  const [selectedTab, setSelectedTab] = useState<'overview' | 'detailed' | 'analysis'>('overview');
  const [sortBy, setSortBy] = useState<'price' | 'score' | 'rating' | 'date'>('score');

  if (!isOpen || listings.length === 0) return null;

  // Comprehensive analysis calculations
  const analysis = useMemo(() => {
    const scores = listings.map(l => dealScore(l));
    const prices = listings.map(l => l.priceMinor);
    const ratings = listings.map(l => l.rating);
    const distances = listings.map(l => l.distanceNm);
    
    const bestScore = Math.max(...scores);
    const worstScore = Math.min(...scores);
    const lowestPrice = Math.min(...prices);
    const highestPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
    
    const priceRange = highestPrice - lowestPrice;
    const priceVariance = priceRange / avgPrice;
    
    const verifiedCount = listings.filter(l => l.operatorVerified).length;
    const emptyLegCount = listings.filter(l => l.emptyLeg).length;
    
    // Find best value (highest score per dollar)
    const bestValue = listings.reduce((best, current) => {
      const currentValue = dealScore(current) / (current.priceMinor / 1000);
      const bestValue = dealScore(best) / (best.priceMinor / 1000);
      return currentValue > bestValue ? current : best;
    });
    
    // Find most cost-effective (lowest price per nm)
    const mostCostEffective = listings.reduce((best, current) => {
      const currentPpm = pricePerNm(current.priceMinor, current.distanceNm) || 0;
      const bestPpm = pricePerNm(best.priceMinor, best.distanceNm) || 0;
      return currentPpm < bestPpm ? current : best;
    });
    
    return {
      bestScore,
      worstScore,
      lowestPrice,
      highestPrice,
      avgPrice,
      avgRating,
      avgDistance,
      priceRange,
      priceVariance,
      verifiedCount,
      emptyLegCount,
      bestValue,
      mostCostEffective,
      totalListings: listings.length
    };
  }, [listings]);

  // Sort listings based on selected criteria
  const sortedListings = useMemo(() => {
    return [...listings].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.priceMinor - b.priceMinor;
        case 'score':
          return dealScore(b) - dealScore(a);
        case 'rating':
          return b.rating - a.rating;
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        default:
          return 0;
      }
    });
  }, [listings, sortBy]);

  const getPriceComparison = (price: number) => {
    if (price === analysis.lowestPrice) return { icon: <ArrowDown className="w-4 h-4 text-green-400" />, text: "Lowest", color: "text-green-400" };
    if (price === analysis.highestPrice) return { icon: <ArrowUp className="w-4 h-4 text-red-400" />, text: "Highest", color: "text-red-400" };
    return { icon: <Minus className="w-4 h-4 text-gray-400" />, text: "Average", color: "text-gray-400" };
  };

  const getScoreComparison = (score: number) => {
    if (score === analysis.bestScore) return { icon: <TrendingUp className="w-4 h-4 text-green-400" />, text: "Best", color: "text-green-400" };
    if (score === analysis.worstScore) return { icon: <TrendingDown className="w-4 h-4 text-red-400" />, text: "Worst", color: "text-red-400" };
    return { icon: <Minus className="w-4 h-4 text-gray-400" />, text: "Average", color: "text-gray-400" };
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-7xl max-h-[95vh] overflow-hidden bg-surface-1 border-terminal-border shadow-2xl">
        <CardHeader className="bg-surface-2 border-b border-terminal-border">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <CardTitle className="flex items-center gap-3 text-2xl text-bright">
                <GitCompare className="w-6 h-6 text-brand" />
                Compare Aircraft ({listings.length})
              </CardTitle>
              <div className="flex gap-2">
                <Badge className="bg-brand/15 text-brand border-brand/30">
                  <Shield className="w-3 h-3 mr-1" />
                  FCA Compliant
                </Badge>
                <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {analysis.verifiedCount}/{analysis.totalListings} Verified
                </Badge>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="border-terminal-border text-text hover:bg-surface-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex gap-2 mt-4">
            <Button
              variant={selectedTab === 'overview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTab('overview')}
              className={selectedTab === 'overview' ? 'bg-brand text-text' : 'border-terminal-border text-text hover:bg-surface-1'}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={selectedTab === 'detailed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTab('detailed')}
              className={selectedTab === 'detailed' ? 'bg-brand text-text' : 'border-terminal-border text-text hover:bg-surface-1'}
            >
              <Target className="w-4 h-4 mr-2" />
              Detailed
            </Button>
            <Button
              variant={selectedTab === 'analysis' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTab('analysis')}
              className={selectedTab === 'analysis' ? 'bg-brand text-text' : 'border-terminal-border text-text hover:bg-surface-1'}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Analysis
            </Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-auto bg-surface-1">
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="card-predictive">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-text/70">Best Value</p>
                        <p className="font-bold text-bright">{analysis.bestValue.operator}</p>
                        <p className="text-xs text-brand">{money(analysis.bestValue.priceMinor, analysis.bestValue.currency)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-predictive">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Award className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-text/70">Best Score</p>
                        <p className="font-bold text-bright">{analysis.bestScore}</p>
                        <p className="text-xs text-brand">Deal Score</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-predictive">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <Star className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-sm text-text/70">Avg Rating</p>
                        <p className="font-bold text-bright">{analysis.avgRating.toFixed(1)}</p>
                        <p className="text-xs text-brand">Out of 5.0</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-predictive">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Zap className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-text/70">Empty Legs</p>
                        <p className="font-bold text-bright">{analysis.emptyLegCount}</p>
                        <p className="text-xs text-brand">Available</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Comparison Table */}
              <Card className="card-predictive">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-bright">Quick Comparison</CardTitle>
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-surface-2 border-terminal-border text-text rounded-lg px-3 py-1"
                    >
                      <option value="score">Sort by Score</option>
                      <option value="price">Sort by Price</option>
                      <option value="rating">Sort by Rating</option>
                      <option value="date">Sort by Date</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-terminal-border">
                          <th className="text-left p-3 text-text/70 font-medium">Operator</th>
                          <th className="text-left p-3 text-text/70 font-medium">Aircraft</th>
                          <th className="text-left p-3 text-text/70 font-medium">Price</th>
                          <th className="text-left p-3 text-text/70 font-medium">Score</th>
                          <th className="text-left p-3 text-text/70 font-medium">Rating</th>
                          <th className="text-left p-3 text-text/70 font-medium">Status</th>
                          <th className="text-left p-3 text-text/70 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedListings.map((listing, index) => {
                          const score = dealScore(listing);
                          const scoreInfo = scoreLabel(score);
                          const priceComp = getPriceComparison(listing.priceMinor);
                          const scoreComp = getScoreComparison(score);

                          return (
                            <tr key={listing.id} className="border-b border-terminal-border hover:bg-surface-2/50">
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  {listing.operatorVerified ? (
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                  )}
                                  <span className="font-medium text-text">{listing.operator}</span>
                                </div>
                                <div className="flex gap-1 mt-1">
                                  {listing.emptyLeg && (
                                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30 text-xs">
                                      Empty Leg
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <Plane className="w-4 h-4 text-brand" />
                                  <span className="text-text">{listing.aircraft}</span>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  {priceComp.icon}
                                  <div>
                                    <div className="font-bold text-text">{money(listing.priceMinor, listing.currency)}</div>
                                    <div className={`text-xs ${priceComp.color}`}>{priceComp.text}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  {scoreComp.icon}
                                  <Badge className={`${scoreInfo.tone} bg-opacity-20`}>
                                    {score} ({scoreInfo.label})
                                  </Badge>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-400" />
                                  <span className="text-text">{listing.rating}</span>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex gap-1">
                                  {listing.operatorVerified && (
                                    <Badge className="bg-green-500/20 text-green-400 border-green-400/30 text-xs">
                                      Verified
                                    </Badge>
                                  )}
                                  {listing.emptyLeg && (
                                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30 text-xs">
                                      Empty Leg
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => onRemove(listing)}
                                    variant="outline"
                                    size="sm"
                                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-brand/30 text-brand hover:bg-brand/10"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedTab === 'detailed' && (
            <div className="space-y-6">
              {/* Detailed Comparison Table */}
              <Card className="card-predictive">
                <CardHeader>
                  <CardTitle className="text-bright">Detailed Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-terminal-border">
                          <th className="text-left p-3 text-text/70 font-medium">Operator</th>
                          <th className="text-left p-3 text-text/70 font-medium">Aircraft</th>
                          <th className="text-left p-3 text-text/70 font-medium">Route</th>
                          <th className="text-left p-3 text-text/70 font-medium">Date</th>
                          <th className="text-left p-3 text-text/70 font-medium">Seats</th>
                          <th className="text-left p-3 text-text/70 font-medium">Price</th>
                          <th className="text-left p-3 text-text/70 font-medium">Price/NM</th>
                          <th className="text-left p-3 text-text/70 font-medium">Platform Fee</th>
                          <th className="text-left p-3 text-text/70 font-medium">Net to Operator</th>
                          <th className="text-left p-3 text-text/70 font-medium">Deal Score</th>
                          <th className="text-left p-3 text-text/70 font-medium">Rating</th>
                          <th className="text-left p-3 text-text/70 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedListings.map((listing) => {
                          const score = dealScore(listing);
                          const scoreInfo = scoreLabel(score);
                          const ppm = pricePerNm(listing.priceMinor, listing.distanceNm);
                          const fees = computeFees(listing.priceMinor);

                          return (
                            <tr key={listing.id} className="border-b border-terminal-border hover:bg-surface-2/50">
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  {listing.operatorVerified ? (
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                  )}
                                  <span className="font-medium text-text">{listing.operator}</span>
                                </div>
                                <div className="flex gap-1 mt-1">
                                  {listing.emptyLeg && (
                                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30 text-xs">
                                      Empty Leg
                                    </Badge>
                                  )}
                                  {listing.operatorVerified && (
                                    <Badge className="bg-green-500/20 text-green-400 border-green-400/30 text-xs">
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <Plane className="w-4 h-4 text-brand" />
                                  <span className="text-text">{listing.aircraft}</span>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-brand" />
                                  <span className="text-text">{listing.from} → {listing.to}</span>
                                </div>
                                <div className="text-sm text-text/70">
                                  {listing.distanceNm.toLocaleString()} nm
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-brand" />
                                  <span className="font-mono text-sm text-text">
                                    {new Date(listing.date).toLocaleDateString()}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-brand" />
                                  <span className="text-text">{listing.seats}</span>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="font-mono font-semibold text-text">
                                  {money(listing.priceMinor, listing.currency)}
                                </div>
                                <div className="text-sm text-text/70">
                                  {listing.currency}
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="font-mono text-sm text-text">
                                  {ppm ? money(ppm, listing.currency) : 'N/A'}
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="font-mono text-sm text-red-400">
                                  -{money(fees.platformFeeMinor, listing.currency)}
                                </div>
                                <div className="text-xs text-text/70">7%</div>
                              </td>
                              <td className="p-3">
                                <div className="font-mono text-sm text-text">
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
                                  <Star className="w-4 h-4 text-yellow-400" />
                                  <span className="font-mono text-sm text-text">{listing.rating}</span>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => onRemove(listing)}
                                    variant="outline"
                                    size="sm"
                                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-brand/30 text-brand hover:bg-brand/10"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedTab === 'analysis' && (
            <div className="space-y-6">
              {/* AI-Powered Analysis */}
              <Card className="card-predictive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-bright">
                    <Lightbulb className="w-5 h-5 text-brand" />
                    AI-Powered Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-surface-2 rounded-lg">
                      <h4 className="font-semibold text-bright mb-2">Price Analysis</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-text/70">Price Range:</span>
                          <span className="text-text">{money(analysis.priceRange, listings[0]?.currency || 'USD')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text/70">Average Price:</span>
                          <span className="text-text">{money(analysis.avgPrice, listings[0]?.currency || 'USD')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text/70">Price Variance:</span>
                          <span className="text-text">{(analysis.priceVariance * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-surface-2 rounded-lg">
                      <h4 className="font-semibold text-bright mb-2">Quality Analysis</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-text/70">Best Score:</span>
                          <span className="text-green-400">{analysis.bestScore}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text/70">Worst Score:</span>
                          <span className="text-red-400">{analysis.worstScore}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text/70">Avg Rating:</span>
                          <span className="text-text">{analysis.avgRating.toFixed(1)}/5.0</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-surface-2 rounded-lg">
                    <h4 className="font-semibold text-bright mb-3">Recommendations</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <Award className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-bright">Best Value Option</p>
                          <p className="text-sm text-text/70">
                            {analysis.bestValue.operator} offers the best deal score per dollar at {money(analysis.bestValue.priceMinor, analysis.bestValue.currency)} 
                            with a score of {dealScore(analysis.bestValue)}.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <DollarSign className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-bright">Most Cost-Effective</p>
                          <p className="text-sm text-text/70">
                            {analysis.mostCostEffective.operator} has the lowest price per nautical mile at {pricePerNm(analysis.mostCostEffective.priceMinor, analysis.mostCostEffective.distanceNm) ? money(pricePerNm(analysis.mostCostEffective.priceMinor, analysis.mostCostEffective.distanceNm)!, analysis.mostCostEffective.currency) : 'N/A'}.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                          <Shield className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div>
                          <p className="font-medium text-bright">Verification Status</p>
                          <p className="text-sm text-text/70">
                            {analysis.verifiedCount} out of {analysis.totalListings} operators are verified, 
                            providing {((analysis.verifiedCount / analysis.totalListings) * 100).toFixed(0)}% confidence in operator reliability.
                          </p>
                        </div>
                      </div>

                      {analysis.emptyLegCount > 0 && (
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Zap className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <p className="font-medium text-bright">Empty Leg Opportunities</p>
                            <p className="text-sm text-text/70">
                              {analysis.emptyLegCount} empty leg options available, potentially offering significant cost savings 
                              while helping operators reduce positioning costs.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-terminal-border">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-terminal-border text-text hover:bg-surface-2"
                onClick={onClose}
              >
                <Bookmark className="w-4 h-4 mr-2" />
                Save Comparison
              </Button>
              <Button
                variant="outline"
                className="border-terminal-border text-text hover:bg-surface-2"
              >
                <Eye className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-terminal-border text-text hover:bg-surface-2"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                className="bg-brand hover:bg-brand-600 text-text"
                onClick={() => {
                  alert('Booking functionality will be available in the full version. This demo shows the comparison interface.');
                }}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Book Selected
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
