// Ranking Rules Page - Transparent Merit-Based System
// FCA Compliant Aviation Platform

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Award,
  Target,
  Shield,
  DollarSign,
  Users,
  BarChart3
} from 'lucide-react';

export function RankingRulesPage() {
  const rankingFactors = [
    {
      factor: 'Response Time (P50)',
      weight: 25,
      description: 'Average time to first quote in minutes',
      icon: <Clock className="w-5 h-5" />,
      tiers: [
        { range: '0-5 min', points: 25, color: 'text-green-600' },
        { range: '5-10 min', points: 20, color: 'text-yellow-600' },
        { range: '10-15 min', points: 15, color: 'text-orange-600' },
        { range: '15+ min', points: 5, color: 'text-red-600' }
      ]
    },
    {
      factor: 'Acceptance Rate',
      weight: 20,
      description: 'Percentage of quotes accepted by brokers',
      icon: <CheckCircle className="w-5 h-5" />,
      tiers: [
        { range: '90%+', points: 20, color: 'text-green-600' },
        { range: '80-90%', points: 15, color: 'text-yellow-600' },
        { range: '70-80%', points: 10, color: 'text-orange-600' },
        { range: '<70%', points: 5, color: 'text-red-600' }
      ]
    },
    {
      factor: 'Completion Rate',
      weight: 20,
      description: 'Percentage of accepted deals completed successfully',
      icon: <Target className="w-5 h-5" />,
      tiers: [
        { range: '99%+', points: 20, color: 'text-green-600' },
        { range: '97-99%', points: 15, color: 'text-yellow-600' },
        { range: '95-97%', points: 10, color: 'text-orange-600' },
        { range: '<95%', points: 5, color: 'text-red-600' }
      ]
    },
    {
      factor: 'Dispute Rate',
      weight: 15,
      description: 'Percentage of deals resulting in disputes',
      icon: <AlertTriangle className="w-5 h-5" />,
      tiers: [
        { range: '0%', points: 15, color: 'text-green-600' },
        { range: '0-1%', points: 12, color: 'text-yellow-600' },
        { range: '1-3%', points: 8, color: 'text-orange-600' },
        { range: '3%+', points: 0, color: 'text-red-600' }
      ]
    },
    {
      factor: 'Platform Settlement',
      weight: 10,
      description: 'Percentage of payments processed through platform',
      icon: <DollarSign className="w-5 h-5" />,
      tiers: [
        { range: '100%', points: 10, color: 'text-green-600' },
        { range: '95-99%', points: 8, color: 'text-yellow-600' },
        { range: '90-95%', points: 5, color: 'text-orange-600' },
        { range: '<90%', points: 0, color: 'text-red-600' }
      ]
    },
    {
      factor: 'KYC Status',
      weight: 10,
      description: 'Verification and compliance status',
      icon: <Shield className="w-5 h-5" />,
      tiers: [
        { range: 'Verified + Clean', points: 10, color: 'text-green-600' },
        { range: 'Verified + Pending', points: 7, color: 'text-yellow-600' },
        { range: 'Pending Review', points: 3, color: 'text-orange-600' },
        { range: 'Not Verified', points: 0, color: 'text-red-600' }
      ]
    }
  ];

  const bonusFactors = [
    {
      factor: 'Safety Ratings',
      description: 'ARGUS Gold/Platinum: +5 points, WYVERN Elite: +3 points',
      icon: <Award className="w-4 h-4" />
    },
    {
      factor: 'Instant Quotes',
      description: 'Enabled auto-quote system: +3 points',
      icon: <Clock className="w-4 h-4" />
    },
    {
      factor: 'Auto-Match',
      description: 'Enabled smart matching: +2 points',
      icon: <Target className="w-4 h-4" />
    }
  ];

  const penaltyFactors = [
    {
      factor: 'Contact Leakage',
      description: 'Attempts to move deals off-platform: -10 points per incident',
      icon: <AlertTriangle className="w-4 h-4" />
    },
    {
      factor: 'Late Payments',
      description: 'Delayed platform fee payments: -5 points per incident',
      icon: <DollarSign className="w-4 h-4" />
    },
    {
      factor: 'Safety Violations',
      description: 'Expired credentials or safety issues: -15 points',
      icon: <Shield className="w-4 h-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-terminal-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Ranking Rules & Operator Scorecards</h1>
          <p className="text-gunmetal">
            Transparent merit-based system that rewards platform-native behavior and penalizes leakage
          </p>
        </div>

        {/* Overview */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <BarChart3 className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Merit-Based Ranking System</h3>
                <p className="text-green-700 mb-4">
                  Our ranking algorithm rewards operators who provide fast, reliable service while staying within our platform ecosystem. 
                  The system is designed to surface the best operators while discouraging off-platform behavior.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">100</div>
                    <div className="text-sm text-green-700">Base Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+15</div>
                    <div className="text-sm text-green-700">Max Bonus</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">-30</div>
                    <div className="text-sm text-red-700">Max Penalty</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Ranking Factors */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Core Ranking Factors (100 points total)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {rankingFactors.map((factor, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {factor.icon}
                    <div>
                      <h4 className="font-semibold">{factor.factor}</h4>
                      <p className="text-sm text-gray-600">{factor.description}</p>
                    </div>
                    <Badge className="ml-auto bg-blue-100 text-blue-800">
                      {factor.weight} points
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    {factor.tiers.map((tier, tierIndex) => (
                      <div key={tierIndex} className="text-center p-2 bg-gray-50 rounded">
                        <div className={`font-medium ${tier.color}`}>{tier.range}</div>
                        <div className="text-sm text-gray-600">{tier.points} pts</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bonus Factors */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Bonus Factors (up to +15 points)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {bonusFactors.map((factor, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  {factor.icon}
                  <div>
                    <h4 className="font-medium text-green-800">{factor.factor}</h4>
                    <p className="text-sm text-green-700">{factor.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Penalty Factors */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Penalty Factors (up to -30 points)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {penaltyFactors.map((factor, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  {factor.icon}
                  <div>
                    <h4 className="font-medium text-red-800">{factor.factor}</h4>
                    <p className="text-sm text-red-700">{factor.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ranking Tiers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Ranking Tiers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-100 rounded-lg">
                <div className="text-2xl font-bold text-green-600">Tier 1</div>
                <div className="text-sm text-green-700">90+ points</div>
                <div className="text-xs text-green-600 mt-1">Elite Operators</div>
              </div>
              <div className="text-center p-4 bg-blue-100 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">Tier 2</div>
                <div className="text-sm text-blue-700">75-89 points</div>
                <div className="text-xs text-blue-600 mt-1">Premium Operators</div>
              </div>
              <div className="text-center p-4 bg-yellow-100 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">Tier 3</div>
                <div className="text-sm text-yellow-700">60-74 points</div>
                <div className="text-xs text-yellow-600 mt-1">Standard Operators</div>
              </div>
              <div className="text-center p-4 bg-red-100 rounded-lg">
                <div className="text-2xl font-bold text-red-600">Tier 4</div>
                <div className="text-sm text-red-700">Below 60</div>
                <div className="text-xs text-red-600 mt-1">Under Review</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transparency Notice */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Transparency & Fairness</h3>
                <p className="text-blue-700 mb-4">
                  All ranking factors are publicly disclosed and applied consistently across all operators. 
                  Scores are calculated daily and operators can view their detailed scorecard at any time.
                </p>
                <div className="text-sm text-blue-600">
                  <p>• Rankings updated every 24 hours</p>
                  <p>• Historical data available for 12 months</p>
                  <p>• Dispute resolution process for score challenges</p>
                  <p>• Independent audit trail for all score changes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
