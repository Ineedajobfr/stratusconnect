interface BotDetectionResult {
  isBot: boolean
  confidence: number // 0-100
  reasons: string[]
  fingerprint: string
}

interface RequestFingerprint {
  userAgent: string
  language: string
  platform: string
  screen: string
  timezone: string
  plugins: string[]
  canvas: string
  webgl: string
  audio: string
  fonts: string[]
  timestamp: number
}

interface HoneypotField {
  name: string
  selector: string
  type: 'hidden' | 'text' | 'email'
  trap: boolean
}

class AntiScraper {
  private static instance: AntiScraper
  private fingerprint: RequestFingerprint | null = null
  private honeypots: HoneypotField[] = []
  private suspiciousIPs: Set<string> = new Set()
  private rateLimitMap: Map<string, { count: number; resetTime: number }> = new Map()
  
  private constructor() {
    this.initializeHoneypots()
    this.generateFingerprint()
  }
  
  public static getInstance(): AntiScraper {
    if (!AntiScraper.instance) {
      AntiScraper.instance = new AntiScraper()
    }
    return AntiScraper.instance
  }
  
  private initializeHoneypots(): void {
    this.honeypots = [
      {
        name: 'website',
        selector: 'input[name="website"]',
        type: 'hidden',
        trap: true
      },
      {
        name: 'phone',
        selector: 'input[name="phone"]',
        type: 'text',
        trap: true
      },
      {
        name: 'company',
        selector: 'input[name="company"]',
        type: 'text',
        trap: false // This is a legitimate field
      },
      {
        name: 'honeypot_email',
        selector: 'input[name="email_confirmation"]',
        type: 'email',
        trap: true
      }
    ]
  }
  
