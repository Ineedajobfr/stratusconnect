import { supabase } from '@/integrations/supabase/client'

export interface SecurityAlert {
  id: string
  type: SecurityAlertType
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  timestamp: string
  source: string
  metadata: Record<string, any>
  resolved: boolean
  resolvedAt?: string
  resolvedBy?: string
}

export type SecurityAlertType = 
  | 'rate_limit_exceeded'
  | 'suspicious_activity'
  | 'malicious_code_detected'
  | 'sql_injection_attempt'
  | 'xss_attempt'
  | 'command_injection_attempt'
  | 'path_traversal_attempt'
  | 'file_upload_attack'
  | 'bot_detected'
  | 'scraping_attempt'
  | 'ddos_attack'
  | 'unauthorized_access'
  | 'privilege_escalation'
  | 'data_exfiltration'
  | 'dependency_vulnerability'
  | 'secret_exposure'
  | 'configuration_error'

export interface SecurityEvent {
  event_type: string
  severity: string
  ip_address: string
  user_agent: string
  user_id?: string
  details: Record<string, any>
  timestamp?: string
}

class SecurityAlertManager {
  private static instance: SecurityAlertManager
  private alertCallbacks: Array<(alert: SecurityAlert) => void> = []
  private webhookUrls: string[] = []
  private emailRecipients: string[] = []
  private notificationSettings: {
    email: boolean
    webhook: boolean
    console: boolean
    slack: boolean
    discord: boolean
  } = {
    email: false,
    webhook: false,
    console: true,
    slack: false,
    discord: false
  }

  private constructor() {
    this.loadSettings()
  }

  public static getInstance(): SecurityAlertManager {
    if (!SecurityAlertManager.instance) {
      SecurityAlertManager.instance = new SecurityAlertManager()
    }
    return SecurityAlertManager.instance
  }

  private loadSettings(): void {
    // Load settings from localStorage or environment variables
    if (typeof window !== 'undefined') {
      const settings = localStorage.getItem('security-alert-settings')
      if (settings) {
        this.notificationSettings = { ...this.notificationSettings, ...JSON.parse(settings) }
      }
    }
  }

