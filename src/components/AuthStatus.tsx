// AuthStatus - Shows current authentication status
import { supabase } from '@/integrations/supabase/client';
import { checkAuthStatus, refreshAuthSession } from '@/lib/auth-fix';
import { useEffect, useState } from 'react';

export function AuthStatus() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await checkAuthStatus();
        setUser(currentUser);
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsLoading(false);
      }
    }

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const refreshed = await refreshAuthSession();
      if (refreshed) {
        const currentUser = await checkAuthStatus();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Refresh failed:', error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
        <span>Checking auth...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-2 text-sm text-red-600">
        <span>Not authenticated</span>
        <button
          onClick={handleRefresh}
          className="px-2 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-sm text-green-600">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span>Authenticated as {user.email}</span>
    </div>
  );
}

