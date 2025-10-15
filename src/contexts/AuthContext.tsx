import { useToast } from '@/hooks/use-toast';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Types
export type UserRole = 'broker' | 'operator' | 'pilot' | 'crew' | 'admin';
export type VerificationStatus = 'pending_documents' | 'pending_verification' | 'approved' | 'rejected';
export type AccountType = 'individual' | 'enterprise_client' | 'enterprise_supplier';

export interface User {
  id: string;
  email: string;
  fullName: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  verification_status?: VerificationStatus;
  verification_notes?: string;
  created_at?: string;
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
  // Role-specific fields
  company_name?: string;
  license_number?: string;
  license_authority?: string;
  years_experience?: number;
  fleet_size?: number;
  aircraft_types?: string[];
  operating_regions?: string[];
  license_type?: string;
  total_flight_hours?: number;
  aircraft_ratings?: string[];
  current_employer?: string;
  specialties?: string[];
  certifications?: string[];
  languages_spoken?: string[];
  // Document URLs
  id_document_url?: string;
  license_document_url?: string;
  additional_documents?: any[];
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
  fetchUserProfile: () => Promise<User | null>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithMicrosoft: () => Promise<boolean>;
  loginWithApple: () => Promise<boolean>;
  loginWithMagicLink: (email: string) => Promise<boolean>;
  sendMagicLink: (email: string) => Promise<boolean>;
  checkVerificationStatus: () => Promise<VerificationStatus | null>;
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
  const { toast } = useToast();
  const navigate = useNavigate();

  // Helper function to check platform admin status
        const checkPlatformAdmin = useCallback(async (userId: string): Promise<boolean> => {
            try {
              // Check platform_admins table
              const { data: platformAdminData, error: platformAdminError } = await supabase
                .from('platform_admins')
                .select('user_id')
                .eq('user_id', userId)
                .single();
              
              if (!platformAdminError && platformAdminData) {
                return true;
              }

              // Also check if user has admin role in users table
              const { data: userData, error: userError } = await supabase
                .from('users')
                .select('role')
                .eq('id', userId)
                .eq('role', 'admin')
                .single();
              
              return !userError && !!userData;
            } catch {
              return false;
            }
          }, []);

