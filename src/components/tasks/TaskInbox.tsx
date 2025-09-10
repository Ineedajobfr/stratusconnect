import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertTriangle, Calendar, User, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDistanceToNow, format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description?: string;
  due_at?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  entity_type?: 'rfq' | 'quote' | 'deal' | 'verification' | 'document';
  entity_id?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'snoozed';
  assigned_to?: string;
  created_at: string;
  meta_json?: Record<string, unknown>;
}

const priorityColors = {
  low: 'text-gray-400',
  medium: 'text-blue-400',
  high: 'text-orange-400',
  urgent: 'text-red-400',
};

const priorityIcons = {
  low: Clock,
  medium: Clock,
  high: AlertTriangle,
  urgent: AlertTriangle,
};

const statusColors = {
  pending: 'text-yellow-400',
  in_progress: 'text-blue-400',
  completed: 'text-green-400',
  cancelled: 'text-gray-400',
  snoozed: 'text-purple-400',
};

export const TaskInbox: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Complete KYC verification for new client',
        description: 'John Smith needs to complete identity verification before booking',
        due_at: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), // 2 hours from now
        priority: 'high',
        entity_type: 'verification',
        entity_id: 'verification-1',
        status: 'pending',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      },
      {
        id: '2',
        title: 'Review and respond to quote',
        description: 'Quote from SkyHigh Aviation for NYC-LAX trip expires in 24 hours',
        due_at: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours from now
        priority: 'urgent',
        entity_type: 'quote',
        entity_id: 'quote-1',
        status: 'pending',
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: '3',
        title: 'Sign charter agreement',
        description: 'Contract for Miami-Bahamas charter needs signature',
        due_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago (overdue)
        priority: 'high',
        entity_type: 'document',
        entity_id: 'document-1',
        status: 'pending',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      },
      {
        id: '4',
        title: 'Update pilot medical certificate',
        description: 'Medical certificate expires in 7 days',
        due_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days from now
        priority: 'medium',
        entity_type: 'document',
        entity_id: 'document-2',
        status: 'in_progress',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      },
      {
        id: '5',
        title: 'Release escrow funds',
        description: 'Flight completed successfully, release $45,000 to operator',
        due_at: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(), // 4 hours from now
        priority: 'medium',
        entity_type: 'deal',
        entity_id: 'deal-1',
        status: 'completed',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      },
    ];

    setTasks(mockTasks);
  }, []);

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: task.status === 'completed' ? 'pending' : 'completed' 
            }
          : task
      )
    );
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    // Status filter
    if (filter === 'pending') {
      filtered = filtered.filter(task => task.status === 'pending');
    } else if (filter === 'completed') {
      filtered = filtered.filter(task => task.status === 'completed');
    } else if (filter === 'overdue') {
      filtered = filtered.filter(task => 
        task.status === 'pending' && 
        task.due_at && 
        new Date(task.due_at) < new Date()
      );
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    return filtered.sort((a, b) => {
      // Sort by priority first, then by due date
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder];
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      if (a.due_at && b.due_at) {
        return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
      }
      
      return 0;
    });
  };

  const filteredTasks = getFilteredTasks();
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const overdueCount = tasks.filter(t => 
    t.status === 'pending' && 
    t.due_at && 
    new Date(t.due_at) < new Date()
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Task Inbox</h2>
          <p className="text-gray-400">Your day in one list</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      <div className="flex gap-4">
        <Select value={filter} onValueChange={(value: string) => setFilter(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks ({tasks.length})</SelectItem>
            <SelectItem value="pending">Pending ({pendingCount})</SelectItem>
            <SelectItem value="overdue">Overdue ({overdueCount})</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No tasks found</h3>
              <p className="text-gray-500">All caught up! Create a new task to get started.</p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => {
            const PriorityIcon = priorityIcons[task.priority];
            const isOverdue = task.due_at && new Date(task.due_at) < new Date() && task.status === 'pending';
            
            return (
              <Card 
                key={task.id} 
                className={`border-gray-800 bg-gray-900/50 hover:bg-gray-800/50 transition-colors ${
                  isOverdue ? 'border-red-500/50 bg-red-900/20' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTaskStatus(task.id)}
                      className="p-1 h-8 w-8"
                    >
                      <CheckCircle 
                        className={`h-5 w-5 ${
                          task.status === 'completed' 
                            ? 'text-green-500' 
                            : 'text-gray-500 hover:text-green-500'
                        }`} 
                      />
                    </Button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`font-medium ${
                          task.status === 'completed' ? 'line-through text-gray-500' : 'text-white'
                        }`}>
                          {task.title}
                        </h3>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            priorityColors[task.priority]
                          }`}
                        >
                          <PriorityIcon className="h-3 w-3 mr-1" />
                          {task.priority}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            statusColors[task.status]
                          }`}
                        >
                          {task.status}
                        </Badge>
                        {isOverdue && (
                          <Badge variant="destructive" className="text-xs">
                            OVERDUE
                          </Badge>
                        )}
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-gray-400 mb-3">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {task.due_at && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className={isOverdue ? 'text-red-400' : ''}>
                              Due {formatDistanceToNow(new Date(task.due_at), { addSuffix: true })}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            Created {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        {task.assigned_to && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>Assigned</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
