// Beta Crew Terminal - Demo Bots Testing
// FCA Compliant Aviation Platform - Proof of Life System

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, Clock, CheckCircle, AlertCircle,
  Calendar, MapPin, DollarSign, TrendingUp, User
} from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
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
