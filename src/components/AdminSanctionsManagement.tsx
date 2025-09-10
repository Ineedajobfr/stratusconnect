import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Shield, AlertTriangle, CheckCircle, XCircle, Search, Filter, Eye, FileText } from "lucide-react";

interface SanctionsMatch {
  id: string;
  user_id: string;
  screening_date: string;
  risk_level: 'low' | 'medium' | 'high';
  matches_found: number;
  status: 'pending' | 'reviewed' | 'cleared' | 'flagged';
  user_name: string;
  user_email: string;
  match_details?: Record<string, unknown>;
}

export default function AdminSanctionsManagement() {
  const [matches, setMatches] = useState<SanctionsMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchSanctionsMatches();
  }, [fetchSanctionsMatches]);

  const fetchSanctionsMatches = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get high-risk screenings that need admin review
      const { data: screenings, error } = await supabase
        .from('sanctions_screenings')
        .select('*')
        .in('risk_level', ['medium', 'high'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user profiles for the screenings
      const userIds = screenings?.map(s => s.user_id) || [];
      const { data: users } = await supabase
        .from('users')
        .select('id, full_name, email')
        .in('id', userIds);

      const formattedMatches = screenings?.map(screening => {
        const userInfo = users?.find(u => u.id === screening.user_id);
        return {
          id: screening.id,
          user_id: screening.user_id,
          screening_date: screening.screened_at,
          risk_level: screening.risk_level as 'low' | 'medium' | 'high',
          matches_found: screening.matches_found,
          status: 'pending' as const,
          user_name: userInfo?.full_name || 'Unknown',
          user_email: userInfo?.email || 'Unknown',
          match_details: screening.search_terms
        };
      }) || [];

      setMatches(formattedMatches);
    } catch (error: unknown) {
      console.error('Error fetching sanctions matches:', error);
      toast({
        title: "Error",
        description: "Failed to load sanctions screenings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleReviewAction = async (matchId: string, action: 'approve' | 'flag') => {
    try {
      // In a real implementation, this would update the screening status
      console.log(`${action} screening ${matchId}`);
      
      toast({
        title: "Action Completed",
        description: `Screening has been ${action === 'approve' ? 'cleared' : 'flagged'} for review`,
      });
      
      // Update local state
      setMatches(prev => prev.map(match => 
        match.id === matchId 
          ? { ...match, status: action === 'approve' ? 'cleared' : 'flagged' }
          : match
      ));
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to process review action",
        variant: "destructive",
      });
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cleared':
        return 'bg-success/20 text-success border-success/30';
      case 'flagged':
        return 'bg-error/20 text-error border-error/30';
      case 'reviewed':
        return 'bg-info/20 text-info border-info/30';
      default:
        return 'bg-warning/20 text-warning border-warning/30';
    }
  };

  const filteredMatches = matches.filter(match => {
    const searchMatch = match.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       match.user_email.toLowerCase().includes(searchTerm.toLowerCase());
    const riskMatch = filterRisk === 'all' || match.risk_level === filterRisk;
    return searchMatch && riskMatch;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          <div className="h-32 bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Sanctions Review Center</h2>
        <p className="text-slate-400">Review and manage sanctions screening results</p>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="bg-slate-700 border border-slate-600 px-3 py-2 rounded text-white"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Reviews</p>
                <p className="text-2xl font-bold text-white">{matches.length}</p>
              </div>
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">High Risk</p>
                <p className="text-2xl font-bold text-error">
                  {matches.filter(m => m.risk_level === 'high').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-error" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pending</p>
                <p className="text-2xl font-bold text-warning">
                  {matches.filter(m => m.status === 'pending').length}
                </p>
              </div>
              <Search className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Cleared</p>
                <p className="text-2xl font-bold text-success">
                  {matches.filter(m => m.status === 'cleared').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Screening Results */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Sanctions Screening Results</CardTitle>
          <CardDescription className="text-slate-400">
            Review users flagged by sanctions screening
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredMatches.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto text-slate-400 mb-4" />
              <p className="text-slate-400">No sanctions screening results to review</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMatches.map((match) => (
                <div key={match.id} className="p-4 bg-slate-700/50 rounded border border-slate-600">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-white font-medium">{match.user_name}</h4>
                        <Badge className={getRiskColor(match.risk_level)}>
                          {match.risk_level.toUpperCase()} RISK
                        </Badge>
                        <Badge className={getStatusColor(match.status)}>
                          {match.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-400 space-y-1">
                        <p>Email: {match.user_email}</p>
                        <p>Screening Date: {new Date(match.screening_date).toLocaleDateString()}</p>
                        <p>Matches Found: {match.matches_found}</p>
                      </div>
                    </div>
                    
                    {match.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleReviewAction(match.id, 'approve')}
                          className="bg-success/20 text-success border-success/30 hover:bg-success/30"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Clear
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReviewAction(match.id, 'flag')}
                          className="bg-error/20 text-error border-error/30 hover:bg-error/30"
                        >
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Flag
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-slate-600 border-slate-500 text-white hover:bg-slate-500"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Details
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}