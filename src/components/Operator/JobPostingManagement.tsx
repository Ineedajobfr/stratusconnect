import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  Plane, 
  Calendar,
  Users,
  Star,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Briefcase,
  FileText,
  Zap
} from 'lucide-react';

interface JobPosting {
  id: string;
  title: string;
  aircraftType: string;
  route: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  dayRate: number;
  totalPay: number;
  description: string;
  requirements: string[];
  specialRequirements: string[];
  status: 'draft' | 'posted' | 'filled' | 'cancelled';
  postedDate: string;
  applicationsCount: number;
  selectedCrew: string[];
  selectedPilots: string[];
  isUrgent: boolean;
  contractType: 'one-off' | 'rotation' | 'long-term';
  region: string;
  client: string;
  briefingPackUrl?: string;
}

interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  applicantName: string;
  applicantType: 'pilot' | 'crew';
  rating: number;
  experience: number;
  aircraftHours: number;
  languages: string[];
  specializations: string[];
  appliedDate: string;
  status: 'pending' | 'shortlisted' | 'selected' | 'rejected';
  coverLetter: string;
  availability: string;
}

export default function JobPostingManagement({ terminalType }: { terminalType: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  const [jobPostings, setJobPostings] = useState<JobPosting[]>([
    {
      id: 'job-001',
      title: 'Gulfstream G650 - London to Dubai Charter',
      aircraftType: 'Gulfstream G650',
      route: 'London (LHR) → Dubai (DXB)',
      date: '2025-09-25',
      startTime: '10:00',
      endTime: '18:00',
      duration: '8 hours',
      dayRate: 1200,
      totalPay: 1200,
      description: 'VIP charter flight for high-profile client. Premium service required.',
      requirements: ['G650 Type Rating', '500+ hours on type', 'Valid medical'],
      specialRequirements: ['VIP service experience', 'French language', 'Halal catering knowledge'],
      status: 'posted',
      postedDate: '2025-09-19',
      applicationsCount: 8,
      selectedCrew: ['crew-001', 'crew-002'],
      selectedPilots: ['pilot-001'],
      isUrgent: false,
      contractType: 'one-off',
      region: 'Europe',
      client: 'Global Investment Corp',
      briefingPackUrl: '/briefings/briefing-001.pdf'
    },
    {
      id: 'job-002',
      title: 'Bombardier Global 7500 - European Rotation',
      aircraftType: 'Bombardier Global 7500',
      route: 'Various European destinations',
      date: '2025-10-01',
      startTime: '08:00',
      endTime: '20:00',
      duration: '2 weeks',
      dayRate: 1500,
      totalPay: 21000,
      description: 'Two-week rotation covering European business routes.',
      requirements: ['Global 7500 Type Rating', '1000+ hours on type', 'CRM current'],
      specialRequirements: ['Multi-language preferred', 'Business aviation experience'],
      status: 'filled',
      postedDate: '2025-09-18',
      applicationsCount: 12,
      selectedCrew: ['crew-003', 'crew-004'],
      selectedPilots: ['pilot-002'],
      isUrgent: false,
      contractType: 'rotation',
      region: 'Europe',
      client: 'Luxury Travel Inc'
    },
    {
      id: 'job-003',
      title: 'URGENT: Cessna Citation XLS+ - Same Day',
      aircraftType: 'Cessna Citation XLS+',
      route: 'London (LTN) → Geneva (GVA)',
      date: '2025-09-20',
      startTime: '14:00',
      endTime: '18:00',
      duration: 'Same day',
      dayRate: 2000,
      totalPay: 2000,
      description: 'Urgent medical transport flight. Departure within 4 hours.',
      requirements: ['Citation XLS+ Type Rating', 'Valid medical', 'Available immediately'],
      specialRequirements: ['Medical training', 'Emergency response experience'],
      status: 'posted',
      postedDate: '2025-09-20',
      applicationsCount: 3,
      selectedCrew: [],
      selectedPilots: [],
      isUrgent: true,
      contractType: 'one-off',
      region: 'Europe',
      client: 'Medical Transport Ltd'
    }
  ]);

  const [applications] = useState<Application[]>([
    {
      id: 'app-001',
      jobId: 'job-001',
      applicantId: 'pilot-001',
      applicantName: 'Captain James Mitchell',
      applicantType: 'pilot',
      rating: 4.9,
      experience: 8,
      aircraftHours: 2500,
      languages: ['English', 'French'],
      specializations: ['G650 Type Rating', 'VIP Operations'],
      appliedDate: '2025-09-19',
      status: 'selected',
      coverLetter: 'Experienced G650 pilot with extensive VIP operations background.',
      availability: 'Available immediately'
    },
    {
      id: 'app-002',
      jobId: 'job-001',
      applicantId: 'crew-001',
      applicantName: 'Sophie Chen',
      applicantType: 'crew',
      rating: 4.8,
      experience: 5,
      aircraftHours: 0,
      languages: ['English', 'French', 'Mandarin'],
      specializations: ['VIP Service', 'Wine Knowledge', 'Medical Training'],
      appliedDate: '2025-09-19',
      status: 'selected',
      coverLetter: 'Professional cabin crew with VIP service expertise.',
      availability: 'Available for the full duration'
    }
  ]);

  const filteredJobs = jobPostings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.aircraftType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || job.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'posted': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'filled': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'one-off': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'rotation': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'long-term': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'shortlisted': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'selected': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const jobApplications = selectedJob ? applications.filter(app => app.jobId === selectedJob.id) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="terminal-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-accent" />
              Job Posting Management
            </CardTitle>
            <Button onClick={() => setIsCreatingJob(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Job Posting
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, aircraft, clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="h-9 px-3 py-1 bg-terminal-input-bg border border-terminal-input-border rounded-md text-sm flex-1"
              >
                <option value="all">All Jobs</option>
                <option value="draft">Draft</option>
                <option value="posted">Posted</option>
                <option value="filled">Filled</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              {filteredJobs.length} jobs
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Postings List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Job Postings</h3>
          {filteredJobs.map(job => (
            <Card key={job.id} className="terminal-card hover:terminal-glow transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-foreground">{job.title}</h4>
                      {job.isUrgent && (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                          <Zap className="w-3 h-3 mr-1" />
                          URGENT
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Aircraft</p>
                        <p className="text-sm font-medium">{job.aircraftType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Route</p>
                        <p className="text-sm font-medium">{job.route}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date & Time</p>
                        <p className="text-sm font-medium">{new Date(job.date).toLocaleDateString()} • {job.startTime} - {job.endTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Day Rate</p>
                        <p className="text-sm font-medium">£{job.dayRate.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <Badge className={getStatusColor(job.status)}>
                        {job.status.toUpperCase()}
                      </Badge>
                      <Badge className={getContractTypeColor(job.contractType)}>
                        {job.contractType.replace('-', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {job.applicationsCount} applications
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">{job.description}</p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedJob(job)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Client: {job.client}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Posted: {new Date(job.postedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {job.briefingPackUrl && (
                      <Button size="sm" variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        Briefing
                      </Button>
                    )}
                    <Button size="sm">
                      <Users className="w-4 h-4 mr-2" />
                      View Applications
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Applications Panel */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Applications {selectedJob ? `for ${selectedJob.title}` : ''}
          </h3>
          
          {selectedJob ? (
            <div className="space-y-4">
              {jobApplications.map(application => (
                <Card key={application.id} className="terminal-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-foreground">{application.applicantName}</h4>
                          <Badge className={getApplicationStatusColor(application.status)}>
                            {application.status.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {application.applicantType.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Rating</p>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">{application.rating}/5</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Experience</p>
                            <p className="text-sm font-medium">{application.experience} years</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Aircraft Hours</p>
                            <p className="text-sm font-medium">{application.aircraftHours.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Languages</p>
                            <p className="text-sm font-medium">{application.languages.join(', ')}</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-muted-foreground mb-1">Specializations</p>
                          <div className="flex flex-wrap gap-1">
                            {application.specializations.map(spec => (
                              <Badge key={spec} variant="outline" className="text-xs">{spec}</Badge>
                            ))}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">{application.coverLetter}</p>
                        <p className="text-sm text-accent">Availability: {application.availability}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Applied: {new Date(application.appliedDate).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Profile
                        </Button>
                        <Button size="sm" variant="outline">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Select
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="terminal-card">
              <CardContent className="text-center py-12">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Select a job to view applications</h3>
                <p className="text-muted-foreground">
                  Click on a job posting to see all applications and manage candidates.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
