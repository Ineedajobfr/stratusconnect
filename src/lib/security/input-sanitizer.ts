import DOMPurify from 'dompurify'
import validator from 'validator'

interface SanitizationResult {
  sanitized: any
  isValid: boolean
  threats: SecurityThreat[]
  warnings: string[]
}

interface SecurityThreat {
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  field?: string
  original?: any
}

// Security patterns for detection
const SECURITY_PATTERNS = {
  // SQL Injection patterns
  sqlInjection: [
    /('|(\\')|(;)|(--)|(\|)|(\*)|(%)|(\+)|(\-)|(\()|(\))|(\{)|(\})|(\[)|(\])|(union|select|insert|update|delete|drop|create|alter|exec|execute)/i,
    /(\bunion\b.*\bselect\b)/i,
    /(\bselect\b.*\bfrom\b)/i,
    /(\binsert\b.*\binto\b)/i,
    /(\bupdate\b.*\bset\b)/i,
    /(\bdelete\b.*\bfrom\b)/i,
    /(\bdrop\b.*\btable\b)/i,
    /(\bcreate\b.*\btable\b)/i,
    /(\balter\b.*\btable\b)/i,
    /(\bexec\b|\bexecute\b)/i
  ],
  
  // XSS patterns
  xss: [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /<object[^>]*>.*?<\/object>/gi,
    /<embed[^>]*>/gi,
    /<link[^>]*>/gi,
    /<meta[^>]*>/gi,
    /expression\s*\(/gi,
    /url\s*\(/gi,
    /@import/gi,
    /<style[^>]*>.*?<\/style>/gi,
    /<img[^>]*onerror/gi,
    /<svg[^>]*onload/gi
  ],
  
  // Command injection patterns
  commandInjection: [
    /(\||\||&|&&|;|\$\(|\`|\$\{)/,
    /(\bcat\b|\bls\b|\bpwd\b|\bwhoami\b|\bid\b|\buname\b)/i,
    /(\brm\b|\bmkdir\b|\bchmod\b|\bchown\b)/i,
    /(\bcurl\b|\bwget\b|\bping\b|\btelnet\b)/i,
    /(\bnc\b|\bnetcat\b|\bsocat\b)/i,
    /(\bssh\b|\bscp\b|\brsync\b)/i
  ],
  
  // Path traversal patterns
  pathTraversal: [
    /\.\.\//,
    /\.\.\\/,
    /\.\.%2f/,
    /\.\.%5c/,
    /\.\.%252f/,
    /\.\.%255c/,
    /\.\.%c0%af/,
    /\.\.%c1%9c/,
    /\.\.%c0%2f/,
    /\.\.%c1%af/
  ]
}

// Maximum lengths for different field types
const MAX_LENGTHS = {
  email: 254,
  name: 100,
  username: 50,
  password: 128,
  url: 2048,
  text: 10000,
  description: 5000,
  comment: 2000,
  default: 1000
}

// Field-specific validation rules
const FIELD_VALIDATION = {
  email: (value: string) => validator.isEmail(value),
  url: (value: string) => validator.isURL(value, { 
    protocols: ['http', 'https'],
    require_protocol: true 
  }),
  phone: (value: string) => validator.isMobilePhone(value),
  date: (value: string) => validator.isISO8601(value),
  uuid: (value: string) => validator.isUUID(value),
  jwt: (value: string) => /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/.test(value),
  ip: (value: string) => validator.isIP(value),
  mac: (value: string) => validator.isMACAddress(value),
  creditCard: (value: string) => validator.isCreditCard(value),
  hexColor: (value: string) => validator.isHexColor(value),
  ascii: (value: string) => validator.isAscii(value),
  base64: (value: string) => validator.isBase64(value),
  json: (value: string) => {
    try {
      JSON.parse(value)
      return true
    } catch {
      return false
    }
  }
}

function detectThreats(value: any, fieldName: string = '', fieldType: string = 'default'): SecurityThreat[] {
  const threats: SecurityThreat[] = []
  
  if (typeof value === 'string') {
    // Check length
    const maxLength = MAX_LENGTHS[fieldType] || MAX_LENGTHS.default
    if (value.length > maxLength) {
      threats.push({
        type: 'length_exceeded',
        severity: 'medium',
        description: `Field exceeds maximum length of ${maxLength} characters`,
        field: fieldName,
        original: value
      })
    }
    
    // Check for SQL injection
    SECURITY_PATTERNS.sqlInjection.forEach((pattern, index) => {
      if (pattern.test(value)) {
        threats.push({
          type: 'sql_injection',
          severity: 'high',
          description: `Potential SQL injection detected in ${fieldName}`,
          field: fieldName,
          original: value
        })
      }
    })
    
    // Check for XSS
    SECURITY_PATTERNS.xss.forEach((pattern, index) => {
      if (pattern.test(value)) {
        threats.push({
          type: 'xss',
          severity: 'high',
          description: `Potential XSS attack detected in ${fieldName}`,
          field: fieldName,
          original: value
        })
      }
    })
    
    // Check for command injection
    SECURITY_PATTERNS.commandInjection.forEach((pattern, index) => {
      if (pattern.test(value)) {
        threats.push({
          type: 'command_injection',
          severity: 'critical',
          description: `Potential command injection detected in ${fieldName}`,
          field: fieldName,
          original: value
        })
      }
    })
    
    // Check for path traversal
    SECURITY_PATTERNS.pathTraversal.forEach((pattern, index) => {
      if (pattern.test(value)) {
        threats.push({
          type: 'path_traversal',
          severity: 'high',
          description: `Potential path traversal attack detected in ${fieldName}`,
          field: fieldName,
          original: value
        })
      }
    })
    
    // Field-specific validation
    if (fieldType && FIELD_VALIDATION[fieldType]) {
      if (!FIELD_VALIDATION[fieldType](value)) {
        threats.push({
          type: 'invalid_format',
          severity: 'medium',
          description: `Invalid ${fieldType} format in ${fieldName}`,
          field: fieldName,
          original: value
        })
      }
    }
    
  } else if (Array.isArray(value)) {
    // Check array length
    if (value.length > 1000) {
      threats.push({
        type: 'array_size_exceeded',
        severity: 'medium',
        description: `Array size exceeds maximum allowed length in ${fieldName}`,
        field: fieldName,
        original: value
      })
    }
    
    // Recursively check array elements
    value.forEach((item, index) => {
      const itemThreats = detectThreats(item, `${fieldName}[${index}]`, fieldType)
      threats.push(...itemThreats)
    })
    
  } else if (typeof value === 'object' && value !== null) {
    // Recursively check object properties
    Object.keys(value).forEach(key => {
      const keyThreats = detectThreats(value[key], fieldName ? `${fieldName}.${key}` : key, fieldType)
      threats.push(...keyThreats)
    })
  }
  
  return threats
}

function sanitizeString(input: string, options: {
  allowHtml?: boolean
  maxLength?: number
  fieldType?: string
} = {}): string {
  if (typeof input !== 'string') return ''
  
  let sanitized = input
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '')
  
  // Normalize Unicode
  sanitized = sanitized.normalize('NFC')
  
  // Remove control characters except newlines and tabs
  // eslint-disable-next-line no-control-regex
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
  
  // Trim whitespace
  sanitized = sanitized.trim()
  
  // Limit length
  const maxLength = options.maxLength || MAX_LENGTHS[options.fieldType] || MAX_LENGTHS.default
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
  }
  
  // Sanitize HTML if not explicitly allowed
  if (!options.allowHtml) {
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    })
  }
  
  return sanitized
}

function sanitizeData(input: any, options: {
  allowHtml?: boolean
  fieldType?: string
  maxLength?: number
} = {}): any {
  if (typeof input === 'string') {
    return sanitizeString(input, options)
  } else if (Array.isArray(input)) {
    return input.map(item => sanitizeData(item, options)).slice(0, 1000)
  } else if (typeof input === 'object' && input !== null) {
    const sanitized: any = {}
    Object.keys(input).forEach(key => {
      sanitized[key] = sanitizeData(input[key], options)
    })
    return sanitized
  }
  return input
}

export function sanitizeInput(
  input: any,
  fieldName: string = '',
  fieldType: string = 'default',
  options: {
    allowHtml?: boolean
    maxLength?: number
    strict?: boolean
  } = {}
): SanitizationResult {
  const threats = detectThreats(input, fieldName, fieldType)
  
  // If strict mode and threats found, return invalid
  if (options.strict && threats.length > 0) {
    return {
      sanitized: null,
      isValid: false,
      threats,
      warnings: ['Input validation failed due to security threats']
    }
  }
  
  // Filter out critical threats - these always make input invalid
  const criticalThreats = threats.filter(t => t.severity === 'critical')
  if (criticalThreats.length > 0) {
    return {
      sanitized: null,
      isValid: false,
      threats: criticalThreats,
      warnings: ['Critical security threats detected']
    }
  }
  
  // Sanitize the input
  const sanitized = sanitizeData(input, {
    allowHtml: options.allowHtml,
    fieldType,
    maxLength: options.maxLength
  })
  
  // Generate warnings for non-critical threats
  const warnings = threats
    .filter(t => t.severity !== 'critical')
    .map(t => `${t.type}: ${t.description}`)
  
  return {
    sanitized,
    isValid: true,
    threats: threats.filter(t => t.severity === 'critical' || t.severity === 'high'),
    warnings
  }
}

export function validateFormData(formData: Record<string, any>, schema: Record<string, string> = {}): {
  isValid: boolean
  sanitizedData: Record<string, any>
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []
  const sanitizedData: Record<string, any> = {}
  
  Object.keys(formData).forEach(fieldName => {
    const fieldType = schema[fieldName] || 'default'
    const result = sanitizeInput(formData[fieldName], fieldName, fieldType, { strict: true })
    
    if (!result.isValid) {
      errors.push(...result.threats.map(t => `${fieldName}: ${t.description}`))
      return
    }
    
    sanitizedData[fieldName] = result.sanitized
    warnings.push(...result.warnings.map(w => `${fieldName}: ${w}`))
  })
  
  return {
    isValid: errors.length === 0,
    sanitizedData,
    errors,
    warnings
  }
}

export function createSecureInputHandler(
  fieldName: string,
  fieldType: string = 'default',
  options: {
    allowHtml?: boolean
    maxLength?: number
    onThreat?: (threat: SecurityThreat) => void
    onWarning?: (warning: string) => void
  } = {}
) {
  return (value: any) => {
    const result = sanitizeInput(value, fieldName, fieldType, {
      allowHtml: options.allowHtml,
      maxLength: options.maxLength,
      strict: true
    })
    
    if (!result.isValid) {
      result.threats.forEach(options.onThreat || (() => {}))
      return null
    }
    
    result.warnings.forEach(options.onWarning || (() => {}))
    return result.sanitized
  }
}

export function isSafeInput(input: any, fieldName: string = '', fieldType: string = 'default'): boolean {
  const result = sanitizeInput(input, fieldName, fieldType, { strict: true })
  return result.isValid
}

// Export types for use in components
export type { SanitizationResult, SecurityThreat }
