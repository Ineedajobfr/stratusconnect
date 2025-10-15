// Multi-Step Signup Page for Magic Link Authentication
// Step 1: Role-specific questions and form
// Step 2: Email entry and magic link sending

import { ReCaptchaComponent } from '@/components/ReCaptcha';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, Briefcase, Building2, CheckCircle, Mail, Plane, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface FormData {
  // Common fields
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  
  // Role-specific fields
  companyName?: string;
  licenseNumber?: string;
  licenseAuthority?: string;
  yearsExperience?: number;
  fleetSize?: number;
  aircraftTypes?: string;
  operatingRegions?: string;
  licenseType?: string;
  totalFlightHours?: number;
  aircraftRatings?: string;
  currentEmployer?: string;
  specialties?: string;
  certifications?: string;
  languagesSpoken?: string;
}

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') as 'broker' | 'operator' | 'pilot' | 'crew';
  
  const [currentStep, setCurrentStep] = useState<'form' | 'email'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    country: '',
  });

  const roleConfig = {
    broker: {
      title: 'Broker',
      icon: Building2,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      fields: ['companyName', 'licenseNumber', 'licenseAuthority', 'yearsExperience']
    },
    operator: {
      title: 'Operator',
      icon: Plane,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      fields: ['companyName', 'licenseNumber', 'fleetSize', 'aircraftTypes', 'operatingRegions']
    },
    pilot: {
      title: 'Pilot',
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      fields: ['licenseType', 'totalFlightHours', 'aircraftRatings', 'currentEmployer']
    },
    crew: {
      title: 'Crew',
      icon: Briefcase,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      fields: ['yearsExperience', 'specialties', 'certifications', 'languagesSpoken']
    }
  };

  // Redirect if no role selected
  useEffect(() => {
    if (!role || !roleConfig[role]) {
      navigate('/role-selection');
    }
  }, [role, navigate]);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'phone', 'country'];
    const roleFields = roleConfig[role]?.fields || [];
    const allRequired = [...requiredFields, ...roleFields];
    
    for (const field of allRequired) {
      if (!formData[field as keyof FormData]) {
        setError(`Please fill in all required fields`);
        return;
      }
    }

    if (!recaptchaToken) {
      setError('Please complete the security verification');
      return;
    }

    // Store form data in localStorage for later use
    localStorage.setItem('signupFormData', JSON.stringify({
      role,
      ...formData
    }));
    
    setCurrentStep('email');
    setError(null);
  };

  const handleSendMagicLink = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // This will be implemented when we update AuthContext
      // For now, simulate the magic link sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEmailSent(true);
    } catch (err) {
      setError('Failed to send magic link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSpecificFields = () => {
    const config = roleConfig[role];
    if (!config) return null;

    const fieldComponents = {
      companyName: (
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            value={formData.companyName || ''}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            placeholder="Enter your company name"
          />
        </div>
      ),
      licenseNumber: (
        <div className="space-y-2">
          <Label htmlFor="licenseNumber">License/Certificate Number *</Label>
          <Input
            id="licenseNumber"
            value={formData.licenseNumber || ''}
            onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
            placeholder="Enter your license number"
          />
        </div>
      ),
      licenseAuthority: (
        <div className="space-y-2">
          <Label htmlFor="licenseAuthority">License Issuing Authority *</Label>
          <Input
            id="licenseAuthority"
            value={formData.licenseAuthority || ''}
            onChange={(e) => handleInputChange('licenseAuthority', e.target.value)}
            placeholder="e.g., FAA, EASA, CAA"
          />
        </div>
      ),
      yearsExperience: (
        <div className="space-y-2">
          <Label htmlFor="yearsExperience">Years of Experience *</Label>
          <Input
            id="yearsExperience"
            type="number"
            value={formData.yearsExperience || ''}
            onChange={(e) => handleInputChange('yearsExperience', parseInt(e.target.value) || 0)}
            placeholder="Enter years of experience"
          />
        </div>
      ),
      fleetSize: (
        <div className="space-y-2">
          <Label htmlFor="fleetSize">Fleet Size *</Label>
          <Input
            id="fleetSize"
            type="number"
            value={formData.fleetSize || ''}
            onChange={(e) => handleInputChange('fleetSize', parseInt(e.target.value) || 0)}
            placeholder="Number of aircraft in your fleet"
          />
        </div>
      ),
      aircraftTypes: (
        <div className="space-y-2">
          <Label htmlFor="aircraftTypes">Aircraft Types *</Label>
          <Textarea
            id="aircraftTypes"
            value={formData.aircraftTypes || ''}
            onChange={(e) => handleInputChange('aircraftTypes', e.target.value)}
            placeholder="e.g., Gulfstream G650, Citation XLS, Challenger 350"
          />
        </div>
      ),
      operatingRegions: (
        <div className="space-y-2">
          <Label htmlFor="operatingRegions">Operating Regions *</Label>
          <Textarea
            id="operatingRegions"
            value={formData.operatingRegions || ''}
            onChange={(e) => handleInputChange('operatingRegions', e.target.value)}
            placeholder="e.g., North America, Europe, Asia-Pacific"
          />
        </div>
      ),
      licenseType: (
        <div className="space-y-2">
          <Label htmlFor="licenseType">License Type *</Label>
          <Select value={formData.licenseType || ''} onValueChange={(value) => handleInputChange('licenseType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select license type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ATP">Airline Transport Pilot (ATP)</SelectItem>
              <SelectItem value="CPL">Commercial Pilot License (CPL)</SelectItem>
              <SelectItem value="PPL">Private Pilot License (PPL)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ),
      totalFlightHours: (
        <div className="space-y-2">
          <Label htmlFor="totalFlightHours">Total Flight Hours *</Label>
          <Input
            id="totalFlightHours"
            type="number"
            value={formData.totalFlightHours || ''}
            onChange={(e) => handleInputChange('totalFlightHours', parseInt(e.target.value) || 0)}
            placeholder="Enter total flight hours"
          />
        </div>
      ),
      aircraftRatings: (
        <div className="space-y-2">
          <Label htmlFor="aircraftRatings">Aircraft Ratings *</Label>
          <Textarea
            id="aircraftRatings"
            value={formData.aircraftRatings || ''}
            onChange={(e) => handleInputChange('aircraftRatings', e.target.value)}
            placeholder="e.g., Gulfstream G650, Citation XLS, Challenger 350"
          />
        </div>
      ),
      currentEmployer: (
        <div className="space-y-2">
          <Label htmlFor="currentEmployer">Current Employer</Label>
          <Input
            id="currentEmployer"
            value={formData.currentEmployer || ''}
            onChange={(e) => handleInputChange('currentEmployer', e.target.value)}
            placeholder="Enter current employer (if any)"
          />
        </div>
      ),
      specialties: (
        <div className="space-y-2">
          <Label htmlFor="specialties">Specialties *</Label>
          <Textarea
            id="specialties"
            value={formData.specialties || ''}
            onChange={(e) => handleInputChange('specialties', e.target.value)}
            placeholder="e.g., VIP service, corporate events, medical transport"
          />
        </div>
      ),
      certifications: (
        <div className="space-y-2">
          <Label htmlFor="certifications">Certifications *</Label>
          <Textarea
            id="certifications"
            value={formData.certifications || ''}
            onChange={(e) => handleInputChange('certifications', e.target.value)}
            placeholder="e.g., Cabin crew training, First aid, Wine service"
          />
        </div>
      ),
      languagesSpoken: (
        <div className="space-y-2">
          <Label htmlFor="languagesSpoken">Languages Spoken</Label>
          <Input
            id="languagesSpoken"
            value={formData.languagesSpoken || ''}
            onChange={(e) => handleInputChange('languagesSpoken', e.target.value)}
            placeholder="e.g., English, French, Spanish, German"
          />
        </div>
      )
    };

    return config.fields.map(field => (
      <div key={field}>
        {fieldComponents[field as keyof typeof fieldComponents]}
      </div>
    ));
  };

  if (!role) return null;

  const config = roleConfig[role];
  const IconComponent = config.icon;

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
            <div className="flex items-center space-x-3">
              <IconComponent className={`w-8 h-8 ${config.color}`} />
              <div>
                <h1 className="text-2xl font-bold text-white">{config.title} Registration</h1>
                <p className="text-orange-300/80">
                  Step {currentStep === 'form' ? '1' : '2'} of 2
                </p>
              </div>
            </div>
          </div>
          <Button
            onClick={() => currentStep === 'form' ? navigate('/role-selection') : setCurrentStep('form')}
            variant="outline"
            className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <Card className={`${config.bgColor} ${config.borderColor} border-2 backdrop-blur-sm`}>
          <CardHeader>
            <CardTitle className={`text-2xl ${config.color} flex items-center gap-3`}>
              {currentStep === 'form' ? (
                <>
                  <IconComponent className="w-8 h-8" />
                  Complete Your {config.title} Profile
                </>
              ) : (
                <>
                  <Mail className="w-8 h-8" />
                  Verify Your Email
                </>
              )}
            </CardTitle>
            {currentStep === 'form' && (
              <p className="text-orange-200/80">
                Please provide the following information to create your account
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {currentStep === 'form' ? (
              <>
                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Enter your last name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country of Residence *</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="Enter your country"
                    />
                  </div>
                </div>

                {/* Role-Specific Fields */}
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${config.color}`}>
                    {config.title}-Specific Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderRoleSpecificFields()}
                  </div>
                </div>

                {/* reCAPTCHA */}
                <div className="flex justify-center">
                  <ReCaptchaComponent
                    onVerify={setRecaptchaToken}
                    onExpire={() => setRecaptchaToken(null)}
                    theme="dark"
                  />
                </div>

                {/* Next Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleNextStep}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Email Step */}
                {!emailSent ? (
                  <>
                    <div className="text-center space-y-4">
                      <p className="text-orange-200/80">
                        We'll send you a secure magic link to verify your email and complete your registration.
                      </p>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          className="max-w-md mx-auto"
                        />
                      </div>
                    </div>

                    {/* reCAPTCHA */}
                    <div className="flex justify-center">
                      <ReCaptchaComponent
                        onVerify={setRecaptchaToken}
                        onExpire={() => setRecaptchaToken(null)}
                        theme="dark"
                      />
                    </div>

                    {/* Send Magic Link Button */}
                    <div className="flex justify-center">
                      <Button
                        onClick={handleSendMagicLink}
                        disabled={isLoading || !recaptchaToken}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        {isLoading ? 'Sending...' : 'Send Magic Link'}
                        <Mail className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Email Sent Confirmation */}
                    <div className="text-center space-y-6">
                      <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-green-400 mb-2">
                          Check Your Email
                        </h3>
                        <p className="text-orange-200/80">
                          We've sent you a secure magic link. Click the link in your email to verify your account and continue.
                        </p>
                        <p className="text-sm text-orange-300/60 mt-2">
                          The link will expire in 10 minutes for security reasons.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