  public saveSettings(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('security-alert-settings', JSON.stringify(this.notificationSettings))
    }
  }

  public setNotificationSettings(settings: Partial<typeof this.notificationSettings>): void {
    this.notificationSettings = { ...this.notificationSettings, ...settings }
    this.saveSettings()
  }

  public addWebhookUrl(url: string): void {
    if (!this.webhookUrls.includes(url)) {
      this.webhookUrls.push(url)
    }
  }

  public removeWebhookUrl(url: string): void {
    this.webhookUrls = this.webhookUrls.filter(u => u !== url)
  }

  public addEmailRecipient(email: string): void {
    if (!this.emailRecipients.includes(email)) {
      this.emailRecipients.push(email)
    }
  }

  public removeEmailRecipient(email: string): void {
    this.emailRecipients = this.emailRecipients.filter(e => e !== email)
  }

  public onAlert(callback: (alert: SecurityAlert) => void): () => void {
    this.alertCallbacks.push(callback)
    return () => {
      this.alertCallbacks = this.alertCallbacks.filter(cb => cb !== callback)
    }
  }

  public async createAlert(alert: Omit<SecurityAlert, 'id' | 'timestamp' | 'resolved'>): Promise<SecurityAlert> {
    const newAlert: SecurityAlert = {
      ...alert,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      resolved: false
    }

    try {
      // Store in Supabase
      const { error } = await supabase
        .from('security_alerts')
        .insert({
          id: newAlert.id,
          type: newAlert.type,
          severity: newAlert.severity,
          title: newAlert.title,
          description: newAlert.description,
          timestamp: newAlert.timestamp,
          source: newAlert.source,
          metadata: newAlert.metadata,
          resolved: newAlert.resolved
        })

      if (error) {
        console.error('Failed to store security alert:', error)
      }

      // Trigger callbacks
      this.alertCallbacks.forEach(callback => {
        try {
          callback(newAlert)
        } catch (error) {
          console.error('Error in alert callback:', error)
        }
      })

      // Send notifications
      await this.sendNotifications(newAlert)

      return newAlert
    } catch (error) {
      console.error('Failed to create security alert:', error)
      throw error
    }
  }

  public async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      const { error } = await supabase
        .from('security_events')
        .insert({
          event_type: event.event_type,
          severity: event.severity,
          ip_address: event.ip_address,
          user_agent: event.user_agent,
          user_id: event.user_id,
          details: event.details,
          timestamp: event.timestamp || new Date().toISOString()
        })

      if (error) {
        console.error('Failed to log security event:', error)
      }

      // Check if this event should trigger an alert
      await this.checkEventForAlert(event)
    } catch (error) {
      console.error('Failed to log security event:', error)
    }
  }

  private async checkEventForAlert(event: SecurityEvent): Promise<void> {
    const severity = event.severity as 'low' | 'medium' | 'high' | 'critical'
    
    // Only create alerts for medium severity and above
    if (severity === 'low') return

    let alertType: SecurityAlertType
    let title: string
    let description: string

    switch (event.event_type) {
      case 'rate_limit_exceeded':
        alertType = 'rate_limit_exceeded'
        title = 'Rate Limit Exceeded'
        description = `Rate limit exceeded from IP ${event.ip_address}`
        break
      case 'suspicious_activity_detected':
        alertType = 'suspicious_activity'
        title = 'Suspicious Activity Detected'
        description = `Suspicious activity detected from IP ${event.ip_address}`
        break
      case 'malicious_code_detected':
        alertType = 'malicious_code_detected'
        title = 'Malicious Code Detected'
        description = `Malicious code detected in user upload from IP ${event.ip_address}`
        break
      case 'sql_injection_attempt':
        alertType = 'sql_injection_attempt'
        title = 'SQL Injection Attempt'
        description = `SQL injection attempt detected from IP ${event.ip_address}`
        break
      case 'xss_attempt':
        alertType = 'xss_attempt'
        title = 'XSS Attack Attempt'
        description = `Cross-site scripting attack attempted from IP ${event.ip_address}`
        break
      case 'command_injection_attempt':
        alertType = 'command_injection_attempt'
        title = 'Command Injection Attempt'
        description = `Command injection attempt detected from IP ${event.ip_address}`
        break
      case 'path_traversal_attempt':
        alertType = 'path_traversal_attempt'
        title = 'Path Traversal Attempt'
        description = `Path traversal attack attempted from IP ${event.ip_address}`
        break
      case 'bot_detected':
        alertType = 'bot_detected'
        title = 'Bot Detected'
        description = `Automated bot detected from IP ${event.ip_address}`
        break
      case 'scraping_attempt':
        alertType = 'scraping_attempt'
        title = 'Scraping Attempt'
        description = `Web scraping attempt detected from IP ${event.ip_address}`
        break
      default:
        return // Don't create alert for unknown event types
    }

    await this.createAlert({
      type: alertType,
      severity,
      title,
      description,
      source: 'automated',
      metadata: {
        event_type: event.event_type,
        ip_address: event.ip_address,
        user_agent: event.user_agent,
        user_id: event.user_id,
        details: event.details
      }
    })
  }

  private async sendNotifications(alert: SecurityAlert): Promise<void> {
    const promises: Promise<void>[] = []

    // Console notification
    if (this.notificationSettings.console) {
      promises.push(this.sendConsoleNotification(alert))
    }

    // Email notification
    if (this.notificationSettings.email && this.emailRecipients.length > 0) {
      promises.push(this.sendEmailNotification(alert))
    }

    // Webhook notification
    if (this.notificationSettings.webhook && this.webhookUrls.length > 0) {
      promises.push(this.sendWebhookNotification(alert))
    }

    // Slack notification
    if (this.notificationSettings.slack) {
      promises.push(this.sendSlackNotification(alert))
    }

    // Discord notification
    if (this.notificationSettings.discord) {
      promises.push(this.sendDiscordNotification(alert))
    }

    await Promise.allSettled(promises)
  }

  private async sendConsoleNotification(alert: SecurityAlert): Promise<void> {
    const emoji = this.getSeverityEmoji(alert.severity)
    const message = `${emoji} [${alert.severity.toUpperCase()}] ${alert.title}: ${alert.description}`
    
    if (alert.severity === 'critical' || alert.severity === 'high') {
      console.error(message, alert.metadata)
    } else if (alert.severity === 'medium') {
      console.warn(message, alert.metadata)
    } else {
      console.info(message, alert.metadata)
    }
  }

  private async sendEmailNotification(alert: SecurityAlert): Promise<void> {
    // This would integrate with your email service
    // For now, we'll just log it
    console.log('Email notification would be sent:', {
      recipients: this.emailRecipients,
      subject: `[${alert.severity.toUpperCase()}] ${alert.title}`,
      body: this.formatEmailBody(alert)
    })
  }

  private async sendWebhookNotification(alert: SecurityAlert): Promise<void> {
    const payload = {
      alert: {
        id: alert.id,
        type: alert.type,
        severity: alert.severity,
        title: alert.title,
        description: alert.description,
        timestamp: alert.timestamp,
        source: alert.source,
        metadata: alert.metadata
      },
      timestamp: new Date().toISOString()
    }

    const promises = this.webhookUrls.map(url => 
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }).catch(error => {
        console.error(`Failed to send webhook to ${url}:`, error)
      })
    )

    await Promise.allSettled(promises)
  }

  private async sendSlackNotification(alert: SecurityAlert): Promise<void> {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL
    if (!webhookUrl) return

    const color = this.getSeverityColor(alert.severity)
    const emoji = this.getSeverityEmoji(alert.severity)

    const payload = {
      attachments: [{
        color,
        title: `${emoji} ${alert.title}`,
        text: alert.description,
        fields: [
          {
            title: 'Severity',
            value: alert.severity.toUpperCase(),
            short: true
          },
          {
            title: 'Type',
            value: alert.type,
            short: true
          },
          {
            title: 'Timestamp',
            value: new Date(alert.timestamp).toLocaleString(),
            short: true
          },
          {
            title: 'Source',
            value: alert.source,
            short: true
          }
        ],
        footer: 'StratusConnect Security System',
        ts: Math.floor(new Date(alert.timestamp).getTime() / 1000)
      }]
    }

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
    } catch (error) {
      console.error('Failed to send Slack notification:', error)
    }
  }

  private async sendDiscordNotification(alert: SecurityAlert): Promise<void> {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL
    if (!webhookUrl) return

    const color = parseInt(this.getSeverityColor(alert.severity).replace('#', ''), 16)
    const emoji = this.getSeverityEmoji(alert.severity)

    const payload = {
      embeds: [{
        title: `${emoji} ${alert.title}`,
        description: alert.description,
        color,
        fields: [
          {
            name: 'Severity',
            value: alert.severity.toUpperCase(),
            inline: true
          },
          {
            name: 'Type',
            value: alert.type,
            inline: true
          },
          {
            name: 'Timestamp',
            value: new Date(alert.timestamp).toLocaleString(),
            inline: true
          }
        ],
        footer: {
          text: 'StratusConnect Security System'
        },
        timestamp: alert.timestamp
      }]
    }

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
    } catch (error) {
      console.error('Failed to send Discord notification:', error)
    }
  }

  private getSeverityEmoji(severity: string): string {
    switch (severity) {
      case 'critical': return '🚨'
      case 'high': return '⚠️'
      case 'medium': return '🔶'
      case 'low': return 'ℹ️'
      default: return '❓'
    }
  }

  private getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical': return '#ff0000'
      case 'high': return '#ff6600'
      case 'medium': return '#ffaa00'
      case 'low': return '#00aa00'
      default: return '#666666'
    }
  }

  private formatEmailBody(alert: SecurityAlert): string {
    return `
Security Alert - ${alert.title}

Severity: ${alert.severity.toUpperCase()}
Type: ${alert.type}
Timestamp: ${new Date(alert.timestamp).toLocaleString()}
Source: ${alert.source}

Description:
${alert.description}

Metadata:
${JSON.stringify(alert.metadata, null, 2)}

Please investigate this security incident immediately.

Best regards,
StratusConnect Security System
    `.trim()
  }

  public async getAlerts(limit: number = 50, offset: number = 0): Promise<SecurityAlert[]> {
    try {
      const { data, error } = await supabase
        .from('security_alerts')
        .select('*')
        .order('timestamp', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('Failed to fetch security alerts:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Failed to fetch security alerts:', error)
      return []
    }
  }

  public async resolveAlert(alertId: string, resolvedBy: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('security_alerts')
        .update({
          resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: resolvedBy
        })
        .eq('id', alertId)

      if (error) {
        console.error('Failed to resolve security alert:', error)
      }
    } catch (error) {
      console.error('Failed to resolve security alert:', error)
    }
  }

  public async getAlertStats(): Promise<{
    total: number
    resolved: number
    unresolved: number
    bySeverity: Record<string, number>
    byType: Record<string, number>
  }> {
    try {
      const { data, error } = await supabase
        .from('security_alerts')
        .select('severity, type, resolved')

      if (error) {
        console.error('Failed to fetch alert stats:', error)
        return {
          total: 0,
          resolved: 0,
          unresolved: 0,
          bySeverity: {},
          byType: {}
        }
      }

      const stats = {
        total: data.length,
        resolved: data.filter(a => a.resolved).length,
        unresolved: data.filter(a => !a.resolved).length,
        bySeverity: {} as Record<string, number>,
        byType: {} as Record<string, number>
      }

      data.forEach(alert => {
        stats.bySeverity[alert.severity] = (stats.bySeverity[alert.severity] || 0) + 1
        stats.byType[alert.type] = (stats.byType[alert.type] || 0) + 1
      })

      return stats
    } catch (error) {
      console.error('Failed to fetch alert stats:', error)
      return {
        total: 0,
        resolved: 0,
        unresolved: 0,
        bySeverity: {},
        byType: {}
      }
    }
  }
}

// Export singleton instance
export const securityAlerts = SecurityAlertManager.getInstance()

// Convenience functions
export async function logSecurityEvent(event: SecurityEvent): Promise<void> {
  return securityAlerts.logSecurityEvent(event)
}

export async function createSecurityAlert(alert: Omit<SecurityAlert, 'id' | 'timestamp' | 'resolved'>): Promise<SecurityAlert> {
  return securityAlerts.createAlert(alert)
}

export function onSecurityAlert(callback: (alert: SecurityAlert) => void): () => void {
  return securityAlerts.onAlert(callback)
}
