import RealTimeFlightTracker from "@/components/RealTimeFlightTracker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  BarChart3,
  Bell,
  Clock,
  DollarSign,
  FileText,
  MapPin,
  MessageCircle,
  MessageSquare,
  Plus,
  Search,
  Shield,
  TrendingUp,
  Trophy
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DemoBrokerTerminal() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(2);
  const alertsDropdownRef = useRef<HTMLDivElement>(null);

  // Close alerts dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (alertsDropdownRef.current && !alertsDropdownRef.current.contains(event.target as Node)) {
        setShowAlertsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cinematic Background - Dark Storm with Orange Glimmers */}
      <div className="fixed inset-0 z-0">
        {/* Deep Dark Base - Stormy Sky */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 15%, #0f0f0f 30%, #050505 45%, #000000 60%, #0a0a0a 75%, #000000 100%)',
          }}
        />
        
        {/* Dark Cloud Layer */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 120% 100% at 30% 20%, rgba(20, 20, 20, 0.8) 0%, rgba(10, 10, 10, 0.9) 30%, rgba(5, 5, 5, 0.95) 60%, transparent 80%), radial-gradient(ellipse 100% 80% at 70% 80%, rgba(15, 15, 15, 0.7) 0%, rgba(8, 8, 8, 0.8) 40%, transparent 70%)',
          }}
        />
        
        {/* Cinematic Orange Glimmers - Sun Breaking Through */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 40% 30% at 25% 15%, rgba(255, 140, 0, 0.4) 0%, rgba(255, 165, 0, 0.3) 20%, rgba(255, 140, 0, 0.15) 40%, rgba(255, 100, 0, 0.08) 60%, transparent 80%), radial-gradient(ellipse 30% 25% at 75% 25%, rgba(255, 165, 0, 0.3) 0%, rgba(255, 140, 0, 0.2) 30%, rgba(255, 100, 0, 0.1) 50%, transparent 70%)',
          }}
        />
        
        {/* Additional Glimmer Rays */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'conic-gradient(from 45deg at 20% 20%, transparent 0deg, rgba(255, 140, 0, 0.2) 15deg, transparent 30deg, transparent 330deg, rgba(255, 165, 0, 0.15) 345deg, transparent 360deg), conic-gradient(from 225deg at 80% 30%, transparent 0deg, rgba(255, 100, 0, 0.15) 20deg, transparent 40deg)',
          }}
        />
        
        {/* Subtle Moving Glimmers */}
        <div 
          className="absolute inset-0 animate-pulse"
          style={{
            background: 'radial-gradient(ellipse 20% 15% at 30% 20%, rgba(255, 140, 0, 0.3) 0%, transparent 50%), radial-gradient(ellipse 15% 10% at 70% 15%, rgba(255, 165, 0, 0.25) 0%, transparent 60%)',
            animation: 'pulse 6s ease-in-out infinite',
          }}
        />
        
        {/* Dark Atmospheric Vignette */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 90% 70% at center, transparent 0%, transparent 30%, rgba(0, 0, 0, 0.2) 60%, rgba(0, 0, 0, 0.5) 80%, rgba(0, 0, 0, 0.8) 100%)',
          }}
        />
        
        {/* Subtle Storm Texture */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJzdG9ybSIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDAgNTAgUSAyMCAzMCA0MCA1MCBRIDYwIDcwIDgwIDUwIFEgMTAwIDMwIDEwMCA1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIvPgogICAgICA8cGF0aCBkPSJNIDAgNzAgUSAxNSA1MCAzNSA3MCBRIDU1IDkwIDc1IDcwIFEgOTUgNTAgMTAwIDcwIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjAuMyIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNzdG9ybSkiLz4KPC9zdmc+')] opacity-20"></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-slate-800/50 bg-black/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-8 py-3 flex items-center">
          
          {/* Left - STRATUSCONNECT Logo */}
          <div 
            className="text-white text-lg font-bold bg-black px-6 py-3 rounded backdrop-blur-sm cursor-pointer hover:bg-gray-800 transition-colors mr-8"
            onClick={() => window.location.href = '/'}
          >
            STRATUSCONNECT
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-lg mx-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                placeholder="Search RFQs, quotes, clients..."
                className="pl-12 pr-4 py-3 bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500/20 text-lg"
              />
            </div>
          </div>

          {/* Right - Alerts & Actions */}
          <div className="flex items-center gap-6 ml-auto">
            {/* Alerts Bell */}
            <div className="relative" ref={alertsDropdownRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
                className="relative p-2 text-slate-400 hover:text-white"
              >
                <Bell className="h-5 w-5" />
                {unreadAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadAlertsCount}
                  </span>
                )}
              </Button>

              {/* Alerts Dropdown */}
              {showAlertsDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                  <div className="p-4 border-b border-slate-700">
                    <h3 className="text-lg font-semibold text-white">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">New RFQ from Elite Aviation</p>
                          <p className="text-xs text-gray-400 mt-1">LHR to DXB - Gulfstream G650</p>
                          <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">Quote Accepted</p>
                          <p className="text-xs text-gray-400 mt-1">Monaco Elite - £45,000</p>
                          <p className="text-xs text-gray-500 mt-1">15 minutes ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* New RFQ Button */}
            <Button
              onClick={() => setActiveTab('rfqs')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 hover:shadow-orange-500/25 hover:shadow-lg transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              New RFQ
            </Button>

            {/* Trophy Button */}
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50"
            >
              <Trophy className="h-5 w-5" />
            </Button>

            {/* Tutorial Button */}
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto p-6 space-y-6 overflow-y-auto scroll-smooth bg-black/5 backdrop-blur-sm rounded-lg">
        <div className="space-y-6">
          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex w-max min-w-full justify-start space-x-1 backdrop-blur-sm bg-slate-800/50 border-slate-700">
              <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-orange-500/25 data-[state=active]:shadow-lg hover:bg-orange-500/20 hover:text-orange-400 transition-all">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="rfqs" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-orange-500/25 data-[state=active]:shadow-lg hover:bg-orange-500/20 hover:text-orange-400 transition-all">
                <FileText className="w-4 h-4" />
                RFQs & Quotes
              </TabsTrigger>
              <TabsTrigger value="marketplace" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-orange-500/25 data-[state=active]:shadow-lg hover:bg-orange-500/20 hover:text-orange-400 transition-all">
                <MapPin className="w-4 h-4" />
                Marketplace
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-orange-500/25 data-[state=active]:shadow-lg hover:bg-orange-500/20 hover:text-orange-400 transition-all">
                <DollarSign className="w-4 h-4" />
                Billing
              </TabsTrigger>
              <TabsTrigger value="warroom" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-orange-500/25 data-[state=active]:shadow-lg hover:bg-orange-500/20 hover:text-orange-400 transition-all">
                <Shield className="w-4 h-4" />
                War Room
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-orange-500/25 data-[state=active]:shadow-lg hover:bg-orange-500/20 hover:text-orange-400 transition-all">
                <FileText className="w-4 h-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="communication" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-orange-500/25 data-[state=active]:shadow-lg hover:bg-orange-500/20 hover:text-orange-400 transition-all">
                <MessageCircle className="w-4 h-4" />
                Communication
              </TabsTrigger>
              <TabsTrigger value="reputation" className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-orange-500/25 data-[state=active]:shadow-lg hover:bg-orange-500/20 hover:text-orange-400 transition-all">
                <Award className="w-4 h-4" />
                Reputation
              </TabsTrigger>
              
              <div className="ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
                  className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                >
                  {showAdvancedFeatures ? 'Hide' : 'Show'} Advanced
                </Button>
              </div>
            </TabsList>

            <TabsContent value="dashboard" className="mt-8 scroll-smooth">
            <div className="space-y-8">
              {/* Notifications Section */}
              <div className="bg-slate-800/30 border border-slate-600/50 rounded-lg p-6 backdrop-blur-sm">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white">Notifications</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:border-orange-500/50 transition-all group hover:shadow-orange-500/20 hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                          <FileText className="w-5 h-5 text-amber-400" />
                          <p className="font-semibold text-amber-400 text-lg">Reply to 2 RFQs now</p>
                        </div>
                        <p className="text-sm text-gray-400">SLA breach in 3h if ignored</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:border-orange-500/50 transition-all group hover:shadow-orange-500/20 hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <FileText className="w-5 h-5 text-blue-400" />
                          <p className="font-semibold text-blue-400 text-lg">Send contract to 1 client</p>
                        </div>
                        <p className="text-sm text-gray-400">Deal expires in 6h</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:border-orange-500/50 transition-all group hover:shadow-orange-500/20 hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <DollarSign className="w-5 h-5 text-green-400" />
                          <p className="font-semibold text-green-400 text-lg">Collect 3 payments</p>
                        </div>
                        <p className="text-sm text-gray-400">£12,300 held in pending</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:border-orange-500/50 transition-all group hover:shadow-orange-500/20 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-400" />
                        <p className="text-xs uppercase tracking-wide text-gray-300 font-medium">Pending Quotes</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white mb-1">8</p>
                      <p className="text-sm text-gray-400">Awaiting response</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:border-orange-500/50 transition-all group hover:shadow-orange-500/20 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-orange-400" />
                        <p className="text-xs uppercase tracking-wide text-gray-300 font-medium">Quotes Accepted</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white mb-1">23</p>
                      <p className="text-sm text-gray-400">This month</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:border-orange-500/50 transition-all group hover:shadow-orange-500/20 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-orange-400" />
                        <p className="text-xs uppercase tracking-wide text-gray-300 font-medium">Deals Closed</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white mb-1">5</p>
                      <p className="text-sm text-gray-400">£2.1M volume</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:border-orange-500/50 transition-all group hover:shadow-orange-500/20 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-400" />
                        <p className="text-xs uppercase tracking-wide text-gray-300 font-medium">Response Time</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white mb-1">2.3m</p>
                      <p className="text-sm text-gray-400">Fast lane eligible</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Reputation & Performance - Smaller */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="w-4 h-4 text-orange-400" />
                      <p className="text-sm uppercase tracking-wide text-gray-300 font-medium">Reputation & Performance</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                        <p className="text-xl font-bold text-orange-400 mb-1">4.8</p>
                        <p className="text-xs text-gray-400">Rating</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                        <p className="text-xl font-bold text-orange-400 mb-1">98%</p>
                        <p className="text-xs text-gray-400">Satisfaction</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-slate-700/50 border border-slate-600">
                        <p className="text-xl font-bold text-orange-400 mb-1">127</p>
                        <p className="text-xs text-gray-400">Deals</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="w-4 h-4 text-orange-400" />
                      <p className="text-sm uppercase tracking-wide text-gray-300 font-medium">Golden Status</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-400 mb-2">#12 Global Ranking</p>
                      <p className="text-2xl font-bold text-orange-400 mb-1">567</p>
                      <p className="text-xs text-gray-400">Points (+23 this week)</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Real-Time Flight Tracking */}
              <div className="mt-8">
                <RealTimeFlightTracker terminalType="broker" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rfqs" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              {/* Active RFQs */}
              <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:border-orange-500/50 transition-all group hover:shadow-orange-500/20 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-400" />
                    Active RFQs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg border border-slate-600 bg-slate-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">Elite Aviation Group</h4>
                          <Badge className="bg-amber-500/20 text-amber-400">Urgent</Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">LHR → DXB</p>
                        <p className="text-xs text-gray-500">Gulfstream G650 • 2 passengers</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-orange-400 font-semibold">£45,000</span>
                          <span className="text-xs text-gray-500">2h left</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="marketplace" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:border-orange-500/50 transition-all group hover:shadow-orange-500/20 hover:shadow-lg">
                <CardHeader>
                  <CardTitle>Marketplace</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Marketplace content will be here</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:border-orange-500/50 transition-all group hover:shadow-orange-500/20 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-orange-400" />
                    Billing & Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Billing content will be here</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="warroom" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:border-orange-500/50 transition-all group hover:shadow-orange-500/20 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-400" />
                    War Room - Verification Center
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">War room content will be here</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reputation" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:border-orange-500/50 transition-all group hover:shadow-orange-500/20 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-orange-400" />
                    Reputation & Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Reputation metrics will be here</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:border-orange-500/50 transition-all group hover:shadow-orange-500/20 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-400" />
                    Document Storage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Document management will be here</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="communication" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:border-orange-500/50 transition-all group hover:shadow-orange-500/20 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-orange-400" />
                    Communication Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Communication tools will be here</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}