  private generateFingerprint(): void {
    if (typeof window === 'undefined') return
    
    const canvas = this.getCanvasFingerprint()
    const webgl = this.getWebGLFingerprint()
    const audio = this.getAudioFingerprint()
    const fonts = this.getFontFingerprint()
    
    this.fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      plugins: Array.from(navigator.plugins).map(p => p.name),
      canvas,
      webgl,
      audio,
      fonts,
      timestamp: Date.now()
    }
  }
  
  private getCanvasFingerprint(): string {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return 'no-canvas'
      
      // Draw some shapes and text
      ctx.textBaseline = 'top'
      ctx.font = '14px Arial'
      ctx.fillStyle = '#f60'
      ctx.fillRect(125, 1, 62, 20)
      ctx.fillStyle = '#069'
      ctx.fillText('Anti-scraper fingerprint', 2, 15)
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
      ctx.fillText('Anti-scraper fingerprint', 4, 17)
      
      return canvas.toDataURL()
    } catch (error) {
      return 'canvas-error'
    }
  }
  
  private getWebGLFingerprint(): string {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) return 'no-webgl'
      
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        return `${vendor}-${renderer}`
      }
      
      return 'webgl-no-debug'
    } catch (error) {
      return 'webgl-error'
    }
  }
  
  private getAudioFingerprint(): string {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const analyser = audioContext.createAnalyser()
      const gainNode = audioContext.createGain()
      const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1)
      
      oscillator.type = 'triangle'
      oscillator.frequency.value = 10000
      
      gainNode.gain.value = 0
      oscillator.connect(analyser)
      analyser.connect(scriptProcessor)
      scriptProcessor.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.start(0)
      
      return 'audio-fingerprint'
    } catch (error) {
      return 'audio-error'
    }
  }
  
  private getFontFingerprint(): string[] {
    const fonts = [
      'Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia',
      'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS',
      'Arial Black', 'Impact', 'Helvetica', 'Tahoma', 'Geneva',
      'Times', 'Helvetica Neue', 'Lucida Console', 'Monaco', 'Monaco'
    ]
    
    const availableFonts: string[] = []
    
    fonts.forEach(font => {
      if (this.isFontAvailable(font)) {
        availableFonts.push(font)
      }
    })
    
    return availableFonts
  }
  
  private isFontAvailable(font: string): boolean {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return false
    
    const testString = 'mmmmmmmmmmlli'
    const testSize = '72px'
    const h = canvas.height
    const w = canvas.width
    
    ctx.textBaseline = 'top'
    ctx.font = `${testSize} monospace`
    ctx.fillText(testString, 0, 0)
    const baselineWidth = ctx.measureText(testString).width
    
    ctx.font = `${testSize} ${font}, monospace`
    ctx.fillText(testString, 0, 0)
    const width = ctx.measureText(testString).width
    
    return width !== baselineWidth
  }
  
  public detectBot(): BotDetectionResult {
    const reasons: string[] = []
    let confidence = 0
    
    if (typeof window === 'undefined') {
      return {
        isBot: true,
        confidence: 100,
        reasons: ['Server-side request'],
        fingerprint: 'server-side'
      }
    }
    
    // Check for headless browser indicators
    if (this.isHeadlessBrowser()) {
      confidence += 40
      reasons.push('Headless browser detected')
    }
    
    // Check for automation tools
    if (this.isAutomationTool()) {
      confidence += 35
      reasons.push('Automation tool detected')
    }
    
    // Check for missing browser features
    if (this.hasMissingFeatures()) {
      confidence += 25
      reasons.push('Missing browser features')
    }
    
    // Check for suspicious user agent
    if (this.isSuspiciousUserAgent()) {
      confidence += 20
      reasons.push('Suspicious user agent')
    }
    
    // Check for missing plugins
    if (this.hasNoPlugins()) {
      confidence += 15
      reasons.push('No browser plugins detected')
    }
    
    // Check for unusual screen resolution
    if (this.hasUnusualScreen()) {
      confidence += 10
      reasons.push('Unusual screen resolution')
    }
    
    // Check for missing fonts
    if (this.hasMissingFonts()) {
      confidence += 10
      reasons.push('Missing common fonts')
    }
    
    // Check for timing attacks
    if (this.hasTimingAnomalies()) {
      confidence += 15
      reasons.push('Timing anomalies detected')
    }
    
    const fingerprint = this.fingerprint ? 
      btoa(JSON.stringify(this.fingerprint)) : 'no-fingerprint'
    
    return {
      isBot: confidence > 50,
      confidence,
      reasons,
      fingerprint
    }
  }
  
  private isHeadlessBrowser(): boolean {
    const userAgent = navigator.userAgent.toLowerCase()
    const headlessIndicators = [
      'headless',
      'phantom',
      'selenium',
      'puppeteer',
      'playwright',
      'webdriver',
      'chrome-lighthouse',
      'chrome-headless'
    ]
    
    return headlessIndicators.some(indicator => userAgent.includes(indicator))
  }
  
  private isAutomationTool(): boolean {
    const userAgent = navigator.userAgent.toLowerCase()
    const automationIndicators = [
      'automation',
      'bot',
      'crawler',
      'spider',
      'scraper',
      'curl',
      'wget',
      'python-requests',
      'node-fetch',
      'postman'
    ]
    
    return automationIndicators.some(indicator => userAgent.includes(indicator))
  }
  
  private hasMissingFeatures(): boolean {
    const features = [
      'navigator.webdriver',
      'window.chrome',
      'window.outerHeight',
      'window.outerWidth',
      'screen.availHeight',
      'screen.availWidth'
    ]
    
    let missingCount = 0
    features.forEach(feature => {
      try {
        if (typeof window[feature as keyof Window] === 'undefined') {
          missingCount++
        }
      } catch {
        missingCount++
      }
    })
    
    return missingCount > 2
  }
  
  private isSuspiciousUserAgent(): boolean {
    const userAgent = navigator.userAgent
    
    // Check for empty or very short user agent
    if (!userAgent || userAgent.length < 10) return true
    
    // Check for missing common browser indicators
    const browserIndicators = ['mozilla', 'chrome', 'safari', 'firefox', 'edge']
    const hasBrowserIndicator = browserIndicators.some(indicator => 
      userAgent.toLowerCase().includes(indicator)
    )
    
    return !hasBrowserIndicator
  }
  
  private hasNoPlugins(): boolean {
    return navigator.plugins.length === 0
  }
  
  private hasUnusualScreen(): boolean {
    // Common screen resolutions
    const commonResolutions = [
      '1920x1080', '1366x768', '1536x864', '1440x900', '1280x720',
      '1600x900', '1024x768', '1280x1024', '1680x1050', '1280x800'
    ]
    
    const currentResolution = `${screen.width}x${screen.height}`
    return !commonResolutions.includes(currentResolution)
  }
  
  private hasMissingFonts(): boolean {
    const commonFonts = ['Arial', 'Times New Roman', 'Helvetica', 'Verdana']
    const availableFonts = this.getFontFingerprint()
    
    let missingCount = 0
    commonFonts.forEach(font => {
      if (!availableFonts.includes(font)) {
        missingCount++
      }
    })
    
    return missingCount > 2
  }
  
  private hasTimingAnomalies(): boolean {
    // This is a simplified timing check
    // In a real implementation, you'd measure various operations
    const start = performance.now()
    
    // Simulate some work
    for (let i = 0; i < 1000; i++) {
      Math.random()
    }
    
    const end = performance.now()
    const duration = end - start
    
    // If operations are too fast or too slow, it might be suspicious
    return duration < 0.1 || duration > 10
  }
  
  public createHoneypotFields(): HoneypotField[] {
    return this.honeypots.filter(honeypot => honeypot.trap)
  }
  
  public checkHoneypot(formData: FormData): boolean {
    const honeypotFields = this.createHoneypotFields()
    
    for (const honeypot of honeypotFields) {
      const value = formData.get(honeypot.name)
      if (value && value.toString().trim() !== '') {
        return true // Honeypot triggered
      }
    }
    
    return false
  }
  
  public checkRateLimit(identifier: string, limit: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now()
    const key = `${identifier}-${Math.floor(now / windowMs)}`
    
    const current = this.rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs }
    
    if (current.resetTime < now) {
      current.count = 0
      current.resetTime = now + windowMs
    }
    
    current.count++
    this.rateLimitMap.set(key, current)
    
    return current.count > limit
  }
  
  public generateChallenge(): string {
    // Generate a simple math challenge
    const a = Math.floor(Math.random() * 10) + 1
    const b = Math.floor(Math.random() * 10) + 1
    const operation = Math.random() > 0.5 ? '+' : '-'
    
    let question: string
    let answer: number
    
    if (operation === '+') {
      question = `${a} + ${b}`
      answer = a + b
    } else {
      question = `${Math.max(a, b)} - ${Math.min(a, b)}`
      answer = Math.max(a, b) - Math.min(a, b)
    }
    
    // Store answer in sessionStorage (in real implementation, use server-side storage)
    sessionStorage.setItem('challenge-answer', answer.toString())
    
    return question
  }
  
  public verifyChallenge(userAnswer: string): boolean {
    const correctAnswer = sessionStorage.getItem('challenge-answer')
    sessionStorage.removeItem('challenge-answer')
    
    return correctAnswer === userAnswer
  }
  
  public addSuspiciousIP(ip: string): void {
    this.suspiciousIPs.add(ip)
  }
  
  public isSuspiciousIP(ip: string): boolean {
    return this.suspiciousIPs.has(ip)
  }
  
  public getFingerprint(): RequestFingerprint | null {
    return this.fingerprint
  }
  
  public logSuspiciousActivity(activity: string, details: any = {}): void {
    console.warn('Suspicious activity detected:', activity, details)
    
    // In a real implementation, send this to your security monitoring system
    if (typeof window !== 'undefined' && window.fetch) {
      fetch('/api/security/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          activity,
          details,
          fingerprint: this.fingerprint,
          timestamp: new Date().toISOString()
        })
      }).catch(error => {
        console.error('Failed to log suspicious activity:', error)
      })
    }
  }
}

// Export singleton instance
export const antiScraper = AntiScraper.getInstance()

// Export types
export type { BotDetectionResult, HoneypotField, RequestFingerprint }

// React hook for bot detection
export function useBotDetection() {
  if (typeof window === 'undefined') {
    return {
      isBot: true,
      confidence: 100,
      reasons: ['Server-side'],
      fingerprint: 'server-side'
    }
  }
  
  return antiScraper.detectBot()
}

// React hook for honeypot fields
export function useHoneypotFields() {
  return antiScraper.createHoneypotFields()
}

// Utility function to check if request should be blocked
export function shouldBlockRequest(ip?: string): boolean {
  // Check rate limiting
  const identifier = ip || 'unknown'
  if (antiScraper.checkRateLimit(identifier)) {
    return true
  }
  
  // Check suspicious IPs
  if (ip && antiScraper.isSuspiciousIP(ip)) {
    return true
  }
  
  // Check bot detection
  const botDetection = antiScraper.detectBot()
  if (botDetection.isBot && botDetection.confidence > 70) {
    return true
  }
  
  return false
}
