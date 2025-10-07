import { AdminSetup } from "@/components/AdminSetup";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle, ArrowLeft, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// SECURE ADMIN SETUP PAGE - Only accessible to existing admins
export default function SecureAdminSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAuthorization();
  }, [user, checkAdminAuthorization]);

  const checkAdminAuthorization = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Check if current user is an admin - this would need proper role checking
      // For now, this is a placeholder that would need to be implemented with proper auth
      const isAdmin = false; // TODO: Implement proper admin role check
      setIsAuthorized(isAdmin);
    } catch (error) {
      console.error('Error checking admin authorization:', error);
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center">
        <div className="text-white">Checking authorization...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center p-6">
        <Card className="terminal-card max-w-md w-full">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <CardTitle className="text-white">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-400 mb-6">
              You must be logged in to access admin setup.
            </p>
            <Button onClick={() => navigate("/enter")} className="btn-terminal-primary">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center p-6">
        <Card className="terminal-card max-w-md w-full">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <CardTitle className="text-white">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Alert className="mb-6 border-red-500/50 bg-red-500/10">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-200">
                Only existing system administrators can create new admin accounts.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => navigate("/")} 
              variant="outline"
              className="btn-terminal-secondary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terminal-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 mx-auto mb-4 text-accent" />
          <h1 className="text-3xl font-bold text-white mb-2">
            Secure Admin Setup
          </h1>
          <p className="text-slate-400">
            Create new administrator account
          </p>
        </div>
        
        <AdminSetup />
        
        <div className="mt-6 text-center">
          <Button 
            onClick={() => navigate("/terminal/admin")} 
            variant="outline"
            size="sm"
            className="btn-terminal-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin Terminal
          </Button>
        </div>
      </div>
    </div>
  );
}