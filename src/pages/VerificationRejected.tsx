// Verification Rejected Page
// Shows status for users whose verification was rejected

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, FileText, Mail, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VerificationRejected() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [rejectionNotes, setRejectionNotes] = useState<string>('');

  useEffect(() => {
    if (user?.verification_notes) {
      setRejectionNotes(user.verification_notes);
    }
  }, [user?.verification_notes]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleResubmit = () => {
    navigate('/upload-documents');
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
              <h1 className="text-2xl font-bold text-white">Verification Required</h1>
              <p className="text-orange-300/80">Additional information needed</p>
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
          <div className="mx-auto w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Verification Not Approved
          </h2>
          <p className="text-xl text-orange-200/80 max-w-2xl mx-auto">
            We need additional information to verify your {user?.role} account. Please review the feedback below and resubmit your documents.
          </p>
        </div>

        {/* Rejection Reason */}
        <Card className="bg-red-500/10 border-red-500/30 border-2 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6" />
              Verification Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
              <p className="text-orange-200/90 leading-relaxed">
                {rejectionNotes || 
                  "Your documents could not be verified. This may be due to unclear images, expired documents, or missing information. Please ensure all documents are clear, current, and complete before resubmitting."
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Common Issues */}
        <Card className="bg-slate-800/50 border-slate-700 border-2 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-orange-300 flex items-center gap-3">
              <FileText className="w-6 h-6" />
              Common Verification Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-orange-200/80">
                  <strong>Document Quality:</strong> Ensure all documents are clear, well-lit, and in focus. Avoid blurry or dark photos.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-orange-200/80">
                  <strong>Document Validity:</strong> All licenses and certificates must be current and not expired.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-orange-200/80">
                  <strong>Complete Information:</strong> Ensure all required fields are filled out completely and accurately.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-orange-200/80">
                  <strong>File Format:</strong> Documents should be in PDF, JPG, or PNG format and under 10MB each.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submitted Information */}
        {user && (
          <Card className="bg-slate-800/50 border-slate-700 border-2 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-orange-300 flex items-center gap-3">
                <FileText className="w-6 h-6" />
                Account Information
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
                  <label className="text-orange-200/60 text-sm">Rejected On</label>
                  <p className="text-white font-medium">
                    {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={handleResubmit}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Resubmit Documents
          </Button>
          
          <Button
            onClick={() => window.open('mailto:support@stratusconnect.com', '_blank')}
            variant="outline"
            className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10 px-8 py-3 text-lg"
          >
            <Mail className="w-5 h-5 mr-2" />
            Contact Support
          </Button>
        </div>

        {/* Support Information */}
        <div className="text-center mt-8">
          <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm max-w-2xl mx-auto">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-orange-300 mb-3">
                Need Help?
              </h3>
              <p className="text-orange-200/80 mb-4">
                Our support team is here to help you complete your verification successfully. 
                Contact us if you have any questions about the requirements or need assistance.
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-orange-300/60">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  support@stratusconnect.com
                </div>
                <div className="flex items-center gap-2">
                  <span>Response time: 24 hours</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

