import { 
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
  Settings,
  MessageCircle,
  Bell,
  Search,
  FileText,
  BarChart3,
  Activity,
  Zap
} from "lucide-react";

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  roles?: string[];
  badge?: string;
  description?: string;
}

export interface RoleConfig {
  role: string;
  displayName: string;
  color: string;
  navigationItems: NavigationItem[];
  quickActions: NavigationItem[];
}

// Base navigation items that are common across roles
const commonNavigationItems: NavigationItem[] = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    href: "/home",
    description: "Your personalized dashboard"
  },
  {
    id: "network",
    label: "My Network",
    icon: Users,
    href: "/network",
    description: "Professional connections and relationships"
  },
  {
    id: "messages",
    label: "Messages",
    icon: MessageCircle,
    href: "/messages",
    description: "Direct communications"
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    href: "/notifications",
    description: "Activity updates and alerts"
  }
];

// Role-specific navigation items
const brokerNavigationItems: NavigationItem[] = [
  ...commonNavigationItems,
  {
    id: "quotes",
    label: "My Quotes",
    icon: Briefcase,
    href: "/quotes",
    description: "Manage client quotes and proposals"
  },
  {
    id: "clients",
    label: "Client Management",
    icon: Building2,
    href: "/clients",
    description: "Manage client relationships and accounts"
  },
  {
    id: "market",
    label: "Market Intelligence",
    icon: Globe,
    href: "/market",
    description: "Real-time market data and insights"
  },
  {
    id: "assignments",
    label: "Flight Assignments",
    icon: Plane,
    href: "/assignments",
    description: "Active and pending flight assignments"
  },
  {
    id: "earnings",
    label: "Earnings",
    icon: DollarSign,
    href: "/earnings",
    description: "Financial performance and transactions"
  }
];

const operatorNavigationItems: NavigationItem[] = [
  ...commonNavigationItems,
  {
    id: "fleet",
    label: "Fleet Management",
    icon: Plane,
    href: "/fleet",
    description: "Manage aircraft and fleet operations"
  },
  {
    id: "crew",
    label: "Crew Scheduling",
    icon: Calendar,
    href: "/crew",
    description: "Schedule and manage crew assignments"
  },
  {
    id: "operations",
    label: "Operations",
    icon: Shield,
    href: "/operations",
    description: "Operational oversight and management"
  },
  {
    id: "assignments",
    label: "Flight Assignments",
    icon: Plane,
    href: "/assignments",
    description: "Active and pending flight assignments"
  },
  {
    id: "earnings",
    label: "Earnings",
    icon: DollarSign,
    href: "/earnings",
    description: "Financial performance and transactions"
  }
];

const pilotNavigationItems: NavigationItem[] = [
  ...commonNavigationItems,
  {
    id: "schedule",
    label: "My Schedule",
    icon: Calendar,
    href: "/schedule",
    description: "Personal flight schedule and availability"
  },
  {
    id: "assignments",
    label: "Assignments",
    icon: Plane,
    href: "/assignments",
    description: "Current and upcoming flight assignments"
  },
  {
    id: "certifications",
    label: "Certifications",
    icon: Award,
    href: "/certifications",
    description: "Licenses, ratings, and qualifications"
  },
  {
    id: "earnings",
    label: "Earnings",
    icon: DollarSign,
    href: "/earnings",
    description: "Flight compensation and performance"
  }
];

const crewNavigationItems: NavigationItem[] = [
  ...commonNavigationItems,
  {
    id: "calendar",
    label: "My Calendar",
    icon: Calendar,
    href: "/calendar",
    description: "Personal schedule and availability"
  },
  {
    id: "opportunities",
    label: "Opportunities",
    icon: Briefcase,
    href: "/opportunities",
    description: "Available crew positions and assignments"
  },
  {
    id: "service",
    label: "Service Excellence",
    icon: Award,
    href: "/service",
    description: "Service standards and performance tracking"
  },
  {
    id: "earnings",
    label: "Earnings",
    icon: DollarSign,
    href: "/earnings",
    description: "Crew compensation and performance"
  }
];

