// Legal Pages - Production Ready
// FCA Compliant with Last Updated Dates

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Calendar, FileText, AlertTriangle } from 'lucide-react';

const LAST_UPDATED = '2024-01-16';

export function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-terminal-bg py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="terminal-card">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-3xl font-bold">Terms and Conditions</CardTitle>
              <Badge className="bg-blue-100 text-blue-800">
                <Calendar className="w-3 h-3 mr-1" />
                Last Updated: {LAST_UPDATED}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-800">FCA Compliant Platform</h3>
                    <p className="text-green-700 text-sm mt-1">
                      StratusConnect operates as a regulated payment platform. We never hold client funds. 
                      All payments are processed through Stripe Connect with clear fee disclosure.
                    </p>
                  </div>
                </div>
              </div>

              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Platform Services</h2>
                <p className="mb-4">
                  StratusConnect provides a platform connecting aviation brokers, operators, pilots, and crew. 
                  We facilitate transactions but do not operate aircraft or provide regulatory approvals.
                </p>
                <p className="mb-4">
                  <strong>Aviation Compliance:</strong> Operational aviation compliance rests with Operators and Pilots. 
                  We reference EASA Air OPS and FAA Part 135 obligations. We are the platform, not the operator.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Fee Structure</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Platform Fees (Enforced in Code)</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>7% platform commission</strong> on all broker-operator charter deals</li>
                    <li><strong>10% hiring fee</strong> on operators when hiring pilots or crew through the platform</li>
                    <li><strong>0% fees</strong> for pilots and crew members</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-2">
                    All fees are automatically calculated and processed through Stripe Connect. 
                    No manual fee adjustments are permitted.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Payment Processing</h2>
                <p className="mb-4">
                  All payments are processed through Stripe Connect, a regulated payment processor. 
                  StratusConnect never holds client funds. Our platform fee is automatically deducted 
                  by Stripe Connect during payment processing.
                </p>
                <p className="mb-4">
                  <strong>KYC Verification:</strong> Payouts are blocked until identity verification is complete. 
                  This is enforced at the code level for compliance.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Data Protection</h2>
                <p className="mb-4">
                  We process personal data in accordance with GDPR and DPA 2018. 
                  Data subjects have rights to access, rectification, erasure, and portability.
                </p>
                <p className="mb-4">
                  <strong>Data Retention:</strong> Financial records retained for 6 years. 
                  AML records retained as required by law. Expired credentials removed within 30 days.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Service Level Agreement</h2>
                <p className="mb-4">
                  We target 99.9% uptime. Actual uptime is measured and displayed on our status page. 
                  Service credits are calculated based on verified incidents only.
                </p>
                <p className="mb-4">
                  <strong>Live Monitoring:</strong> Our status page shows real-time metrics from UptimeRobot. 
                  No static claims are made.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Security</h2>
                <p className="mb-4">
                  We implement security controls aligned with ISO 27001 (not certified). 
                  Data encrypted at rest (AES 256) and in transit (TLS 1.3). 
                  Role-based access control with row-level security.
                </p>
                <p className="mb-4">
                  <strong>Audit Trail:</strong> All financial transactions are logged with immutable audit hashes. 
                  Receipts can be downloaded from any deal page.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
                <p className="mb-4">
                  For questions about these terms, contact us at legal@stratusconnect.com
                </p>
                <p className="text-sm text-gray-600">
                  These terms are effective as of {LAST_UPDATED} and may be updated with notice.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function PrivacyNotice() {
  return (
    <div className="min-h-screen bg-terminal-bg py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="terminal-card">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-3xl font-bold">Privacy Notice</CardTitle>
              <Badge className="bg-blue-100 text-blue-800">
                <Calendar className="w-3 h-3 mr-1" />
                Last Updated: {LAST_UPDATED}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-800">GDPR Compliant</h3>
                    <p className="text-blue-700 text-sm mt-1">
                      This privacy notice complies with GDPR and DPA 2018. 
                      You have rights to access, correct, delete, and port your data.
                    </p>
                  </div>
                </div>
              </div>

              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Data Controller</h2>
                <p className="mb-4">
                  StratusConnect Ltd is the data controller for personal data processed through our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Personal Data We Collect</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Identity information (name, email, phone, address)</li>
                  <li>Financial information (payment details, transaction history)</li>
                  <li>Aviation credentials (licenses, certifications, expiry dates)</li>
                  <li>KYC/AML verification data</li>
                  <li>Usage data (IP address, browser type, access logs)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Data</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Process transactions and facilitate deals</li>
                  <li>Verify identity and conduct KYC checks</li>
                  <li>Screen against sanctions lists</li>
                  <li>Provide customer support</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Data Sharing</h2>
                <p className="mb-4">
                  We share data with:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Stripe Connect (payment processing)</li>
                  <li>Supabase (data storage and authentication)</li>
                  <li>UptimeRobot (monitoring and status)</li>
                  <li>KYC/AML service providers</li>
                  <li>Legal authorities when required by law</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">GDPR Data Rights</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Access:</strong> Request a copy of your personal data</li>
                    <li><strong>Rectification:</strong> Correct inaccurate data</li>
                    <li><strong>Erasure:</strong> Delete your personal data (subject to legal requirements)</li>
                    <li><strong>Portability:</strong> Export your data in machine-readable format</li>
                    <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-2">
                    Use our DSAR workflow to exercise these rights. All requests are logged and processed within 30 days.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Financial records: 6 years (legal requirement)</li>
                  <li>AML/KYC records: As required by law</li>
                  <li>Expired credentials: 30 days (unless law requires longer)</li>
                  <li>Personal data: Until deletion requested or account closed</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Security Measures</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Data encrypted at rest (AES 256)</li>
                  <li>Data encrypted in transit (TLS 1.3)</li>
                  <li>Row-level security on all data</li>
                  <li>Multi-factor authentication available</li>
                  <li>Regular security audits and penetration testing</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
                <p className="mb-4">
                  For privacy questions or to exercise your rights:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Email: privacy@stratusconnect.com</li>
                  <li>DSAR Portal: Use the DSAR workflow in your account</li>
                  <li>Data Protection Officer: dpo@stratusconnect.com</li>
                </ul>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ServiceLevelAgreement() {
  return (
    <div className="min-h-screen bg-terminal-bg py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="terminal-card">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-3xl font-bold">Service Level Agreement</CardTitle>
              <Badge className="bg-blue-100 text-blue-800">
                <Calendar className="w-3 h-3 mr-1" />
                Last Updated: {LAST_UPDATED}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-800">Live Monitoring</h3>
                    <p className="text-green-700 text-sm mt-1">
                      Our SLA is based on real-time monitoring data from UptimeRobot. 
                      No static claims are made. Check our status page for live metrics.
                    </p>
                  </div>
                </div>
              </div>

              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Uptime Target</h2>
                <p className="mb-4">
                  <strong>Target:</strong> 99.9% uptime measured over rolling 30-day periods
                </p>
                <p className="mb-4">
                  <strong>Measurement:</strong> Based on UptimeRobot monitoring of our main application, 
                  API endpoints, and webhook endpoints.
                </p>
                <p className="mb-4">
                  <strong>Status Page:</strong> Live uptime and response time metrics available at 
                  <a href="/status" className="text-blue-600 hover:underline"> /status</a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Response Time Targets</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">API Response Times (Live Data)</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>P50:</strong> &lt; 200ms (median response time)</li>
                    <li><strong>P90:</strong> &lt; 500ms (90th percentile)</li>
                    <li><strong>P99:</strong> &lt; 1000ms (99th percentile)</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-2">
                    Actual response times are displayed on our status page. No static claims are made.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Service Credits</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">Uptime</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Service Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">99.9% - 100%</td>
                        <td className="border border-gray-300 px-4 py-2">0%</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">99.0% - 99.9%</td>
                        <td className="border border-gray-300 px-4 py-2">5%</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">95.0% - 99.0%</td>
                        <td className="border border-gray-300 px-4 py-2">10%</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">&lt; 95.0%</td>
                        <td className="border border-gray-300 px-4 py-2">25%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Service credits apply only to verified incidents on our status page. 
                  Credits are calculated automatically based on actual uptime data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Incident Response</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Detection:</strong> Automated monitoring with UptimeRobot</li>
                  <li><strong>Notification:</strong> Status page updated within 15 minutes</li>
                  <li><strong>Communication:</strong> Incident updates every 30 minutes</li>
                  <li><strong>Resolution:</strong> Target resolution within 4 hours for critical issues</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Exclusions</h2>
                <p className="mb-4">SLA does not apply during:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Scheduled maintenance (with 48-hour notice)</li>
                  <li>Third-party service outages (Stripe, Supabase, etc.)</li>
                  <li>Force majeure events</li>
                  <li>User-caused issues (invalid API calls, etc.)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Monitoring and Reporting</h2>
                <p className="mb-4">
                  <strong>Live Status:</strong> <a href="/status" className="text-blue-600 hover:underline">status.stratusconnect.com</a>
                </p>
                <p className="mb-4">
                  <strong>Metrics:</strong> Real-time uptime, response times, and incident history
                </p>
                <p className="mb-4">
                  <strong>Transparency:</strong> All incidents are logged and publicly visible on our status page
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function SecurityOverview() {
  return (
    <div className="min-h-screen bg-terminal-bg py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="terminal-card">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-3xl font-bold">Security Overview</CardTitle>
              <Badge className="bg-blue-100 text-blue-800">
                <Calendar className="w-3 h-3 mr-1" />
                Last Updated: {LAST_UPDATED}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-800">Security Controls Aligned with ISO 27001</h3>
                    <p className="text-yellow-700 text-sm mt-1">
                      We implement security controls aligned with ISO 27001 standards. 
                      We are not ISO 27001 certified at this time.
                    </p>
                  </div>
                </div>
              </div>

              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Data Protection</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Encryption at Rest:</strong> AES 256 encryption for all stored data</li>
                  <li><strong>Encryption in Transit:</strong> TLS 1.3 for all communications</li>
                  <li><strong>Key Management:</strong> Secure key rotation and storage</li>
                  <li><strong>Database Security:</strong> Row-level security on all tables</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Access Control</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Authentication:</strong> Multi-factor authentication available</li>
                  <li><strong>Authorization:</strong> Role-based access control (RBAC)</li>
                  <li><strong>Least Privilege:</strong> Users can only access their own data</li>
                  <li><strong>Admin Controls:</strong> MFA can be required for all users</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Payment Security</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>No Fund Custody:</strong> We never hold client funds</li>
                  <li><strong>Regulated Processing:</strong> All payments through Stripe Connect</li>
                  <li><strong>PCI Compliance:</strong> Payment data handled by PCI-compliant processor</li>
                  <li><strong>Audit Trail:</strong> Immutable audit logs for all transactions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Monitoring and Logging</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Real-time Monitoring:</strong> UptimeRobot for availability monitoring</li>
                  <li><strong>Audit Logging:</strong> All actions logged with immutable hashes</li>
                  <li><strong>Incident Response:</strong> Automated alerting and response procedures</li>
                  <li><strong>Security Scanning:</strong> Regular vulnerability assessments</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Compliance and Governance</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>FCA Compliance:</strong> Regulated payment platform</li>
                  <li><strong>GDPR Compliance:</strong> Data protection and privacy rights</li>
                  <li><strong>KYC/AML:</strong> Identity verification and sanctions screening</li>
                  <li><strong>Data Retention:</strong> Legal compliance with retention periods</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Security Measures</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Rate Limiting:</strong> Protection against abuse and DDoS</li>
                  <li><strong>File Scanning:</strong> Malware scanning for uploads</li>
                  <li><strong>Input Validation:</strong> Protection against injection attacks</li>
                  <li><strong>Secure Headers:</strong> Security headers on all responses</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Incident Response</h2>
                <p className="mb-4">
                  In case of security incidents:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Incidents are declared and communicated within 15 minutes</li>
                  <li>Status page is updated with real-time information</li>
                  <li>Root cause analysis is conducted for all incidents</li>
                  <li>Lessons learned are documented and applied</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Contact Security Team</h2>
                <p className="mb-4">
                  For security concerns or to report vulnerabilities:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Email: security@stratusconnect.com</li>
                  <li>Incident Response: incident@stratusconnect.com</li>
                  <li>Vulnerability Reports: vuln@stratusconnect.com</li>
                </ul>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
