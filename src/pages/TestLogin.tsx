import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function TestLogin() {
  const [email, setEmail] = useState('stratuscharters@gmail.com');
  const [password, setPassword] = useState('Str4tu$C0nn3ct_M4st3r_4dm1n_2025!#$');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testLogin = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('Testing login with:', { email, password });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      console.log('Login result:', { data, error });
      
      if (error) {
        setResult({
          success: false,
          error: error.message,
          details: error
        });
      } else {
        setResult({
          success: true,
          user: data.user,
          session: data.session
        });
      }
    } catch (err) {
      console.error('Test login error:', err);
      setResult({
        success: false,
        error: 'Unexpected error',
        details: err
      });
    } finally {
      setLoading(false);
    }
  };

  const testUserExists = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      // Check if user exists in auth.users
      const { data: authData, error: authError } = await supabase
        .from('auth.users')
        .select('*')
        .eq('email', email)
        .single();

      console.log('Auth user check:', { authData, authError });

      // Check if user exists in public.users
      const { data: publicData, error: publicError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      console.log('Public user check:', { publicData, publicError });

      setResult({
        success: true,
        authUser: authData,
        publicUser: publicData,
        authError,
        publicError
      });
    } catch (err) {
      console.error('User check error:', err);
      setResult({
        success: false,
        error: 'Failed to check user existence',
        details: err
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-black/80 backdrop-blur-sm border-slate-700/30">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white text-center">
              Admin Login Debug
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={testLogin}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Testing...' : 'Test Login'}
              </Button>
              
              <Button
                onClick={testUserExists}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Checking...' : 'Check User Exists'}
              </Button>
            </div>

            {result && (
              <div className="mt-6">
                <div className={`p-4 rounded-lg ${
                  result.success ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'
                }`}>
                  <div className="flex items-start space-x-3">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4 className={`font-medium mb-2 ${
                        result.success ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {result.success ? 'Success' : 'Error'}
                      </h4>
                      <pre className="text-xs text-slate-300 overflow-auto max-h-96 bg-slate-900/50 p-3 rounded">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
