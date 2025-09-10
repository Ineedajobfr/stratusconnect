import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, Download, Brain, TrendingUp, Shield, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

interface PsychReportProps {
  sessionId: string;
}

interface Score {
  trait: string;
  raw: number;
  zscore: number;
  percentile: number;
}

export default function PsychReport({ sessionId }: PsychReportProps) {
  const [scores, setScores] = useState<Score[]>([]);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [sessionId]);

  const loadReport = async () => {
    try {
      // Get session details
      const { data: sessionData } = await supabase
        .from("psych_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

      setSession(sessionData);

      // Get scores
      const { data: scoresData } = await supabase
        .from("psych_scores")
        .select("*")
        .eq("session_id", sessionId)
        .order("trait");

      setScores(scoresData || []);
    } catch (error) {
      console.error("Error loading report:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPercentile = (trait: string): number => {
    const score = scores.find(s => s.trait === trait);
    return score?.percentile || 0;
  };

  const getInterpretation = (percentile: number): { level: string; color: string } => {
    if (percentile >= 80) return { level: "Very High", color: "bg-green-500" };
    if (percentile >= 60) return { level: "High", color: "bg-blue-500" };
    if (percentile >= 40) return { level: "Average", color: "bg-gray-500" };
    if (percentile >= 20) return { level: "Low", color: "bg-orange-500" };
    return { level: "Very Low", color: "bg-red-500" };
  };

  // Prepare chart data
  const radarTraits = ["O", "C", "E", "A", "N"];
  const radarData = radarTraits.map(trait => ({
    trait: trait === "O" ? "Openness" :
           trait === "C" ? "Conscientiousness" :
           trait === "E" ? "Extraversion" :
           trait === "A" ? "Agreeableness" : "Neuroticism",
    percentile: getPercentile(trait)
  }));

  const professionalTraits = ["RISK", "DECISION", "SAFETY", "INTEGRITY", "TEAM"];
  const professionalData = professionalTraits.map(trait => ({
    trait: trait === "RISK" ? "Risk Appetite" :
           trait === "DECISION" ? "Decision Style" :
           trait === "SAFETY" ? "Safety Focus" :
           trait === "INTEGRITY" ? "Integrity" : "Team Orientation",
    percentile: getPercentile(trait)
  }));

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <Card className="p-8">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Brain size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Your Stratus Core Profile</h1>
              <p className="text-muted-foreground">
                Completed {session?.completed_at && new Date(session.completed_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 size={16} className="mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Core Personality Traits */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users size={20} className="text-primary" />
            <h2 className="text-xl font-semibold">Core Personality Traits</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="trait" />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  tickCount={6}
                  fontSize={12}
                />
                <Radar
                  name="Percentile"
                  dataKey="percentile"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-primary" />
            <h2 className="text-xl font-semibold">Professional Traits</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={professionalData} layout="horizontal">
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="trait" type="category" width={100} fontSize={12} />
                <Tooltip />
                <Bar 
                  dataKey="percentile" 
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield size={20} className="text-primary" />
          <h2 className="text-xl font-semibold">Detailed Analysis</h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Big 5 Traits */}
          <div className="space-y-4">
            <h3 className="font-semibold">Personality Dimensions</h3>
            {[
              { trait: "O", label: "Openness to Experience" },
              { trait: "C", label: "Conscientiousness" },
              { trait: "E", label: "Extraversion" },
              { trait: "A", label: "Agreeableness" },
              { trait: "N", label: "Neuroticism" }
            ].map(({ trait, label }) => {
              const percentile = getPercentile(trait);
              const interpretation = getInterpretation(percentile);
              return (
                <div key={trait} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{label}</span>
                    <Badge variant="outline">{percentile}th percentile</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${interpretation.color}`}
                      style={{ width: `${percentile}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {interpretation.level}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Professional Traits */}
          <div className="space-y-4">
            <h3 className="font-semibold">Professional Aptitudes</h3>
            {[
              { trait: "RISK", label: "Risk Appetite" },
              { trait: "DECISION", label: "Decision Making" },
              { trait: "INTEGRITY", label: "Integrity" },
              { trait: "TEAM", label: "Team Orientation" }
            ].map(({ trait, label }) => {
              const percentile = getPercentile(trait);
              const interpretation = getInterpretation(percentile);
              return (
                <div key={trait} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{label}</span>
                    <Badge variant="outline">{percentile}th percentile</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${interpretation.color}`}
                      style={{ width: `${percentile}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {interpretation.level}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Safety & Compliance */}
          <div className="space-y-4">
            <h3 className="font-semibold">Safety & Compliance</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Safety Focus</span>
                <Badge variant="outline">{getPercentile("SAFETY")}th percentile</Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getInterpretation(getPercentile("SAFETY")).color}`}
                  style={{ width: `${getPercentile("SAFETY")}%` }}
                ></div>
              </div>
              <span className="text-xs text-muted-foreground">
                {getInterpretation(getPercentile("SAFETY")).level}
              </span>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Key Insights</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Risk tolerance: {getInterpretation(getPercentile("RISK")).level}</li>
                <li>• Decision style: {getInterpretation(getPercentile("DECISION")).level}</li>
                <li>• Team collaboration: {getInterpretation(getPercentile("TEAM")).level}</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Disclaimer */}
      <Card className="p-6 bg-muted/20">
        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-2">Important Notice</p>
          <p>
            This profile is for informational and professional matching purposes only. 
            It is not a medical or psychological diagnosis. Use in conjunction with 
            verification checks, references, and professional qualifications when making 
            hiring or partnership decisions.
          </p>
        </div>
      </Card>
    </div>
  );
}