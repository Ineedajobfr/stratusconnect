// Document Upload Page for Magic Link Authentication
// Users upload required documents based on their role

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Briefcase, Building2, Check, FileText, Plane, Upload, Users, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UploadedFile {
  id: string;
  file: File;
  type: string;
  preview: string;
  uploaded: boolean;
  url?: string;
}

interface DocumentRequirement {
  id: string;
  title: string;
  description: string;
  required: boolean;
  acceptedTypes: string[];
  maxSize: number; // in MB
}

export default function DocumentUpload() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Get document requirements based on user role
  const getDocumentRequirements = (role: string): DocumentRequirement[] => {
    const commonRequirements: DocumentRequirement[] = [
      {
        id: 'id_document',
        title: 'Government-Issued ID',
        description: 'Passport, driver\'s license, or national ID',
        required: true,
        acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        maxSize: 10
      }
    ];

    const roleSpecificRequirements: Record<string, DocumentRequirement[]> = {
      broker: [
        {
          id: 'broker_license',
          title: 'Broker License',
          description: 'Valid broker license or certificate',
          required: true,
          acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
          maxSize: 10
        }
      ],
      operator: [
        {
          id: 'aoc_certificate',
          title: 'Air Operator Certificate (AOC)',
          description: 'Valid Air Operator Certificate',
          required: true,
          acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
          maxSize: 10
        }
      ],
      pilot: [
        {
          id: 'pilot_license',
          title: 'Pilot License',
          description: 'Valid pilot license (ATP, CPL, or PPL)',
          required: true,
          acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
          maxSize: 10
        },
        {
          id: 'medical_certificate',
          title: 'Medical Certificate',
          description: 'Current medical certificate',
          required: true,
          acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
          maxSize: 10
        },
        {
          id: 'logbook_summary',
          title: 'Logbook Summary',
          description: 'Summary of flight hours (last 3 pages)',
          required: false,
          acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
          maxSize: 10
        }
      ],
      crew: [
        {
          id: 'crew_certificate',
          title: 'Cabin Crew Certificate',
          description: 'Valid cabin crew training certificate',
          required: true,
          acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
          maxSize: 10
        },
        {
          id: 'additional_certificates',
          title: 'Additional Certificates',
          description: 'First aid, safety, or other relevant certificates',
          required: false,
          acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
          maxSize: 10
        }
      ]
    };

    return [...commonRequirements, ...(roleSpecificRequirements[role] || [])];
  };

  const requirements = getDocumentRequirements(user?.role || '');
  const roleConfig = {
    broker: { title: 'Broker', icon: Building2, color: 'text-blue-400' },
    operator: { title: 'Operator', icon: Plane, color: 'text-green-400' },
    pilot: { title: 'Pilot', icon: Users, color: 'text-purple-400' },
    crew: { title: 'Crew', icon: Briefcase, color: 'text-orange-400' }
  }[user?.role || ''] || { title: 'User', icon: FileText, color: 'text-gray-400' };

  const IconComponent = roleConfig.icon;

  const handleFileSelect = useCallback((requirement: DocumentRequirement, file: File) => {
    // Validate file type
    if (!requirement.acceptedTypes.includes(file.type)) {
      setError(`Invalid file type. Accepted types: ${requirement.acceptedTypes.join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > requirement.maxSize * 1024 * 1024) {
      setError(`File too large. Maximum size: ${requirement.maxSize}MB`);
      return;
    }

    // Create preview for images
    let preview = '';
    if (file.type.startsWith('image/')) {
      preview = URL.createObjectURL(file);
    }

    const uploadedFile: UploadedFile = {
      id: `${requirement.id}_${Date.now()}`,
      file,
      type: requirement.id,
      preview,
      uploaded: false
    };

    setUploadedFiles(prev => {
      // Remove existing file of same type
      const filtered = prev.filter(f => f.type !== requirement.id);
      return [...filtered, uploadedFile];
    });

    setError(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, requirement: DocumentRequirement) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(requirement, files[0]);
    }
  }, [handleFileSelect]);

  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  }, []);

  const uploadFiles = async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    const filesToUpload = uploadedFiles.filter(f => !f.uploaded);
    if (filesToUpload.length === 0) {
      setError('No files to upload');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const uploadedUrls: Record<string, string> = {};
      let completed = 0;

      for (const fileData of filesToUpload) {
        const { file, type } = fileData;
        const fileName = `${type}_${Date.now()}_${file.name}`;
        const filePath = `${user.id}/${type}/${fileName}`;

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);

        uploadedUrls[type] = publicUrl;
        completed++;
        setUploadProgress((completed / filesToUpload.length) * 100);

        // Update file status
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileData.id ? { ...f, uploaded: true, url: publicUrl } : f
        ));
      }

      // Create profile record with form data and document URLs
      const storedFormData = localStorage.getItem('signupFormData');
      let profileData: any = {};

      if (storedFormData) {
        const formData = JSON.parse(storedFormData);
        profileData = {
          ...formData,
          verification_status: 'pending_verification',
          id_document_url: uploadedUrls.id_document,
          license_document_url: uploadedUrls[Object.keys(uploadedUrls).find(key => 
            ['broker_license', 'aoc_certificate', 'pilot_license', 'crew_certificate'].includes(key)
          ) || ''],
          additional_documents: Object.entries(uploadedUrls)
            .filter(([key]) => !['id_document'].includes(key) && 
              !['broker_license', 'aoc_certificate', 'pilot_license', 'crew_certificate'].includes(key))
            .map(([type, url]) => ({ type, url }))
        };
      }

      // Update profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profileData,
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        throw new Error(`Failed to update profile: ${profileError.message}`);
      }

      setSuccess(true);
      localStorage.removeItem('signupFormData'); // Clean up

      // Redirect after success
      setTimeout(() => {
        navigate('/verification-pending');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const getUploadedFile = (type: string) => {
    return uploadedFiles.find(f => f.type === type);
  };

  const isUploadComplete = () => {
    const requiredTypes = requirements.filter(r => r.required).map(r => r.id);
    const uploadedTypes = uploadedFiles.filter(f => f.uploaded).map(f => f.type);
    return requiredTypes.every(type => uploadedTypes.includes(type));
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      uploadedFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [uploadedFiles]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-white/80 mb-4">Please sign in to upload documents</p>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <div 
              className="text-white text-lg font-bold bg-black/50 px-6 py-3 rounded backdrop-blur-sm cursor-pointer hover:bg-black/70 transition-colors"
              onClick={() => navigate('/')}
            >
              STRATUSCONNECT
            </div>
            <div className="flex items-center space-x-3">
              <IconComponent className={`w-8 h-8 ${roleConfig.color}`} />
              <div>
                <h1 className="text-2xl font-bold text-white">Document Upload</h1>
                <p className="text-orange-300/80">
                  Welcome {user.first_name}, please upload your {roleConfig.title.toLowerCase()} documents
                </p>
              </div>
            </div>
          </div>
          <Button
            onClick={() => {
              // Check if user is authenticated to determine where to navigate
              const isAuthenticated = localStorage.getItem('testUser') || document.cookie.includes('supabase');
              if (isAuthenticated) {
                navigate('/home');
              } else {
                navigate('/');
              }
            }}
            variant="outline"
            className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {success ? (
          <Card className="bg-green-500/10 border-green-500/30 border-2 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-green-400 mb-4">
                Documents Submitted Successfully!
              </h2>
              <p className="text-orange-200/80 mb-4">
                Your documents have been uploaded and submitted for verification. 
                We'll review them within 24-48 hours.
              </p>
              <p className="text-orange-300/60 text-sm">
                Redirecting to verification status page...
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Required Documents</h2>
              <p className="text-orange-200/80 text-lg">
                Please upload the following documents to complete your {roleConfig.title.toLowerCase()} verification:
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <Card className="mb-6 bg-blue-500/10 border-blue-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Upload className="w-6 h-6 text-blue-400 animate-pulse" />
                    <span className="text-blue-400 font-medium">Uploading documents...</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-blue-300/80 text-sm mt-2">
                    {Math.round(uploadProgress)}% complete
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Document Requirements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {requirements.map((requirement) => {
                const uploadedFile = getUploadedFile(requirement.id);
                
                return (
                  <Card 
                    key={requirement.id}
                    className={`${uploadedFile ? 'bg-green-500/10 border-green-500/30' : 'bg-slate-800/50 border-slate-700'} border-2 backdrop-blur-sm transition-all`}
                  >
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-3 ${uploadedFile ? 'text-green-400' : 'text-orange-300'}`}>
                        {uploadedFile ? (
                          <Check className="w-6 h-6" />
                        ) : (
                          <FileText className="w-6 h-6" />
                        )}
                        {requirement.title}
                        {requirement.required && (
                          <span className="text-red-400 text-sm">*</span>
                        )}
                      </CardTitle>
                      <CardDescription className="text-orange-200/80">
                        {requirement.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* File Drop Zone */}
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                          uploadedFile 
                            ? 'border-green-500/50 bg-green-500/5' 
                            : 'border-orange-500/30 hover:border-orange-400/50 hover:bg-orange-500/5'
                        }`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, requirement)}
                      >
                        {uploadedFile ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-center space-x-2 text-green-400">
                              <Check className="w-5 h-5" />
                              <span className="font-medium">{uploadedFile.file.name}</span>
                            </div>
                            {uploadedFile.preview && (
                              <div className="max-w-xs mx-auto">
                                <img 
                                  src={uploadedFile.preview} 
                                  alt="Preview" 
                                  className="w-full h-32 object-cover rounded border"
                                />
                              </div>
                            )}
                            <Button
                              onClick={() => removeFile(uploadedFile.id)}
                              variant="outline"
                              size="sm"
                              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Upload className="w-12 h-12 mx-auto text-orange-400" />
                            <div>
                              <p className="text-orange-300 font-medium">
                                Drop your file here or click to browse
                              </p>
                              <p className="text-orange-300/60 text-sm mt-1">
                                Accepted: {requirement.acceptedTypes.join(', ')} (max {requirement.maxSize}MB)
                              </p>
                            </div>
                            <input
                              type="file"
                              accept={requirement.acceptedTypes.join(',')}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileSelect(requirement, file);
                              }}
                              className="hidden"
                              id={`file-${requirement.id}`}
                            />
                            <Button
                              onClick={() => document.getElementById(`file-${requirement.id}`)?.click()}
                              variant="outline"
                              className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Choose File
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <Button
                onClick={uploadFiles}
                disabled={!isUploadComplete() || isUploading}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg"
              >
                {isUploading ? (
                  <>
                    <Upload className="w-5 h-5 mr-2 animate-pulse" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Submit Documents for Verification
                  </>
                )}
              </Button>
              
              {!isUploadComplete() && (
                <p className="text-orange-300/60 text-sm mt-4">
                  Please upload all required documents (marked with *) to continue
                </p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
