import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LoginModal } from "@/components/LoginModal";
import { NavigationArrows } from "@/components/NavigationArrows";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import { ModernHelpGuide } from "@/components/ModernHelpGuide";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Search, 
  ArrowRight, 
  Lock, 
  ChevronRight, 
  Brain, 
  MessageSquare, 
  Trophy, 
  Users, 
  Plane, 
  BarChart3, 
  Shield, 
  Target, 
  Zap, 
  Globe, 
  Clock, 
  Sparkles, 
  CheckCircle,
  DollarSign,
  Building2,
  UserCheck,
  Info,
  Percent,
  BookOpen,
  Play,
  Download
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showHelpGuide, setShowHelpGuide] = useState(false);

  // Redirect authenticated users to their home page
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const clientTypes = [
    {
      title: "Brokers",
      description: "Speed creates advantage. Win more quotes with a cleaner cockpit.",
      route: "/demo/broker",
      actualRoute: "/terminal/broker",
      icon: BarChart3,
      color: "from-orange-500 to-orange-400",
      features: ["AI Quote Analysis", "Deal Pipeline", "Client Management"]
    },
    {
      title: "Operators", 
      description: "Fill the legs. Lift the yield. Control the risk.",
      route: "/demo/operator",
      actualRoute: "/terminal/operator",
      icon: Plane,
      color: "from-emerald-500 to-teal-500",
      features: ["Fleet Management", "Quote Composer", "Operations Dashboard"]
    },
    {
      title: "Pilots",
      description: "Credentials speak. Availability sells. Fly the missions that fit.",
      route: "/demo/pilot",
      actualRoute: "/terminal/pilot",
      icon: Users,
      color: "from-purple-500 to-violet-500",
      features: ["Flight Deck", "Schedule Management", "Performance Analytics"]
    },
    {
      title: "Cabin Crew",
      description: "Professional service wins repeat work. Your calendar is your shop window.",
      route: "/demo/crew",
      actualRoute: "/terminal/crew",
      icon: Shield,
      color: "from-orange-500 to-red-500",
      features: ["Availability Calendar", "Certification Tracking", "Job Pipeline"]
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Advanced AI assists with quote analysis, route optimization, and predictive analytics"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built for speed with real-time updates and instant responses"
    },
    {
      icon: Target,
      title: "Precision Focus",
      description: "Focus on what matters most with intelligent prioritization"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connect with operators, pilots, and crew worldwide"
    },
    {
      icon: Lock,
      title: "Bank-Grade Security",
      description: "FCA compliant with enterprise-level security and encryption"
    },
    {
      icon: Clock,
      title: "Real-Time Everything",
      description: "Live updates, instant notifications, and seamless collaboration"
    }
  ];

  return (
    <div className="min-h-screen bg-app text-body relative overflow-hidden">
      <StarfieldRunwayBackground />
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StratusConnectLogo />
              <div className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
                StratusConnect
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
                <CheckCircle className="w-3 h-3 mr-1" />
                FCA Compliant
              </Badge>
              <Button 
                variant="ghost" 
                onClick={() => setShowHelpGuide(true)}
                className="text-white hover:bg-white/10"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Help
              </Button>
              <Button 
                onClick={() => setIsLoginOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 font-medium">New: AI is getting an upgrade</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-8">
              Save 4 hours per person
              <br />
              <span className="bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
                every single week
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent font-bold">
                StratusConnect
              </span> is the most productive aviation platform ever made. 
              Collaborate faster and get more done with AI-native aviation management.
            </p>

            <div className="flex items-center justify-center gap-8 mb-12">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-medium px-8 py-4 text-lg"
                onClick={() => navigate('/demo/broker')}
              >
                Get Started
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 font-medium px-8 py-4 text-lg"
              >
                <Search className="w-5 h-5 mr-2" />
                Explore Features
              </Button>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">15 M</div>
              <p className="text-gray-400 text-lg">
                <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent font-bold">
                  StratusConnect
                </span> saves teams over 15 million hours every single year.
              </p>
            </div>
          </div>
        </section>

        {/* Terminal Selection */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-8">
              Choose Your Terminal
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Access your specialized dashboard designed for your role in the aviation ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {clientTypes.map((client, index) => {
              const Icon = client.icon;
              return (
                <div key={index} className="space-y-4">
                  {/* Demo Terminal */}
                  <div 
                    className="group cursor-pointer"
                    onClick={() => navigate(client.route)}
                  >
                    <div className={`relative p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105`}>
                      <div className={`w-16 h-16 mb-6 rounded-xl bg-gradient-to-r ${client.color} flex items-center justify-center`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">{client.title} Demo</h3>
                      <p className="text-gray-300 mb-6 leading-relaxed">{client.description}</p>
                      <div className="space-y-2">
                        {client.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-400">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            {feature}
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 flex items-center text-orange-400 group-hover:text-orange-300 transition-colors">
                        Try Demo
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Actual Terminal */}
                  <div 
                    className="group cursor-pointer"
                    onClick={() => navigate(client.actualRoute)}
                  >
                    <div className={`relative p-6 rounded-2xl border border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 transition-all duration-300 hover:scale-105`}>
                      <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-r ${client.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{client.title} Terminal</h3>
                      <p className="text-gray-300 text-sm mb-4">Full access to your professional dashboard</p>
                      <div className="flex items-center text-orange-400 group-hover:text-orange-300 transition-colors text-sm">
                        Launch Terminal
                        <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Why We're Different */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-8">
              Why We're Different
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The features that set us apart from the competition
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group terminal-card hover:terminal-glow cursor-pointer transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-12 h-12 text-accent" />
                    <div>
                      <CardTitle>AI That Actually Works</CardTitle>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Info className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-terminal-card border-terminal-border">
                      <DialogHeader>
                        <DialogTitle className="text-accent">AI That Actually Works</DialogTitle>
                        <DialogDescription>
                          Real AI that finds you better deals, predicts demand, and automates the boring stuff
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          Our technology is designed to empower, not overwhelm:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Predictive analytics that actually predict</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Smart matching that finds the right people</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Automation that saves you hours daily</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Real-time data that makes you money</span>
                          </li>
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Real AI that finds you better deals, predicts demand, and automates the boring stuff. 
                  Our technology is designed to empower, not overwhelm.
                </p>
              </CardContent>
            </Card>

            <Card className="group terminal-card hover:terminal-glow cursor-pointer transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-12 h-12 text-accent" />
                    <div>
                      <CardTitle>We Only Win When You Win</CardTitle>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Info className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-terminal-card border-terminal-border">
                      <DialogHeader>
                        <DialogTitle className="text-accent">We Only Win When You Win</DialogTitle>
                        <DialogDescription>
                          No monthly fees. No hidden costs. We only make money when you close deals. Your success is literally our business model.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          Unlike other platforms that charge you regardless of results:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>7% only when you close deals (brokers/operators)</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>10% hiring fee only when you get hired (crew/pilots)</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Free access for pilots and crew</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>No monthly subscriptions, ever</span>
                          </li>
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No monthly fees. No hidden costs. We only make money when you close deals. 
                  Your success is literally our business model.
                </p>
              </CardContent>
            </Card>

            <Card className="group terminal-card hover:terminal-glow cursor-pointer transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-12 h-12 text-accent" />
                    <div>
                      <CardTitle>Transparency & Trust</CardTitle>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Info className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-terminal-card border-terminal-border">
                      <DialogHeader>
                        <DialogTitle className="text-accent">Transparency & Trust</DialogTitle>
                        <DialogDescription>
                          We show you exactly what we do, how we do it, and what it costs. No hidden fees, no surprises.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          We believe in complete transparency:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Real-time deal tracking and reporting</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Upfront pricing with no hidden fees</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Honest performance metrics and analytics</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Direct access to support when you need it</span>
                          </li>
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We show you exactly what we do, how we do it, and what it costs. 
                  No hidden fees, no surprises. Just results.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Secure Escrow System */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-8">
              Secure Escrow System
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your funds are protected at every step
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">How It Works</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/20 rounded-full p-2 mt-1">
                    <span className="text-accent font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Funds Secured</h4>
                    <p className="text-muted-foreground">Payment held in secure escrow until flight completion</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/20 rounded-full p-2 mt-1">
                    <span className="text-accent font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Service Delivered</h4>
                    <p className="text-muted-foreground">Flight completed and verified by all parties</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/20 rounded-full p-2 mt-1">
                    <span className="text-accent font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Automatic Release</h4>
                    <p className="text-muted-foreground">Funds automatically released to service providers</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="terminal-card">
              <CardHeader>
                <DollarSign className="w-12 h-12 text-accent mb-4" />
                <CardTitle>Payment Protection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span className="text-muted-foreground">FDIC-insured escrow accounts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span className="text-muted-foreground">Real-time transaction monitoring</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span className="text-muted-foreground">Dispute resolution system</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span className="text-muted-foreground">24/7 fraud protection</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Transparent Pricing */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-8">
              Transparent Pricing
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Fair fees that grow with your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="terminal-card group hover:terminal-glow cursor-pointer transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <Percent className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-foreground">Broker & Operator Sales</CardTitle>
                      <CardDescription className="text-muted-foreground">Transaction fees</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent mb-2">7%</div>
                <p className="text-muted-foreground text-sm">
                  Only charged on successful transactions. No monthly fees or hidden costs.
                </p>
              </CardContent>
            </Card>

            <Card className="terminal-card group hover:terminal-glow cursor-pointer transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <Users className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Crew & Pilot Hiring</CardTitle>
                      <CardDescription>Recruitment fees</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent mb-2">10%</div>
                <p className="text-muted-foreground text-sm">
                  One-time fee per successful crew/pilot placement for specific flights.
                </p>
              </CardContent>
            </Card>

            <Card className="terminal-card group hover:terminal-glow cursor-pointer transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <UserCheck className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Crew & Pilots</CardTitle>
                      <CardDescription>Always free</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent mb-2">FREE</div>
                <p className="text-muted-foreground text-sm">
                  No fees, no subscriptions, no hidden costs. We care for our customers.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Privacy Protection */}
        <section className="py-16 bg-terminal-card/20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">Privacy by Design</h2>
              <p className="text-xl text-muted-foreground">Your data is never shared without explicit consent</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="terminal-card text-center">
                <CardContent className="pt-6">
                  <Globe className="w-10 h-10 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">GDPR Compliant</h3>
                  <p className="text-sm text-muted-foreground">Full compliance with global privacy regulations</p>
                </CardContent>
              </Card>

              <Card className="terminal-card text-center">
                <CardContent className="pt-6">
                  <Shield className="w-10 h-10 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Data Anonymization</h3>
                  <p className="text-sm text-muted-foreground">Personal data encrypted and anonymized</p>
                </CardContent>
              </Card>

              <Card className="terminal-card text-center">
                <CardContent className="pt-6">
                  <Lock className="w-10 h-10 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Selective Disclosure</h3>
                  <p className="text-sm text-muted-foreground">You control what information is visible</p>
                </CardContent>
              </Card>

              <Card className="terminal-card text-center">
                <CardContent className="pt-6">
                  <Clock className="w-10 h-10 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Data Retention</h3>
                  <p className="text-sm text-muted-foreground">Automatic deletion of expired data</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How to Use StratusConnect */}
        <section className="max-w-6xl mx-auto px-4 py-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Stop Guessing, Start Winning</h2>
            <p className="text-xl text-muted-foreground">Complete guides, AI assistance, and everything you need to succeed</p>
          </div>

          <Card className="terminal-card group hover:terminal-glow cursor-pointer transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent/20 rounded-xl">
                    <BookOpen className="w-12 h-12 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-foreground">Master the Platform in Minutes</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Get step-by-step guides, AI assistance, and terminal-specific tutorials 
                      that get you up and running fast.
                    </CardDescription>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/how-to-use')} 
                  className="btn-terminal-accent button-glow"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Complete Guide
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Building2 className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Terminal Guides</h3>
                  <p className="text-sm text-muted-foreground">Step-by-step instructions for each terminal type</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">AI Features</h3>
                  <p className="text-sm text-muted-foreground">Master AI-powered tools and automation</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Play className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Quick Start</h3>
                  <p className="text-sm text-muted-foreground">Get up and running in minutes</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Download className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Resources</h3>
                  <p className="text-sm text-muted-foreground">Download guides and access support</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Performance & Reliability */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-foreground mb-12">Enterprise Performance</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-5xl font-bold text-accent mb-4">99.99%</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Uptime SLA</h3>
                <p className="text-muted-foreground">Mission-critical reliability with redundant infrastructure</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-accent mb-4">&lt;50ms</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Response Time</h3>
                <p className="text-muted-foreground">Lightning-fast performance optimized for real-time operations</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-accent mb-4">24/7</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Support</h3>
                <p className="text-muted-foreground">Dedicated support team available around the clock</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-5xl font-bold mb-8">
            Ready to Transform Your Aviation Operations?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Join thousands of aviation professionals who are already using 
            <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent font-bold"> StratusConnect</span> to transform their operations.
          </p>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-medium px-12 py-6 text-xl"
            onClick={() => navigate('/demo/broker')}
          >
            Get Started Now
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">StratusConnect</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                The platform that's already processing millions in deals.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                  <Globe className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                  <MessageSquare className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white">Legal</h3>
              <div className="space-y-4">
                <div>
                  <Button variant="link" className="p-0 h-auto text-sm text-gray-300 hover:text-white justify-start font-normal" onClick={() => navigate('/terms-of-service')}>
                    Terms of Service
                  </Button>
                </div>
                <div>
                  <Button variant="link" className="p-0 h-auto text-sm text-gray-300 hover:text-white justify-start font-normal" onClick={() => navigate('/privacy-policy')}>
                    Privacy Policy
                  </Button>
                </div>
                <div>
                  <Button variant="link" className="p-0 h-auto text-sm text-gray-300 hover:text-white justify-start font-normal" onClick={() => navigate('/cookie-policy')}>
                    Cookie Policy
                  </Button>
                </div>
                <div>
                  <Button variant="link" className="p-0 h-auto text-sm text-gray-300 hover:text-white justify-start font-normal" onClick={() => navigate('/user-agreement')}>
                    User Agreement
                  </Button>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white">Support</h3>
              <div className="space-y-4">
                <div>
                  <Button variant="link" className="p-0 h-auto text-sm text-gray-300 hover:text-white justify-start font-normal">
                    Help Center
                  </Button>
                </div>
                <div>
                  <Button variant="link" className="p-0 h-auto text-sm text-gray-300 hover:text-white justify-start font-normal">
                    Contact Us
                  </Button>
                </div>
                <div>
                  <Button variant="link" className="p-0 h-auto text-sm text-gray-300 hover:text-white justify-start font-normal">
                    Status Page
                  </Button>
                </div>
                <div>
                  <Button variant="link" className="p-0 h-auto text-sm text-gray-300 hover:text-white justify-start font-normal">
                    API Documentation
                  </Button>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white">Security</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-300">
                  <Shield className="w-4 h-4 text-green-400 mr-3" />
                  SOC 2 Compliant
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Lock className="w-4 h-4 text-green-400 mr-3" />
                  End-to-End Encryption
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                  Zero-Trust Architecture
                </div>
              </div>
            </div>
          </div>

          {/* Separator Line */}
          <div className="border-t border-gray-700 mb-8"></div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © September 2025 StratusConnect. All rights reserved. Built for the aviation industry.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>FCA Compliant</span>
              <span>•</span>
              <span>GDPR Ready</span>
              <span>•</span>
              <span>ISO 27001</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals and Overlays */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      
      {showHelpGuide && (
        <ModernHelpGuide
          terminalType="broker"
          activeTab="dashboard"
          onClose={() => setShowHelpGuide(false)}
          showOnMount={false}
          isDemo={true}
        />
      )}

      <NavigationArrows />
    </div>
  );
}