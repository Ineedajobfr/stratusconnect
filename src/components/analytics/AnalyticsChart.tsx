import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, TrendingDown, DollarSign, Users, Plane, Clock } from "lucide-react";

interface AnalyticsData {
  requests: Record<string, unknown>[];
  quotes: Record<string, unknown>[];
  bookings: Record<string, unknown>[];
  revenue: Record<string, unknown>[];
  performance: Record<string, unknown>[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const AnalyticsChart: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData>({
    requests: [],
    quotes: [],
    bookings: [],
    revenue: [],
    performance: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [kpis, setKpis] = useState({
    totalRequests: 0,
    totalQuotes: 0,
    totalBookings: 0,
    totalRevenue: 0,
    winRate: 0,
    avgResponseTime: 0
  });

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Use mock data instead of database queries
      const mockRequests = Array.from({length: 30}, (_, i) => ({
        date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        count: Math.floor(Math.random() * 10) + 1,
        name: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      })).reverse();

      const mockQuotes = Array.from({length: 30}, (_, i) => ({
        date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        count: Math.floor(Math.random() * 8) + 1,
        accepted: Math.floor(Math.random() * 3) + 1,
        name: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      })).reverse();

      const mockBookings = Array.from({length: 30}, (_, i) => ({
        date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        count: Math.floor(Math.random() * 5) + 1,
        revenue: Math.floor(Math.random() * 50000) + 10000,
        name: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      })).reverse();

      const mockRevenue = Array.from({length: 30}, (_, i) => ({
        date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 75000) + 25000,
        name: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      })).reverse();

      const mockPerformance = [
        { name: 'On-Time Performance', value: 95, color: '#00C49F' },
        { name: 'Customer Satisfaction', value: 4.8, color: '#0088FE' },
        { name: 'Response Time (hrs)', value: 2.3, color: '#FFBB28' },
        { name: 'Fleet Utilization', value: 78, color: '#FF8042' }
      ];

      setData({
        requests: mockRequests,
        quotes: mockQuotes,
        bookings: mockBookings,
        revenue: mockRevenue,
        performance: mockPerformance
      });

      // Calculate KPIs
      const totalRequests = mockRequests.reduce((sum, item) => sum + item.count, 0);
      const totalQuotes = mockQuotes.reduce((sum, item) => sum + item.count, 0);
      const totalBookings = mockBookings.reduce((sum, item) => sum + item.count, 0);
      const totalRevenue = mockRevenue.reduce((sum, item) => sum + item.revenue, 0);
      const winRate = totalQuotes > 0 ? (totalBookings / totalQuotes) * 100 : 0;
      const avgResponseTime = 2.3;

      setKpis({
        totalRequests,
        totalQuotes,
        totalBookings,
        totalRevenue,
        winRate,
        avgResponseTime
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // All data fetching now happens in fetchAnalytics with mock data

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requests</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quotes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalQuotes}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +8% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +15% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +22% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.winRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +3% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.avgResponseTime}h</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 inline mr-1" />
              -0.5h from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Analytics</h3>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Requests & Bookings</CardTitle>
                <CardDescription>Daily activity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.requests}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Daily revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.revenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
                    <Bar dataKey="revenue" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Request Volume</CardTitle>
              <CardDescription>Number of requests received over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.requests}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quote Activity</CardTitle>
              <CardDescription>Quotes submitted and accepted over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.quotes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0088FE" name="Total Quotes" />
                  <Bar dataKey="accepted" fill="#00C49F" name="Accepted" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
              <CardDescription>Revenue and booking volume over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.bookings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(Number(value)) : value,
                    name === 'revenue' ? 'Revenue' : 'Bookings'
                  ]} />
                  <Line yAxisId="left" type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} name="Bookings" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#00C49F" strokeWidth={2} name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={data.performance}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}${name.includes('Performance') || name.includes('Utilization') ? '%' : ''}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.performance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
