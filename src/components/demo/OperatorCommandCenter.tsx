import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plane, Clock, CheckCircle, AlertCircle, Bell, MapPin, Users, Calendar, 
  Shield, Award, FileText, DollarSign, Star, BarChart3, TrendingUp, 
  TrendingDown, Activity, Zap, Target, Globe, Database, Settings,
  Play, Pause, Volume2, MoreHorizontal, ArrowRight, Triangle
} from "lucide-react";

export const OperatorCommandCenter: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLive, setIsLive] = useState(true);

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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Command Bar */}
      <div className="bg-gray-900 border-b border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold">STRATUSCONNECT</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-sm text-gray-400">OPERATOR</div>
              <div className="text-lg font-mono font-bold text-orange-400">332E</div>
            </div>
            <div className="text-2xl font-mono text-orange-400">
              {formatTime(currentTime)}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Play className="h-4 w-4" />
            </Button>
            <div className="w-20 h-1 bg-gray-600 rounded-full">
              <div className="w-12 h-1 bg-orange-500 rounded-full"></div>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 p-6 h-screen">
        {/* Left Column - Operator Info & Contracts */}
        <div className="col-span-3 space-y-4">
          {/* Operator Panel */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-400 text-sm font-mono">OPERATOR</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-2xl font-mono font-bold text-white">332E</div>
              <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <div className="space-y-1 text-xs text-gray-300 font-mono">
                <div>El Sitmate</div>
                <div>B Slald. Gool Penge Etrecacont</div>
                <div>-EGO acted on type</div>
                <div>R Berfrorm Leede</div>
                <div>9. Liiherinormal Or brilael Eertitesseg</div>
              </div>
            </CardContent>
          </Card>

          {/* Contracts Panel */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-400 text-sm font-mono">CONTRACTS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                <div>
                  <div className="text-white font-mono text-sm">RFQ 1975</div>
                  <div className="text-gray-400 text-xs">D Bessurere Muli</div>
                  <div className="text-orange-400 text-xs">03.20 23</div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                <div>
                  <div className="text-white font-mono text-sm">RFQ 1975</div>
                  <div className="text-gray-400 text-xs">D Prerbörsa</div>
                  <div className="text-orange-400 text-xs">03.23.24</div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-400 text-sm font-mono flex items-center justify-between">
                NOTIFICATIONS
                <Badge className="bg-orange-500 text-black text-xs">3</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-white text-sm font-mono">I INotiticen 99 (94)</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-400 text-sm font-mono flex items-center justify-between">
                NOTIFICATIONS
                <Badge className="bg-orange-500 text-black text-xs">8</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-white text-sm font-mono">Weather Alert: Miami</div>
                <div className="text-white text-sm font-mono">Maintenance Due: N425SC</div>
                <div className="text-white text-sm font-mono">New RFQ: NYC→LAX</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Column - Map & Manifest */}
        <div className="col-span-6 space-y-4">
          {/* World Map */}
          <Card className="bg-gray-800 border-gray-700 h-64">
            <CardContent className="p-0 h-full">
              <div className="relative h-full bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden">
                {/* Simplified world map */}
                <svg viewBox="0 0 800 400" className="w-full h-full opacity-30">
                  <path
                    d="M100,200 Q200,150 300,180 Q400,200 500,190 Q600,180 700,200 Q750,220 700,250 Q600,280 500,270 Q400,260 300,270 Q200,280 100,250 Z"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="2"
                  />
                  <circle cx="150" cy="180" r="30" fill="#4B5563" opacity="0.3" />
                  <circle cx="300" cy="160" r="25" fill="#4B5563" opacity="0.3" />
                  <circle cx="500" cy="170" r="35" fill="#4B5563" opacity="0.3" />
                  <circle cx="650" cy="190" r="20" fill="#4B5563" opacity="0.3" />
                </svg>
                
                {/* Aircraft markers */}
                <div className="absolute top-20 left-32 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="absolute top-24 left-48 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="absolute top-28 left-64 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="absolute top-32 left-80 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>

          {/* Manifest */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-400 text-sm font-mono flex items-center justify-between">
                MANIFEST
                <MoreHorizontal className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="opportunity" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-700">
                  <TabsTrigger value="opportunity" className="text-xs">OPPORTUNITY</TabsTrigger>
                  <TabsTrigger value="oponce" className="text-xs">OPONCE</TabsTrigger>
                  <TabsTrigger value="pipeline" className="text-xs">PIPELINE</TabsTrigger>
                </TabsList>
                <TabsContent value="opportunity" className="mt-4">
                  <div className="space-y-3">
                    <div className="text-white font-mono text-sm">OPPORTUNITY Gulfstream</div>
                    <div className="w-16 h-12 bg-gray-700 rounded flex items-center justify-center">
                      <Plane className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="space-y-1 text-xs text-gray-300 font-mono">
                      <div>Pass Sep 26.24</div>
                      <div>Plasitscal OS 26.24</div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Compliance & Real-time */}
        <div className="col-span-3 space-y-4">
          {/* Compliance Warnings */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-400 text-sm font-mono">COMPLIANCE WARNINGS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-white" />
                <span className="text-white text-sm font-mono">FAST LICENST LAPSED</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-white" />
                <span className="text-white text-sm font-mono">NON APPROXED ACC</span>
              </div>
            </CardContent>
          </Card>

          {/* Real Time */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-400 text-sm font-mono">REAL TIME</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                <Activity className="h-8 w-8 text-orange-400" />
              </div>
              <div className="text-center space-y-1">
                <div className="text-white text-sm font-mono">DECOMIPA Y</div>
                <div className="text-red-400 text-sm font-mono">UNVERFIED INSURANCE</div>
              </div>
            </CardContent>
          </Card>

          {/* Reptotal Panels */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-400 text-sm font-mono">REPTOTAL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-gray-400 text-xs font-mono">PIPELINE</div>
              <div className="flex items-center space-x-2">
                <Triangle className="h-3 w-3 text-yellow-400" />
                <span className="text-white text-sm font-mono">UNVERIFIED INSURANCE</span>
              </div>
              <div className="text-orange-400 text-sm font-mono">PRP068</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-400 text-sm font-mono">REPTOTAL PRP95S</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-gray-400 text-xs font-mono">PIPELINE---</div>
              <div className="w-16 h-12 bg-gray-700 rounded flex items-center justify-center">
                <Plane className="h-6 w-6 text-gray-400" />
              </div>
              <div className="space-y-1">
                <div className="text-white text-sm font-mono">REPTOTAL</div>
                <div className="text-orange-400 text-sm font-mono">PRP086</div>
              </div>
            </CardContent>
          </Card>

          {/* Communications */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-400 text-sm font-mono flex items-center justify-between">
                COMUNICATIONS
                <ArrowRight className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-white text-sm font-mono">COMMUNICATIONS</div>
              <ArrowRight className="h-4 w-4 text-gray-400 mt-2" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
