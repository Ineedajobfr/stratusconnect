import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Plane, 
  Users, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  TrendingUp,
  Clock,
  BarChart3,
  UserCheck,
  Calendar
} from 'lucide-react';

interface Job {
  id: string;
  operator: string;
  route: string;
  aircraft: string;
  date: string;
  duration: string;
  pay: number;
  currency: string;
  status: 'available' | 'applied' | 'accepted' | 'completed';
}

export default function DemoPilotTerminal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 'J-001',
      operator: 'Elite Aviation',
      route: 'London - New York',
      aircraft: 'Gulfstream G650',
      date: '2024-01-20',
      duration: '8 hours',
      pay: 2500,
      currency: 'USD',
      status: 'available'
    },
    {
      id: 'J-002',
      operator: 'SkyHigh Jets',
      route: 'Paris - Dubai',
      aircraft: 'Bombardier Global 7500',
      date: '2024-01-22',
      duration: '12 hours',
      pay: 3200,
      currency: 'USD',
      status: 'available'
    },
    {
      id: 'J-003',
      operator: 'Prime Wings',
      route: 'New York - Los Angeles',
      aircraft: 'Gulfstream G650',
      date: '2024-01-25',
      duration: '6 hours',
      pay: 2800,
      currency: 'USD',
      status: 'applied'
    }
  ]);

  const isDemoMode = import.meta.env.VITE_SC_DEMO_MODE === 'true';

  const applyForJob = (job: Job) => {
    setJobs(prev => 
      prev.map(j => 
        j.id === job.id ? { ...j, status: 'applied' as const } : j
      )
    );
    alert(`Applied for ${job.operator} - ${job.route}\n\nPay: $${job.pay.toLocaleString()}\nPlatform Fee: $0 (Pilots pay nothing)\n\nIn production, this would notify the operator of your application.`);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="terminal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">Available Jobs</p>
                <p className="text-2xl font-bold text-foreground">
                  {jobs.filter(j => j.status === 'available').length}
                </p>
              </div>
              <Plane className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">Applications</p>
                <p className="text-2xl font-bold text-foreground">
                  {jobs.filter(j => j.status === 'applied').length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">Completed</p>
                <p className="text-2xl font-bold text-foreground">
                  {jobs.filter(j => j.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">Total Earned</p>
                <p className="text-2xl font-bold text-foreground">
                  ${jobs.filter(j => j.status === 'completed').reduce((sum, j) => sum + j.pay, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Platform Fee Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Zero Platform Fees for Pilots</p>
                <p className="text-green-700 text-sm">
                  Pilots and crew members pay absolutely nothing to use the platform. 
                  All earnings go directly to you with no deductions.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Available Jobs</h2>
      <div className="space-y-4">
        {jobs.map(job => (
          <Card key={job.id} className="terminal-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Plane className="w-5 h-5" />
                    {job.operator}
                  </CardTitle>
                  <p className="text-gunmetal">{job.route} • {job.aircraft}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={
                    job.status === 'completed' ? 'bg-green-100 text-green-800' :
                    job.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }>
                    {job.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gunmetal">Date</p>
                  <p className="font-medium">{new Date(job.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gunmetal">Duration</p>
                  <p className="font-medium">{job.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gunmetal">Pay</p>
                  <p className="font-medium font-mono">${job.pay.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gunmetal">Platform Fee</p>
                  <p className="font-medium text-green-600">$0</p>
                </div>
              </div>
              
              {job.status === 'available' && (
                <Button
                  onClick={() => applyForJob(job)}
                  className="w-full btn-terminal-accent"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Apply for Job
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-terminal-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pilot Terminal</h1>
            <p className="text-gunmetal">Professional Flight Deck</p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-green-100 text-green-800">
              <Shield className="w-3 h-3 mr-1" />
              FCA Compliant
            </Badge>
            {isDemoMode && (
              <Badge className="bg-yellow-100 text-yellow-800">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Demo Mode
              </Badge>
            )}
          </div>
        </div>

        {/* Zero Fee Notice */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-800">Zero Platform Fees</h3>
                <p className="text-green-700 text-sm mt-1">
                  Pilots and crew members pay absolutely nothing to use the platform. 
                  All earnings go directly to you with no deductions or hidden fees.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setActiveTab('dashboard')}
            variant={activeTab === 'dashboard' ? 'default' : 'outline'}
          >
            Dashboard
          </Button>
          <Button
            onClick={() => setActiveTab('jobs')}
            variant={activeTab === 'jobs' ? 'default' : 'outline'}
          >
            Available Jobs
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' ? renderDashboard() : renderJobs()}

        {/* Demo Notice */}
        {isDemoMode && (
          <Card className="mt-8 bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800">Demo Mode</h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    This terminal demonstrates the pilot experience with zero platform fees. 
                    In production, this would connect to real job postings and operator systems.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}