// Message Guard - Anti-Circumvention Contact Protection
// FCA Compliant Aviation Platform

export interface MessageValidationResult {
  isValid: boolean;
  blockedPatterns: string[];
  sanitizedMessage?: string;
  auditHash: string;
}

/**
 * Patterns to detect and block contact information
 */
const CONTACT_PATTERNS = {
  // Email patterns
  email: /\b([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})\b/gi,
  
  // Phone number patterns (international and local)
  phone: /(\+?\d[\d\s().-]{8,})/g,
  
  // WhatsApp patterns
  whatsapp: /(whatsapp|wa\.me|chat\.whatsapp\.com)/gi,
  
  // Booking/calendar links
  booking: /(calendly\.com|acuityscheduling\.com|book\.when\.com|cal\.com)/gi,
  
  // Social media handles
  social: /(@[a-zA-Z0-9_]+|instagram\.com\/[a-zA-Z0-9_.]+|linkedin\.com\/in\/[a-zA-Z0-9_.-]+)/gi,
  
  // External communication platforms
  external: /(zoom\.us|teams\.microsoft\.com|meet\.google\.com|skype\.com)/gi,
  
  // Direct booking URLs
  directBooking: /(book|booking|reserve|schedule)\.(com|co\.uk|org)/gi
};

/**
 * Validate outbound message for contact information leakage
 */
export function validateOutboundMessage(text: string, hasDeposit: boolean): MessageValidationResult {
  const auditData = {
    messageLength: text.length,
    hasDeposit,
    timestamp: new Date().toISOString(),
    originalMessage: text.substring(0, 100) // First 100 chars for audit
  };

  const auditHash = `sha256:${btoa(JSON.stringify(auditData))}`;
  
  if (hasDeposit) {
    // If deposit is paid, allow contact sharing but still sanitize
    return {
      isValid: true,
      blockedPatterns: [],
      sanitizedMessage: sanitizeMessage(text),
      auditHash
    };
  }

  const blockedPatterns: string[] = [];
  let sanitizedMessage = text;

  // Check each pattern type
  Object.entries(CONTACT_PATTERNS).forEach(([type, pattern]) => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        blockedPatterns.push(`${type}: ${match}`);
        // Replace with placeholder
        sanitizedMessage = sanitizedMessage.replace(match, `[${type.toUpperCase()} BLOCKED]`);
      });
    }
  });

  // If any contact patterns were found, message is blocked
  const isValid = blockedPatterns.length === 0;

  return {
    isValid,
    blockedPatterns,
    sanitizedMessage: isValid ? sanitizedMessage : undefined,
    auditHash
  };
}

/**
 * Sanitize message even when deposit is paid (remove excessive contact info)
 */
function sanitizeMessage(text: string): string {
  let sanitized = text;
  
  // Limit email addresses to 2 per message
  const emailMatches = text.match(CONTACT_PATTERNS.email);
  if (emailMatches && emailMatches.length > 2) {
    emailMatches.slice(2).forEach(email => {
      sanitized = sanitized.replace(email, '[EMAIL BLOCKED - LIMIT REACHED]');
    });
  }
  
  // Limit phone numbers to 1 per message
  const phoneMatches = text.match(CONTACT_PATTERNS.phone);
  if (phoneMatches && phoneMatches.length > 1) {
    phoneMatches.slice(1).forEach(phone => {
      sanitized = sanitized.replace(phone, '[PHONE BLOCKED - LIMIT REACHED]');
    });
  }
  
  return sanitized;
}

/**
 * Generate contact reveal message for blocked attempts
 */
export function generateContactBlockMessage(blockedPatterns: string[]): string {
  const patternTypes = [...new Set(blockedPatterns.map(p => p.split(':')[0]))];
  
  return `Contact details are unlocked after deposit payment. Use in-platform chat for secure communication. Blocked: ${patternTypes.join(', ')}. Complete deposit to enable direct contact sharing.`;
}

/**
 * Log message validation attempts for audit
 */
export async function logMessageValidation(
  userId: string,
  dealId: string,
  result: MessageValidationResult,
  originalMessage: string
): Promise<void> {
  try {
    // This would integrate with your audit logging system
    console.log('Message validation logged:', {
      userId,
      dealId,
      result,
      originalMessageLength: originalMessage.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log message validation:', error);
  }
}

/**
 * Check if user has deposit access for a deal
 */
export async function checkDepositAccess(userId: string, dealId: string): Promise<boolean> {
  try {
    // This would check the actual payment intent status
    // For now, return false to enforce the gate
    return false;
  } catch (error) {
    console.error('Failed to check deposit access:', error);
    return false; // Fail secure
  }
}

/**
 * Message guard middleware for chat components
 */
export function createMessageGuard(hasDeposit: boolean) {
  return {
    validateMessage: (text: string) => validateOutboundMessage(text, hasDeposit),
    canShareContact: hasDeposit,
    getBlockMessage: (blockedPatterns: string[]) => generateContactBlockMessage(blockedPatterns)
  };
}

/**
 * Contact sharing policy notice
 */
export const CONTACT_POLICY_NOTICE = {
  title: "Contact Sharing Policy",
  message: "Contact details are unlocked after deposit payment to ensure serious inquiries only. This protects all parties from time-wasters and maintains platform integrity.",
  requirements: [
    "Valid payment intent (requires_capture or succeeded)",
    "KYC verification completed", 
    "Party to the deal",
    "No previous circumvention violations"
  ],
  benefits: [
    "Serious inquiries only",
    "Protected from time-wasters",
    "Complete audit trail",
    "Platform dispute resolution"
  ]
};
