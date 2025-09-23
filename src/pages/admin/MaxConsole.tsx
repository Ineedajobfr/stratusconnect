import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye, 
  Filter, 
  Download,
  RefreshCw,
  Activity,
  Shield,
  TrendingUp,
  FileText,
  Zap,
  Bell,
  Users,
  Plane,
  DollarSign
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface Event {
  id: string;
  type: string;
  occurred_at: string;
  actor_user_id: string | null;
  payload: any;
  status: string;
}

interface Finding {
  id: string;
  severity: 'info' | 'warn' | 'high' | 'critical';
  label: string;
  details: any;
  status: string;
  created_at: string;
  linked_object_type?: string;
  linked_object_id?: string;
}

interface Task {
  id: string;
  kind: 'alert' | 'review' | 'enrich' | 'generate_report' | 'route';
  summary: string;
  suggested_action: any;
  status: string;
  created_at: string;
  due_at?: string;
}

interface Report {
  id: string;
  report_type: string;
  period_start: string;
  period_end: string;
  blob_url?: string;
  created_at: string;
}

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || '',
  process.env.REACT_APP_SUPABASE_ANON_KEY || ''
);

export default function MaxConsole() {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState<Event[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalEvents: 0,
    pendingEvents: 0,
    openFindings: 0,
    criticalFindings: 0,
    openTasks: 0,
    completedTasks: 0
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchEvents(),
        fetchFindings(),
        fetchTasks(),
        fetchReports(),
        fetchStats()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('internal_max.event_bus')
      .select('*')
      .order('occurred_at', { ascending: false })
      .limit(100);
    
    if (data) setEvents(data);
  };

  const fetchFindings = async () => {
    const { data, error } = await supabase
      .from('internal_max.findings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (data) setFindings(data);
  };

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('internal_max.tasks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (data) setTasks(data);
  };

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from('internal_max.reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (data) setReports(data);
  };

  const fetchStats = async () => {
    const [eventsRes, findingsRes, tasksRes] = await Promise.all([
      supabase.from('internal_max.event_bus').select('id, status'),
      supabase.from('internal_max.findings').select('id, severity, status'),
      supabase.from('internal_max.tasks').select('id, status')
    ]);

    const eventsData = eventsRes.data || [];
    const findingsData = findingsRes.data || [];
    const tasksData = tasksRes.data || [];

    setStats({
      totalEvents: eventsData.length,
      pendingEvents: eventsData.filter(e => e.status === 'pending').length,
      openFindings: findingsData.filter(f => f.status === 'open').length,
      criticalFindings: findingsData.filter(f => f.severity === 'critical' && f.status === 'open').length,
      openTasks: tasksData.filter(t => t.status === 'open').length,
      completedTasks: tasksData.filter(t => t.status === 'done').length
    });
  };

  const handleTaskAction = async (taskId: string, action: 'approve' | 'dismiss') => {
    try {
      if (action === 'approve') {
        // Execute the suggested action (simplified)
        const task = tasks.find(t => t.id === taskId);
        if (task) {
          // In a real implementation, you'd execute the suggested_action
          console.log('Executing action:', task.suggested_action);
        }
      }

      // Update task status
      const { error } = await supabase
        .from('internal_max.tasks')
        .update({ 
          status: action === 'approve' ? 'in_progress' : 'done',
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (!error) {
        await fetchTasks();
        await fetchStats();
      }
    } catch (error) {
      console.error('Error handling task action:', error);
    }
  };

  const handleFindingAction = async (findingId: string, action: 'resolve' | 'dismiss') => {
    try {
      const { error } = await supabase
        .from('internal_max.findings')
        .update({ 
          status: action === 'resolve' ? 'resolved' : 'resolved',
          resolved_at: new Date().toISOString()
        })
        .eq('id', findingId);

      if (!error) {
        await fetchFindings();
        await fetchStats();
      }
    } catch (error) {
      console.error('Error handling finding action:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'warn': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'done': return 'bg-green-100 text-green-800';
      case 'processed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskKindIcon = (kind: string) => {
    switch (kind) {
      case 'alert': return <Bell className="w-4 h-4" />;
      case 'review': return <Eye className="w-4 h-4" />;
      case 'enrich': return <TrendingUp className="w-4 h-4" />;
      case 'generate_report': return <FileText className="w-4 h-4" />;
      case 'route': return <Plane className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Max Console</h1>
              <p className="text-gray-600 mt-2">Internal systems operator monitoring and compliance</p>
            </div>
            <Button onClick={fetchData} disabled={loading} className="flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold">{stats.totalEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{stats.pendingEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Open Findings</p>
                  <p className="text-2xl font-bold">{stats.openFindings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Critical</p>
                  <p className="text-2xl font-bold">{stats.criticalFindings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Open Tasks</p>
                  <p className="text-2xl font-bold">{stats.openTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">{stats.completedTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="findings">Findings</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(event.status === 'pending' ? 'warn' : 'info')}`}></div>
                        <div>
                          <p className="font-medium">{event.type}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(event.occurred_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Findings Tab */}
          <TabsContent value="findings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Security & Compliance Findings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {findings.map((finding) => (
                    <div key={finding.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`w-3 h-3 rounded-full mt-1 ${getSeverityColor(finding.severity)}`}></div>
                          <div>
                            <p className="font-medium">{finding.label}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {new Date(finding.created_at).toLocaleString()}
                            </p>
                            {finding.details && (
                              <pre className="text-xs bg-gray-100 p-2 rounded mt-2 max-w-md overflow-auto">
                                {JSON.stringify(finding.details, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(finding.status)}>
                            {finding.status}
                          </Badge>
                          {finding.status === 'open' && (
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleFindingAction(finding.id, 'resolve')}
                              >
                                Resolve
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Admin Tasks & Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div key={task.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getTaskKindIcon(task.kind)}
                          <div>
                            <p className="font-medium">{task.summary}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {task.kind} • {new Date(task.created_at).toLocaleString()}
                            </p>
                            {task.suggested_action && (
                              <pre className="text-xs bg-gray-100 p-2 rounded mt-2 max-w-md overflow-auto">
                                {JSON.stringify(task.suggested_action, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                          {task.status === 'open' && (
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                onClick={() => handleTaskAction(task.id, 'approve')}
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleTaskAction(task.id, 'dismiss')}
                              >
                                Dismiss
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Generated Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium capitalize">{report.report_type.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(report.period_start).toLocaleDateString()} - {new Date(report.period_end).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
