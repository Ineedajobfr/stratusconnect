// Verification Pending Page
// Shows status for users whose documents are under review

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, FileText, Mail, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VerificationPending() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [timeElapsed, setTimeElapsed] = useState('');

  useEffect(() => {
    if (user?.created_at) {
      const startTime = new Date(user.created_at);
      const updateTime = () => {
        const now = new Date();
        const diffMs = now.getTime() - startTime.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (diffHours > 0) {
          setTimeElapsed(`${diffHours}h ${diffMinutes}m`);
        } else {
          setTimeElapsed(`${diffMinutes}m`);
        }
      };
      
      updateTime();
      const interval = setInterval(updateTime, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [user?.created_at]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cinematic Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139, 69, 19, 0.9) 0%, rgba(91, 30, 13, 0.95) 25%, rgba(59, 30, 13, 0.98) 50%, rgba(20, 20, 20, 0.99) 75%, rgba(10, 10, 12, 1) 100%), linear-gradient(135deg, #3b1e0d 0%, #2d1a0a 25%, #1a0f08 50%, #0f0a06 75%, #0a0a0c 100%)',
        }}
      />
      
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

      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-orange-500/20 px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <div 
              className="text-white text-lg font-bold bg-black/50 px-6 py-3 rounded backdrop-blur-sm cursor-pointer hover:bg-black/70 transition-colors"
              onClick={() => navigate('/')}
            >
              STRATUSCONNECT
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Account Under Review</h1>
              <p className="text-orange-300/80">Your documents are being verified</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-orange-300/80 text-sm">
              {user?.first_name} {user?.last_name}
            </span>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="mx-auto w-24 h-24 bg-orange-500/20 rounded-full flex items-center justify-center mb-6">
            <Clock className="w-12 h-12 text-orange-400 animate-pulse" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Account Verification in Progress
          </h2>
          <p className="text-xl text-orange-200/80 max-w-2xl mx-auto">
            Thank you for submitting your documents. Our team is reviewing your {user?.role} account for approval.
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-blue-500/10 border-blue-500/30 border-2 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <CardTitle className="text-blue-400">Documents Submitted</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-orange-200/80 text-center">
                Your documents have been successfully uploaded and submitted for review.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-orange-500/10 border-orange-500/30 border-2 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-orange-400 animate-pulse" />
              </div>
              <CardTitle className="text-orange-400">Under Review</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-orange-200/80 text-center">
                Our verification team is currently reviewing your submitted documents.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-green-500/10 border-green-500/30 border-2 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <CardTitle className="text-green-400">Security First</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-orange-200/80 text-center">
                We verify all accounts to maintain the highest security standards.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Review Information */}
        <Card className="bg-slate-800/50 border-slate-700 border-2 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-orange-300 flex items-center gap-3">
              <Clock className="w-6 h-6" />
              Review Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-orange-200/80">Time since submission:</span>
              <span className="text-white font-medium">{timeElapsed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-orange-200/80">Estimated review time:</span>
              <span className="text-white font-medium">24-48 hours</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-orange-200/80">Review status:</span>
              <span className="text-orange-400 font-medium">In Progress</span>
            </div>
          </CardContent>
        </Card>

        {/* Submitted Information */}
        {user && (
          <Card className="bg-slate-800/50 border-slate-700 border-2 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-orange-300 flex items-center gap-3">
                <FileText className="w-6 h-6" />
                Submitted Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-orange-200/60 text-sm">Name</label>
                  <p className="text-white font-medium">{user.first_name} {user.last_name}</p>
                </div>
                <div>
                  <label className="text-orange-200/60 text-sm">Role</label>
                  <p className="text-white font-medium capitalize">{user.role}</p>
                </div>
                <div>
                  <label className="text-orange-200/60 text-sm">Email</label>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
                <div>
                  <label className="text-orange-200/60 text-sm">Account Created</label>
                  <p className="text-white font-medium">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="bg-slate-800/50 border-slate-700 border-2 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-orange-300 flex items-center gap-3">
              <Mail className="w-6 h-6" />
              What Happens Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-orange-200/80">
                  <strong>Email Notification:</strong> You'll receive an email notification once your account is approved or if additional information is required.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-orange-200/80">
                  <strong>Account Access:</strong> Once approved, you'll have full access to your {user?.role} terminal and all platform features.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-orange-200/80">
                  <strong>Security:</strong> Your documents are encrypted and stored securely. Only authorized personnel can access them during the verification process.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <div className="text-center mt-8">
          <p className="text-orange-200/80 mb-4">
            Questions about your verification? Contact our support team.
          </p>
          <Button
            onClick={() => window.open('mailto:support@stratusconnect.org', '_blank')}
            variant="outline"
            className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10"
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </main>
    </div>
  );
}