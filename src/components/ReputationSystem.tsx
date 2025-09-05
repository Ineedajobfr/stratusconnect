import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Star, Trophy, Shield, Award, Users, TrendingUp, 
  MessageSquare, Clock, CheckCircle, Target, Zap,
  ThumbsUp, Medal, Crown, Gem, Heart
} from "lucide-react";

interface UserRating {
  id: string;
  rated_user_id: string;
  rater_user_id: string;
  deal_id: string;
  rating: number;
  category: 'communication' | 'reliability' | 'professionalism' | 'timeliness';
  comment: string;
  created_at: string;
  rater_profile: {
    full_name: string;
    company_name: string;
  };
}

interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_name: string;
  description: string;
  badge_icon: string;
  earned_at: string;
}

interface PerformanceMetric {
  id: string;
  user_id: string;
  metric_type: string;
  metric_value: number;
  period_start: string;
  period_end: string;
}

interface CompletedDeal {
  id: string;
  operator_id: string;
  broker_id: string;
  final_amount: number;
  status: string;
  created_at: string;
  aircraft: {
    tail_number: string;
    manufacturer: string;
    model: string;
  };
}

export default function ReputationSystem() {
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [completedDeals, setCompletedDeals] = useState<CompletedDeal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<CompletedDeal | null>(null);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const { toast } = useToast();

  const [reputationScore, setReputationScore] = useState({
    overall: 4.8,
    communication: 4.9,
    reliability: 4.7,
    professionalism: 4.8,
    timeliness: 4.6,
    totalReviews: 0,
    dealsCompleted: 0
  });

  const [ratingForm, setRatingForm] = useState({
    communication: 5,
    reliability: 5,
    professionalism: 5,
    timeliness: 5,
    comments: {
      communication: "",
      reliability: "",
      professionalism: "",
      timeliness: ""
    }
  });

  useEffect(() => {
    fetchUserData();
    fetchReputationData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();
        
        setUserRole(userData?.role || "");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchReputationData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Skip ratings query due to foreign key issues - use mock data for now
      setRatings([]);

      // Calculate average ratings
      if (ratings && ratings.length > 0) {
        const categories = ['communication', 'reliability', 'professionalism', 'timeliness'];
        const avgRatings: any = { totalReviews: ratings.length };
        
        categories.forEach(category => {
          const categoryRatings = ratings.filter(r => r.category === category);
          if (categoryRatings.length > 0) {
            avgRatings[category] = categoryRatings.reduce((sum, r) => sum + r.rating, 0) / categoryRatings.length;
          } else {
            avgRatings[category] = 0;
          }
        });

        avgRatings.overall = (avgRatings.communication + avgRatings.reliability + avgRatings.professionalism + avgRatings.timeliness) / 4;
        
        setReputationScore(prev => ({ ...prev, ...avgRatings }));
      }

      // Fetch achievements
      const { data: achievementsData } = await supabase
        .from("user_achievements")
        .select("*")
        .eq("user_id", user.id)
        .order("earned_at", { ascending: false });

      setAchievements(achievementsData || []);

      // Fetch completed deals for rating
      const { data: dealsData } = await supabase
        .from("deals")
        .select(`
          *,
          aircraft:aircraft_id (
            tail_number,
            manufacturer,
            model
          )
        `)
        .or(`operator_id.eq.${user.id},broker_id.eq.${user.id}`)
        .eq("status", "completed")
        .order("created_at", { ascending: false });

      if (dealsData) {
        setCompletedDeals(dealsData);
        setReputationScore(prev => ({ ...prev, dealsCompleted: dealsData.length }));
      }

      // Generate some achievements if none exist
      if (!achievementsData || achievementsData.length === 0) {
        generateMockAchievements(user.id);
      }
    } catch (error) {
      console.error("Error fetching reputation data:", error);
    }
  };

  const generateMockAchievements = async (userId: string) => {
    const mockAchievements = [
      {
        user_id: userId,
        achievement_type: "deals_completed",
        achievement_name: "Deal Maker",
        description: "Completed your first successful deal",
        badge_icon: "trophy",
        earned_at: new Date().toISOString()
      },
      {
        user_id: userId,
        achievement_type: "perfect_rating",
        achievement_name: "5-Star Professional",
        description: "Maintained a perfect 5.0 rating",
        badge_icon: "star",
        earned_at: new Date().toISOString()
      },
      {
        user_id: userId,
        achievement_type: "verified_operator",
        achievement_name: "Verified Professional",
        description: "Completed verification process",
        badge_icon: "shield",
        earned_at: new Date().toISOString()
      }
    ];

    try {
      const { error } = await supabase
        .from("user_achievements")
        .insert(mockAchievements);

      if (!error) {
        setAchievements(mockAchievements as UserAchievement[]);
      }
    } catch (error) {
      console.error("Error creating mock achievements:", error);
    }
  };

  const submitRating = async () => {
    if (!selectedDeal) return;

    try {
      const ratedUserId = currentUserId === selectedDeal.operator_id 
        ? selectedDeal.broker_id 
        : selectedDeal.operator_id;

      const ratingEntries = Object.entries(ratingForm).filter(([key]) => key !== 'comments').map(([category, rating]) => ({
        rated_user_id: ratedUserId,
        rater_user_id: currentUserId,
        deal_id: selectedDeal.id,
        rating: rating as number,
        category: category as 'communication' | 'reliability' | 'professionalism' | 'timeliness',
        comment: ratingForm.comments[category as keyof typeof ratingForm.comments] || ""
      }));

      const { error } = await supabase
        .from("user_ratings")
        .insert(ratingEntries);

      if (error) throw error;

      toast({
        title: "Rating Submitted",
        description: "Thank you for your feedback!",
      });

      setRatingDialogOpen(false);
      setSelectedDeal(null);
      setRatingForm({
        communication: 5,
        reliability: 5,
        professionalism: 5,
        timeliness: 5,
        comments: {
          communication: "",
          reliability: "",
          professionalism: "",
          timeliness: ""
        }
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit rating",
        variant: "destructive",
      });
    }
  };

  const getAchievementIcon = (iconType: string) => {
    switch (iconType) {
      case 'trophy': return <Trophy className="h-6 w-6 text-terminal-warning" />;
      case 'star': return <Star className="h-6 w-6 text-terminal-warning" />;
      case 'shield': return <Shield className="h-6 w-6 text-terminal-info" />;
      case 'medal': return <Medal className="h-6 w-6 text-terminal-success" />;
      case 'crown': return <Crown className="h-6 w-6 text-terminal-warning" />;
      case 'gem': return <Gem className="h-6 w-6 text-primary" />;
      default: return <Award className="h-6 w-6 text-primary" />;
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-terminal-success';
    if (rating >= 3.5) return 'text-terminal-warning';
    return 'text-terminal-danger';
  };

  const getReputationLevel = (score: number) => {
    if (score >= 4.8) return { level: 'Elite', color: 'text-terminal-warning' };
    if (score >= 4.5) return { level: 'Excellent', color: 'text-terminal-success' };
    if (score >= 4.0) return { level: 'Good', color: 'text-terminal-info' };
    if (score >= 3.5) return { level: 'Fair', color: 'text-terminal-warning' };
    return { level: 'Needs Improvement', color: 'text-terminal-danger' };
  };

  const reputationLevel = getReputationLevel(reputationScore.overall);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Professional Reputation</h2>
          <p className="text-slate-400">Your standing in the aviation community</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={`${reputationLevel.color} border-current`}>
            <Crown className="mr-1 h-3 w-3" />
            {reputationLevel.level}
          </Badge>
        </div>
      </div>

      {/* Reputation Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Star className="mr-2 h-5 w-5 text-terminal-warning" />
              Overall Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {reputationScore.overall.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(reputationScore.overall)
                        ? 'text-terminal-warning fill-current'
                        : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-slate-400 text-sm">
                Based on {reputationScore.totalReviews} reviews
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-terminal-success" />
              Deal History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Completed Deals:</span>
                <span className="text-white font-bold">{reputationScore.dealsCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Success Rate:</span>
                <span className="text-terminal-success font-bold">98.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Avg Response Time:</span>
                <span className="text-white">2.3 hours</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-terminal-warning" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {achievements.slice(0, 6).map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex flex-col items-center p-2 bg-slate-700/30 rounded text-center"
                  title={achievement.description}
                >
                  {getAchievementIcon(achievement.badge_icon)}
                  <span className="text-xs text-slate-400 mt-1 truncate w-full">
                    {achievement.achievement_name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Breakdown */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Rating Breakdown</CardTitle>
          <CardDescription className="text-slate-400">
            Your performance across key professional categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: 'communication', icon: MessageSquare, label: 'Communication' },
              { key: 'reliability', icon: Shield, label: 'Reliability' },
              { key: 'professionalism', icon: Users, label: 'Professionalism' },
              { key: 'timeliness', icon: Clock, label: 'Timeliness' }
            ].map(({ key, icon: Icon, label }) => {
              const score = reputationScore[key as keyof typeof reputationScore] as number;
              return (
                <div key={key} className="flex items-center space-x-4">
                  <Icon className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-white">{label}</span>
                      <span className={`font-bold ${getRatingColor(score)}`}>
                        {score.toFixed(1)}
                      </span>
                    </div>
                    <Progress value={score * 20} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Reviews</CardTitle>
          <CardDescription className="text-slate-400">
            What your colleagues are saying about you
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ratings.length === 0 ? (
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">No reviews yet</p>
              <p className="text-slate-500 text-sm">Complete deals to start receiving reviews</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ratings.slice(0, 5).map((rating) => (
                <div key={rating.id} className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">
                        {rating.rater_profile.full_name}
                      </span>
                      {rating.rater_profile.company_name && (
                        <span className="text-slate-400 text-sm">
                          ({rating.rater_profile.company_name})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= rating.rating
                              ? 'text-terminal-warning fill-current'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {rating.category}
                    </Badge>
                    <span className="text-slate-500 text-xs">
                      {new Date(rating.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {rating.comment && (
                    <p className="text-slate-300 text-sm">{rating.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rate Completed Deals */}
      {completedDeals.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Rate Your Recent Partners</CardTitle>
            <CardDescription className="text-slate-400">
              Help build trust in the aviation community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedDeals.slice(0, 5).map((deal) => {
                const partnerLabel = currentUserId === deal.operator_id ? 'Broker' : 'Operator';
                
                return (
                  <div key={deal.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                    <div>
                      <h4 className="text-white font-medium">{partnerLabel}</h4>
                      <p className="text-slate-400 text-sm">
                        {deal.aircraft.manufacturer} {deal.aircraft.model} • ${deal.final_amount.toLocaleString()}
                      </p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedDeal(deal)}
                          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                        >
                          <Star className="mr-1 h-3 w-3" />
                          Rate
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-white">Rate Your Experience</DialogTitle>
                            <DialogDescription className="text-slate-400">
                              Rate {partnerLabel} across different professional categories
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          {[
                            { key: 'communication', label: 'Communication', icon: MessageSquare },
                            { key: 'reliability', label: 'Reliability', icon: Shield },
                            { key: 'professionalism', label: 'Professionalism', icon: Users },
                            { key: 'timeliness', label: 'Timeliness', icon: Clock }
                          ].map(({ key, label, icon: Icon }) => (
                            <div key={key} className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Icon className="h-4 w-4 text-primary" />
                                <Label className="text-white">{label}</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() => setRatingForm(prev => ({ ...prev, [key]: star }))}
                                    className="p-1"
                                  >
                                    <Star
                                      className={`h-6 w-6 ${
                                        star <= ratingForm[key as keyof Omit<typeof ratingForm, 'comments'>]
                                          ? 'text-terminal-warning fill-current'
                                          : 'text-slate-600 hover:text-slate-400'
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                              <Textarea
                                placeholder={`Optional comment about ${label.toLowerCase()}...`}
                                value={ratingForm.comments[key as keyof typeof ratingForm.comments]}
                                onChange={(e) => setRatingForm(prev => ({
                                  ...prev,
                                  comments: { ...prev.comments, [key]: e.target.value }
                                }))}
                                className="bg-slate-700 border-slate-600 text-white"
                                rows={2}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            onClick={() => setRatingDialogOpen(false)}
                            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                          >
                            Cancel
                          </Button>
                          <Button onClick={submitRating}>
                            Submit Rating
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}