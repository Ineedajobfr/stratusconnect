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
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Plane,
  Plus,
  Search,
  Send,
  Shield,
  Star,
  TrendingUp,
  Trophy,
  User,
  Users,
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
              {/* Active RFQs */}
              <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-400" />
                    Active RFQs
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 ml-2">
                      {rfqs.length} pending
                    </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
      <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {rfqs.map((rfq) => (
                        <div key={rfq.id} className="p-4 rounded-lg border border-slate-600 bg-slate-700/50 hover:border-orange-500/50 transition-all group cursor-pointer">
                          <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-white">{rfq.client}</h4>
                              <Badge className={`${
                                rfq.urgency === 'high' ? 'bg-red-500/20 text-red-400' : 
                                rfq.urgency === 'medium' ? 'bg-amber-500/20 text-amber-400' : 
                                'bg-green-500/20 text-green-400'
                              }`}>
                                {rfq.urgency}
                              </Badge>
                            </div>
                            <Badge className={`${
                              rfq.status === 'pending' ? 'bg-blue-500/20 text-blue-400' : 
                              rfq.status === 'quoted' ? 'bg-orange-500/20 text-orange-400' : 
                              'bg-green-500/20 text-green-400'
                            }`}>
                    {rfq.status}
                  </Badge>
                </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2">
                              <Plane className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-300">{rfq.route}</span>
              </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-300">{rfq.aircraft} • {rfq.passengers} passengers</span>
                          </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-300">Budget: £{rfq.budget.toLocaleString()}</span>
                          </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-300">
                                {rfq.status === 'pending' ? 'Deadline: ' : 'Received: '}
                                {new Date(rfq.deadline).toLocaleString()}
                              </span>
                        </div>
                        </div>

                          <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                                <Send className="w-3 h-3 mr-1" />
                                Quote
                        </Button>
                              <Button size="sm" variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700">
                                <Eye className="w-3 h-3 mr-1" />
                                View
                        </Button>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">RFQ #{rfq.id}</p>
                            </div>
                      </div>
                    </div>
                  ))}
                </div>
                </div>
            </CardContent>
          </Card>

              {/* Recent Quotes */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Recent Quotes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {deals.map((deal) => (
                      <div key={deal.id} className="p-3 rounded-lg border border-slate-600 bg-slate-700/30 hover:border-orange-500/50 transition-all group cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-white">{deal.client}</h4>
                            <Badge className={`${
                              deal.status === 'completed' ? 'bg-green-500/20 text-green-400' : 
                              deal.status === 'in-progress' ? 'bg-orange-500/20 text-orange-400' : 
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {deal.status}
                            </Badge>
                          </div>
                          <span className="text-orange-400 font-semibold">£{deal.value.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{deal.route}</span>
                          <span>•</span>
                          <span>{deal.aircraft}</span>
                          <span>•</span>
                          <span>{deal.passengers} passengers</span>
                        </div>
                      </div>
        ))}
      </div>
                </CardContent>
              </Card>
    </div>
          </TabsContent>

          <TabsContent value="marketplace" className="mt-6 scroll-smooth">
    <div className="space-y-6">
              {/* Active Deals */}
              <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-orange-400" />
                    Active Deals
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 ml-2">
                      {deals.length} deals
                    </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
                  <div className="space-y-4">
                    {deals.map((deal) => (
                      <div key={deal.id} className="p-6 rounded-lg border border-slate-600 bg-slate-700/30 hover:border-orange-500/50 transition-all group cursor-pointer">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center">
                              <span className="text-lg font-bold text-white">{deal.client.charAt(0)}</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-white text-lg">{deal.client}</h4>
                              <p className="text-sm text-gray-400">{deal.clientDetails.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={`${
                              deal.status === 'completed' ? 'bg-green-500/20 text-green-400' : 
                              deal.status === 'in-progress' ? 'bg-orange-500/20 text-orange-400' : 
                              'bg-blue-500/20 text-blue-400'
                            } mb-2`}>
                              {deal.status}
                            </Badge>
                            <p className="text-2xl font-bold text-orange-400">£{deal.value.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
            <div className="flex items-center gap-2">
                              <Plane className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-300">{deal.route}</span>
            </div>
            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-300">{deal.flightDetails.date} at {deal.flightDetails.time}</span>
            </div>
            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-300">Duration: {deal.flightDetails.duration}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-300">{deal.passengers} passengers</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-300">Aircraft: {deal.aircraft}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-300">Operator: {deal.flightDetails.operator}</span>
                            </div>
            </div>
          </div>
          
                        {/* Timeline */}
                        <div className="border-t border-slate-600 pt-4">
                          <h5 className="text-sm font-medium text-white mb-3">Deal Timeline</h5>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-sm text-gray-300">RFQ Received: {new Date(deal.timeline.rfqReceived).toLocaleString()}</span>
                  </div>
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-sm text-gray-300">Quote Sent: {new Date(deal.timeline.quoteSent).toLocaleString()}</span>
                </div>
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-sm text-gray-300">Quote Accepted: {new Date(deal.timeline.quoteAccepted).toLocaleString()}</span>
                  </div>
                            {deal.timeline.flightCompleted && (
                              <div className="flex items-center gap-3">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="text-sm text-gray-300">Flight Completed: {new Date(deal.timeline.flightCompleted).toLocaleString()}</span>
                  </div>
                            )}
                            {deal.timeline.paymentReceived && (
                              <div className="flex items-center gap-3">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="text-sm text-gray-300">Payment Received: {new Date(deal.timeline.paymentReceived).toLocaleString()}</span>
                  </div>
                            )}
                </div>
                </div>

                        <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              Contact
                  </Button>
                            <Button size="sm" variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700">
                              <Eye className="w-3 h-3 mr-1" />
                              Details
                  </Button>
                </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Deal #{deal.id}</p>
                          </div>
                        </div>
                      </div>
            ))}
          </div>
        </CardContent>
      </Card>

              {/* Client Performance */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-orange-400" />
                    Client Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {deals.map((deal) => (
                      <div key={deal.id} className="p-4 rounded-lg border border-slate-600 bg-slate-700/30">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center">
                            <span className="text-sm font-bold text-white">{deal.client.charAt(0)}</span>
    </div>
                          <div>
                            <h4 className="font-medium text-white">{deal.client}</h4>
                            <p className="text-sm text-gray-400">{deal.clientDetails.name}</p>
    </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Rating:</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-white">{deal.clientDetails.rating}</span>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Total Deals:</span>
                            <span className="text-white">{deal.clientDetails.totalDeals}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Contact:</span>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" className="p-1 h-6 w-6 text-gray-400 hover:text-white">
                                <Mail className="w-3 h-3" />
          </Button>
                              <Button size="sm" variant="ghost" className="p-1 h-6 w-6 text-gray-400 hover:text-white">
                                <Phone className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="mt-6 scroll-smooth">
    <div className="space-y-6">
              {/* Financial Overview */}
              <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-orange-400" />
                    Financial Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
              <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-400">Total Revenue</span>
              </div>
                      <p className="text-2xl font-bold text-white">£97,000</p>
                      <p className="text-xs text-green-400">+12% this month</p>
            </div>
                    <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
              <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span className="text-sm text-gray-400">Pending Payments</span>
              </div>
                      <p className="text-2xl font-bold text-white">£52,000</p>
                      <p className="text-xs text-amber-400">2 deals pending</p>
            </div>
                    <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
              <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-gray-400">Completed</span>
              </div>
                      <p className="text-2xl font-bold text-white">£45,000</p>
                      <p className="text-xs text-blue-400">1 deal completed</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-gray-400">Commission</span>
                      </div>
                      <p className="text-2xl font-bold text-white">£9,700</p>
                      <p className="text-xs text-purple-400">10% average</p>
            </div>
          </div>
        </CardContent>
      </Card>

              {/* Payment History */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-400" />
                    Payment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deals.map((deal) => (
                      <div key={deal.id} className="p-4 rounded-lg border border-slate-600 bg-slate-700/30">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center">
                              <span className="text-sm font-bold text-white">{deal.client.charAt(0)}</span>
    </div>
                            <div>
                              <h4 className="font-medium text-white">{deal.client}</h4>
                              <p className="text-sm text-gray-400">Deal #{deal.id}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-orange-400">£{deal.value.toLocaleString()}</p>
                            <Badge className={`${
                              deal.timeline.paymentReceived ? 'bg-green-500/20 text-green-400' : 
                              'bg-amber-500/20 text-amber-400'
                            }`}>
                              {deal.timeline.paymentReceived ? 'Paid' : 'Pending'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
                            <span className="text-gray-400">Route:</span>
                            <p className="text-white">{deal.route}</p>
            </div>
                          <div>
                            <span className="text-gray-400">Aircraft:</span>
                            <p className="text-white">{deal.aircraft}</p>
          </div>
                          <div>
                            <span className="text-gray-400">Commission:</span>
                            <p className="text-white">£{(deal.value * 0.1).toLocaleString()}</p>
          </div>
        </div>

                        {deal.timeline.paymentReceived && (
                          <div className="mt-3 pt-3 border-t border-slate-600">
                            <div className="flex items-center gap-2 text-sm text-green-400">
                              <CheckCircle className="w-4 h-4" />
                              <span>Payment received: {new Date(deal.timeline.paymentReceived).toLocaleString()}</span>
          </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Invoices */}
              <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-400" />
                    Recent Invoices
                </CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-3">
                    {deals.map((deal) => (
                      <div key={deal.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-600 bg-slate-700/30">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-white font-medium">Invoice #{deal.id}</p>
                            <p className="text-sm text-gray-400">{deal.client}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-orange-400 font-semibold">£{deal.value.toLocaleString()}</span>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="p-1 h-6 w-6 text-gray-400 hover:text-white">
                              <Eye className="w-3 h-3" />
                  </Button>
                            <Button size="sm" variant="ghost" className="p-1 h-6 w-6 text-gray-400 hover:text-white">
                              <Download className="w-3 h-3" />
                            </Button>
                    </div>
                        </div>
                      </div>
                    ))}
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
                    Verification Center
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 ml-2">
                      Active
                    </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-gray-400">Verified Operators</span>
                        </div>
                        <p className="text-2xl font-bold text-white">12</p>
                        <p className="text-xs text-green-400">All active</p>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-amber-400" />
                          <span className="text-sm text-gray-400">Pending Reviews</span>
                        </div>
                        <p className="text-2xl font-bold text-white">3</p>
                        <p className="text-xs text-amber-400">2 urgent</p>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-gray-400">Issues</span>
                        </div>
                        <p className="text-2xl font-bold text-white">0</p>
                        <p className="text-xs text-green-400">All clear</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-white">Recent Verifications</h4>
                      {deals.map((deal) => (
                        <div key={deal.id} className="p-3 rounded-lg border border-slate-600 bg-slate-700/30">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                                <span className="text-xs font-bold text-white">{deal.client.charAt(0)}</span>
                              </div>
                              <div>
                                <p className="text-white font-medium">{deal.client}</p>
                                <p className="text-sm text-gray-400">{deal.flightDetails.operator}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-500/20 text-green-400">Verified</Badge>
                              <Button size="sm" variant="ghost" className="p-1 h-6 w-6 text-gray-400 hover:text-white">
                                <Eye className="w-3 h-3" />
                </Button>
              </div>
                          </div>
                        </div>
                      ))}
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
                    Reputation & Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Performance Metrics</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Overall Rating</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-white font-semibold">4.8/5.0</span>
                      </div>
                      </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Response Time</span>
                            <span className="text-white font-semibold">2.3 minutes</span>
                    </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Success Rate</span>
                            <span className="text-white font-semibold">98%</span>
                      </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Client Satisfaction</span>
                            <span className="text-white font-semibold">4.9/5.0</span>
                      </div>
                    </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Recent Reviews</h4>
                        <div className="space-y-3">
                          {deals.map((deal) => (
                            <div key={deal.id} className="p-3 rounded-lg border border-slate-600 bg-slate-700/30">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center">
                                    <span className="text-xs font-bold text-white">{deal.client.charAt(0)}</span>
                      </div>
                                  <span className="text-white font-medium">{deal.client}</span>
                    </div>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                  <span className="text-white text-sm">{deal.clientDetails.rating}</span>
                  </div>
                    </div>
                              <p className="text-sm text-gray-300">"Excellent service, very professional and responsive."</p>
                    </div>
                          ))}
                  </div>
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
                    Document Storage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-gray-400">Contracts</span>
                            </div>
                        <p className="text-2xl font-bold text-white">24</p>
                        <p className="text-xs text-blue-400">2 new this week</p>
                                </div>
                      <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-gray-400">Invoices</span>
                            </div>
                        <p className="text-2xl font-bold text-white">18</p>
                        <p className="text-xs text-green-400">3 pending</p>
                          </div>
                      <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                        <div className="flex items-center gap-2 mb-2">
                          <Plane className="w-4 h-4 text-orange-400" />
                          <span className="text-sm text-gray-400">Flight Plans</span>
                        </div>
                        <p className="text-2xl font-bold text-white">12</p>
                        <p className="text-xs text-orange-400">All current</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-white">Recent Documents</h4>
                      {deals.map((deal) => (
                        <div key={deal.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-600 bg-slate-700/30">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-white font-medium">Contract - {deal.client}</p>
                              <p className="text-sm text-gray-400">Deal #{deal.id} • {new Date().toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="p-1 h-6 w-6 text-gray-400 hover:text-white">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="p-1 h-6 w-6 text-gray-400 hover:text-white">
                              <Download className="w-3 h-3" />
                            </Button>
                        </div>
                      </div>
                    ))}
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
                    Communication Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-gray-400">Active Conversations</span>
                        </div>
                        <p className="text-2xl font-bold text-white">8</p>
                        <p className="text-xs text-blue-400">3 unread</p>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-gray-400">Emails Sent</span>
                        </div>
                        <p className="text-2xl font-bold text-white">47</p>
                        <p className="text-xs text-green-400">This month</p>
                      </div>
                    </div>
                    
                  <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-white">Recent Conversations</h4>
                      {deals.map((deal) => (
                        <div key={deal.id} className="p-3 rounded-lg border border-slate-600 bg-slate-700/30">
                          <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                                <span className="text-xs font-bold text-white">{deal.client.charAt(0)}</span>
                          </div>
                          <div>
                                <p className="text-white font-medium">{deal.client}</p>
                                <p className="text-sm text-gray-400">{deal.clientDetails.name}</p>
                          </div>
                        </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-500/20 text-green-400">Online</Badge>
                              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                                <MessageSquare className="w-3 h-3 mr-1" />
                                Chat
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300">"Thank you for the excellent service on the {deal.route} flight..."</p>
                      </div>
                    ))}
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