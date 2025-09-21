import React, { useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Bell, 
  MessageCircle, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Home,
  Users,
  Briefcase,
  Plane,
  Building2,
  UserCheck,
  Shield,
  Calendar,
  Award,
  DollarSign,
  Globe,
  Menu,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";
import { supabase } from "@/integrations/supabase/client";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  roles?: string[];
  badge?: string;
}

interface UnifiedLayoutProps {
  children: React.ReactNode;
  title?: string;
}

// Navigation configuration for each role
const navigationConfig: Record<string, NavigationItem[]> = {
  broker: [
    { id: "home", label: "Home", icon: Home, href: "/home" },
    { id: "network", label: "My Network", icon: Users, href: "/network" },
    { id: "quotes", label: "My Quotes", icon: Briefcase, href: "/quotes" },
    { id: "clients", label: "Client Management", icon: Building2, href: "/clients" },
    { id: "market", label: "Market Intelligence", icon: Globe, href: "/market" },
    { id: "assignments", label: "Flight Assignments", icon: Plane, href: "/assignments" },
    { id: "earnings", label: "Earnings", icon: DollarSign, href: "/earnings" },
  ],
  operator: [
    { id: "home", label: "Home", icon: Home, href: "/home" },
    { id: "network", label: "My Network", icon: Users, href: "/network" },
    { id: "fleet", label: "Fleet Management", icon: Plane, href: "/fleet" },
    { id: "crew", label: "Crew Scheduling", icon: Calendar, href: "/crew" },
    { id: "operations", label: "Operations", icon: Shield, href: "/operations" },
    { id: "assignments", label: "Flight Assignments", icon: Plane, href: "/assignments" },
    { id: "earnings", label: "Earnings", icon: DollarSign, href: "/earnings" },
  ],
  pilot: [
    { id: "home", label: "Home", icon: Home, href: "/home" },
    { id: "network", label: "My Network", icon: Users, href: "/network" },
    { id: "schedule", label: "My Schedule", icon: Calendar, href: "/schedule" },
    { id: "assignments", label: "Assignments", icon: Plane, href: "/assignments" },
    { id: "certifications", label: "Certifications", icon: Award, href: "/certifications" },
    { id: "earnings", label: "Earnings", icon: DollarSign, href: "/earnings" },
  ],
  crew: [
    { id: "home", label: "Home", icon: Home, href: "/home" },
    { id: "network", label: "My Network", icon: Users, href: "/network" },
    { id: "calendar", label: "My Calendar", icon: Calendar, href: "/calendar" },
    { id: "opportunities", label: "Opportunities", icon: Briefcase, href: "/opportunities" },
    { id: "service", label: "Service Excellence", icon: Award, href: "/service" },
    { id: "earnings", label: "Earnings", icon: DollarSign, href: "/earnings" },
  ],
  admin: [
    { id: "home", label: "Home", icon: Home, href: "/home" },
    { id: "users", label: "User Management", icon: Users, href: "/users" },
    { id: "system", label: "System Management", icon: Settings, href: "/system" },
    { id: "analytics", label: "Analytics", icon: Globe, href: "/analytics" },
    { id: "audit", label: "Audit Logs", icon: Shield, href: "/audit" },
  ],
};

export function UnifiedLayout({ children, title }: UnifiedLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get navigation items for current user role
  const navigationItems = useMemo(() => {
    if (!user?.role) return [];
    return navigationConfig[user.role] || [];
  }, [user?.role]);

  // Get current active navigation item
  const activeNavItem = useMemo(() => {
    const currentPath = location.pathname;
    return navigationItems.find(item => currentPath.startsWith(item.href))?.id || "home";
  }, [location.pathname, navigationItems]);

  const handleLogoClick = useCallback(() => {
    navigate("/home");
  }, [navigate]);

  const handleNavigation = useCallback((href: string) => {
    navigate(href);
    setMobileMenuOpen(false);
  }, [navigate]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page with query
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [searchQuery, navigate]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/");
    }
  }, [logout, navigate]);

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-terminal-bg">
      <StarfieldRunwayBackground intensity={0.4} starCount={150} />
      
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-terminal-bg/95 backdrop-blur border-b border-terminal-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo and Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0 bg-terminal-bg/98 border-terminal-border">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-terminal-border">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <nav className="flex-1 p-4">
                      {renderNavigationItems(true)}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <button
                onClick={handleLogoClick}
                className="text-2xl font-bold text-accent hover:text-accent/80 transition-colors"
              >
                StratusConnect
              </button>
            </div>

            {/* Center - Search Bar (only for authenticated users) */}
            <div className="flex-1 max-w-md mx-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search flights, users, companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-terminal-card/50 border-terminal-border focus:border-accent"
                />
              </form>
            </div>

            {/* Right side - Notifications, Messages, Profile */}
            <div className="flex items-center space-x-2">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>

              {/* Messages */}
              <Button variant="ghost" size="sm" className="relative">
                <MessageCircle className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  2
                </Badge>
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 px-3">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden md:block text-sm font-medium">{user.fullName}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-terminal-card border-terminal-border">
                  <div className="px-3 py-2 border-b border-terminal-border">
                    <p className="text-sm font-medium">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex max-w-7xl mx-auto">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-terminal-bg/50 border-r border-terminal-border min-h-screen">
          <nav className="p-4">
            {renderNavigationItems(false)}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {title && (
            <div className="p-6 border-b border-terminal-border">
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            </div>
          )}
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );

  function renderNavigationItems(isMobile: boolean) {
    return (
      <div className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNavItem === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive 
                  ? "bg-accent text-white" 
                  : "text-muted-foreground hover:text-foreground hover:bg-terminal-card/50"
              )}
              onClick={() => handleNavigation(item.href)}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
              {item.badge && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {item.badge}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    );
  }
}
