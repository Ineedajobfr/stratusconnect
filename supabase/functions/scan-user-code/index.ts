import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CodeScanResult {
  isSafe: boolean
  threats: CodeThreat[]
  score: number // 0-100, where 100 is completely safe
  recommendations: string[]
}

interface CodeThreat {
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  line?: number
  column?: number
  code?: string
  pattern: string
}

// Dangerous function patterns
const DANGEROUS_FUNCTIONS = {
  // JavaScript/Node.js dangerous functions
  eval: { severity: 'critical', description: 'eval() can execute arbitrary code' },
  'Function': { severity: 'critical', description: 'Function constructor can execute arbitrary code' },
  setTimeout: { severity: 'high', description: 'setTimeout with string can execute code' },
  setInterval: { severity: 'high', description: 'setInterval with string can execute code' },
  'new Function': { severity: 'critical', description: 'Function constructor can execute arbitrary code' },
  
  // File system operations
  'fs.readFile': { severity: 'high', description: 'File system read operation' },
  'fs.writeFile': { severity: 'high', description: 'File system write operation' },
  'fs.unlink': { severity: 'critical', description: 'File deletion operation' },
  'fs.rmdir': { severity: 'critical', description: 'Directory deletion operation' },
  'fs.mkdir': { severity: 'medium', description: 'Directory creation operation' },
  'fs.copyFile': { severity: 'high', description: 'File copy operation' },
  'fs.rename': { severity: 'high', description: 'File rename operation' },
  
  // Network operations
  'fetch': { severity: 'medium', description: 'Network request capability' },
  'XMLHttpRequest': { severity: 'medium', description: 'Network request capability' },
  'require': { severity: 'high', description: 'Module loading capability' },
  'import': { severity: 'high', description: 'Module importing capability' },
  
  // Process operations
  'child_process.exec': { severity: 'critical', description: 'Command execution capability' },
  'child_process.spawn': { severity: 'critical', description: 'Process spawning capability' },
  'child_process.execFile': { severity: 'critical', description: 'File execution capability' },
  'process.exit': { severity: 'critical', description: 'Process termination capability' },
  'process.kill': { severity: 'critical', description: 'Process killing capability' },
  
  // Crypto operations
  'crypto.randomBytes': { severity: 'medium', description: 'Cryptographic operation' },
  'crypto.createHash': { severity: 'medium', description: 'Hash creation' },
  'crypto.createCipher': { severity: 'medium', description: 'Encryption operation' },
  'crypto.createDecipher': { severity: 'medium', description: 'Decryption operation' },
  
  // Database operations
  'db.query': { severity: 'high', description: 'Database query capability' },
  'db.execute': { severity: 'high', description: 'Database execution capability' },
  'db.connect': { severity: 'high', description: 'Database connection capability' },
  'db.disconnect': { severity: 'high', description: 'Database disconnection capability' }
}

