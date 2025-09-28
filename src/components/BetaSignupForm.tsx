import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plane, Shield, FileText, Users, Clock, CheckCircle } from 'lucide-react';

interface BetaSignupData {
  // Basic Information
  email: string;
  fullName: string;
  phone: string;
  country: string;
  timezone: string;
  
  // Professional Information
  role: string;
  jobTitle: string;
  yearsInAviation: number;
  primaryAircraftTypes: string[];
  fleetSize: number;
  annualFlightHours: number;
  
  // Business Information
  companyName: string;
  companyType: string;
  businessRegistrationNumber: string;
  operatingCountries: string[];
  currentSoftwareTools: string[];
  
  // Platform Preferences
  primaryUseCase: string;
  expectedMonthlyVolume: number;
  budgetRange: string;
  preferredCommunication: string;
  
  // Beta Testing Commitment
  availabilityHoursPerWeek: number;
  preferredTestingSchedule: string;
  feedbackMethodPreference: string;
  willingToInterview: boolean;
  ndaAgreed: boolean;
  
  // Metadata
  source: string;
  referralCode: string;
}

const AIRCRAFT_TYPES = [
  'Gulfstream G650',
  'Gulfstream G550',
  'Bombardier Global 7500',
  'Bombardier Challenger 350',
  'Cessna Citation X+',
  'Cessna Citation CJ3+',
  'Dassault Falcon 8X',
  'Dassault Falcon 7X',
  'Embraer Legacy 650E',
  'Pilatus PC-24',
  'Other'
];

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Switzerland',
  'Italy', 'Spain', 'Netherlands', 'Belgium', 'Austria', 'Sweden', 'Norway',
  'Denmark', 'Finland', 'Ireland', 'Portugal', 'Luxembourg', 'Monaco',
  'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain',
  'Singapore', 'Hong Kong', 'Japan', 'Australia', 'New Zealand', 'Other'
];

const SOFTWARE_TOOLS = [
  'FlightAware', 'ForeFlight', 'Garmin Pilot', 'Jeppesen', 'SITA', 'ARINC',
  'ACARS', 'EFB', 'Flight Planning Software', 'Maintenance Software',
  'Crew Scheduling Software', 'Custom Solutions', 'Other'
];

