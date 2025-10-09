import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ValidationResult {
  isValid: boolean
  sanitizedData?: any
  errors: string[]
  threats: SecurityThreat[]
}

interface SecurityThreat {
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  pattern: string
  location?: string
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
  ],
  
  // LDAP injection patterns
  ldapInjection: [
    /[()=*&|!]/,
    /(\bcn\b|\bdn\b|\bou\b|\bdc\b|\bobjectclass\b)/i,
    /(\bfilter\b|\bbase\b|\bscope\b|\battributes\b)/i
  ],
  
  // NoSQL injection patterns
  nosqlInjection: [
    /\$where/i,
    /\$ne/i,
    /\$gt/i,
    /\$lt/i,
    /\$regex/i,
    /\$exists/i,
    /\$in/i,
    /\$nin/i,
    /\$all/i,
    /\$or/i,
    /\$and/i,
    /\$nor/i,
    /\$not/i
  ]
}

// File upload validation
const ALLOWED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt'],
  'application/json': ['.json'],
  'text/csv': ['.csv']
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_STRING_LENGTH = 10000
const MAX_ARRAY_LENGTH = 1000

function sanitizeString(input: string): string {
  if (typeof input !== 'string') return ''
  
  // Remove null bytes
  let sanitized = input.replace(/\0/g, '')
  
  // Normalize Unicode
  sanitized = sanitized.normalize('NFC')
  
  // Remove control characters except newlines and tabs
  // eslint-disable-next-line no-control-regex
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
  
  // Trim whitespace
  sanitized = sanitized.trim()
  
  // Limit length
  if (sanitized.length > MAX_STRING_LENGTH) {
    sanitized = sanitized.substring(0, MAX_STRING_LENGTH)
  }
  
  return sanitized
}

function detectThreats(input: any, fieldName: string = ''): SecurityThreat[] {
  const threats: SecurityThreat[] = []
  
  if (typeof input === 'string') {
    const sanitized = sanitizeString(input)
    
    // Check for SQL injection
    SECURITY_PATTERNS.sqlInjection.forEach((pattern, index) => {
      if (pattern.test(sanitized)) {
        threats.push({
          type: 'sql_injection',
          severity: 'high',
          description: `Potential SQL injection detected in ${fieldName}`,
          pattern: pattern.source,
          location: fieldName
        })
      }
    })
    
    // Check for XSS
    SECURITY_PATTERNS.xss.forEach((pattern, index) => {
      if (pattern.test(sanitized)) {
        threats.push({
          type: 'xss',
          severity: 'high',
          description: `Potential XSS attack detected in ${fieldName}`,
          pattern: pattern.source,
          location: fieldName
        })
      }
    })
    
    // Check for command injection
    SECURITY_PATTERNS.commandInjection.forEach((pattern, index) => {
      if (pattern.test(sanitized)) {
        threats.push({
          type: 'command_injection',
          severity: 'critical',
          description: `Potential command injection detected in ${fieldName}`,
          pattern: pattern.source,
          location: fieldName
        })
      }
    })
    
    // Check for path traversal
    SECURITY_PATTERNS.pathTraversal.forEach((pattern, index) => {
      if (pattern.test(sanitized)) {
        threats.push({
          type: 'path_traversal',
          severity: 'high',
          description: `Potential path traversal attack detected in ${fieldName}`,
          pattern: pattern.source,
          location: fieldName
        })
      }
    })
    
    // Check for LDAP injection
    SECURITY_PATTERNS.ldapInjection.forEach((pattern, index) => {
      if (pattern.test(sanitized)) {
        threats.push({
          type: 'ldap_injection',
          severity: 'medium',
          description: `Potential LDAP injection detected in ${fieldName}`,
          pattern: pattern.source,
          location: fieldName
        })
      }
    })
    
    // Check for NoSQL injection
    SECURITY_PATTERNS.nosqlInjection.forEach((pattern, index) => {
      if (pattern.test(sanitized)) {
        threats.push({
          type: 'nosql_injection',
          severity: 'high',
          description: `Potential NoSQL injection detected in ${fieldName}`,
          pattern: pattern.source,
          location: fieldName
        })
      }
    })
    
  } else if (Array.isArray(input)) {
    // Validate array length
    if (input.length > MAX_ARRAY_LENGTH) {
      threats.push({
        type: 'array_size_exceeded',
        severity: 'medium',
        description: `Array size exceeded maximum allowed length in ${fieldName}`,
        pattern: `length: ${input.length}`,
        location: fieldName
      })
    }
    
    // Recursively check array elements
    input.forEach((item, index) => {
      const itemThreats = detectThreats(item, `${fieldName}[${index}]`)
      threats.push(...itemThreats)
    })
    
  } else if (typeof input === 'object' && input !== null) {
    // Recursively check object properties
    Object.keys(input).forEach(key => {
      const keyThreats = detectThreats(input[key], fieldName ? `${fieldName}.${key}` : key)
      threats.push(...keyThreats)
    })
  }
  
  return threats
}

