import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Zap, Target, TrendingUp } from 'lucide-react';

interface AIHunterWidgetProps {
  className?: string;
}

export default function AIHunterWidget({ className }: AIHunterWidgetProps) {
  return (
    <Card className={`bg-terminal-bg border-terminal-border ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-terminal-text">
          <Zap className="w-5 h-5 text-accent" />
          AI Hunter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-terminal-text/70">
          AI-powered search and analysis tools for aviation professionals.
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Search className="w-3 h-3 mr-1" />
            Smart Search
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Target className="w-3 h-3 mr-1" />
            Target Analysis
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-terminal-text/70">Active Searches</span>
            <Badge variant="secondary" className="text-xs">3</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-terminal-text/70">Success Rate</span>
            <Badge variant="default" className="text-xs bg-green-600">94%</Badge>
          </div>
        </div>
        
        <div className="pt-2 border-t border-terminal-border">
          <div className="flex items-center gap-2 text-xs text-terminal-text/60">
            <TrendingUp className="w-3 h-3" />
            <span>AI Hunter is analyzing market patterns...</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
