import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Loader2, Shield } from 'lucide-react';

const QuickAdminSetup = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const createAdminAccounts = async () => {
    setIsCreating(true);
    setStatus('idle');
    setMessage('Creating admin accounts...');

    try {
      // Create the main admin account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'admin@stratusconnect.org',
        password: 'Str4tu$C0nn3ct_M4st3r_4dm1n_2025!#$',
        options: {
          data: {
            full_name: 'StratusConnect System Administrator',
            role: 'admin'
          }
        }
      });

      if (authError) {
        throw authError;
      }

      // Create additional admin accounts
      const additionalAccounts = [
        {
          email: 'stratuscharters@gmail.com',
          password: 'Str4tu$Ch4rt3r$_0wn3r_S3cur3_2025!@#$%',
          full_name: 'Stratus Charters Owner',
          role: 'admin'
        },
        {
          email: 'lordbroctree1@gmail.com',
          password: 'L0rd_Br0ctr33_4dm1n_M4st3r_2025!@#$%^&',
          full_name: 'Lord Broctree Administrator',
          role: 'admin'
        }
      ];

      for (const account of additionalAccounts) {
        await supabase.auth.signUp({
          email: account.email,
          password: account.password,
          options: {
            data: {
              full_name: account.full_name,
              role: account.role
            }
          }
        });
      }

      setStatus('success');
      setMessage('Admin accounts created successfully! You can now log in.');
    } catch (error: any) {
      console.error('Error creating admin accounts:', error);
      setStatus('error');
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Quick Admin Setup</CardTitle>
          <p className="text-slate-400">Create admin accounts for StratusConnect</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Accounts to be created:</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• admin@stratusconnect.org (Main Admin)</li>
              <li>• stratuscharters@gmail.com (Owner)</li>
              <li>• lordbroctree1@gmail.com (Admin)</li>
            </ul>
          </div>

          {status === 'idle' && (
            <Button
              onClick={createAdminAccounts}
              disabled={isCreating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Accounts...
                </>
              ) : (
                'Create Admin Accounts'
              )}
            </Button>
          )}

          {status === 'success' && (
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>{message}</span>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center space-x-2 text-red-400">
              <XCircle className="w-5 h-5" />
              <span className="text-sm">{message}</span>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Login credentials:</p>
              <div className="bg-slate-700/50 rounded p-3 text-xs text-slate-300 space-y-1">
                <div><strong>Email:</strong> admin@stratusconnect.org</div>
                <div><strong>Password:</strong> Str4tu$C0nn3ct_M4st3r_4dm1n_2025!#$</div>
              </div>
              <Button
                onClick={() => window.location.href = '/enter'}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Go to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickAdminSetup;
