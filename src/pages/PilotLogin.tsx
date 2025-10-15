import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Lock, Mail, User } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PilotLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setMessage('Please enter both email and password');
      setMessageType('error');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setMessage('Invalid email or password. Please check your credentials.');
          setMessageType('error');
          return;
        }
        
        setMessage(`Login failed: ${error.message}`);
        setMessageType('error');
        return;
      }

      // Success - redirect to pilot terminal
      setMessage('Login successful! Redirecting...');
      setMessageType('success');
      
      setTimeout(() => {
        navigate('/pilot-terminal');
      }, 1000);
      
    } catch (err) {
      console.error('Login error:', err);
      setMessage('An unexpected error occurred. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-slate-400 hover:text-orange-400 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </button>

        <Card className="bg-black/80 backdrop-blur-sm border-slate-700/30">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-full">
                <User className="h-8 w-8 text-emerald-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Pilot Login
            </CardTitle>
            <CardDescription className="text-slate-400">
              Access your pilot terminal
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pilot@example.com"
                    className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 pl-10"
                    required
                  />
                </div>
              </div>

              {message && (
                <Alert className={messageType === 'error' ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10'}>
                  <AlertDescription className={messageType === 'error' ? 'text-red-400' : 'text-green-400'}>
                    {message}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/signup-form?role=pilot')}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Sign up as a Pilot
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}