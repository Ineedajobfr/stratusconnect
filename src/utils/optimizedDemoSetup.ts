import { supabase } from "@/integrations/supabase/client";

// Optimized demo setup with better error handling and timeout management
export const setupDemoUsersOptimized = async () => {
  try {
    console.log('Starting optimized demo user setup...');
    
    // Create a promise that rejects after timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Setup timed out after 15 seconds')), 15000);
    });
    
    // Race between the actual function call and timeout
    const setupPromise = supabase.functions.invoke('setup-demo-users-optimized');
    
    const result = await Promise.race([setupPromise, timeoutPromise]);
    const { data, error } = result as { data: unknown; error: unknown };
    
    console.log('Setup response:', { data, error });
    
    if (error) {
      console.error('Setup error details:', error);
      throw new Error(error.message || 'Failed to setup demo users');
    }

    console.log('Setup completed successfully:', data);
    return { 
      success: true, 
      message: data?.message || 'Demo users setup completed',
      results: data?.results 
    };
  } catch (error) {
    console.error('Error setting up demo users:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = String(error.message);
    }
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
};

export const demoCredentials = {
  broker: {
    email: 'broker@stratusconnect.org',
    password: 'Bk7!mP9$qX2vL',
    role: 'broker'
  },
  operator: {
    email: 'operator@stratusconnect.org',
    password: 'Op3#nW8&zR5kM',
    role: 'operator'
  },
  crew: {
    email: 'crew@stratusconnect.org',
    password: 'Cr9!uE4$tY7nQ',
    role: 'crew'
  },
  pilot: {
    email: 'pilot@stratusconnect.org',
    password: 'Pl6#tF2&vB9xK',
    role: 'pilot'
  }
};