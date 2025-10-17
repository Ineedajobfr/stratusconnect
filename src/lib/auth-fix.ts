// Authentication Fix - Handle session issues
import { supabase } from '@/integrations/supabase/client';

export async function checkAuthStatus() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Auth error:', error);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Failed to check auth status:', error);
    return null;
  }
}

export async function refreshAuthSession() {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Failed to refresh session:', error);
      return false;
    }
    
    return !!data.session;
  } catch (error) {
    console.error('Failed to refresh session:', error);
    return false;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
    }
    return !error;
  } catch (error) {
    console.error('Failed to sign out:', error);
    return false;
  }
}

// Force re-authentication
export async function forceReauth() {
  await signOut();
  // Clear test user data
  localStorage.removeItem('test_user');
  localStorage.removeItem('test_user_active');
  // Redirect to login or refresh the page
  window.location.reload();
}

