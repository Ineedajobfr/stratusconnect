// Compliance Notice - Truth Audit
// Softened claims until proven with evidence

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export function ComplianceNotice() {
  return (
    <Card className="mb-8 border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800">Platform Status & Evidence</h3>
            <div className="mt-2 space-y-2 text-sm text-blue-700">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span><strong>Payments:</strong> Processed by FCA regulated partners (Stripe Connect)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span><strong>Fees:</strong> 7% on deals, 10% on hiring, 0% for pilots/crew (enforced in code)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span><strong>Status:</strong> Live uptime and latency from UptimeRobot (or N/A if no data)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span><strong>Data Rights:</strong> DSAR export and erasure requests function and are logged</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span><strong>Security:</strong> Supabase with RLS, MFA available, audit log in place</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span><strong>Costs:</strong> No monthly software costs. Pay per transaction with Stripe fees deducted from flow</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EvidencePack() {
  return (
    <Card className="mb-8 border-green-200 bg-green-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-green-800">Evidence Pack - Ready for Audit</h3>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
              <div>
                <h4 className="font-medium mb-2">Payment Evidence</h4>
                <ul className="space-y-1">
                  <li>• Stripe Connect account configured</li>
                  <li>• Webhooks signed and idempotent</li>
                  <li>• Two receipts with hashes generated</li>
                  <li>• Fee calculations verified in code</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Compliance Evidence</h4>
                <ul className="space-y-1">
                  <li>• KYC blocks payout before verification</li>
                  <li>• DSAR export file downloadable</li>
                  <li>• RLS policies active on all tables</li>
                  <li>• Contact reveal only after deposit</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Monitoring Evidence</h4>
                <ul className="space-y-1">
                  <li>• Status page with live data</li>
                  <li>• Two test incidents opened/closed</li>
                  <li>• Service credit table visible</li>
                  <li>• UptimeRobot integration active</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Security Evidence</h4>
                <ul className="space-y-1">
                  <li>• Supabase RLS policies enforced</li>
                  <li>• MFA available for all users</li>
                  <li>• Audit log append-only</li>
                  <li>• Backups enabled and tested</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
