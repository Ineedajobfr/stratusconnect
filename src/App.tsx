// Theme is imported in main.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, memo } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { FullPageLoader } from "@/components/LoadingSpinner";
import { NavigationOptimizer } from "@/components/NavigationOptimizer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { logger } from "@/utils/performance";

import { StatusBanner } from "@/components/StatusBanner";

// Import new dashboard components
import BrokerDashboard from "@/components/dashboard/BrokerDashboard";
import OperatorDashboard from "@/components/dashboard/OperatorDashboard";

// Lazy load pages for better performance - prioritize by usage frequency
const Index = lazy(() => import("./pages/Index"));
const Enter = lazy(() => import("./pages/Enter"));
const BrokerTerminal = lazy(() => import("./pages/BrokerTerminal"));
const OperatorTerminal = lazy(() => import("./pages/OperatorTerminal"));
const PilotTerminal = lazy(() => import("./pages/PilotTerminal"));
const CrewTerminal = lazy(() => import("./pages/CrewTerminal"));
const AdminTerminal = lazy(() => import("./pages/AdminTerminal"));
const BetaNavigator = lazy(() => import("./pages/BetaNavigator"));
const Status = lazy(() => import("./pages/CompliantStatus"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const SLA = lazy(() => import("./pages/CompliantSLA"));

// Secondary pages - loaded on demand
const Demo = lazy(() => import("./pages/Demo"));
const About = lazy(() => import("./pages/About"));
const Fees = lazy(() => import("./pages/Fees"));
const Payments = lazy(() => import("./pages/Payments"));
const Terms = lazy(() => import("./pages/CompliantTerms"));
const Privacy = lazy(() => import("./pages/CompliantPrivacy"));
const AircraftIntelligence = lazy(() => import("./pages/AircraftIntelligence"));
const Security = lazy(() => import("./pages/Security"));
const Contact = lazy(() => import("./pages/Contact"));
const Compliance = lazy(() => import("./pages/Compliance"));
const VerificationPending = lazy(() => import("./pages/VerificationPending"));
const AdminConsole = lazy(() => import("./pages/AdminConsole"));
const AdminSetup = lazy(() => import("./pages/AdminSetup"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PublicProfile = lazy(() => import("./pages/PublicProfile"));
const ProfileSettings = lazy(() => import("./pages/ProfileSettings"));
const Directory = lazy(() => import("./pages/Directory"));
const Auth = lazy(() => import("./pages/Auth"));

// Demo terminals
const DemoBrokerTerminal = lazy(() => import("./pages/DemoBrokerTerminal"));
const DemoOperatorTerminal = lazy(() => import("./pages/DemoOperatorTerminal"));
const DemoPilotTerminal = lazy(() => import("./pages/DemoPilotTerminal"));
const DemoCrewTerminal = lazy(() => import("./pages/DemoCrewTerminal"));
const DemoMarketplace = lazy(() => import("./pages/DemoMarketplace"));

// Help pages
const HelpBroker = lazy(() => import("./pages/HelpBroker"));
const HelpOperator = lazy(() => import("./pages/HelpOperator"));
const HelpPilot = lazy(() => import("./pages/HelpPilot"));
const HelpCrew = lazy(() => import("./pages/HelpCrew"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: (failureCount, error) => {
        // Only retry on network errors, not 4xx/5xx responses
        if (error && 'status' in error && typeof error.status === 'number') {
          return error.status >= 500 && failureCount < 2;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false, // Disable refetch on focus for better performance
      refetchOnMount: true,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 1, // Limit mutation retries
    },
  },
});

// Memoized layout components for better performance
const MemoizedToaster = memo(Toaster);
const MemoizedSonner = memo(Sonner);
const MemoizedNavigationOptimizer = memo(NavigationOptimizer);

const App = memo(() => {
  // Log app initialization in development only
  logger.debug('StratusConnect App initializing...');

  return (
    <div className="min-h-screen bg-app text-body" style={{ backgroundColor: 'hsl(217, 32%, 5%)', color: 'hsl(0, 0%, 98%)' }}>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <BrowserRouter>
              <MemoizedNavigationOptimizer />
              <StatusBanner />
              <AuthProvider>
              <MemoizedToaster />
              <MemoizedSonner />
              <Suspense fallback={<FullPageLoader />}>
                <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/enter" element={<Enter />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/about" element={<About />} />
              <Route path="/fees" element={<Fees />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/security" element={<Security />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/compliance" element={<Compliance />} />
              <Route path="/intelligence" element={<AircraftIntelligence />} />
              <Route path="/verification-pending" element={<VerificationPending />} />
              
              {/* Demo routes */}
              <Route path="/demo/broker" element={<DemoBrokerTerminal />} />
              <Route path="/demo/operator" element={<DemoOperatorTerminal />} />
              <Route path="/demo/pilot" element={<DemoPilotTerminal />} />
              <Route path="/demo/crew" element={<DemoCrewTerminal />} />
            <Route path="/demo/marketplace" element={<DemoMarketplace />} />
              
              {/* Help pages */}
              <Route path="/help/broker" element={<HelpBroker />} />
              <Route path="/help/operator" element={<HelpOperator />} />
              <Route path="/help/pilot" element={<HelpPilot />} />
              <Route path="/help/crew" element={<HelpCrew />} />
              
              {/* Public Beta Testing Routes - Protected for users/owners */}
              <Route path="/beta" element={<BetaNavigator />} />
              <Route 
                path="/beta/broker" 
                element={
                  <ProtectedRoute allowedRoles={['broker']}>
                    <BrokerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/beta/operator" 
                element={
                  <ProtectedRoute allowedRoles={['operator']}>
                    <OperatorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/beta/pilot" 
                element={
                  <ProtectedRoute allowedRoles={['pilot']}>
                    <PilotTerminal />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/beta/crew" 
                element={
                  <ProtectedRoute allowedRoles={['pilot', 'crew']}>
                    <CrewTerminal />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/beta/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminTerminal />
                  </ProtectedRoute>
                } 
              />
        
              
              {/* Profile routes */}
              <Route path="/u/:username" element={<PublicProfile />} />
              <Route path="/settings/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
              <Route path="/directory" element={<ProtectedRoute><Directory /></ProtectedRoute>} />
              <Route path="/status" element={<Status />} />
              
              {/* Legal pages */}
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/sla" element={<SLA />} />
              
              {/* Legacy redirect */}
              <Route path="/login" element={<Navigate to="/enter" replace />} />
              
              {/* Protected terminal routes */}
              <Route 
                path="/terminal/broker" 
                element={
                  <ProtectedRoute allowedRoles={['broker']}>
                    <BrokerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/terminal/operator" 
                element={
                  <ProtectedRoute allowedRoles={['operator']}>
                    <OperatorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/terminal/pilot" 
                element={
                  <ProtectedRoute allowedRoles={['pilot']}>
                    <PilotTerminal />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/terminal/crew" 
                element={
                  <ProtectedRoute allowedRoles={['pilot', 'crew']}>
                    <CrewTerminal />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/terminal/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminTerminal />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin']} requireApproved={true}>
                    <AdminConsole />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin-setup" 
                element={
                  <ProtectedRoute allowedRoles={['admin']} requireApproved={true}>
                    <AdminSetup />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/secure-admin-setup" 
                element={
                  <ProtectedRoute allowedRoles={['admin']} requireApproved={true}>
                    <SecureAdminSetup />
                  </ProtectedRoute>
                } 
              />
              
              {/* Security routes */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
              </Suspense>
            </AuthProvider>
          </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </div>
  );
});

export default App;