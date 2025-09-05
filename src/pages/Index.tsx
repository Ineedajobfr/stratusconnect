import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { demoCredentials } from "@/utils/setupDemoUsers";
import { adminCredentials } from "@/utils/adminCredentials";
import { NavigationArrows } from "@/components/NavigationArrows";
import { Shield, Lock, Receipt, Zap, CheckCircle, ArrowRight, Users, Plane, Globe, UserCheck, FileText, Radio } from "lucide-react";
import { LoginModal } from "@/components/LoginModal";
import StarfieldRunwayBackground, { TerminalHeadline } from "@/components/StarfieldRunwayBackground";
import { usePageContent } from "@/hooks/usePageContent";
export default function Index() {
  const navigate = useNavigate();
  const {
    user,
    login
  } = useAuth();
  const {
    content: homeContent,
    loading: contentLoading
  } = usePageContent('home');
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (cookieConsent) {
      setShowCookieBanner(false);
    }
  }, []);
  const handleCookieAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowCookieBanner(false);
  };
  const getRoleRoute = (userRole: string) => {
    switch (userRole) {
      case 'broker':
        return '/terminal/broker';
      case 'operator':
        return '/terminal/operator';
      case 'pilot':
      case 'crew':
        return '/terminal/crew';
      case 'admin':
        return '/terminal/admin';
      default:
        return '/enter';
    }
  };

  const handleDemoLogin = async (role: 'broker' | 'operator' | 'crew' | 'pilot') => {
    const credentials = demoCredentials[role];
    const success = await login(credentials.email, credentials.password);
    if (success) {
      navigate(getRoleRoute(role));
    }
  };

  const handleAdminLogin = async (role: 'broker' | 'operator' | 'crew' | 'pilot') => {
    const credentials = adminCredentials[role];
    const success = await login(credentials.email, credentials.password);
    if (success) {
      navigate(getRoleRoute(role));
    }
  };
  return <div className="relative min-h-screen bg-slate-900">
      {/* Background animation layer */}
      <StarfieldRunwayBackground intensity={0.7} starCount={260} />
      {/* Header - Top Navigation */}
      <header className="sticky top-0 z-40 mobile-container py-4 sm:py-6 bg-slate-900/95 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground cursor-pointer hover:opacity-80 transition-opacity" onClick={() => window.location.href = '/'}>
            StratusConnect
          </div>
          
          <div className="flex items-center space-x-4">
            <NavigationArrows />
            
            {/* Welcome Strip for Authenticated Users */}
            {user ? <div className="flex items-center space-x-2 lg:space-x-4">
              <Badge variant="secondary" className="capitalize hidden sm:inline-flex bg-cyan-500/20 text-cyan-300 border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.4)] rounded-xl">
                {user.role}
              </Badge>
              <span className="text-xs lg:text-sm text-white/90 hidden md:inline font-medium">
                Welcome back, {user.fullName}
              </span>
              <Button onClick={() => navigate(getRoleRoute(user.role))} className="rounded-2xl text-sm lg:text-base px-4 lg:px-6 bg-white text-slate-800 hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.6)]" size="sm">
                <span className="hidden sm:inline">Enter the Terminal</span>
                <span className="sm:hidden">Terminal</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div> : <div className="flex items-center space-x-2 lg:space-x-4">
              <Button variant="ghost" onClick={() => navigate('/enter')} className="rounded-2xl text-sm lg:text-base px-4 lg:px-6 text-white hover:bg-white/10" size="sm">
                Log in
              </Button>
              <Button onClick={() => navigate('/enter?mode=signup')} className="rounded-2xl text-sm lg:text-base px-4 lg:px-6 bg-white text-slate-800 hover:bg-white/90" size="sm">
                Sign up
              </Button>
              <Button variant="outline" onClick={() => navigate('/demo')} className="rounded-2xl text-sm lg:text-base px-4 lg:px-6 hidden sm:inline-flex border-white/30 text-white hover:bg-white/10" size="sm">
                Demo
              </Button>
            </div>}
          </div>
        </div>
      </header>

      {/* Hero Section - Above the Fold */}
      <section className="relative z-10 px-4 lg:px-6 py-16 lg:py-32 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-9xl font-black font-inter mb-4 lg:mb-8 text-foreground tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">Welcome to </h1>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-9xl font-black font-inter mb-8 lg:mb-16 text-foreground tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">STRATUS CONNECT</h1>
          
          <div className="py-8 lg:py-32"></div>
        </div>
      </section>

      {/* Empty scroll section */}
      <section className="relative z-10 py-16 sm:py-32 lg:py-48">
      </section>

      {/* Inspirational Message Section */}
      

      {/* Terminal Access - unified interface */}
      <section className="relative z-10 mobile-container py-20 sm:py-32 lg:py-40">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-6 sm:mb-8 text-foreground drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] text-shadow-glow">Terminal Access</h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-12 sm:mb-16 lg:mb-20 font-medium leading-relaxed drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">Please select your correct field.</p>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto mb-8 sm:mb-12">
            {/* Brokers Card */}
            <Card className="aspect-square bg-slate-800/50 border-white/20 rounded-xl backdrop-blur-sm hover:border-cyan-400 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] group overflow-hidden">
              <CardContent className="p-3 sm:p-4 h-full flex flex-col justify-center items-center">
                <div className="text-center space-y-3 w-full">
                  <div className="relative w-full h-24 sm:h-28 rounded-lg overflow-hidden bg-slate-700/30">
                    <img 
                      src="/lovable-uploads/5b72b37d-1cf2-4e5d-9c9d-de6ea6c2d8e7.png" 
                      alt="Business handshake" 
                      className="w-full h-full object-cover object-center opacity-80 hover:opacity-90 transition-opacity"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base mb-1">Brokers</h3>
                    <p className="text-white/90 text-xs leading-tight">Speed creates advantage. Win more quotes.</p>
                  </div>
                </div>
                <div className="space-y-1.5 mt-4">
                  <Button 
                    onClick={() => {
                      setSelectedRole('broker');
                      setIsLoginOpen(true);
                    }}
                    className="w-full bg-white text-slate-800 hover:bg-white/90 rounded-lg font-semibold py-2 text-xs shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                  >
                    Access Terminal
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                  <Button 
                    onClick={() => handleDemoLogin('broker')}
                    variant="outline" 
                    className="w-full border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 rounded-lg font-medium py-1.5 text-xs shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                  >
                    <Zap className="mr-1 h-3 w-3" />
                    Demo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Operators Card */}
            <Card className="aspect-square bg-slate-800/50 border-white/20 rounded-xl backdrop-blur-sm hover:border-cyan-400 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] group overflow-hidden">
              <CardContent className="p-3 sm:p-4 h-full flex flex-col justify-center items-center">
                <div className="text-center space-y-3 w-full">
                  <div className="relative w-full h-24 sm:h-28 rounded-lg overflow-hidden bg-slate-700/30">
                    <img 
                      src="/lovable-uploads/97709032-3f83-4b71-92d5-970343d1f100.png" 
                      alt="Aircraft at sunset" 
                      className="w-full h-full object-cover object-center opacity-80 hover:opacity-90 transition-opacity"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base mb-1">Operators</h3>
                    <p className="text-white/90 text-xs leading-tight">Fill the legs. Lift the yield.</p>
                  </div>
                </div>
                <div className="space-y-1.5 mt-4">
                  <Button 
                    onClick={() => {
                      setSelectedRole('operator');
                      setIsLoginOpen(true);
                    }}
                    className="w-full bg-white text-slate-800 hover:bg-white/90 rounded-lg font-semibold py-2 text-xs shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                  >
                    Access Terminal
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                  <Button 
                    onClick={() => handleDemoLogin('operator')}
                    variant="outline" 
                    className="w-full border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 rounded-lg font-medium py-1.5 text-xs shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                  >
                    <Zap className="mr-1 h-3 w-3" />
                    Demo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pilots Card */}
            <Card className="aspect-square bg-slate-800/50 border-white/20 rounded-xl backdrop-blur-sm hover:border-cyan-400 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] group overflow-hidden">
              <CardContent className="p-3 sm:p-4 h-full flex flex-col justify-center items-center">
                <div className="text-center space-y-3 w-full">
                  <div className="relative w-full h-24 sm:h-28 rounded-lg overflow-hidden bg-slate-700/30">
                    <img 
                      src="/lovable-uploads/87f62aae-d379-4cbe-a080-53fabcef5e60.png" 
                      alt="Cockpit view" 
                      className="w-full h-full object-cover object-center opacity-80 hover:opacity-90 transition-opacity"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base mb-1">Pilots</h3>
                    <p className="text-white/90 text-xs leading-tight">Credentials speak. Fly the missions that fit.</p>
                  </div>
                </div>
                <div className="space-y-1.5 mt-4">
                  <Button 
                    onClick={() => {
                      setSelectedRole('pilot');
                      setIsLoginOpen(true);
                    }}
                    className="w-full bg-white text-slate-800 hover:bg-white/90 rounded-lg font-semibold py-2 text-xs shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                  >
                    Access Terminal
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                  <Button 
                    onClick={() => handleDemoLogin('pilot')}
                    variant="outline" 
                    className="w-full border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 rounded-lg font-medium py-1.5 text-xs shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                  >
                    <Zap className="mr-1 h-3 w-3" />
                    Demo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cabin Crew Card */}
            <Card className="aspect-square bg-slate-800/50 border-white/20 rounded-xl backdrop-blur-sm hover:border-cyan-400 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] group overflow-hidden">
              <CardContent className="p-3 sm:p-4 h-full flex flex-col justify-center items-center">
                <div className="text-center space-y-3 w-full">
                  <div className="relative w-full h-24 sm:h-28 rounded-lg overflow-hidden bg-slate-700/30">
                    <img 
                      src="/lovable-uploads/a7806c06-d816-42e6-b3ee-eea61f2134ae.png" 
                      alt="Cabin crew at terminal" 
                      className="w-full h-full object-cover object-center opacity-80 hover:opacity-90 transition-opacity"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base mb-1">Cabin Crew</h3>
                    <p className="text-white/90 text-xs leading-tight">Service wins repeat work.</p>
                  </div>
                </div>
                <div className="space-y-1.5 mt-4">
                  <Button 
                    onClick={() => {
                      setSelectedRole('crew');
                      setIsLoginOpen(true);
                    }}
                    className="w-full bg-white text-slate-800 hover:bg-white/90 rounded-lg font-semibold py-2 text-xs shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                  >
                    Access Terminal
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                  <Button 
                    onClick={() => handleDemoLogin('crew')}
                    variant="outline" 
                    className="w-full border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 rounded-lg font-medium py-1.5 text-xs shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                  >
                    <Zap className="mr-1 h-3 w-3" />
                    Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sign Up Call to Action */}
          <div className="text-center">
            <p className="text-white/80 text-lg mb-4">Don't have an account yet?</p>
            <Button 
              onClick={() => navigate('/enter?mode=signup')}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 rounded-2xl px-8 py-3 text-lg font-medium"
            >
              Sign Up Here
            </Button>
          </div>
        </div>
      </section>

      {/* What Stratus Connect Is */}
      <section className="relative z-10 mobile-container py-20 sm:py-32 lg:py-40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-center mb-12 sm:mb-20 lg:mb-28 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]">What Stratus Connect Is</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 mobile-gap">
            <div className="text-center">
              <Users className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 text-cyan-400 mx-auto mb-4 sm:mb-6 lg:mb-8 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 lg:mb-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">Brokers</h3>
              <p className="text-white/90 mobile-text leading-relaxed">Access live jets in seconds. Bid, book, and close with confidence.</p>
            </div>

            <div className="text-center">
              <Plane className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 text-cyan-400 mx-auto mb-4 sm:mb-6 lg:mb-8 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 lg:mb-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">Operators</h3>
              <p className="text-white/90 mobile-text leading-relaxed">Get your fleet off the ground. Connect. List. Scale confidently. </p>
            </div>

            <div className="text-center">
              <Globe className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 text-cyan-400 mx-auto mb-4 sm:mb-6 lg:mb-8 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 lg:mb-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">Pilots & Crew</h3>
              <p className="text-white/90 mobile-text leading-relaxed">Show your credentials, set your availability, and get noticed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Fees Section */}
      <section className="relative z-10 mobile-container py-20 sm:py-32 lg:py-40">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-12 sm:mb-20 lg:mb-28 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]">Simple fees. Everyone wins.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 mobile-gap mb-8 sm:mb-12 lg:mb-16">
            <div className="text-center">
              <div className="text-4xl sm:text-6xl lg:text-8xl font-black text-cyan-400 mb-4 sm:mb-6 lg:mb-8 drop-shadow-[0_0_30px_rgba(34,211,238,1)] animate-pulse">7%</div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">Broker deals</p>
              <p className="text-white/90 mobile-text leading-relaxed">Pay only when business closes successfully.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-6xl lg:text-8xl font-black text-cyan-400 mb-4 sm:mb-6 lg:mb-8 drop-shadow-[0_0_30px_rgba(34,211,238,1)] animate-pulse">10%</div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">Crew hiring</p>
              <p className="text-white/90 mobile-text leading-relaxed">Operators pay when they hire through Stratus.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-6xl lg:text-8xl font-black text-cyan-400 mb-4 sm:mb-6 lg:mb-8 drop-shadow-[0_0_30px_rgba(34,211,238,1)] animate-pulse">0%</div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">Pilots & Crew</p>
              <p className="text-white/90 mobile-text leading-relaxed">Aviation professionals fly free. No cost, ever. </p>
            </div>
          </div>
          <p className="text-white/90 text-lg sm:text-xl lg:text-2xl font-medium">We help everyone. No deal, no fee.</p>
        </div>
      </section>

      {/* Why We Are Better - Four Pillars */}
      <section className="relative z-10 px-6 py-32 lg:py-40">{/* Keep your other sections */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl lg:text-7xl font-bold text-center mb-24 lg:mb-32 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]">Why We Are Better</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
            <div className="text-center">
              <UserCheck className="h-16 w-16 lg:h-20 lg:w-20 text-cyan-400 mx-auto mb-6 lg:mb-8 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
              <h3 className="text-2xl lg:text-3xl font-semibold mb-6 lg:mb-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">Verified Network</h3>
              <p className="text-white/90 text-lg lg:text-xl leading-relaxed">Roles checked. Documents verified. Only trusted professionals inside. </p>
            </div>

            <div className="text-center">
              <Lock className="h-16 w-16 lg:h-20 lg:w-20 text-cyan-400 mx-auto mb-6 lg:mb-8 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
              <h3 className="text-2xl lg:text-3xl font-semibold mb-6 lg:mb-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">Security First</h3>
              <p className="text-white/90 text-lg lg:text-xl leading-relaxed">Military grade encryption and audit trails</p>
            </div>

            <div className="text-center">
              <Receipt className="h-16 w-16 lg:h-20 lg:w-20 text-cyan-400 mx-auto mb-6 lg:mb-8 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
              <h3 className="text-2xl lg:text-3xl font-semibold mb-6 lg:mb-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">Escrow & Receipts</h3>
              <p className="text-white/90 text-lg lg:text-xl leading-relaxed">Payments secured in escrow. full receipts every time.</p>
            </div>

            <div className="text-center">
              <Zap className="h-16 w-16 lg:h-20 lg:w-20 text-cyan-400 mx-auto mb-6 lg:mb-8 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
              <h3 className="text-2xl lg:text-3xl font-semibold mb-6 lg:mb-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">Terminal Speed</h3>
              <p className="text-white/90 text-lg lg:text-xl leading-relaxed">Fast, responsive dashboards built for live and up to date data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Verification Section */}
      <section className="relative z-10 px-6 py-32 lg:py-40">{/* Keep your other sections */}
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl lg:text-7xl font-bold mb-24 lg:mb-32 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]">Trust is the runway.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 text-left max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-cyan-400 mt-1 flex-shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <p className="text-white/90 text-lg lg:text-xl leading-relaxed">Automated ID and liveness verification</p>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-cyan-400 mt-1 flex-shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <p className="text-white/90 text-lg lg:text-xl leading-relaxed">Monthly sanctions and PEP screening</p>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-cyan-400 mt-1 flex-shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <p className="text-white/90 text-lg lg:text-xl leading-relaxed">Role verification for credentials</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-cyan-400 mt-1 flex-shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <p className="text-white/90 text-lg lg:text-xl leading-relaxed">Public trust sheets with privacy masking</p>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-cyan-400 mt-1 flex-shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <p className="text-white/90 text-base leading-relaxed">Zero data sales policy</p>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-cyan-400 mt-1 flex-shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <p className="text-white/90 text-base leading-relaxed">Complete audit trail for every action</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy Section */}
      <section className="relative z-10 px-6 py-20 lg:py-28">{/* Keep your other sections */}
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-16 lg:mb-20 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]">What We Do </h2>
          <p className="text-white/90 leading-relaxed max-w-3xl mx-auto mb-16 lg:mb-20 text-lg">StratusConnect cleans up aviation. Every user and deal is verified, so the network can be trusted. Brokers bid and secure aircraft faster. Operators move aircraft to market quicker. Pilots and crew list avalavbility for free. Jobs find you not the other way around.  One platform . Faster, safer, cleaner, Built with the same discipline aviation demands in the air.       </p>
          <div className="flex justify-center space-x-12">
            <Link to="/privacy" className="text-cyan-400 hover:text-cyan-300 transition-colors drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] text-lg font-semibold">Privacy</Link>
            <Link to="/security" className="text-cyan-400 hover:text-cyan-300 transition-colors drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] text-lg font-semibold">Security</Link>
            <Link to="/compliance" className="text-cyan-400 hover:text-cyan-300 transition-colors drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] text-lg font-semibold">Compliance</Link>
          </div>
        </div>
      </section>

      {/* Payments Note */}
      <section className="relative z-10 px-6 py-32 lg:py-40">{/* Keep your other sections */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl lg:text-7xl font-bold text-center mb-24 lg:mb-32 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]">Payments & Security</h2>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-6 mb-12">
              <Lock className="h-20 w-20 lg:h-24 lg:w-24 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
              <Receipt className="h-20 w-20 lg:h-24 lg:w-24 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
            </div>
            <p className="text-2xl lg:text-3xl font-bold mb-12 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)] leading-relaxed max-w-4xl mx-auto">
              Payments run through Escrow. Every transaction comes with a receipt and full audit trail.
            </p>
            <Link to="/payments" className="text-cyan-400 hover:text-cyan-300 transition-colors text-xl lg:text-2xl font-semibold drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
              How payments work →
            </Link>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="relative z-10 px-4 lg:px-6 py-16 lg:py-24 border-t border-white/20">{/* Keep your other sections */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 lg:gap-12 mb-8 lg:mb-12">
            {[{
            label: "About",
            href: "/about"
          }, {
            label: "Fees",
            href: "/fees"
          }, {
            label: "Terms",
            href: "/terms"
          }, {
            label: "Privacy",
            href: "/privacy"
          }, {
            label: "Security",
            href: "/security"
          }, {
            label: "Contact",
            href: "/contact"
          }].map(link => <Link key={link.label} to={link.href} className="text-white/90 hover:text-white transition-colors text-base font-medium">
                {link.label}
              </Link>)}
          </div>
          
          <div className="text-center">
            <p className="text-white/90 text-sm lg:text-base font-medium">
              © 2025 Stratus Connect. Professional aviation trading platform.
            </p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} selectedRole={selectedRole} />

      {/* Cookie Consent Banner */}
      {showCookieBanner && <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-white/20 p-6 z-50 backdrop-blur-md">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-sm lg:text-base text-white/90 text-center sm:text-left font-medium leading-relaxed">
              Essential cookies only. Strict settings by default. No tracking without consent.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button variant="outline" size="sm" onClick={() => setShowCookieBanner(false)} className="rounded-2xl w-full sm:w-auto border-white/30 text-white hover:bg-white/10 px-6">
                Essential only
              </Button>
              <Button size="sm" onClick={handleCookieAccept} className="rounded-2xl w-full sm:w-auto bg-white text-slate-800 hover:bg-white/90 px-6">
                Accept all
              </Button>
            </div>
          </div>
        </div>}
    </div>;
}