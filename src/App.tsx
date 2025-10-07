// Theme is imported in main.tsx
// import { ErrorBoundary } from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { NavigationOptimizer } from "@/components/NavigationOptimizer";
import { WorkflowProvider } from "@/components/real-workflows/WorkflowIntegration";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { logger } from "@/utils/performance";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, memo, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { StatusBanner } from "@/components/StatusBanner";
import { AuthenticationGuard } from "@/components/security/AuthenticationGuard";

// Import new dashboard components
import BrokerDashboard from "@/components/dashboard/BrokerDashboard";
import OperatorDashboard from "@/components/dashboard/OperatorDashboard";

// Lazy load pages for better performance - prioritize by usage frequency
const StratusLauncher = lazy(() => import("./pages/StratusLauncher"));
const Index = lazy(() => import("./pages/Index"));
const Enter = lazy(() => import("./pages/Enter"));
const HomePage = lazy(() => import("./pages/HomePage"));
const HowToUse = lazy(() => import("./pages/HowToUse"));
const BrokerTerminal = lazy(() => import("./pages/BrokerTerminal"));
const OperatorTerminal = lazy(() => import("./pages/OperatorTerminal"));
const PilotTerminal = lazy(() => import("./pages/PilotTerminal"));
const CrewTerminal = lazy(() => import("./pages/CrewTerminal"));
const AdminTerminal = lazy(() => import("./pages/AdminTerminal"));
const BetaSignups = lazy(() => import("./pages/admin/BetaSignups"));
const RoleSelection = lazy(() => import("./pages/RoleSelection"));
const BetaNavigator = lazy(() => import("./pages/BetaNavigator"));
const BetaBrokerTerminal = lazy(() => import("./pages/BetaBrokerTerminal"));
const BetaOperatorTerminal = lazy(() => import("./pages/BetaOperatorTerminal"));
const BetaPilotTerminal = lazy(() => import("./pages/BetaPilotTerminal"));
const BetaCrewTerminal = lazy(() => import("./pages/BetaCrewTerminal"));
const BetaTest = lazy(() => import("./pages/BetaTest"));
const Status = lazy(() => import("./pages/CompliantStatus"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const SLA = lazy(() => import("./pages/CompliantSLA"));

// New unified navigation pages
const NetworkPage = lazy(() => import("./pages/NetworkPage"));

// Secondary pages - loaded on demand
const Demo = lazy(() => import("./pages/Demo"));
const About = lazy(() => import("./pages/About"));
const Fees = lazy(() => import("./pages/Fees"));

// Tutorial components
const BrokerTutorial = lazy(() => import("./components/help/BrokerTutorial"));
const Payments = lazy(() => import("./pages/Payments"));
const Terms = lazy(() => import("./pages/CompliantTerms"));
const Privacy = lazy(() => import("./pages/CompliantPrivacy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const UserAgreement = lazy(() => import("./pages/UserAgreement"));

// Login pages
const BrokerLogin = lazy(() => import("./pages/BrokerLogin"));
const OperatorLogin = lazy(() => import("./pages/OperatorLogin"));
const PilotLogin = lazy(() => import("./pages/PilotLogin"));
const CrewLogin = lazy(() => import("./pages/CrewLogin"));
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
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const SecureAdminSetup = lazy(() => import("./pages/SecureAdminSetup"));
const MessagingCenter = lazy(() => import("./components/messaging/MessagingCenter"));

// Demo terminals
const DemoBrokerTerminal = lazy(() => import("./pages/DemoBrokerTerminal"));
const DemoOperatorTerminal = lazy(() => import("./pages/DemoOperatorTerminal"));
const DemoPilotTerminal = lazy(() => import("./pages/DemoPilotTerminal"));
const DemoCrewTerminal = lazy(() => import("./pages/DemoCrewTerminal"));
const DemoTest = lazy(() => import("./pages/DemoTest"));
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
    <div className="min-h-screen bg-app text-body w-full overflow-x-hidden">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
              }}
            >
              <MemoizedNavigationOptimizer />
              <StatusBanner />
              <AuthProvider>
                <WorkflowProvider>
                  <MemoizedToaster />
                  <MemoizedSonner />
                  <Suspense fallback={<LoadingSpinner size="lg" text="Loading StratusConnect..." />}>
                    <Routes>
              {/* Public routes */}
              <Route path="/" element={<StratusLauncher />} />
              <Route path="/enter" element={<Enter />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/roles" element={<RoleSelection />} />
              <Route path="/how-to-use" element={<HowToUse />} />
              <Route path="/about" element={<About />} />
              <Route path="/fees" element={<Fees />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/user-agreement" element={<UserAgreement />} />
              <Route path="/security" element={<Security />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/compliance" element={<Compliance />} />
              <Route path="/intelligence" element={<AircraftIntelligence />} />
              <Route path="/verification-pending" element={<VerificationPending />} />
              
              {/* New unified navigation routes */}
              <Route 
                path="/home" 
                element={<Index />}
              />
              <Route 
                path="/network" 
                element={
                  <ProtectedRoute>
                    <NetworkPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/messages" 
                element={
                  <ProtectedRoute>
                    <MessagingCenter />
                  </ProtectedRoute>
                } 
              />
              
              {/* Demo routes */}
              {/* Login pages */}
              <Route path="/login/broker" element={<BrokerLogin />} />
              <Route path="/login/operator" element={<OperatorLogin />} />
              <Route path="/login/pilot" element={<PilotLogin />} />
              <Route path="/login/crew" element={<CrewLogin />} />
              
              {/* Demo terminals */}
              <Route path="/demo/broker" element={<DemoBrokerTerminal />} />
              <Route path="/demo/operator" element={<DemoOperatorTerminal />} />
              <Route path="/demo/pilot" element={<DemoPilotTerminal />} />
              <Route path="/demo/crew" element={<DemoCrewTerminal />} />
              <Route path="/demo/test" element={<DemoTest />} />
              <Route path="/demo/marketplace" element={<DemoMarketplace />} />
              
              {/* Help pages */}
              <Route path="/help/broker" element={<HelpBroker />} />
              <Route path="/help/operator" element={<HelpOperator />} />
              <Route path="/help/pilot" element={<HelpPilot />} />
              <Route path="/help/crew" element={<HelpCrew />} />
              
              {/* Tutorial pages */}
              <Route path="/tutorial/broker" element={<BrokerTutorial isDemo={false} />} />
              <Route path="/demo/tutorial/broker" element={<BrokerTutorial isDemo={true} />} />
              
              {/* Public Beta Testing Routes - Protected for users/owners */}
              <Route path="/beta" element={<BetaNavigator />} />
              <Route path="/beta/test" element={<BetaTest />} />
              <Route 
                path="/beta/broker" 
                element={<BetaBrokerTerminal />}
              />
              <Route 
                path="/beta/operator" 
                element={<BetaOperatorTerminal />}
              />
              <Route 
                path="/beta/pilot" 
                element={<BetaPilotTerminal />}
              />
              <Route 
                path="/beta/crew" 
                element={<BetaCrewTerminal />}
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
                path="/admin/beta" 
                element={
                  <ProtectedRoute allowedRoles={['admin']} requireApproved={true}>
                    <BetaSignups />
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
                </WorkflowProvider>
              </AuthProvider>
          </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
    </div>
  );
});

export default App;