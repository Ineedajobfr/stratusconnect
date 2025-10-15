// AI Issue Summary - Provides detailed explanations for detected issues
// Shows why things have issues and what to do about them

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Bug, CheckCircle, Info, Lightbulb, Shield, X } from 'lucide-react';
import { useState } from 'react';

interface IssueSummary {
    id: string;
    title: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    issue: string;
    cause: string;
    impact: string;
    solution: string;
    prevention: string;
    category: 'security' | 'performance' | 'database' | 'user' | 'system';
}

interface AIIssueSummaryProps {
    issues: any[];
    className?: string;
}

export function AIIssueSummary({ issues, className }: AIIssueSummaryProps) {
    const [expandedIssue, setExpandedIssue] = useState<string | null>(null);

    // Generate issue summaries based on detected problems
    const generateIssueSummaries = (detectedIssues: any[]): IssueSummary[] => {
        const summaries: IssueSummary[] = [];

        detectedIssues.forEach((issue, index) => {
            if (issue.status === 'warning' || issue.status === 'error') {
                let summary: IssueSummary;

                switch (issue.id) {
                    case 'session-monitor':
                        if (issue.message.includes('Test User Session Active')) {
                            summary = {
                                id: 'test-user-session',
                                title: 'Test User Impersonation Active',
                                severity: 'medium',
                                issue: 'A test user session is currently active in the system',
                                cause: 'Admin console test user impersonation feature is being used for testing purposes',
                                impact: 'Normal operation - this is expected during testing but should be monitored for security',
                                solution: 'Complete testing session and clear test user data when done',
                                prevention: 'Always clear test sessions after testing, monitor for unauthorized impersonation',
                                category: 'security'
                            };
                        }
                        break;

                    case 'database-health':
                        if (issue.message.includes('Slow Response')) {
                            summary = {
                                id: 'database-slow',
                                title: 'Database Performance Issue',
                                severity: 'high',
                                issue: 'Database response times are slower than optimal',
                                cause: 'High load, network latency, or inefficient queries',
                                impact: 'Users may experience slower page loads and degraded performance',
                                solution: 'Check database load, optimize queries, consider scaling resources',
                                prevention: 'Monitor database performance regularly, implement query optimization',
                                category: 'database'
                            };
                        }
                        break;

                    case 'performance-monitor':
                        if (issue.message.includes('High Memory Usage')) {
                            summary = {
                                id: 'memory-usage',
                                title: 'High Memory Consumption',
                                severity: 'medium',
                                issue: 'Application memory usage is above normal levels',
                                cause: 'Memory leaks, large data sets, or inefficient memory management',
                                impact: 'Browser performance degradation, potential crashes on low-memory devices',
                                solution: 'Identify and fix memory leaks, optimize data handling, clear unused objects',
                                prevention: 'Implement proper cleanup, monitor memory usage, use efficient data structures',
                                category: 'performance'
                            };
                        }
                        break;

                    case 'error-detection':
                        if (issue.message.includes('Errors Detected')) {
                            summary = {
                                id: 'system-errors',
                                title: 'System Errors Detected',
                                severity: 'critical',
                                issue: 'JavaScript errors are occurring in the application',
                                cause: 'Code bugs, missing dependencies, or API failures',
                                impact: 'Features may not work correctly, poor user experience',
                                solution: 'Review console errors, fix code issues, update dependencies',
                                prevention: 'Implement proper error handling, test thoroughly, use TypeScript',
                                category: 'system'
                            };
                        }
                        break;

                    case 'api-health':
                        if (issue.message.includes('Connection Failed')) {
                            summary = {
                                id: 'api-failure',
                                title: 'API Connection Issues',
                                severity: 'critical',
                                issue: 'Unable to connect to external APIs or services',
                                cause: 'Network issues, API downtime, or configuration problems',
                                impact: 'Features depending on external services will not work',
                                solution: 'Check network connectivity, verify API status, review configuration',
                                prevention: 'Implement API health checks, use fallback mechanisms, monitor uptime',
                                category: 'system'
                            };
                        }
                        break;

                    default:
                        return;
                }

                if (summary) {
                    summaries.push(summary);
                }
            }
        });

        return summaries;
    };

    const issueSummaries = generateIssueSummaries(issues);

    if (issueSummaries.length === 0) {
        return (
            <Card className={`bg-green-500/10 border-green-500/30 ${className}`}>
                <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                            <h4 className="text-green-400 font-medium">All Systems Healthy</h4>
                            <p className="text-green-300/80 text-sm">
                                No issues detected - all security checks are passing
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const getSeverityColor = (severity: IssueSummary['severity']) => {
        switch (severity) {
            case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getCategoryIcon = (category: IssueSummary['category']) => {
        switch (category) {
            case 'security': return <Shield className="h-4 w-4" />;
            case 'performance': return <Bug className="h-4 w-4" />;
            case 'database': return <Info className="h-4 w-4" />;
            case 'user': return <Info className="h-4 w-4" />;
            case 'system': return <AlertTriangle className="h-4 w-4" />;
            default: return <Info className="h-4 w-4" />;
        }
    };

    return (
        <Card className={`bg-slate-800/50 border-slate-700 ${className}`}>
            <CardHeader className="pb-4">
                <CardTitle className="text-white text-lg flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-400" />
                    Issue Analysis & Solutions
                </CardTitle>
                <p className="text-slate-400 text-sm">
                    AI-powered analysis of detected issues with actionable solutions
                </p>
            </CardHeader>

            <CardContent className="space-y-4">
                {issueSummaries.map((summary) => (
                    <Card 
                        key={summary.id} 
                        className={`border ${getSeverityColor(summary.severity)} cursor-pointer transition-all duration-200 hover:shadow-lg`}
                        onClick={() => setExpandedIssue(expandedIssue === summary.id ? null : summary.id)}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3 flex-1">
                                    <div className="p-2 bg-slate-700/50 rounded">
                                        {getCategoryIcon(summary.category)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <h4 className="text-white font-medium">{summary.title}</h4>
                                            <Badge className={`text-xs ${getSeverityColor(summary.severity)}`}>
                                                {summary.severity}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                                {summary.category}
                                            </Badge>
                                        </div>
                                        
                                        <p className="text-slate-300 text-sm mb-2">{summary.issue}</p>
                                        
                                        {expandedIssue === summary.id && (
                                            <div className="space-y-3 mt-3 pt-3 border-t border-slate-600">
                                                <div>
                                                    <h5 className="text-yellow-400 font-medium text-sm mb-1">🔍 Root Cause:</h5>
                                                    <p className="text-slate-400 text-sm">{summary.cause}</p>
                                                </div>
                                                
                                                <div>
                                                    <h5 className="text-orange-400 font-medium text-sm mb-1">⚠️ Impact:</h5>
                                                    <p className="text-slate-400 text-sm">{summary.impact}</p>
                                                </div>
                                                
                                                <div>
                                                    <h5 className="text-green-400 font-medium text-sm mb-1">✅ Solution:</h5>
                                                    <p className="text-slate-400 text-sm">{summary.solution}</p>
                                                </div>
                                                
                                                <div>
                                                    <h5 className="text-blue-400 font-medium text-sm mb-1">🛡️ Prevention:</h5>
                                                    <p className="text-slate-400 text-sm">{summary.prevention}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="ml-2">
                                    {expandedIssue === summary.id ? (
                                        <X className="h-4 w-4 text-slate-400" />
                                    ) : (
                                        <Info className="h-4 w-4 text-slate-400" />
                                    )}
                                </div>
                            </div>
                            
                            {expandedIssue !== summary.id && (
                                <p className="text-slate-500 text-xs mt-2">
                                    Click to view detailed analysis and solutions
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
                
                {issueSummaries.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <div className="flex items-start space-x-2">
                            <Lightbulb className="h-4 w-4 text-blue-400 mt-0.5" />
                            <div>
                                <h5 className="text-blue-400 font-medium text-sm">💡 AI Recommendation</h5>
                                <p className="text-blue-300/80 text-xs mt-1">
                                    Monitor these issues regularly. The AI system will automatically detect when they're resolved.
                                    All issues are categorized by severity and include actionable solutions.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
