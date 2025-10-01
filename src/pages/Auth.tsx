import { NavigationArrows } from '@/components/NavigationArrows';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Briefcase, Building, Eye, EyeOff, Loader2, Plane, Users } from 'lucide-react';
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Auth() {
  const { user, loading, login, loginWithMagicLink, loginWithGoogle, register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Multi-step flow state
  const [currentStep, setCurrentStep] = useState<'email' | 'verification' | 'signup'>('email');
  const [userEmail, setUserEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [registerData, setRegisterData] = useState({
    fullName: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    role: '',
  });

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        
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
          onClick={() => navigate('/')}
        >
          STRATUSCONNECT
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-terminal-glow" />
            <span className="text-white" style={{ textShadow: '0 0 8px rgba(255, 255, 255, 0.7), 0 0 12px rgba(255, 255, 255, 0.5)' }}>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    // Redirect authenticated users to their respective terminals
    switch (user.role) {
      case 'broker':
        return <Navigate to="/broker-terminal" replace />;
      case 'operator':
        return <Navigate to="/operator-terminal" replace />;
      case 'pilot':
        return <Navigate to="/pilot-terminal" replace />;
      case 'crew':
        return <Navigate to="/crew-terminal" replace />;
      default:
        return <Navigate to="/home" replace />;
    }
  }

  // Step 1: Email Collection
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) return;

    setIsLoading(true);
    setError(null);
    
    try {
      // Send magic link to email
      const result = await loginWithMagicLink(userEmail);
      if (!result) {
        setError('Failed to send verification email.');
      } else {
        setCurrentStep('verification');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
    setIsLoading(false);
    }
  };

  // Step 2: Email Verification
  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // For demo purposes, accept any 6-digit code
      if (verificationCode.length === 6) {
        setIsEmailVerified(true);
        setCurrentStep('signup');
      } else {
        setError('Please enter a valid 6-digit verification code.');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid verification code.');
    } finally {
    setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await loginWithMagicLink(userEmail);
      if (!result) {
        setError('Failed to resend verification email.');
      } else {
        setError(null);
        alert('Verification email sent!');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend email.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Complete Signup
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
    const result = await register({
        email: userEmail,
      password: registerData.password,
      fullName: registerData.fullName,
        companyName: registerData.companyName,
        role: registerData.role as 'broker' | 'operator' | 'pilot' | 'crew'
      });

      if (!result) {
        setError('Registration failed. Please try again.');
      } else {
        // Registration successful - user will be redirected by AuthContext
        alert('Account created successfully!');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during registration.');
    } finally {
    setIsLoading(false);
    }
  };


  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
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

      {/* STRATUSCONNECT Logo - Top Left */}
      <div 
        className="absolute top-8 left-8 text-white text-lg font-bold bg-black px-6 py-3 rounded backdrop-blur-sm z-20 cursor-pointer hover:bg-gray-800 transition-colors"
        style={{
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
        onClick={() => navigate('/')}
      >
        STRATUSCONNECT
        </div>

      {/* Navigation Arrows - Top Right */}
      <div className="absolute top-8 right-8 z-20">
          <NavigationArrows />
        </div>

      <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-black/70 backdrop-blur-md rounded-lg shadow-2xl border border-white/20"
        style={{
          boxShadow: '0 0 40px rgba(255, 140, 0, 0.3), 0 0 80px rgba(255, 140, 0, 0.1), 0 25px 50px rgba(0, 0, 0, 0.5)',
        }}
      >
        {error && (
          <Alert className="border-red-500 bg-red-500/10 text-red-400">
            <AlertDescription>
              {error}
              </AlertDescription>
            </Alert>
          )}

        {/* Step 1: Email Collection */}
        {currentStep === 'email' && (
          <>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-white">Sign Up</h1>
              <p className="text-white/80 text-sm" style={{ textShadow: '0 0 4px rgba(255, 255, 255, 0.5)' }}>Choose your preferred way to join our aviation community</p>
              </div>

            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full bg-white text-black border-gray-300 hover:bg-white hover:text-black hover:border-gray-400 transition-colors duration-200" 
                style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)' }}
                onClick={loginWithGoogle}
                disabled={isLoading}
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 mr-2" />
                Continue with Google
              </Button>
              </div>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="flex-shrink mx-4 text-gray-400" style={{ textShadow: '0 0 4px rgba(255, 255, 255, 0.3)' }}>OR</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="space-y-2">
                <Label htmlFor="email" className="text-white" style={{ textShadow: '0 0 4px rgba(255, 255, 255, 0.5)' }}>Email address</Label>
                      <Input
                id="email"
                        type="email"
                placeholder="Enter your email address"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                        required
                className="bg-white text-black border-gray-300 focus:border-blue-500"
                      />
                    </div>
                    
              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white"
                style={{
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
                disabled={isLoading || !userEmail}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Continue
              </Button>
            </form>
          </>
        )}

        {/* Step 2: Email Verification */}
        {currentStep === 'verification' && (
          <>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-white">Check your inbox</h1>
              <p className="text-white/80 text-sm" style={{ textShadow: '0 0 4px rgba(255, 255, 255, 0.5)' }}>
                Enter the verification code we just sent to <span className="font-semibold text-white">{userEmail}</span>
              </p>
            </div>

            <form onSubmit={handleVerificationSubmit} className="space-y-4">
                    <div className="space-y-2">
                <Label htmlFor="code" className="text-white" style={{ textShadow: '0 0 4px rgba(255, 255, 255, 0.5)' }}>Code</Label>
                        <Input
                id="code"
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          required
                className="bg-white text-black border-gray-300 focus:border-blue-500 text-center text-2xl tracking-widest"
                maxLength={6}
              />
                    </div>
                    
                      <Button
                        type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white"
                style={{
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Continue
                      </Button>
                  </form>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendEmail}
                            disabled={isLoading}
                className="text-white/80 hover:text-white text-sm underline"
                style={{ textShadow: '0 0 4px rgba(255, 255, 255, 0.3)' }}
              >
                Resend email
              </button>
                    </div>
          </>
        )}

        {/* Step 3: Complete Signup */}
        {currentStep === 'signup' && (
          <>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-white">Complete your account</h1>
              <p className="text-white/80 text-sm" style={{ textShadow: '0 0 4px rgba(255, 255, 255, 0.5)' }}>
                Finish setting up your STRATUSCONNECT account
              </p>
                  </div>
                
            <form onSubmit={handleSignupSubmit} className="space-y-4">
                    <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white" style={{ textShadow: '0 0 4px rgba(255, 255, 255, 0.5)' }}>Full Name</Label>
                      <Input
                  id="fullName"
                        type="text"
                  placeholder="Enter your full name"
                        value={registerData.fullName}
                        onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                        required
                  className="bg-white text-black border-gray-300 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                <Label htmlFor="companyName" className="text-white" style={{ textShadow: '0 0 4px rgba(255, 255, 255, 0.5)' }}>Company Name (Optional)</Label>
                      <Input
                  id="companyName"
                        type="text"
                  placeholder="Enter your company name"
                        value={registerData.companyName}
                        onChange={(e) => setRegisterData({ ...registerData, companyName: e.target.value })}
                  className="bg-white text-black border-gray-300 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                <Label htmlFor="role" className="text-white" style={{ textShadow: '0 0 4px rgba(255, 255, 255, 0.5)' }}>Role</Label>
                <Select value={registerData.role} onValueChange={(value) => setRegisterData({ ...registerData, role: value })} required>
                  <SelectTrigger className="w-full bg-white text-black border-gray-300 focus:border-blue-500">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    <SelectItem value="broker"><Briefcase className="inline-block w-4 h-4 mr-2" />Broker</SelectItem>
                    <SelectItem value="operator"><Building className="inline-block w-4 h-4 mr-2" />Operator</SelectItem>
                    <SelectItem value="pilot"><Plane className="inline-block w-4 h-4 mr-2" />Pilot</SelectItem>
                    <SelectItem value="crew"><Users className="inline-block w-4 h-4 mr-2" />Crew</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                <Label htmlFor="password" className="text-white" style={{ textShadow: '0 0 4px rgba(255, 255, 255, 0.5)' }}>Password</Label>
                      <div className="relative">
                        <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          required
                    className="w-full bg-white text-black border-gray-300 focus:border-blue-500 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-600 hover:bg-transparent"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white" style={{ textShadow: '0 0 4px rgba(255, 255, 255, 0.5)' }}>Confirm Password</Label>
                <div className="relative">
                      <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        required
                    className="w-full bg-white text-black border-gray-300 focus:border-blue-500 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-600 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                    </div>

                    <Button
                      type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white"
                style={{
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
                disabled={isLoading || !registerData.fullName || !registerData.role || !registerData.password || registerData.password !== registerData.confirmPassword}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Create Account
                    </Button>
                  </form>
          </>
        )}


        <div className="text-center text-sm text-white/60 mt-6" style={{ textShadow: '0 0 4px rgba(255, 255, 255, 0.2)' }}>
          <a href="/terms" className="hover:underline">Terms of Use</a> | <a href="/privacy" className="hover:underline">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}