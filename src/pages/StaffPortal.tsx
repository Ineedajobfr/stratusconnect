import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Lock, Shield } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StaffPortal() {
  const [email, setEmail] = useState('stratuscharters@gmail.com');
  const [password, setPassword] = useState('Str4tu$C0nn3ct_M4st3r_4dm1n_2025!#$');
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

    // Validate admin email - allow both admin emails
            const adminEmail = email.trim().toLowerCase();
            const authorizedEmails = [
              'admin@stratusconnect.com', 
              'stratuscharters@gmail.com',
              'stratuscharters@gmail.com'  // Handle any case variations
            ];
            
            if (!authorizedEmails.includes(adminEmail)) {
              setMessage('This email is not authorized for staff access');
              setMessageType('error');
              return;
            }

    try {
      setLoading(true);
      setMessage('');
      
      console.log('Logging in admin:', adminEmail);
      
      // SECURE ADMIN AUTHENTICATION - PASSWORD REQUIRED
      console.log('🔐 SECURE ADMIN AUTHENTICATION CHECK');
      
      // Check if this is the correct admin email and password
      if (adminEmail === 'stratuscharters@gmail.com' && password.trim() === 'Str4tu$C0nn3ct_M4st3r_4dm1n_2025!#$') {
        console.log('✅ ADMIN CREDENTIALS VERIFIED');
        
        // Create secure admin session
        const adminUser = {
          id: 'secure-admin-' + Date.now(),
          email: adminEmail,
          role: 'admin',
          first_name: 'Stratus',
          last_name: 'Admin',
          verification_status: 'approved',
          fullName: 'Stratus Admin',
          createdAt: new Date().toISOString(),
          isSecureAuth: true
        };

        // Store admin session
        localStorage.setItem('admin_session', JSON.stringify(adminUser));
        localStorage.setItem('secure_admin_auth', 'true');
        
        console.log('🚀 SECURE ADMIN ACCESS GRANTED');
        
        setMessage('Login successful! Redirecting...');
        setMessageType('success');
        
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
        return;
      }
      
      // Invalid credentials
      console.log('❌ INVALID ADMIN CREDENTIALS');
      setMessage('Invalid email or password. Please check your credentials.');
      setMessageType('error');
      return;

    } catch (err) {
      console.error('Unexpected error:', err);
      setMessage('An unexpected error occurred. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Button */}
        <button
          onClick={() => {
            // Check if user is authenticated to determine where to navigate
            const isAuthenticated = localStorage.getItem('testUser') || document.cookie.includes('supabase');
            if (isAuthenticated) {
              navigate('/home');
            } else {
              navigate('/');
            }
          }}
          className="flex items-center space-x-2 text-slate-400 hover:text-orange-400 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </button>

        <Card className="bg-black/80 backdrop-blur-sm border-slate-700/30">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-orange-500/10 rounded-full">
                <Shield className="h-8 w-8 text-orange-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Staff Portal
            </CardTitle>
            <CardDescription className="text-slate-400">
              Authorized personnel only
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
                  required
                />
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
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}