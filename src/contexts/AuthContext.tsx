import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'broker' | 'operator' | 'pilot' | 'crew' | 'admin';
  verificationStatus: 'pending' | 'approved' | 'rejected';
  companyName?: string;
  username?: string;
  avatarUrl?: string;
  isDemoUser?: boolean;
  accountType: 'individual' | 'enterprise_client' | 'enterprise_supplier';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithMagicLink: (email: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<RegisterResult | null>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loginAsDemo: (role: string) => Promise<boolean>;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  companyName?: string;
  role: 'broker' | 'operator' | 'pilot' | 'crew';
}

interface RegisterResult {
  user: User;
  verificationToken?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoTimeout, setDemoTimeout] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        // Handle session changes
        if (session?.user) {
          // Defer the fetchUserProfile call to prevent deadlock
          setTimeout(() => {
            fetchUserProfile(session.user);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
      clearDemoTimeout();
    };
  }, []);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Simplified version - just use auth metadata for now
      const meta = supabaseUser.user_metadata || {};
      const email = supabaseUser.email || '';
      const role = meta.role || 'broker';
      const fullName = meta.full_name || (email ? email.split('@')[0] : '');
      const verificationStatus = meta.verification_status || 
        (role === 'admin' ? 'approved' : 'pending');
      
      // Check if this is a demo user (these are actually admin access accounts, not demo users)
      const isDemoUser = false; // No auto-logout for any @stratusconnect.org accounts

      // Determine account type based on role and company
      const accountType = meta.account_type || 
        (role === 'broker' && meta.company_name ? 'enterprise_client' : 
         ['operator', 'pilot', 'crew'].includes(role) && meta.company_name ? 'enterprise_supplier' : 
         'individual');

      const userData = {
        id: supabaseUser.id,
        email,
        fullName,
        companyName: meta.company_name || '',
        role,
        verificationStatus,
        username: meta.username,
        avatarUrl: meta.avatar_url,
        isDemoUser,
        accountType
      };

      setUser(userData);

      // Set up auto-logout for demo users
      if (isDemoUser) {
        setupDemoAutoLogout();
      } else {
        clearDemoTimeout();
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      // Final fallback to ensure login works
      const email = supabaseUser.email || '';
      const meta = supabaseUser.user_metadata || {};
      const isDemoUser = false; // No auto-logout for any @stratusconnect.org accounts
      
      // Determine account type based on role and company
      const accountType = meta.account_type || 
        (meta.role === 'broker' && meta.company_name ? 'enterprise_client' : 
         ['operator', 'pilot', 'crew'].includes(meta.role || 'broker') && meta.company_name ? 'enterprise_supplier' : 
         'individual');

      setUser({
        id: supabaseUser.id,
        email,
        fullName: meta.full_name || (email ? email.split('@')[0] : ''),
        companyName: meta.company_name || '',
        role: meta.role || 'broker',
        verificationStatus: meta.verification_status || 
          (email.endsWith('@stratusconnect.org') ? 'approved' : 'pending'),
        isDemoUser,
        accountType
      });

      if (isDemoUser) {
        setupDemoAutoLogout();
      } else {
        clearDemoTimeout();
      }
    }
    setLoading(false);
  };

  const refreshUser = async () => {
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (supabaseUser) {
      await fetchUserProfile(supabaseUser);
    }
  };

  const setupDemoAutoLogout = () => {
    // Clear any existing timeout
    clearDemoTimeout();
    
    // Set up auto-logout after 30 minutes for demo users
    const timeout = setTimeout(() => {
      toast({
        title: 'Demo Session Expired',
        description: 'Your demo session has ended. Please log in with your real account.',
        variant: 'destructive'
      });
      logout();
    }, 30 * 60 * 1000); // 30 minutes
    
    setDemoTimeout(timeout);
  };

  const clearDemoTimeout = () => {
    if (demoTimeout) {
      clearTimeout(demoTimeout);
      setDemoTimeout(null);
    }
  };

  const loginAsDemo = async (role: string): Promise<boolean> => {
    // Only allow demo login for the specific demo accounts, not admin accounts
    const demoCredentials = {
      broker: { email: 'broker@stratusconnect.org', password: 'Bk7!mP9$qX2vL' },
      operator: { email: 'operator@stratusconnect.org', password: 'Op3#nW8&zR5kM' },
      pilot: { email: 'pilot@stratusconnect.org', password: 'Pl6#tF2&vB9xK' },
      crew: { email: 'crew@stratusconnect.org', password: 'Cr9!uE4$tY7nQ' }
    };

    const creds = demoCredentials[role as keyof typeof demoCredentials];
    if (!creds) return false;

    return await login(creds.email, creds.password);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Use regular Supabase authentication for all users
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: 'Login Failed',
          description: error.message || 'Invalid credentials',
          variant: 'destructive'
        });
        return false;
      }

      if (data.user) {
        toast({
          title: 'Login Successful',
          description: 'Welcome back!'
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Error',
        description: 'An unexpected error occurred during login',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithMagicLink = async (email: string): Promise<boolean> => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        toast({
          title: 'Magic Link Failed',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }

      toast({
        title: 'Magic Link Sent',
        description: 'Check your email for the login link'
      });
      return true;
    } catch (error) {
      console.error('Magic link error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send magic link',
        variant: 'destructive'
      });
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<RegisterResult | null> => {
    try {
      // Try server-side provision to avoid email confirmation blockers
      const { data: fnRes, error: fnErr } = await supabase.functions.invoke('auth-direct-register', {
        body: {
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          companyName: data.companyName,
          role: data.role,
        }
      });

      if (fnErr) {
        // Fallback to regular sign up (will require email confirmation if enabled)
        const redirectUrl = `${window.location.origin}/`;
        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: data.fullName,
              role: data.role,
              company_name: data.companyName || ''
            }
          }
        });

        if (error) {
          toast({
            title: 'Registration Failed',
            description: error.message || 'Failed to create account',
            variant: 'destructive'
          });
          return null;
        }

        toast({
          title: 'Registration Successful!',
          description: 'Please check your email to confirm your account.'
        });

        return {
          user: {
            id: authData.user?.id || '',
            email: data.email,
            fullName: data.fullName,
            companyName: data.companyName,
            role: data.role,
            verificationStatus: 'pending',
            accountType: data.role === 'broker' && data.companyName ? 'enterprise_client' : 
                        ['operator', 'pilot', 'crew'].includes(data.role) && data.companyName ? 'enterprise_supplier' : 
                        'individual'
          }
        };
      }

      // If server created the user, sign in immediately
      const { error: loginErr } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (loginErr) {
        toast({
          title: 'Login After Registration Failed',
          description: loginErr.message,
          variant: 'destructive'
        });
        return null;
      }

      toast({
        title: 'Registration Complete',
        description: 'Welcome to Stratus Connect!'
      });

      return {
        user: {
          id: fnRes?.userId || '',
          email: data.email,
          fullName: data.fullName,
          companyName: data.companyName,
          role: data.role,
          verificationStatus: 'pending',
          accountType: data.role === 'broker' && data.companyName ? 'enterprise_client' : 
                      ['operator', 'pilot', 'crew'].includes(data.role) && data.companyName ? 'enterprise_supplier' : 
                      'individual'
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Error',
        description: 'An unexpected error occurred during registration',
        variant: 'destructive'
      });
      return null;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      
      // Clear demo timeout
      clearDemoTimeout();
      
      // Clear user state immediately
      setUser(null);
      setSession(null);
      
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out'
      });
      
      // Navigate to home
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout fails
      navigate('/');
    }
  };

  const value = {
    user,
    session,
    loading,
    login,
    loginWithMagicLink,
    register,
    logout,
    refreshUser,
    loginAsDemo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};