// Suspicious patterns
const SUSPICIOUS_PATTERNS = {
  // Infinite loops
  infiniteLoop: [
    /while\s*\(\s*true\s*\)/gi,
    /for\s*\(\s*;\s*;\s*\)/gi,
    /while\s*\(\s*1\s*\)/gi,
    /for\s*\(\s*;\s*1\s*;\s*\)/gi
  ],
  
  // Memory exhaustion patterns
  memoryExhaustion: [
    /new\s+Array\s*\(\s*\d{4,}\s*\)/gi,
    /Array\s*\(\s*\d{4,}\s*\)/gi,
    /new\s+Buffer\s*\(\s*\d{6,}\s*\)/gi,
    /Buffer\.alloc\s*\(\s*\d{6,}\s*\)/gi
  ],
  
  // Obfuscated code patterns
  obfuscated: [
    /eval\s*\(\s*atob\s*\(/gi,
    /Function\s*\(\s*atob\s*\(/gi,
    /String\.fromCharCode\s*\(\s*\d+(\s*,\s*\d+)*\s*\)/gi,
    /\\x[0-9a-fA-F]{2}/g,
    /\\u[0-9a-fA-F]{4}/g,
    /[a-zA-Z0-9+/]{100,}={0,2}/g // Base64-like strings
  ],
  
  // Network scanning patterns
  networkScanning: [
    /for\s*\(\s*let\s+\w+\s*=\s*\d+\s*;\s*\w+\s*<=\s*\d+\s*;\s*\w+\+\+\)/gi,
    /fetch\s*\(\s*['"`]https?:\/\/\d+\.\d+\.\d+\.\d+/gi,
    /XMLHttpRequest.*open.*https?:\/\/\d+\.\d+\.\d+\.\d+/gi
  ],
  
  // Data exfiltration patterns
  dataExfiltration: [
    /fetch\s*\(\s*['"`]https?:\/\/[^'"`]+\.[^'"`]+['"`]/gi,
    /XMLHttpRequest.*open.*POST.*https?:\/\//gi,
    /navigator\.sendBeacon/gi,
    /Image\s*\(\s*['"`]https?:\/\//gi
  ],
  
  // Keylogger patterns
  keylogger: [
    /addEventListener\s*\(\s*['"`]keydown['"`]/gi,
    /addEventListener\s*\(\s*['"`]keyup['"`]/gi,
    /addEventListener\s*\(\s*['"`]keypress['"`]/gi,
    /onkeydown\s*=/gi,
    /onkeyup\s*=/gi,
    /onkeypress\s*=/gi
  ],
  
  // Cookie manipulation
  cookieManipulation: [
    /document\.cookie\s*=/gi,
    /\.cookie\s*=/gi,
    /getCookie/gi,
    /setCookie/gi,
    /deleteCookie/gi
  ],
  
  // DOM manipulation
  domManipulation: [
    /document\.write/gi,
    /innerHTML\s*=/gi,
    /outerHTML\s*=/gi,
    /insertAdjacentHTML/gi,
    /document\.createElement/gi,
    /document\.body\.appendChild/gi
  ],
  
  // Local storage access
  localStorageAccess: [
    /localStorage\./gi,
    /sessionStorage\./gi,
    /window\.localStorage/gi,
    /window\.sessionStorage/gi
  ],
  
  // Geolocation access
  geolocationAccess: [
    /navigator\.geolocation/gi,
    /getCurrentPosition/gi,
    /watchPosition/gi
  ],
  
  // Camera/microphone access
  mediaAccess: [
    /navigator\.mediaDevices/gi,
    /getUserMedia/gi,
    /getDisplayMedia/gi,
    /\.webcam/gi,
    /\.microphone/gi
  ]
}

// Safe patterns that are commonly used in legitimate code
const SAFE_PATTERNS = [
  /console\.log/gi,
  /console\.error/gi,
  /console\.warn/gi,
  /console\.info/gi,
  /alert\s*\(/gi,
  /confirm\s*\(/gi,
  /prompt\s*\(/gi,
  /document\.getElementById/gi,
  /document\.querySelector/gi,
  /addEventListener\s*\(\s*['"`]click['"`]/gi,
  /addEventListener\s*\(\s*['"`]submit['"`]/gi,
  /JSON\.parse/gi,
  /JSON\.stringify/gi,
  /Math\./gi,
  /Date\./gi,
  /String\./gi,
  /Number\./gi,
  /Boolean\./gi,
  /Array\./gi,
  /Object\./gi
]

function parseCode(code: string): { lines: string[], lineCount: number } {
  const lines = code.split('\n')
  return {
    lines,
    lineCount: lines.length
  }
}

function scanForDangerousFunctions(code: string, lines: string[]): CodeThreat[] {
  const threats: CodeThreat[] = []
  
  Object.keys(DANGEROUS_FUNCTIONS).forEach(funcName => {
    const regex = new RegExp(`\\b${funcName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
    let match
    
    while ((match = regex.exec(code)) !== null) {
      const lineNumber = code.substring(0, match.index).split('\n').length
      const lineContent = lines[lineNumber - 1] || ''
      
      // Skip if it's in a comment
      if (lineContent.trim().startsWith('//') || lineContent.includes('/*')) {
        continue
      }
      
      threats.push({
        type: 'dangerous_function',
        severity: DANGEROUS_FUNCTIONS[funcName].severity,
        description: DANGEROUS_FUNCTIONS[funcName].description,
        line: lineNumber,
        column: match.index - code.lastIndexOf('\n', match.index),
        code: lineContent.trim(),
        pattern: funcName
      })
    }
  })
  
  return threats
}

function scanForSuspiciousPatterns(code: string, lines: string[]): CodeThreat[] {
  const threats: CodeThreat[] = []
  
  Object.keys(SUSPICIOUS_PATTERNS).forEach(patternType => {
    SUSPICIOUS_PATTERNS[patternType].forEach((regex, index) => {
      let match
      
      while ((match = regex.exec(code)) !== null) {
        const lineNumber = code.substring(0, match.index).split('\n').length
        const lineContent = lines[lineNumber - 1] || ''
        
        // Skip if it's in a comment
        if (lineContent.trim().startsWith('//') || lineContent.includes('/*')) {
          continue
        }
        
        let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
        let description = `Suspicious ${patternType} pattern detected`
        
        switch (patternType) {
          case 'infiniteLoop':
            severity = 'high'
            description = 'Potential infinite loop detected'
            break
          case 'memoryExhaustion':
            severity = 'critical'
            description = 'Potential memory exhaustion attack'
            break
          case 'obfuscated':
            severity = 'high'
            description = 'Obfuscated code detected'
            break
          case 'networkScanning':
            severity = 'critical'
            description = 'Potential network scanning behavior'
            break
          case 'dataExfiltration':
            severity = 'critical'
            description = 'Potential data exfiltration attempt'
            break
          case 'keylogger':
            severity = 'critical'
            description = 'Potential keylogger behavior'
            break
          case 'cookieManipulation':
            severity = 'high'
            description = 'Cookie manipulation detected'
            break
          case 'domManipulation':
            severity = 'medium'
            description = 'DOM manipulation detected'
            break
          case 'localStorageAccess':
            severity = 'medium'
            description = 'Local storage access detected'
            break
          case 'geolocationAccess':
            severity = 'high'
            description = 'Geolocation access detected'
            break
          case 'mediaAccess':
            severity = 'high'
            description = 'Media device access detected'
            break
        }
        
        threats.push({
          type: patternType,
          severity,
          description,
          line: lineNumber,
          column: match.index - code.lastIndexOf('\n', match.index),
          code: lineContent.trim(),
          pattern: regex.source
        })
      }
    })
  })
  
  return threats
}

function calculateSafetyScore(threats: CodeThreat[]): number {
  if (threats.length === 0) return 100
  
  let score = 100
  const weights = {
    critical: 25,
    high: 15,
    medium: 8,
    low: 3
  }
  
  threats.forEach(threat => {
    score -= weights[threat.severity]
  })
  
  return Math.max(0, score)
}

function generateRecommendations(threats: CodeThreat[]): string[] {
  const recommendations: string[] = []
  const threatTypes = new Set(threats.map(t => t.type))
  
  if (threatTypes.has('dangerous_function')) {
    recommendations.push('Remove or replace dangerous functions like eval(), Function(), or child_process operations')
  }
  
  if (threatTypes.has('infiniteLoop')) {
    recommendations.push('Add proper loop termination conditions to prevent infinite loops')
  }
  
  if (threatTypes.has('memoryExhaustion')) {
    recommendations.push('Limit memory allocations to prevent resource exhaustion attacks')
  }
  
  if (threatTypes.has('obfuscated')) {
    recommendations.push('Use clear, readable code instead of obfuscated patterns')
  }
  
  if (threatTypes.has('networkScanning')) {
    recommendations.push('Remove network scanning functionality')
  }
  
  if (threatTypes.has('dataExfiltration')) {
    recommendations.push('Remove data exfiltration capabilities')
  }
  
  if (threatTypes.has('keylogger')) {
    recommendations.push('Remove keylogging functionality')
  }
  
  if (threatTypes.has('cookieManipulation')) {
    recommendations.push('Limit cookie manipulation to necessary operations only')
  }
  
  if (threatTypes.has('domManipulation')) {
    recommendations.push('Use safe DOM manipulation methods and validate all inputs')
  }
  
  if (threatTypes.has('localStorageAccess')) {
    recommendations.push('Ensure local storage access is necessary and secure')
  }
  
  if (threatTypes.has('geolocationAccess')) {
    recommendations.push('Ensure geolocation access has proper user consent')
  }
  
  if (threatTypes.has('mediaAccess')) {
    recommendations.push('Ensure media device access has proper user consent')
  }
  
  return recommendations
}

async function logCodeScanEvent(
  supabase: any,
  eventType: string,
  severity: string,
  threats: CodeThreat[],
  score: number,
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
            line: t.line,
            pattern: t.pattern
          })),
          safety_score: score,
          code_size: requestData.codeSize,
          timestamp: new Date().toISOString()
        }
      })
  } catch (error) {
    console.error('Failed to log code scan event:', error)
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

    const { code, language = 'javascript' } = await req.json()

    if (!code || typeof code !== 'string') {
      return new Response(
        JSON.stringify({
          error: 'Invalid request',
          message: 'Code parameter is required and must be a string'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Limit code size
    const MAX_CODE_SIZE = 100000 // 100KB
    if (code.length > MAX_CODE_SIZE) {
      return new Response(
        JSON.stringify({
          error: 'Code too large',
          message: `Code size exceeds maximum allowed size of ${MAX_CODE_SIZE} characters`
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { lines, lineCount } = parseCode(code)
    
    // Scan for dangerous functions
    const functionThreats = scanForDangerousFunctions(code, lines)
    
    // Scan for suspicious patterns
    const patternThreats = scanForSuspiciousPatterns(code, lines)
    
    // Combine all threats
    const allThreats = [...functionThreats, ...patternThreats]
    
    // Calculate safety score
    const score = calculateSafetyScore(allThreats)
    
    // Generate recommendations
    const recommendations = generateRecommendations(allThreats)
    
    // Determine if code is safe
    const criticalThreats = allThreats.filter(t => t.severity === 'critical')
    const highThreats = allThreats.filter(t => t.severity === 'high')
    const isSafe = criticalThreats.length === 0 && highThreats.length === 0
    
    // Log security event if threats found
    if (allThreats.length > 0) {
      const eventSeverity = criticalThreats.length > 0 ? 'critical' : 
                           highThreats.length > 0 ? 'high' : 'medium'
      
      await logCodeScanEvent(
        supabaseClient,
        'malicious_code_detected',
        eventSeverity,
        allThreats,
        score,
        {
          ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
          codeSize: code.length
        }
      )
    }

    const result: CodeScanResult = {
      isSafe,
      threats: allThreats,
      score,
      recommendations
    }

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Code scan error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Code scanning failed',
        message: 'Unable to scan the provided code'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
