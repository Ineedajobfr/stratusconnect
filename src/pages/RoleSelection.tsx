import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, Plane, Users, ArrowLeft, ArrowRight, CheckCircle, UserCheck
} from "lucide-react";
import { NavigationArrows } from "@/components/NavigationArrows";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";

export default function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleClick = (route: string) => {
    navigate(route);
  };

  const handleDemoClick = () => {
    navigate('/demo');
  };

  return (
    <div className="min-h-screen bg-app relative overflow-hidden">
      <StarfieldRunwayBackground />
      
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
                Access real-time aircraft listings, manage client relationships, and close deals faster than ever. 
                Our AI-powered matching system connects you with the right opportunities.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gunmetal">
                  <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                  Real-time market data
                </div>
                <div className="flex items-center text-sm text-gunmetal">
                  <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                  Automated quote generation
                </div>
                <div className="flex items-center text-sm text-gunmetal">
                  <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                  Secure escrow payments
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
                Maximize your fleet's potential with intelligent scheduling, crew management, and real-time performance tracking. 
                Turn every flight into profit.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gunmetal">
                  <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                  Fleet optimization tools
                </div>
                <div className="flex items-center text-sm text-gunmetal">
                  <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                  Crew scheduling automation
                </div>
                <div className="flex items-center text-sm text-gunmetal">
                  <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                  Real-time performance metrics
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
                Find the best flying opportunities that match your skills and schedule. 
                Build your reputation and grow your career with verified operators.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gunmetal">
                  <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                  Job matching algorithm
                </div>
                <div className="flex items-center text-sm text-gunmetal">
                  <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                  Credential verification
                </div>
                <div className="flex items-center text-sm text-gunmetal">
                  <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                  Secure payment processing
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
                Connect with top operators and build lasting relationships. 
                Showcase your skills and availability to find the best crew assignments.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gunmetal">
                  <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                  Premium crew opportunities
                </div>
                <div className="flex items-center text-sm text-gunmetal">
                  <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                  Flexible scheduling
                </div>
                <div className="flex items-center text-sm text-gunmetal">
                  <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                  Reputation building tools
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
