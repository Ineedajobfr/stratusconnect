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
  Navigation, Wind, Thermometer, Droplets, Eye, EyeOff, Compass,
  Briefcase, User, Phone, Mail, Map, Calendar as CalendarIcon
} from "lucide-react";

export const PilotCockpit: React.FC = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-6 py-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-black font-bold text-sm">P</span>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">STRATUSCONNECT</span>
                <div className="text-sm text-slate-400 font-medium">PILOT DASHBOARD</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <div className="text-sm text-slate-400 font-medium">PILOT</div>
              <div className="text-lg font-bold text-cyan-400">Capt. Sarah Johnson</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-mono text-cyan-400 font-light">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-slate-400 font-medium">{formatDate(currentTime)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800/80 backdrop-blur-sm border-slate-700/50 rounded-xl p-1 shadow-lg">
            <TabsTrigger value="schedule" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300">
              <Briefcase className="h-4 w-4 mr-2" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upcoming Flights */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700/50 shadow-xl rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-cyan-400 text-xl font-bold">Upcoming Flights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-5 bg-slate-700/80 backdrop-blur-sm rounded-xl border border-slate-600/50 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Plane className="h-6 w-6 text-black" />
                          </div>
                          <div>
                            <div className="font-semibold text-white">Charter Flight #CF-2025-001</div>
                            <div className="text-sm text-slate-400">JFK → LAX • Gulfstream G550</div>
                            <div className="text-sm text-slate-400">8 passengers • 6h 30m</div>
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
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">This Month</CardTitle>
            </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-slate-700 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-white">12</div>
                        <div className="text-sm text-slate-400">Flights</div>
                      </div>
                      <div className="bg-slate-700 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-white">45.2</div>
                        <div className="text-sm text-slate-400">Hours</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">On-Time Rate</span>
                        <span className="text-green-400">98.5%</span>
                  </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '98.5%'}}></div>
                </div>
              </div>
            </CardContent>
          </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm Next Flight
                    </Button>
                    <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white">
                      <FileText className="h-4 w-4 mr-2" />
                      View Flight Brief
                    </Button>
                    <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Dispatch
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
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
                          <span className="text-white">Sarah Johnson (You)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">First Officer:</span>
                          <span className="text-white">Mike Chen</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Flight Attendant:</span>
                          <span className="text-white">Emma Davis</span>
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

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Personal Information</CardTitle>
            </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Name:</span>
                      <span className="text-white">Capt. Sarah Johnson</span>
                </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">License:</span>
                      <span className="text-white">ATP #1234567</span>
              </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Medical:</span>
                      <span className="text-green-400">Valid until Dec 2025</span>
                </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Hours:</span>
                      <span className="text-white">8,500</span>
              </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Aircraft Types:</span>
                      <span className="text-white">G550, Citation XLS, Challenger 350</span>
              </div>
              </div>
            </CardContent>
          </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Performance</CardTitle>
            </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">On-Time Rate:</span>
                      <span className="text-green-400">98.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Rating:</span>
                      <span className="text-yellow-400">4.8/5.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">This Month:</span>
                      <span className="text-white">45.2 hours</span>
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

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-cyan-400">Recent Notifications</CardTitle>
            </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-slate-700 rounded-lg">
                  <Bell className="h-5 w-5 text-cyan-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-white">New Assignment</div>
                    <div className="text-sm text-slate-400">You've been assigned to Charter Flight #CF-2025-001</div>
                    <div className="text-xs text-slate-500">2 hours ago</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-slate-700 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-white">Flight Confirmed</div>
                    <div className="text-sm text-slate-400">Charter Flight #CF-2025-000 has been confirmed</div>
                    <div className="text-xs text-slate-500">1 day ago</div>
              </div>
              </div>
                <div className="flex items-start space-x-3 p-3 bg-slate-700 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-white">Schedule Change</div>
                    <div className="text-sm text-slate-400">Departure time updated for tomorrow's flight</div>
                    <div className="text-xs text-slate-500">2 days ago</div>
              </div>
              </div>
            </CardContent>
          </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
