// Security Monitoring Dashboard
// Displays image upload logs, security events, and AI moderation results
// Admin-only component for monitoring platform security

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Download,
    Eye,
    RefreshCw,
    Search,
    Shield,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface SecurityEvent {
  id: string;
  user_id: string;
  event_type: string;
  details: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

interface ImageUploadEvent extends SecurityEvent {
  details: {
    fileName: string;
    fileSize: number;
    fileHash: string;
    approved: boolean;
    confidence: number;
    classification: {
      nsfw: number;
      violence: number;
      inappropriate: number;
      safe: number;
    };
    rejectionReason?: string;
  };
}

export function SecurityMonitoring() {
  const { user } = useAuth();
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [imageUploads, setImageUploads] = useState<ImageUploadEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Only show for admin users
  const isAdmin = user?.email === 'stratuscharters@gmail.com' || user?.role === 'admin';
  
  if (!isAdmin) {
    return null;
  }

  useEffect(() => {
    loadSecurityEvents();
  }, []);

  const loadSecurityEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Failed to load security events:', error);
        return;
      }

      setEvents(data || []);
      
      // Filter image upload events
      const imageEvents = data?.filter(event => event.event_type === 'image_upload') as ImageUploadEvent[];
      setImageUploads(imageEvents || []);
    } catch (error) {
      console.error('Error loading security events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'image_upload':
        return <Eye className="h-4 w-4" />;
      case 'login_attempt':
        return <Shield className="h-4 w-4" />;
      case 'suspicious_activity':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getEventStatus = (event: SecurityEvent) => {
    if (event.event_type === 'image_upload') {
      const imageEvent = event as ImageUploadEvent;
      return imageEvent.details.approved ? 'approved' : 'rejected';
    }
    return 'info';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatConfidence = (confidence: number) => {
    return `${(confidence * 100).toFixed(1)}%`;
  };

  const filteredImageUploads = imageUploads.filter(upload => {
    const matchesSearch = upload.details.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'approved' && upload.details.approved) ||
      (filterStatus === 'rejected' && !upload.details.approved);
    
    return matchesSearch && matchesStatus;
  });

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.details?.fileName && event.details.fileName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || event.event_type === filterType;
    
    return matchesSearch && matchesType;
  });

  const stats = {
    totalEvents: events.length,
    imageUploads: imageUploads.length,
    approvedImages: imageUploads.filter(u => u.details.approved).length,
    rejectedImages: imageUploads.filter(u => !u.details.approved).length,
    suspiciousActivity: events.filter(e => e.event_type === 'suspicious_activity').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Security Monitoring</h2>
          <p className="text-gray-400">Monitor image uploads, security events, and AI moderation results</p>
        </div>
        <Button onClick={loadSecurityEvents} disabled={loading} className="bg-orange-500 hover:bg-orange-600">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                <p className="text-sm text-gray-400">Total Events</p>
                <p className="text-2xl font-bold text-white">{stats.totalEvents}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-400" />
                </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Image Uploads</p>
                <p className="text-2xl font-bold text-white">{stats.imageUploads}</p>
              </div>
              <Eye className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

        <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                <p className="text-sm text-gray-400">Approved</p>
                <p className="text-2xl font-bold text-green-400">{stats.approvedImages}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

        <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                <p className="text-sm text-gray-400">Rejected</p>
                <p className="text-2xl font-bold text-red-400">{stats.rejectedImages}</p>
              </div>
              <X className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

        <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                <p className="text-sm text-gray-400">Suspicious</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.suspiciousActivity}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white"
          />
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
        >
          <option value="all">All Types</option>
          <option value="image_upload">Image Uploads</option>
          <option value="login_attempt">Login Attempts</option>
          <option value="suspicious_activity">Suspicious Activity</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Events Table */}
      <Tabs defaultValue="image-uploads" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="image-uploads">Image Uploads</TabsTrigger>
          <TabsTrigger value="all-events">All Events</TabsTrigger>
        </TabsList>

        <TabsContent value="image-uploads" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
              <CardTitle className="text-white">Image Upload Events</CardTitle>
              <CardDescription>
                AI moderation results for aircraft listing images
              </CardDescription>
              </CardHeader>
              <CardContent>
              <div className="space-y-4">
                {filteredImageUploads.map((upload) => (
                  <div
                    key={upload.id}
                    className="p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getEventIcon(upload.event_type)}
                        <div>
                          <h4 className="font-semibold text-white">{upload.details.fileName}</h4>
                          <p className="text-sm text-gray-400">
                            {formatFileSize(upload.details.fileSize)} • {upload.details.fileHash.substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(getEventStatus(upload))}>
                          {getEventStatus(upload)}
                        </Badge>
                        <span className="text-sm text-gray-400">
                          {new Date(upload.created_at).toLocaleString()}
                        </span>
                      </div>
                </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                        <p className="text-gray-400">AI Confidence</p>
                        <p className="text-white font-medium">{formatConfidence(upload.details.confidence)}</p>
                        </div>
                      <div>
                        <p className="text-gray-400">Classification</p>
                        <div className="flex gap-2">
                          <span className="text-red-400">NSFW: {formatConfidence(upload.details.classification.nsfw)}</span>
                          <span className="text-orange-400">Violence: {formatConfidence(upload.details.classification.violence)}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400">Safe Content</p>
                        <p className="text-green-400 font-medium">{formatConfidence(upload.details.classification.safe)}</p>
                </div>
          </div>

                    {upload.details.rejectionReason && (
                      <div className="mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded">
                        <p className="text-red-400 text-sm">
                          <strong>Rejection Reason:</strong> {upload.details.rejectionReason}
                        </p>
                      </div>
                    )}

                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        <Download className="h-3 w-3 mr-1" />
                        Download Log
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}

                {filteredImageUploads.length === 0 && (
                  <div className="text-center py-8">
                    <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No image upload events found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all-events" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">All Security Events</CardTitle>
              <CardDescription>
                Complete audit trail of security events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getEventIcon(event.event_type)}
                        <div>
                          <h4 className="font-semibold text-white capitalize">
                            {event.event_type.replace('_', ' ')}
                          </h4>
                          <p className="text-sm text-gray-400">
                            User: {event.user_id.substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(getEventStatus(event))}>
                          {getEventStatus(event)}
                        </Badge>
                        <span className="text-sm text-gray-400">
                          {new Date(event.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {event.ip_address && (
                      <p className="text-sm text-gray-400">
                        IP: {event.ip_address}
                      </p>
                    )}

                    <div className="mt-3">
                      <Button size="sm" variant="outline" className="text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                    </div>
                  ))}

                {filteredEvents.length === 0 && (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No security events found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
