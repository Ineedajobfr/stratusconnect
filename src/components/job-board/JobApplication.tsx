import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Clock, Star, DollarSign, Calendar, MapPin, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface JobPost {
  id: string;
  title: string;
  description: string;
  job_type: 'pilot' | 'crew' | 'both';
  category: {
    name: string;
    icon: string;
  };
  location: string;
  start_date: string;
  end_date: string;
  hourly_rate: number;
  total_budget: number;
  required_skills: string[];
  preferred_skills: string[];
  minimum_experience_years: number;
  aircraft_types: string[];
  flight_hours_required: number;
  certifications_required: string[];
  languages_required: string[];
  timezone: string;
  remote_work_allowed: boolean;
  status: string;
  application_deadline: string;
  max_applications: number;
  current_applications: number;
  is_featured: boolean;
  priority_level: number;
  posted_by: string;
  company: {
    name: string;
    logo: string;
  };
  created_at: string;
}

interface UserProfile {
  id: string;
  role: 'pilot' | 'crew' | 'broker' | 'operator';
  experience_years: number;
  total_flight_hours: number;
  skills: string[];
  certifications: string[];
  languages: string[];
  aircraft_types: string[];
  hourly_rate_min: number;
  hourly_rate_max: number;
  availability_start: string;
  availability_end: string;
  portfolio_urls: string[];
}

interface JobApplicationProps {
  jobId: string;
  onClose: () => void;
}

