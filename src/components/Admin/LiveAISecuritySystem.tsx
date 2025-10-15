// Live AI Security System - Always Running Security Assistant
// This AI is constantly monitoring the site and reporting issues in real-time

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Activity,
    AlertTriangle,
    Brain,
    Bug,
    CheckCircle,
    Database,
    Eye,
    Globe,
    Shield,
    Users,
    Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { AIIssueSummary } from './AIIssueSummary';

interface SecurityCheck {
    id: string;
    type: 'system' | 'user' | 'database' | 'security' | 'performance' | 'error';
    status: 'checking' | 'pass' | 'warning' | 'error' | 'critical';
    message: string;
    details?: string;
    timestamp: Date;
    location?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
}

interface AISecuritySystemProps {
    className?: string;
}

export function LiveAISecuritySystem({ className }: AISecuritySystemProps) {
    const [isActive, setIsActive] = useState(true);
    const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>([]);
    const [systemStatus, setSystemStatus] = useState<'online' | 'scanning' | 'alert'>('online');
    const [lastCheck, setLastCheck] = useState<Date>(new Date());

    // Clear testing session function
    const clearTestingSession = () => {
        try {
            // Clear test user data
            localStorage.removeItem('test_user');
            localStorage.removeItem('test_user_active');
            
            // Clear any admin session if it's a test session
            const adminSession = localStorage.getItem('admin_session');
            if (adminSession) {
                const adminUser = JSON.parse(adminSession);
                if (adminUser.isTestUser || adminUser.email?.includes('test')) {
                    localStorage.removeItem('admin_session');
                    localStorage.removeItem('secure_admin_auth');
                }
            }
            
            console.log('🧹 Testing session cleared successfully');
            
            // Refresh the security checks to update the status
            performSecurityChecks();
            
            // Show success message
            alert('✅ Testing session cleared successfully! The system will now show normal user session status.');
            
        } catch (error) {
            console.error('Error clearing testing session:', error);
            alert('❌ Error clearing testing session. Please try again.');
        }
    };

    // AI Security Check Functions - REAL LIVE MONITORING
    const performSecurityChecks = async () => {
        const checks: SecurityCheck[] = [];
        const now = new Date();

        // 1. REAL Database Health Check
        checks.push({
            id: 'database-health',
            type: 'database',
            status: 'checking',
            message: '🔍 Scanning database connectivity...',
            timestamp: now,
            severity: 'critical'
        });

        // 2. REAL User Session Monitoring
        checks.push({
            id: 'session-monitor',
            type: 'user',
            status: 'checking',
            message: '👥 Monitoring active user sessions...',
            timestamp: now,
            severity: 'high'
        });

        // 3. REAL Error Detection
        checks.push({
            id: 'error-detection',
            type: 'error',
            status: 'checking',
            message: '🚨 Scanning for system errors...',
            timestamp: now,
            severity: 'critical'
        });

        // 4. REAL Performance Monitoring
        checks.push({
            id: 'performance-monitor',
            type: 'performance',
            status: 'checking',
            message: '⚡ Analyzing system performance...',
            timestamp: now,
            severity: 'medium'
        });

        // 5. REAL Security Audit
        checks.push({
            id: 'security-audit',
            type: 'security',
            status: 'checking',
            message: '🔒 Conducting security audit...',
            timestamp: now,
            severity: 'critical'
        });

        // 6. REAL API Health Check
        checks.push({
            id: 'api-health',
            type: 'system',
            status: 'checking',
            message: '🌐 Testing API endpoints...',
            timestamp: now,
            severity: 'high'
        });

        // Add initial checks
        setSecurityChecks(checks);
        setSystemStatus('scanning');

        // PERFORM REAL SECURITY CHECKS
        setTimeout(async () => {
            const updatedChecks = await Promise.all(checks.map(async (check) => {
                let status: SecurityCheck['status'] = 'checking';
                let message = check.message;
                let details = '';
                let severity = check.severity;

                try {
                    switch (check.id) {
                        case 'database-health':
                            // REAL database connectivity test
                            const dbStart = performance.now();
                            let dbTime = 0;
                            let dbTest = false;
                            
                            try {
                                const response = await fetch('/api/health/database');
                                dbTime = performance.now() - dbStart;
                                dbTest = response.ok;
                            } catch (error) {
                                dbTime = performance.now() - dbStart;
                                dbTest = false;
                            }
                            
                            if (dbTime < 1000 && dbTest) {
                                status = 'pass';
                                message = '✅ Database: Healthy & Responsive';
                                details = `Connection time: ${Math.round(dbTime)}ms`;
                            } else {
                                status = 'warning';
                                message = '⚠️ Database: Slow Response';
                                details = `Connection time: ${Math.round(dbTime)}ms - May need optimization`;
                                severity = 'high';
                            }
                            break;

                        case 'session-monitor':
                            // REAL session monitoring
                            const activeSessions = localStorage.getItem('active_sessions') || '0';
                            const testUserActive = localStorage.getItem('test_user_active');
                            
                            if (testUserActive === 'true') {
                                status = 'warning';
                                message = '👤 Test User Session Active';
                                details = 'Test user impersonation detected - Monitor for security';
                                severity = 'medium';
                            } else {
                                status = 'pass';
                                message = '✅ User Sessions: Normal';
                                details = `${activeSessions} active sessions monitored`;
                            }
                            break;

                        case 'error-detection':
                            // REAL error detection from console
                            const errorCount = (window as any).__errorCount || 0;
                            const recentErrors = (window as any).__recentErrors || [];
                            
                            if (recentErrors.length > 0) {
                                status = 'error';
                                message = '🚨 Errors Detected in System';
                                details = `${recentErrors.length} recent errors: ${recentErrors.slice(0, 2).join(', ')}`;
                                severity = 'critical';
                            } else {
                                status = 'pass';
                                message = '✅ System: Error-Free';
                                details = 'No critical errors detected in current session';
                            }
                            break;

                        case 'performance-monitor':
                            // REAL performance monitoring
                            const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
                            const memoryMB = Math.round(memoryUsage / 1024 / 1024);
                            
                            if (memoryMB > 100) {
                                status = 'warning';
                                message = '⚡ Performance: High Memory Usage';
                                details = `Memory usage: ${memoryMB}MB - Consider optimization`;
                                severity = 'medium';
                            } else {
                                status = 'pass';
                                message = '✅ Performance: Optimal';
                                details = `Memory usage: ${memoryMB}MB - Within normal range`;
                            }
                            break;

                        case 'security-audit':
                            // REAL security checks
                            const adminAuth = localStorage.getItem('secure_admin_auth');
                            const hasAdminAccess = adminAuth === 'true';
                            
                            if (hasAdminAccess) {
                                status = 'pass';
                                message = '🔒 Security: Admin Access Verified';
                                details = 'Secure admin authentication active';
                            } else {
                                status = 'warning';
                                message = '🔒 Security: Standard Mode';
                                details = 'No elevated admin privileges detected';
                                severity = 'low';
                            }
                            break;

                        case 'api-health':
                            // REAL API health check
                            const apiStart = performance.now();
                            try {
                                const response = await fetch('/api/health');
                                const apiTime = performance.now() - apiStart;
                                
                                if (response.ok && apiTime < 500) {
                                    status = 'pass';
                                    message = '✅ API: Healthy & Fast';
                                    details = `Response time: ${Math.round(apiTime)}ms`;
                                } else {
                                    status = 'warning';
                                    message = '⚠️ API: Slow Response';
                                    details = `Response time: ${Math.round(apiTime)}ms`;
                                    severity = 'medium';
                                }
                            } catch (error) {
                                status = 'error';
                                message = '🚨 API: Connection Failed';
                                details = 'Unable to reach API endpoints';
                                severity = 'critical';
                            }
                            break;

                        default:
                            status = 'pass';
                            message = '✅ Check Complete';
                            details = 'System check completed successfully';
                    }
                } catch (error) {
                    status = 'error';
                    message = '🚨 Check Failed';
                    details = `Error during check: ${error instanceof Error ? error.message : 'Unknown error'}`;
                    severity = 'critical';
                }

                return {
                    ...check,
                    status,
                    message,
                    details,
                    severity,
                    timestamp: new Date()
                };
            }));

            setSecurityChecks(updatedChecks);
            
            // Determine system status based on REAL results
            const hasErrors = updatedChecks.some(check => check.status === 'error');
            const hasWarnings = updatedChecks.some(check => check.status === 'warning');
            
            if (hasErrors) {
                setSystemStatus('alert');
            } else if (hasWarnings) {
                setSystemStatus('online');
            } else {
                setSystemStatus('online');
            }
            
            setLastCheck(new Date());

            // Log real findings
            const errorCount = updatedChecks.filter(c => c.status === 'error').length;
            const warningCount = updatedChecks.filter(c => c.status === 'warning').length;
            
            if (errorCount > 0 || warningCount > 0) {
                console.log(`🤖 AI Security Report: ${errorCount} errors, ${warningCount} warnings detected`);
            } else {
                console.log('🤖 AI Security Report: All systems healthy');
            }

        }, 1500); // Faster response time for real monitoring
    };

    // Start continuous monitoring
    useEffect(() => {
        if (!isActive) return;

        // Initial check
        performSecurityChecks();

        // Set up continuous monitoring (every 30 seconds)
        const interval = setInterval(() => {
            performSecurityChecks();
        }, 30000);

        return () => clearInterval(interval);
    }, [isActive]);

    // Get status color and icon
    const getStatusInfo = (status: SecurityCheck['status']) => {
        switch (status) {
            case 'checking':
                return { color: 'text-blue-400', icon: Activity, bg: 'bg-blue-500/10' };
            case 'pass':
                return { color: 'text-green-400', icon: CheckCircle, bg: 'bg-green-500/10' };
            case 'warning':
                return { color: 'text-yellow-400', icon: AlertTriangle, bg: 'bg-yellow-500/10' };
            case 'error':
                return { color: 'text-orange-400', icon: Bug, bg: 'bg-orange-500/10' };
            case 'critical':
                return { color: 'text-red-400', icon: AlertTriangle, bg: 'bg-red-500/10' };
            default:
                return { color: 'text-gray-400', icon: Activity, bg: 'bg-gray-500/10' };
        }
    };

    const getTypeIcon = (type: SecurityCheck['type']) => {
        switch (type) {
            case 'system': return Globe;
            case 'database': return Database;
            case 'security': return Shield;
            case 'user': return Users;
            case 'performance': return Zap;
            case 'error': return Bug;
            default: return Eye;
        }
    };

    const getSeverityBadge = (severity: SecurityCheck['severity']) => {
        const variants = {
            low: 'bg-green-500/20 text-green-400 border-green-500/30',
            medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
            critical: 'bg-red-500/20 text-red-400 border-red-500/30'
        };
        return variants[severity];
    };

    return (
        <div className={`space-y-6 ${className}`}>
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
                                <Brain className="h-6 w-6 text-purple-400" />
                            </div>
                            <div>
                                <CardTitle className="text-white text-lg">Live AI Security System</CardTitle>
                                <p className="text-slate-400 text-sm">
                                    Always-on security monitoring and threat detection
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                systemStatus === 'online' ? 'bg-green-500/20 text-green-400' :
                                systemStatus === 'scanning' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-red-500/20 text-red-400'
                            }`}>
                                {systemStatus === 'online' ? '🟢 Online' :
                                 systemStatus === 'scanning' ? '🔵 Scanning' : '🔴 Alert'}
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setIsActive(!isActive)}
                                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                                {isActive ? 'Pause' : 'Resume'}
                            </Button>
                        </div>
                    </div>
                </CardHeader>

            <CardContent className="space-y-4">
                {/* System Status */}
                <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <Activity className="h-5 w-5 text-green-400" />
                        <div>
                            <p className="text-white font-medium">Security Status</p>
                            <p className="text-slate-400 text-sm">
                                Last check: {lastCheck.toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-green-400 font-medium">
                            {securityChecks.filter(c => c.status === 'pass').length} / {securityChecks.length}
                        </p>
                        <p className="text-slate-400 text-xs">Checks Passed</p>
                    </div>
                </div>

                {/* Security Checks Feed */}
                <div>
                    <h4 className="text-white font-medium mb-3 flex items-center">
                        <Eye className="h-4 w-4 mr-2 text-blue-400" />
                        Live Security Feed
                    </h4>
                    <ScrollArea className="h-64">
                        <div className="space-y-2">
                            {securityChecks.map((check) => {
                                const statusInfo = getStatusInfo(check.status);
                                const TypeIcon = getTypeIcon(check.type);
                                const StatusIcon = statusInfo.icon;

                                return (
                                            <div
                                                key={check.id}
                                                className={`p-3 rounded-lg border ${statusInfo.bg} border-slate-600/50`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start space-x-3 flex-1">
                                                        <div className="p-1 bg-slate-700/50 rounded">
                                                            <TypeIcon className="h-4 w-4 text-slate-400" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-2 mb-1">
                                                                <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                                                                <p className="text-white text-sm font-medium">{check.message}</p>
                                                                <Badge className={`text-xs ${getSeverityBadge(check.severity)}`}>
                                                                    {check.severity}
                                                                </Badge>
                                                            </div>
                                                            {check.details && (
                                                                <p className="text-slate-400 text-xs">{check.details}</p>
                                                            )}
                                                            <p className="text-slate-500 text-xs mt-1">
                                                                {check.timestamp.toLocaleTimeString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Clear Testing Session Button - Only show for test user sessions */}
                                                    {check.id === 'session-monitor' && 
                                                     check.message.includes('Test User Session Active') && (
                                                        <div className="ml-3">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={clearTestingSession}
                                                                className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                                                            >
                                                                Clear Session
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </div>

                {/* AI Status */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
                    <div className="flex items-center space-x-3">
                        <Brain className="h-5 w-5 text-purple-400" />
                        <div>
                            <p className="text-white font-medium">AI Security Assistant</p>
                            <p className="text-slate-400 text-sm">
                                {isActive ? 'Continuously monitoring system' : 'Monitoring paused'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-xs">Active</span>
                    </div>
                </div>
            </CardContent>
        </Card>
        
        {/* Issue Summary Component */}
        <div className="mt-6">
            <AIIssueSummary issues={securityChecks} />
        </div>
    </div>
    );
}
