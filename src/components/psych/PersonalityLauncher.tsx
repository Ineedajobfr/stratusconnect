import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Shield, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PersonalityLauncherProps {
  user: Record<string, unknown>;
}

export default function PersonalityLauncher({ user }: PersonalityLauncherProps) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Record<string, unknown> | null>(null);
  const [consent, setConsent] = useState(false);
  const [completedSession, setCompletedSession] = useState<Record<string, unknown> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Seed catalog if empty
        const { count } = await supabase
          .from("psych_items")
          .select("id", { count: 'exact', head: true });
        if (!count || count === 0) {
          await supabase.functions.invoke('psych-seed');
        }

        // Check consent
        const { data: consentData } = await supabase
          .from("psych_consent")
          .select("*")
          .eq("user_id", user.user_id)
          .maybeSingle();
        
        if (alive) setConsent(Boolean(consentData?.share_profile));

        // Check for in-progress session
        const { data: inProgressSession } = await supabase
          .from("psych_sessions")
          .select("*")
          .eq("user_id", user.user_id)
          .eq("status", "in_progress")
          .order("started_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (alive) setSession(inProgressSession);

        // Check for completed sessions
        const { data: completedSessions } = await supabase
          .from("psych_sessions")
          .select("*")
          .eq("user_id", user.user_id)
          .eq("status", "completed")
          .order("completed_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (alive) setCompletedSession(completedSessions);

      } catch (error) {
        console.error("Error loading personality data:", error);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [user.user_id]);

  const startNewTest = async () => {
    try {
      const { data: test } = await supabase
        .from("psych_tests")
        .select("id")
        .eq("code", "SC-CORE-20")
        .single();

      if (!test) {
        toast({
          title: "Test Not Available",
          description: "The personality test is currently unavailable.",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from("psych_sessions")
        .insert({
          test_id: test.id,
          user_id: user.user_id
        })
        .select()
        .single();

      if (error) throw error;

      setSession(data);
      
      // Navigate to test runner
      window.location.href = `/psych/run/${data.id}`;
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to start test",
        variant: "destructive"
      });
    }
  };

  const saveConsent = async (shareProfile: boolean) => {
    try {
      setConsent(shareProfile);
      await supabase
        .from("psych_consent")
        .upsert({
          user_id: user.user_id,
          share_profile: shareProfile,
          updated_at: new Date().toISOString()
        });

      toast({
        title: "Privacy Setting Updated",
        description: shareProfile 
          ? "Your personality profile will be visible to verified users" 
          : "Your personality profile is now private",
        variant: "default"
      });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to update privacy settings",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="h-10 bg-muted rounded w-1/4"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Brain size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Fortress of Trust</h2>
            <p className="text-muted-foreground">Stratus Core Personality Profile</p>
          </div>
        </div>
      </Card>

      {/* Test Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-primary" />
              <h3 className="font-semibold">Assessment Status</h3>
            </div>
            
            {completedSession ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-sm">Assessment Completed</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Completed on {new Date(completedSession.completed_at).toLocaleDateString()}
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = `/psych/report/${completedSession.id}`}
                >
                  View Results
                </Button>
              </div>
            ) : session ? (
              <div className="space-y-3">
                <Badge variant="secondary">In Progress</Badge>
                <p className="text-sm text-muted-foreground">
                  You have an assessment in progress. Resume to continue.
                </p>
                <Button 
                  size="sm"
                  onClick={() => window.location.href = `/psych/run/${session.id}`}
                >
                  Resume Assessment
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  20-minute comprehensive assessment covering personality traits, risk appetite, 
                  decision style, and professional integrity.
                </p>
                <Button onClick={startNewTest}>
                  Start Assessment
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-primary" />
              <h3 className="font-semibold">Privacy Settings</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="shareProfile"
                  checked={consent}
                  onChange={(e) => saveConsent(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="shareProfile" className="text-sm font-medium cursor-pointer">
                    Share my profile with verified users
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Allow other users to see your personality insights when considering you for projects
                  </p>
                </div>
              </div>
              
              {consent && (
                <div className="pl-6 text-xs text-muted-foreground">
                  <p>Others will see:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Core personality traits</li>
                    <li>Risk appetite summary</li>
                    <li>Decision style preferences</li>
                    <li>Safety and integrity scores</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Information Card */}
      <Card className="p-6">
        <h3 className="font-semibold mb-3">What This Assessment Measures</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Core Personality Traits</h4>
            <p className="text-xs text-muted-foreground">
              Big Five personality dimensions adapted for aviation professionals
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Risk Assessment</h4>
            <p className="text-xs text-muted-foreground">
              Your approach to risk evaluation and decision-making under uncertainty
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Situational Judgment</h4>
            <p className="text-xs text-muted-foreground">
              How you handle complex aviation scenarios and ethical dilemmas
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Professional Integrity</h4>
            <p className="text-xs text-muted-foreground">
              Your commitment to safety protocols and ethical standards
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}