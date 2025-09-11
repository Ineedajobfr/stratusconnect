import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
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
  UserPlus,
  UserCheck
} from 'lucide-react';

interface Pilot {
  id: string;
  name: string;
  license: string;
  expiry: string;
  verified: boolean;
  kycStatus: 'pending' | 'verified' | 'rejected';
  experience: string;
  rating: number;
}

interface Crew {
  id: string;
  name: string;
  role: string;
  certification: string;
  expiry: string;
  verified: boolean;
  kycStatus: 'pending' | 'verified' | 'rejected';
  experience: string;
  rating: number;
}

interface HiringRequest {
  id: string;
  type: 'pilot' | 'crew';
  candidate: Pilot | Crew;
  status: 'pending' | 'approved' | 'rejected' | 'hired';
  hiringFee: number;
  currency: string;
}

export default function DemoOperatorTerminal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [kycStatus, setKycStatus] = useState<'pending' | 'verified' | 'rejected'>('pending');
  const [hiringRequests, setHiringRequests] = useState<HiringRequest[]>([]);

  const [pilots] = useState<Pilot[]>([
    {
      id: 'P-001',
      name: 'Captain Sarah Johnson',
      license: 'ATPL',
      expiry: '2025-06-15',
      verified: true,
      kycStatus: 'verified',
      experience: '15 years',
      rating: 4.9
    },
    {
      id: 'P-002',
      name: 'Captain Mike Chen',
      license: 'ATPL',
      expiry: '2024-12-20',
      verified: true,
      kycStatus: 'verified',
      experience: '12 years',
      rating: 4.7
    },
    {
      id: 'P-003',
      name: 'Captain Lisa Rodriguez',
      license: 'ATPL',
      expiry: '2025-03-10',
      verified: false,
      kycStatus: 'pending',
      experience: '8 years',
      rating: 4.5
    }
  ]);

  const [crew] = useState<Crew[]>([
    {
      id: 'C-001',
      name: 'Emma Thompson',
      role: 'Flight Attendant',
      certification: 'FAA Cabin Crew',
      expiry: '2025-08-30',
      verified: true,
      kycStatus: 'verified',
      experience: '10 years',
      rating: 4.8
    },
    {
      id: 'C-002',
      name: 'James Wilson',
      role: 'Flight Engineer',
      certification: 'A&P License',
      expiry: '2024-11-15',
      verified: true,
      kycStatus: 'verified',
      experience: '18 years',
      rating: 4.9
    },
    {
      id: 'C-003',
      name: 'Maria Garcia',
      role: 'Flight Attendant',
      certification: 'EASA Cabin Crew',
      expiry: '2025-01-25',
      verified: false,
      kycStatus: 'pending',
      experience: '6 years',
      rating: 4.3
    }
  ]);

  const isDemoMode = import.meta.env.VITE_SC_DEMO_MODE === 'true';

  const submitKYC = () => {
    setKycStatus('verified');
    alert('KYC submitted successfully. Payouts are now enabled.');
  };

  const hirePilot = (pilot: Pilot) => {
    const hiringFee = 5000; // 10% of $50,000 example salary
    const hiringRequest: HiringRequest = {
      id: `HR-${Date.now()}`,
      type: 'pilot',
      candidate: pilot,
      status: 'pending',
      hiringFee: hiringFee,
      currency: 'USD'
    };

    setHiringRequests(prev => [...prev, hiringRequest]);
    alert(`Hiring request created for ${pilot.name}\n\nHiring Fee: $${hiringFee.toLocaleString()} (10%)\n\nIn production, this would process through Stripe Connect.`);
  };

  const hireCrew = (crewMember: Crew) => {
    const hiringFee = 3000; // 10% of $30,000 example salary
    const hiringRequest: HiringRequest = {
      id: `HR-${Date.now()}`,
      type: 'crew',
      candidate: crewMember,
      status: 'pending',
      hiringFee: hiringFee,
      currency: 'USD'
    };

    setHiringRequests(prev => [...prev, hiringRequest]);
    alert(`Hiring request created for ${crewMember.name}\n\nHiring Fee: $${hiringFee.toLocaleString()} (10%)\n\nIn production, this would process through Stripe Connect.`);
  };

  const processHiringPayment = (request: HiringRequest) => {
    const auditHash = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    alert(`Hiring Payment Processed\n\n` +
      `Candidate: ${request.candidate.name}\n` +
      `Role: ${request.type}\n` +
      `Hiring Fee (10%): $${request.hiringFee.toLocaleString()}\n` +
      `Audit Hash: ${auditHash}\n\n` +
      `In production, this would process through Stripe Connect with immutable audit logging.`);

    setHiringRequests(prev => 
      prev.map(hr => 
        hr.id === request.id ? { ...hr, status: 'hired' as const } : hr
      )
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="terminal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">Available Pilots</p>
                <p className="text-2xl font-bold text-foreground">{pilots.length}</p>
              </div>
              <Users className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">Available Crew</p>
                <p className="text-2xl font-bold text-foreground">{crew.length}</p>
              </div>
              <UserPlus className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">Hiring Requests</p>
                <p className="text-2xl font-bold text-foreground">{hiringRequests.length}</p>
              </div>
              <FileText className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">KYC Status</p>
                <p className="text-2xl font-bold text-foreground">
                  {kycStatus === 'verified' ? '✓' : '⚠'}
                </p>
              </div>
              <Shield className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KYC Status */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            KYC Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {kycStatus === 'verified' ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              )}
              <div>
                <p className="font-medium">
                  {kycStatus === 'verified' ? 'KYC Verified' : 'KYC Pending'}
                </p>
                <p className="text-sm text-gunmetal">
                  {kycStatus === 'verified' 
                    ? 'Payouts are enabled. You can receive payments from completed deals.'
                    : 'Complete KYC verification to enable payouts.'
                  }
                </p>
              </div>
            </div>
            {kycStatus !== 'verified' && (
              <Button onClick={submitKYC} className="btn-terminal-accent">
                Submit KYC
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPilots = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Available Pilots</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pilots.map(pilot => (
          <Card key={pilot.id} className="terminal-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {pilot.name}
                  </CardTitle>
                  <p className="text-gunmetal">{pilot.license} • {pilot.experience}</p>
                </div>
                <div className="flex gap-2">
                  {pilot.verified ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Unverified
                    </Badge>
                  )}
                  <Badge variant="outline">
                    ⭐ {pilot.rating}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gunmetal">License Expiry:</span>
                  <span className={new Date(pilot.expiry) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) ? 'text-red-600' : 'text-foreground'}>
                    {new Date(pilot.expiry).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gunmetal">KYC Status:</span>
                  <span className={
                    pilot.kycStatus === 'verified' ? 'text-green-600' :
                    pilot.kycStatus === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                  }>
                    {pilot.kycStatus}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => hirePilot(pilot)}
                className="w-full btn-terminal-accent"
                disabled={!pilot.verified || pilot.kycStatus !== 'verified'}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Hire Pilot (10% Fee)
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCrew = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Available Crew</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {crew.map(crewMember => (
          <Card key={crewMember.id} className="terminal-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {crewMember.name}
                  </CardTitle>
                  <p className="text-gunmetal">{crewMember.role} • {crewMember.experience}</p>
                </div>
                <div className="flex gap-2">
                  {crewMember.verified ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Unverified
                    </Badge>
                  )}
                  <Badge variant="outline">
                    ⭐ {crewMember.rating}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gunmetal">Certification:</span>
                  <span className="text-foreground">{crewMember.certification}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gunmetal">Expiry:</span>
                  <span className={new Date(crewMember.expiry) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) ? 'text-red-600' : 'text-foreground'}>
                    {new Date(crewMember.expiry).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gunmetal">KYC Status:</span>
                  <span className={
                    crewMember.kycStatus === 'verified' ? 'text-green-600' :
                    crewMember.kycStatus === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                  }>
                    {crewMember.kycStatus}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => hireCrew(crewMember)}
                className="w-full btn-terminal-accent"
                disabled={!crewMember.verified || crewMember.kycStatus !== 'verified'}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Hire Crew (10% Fee)
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderHiring = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Hiring Requests</h2>
      {hiringRequests.length === 0 ? (
        <Card className="terminal-card">
          <CardContent className="text-center py-8">
            <UserCheck className="w-16 h-16 mx-auto mb-4 text-accent opacity-60" />
            <p className="text-gunmetal">No hiring requests yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {hiringRequests.map(request => (
            <Card key={request.id} className="terminal-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5" />
                      {request.candidate.name}
                    </CardTitle>
                    <p className="text-gunmetal">
                      {request.type === 'pilot' ? 'Pilot' : 'Crew'} • {request.candidate.experience}
                    </p>
                  </div>
                  <Badge className={
                    request.status === 'hired' ? 'bg-green-100 text-green-800' :
                    request.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }>
                    {request.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gunmetal">Hiring Fee (10%)</p>
                    <p className="text-xl font-bold">${request.hiringFee.toLocaleString()}</p>
                  </div>
                  {request.status === 'pending' && (
                    <Button
                      onClick={() => processHiringPayment(request)}
                      className="btn-terminal-accent"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Process Payment
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-terminal-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Operator Terminal</h1>
            <p className="text-gunmetal">Mission Control Center</p>
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

        {/* Compliance Notice */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-800">Hiring Fee Structure</h3>
                <p className="text-green-700 text-sm mt-1">
                  10% hiring fee on all pilot and crew hires. Fees are automatically calculated and processed through Stripe Connect. 
                  Pilots and crew pay zero fees to the platform.
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
            onClick={() => setActiveTab('pilots')}
            variant={activeTab === 'pilots' ? 'default' : 'outline'}
          >
            Pilots
          </Button>
          <Button
            onClick={() => setActiveTab('crew')}
            variant={activeTab === 'crew' ? 'default' : 'outline'}
          >
            Crew
          </Button>
          <Button
            onClick={() => setActiveTab('hiring')}
            variant={activeTab === 'hiring' ? 'default' : 'outline'}
          >
            Hiring Requests
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'pilots' && renderPilots()}
        {activeTab === 'crew' && renderCrew()}
        {activeTab === 'hiring' && renderHiring()}

        {/* Demo Notice */}
        {isDemoMode && (
          <Card className="mt-8 bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800">Demo Mode</h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    This terminal demonstrates KYC verification and hiring fee processing. 
                    In production, all payments would be processed through Stripe Connect with immutable audit logging.
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