function sanitizeData(input: any): any {
  if (typeof input === 'string') {
    return sanitizeString(input)
  } else if (Array.isArray(input)) {
    return input.map(item => sanitizeData(item)).slice(0, MAX_ARRAY_LENGTH)
  } else if (typeof input === 'object' && input !== null) {
    const sanitized: any = {}
    Object.keys(input).forEach(key => {
      sanitized[key] = sanitizeData(input[key])
    })
    return sanitized
  }
  return input
}

function validateFileUpload(file: any): ValidationResult {
  const errors: string[] = []
  const threats: SecurityThreat[] = []
  
  // Check file size
  if (file.size && file.size > MAX_FILE_SIZE) {
    errors.push(`File size exceeds maximum allowed size of ${MAX_FILE_SIZE} bytes`)
    threats.push({
      type: 'file_size_exceeded',
      severity: 'medium',
      description: 'File size exceeds maximum allowed size',
      pattern: `size: ${file.size}`
    })
  }
  
  // Check file type
  if (file.type && !ALLOWED_FILE_TYPES[file.type]) {
    errors.push(`File type ${file.type} is not allowed`)
    threats.push({
      type: 'invalid_file_type',
      severity: 'medium',
      description: `File type ${file.type} is not allowed`,
      pattern: file.type
    })
  }
  
  // Check file name for path traversal
  if (file.name) {
    const nameThreats = detectThreats(file.name, 'filename')
    threats.push(...nameThreats)
  }
  
  return {
    isValid: errors.length === 0 && threats.length === 0,
    sanitizedData: file,
    errors,
    threats
  }
}

async function logSecurityEvent(
  supabase: any,
  eventType: string,
  severity: string,
  threats: SecurityThreat[],
  requestData: any
) {
  try {
    await supabase
      .from('security_events')
      .insert({
        event_type: eventType,
        severity,
        ip_address: requestData.ip || 'unknown',
        user_agent: requestData.userAgent || 'unknown',
        details: {
          threats: threats.map(t => ({
            type: t.type,
            severity: t.severity,
            description: t.description,
            pattern: t.pattern,
            location: t.location
          })),
          input_size: JSON.stringify(requestData.input).length,
          timestamp: new Date().toISOString()
        }
      })
  } catch (error) {
    console.error('Failed to log security event:', error)
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const contentType = req.headers.get('content-type') || ''
    const isMultipart = contentType.includes('multipart/form-data')
    
    let inputData: any
    
    if (isMultipart) {
      // Handle file uploads
      const formData = await req.formData()
      inputData = {}
      
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          inputData[key] = {
            name: value.name,
            type: value.type,
            size: value.size,
            lastModified: value.lastModified
          }
        } else {
          inputData[key] = value
        }
      }
    } else {
      // Handle JSON data
      inputData = await req.json()
    }

    const validationResult: ValidationResult = {
      isValid: true,
      sanitizedData: inputData,
      errors: [],
      threats: []
    }

    // Detect threats in input data
    const threats = detectThreats(inputData)
    validationResult.threats = threats

    // Check for critical threats
    const criticalThreats = threats.filter(t => t.severity === 'critical')
    const highThreats = threats.filter(t => t.severity === 'high')
    
    if (criticalThreats.length > 0) {
      validationResult.isValid = false
      validationResult.errors.push('Critical security threat detected')
      
      // Log security event
      await logSecurityEvent(
        supabaseClient,
        'critical_threat_detected',
        'critical',
        criticalThreats,
        {
          ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
          input: inputData
        }
      )
      
      return new Response(
        JSON.stringify({
          error: 'Security threat detected',
          message: 'Your request contains potentially malicious content',
          threats: criticalThreats.map(t => ({
            type: t.type,
            description: t.description
          }))
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Handle file uploads separately
    if (isMultipart) {
      const formData = await req.formData()
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          const fileValidation = validateFileUpload(value)
          if (!fileValidation.isValid) {
            validationResult.isValid = false
            validationResult.errors.push(...fileValidation.errors)
            validationResult.threats.push(...fileValidation.threats)
          }
        }
      }
    }

    // Log high severity threats
    if (highThreats.length > 0) {
      await logSecurityEvent(
        supabaseClient,
        'high_threat_detected',
        'high',
        highThreats,
        {
          ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
          input: inputData
        }
      )
    }

    // Sanitize data if valid
    if (validationResult.isValid) {
      validationResult.sanitizedData = sanitizeData(inputData)
    }

    return new Response(
      JSON.stringify({
        valid: validationResult.isValid,
        sanitized_data: validationResult.sanitizedData,
        errors: validationResult.errors,
        threats: validationResult.threats.map(t => ({
          type: t.type,
          severity: t.severity,
          description: t.description
        })),
        warnings: validationResult.threats.filter(t => t.severity === 'low' || t.severity === 'medium')
      }),
      {
        status: validationResult.isValid ? 200 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Input validation error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Input validation failed',
        valid: false,
        message: 'Unable to validate input data'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
