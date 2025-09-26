import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Users, 
  Clock, 
  ThumbsUp, 
  Reply,
  Pin,
  Lock,
  Eye,
  Heart,
  Bookmark,
  Share2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Forum {
  id: string;
  name: string;
  description: string;
  category: string;
  created_by: string;
  is_public: boolean;
  is_moderated: boolean;
  member_count: number;
  post_count: number;
  created_at: string;
  updated_at: string;
  creator: {
    name: string;
    avatar: string;
    role: string;
  };
}

interface ForumPost {
  id: string;
  forum_id: string;
  author_id: string;
  title: string;
  content: string;
  post_type: 'discussion' | 'question' | 'announcement' | 'job_share' | 'experience_share';
  is_pinned: boolean;
  is_locked: boolean;
  view_count: number;
  like_count: number;
  reply_count: number;
  created_at: string;
  updated_at: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    verified: boolean;
  };
  tags: string[];
}

interface CommunityForumsProps {
  userRole: 'pilot' | 'crew' | 'broker' | 'operator';
}

const CommunityForums = React.memo(function CommunityForums({ userRole }: CommunityForumsProps) {
  const { user } = useAuth();
  const [forums, setForums] = useState<Forum[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedForum, setSelectedForum] = useState<string | null>(null);
  const [showCreateForum, setShowCreateForum] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newForum, setNewForum] = useState({
    name: '',
    description: '',
    category: 'general',
    is_public: true,
    is_moderated: false
  });
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    post_type: 'discussion' as const,
    tags: [] as string[]
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockForums: Forum[] = [
      {
        id: '1',
        name: 'Pilot Community',
        description: 'Discussion forum for pilots to share experiences, tips, and industry news',
        category: 'pilot',
        created_by: 'pilot-admin',
        is_public: true,
        is_moderated: true,
        member_count: 1250,
        post_count: 3420,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-20T15:30:00Z',
        creator: {
          name: 'Captain Smith',
          avatar: '/avatars/captain-smith.jpg',
          role: 'Senior Captain'
        }
      },
      {
        id: '2',
        name: 'Crew Resources',
        description: 'Resource hub for flight attendants and crew members',
        category: 'crew',
        created_by: 'crew-admin',
        is_public: true,
        is_moderated: false,
        member_count: 890,
        post_count: 2150,
        created_at: '2024-01-05T00:00:00Z',
        updated_at: '2024-01-19T10:15:00Z',
        creator: {
          name: 'Sarah Johnson',
          avatar: '/avatars/sarah-johnson.jpg',
          role: 'Senior Flight Attendant'
        }
      },
      {
        id: '3',
        name: 'Broker Network',
        description: 'Private network for brokers to discuss opportunities and share insights',
        category: 'broker',
        created_by: 'broker-admin',
        is_public: false,
        is_moderated: true,
        member_count: 156,
        post_count: 890,
        created_at: '2024-01-10T00:00:00Z',
        updated_at: '2024-01-18T14:20:00Z',
        creator: {
          name: 'Michael Chen',
          avatar: '/avatars/michael-chen.jpg',
          role: 'Senior Broker'
        }
      }
    ];

    const mockPosts: ForumPost[] = [
      {
        id: '1',
        forum_id: '1',
        author_id: 'pilot-1',
        title: 'Best practices for long-haul flights',
        content: 'I\'ve been flying long-haul routes for 5 years now and wanted to share some tips that have helped me stay sharp and safe...',
        post_type: 'experience_share',
        is_pinned: true,
        is_locked: false,
        view_count: 1250,
        like_count: 89,
        reply_count: 23,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
        author: {
          name: 'Captain Rodriguez',
          avatar: '/avatars/captain-rodriguez.jpg',
          role: 'Senior Captain',
          verified: true
        },
        tags: ['long-haul', 'safety', 'tips', 'experience']
      },
      {
        id: '2',
        forum_id: '1',
        author_id: 'pilot-2',
        title: 'New regulations affecting corporate aviation',
        content: 'The FAA just announced new regulations that will affect corporate aviation operations. Here\'s what you need to know...',
        post_type: 'announcement',
        is_pinned: false,
        is_locked: false,
        view_count: 890,
        like_count: 45,
        reply_count: 12,
        created_at: '2024-01-18T14:30:00Z',
        updated_at: '2024-01-18T14:30:00Z',
        author: {
          name: 'First Officer Kim',
          avatar: '/avatars/first-officer-kim.jpg',
          role: 'First Officer',
          verified: false
        },
        tags: ['regulations', 'faa', 'corporate', 'announcement']
      },
      {
        id: '3',
        forum_id: '2',
        author_id: 'crew-1',
        title: 'Job opportunity: Gulfstream G650 crew needed',
        content: 'Our company is looking for experienced crew members for a Gulfstream G650 operation. Great benefits and competitive pay...',
        post_type: 'job_share',
        is_pinned: false,
        is_locked: false,
        view_count: 450,
        like_count: 23,
        reply_count: 8,
        created_at: '2024-01-19T09:15:00Z',
        updated_at: '2024-01-19T09:15:00Z',
        author: {
          name: 'Crew Chief Martinez',
          avatar: '/avatars/crew-chief-martinez.jpg',
          role: 'Crew Chief',
          verified: true
        },
        tags: ['job', 'gulfstream', 'g650', 'opportunity']
      }
    ];

    setForums(mockForums);
    setPosts(mockPosts);
    setLoading(false);
  }, []);

  const filteredForums = forums.filter(forum => {
    const matchesSearch = forum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         forum.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || forum.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesForum = !selectedForum || post.forum_id === selectedForum;
    return matchesSearch && matchesForum;
  });

  const handleCreateForum = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual API call
    console.log('Creating forum:', newForum);
    setShowCreateForum(false);
    setNewForum({ name: '', description: '', category: 'general', is_public: true, is_moderated: false });
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual API call
    console.log('Creating post:', newPost);
    setShowCreatePost(false);
    setNewPost({ title: '', content: '', post_type: 'discussion', tags: [] });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'question': return '❓';
      case 'announcement': return '📢';
      case 'job_share': return '💼';
      case 'experience_share': return '📝';
      default: return '💬';
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'question': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'announcement': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'job_share': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'experience_share': return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
      default: return 'bg-terminal-muted text-terminal-fg';
    }
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
          <h1 className="text-3xl font-bold text-terminal-fg">Community Forums</h1>
          <Dialog open={showCreateForum} onOpenChange={setShowCreateForum}>
            <DialogTrigger asChild>
              <Button className="bg-terminal-accent hover:bg-terminal-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                Create Forum
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-terminal-bg border-terminal-border">
              <DialogHeader>
                <DialogTitle className="text-terminal-fg">Create New Forum</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateForum} className="space-y-4">
                <div>
                  <label className="text-terminal-fg">Forum Name</label>
                  <Input
                    value={newForum.name}
                    onChange={(e) => setNewForum(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-terminal-bg border-terminal-border text-terminal-fg"
                    required
                  />
                </div>
                <div>
                  <label className="text-terminal-fg">Description</label>
                  <Textarea
                    value={newForum.description}
                    onChange={(e) => setNewForum(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-terminal-bg border-terminal-border text-terminal-fg"
                    required
                  />
                </div>
                <div>
                  <label className="text-terminal-fg">Category</label>
                  <Select value={newForum.category} onValueChange={(value) => setNewForum(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="bg-terminal-bg border-terminal-border text-terminal-fg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="pilot">Pilot</SelectItem>
                      <SelectItem value="crew">Crew</SelectItem>
                      <SelectItem value="broker">Broker</SelectItem>
                      <SelectItem value="operator">Operator</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="safety">Safety</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-4">
                  <Button type="submit" className="bg-terminal-accent hover:bg-terminal-accent/90">
                    Create Forum
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForum(false)} className="border-terminal-border text-terminal-fg">
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <p className="text-terminal-muted">
          Connect with aviation professionals, share experiences, and build your network
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="bg-terminal-bg border-terminal-border">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terminal-muted h-4 w-4" />
              <Input
                placeholder="Search forums and posts..."
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
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="pilot">Pilot</SelectItem>
                <SelectItem value="crew">Crew</SelectItem>
                <SelectItem value="broker">Broker</SelectItem>
                <SelectItem value="operator">Operator</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="training">Training</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedForum || 'all'} onValueChange={(value) => setSelectedForum(value === 'all' ? null : value)}>
              <SelectTrigger className="bg-terminal-bg border-terminal-border text-terminal-fg">
                <SelectValue placeholder="Forum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Forums</SelectItem>
                {forums.map(forum => (
                  <SelectItem key={forum.id} value={forum.id}>{forum.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="forums" className="space-y-6">
        <TabsList className="bg-terminal-bg border-terminal-border">
          <TabsTrigger value="forums" className="data-[state=active]:bg-terminal-accent data-[state=active]:text-terminal-bg">
            Forums
          </TabsTrigger>
          <TabsTrigger value="posts" className="data-[state=active]:bg-terminal-accent data-[state=active]:text-terminal-bg">
            Recent Posts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forums" className="space-y-4">
          {filteredForums.length === 0 ? (
            <Card className="bg-terminal-bg border-terminal-border">
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-terminal-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-terminal-fg mb-2">No Forums Found</h3>
                <p className="text-terminal-muted">
                  Try adjusting your search criteria or create a new forum.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredForums.map(forum => (
              <Card key={forum.id} className="bg-terminal-bg border-terminal-border hover:border-terminal-accent transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-xl font-semibold text-terminal-fg">{forum.name}</h3>
                          {!forum.is_public && (
                            <Lock className="h-4 w-4 text-terminal-muted" />
                          )}
                          {forum.is_moderated && (
                            <Badge variant="outline" className="border-terminal-border text-terminal-fg">
                              Moderated
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-terminal-fg">{forum.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-terminal-muted">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{forum.member_count} members</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{forum.post_count} posts</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Updated {formatDate(forum.updated_at)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={forum.creator.avatar} />
                            <AvatarFallback>{forum.creator.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-terminal-muted">
                            Created by {forum.creator.name}
                          </span>
                        </div>
                        
                        <Button 
                          onClick={() => setSelectedForum(forum.id)}
                          className="bg-terminal-accent hover:bg-terminal-accent/90"
                        >
                          View Forum
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          {filteredPosts.length === 0 ? (
            <Card className="bg-terminal-bg border-terminal-border">
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-terminal-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-terminal-fg mb-2">No Posts Found</h3>
                <p className="text-terminal-muted">
                  Try adjusting your search criteria or check back later for new posts.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPosts.map(post => (
              <Card key={post.id} className="bg-terminal-bg border-terminal-border hover:border-terminal-accent transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        {post.is_pinned && (
                          <Pin className="h-4 w-4 text-terminal-accent" />
                        )}
                        <span className="text-lg">{getPostTypeIcon(post.post_type)}</span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-terminal-fg">{post.title}</h3>
                            <Badge className={getPostTypeColor(post.post_type)}>
                              {post.post_type.replace('_', ' ')}
                            </Badge>
                            {post.is_locked && (
                              <Lock className="h-4 w-4 text-terminal-muted" />
                            )}
                          </div>
                          <p className="text-terminal-muted text-sm">
                            by {post.author.name} • {post.author.role}
                            {post.author.verified && <span className="text-terminal-accent ml-1">✓</span>}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-terminal-fg line-clamp-2">{post.content}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-terminal-muted">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{post.view_count} views</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{post.like_count} likes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Reply className="h-4 w-4" />
                          <span>{post.reply_count} replies</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="bg-terminal-muted text-terminal-fg">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" className="border-terminal-border text-terminal-fg">
                            <Heart className="h-4 w-4 mr-1" />
                            Like
                          </Button>
                          <Button variant="outline" size="sm" className="border-terminal-border text-terminal-fg">
                            <Bookmark className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                          <Button variant="outline" size="sm" className="border-terminal-border text-terminal-fg">
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
});

export default CommunityForums;
