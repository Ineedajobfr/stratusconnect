import { BrokerMarketplace } from "@/components/Marketplace/BrokerMarketplace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { brokerDashboardService } from "@/lib/broker-dashboard-service";
import {
    Award,
    BarChart3,
    Bell,
    CheckCircle,
    Clock,
    DollarSign,
    FileText,
    MapPin,
    MessageCircle,
    MessageSquare,
    Plus,
    Search,
    Star,
    TrendingUp,
    Trophy,
    User,
    X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface RFQ {
    id: string;
    client: string;
    route: string;
    aircraft: string;
    passengers: number;
    budget: number;
    urgency: 'low' | 'medium' | 'high';
    received: string;
    deadline: string;
    status: 'pending' | 'quoted' | 'accepted' | 'rejected';
}

interface Quote {
    id: string;
    rfqId: string;
    operator: string;
    price: number;
    currency: string;
    validUntil: string;
    aircraft: string;
    verified: boolean;
    rating: number;
    responseTime: number;
    dealScore: number;
}

export default function BrokerTerminal() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
    const [unreadAlertsCount, setUnreadAlertsCount] = useState(0);
    const [rfqs, setRfqs] = useState<RFQ[]>([]);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [dashboardMetrics, setDashboardMetrics] = useState({
        activeRfqs: 0,
        quotesReceived: 0,
        dealsClosed: 0,
        responseTime: 0,
        reputation: 0
    });
    const alertsDropdownRef = useRef<HTMLDivElement>(null);

    // Load dashboard data
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                if (user?.id) {
                    const metrics = await brokerDashboardService.getDashboardMetrics(user.id);
                    setDashboardMetrics({
                        activeRfqs: metrics.activeRFQs,
                        quotesReceived: metrics.quotesReceived,
                        dealsClosed: metrics.dealsClosed,
                        responseTime: metrics.avgResponseTime,
                        reputation: metrics.reputationPoints
                    });
                    
                    const rfqData = await brokerDashboardService.getBrokerRFQs(user.id);
                    setRfqs(rfqData.map(rfq => ({
                        id: rfq.id,
                        client: 'Client',
                        route: rfq.route,
                        aircraft: 'Aircraft',
                        passengers: rfq.passengers,
                        budget: 50000,
                        urgency: 'medium' as const,
                        received: rfq.createdAt,
                        deadline: rfq.expiresAt,
                        status: rfq.status as any
                    })));
                    
                    const quoteData = await brokerDashboardService.getAllQuotes(user.id);
                    setQuotes(quoteData.map(quote => ({
                        id: quote.id,
                        rfqId: quote.rfqId,
                        operator: quote.operatorName,
                        price: quote.price,
                        currency: quote.currency,
                        validUntil: quote.validUntil,
                        aircraft: quote.aircraft,
                        verified: true,
                        rating: quote.operatorRating,
                        responseTime: quote.responseTime,
                        dealScore: 85
                    })));
                }
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            }
        };

        loadDashboardData();
    }, []);

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

    const handleAcceptQuote = async (quoteId: string) => {
        try {
            if (user?.id) {
                await brokerDashboardService.acceptQuote(quoteId, user.id);
                // Refresh data
                const metrics = await brokerDashboardService.getDashboardMetrics(user.id);
                setDashboardMetrics({
                    activeRfqs: metrics.activeRFQs,
                    quotesReceived: metrics.quotesReceived,
                    dealsClosed: metrics.dealsClosed,
                    responseTime: metrics.avgResponseTime,
                    reputation: metrics.reputationPoints
                });
            }
        } catch (error) {
            console.error('Error accepting quote:', error);
        }
    };

    const handleRejectQuote = async (quoteId: string) => {
        try {
            await brokerDashboardService.rejectQuote(quoteId);
            // Refresh data
            if (user?.id) {
                const metrics = await brokerDashboardService.getDashboardMetrics(user.id);
                setDashboardMetrics({
                    activeRfqs: metrics.activeRFQs,
                    quotesReceived: metrics.quotesReceived,
                    dealsClosed: metrics.dealsClosed,
                    responseTime: metrics.avgResponseTime,
                    reputation: metrics.reputationPoints
                });
            }
        } catch (error) {
            console.error('Error rejecting quote:', error);
        }
    };

    const renderDashboard = () => (
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
                                    <Clock className="w-5 h-5 text-amber-400" />
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
                            <p className="text-3xl font-bold text-white mb-1">{dashboardMetrics.quotesReceived}</p>
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
                            <p className="text-3xl font-bold text-white mb-1">{dashboardMetrics.dealsClosed}</p>
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
                            <p className="text-3xl font-bold text-white mb-1">{dashboardMetrics.dealsClosed}</p>
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
                            <p className="text-3xl font-bold text-white mb-1">{dashboardMetrics.responseTime}m</p>
                            <p className="text-sm text-gray-400">Fast lane eligible</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Reputation & Performance */}
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
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <MapPin className="w-5 h-5 text-orange-400" />
                            Real-Time Flight Tracking
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 bg-slate-900/50 rounded-lg flex items-center justify-center">
                            <p className="text-gray-400">Flight tracking map will be displayed here</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );


    const renderMarketplace = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Marketplace</h2>
                <Button className="btn-terminal-accent">
                    <Plus className="w-4 h-4 mr-2" />
                    Browse Flights
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {quotes.map((quote) => (
                    <Card key={quote.id} className="terminal-card">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Badge className={`text-xs ${quote.verified ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                            {quote.verified ? 'Verified' : 'Unverified'}
                                        </Badge>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="text-sm text-foreground">{quote.rating}/5</span>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            Score: {quote.dealScore}
                                        </Badge>
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">{quote.operator}</h3>
                                    <p className="text-muted-foreground mb-4">{quote.aircraft}</p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Price</p>
                                            <p className="font-medium text-foreground">{quote.currency} {quote.price.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Valid Until</p>
                                            <p className="font-medium text-foreground">{new Date(quote.validUntil).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Response Time</p>
                                            <p className="font-medium text-foreground">{quote.responseTime}m</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-6 flex flex-col gap-2">
                                    <Button 
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => handleAcceptQuote(quote.id)}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Accept Quote
                                    </Button>
                                    <Button 
                                        variant="destructive"
                                        onClick={() => handleRejectQuote(quote.id)}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

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
                                                    <p className="text-sm font-medium text-white">New RFQ Available</p>
                                                    <p className="text-xs text-gray-400 mt-1">Check marketplace for new opportunities</p>
                                                    <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer">
                                            <div className="flex items-start gap-3">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-white">Quote Response</p>
                                                    <p className="text-xs text-gray-400 mt-1">New quote received for your RFQ</p>
                                                    <p className="text-xs text-gray-500 mt-1">15 minutes ago</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

            {/* New RFQ Button - Redirect to Marketplace */}
            <Button
              onClick={() => setActiveTab('marketplace')}
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

                        {/* User Info */}
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-white text-sm">{user?.fullName || user?.email}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto p-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-terminal-border scrollbar-track-transparent pb-2 mb-8">
                        <TabsList className="flex w-max min-w-full justify-start space-x-1 backdrop-blur-sm" style={{ backgroundColor: 'hsla(210, 30%, 15%, 0.5)' }}>
                            <TabsTrigger value="dashboard" className="flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Dashboard
                            </TabsTrigger>
                            <TabsTrigger value="marketplace" className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Marketplace
                            </TabsTrigger>
                            <TabsTrigger value="billing" className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Billing
                            </TabsTrigger>
                            <TabsTrigger value="reputation" className="flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                Reputation
                            </TabsTrigger>
                            <TabsTrigger value="documents" className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Documents
                            </TabsTrigger>
                            <TabsTrigger value="communication" className="flex items-center gap-2">
                                <MessageCircle className="w-4 h-4" />
                                Communication
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="dashboard" className="space-y-6">
                        {renderDashboard()}
                    </TabsContent>


                    <TabsContent value="marketplace" className="space-y-6">
                        <BrokerMarketplace />
                    </TabsContent>

                    <TabsContent value="billing" className="space-y-6">
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-orange-400" />
                                    Billing & Payments
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
                    </TabsContent>

                    <TabsContent value="reputation" className="space-y-6">
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
                    </TabsContent>

                    <TabsContent value="documents" className="space-y-6">
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
                    </TabsContent>

                    <TabsContent value="communication" className="space-y-6">
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
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