export default function BetaSignupForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BetaSignupData>({
    email: '',
    fullName: '',
    phone: '',
    country: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    role: '',
    jobTitle: '',
    yearsInAviation: 0,
    primaryAircraftTypes: [],
    fleetSize: 0,
    annualFlightHours: 0,
    companyName: '',
    companyType: '',
    businessRegistrationNumber: '',
    operatingCountries: [],
    currentSoftwareTools: [],
    primaryUseCase: '',
    expectedMonthlyVolume: 0,
    budgetRange: '',
    preferredCommunication: 'email',
    availabilityHoursPerWeek: 0,
    preferredTestingSchedule: '',
    feedbackMethodPreference: 'in_app',
    willingToInterview: false,
    ndaAgreed: false,
    source: 'website',
    referralCode: ''
  });

  const { toast } = useToast();

  const handleInputChange = (field: keyof BetaSignupData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: keyof BetaSignupData, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.email && formData.fullName && formData.country;
      case 2:
        return formData.role && formData.jobTitle && formData.yearsInAviation > 0;
      case 3:
        return formData.companyName && formData.companyType;
      case 4:
        return formData.primaryUseCase && formData.expectedMonthlyVolume > 0;
      case 5:
        return formData.availabilityHoursPerWeek > 0 && formData.ndaAgreed;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!isStepValid(6)) {
      toast({
        title: "Incomplete Form",
        description: "Please complete all required fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('beta_signups' as any)
        .insert([{
          email: formData.email,
          full_name: formData.fullName,
          phone: formData.phone,
          country: formData.country,
          role: formData.role,
          job_title: formData.jobTitle,
          years_in_aviation: formData.yearsInAviation,
          primary_aircraft_types: formData.primaryAircraftTypes,
          fleet_size: formData.fleetSize,
          annual_flight_hours: formData.annualFlightHours,
          company_name: formData.companyName,
          company_type: formData.companyType,
          business_registration_number: formData.businessRegistrationNumber,
          operating_countries: formData.operatingCountries,
          current_software_tools: formData.currentSoftwareTools,
          primary_use_case: formData.primaryUseCase,
          expected_monthly_volume: formData.expectedMonthlyVolume,
          budget_range: formData.budgetRange,
          preferred_communication: formData.preferredCommunication,
          availability_hours_per_week: formData.availabilityHoursPerWeek,
          preferred_testing_schedule: formData.preferredTestingSchedule,
          feedback_method_preference: formData.feedbackMethodPreference,
          willing_to_interview: formData.willingToInterview,
          nda_agreed: formData.ndaAgreed,
          source: formData.source,
          referral_code: formData.referralCode
        }]);

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest in StratusConnect Beta. We'll review your application and get back to you within 48 hours.",
      });

      // Reset form
      setFormData({
        email: '',
        fullName: '',
        phone: '',
        country: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        role: '',
        jobTitle: '',
        yearsInAviation: 0,
        primaryAircraftTypes: [],
        fleetSize: 0,
        annualFlightHours: 0,
        companyName: '',
        companyType: '',
        businessRegistrationNumber: '',
        operatingCountries: [],
        currentSoftwareTools: [],
        primaryUseCase: '',
        expectedMonthlyVolume: 0,
        budgetRange: '',
        preferredCommunication: 'email',
        availabilityHoursPerWeek: 0,
        preferredTestingSchedule: '',
        feedbackMethodPreference: 'in_app',
        willingToInterview: false,
        ndaAgreed: false,
        source: 'website',
        referralCode: ''
      });
      setCurrentStep(1);

    } catch (error) {
      console.error('Error submitting beta signup:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Plane className="w-8 h-8 text-accent mr-2" />
            <CardTitle className="text-2xl">StratusConnect Beta Application</CardTitle>
          </div>
          <CardDescription>
            Join our exclusive beta program and help shape the future of aviation technology
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-accent text-white' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
                {step < 6 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step < currentStep ? 'bg-accent' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <Tabs value={currentStep.toString()} className="w-full">
            {/* Step 1: Basic Information */}
            <TabsContent value="1" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Step 2: Professional Information */}
            <TabsContent value="2" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="broker">Aviation Broker</SelectItem>
                      <SelectItem value="operator">Aircraft Operator</SelectItem>
                      <SelectItem value="pilot">Pilot</SelectItem>
                      <SelectItem value="crew">Crew Member</SelectItem>
                      <SelectItem value="ground_support">Ground Support</SelectItem>
                      <SelectItem value="other">Other Aviation Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g., Chief Pilot, Operations Manager"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsInAviation">Years in Aviation *</Label>
                  <Input
                    id="yearsInAviation"
                    type="number"
                    min="0"
                    placeholder="5"
                    value={formData.yearsInAviation}
                    onChange={(e) => handleInputChange('yearsInAviation', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fleetSize">Fleet Size (if applicable)</Label>
                  <Input
                    id="fleetSize"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.fleetSize}
                    onChange={(e) => handleInputChange('fleetSize', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Primary Aircraft Types</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {AIRCRAFT_TYPES.map(aircraft => (
                    <div key={aircraft} className="flex items-center space-x-2">
                      <Checkbox
                        id={aircraft}
                        checked={formData.primaryAircraftTypes.includes(aircraft)}
                        onCheckedChange={(checked) => 
                          handleArrayChange('primaryAircraftTypes', aircraft, checked as boolean)
                        }
                      />
                      <Label htmlFor={aircraft} className="text-sm">{aircraft}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Step 3: Business Information */}
            <TabsContent value="3" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    placeholder="Your Company Ltd."
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyType">Company Type *</Label>
                  <Select value={formData.companyType} onValueChange={(value) => handleInputChange('companyType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private_jet_operator">Private Jet Operator</SelectItem>
                      <SelectItem value="charter_company">Charter Company</SelectItem>
                      <SelectItem value="corporate_flight_dept">Corporate Flight Department</SelectItem>
                      <SelectItem value="aviation_broker">Aviation Broker</SelectItem>
                      <SelectItem value="ground_support">Ground Support Company</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessRegistrationNumber">Business Registration Number</Label>
                  <Input
                    id="businessRegistrationNumber"
                    placeholder="Company registration number"
                    value={formData.businessRegistrationNumber}
                    onChange={(e) => handleInputChange('businessRegistrationNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annualFlightHours">Annual Flight Hours (for pilots)</Label>
                  <Input
                    id="annualFlightHours"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.annualFlightHours}
                    onChange={(e) => handleInputChange('annualFlightHours', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Operating Countries</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {COUNTRIES.map(country => (
                    <div key={country} className="flex items-center space-x-2">
                      <Checkbox
                        id={`country-${country}`}
                        checked={formData.operatingCountries.includes(country)}
                        onCheckedChange={(checked) => 
                          handleArrayChange('operatingCountries', country, checked as boolean)
                        }
                      />
                      <Label htmlFor={`country-${country}`} className="text-sm">{country}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Current Software/Tools Used</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SOFTWARE_TOOLS.map(tool => (
                    <div key={tool} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tool-${tool}`}
                        checked={formData.currentSoftwareTools.includes(tool)}
                        onCheckedChange={(checked) => 
                          handleArrayChange('currentSoftwareTools', tool, checked as boolean)
                        }
                      />
                      <Label htmlFor={`tool-${tool}`} className="text-sm">{tool}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Step 4: Platform Preferences */}
            <TabsContent value="4" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="primaryUseCase">Primary Use Case *</Label>
                <Textarea
                  id="primaryUseCase"
                  placeholder="Describe how you plan to use StratusConnect..."
                  value={formData.primaryUseCase}
                  onChange={(e) => handleInputChange('primaryUseCase', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="expectedMonthlyVolume">Expected Monthly Volume *</Label>
                  <Input
                    id="expectedMonthlyVolume"
                    type="number"
                    min="0"
                    placeholder="Number of flights/deals per month"
                    value={formData.expectedMonthlyVolume}
                    onChange={(e) => handleInputChange('expectedMonthlyVolume', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetRange">Budget Range</Label>
                  <Select value={formData.budgetRange} onValueChange={(value) => handleInputChange('budgetRange', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under_1k">Under $1,000/month</SelectItem>
                      <SelectItem value="1k_5k">$1,000 - $5,000/month</SelectItem>
                      <SelectItem value="5k_10k">$5,000 - $10,000/month</SelectItem>
                      <SelectItem value="10k_25k">$10,000 - $25,000/month</SelectItem>
                      <SelectItem value="25k_50k">$25,000 - $50,000/month</SelectItem>
                      <SelectItem value="over_50k">Over $50,000/month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredCommunication">Preferred Communication</Label>
                  <Select value={formData.preferredCommunication} onValueChange={(value) => handleInputChange('preferredCommunication', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select communication method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="in_app">In-App Messages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Step 5: Beta Testing Commitment */}
            <TabsContent value="5" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="availabilityHoursPerWeek">Availability (Hours per Week) *</Label>
                  <Input
                    id="availabilityHoursPerWeek"
                    type="number"
                    min="1"
                    max="40"
                    placeholder="5"
                    value={formData.availabilityHoursPerWeek}
                    onChange={(e) => handleInputChange('availabilityHoursPerWeek', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredTestingSchedule">Preferred Testing Schedule</Label>
                  <Input
                    id="preferredTestingSchedule"
                    placeholder="e.g., Weekdays 9-5, Weekends"
                    value={formData.preferredTestingSchedule}
                    onChange={(e) => handleInputChange('preferredTestingSchedule', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feedbackMethodPreference">Feedback Method Preference</Label>
                  <Select value={formData.feedbackMethodPreference} onValueChange={(value) => handleInputChange('feedbackMethodPreference', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select feedback method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_app">In-App Feedback</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone_interview">Phone Interview</SelectItem>
                      <SelectItem value="video_call">Video Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="willingToInterview"
                    checked={formData.willingToInterview}
                    onCheckedChange={(checked) => handleInputChange('willingToInterview', checked as boolean)}
                  />
                  <Label htmlFor="willingToInterview">I'm willing to participate in user interviews</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ndaAgreed"
                    checked={formData.ndaAgreed}
                    onCheckedChange={(checked) => handleInputChange('ndaAgreed', checked as boolean)}
                  />
                  <Label htmlFor="ndaAgreed" className="text-sm">
                    I agree to the <a href="/terms" className="text-accent hover:underline">Terms of Service</a> and <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a> *
                  </Label>
                </div>
              </div>
            </TabsContent>

            {/* Step 6: Review & Submit */}
            <TabsContent value="6" className="space-y-6">
              <div className="text-center mb-6">
                <Shield className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Review Your Application</h3>
                <p className="text-muted-foreground">Please review your information before submitting</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground">{formData.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <p className="text-sm text-muted-foreground">{formData.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Role</Label>
                    <p className="text-sm text-muted-foreground">{formData.role}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Company</Label>
                    <p className="text-sm text-muted-foreground">{formData.companyName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Years in Aviation</Label>
                    <p className="text-sm text-muted-foreground">{formData.yearsInAviation}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Availability</Label>
                    <p className="text-sm text-muted-foreground">{formData.availabilityHoursPerWeek} hours/week</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">What happens next?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• We'll review your application within 48 hours</li>
                  <li>• If approved, you'll receive beta access credentials</li>
                  <li>• You'll get access to our private beta community</li>
                  <li>• We'll send you regular updates and new features to test</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < 6 ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading || !isStepValid(6)}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
