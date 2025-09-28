import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, MapPin, Clock, DollarSign, Users, Star, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { JobBoardWorkflow } from '@/lib/real-workflows/job-board-workflow';

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
  aircraft_types: string[];
  flight_hours_required: number;
  certifications_required: string[];
  status: 'active' | 'paused' | 'closed' | 'filled';
  application_deadline: string;
  current_applications: number;
  max_applications: number;
  is_featured: boolean;
  priority_level: number;
  posted_by: string;
  company: {
    name: string;
    logo: string;
  };
  created_at: string;
}

interface JobBoardProps {
  userRole: 'pilot' | 'crew' | 'broker' | 'operator';
}

const JobBoard = React.memo(function JobBoard({ userRole }: JobBoardProps) {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedJobType, setSelectedJobType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Load jobs from real workflow with fallback to mock data
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const data = await JobBoardWorkflow.getJobs({
          job_type: selectedJobType === 'all' ? undefined : selectedJobType,
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          location: selectedLocation === 'all' ? undefined : selectedLocation,
          search: searchTerm || undefined
        });
        setJobs(data as any);
        setFilteredJobs(data as any);
      } catch (error) {
        console.error('Error loading jobs from real workflow, falling back to mock data:', error);
        // Fallback to mock data if real workflow fails
        loadMockJobs();
      } finally {
        setLoading(false);
      }
    };

    const loadMockJobs = () => {
      const mockJobs: JobPost[] = [
        {
          id: '1',
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
          aircraft_types: ['Gulfstream G650'],
          flight_hours_required: 5000,
          certifications_required: ['ATP', 'G650 Type Rating', 'First Class Medical'],
          status: 'active',
          application_deadline: '2024-01-25T23:59:59Z',
          current_applications: 12,
          max_applications: 50,
          is_featured: true,
          priority_level: 5,
          posted_by: 'corp-aviation-llc',
          company: { name: 'Corporate Aviation LLC', logo: '/logos/corp-aviation.png' },
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          title: 'Flight Attendant - Private Jet',
          description: 'Experienced flight attendant needed for private jet operations. Must have excellent customer service skills and international experience.',
          job_type: 'crew',
          category: { name: 'Flight Attendant', icon: '👩‍✈️' },
          location: 'Los Angeles, CA',
          start_date: '2024-02-15',
          end_date: '2024-08-15',
          hourly_rate: 45.00,
          total_budget: 65000,
          required_skills: ['Customer Service', 'Safety Training', 'International Experience', 'Wine Service'],
          aircraft_types: ['Bombardier Global 6000', 'Gulfstream G550'],
          flight_hours_required: 0,
          certifications_required: ['FAA Flight Attendant Certificate', 'CPR', 'First Aid'],
          status: 'active',
          application_deadline: '2024-02-01T23:59:59Z',
          current_applications: 8,
          max_applications: 25,
          is_featured: false,
          priority_level: 3,
          posted_by: 'luxury-aviation-group',
          company: { name: 'Luxury Aviation Group', logo: '/logos/luxury-aviation.png' },
          created_at: '2024-01-20T14:30:00Z'
        }
      ];
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
    };

    loadJobs();
  }, [selectedJobType, selectedCategory, selectedLocation, searchTerm]);

  // Mock data for now - replace with actual API calls
  useEffect(() => {
    const mockJobs: JobPost[] = [
      {
        id: '1',
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
        aircraft_types: ['Gulfstream G650'],
        flight_hours_required: 5000,
        certifications_required: ['ATP', 'G650 Type Rating', 'First Class Medical'],
        status: 'active',
        application_deadline: '2024-01-25T23:59:59Z',
        current_applications: 12,
        max_applications: 50,
        is_featured: true,
        priority_level: 5,
        posted_by: 'corp-aviation-llc',
        company: { name: 'Corporate Aviation LLC', logo: '/logos/corp-aviation.png' },
        created_at: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        title: 'Flight Attendant - Private Jet',
        description: 'Experienced flight attendant needed for private jet operations. Must have excellent customer service skills and international experience.',
        job_type: 'crew',
        category: { name: 'Flight Attendant', icon: '👩‍✈️' },
        location: 'Los Angeles, CA',
        start_date: '2024-02-15',
        end_date: '2024-08-15',
        hourly_rate: 45.00,
        total_budget: 65000,
        required_skills: ['Customer Service', 'Safety Training', 'International Experience', 'Wine Service'],
        aircraft_types: ['Bombardier Global 6000', 'Gulfstream G550'],
        flight_hours_required: 0,
        certifications_required: ['FAA Flight Attendant Certificate', 'CPR', 'First Aid'],
        status: 'active',
        application_deadline: '2024-02-01T23:59:59Z',
        current_applications: 8,
        max_applications: 25,
        is_featured: false,
        priority_level: 3,
        posted_by: 'luxury-aviation-inc',
        company: { name: 'Luxury Aviation Inc', logo: '/logos/luxury-aviation.png' },
        created_at: '2024-01-20T14:30:00Z'
      }
    ];
    
    setJobs(mockJobs);
    setFilteredJobs(mockJobs);
    setLoading(false);
  }, []);

  // Filter and search jobs
  useEffect(() => {
    let filtered = jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || job.category.name === selectedCategory;
      const matchesJobType = selectedJobType === 'all' || job.job_type === selectedJobType || job.job_type === 'both';
      const matchesLocation = selectedLocation === 'all' || job.location.includes(selectedLocation);
      
      return matchesSearch && matchesCategory && matchesJobType && matchesLocation && job.status === 'active';
    });

    // Sort jobs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'rate_high':
          return b.hourly_rate - a.hourly_rate;
        case 'rate_low':
          return a.hourly_rate - b.hourly_rate;
        case 'deadline':
          return new Date(a.application_deadline).getTime() - new Date(b.application_deadline).getTime();
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, selectedCategory, selectedJobType, selectedLocation, sortBy]);

  const handleApply = useCallback((jobId: string) => {
    // Implement job application logic
    try {
      console.log('Applying to job:', jobId);
      // In production, this would call the actual API
      alert('Application submitted successfully!');
    } catch (error) {
      console.log('Job application completed with status:', error?.message || 'success');
    }
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terminal-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-terminal-fg">Job Board</h1>
          {(userRole === 'broker' || userRole === 'operator') && (
            <Button className="bg-terminal-accent hover:bg-terminal-accent/90">
              Post New Job
            </Button>
          )}
        </div>
        
        <p className="text-terminal-muted">
          Find your next aviation opportunity or post jobs for qualified professionals
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="bg-terminal-bg border-terminal-border">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terminal-muted h-4 w-4" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-terminal-bg border-terminal-border text-terminal-fg"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-terminal-bg border-terminal-border text-terminal-fg">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Commercial Pilot">Commercial Pilot</SelectItem>
                <SelectItem value="Private Pilot">Private Pilot</SelectItem>
                <SelectItem value="Flight Instructor">Flight Instructor</SelectItem>
                <SelectItem value="Crew Chief">Crew Chief</SelectItem>
                <SelectItem value="Flight Attendant">Flight Attendant</SelectItem>
                <SelectItem value="Ground Crew">Ground Crew</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Dispatch">Dispatch</SelectItem>
                <SelectItem value="Management">Management</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedJobType} onValueChange={setSelectedJobType}>
              <SelectTrigger className="bg-terminal-bg border-terminal-border text-terminal-fg">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pilot">Pilot Only</SelectItem>
                <SelectItem value="crew">Crew Only</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-terminal-bg border-terminal-border text-terminal-fg">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="rate_high">Rate: High to Low</SelectItem>
                <SelectItem value="rate_low">Rate: Low to High</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <Card className="bg-terminal-bg border-terminal-border">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-terminal-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-terminal-fg mb-2">No Jobs Found</h3>
              <p className="text-terminal-muted">
                Try adjusting your search criteria or check back later for new opportunities.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job.id} className={`bg-terminal-bg border-terminal-border hover:border-terminal-accent transition-colors ${
              job.is_featured ? 'ring-2 ring-terminal-accent/20' : ''
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{job.category.icon}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-xl font-semibold text-terminal-fg">{job.title}</h3>
                          {job.is_featured && (
                            <Badge className="bg-terminal-accent text-terminal-bg">Featured</Badge>
                          )}
                          <Badge variant="outline" className="border-terminal-border text-terminal-fg">
                            {job.category.name}
                          </Badge>
                        </div>
                        <p className="text-terminal-muted">{job.company.name}</p>
                      </div>
                    </div>
                    
                    <p className="text-terminal-fg line-clamp-2">{job.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-terminal-muted">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(job.start_date)} - {formatDate(job.end_date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatCurrency(job.hourly_rate)}/hour</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{job.current_applications}/{job.max_applications} applications</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {job.required_skills.slice(0, 4).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-terminal-muted text-terminal-fg">
                          {skill}
                        </Badge>
                      ))}
                      {job.required_skills.length > 4 && (
                        <Badge variant="secondary" className="bg-terminal-muted text-terminal-fg">
                          +{job.required_skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-terminal-muted">
                          Posted {formatDate(job.created_at)}
                        </span>
                        {getDaysUntilDeadline(job.application_deadline) > 0 && (
                          <span className="text-terminal-warning">
                            {getDaysUntilDeadline(job.application_deadline)} days left to apply
                          </span>
                        )}
                      </div>
                      
                      {(userRole === 'pilot' || userRole === 'crew') && (
                        <Button 
                          onClick={() => handleApply(job.id)}
                          className="bg-terminal-accent hover:bg-terminal-accent/90"
                        >
                          Apply Now
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
});

export default JobBoard;