export default function JobApplication({ jobId, onClose }: JobApplicationProps) {
  const { user } = useAuth();
  const [job, setJob] = useState<JobPost | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [application, setApplication] = useState({
    cover_letter: '',
    proposed_rate: 0,
    availability_start: '',
    availability_end: '',
    relevant_experience: '',
    additional_skills: [] as string[],
    portfolio_urls: [] as string[]
  });
  const [skillsMatch, setSkillsMatch] = useState(0);
  const [experienceMatch, setExperienceMatch] = useState(0);
  const [overallScore, setOverallScore] = useState(0);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockJob: JobPost = {
      id: jobId,
      title: 'Senior Captain - Gulfstream G650',
      description: 'Seeking experienced Gulfstream G650 captain for corporate operations. Must have 5000+ hours total time, 1000+ hours in type.',
      job_type: 'pilot',
      category: { name: 'Commercial Pilot', icon: '✈️' },
      location: 'New York, NY',
      start_date: '2024-02-01',
      end_date: '2024-12-31',
      hourly_rate: 150.00,
      total_budget: 500000,
      required_skills: ['Gulfstream G650', 'ATP', 'Type Rating', 'International Experience'],
      preferred_skills: ['Gulfstream G550', 'FAA Part 135', 'Corporate Experience'],
      minimum_experience_years: 5,
      aircraft_types: ['Gulfstream G650'],
      flight_hours_required: 5000,
      certifications_required: ['ATP', 'G650 Type Rating', 'First Class Medical'],
      languages_required: ['English'],
      timezone: 'EST',
      remote_work_allowed: false,
      status: 'active',
      application_deadline: '2024-01-25T23:59:59Z',
      max_applications: 50,
      current_applications: 12,
      is_featured: true,
      priority_level: 5,
      posted_by: 'corp-aviation-llc',
      company: { name: 'Corporate Aviation LLC', logo: '/logos/corp-aviation.png' },
      created_at: '2024-01-15T10:00:00Z'
    };

    const mockUserProfile: UserProfile = {
      id: user?.id || '',
      role: 'pilot',
      experience_years: 8,
      total_flight_hours: 6500,
      skills: ['Gulfstream G650', 'Gulfstream G550', 'ATP', 'Type Rating', 'International Experience', 'FAA Part 135'],
      certifications: ['ATP', 'G650 Type Rating', 'G550 Type Rating', 'First Class Medical', 'FAA Part 135'],
      languages: ['English', 'Spanish'],
      aircraft_types: ['Gulfstream G650', 'Gulfstream G550', 'Bombardier Global 6000'],
      hourly_rate_min: 120,
      hourly_rate_max: 180,
      availability_start: '2024-02-01',
      availability_end: '2024-12-31',
      portfolio_urls: ['https://linkedin.com/in/pilot', 'https://portfolio.pilot.com']
    };

    setJob(mockJob);
    setUserProfile(mockUserProfile);
    setApplication(prev => ({
      ...prev,
      proposed_rate: mockJob.hourly_rate,
      availability_start: mockJob.start_date,
      availability_end: mockJob.end_date
    }));
    setLoading(false);
  }, [jobId, user]);

  // Calculate match percentages
  useEffect(() => {
    if (job && userProfile) {
      // Calculate skills match
      const requiredSkills = job.required_skills;
      const userSkills = userProfile.skills;
      const matchingSkills = requiredSkills.filter(skill => userSkills.includes(skill));
      const skillsMatchPercent = Math.round((matchingSkills.length / requiredSkills.length) * 100);
      setSkillsMatch(skillsMatchPercent);

      // Calculate experience match
      const experienceMatchPercent = Math.min(100, Math.round((userProfile.experience_years / job.minimum_experience_years) * 100));
      setExperienceMatch(experienceMatchPercent);

      // Calculate overall score
      const overall = Math.round((skillsMatchPercent + experienceMatchPercent) / 2);
      setOverallScore(overall);
    }
  }, [job, userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // TODO: Implement actual API call
      console.log('Submitting application:', application);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      alert('Application submitted successfully!');
      onClose();
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 text-green-500 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
    return 'bg-red-500/20 text-red-500 border-red-500/30';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terminal-accent"></div>
      </div>
    );
  }

  if (!job || !userProfile) {
    return (
      <Alert className="bg-terminal-bg border-terminal-border">
        <XCircle className="h-4 w-4" />
        <AlertDescription className="text-terminal-fg">
          Job or user profile not found.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Job Header */}
      <Card className="bg-terminal-bg border-terminal-border">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{job.category.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-terminal-fg">{job.title}</h2>
                <p className="text-terminal-muted">{job.company.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onClose} className="border-terminal-border text-terminal-fg">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Match Analysis */}
      <Card className="bg-terminal-bg border-terminal-border">
        <CardHeader>
          <CardTitle className="text-terminal-fg">Application Match Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(skillsMatch)}`}>
                {skillsMatch}%
              </div>
              <div className="text-sm text-terminal-muted">Skills Match</div>
              <Badge className={`mt-2 ${getScoreBadgeColor(skillsMatch)}`}>
                {skillsMatch >= 80 ? 'Excellent' : skillsMatch >= 60 ? 'Good' : 'Needs Improvement'}
              </Badge>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(experienceMatch)}`}>
                {experienceMatch}%
              </div>
              <div className="text-sm text-terminal-muted">Experience Match</div>
              <Badge className={`mt-2 ${getScoreBadgeColor(experienceMatch)}`}>
                {experienceMatch >= 80 ? 'Excellent' : experienceMatch >= 60 ? 'Good' : 'Needs Improvement'}
              </Badge>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}%
              </div>
              <div className="text-sm text-terminal-muted">Overall Score</div>
              <Badge className={`mt-2 ${getScoreBadgeColor(overallScore)}`}>
                {overallScore >= 80 ? 'Strong Match' : overallScore >= 60 ? 'Good Match' : 'Consider Improving'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-terminal-bg border-terminal-border">
          <CardHeader>
            <CardTitle className="text-terminal-fg">Application Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="proposed_rate" className="text-terminal-fg">
                  Proposed Rate (per hour)
                </Label>
                <Input
                  id="proposed_rate"
                  type="number"
                  step="0.01"
                  value={application.proposed_rate}
                  onChange={(e) => setApplication(prev => ({
                    ...prev,
                    proposed_rate: parseFloat(e.target.value) || 0
                  }))}
                  className="bg-terminal-bg border-terminal-border text-terminal-fg"
                />
                <p className="text-sm text-terminal-muted mt-1">
                  Job posting rate: {formatCurrency(job.hourly_rate)}
                </p>
              </div>
              
              <div>
                <Label htmlFor="availability_start" className="text-terminal-fg">
                  Available From
                </Label>
                <Input
                  id="availability_start"
                  type="date"
                  value={application.availability_start}
                  onChange={(e) => setApplication(prev => ({
                    ...prev,
                    availability_start: e.target.value
                  }))}
                  className="bg-terminal-bg border-terminal-border text-terminal-fg"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="availability_end" className="text-terminal-fg">
                Available Until
              </Label>
              <Input
                id="availability_end"
                type="date"
                value={application.availability_end}
                onChange={(e) => setApplication(prev => ({
                  ...prev,
                  availability_end: e.target.value
                }))}
                className="bg-terminal-bg border-terminal-border text-terminal-fg"
              />
            </div>

            <div>
              <Label htmlFor="cover_letter" className="text-terminal-fg">
                Cover Letter
              </Label>
              <Textarea
                id="cover_letter"
                value={application.cover_letter}
                onChange={(e) => setApplication(prev => ({
                  ...prev,
                  cover_letter: e.target.value
                }))}
                placeholder="Tell us why you're the perfect fit for this position..."
                className="bg-terminal-bg border-terminal-border text-terminal-fg min-h-[120px]"
              />
            </div>

            <div>
              <Label htmlFor="relevant_experience" className="text-terminal-fg">
                Relevant Experience
              </Label>
              <Textarea
                id="relevant_experience"
                value={application.relevant_experience}
                onChange={(e) => setApplication(prev => ({
                  ...prev,
                  relevant_experience: e.target.value
                }))}
                placeholder="Describe your relevant experience for this position..."
                className="bg-terminal-bg border-terminal-border text-terminal-fg min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="portfolio_urls" className="text-terminal-fg">
                Portfolio URLs (one per line)
              </Label>
              <Textarea
                id="portfolio_urls"
                value={application.portfolio_urls.join('\n')}
                onChange={(e) => setApplication(prev => ({
                  ...prev,
                  portfolio_urls: e.target.value.split('\n').filter(url => url.trim())
                }))}
                placeholder="https://linkedin.com/in/yourprofile&#10;https://yourportfolio.com"
                className="bg-terminal-bg border-terminal-border text-terminal-fg min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills Comparison */}
        <Card className="bg-terminal-bg border-terminal-border">
          <CardHeader>
            <CardTitle className="text-terminal-fg">Skills Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-terminal-fg mb-3">Required Skills</h4>
                <div className="space-y-2">
                  {job.required_skills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {userProfile.skills.includes(skill) ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-terminal-fg">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-terminal-fg mb-3">Your Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {userProfile.skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className={`${
                        job.required_skills.includes(skill) 
                          ? 'bg-green-500/20 text-green-500 border-green-500/30' 
                          : 'bg-terminal-muted text-terminal-fg'
                      }`}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="border-terminal-border text-terminal-fg"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={submitting}
            className="bg-terminal-accent hover:bg-terminal-accent/90"
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </div>
      </form>
    </div>
  );
}
