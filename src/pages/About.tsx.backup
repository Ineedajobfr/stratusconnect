import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Shield, Zap, Globe, Award, CheckCircle, Plane, Briefcase, CreditCard, BarChart3, Navigation, FileText, Calendar, Bell, TrendingUp, Building, Clock, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NavigationArrows } from "@/components/NavigationArrows";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";

export default function About() {
  const navigate = useNavigate();

  const stories = [
    {
      category: "Innovation",
      title: "The Aviation Terminal Revolution",
      description: "We asked: What if aviation had its own Bloomberg Terminal? The result is four specialized terminals that transform how brokers, operators, pilots, and crew connect and transact.",
      icon: <Plane className="w-8 h-8 text-orange-400" />,
      date: "2024"
    },
    {
      category: "Impact", 
      title: "Real-Time Operations, Real Results",
      description: "From London to Dubai in seconds. Our platform delivers instant availability updates, secure messaging, and transparent transactions that keep aviation moving.",
      icon: <Zap className="w-8 h-8 text-orange-400" />,
      date: "2024"
    },
    {
      category: "Technology",
      title: "Built for Aviation's Demands",
      description: "24/7 global operations, enterprise security, and AI-powered matching. We built the infrastructure aviation professionals actually need.",
      icon: <Shield className="w-8 h-8 text-orange-400" />,
      date: "2024"
    },
    {
      category: "Community",
      title: "Where Aviation Professionals Connect",
      description: "Brokers find aircraft. Operators manage fleets. Pilots and crew get hired. Everyone gets paid securely. This is how aviation commerce should work.",
      icon: <Users className="w-8 h-8 text-orange-400" />,
      date: "2024"
    }
  ];

  const terminals = [
    {
      name: "Broker Terminal",
      description: "Source aircraft, manage RFQs, close deals",
      icon: <Briefcase className="w-6 h-6" />,
      color: "text-blue-400"
    },
    {
      name: "Operator Terminal", 
      description: "Manage fleet, post jobs, optimize revenue",
      icon: <Building className="w-6 h-6" />,
      color: "text-green-400"
    },
    {
      name: "Pilot Terminal",
      description: "Browse jobs, manage credentials, build reputation",
      icon: <Plane className="w-6 h-6" />,
      color: "text-purple-400"
    },
    {
      name: "Crew Terminal",
      description: "Set availability, track assignments, showcase skills",
      icon: <Users className="w-6 h-6" />,
      color: "text-yellow-400"
    }
  ];

  const stats = [
    { value: "4", label: "Specialized Terminals", icon: <Building className="w-6 h-6" /> },
    { value: "24/7", label: "Global Operations", icon: <Globe className="w-6 h-6" /> },
    { value: "100%", label: "Verified Users", icon: <Shield className="w-6 h-6" /> },
    { value: "$0", label: "Join Fee", icon: <Award className="w-6 h-6" /> }
  ];

  return (
    <div className="relative min-h-screen bg-slate-900">
      <StarfieldRunwayBackground intensity={0.7} starCount={260} />
      
      <div className="absolute top-4 left-4 z-40">
        <StratusConnectLogo />
      </div>
      
      <div className="absolute top-4 right-4 z-40">
        <NavigationArrows />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-6xl">
        {/* Header - Our Aviation Story */}
        <div className="mb-16">
        <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]">
              Our Stories
          </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Connecting aviation professionals to a dynamic network of opportunities, 
              secure transactions, and real-time operations around the world.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center mb-12">
            <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
              {["All Stories", "Innovation", "Impact", "Technology", "Community"].map((filter) => (
                <button
                  key={filter}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === "All Stories" 
                      ? "bg-orange-500 text-white" 
                      : "text-white/70 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {stories.map((story, index) => (
            <Card key={index} className="terminal-card hover:terminal-glow transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    {story.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs text-orange-400 border-orange-400/30">
                        {story.category}
                      </Badge>
                      <span className="text-xs text-white/60">{story.date}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{story.title}</h3>
                    <p className="text-white/80 leading-relaxed">{story.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* StratusConnect Overview */}
        <Card className="terminal-card mb-16">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-white mb-4">StratusConnect</CardTitle>
            <p className="text-center text-white/80 text-lg max-w-4xl mx-auto">
              Connecting decision makers to a dynamic network of aircraft, crew, and opportunities. 
              StratusConnect quickly and accurately delivers aviation services, real-time availability, 
              and secure transactions around the world.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-3">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto">
                    <stat.icon className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="text-3xl font-bold text-orange-400">{stat.value}</div>
                  <h3 className="font-semibold text-white text-sm">{stat.label}</h3>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Terminal Showcase */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">The Terminals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {terminals.map((terminal, index) => (
              <Card key={index} className="terminal-card hover:terminal-glow transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <terminal.icon className={`w-6 h-6 ${terminal.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{terminal.name}</h3>
                  <p className="text-white/80 text-sm">{terminal.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How We Work */}
        <Card className="terminal-card mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-white">How StratusConnect Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Verify</h3>
                <p className="text-white/80 text-sm">KYC/AML verification and credential validation</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Connect</h3>
                <p className="text-white/80 text-sm">Real-time availability and instant messaging</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Transact</h3>
                <p className="text-white/80 text-sm">Secure quotes, contracts, and escrow payments</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Deliver</h3>
                <p className="text-white/80 text-sm">Execution tracking and performance scoring</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Values */}
        <Card className="terminal-card mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-white">Our Commitment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Transparency First</h3>
                    <p className="text-white/80 text-sm">Every transaction recorded, every fee disclosed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Security by Design</h3>
                    <p className="text-white/80 text-sm">Enterprise encryption and audit trails</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Performance Driven</h3>
                    <p className="text-white/80 text-sm">Real-time operations and instant responses</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Global from Day One</h3>
                    <p className="text-white/80 text-sm">Multi-currency, multi-timezone operations</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Ready to Transform Aviation?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Experience the future of aviation commerce. Try our live demos and see how each terminal works.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/demo')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3"
            >
              Try Live Demos
            </Button>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-3"
            >
              Explore Platform
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}