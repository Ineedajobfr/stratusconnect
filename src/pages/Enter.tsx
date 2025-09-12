import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { NavigationArrows } from "@/components/NavigationArrows";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";

export default function Enter() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register, user } = useAuth();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<'login' | 'signup'>(
    searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: '',
    companyName: '',
    phoneNumber: ''
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const roleRoutes = {
        broker: '/terminal/broker',
        operator: '/terminal/operator',
        pilot: '/terminal/crew',
        crew: '/terminal/crew',
        admin: '/terminal/admin'
      };
      navigate(roleRoutes[user.role as keyof typeof roleRoutes] || '/terminal/broker');
    }
  }, [user, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const success = await login(formData.email, formData.password);
        if (success) {
          toast({
            title: "Login successful",
            description: "Welcome back to Stratus Connect"
          });
        }
      } else {
        const result = await register({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          role: formData.role as 'broker' | 'operator' | 'pilot' | 'crew',
          companyName: formData.companyName
        });
        
        if (result) {
          toast({
            title: "Registration successful", 
            description: "Welcome to Stratus Connect"
          });
          // Navigate to verification pending or terminal based on approval status
          navigate('/verification-pending');
        }
      }
    } catch (error: unknown) {
      toast({
        title: "Authentication failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <StarfieldRunwayBackground intensity={0.7} starCount={260} />
      
      <div className="absolute top-4 right-4 z-40">
        <NavigationArrows />
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-white/70 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Button>
        </div>

        <Card className="bg-slate-800/50 border-white/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-cyan-400" />
            </div>
            <CardTitle 
              className="text-2xl text-white cursor-pointer hover:opacity-80 transition-opacity drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
              onClick={() => window.location.href = '/'}
            >
              StratusConnect
            </CardTitle>
            <CardDescription className="text-white/80">
              {mode === 'login' 
                ? 'Enter your credentials to access the terminal' 
                : 'Create your account to join the network'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-white">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="bg-slate-700/50 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-white">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                      <SelectTrigger className="bg-slate-700/50 border-white/20 text-white">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="broker">Broker</SelectItem>
                        <SelectItem value="operator">Operator</SelectItem>
                        <SelectItem value="pilot">Pilot</SelectItem>
                        <SelectItem value="crew">Cabin Crew</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-white">Company Name</Label>
                    <Input
                      id="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="Enter your company name"
                      className="bg-slate-700/50 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-white">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="Enter your phone number"
                      className="bg-slate-700/50 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="bg-slate-700/50 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="bg-slate-700/50 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-cyan-400 text-slate-900 hover:bg-cyan-300 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Please wait...' : (mode === 'login' ? 'Log in' : 'Sign up')}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-center">
            <p className="text-sm text-white/70">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <Button
                variant="link"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-cyan-400 p-0 h-auto font-normal underline"
              >
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </Button>
            </p>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-white/60">
            By continuing, you agree to our{' '}
            <Button 
              variant="link" 
              onClick={() => navigate('/terms')}
              className="text-cyan-400 p-0 h-auto text-xs underline"
            >
              Terms of Service
            </Button>{' '}
            and{' '}
            <Button 
              variant="link" 
              onClick={() => navigate('/privacy')}
              className="text-cyan-400 p-0 h-auto text-xs underline"
            >
              Privacy Policy
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}