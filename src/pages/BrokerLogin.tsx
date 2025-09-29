import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plane, Shield, Users, Clock } from "lucide-react";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function BrokerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        // Check if admin user and redirect accordingly
        if (email.includes('admin@stratusconnect.org') || 
            email.includes('stratuscharters@gmail.com') || 
            email.includes('lordbroctree1@gmail.com')) {
          navigate("/admin");
        } else {
          navigate("/broker");
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    navigate("/demo/broker");
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0B1426' }}>
      <StarfieldRunwayBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-8 text-gunmetal hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          {/* Login Card */}
          <Card className="terminal-card border-terminal-border">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">SC</span>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Broker Terminal</CardTitle>
              <CardDescription className="text-gunmetal">
                Speed creates advantage. Win more quotes with a cleaner cockpit.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-terminal-card border-terminal-border text-foreground"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-terminal-card border-terminal-border text-foreground"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-accent hover:bg-accent/80 text-white"
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Access Terminal"}
                </Button>
              </form>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-terminal-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-terminal-card px-2 text-gunmetal">Or</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleDemoAccess}
                className="w-full border-terminal-border text-foreground hover:bg-terminal-card"
              >
                <Plane className="w-4 h-4 mr-2" />
                Quick Demo Access
              </Button>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-terminal-card/30 border border-terminal-border/50">
              <Shield className="w-6 h-6 text-accent mx-auto mb-2" />
              <div className="text-sm text-foreground font-medium">FCA Compliant</div>
              <div className="text-xs text-gunmetal">Regulated trading</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-terminal-card/30 border border-terminal-border/50">
              <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
              <div className="text-sm text-foreground font-medium">Real-time</div>
              <div className="text-xs text-gunmetal">Live market data</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
