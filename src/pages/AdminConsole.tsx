// Enhanced Admin Console - Clean & Functional
// Simplified admin dashboard with working components

import { AIChat } from '@/components/Admin/AIChat';
import { LiveAISecuritySystem } from '@/components/Admin/LiveAISecuritySystem';
import { PlatformOverview } from '@/components/Admin/PlatformOverview';
import { SecurityMonitoring } from '@/components/Admin/SecurityMonitoring';
import { TransactionManagement } from '@/components/Admin/TransactionManagement';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
    Bot,
    Brain,
    Briefcase,
    Building2,
    CheckCircle,
    ChevronLeft,
    DollarSign,
    Lock,
    Plane,
    RefreshCw,
    Search,
    Shield,
    Target,
    UserCheck,
    Users,
    UserX
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface User {
    id: string;
    email: string;
    role: string;
    created_at: string;
    verification_status: string;
    last_sign_in_at?: string;
    profile?: {
        first_name?: string;
        last_name?: string;
        company?: string;
    };
}

interface SecurityEvent {
    id: string;
    event_type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    user_id?: string;
    ip_address?: string;
    created_at: string;
    resolved: boolean;
}

interface Transaction {
    id: string;
    amount: number;
    type: string;
    status: string;
    user_id: string;
    created_at: string;
    description?: string;
}

