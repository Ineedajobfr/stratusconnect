import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { NavigationArrows } from '@/components/NavigationArrows';
import { DemoBanner } from '@/components/DemoBanner';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, Shield, CheckCircle, XCircle, LogOut } from 'lucide-react';

export default function VerificationPending() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const getStatusIcon = () => {
    switch (user.verificationStatus) {
      case 'pending':
        return <Clock className="h-8 w-8 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Shield className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (user.verificationStatus) {
      case 'pending':
        return {
          title: 'Verification Pending',
          description: 'Your account is currently under review by our admin team. This process typically takes 1-2 business days.',
          variant: 'default' as const
        };
      case 'approved':
        return {
          title: 'Account Approved',
          description: 'Your account has been approved! You should now have access to the platform.',
          variant: 'default' as const
        };
      case 'rejected':
        return {
          title: 'Verification Declined',
          description: 'Unfortunately, your account verification was declined. Please contact support for more information.',
          variant: 'destructive' as const
        };
      default:
        return {
          title: 'Unknown Status',
          description: 'There seems to be an issue with your account status. Please contact support.',
          variant: 'destructive' as const
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background flex items-center justify-center p-4">
      <DemoBanner />
      <div className="fixed top-20 right-6 z-40">
        <NavigationArrows />
      </div>
      <Card className="w-full max-w-md bg-card/90 border-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className="text-2xl text-foreground">{statusInfo.title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            Account verification status for {user.fullName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant={statusInfo.variant}>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              {statusInfo.description}
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Email</span>
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">User ID</span>
              <span className="text-sm text-muted-foreground font-mono">{user.id}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Role</span>
              <Badge variant="secondary" className="capitalize">
                {user.role}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Status</span>
              <Badge 
                variant={user.verificationStatus === 'approved' ? 'default' : 
                        user.verificationStatus === 'rejected' ? 'destructive' : 'secondary'}
                className="capitalize"
              >
                {user.verificationStatus}
              </Badge>
            </div>
          </div>

          {user.verificationStatus === 'pending' && (
            <div className="text-center text-sm text-muted-foreground">
              <p>You'll receive an email notification once your account is reviewed.</p>
              <p className="mt-2">
                Questions? Contact our support team at{' '}
                <a href="mailto:support@stratusconnect.com" className="text-primary hover:underline">
                  support@stratusconnect.com
                </a>
              </p>
            </div>
          )}

          {user.verificationStatus === 'rejected' && (
            <div className="text-center text-sm text-muted-foreground">
              <p>
                To appeal this decision or get more information, please contact{' '}
                <a href="mailto:support@stratusconnect.com" className="text-primary hover:underline">
                  support@stratusconnect.com
                </a>
              </p>
            </div>
          )}

          <Button 
            variant="outline" 
            className="w-full" 
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}