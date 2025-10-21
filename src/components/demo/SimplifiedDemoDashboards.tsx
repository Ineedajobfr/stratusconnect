import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plane, Users, DollarSign, CheckCircle } from "lucide-react";

// Simple demo dashboards that work without complex type issues

export const SimplePilotDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-orange-400">PILOT TERMINAL</h1>
        <p className="text-slate-400">Flight Operations Dashboard</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="flights">Flights</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center">
                  <Plane className="h-5 w-5 mr-2" />
                  Total Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">3,450</div>
                <Badge className="bg-green-500 mt-2">+120 this month</Badge>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Completed Flights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">847</div>
                <Badge className="bg-green-500 mt-2">+28 this month</Badge>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">$45,200</div>
                <Badge className="bg-green-500 mt-2">+$4,200 this month</Badge>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">4.8</div>
                <Badge className="bg-green-500 mt-2">Excellent</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const SimpleCrewDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-orange-400">CREW TERMINAL</h1>
        <p className="text-slate-400">Service & Operations Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center">
              <Plane className="h-5 w-5 mr-2" />
              Flights Served
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">124</div>
            <Badge className="bg-green-500 mt-2">+8 this week</Badge>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Service Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">4.9</div>
            <Badge className="bg-green-500 mt-2">Outstanding</Badge>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">$18,400</div>
            <Badge className="bg-green-500 mt-2">+$1,200 this week</Badge>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">12</div>
            <Badge className="bg-green-500 mt-2">All Current</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
