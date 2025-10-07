import { ErrorBoundary } from "@/components/ErrorBoundary";
import { NavigationArrows } from "@/components/NavigationArrows";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ArrowRight,
    BarChart3,
    CheckCircle,
    Plane,
    Shield,
    Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DemoSetup() {
  const navigate = useNavigate();

  const demoOptions = [
    {
      title: "Broker Terminal",
      description: "Manage RFQs, track deals, and communicate with clients through our comprehensive broker dashboard.",
      icon: BarChart3,
      path: "/demo/broker",
      role: "broker",
      features: ["Real-time notifications", "RFQ management", "Performance tracking"]
    },
    {
      title: "Operator Terminal", 
      description: "Manage your fleet operations with advanced search, document management, and real-time flight tracking.",
      icon: Plane,
      path: "/demo/operator", 
      role: "operator",
      features: ["Advanced search", "Document management", "Flight tracking"]
    },
    {
      title: "Pilot Terminal",
      description: "Track your flight assignments, manage certifications, and access job opportunities.", 
      icon: Users,
      path: "/demo/pilot",
      role: "pilot",
      features: ["Assignment tracking", "Job board", "Document storage"]
    },
    {
      title: "Crew Terminal",
      description: "Manage crew assignments, track performance, and access job opportunities.", 
      icon: Users,
      path: "/demo/crew",
      role: "crew",
      features: ["Assignment management", "Community forums", "Document access"]
    }
  ];

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen overflow-hidden">
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
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold mb-8 text-foreground">
              Platform Demo
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Experience StratusConnect's comprehensive aviation platform with FCA compliant payments, 
              real-time monitoring, and enterprise-grade security.
            </p>
            <div className="flex justify-center gap-4 mb-8">
              <div className="bg-accent/20 px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4 inline mr-2 text-accent" />
                <span className="text-foreground">FCA Compliant</span>
              </div>
              <div className="bg-accent/20 px-4 py-2 rounded-full">
                <Shield className="w-4 h-4 inline mr-2 text-accent" />
                <span className="text-foreground">GDPR Ready</span>
              </div>
            </div>
          </div>

          {/* Terminal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {demoOptions.map((option, index) => (
              <Card key={option.role} className="group terminal-card hover:terminal-glow cursor-pointer animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => navigate(option.path)}>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-accent/20 rounded-xl animate-pulse-glow">
                      <option.icon className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-foreground">{option.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {option.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-6">
                    {option.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-accent mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-white">
                    Access Terminal <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-terminal-card rounded-2xl p-12 text-center max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join the aviation industry's most comprehensive platform. 
                Experience real-time deal management, secure payments, and regulatory compliance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/roles')}
                  className="bg-accent hover:bg-accent/90 text-white px-8 py-3"
                >
                  Choose Your Terminal
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/about')}
                  className="border-accent text-accent hover:bg-accent/10 px-8 py-3"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}