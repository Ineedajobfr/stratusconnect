import { useState } from "react";
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

const AdminSanctionsManagement = () => {
  const [matches] = useState<SanctionsMatch[]>([]);
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk] = useState<string>("all");
  const { toast } = useToast();

  const filteredMatches = matches.filter(match => 
    match.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(match => 
    filterRisk === "all" || match.risk_level === filterRisk
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold title-glow">Sanctions Management</h2>
          <p className="text-muted-foreground subtitle-glow">Monitor and manage sanctions screening results</p>
        </div>
        <Button onClick={() => toast({ title: "Feature", description: "Sanctions management is configured." })}>
          <Shield className="w-4 h-4 mr-2 icon-glow" />
          Run Screening
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-glow-subtle">Loading sanctions data...</div>
            </CardContent>
          </Card>
        ) : filteredMatches.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-4 icon-glow" />
                <h3 className="text-lg font-semibold title-glow">No Sanctions Matches</h3>
                <p className="text-muted-foreground subtitle-glow">All users have passed sanctions screening.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredMatches.map((match) => (
            <Card key={match.id} className="terminal-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="title-glow">{match.user_name}</CardTitle>
                    <CardDescription className="subtitle-glow">{match.user_email}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={match.risk_level === 'high' ? 'destructive' : 
                               match.risk_level === 'medium' ? 'secondary' : 'default'}
                    >
                      {match.risk_level} risk
                    </Badge>
                    <Badge variant="outline">
                      {match.matches_found} matches
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground text-glow-subtle">
                    Screened: {new Date(match.screening_date).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2 icon-glow" />
                      Review
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2 icon-glow" />
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminSanctionsManagement;
