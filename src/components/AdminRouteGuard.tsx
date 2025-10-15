import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdminAccess = () => {
      // If still loading, wait
      if (loading) {
        return;
      }

      // If no user, redirect to home
      if (!user) {
        console.log('No user found, redirecting to home');
        navigate('/', { replace: true });
        return;
      }

      // If user is not admin and not the specific admin email, redirect to their appropriate terminal
      if (user.role !== 'admin' && user.email?.toLowerCase() !== 'stratuscharters@gmail.com') {
        console.log('Non-admin user trying to access admin area:', user.role);
        
        // Redirect based on user role
        switch (user.role) {
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
          default:
            navigate('/', { replace: true });
        }
        return;
      }

      // User is admin, allow access
      setChecking(false);
    };

    checkAdminAccess();
  }, [user, loading, navigate]);

  // Show loading while checking
  if (loading || checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-orange-400 mx-auto mb-4 animate-pulse" />
          <p className="text-white">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Show access denied if somehow we get here without admin user
  if (!user || (user.role !== 'admin' && user.email?.toLowerCase() !== 'stratuscharters@gmail.com')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-slate-300 mb-6">
            You don't have permission to access the admin area. 
            Only verified administrators can access this section.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // User is admin, render children
  return <>{children}</>;
}

