import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Activity,
    AlertTriangle,
    CheckCircle,
    Clock,
    DollarSign,
    Server,
    Shield,
    TrendingUp
} from 'lucide-react';

export default function SLA() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Service Level Agreement (SLA)
          </h1>
          <div className="flex items-center justify-center gap-4 text-gunmetal">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Last Updated: January 15, 2025</span>
            </div>
            <Badge variant="outline">Version 1.0</Badge>
          </div>
        </div>

        {/* SLA Overview */}
        <Card className="mb-8 border-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Service Level Commitment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">99.9%</div>
              <p className="text-gunmetal text-lg">Uptime Target per Calendar Quarter</p>
              <p className="text-gunmetal text-sm mt-2">
                Measured by our monitoring system and verified through independent status page
              </p>
            </div>
          </CardContent>
        </Card>

        {/* SLA Content */}
        <div className="space-y-8">
          {/* Service Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Service Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                We commit to maintaining 99.9% uptime for our core platform services per calendar quarter. 
                This excludes scheduled maintenance with 72-hour advance notice.
              </p>
              
              <div className="grid gap-4">
                <div className="bg-slate-800 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">Included in Uptime Calculation</h4>
                  <ul className="text-white text-sm space-y-1">
                    <li>• Platform API availability</li>
                    <li>• User authentication services</li>
                    <li>• Payment processing systems</li>
                    <li>• Core application functionality</li>
                  </ul>
                </div>
                
                <div className="bg-slate-800 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Excluded from Uptime Calculation</h4>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• Scheduled maintenance (72+ hour notice)</li>
                    <li>• Third-party service outages outside our control</li>
                    <li>• Force majeure events</li>
                    <li>• User-initiated actions or misconfigurations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Credits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Service Credits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                If we fail to meet our uptime commitment, you may be eligible for service credits based on 
                the severity and duration of the outage.
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium text-foreground">Uptime</th>
                      <th className="text-left p-3 font-medium text-foreground">Downtime (Quarter)</th>
                      <th className="text-left p-3 font-medium text-foreground">Service Credit</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="p-3 font-mono text-gunmetal">99.9% - 100%</td>
                      <td className="p-3 text-gunmetal">0 - 7.2 hours</td>
                      <td className="p-3 text-gunmetal">0%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-mono text-gunmetal">99.0% - 99.9%</td>
                      <td className="p-3 text-gunmetal">7.2 - 72 hours</td>
                      <td className="p-3 text-gunmetal">5%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-mono text-gunmetal">95.0% - 99.0%</td>
                      <td className="p-3 text-gunmetal">72 - 360 hours</td>
                      <td className="p-3 text-gunmetal">10%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-mono text-gunmetal">90.0% - 95.0%</td>
                      <td className="p-3 text-gunmetal">360 - 720 hours</td>
                      <td className="p-3 text-gunmetal">25%</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-gunmetal">Below 90.0%</td>
                      <td className="p-3 text-gunmetal">720+ hours</td>
                      <td className="p-3 text-gunmetal">50%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="bg-slate-800 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium">Service Credit Process</p>
                <p className="text-blue-700 text-sm mt-1">
                  Service credits are automatically calculated and applied to your next billing cycle. 
                  Credits are based on your monthly service fees and cannot exceed 50% of quarterly charges.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                We monitor and report on key performance indicators to ensure service quality:
              </p>
              
              <div className="grid gap-4">
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-foreground font-medium">API Response Time (P95)</span>
                  <span className="text-gunmetal">&lt; 500ms</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-foreground font-medium">Database Query Time (P95)</span>
                  <span className="text-gunmetal">&lt; 100ms</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-foreground font-medium">Payment Processing Time</span>
                  <span className="text-gunmetal">&lt; 2 seconds</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-foreground font-medium">Error Rate</span>
                  <span className="text-gunmetal">&lt; 0.1%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Incident Response */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Incident Response
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                Our incident response process ensures rapid resolution of service issues:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-900/20 text-red-400 border border-red-500/30 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-medium text-foreground">Detection & Alerting</h4>
                    <p className="text-gunmetal text-sm">Automated monitoring detects issues within 1 minute</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-medium text-foreground">Initial Response</h4>
                    <p className="text-gunmetal text-sm">On-call engineer responds within 15 minutes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-yellow-900/20 text-yellow-400 border border-yellow-500/30 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-medium text-foreground">Status Update</h4>
                    <p className="text-gunmetal text-sm">Public status page updated within 30 minutes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-900/20 text-green-400 border border-green-500/30 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-medium text-foreground">Resolution</h4>
                    <p className="text-gunmetal text-sm">Critical issues resolved within 4 hours</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monitoring & Reporting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Monitoring & Reporting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                We provide transparent monitoring and reporting of our service performance:
              </p>
              
              <div className="grid gap-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-foreground">Real-time Status Page</h4>
                  <p className="text-gunmetal text-sm mt-1">
                    Live monitoring dashboard available at /status with current uptime, response times, and incident status
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-foreground">Monthly Reports</h4>
                  <p className="text-gunmetal text-sm mt-1">
                    Detailed performance reports sent to all customers with uptime statistics and incident summaries
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium text-foreground">Incident Notifications</h4>
                  <p className="text-gunmetal text-sm mt-1">
                    Email notifications for service incidents, maintenance windows, and resolution updates
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exclusions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                SLA Exclusions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                The following circumstances are excluded from our SLA commitments:
              </p>
              
              <ul className="list-disc list-inside space-y-2 text-gunmetal ml-4">
                <li>Scheduled maintenance with 72+ hour advance notice</li>
                <li>Third-party service outages (payment processors, cloud providers, etc.)</li>
                <li>Force majeure events (natural disasters, government actions, etc.)</li>
                <li>User-initiated actions or misconfigurations</li>
                <li>Security incidents requiring immediate response</li>
                <li>Network issues outside our control</li>
                <li>DDoS attacks or other malicious activities</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Support & Escalation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                For SLA-related questions or to report service issues:
              </p>
              
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="font-medium text-foreground">Support Channels</p>
                <div className="grid gap-2 mt-2 text-sm text-gunmetal">
                  <div>Email: support@stratusconnect.org</div>
                  <div>Status Page: /status</div>
                  <div>Emergency: [Emergency Contact]</div>
                </div>
              </div>
              
              <div className="bg-slate-800 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium">Escalation Process</p>
                <p className="text-blue-700 text-sm mt-1">
                  If you believe we have not met our SLA commitments, please contact our support team 
                  with details of the incident. We will investigate and respond within 2 business days.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gunmetal text-sm">
          <p>
            This SLA is effective from January 15, 2025. We will provide 30 days notice of any material changes.
          </p>
          <p className="mt-2">
            For questions about this SLA, contact us at legal@stratusconnect.com
          </p>
        </div>
      </div>
    </div>
  );
}
