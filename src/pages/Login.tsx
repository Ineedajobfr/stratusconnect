import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { NavigationArrows } from '@/components/NavigationArrows';
import { StratusConnectLogo } from '@/components/StratusConnectLogo';
import { Loader2, Shield, Eye, EyeOff, Copy, CheckCircle } from 'lucide-react';

export default function Login() {
  const { user, loading, login, register } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<any>(null);
  const [copied, setCopied] = useState({ username: false, accessCode: false });

  // Login form state
  const [loginData, setLoginData] = useState({
    emailOrUsername: '',
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

  // Redirect if already authenticated
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (user) {
    // Redirect based on user role and verification status
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
    
    return <Navigate to={roleRoutes[user.role]} replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.emailOrUsername || !loginData.password) return;

    setIsLoading(true);
    await login(loginData.emailOrUsername, loginData.password);
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      return;
    }

    if (registerData.password.length < 12 || 
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
      setRegistrationResult(result);
      setActiveTab('success');
    }
    
    setIsLoading(false);
  };

  const copyToClipboard = async (text: string, type: 'username' | 'accessCode') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied({ ...copied, [type]: true });
      setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (registrationResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/90 border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-foreground">Registration Complete!</CardTitle>
            <CardDescription className="text-muted-foreground">
              Save these credentials - they won't be shown again
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-green-200 bg-slate-800 dark:border-green-800 dark:bg-green-950">
              <Shield className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Your account is pending admin approval. You'll be notified when approved.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Username</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input 
                    value={registrationResult.username} 
                    readOnly 
                    className="bg-muted font-mono" 
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(registrationResult.username, 'username')}
                  >
                    {copied.username ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Access Code</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input 
                    value={registrationResult.accessCode} 
                    readOnly 
                    className="bg-muted font-mono" 
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(registrationResult.accessCode, 'accessCode')}
                  >
                    {copied.accessCode ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Keep this secure - it's for account recovery only
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">Email</Label>
                <Input 
                  value={registrationResult.user.email} 
                  readOnly 
                  className="bg-muted mt-1" 
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Role</Label>
                <Badge variant="secondary" className="mt-1 capitalize">
                  {registrationResult.user.role}
                </Badge>
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={() => {
                setRegistrationResult(null);
                setActiveTab('login');
              }}
            >
              Continue to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background flex items-center justify-center p-4">
      <div className="absolute top-6 left-6">
        <StratusConnectLogo />
      </div>
      <div className="absolute top-4 right-4">
        <NavigationArrows />
      </div>
      <Card className="w-full max-w-md bg-card/90 border-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="text-2xl text-foreground">StratusConnect</CardTitle>
          <CardDescription className="text-muted-foreground">
            Access the aviation marketplace platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger 
                value="login" 
                className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Register
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-foreground">Email or Username</Label>
                  <Input
                    id="login-email"
                    type="text"
                    value={loginData.emailOrUsername}
                    onChange={(e) => setLoginData({ ...loginData, emailOrUsername: e.target.value })}
                    placeholder="Enter your email or username"
                    className="bg-input border-border text-foreground"
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
                      className="bg-input border-border text-foreground pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !loginData.emailOrUsername || !loginData.password}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Login
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-foreground">Full Name</Label>
                  <Input
                    id="register-name"
                    type="text"
                    value={registerData.fullName}
                    onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="bg-input border-border text-foreground"
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
                    className="bg-input border-border text-foreground"
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
                    className="bg-input border-border text-foreground"
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
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="broker" className="text-foreground">Broker</SelectItem>
                      <SelectItem value="operator" className="text-foreground">Operator</SelectItem>
                      <SelectItem value="pilot" className="text-foreground">Pilot</SelectItem>
                      <SelectItem value="crew" className="text-foreground">Cabin Crew</SelectItem>
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
                      placeholder="Minimum 12 characters with letters and numbers"
                      className="bg-input border-border text-foreground pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
                    className="bg-input border-border text-foreground"
                    required
                  />
                </div>
                
                {registerData.password && registerData.password !== registerData.confirmPassword && (
                  <Alert className="border-red-200 bg-slate-800 dark:border-red-800 dark:bg-red-950">
                    <AlertDescription className="text-red-800 dark:text-red-200">
                      Passwords do not match
                    </AlertDescription>
                  </Alert>
                )}
                
                {registerData.password && (registerData.password.length < 12 || 
                  !/[a-zA-Z]/.test(registerData.password) || 
                  !/[0-9]/.test(registerData.password)) && (
                  <Alert className="border-yellow-200 bg-slate-800 dark:border-yellow-800 dark:bg-yellow-950">
                    <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                      Password must be at least 12 characters with letters and numbers
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isLoading || 
                    !registerData.email || 
                    !registerData.password || 
                    !registerData.fullName || 
                    registerData.password !== registerData.confirmPassword ||
                    registerData.password.length < 12 ||
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
  );
}