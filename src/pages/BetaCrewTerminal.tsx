// Beta Crew Terminal - Demo Bots Testing
// FCA Compliant Aviation Platform - Proof of Life System

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Clock,
    DollarSign, TrendingUp,
    Users
} from 'lucide-react';
import { useState } from 'react';

export default function BetaCrewTerminal() {
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const handleAcceptAssignment = (assignmentId: string) => {
    // Simulate assignment acceptance
    alert('Assignment accepted successfully!');
  };

  const availableAssignments = [
    {
      id: 'CREW-001',
      route: 'London Luton → Nice',
      date: '2025-10-10',
      aircraft: 'Gulfstream G550',
      operator: 'AeroOps Ltd',
      rate: 750,
      currency: 'GBP',
      status: 'available',
      duration: '2 days',
      role: 'Flight Attendant'
    },
    {
      id: 'CREW-002',
      route: 'Farnborough → Cannes',
      date: '2025-10-12',
      aircraft: 'Citation XLS',
      operator: 'SkyCharter',
      rate: 650,
      currency: 'GBP',
      status: 'available',
      duration: '1 day',
      role: 'Flight Attendant'
    },
    {
      id: 'CREW-003',
      route: 'Heathrow → Geneva',
      date: '2025-10-15',
      aircraft: 'Bombardier Global',
      operator: 'Elite Aviation',
      rate: 850,
      currency: 'GBP',
      status: 'pending',
      duration: '3 days',
      role: 'Senior Flight Attendant'
    }
  ];

  const currentAssignments = [
    {
      id: 'CREW-004',
      route: 'London Luton → Nice',
      date: '2025-10-08',
      aircraft: 'Gulfstream G550',
      operator: 'AeroOps Ltd',
      rate: 750,
      currency: 'GBP',
      status: 'active',
      duration: '2 days',
      role: 'Flight Attendant'
    }
  ];

  const crewStats = {
    totalFlights: 32,
    totalHours: 180,
    averageRate: 720,
    rating: 4.9
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cinematic Burnt Orange to Obsidian Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139, 69, 19, 0.9) 0%, rgba(91, 30, 13, 0.95) 25%, rgba(59, 30, 13, 0.98) 50%, rgba(20, 20, 20, 0.99) 75%, rgba(10, 10, 12, 1) 100%), linear-gradient(135deg, #3b1e0d 0%, #2d1a0a 25%, #1a0f08 50%, #0f0a06 75%, #0a0a0c 100%)',
        }}
      />
      
      {/* Cinematic Vignette - Creates spotlight effect on center */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at center, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0.3) 80%, rgba(0, 0, 0, 0.6) 100%)',
        }}
      />
      
      {/* Subtle golden-orange glow in the center */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at center, rgba(255, 140, 0, 0.08) 0%, rgba(255, 140, 0, 0.04) 30%, transparent 60%)',
        }}
      />
      
      {/* Subtle grid pattern overlay - more refined */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgTCAwIDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4=')] opacity-30"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Beta Crew Terminal</h1>
          <p className="text-slate-300">Professional crew member job management and assignments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="terminal-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Flights</p>
                  <p className="text-2xl font-bold text-white">{crewStats.totalFlights}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="terminal-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Flight Hours</p>
                  <p className="text-2xl font-bold text-white">{crewStats.totalHours}</p>
                </div>
                <Clock className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="terminal-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Avg Rate</p>
                  <p className="text-2xl font-bold text-white">£{crewStats.averageRate}</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="terminal-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Rating</p>
                  <p className="text-2xl font-bold text-white">{crewStats.rating}/5</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="assignments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assignments">Available Assignments</TabsTrigger>
            <TabsTrigger value="current">Current Assignments</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="assignments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Available Assignments</h2>
            </div>

            <div className="grid gap-4">
              {availableAssignments.map((assignment) => (
                <Card key={assignment.id} className="terminal-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-lg font-semibold text-white">{assignment.id}</h3>
                          <Badge 
                            className={assignment.status === 'available' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}
                          >
                            {assignment.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-slate-400">Route</p>
                            <p className="text-white">{assignment.route}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Date</p>
                            <p className="text-white">{assignment.date}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Aircraft</p>
                            <p className="text-white">{assignment.aircraft}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Operator</p>
                            <p className="text-white">{assignment.operator}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-2">
                          <div>
                            <p className="text-slate-400">Rate</p>
                            <p className="text-white">{assignment.currency} {assignment.rate}/day</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Duration</p>
                            <p className="text-white">{assignment.duration}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Role</p>
                            <p className="text-white">{assignment.role}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {assignment.status === 'available' && (
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleAcceptAssignment(assignment.id)}
                          >
                            Accept Assignment
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="current" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Current Assignments</h2>
            </div>

            <div className="grid gap-4">
              {currentAssignments.map((assignment) => (
                <Card key={assignment.id} className="terminal-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-lg font-semibold text-white">{assignment.id}</h3>
                          <Badge className="bg-blue-500/20 text-blue-400">
                            {assignment.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-slate-400">Route</p>
                            <p className="text-white">{assignment.route}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Date</p>
                            <p className="text-white">{assignment.date}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Aircraft</p>
                            <p className="text-white">{assignment.aircraft}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Operator</p>
                            <p className="text-white">{assignment.operator}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-2">
                          <div>
                            <p className="text-slate-400">Rate</p>
                            <p className="text-white">{assignment.currency} {assignment.rate}/day</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Duration</p>
                            <p className="text-white">{assignment.duration}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Role</p>
                            <p className="text-white">{assignment.role}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          Update Status
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Crew Profile</h2>
            <Card className="terminal-card">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-slate-400 text-sm">Name</p>
                        <p className="text-white">Nadia Crew</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Role</p>
                        <p className="text-white">Senior Flight Attendant</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Experience</p>
                        <p className="text-white">6 years</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Certifications</h3>
                    <div className="space-y-2">
                      <Badge className="bg-green-500/20 text-green-400">Safety Training</Badge>
                      <Badge className="bg-green-500/20 text-green-400">First Aid</Badge>
                      <Badge className="bg-green-500/20 text-green-400">Service Excellence</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
