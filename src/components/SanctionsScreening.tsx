import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Shield, AlertTriangle, CheckCircle, Clock, Search, AlertCircle } from "lucide-react";
import { getErrorMessage } from '@/utils/errorHandler';

interface SanctionsScreening {
  id: string;
  risk_level: 'low' | 'medium' | 'high';
  matches_found: number;
  screened_at: string;
  expires_at: string;
  status: string;
}

interface SanctionsMatch {
  match_score: number;
  match_type: string;
  entity_name: string;
  entity_type: string;
  sanctions_reason: string;
  sanctions_authority: string;
}

export default function SanctionsScreening() {
  const [screening, setScreening] = useState<SanctionsScreening | null>(null);
  const [matches, setMatches] = useState<SanctionsMatch[]>([]);
  const [isScreening, setIsScreening] = useState(false);
  const [userProfile, setUserProfile] = useState<Record<string, unknown> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserProfile();
    fetchLatestScreening();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setUserProfile(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchLatestScreening = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("sanctions_screenings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setScreening(data as SanctionsScreening);
        fetchMatches(data.id);
      }
    } catch (error) {
      console.error("Error fetching screening:", error);
    }
  };

  const fetchMatches = async (screeningId: string) => {
    try {
      const { data } = await supabase
        .from("sanctions_matches")
        .select(`
          *,
          entity:sanctions_entities(*)
        `)
        .eq("screening_id", screeningId)
        .order("match_score", { ascending: false });

      if (data) {
        const formattedMatches = data.map(match => ({
          match_score: match.match_score,
          match_type: match.match_type,
          entity_name: match.entity.name,
          entity_type: match.entity.entity_type,
          sanctions_reason: match.entity.sanctions_reason,
          sanctions_authority: match.entity.sanctions_authority
        }));
        setMatches(formattedMatches);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const performScreening = async () => {
    if (!userProfile) {
      toast({
        title: "Error",
        description: "Please complete your profile before screening",
        variant: "destructive",
      });
      return;
    }

    setIsScreening(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const { data, error } = await supabase.functions.invoke('sanctions-screen', {
        body: {
          fullName: userProfile.full_name,
          companyName: userProfile.company_name,
          screeningType: 'verification'
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      if (data.success) {
        setScreening(data.screening);
        setMatches(data.matches || []);
        
        toast({
          title: "Screening Complete",
          description: `Risk level: ${data.screening.risk_level.toUpperCase()}. ${data.screening.matches_found} potential matches found.`,
          variant: data.screening.risk_level === 'high' ? 'destructive' : 'default',
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: unknown) {
      toast({
        title: "Screening Failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsScreening(false);
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-error" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      default:
        return <CheckCircle className="h-4 w-4 text-success" />;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return 'bg-error/20 text-error border-error/30';
      case 'medium':
        return 'bg-warning/20 text-warning border-warning/30';
      default:
        return 'bg-success/20 text-success border-success/30';
    }
  };

  const isScreeningExpired = screening && new Date(screening.expires_at) < new Date();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Sanctions Screening</h2>
        <p className="text-slate-400">Global sanctions and watchlist verification</p>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Screening Status
          </CardTitle>
          <CardDescription className="text-slate-400">
            Verify against global sanctions databases and watchlists
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {screening ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getRiskIcon(screening.risk_level)}
                  <Badge className={getRiskColor(screening.risk_level)}>
                    {screening.risk_level.toUpperCase()} RISK
                  </Badge>
                  <span className="text-slate-400 text-sm">
                    {screening.matches_found} matches found
                  </span>
                </div>
                <div className="text-sm text-slate-400">
                  Screened: {new Date(screening.screened_at).toLocaleDateString()}
                  {isScreeningExpired && (
                    <span className="ml-2 text-warning">(Expired)</span>
                  )}
                </div>
              </div>

              {isScreeningExpired && (
                <Alert className="bg-warning/10 border-warning/20">
                  <Clock className="h-4 w-4" />
                  <AlertDescription className="text-warning">
                    Your screening has expired. Please run a new screening to maintain compliance.
                  </AlertDescription>
                </Alert>
              )}

              {screening.risk_level === 'high' && (
                <Alert className="bg-error/10 border-error/20">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-error">
                    High-risk matches detected. Manual review required before account activation.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={performScreening}
                disabled={isScreening}
                variant="outline"
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                {isScreening ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Screening...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Re-screen
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-slate-400">
                No screening performed yet. Click below to verify against global sanctions databases.
              </p>
              <Button
                onClick={performScreening}
                disabled={isScreening}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isScreening ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Screening...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Start Screening
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {matches.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Potential Matches</CardTitle>
            <CardDescription className="text-slate-400">
              Entities with similar characteristics found in sanctions databases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {matches.map((match, index) => (
                <div key={index} className="p-4 bg-slate-700/50 rounded border border-slate-600">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-white font-medium">{match.entity_name}</h4>
                      <p className="text-sm text-slate-400 capitalize">{match.entity_type}</p>
                    </div>
                    <Badge variant="outline" className="text-warning border-warning/30">
                      {Math.round(match.match_score * 100)}% match
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-slate-400">
                      <span className="font-medium">Match Type:</span> {match.match_type}
                    </p>
                    <p className="text-slate-400">
                      <span className="font-medium">Reason:</span> {match.sanctions_reason}
                    </p>
                    <p className="text-slate-400">
                      <span className="font-medium">Authority:</span> {match.sanctions_authority}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-info mt-0.5" />
            <div>
              <h4 className="text-white font-medium mb-2">About Sanctions Screening</h4>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Screens against OpenSanctions global database</li>
                <li>• Includes UN, OFAC, EU, and other major sanctions lists</li>
                <li>• Checks for Politically Exposed Persons (PEPs)</li>
                <li>• Screening expires every 90 days for compliance</li>
                <li>• All screening data is encrypted and securely stored</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
