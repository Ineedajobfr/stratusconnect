import { supabase } from "@/integrations/supabase/client";

export async function emitEvent(
  type: string,
  payload: Record<string, unknown>,
  opts?: { subtype?: string; severity?: "info" | "medium" | "high" }
) {
  try {
    await supabase.rpc("emit_event", {
      p_type: type,
      p_subtype: opts?.subtype ?? null,
      p_payload: payload,
      p_severity: opts?.severity ?? "info",
    });
  } catch {
    // silent fail on client
  }
}

// Convenience functions for common events
export const Events = {
  // Authentication events
  login: (userId: string, method: string) => 
    emitEvent("auth.login", { userId, method }, { severity: "info" }),
  
  logout: (userId: string) => 
    emitEvent("auth.logout", { userId }, { severity: "info" }),
  
  // User actions
  profileUpdate: (userId: string, fields: string[]) => 
    emitEvent("users.update", { userId, fields }, { severity: "info" }),
  
  // Marketplace events
  requestCreated: (requestId: string, userId: string, details: Record<string, unknown>) => 
    emitEvent("marketplace.request_created", { requestId, userId, ...details }, { severity: "info" }),
  
  bidPlaced: (bidId: string, userId: string, amount: number) => 
    emitEvent("marketplace.bid", { bidId, userId, amount }, { severity: "info" }),
  
  dealClosed: (dealId: string, brokerId: string, operatorId: string, amount: number) => 
    emitEvent("marketplace.deal_closed", { dealId, brokerId, operatorId, amount }, { severity: "high" }),
  
  // Messaging events
  messageSent: (messageId: string, fromUserId: string, toUserId: string, containsPhone?: boolean) => 
    emitEvent("messages.sent", { messageId, fromUserId, toUserId, containsPhone }, { severity: "info" }),
  
  // Payment events
  paymentInitiated: (paymentId: string, userId: string, amount: number, currency: string) => 
    emitEvent("payments.initiated", { paymentId, userId, amount, currency }, { severity: "high" }),
  
  paymentCompleted: (paymentId: string, userId: string, amount: number) => 
    emitEvent("payments.completed", { paymentId, userId, amount }, { severity: "high" }),
  
  // Performance events
  pageView: (route: string, ttfbMs: number, loadTimeMs: number) => 
    emitEvent("page.view", { route, ttfbMs, loadTimeMs }, { severity: "info" }),
  
  apiTrace: (endpoint: string, method: string, durationMs: number, statusCode: number) => 
    emitEvent("api.trace", { endpoint, method, durationMs, statusCode }, { severity: "info" }),
  
  // Security events
  suspiciousActivity: (userId: string, activity: string, details: Record<string, unknown>) => 
    emitEvent("security.suspicious", { userId, activity, ...details }, { severity: "high" }),
  
  // Verification events
  documentUploaded: (userId: string, documentType: string, status: string) => 
    emitEvent("verification.document_uploaded", { userId, documentType, status }, { severity: "info" }),
  
  verificationCompleted: (userId: string, role: string, status: string) => 
    emitEvent("verification.completed", { userId, role, status }, { severity: "high" }),
};