// Test Users Section Component
function TestUsersSection() {
    const navigate = useNavigate();
    
    const testUsers = [
        {
            role: 'broker',
            email: 'broker@test.com',
            name: 'Alex Broker',
            icon: Building2,
            description: 'Elite Aviation Brokers',
            color: 'from-blue-600 to-blue-800'
        },
        {
            role: 'operator', 
            email: 'operator@test.com',
            name: 'Sarah Operator',
            icon: Plane,
            description: 'SkyHigh Operations',
            color: 'from-green-600 to-green-800'
        },
        {
            role: 'pilot',
            email: 'pilot@test.com', 
            name: 'Mike Pilot',
            icon: Users,
            description: 'ATP License, 8,500 hours',
            color: 'from-purple-600 to-purple-800'
        },
        {
            role: 'crew',
            email: 'crew@test.com',
            name: 'Emma Crew', 
            icon: Briefcase,
            description: 'Senior Cabin Crew',
            color: 'from-orange-600 to-orange-800'
        }
    ];

    const handleImpersonateUser = async (user: typeof testUsers[0]) => {
        try {
            console.log(`🚀 Impersonating test user: ${user.email} (${user.role})`);
            
            // Create a mock user object for testing with real terminal access
            // Generate a proper UUID for test users
            const generateTestUUID = () => {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    const r = Math.random() * 16 | 0;
                    const v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            };

            const mockUser = {
                id: generateTestUUID(), // Use proper UUID format
                email: user.email,
                role: user.role,
                fullName: user.name,
                verification_status: 'approved' as const,
                company_name: user.role === 'broker' ? 'Elite Aviation Brokers' : 
                              user.role === 'operator' ? 'SkyHigh Operations' : undefined,
                license_number: `LIC-${user.role.toUpperCase()}-001`,
                years_experience: user.role === 'pilot' ? 15 : user.role === 'crew' ? 6 : 8,
                isTestUser: true
            };

            // Store in localStorage for the auth context to pick up
            localStorage.setItem('test_user', JSON.stringify(mockUser));
            localStorage.setItem('test_user_active', 'true');
            
            console.log(`✅ Test user session created for ${user.email}`);
            
            // Navigate to appropriate terminal with a small delay to ensure auth context loads
            setTimeout(() => {
                switch (user.role) {
                    case 'broker':
                        console.log('🧳 Navigating to Broker Terminal');
                        navigate('/broker-terminal');
                        break;
                    case 'operator':
                        console.log('🏢 Navigating to Operator Terminal');
                        navigate('/operator-terminal');
                        break;
                    case 'pilot':
                        console.log('✈️ Navigating to Pilot Terminal');
                        navigate('/pilot-terminal');
                        break;
                    case 'crew':
                        console.log('👥 Navigating to Crew Terminal');
                        navigate('/crew-terminal');
                        break;
                    default:
                        console.log('🏠 Navigating to Home');
                        navigate('/');
                }
            }, 100);
            
            toast({
                title: "Test User Active",
                description: `Now impersonating ${user.name} (${user.role}) - Real terminal access enabled`,
            });
        } catch (error) {
            console.error('Impersonation error:', error);
            toast({
                title: "Error",
                description: "Failed to impersonate test user",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Test User Impersonation</h2>
                <p className="text-slate-300">
                    Click on any test user below to impersonate them and test the real terminals with clean data.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testUsers.map((user) => {
                    const IconComponent = user.icon;
                    return (
                        <Card 
                            key={user.role}
                            className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-slate-600 transition-all duration-300 cursor-pointer group"
                            onClick={() => handleImpersonateUser(user)}
                        >
                            <CardHeader className="pb-4">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-full bg-gradient-to-r ${user.color} border border-white/20`}>
                                        <IconComponent className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl text-white group-hover:text-orange-400 transition-colors">
                                            {user.name}
                                        </CardTitle>
                                        <p className="text-slate-400 text-sm capitalize font-medium">
                                            {user.role} Terminal
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-300 text-sm mb-4">{user.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">
                                        {user.email}
                                    </span>
                                    <span className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded border border-green-500/30">
                                        Verified
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="space-y-4">
                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <Bot className="h-5 w-5 text-orange-400 mt-0.5" />
                        <div>
                            <h4 className="text-white font-medium mb-1">Clean Terminal Experience</h4>
                            <p className="text-slate-300 text-sm">
                                These test users will access the real terminals with no dummy data. 
                                You can create real requests, post aircraft, apply for jobs, and test 
                                the complete workflow between different user types.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
                        <div>
                            <h4 className="text-blue-400 font-medium mb-2">Alternative: Direct Login</h4>
                            <p className="text-slate-300 text-sm mb-3">
                                You can also login directly with these test accounts (after running the SQL script):
                            </p>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="bg-slate-800/50 rounded px-3 py-2">
                                    <div className="text-blue-400 font-medium">Broker</div>
                                    <div className="text-slate-400">broker@test.com</div>
                                    <div className="text-slate-500">TestBroker123!</div>
                                </div>
                                <div className="bg-slate-800/50 rounded px-3 py-2">
                                    <div className="text-green-400 font-medium">Operator</div>
                                    <div className="text-slate-400">operator@test.com</div>
                                    <div className="text-slate-500">TestOperator123!</div>
                                </div>
                                <div className="bg-slate-800/50 rounded px-3 py-2">
                                    <div className="text-purple-400 font-medium">Pilot</div>
                                    <div className="text-slate-400">pilot@test.com</div>
                                    <div className="text-slate-500">TestPilot123!</div>
                                </div>
                                <div className="bg-slate-800/50 rounded px-3 py-2">
                                    <div className="text-orange-400 font-medium">Crew</div>
                                    <div className="text-slate-400">crew@test.com</div>
                                    <div className="text-slate-500">TestCrew123!</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                        <div>
                            <h4 className="text-green-400 font-medium mb-1">Database Setup Required</h4>
                            <p className="text-slate-300 text-sm">
                                Run <code className="bg-slate-800 px-2 py-0.5 rounded text-green-400">create_real_test_users.sql</code> in 
                                Supabase SQL Editor to create these users in the database. 
                                See <code className="bg-slate-800 px-2 py-0.5 rounded text-green-400">TEST_USERS_GUIDE.md</code> for details.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminConsole() {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [verificationFilter, setVerificationFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('platform');

    // Load all data
    const loadAllData = async () => {
        setLoading(true);
        setErrors([]);

        try {
            await Promise.all([
                loadUsers(),
                loadSecurityEvents(),
                loadTransactions()
            ]);
        } catch (error) {
            console.error('Error loading admin data:', error);
            setErrors(['Failed to load some data. Please refresh the page.']);
        } finally {
            setLoading(false);
        }
    };

    // Load users
    const loadUsers = async () => {
        try {
            console.log('🔍 Starting user load...');
            
            // Try profiles table first
            const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select(`
                    id,
                    email,
                    role,
                    created_at,
                    verification_status,
                    last_sign_in_at,
                    first_name,
                    last_name,
                    company
                `)
                .order('created_at', { ascending: false });

            console.log('📊 Profiles query result:', { data: profilesData, error: profilesError });

            if (profilesError) {
                console.error('❌ Profiles error:', profilesError);
                
                // If profiles fails, try users table
                console.log('🔄 Trying users table...');
                const { data: usersData, error: usersError } = await supabase
                    .from('users')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                console.log('📊 Users query result:', { data: usersData, error: usersError });
                
                if (usersError) {
                    console.error('❌ Users error:', usersError);
                    throw usersError;
                }
                
                // Transform users data to match expected format
                const transformedUsers = (usersData || []).map((user: any) => ({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    created_at: user.created_at,
                    verification_status: user.status || user.verification_status || 'pending',
                    last_sign_in_at: user.last_login,
                    profile: {
                        first_name: user.full_name?.split(' ')[0],
                        last_name: user.full_name?.split(' ')[1],
                        company: user.company_name
                    }
                })) as User[];
                
                console.log('✅ Transformed users:', transformedUsers);
                setUsers(transformedUsers);
            } else {
                console.log('✅ Profiles loaded successfully:', profilesData?.length, 'users');
                setUsers((profilesData as any) || []);
            }
        } catch (error: any) {
            console.error('💥 Fatal error loading users:', error);
            console.error('Error details:', {
                message: error.message,
                hint: error.hint,
                details: error.details,
                code: error.code
            });
            setErrors(prev => [...prev, `Failed to load users: ${error.message}`]);
        }
    };

    // Load security events
    const loadSecurityEvents = async () => {
        try {
            const { data, error } = await supabase
                .from('security_events')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) {
                console.log('⚠️ Security events table not available:', error);
                return;
            }

            // Transform data to match expected type
            const transformedEvents = (data || []).map((event: any) => ({
                id: event.id,
                event_type: event.event_type,
                severity: (event.severity || 'low') as 'low' | 'medium' | 'high' | 'critical',
                description: event.description,
                user_id: event.user_id,
                ip_address: event.ip_hash || event.ip_address,
                created_at: event.created_at,
                resolved: event.resolved || false
            }));

            setSecurityEvents(transformedEvents);
        } catch (error) {
            console.error('Error loading security events:', error);
            // Don't add to errors since this table might not exist yet
        }
    };

    // Load transactions
    const loadTransactions = async () => {
        try {
            // For now, just set empty array since transactions table might not exist
            setTransactions([]);
            console.log('⚠️ Transactions table skipped - implement when table is ready');
        } catch (error) {
            console.error('Error loading transactions:', error);
            // Don't add to errors since this table might not exist yet
        }
    };

    // Filter users
    const filterUsers = () => {
        return users.filter(user => {
            const matchesSearch = 
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.profile?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.profile?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.profile?.company?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            const matchesVerification = verificationFilter === 'all' || user.verification_status === verificationFilter;

            return matchesSearch && matchesRole && matchesVerification;
        });
    };

    // Approve user
    const approveUser = async (userId: string) => {
        try {
            // @ts-ignore - Supabase type instantiation issue
            const { error } = await supabase
                .from('users')
                .update({ 
                    status: 'active',
                    verification_status: 'approved',
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (error) throw error;

            toast({
                title: "User Approved",
                description: "User verification has been approved.",
            });

            loadUsers();
        } catch (error: any) {
            console.error('Error approving user:', error);
            toast({
                title: "Error",
                description: `Failed to approve user: ${error.message}`,
                variant: "destructive",
            });
        }
    };

    // Reject user
    const rejectUser = async (userId: string) => {
        try {
            // @ts-ignore - Supabase type instantiation issue
            const { error } = await supabase
                .from('users')
                .update({ 
                    status: 'rejected',
                    verification_status: 'rejected',
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (error) throw error;

            toast({
                title: "User Rejected",
                description: "User verification has been rejected.",
            });

            loadUsers();
        } catch (error: any) {
            console.error('Error rejecting user:', error);
            toast({
                title: "Error",
                description: `Failed to reject user: ${error.message}`,
                variant: "destructive",
            });
        }
    };

    // Suspend user
    const suspendUser = async (userId: string) => {
        try {
            // @ts-ignore - Supabase type instantiation issue
            const { error } = await supabase
                .from('users')
                .update({ 
                    status: 'suspended',
                    verification_status: 'suspended',
                    is_active: false,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (error) throw error;

            toast({
                title: "User Suspended",
                description: "User has been suspended.",
            });

            loadUsers();
        } catch (error: any) {
            console.error('Error suspending user:', error);
            toast({
                title: "Error",
                description: `Failed to suspend user: ${error.message}`,
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        // Check for admin session (either from auth or localStorage)
        const checkAdminAccess = () => {
            // Check if user is admin from auth context
            if (user?.role === 'admin') {
                loadAllData();
                return;
            }
            
            // Check for admin session in localStorage
            const adminSession = localStorage.getItem('admin_session');
            if (adminSession) {
                try {
                    const adminUser = JSON.parse(adminSession);
                    if (adminUser.role === 'admin') {
                        console.log('Using admin session from localStorage:', adminUser);
                        loadAllData();
                        return;
                    }
                } catch (e) {
                    console.error('Error parsing admin session:', e);
                }
            }
        };
        
        checkAdminAccess();
    }, [user]);

    // Check for admin access (secure auth, user context, localStorage, or specific admin email)
    const isAdmin = localStorage.getItem('secure_admin_auth') === 'true' ||
                   user?.role === 'admin' || 
                   user?.email?.toLowerCase() === 'stratuscharters@gmail.com' ||
                   (() => {
                       const adminSession = localStorage.getItem('admin_session');
                       if (adminSession) {
                           try {
                               const adminUser = JSON.parse(adminSession);
                               return adminUser.role === 'admin' && 
                                      adminUser.email?.toLowerCase() === 'stratuscharters@gmail.com' &&
                                      adminUser.isSecureAuth === true;
                           } catch {
                               return false;
                           }
                       }
                       return false;
                   })();

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6">
                        <div className="text-center">
                            <Shield className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                            <p className="text-slate-400 mb-4">
                                You need admin privileges to access this page.
                            </p>
                            <Link to="/home">
                                <Button variant="outline">Go Back</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="h-8 w-8 text-orange-500 animate-spin mx-auto mb-4" />
                    <p className="text-white">Loading admin console...</p>
                </div>
            </div>
        );
    }

    const filteredUsers = filterUsers();
    const pendingVerifications = users.filter(u => u.verification_status === 'pending_verification').length;
    const totalUsers = users.length;
    const totalTransactions = transactions.length;
    const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link to="/home" className="flex items-center text-slate-400 hover:text-white transition-colors">
                                <ChevronLeft className="h-5 w-5 mr-1" />
                                Back
                            </Link>
                            <div className="flex items-center space-x-2">
                                <Shield className="h-8 w-8 text-orange-500" />
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Enhanced Admin Console</h1>
                                    <p className="text-sm text-slate-400">Complete system monitoring, verification, and management</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <Bot className="h-5 w-5 text-green-500" />
                                <span className="text-sm text-green-500 font-medium">AI Monitoring</span>
                            </div>
                            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                                Disable AI
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    {/* Tab Navigation */}
                    <div className="space-y-4">
                        <TabsList className="grid w-full grid-cols-7 bg-slate-800/50 border-slate-600 rounded-lg p-1">
                            <TabsTrigger value="platform" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-slate-300 hover:text-white transition-colors">
                                <Target className="h-4 w-4 mr-2" />
                                Platform
                            </TabsTrigger>
                            <TabsTrigger value="ai-assistant" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-slate-300 hover:text-white transition-colors">
                                <Brain className="h-4 w-4 mr-2" />
                                AI Assistant
                            </TabsTrigger>
                            <TabsTrigger value="revenue" className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-slate-300 hover:text-white transition-colors">
                                <DollarSign className="h-4 w-4 mr-2" />
                                $ Revenue
                            </TabsTrigger>
                            <TabsTrigger value="users" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-300 hover:text-white transition-colors">
                                <Users className="h-4 w-4 mr-2" />
                                Users
                            </TabsTrigger>
                            <TabsTrigger value="verification" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white text-slate-300 hover:text-white transition-colors">
                                <UserCheck className="h-4 w-4 mr-2" />
                                Verification
                            </TabsTrigger>
                            <TabsTrigger value="test-users" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-slate-300 hover:text-white transition-colors">
                                <Bot className="h-4 w-4 mr-2" />
                                Test Users
                            </TabsTrigger>
                            <TabsTrigger value="ai-security" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-slate-300 hover:text-white transition-colors">
                                <Brain className="h-4 w-4 mr-2" />
                                AI Security
                            </TabsTrigger>
                        </TabsList>
                        
                        {/* Active Tab Indicator */}
                        {activeTab === 'ai-security' && (
                            <div className="flex items-center space-x-2 text-slate-400">
                                <Shield className="h-4 w-4" />
                                <span className="text-sm">Security</span>
                            </div>
                        )}
                    </div>

                    {/* Platform Tab */}
                    <TabsContent value="platform" className="space-y-6">
                        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-lg">
                            <PlatformOverview />
                        </div>
                    </TabsContent>

                    {/* AI Assistant Tab */}
                    <TabsContent value="ai-assistant" className="space-y-6">
                        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-lg h-[800px]">
                            <AIChat />
                        </div>
                    </TabsContent>

                    {/* Revenue Tab */}
                    <TabsContent value="revenue" className="space-y-6">
                        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-lg">
                            <TransactionManagement />
                        </div>
                    </TabsContent>

                    {/* Users Tab */}
                    <TabsContent value="users" className="space-y-6">
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center justify-between">
                                    <span className="flex items-center">
                                        <Users className="h-5 w-5 mr-2" />
                                        User Management ({totalUsers} total)
                                    </span>
                                    <Button onClick={loadUsers} size="sm" variant="outline">
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Refresh
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Search and Filters */}
                                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                            <Input
                                                placeholder="Search users by email, name, or company..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 bg-slate-700 border-slate-600 text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Users Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-600">
                                                <th className="text-left py-3 px-4 text-slate-300">User</th>
                                                <th className="text-left py-3 px-4 text-slate-300">Role</th>
                                                <th className="text-left py-3 px-4 text-slate-300">Status</th>
                                                <th className="text-left py-3 px-4 text-slate-300">Joined</th>
                                                <th className="text-left py-3 px-4 text-slate-300">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map((user) => (
                                                <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                                                    <td className="py-4 px-4">
                                                        <div>
                                                            <div className="text-white font-medium">
                                                                {user.profile?.first_name} {user.profile?.last_name}
                                                            </div>
                                                            <div className="text-slate-400 text-sm">{user.email}</div>
                                                            {user.profile?.company && (
                                                                <div className="text-slate-500 text-xs">{user.profile.company}</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <Badge variant="outline" className="capitalize">
                                                            {user.role}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <Badge 
                                                            variant={user.verification_status === 'approved' ? 'default' : 
                                                                   user.verification_status === 'pending' ? 'secondary' : 'destructive'}
                                                        >
                                                            {user.verification_status}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-4 px-4 text-slate-400">
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex space-x-2">
                                                            {user.verification_status === 'pending' && (
                                                                <>
                                                                    <Button size="sm" onClick={() => approveUser(user.id)}>
                                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                                        Approve
                                                                    </Button>
                                                                    <Button size="sm" variant="destructive" onClick={() => rejectUser(user.id)}>
                                                                        <UserX className="h-4 w-4 mr-1" />
                                                                        Reject
                                                                    </Button>
                                                                </>
                                                            )}
                                                            <Button size="sm" variant="outline" onClick={() => suspendUser(user.id)}>
                                                                <Lock className="h-4 w-4 mr-1" />
                                                                Suspend
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {filteredUsers.length === 0 && (
                                    <div className="text-center py-8">
                                        <Users className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                                        <p className="text-slate-400">No users found matching your criteria.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Verification Tab */}
                    <TabsContent value="verification" className="space-y-6">
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center">
                                    <UserCheck className="h-5 w-5 mr-2" />
                                    Verification Queue ({pendingVerifications} pending)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-slate-700/50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-white">{pendingVerifications}</div>
                                        <div className="text-slate-400">Pending Verification</div>
                                    </div>
                                    <div className="bg-slate-700/50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-white">{users.filter(u => u.verification_status === 'approved').length}</div>
                                        <div className="text-slate-400">Approved Users</div>
                                    </div>
                                    <div className="bg-slate-700/50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-white">{users.filter(u => u.verification_status === 'rejected').length}</div>
                                        <div className="text-slate-400">Rejected Users</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {users.filter(u => u.verification_status === 'pending_verification').map((user) => (
                                        <div key={user.id} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-white font-medium">
                                                        {user.profile?.first_name} {user.profile?.last_name}
                                                    </div>
                                                    <div className="text-slate-400 text-sm">{user.email}</div>
                                                    <div className="text-slate-500 text-xs">
                                                        Role: {user.role} • Joined: {new Date(user.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Button 
                                                        size="sm" 
                                                        onClick={() => approveUser(user.id)}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                        Approve
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        variant="destructive" 
                                                        onClick={() => rejectUser(user.id)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        <UserX className="h-4 w-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {pendingVerifications === 0 && (
                                    <div className="text-center py-8">
                                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                        <p className="text-slate-400">All users are verified! 🎉</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="test-users" className="space-y-6">
                        <div className="bg-slate-800/50 border-slate-700 rounded-lg p-6">
                            <TestUsersSection />
                        </div>
                    </TabsContent>

                    <TabsContent value="ai-security" className="space-y-6">
                        <div className="space-y-6">
                            <LiveAISecuritySystem />
                        </div>
                    </TabsContent>

                    <TabsContent value="security" className="space-y-6">
                        <div className="bg-slate-800/50 border-slate-700 rounded-lg p-6">
                            <SecurityMonitoring />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}