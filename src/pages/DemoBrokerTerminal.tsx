import RealTimeFlightTracker from "@/components/RealTimeFlightTracker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertTriangle,
    Award,
    BarChart3,
    Bell,
    CheckCircle,
    Clock,
    DollarSign,
    Eye,
    FileText,
    MapPin,
    MessageCircle,
    MessageSquare,
    Plus,
    Search,
    Shield,
    Star,
    TrendingUp,
    Trophy,
    User,
    X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DemoBrokerTerminal() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(2);
  const [showStickyNotes, setShowStickyNotes] = useState(true);
  const [dismissedNotes, setDismissedNotes] = useState<string[]>([]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [isShowingNote, setIsShowingNote] = useState(true);
  const alertsDropdownRef = useRef<HTMLDivElement>(null);

  // Dummy data for 2 complete deals
  const deals = [
    {
      id: "DEAL-001",
      client: "Elite Aviation Group",
      route: "LHR → DXB",
      aircraft: "Gulfstream G650",
      passengers: 2,
      value: 45000,
      status: "completed",
      timeline: {
        rfqReceived: "2024-01-15T09:00:00Z",
        quoteSent: "2024-01-15T10:30:00Z",
        quoteAccepted: "2024-01-15T14:20:00Z",
        flightCompleted: "2024-01-20T16:45:00Z",
        paymentReceived: "2024-01-21T11:00:00Z"
      },
      clientDetails: {
        name: "Sarah Mitchell",
        company: "Elite Aviation Group",
        email: "sarah.mitchell@eliteaviation.com",
        phone: "+44 20 7123 4567",
          rating: 4.9,
        totalDeals: 12
      },
      flightDetails: {
        departure: "London Heathrow (LHR)",
        arrival: "Dubai International (DXB)",
        date: "2024-01-20",
        time: "14:30",
        duration: "6h 15m",
        aircraft: "Gulfstream G650",
        operator: "SkyBridge Aviation"
      }
    },
    {
      id: "DEAL-002",
      client: "Monaco Elite",
      route: "NCE → LHR",
      aircraft: "Bombardier Global 7500",
      passengers: 4,
      value: 52000,
      status: "in-progress",
      timeline: {
        rfqReceived: "2024-01-18T11:15:00Z",
        quoteSent: "2024-01-18T12:45:00Z",
        quoteAccepted: "2024-01-18T16:30:00Z",
        flightCompleted: null,
        paymentReceived: null
      },
      clientDetails: {
        name: "Elena Rodriguez",
        company: "Monaco Elite",
        email: "elena@monacoelite.com",
        phone: "+377 93 123 456",
          rating: 4.8,
        totalDeals: 8
      },
      flightDetails: {
        departure: "Nice Côte d'Azur (NCE)",
        arrival: "London Heathrow (LHR)",
        date: "2024-01-25",
        time: "10:00",
        duration: "2h 30m",
        aircraft: "Bombardier Global 7500",
        operator: "Luxury Air Services"
      }
    }
  ];

  const rfqs = [
    {
      id: "RFQ-003",
      client: "SkyBridge Ventures",
      route: "JFK → LAX",
      aircraft: "Boeing BBJ",
      passengers: 8,
      budget: 75000,
      urgency: "high",
      received: "2024-01-22T08:30:00Z",
      deadline: "2024-01-22T18:00:00Z",
      status: "pending"
    },
    {
      id: "RFQ-004",
      client: "Global Executive Travel",
      route: "LHR → NRT",
      aircraft: "Airbus ACJ320",
      passengers: 12,
      budget: 120000,
      urgency: "medium",
      received: "2024-01-21T15:45:00Z",
      deadline: "2024-01-23T12:00:00Z",
      status: "quoted"
    }
  ];

  const stickyNotes = [
    {
      id: "welcome",
      title: "Welcome to StratusConnect! 🚀",
      content: "This is your broker dashboard. Here you can manage RFQs, track deals, and communicate with clients. Let's walk through the complete workflow!",
      position: { top: "10%", right: "2%" },
      color: "bg-blue-500",
      tab: "dashboard",
      order: 0
    },
    {
      id: "notifications",
      title: "Real-Time Notifications 📢",
      content: "These cards show urgent actions needed. Click on them to see details and take action. The system tracks SLA deadlines automatically.",
      position: { top: "10%", right: "2%" },
      color: "bg-amber-500",
      tab: "dashboard",
      order: 1
    },
    {
      id: "metrics",
      title: "Key Performance Metrics 📊",
      content: "Track your success with these key metrics. Pending quotes, accepted quotes, deals closed, and response times are crucial for your reputation.",
      position: { top: "10%", right: "2%" },
      color: "bg-green-500",
      tab: "dashboard",
      order: 2
    },
    {
      id: "rfq-process",
      title: "RFQ Management Process 📋",
      content: "This is where you receive and manage Request for Quotes. Click on an RFQ to view details, send quotes, and track responses.",
      position: { top: "10%", right: "2%" },
      color: "bg-purple-500",
      tab: "rfqs",
      order: 0
    },
    {
      id: "deal-tracking",
      title: "Deal Tracking & Management 💼",
      content: "Track your active deals from quote to completion. Monitor flight status, client communications, and payment processing.",
      position: { top: "10%", right: "2%" },
      color: "bg-orange-500",
      tab: "marketplace",
      order: 0
    },
    {
      id: "billing-overview",
      title: "Financial Overview 💰",
      content: "Monitor your revenue, pending payments, and commission earnings. Track payment history and manage invoices.",
      position: { top: "10%", right: "2%" },
      color: "bg-green-500",
      tab: "billing",
      order: 0
    },
    {
      id: "warroom-verification",
      title: "Verification Center 🛡️",
      content: "Ensure all operators are verified and compliant. Monitor pending reviews and track any issues that need attention.",
      position: { top: "10%", right: "2%" },
      color: "bg-red-500",
      tab: "warroom",
      order: 0
    },
    {
      id: "reputation-metrics",
      title: "Performance Tracking ⭐",
      content: "View your ratings, client reviews, and performance metrics. Track your success and identify areas for improvement.",
      position: { top: "10%", right: "2%" },
      color: "bg-purple-500",
      tab: "reputation",
      order: 0
    },
    {
      id: "document-management",
      title: "Document Storage 📁",
      content: "Access contracts, invoices, and flight plans. Organize and manage all your important documents in one place.",
      position: { top: "10%", right: "2%" },
      color: "bg-blue-500",
      tab: "documents",
      order: 0
    },
    {
      id: "communication-tools",
      title: "Client Communication 💬",
      content: "Stay connected with clients through integrated chat and email. Manage conversations and maintain relationships.",
      position: { top: "10%", right: "2%" },
      color: "bg-cyan-500",
      tab: "communication",
      order: 0
    }
  ];

  const dismissNote = (noteId: string) => {
    setDismissedNotes(prev => [...prev, noteId]);
    setIsShowingNote(false);
    
    // Start timer for next note after 10 seconds
    setTimeout(() => {
      setCurrentNoteIndex(prev => prev + 1);
      setIsShowingNote(true);
    }, 10000);
  };

  const getCurrentTabNotes = () => {
    return stickyNotes
      .filter(note => note.tab === activeTab)
      .sort((a, b) => a.order - b.order);
  };

  const getCurrentNote = () => {
    const tabNotes = getCurrentTabNotes();
    const currentNote = tabNotes[currentNoteIndex];
    
    if (!currentNote || dismissedNotes.includes(currentNote.id)) {
      return null;
    }
    
    return currentNote;
  };

  // Reset note sequence when tab changes
  useEffect(() => {
    setCurrentNoteIndex(0);
    setIsShowingNote(true);
  }, [activeTab]);

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
      {/* Sticky Notes */}
      {showStickyNotes && isShowingNote && (() => {
        const currentNote = getCurrentNote();
        if (!currentNote) return null;
        
        return (
          <div
            key={currentNote.id}
            className={`fixed z-[9999] w-80 p-4 rounded-lg shadow-2xl border-2 border-white/20 backdrop-blur-sm ${currentNote.color} text-white transform hover:scale-105 transition-all duration-300`}
            style={{
              top: currentNote.position.top,
              right: currentNote.position.right,
              zIndex: 9999
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-lg">{currentNote.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissNote(currentNote.id)}
                className="text-white hover:bg-white/20 p-1 h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm opacity-90">{currentNote.content}</p>
          </div>
        );
      })()}

      {/* Toggle Sticky Notes Button */}
      <Button
        onClick={() => setShowStickyNotes(!showStickyNotes)}
        className="fixed top-4 right-4 z-[9998] bg-orange-500 hover:bg-orange-600 text-white"
        size="sm"
      >
        {showStickyNotes ? <Eye className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        {showStickyNotes ? 'Hide' : 'Show'} Guide
      </Button>
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
            </TabsList>

            <TabsContent value="dashboard" className="mt-8 scroll-smooth">
            <div className="space-y-8">
              {/* Notifications Section */}
              <div className="bg-slate-800/30 border border-slate-600/50 rounded-lg p-6 backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-white">Notifications</h2>
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                      {unreadAlertsCount} urgent
                    </Badge>
                    </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:border-orange-500/50 transition-all group hover:shadow-orange-500/20 hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                          <AlertTriangle className="w-5 h-5 text-amber-400" />
                          <p className="font-semibold text-amber-400 text-lg">Reply to 2 RFQs now</p>
                  </div>
                        <p className="text-sm text-gray-400 mb-2">SLA breach in 3h if ignored</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>SkyBridge Ventures • Global Executive Travel</span>
                </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:border-orange-500/50 transition-all group hover:shadow-orange-500/20 hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <FileText className="w-5 h-5 text-blue-400" />
                          <p className="font-semibold text-blue-400 text-lg">Send contract to 1 client</p>
          </div>
                        <p className="text-sm text-gray-400 mb-2">Deal expires in 6h</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <User className="w-3 h-3" />
                          <span>Monaco Elite • NCE → LHR</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:border-orange-500/50 transition-all group hover:shadow-orange-500/20 hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <DollarSign className="w-5 h-5 text-green-400" />
                          <p className="font-semibold text-green-400 text-lg">Collect 3 payments</p>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">£12,300 held in pending</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <CheckCircle className="w-3 h-3" />
                          <span>Elite Aviation Group • Monaco Elite</span>
                        </div>
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
              <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-400" />
                    RFQs & Quotes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Pending RFQs that need replies */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-orange-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Pending RFQs (2)
              </h3>
              
              {/* RFQ 1 */}
              <Card className="bg-red-900/20 border-red-500/30">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-white">NYC → LAX - Gulfstream G650</h4>
                      <p className="text-sm text-gray-300">Client: TechCorp Industries</p>
                      <p className="text-sm text-gray-400">Departure: Tomorrow 2:00 PM EST</p>
                    </div>
                    <Badge className="bg-red-500">URGENT</Badge>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">Corporate executives need immediate transport for board meeting. 8 passengers, premium service required.</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      Send Quote
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* RFQ 2 */}
              <Card className="bg-yellow-900/20 border-yellow-500/30">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-white">LHR → DXB - Bombardier Global 7500</h4>
                      <p className="text-sm text-gray-300">Client: Global Ventures Ltd</p>
                      <p className="text-sm text-gray-400">Departure: Friday 8:00 AM GMT</p>
                    </div>
                    <Badge className="bg-yellow-500">HIGH PRIORITY</Badge>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">Business delegation for Middle East expansion. 6 passengers, luxury amenities required.</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      Send Quote
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sent Quotes */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Sent Quotes (8)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Quote 1 */}
                <Card className="bg-slate-700/50">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white text-sm">JFK → LHR</h4>
                      <Badge className="bg-blue-500 text-xs">Pending</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">Client: Finance Corp</p>
                    <p className="text-xs text-gray-300">$85,000 - Sent 2 hours ago</p>
                  </CardContent>
                </Card>

                {/* Quote 2 */}
                <Card className="bg-slate-700/50">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white text-sm">LAX → NRT</h4>
                      <Badge className="bg-green-500 text-xs">Accepted</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">Client: Tech Startup</p>
                    <p className="text-xs text-gray-300">$125,000 - Accepted yesterday</p>
                  </CardContent>
                </Card>

                {/* Quote 3 */}
                <Card className="bg-slate-700/50">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white text-sm">CDG → DXB</h4>
                      <Badge className="bg-yellow-500 text-xs">Negotiating</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">Client: Luxury Group</p>
                    <p className="text-xs text-gray-300">$95,000 - Counter offered</p>
                  </CardContent>
                </Card>

                {/* Quote 4 */}
                <Card className="bg-slate-700/50">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white text-sm">SFO → SYD</h4>
                      <Badge className="bg-red-500 text-xs">Rejected</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">Client: Mining Corp</p>
                    <p className="text-xs text-gray-300">$180,000 - Price too high</p>
                  </CardContent>
                </Card>

                {/* Quote 5 */}
                <Card className="bg-slate-700/50">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white text-sm">MIA → GRU</h4>
                      <Badge className="bg-blue-500 text-xs">Pending</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">Client: Pharma Inc</p>
                    <p className="text-xs text-gray-300">$65,000 - Sent 1 day ago</p>
                  </CardContent>
                </Card>

                {/* Quote 6 */}
                <Card className="bg-slate-700/50">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white text-sm">ORD → FRA</h4>
                      <Badge className="bg-green-500 text-xs">Accepted</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">Client: Auto Manufacturer</p>
                    <p className="text-xs text-gray-300">$78,000 - Confirmed</p>
                  </CardContent>
                </Card>

                {/* Quote 7 */}
                <Card className="bg-slate-700/50">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white text-sm">BCN → JFK</h4>
                      <Badge className="bg-yellow-500 text-xs">Negotiating</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">Client: Fashion House</p>
                    <p className="text-xs text-gray-300">$88,000 - Reviewing terms</p>
                  </CardContent>
                </Card>

                {/* Quote 8 */}
                <Card className="bg-slate-700/50">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white text-sm">HKG → SIN</h4>
                      <Badge className="bg-blue-500 text-xs">Pending</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">Client: Investment Fund</p>
                    <p className="text-xs text-gray-300">$45,000 - Sent 3 hours ago</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
              </Card>
    </div>
          </TabsContent>

          <TabsContent value="marketplace" className="mt-6 scroll-smooth">
    <div className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-400" />
                    Marketplace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Recent Sales */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Recent Sales
              </h3>
              
              {/* Sale 1 */}
              <Card className="bg-green-900/20 border-green-500/30">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-white">Gulfstream G650ER - SOLD</h4>
                      <p className="text-sm text-gray-300">Buyer: TechCorp Industries</p>
                      <p className="text-sm text-gray-400">Sale Price: $65.5M</p>
                    </div>
                    <Badge className="bg-green-500">COMPLETED</Badge>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">2019 model, 2,500 flight hours, pristine condition. Delivered to Teterboro Airport.</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-500 hover:bg-green-600">
                      View Contract
                    </Button>
                    <Button size="sm" variant="outline">
                      Commission: $4.6M
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Sale 2 */}
              <Card className="bg-blue-900/20 border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-white">Bombardier Global 7500 - SOLD</h4>
                      <p className="text-sm text-gray-300">Buyer: Global Ventures Ltd</p>
                      <p className="text-sm text-gray-400">Sale Price: $72.8M</p>
                    </div>
                    <Badge className="bg-blue-500">DELIVERED</Badge>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">2021 model, 1,200 flight hours, full VIP interior. Delivered to London Biggin Hill.</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                      View Contract
                    </Button>
                    <Button size="sm" variant="outline">
                      Commission: $5.1M
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Available Aircraft */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-orange-400 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Available for Sale
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Aircraft 1 */}
                <Card className="bg-slate-700/50">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white text-sm">Citation XLS+</h4>
                      <Badge className="bg-orange-500 text-xs">Available</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">2018 • 3,200 hours</p>
                    <p className="text-xs text-gray-300">$8.5M • 7 passengers</p>
                  </CardContent>
                </Card>

                {/* Aircraft 2 */}
                <Card className="bg-slate-700/50">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white text-sm">Phenom 300E</h4>
                      <Badge className="bg-orange-500 text-xs">Available</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">2020 • 1,800 hours</p>
                    <p className="text-xs text-gray-300">$12.2M • 9 passengers</p>
                  </CardContent>
                </Card>

                {/* Aircraft 3 */}
                <Card className="bg-slate-700/50">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white text-sm">Challenger 350</h4>
                      <Badge className="bg-orange-500 text-xs">Available</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">2019 • 2,400 hours</p>
                    <p className="text-xs text-gray-300">$24.8M • 10 passengers</p>
                  </CardContent>
                </Card>

                {/* Aircraft 4 */}
                <Card className="bg-slate-700/50">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white text-sm">Falcon 7X</h4>
                      <Badge className="bg-orange-500 text-xs">Available</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">2017 • 4,100 hours</p>
                    <p className="text-xs text-gray-300">$38.5M • 12 passengers</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="mt-6 scroll-smooth">
    <div className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-orange-400" />
                    Billing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Payment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-green-900/20 border-green-500/30">
                <CardContent className="p-4 text-center">
                  <h3 className="text-2xl font-bold text-green-400">$127,500</h3>
                  <p className="text-sm text-gray-300">Collected This Month</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-900/20 border-blue-500/30">
                <CardContent className="p-4 text-center">
                  <h3 className="text-2xl font-bold text-blue-400">$45,200</h3>
                  <p className="text-sm text-gray-300">Pending Payments</p>
                </CardContent>
              </Card>
              <Card className="bg-orange-900/20 border-orange-500/30">
                <CardContent className="p-4 text-center">
                  <h3 className="text-2xl font-bold text-orange-400">$8,925</h3>
                  <p className="text-sm text-gray-300">Commission Earned</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Payments */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Recent Payments (3)
              </h3>
              
              {/* Payment 1 */}
              <Card className="bg-green-900/20 border-green-500/30">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-white">LAX → NRT Charter</h4>
                      <p className="text-sm text-gray-300">Client: Tech Startup</p>
                      <p className="text-sm text-gray-400">Payment Date: Yesterday</p>
                    </div>
                    <Badge className="bg-green-500">PAID</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-bold text-green-400">$125,000</p>
                      <p className="text-sm text-gray-300">Commission: $8,750</p>
                    </div>
                    <Button size="sm" className="bg-green-500 hover:bg-green-600">
                      View Invoice
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Payment 2 */}
              <Card className="bg-green-900/20 border-green-500/30">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-white">ORD → FRA Charter</h4>
                      <p className="text-sm text-gray-300">Client: Auto Manufacturer</p>
                      <p className="text-sm text-gray-400">Payment Date: 2 days ago</p>
                    </div>
                    <Badge className="bg-green-500">PAID</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-bold text-green-400">$78,000</p>
                      <p className="text-sm text-gray-300">Commission: $5,460</p>
                    </div>
                    <Button size="sm" className="bg-green-500 hover:bg-green-600">
                      View Invoice
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Payment 3 */}
              <Card className="bg-green-900/20 border-green-500/30">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-white">G650ER Aircraft Sale</h4>
                      <p className="text-sm text-gray-300">Client: TechCorp Industries</p>
                      <p className="text-sm text-gray-400">Payment Date: 5 days ago</p>
                    </div>
                    <Badge className="bg-green-500">PAID</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-bold text-green-400">$65,500,000</p>
                      <p className="text-sm text-gray-300">Commission: $4,585,000</p>
                    </div>
                    <Button size="sm" className="bg-green-500 hover:bg-green-600">
                      View Invoice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending Payments */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pending Payments
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="bg-yellow-900/20 border-yellow-500/30">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white text-sm">JFK → LHR</h4>
                      <Badge className="bg-yellow-500 text-xs">Pending</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">Client: Finance Corp</p>
                    <p className="text-xs text-gray-300">$85,000 • Due in 3 days</p>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-900/20 border-yellow-500/30">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white text-sm">MIA → GRU</h4>
                      <Badge className="bg-yellow-500 text-xs">Pending</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">Client: Pharma Inc</p>
                    <p className="text-xs text-gray-300">$65,000 • Due in 5 days</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
            </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="warroom" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-400" />
                    War Room
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Verification Status */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-orange-400 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Verification Status
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-green-900/20 border-green-500/30">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <h4 className="font-semibold text-white">Broker License</h4>
                          </div>
                          <p className="text-sm text-gray-300">Verified • Expires: Dec 2025</p>
                          <Badge className="bg-green-500 mt-2">ACTIVE</Badge>
                        </CardContent>
                      </Card>

                      <Card className="bg-green-900/20 border-green-500/30">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <h4 className="font-semibold text-white">Insurance Coverage</h4>
                          </div>
                          <p className="text-sm text-gray-300">Verified • $10M Coverage</p>
                          <Badge className="bg-green-500 mt-2">ACTIVE</Badge>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Pending Items */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Pending Items
                    </h3>
                    
                    <Card className="bg-yellow-900/20 border-yellow-500/30">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-white">Annual Compliance Review</h4>
                            <p className="text-sm text-gray-300">Due: February 15, 2025</p>
                          </div>
                          <Badge className="bg-yellow-500">PENDING</Badge>
                        </div>
                        <p className="text-sm text-gray-300 mb-3">Required documentation for broker license renewal.</p>
                        <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600">
                          Submit Documents
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Compliance Metrics */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Compliance Metrics
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Card className="bg-blue-900/20 border-blue-500/30">
                        <CardContent className="p-3 text-center">
                          <h4 className="text-xl font-bold text-blue-400">98%</h4>
                          <p className="text-sm text-gray-300">Compliance Score</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-green-900/20 border-green-500/30">
                        <CardContent className="p-3 text-center">
                          <h4 className="text-xl font-bold text-green-400">0</h4>
                          <p className="text-sm text-gray-300">Active Violations</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-orange-900/20 border-orange-500/30">
                        <CardContent className="p-3 text-center">
                          <h4 className="text-xl font-bold text-orange-400">45</h4>
                          <p className="text-sm text-gray-300">Days Since Last Audit</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-400" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Document Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card className="bg-blue-900/20 border-blue-500/30">
                        <CardContent className="p-4 text-center">
                          <h3 className="text-2xl font-bold text-blue-400">24</h3>
                          <p className="text-sm text-gray-300">Invoices</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-green-900/20 border-green-500/30">
                        <CardContent className="p-4 text-center">
                          <h3 className="text-2xl font-bold text-green-400">12</h3>
                          <p className="text-sm text-gray-300">Contracts</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-orange-900/20 border-orange-500/30">
                        <CardContent className="p-4 text-center">
                          <h3 className="text-2xl font-bold text-orange-400">8</h3>
                          <p className="text-sm text-gray-300">Certificates</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent Documents */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Recent Documents
                      </h3>
                      
                      {/* Invoice History */}
                      <Card className="bg-slate-700/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-white">Invoice #INV-2025-001</h4>
                              <p className="text-sm text-gray-300">LAX → NRT Charter - Tech Startup</p>
                              <p className="text-sm text-gray-400">Generated: Yesterday</p>
                            </div>
                            <Badge className="bg-green-500">PAID</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                              Download PDF
                            </Button>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-slate-700/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-white">Contract #CON-2025-002</h4>
                              <p className="text-sm text-gray-300">Gulfstream G650ER Sale Agreement</p>
                              <p className="text-sm text-gray-400">Signed: 5 days ago</p>
                            </div>
                            <Badge className="bg-blue-500">ACTIVE</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-500 hover:bg-green-600">
                              Download PDF
                            </Button>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-slate-700/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-white">Certificate #CERT-2025-003</h4>
                              <p className="text-sm text-gray-300">Broker License Renewal</p>
                              <p className="text-sm text-gray-400">Issued: 1 week ago</p>
                            </div>
                            <Badge className="bg-green-500">VALID</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                              Download PDF
                            </Button>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Document Actions */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-orange-400 flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Quick Actions
                      </h3>
                      
                      <div className="flex gap-3">
                        <Button className="bg-blue-500 hover:bg-blue-600">
                          Generate Invoice
                        </Button>
                        <Button className="bg-green-500 hover:bg-green-600">
                          Create Contract
                        </Button>
                        <Button className="bg-orange-500 hover:bg-orange-600">
                          Upload Document
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="communication" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-orange-400" />
                    Communication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Active Conversations */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Active Conversations
                      </h3>
                      
                      {/* Conversation 1 */}
                      <Card className="bg-slate-700/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-white">TechCorp Industries</h4>
                              <p className="text-sm text-gray-300">Gulfstream G650ER Sale Discussion</p>
                            </div>
                            <Badge className="bg-green-500">ONLINE</Badge>
                          </div>
                          <div className="space-y-2 mb-3">
                            <div className="bg-blue-900/30 p-3 rounded-lg">
                              <p className="text-sm text-gray-300">"The aircraft inspection went perfectly. When can we finalize the delivery?"</p>
                              <p className="text-xs text-gray-400 mt-1">Sarah Chen - 10 minutes ago</p>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-lg ml-8">
                              <p className="text-sm text-white">"Excellent! I'll have the final paperwork ready by tomorrow morning."</p>
                              <p className="text-xs text-gray-400 mt-1">You - 5 minutes ago</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                              Reply
                            </Button>
                            <Button size="sm" variant="outline">
                              View Full Chat
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Conversation 2 */}
                      <Card className="bg-slate-700/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-white">Global Ventures Ltd</h4>
                              <p className="text-sm text-gray-300">LHR → DXB Charter Inquiry</p>
                            </div>
                            <Badge className="bg-yellow-500">AWAY</Badge>
                          </div>
                          <div className="space-y-2 mb-3">
                            <div className="bg-blue-900/30 p-3 rounded-lg">
                              <p className="text-sm text-gray-300">"We need to confirm the catering options for 6 passengers."</p>
                              <p className="text-xs text-gray-400 mt-1">James Mitchell - 1 hour ago</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                              Reply
                            </Button>
                            <Button size="sm" variant="outline">
                              View Full Chat
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Conversation 3 */}
                      <Card className="bg-slate-700/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-white">Luxury Group</h4>
                              <p className="text-sm text-gray-300">CDG → DXB Quote Negotiation</p>
                            </div>
                            <Badge className="bg-green-500">ONLINE</Badge>
                          </div>
                          <div className="space-y-2 mb-3">
                            <div className="bg-blue-900/30 p-3 rounded-lg">
                              <p className="text-sm text-gray-300">"Your counter-offer looks good. Can we add priority boarding?"</p>
                              <p className="text-xs text-gray-400 mt-1">Marie Dubois - 30 minutes ago</p>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-lg ml-8">
                              <p className="text-sm text-white">"Absolutely! Priority boarding is included. I'll update the quote."</p>
                              <p className="text-xs text-gray-400 mt-1">You - 15 minutes ago</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                              Reply
                            </Button>
                            <Button size="sm" variant="outline">
                              View Full Chat
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-orange-400 flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Quick Actions
                      </h3>
                      
                      <div className="flex gap-3">
                        <Button className="bg-blue-500 hover:bg-blue-600">
                          New Message
                        </Button>
                        <Button className="bg-green-500 hover:bg-green-600">
                          Schedule Call
                        </Button>
                        <Button className="bg-orange-500 hover:bg-orange-600">
                          Send Quote
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reputation" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-orange-400" />
                    Reputation Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Reputation Score */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <Card className="bg-orange-900/20 border-orange-500/30">
                        <CardContent className="p-4 text-center">
                          <h3 className="text-3xl font-bold text-orange-400">4.9</h3>
                          <p className="text-sm text-gray-300">Overall Rating</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-green-900/20 border-green-500/30">
                        <CardContent className="p-4 text-center">
                          <h3 className="text-3xl font-bold text-green-400">127</h3>
                          <p className="text-sm text-gray-300">Total Reviews</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-blue-900/20 border-blue-500/30">
                        <CardContent className="p-4 text-center">
                          <h3 className="text-3xl font-bold text-blue-400">98%</h3>
                          <p className="text-sm text-gray-300">Success Rate</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-purple-900/20 border-purple-500/30">
                        <CardContent className="p-4 text-center">
                          <h3 className="text-3xl font-bold text-purple-400">24h</h3>
                          <p className="text-sm text-gray-300">Avg Response</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent Reviews */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-orange-400 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Recent Reviews
                      </h3>
                      
                      {/* Review 1 */}
                      <Card className="bg-slate-700/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-white">TechCorp Industries</h4>
                              <p className="text-sm text-gray-300">Gulfstream G650ER Sale</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">"Exceptional service throughout the entire process. The broker was professional, knowledgeable, and made the aircraft purchase seamless."</p>
                          <p className="text-xs text-gray-400">Sarah Chen - 2 days ago</p>
                        </CardContent>
                      </Card>

                      {/* Review 2 */}
                      <Card className="bg-slate-700/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-white">Auto Manufacturer</h4>
                              <p className="text-sm text-gray-300">ORD → FRA Charter</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">"Perfect charter experience. The aircraft was exactly as described and the crew was outstanding. Highly recommended!"</p>
                          <p className="text-xs text-gray-400">Michael Rodriguez - 5 days ago</p>
                        </CardContent>
                      </Card>

                      {/* Review 3 */}
                      <Card className="bg-slate-700/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-white">Tech Startup</h4>
                              <p className="text-sm text-gray-300">LAX → NRT Charter</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <Star className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">"Great service overall. The only minor issue was a slight delay, but the broker handled it professionally and kept us informed throughout."</p>
                          <p className="text-xs text-gray-400">David Kim - 1 week ago</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Performance Metrics */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Performance Metrics
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-blue-900/20 border-blue-500/30">
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-white mb-2">Response Time</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-300">Under 1 hour</span>
                                <span className="text-green-400">85%</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-300">1-24 hours</span>
                                <span className="text-blue-400">12%</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-300">Over 24 hours</span>
                                <span className="text-orange-400">3%</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-green-900/20 border-green-500/30">
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-white mb-2">Deal Completion</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-300">Successful Deals</span>
                                <span className="text-green-400">98%</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-300">Cancelled Deals</span>
                                <span className="text-red-400">2%</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-300">Repeat Clients</span>
                                <span className="text-blue-400">73%</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
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