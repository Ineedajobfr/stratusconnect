import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export default function MobileOptimizedLayout({ 
  children, 
  header, 
  sidebar, 
  className = "" 
}: MobileOptimizedLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className={`min-h-screen bg-terminal-bg ${className}`}>
        {/* Mobile Header */}
        <div className="sticky top-0 z-50 bg-terminal-card border-b border-terminal-border backdrop-blur-modern">
          <div className="flex items-center justify-between p-4">
            {header}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-terminal-card border-terminal-border">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {sidebar}
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4 space-y-4">
          {children}
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className={`min-h-screen bg-terminal-bg ${className}`}>
      {/* Desktop Header */}
      {header && (
        <div className="sticky top-0 z-40 bg-terminal-card border-b border-terminal-border backdrop-blur-modern">
          {header}
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        {sidebar && (
          <div className={`hidden md:block transition-all duration-300 ${
            isCollapsed ? 'w-16' : 'w-64'
          } bg-terminal-card border-r border-terminal-border min-h-screen`}>
            <div className="p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="mb-4"
              >
                {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </Button>
              {sidebar}
            </div>
          </div>
        )}

        {/* Desktop Content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// Mobile-optimized card component
export function MobileCard({ 
  children, 
  className = "",
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={`bg-terminal-card border border-terminal-border rounded-lg p-4 mb-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Mobile-optimized button group
export function MobileButtonGroup({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      {children}
    </div>
  );
}

// Mobile-optimized table
export function MobileTable({ 
  data, 
  columns, 
  className = "" 
}: { 
  data: any[]; 
  columns: Array<{ key: string; label: string; render?: (item: any) => React.ReactNode }>; 
  className?: string; 
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className={`space-y-3 ${className}`}>
        {data.map((item, index) => (
          <MobileCard key={index}>
            {columns.map((column) => (
              <div key={column.key} className="flex justify-between items-center py-2 border-b border-terminal-border last:border-b-0">
                <span className="text-sm font-medium text-muted-foreground">{column.label}</span>
                <span className="text-sm text-foreground">
                  {column.render ? column.render(item) : item[column.key]}
                </span>
              </div>
            ))}
          </MobileCard>
        ))}
      </div>
    );
  }

  // Desktop table
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full border-separate border-spacing-0 text-sm">
        <thead className="bg-terminal-card text-foreground border-b border-terminal-border">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="border-b border-terminal-border px-3 py-2 text-left">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-terminal-card/50">
              {columns.map((column) => (
                <td key={column.key} className="border-b border-terminal-border px-3 py-2">
                  {column.render ? column.render(item) : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
