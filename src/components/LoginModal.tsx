import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plane, 
  UserCheck, 
  Building2,
  Lock,
  Mail,
  Loader2,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRole?: string | null;
}

export const LoginModal = ({ isOpen, onClose, selectedRole }: LoginModalProps) => {
  const [activeRole, setActiveRole] = useState<string | null>(selectedRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, loginAsDemo } = useAuth();

  const roles = [
    {
      id: "broker",
      title: "Brokers",
      icon: Building2,
      description: "Speed creates advantage. Win more quotes with a cleaner cockpit.",
      route: "/terminal/broker"
    },
    {
      id: "operator",
      title: "Operators",
      icon: Plane,
      description: "Fill the legs. Lift the yield. Control the risk.",
      route: "/terminal/operator"
    },
    {
      id: "pilot",
      title: "Pilots",
      icon: UserCheck,
      description: "Credentials speak. Availability sells. Fly the missions that fit.",
      route: "/terminal/crew"
    },
    {
      id: "crew",
      title: "Cabin Crew",
      icon: Users,
      description: "Professional service wins repeat work. Your calendar is your shop window.",
      route: "/terminal/crew"
    }
  ];

  const handleLogin = async () => {
    if (!activeRole || !email || !password) return;
    setLoading(true);
    try {
      const ok = await login(email, password);
      if (!ok) return;
      const role = roles.find(r => r.id === activeRole);
      if (role) {
        navigate(role.route);
        onClose();
      }
    } catch (err) {
      toast({ title: "Error", description: "Login failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: { id: string; route: string }) => {
    setActiveRole(role.id);
    setLoading(true);
    try {
      const ok = await loginAsDemo(role.id);
      if (!ok) return;
      navigate(role.route);
      onClose();
    } catch (error) {
      toast({ title: "Demo login failed", description: (error as any)?.message || "Demo accounts may not be set up yet", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-card border-border/50">
        <DialogHeader className="relative">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Lock className="w-4 h-4 text-primary-foreground" />
            </div>
            Access Terminal
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8">
          {/* Role Selection */}
          <div>
            <Label className="text-base font-semibold mb-4 block">Select Your Terminal</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roles.map((role) => {
                const Icon = role.icon;
                const isActive = activeRole === role.id;
                
                return (
                  <Card 
                    key={role.id}
                    className={`cursor-pointer transition-all border-2 ${
                      isActive 
                        ? 'ring-2 ring-primary bg-primary/10 border-primary' 
                        : 'hover:border-primary/50 border-border'
                    }`}
                    onClick={() => setActiveRole(role.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isActive ? 'bg-gradient-primary' : 'bg-muted'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            isActive ? 'text-primary-foreground' : 'text-foreground'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg mb-2">{role.title}</h3>
                          <p className="text-sm text-foreground/80 leading-relaxed mb-3">{role.description}</p>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-sm text-green-600 hover:text-green-700 font-medium bg-green-600/10 hover:bg-green-600/20 px-3 py-1 rounded-md"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDemoLogin(role);
                            }}
                            disabled={loading}
                          >
                            Quick Demo Access →
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          {activeRole && (
            <div className="space-y-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-primary/15 text-primary border-primary/20">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Verified Access Required
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-input/80 border-border/50 h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-input/80 border-border/50 h-12"
                  />
                </div>
                
                <div className="flex flex-col gap-4 pt-4">
                  <Button 
                    className="w-full bg-gradient-primary hover:opacity-90 h-12 text-base font-medium"
                    onClick={handleLogin}
                    disabled={!email || !password || loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Access Terminal
                  </Button>
                  
                  <div className="text-center">
                    <Button variant="link" className="text-sm text-foreground/70 hover:text-foreground">
                      Request Verification Access
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="text-sm text-foreground/60 text-center pt-6 border-t border-border flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            All connections are encrypted and verified
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};