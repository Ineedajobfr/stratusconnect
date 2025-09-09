import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar, 
  Briefcase, 
  Bell, 
  MessageCircle, 
  Settings, 
  Plane,
  Star,
  Utensils
} from "lucide-react";

export default function SimpleCrewDashboard() {
  const [activeTab, setActiveTab] = useState('profile');

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
            <div className="text-sm text-slate-400">CREW TERMINAL</div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-sm text-slate-400">CREW</div>
              <div className="text-lg font-bold text-orange-400">Emma Davis</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono text-orange-400">
                {new Date().toLocaleTimeString()}
              </div>
              <div className="text-sm text-slate-400">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="profile" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="availability" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Briefcase className="h-4 w-4 mr-2" />
              Opportunities
            </TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Plane className="h-4 w-4 mr-2" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Utensils className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <MessageCircle className="h-4 w-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-orange-400">Crew Profile</CardTitle>
                <CardDescription>Your professional aviation service profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-xl">ED</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">Emma Davis</div>
                    <div className="text-slate-400">Senior Flight Attendant</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        Verified
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-slate-400">4.8 (32 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Certifications</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-slate-300">Safety Training</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-slate-300">First Aid/CPR</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-slate-300">Food Safety</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-slate-300">VIP Training</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Languages</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-slate-300">English</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-slate-300">French</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-slate-300">Spanish</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-slate-300">Italian</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Experience</h4>
                  <p className="text-slate-300">6 years private aviation, 4 years commercial</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-slate-700 text-slate-300 border-slate-600">Luxury Service</Badge>
                    <Badge className="bg-slate-700 text-slate-300 border-slate-600">International Flights</Badge>
                    <Badge className="bg-slate-700 text-slate-300 border-slate-600">Catering</Badge>
                    <Badge className="bg-slate-700 text-slate-300 border-slate-600">VIP Clients</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs with simple content */}
          <TabsContent value="availability" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Schedule & Availability</h2>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center text-slate-400">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                  <p>Schedule calendar coming soon!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Job Opportunities</h2>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center text-slate-400">
                  <Briefcase className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                  <p>Job opportunities coming soon!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Current Assignments</h2>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center text-slate-400">
                  <Plane className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                  <p>Current assignments coming soon!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Service Capabilities</h2>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center text-slate-400">
                  <Utensils className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                  <p>Service capabilities coming soon!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Notifications</h2>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center text-slate-400">
                  <Bell className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                  <p>No notifications yet!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Messages</h2>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center text-slate-400">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                  <p>No messages yet!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Settings & Verification</h2>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center text-slate-400">
                  <Settings className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                  <p>Settings coming soon!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
