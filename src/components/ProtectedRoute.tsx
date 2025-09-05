import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireApproved?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  allowedRoles, 
  requireApproved = true 
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span>Authenticating...</span>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user needs approval
  if (requireApproved && user.verificationStatus !== 'approved') {
    return <Navigate to="/verification-pending" replace />;
  }

  // Check role permissions - require explicit role match
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to user's appropriate terminal
    const roleRoutes = {
      broker: '/terminal/broker',
      operator: '/terminal/operator',
      pilot: '/terminal/crew',
      crew: '/terminal/crew',
      admin: '/terminal/admin'
    } as const;
    return <Navigate to={roleRoutes[user.role as keyof typeof roleRoutes]} replace />;
  }

  return <>{children}</>;
};