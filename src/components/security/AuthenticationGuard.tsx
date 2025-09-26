// Authentication Guard Component - Industry Standard Implementation
// FCA Compliant Aviation Platform

import React, { useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { securityService } from '@/lib/security-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  Key,
  User,
  Mail
} from 'lucide-react';

interface AuthenticationGuardProps {
  children: ReactNode;
  requiredRole?: string;
  requireMFA?: boolean;
  fallback?: ReactNode;
}

interface LoginAttempt {
  identifier: string;
  count: number;
  lastAttempt: Date;
  locked: boolean;
}

export const AuthenticationGuard: React.FC<AuthenticationGuardProps> = ({
  children,
  requiredRole,
  requireMFA = false,
  fallback
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    mfaCode: ''
  });
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isMFARequired, setIsMFARequired] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [rateLimitReset, setRateLimitReset] = useState<Date | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuthentication();
    const interval = setInterval(checkAuthentication, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkAuthentication = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Validate session with security service
        if (sessionId) {
          const sessionValid = securityService.validateSession(sessionId);
          if (!sessionValid.valid) {
            handleLogout();
            return;
          }
        }

        // Check role requirements
        if (requiredRole && session.user.user_metadata?.role !== requiredRole) {
          setLoginError(`Access denied. Required role: ${requiredRole}`);
          setShowLogin(true);
          return;
        }

        // Check MFA requirements
        if (requireMFA && !session.user.user_metadata?.mfaVerified) {
          setIsMFARequired(true);
          setShowLogin(true);
          return;
        }

        setUser(session.user);
        setIsAuthenticated(true);
        setShowLogin(false);
        setLoginError('');
      } else {
        setIsAuthenticated(false);
        setShowLogin(true);
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      setIsAuthenticated(false);
      setShowLogin(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Check rate limiting
    if (!securityService.checkRateLimit(loginForm.email, 5, 15 * 60 * 1000)) {
      setRateLimited(true);
      setRateLimitReset(new Date(Date.now() + 15 * 60 * 1000));
      return;
    }

    // Check login attempts
    const attemptCheck = securityService.checkLoginAttempts(loginForm.email);
    if (!attemptCheck.allowed) {
      setLoginError(`Too many failed attempts. Try again in ${Math.ceil((attemptCheck.lockoutTime!.getTime() - Date.now()) / 60000)} minutes.`);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password
      });

      if (error) {
        securityService.recordLoginAttempt(loginForm.email, false);
        setLoginError(error.message);
        return;
      }

      if (data.user) {
        // Create session with security service
        const newSessionId = securityService.createSession(data.user.id, 'unknown');
        setSessionId(newSessionId);

        // Check MFA
        if (requireMFA && !data.user.user_metadata?.mfaVerified) {
          setIsMFARequired(true);
          return;
        }

        securityService.recordLoginAttempt(loginForm.email, true);
        setUser(data.user);
        setIsAuthenticated(true);
        setShowLogin(false);
        setLoginError('');
        setLoginForm({ email: '', password: '', mfaCode: '' });
      }
    } catch (error) {
      console.error('Login failed:', error);
      securityService.recordLoginAttempt(loginForm.email, false);
      setLoginError('Login failed. Please try again.');
    }
  };

  const handleMFAVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real implementation, this would verify the MFA code
      const { error } = await supabase.auth.verifyOtp({
        token: loginForm.mfaCode,
        type: 'totp'
      });

      if (error) {
        setLoginError('Invalid MFA code');
        return;
      }

      setIsMFARequired(false);
      setIsAuthenticated(true);
      setShowLogin(false);
      setLoginError('');
    } catch (error) {
      console.error('MFA verification failed:', error);
      setLoginError('MFA verification failed');
    }
  };

  const handleLogout = async () => {
    try {
      if (sessionId) {
        securityService.destroySession(sessionId);
        setSessionId(null);
      }

      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      setShowLogin(true);
      setLoginForm({ email: '', password: '', mfaCode: '' });
      setLoginError('');
      setIsMFARequired(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(loginForm.email);
      if (error) {
        setLoginError('Password reset failed');
      } else {
        setLoginError('Password reset email sent');
      }
    } catch (error) {
      console.error('Password reset failed:', error);
      setLoginError('Password reset failed');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Verifying authentication...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated || showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle>Secure Access Required</CardTitle>
            <p className="text-sm text-gray-600">
              {requiredRole ? `Access restricted to ${requiredRole} users` : 'Please sign in to continue'}
            </p>
          </CardHeader>
          <CardContent>
            {rateLimited ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Too many login attempts. Please try again in {Math.ceil((rateLimitReset!.getTime() - Date.now()) / 60000)} minutes.
                </AlertDescription>
              </Alert>
            ) : isMFARequired ? (
              <form onSubmit={handleMFAVerification} className="space-y-4">
                <div>
                  <Label htmlFor="mfa-code">MFA Code</Label>
                  <Input
                    id="mfa-code"
                    type="text"
                    value={loginForm.mfaCode}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, mfaCode: e.target.value }))}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Key className="h-4 w-4 mr-2" />
                  Verify MFA Code
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsMFARequired(false)}
                  className="w-full"
                >
                  Back to Login
                </Button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {loginError && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full">
                  <Lock className="h-4 w-4 mr-2" />
                  Sign In
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePasswordReset}
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Reset Password
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
