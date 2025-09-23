import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/LoginModal";
import { NavigationArrows } from "@/components/NavigationArrows";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import { CluelyAviationAI } from "@/components/ai/CluelyAviationAI";
import ModernPlasmaBackground from "@/components/ModernPlasmaBackground";
import { Search, ArrowRight, Lock, ChevronRight } from "lucide-react";
export default function Landing() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showAI, setShowAI] = useState(true);
  const navigate = useNavigate();
  const clientTypes = [{
    title: "Brokers",
    description: "Speed creates advantage. Win more quotes with a cleaner cockpit.",
    route: "/terminal/broker"
  }, {
    title: "Operators",
    description: "Fill the legs. Lift the yield. Control the risk.",
    route: "/terminal/operator"
  }, {
    title: "Pilots",
    description: "Credentials speak. Availability sells. Fly the missions that fit.",
    route: "/terminal/crew"
  }, {
    title: "Cabin Crew",
    description: "Professional service wins repeat work. Your calendar is your shop window.",
    route: "/terminal/crew"
  }];
  const footerLinks = [{
    label: "About",
    href: "/about"
  }, {
    label: "Terms",
    href: "/terms"
  }, {
    label: "Rules",
    href: "#"
  }, {
    label: "Privacy",
    href: "#"
  }, {
    label: "Security",
    href: "#"
  }, {
    label: "Fees",
    href: "#"
  }, {
    label: "Contact",
    href: "#"
  }];
  return <ModernPlasmaBackground>
      {/* Top Navigation */}
      <nav className="border-b border-white/20 bg-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <StratusConnectLogo className="text-xl font-semibold tracking-wide bg-bg" />
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <button 
                  onClick={() => navigate('/about')}
                  className="text-sm font-medium text-zinc-300 hover:text-zinc-50 transition-colors"
                >
                  About
                </button>
                <button 
                  onClick={() => navigate('/demo')}
                  className="text-sm font-medium text-zinc-300 hover:text-zinc-50 transition-colors"
                >
                  Demo
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full animate-pulse bg-lime-500"></div>
                  <span className="text-sm font-medium text-zinc-50">Live Market Data</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <NavigationArrows />
              <Button onClick={() => setIsLoginOpen(true)} className="btn-terminal-primary text-sm font-semibold">
                Login
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-24 bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-5xl text-white tracking-tight mb-6 font-bold">
              THE STRATUS TERMINAL
            </h1>
            <p className="text-xl mb-8 leading-relaxed max-w-2xl text-slate-300">You've been looking for something like this your whole life. You just didn't know where to find it. Until now.</p>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => navigate('/demo')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold"
              >
                Try Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                onClick={() => navigate('/about')}
                variant="outline"
                className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white px-8 py-3 text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Terminal Access */}
      <section className="px-6 py-24 bg-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-semibold text-white mb-4">Terminal Access</h2>
            <p className="text-slate-300 text-lg">Please select your correct field.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {clientTypes.map(client => <button key={client.title} onClick={() => navigate(client.route)} className="bg-slate-700 shadow-lg ring-1 ring-slate-600 rounded-xl p-8 text-left hover:bg-slate-600 transition-all duration-300 group border border-slate-600 hover:border-orange-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{client.title}</h3>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-orange-400 transition-colors duration-300 group-hover:translate-x-1" />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{client.description}</p>
              </button>)}
          </div>
        </div>
      </section>

      {/* Live Analytics Preview */}
      <section className="px-6 py-20 bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-800 shadow-lg ring-1 ring-slate-600 rounded-xl relative overflow-hidden border border-slate-600">
            <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center">
                <Lock className="w-10 h-10 text-orange-500 mb-6 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-3">Live Operational Analytics</h3>
                <p className="text-slate-300 text-base mb-6 max-w-md">Sign in to view real-time market data and performance metrics</p>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3" onClick={() => setIsLoginOpen(true)}>
                  Access Terminal
                </Button>
              </div>
            </div>
            
            {/* Blurred preview data */}
            <div className="p-12 opacity-15">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-3xl font-semibold text-white mb-2">847</div>
                  <div className="text-sm text-slate-400 uppercase tracking-wide">Active Aircraft</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-semibold text-orange-500 mb-2">$2.4M</div>
                  <div className="text-sm text-slate-400 uppercase tracking-wide">Daily Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-semibold text-yellow-500 mb-2">156</div>
                  <div className="text-sm text-slate-400 uppercase tracking-wide">Live Requests</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-semibold text-green-500 mb-2">94.2%</div>
                  <div className="text-sm text-slate-400 uppercase tracking-wide">System Uptime</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <div className="text-base font-medium text-slate-400 mb-4 uppercase tracking-wide">Market Activity</div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-base">
                      <span className="text-slate-400">JFK → LAX</span>
                      <span className="text-orange-500 font-medium">$42,000</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-slate-400">MIA → TEB</span>
                      <span className="text-orange-500 font-medium">$18,500</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-slate-400">LAX → SFO</span>
                      <span className="text-orange-500 font-medium">$12,800</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-base font-medium text-slate-400 mb-4 uppercase tracking-wide">System Status</div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-base">
                      <span className="text-slate-400">Database</span>
                      <span className="text-green-500 font-medium">Operational</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-slate-400">API Gateway</span>
                      <span className="text-green-500 font-medium">Operational</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-slate-400">Market Feed</span>
                      <span className="text-green-500 font-medium">Live</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      

      {/* Footer */}
      <footer className="border-t border-slate-600 bg-slate-800 shadow-lg ring-1 ring-slate-600 px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <p className="text-slate-400">© 2025 StratusConnect. Professional aviation trading platform.</p>
          </div>
        </div>
      </footer>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      
      {/* Cluely-style Aviation AI */}
      <CluelyAviationAI isVisible={showAI} onToggleVisibility={() => setShowAI(!showAI)} />
    </ModernPlasmaBackground>;
}