  const fetchUserProfile = useCallback(async (supabaseUser?: SupabaseUser): Promise<User | null> => {
    try {
      // Check for secure admin auth first
      const secureAuth = localStorage.getItem('secure_admin_auth');
      const adminSession = localStorage.getItem('admin_session');
      
      if (secureAuth === 'true' && adminSession) {
        try {
          const adminUser = JSON.parse(adminSession);
          if (adminUser.email === 'stratuscharters@gmail.com' && adminUser.isSecureAuth) {
            console.log('🔐 SECURE ADMIN AUTH DETECTED - LOADING ADMIN USER');
            const userData: User = {
              id: adminUser.id,
              email: adminUser.email,
              fullName: adminUser.fullName,
              first_name: adminUser.first_name,
              last_name: adminUser.last_name,
              role: 'admin',
              verificationStatus: 'approved',
              verification_status: 'approved',
              createdAt: adminUser.createdAt,
              created_at: adminUser.createdAt,
              avatar: null,
              preferences: {
                theme: 'dark',
                notifications: true,
                language: 'en'
              },
              accountType: 'individual',
              companyName: null,
              company_name: null,
              phoneNumber: null,
              isEmailVerified: true,
              isPhoneVerified: false,
              lastActiveAt: new Date().toISOString(),
              profileCompleteness: 100
            };
            console.log('✅ ADMIN USER LOADED SUCCESSFULLY:', userData);
            setUser(userData);
            setLoading(false);
            return userData;
          }
        } catch (e) {
          console.error('Error parsing admin session:', e);
        }
      }

      // Check for test user first (for admin impersonation)
      const testUserData = localStorage.getItem('test_user');
      if (testUserData) {
        const testUser = JSON.parse(testUserData);
        const mockUser: User = {
          id: testUser.id,
          email: testUser.email,
          fullName: testUser.fullName || testUser.full_name || 'Test User',
          first_name: testUser.first_name || testUser.fullName?.split(' ')[0] || 'Test',
          last_name: testUser.last_name || testUser.fullName?.split(' ')[1] || 'User',
          role: testUser.role,
          verificationStatus: testUser.verification_status || 'approved',
          verification_status: testUser.verification_status || 'approved',
          company_name: testUser.company_name,
          license_number: testUser.license_number,
          years_experience: testUser.years_experience,
          preferences: {
            theme: 'dark',
            notifications: true,
            language: 'en'
          },
          isEmailVerified: true,
          isPhoneVerified: true,
          lastActiveAt: new Date().toISOString(),
          profileCompleteness: 100
        };
        setUser(mockUser);
        setLoading(false);
        return mockUser;
      }

      const userToFetch = supabaseUser || session?.user;
      if (!userToFetch) {
        setLoading(false);
        return null;
      }

      // First try to get profile from database (try both profiles and users tables)
      let profileData = null;
      let profileError = null;

      // Try profiles table first
      const { data: profilesData, error: profilesErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userToFetch.id)
        .single();

      if (profilesErr && profilesErr.code !== 'PGRST116') {
        // Try users table as fallback
        const { data: usersData, error: usersErr } = await supabase
          .from('users')
          .select('*')
          .eq('id', userToFetch.id)
          .single();

        if (usersErr && usersErr.code !== 'PGRST116') {
          console.error('Error fetching user from both profiles and users tables:', usersErr);
        } else {
          profileData = usersData;
        }
      } else {
        profileData = profilesData;
      }

      const meta = userToFetch.user_metadata || {};
      const email = userToFetch.email || '';
      const role = profileData?.role || meta.role || 'broker';
      
              // Check if user is admin (either from role, platform_admins table, or specific admin emails)
              const isAdmin = role === 'admin' || 
                              await checkPlatformAdmin(userToFetch.id) ||
                              email.toLowerCase() === 'stratuscharters@gmail.com';
      const fullName = profileData?.first_name && profileData?.last_name 
        ? `${profileData.first_name} ${profileData.last_name}`
        : meta.full_name || (email ? email.split('@')[0] : '');
      const verificationStatus = profileData?.verification_status || 
        (role === 'admin' ? 'approved' : 'pending_documents');
      
      const userData: User = {
        id: userToFetch.id,
        email,
        fullName,
        first_name: profileData?.first_name || meta.first_name,
        last_name: profileData?.last_name || meta.last_name,
        role: (isAdmin ? 'admin' : role) as UserRole,
        verificationStatus: verificationStatus as VerificationStatus,
        verification_status: verificationStatus as VerificationStatus,
        verification_notes: profileData?.verification_notes,
        createdAt: userToFetch.created_at,
        created_at: userToFetch.created_at,
        lastSignIn: userToFetch.last_sign_in_at,
        avatar: meta.avatar_url || null,
        preferences: {
          theme: meta.theme || 'dark',
          notifications: meta.notifications !== false,
          language: meta.language || 'en'
        },
        accountType: meta.account_type as AccountType || 'individual',
        companyName: profileData?.company_name || meta.company_name || null,
        phoneNumber: profileData?.phone || meta.phone_number || null,
        address: meta.address || null,
        timezone: meta.timezone || 'UTC',
        currency: meta.currency || 'USD',
        isEmailVerified: userToFetch.email_confirmed_at !== null,
        isPhoneVerified: meta.phone_verified || false,
        lastActiveAt: new Date().toISOString(),
        profileCompleteness: 85,
        // Role-specific fields from database
        company_name: profileData?.company_name,
        license_number: profileData?.license_number,
        license_authority: profileData?.license_authority,
        years_experience: profileData?.years_experience,
        fleet_size: profileData?.fleet_size,
        aircraft_types: profileData?.aircraft_types,
        operating_regions: profileData?.operating_regions,
        license_type: profileData?.license_type,
        total_flight_hours: profileData?.total_flight_hours,
        aircraft_ratings: profileData?.aircraft_ratings,
        current_employer: profileData?.current_employer,
        specialties: profileData?.specialties,
        certifications: profileData?.certifications,
        languages_spoken: profileData?.languages_spoken,
        // Document URLs
        id_document_url: profileData?.id_document_url,
        license_document_url: profileData?.license_document_url,
        additional_documents: profileData?.additional_documents
      };

      setUser(userData);
      setLoading(false);
      return userData;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false);
      return null;
    }
  }, [session, toast, navigate, checkPlatformAdmin]); // Stable dependencies only


  // Initialize auth state
  useEffect(() => {
    // Check for secure admin auth first on app start
    const secureAuth = localStorage.getItem('secure_admin_auth');
    const adminSession = localStorage.getItem('admin_session');
    
    if (secureAuth === 'true' && adminSession) {
      try {
        const adminUser = JSON.parse(adminSession);
        if (adminUser.email === 'stratuscharters@gmail.com' && adminUser.isSecureAuth) {
          console.log('🚀 INITIALIZING SECURE ADMIN AUTH ON APP START');
          const userData: User = {
            id: adminUser.id,
            email: adminUser.email,
            fullName: adminUser.fullName,
            first_name: adminUser.first_name,
            last_name: adminUser.last_name,
            role: 'admin',
            verificationStatus: 'approved',
            verification_status: 'approved',
            createdAt: adminUser.createdAt,
            created_at: adminUser.createdAt,
            avatar: null,
            preferences: {
              theme: 'dark',
              notifications: true,
              language: 'en'
            },
            accountType: 'individual',
            companyName: null,
            company_name: null,
            phoneNumber: null,
            isEmailVerified: true,
            isPhoneVerified: false,
            lastActiveAt: new Date().toISOString(),
            profileCompleteness: 100
          };
          console.log('✅ ADMIN USER INITIALIZED ON APP START');
          setUser(userData);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error('Error parsing admin session on init:', e);
      }
    }

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
    };
  }, [fetchUserProfile]); // fetchUserProfile is now stable with useCallback

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

  const sendMagicLink = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          shouldCreateUser: true
        }
      });

      if (error) {
        console.error('Magic link error:', error);
        
        // Handle specific OTP error
        if (error.message.includes('Signups not allowed for otp')) {
          throw new Error('OTP signups are disabled. Please enable "Enable email confirmations" in Supabase Dashboard → Authentication → Settings → Auth Providers → Email');
        }
        
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Magic link error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkVerificationStatus = async (): Promise<VerificationStatus | null> => {
    try {
      if (!user) return null;
      
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('verification_status')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking verification status:', error);
        return null;
      }

      return profileData?.verification_status || 'pending_documents';
    } catch (error) {
      console.error('Error checking verification status:', error);
      return null;
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
                // Try to create user record in public.users table, or update if exists
                const { error: userError } = await supabase
                  .from('users')
                  .upsert({
                    id: authData.user.id,
                    email: data.email.trim().toLowerCase(),
                    username: data.email.split('@')[0], // Use email prefix as username
                    role: data.role,
                    verification_status: 'pending',
                    full_name: data.fullName,
                    company_name: data.companyName || null,
                    phone: data.phoneNumber || null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  }, {
                    onConflict: 'id'
                  });

                if (userError) {
                  console.error('Error upserting user record:', userError);
                  // Continue anyway - the auth user was created successfully
                }

        const userData: User = {
          id: authData.user.id,
          email: data.email,
          fullName: data.fullName,
          role: data.role,
          verificationStatus: 'pending',
          verification_status: 'pending',
          createdAt: authData.user.created_at,
          created_at: authData.user.created_at,
          avatar: null,
          preferences: {
            theme: 'dark',
            notifications: true,
            language: 'en'
          },
          accountType: 'individual',
          companyName: data.companyName || null,
          company_name: data.companyName || null,
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

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      // Clear test user data if it exists
      localStorage.removeItem('test_user');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [navigate]);

  const value = {
    user,
    session,
    loading,
    login,
    loginAsDemo,
    register,
    logout,
    refreshUser,
    fetchUserProfile,
    loginWithGoogle,
    loginWithMicrosoft,
    loginWithApple,
    loginWithMagicLink,
    sendMagicLink,
    checkVerificationStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Import shared Supabase client
import { supabase } from '@/integrations/supabase/client';

