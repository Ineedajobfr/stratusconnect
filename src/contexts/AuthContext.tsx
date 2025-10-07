import { useToast } from '@/hooks/use-toast';
import { createClient, Session, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Types
export type UserRole = 'broker' | 'operator' | 'pilot' | 'crew' | 'admin';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type AccountType = 'individual' | 'enterprise_client' | 'enterprise_supplier';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  createdAt?: string;
  lastSignIn?: string;
  avatar?: string | null;
  preferences: {
    theme: string;
    notifications: boolean;
    language: string;
  };
  accountType?: AccountType;
  companyName?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  timezone?: string;
  currency?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  lastActiveAt?: string;
  profileCompleteness?: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  companyName?: string;
  phoneNumber?: string;
}

export interface RegisterResult {
  success: boolean;
  message: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginAsDemo: (role: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<RegisterResult | null>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithMicrosoft: () => Promise<boolean>;
  loginWithApple: () => Promise<boolean>;
  loginWithMagicLink: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
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

  const clearDemoTimeout = () => {
    if (demoTimeout) {
      clearTimeout(demoTimeout);
      setDemoTimeout(null);
    }
  };

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const meta = supabaseUser.user_metadata || {};
      const email = supabaseUser.email || '';
      const role = meta.role || 'broker';
      const fullName = meta.full_name || (email ? email.split('@')[0] : '');
      const verificationStatus = meta.verification_status || 
        (role === 'admin' ? 'approved' : 'pending');
      
      const userData: User = {
        id: supabaseUser.id,
        email,
        fullName,
        role: role as UserRole,
        verificationStatus: verificationStatus as VerificationStatus,
        createdAt: supabaseUser.created_at,
        lastSignIn: supabaseUser.last_sign_in_at,
        avatar: meta.avatar_url || null,
        preferences: {
          theme: meta.theme || 'dark',
          notifications: meta.notifications !== false,
          language: meta.language || 'en'
        },
        accountType: meta.account_type as AccountType || 'individual',
        companyName: meta.company_name || null,
        phoneNumber: meta.phone_number || null,
        address: meta.address || null,
        timezone: meta.timezone || 'UTC',
        currency: meta.currency || 'USD',
        isEmailVerified: supabaseUser.email_confirmed_at !== null,
        isPhoneVerified: meta.phone_verified || false,
        lastActiveAt: new Date().toISOString(),
        profileCompleteness: 85
      };

      setUser(userData);
      setLoading(false);
      
      // Set up demo auto-logout if this is a demo user
      if (email.includes('@stratusconnect.org')) {
        setupDemoAutoLogout();
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  const setupDemoAutoLogout = () => {
    clearDemoTimeout();
    
    const timeout = setTimeout(() => {
      toast({
        title: 'Demo Session Expired',
        description: 'Your demo session has ended. Please log in with your real account.',
        variant: 'destructive'
      });
      logout();
    }, 30 * 60 * 1000);
    
    setDemoTimeout(timeout);
  };

  // Initialize auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

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
  }, [clearDemoTimeout, fetchUserProfile]);

  const refreshUser = async () => {
    try {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      if (supabaseUser) {
        await fetchUserProfile(supabaseUser);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const loginAsDemo = async (role: string): Promise<boolean> => {
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
      
      const sanitizedEmail = email.trim().toLowerCase();
      if (!sanitizedEmail || !password) {
        toast({
          title: 'Invalid Input',
          description: 'Please provide both email and password',
          variant: 'destructive'
        });
        return false;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: password
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          title: 'Login Failed',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }

      if (data.user) {
        await fetchUserProfile(data.user);
        toast({
          title: 'Login Successful',
          description: 'Welcome back!',
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Failed',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithMagicLink = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Magic link error:', error);
        toast({
          title: 'Magic Link Failed',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }

      toast({
        title: 'Magic Link Sent',
        description: 'Check your email for the login link',
      });
      return true;
    } catch (error) {
      console.error('Magic link error:', error);
      toast({
        title: 'Magic Link Failed',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<RegisterResult | null> => {
    try {
      setLoading(true);
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: data.role,
            company_name: data.companyName,
            phone_number: data.phoneNumber,
            verification_status: 'pending'
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        return {
          success: false,
          message: error.message
        };
      }

      if (authData.user) {
        const userData: User = {
          id: authData.user.id,
          email: data.email,
          fullName: data.fullName,
          role: data.role,
          verificationStatus: 'pending',
          createdAt: authData.user.created_at,
          avatar: null,
          preferences: {
            theme: 'dark',
            notifications: true,
            language: 'en'
          },
          accountType: 'individual',
          companyName: data.companyName || null,
          phoneNumber: data.phoneNumber || null,
          isEmailVerified: false,
          isPhoneVerified: false,
          lastActiveAt: new Date().toISOString(),
          profileCompleteness: 60
        };

        setUser(userData);
        
        return {
          success: true,
          message: 'Registration successful! Please check your email to verify your account.',
          user: userData
        };
      }

      return {
        success: false,
        message: 'Registration failed'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred during registration'
      };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Google login error:', error);
        toast({
          title: 'Google Login Failed',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: 'Google Login Failed',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithMicrosoft = async (): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Microsoft login error:', error);
        toast({
          title: 'Microsoft Login Failed',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Microsoft login error:', error);
      toast({
        title: 'Microsoft Login Failed',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithApple = async (): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Apple login error:', error);
        toast({
          title: 'Apple Login Failed',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Apple login error:', error);
      toast({
        title: 'Apple Login Failed',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      clearDemoTimeout();
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    login,
    loginAsDemo,
    register,
    logout,
    refreshUser,
    loginWithGoogle,
    loginWithMicrosoft,
    loginWithApple,
    loginWithMagicLink
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);