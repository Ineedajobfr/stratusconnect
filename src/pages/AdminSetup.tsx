import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Shield, Building2, Plane, UserCheck, Users } from 'lucide-react';

const adminAccounts = [
  {
    email: 'broker@stratusconnect.org',
    password: 'Bk7!mP9$qX2vL',
    fullName: 'Broker Admin Access',
    role: 'broker'
  },
  {
    email: 'operator@stratusconnect.org',
    password: 'Op3#nW8&zR5kM',
    fullName: 'Operator Admin Access',
    role: 'operator'
  },
  {
    email: 'pilot@stratusconnect.org',
    password: 'Pl6#tF2&vB9xK',
    fullName: 'Pilot Admin Access',
    role: 'pilot'
  },
  {
    email: 'crew@stratusconnect.org',
    password: 'Cr9!uE4$tY7nQ',
    fullName: 'Crew Admin Access',
    role: 'crew'
  }
];

export default function AdminSetup() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, 'pending' | 'success' | 'error'>>({});
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const createAdminAccount = async (account: typeof adminAccounts[0]) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: account.email,
        password: account.password,
        options: {
          data: {
            full_name: account.fullName,
            role: account.role,
            verification_status: 'approved'
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          // User exists, update their role
          const { data: { user } } = await supabase.auth.signInWithPassword({
            email: account.email,
            password: account.password
          });
          
          if (user) {
            // Update user metadata
            await supabase.auth.updateUser({
              data: {
                full_name: account.fullName,
                role: account.role,
                verification_status: 'approved'
              }
            });
          }
          
          return { success: true, message: 'Account updated successfully' };
        }
        throw error;
      }

      return { success: true, message: 'Account created successfully' };
    } catch (error: unknown) {
      return { success: false, message: (error as Error).message };
    }
  };

  const setupAllAccounts = async () => {
    setLoading(true);
    setResults({});

    for (const account of adminAccounts) {
      setResults(prev => ({ ...prev, [account.email]: 'pending' }));
      
      const result = await createAdminAccount(account);
      
      setResults(prev => ({ 
        ...prev, 
        [account.email]: result.success ? 'success' : 'error' 
      }));

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setLoading(false);
    toast({
      title: "Admin Setup Complete",
      description: "All admin accounts have been processed. Check the results below.",
    });
  };

  const handleAdminLogin = async (account: typeof adminAccounts[0]) => {
    try {
      const success = await login(account.email, account.password);
      if (success) {
        const roleRoutes = {
          admin: '/terminal/admin',
          broker: '/terminal/broker',
          operator: '/terminal/operator',
          pilot: '/terminal/pilot',
          crew: '/terminal/crew'
        };
        navigate(roleRoutes[account.role as keyof typeof roleRoutes]);
        toast({
          title: "Login Successful",
          description: `Logged in as ${account.fullName}`,
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials or account not found",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      toast({
        title: "Login Error",
        description: (error as Error).message || "Failed to login",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-slate-800/50 border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
              Admin Account Setup
            </CardTitle>
            <p className="text-slate-300">
              Create all admin accounts for StratusConnect platform access
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button 
              onClick={setupAllAccounts}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Setting up accounts...
                </>
              ) : (
                'Setup All Admin Accounts'
              )}
            </Button>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Admin Access:</h3>
              {adminAccounts.map((account) => {
                const roleIcons = {
                  admin: Shield,
                  broker: Building2,
                  operator: Plane,
                  pilot: UserCheck,
                  crew: Users
                };
                const Icon = roleIcons[account.role as keyof typeof roleIcons];
                
                return (
                  <div 
                    key={account.email}
                    className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{account.fullName}</div>
                        <div className="text-sm text-slate-300">{account.email}</div>
                        <div className="text-xs text-slate-400">Role: {account.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(results[account.email] || '')}
                        <span className="text-sm text-slate-300">
                          {results[account.email] === 'success' && 'Ready'}
                          {results[account.email] === 'error' && 'Error'}
                          {results[account.email] === 'pending' && 'Processing...'}
                          {!results[account.email] && 'Not started'}
                        </span>
                      </div>
                      {results[account.email] === 'success' && (
                        <Button
                          onClick={() => handleAdminLogin(account)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Access Terminal
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-4 bg-slate-700/30 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Login Credentials:</h4>
              <div className="space-y-2 text-sm font-mono">
                {adminAccounts.map((account) => (
                  <div key={account.email} className="text-slate-300">
                    <span className="text-blue-400">{account.role.toUpperCase()}:</span> {account.email} / {account.password}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
