import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Info, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Report = {
  id: string;
  created_at: string;
  agent: string;
  topic: string;
  summary: string;
  severity: string;
  details: any;
};

export default function AdminAgentReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    
    // Load initial reports
    supabase
      .from("agent_reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        if (alive && data) setReports(data as Report[]);
        setLoading(false);
      });

    // Subscribe to new reports
    const sub = supabase
      .channel("agent_reports")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "agent_reports" },
        (payload) => setReports((prev) => [payload.new as Report, ...prev])
      )
      .subscribe();

    return () => {
      alive = false;
      supabase.removeChannel(sub);
    };
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terminal-bg p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Agent Reports</h1>
          <p className="text-gunmetal">
            Real-time monitoring of AI agents working on your platform
          </p>
        </div>

        <div className="grid gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="terminal-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getSeverityIcon(report.severity)}
                    <CardTitle className="text-lg">{report.agent}</CardTitle>
                    <Badge className={getSeverityColor(report.severity)}>
                      {report.severity}
                    </Badge>
                  </div>
                  <span className="text-sm text-gunmetal">
                    {new Date(report.created_at).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-md font-medium text-foreground">{report.topic}</h3>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-foreground whitespace-pre-wrap">
                  {report.summary}
                </div>
                {report.details && Object.keys(report.details).length > 0 && (
                  <div className="mt-4 p-3 bg-terminal-bg rounded border">
                    <h4 className="text-sm font-medium text-foreground mb-2">Details:</h4>
                    <pre className="text-xs text-gunmetal overflow-x-auto">
                      {JSON.stringify(report.details, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {reports.length === 0 && (
          <Card className="terminal-card">
            <CardContent className="text-center py-12">
              <Info className="h-12 w-12 text-gunmetal mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Reports Yet</h3>
              <p className="text-gunmetal">
                AI agents will start generating reports as they monitor your platform
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
