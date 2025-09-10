export async function proposePatch(body: {
  agent: string;
  action: string;
  target: string;
  patch: Record<string, unknown>;
}) {
  const url = import.meta.env.VITE_POLICY_GATEWAY_URL || "/api/policy-gateway";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return true;
}

// Convenience functions for common AI actions
export const AIActions = {
  // Code optimization suggestions
  suggestCodeOptimization: (file: string, suggestion: string) =>
    proposePatch({
      agent: "perf_scout",
      action: "code_optimization",
      target: file,
      patch: { suggestion, type: "performance" }
    }),

  // Security recommendations
  suggestSecurityFix: (component: string, issue: string, fix: string) =>
    proposePatch({
      agent: "security_sentry",
      action: "security_fix",
      target: component,
      patch: { issue, fix, type: "security" }
    }),

  // Feature flag changes
  toggleFeatureFlag: (flag: string, enabled: boolean) =>
    proposePatch({
      agent: "ops_steward",
      action: "feature_flag",
      target: flag,
      patch: { enabled, type: "feature_flag" }
    }),

  // Database optimization
  suggestDatabaseOptimization: (table: string, optimization: string) =>
    proposePatch({
      agent: "perf_scout",
      action: "database_optimization",
      target: table,
      patch: { optimization, type: "database" }
    }),
};
