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

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Get user data and profile data separately
      const { data: userData } = await supabase
        .from('users')
        .select('email, full_name, company_name, role, verification_status')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, display_name, avatar_url, platform_role')
        .eq('user_id', supabaseUser.id)
        .maybeSingle();

      if (userData) {
        setUser({
          id: supabaseUser.id,
          email: userData.email,
          fullName: userData.full_name || profileData?.display_name || '',
          companyName: userData.company_name || '',
          role: userData.role as 'broker' | 'operator' | 'pilot' | 'crew' | 'admin',
          verificationStatus: userData.verification_status as 'pending' | 'approved' | 'rejected',
          username: profileData?.username,
          avatarUrl: profileData?.avatar_url,
        });
        setLoading(false);
        return;
      }

      // Fallback to auth metadata (useful for demo users)
      const meta = supabaseUser.user_metadata || {};
      const email = supabaseUser.email || '';
      const role = meta.role || 'broker';
      const fullName = meta.full_name || (email ? email.split('@')[0] : '');
      const verificationStatus = meta.verification_status || 
        (role === 'admin' ? 'approved' : 'pending');

      setUser({
        id: supabaseUser.id,
        email,
        fullName,
        companyName: meta.company_name || '',
        role,
        verificationStatus,
        username: profileData?.username,
        avatarUrl: profileData?.avatar_url,
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      // Final fallback to ensure login works
      const email = supabaseUser.email || '';
      const meta = supabaseUser.user_metadata || {};
      setUser({
        id: supabaseUser.id,
        email,
        fullName: meta.full_name || (email ? email.split('@')[0] : ''),
        companyName: meta.company_name || '',
        role: meta.role || 'broker',
        verificationStatus: meta.verification_status || 
          (email.endsWith('@stratusconnect.org') ? 'approved' : 'pending')
      });
    }
    setLoading(false);
  };

  const refreshUser = async () => {
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (supabaseUser) {
      await fetchUserProfile(supabaseUser);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
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
          verificationStatus: 'pending'
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
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};