const adminNavigationItems: NavigationItem[] = [
  ...commonNavigationItems,
  {
    id: "users",
    label: "User Management",
    icon: Users,
    href: "/admin/users",
    description: "Manage platform users and permissions"
  },
  {
    id: "system",
    label: "System Management",
    icon: Settings,
    href: "/admin/system",
    description: "System configuration and maintenance"
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    href: "/admin/analytics",
    description: "Platform usage and performance metrics"
  },
  {
    id: "audit",
    label: "Audit Logs",
    icon: FileText,
    href: "/admin/audit",
    description: "System audit trails and security logs"
  }
];

// Quick actions for each role
const brokerQuickActions: NavigationItem[] = [
  {
    id: "new-quote",
    label: "New Quote",
    icon: Zap,
    href: "/quotes/new",
    description: "Create a new client quote"
  },
  {
    id: "find-operators",
    label: "Find Operators",
    icon: Search,
    href: "/search/operators",
    description: "Search for available operators"
  }
];

const operatorQuickActions: NavigationItem[] = [
  {
    id: "new-flight",
    label: "New Flight",
    icon: Plane,
    href: "/flights/new",
    description: "Create a new flight offering"
  },
  {
    id: "find-crew",
    label: "Find Crew",
    icon: Search,
    href: "/search/crew",
    description: "Search for available crew members"
  }
];

const pilotQuickActions: NavigationItem[] = [
  {
    id: "update-availability",
    label: "Update Availability",
    icon: Calendar,
    href: "/schedule/availability",
    description: "Update your flight availability"
  },
  {
    id: "find-assignments",
    label: "Find Assignments",
    icon: Search,
    href: "/search/assignments",
    description: "Search for available flight assignments"
  }
];

const crewQuickActions: NavigationItem[] = [
  {
    id: "update-availability",
    label: "Update Availability",
    icon: Calendar,
    href: "/calendar/availability",
    description: "Update your service availability"
  },
  {
    id: "find-opportunities",
    label: "Find Opportunities",
    icon: Search,
    href: "/search/opportunities",
    description: "Search for available crew opportunities"
  }
];

const adminQuickActions: NavigationItem[] = [
  {
    id: "system-health",
    label: "System Health",
    icon: Activity,
    href: "/admin/system/health",
    description: "Check system health and status"
  },
  {
    id: "user-reports",
    label: "User Reports",
    icon: BarChart3,
    href: "/admin/reports/users",
    description: "Generate user activity reports"
  }
];

// Role configurations
export const roleConfigs: Record<string, RoleConfig> = {
  broker: {
    role: "broker",
    displayName: "Broker",
    color: "blue",
    navigationItems: brokerNavigationItems,
    quickActions: brokerQuickActions
  },
  operator: {
    role: "operator",
    displayName: "Operator",
    color: "green",
    navigationItems: operatorNavigationItems,
    quickActions: operatorQuickActions
  },
  pilot: {
    role: "pilot",
    displayName: "Pilot",
    color: "orange",
    navigationItems: pilotNavigationItems,
    quickActions: pilotQuickActions
  },
  crew: {
    role: "crew",
    displayName: "Crew Member",
    color: "purple",
    navigationItems: crewNavigationItems,
    quickActions: crewQuickActions
  },
  admin: {
    role: "admin",
    displayName: "Administrator",
    color: "red",
    navigationItems: adminNavigationItems,
    quickActions: adminQuickActions
  }
};

// Helper functions
export function getNavigationItemsForRole(role: string): NavigationItem[] {
  return roleConfigs[role]?.navigationItems || [];
}

export function getQuickActionsForRole(role: string): NavigationItem[] {
  return roleConfigs[role]?.quickActions || [];
}

export function getRoleConfig(role: string): RoleConfig | undefined {
  return roleConfigs[role];
}

export function getAllRoles(): string[] {
  return Object.keys(roleConfigs);
}

// Search configuration
export const searchConfig = {
  enabledRoles: ["broker", "operator", "pilot", "crew", "admin"],
  searchCategories: [
    { id: "flights", label: "Flights", icon: Plane },
    { id: "users", label: "Users", icon: Users },
    { id: "companies", label: "Companies", icon: Building2 },
    { id: "aircraft", label: "Aircraft", icon: Plane },
    { id: "routes", label: "Routes", icon: Globe }
  ]
};
