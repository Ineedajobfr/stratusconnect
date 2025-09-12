import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavigationArrows } from "@/components/NavigationArrows";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DemoBanner } from "@/components/DemoBanner";
import DemoStatusWidget from "@/components/DemoStatusWidget";
import DemoDSARWorkflow from "@/components/DemoDSARWorkflow";
import DemoFeeStructure from "@/components/DemoFeeStructure";
import { 
  Plane, 
  Users, 
  BarChart3, 
  Shield, 
  DollarSign, 
  Activity,
  FileText,
  Calculator,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DemoSetup() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('terminals');

  const isDemoMode = import.meta.env.VITE_SC_DEMO_MODE === 'true';

  const demoOptions = [
    {
      title: "Broker Terminal",
      description: "FCA compliant trading floor with Stripe Connect payments",
      icon: BarChart3,
      path: "/demo/broker",
      role: "broker"
    },
    {
      title: "Operator Terminal", 
      description: "Mission control with KYC verification and hiring fees",
      icon: Plane,
      path: "/demo/operator", 
      role: "operator"
    },
    {
      title: "Pilot Terminal",
      description: "Advanced cockpit with compliance tracking", 
      icon: Users,
      path: "/demo/pilot",
      role: "pilot"
    },
    {
      title: "Crew Terminal",
      description: "Professional flight deck with data rights", 
      icon: Users,
      path: "/demo/crew",
      role: "crew"
    }
  ];

  const complianceFeatures = [
    {
      title: "FCA Compliant Payments",
      description: "Stripe Connect integration with 7% broker-operator commission",
      icon: DollarSign,
      component: <DemoFeeStructure />
    },
    {
      title: "KYC/AML Screening",
      description: "Identity verification and sanctions screening before payouts",
      icon: Shield,
      component: <div className="p-4 text-center text-gunmetal">KYC verification workflow demo</div>
    },
    {
      title: "Real-Time Monitoring",
      description: "Live uptime and performance metrics from UptimeRobot",
      icon: Activity,
      component: <DemoStatusWidget />
    },
    {
      title: "GDPR Data Rights",
      description: "DSAR workflow for data access, export, and erasure",
      icon: FileText,
      component: <DemoDSARWorkflow />
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
              <p className="text-xl lg:text-2xl text-gunmetal leading-relaxed mb-4">
                Experience StratusConnect's FCA compliant aviation platform
              </p>
              <div className="flex justify-center gap-4 mb-6">
                <Badge className="bg-green-100 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  FCA Compliant
                </Badge>
                <Badge className="bg-blue-100 text-blue-800">
                  <Shield className="w-3 h-3 mr-1" />
                  GDPR Ready
                </Badge>
                {isDemoMode && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Demo Mode
                  </Badge>
                )}
              </div>
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
                    <Button className="btn-terminal-accent w-full">
                      View Demo
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Compliance Features Section */}
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Compliance Features
                </h2>
                <p className="text-gunmetal text-lg">
                  FCA compliant, GDPR ready, with real-time monitoring
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {complianceFeatures.map((feature, index) => (
                  <Card key={index} className="terminal-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <feature.icon className="w-5 h-5 text-accent" />
                        {feature.title}
                      </CardTitle>
                      <CardDescription>
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {feature.component}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="text-center">
              <p className="text-gunmetal text-sm mb-4">
                New to StratusConnect? Start by exploring any terminal above.<br/>
                <span className="text-accent">Each terminal features FCA compliant payments and GDPR data rights!</span>
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