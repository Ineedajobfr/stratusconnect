import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, BookOpen, Building2, CheckCircle, Clock, DollarSign, Download, Globe, Info, Lock, MessageSquare, Percent, Plane, Play, Shield, UserCheck, Users, Zap } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// AI removed - using Botpress instead

export default function Index() {
  const navigate = useNavigate();
  
  // Optional auth check - won't break if not in AuthProvider
  let user = null;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    // Not in AuthProvider context, that's okay for public page
    console.log('Index page loaded without auth context');
  }

  // Redirect authenticated users to their home page
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);
  const handleAccessTerminal = (roleId: string) => {
    navigate(`/login/${roleId}`);
  };
  const handleDemoAccess = (demoRoute: string) => {
    navigate(demoRoute);
  };
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cinematic Burnt Orange to Obsidian Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139, 69, 19, 0.9) 0%, rgba(91, 30, 13, 0.95) 25%, rgba(59, 30, 13, 0.98) 50%, rgba(20, 20, 20, 0.99) 75%, rgba(10, 10, 12, 1) 100%), linear-gradient(135deg, #3b1e0d 0%, #2d1a0a 25%, #1a0f08 50%, #0f0a06 75%, #0a0a0c 100%)',
        }}
      />
      
      {/* Cinematic Vignette - Creates spotlight effect on center */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at center, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0.3) 80%, rgba(0, 0, 0, 0.6) 100%)',
        }}
      />
      
      {/* Subtle golden-orange glow in the center */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at center, rgba(255, 140, 0, 0.08) 0%, rgba(255, 140, 0, 0.04) 30%, transparent 60%)',
        }}
      />
      
      {/* Subtle grid pattern overlay - more refined */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgTCAwIDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4=')] opacity-30"></div>
      </div>
      
      {/* STRATUSCONNECT Logo - Top Left */}
      <div 
        className="absolute top-8 left-8 text-white text-lg font-bold bg-black px-6 py-3 rounded backdrop-blur-sm cursor-pointer hover:bg-gray-800 transition-colors z-20"
        onClick={() => navigate('/')}
      >
        STRATUSCONNECT
      </div>

      {/* STRATUS logo and Welcome banner */}
      <div className="relative z-10 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          {/* STRATUS logo with cinematic spotlight effect */}
          <div className="relative mb-32 inline-block">
            {/* Spotlight glow behind the logo */}
            <div 
              className="absolute inset-0 rounded-lg blur-xl opacity-30"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255, 140, 0, 0.4) 0%, rgba(255, 140, 0, 0.2) 30%, transparent 70%)',
                transform: 'scale(1.2)',
              }}
            />
            
            {/* Main logo container with enhanced styling */}
            <div 
              className="relative bg-white/95 backdrop-blur-sm px-12 py-6 shadow-2xl border border-white/20 rounded-lg"
              style={{
                boxShadow: '0 0 40px rgba(255, 140, 0, 0.3), 0 0 80px rgba(255, 140, 0, 0.1), 0 25px 50px rgba(0, 0, 0, 0.5)',
              }}
            >
              <h1 className="text-6xl font-black text-black tracking-wider drop-shadow-lg">
                STRATUS
              </h1>
              </div>
            </div>
          
          {/* Welcome heading */}
          <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Welcome
          </h2>
          
          <div className="space-y-6 text-white/90 leading-relaxed text-2xl max-w-4xl mx-auto">
            <p className="italic">
              You manage deals, crews, aircraft, time. That's no small load. So when you land here, it's not by accident it's because something told you there's got to be a better way. Stratus was built to back your next move, your next listing, your next breakthrough.
            </p>
            
            <p className="italic">
              One terminal to stay seen, update your availability, connect with the right people, and get what you do in front of those who matter. You've carried the weight long enough now let us help you turn that work into wins, and get you where you were always meant to be.
            </p>
            </div>
            </div>
          </div>

      {/* About Us and Login Links - styled like title screen */}
      <div className="absolute top-6 right-6 z-20 flex gap-4">
        <div 
          className="text-white/90 text-lg font-mono bg-black/30 px-6 py-3 rounded backdrop-blur-sm cursor-pointer hover:bg-black/50 transition-colors"
          onClick={() => navigate('/about')}
        >
          About Us
            </div>
        <div 
          className="text-white/90 text-lg font-mono bg-orange-600/80 px-6 py-3 rounded backdrop-blur-sm cursor-pointer hover:bg-orange-700/90 transition-colors"
          onClick={() => navigate('/auth')}
        >
          Sign up
        </div>
      </div>

      {/* Hero Section - Simplified */}
      <div className="relative z-10 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-8 animate-fade-in-up">
          </div>
        </div>
      </div>


      {/* Terminal Access Section */}
      <div className="relative z-10 py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-[0_0_25px_rgba(255,255,255,0.6)]">Choose Your Terminal</h2>
            <p className="text-xl text-white drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] bg-black/20 px-6 py-3 rounded-lg backdrop-blur-sm">Access your personalized workspace</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Broker Terminal */}
            <Card 
              className="group bg-black/80 backdrop-blur-sm border border-slate-700/30 hover:bg-black/90 hover:border-slate-600/50 cursor-pointer animate-fade-in-up transition-all duration-300"
              style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 140, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-slate-800/20 rounded-xl">
                    <Building2 className="w-8 h-8 text-slate-300" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-semibold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Broker Terminal</CardTitle>
                    <CardDescription className="text-white/80">Quote management & client relations</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 mb-6 drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]">
                  Access real-time aircraft listings, manage client relationships, and close deals faster than ever. 
                  Our AI-powered matching system connects you with the right opportunities.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-white">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 drop-shadow-[0_0_5px_rgba(34,197,94,0.6)]" />
                    Real-time market data
                  </div>
                  <div className="flex items-center text-sm text-white">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 drop-shadow-[0_0_5px_rgba(34,197,94,0.6)]" />
                    Automated quote generation
                  </div>
                  <div className="flex items-center text-sm text-white">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 drop-shadow-[0_0_5px_rgba(34,197,94,0.6)]" />
                    Secure escrow payments
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => handleAccessTerminal("broker")} 
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white transition-all duration-300"
                    style={{
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    Access Terminal <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button 
                    onClick={() => handleDemoAccess("/demo/broker")} 
                    variant="outline" 
                    className="px-6 border-slate-600 text-slate-300 hover:bg-slate-800 transition-all duration-300"
                    style={{
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    Demo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Operator Terminal */}
            <Card 
              className="group bg-black/80 backdrop-blur-sm border border-slate-700/30 hover:bg-black/90 hover:border-slate-600/50 cursor-pointer animate-fade-in-up transition-all duration-300"
              style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 140, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-slate-800/20 rounded-xl">
                    <Plane className="w-8 h-8 text-slate-300" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-semibold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Operator Terminal</CardTitle>
                    <CardDescription className="text-white/80">Fleet management & optimization</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 mb-6 drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]">
                  Maximize your fleet's potential with intelligent scheduling, crew management, and real-time performance tracking. 
                  Turn every flight into profit.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-white">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 drop-shadow-[0_0_5px_rgba(34,197,94,0.6)]" />
                    Fleet optimization tools
                  </div>
                  <div className="flex items-center text-sm text-white">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 drop-shadow-[0_0_5px_rgba(34,197,94,0.6)]" />
                    Crew scheduling automation
                  </div>
                  <div className="flex items-center text-sm text-white">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 drop-shadow-[0_0_5px_rgba(34,197,94,0.6)]" />
                    Real-time performance metrics
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => handleAccessTerminal("operator")} 
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white transition-all duration-300"
                    style={{
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    Access Terminal <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button 
                    onClick={() => handleDemoAccess("/demo/operator")} 
                    variant="outline" 
                    className="px-6 border-slate-600 text-slate-300 hover:bg-slate-800 transition-all duration-300"
                    style={{
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    Demo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pilot Terminal */}
            <Card 
              className="group bg-black/80 backdrop-blur-sm border border-slate-700/30 hover:bg-black/90 hover:border-slate-600/50 cursor-pointer animate-fade-in-up transition-all duration-300"
              style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 140, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-slate-800/20 rounded-xl">
                    <UserCheck className="w-8 h-8 text-slate-300" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-semibold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Pilot Terminal</CardTitle>
                    <CardDescription className="text-white/80">Flight assignments & credentials</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 mb-6 drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]">
                  Find the best flying opportunities that match your skills and schedule. 
                  Build your reputation and grow your career with verified operators.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-white">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 drop-shadow-[0_0_5px_rgba(34,197,94,0.6)]" />
                    Job matching algorithm
                  </div>
                  <div className="flex items-center text-sm text-white">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 drop-shadow-[0_0_5px_rgba(34,197,94,0.6)]" />
                    Credential verification
                  </div>
                  <div className="flex items-center text-sm text-white">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 drop-shadow-[0_0_5px_rgba(34,197,94,0.6)]" />
                    Secure payment processing
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => handleAccessTerminal("pilot")} 
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white transition-all duration-300"
                    style={{
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    Access Terminal <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button 
                    onClick={() => handleDemoAccess("/demo/pilot")} 
                    variant="outline" 
                    className="px-6 border-slate-600 text-slate-300 hover:bg-slate-800 transition-all duration-300"
                    style={{
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    Demo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Crew Terminal */}
            <Card 
              className="group bg-black/80 backdrop-blur-sm border border-slate-700/30 hover:bg-black/90 hover:border-slate-600/50 cursor-pointer animate-fade-in-up transition-all duration-300"
              style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 140, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-slate-800/20 rounded-xl">
                    <Users className="w-8 h-8 text-slate-300" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-semibold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Crew Terminal</CardTitle>
                    <CardDescription className="text-white/80">Service excellence & scheduling</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 mb-6 drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]">
                  Connect with top operators and build lasting relationships. 
                  Showcase your skills and availability to find the best crew assignments.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-white">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 drop-shadow-[0_0_5px_rgba(34,197,94,0.6)]" />
                    Premium crew opportunities
                  </div>
                  <div className="flex items-center text-sm text-white">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 drop-shadow-[0_0_5px_rgba(34,197,94,0.6)]" />
                    Flexible scheduling
                  </div>
                  <div className="flex items-center text-sm text-white">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2 drop-shadow-[0_0_5px_rgba(34,197,94,0.6)]" />
                    Reputation building tools
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => handleAccessTerminal("crew")} 
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white transition-all duration-300"
                    style={{
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    Access Terminal <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button 
                    onClick={() => handleDemoAccess("/demo/crew")} 
                    variant="outline" 
                    className="px-6 border-slate-600 text-slate-300 hover:bg-slate-800 transition-all duration-300"
                    style={{
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Security & Trust Features */}
      <div className="relative z-10 py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why We're Different</h2>
            <p className="text-xl text-muted-foreground">The features that set us apart from the competition</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group bg-black/80 backdrop-blur-sm border border-slate-700/30 hover:bg-black/90 hover:border-slate-600/50 cursor-pointer transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-12 h-12 text-slate-300" />
                    <div>
                <CardTitle>Real-Time Intelligence</CardTitle>
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
                        <DialogTitle className="text-slate-300">Real-Time Intelligence</DialogTitle>
                        <DialogDescription>
                          Live market data, instant notifications, and smart alerts that help you make better decisions
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          Our technology is designed to empower, not overwhelm:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-slate-300" />
                            <span>Predictive analytics that actually predict</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-slate-300" />
                            <span>Smart matching that finds the right people</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-slate-300" />
                            <span>Automation that saves you hours daily</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-slate-300" />
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

            <Card className="group bg-black/80 backdrop-blur-sm border border-slate-700/30 hover:bg-black/90 hover:border-slate-600/50 cursor-pointer transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-12 h-12 text-slate-300" />
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
                        <DialogTitle className="text-slate-300">We Only Win When You Win</DialogTitle>
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
                            <CheckCircle className="w-4 h-4 text-slate-300" />
                            <span>7% only when you close deals (brokers/operators)</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-slate-300" />
                            <span>10% hiring fee only when you get hired (crew/pilots)</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-slate-300" />
                            <span>Free access for pilots and crew</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-slate-300" />
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

            <Card className="group bg-black/80 backdrop-blur-sm border border-slate-700/30 hover:bg-black/90 hover:border-slate-600/50 cursor-pointer transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-12 h-12 text-slate-300" />
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
                        <DialogTitle className="text-slate-300">Transparency & Trust</DialogTitle>
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
                            <CheckCircle className="w-4 h-4 text-slate-300" />
                            <span>Real-time deal tracking and reporting</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-slate-300" />
                            <span>Upfront pricing with no hidden fees</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-slate-300" />
                            <span>Honest performance metrics and analytics</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-slate-300" />
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
        </div>
      </div>

      {/* Escrow & Payment Security */}
      <div className="relative z-10 py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Secure Escrow System</h2>
            <p className="text-xl text-muted-foreground">Your funds are protected at every step</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">How It Works</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-slate-800/20 rounded-full p-2 mt-1">
                    <span className="text-slate-300 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Funds Secured</h4>
                    <p className="text-muted-foreground">Payment held in secure escrow until flight completion</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-slate-800/20 rounded-full p-2 mt-1">
                    <span className="text-slate-300 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Service Delivered</h4>
                    <p className="text-muted-foreground">Flight completed and verified by all parties</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-slate-800/20 rounded-full p-2 mt-1">
                    <span className="text-slate-300 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Automatic Release</h4>
                    <p className="text-muted-foreground">Funds automatically released to service providers</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="group bg-black/80 backdrop-blur-sm border border-slate-700/30 hover:bg-black/90 hover:border-slate-600/50 cursor-pointer transition-all duration-300">
              <CardHeader>
                <DollarSign className="w-12 h-12 text-slate-300 mb-4" />
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
        </div>
      </div>

      {/* Platform Fees & Pricing */}
      <div className="relative z-10 py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-foreground mb-4">Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">Fair fees that grow with your success</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card 
              className="group bg-black/80 backdrop-blur-sm border border-slate-700/30 hover:bg-black/90 hover:border-slate-600/50 cursor-pointer animate-fade-in-up transition-all duration-300"
              style={{
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 140, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-800/20 rounded-lg animate-pulse-glow">
                      <Percent className="w-6 h-6 text-slate-300" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-foreground">Broker & Operator Sales</CardTitle>
                      <CardDescription className="text-muted-foreground">Transaction fees</CardDescription>
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
                        <DialogTitle className="text-slate-300">7% Platform Fee</DialogTitle>
                        <DialogDescription>
                          Applied to all successful broker and operator sales transactions
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          This fee is automatically deducted from completed transactions and covers:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-slate-300" />
                            <span>Platform maintenance and security</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-slate-300" />
                            <span>Payment processing and escrow services</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-slate-300" />
                            <span>Customer support and dispute resolution</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-slate-300" />
                            <span>Market intelligence and analytics</span>
                          </li>
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-300 mb-2">7%</div>
                <p className="text-muted-foreground text-sm">
                  Only charged on successful transactions. No monthly fees or hidden costs.
                </p>
              </CardContent>
            </Card>

            <Card className="group bg-black/80 backdrop-blur-sm border border-slate-700/30 hover:bg-black/90 hover:border-slate-600/50 cursor-pointer transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-800/20 rounded-lg">
                      <Users className="w-6 h-6 text-slate-300" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Crew & Pilot Hiring</CardTitle>
                      <CardDescription>Recruitment fees</CardDescription>
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
                        <DialogTitle className="text-slate-300">10% Recruitment Fee</DialogTitle>
                        <DialogDescription>
                          Charged to brokers and operators when hiring crew or pilots for specific flights
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          This one-time fee covers the cost of connecting you with qualified professionals:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-slate-300" />
                            <span>Credential verification and background checks</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-slate-300" />
                            <span>Matching algorithm and compatibility scoring</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-slate-300" />
                            <span>Contract facilitation and documentation</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-slate-300" />
                            <span>Ongoing support during the assignment</span>
                          </li>
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-300 mb-2">10%</div>
                <p className="text-muted-foreground text-sm">
                  One-time fee per successful crew/pilot placement for specific flights.
                </p>
              </CardContent>
            </Card>

            <Card className="group bg-black/80 backdrop-blur-sm border border-slate-700/30 hover:bg-black/90 hover:border-slate-600/50 cursor-pointer transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-800/20 rounded-lg">
                      <UserCheck className="w-6 h-6 text-slate-300" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Crew & Pilots</CardTitle>
                      <CardDescription>Always free</CardDescription>
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
                        <DialogTitle className="text-slate-300">Free for Crew & Pilots</DialogTitle>
                        <DialogDescription>
                          We believe in supporting the professionals who make aviation possible
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          Crew and pilots enjoy full platform access at no cost because:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-slate-300" />
                            <span>You are essential to our industry</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-slate-300" />
                            <span>We want to maximize your opportunities</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-slate-300" />
                            <span>No barriers to finding great assignments</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-slate-300" />
                            <span>Full access to all platform features</span>
                          </li>
                        </ul>
                        <div className="bg-slate-800/10 p-4 rounded-lg">
                          <p className="text-sm text-slate-300 font-medium">
                            "We care for our customers - that's why crew and pilots are always free."
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-300 mb-2">FREE</div>
                <p className="text-muted-foreground text-sm">
                  No fees, no subscriptions, no hidden costs. We care for our customers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Privacy Protection */}
      <div className="relative z-10 py-16 bg-terminal-card/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Privacy by Design</h2>
            <p className="text-xl text-muted-foreground">Your data is never shared without explicit consent</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group bg-black/80 backdrop-blur-sm border border-slate-700/30 hover:bg-black/90 hover:border-slate-600/50 cursor-pointer transition-all duration-300 text-center">
              <CardContent className="pt-6">
                <Globe className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">GDPR Compliant</h3>
                <p className="text-sm text-muted-foreground">Full compliance with global privacy regulations</p>
              </CardContent>
            </Card>

            <Card className="group bg-black/80 backdrop-blur-sm border border-slate-700/30 hover:bg-black/90 hover:border-slate-600/50 cursor-pointer transition-all duration-300 text-center">
              <CardContent className="pt-6">
                <Shield className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Data Anonymization</h3>
                <p className="text-sm text-muted-foreground">Personal data encrypted and anonymized</p>
              </CardContent>
            </Card>

            <Card className="group bg-black/80 backdrop-blur-sm border border-slate-700/30 hover:bg-black/90 hover:border-slate-600/50 cursor-pointer transition-all duration-300 text-center">
              <CardContent className="pt-6">
                <Lock className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Selective Disclosure</h3>
                <p className="text-sm text-muted-foreground">You control what information is visible</p>
              </CardContent>
            </Card>

            <Card className="group bg-black/80 backdrop-blur-sm border border-slate-700/30 hover:bg-black/90 hover:border-slate-600/50 cursor-pointer transition-all duration-300 text-center">
              <CardContent className="pt-6">
                <Clock className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Data Retention</h3>
                <p className="text-sm text-muted-foreground">Automatic deletion of expired data</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

       {/* How to Use StratusConnect */}
       <div className="relative z-10 py-24">
         <div className="max-w-6xl mx-auto px-4">
           <div className="text-center mb-12">
             <h2 className="text-4xl font-bold text-foreground mb-4">Stop Guessing, Start Winning</h2>
             <p className="text-xl text-muted-foreground">Complete guides, AI assistance, and everything you need to succeed</p>
           </div>

           <Card className="group bg-black/80 backdrop-blur-sm border border-slate-700/30 hover:bg-black/90 hover:border-slate-600/50 cursor-pointer transition-all duration-300">
             <CardHeader>
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-4">
                   <div className="p-3 bg-slate-800/20 rounded-xl">
                     <BookOpen className="w-12 h-12 text-slate-300" />
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
                   <div className="w-16 h-16 bg-slate-800/20 rounded-full flex items-center justify-center mx-auto mb-3">
                     <Building2 className="w-8 h-8 text-slate-300" />
                   </div>
                   <h3 className="font-semibold text-foreground mb-2">Terminal Guides</h3>
                   <p className="text-sm text-muted-foreground">Step-by-step instructions for each terminal type</p>
                 </div>
                 <div className="text-center">
                   <div className="w-16 h-16 bg-slate-800/20 rounded-full flex items-center justify-center mx-auto mb-3">
                     <Zap className="w-8 h-8 text-slate-300" />
                   </div>
                   <h3 className="font-semibold text-foreground mb-2">AI Features</h3>
                   <p className="text-sm text-muted-foreground">Master AI-powered tools and automation</p>
                 </div>
                 <div className="text-center">
                   <div className="w-16 h-16 bg-slate-800/20 rounded-full flex items-center justify-center mx-auto mb-3">
                     <Play className="w-8 h-8 text-slate-300" />
                   </div>
                   <h3 className="font-semibold text-foreground mb-2">Quick Start</h3>
                   <p className="text-sm text-muted-foreground">Get up and running in minutes</p>
                 </div>
                 <div className="text-center">
                   <div className="w-16 h-16 bg-slate-800/20 rounded-full flex items-center justify-center mx-auto mb-3">
                     <Download className="w-8 h-8 text-slate-300" />
                   </div>
                   <h3 className="font-semibold text-foreground mb-2">Resources</h3>
                   <p className="text-sm text-muted-foreground">Download guides and access support</p>
                 </div>
               </div>
             </CardContent>
           </Card>
        </div>
      </div>

      {/* Performance & Reliability */}
      <div className="relative z-10 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-12">Enterprise Performance</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-bold text-slate-300 mb-4">99.99%</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Uptime SLA</h3>
              <p className="text-muted-foreground">Mission-critical reliability with redundant infrastructure</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-slate-300 mb-4">&lt;50ms</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Response Time</h3>
              <p className="text-muted-foreground">Lightning-fast performance optimized for real-time operations</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-slate-300 mb-4">24/7</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Support</h3>
              <p className="text-muted-foreground">Dedicated support team available around the clock</p>
            </div>
          </div>
        </div>
      </div>

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

      {/* AI Intelligence Demo Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* AI removed - using Botpress instead */}
        </div>
      </section>

    </div>
  );
}