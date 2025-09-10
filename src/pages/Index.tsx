import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Plane, 
  UserCheck, 
  Users,
  ArrowRight,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoginModal } from "@/components/LoginModal";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";

export default function Index() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-ink relative overflow-hidden">
      <StarfieldRunwayBackground />
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white">Stratus Connect</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search or run a command"
              className="w-80 px-4 py-2 bg-glass border border-line rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            />
          </div>
          <div className="flex items-center space-x-2 text-white/70">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-mono">UTC</span>
            <span className="text-sm font-mono">10:45:35</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">Choose your terminal.</h1>
            <p className="text-xl text-white/70">Real time. Verified. Precise.</p>
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <Card 
                  key={role.id}
                  className="group bg-glass border border-line hover:border-cyan-400/50 transition-all duration-300 hover:shadow-glow cursor-pointer overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={role.image} 
                      alt={role.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-cyan-600/20 rounded-lg">
                          <Icon className="w-6 h-6 text-cyan-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">{role.title}</h3>
                      </div>
                    </div>
                    
                    <p className="text-white/70 mb-6 leading-relaxed">{role.description}</p>
                    
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => handleAccessTerminal(role)}
                        className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 transition-colors duration-200 focus:ring-2 focus:ring-cyan-400/40 focus:outline-none"
                      >
                        Access Terminal
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                      
                      <Button
                        onClick={() => handleDemoAccess(role)}
                        variant="outline"
                        className="px-6 py-3 border border-line text-white hover:bg-white/10 transition-colors duration-200 focus:ring-2 focus:ring-cyan-400/40 focus:outline-none"
                      >
                        Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Staff Access - Hidden at bottom */}
          <div className="mt-16 text-center">
            <a 
              href="/admin-setup" 
              className="text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              Staff Access
            </a>
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