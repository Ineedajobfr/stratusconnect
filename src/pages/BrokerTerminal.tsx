import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { brokerDashboardService } from "@/lib/broker-dashboard-service";
import { BrokerMarketplace } from "@/components/marketplace/BrokerMarketplace";
import {
    Award,
    BarChart3,
    Bell,
    CheckCircle,
    Clock,
    DollarSign,
    FileText,
    MessageCircle,
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
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card className="terminal-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gunmetal">Active RFQs</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{dashboardMetrics.activeRfqs}</div>
                        <p className="text-xs text-muted-foreground">
                            +2 from last week
                        </p>
                    </CardContent>
                </Card>

                <Card className="terminal-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gunmetal">Quotes Received</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{dashboardMetrics.quotesReceived}</div>
                        <p className="text-xs text-muted-foreground">
                            +12 from last week
                        </p>
                    </CardContent>
                </Card>

                <Card className="terminal-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gunmetal">Deals Closed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{dashboardMetrics.dealsClosed}</div>
                        <p className="text-xs text-muted-foreground">
                            +3 from last week
                        </p>
                    </CardContent>
                </Card>

                <Card className="terminal-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gunmetal">Avg Response Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{dashboardMetrics.responseTime}m</div>
                        <p className="text-xs text-muted-foreground">
                            -5m from last week
                        </p>
                    </CardContent>
                </Card>

                <Card className="terminal-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gunmetal">Reputation</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{dashboardMetrics.reputation}/5</div>
                        <p className="text-xs text-muted-foreground">
                            +0.2 from last week
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent RFQs */}
            <Card className="terminal-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-accent" />
                        Recent RFQs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {rfqs.slice(0, 5).map((rfq) => (
                            <div key={rfq.id} className="flex items-center justify-between p-4 border border-terminal-border rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">{rfq.client} - {rfq.route}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {rfq.aircraft} • {rfq.passengers} passengers • ${rfq.budget.toLocaleString()}
                                        </p>
                                        <div className="flex gap-2 mt-1">
                                            <Badge variant="secondary" className="text-xs">
                                                {rfq.urgency}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                {rfq.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(rfq.received).toLocaleDateString()}
                                    </p>
                                    <Button size="sm" className="mt-2">
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderRFQs = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Request for Quotes</h2>
                <Button className="btn-terminal-accent">
                    <Plus className="w-4 h-4 mr-2" />
                    Create RFQ
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {rfqs.map((rfq) => (
                    <Card key={rfq.id} className="terminal-card">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Badge className={`text-xs ${
                                            rfq.urgency === 'high' ? 'bg-red-500' : 
                                            rfq.urgency === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                        }`}>
                                            {rfq.urgency}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {rfq.status}
                                        </Badge>
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">{rfq.client}</h3>
                                    <p className="text-muted-foreground mb-4">{rfq.route}</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Aircraft</p>
                                            <p className="font-medium text-foreground">{rfq.aircraft}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Passengers</p>
                                            <p className="font-medium text-foreground">{rfq.passengers}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Budget</p>
                                            <p className="font-medium text-foreground">${rfq.budget.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Deadline</p>
                                            <p className="font-medium text-foreground">{new Date(rfq.deadline).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-6 flex flex-col gap-2">
                                    <Button className="btn-terminal-accent">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Send Quote
                                    </Button>
                                    <Button variant="outline" className="border-terminal-border">
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
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
                            <TabsTrigger value="rfqs" className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                RFQs
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

                    <TabsContent value="rfqs" className="space-y-6">
                        {renderRFQs()}
                    </TabsContent>

                    <TabsContent value="marketplace" className="space-y-6">
                        <BrokerMarketplace />
                    </TabsContent>

                    <TabsContent value="billing" className="space-y-6">
                        <Card className="terminal-card">
                            <CardHeader>
                                <CardTitle>Billing & Payments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Billing information will be displayed here.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="reputation" className="space-y-6">
                        <Card className="terminal-card">
                            <CardHeader>
                                <CardTitle>Reputation & Reviews</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Reputation metrics will be displayed here.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="documents" className="space-y-6">
                        <Card className="terminal-card">
                            <CardHeader>
                                <CardTitle>Document Management</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Document storage and management will be available here.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="communication" className="space-y-6">
                        <Card className="terminal-card">
                            <CardHeader>
                                <CardTitle>Communication Center</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Client communication tools will be available here.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}