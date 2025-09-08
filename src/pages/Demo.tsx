import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavigationArrows } from "@/components/NavigationArrows";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DemoBanner } from "@/components/DemoBanner";
import { Plane, Users, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DemoSetup() {
  const navigate = useNavigate();

  const demoOptions = [
    {
      title: "Broker Terminal",
      description: "Trading floor interface with live market data and quote management",
      icon: BarChart3,
      path: "/demo/broker",
      role: "broker"
    },
    {
      title: "Operator Terminal", 
      description: "Mission control center with real-time fleet tracking and operations",
      icon: Plane,
      path: "/demo/operator", 
      role: "operator"
    },
    {
      title: "Pilot Terminal",
      description: "Advanced cockpit interface with flight controls and navigation", 
      icon: Users,
      path: "/demo/pilot",
      role: "pilot"
    },
    {
      title: "Crew Terminal",
      description: "Professional flight deck with crew coordination and safety monitoring", 
      icon: Users,
      path: "/demo/crew",
      role: "crew"
    }
  ];

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-terminal-bg">
        <DemoBanner />
        <StarfieldRunwayBackground intensity={0.5} starCount={200} />
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="absolute top-6 left-6">
            <StratusConnectLogo />
          </div>
          
          <div className="absolute top-6 right-6">
            <NavigationArrows />
          </div>
          
          <div className="w-full max-w-4xl">
            <div className="text-center mb-12">
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-foreground drop-shadow-[0_0_30px_rgba(255,255,255,0.7)]">
                Platform Demo
              </h1>
              <p className="text-xl lg:text-2xl text-gunmetal leading-relaxed">
                Experience StratusConnect's mission-critical aviation platform with command center interfaces
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {demoOptions.map((option) => (
                <Card key={option.role} className="terminal-card hover:terminal-glow transition-all cursor-pointer"
                      onClick={() => navigate(option.path)}>
                  <CardHeader className="text-center">
                    <option.icon className="w-12 h-12 mx-auto mb-4 text-accent" />
                    <CardTitle className="text-foreground">{option.title}</CardTitle>
                    <CardDescription className="text-gunmetal">
                      {option.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button className="btn-terminal-primary w-full">
                      View Demo
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <p className="text-gunmetal text-sm mb-4">
                New to StratusConnect? Start by exploring any terminal above.<br/>
                <span className="text-accent">Each terminal features both standard and command center views!</span>
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/enter")}
                className="btn-terminal-secondary"
              >
                Sign Up for Full Access
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}