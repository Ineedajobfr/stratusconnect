// AI Error Notification - Clickable Error Display
// Shows errors detected by the AI system in a small, clickable section
// ONLY VISIBLE TO ADMIN USERS

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { AlertTriangle, Bug, Eye, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AIError {
    id: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: Date;
    component?: string;
    details?: string;
}

interface AIErrorNotificationProps {
    className?: string;
}

export function AIErrorNotification({ className }: AIErrorNotificationProps) {
    const { user } = useAuth();
    const [errors, setErrors] = useState<AIError[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Only show for admin users
    const isAdmin = user?.email === 'stratuscharters@gmail.com' || user?.role === 'admin';

    useEffect(() => {
        // Check for errors every 5 seconds
        const checkErrors = () => {
            const errorCount = (window as any).__errorCount || 0;
            const recentErrors = (window as any).__recentErrors || [];
            
            if (errorCount > 0) {
                const newErrors: AIError[] = recentErrors.map((message: string, index: number) => ({
                    id: `error_${Date.now()}_${index}`,
                    message,
                    severity: message.toLowerCase().includes('critical') ? 'critical' : 
                              message.toLowerCase().includes('failed') ? 'high' : 'medium',
                    timestamp: new Date(),
                    component: 'System',
                    details: `Detected by AI Security System at ${new Date().toLocaleTimeString()}`
                }));
                
                setErrors(newErrors);
                setIsVisible(true);
            } else {
                setErrors([]);
                setIsVisible(false);
            }
        };

        // Initial check
        checkErrors();
        
        // Check every 5 seconds
        const interval = setInterval(checkErrors, 5000);
        
        return () => clearInterval(interval);
    }, []);

    const getSeverityColor = (severity: AIError['severity']) => {
        switch (severity) {
            case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getSeverityIcon = (severity: AIError['severity']) => {
        switch (severity) {
            case 'critical': return <Bug className="h-4 w-4" />;
            case 'high': return <AlertTriangle className="h-4 w-4" />;
            case 'medium': return <Eye className="h-4 w-4" />;
            case 'low': return <Eye className="h-4 w-4" />;
            default: return <Eye className="h-4 w-4" />;
        }
    };

    const handleErrorClick = (error: AIError) => {
        // Generate issue summary based on error type
        let issueSummary = '';
        let solution = '';
        
        if (error.message.toLowerCase().includes('test user')) {
            issueSummary = 'Test user impersonation is active - this is normal during testing but should be monitored';
            solution = 'Complete testing and clear test session when done';
        } else if (error.message.toLowerCase().includes('database')) {
            issueSummary = 'Database connectivity or performance issue detected';
            solution = 'Check database status, optimize queries, or scale resources';
        } else if (error.message.toLowerCase().includes('memory')) {
            issueSummary = 'High memory usage detected - may cause performance issues';
            solution = 'Check for memory leaks, optimize data handling, clear unused objects';
        } else if (error.message.toLowerCase().includes('api')) {
            issueSummary = 'API connection or response issue detected';
            solution = 'Check network connectivity, verify API status, review configuration';
        } else {
            issueSummary = 'System error detected - requires investigation';
            solution = 'Review console errors, check logs, verify system status';
        }

        // Show detailed error information with summary
        toast({
            title: "🤖 AI Detected Issue",
            description: `${error.message}\n\n🔍 Issue: ${issueSummary}\n✅ Solution: ${solution}`,
            variant: error.severity === 'critical' ? 'destructive' : 'default',
            duration: 15000,
        });

        // Log error details for debugging
        console.log('🤖 AI Error Details:', {
            message: error.message,
            severity: error.severity,
            component: error.component,
            timestamp: error.timestamp,
            details: error.details,
            issueSummary,
            solution
        });
    };

    const handleDismiss = () => {
        setIsVisible(false);
        // Clear tracked errors
        if ((window as any).__errorTracker) {
            (window as any).__errorTracker.clearErrors();
        }
    };

    // Only show for admin users
    if (!isAdmin) {
        return null;
    }

    if (!isVisible || errors.length === 0) {
        return null;
    }

    return (
        <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
            <Card className="bg-slate-800/95 border-slate-600 shadow-lg backdrop-blur-sm">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                            <div className="p-1 bg-red-500/20 rounded">
                                <Bug className="h-4 w-4 text-red-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-medium text-sm">🤖 AI Security Alert</h4>
                                <p className="text-slate-400 text-xs">
                                    {errors.length} error{errors.length !== 1 ? 's' : ''} detected
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-1">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                            >
                                <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleDismiss}
                                className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    {isExpanded && (
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {errors.slice(0, 5).map((error) => (
                                <div
                                    key={error.id}
                                    className={`p-2 rounded border cursor-pointer transition-colors hover:bg-slate-700/50 ${getSeverityColor(error.severity)}`}
                                    onClick={() => handleErrorClick(error)}
                                >
                                    <div className="flex items-start space-x-2">
                                        {getSeverityIcon(error.severity)}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium truncate">
                                                {error.message}
                                            </p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <Badge 
                                                    className={`text-xs ${getSeverityColor(error.severity)}`}
                                                >
                                                    {error.severity}
                                                </Badge>
                                                <span className="text-xs text-slate-500">
                                                    {error.timestamp.toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {errors.length > 5 && (
                                <p className="text-xs text-slate-400 text-center">
                                    ...and {errors.length - 5} more errors
                                </p>
                            )}
                        </div>
                    )}

                    {!isExpanded && (
                        <div 
                            className="cursor-pointer"
                            onClick={() => setIsExpanded(true)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Badge className={`text-xs ${getSeverityColor(errors[0].severity)}`}>
                                        {errors[0].severity}
                                    </Badge>
                                    <span className="text-xs text-slate-400 truncate">
                                        {errors[0].message}
                                    </span>
                                </div>
                                <div className="text-xs text-slate-500">
                                    Click to view
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
