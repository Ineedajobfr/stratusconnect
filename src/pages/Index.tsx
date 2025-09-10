import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Plane, 
  UserCheck, 
  Users,
  ArrowRight,
  Clock,
  Search
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoginModal } from "@/components/LoginModal";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";

export default function Index() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().slice(17, 25));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const roles = [
    {
      id: "broker",
      title: "Brokers",
      icon: Building2,
      description: "Speed creates advantage. Win more quotes with a cleaner cockpit.",
      image: "/lovable-uploads/5b72b37d-1cf2-4e5d-9c9d-de6ea6c2d8e7.png",
      route: "/terminal/broker",
      demoRoute: "/demo/broker"
    },
    {
      id: "operator",
      title: "Operators", 
      icon: Plane,
      description: "Fill the legs. Lift the yield. Control the risk.",
      image: "/lovable-uploads/87f62aae-d379-4cbe-a080-53fabcef5e60.png",
      route: "/terminal/operator",
      demoRoute: "/demo/operator"
    },
    {
      id: "pilot",
      title: "Pilots",
      icon: UserCheck,
      description: "Credentials speak. Availability sells. Fly the missions that fit.",
      image: "/lovable-uploads/97709032-3f83-4b71-92d5-970343d1f100.png",
      route: "/terminal/pilot",
      demoRoute: "/demo/pilot"
    },
    {
      id: "crew",
      title: "Cabin Crew",
      icon: Users,
      description: "Professional service wins repeat work. Your calendar is your shop window.",
      image: "/lovable-uploads/a7806c06-d816-42e6-b3ee-eea61f2134ae.png",
      route: "/terminal/crew",
      demoRoute: "/demo/crew"
    }
  ];

  const handleAccessTerminal = (role: typeof roles[0]) => {
    setSelectedRole(role.id);
    setShowLoginModal(true);
  };

  const handleDemoAccess = (role: typeof roles[0]) => {
    navigate(role.demoRoute);
  };

  return (
    <div className="min-h-screen bg-terminal-bg relative overflow-hidden">
      <StarfieldRunwayBackground />
      
      {/* Header */}
      <header className="relative z-10 sticky top-0 bg-terminal-card/80 backdrop-blur-sm border-b border-terminal-border">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-foreground">Stratus Connect</h1>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search or run a command"
                className="w-80 pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-mono">UTC {currentTime}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Keep this section big */}
      <main className="relative z-10 px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-foreground mb-6">Choose your terminal.</h1>
            <p className="text-2xl text-muted-foreground">Real time. Verified. Precise.</p>
          </div>

          {/* Role Cards Grid - Big prominent section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <Card 
                  key={role.id}
                  className="group terminal-card hover:terminal-glow cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={role.image} 
                      alt={role.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-terminal-bg/80 to-transparent" />
                  </div>
                  
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="p-3 bg-accent/20 rounded-xl">
                        <Icon className="w-8 h-8 text-accent" />
                      </div>
                      <h3 className="text-3xl font-bold text-foreground">{role.title}</h3>
                    </div>
                    
                    <p className="text-muted-foreground mb-8 text-lg leading-relaxed">{role.description}</p>
                    
                    <div className="flex space-x-4">
                      <Button
                        onClick={() => handleAccessTerminal(role)}
                        className="flex-1 btn-terminal-accent h-12 text-lg font-semibold"
                      >
                        Access Terminal
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                      
                      <Button
                        onClick={() => handleDemoAccess(role)}
                        variant="outline"
                        className="px-8 h-12 text-lg border-border text-foreground hover:bg-secondary/50"
                      >
                        Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Footer Info */}
          <div className="text-center space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Real-Time Data</h3>
                <p className="text-muted-foreground">Live market intelligence and instant updates</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Verified Network</h3>
                <p className="text-muted-foreground">Trusted professionals with verified credentials</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Precise Matching</h3>
                <p className="text-muted-foreground">AI-powered optimization for perfect fits</p>
              </div>
            </div>

            {/* Staff Access */}
            <div>
              <a 
                href="/admin-setup" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Staff Access
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        selectedRole={selectedRole}
      />
    </div>
  );
}
