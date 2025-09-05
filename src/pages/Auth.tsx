import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { NavigationArrows } from '@/components/NavigationArrows';
import { StratusConnectLogo } from '@/components/StratusConnectLogo';
import { DemoBanner } from '@/components/DemoBanner';
import StarfieldRunwayBackground from '@/components/StarfieldRunwayBackground';
import { Loader2, Shield, Eye, EyeOff, Mail, Plane, User, Building, Users, Briefcase } from 'lucide-react';

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
    crew: { email: 'demo.crew@stratusconnect.org', password: 'demo123456' },
    admin: { email: 'demo.admin@stratusconnect.org', password: 'demo123456' }
  };

  // Redirect if already authenticated
  if (loading) {
    return (
      <div className="min-h-screen bg-terminal-bg relative">
        <DemoBanner />
        <StarfieldRunwayBackground intensity={0.3} starCount={150} />
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
    <div className="min-h-screen bg-terminal-bg relative">
      <DemoBanner />
      <StarfieldRunwayBackground intensity={0.3} starCount={150} />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="absolute top-6 left-6">
          <StratusConnectLogo />
        </div>
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

          <Card className="terminal-card bg-terminal-card/90 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <Shield className="h-12 w-12 text-terminal-glow" />
              </div>
              <div>
                <CardTitle className="text-2xl text-foreground">StratusConnect</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Secure Aviation Marketplace Platform
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 bg-terminal-card">
                  <TabsTrigger 
                    value="login" 
                    className="text-muted-foreground data-[state=active]:bg-terminal-glow data-[state=active]:text-white"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="register" 
                    className="text-muted-foreground data-[state=active]:bg-terminal-glow data-[state=active]:text-white"
                  >
                    Register
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-foreground">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        placeholder="Enter your email"
                        className="terminal-input"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-foreground">Password</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          placeholder="Enter your password"
                          className="terminal-input pr-10"
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
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Button
                        type="submit"
                        className="w-full btn-terminal-primary"
                        disabled={isLoading || !loginData.email || !loginData.password}
                      >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-terminal-border text-foreground hover:bg-terminal-card"
                        onClick={handleMagicLinkLogin}
                        disabled={isLoading || !loginData.email}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Send Magic Link
                      </Button>
                    </div>
                  </form>

                  {/* Demo Login Section */}
                  <div className="pt-4 border-t border-terminal-border">
                    <p className="text-sm text-muted-foreground text-center mb-3">
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
                            className="border-terminal-border text-muted-foreground hover:bg-terminal-card hover:text-foreground text-xs"
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
                      <Label htmlFor="register-name" className="text-foreground">Full Name</Label>
                      <Input
                        id="register-name"
                        type="text"
                        value={registerData.fullName}
                        onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                        placeholder="Enter your full name"
                        className="terminal-input"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-foreground">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        placeholder="Enter your email"
                        className="terminal-input"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-foreground">Company (Optional)</Label>
                      <Input
                        id="company"
                        type="text"
                        value={registerData.companyName}
                        onChange={(e) => setRegisterData({ ...registerData, companyName: e.target.value })}
                        placeholder="Enter your company name"
                        className="terminal-input"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-foreground">Role</Label>
                      <Select 
                        value={registerData.role} 
                        onValueChange={(value: 'broker' | 'operator' | 'pilot' | 'crew') => 
                          setRegisterData({ ...registerData, role: value })
                        }
                      >
                        <SelectTrigger className="terminal-input">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent className="bg-terminal-card border-terminal-border">
                          <SelectItem value="broker" className="text-foreground">
                            <div className="flex items-center">
                              <Briefcase className="mr-2 h-4 w-4" />
                              Charter Broker
                            </div>
                          </SelectItem>
                          <SelectItem value="operator" className="text-foreground">
                            <div className="flex items-center">
                              <Building className="mr-2 h-4 w-4" />
                              Aircraft Operator
                            </div>
                          </SelectItem>
                          <SelectItem value="pilot" className="text-foreground">
                            <div className="flex items-center">
                              <Plane className="mr-2 h-4 w-4" />
                              Pilot
                            </div>
                          </SelectItem>
                          <SelectItem value="crew" className="text-foreground">
                            <div className="flex items-center">
                              <Users className="mr-2 h-4 w-4" />
                              Cabin Crew
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-foreground">Password</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          placeholder="Minimum 8 characters with letters and numbers"
                          className="terminal-input pr-10"
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
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-foreground">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        placeholder="Confirm your password"
                        className="terminal-input"
                        required
                      />
                    </div>
                    
                    {registerData.password && registerData.password !== registerData.confirmPassword && (
                      <Alert className="border-terminal-danger bg-terminal-danger/10">
                        <AlertDescription className="text-terminal-danger">
                          Passwords do not match
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {registerData.password && (registerData.password.length < 8 || 
                      !/[a-zA-Z]/.test(registerData.password) || 
                      !/[0-9]/.test(registerData.password)) && (
                      <Alert className="border-terminal-warning bg-terminal-warning/10">
                        <AlertDescription className="text-terminal-warning">
                          Password must be at least 8 characters with letters and numbers
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="w-full btn-terminal-primary"
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