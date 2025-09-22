import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Clock, 
  ExternalLink, 
  RefreshCw, 
  Calendar,
  User,
  Eye,
  TrendingUp,
  Globe,
  Plane,
  Zap,
  Shield,
  Settings,
  BookOpen
} from 'lucide-react';
import { aviationNewsService, NewsArticle, NewsResponse } from '@/lib/aviation-news-service';

interface AviationNewsProps {
  terminalType: 'broker' | 'operator' | 'pilot' | 'crew' | 'admin';
  className?: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All News', icon: Globe },
  { id: 'aviation', label: 'Aviation', icon: Plane },
  { id: 'private-jet', label: 'Private Jet', icon: Zap },
  { id: 'business-aviation', label: 'Business Aviation', icon: Shield },
  { id: 'aircraft', label: 'Aircraft', icon: Plane },
  { id: 'regulations', label: 'Regulations', icon: BookOpen },
  { id: 'technology', label: 'Technology', icon: Settings }
];

export default function AviationNews({ terminalType, className = '' }: AviationNewsProps) {
  const [news, setNews] = useState<NewsResponse | null>(null);
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'relevance'>('newest');

  useEffect(() => {
    loadNews();
  }, []);

  useEffect(() => {
    filterAndSortNews();
  }, [news, searchQuery, selectedCategory, sortBy]);

  const loadNews = async () => {
    try {
      setLoading(true);
      const newsData = await aviationNewsService.getLatestNews();
      setNews(newsData);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortNews = () => {
    if (!news) return;

    let filtered = [...news.articles];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.source.toLowerCase().includes(query)
      );
    }

    // Sort articles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'oldest':
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        case 'relevance':
          // Simple relevance scoring based on search query
          if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const scoreA = (a.title.toLowerCase().includes(query) ? 2 : 0) +
                          (a.description.toLowerCase().includes(query) ? 1 : 0);
            const scoreB = (b.title.toLowerCase().includes(query) ? 2 : 0) +
                          (b.description.toLowerCase().includes(query) ? 1 : 0);
            return scoreB - scoreA;
          }
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredNews(filtered);
  };

  const handleRefresh = async () => {
    await loadNews();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'aviation': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'private-jet': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'business-aviation': 'bg-green-500/20 text-green-400 border-green-500/30',
      'aircraft': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'regulations': 'bg-red-500/20 text-red-400 border-red-500/30',
      'technology': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getTerminalSpecificNews = () => {
    if (!news) return [];
    
    const terminalKeywords = {
      'broker': ['charter', 'booking', 'quotes', 'pricing', 'market'],
      'operator': ['fleet', 'operations', 'maintenance', 'safety', 'compliance'],
      'pilot': ['training', 'certification', 'safety', 'flight', 'avionics'],
      'crew': ['cabin', 'service', 'training', 'safety', 'hospitality'],
      'admin': ['regulations', 'compliance', 'industry', 'market', 'technology']
    };

    const keywords = terminalKeywords[terminalType] || [];
    return news.articles.filter(article =>
      keywords.some(keyword =>
        article.title.toLowerCase().includes(keyword) ||
        article.description.toLowerCase().includes(keyword)
      )
    ).slice(0, 5);
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="terminal-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-accent" />
              Aviation News
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-accent" />
              <span className="ml-2 text-muted-foreground">Loading latest aviation news...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const terminalSpecificNews = getTerminalSpecificNews();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="terminal-card">
        <CardHeader>
      <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-accent" />
              Aviation News
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                Updated {news ? formatDate(news.lastUpdated) : 'Unknown'}
              </Badge>
              <Button
                onClick={handleRefresh}
                size="sm"
                variant="outline"
                className="h-8"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
        </div>
      </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search aviation news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9"
              />
                </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-9 px-3 py-1 bg-terminal-card border border-terminal-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              >
                <option value="newest" className="bg-terminal-card text-foreground">Newest First</option>
                <option value="oldest" className="bg-terminal-card text-foreground">Oldest First</option>
                <option value="relevance" className="bg-terminal-card text-foreground">Most Relevant</option>
              </select>
              </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {filteredNews.length} articles found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terminal-Specific News */}
      {terminalSpecificNews.length > 0 && (
        <Card className="terminal-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              Relevant to {terminalType.charAt(0).toUpperCase() + terminalType.slice(1)}s
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {terminalSpecificNews.map((article) => (
                <Card key={article.id} className="terminal-card hover:terminal-glow transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={`text-xs ${getCategoryColor(article.category)}`}>
                        {article.category.replace('-', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(article.publishedAt)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {article.source}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-xs"
                        onClick={() => window.open(article.url, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Read
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-7 bg-terminal-card/50">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center gap-2 text-xs"
              >
                <Icon className="w-3 h-3" />
                {category.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((article) => (
              <Card key={article.id} className="terminal-card hover:terminal-glow transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={`text-xs ${getCategoryColor(article.category)}`}>
                      {article.category.replace('-', ' ')}
                    </Badge>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatDate(article.publishedAt)}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-base mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {article.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      {article.author}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Eye className="w-3 h-3" />
                      {article.readTime} min read
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-accent">
                      {article.source}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8"
                      onClick={() => window.open(article.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
        ))}
      </div>
          
          {filteredNews.length === 0 && (
            <div className="text-center py-12">
              <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}