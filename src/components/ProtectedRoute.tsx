import { useAuth } from '@/contexts/AuthContext';
import { isOwner } from '@/utils/ownerAccess';
import { Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

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

  // Owner bypass - allow access without authentication for specific emails
  if (user && isOwner(user.email)) {
    return <>{children}</>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user needs approval
  if (requireApproved && user.verificationStatus !== 'approved') {
    return <Navigate to="/verification-pending" replace />;
  }

  // HEAVY DEMO PROTECTION - Block ALL demo users from admin routes
  if (allowedRoles?.includes('admin')) {
    // Check for demo indicators in email
    const isDemoUser = 
      user.email?.includes('demo') ||
      user.email?.includes('test');
    
    if (isDemoUser) {
      console.warn('SECURITY ALERT: Demo user attempted to access admin route:', user.email);
      return <Navigate to="/unauthorized" replace />;
    }
    
    // Additional admin verification - must be explicitly admin role or specific admin email
    if (user.role !== 'admin' && user.email?.toLowerCase() !== 'stratuscharters@gmail.com') {
      console.warn('SECURITY ALERT: Non-admin user attempted to access admin route:', user.email, 'Role:', user.role);
      return <Navigate to="/unauthorized" replace />;
    }
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
