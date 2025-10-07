import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SecurityAlert, securityAlerts } from '@/lib/security/alerts'
import { antiScraper } from '@/lib/security/anti-scraper'
import {
    Activity,
    AlertCircle,
    AlertTriangle,
    Bot,
    CheckCircle,
    Clock,
    Code,
    Database,
    Eye,
    FileText,
    Info,
    Lock,
    Server,
    Shield,
    XCircle
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface SecurityStats {
  total: number
  resolved: number
  unresolved: number
  bySeverity: Record<string, number>
  byType: Record<string, number>
}

interface ThreatActivity {
  timestamp: string
  type: string
  severity: string
  ip: string
  description: string
}

const SecurityDashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([])
  const [stats, setStats] = useState<SecurityStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [botDetection, setBotDetection] = useState<any>(null)

  useEffect(() => {
    loadDashboardData()
    
    // Set up real-time alert subscription
    const unsubscribe = securityAlerts.onAlert((alert) => {
      setAlerts(prev => [alert, ...prev.slice(0, 49)]) // Keep only latest 50
      loadStats() // Refresh stats
    })

    // Check bot detection status
    if (typeof window !== 'undefined') {
      setBotDetection(antiScraper.detectBot())
    }

    return () => unsubscribe()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [alertsData, statsData] = await Promise.all([
        securityAlerts.getAlerts(50, 0),
        securityAlerts.getAlertStats()
      ])
      
      setAlerts(alertsData)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await securityAlerts.getAlertStats()
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />
      case 'high': return <XCircle className="h-4 w-4" />
      case 'medium': return <AlertCircle className="h-4 w-4" />
      case 'low': return <Info className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rate_limit_exceeded': return <Clock className="h-4 w-4" />
      case 'suspicious_activity': return <Eye className="h-4 w-4" />
      case 'malicious_code_detected': return <Code className="h-4 w-4" />
      case 'sql_injection_attempt': return <Database className="h-4 w-4" />
      case 'xss_attempt': return <FileText className="h-4 w-4" />
      case 'bot_detected': return <Bot className="h-4 w-4" />
      case 'ddos_attack': return <Server className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  const handleResolveAlert = async (alertId: string) => {
    try {
      await securityAlerts.resolveAlert(alertId, 'admin')
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, resolved: true, resolvedAt: new Date().toISOString(), resolvedBy: 'admin' }
          : alert
      ))
      loadStats()
    } catch (error) {
      console.error('Failed to resolve alert:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading Security Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Security Dashboard</h1>
                <p className="text-slate-400">Monitor and manage security threats in real-time</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-green-500 text-green-400">
                <CheckCircle className="h-3 w-3 mr-1" />
                System Secure
              </Badge>
              <Button 
                onClick={loadDashboardData}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Activity className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
              <Shield className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-slate-700">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alerts ({stats?.unresolved || 0})
            </TabsTrigger>
            <TabsTrigger value="threats" className="data-[state=active]:bg-slate-700">
              <Eye className="h-4 w-4 mr-2" />
              Threats
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-slate-700">
              <Activity className="h-4 w-4 mr-2" />
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-slate-700">
              <Lock className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Total Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats?.total || 0}</div>
                  <p className="text-xs text-slate-400">
                    {stats?.resolved || 0} resolved, {stats?.unresolved || 0} active
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Critical Threats</CardTitle>
                  <XCircle className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">{stats?.bySeverity.critical || 0}</div>
                  <p className="text-xs text-slate-400">Requires immediate attention</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">High Severity</CardTitle>
                  <AlertCircle className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-400">{stats?.bySeverity.high || 0}</div>
                  <p className="text-xs text-slate-400">Should be addressed soon</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Security Score</CardTitle>
                  <Shield className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">
                    {Math.max(0, 100 - ((stats?.unresolved || 0) * 10))}%
                  </div>
                  <p className="text-xs text-slate-400">Overall security health</p>
                </CardContent>
              </Card>
            </div>

            {/* Bot Detection Status */}
            {botDetection && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Bot className="h-5 w-5" />
                    <span>Bot Detection Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-lg font-semibold ${botDetection.isBot ? 'text-red-400' : 'text-green-400'}`}>
                        {botDetection.isBot ? 'Bot Detected' : 'Human User'}
                      </p>
                      <p className="text-sm text-slate-400">
                        Confidence: {botDetection.confidence}%
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={botDetection.isBot ? 'border-red-500 text-red-400' : 'border-green-500 text-green-400'}
                    >
                      {botDetection.isBot ? 'Suspicious' : 'Safe'}
                    </Badge>
                  </div>
                  {botDetection.reasons.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-slate-400 mb-2">Detection Reasons:</p>
                      <ul className="space-y-1">
                        {botDetection.reasons.map((reason: string, index: number) => (
                          <li key={index} className="text-sm text-slate-300">• {reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Security Events</CardTitle>
                <CardDescription className="text-slate-400">Latest 5 security events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getSeverityIcon(alert.severity)}
                        <div>
                          <p className="text-sm font-medium text-white">{alert.title}</p>
                          <p className="text-xs text-slate-400">{alert.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="outline" 
                          className={`${getSeverityColor(alert.severity)} text-white border-0`}
                        >
                          {alert.severity}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {alerts.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-400" />
                      <p>No recent security events</p>
                      <p className="text-sm">Your system is secure!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Security Alerts</CardTitle>
                <CardDescription className="text-slate-400">
                  Monitor and manage security alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <Alert key={alert.id} className={`border-l-4 ${
                      alert.severity === 'critical' ? 'border-red-500 bg-red-900/20' :
                      alert.severity === 'high' ? 'border-orange-500 bg-orange-900/20' :
                      alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-900/20' :
                      'border-green-500 bg-green-900/20'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getTypeIcon(alert.type)}
                          <div>
                            <AlertTitle className="text-white">{alert.title}</AlertTitle>
                            <AlertDescription className="text-slate-300">
                              {alert.description}
                            </AlertDescription>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400">
                              <span>Type: {alert.type}</span>
                              <span>Source: {alert.source}</span>
                              <span>Time: {new Date(alert.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="outline" 
                            className={`${getSeverityColor(alert.severity)} text-white border-0`}
                          >
                            {alert.severity}
                          </Badge>
                          {!alert.resolved && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolveAlert(alert.id)}
                              className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                              Resolve
                            </Button>
                          )}
                          {alert.resolved && (
                            <Badge variant="outline" className="border-green-500 text-green-400">
                              Resolved
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Alert>
                  ))}
                  {alerts.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                      <Shield className="h-16 w-16 mx-auto mb-4 text-green-400" />
                      <p className="text-lg">No security alerts</p>
                      <p className="text-sm">Your system is currently secure</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Threats Tab */}
          <TabsContent value="threats" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Threat Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats?.byType && Object.entries(stats.byType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(type)}
                          <span className="text-slate-300 capitalize">
                            {type.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                          {count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Severity Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.bySeverity && Object.entries(stats.bySeverity).map(([severity, count]) => (
                      <div key={severity}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-300 capitalize">{severity}</span>
                          <span className="text-slate-400">{count}</span>
                        </div>
                        <Progress 
                          value={(count / (stats?.total || 1)) * 100} 
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Rate Limiting</span>
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Input Validation</span>
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Malicious Code Scanner</span>
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Bot Detection</span>
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">CSP Headers</span>
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Security Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">
                        {Math.max(0, 100 - ((stats?.unresolved || 0) * 10))}%
                      </div>
                      <p className="text-slate-400">Security Score</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-white">{stats?.total || 0}</div>
                        <p className="text-xs text-slate-400">Total Alerts</p>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-green-400">{stats?.resolved || 0}</div>
                        <p className="text-xs text-slate-400">Resolved</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Security Settings</CardTitle>
                <CardDescription className="text-slate-400">
                  Configure security monitoring and alerting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center py-12 text-slate-400">
                    <Lock className="h-16 w-16 mx-auto mb-4 text-slate-500" />
                    <p className="text-lg">Security Settings</p>
                    <p className="text-sm">Configuration options coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default SecurityDashboard
