import { NavigationArrows } from "@/components/NavigationArrows";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ArrowLeft, ArrowRight,
    Building2,
    CheckCircle,
    Plane,
    UserCheck,
    Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RoleSelection() {
  const navigate = useNavigate();
  // Updated with cinematic background

  const handleRoleClick = (route: string) => {
    navigate(route);
  };

  const handleDemoClick = () => {
    navigate('/demo');
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
      
      {/* Enhanced golden-orange glow in the center */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at center, rgba(255, 140, 0, 0.25) 0%, rgba(255, 140, 0, 0.15) 20%, rgba(255, 140, 0, 0.08) 40%, rgba(255, 140, 0, 0.04) 60%, transparent 80%)',
        }}
      />
      
      {/* Additional orange glow layer for more intensity */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 100% 80% at center, rgba(255, 165, 0, 0.12) 0%, rgba(255, 140, 0, 0.08) 30%, rgba(255, 140, 0, 0.04) 50%, transparent 70%)',
        }}
      />
      
      {/* Subtle pulsing orange glow effect */}
      <div 
        className="absolute inset-0 animate-pulse"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at center, rgba(255, 140, 0, 0.08) 0%, rgba(255, 140, 0, 0.04) 25%, transparent 50%)',
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />
      
      <div className="absolute top-4 left-4 z-40">
        <StratusConnectLogo />
      </div>
      
      <div className="absolute top-4 right-4 z-40">
        <NavigationArrows />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <Button
            variant="ghost"
            onClick={() => navigate('/about')}
            className="mb-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to About
          </Button>
          
          <h2 className="text-4xl font-bold text-foreground mb-4 title-glow">Choose Your Terminal</h2>
          <p className="text-xl text-muted-foreground text-glow-subtle">Access your personalized workspace</p>
        </div>

        {/* Terminal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Broker Terminal */}
          <Card className="group terminal-card hover:terminal-glow cursor-pointer animate-fade-in-up">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-accent/20 rounded-xl animate-pulse-glow">
                  <Building2 className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-foreground">Broker Terminal</CardTitle>
                  <CardDescription className="text-muted-foreground">Quote management & client relations</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6 text-glow-subtle">
                Manage RFQs, track deals, and communicate with clients through our comprehensive broker dashboard. 
                Real-time notifications, performance tracking, and integrated flight monitoring.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gunmetal">
                  <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                  Real-time notifications & alerts
                </div>
                <div className="flex items-center text-sm text-gunmetal">
                  <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                  RFQ management & quote tracking
                </div>
                <div className="flex items-center text-sm text-gunmetal">
                  <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                  Performance & reputation system
                </div>
              </div>
              <div className="flex space-x-3">
                <Button onClick={() => handleRoleClick('/terminal/broker')} className="flex-1 btn-terminal-accent button-glow">
                  Access Terminal <ArrowRight className="w-4 h-4 ml-2 icon-glow" />
                </Button>
                <Button onClick={handleDemoClick} variant="outline" className="px-6 button-glow">
                  Demo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Operator Terminal */}
          <Card className="group terminal-card hover:terminal-glow cursor-pointer animate-fade-in-up" style={{
            animationDelay: '0.1s'
          }}>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-accent/20 rounded-xl animate-pulse-glow">
                  <Plane className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-foreground">Operator Terminal</CardTitle>
                  <CardDescription className="text-muted-foreground">Fleet management & optimization</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6 text-glow-subtle">
                Manage your fleet operations with advanced search, document management, and real-time flight tracking. 
                Complete crew management and contract generation tools.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gunmetal">
                  <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                  Advanced search & filtering
                </div>
                <div className="flex items-center text-sm text-gunmetal">
                  <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                  Document & contract management
                </div>
                <div className="flex items-center text-sm text-gunmetal">
                  <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                  Real-time flight tracking
                </div>
              </div>
              <div className="flex space-x-3">
                <Button onClick={() => handleRoleClick('/terminal/operator')} className="flex-1 btn-terminal-accent button-glow">
                  Access Terminal <ArrowRight className="w-4 h-4 ml-2 icon-glow" />
                </Button>
                <Button onClick={handleDemoClick} variant="outline" className="px-6 button-glow">
                  Demo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pilot Terminal */}
          <Card className="group terminal-card hover:terminal-glow cursor-pointer animate-fade-in-up" style={{
            animationDelay: '0.2s'
          }}>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-accent/20 rounded-xl animate-pulse-glow">
                  <UserCheck className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-foreground">Pilot Terminal</CardTitle>
                  <CardDescription className="text-muted-foreground">Flight assignments & credentials</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6 text-glow-subtle">
                Track your flight assignments, manage certifications, and access job opportunities. 
                Complete dashboard with notes, community forums, and document storage.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gunmetal">
                  <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                  Flight assignment tracking
                </div>
                <div className="flex items-center text-sm text-gunmetal">
                  <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                  Job board & community forums
                </div>
                <div className="flex items-center text-sm text-gunmetal">
                  <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                  Document & note management
                </div>
              </div>
              <div className="flex space-x-3">
                <Button onClick={() => handleRoleClick('/terminal/pilot')} className="flex-1 btn-terminal-accent button-glow">
                  Access Terminal <ArrowRight className="w-4 h-4 ml-2 icon-glow" />
                </Button>
                <Button onClick={handleDemoClick} variant="outline" className="px-6 button-glow">
                  Demo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Crew Terminal */}
          <Card className="group terminal-card hover:terminal-glow cursor-pointer animate-fade-in-up" style={{
            animationDelay: '0.3s'
          }}>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-accent/20 rounded-xl animate-pulse-glow">
                  <Users className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-foreground">Crew Terminal</CardTitle>
                  <CardDescription className="text-muted-foreground">Service excellence & scheduling</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6 text-glow-subtle">
                Manage crew assignments, track performance, and access job opportunities. 
                Complete dashboard with notes, community forums, and document storage.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gunmetal">
                  <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                  Assignment management
                </div>
                <div className="flex items-center text-sm text-gunmetal">
                  <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                  Job board & community forums
                </div>
                <div className="flex items-center text-sm text-gunmetal">
                  <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                  Document & note management
                </div>
              </div>
              <div className="flex space-x-3">
                <Button onClick={() => handleRoleClick('/terminal/crew')} className="flex-1 btn-terminal-accent button-glow">
                  Access Terminal <ArrowRight className="w-4 h-4 ml-2 icon-glow" />
                </Button>
                <Button onClick={handleDemoClick} variant="outline" className="px-6 button-glow">
                  Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
