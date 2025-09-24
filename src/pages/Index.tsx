import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoginModal } from "@/components/LoginModal";
import { NavigationArrows } from "@/components/NavigationArrows";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import { CluelyAviationAI } from "@/components/ai/CluelyAviationAI";
import { ModernHelpGuide } from "@/components/ModernHelpGuide";
import { ChatGPTHelper } from "@/components/ai/ChatGPTHelper";
import { RealTimeChat } from "@/components/chat/RealTimeChat";
import MarketIntelligence from "@/components/MarketIntelligence";
import { WorkflowAutomation } from "@/components/automation/WorkflowAutomation";
import AdvancedAnalytics from "@/components/AdvancedAnalytics";
import { ClientPortal } from "@/components/portal/ClientPortal";
import ModernPlasmaBackground from "@/components/ModernPlasmaBackground";
import { Search, ArrowRight, Lock, ChevronRight, Brain, MessageSquare, Trophy, Users, Plane, BarChart3, Shield, Target, Zap, Globe, Clock, Sparkles, CheckCircle } from "lucide-react";

export default function Index() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showAI, setShowAI] = useState(true);
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  const clientTypes = [
    {
      title: "Brokers",
      description: "Speed creates advantage. Win more quotes with a cleaner cockpit.",
      route: "/demo/broker",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-500",
      features: ["AI Quote Analysis", "Deal Pipeline", "Client Management"]
    },
    {
      title: "Operators", 
      description: "Fill the legs. Lift the yield. Control the risk.",
      route: "/demo/operator",
      icon: Plane,
      color: "from-emerald-500 to-teal-500",
      features: ["Fleet Management", "Quote Composer", "Operations Dashboard"]
    },
    {
      title: "Pilots",
      description: "Credentials speak. Availability sells. Fly the missions that fit.",
      route: "/demo/pilot",
      icon: Users,
      color: "from-purple-500 to-violet-500",
      features: ["Flight Deck", "Schedule Management", "Performance Analytics"]
    },
    {
      title: "Cabin Crew",
      description: "Professional service wins repeat work. Your calendar is your shop window.",
      route: "/demo/crew",
      icon: Shield,
      color: "from-orange-500 to-red-500",
      features: ["Availability Calendar", "Certification Tracking", "Job Pipeline"]
    }
  ];

  const footerLinks = [
    { label: "About", href: "/about" },
    { label: "Terms", href: "/terms" },
    { label: "Rules", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Security", href: "#" },
    { label: "Fees", href: "#" },
    { label: "Contact", href: "/contact" }
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
      <ModernPlasmaBackground />
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StratusConnectLogo />
              <div className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
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
                variant="ghost" 
                onClick={() => setShowAIAssistant(true)}
                className="text-white hover:bg-white/10"
              >
                <Brain className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setShowChat(true)}
                className="text-white hover:bg-white/10"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat
              </Button>
              <Button 
                onClick={() => setIsLoginOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
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
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium">New: AI is getting an upgrade</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-8">
              Save 4 hours per person
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                every single week
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent font-bold">
                StratusConnect
              </span> is the most productive aviation platform ever made. 
              Collaborate faster and get more done with AI-native aviation management.
            </p>

            <div className="flex items-center justify-center gap-8 mb-12">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium px-8 py-4 text-lg"
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
              <div className="text-4xl font-bold text-blue-400 mb-2">15 M</div>
              <p className="text-gray-400 text-lg">
                <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent font-bold">
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
                <div 
                  key={index}
                  className="group cursor-pointer"
                  onClick={() => navigate(client.route)}
                >
                  <div className={`relative p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105`}>
                    <div className={`w-16 h-16 mb-6 rounded-xl bg-gradient-to-r ${client.color} flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{client.title}</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">{client.description}</p>
                    <div className="space-y-2">
                      {client.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-400">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                      Launch Terminal
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-8">
              Why Choose <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">StratusConnect</span>?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center">
                    <Icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-5xl font-bold mb-8">
            Ready to Transform Your Aviation Operations?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Join thousands of aviation professionals who are already using 
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent font-bold"> StratusConnect</span> to transform their operations.
          </p>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium px-12 py-6 text-xl"
            onClick={() => navigate('/demo/broker')}
          >
            Get Started Now
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <StratusConnectLogo />
                <div className="text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  StratusConnect
                </div>
              </div>
              <p className="text-gray-400 text-sm">The Most Productive Aviation Platform Ever Made</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>AI</div>
                <div>Calendar</div>
                <div>Enterprise</div>
                <div>Sales</div>
                <div>Agencies</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Blog</div>
                <div>Careers</div>
                <div>Support</div>
                <div>Contact Us</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Privacy</div>
                <div>Terms</div>
                <div>AUP</div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 StratusConnect. All rights reserved.</p>
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

      {showAIAssistant && (
        <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 w-96 max-h-[80vh]">
          <ChatGPTHelper
            isOpen={showAIAssistant}
            onClose={() => setShowAIAssistant(false)}
            context={{
              activeTab: "dashboard",
              userRole: "broker",
              recentActivity: []
            }}
          />
        </div>
      )}

      {showChat && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 w-96 max-h-[80vh]">
          <RealTimeChat
            chatId="demo_landing_chat_001"
            participants={[
              { id: 'user_001', name: 'You', role: 'team', isOnline: true },
              { id: 'support_001', name: 'Support Team', role: 'team', isOnline: true },
              { id: 'ai_001', name: 'AI Assistant', role: 'team', isOnline: true }
            ]}
            onClose={() => setShowChat(false)}
          />
        </div>
      )}

      <NavigationArrows />
    </div>
  );
}