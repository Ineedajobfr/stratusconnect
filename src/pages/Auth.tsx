import { DemoBanner } from '@/components/DemoBanner';
import { NavigationArrows } from '@/components/NavigationArrows';
import StratusCinematicBackground from '@/components/StratusCinematicBackground';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Briefcase, Building, Eye, EyeOff, Loader2, Mail, Plane, Shield, User, Users } from 'lucide-react';
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function Auth() {
  const { user, loading, login, loginWithMagicLink, register } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    companyName: '',
    role: 'broker' as 'broker' | 'operator' | 'pilot' | 'crew'
  });

  // Demo credentials for easy testing
  const demoCredentials = {
    operator: { email: 'demo.operator@stratusconnect.org', password: 'demo123456' },
    broker: { email: 'demo.broker@stratusconnect.org', password: 'demo123456' },
    pilot: { email: 'demo.pilot@stratusconnect.org', password: 'demo123456' },
    crew: { email: 'demo.crew@stratusconnect.org', password: 'demo123456' }
  };

  // Redirect if already authenticated
  if (loading) {
    return (
      <div className="min-h-screen relative" style={{ backgroundColor: '#0B1426' }}>
        <DemoBanner />
        <StratusCinematicBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-terminal-glow" />
            <span className="text-foreground">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    // Redirect based on verification status and role
    if (user.verificationStatus !== 'approved') {
      return <Navigate to="/verification-pending" replace />;
    }
    
    const roleRoutes = {
      broker: '/terminal/broker',
      operator: '/terminal/operator',
      pilot: '/terminal/crew',
      crew: '/terminal/crew',
      admin: '/terminal/admin'
    };
    
    return <Navigate to={roleRoutes[user.role] || '/terminal/operator'} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) return;

    setIsLoading(true);
    await login(loginData.email, loginData.password);
    setIsLoading(false);
  };

  const handleMagicLinkLogin = async () => {
    if (!loginData.email) return;
    
    setIsLoading(true);
    await loginWithMagicLink(loginData.email);
    setIsLoading(false);
  };

  const handleDemoLogin = async (role: keyof typeof demoCredentials) => {
    const credentials = demoCredentials[role];
    setIsLoading(true);
    const success = await login(credentials.email, credentials.password);
    if (!success) {
      // If demo login fails, show setup instructions
      setLoginData(credentials);
    }
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      return;
    }

    if (registerData.password.length < 8 || 
        !/[a-zA-Z]/.test(registerData.password) || 
        !/[0-9]/.test(registerData.password)) {
      return;
    }

    setIsLoading(true);
    
    const result = await register({
      email: registerData.email,
      password: registerData.password,
      fullName: registerData.fullName,
      companyName: registerData.companyName || undefined,
      role: registerData.role
    });

    if (result) {
      setRegistrationSuccess(true);
      setActiveTab('login');
    }
    
    setIsLoading(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'operator': return Building;
      case 'broker': return Briefcase;
      case 'pilot': return Plane;
      case 'crew': return Users;
      default: return User;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
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

      {/* STRATUSCONNECT Logo - Top Left */}
      <div 
        className="absolute top-8 left-8 text-white text-lg font-bold bg-black px-6 py-3 rounded backdrop-blur-sm z-20 cursor-pointer hover:bg-gray-800 transition-colors"
        style={{
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        STRATUSCONNECT
      </div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <NavigationArrows />
        </div>

        <div className="w-full max-w-md space-y-6">
          {registrationSuccess && (
            <Alert className="border-terminal-success bg-terminal-success/10">
              <Shield className="h-4 w-4 text-terminal-success" />
              <AlertDescription className="text-terminal-success">
                Registration successful! Please check your email to verify your account.
              </AlertDescription>
            </Alert>
          )}

          <Card 
            className="bg-white/95 backdrop-blur-sm shadow-2xl border border-white/20"
            style={{
              boxShadow: '0 0 40px rgba(255, 140, 0, 0.3), 0 0 80px rgba(255, 140, 0, 0.1), 0 25px 50px rgba(0, 0, 0, 0.5)',
            }}
          >
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl text-black font-bold">StratusConnect</CardTitle>
                <CardDescription className="text-gray-600">
                  Secure Aviation Marketplace Platform
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                  <TabsTrigger 
                    value="login" 
                    className="text-gray-600 data-[state=active]:bg-black data-[state=active]:text-white"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="register" 
                    className="text-gray-600 data-[state=active]:bg-black data-[state=active]:text-white"
                  >
                    Register
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-black font-medium">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        placeholder="Enter your email"
                        className="bg-white border-gray-300 text-black placeholder-gray-500 focus:border-black focus:ring-black"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-black font-medium">Password</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          placeholder="Enter your password"
                          className="bg-white border-gray-300 text-black placeholder-gray-500 focus:border-black focus:ring-black pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Button
                        type="submit"
                        className="w-full bg-black hover:bg-gray-800 text-white"
                        style={{
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        }}
                        disabled={isLoading || !loginData.email || !loginData.password}
                      >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-black text-black hover:bg-black hover:text-white"
                        style={{
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                        }}
                        onClick={handleMagicLinkLogin}
                        disabled={isLoading || !loginData.email}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Send Magic Link
                      </Button>
                    </div>
                  </form>

                  {/* Demo Login Section */}
                  <div className="pt-4 border-t border-gray-300">
                    <p className="text-sm text-gray-600 text-center mb-3">
                      Quick Demo Access:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(demoCredentials).map(([role, _]) => {
                        const Icon = getRoleIcon(role);
                        return (
                          <Button
                            key={role}
                            variant="outline"
                            size="sm"
                            onClick={() => handleDemoLogin(role as keyof typeof demoCredentials)}
                            disabled={isLoading}
                            className="border-gray-300 text-gray-700 hover:bg-gray-100 text-xs"
                            style={{
                              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                            }}
                          >
                            <Icon className="mr-1 h-3 w-3" />
                            {role}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="register" className="space-y-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name" className="text-black font-medium">Full Name</Label>
                      <Input
                        id="register-name"
                        type="text"
                        value={registerData.fullName}
                        onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                        placeholder="Enter your full name"
                        className="bg-white border-gray-300 text-black placeholder-gray-500 focus:border-black focus:ring-black"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-black font-medium">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        placeholder="Enter your email"
                        className="bg-white border-gray-300 text-black placeholder-gray-500 focus:border-black focus:ring-black"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-black font-medium">Company (Optional)</Label>
                      <Input
                        id="company"
                        type="text"
                        value={registerData.companyName}
                        onChange={(e) => setRegisterData({ ...registerData, companyName: e.target.value })}
                        placeholder="Enter your company name"
                        className="bg-white border-gray-300 text-black placeholder-gray-500 focus:border-black focus:ring-black"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-black font-medium">Role</Label>
                      <Select 
                        value={registerData.role} 
                        onValueChange={(value: 'broker' | 'operator' | 'pilot' | 'crew') => 
                          setRegisterData({ ...registerData, role: value })
                        }
                      >
                        <SelectTrigger className="bg-white border-gray-300 text-black focus:border-black focus:ring-black">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300">
                          <SelectItem value="broker" className="text-black hover:bg-gray-100">
                            <div className="flex items-center">
                              <Briefcase className="mr-2 h-4 w-4" />
                              Charter Broker
                            </div>
                          </SelectItem>
                          <SelectItem value="operator" className="text-black hover:bg-gray-100">
                            <div className="flex items-center">
                              <Building className="mr-2 h-4 w-4" />
                              Aircraft Operator
                            </div>
                          </SelectItem>
                          <SelectItem value="pilot" className="text-black hover:bg-gray-100">
                            <div className="flex items-center">
                              <Plane className="mr-2 h-4 w-4" />
                              Pilot
                            </div>
                          </SelectItem>
                          <SelectItem value="crew" className="text-black hover:bg-gray-100">
                            <div className="flex items-center">
                              <Users className="mr-2 h-4 w-4" />
                              Cabin Crew
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-black font-medium">Password</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          placeholder="Minimum 8 characters with letters and numbers"
                          className="bg-white border-gray-300 text-black placeholder-gray-500 focus:border-black focus:ring-black pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-black font-medium">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        placeholder="Confirm your password"
                        className="bg-white border-gray-300 text-black placeholder-gray-500 focus:border-black focus:ring-black"
                        required
                      />
                    </div>
                    
                    {registerData.password && registerData.password !== registerData.confirmPassword && (
                      <Alert className="border-red-500 bg-red-500/10">
                        <AlertDescription className="text-red-500">
                          Passwords do not match
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {registerData.password && (registerData.password.length < 8 || 
                      !/[a-zA-Z]/.test(registerData.password) || 
                      !/[0-9]/.test(registerData.password)) && (
                      <Alert className="border-yellow-500 bg-yellow-500/10">
                        <AlertDescription className="text-yellow-600">
                          Password must be at least 8 characters with letters and numbers
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-black hover:bg-gray-800 text-white"
                      disabled={
                        isLoading || 
                        !registerData.email || 
                        !registerData.password || 
                        !registerData.fullName || 
                        registerData.password !== registerData.confirmPassword ||
                        registerData.password.length < 8 ||
                        !/[a-zA-Z]/.test(registerData.password) ||
                        !/[0-9]/.test(registerData.password)
                      }
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}