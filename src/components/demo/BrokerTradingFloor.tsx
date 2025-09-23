import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plane, Clock, CheckCircle, AlertCircle, Bell, MapPin, Users, Calendar, 
  Shield, Award, FileText, DollarSign, Star, BarChart3, TrendingUp, 
  TrendingDown, Activity, Zap, Target, Globe, Database, Settings,
  Play, Pause, Volume2, MoreHorizontal, ArrowRight, Triangle, TrendingUp as Up,
  TrendingDown as Down, Eye, EyeOff
} from "lucide-react";

export const BrokerTradingFloor: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLive, setIsLive] = useState(true);
  const [marketData, setMarketData] = useState({
    totalValue: 2847500,
    activeQuotes: 23,
    pendingRequests: 8,
    completedToday: 12
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate live market data updates
      setMarketData(prev => ({
        ...prev,
        totalValue: prev.totalValue + Math.floor(Math.random() * 10000 - 5000),
        activeQuotes: prev.activeQuotes + Math.floor(Math.random() * 3 - 1)
      }));
    }, 2000);
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Top Trading Bar */}
      <div className="bg-slate-800 border-b border-slate-600 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold">STRATUSCONNECT</span>
            </div>
            <div className="text-sm text-slate-400">TRADING FLOOR</div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-sm text-slate-400">BROKER</div>
              <div className="text-lg font-mono font-bold text-white">BROKER-001</div>
            </div>
            <div className="text-2xl font-mono text-white">
              {formatTime(currentTime)}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-orange-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-slate-400">{isLive ? 'LIVE' : 'OFFLINE'}</span>
            </div>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <Play className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 p-6 h-screen">
        {/* Left Column - Market Overview & Portfolio */}
        <div className="col-span-3 space-y-4">
          {/* Market Overview */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-mono">MARKET OVERVIEW</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-2xl font-mono font-bold text-white">
                {formatCurrency(marketData.totalValue)}
              </div>
              <div className="flex items-center space-x-2">
                <Up className="h-4 w-4 text-white" />
                <span className="text-white text-sm">+2.4%</span>
                <span className="text-gray-400 text-sm">vs yesterday</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-700 p-2 rounded">
                  <div className="text-gray-400">Active</div>
                  <div className="text-white font-mono">{marketData.activeQuotes}</div>
                </div>
                <div className="bg-gray-700 p-2 rounded">
                  <div className="text-gray-400">Pending</div>
                  <div className="text-white font-mono">{marketData.pendingRequests}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-mono">PORTFOLIO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                <div>
                  <div className="text-white font-mono text-sm">JFK → LAX</div>
                  <div className="text-gray-400 text-xs">Gulfstream G550</div>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm font-mono">$45K</div>
                  <div className="text-xs text-gray-400">+12%</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                <div>
                  <div className="text-white font-mono text-sm">MIA → LHR</div>
                  <div className="text-gray-400 text-xs">Falcon 7X</div>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm font-mono">$85K</div>
                  <div className="text-xs text-gray-400">+8%</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                <div>
                  <div className="text-white font-mono text-sm">LAX → JFK</div>
                  <div className="text-gray-400 text-xs">Citation X+</div>
                </div>
                <div className="text-right">
                  <div className="text-red-400 text-sm font-mono">$32K</div>
                  <div className="text-xs text-gray-400">-3%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Requests */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-mono flex items-center justify-between">
                ACTIVE REQUESTS
                <Badge className="bg-green-500 text-black text-xs">{marketData.pendingRequests}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-2 bg-gray-700 rounded">
                <div className="text-white font-mono text-sm">NYC → LAX</div>
                <div className="text-gray-400 text-xs">4 PAX • Jan 15</div>
                <div className="text-orange-400 text-xs">3 quotes received</div>
              </div>
              <div className="p-2 bg-gray-700 rounded">
                <div className="text-white font-mono text-sm">MIA → LHR</div>
                <div className="text-gray-400 text-xs">6 PAX • Jan 20</div>
                <div className="text-orange-400 text-xs">2 quotes received</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Column - Market Map & Live Feed */}
        <div className="col-span-6 space-y-4">
          {/* Market Map */}
          <Card className="bg-gray-800 border-gray-700 h-64">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-mono">GLOBAL MARKET ACTIVITY</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <div className="relative h-full bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden">
                <svg viewBox="0 0 800 400" className="w-full h-full opacity-30">
                  <path
                    d="M100,200 Q200,150 300,180 Q400,200 500,190 Q600,180 700,200 Q750,220 700,250 Q600,280 500,270 Q400,260 300,270 Q200,280 100,250 Z"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="2"
                  />
                </svg>
                
                {/* Market activity indicators */}
                <div className="absolute top-20 left-32 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute top-24 left-48 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <div className="absolute top-28 left-64 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute top-32 left-80 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                
                {/* Market labels */}
                <div className="absolute top-16 left-28 text-xs text-white font-mono">$45K</div>
                <div className="absolute top-20 left-44 text-xs text-yellow-400 font-mono">$32K</div>
                <div className="absolute top-24 left-60 text-xs text-white font-mono">$85K</div>
                <div className="absolute top-28 left-76 text-xs text-red-400 font-mono">$28K</div>
              </div>
            </CardContent>
          </Card>

          {/* Live Market Feed */}
          <Card className="card">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-mono flex items-center justify-between">
                LIVE MARKET FEED
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted">LIVE</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white">14:32:15</span>
                  <span className="text-white">NEW QUOTE: JFK→LAX $45K</span>
                  <span className="text-gray-400">Elite Aviation</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white">14:31:42</span>
                  <span className="text-blue-400">QUOTE ACCEPTED: MIA→LHR</span>
                  <span className="text-gray-400">Global Jets</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white">14:30:18</span>
                  <span className="text-yellow-400">NEW REQUEST: LAX→JFK</span>
                  <span className="text-gray-400">4 PAX</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white">14:29:55</span>
                  <span className="text-red-400">QUOTE EXPIRED: NYC→MIA</span>
                  <span className="text-gray-400">Premier Jets</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Analytics & Alerts */}
        <div className="col-span-3 space-y-4">
          {/* Performance Metrics */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-mono">PERFORMANCE</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center">
                  <div className="text-2xl font-mono text-white">{marketData.completedToday}</div>
                  <div className="text-xs text-gray-400">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-mono text-white">94.2%</div>
                  <div className="text-xs text-gray-400">Success Rate</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">This Month</span>
                  <span className="text-white">+18.5%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '78%'}}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Alerts */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-mono">MARKET ALERTS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2 p-2 bg-red-900/20 border border-red-500/30 rounded">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <span className="text-red-400 text-xs font-mono">HIGH DEMAND: NYC→LAX</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-yellow-900/20 border border-yellow-500/30 rounded">
                <Triangle className="h-4 w-4 text-yellow-400" />
                <span className="text-yellow-400 text-xs font-mono">PRICE DROP: MIA→LHR</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-green-900/20 border border-green-500/30 rounded">
                <CheckCircle className="h-4 w-4 text-white" />
                <span className="text-white text-xs font-mono">NEW OPERATOR: LAX</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-mono">QUICK ACTIONS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-black text-xs font-mono">
                NEW REQUEST
              </Button>
              <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white text-xs font-mono">
                VIEW QUOTES
              </Button>
              <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white text-xs font-mono">
                MARKET ANALYSIS
              </Button>
            </CardContent>
          </Card>

          {/* Client Status */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-mono">CLIENT STATUS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white text-xs font-mono">Elite Corp</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-xs font-mono">Global Jets</span>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-xs font-mono">Premier Air</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
