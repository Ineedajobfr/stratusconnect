import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function CompliantSLA() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Service Level Agreement</h1>
          
          <div className="space-y-8">
            {/* Compliance Notice */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">Measured Performance</h3>
                    <p className="text-blue-700 text-sm">
                      All uptime and performance metrics are measured by UptimeRobot monitoring. 
                      We do not make static claims about performance. Live metrics are available 
                      at our status page.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Level Targets */}
            <Card>
              <CardHeader>
                <CardTitle>Service Level Targets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold">Uptime Target</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">99.9%</p>
                      <p className="text-sm text-gunmetal">Monthly uptime target</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="font-semibold">Response Time</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">&lt; 2s</p>
                      <p className="text-sm text-gunmetal">Average response time</p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800">Current Performance</h4>
                        <p className="text-yellow-700 text-sm mt-1">
                          Live uptime and response time metrics are displayed on our{' '}
                          <a href="/status" className="underline">status page</a>. 
                          We do not make static claims about current performance.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Credits */}
            <Card>
              <CardHeader>
                <CardTitle>Service Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gunmetal">
                    Service credits are calculated based on verified incidents and apply only 
                    to the month in which the incident occurred. Credits are calculated as 
                    a percentage of your monthly platform fees.
                  </p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">Uptime</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Service Credit</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">99.9% - 100%</td>
                          <td className="border border-gray-300 px-4 py-2">0%</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <Badge className="bg-green-100 text-green-800">Target Met</Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">99.0% - 99.9%</td>
                          <td className="border border-gray-300 px-4 py-2">5%</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <Badge className="bg-yellow-100 text-yellow-800">Minor Impact</Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">95.0% - 99.0%</td>
                          <td className="border border-gray-300 px-4 py-2">10%</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <Badge className="bg-orange-100 text-orange-800">Significant Impact</Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">&lt; 95.0%</td>
                          <td className="border border-gray-300 px-4 py-2">25%</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <Badge className="bg-red-100 text-red-800">Major Impact</Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Incident Definition */}
            <Card>
              <CardHeader>
                <CardTitle>Incident Definition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gunmetal">
                    An incident is defined as any unplanned interruption to the service that 
                    affects the availability or performance of the platform. Incidents are 
                    tracked and reported through our status page.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Included in SLA</h4>
                      <ul className="text-sm text-gunmetal space-y-1">
                        <li>• Platform unavailability</li>
                        <li>• Significant performance degradation</li>
                        <li>• Payment processing failures</li>
                        <li>• Security incidents</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Excluded from SLA</h4>
                      <ul className="text-sm text-gunmetal space-y-1">
                        <li>• Scheduled maintenance</li>
                        <li>• Third-party service outages</li>
                        <li>• User-caused issues</li>
                        <li>• Force majeure events</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monitoring and Reporting */}
            <Card>
              <CardHeader>
                <CardTitle>Monitoring and Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gunmetal">
                    We use UptimeRobot to monitor our platform 24/7. All incidents are 
                    automatically detected and reported on our status page.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-green-800">Real-time Monitoring</h4>
                        <p className="text-green-700 text-sm">
                          Platform health checked every 5 minutes
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-blue-800">Incident Tracking</h4>
                        <p className="text-blue-700 text-sm">
                          All incidents logged with timestamps and resolution details
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <div>
                        <h4 className="font-semibold text-purple-800">Status Page</h4>
                        <p className="text-purple-700 text-sm">
                          Live metrics and incident updates available 24/7
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Credits Process */}
            <Card>
              <CardHeader>
                <CardTitle>Service Credits Process</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gunmetal">
                    Service credits are automatically calculated based on verified incidents 
                    and applied to your next billing cycle. No action is required on your part.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h4 className="font-semibold">Incident Detection</h4>
                        <p className="text-sm text-gunmetal">
                          UptimeRobot detects and logs the incident
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <h4 className="font-semibold">Incident Resolution</h4>
                        <p className="text-sm text-gunmetal">
                          Our team resolves the incident and updates status
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <h4 className="font-semibold">Credit Calculation</h4>
                        <p className="text-sm text-gunmetal">
                          Service credit calculated based on downtime
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <div>
                        <h4 className="font-semibold">Credit Application</h4>
                        <p className="text-sm text-gunmetal">
                          Credit applied to next billing cycle
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exclusions and Limitations */}
            <Card>
              <CardHeader>
                <CardTitle>Exclusions and Limitations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gunmetal">
                    The following are excluded from our SLA and do not qualify for service credits:
                  </p>
                  
                  <ul className="list-disc list-inside space-y-2 text-gunmetal">
                    <li>Scheduled maintenance windows (announced 48 hours in advance)</li>
                    <li>Third-party service outages (Stripe, hosting providers, etc.)</li>
                    <li>User-caused issues (incorrect configuration, misuse, etc.)</li>
                    <li>Force majeure events (natural disasters, government actions, etc.)</li>
                    <li>Security incidents caused by user negligence</li>
                    <li>Issues related to user's internet connection or devices</li>
                  </ul>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-800">Maximum Liability</h4>
                        <p className="text-red-700 text-sm mt-1">
                          Our total liability for service credits in any month shall not exceed 
                          100% of your monthly platform fees for that month.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gunmetal">
                    For questions about this SLA or to report service issues:
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-semibold">Support Team</p>
                    <p className="text-sm text-gunmetal">
                      Email: support@stratusconnect.com<br />
                      Status Page: <a href="/status" className="underline">/status</a><br />
                      Emergency: [Emergency Contact]
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Version Information */}
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gunmetal">Service Level Agreement</p>
                    <p className="text-xs text-gunmetal">Version 1.0 - Effective Date: [Date]</p>
                  </div>
                  <Badge variant="outline">Current</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
