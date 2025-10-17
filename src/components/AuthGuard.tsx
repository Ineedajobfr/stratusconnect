// AuthGuard - Handles authentication issues
import { supabase } from '@/integrations/supabase/client';
import { checkAuthStatus, forceReauth, refreshAuthSession } from '@/lib/auth-fix';
import React, { useEffect, useState } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        // First check for test user in localStorage
        const testUserActive = localStorage.getItem('test_user_active');
        const testUser = localStorage.getItem('test_user');
        
        if (testUserActive === 'true' && testUser) {
          console.log('✅ Test user detected, bypassing Supabase auth');
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // If no test user, try to get current Supabase user
        const user = await checkAuthStatus();
        
        if (user) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // If no user, try to refresh session
        const refreshed = await refreshAuthSession();
        
        if (refreshed) {
          const refreshedUser = await checkAuthStatus();
          if (refreshedUser) {
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          }
        }

        // If still no user, show login prompt
        setIsAuthenticated(false);
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    }

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setIsAuthenticated(true);
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
        }
      }
    );

    // Listen for test user changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'test_user_active' || e.key === 'test_user') {
        const testUserActive = localStorage.getItem('test_user_active');
        const testUser = localStorage.getItem('test_user');
        
        if (testUserActive === 'true' && testUser) {
          console.log('✅ Test user activated via storage change');
          setIsAuthenticated(true);
        } else {
          console.log('❌ Test user deactivated via storage change');
          setIsAuthenticated(false);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please log in to access the marketplace.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={forceReauth}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
              >
                Sign Out & Re-login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

