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
  Star
} from "lucide-react";

export default function SimplePilotDashboard() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold">STRATUSCONNECT</span>
            </div>
            <div className="text-sm text-slate-400">PILOT TERMINAL</div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-sm text-slate-400">PILOT</div>
              <div className="text-lg font-bold text-orange-400">Capt. Sarah Johnson</div>
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
              Availability
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Briefcase className="h-4 w-4 mr-2" />
              Opportunities
            </TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Plane className="h-4 w-4 mr-2" />
              Assignments
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
                <CardTitle className="text-orange-400">Pilot Profile</CardTitle>
                <CardDescription>Your professional aviation resume</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-xl">SJ</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">Capt. Sarah Johnson</div>
                    <div className="text-slate-400">ATPL • 3,500 hours</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        Verified
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-slate-400">4.9 (47 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Type Ratings</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-slate-300">Gulfstream G650</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-slate-300">Bombardier Global 6000</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-slate-300">Citation X</span>
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
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Experience</h4>
                  <p className="text-slate-300">8 years commercial aviation, 5 years private charter</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs with simple content */}
          <TabsContent value="availability" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Availability Calendar</h2>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center text-slate-400">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                  <p>Availability calendar coming soon!</p>
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
