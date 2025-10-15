import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Plane } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, loading, fetchUserProfile } = useAuth();
  const [processing, setProcessing] = useState(true);
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Give Supabase time to process the magic link callback
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (!loading && user) {
          setStatus('Fetching profile data...');
          
          // Fetch the latest user profile to get verification status
          const profile = await fetchUserProfile();
          
          if (profile) {
            console.log('User authenticated:', profile);
            
            // Check if this is a new user (no profile data yet)
            const storedFormData = localStorage.getItem('signupFormData');
            
            if (storedFormData) {
              // New user signup flow - redirect to document upload
              setStatus('New account detected, redirecting to document upload...');
              localStorage.removeItem('signupFormData'); // Clean up
              navigate('/upload-documents', { replace: true });
              return;
            }
            
            // Returning user - check verification status
            switch (profile.verification_status) {
              case 'pending_documents':
                setStatus('Documents required, redirecting to upload...');
                navigate('/upload-documents', { replace: true });
                break;
              case 'pending_verification':
                setStatus('Account under review, redirecting to status page...');
                navigate('/verification-pending', { replace: true });
                break;
              case 'approved':
                setStatus('Account verified, redirecting to terminal...');
                // Redirect based on user role
                switch (profile.role) {
                  case 'broker':
                    navigate('/broker-terminal', { replace: true });
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
                  case 'admin':
                    navigate('/admin', { replace: true });
                    break;
                  default:
                    navigate('/home', { replace: true });
                }
                break;
              case 'rejected':
                setStatus('Account verification required, redirecting...');
                navigate('/verification-rejected', { replace: true });
                break;
              default:
                setStatus('Unknown status, redirecting to home...');
                navigate('/home', { replace: true });
            }
          } else {
            setStatus('Profile not found, redirecting to role selection...');
            navigate('/role-selection', { replace: true });
          }
        } else if (!loading && !user) {
          setStatus('Authentication failed, redirecting to login...');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('Error occurred, redirecting to home...');
        navigate('/home', { replace: true });
      } finally {
        setProcessing(false);
      }
    };

    handleAuthCallback();
  }, [user, loading, navigate, fetchUserProfile]);

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
          {status}
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

