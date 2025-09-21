import { ReactNode, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { NavigationArrows } from "@/components/NavigationArrows";
import { useSessionManager } from "@/hooks/useSessionManager";
import { DemoBanner } from "@/components/DemoBanner";
import { Search, User, LogOut, ChevronRight, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { withMemo } from "@/components/PerformanceOptimizer";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TerminalLayoutProps {
  children: ReactNode;
  title: string;
  userRole: string;
  menuItems: MenuItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  bannerText: string;
  terminalType?: 'broker' | 'operator' | 'crew' | 'admin' | 'demo';
}

export const TerminalLayout = withMemo(({
  children,
  title,
  userRole,
  menuItems,
  activeTab,
  onTabChange,
  bannerText,
  terminalType = 'broker'
}: TerminalLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Enable session management with 20-minute timeout
  useSessionManager({ timeoutMinutes: 20, warningMinutes: 2 });

  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout fails
      navigate('/');
    }
  }, [navigate]);

  const handleLogoClick = useCallback(() => {
    // Stay on current page or go to home if on a terminal page
    const currentPath = window.location.pathname;
    if (currentPath.includes('/terminal/') || currentPath.includes('/beta/')) {
      // If on a terminal page, go to home
      navigate('/');
    }
    // Otherwise, do nothing (stay on current page)
  }, [navigate]);

  const handleTabChange = useCallback((tab: string) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  }, [onTabChange]);

  // Memoize sidebar navigation to prevent unnecessary re-renders
  const SidebarNav = useMemo(() => () => (
    <div className="flex flex-col h-full bg-terminal-bg/98 backdrop-blur border-r border-terminal-border">
      <div className="p-6 border-b border-terminal-border">
        <div className="flex items-center space-x-3">
          <div 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
          >
            <span className="text-xl font-bold text-foreground">
              StratusConnect
            </span>
            <div className="text-sm text-gunmetal font-medium mt-1">{userRole}</div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto terminal-scrollbar">
        <div className="space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id} 
                onClick={() => handleTabChange(item.id)} 
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl ${
                  isActive 
                    ? 'bg-terminal-glow/20 text-terminal-glow border border-terminal-glow/30 shadow-terminal' 
                    : 'text-gunmetal hover:text-foreground hover:bg-terminal-card/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-terminal-border">
        <div className="flex items-center space-x-2 text-sm text-gunmetal">
          <div className="w-2 h-2 bg-terminal-success rounded-full terminal-pulse"></div>
          <span>System Operational</span>
        </div>
      </div>
    </div>
  ), [menuItems, activeTab, handleTabChange, handleLogoClick, userRole]);

  return (
    <div className="relative min-h-screen bg-terminal-bg">
      <DemoBanner />
      {/* Background animation layer */}
      <StarfieldRunwayBackground intensity={0.6} starCount={200} />
      
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Mobile Navigation */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-72 p-0 bg-terminal-bg/98 border-terminal-border lg:hidden">
            <SidebarNav />
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-72">
          <SidebarNav />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Top Bar */}
          <header className="sticky top-12 z-40 px-6 py-4 bg-terminal-bg/95 backdrop-blur border-b border-terminal-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost" 
                  size="sm"
                  className="lg:hidden text-foreground p-2 hover:bg-terminal-card/50"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </Button>
                
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground terminal-glow">{title}</h1>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="hidden lg:block">
                  <NavigationArrows />
                </div>
                <Button variant="ghost" size="sm" className="text-gunmetal hover:text-foreground hidden sm:flex">
                  <User className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-gunmetal hover:text-foreground"
                >
                  <LogOut className="w-4 h-4 lg:mr-2" />
                  <span className="hidden lg:inline">Logout</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Banner */}
          <div className="px-6 py-4 bg-terminal-card/30 border-b border-terminal-border">
            <p className="text-lg lg:text-xl font-medium text-foreground/90">{bannerText}</p>
          </div>

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-6 relative overflow-auto terminal-scrollbar">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      {/* Help overlay temporarily disabled to avoid blocking clicks */}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.title === nextProps.title &&
    prevProps.userRole === nextProps.userRole &&
    prevProps.activeTab === nextProps.activeTab &&
    prevProps.bannerText === nextProps.bannerText &&
    prevProps.terminalType === nextProps.terminalType &&
    JSON.stringify(prevProps.menuItems) === JSON.stringify(nextProps.menuItems)
  );
});