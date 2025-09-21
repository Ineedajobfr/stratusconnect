import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plane, Clock, CheckCircle, AlertCircle, Bell, MapPin, Users, Calendar, 
  Shield, Award, FileText, DollarSign, Star, BarChart3, TrendingUp, 
  TrendingDown, Activity, Zap, Target, Globe, Database, Settings,
  Play, Pause, Volume2, MoreHorizontal, ArrowRight, Triangle, Gauge,
  Navigation, Wind, Thermometer, Droplets, Eye, EyeOff,
  Briefcase, User, Phone, Mail, Map, Calendar as CalendarIcon,
  Coffee, Utensils, Wifi, Headphones
} from "lucide-react";
import { FlightRadar24Widget } from "../flight-tracking/FlightRadar24Widget";
import { PersonalizedFeed } from "../feed/PersonalizedFeed";
import { MobileResponsive, MobileGrid, MobileText } from "../MobileResponsive";

export const CrewFlightDeck: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("schedule");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold">STRATUSCONNECT</span>
            </div>
            <div className="text-sm text-slate-400">CREW DASHBOARD</div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-sm text-slate-400">CREW</div>
              <div className="text-lg font-bold text-orange-400">Emma Davis</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono text-orange-400">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-slate-400">{formatDate(currentTime)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-terminal-card border-terminal-border grid grid-cols-2 sm:grid-cols-4 text-xs sm:text-sm tabs-modern">
            <TabsTrigger value="schedule" className="data-[state=active]:bg-accent data-[state=active]:text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-accent data-[state=active]:text-white">
              <Briefcase className="h-4 w-4 mr-2" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-accent data-[state=active]:text-white">
              <Utensils className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-accent data-[state=active]:text-white">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6">
            {/* Flight Tracking Widget */}
            <Card className="bg-terminal-card border-terminal-border">
              <CardHeader>
                <CardTitle className="text-cyan-400">Live Flight Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <FlightRadar24Widget />
              </CardContent>
            </Card>

            {/* Personalized Feed */}
            <PersonalizedFeed />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upcoming Assignments */}
              <div className="lg:col-span-2">
                <Card className="bg-terminal-card border-terminal-border">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">Upcoming Assignments</CardTitle>
            </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg border border-slate-600">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center">
                            <Plane className="h-6 w-6 text-black" />
                </div>
                          <div>
                            <div className="font-semibold text-white">Charter Flight #CF-2025-001</div>
                            <div className="text-sm text-slate-400">JFK → LAX • Gulfstream G550</div>
                            <div className="text-sm text-slate-400">8 passengers • 6h 30m</div>
                            <div className="text-sm text-slate-400">Role: Flight Attendant</div>
                </div>
                </div>
                        <div className="text-right">
                          <div className="text-cyan-400 font-semibold">Tomorrow 14:30</div>
                          <Badge className="bg-green-500 text-white">Confirmed</Badge>
                </div>
              </div>

                      <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg border border-slate-600">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                            <Plane className="h-6 w-6 text-slate-400" />
                </div>
                  <div>
                            <div className="font-semibold text-white">Charter Flight #CF-2025-002</div>
                            <div className="text-sm text-slate-400">LAX → MIA • Citation XLS</div>
                            <div className="text-sm text-slate-400">4 passengers • 4h 15m</div>
                            <div className="text-sm text-slate-400">Role: Flight Attendant</div>
                  </div>
                </div>
                        <div className="text-right">
                          <div className="text-cyan-400 font-semibold">Jan 12, 09:00</div>
                          <Badge className="bg-yellow-500 text-black">Pending</Badge>
                </div>
              </div>

                      <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg border border-slate-600">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                            <Plane className="h-6 w-6 text-slate-400" />
                          </div>
                          <div>
                            <div className="font-semibold text-white">Charter Flight #CF-2025-003</div>
                            <div className="text-sm text-slate-400">MIA → TEB • Challenger 350</div>
                            <div className="text-sm text-slate-400">6 passengers • 2h 45m</div>
                            <div className="text-sm text-slate-400">Role: Flight Attendant</div>
              </div>
              </div>
                        <div className="text-right">
                          <div className="text-cyan-400 font-semibold">Jan 15, 16:00</div>
                          <Badge className="bg-blue-500 text-white">Tentative</Badge>
                </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <Card className="bg-terminal-card border-terminal-border">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">This Month</CardTitle>
            </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-slate-700 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-white">15</div>
                        <div className="text-sm text-slate-400">Flights</div>
                      </div>
                      <div className="bg-slate-700 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-white">68.5</div>
                        <div className="text-sm text-slate-400">Hours</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Service Rating</span>
                        <span className="text-white">4.9/5.0</span>
                  </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '98%'}}></div>
                </div>
              </div>
            </CardContent>
          </Card>

                <Card className="bg-terminal-card border-terminal-border">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm Assignment
                    </Button>
                    <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white">
                      <FileText className="h-4 w-4 mr-2" />
                      View Briefing
                    </Button>
                    <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Crew Lead
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <Card className="bg-terminal-card border-terminal-border">
              <CardHeader>
                <CardTitle className="text-cyan-400">Current Assignment</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-slate-700 p-4 rounded-lg">
                      <h3 className="font-semibold text-white mb-2">Flight Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Flight Number:</span>
                          <span className="text-white">CF-2025-001</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Route:</span>
                          <span className="text-white">JFK → LAX</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Aircraft:</span>
                          <span className="text-white">Gulfstream G550</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Departure:</span>
                          <span className="text-white">Tomorrow 14:30</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Duration:</span>
                          <span className="text-white">6h 30m</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-slate-700 p-4 rounded-lg">
                      <h3 className="font-semibold text-white mb-2">Crew Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Captain:</span>
                          <span className="text-white">Sarah Johnson</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">First Officer:</span>
                          <span className="text-white">Mike Chen</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Flight Attendant:</span>
                          <span className="text-white">Emma Davis (You)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Passengers:</span>
                          <span className="text-white">8</span>
                        </div>
                  </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-terminal-card border-terminal-border">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Catering & Services</CardTitle>
            </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Coffee className="h-5 w-5 text-cyan-400" />
                        <div>
                          <div className="font-semibold text-white">Premium Coffee Service</div>
                          <div className="text-sm text-slate-400">Espresso, Cappuccino, Latte</div>
                </div>
              </div>
                      <Badge className="bg-green-500 text-white">Ready</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Utensils className="h-5 w-5 text-cyan-400" />
                        <div>
                          <div className="font-semibold text-white">Gourmet Meals</div>
                          <div className="text-sm text-slate-400">3-course dinner service</div>
                </div>
              </div>
                      <Badge className="bg-yellow-500 text-black">Preparing</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Wifi className="h-5 w-5 text-cyan-400" />
                        <div>
                          <div className="font-semibold text-white">WiFi & Entertainment</div>
                          <div className="text-sm text-slate-400">High-speed internet, movies</div>
                </div>
              </div>
                      <Badge className="bg-green-500 text-white">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

              <Card className="bg-terminal-card border-terminal-border">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Passenger Preferences</CardTitle>
            </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="bg-slate-700 p-3 rounded-lg">
                      <div className="font-semibold text-white mb-2">Mr. Johnson (Seat 1A)</div>
                      <div className="text-sm text-slate-400">Dietary: Vegetarian, Allergies: None</div>
                      <div className="text-sm text-slate-400">Beverage: Sparkling water, Wine: Red</div>
                    </div>
                    <div className="bg-slate-700 p-3 rounded-lg">
                      <div className="font-semibold text-white mb-2">Ms. Smith (Seat 1B)</div>
                      <div className="text-sm text-slate-400">Dietary: Gluten-free, Allergies: Nuts</div>
                      <div className="text-sm text-slate-400">Beverage: Still water, Wine: White</div>
              </div>
                    <div className="bg-slate-700 p-3 rounded-lg">
                      <div className="font-semibold text-white mb-2">Dr. Williams (Seat 2A)</div>
                      <div className="text-sm text-slate-400">Dietary: Standard, Allergies: None</div>
                      <div className="text-sm text-slate-400">Beverage: Coffee, Wine: Champagne</div>
              </div>
              </div>
            </CardContent>
          </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-terminal-card border-terminal-border">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Personal Information</CardTitle>
            </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Name:</span>
                      <span className="text-white">Emma Davis</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Position:</span>
                      <span className="text-white">Senior Flight Attendant</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Certifications:</span>
                      <span className="text-white">Valid until Mar 2025</span>
              </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Experience:</span>
                      <span className="text-white">1,500 hours</span>
              </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Aircraft Types:</span>
                      <span className="text-white">G550, Citation XLS, Challenger 350</span>
              </div>
              </div>
            </CardContent>
          </Card>

              <Card className="bg-terminal-card border-terminal-border">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Performance</CardTitle>
            </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Service Rating:</span>
                      <span className="text-white">4.9/5.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Punctuality:</span>
                      <span className="text-white">100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">This Month:</span>
                      <span className="text-white">68.5 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Last Flight:</span>
                      <span className="text-white">Jan 8, 2025</span>
                    </div>
                  </div>
            </CardContent>
          </Card>
        </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
