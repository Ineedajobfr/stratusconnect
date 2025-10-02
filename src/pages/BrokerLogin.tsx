import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Clock, Plane, Shield } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
          navigate("/demo/broker");
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
    <div className="min-h-screen relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(139, 69, 19, 0.9) 0%, rgba(91, 30, 13, 0.95) 25%, rgba(59, 30, 13, 0.98) 50%, rgba(20, 20, 20, 0.99) 75%, rgba(10, 10, 12, 1) 100%), linear-gradient(135deg, #3b1e0d 0%, #2d1a0a 25%, #1a0f08 50%, #0f0a06 75%, #0a0a0c 100%)',
        minHeight: '100vh',
        width: '100vw',
      }}
      data-cinematic-bg="true"
    >
      {/* Cinematic Vignette - Creates spotlight effect on center */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at center, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0.3) 80%, rgba(0, 0, 0, 0.6) 100%)',
        }}
      />
      
      {/* Subtle golden-orange glow in the center */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at center, rgba(255, 140, 0, 0.08) 0%, rgba(255, 140, 0, 0.04) 30%, transparent 60%)',
        }}
      />
      
      {/* Subtle grid pattern overlay - more refined */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgTCAwIDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4=')] opacity-30"></div>
      </div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-8 text-white hover:text-white/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          {/* Login Card */}
          <Card className="bg-black/70 backdrop-blur-md rounded-lg shadow-2xl border border-white/20"
            style={{
              boxShadow: '0 0 40px rgba(255, 140, 0, 0.3), 0 0 80px rgba(255, 140, 0, 0.1), 0 25px 50px rgba(0, 0, 0, 0.5)',
            }}
          >
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="text-white text-lg font-bold bg-black px-6 py-3 rounded backdrop-blur-sm"
                  style={{
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  }}
                >
                  STRATUSCONNECT
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">Broker Terminal</CardTitle>
              <CardDescription className="text-white/80">
                Speed creates advantage. Win more quotes with a cleaner cockpit.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white text-black border-gray-300 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white text-black border-gray-300 focus:border-blue-500"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-black hover:bg-gray-800 text-white"
                  style={{
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  }}
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Access Terminal"}
                </Button>
              </form>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black/70 px-2 text-gray-400">OR</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleDemoAccess}
                className="w-full bg-white text-black border-gray-300 hover:bg-white hover:text-black hover:border-gray-400 transition-colors duration-200"
                style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)' }}
              >
                <Plane className="w-4 h-4 mr-2" />
                Quick Demo Access
              </Button>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-black/50 border border-white/20">
              <Shield className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-sm text-white font-medium">FCA Compliant</div>
              <div className="text-xs text-white/60">Regulated trading</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-black/50 border border-white/20">
              <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-sm text-white font-medium">Real-time</div>
              <div className="text-xs text-white/60">Live market data</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
