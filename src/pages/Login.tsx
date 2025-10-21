// Login Page for Returning Users
// Simple email input with magic link sending

import { ReCaptchaComponent } from '@/components/ReCaptcha';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, CheckCircle, Mail, Plane } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const handleSendMagicLink = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!recaptchaToken) {
      setError('Please complete the security verification');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          shouldCreateUser: false, // Only allow existing users to login
        }
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
    } catch (err: any) {
      if (err.message.includes('Signups not allowed for otp')) {
        setError('OTP signups are disabled. Please enable "Enable email confirmations" in Supabase Dashboard → Authentication → Settings → Auth Providers → Email');
      } else if (err.message.includes('User not found')) {
        setError('No account found with this email. Please sign up first.');
      } else if (err.message.includes('rate limit')) {
        setError('Too many requests. Please wait a few minutes before trying again.');
      } else {
        setError(`Failed to send magic link: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cinematic Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139, 69, 19, 0.9) 0%, rgba(91, 30, 13, 0.95) 25%, rgba(59, 30, 13, 0.98) 50%, rgba(20, 20, 20, 0.99) 75%, rgba(10, 10, 12, 1) 100%), linear-gradient(135deg, #3b1e0d 0%, #2d1a0a 25%, #1a0f08 50%, #0f0a06 75%, #0a0a0c 100%)',
        }}
      />
      
      {/* Cinematic Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at center, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0.3) 80%, rgba(0, 0, 0, 0.6) 100%)',
        }}
      />
      
      {/* Subtle golden-orange glow */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at center, rgba(255, 140, 0, 0.08) 0%, rgba(255, 140, 0, 0.04) 30%, transparent 60%)',
        }}
      />

      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-orange-500/20 px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <div 
              className="text-white text-lg font-bold bg-black/50 px-6 py-3 rounded backdrop-blur-sm cursor-pointer hover:bg-black/70 transition-colors"
              onClick={() => navigate('/')}
            >
              STRATUSCONNECT
            </div>
            <div className="flex items-center space-x-3">
              <Plane className="w-8 h-8 text-orange-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
                <p className="text-orange-300/80">Sign in to your account</p>
              </div>
            </div>
          </div>
          <Button
            onClick={() => navigate('/role-selection')}
            variant="outline"
            className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Account
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-md mx-auto px-6 py-12">
        <Card className="bg-slate-800/50 border-slate-700 border-2 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
              <Plane className="w-8 h-8 text-orange-400" />
            </div>
            <CardTitle className="text-2xl text-orange-300">
              Sign In
            </CardTitle>
            <CardDescription className="text-orange-200/80">
              Enter your email address and we'll send you a secure login link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!success ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !isLoading && recaptchaToken) {
                        handleSendMagicLink();
                      }
                    }}
                  />
                </div>

                {/* reCAPTCHA */}
                <div className="flex justify-center">
                  <ReCaptchaComponent
                    onVerify={setRecaptchaToken}
                    onExpire={() => setRecaptchaToken(null)}
                    theme="dark"
                  />
                </div>

                {/* Send Magic Link Button */}
                <Button
                  onClick={handleSendMagicLink}
                  disabled={isLoading || !recaptchaToken || !email.trim()}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Magic Link
                    </>
                  )}
                </Button>

                {/* Security Notice */}
                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-orange-300 mb-2">Security Notice</h4>
                  <ul className="text-xs text-orange-200/80 space-y-1">
                    <li>• Magic links expire in 10 minutes</li>
                    <li>• Links can only be used once</li>
                    <li>• Check your spam folder if you don't receive the email</li>
                    <li>• Never share your magic link with others</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                {/* Email Sent Confirmation */}
                <div className="text-center space-y-6">
                  <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-green-400 mb-2">
                      Check Your Email
                    </h3>
                    <p className="text-orange-200/80 mb-2">
                      We've sent a secure magic link to:
                    </p>
                    <p className="text-white font-medium">{email}</p>
                    <p className="text-sm text-orange-300/60 mt-4">
                      Click the link in your email to sign in. The link will expire in 10 minutes.
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => {
                      setSuccess(false);
                      setEmail('');
                      setRecaptchaToken(null);
                    }}
                    variant="outline"
                    className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10"
                  >
                    Send Another Link
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Additional Options */}
        <div className="text-center mt-8">
          <p className="text-orange-200/80 mb-4">
            Don't have an account yet?
          </p>
          <Button
            onClick={() => navigate('/role-selection')}
            variant="outline"
            className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10"
          >
            Create New Account
          </Button>
        </div>
      </main>
    </div>
  );
}
