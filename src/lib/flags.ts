// Feature Flags - Control feature visibility and behavior
export const FLAGS = {
  performanceProgramme: process.env.VITE_PERFORMANCE_PROGRAMME === "true",
};

export interface User {
  role: string;
  accountType: string;
}

export function showLeagueUI(user: User): boolean {
  if (!FLAGS.performanceProgramme) return false;
  
  // Hide for client-facing enterprise accounts
  if (user.accountType === "enterprise_client") return false;
  
  // Show for supply-side users only
  return ["broker", "operator", "pilot", "crew"].includes(user.role);
}

export function showPerformanceReport(user: User): boolean {
  // Always show performance report for enterprise clients
  if (user.accountType === "enterprise_client") return true;
  
  // Show for all authenticated users
  return true;
}

export function isPerformanceProgrammeEnabled(): boolean {
  return FLAGS.performanceProgramme;
}
