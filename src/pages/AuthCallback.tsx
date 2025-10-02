import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Plane } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Give Supabase time to process the OAuth callback
    const timer = setTimeout(() => {
      if (!loading) {
        if (user) {
          // Successfully authenticated, redirect to appropriate terminal
          console.log('User authenticated:', user);
          
          // Redirect based on user role
          switch (user.role) {
            case 'broker':
              navigate('/demo/broker', { replace: true });
              break;
            case 'operator':
              navigate('/operator-terminal', { replace: true });
              break;
            case 'pilot':
              navigate('/pilot-terminal', { replace: true });
              break;
            case 'crew':
              navigate('/crew-terminal', { replace: true });
              break;
            default:
              // If no role set yet, go to home to choose
              navigate('/home', { replace: true });
          }
        } else {
          // No user found after waiting, redirect back to auth
          console.log('No user found after callback');
          navigate('/auth', { replace: true });
        }
      }
    }, 2000); // Wait 2 seconds for auth state to settle

    return () => clearTimeout(timer);
  }, [user, loading, navigate]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(139, 69, 19, 0.9) 0%, rgba(91, 30, 13, 0.95) 25%, rgba(59, 30, 13, 0.98) 50%, rgba(20, 20, 20, 0.99) 75%, rgba(10, 10, 12, 1) 100%), linear-gradient(135deg, #3b1e0d 0%, #2d1a0a 25%, #1a0f08 50%, #0f0a06 75%, #0a0a0c 100%)',
      }}
    >
      {/* Cinematic Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at center, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0.3) 80%, rgba(0, 0, 0, 0.6) 100%)',
        }}
      />
      
      {/* Subtle golden-orange glow */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at center, rgba(255, 140, 0, 0.08) 0%, rgba(255, 140, 0, 0.04) 30%, transparent 60%)',
        }}
      />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgTCAwIDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4=')] opacity-30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <div className="mb-8">
          <div className="relative inline-block">
            <Plane className="h-16 w-16 text-white mx-auto animate-pulse" />
            <div className="absolute inset-0 blur-xl bg-orange-500/30 animate-pulse"></div>
          </div>
        </div>
        
        <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-6" />
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Completing Sign In...
        </h2>
        
        <p className="text-white/80 text-lg mb-2">
          Setting up your StratusConnect account
        </p>
        
        {user?.email && (
          <p className="text-white/60 text-sm mt-2">
            {user.email}
          </p>
        )}
        
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}

