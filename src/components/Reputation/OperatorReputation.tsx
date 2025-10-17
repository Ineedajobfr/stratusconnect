// Operator Reputation Component
// Displays reputation metrics, ratings, reviews, and badges

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { reputationService, type ReputationMetrics } from "@/lib/reputation-service";
import {
    Award,
    Loader2,
    RefreshCw,
    Star,
    TrendingUp,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";

interface OperatorReputationProps {
  operatorId: string;
}

export function OperatorReputation({ operatorId }: OperatorReputationProps) {
  const { toast } = useToast();
  const [reputation, setReputation] = useState<ReputationMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);

  useEffect(() => {
    loadReputationData();
  }, [operatorId]);

  const loadReputationData = async () => {
    setLoading(true);
    try {
      const [reputationData, badgesData] = await Promise.all([
        reputationService.getReputationMetrics(operatorId),
        reputationService.getAvailableBadges()
      ]);
      
      setReputation(reputationData);
      setAvailableBadges(badgesData);
    } catch (error) {
      console.error('Error loading reputation data:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load reputation data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-400'
        }`}
      />
    ));
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'Gold': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'Silver': return 'text-gray-300 bg-gray-500/20 border-gray-500/30';
      case 'Bronze': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getBadgeIcon = (badgeId: string) => {
    const badge = availableBadges.find(b => b.id === badgeId);
    return badge?.icon || '🏆';
  };

  const getBadgeColor = (badgeId: string) => {
    const badge = availableBadges.find(b => b.id === badgeId);
    return badge?.color || 'text-gray-400';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
      </div>
    );
  }

  if (!reputation) {
    return (
      <div className="text-center py-12">
        <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Reputation Data</h3>
        <p className="text-gray-400 mb-6">
          Reputation data is not available for this operator
        </p>
        <Button onClick={loadReputationData} className="bg-orange-500 hover:bg-orange-600 text-white">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Reputation & Reviews</h2>
          <p className="text-gray-400">Your reputation metrics and customer feedback</p>
        </div>
        <Button
          onClick={loadReputationData}
          variant="outline"
          className="border-slate-600 text-white hover:bg-slate-600"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Overall Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-white">{reputation.overallRating}</p>
                  <div className="flex">
                    {renderStars(reputation.overallRating)}
                  </div>
                </div>
                <p className="text-xs text-gray-400">{reputation.totalRatings} reviews</p>
              </div>
              <Star className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Trust Score</p>
                <p className="text-2xl font-bold text-green-400">{reputation.trustScore}</p>
                <p className="text-xs text-gray-400">out of 100</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Ranking</p>
                <p className="text-2xl font-bold text-orange-400">#{reputation.ranking.position}</p>
                <p className="text-xs text-gray-400">{reputation.ranking.tier}</p>
              </div>
              <Award className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Badges</p>
                <p className="text-2xl font-bold text-purple-400">{reputation.badges.length}</p>
                <p className="text-xs text-gray-400">earned</p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-600">
          <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500">
            Overview
          </TabsTrigger>
          <TabsTrigger value="reviews" className="data-[state=active]:bg-blue-500">
            Reviews
          </TabsTrigger>
          <TabsTrigger value="badges" className="data-[state=active]:bg-green-500">
            Badges
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-purple-500">
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Reviews */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Reviews</CardTitle>
                <CardDescription>Latest customer feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reputation.recentRatings.slice(0, 3).map((rating) => (
                    <div key={rating.id} className="p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {renderStars(rating.rating)}
                          </div>
                          <span className="text-sm text-gray-400">
                            {rating.rater_name || 'Anonymous'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatDate(rating.created_at)}
                        </span>
                      </div>
                      {rating.review_text && (
                        <p className="text-sm text-gray-300">{rating.review_text}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400">Response Time</span>
                      <span className="text-sm text-white">{reputation.performanceMetrics.responseTime}m</span>
                    </div>
                    <Progress 
                      value={Math.max(0, 100 - (reputation.performanceMetrics.responseTime / 60) * 100)} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400">Completion Rate</span>
                      <span className="text-sm text-white">{reputation.performanceMetrics.completionRate}%</span>
                    </div>
                    <Progress 
                      value={reputation.performanceMetrics.completionRate} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400">On-Time Rate</span>
                      <span className="text-sm text-white">{reputation.performanceMetrics.onTimeRate}%</span>
                    </div>
                    <Progress 
                      value={reputation.performanceMetrics.onTimeRate} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400">Dispute Rate</span>
                      <span className="text-sm text-white">{reputation.performanceMetrics.disputeRate}%</span>
                    </div>
                    <Progress 
                      value={Math.max(0, 100 - reputation.performanceMetrics.disputeRate * 10)} 
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">All Reviews</CardTitle>
              <CardDescription>Complete review history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reputation.recentRatings.map((rating) => (
                  <div key={rating.id} className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex">
                          {renderStars(rating.rating)}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {rating.rater_name || 'Anonymous'}
                          </p>
                          <p className="text-sm text-gray-400">
                            {rating.rater_company && `${rating.rater_company} • `}
                            {formatDate(rating.created_at)}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {rating.rating} stars
                      </Badge>
                    </div>
                    {rating.review_text && (
                      <p className="text-gray-300">{rating.review_text}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Earned Badges</CardTitle>
              <CardDescription>Badges you've earned based on your performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reputation.badges.map((badgeId) => {
                  const badge = availableBadges.find(b => b.id === badgeId);
                  if (!badge) return null;
                  
                  return (
                    <div key={badgeId} className="p-4 bg-slate-700/50 rounded-lg border border-green-500/30">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{badge.icon}</span>
                        <div>
                          <h4 className="text-white font-medium">{badge.name}</h4>
                          <p className="text-sm text-gray-400">{badge.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Available Badges</CardTitle>
              <CardDescription>Badges you can earn by improving your performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableBadges
                  .filter(badge => !reputation.badges.includes(badge.id))
                  .map((badge) => (
                    <div key={badge.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl opacity-50">{badge.icon}</span>
                        <div>
                          <h4 className="text-white font-medium opacity-75">{badge.name}</h4>
                          <p className="text-sm text-gray-400">{badge.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Response Time</CardTitle>
                <CardDescription>Average time to respond to inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-400 mb-2">
                    {reputation.performanceMetrics.responseTime}m
                  </div>
                  <p className="text-sm text-gray-400">
                    {reputation.performanceMetrics.responseTime <= 30 ? 'Excellent' : 
                     reputation.performanceMetrics.responseTime <= 60 ? 'Good' : 'Needs Improvement'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Completion Rate</CardTitle>
                <CardDescription>Percentage of completed transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    {reputation.performanceMetrics.completionRate}%
                  </div>
                  <p className="text-sm text-gray-400">
                    {reputation.performanceMetrics.completionRate >= 99 ? 'Excellent' : 
                     reputation.performanceMetrics.completionRate >= 95 ? 'Good' : 'Needs Improvement'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">On-Time Rate</CardTitle>
                <CardDescription>Percentage of on-time deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    {reputation.performanceMetrics.onTimeRate}%
                  </div>
                  <p className="text-sm text-gray-400">
                    {reputation.performanceMetrics.onTimeRate >= 98 ? 'Excellent' : 
                     reputation.performanceMetrics.onTimeRate >= 95 ? 'Good' : 'Needs Improvement'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Dispute Rate</CardTitle>
                <CardDescription>Percentage of disputed transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-400 mb-2">
                    {reputation.performanceMetrics.disputeRate}%
                  </div>
                  <p className="text-sm text-gray-400">
                    {reputation.performanceMetrics.disputeRate <= 1 ? 'Excellent' : 
                     reputation.performanceMetrics.disputeRate <= 3 ? 'Good' : 'Needs Improvement'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
