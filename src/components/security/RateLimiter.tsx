import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Zap,
  Shield,
  Activity
} from 'lucide-react';

interface RateLimit {
  endpoint: string;
  limit: number;
  used: number;
  remaining: number;
  resetTime: number;
  windowMs: number;
}

interface RateLimiterProps {
  onRateLimitExceeded?: (endpoint: string) => void;
}

const RateLimiter: React.FC<RateLimiterProps> = ({ onRateLimitExceeded }) => {
  const [rateLimits, setRateLimits] = useState<RateLimit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock rate limit data
    const mockRateLimits: RateLimit[] = [
      {
        endpoint: '/api/auth/login',
        limit: 10,
        used: 3,
        remaining: 7,
        resetTime: Date.now() + 15 * 60 * 1000, // 15 minutes
        windowMs: 15 * 60 * 1000
      },
      {
        endpoint: '/api/jobs/apply',
        limit: 50,
        used: 12,
        remaining: 38,
        resetTime: Date.now() + 60 * 60 * 1000, // 1 hour
        windowMs: 60 * 60 * 1000
      },
      {
        endpoint: '/api/forums/post',
        limit: 20,
        used: 18,
        remaining: 2,
        resetTime: Date.now() + 30 * 60 * 1000, // 30 minutes
        windowMs: 30 * 60 * 1000
      },
      {
        endpoint: '/api/documents/upload',
        limit: 5,
        used: 5,
        remaining: 0,
        resetTime: Date.now() + 60 * 60 * 1000, // 1 hour
        windowMs: 60 * 60 * 1000
      }
    ];

    setRateLimits(mockRateLimits);
    setLoading(false);
  }, []);

  const getUsagePercentage = (used: number, limit: number) => {
    return (used / limit) * 100;
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return 'text-red-500';
    if (percentage >= 80) return 'text-orange-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 100) return <XCircle className="h-4 w-4" />;
    if (percentage >= 80) return <AlertTriangle className="h-4 w-4" />;
    if (percentage >= 60) return <Clock className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const getStatusText = (percentage: number) => {
    if (percentage >= 100) return 'Rate Limited';
    if (percentage >= 80) return 'Near Limit';
    if (percentage >= 60) return 'Moderate Usage';
    return 'Normal Usage';
  };

  const formatTimeRemaining = (resetTime: number) => {
    const now = Date.now();
    const remaining = resetTime - now;
    
    if (remaining <= 0) return 'Reset';
    
    const minutes = Math.floor(remaining / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const handleResetRateLimit = useCallback((endpoint: string) => {
    setRateLimits(prev => prev.map(limit => 
      limit.endpoint === endpoint 
        ? { ...limit, used: 0, remaining: limit.limit, resetTime: Date.now() + limit.windowMs }
        : limit
    ));
  }, []);

  const handleTestEndpoint = useCallback((endpoint: string) => {
    setRateLimits(prev => prev.map(limit => 
      limit.endpoint === endpoint 
        ? { ...limit, used: Math.min(limit.used + 1, limit.limit), remaining: Math.max(limit.remaining - 1, 0) }
        : limit
    ));
  }, []);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-terminal-fg">Rate Limiter</h1>
          <p className="text-terminal-muted">Monitor and manage API rate limits</p>
        </div>
        <Button className="bg-terminal-accent hover:bg-terminal-accent/90">
          <Shield className="h-4 w-4 mr-2" />
          Configure Limits
        </Button>
      </div>

      {/* Rate Limit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rateLimits.map((rateLimit) => {
          const percentage = getUsagePercentage(rateLimit.used, rateLimit.limit);
          const isRateLimited = percentage >= 100;
          
          return (
            <Card key={rateLimit.endpoint} className="bg-terminal-bg border-terminal-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-terminal-fg text-lg">
                    {rateLimit.endpoint}
                  </CardTitle>
                  <Badge className={getStatusColor(percentage)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(percentage)}
                      <span>{getStatusText(percentage)}</span>
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Usage Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-terminal-muted">Usage</span>
                    <span className="text-terminal-fg">
                      {rateLimit.used} / {rateLimit.limit}
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-terminal-muted">
                    <span>0</span>
                    <span>{rateLimit.limit}</span>
                  </div>
                </div>

                {/* Rate Limit Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-terminal-muted">Remaining</p>
                    <p className="text-terminal-fg font-semibold">
                      {rateLimit.remaining}
                    </p>
                  </div>
                  <div>
                    <p className="text-terminal-muted">Reset In</p>
                    <p className="text-terminal-fg font-semibold">
                      {formatTimeRemaining(rateLimit.resetTime)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-terminal-border text-terminal-fg"
                    onClick={() => handleTestEndpoint(rateLimit.endpoint)}
                    disabled={isRateLimited}
                  >
                    <Zap className="h-4 w-4 mr-1" />
                    Test
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-terminal-border text-terminal-fg"
                    onClick={() => handleResetRateLimit(rateLimit.endpoint)}
                  >
                    <Activity className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                </div>

                {/* Rate Limited Alert */}
                {isRateLimited && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-red-500 text-sm font-medium">
                        Rate limit exceeded. Please wait for reset.
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Rate Limit Summary */}
      <Card className="bg-terminal-bg border-terminal-border">
        <CardHeader>
          <CardTitle className="text-terminal-fg">Rate Limit Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-terminal-fg">
                {rateLimits.filter(r => r.remaining > 0).length}
              </div>
              <div className="text-sm text-terminal-muted">Available Endpoints</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-terminal-fg">
                {rateLimits.filter(r => r.remaining === 0).length}
              </div>
              <div className="text-sm text-terminal-muted">Rate Limited</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-terminal-fg">
                {Math.round(rateLimits.reduce((acc, r) => acc + (r.used / r.limit), 0) / rateLimits.length * 100)}%
              </div>
              <div className="text-sm text-terminal-muted">Average Usage</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RateLimiter;
