import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  Plane, 
  Calendar,
  User,
  Star,
  Heart,
  MessageSquare,
  ExternalLink,
  CheckCircle,
  Zap,
  Shield,
  Award
} from 'lucide-react';

interface JobPosting {
  id: string;
  title: string;
  operator: string;
  operatorRating: number;
  aircraftType: string;
  location: string;
  startDate: string;
  endDate: string;
  duration: string;
  dayRate: number;
  totalPay: number;
  description: string;
  requirements: string[];
  benefits: string[];
  status: 'open' | 'filled' | 'cancelled';
  postedDate: string;
  applicationsCount: number;
  isUrgent: boolean;
  isShortNotice: boolean;
  contractType: 'one-off' | 'rotation' | 'long-term';
  region: string;
}

export default function JobMarketplace({ terminalType }: { terminalType: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  const [jobs] = useState<JobPosting[]>([
    {
      id: 'job-001',
      title: 'Gulfstream G650 Ferry Flight - London to Dubai',
      operator: 'Elite Aviation Group',
      operatorRating: 4.8,
      aircraftType: 'Gulfstream G650',
      location: 'London (LHR) → Dubai (DXB)',
      startDate: '2025-09-25',
      endDate: '2025-09-25',
      duration: '1 day',
      dayRate: 1200,
      totalPay: 1200,
      description: 'Ferry flight for aircraft delivery. Single pilot operation with full support team.',
      requirements: ['G650 Type Rating', '500+ hours on type', 'Valid medical', 'Passport'],
      benefits: ['Accommodation provided', 'Per diem included', 'Travel insurance'],
      status: 'open',
      postedDate: '2025-09-19',
      applicationsCount: 12,
      isUrgent: false,
      isShortNotice: true,
      contractType: 'one-off',
      region: 'Europe'
    },
    {
      id: 'job-002',
      title: 'Bombardier Global 7500 Rotation - 2 Weeks',
      operator: 'Global Charters Ltd',
      operatorRating: 4.6,
      aircraftType: 'Bombardier Global 7500',
      location: 'Various European destinations',
      startDate: '2025-10-01',
      endDate: '2025-10-15',
      duration: '2 weeks',
      dayRate: 1500,
      totalPay: 21000,
      description: 'Two-week rotation covering European business routes. High-end client base.',
      requirements: ['Global 7500 Type Rating', '1000+ hours on type', 'CRM current', 'Multi-language preferred'],
      benefits: ['Premium accommodation', 'Car allowance', 'Health insurance', 'Performance bonus'],
      status: 'open',
      postedDate: '2025-09-18',
      applicationsCount: 8,
      isUrgent: false,
      isShortNotice: false,
      contractType: 'rotation',
      region: 'Europe'
    },
    {
      id: 'job-003',
      title: 'URGENT: Cessna Citation XLS+ - Same Day',
      operator: 'Rapid Response Aviation',
      operatorRating: 4.9,
      aircraftType: 'Cessna Citation XLS+',
      location: 'London (LTN) → Geneva (GVA)',
      startDate: '2025-09-20',
      endDate: '2025-09-20',
      duration: 'Same day',
      dayRate: 2000,
      totalPay: 2000,
      description: 'Urgent medical transport flight. Departure within 4 hours.',
      requirements: ['Citation XLS+ Type Rating', 'Valid medical', 'Available immediately'],
      benefits: ['Premium rate', 'Immediate payment', 'Support team on standby'],
      status: 'open',
      postedDate: '2025-09-20',
      applicationsCount: 3,
      isUrgent: true,
      isShortNotice: true,
      contractType: 'one-off',
      region: 'Europe'
    },
    {
      id: 'job-004',
      title: 'Dassault Falcon 8X - Long-term Contract',
      operator: 'Falcon Operations Inc',
      operatorRating: 4.7,
      aircraftType: 'Dassault Falcon 8X',
      location: 'Global operations',
      startDate: '2025-11-01',
      endDate: '2026-11-01',
      duration: '12 months',
      dayRate: 1800,
      totalPay: 657000,
      description: 'Full-time position with established operator. Global operations with premium client base.',
      requirements: ['Falcon 8X Type Rating', '2000+ hours on type', 'International experience', 'Leadership skills'],
      benefits: ['Full benefits package', 'Retirement plan', 'Training opportunities', 'Career progression'],
      status: 'open',
      postedDate: '2025-09-15',
      applicationsCount: 25,
      isUrgent: false,
      isShortNotice: false,
      contractType: 'long-term',
      region: 'Global'
    },
    {
      id: 'job-005',
      title: 'Pilatus PC-24 - Weekend Rotation',
      operator: 'Swiss Aviation Services',
      operatorRating: 4.5,
      aircraftType: 'Pilatus PC-24',
      location: 'Switzerland & Europe',
      startDate: '2025-09-28',
      endDate: '2025-09-29',
      duration: 'Weekend',
      dayRate: 1000,
      totalPay: 2000,
      description: 'Weekend rotation covering Swiss and European routes. Family-friendly schedule.',
      requirements: ['PC-24 Type Rating', '500+ hours on type', 'Swiss residence permit'],
      benefits: ['Work-life balance', 'Swiss benefits', 'Mountain flying experience'],
      status: 'open',
      postedDate: '2025-09-17',
      applicationsCount: 6,
      isUrgent: false,
      isShortNotice: false,
      contractType: 'rotation',
      region: 'Europe'
    }
  ]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.aircraftType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'urgent' && job.isUrgent) ||
                         (selectedFilter === 'short-notice' && job.isShortNotice) ||
                         (selectedFilter === 'rotation' && job.contractType === 'rotation') ||
                         (selectedFilter === 'long-term' && job.contractType === 'long-term') ||
                         (selectedFilter === 'one-off' && job.contractType === 'one-off');
    
    return matchesSearch && matchesFilter && job.status === 'open';
  });

  const handleApply = (jobId: string) => {
    setAppliedJobs(prev => [...prev, jobId]);
  };

  const handleExpressInterest = (jobId: string) => {
    // Handle express interest
    console.log('Expressed interest in job:', jobId);
  };

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'one-off': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'rotation': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'long-term': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getUrgencyColor = (isUrgent: boolean, isShortNotice: boolean) => {
    if (isUrgent) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (isShortNotice) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-green-500/20 text-green-400 border-green-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-accent" />
            Job Marketplace Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, operators, aircraft..."
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
                className="h-9 px-3 py-1 bg-terminal-card border border-terminal-border rounded-md text-sm flex-1 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              >
                <option value="all">All Jobs</option>
                <option value="urgent">Urgent</option>
                <option value="short-notice">Short Notice</option>
                <option value="rotation">Rotations</option>
                <option value="long-term">Long-term</option>
                <option value="one-off">One-off</option>
              </select>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Plane className="w-4 h-4" />
              {filteredJobs.length} jobs available
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map(job => (
          <Card key={job.id} className="terminal-card hover:terminal-glow transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                    {job.isUrgent && (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        <Zap className="w-3 h-3 mr-1" />
                        URGENT
                      </Badge>
                    )}
                    {job.isShortNotice && !job.isUrgent && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        <Clock className="w-3 h-3 mr-1" />
                        Short Notice
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{job.operator}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-sm text-muted-foreground">{job.operatorRating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Plane className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{job.aircraftType}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{job.location}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                </div>

                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-accent">£{job.dayRate.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">per day</div>
                  {job.totalPay > job.dayRate && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Total: £{job.totalPay.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Requirements</h4>
                  <div className="space-y-1">
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="w-3 h-3" />
                        {req}
                      </div>
                    ))}
                    {job.requirements.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{job.requirements.length - 3} more requirements
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Benefits</h4>
                  <div className="space-y-1">
                    {job.benefits.slice(0, 3).map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Award className="w-3 h-3" />
                        {benefit}
                      </div>
                    ))}
                    {job.benefits.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{job.benefits.length - 3} more benefits
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Details</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {job.startDate} - {job.endDate}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {job.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      {job.region}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge className={getContractTypeColor(job.contractType)}>
                    {job.contractType.replace('-', ' ').toUpperCase()}
                  </Badge>
                  <Badge className={getUrgencyColor(job.isUrgent, job.isShortNotice)}>
                    {job.isUrgent ? 'Urgent' : job.isShortNotice ? 'Short Notice' : 'Available'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {job.applicationsCount} applications
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleExpressInterest(job.id)}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Interest
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => console.log('View details:', job.id)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApply(job.id)}
                    disabled={appliedJobs.includes(job.id)}
                    className={appliedJobs.includes(job.id) ? 'bg-green-500/20 text-green-400' : ''}
                  >
                    {appliedJobs.includes(job.id) ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Applied
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Apply Now
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card className="terminal-card">
          <CardContent className="text-center py-12">
            <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No jobs found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria to find more opportunities.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
