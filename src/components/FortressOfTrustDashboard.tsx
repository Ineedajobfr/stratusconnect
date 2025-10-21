import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Search, Users, Database, Activity } from "lucide-react";

interface SecurityOverview {
  totalUsers: number;
  verifiedUsers: number;
  pendingVerifications: number;
  highRiskScreenings: number;
  sanctionsEntities: number;
  lastSyncDate: string;
}

export default function FortressOfTrustDashboard() {
  const [overview, setOverview] = useState<SecurityOverview | null>(null);
  const [userRole, setUserRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSecurityOverview();
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();
        setUserRole(data?.role || "");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const fetchSecurityOverview = async () => {
    try {
      setLoading(true);
      
      // Get verification documents count
      const { count: totalDocs } = await supabase
        .from("verification_documents")
        .select("*", { count: 'exact', head: true });

      // Get approved documents count
      const { count: approvedDocs } = await supabase
        .from("verification_documents")
        .select("*", { count: 'exact', head: true })
        .eq("status", "approved");

      // Get pending documents count
      const { count: pendingDocs } = await supabase
        .from("verification_documents")
        .select("*", { count: 'exact', head: true })
        .eq("status", "pending");

      // Get high-risk screenings count
      const { count: highRiskScreenings } = await supabase
        .from("sanctions_screenings")
        .select("*", { count: 'exact', head: true })
        .eq("risk_level", "high");

      // Get sanctions entities count
      const { count: sanctionsCount } = await supabase
        .from("sanctions_entities")
        .select("*", { count: 'exact', head: true });

      // Get last sync date
      const { data: lastSync } = await supabase
        .from("sanctions_lists")
        .select("last_updated")
        .order("last_updated", { ascending: false })
        .limit(1)
        .single();

      setOverview({
        totalUsers: totalDocs || 0,
        verifiedUsers: approvedDocs || 0,
        pendingVerifications: pendingDocs || 0,
        highRiskScreenings: highRiskScreenings || 0,
        sanctionsEntities: sanctionsCount || 0,
        lastSyncDate: lastSync?.last_updated || new Date().toISOString()
      });
    } catch (error) {
      console.error("Error fetching security overview:", error);
    } finally {
      setLoading(false);
    }
  };

  const syncSanctionsData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await supabase.functions.invoke('sanctions-sync');
      fetchSecurityOverview(); // Refresh data
    } catch (error) {
      console.error("Error syncing sanctions data:", error);
    }
  };

  const verificationRate = overview 
    ? Math.round((overview.verifiedUsers / Math.max(overview.totalUsers, 1)) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-slate-800 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Fortress of Trust Dashboard</h2>
        <p className="text-slate-400">System-wide security and verification overview</p>
      </div>

      {/* Security Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-primary" />
              <Badge className="bg-info/20 text-info border-info/30">
                Total
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {overview?.totalUsers || 0}
            </div>
            <p className="text-xs text-slate-400">Total Users</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <Badge className="bg-success/20 text-success border-success/30">
                {verificationRate}%
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {overview?.verifiedUsers || 0}
            </div>
            <p className="text-xs text-slate-400">Verified Users</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-5 w-5 text-warning" />
              <Badge className="bg-warning/20 text-warning border-warning/30">
                Pending
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {overview?.pendingVerifications || 0}
            </div>
            <p className="text-xs text-slate-400">Pending Reviews</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-5 w-5 text-error" />
              <Badge className="bg-error/20 text-error border-error/30">
                High Risk
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {overview?.highRiskScreenings || 0}
            </div>
            <p className="text-xs text-slate-400">Risk Alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Sanctions Database
            </CardTitle>
            <CardDescription className="text-slate-400">
              OpenSanctions integration status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Entities in Database:</span>
              <Badge variant="outline" className="font-mono">
                {overview?.sanctionsEntities?.toLocaleString() || 0}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Last Sync:</span>
              <span className="text-sm text-slate-300">
                {overview?.lastSyncDate 
                  ? new Date(overview.lastSyncDate).toLocaleDateString()
                  : 'Never'
                }
              </span>
            </div>
            {userRole === 'admin' && (
              <Button
                onClick={syncSanctionsData}
                variant="outline"
                size="sm"
                className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                <Activity className="mr-2 h-4 w-4" />
                Sync Database
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Verification Progress
            </CardTitle>
            <CardDescription className="text-slate-400">
              Overall platform verification status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Verification Rate</span>
                <span className="text-white">{verificationRate}%</span>
              </div>
              <Progress value={verificationRate} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-success">{overview?.verifiedUsers || 0}</div>
                <div className="text-slate-400">Verified</div>
              </div>
              <div>
                <div className="text-warning">{overview?.pendingVerifications || 0}</div>
                <div className="text-slate-400">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Overview */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Fortress of Trust Features</CardTitle>
          <CardDescription className="text-slate-400">
            Multi-layered security and verification system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="text-white font-medium">Document Verification</h4>
                  <p className="text-sm text-slate-400">Professional credential validation</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Search className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="text-white font-medium">Sanctions Screening</h4>
                  <p className="text-sm text-slate-400">Global watchlist verification</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="text-white font-medium">Risk Assessment</h4>
                  <p className="text-sm text-slate-400">Automated threat detection</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Activity className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="text-white font-medium">Continuous Monitoring</h4>
                  <p className="text-sm text-slate-400">Ongoing compliance tracking</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
