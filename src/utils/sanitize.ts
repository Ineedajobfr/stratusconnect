import DOMPurify from 'dompurify';

// Configuration for different sanitization levels
const sanitizeConfig = {
  // For basic text content - strips all HTML
  text: {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  },
  
  // For rich text content - allows safe HTML
  richText: {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'br', 'p'],
    ALLOWED_ATTR: []
  },
  
  // For messaging - very restrictive
  message: {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  }
};

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input - The input string to sanitize
 * @param level - The sanitization level ('text', 'richText', 'message')
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string | null | undefined, level: keyof typeof sanitizeConfig = 'text'): string => {
  if (!input) return '';
  
  // First, normalize and trim the input
  const normalized = String(input).trim();
  
  if (!normalized) return '';
  
  // Apply DOMPurify with the specified configuration
  const config = sanitizeConfig[level];
  return DOMPurify.sanitize(normalized, config);
};

/**
 * Sanitizes message content specifically for the messaging system
 * @param content - The message content to sanitize
 * @returns Sanitized message content
 */
export const sanitizeMessageContent = (content: string): string => {
  return sanitizeInput(content, 'message');
};

/**
 * Sanitizes profile data fields
 * @param data - Object containing profile fields to sanitize
 * @returns Sanitized profile data object
 */
export const sanitizeProfileData = (data: Record<string, any>): Record<string, any> => {
  const sanitized = { ...data };
  
  // Fields that should be sanitized as plain text
  const textFields = ['full_name', 'company_name', 'headline', 'location', 'company'];
  
  // Fields that can contain rich text
  const richTextFields = ['bio', 'description'];
  
  // Sanitize text fields
  textFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = sanitizeInput(sanitized[field], 'text');
    }
  });
  
  // Sanitize rich text fields
  richTextFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = sanitizeInput(sanitized[field], 'richText');
    }
  });
  
  return sanitized;
};

/**
 * Validates and sanitizes contract content
 * @param content - The contract content to sanitize
 * @returns Sanitized contract content
 */
export const sanitizeContractContent = (content: string): string => {
  return sanitizeInput(content, 'richText');
};

/**
 * Generic input validator for common security checks
 * @param input - Input to validate
 * @param maxLength - Maximum allowed length
 * @returns Validation result
 */
export const validateInput = (input: string, maxLength: number = 1000): { isValid: boolean; error?: string } => {
  if (!input) {
    return { isValid: false, error: 'Input is required' };
  }
  
  if (input.length > maxLength) {
    return { isValid: false, error: `Input exceeds maximum length of ${maxLength} characters` };
  }
  
  // Check for suspicious patterns (basic)
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:\s*text\/html/i
  ];
  
  if (suspiciousPatterns.some(pattern => pattern.test(input))) {
    return { isValid: false, error: 'Input contains potentially unsafe content' };
  }
  
  return { isValid: true };
};