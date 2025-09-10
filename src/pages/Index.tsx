import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { LoginModal } from "@/components/LoginModal";
import { 
  Plane, 
  Users, 
  BarChart3, 
  Shield, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Brain,
  Bot
} from "lucide-react";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";
import { Events } from "@/lib/events";

export default function Index() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Track page view
    Events.pageView('home');
  }, []);

  const handleCookieAccept = () => {
    setCookiesAccepted(true);
    localStorage.setItem('cookiesAccepted', 'true');
  };

  useEffect(() => {
    const accepted = localStorage.getItem('cookiesAccepted');
    if (accepted) {
      setCookiesAccepted(true);
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-800 to-slate-950">
      <StarfieldRunwayBackground intensity={0.3} starCount={150} />
      
      {/* Navigation */}
      <nav className="relative z-10 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">StratusConnect</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <button 
                    onClick={() => setIsLoginOpen(true)}
                    className="text-white hover:text-slate-300 transition-colors px-4 py-2 font-medium"
                  >
                    Log in
                  </button>
                  <Button 
                    onClick={() => navigate('/auth')}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
                  >
                    Sign up
                  </Button>
                </>
              )}
              <Button 
                onClick={() => navigate('/demo')}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-800 px-6 py-2 rounded-md font-medium transition-colors"
              >
                Demo
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-32">
          <h1 className="text-8xl lg:text-9xl font-bold mb-8 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.7)]">
            Welcome to
          </h1>
          <h1 className="text-8xl lg:text-9xl font-bold mb-12 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.7)]">
            STRATUS CONNECT
          </h1>
          <p className="text-2xl lg:text-3xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Terminal Access
          </p>
          <p className="text-xl text-slate-400 mb-16 max-w-3xl mx-auto">
            Please select your correct field.
          </p>
        </div>

        {/* Terminal Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-32">
          {/* Broker Terminal */}
          <Card 
            className="bg-slate-800/50 border-slate-700 hover:border-orange-500/50 hover:bg-slate-800/70 transition-all cursor-pointer group backdrop-blur-sm"
            onClick={() => navigate('/demo/broker')}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                Broker Terminal
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Trading floor interface with live market data and quote management
              </p>
              <Button 
                className="w-full group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 border-slate-600 text-slate-300 hover:border-orange-500"
                variant="outline"
              >
                Access Terminal
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Operator Terminal */}
          <Card 
            className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/70 transition-all cursor-pointer group backdrop-blur-sm"
            onClick={() => navigate('/demo/operator')}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Plane className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                Operator Terminal
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Mission control center with real-time fleet tracking and operations
              </p>
              <Button 
                className="w-full group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 border-slate-600 text-slate-300 hover:border-blue-500"
                variant="outline"
              >
                Access Terminal
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Pilot Terminal */}
          <Card 
            className="bg-slate-800/50 border-slate-700 hover:border-green-500/50 hover:bg-slate-800/70 transition-all cursor-pointer group backdrop-blur-sm"
            onClick={() => navigate('/demo/pilot')}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                Pilot Terminal
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Advanced cockpit interface with flight controls and navigation
              </p>
              <Button 
                className="w-full group-hover:bg-green-500 group-hover:text-white transition-all duration-300 border-slate-600 text-slate-300 hover:border-green-500"
                variant="outline"
              >
                Access Terminal
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Crew Terminal */}
          <Card 
            className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 hover:bg-slate-800/70 transition-all cursor-pointer group backdrop-blur-sm"
            onClick={() => navigate('/demo/crew')}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                Crew Terminal
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Professional flight deck with crew coordination and safety monitoring
              </p>
              <Button 
                className="w-full group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 border-slate-600 text-slate-300 hover:border-purple-500"
                variant="outline"
              >
                Access Terminal
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Personality Test */}
          <Card 
            className="bg-slate-800/50 border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/70 transition-all cursor-pointer group backdrop-blur-sm"
            onClick={() => navigate('/psych')}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                Personality Test
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Aviation-specific psychometric assessment for better matching and insights
              </p>
              <Button 
                className="w-full group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 border-slate-600 text-slate-300 hover:border-indigo-500"
                variant="outline"
              >
                Access Terminal
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Fortress of Trust */}
          <Card 
            className="bg-slate-800/50 border-slate-700 hover:border-yellow-500/50 hover:bg-slate-800/70 transition-all cursor-pointer group backdrop-blur-sm"
            onClick={() => navigate('/verification-pending')}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                Fortress of Trust
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Advanced verification and security system for aviation professionals
              </p>
              <Button 
                className="w-full group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300 border-slate-600 text-slate-300 hover:border-yellow-500"
                variant="outline"
              >
                Access Terminal
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* AI System Monitor */}
          <Card 
            className="bg-slate-800/50 border-slate-700 hover:border-teal-500/50 hover:bg-slate-800/70 transition-all cursor-pointer group backdrop-blur-sm"
            onClick={() => navigate('/admin/ai-reports')}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal-400 transition-colors">
                AI System Monitor
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Real-time AI agent monitoring and platform intelligence dashboard
              </p>
              <Button 
                className="w-full group-hover:bg-teal-500 group-hover:text-white transition-all duration-300 border-slate-600 text-slate-300 hover:border-teal-500"
                variant="outline"
              >
                Access Terminal
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* What Stratus Connect Is Section */}
      <div className="relative z-10 w-full py-32 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-6xl lg:text-7xl font-bold text-white text-center mb-20">What Stratus Connect Is</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <BarChart3 className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-6">Brokers</h3>
              <p className="text-xl text-slate-300 leading-relaxed">Access live jets in seconds. Bid, book, and close with confidence.</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Plane className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-6">Operators</h3>
              <p className="text-xl text-slate-300 leading-relaxed">Get your fleet off the ground. Connect. List. Scale confidently.</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-6">Pilots & Crew</h3>
              <p className="text-xl text-slate-300 leading-relaxed">Show your credentials, set your availability, and get noticed.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Simple fees section */}
      <div className="relative z-10 w-full py-32">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-6xl lg:text-7xl font-bold text-white text-center mb-20">Simple fees. Everyone wins.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center">
              <div className="text-6xl font-bold text-orange-400 mb-6">7%</div>
              <div className="text-2xl text-slate-300 mb-4">Broker deals</div>
              <div className="text-lg text-slate-400">Pay only when business closes successfully.</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-400 mb-6">10%</div>
              <div className="text-2xl text-slate-300 mb-4">Crew hiring</div>
              <div className="text-lg text-slate-400">Operators pay when they hire through Stratus.</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-green-400 mb-6">0%</div>
              <div className="text-2xl text-slate-300 mb-4">Pilots & Crew</div>
              <div className="text-lg text-slate-400">Aviation professionals fly free. No cost, ever.</div>
            </div>
          </div>
          <p className="text-xl text-slate-400 mt-16 text-center">We help everyone. No deal, no fee.</p>
        </div>
      </div>

      {/* Why We Are Better Section */}
      <div className="relative z-10 w-full py-32 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-6xl lg:text-7xl font-bold text-white text-center mb-20">Why We Are Better</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Verified Network</h3>
              <p className="text-lg text-slate-300">Roles checked. Documents verified. Only trusted professionals inside.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Shield className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Security First</h3>
              <p className="text-lg text-slate-300">Military grade encryption and audit trails</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Star className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Escrow & Receipts</h3>
              <p className="text-lg text-slate-300">Payments secured in escrow. Full receipts every time.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                <BarChart3 className="w-10 h-10 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Terminal Speed</h3>
              <p className="text-lg text-slate-300">Fast, responsive dashboards built for live and up to date data.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 w-full py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-6xl lg:text-7xl font-bold text-white mb-12">Ready to Get Started?</h2>
          <p className="text-2xl text-slate-300 mb-16 max-w-4xl mx-auto">
            Join the most trusted aviation marketplace. Start with a demo or create your account today.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Button 
              onClick={() => navigate('/demo')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-6 text-xl font-medium transition-colors"
            >
              Try Demo
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-800 px-12 py-6 text-xl font-medium transition-colors"
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* Cookie Banner */}
      {!cookiesAccepted && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 p-4 z-50">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-300">
              We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="rounded-2xl border-slate-600 text-slate-300 hover:bg-slate-800">
                Essential only
              </Button>
              <Button size="sm" onClick={handleCookieAccept} className="rounded-2xl w-full sm:w-auto bg-white text-slate-800 hover:bg-white/90 px-6">
                Accept all
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}