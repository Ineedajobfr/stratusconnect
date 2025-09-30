import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import StratusConnectHeader from '@/components/StratusConnectHeader';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background flex items-center justify-center p-4">
      <StratusConnectHeader />
      
      <div className="w-full max-w-md space-y-6">
        <Card className="bg-slate-900/20 border-orange-500/30">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-red-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-red-900/20 border-red-500/30">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                <strong>SECURITY ALERT:</strong> Unauthorized access attempt detected.
              </AlertDescription>
            </Alert>

            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-slate-400">
                <Lock className="w-4 h-4" />
                <span className="text-sm">
                  This area requires administrator privileges
                </span>
              </div>
              
              {user && (
                <div className="bg-slate-800/20 border border-slate-700 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Current User:</p>
                  <p className="text-sm text-white font-mono">{user.email}</p>
                  <p className="text-xs text-orange-400">Role: {user.role || 'Unknown'}</p>
                </div>
              )}

              <div className="text-xs text-slate-500 space-y-1">
                <p>• Demo and test accounts are not authorized</p>
                <p>• Only verified administrators may access</p>
                <p>• All access attempts are logged</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4">
              <Button 
                onClick={() => navigate(-1)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-slate-600">
            If you believe this is an error, contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
