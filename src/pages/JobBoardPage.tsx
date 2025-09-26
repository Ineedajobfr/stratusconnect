import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  MessageSquare, 
  Heart, 
  Users, 
  TrendingUp, 
  Shield,
  FileText,
  Download,
  Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import JobBoard from '@/components/job-board/JobBoard';
import JobApplication from '@/components/job-board/JobApplication';
import CommunityForums from '@/components/community/CommunityForums';
import SavedCrews from '@/components/job-board/SavedCrews';
import UserMonitoring from '@/components/admin/UserMonitoring';

export default function JobBoardPage() {
  const { user } = useAuth();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showApplication, setShowApplication] = useState(false);

  const userRole = user?.user_metadata?.role || 'pilot';

  const handleApplyToJob = (jobId: string) => {
    setSelectedJobId(jobId);
    setShowApplication(true);
  };

  const handleCloseApplication = () => {
    setShowApplication(false);
    setSelectedJobId(null);
  };

  if (showApplication && selectedJobId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <JobApplication 
          jobId={selectedJobId} 
          onClose={handleCloseApplication}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-terminal-bg border-terminal-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Briefcase className="h-8 w-8 text-terminal-accent" />
                <div>
                  <p className="text-sm text-terminal-muted">Active Jobs</p>
                  <p className="text-2xl font-bold text-terminal-fg">127</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-terminal-bg border-terminal-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-terminal-accent" />
                <div>
                  <p className="text-sm text-terminal-muted">Total Applications</p>
                  <p className="text-2xl font-bold text-terminal-fg">1,234</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-terminal-bg border-terminal-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-8 w-8 text-terminal-accent" />
                <div>
                  <p className="text-sm text-terminal-muted">Forum Posts</p>
                  <p className="text-2xl font-bold text-terminal-fg">456</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-terminal-bg border-terminal-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-terminal-accent" />
                <div>
                  <p className="text-sm text-terminal-muted">Success Rate</p>
                  <p className="text-2xl font-bold text-terminal-fg">94%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="bg-terminal-bg border-terminal-border">
            <TabsTrigger value="jobs" className="data-[state=active]:bg-terminal-accent data-[state=active]:text-terminal-bg">
              <Briefcase className="h-4 w-4 mr-2" />
              Job Board
            </TabsTrigger>
            <TabsTrigger value="forums" className="data-[state=active]:bg-terminal-accent data-[state=active]:text-terminal-bg">
              <MessageSquare className="h-4 w-4 mr-2" />
              Community
            </TabsTrigger>
            {(userRole === 'broker' || userRole === 'operator') && (
              <TabsTrigger value="saved" className="data-[state=active]:bg-terminal-accent data-[state=active]:text-terminal-bg">
                <Heart className="h-4 w-4 mr-2" />
                Saved Crews
              </TabsTrigger>
            )}
            {userRole === 'admin' && (
              <TabsTrigger value="monitoring" className="data-[state=active]:bg-terminal-accent data-[state=active]:text-terminal-bg">
                <Shield className="h-4 w-4 mr-2" />
                User Monitoring
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            <JobBoard userRole={userRole} />
          </TabsContent>

          <TabsContent value="forums" className="space-y-6">
            <CommunityForums userRole={userRole} />
          </TabsContent>

          {(userRole === 'broker' || userRole === 'operator') && (
            <TabsContent value="saved" className="space-y-6">
              <SavedCrews brokerId={user?.id || ''} />
            </TabsContent>
          )}

          {userRole === 'admin' && (
            <TabsContent value="monitoring" className="space-y-6">
              <UserMonitoring />
            </TabsContent>
          )}
        </Tabs>

        {/* Quick Actions */}
        <Card className="bg-terminal-bg border-terminal-border">
          <CardHeader>
            <CardTitle className="text-terminal-fg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(userRole === 'broker' || userRole === 'operator') && (
                <Button className="bg-terminal-accent hover:bg-terminal-accent/90 h-20 flex-col space-y-2">
                  <Briefcase className="h-6 w-6" />
                  <span>Post New Job</span>
                </Button>
              )}
              
              {(userRole === 'pilot' || userRole === 'crew') && (
                <Button className="bg-terminal-accent hover:bg-terminal-accent/90 h-20 flex-col space-y-2">
                  <FileText className="h-6 w-6" />
                  <span>View My Applications</span>
                </Button>
              )}
              
              <Button className="bg-terminal-accent hover:bg-terminal-accent/90 h-20 flex-col space-y-2">
                <MessageSquare className="h-6 w-6" />
                <span>Browse Forums</span>
              </Button>
              
              <Button className="bg-terminal-accent hover:bg-terminal-accent/90 h-20 flex-col space-y-2">
                <Download className="h-6 w-6" />
                <span>Download Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
