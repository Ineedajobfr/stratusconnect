// Compliance Notice - Truth Audit
// Softened claims until proven with evidence

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Shield, AlertTriangle, CheckCircle, Clock, ChevronDown } from 'lucide-react';

export function ComplianceNotice() {
  return (
    <Card className="mb-8 border-purple-700 bg-purple-900/20">
      <CardContent className="p-4">
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between p-3 h-auto border border-purple-600 bg-purple-800/30 hover:bg-purple-700/30 text-purple-200"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-purple-400" />
                <div className="text-left">
                  <h3 className="font-medium">Platform Status & Evidence</h3>
                  <p className="text-sm text-purple-300">FCA compliance, fees, status, security, and costs</p>
                </div>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="border border-purple-600 border-t-0 rounded-b-lg bg-purple-800/20">
            <div className="p-4 space-y-2 text-sm text-purple-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white" />
                <span><strong>Payments:</strong> Processed by FCA regulated partners (Stripe Connect)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white" />
                <span><strong>Fees:</strong> 7% on deals, 10% on hiring, 0% for pilots/crew (enforced in code)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white" />
                <span><strong>Status:</strong> Live uptime and latency from UptimeRobot (or N/A if no data)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white" />
                <span><strong>Data Rights:</strong> DSAR export and erasure requests function and are logged</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white" />
                <span><strong>Security:</strong> Supabase with RLS, MFA available, audit log in place</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span><strong>Costs:</strong> No monthly software costs. Pay per transaction with Stripe fees deducted from flow</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

export function EvidencePack() {
  return (
    <Card className="mb-8 border-purple-700 bg-purple-900/20">
      <CardContent className="p-4">
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between p-3 h-auto border border-purple-600 bg-purple-800/30 hover:bg-purple-700/30 text-purple-200"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-white" />
                <div className="text-left">
                  <h3 className="font-medium">Evidence Pack - Ready for Audit</h3>
                  <p className="text-sm text-purple-300">Payment, compliance, monitoring, and security evidence</p>
                </div>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="border border-purple-600 border-t-0 rounded-b-lg bg-purple-800/20">
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-300">
              <div>
                <h4 className="font-medium mb-2 text-purple-200">Payment Evidence</h4>
                <ul className="space-y-1">
                  <li>• Stripe Connect account configured</li>
                  <li>• Webhooks signed and idempotent</li>
                  <li>• Two receipts with hashes generated</li>
                  <li>• Fee calculations verified in code</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-purple-200">Compliance Evidence</h4>
                <ul className="space-y-1">
                  <li>• KYC blocks payout before verification</li>
                  <li>• DSAR export file downloadable</li>
                  <li>• RLS policies active on all tables</li>
                  <li>• Contact reveal only after deposit</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-purple-200">Monitoring Evidence</h4>
                <ul className="space-y-1">
                  <li>• Status page with live data</li>
                  <li>• Two test incidents opened/closed</li>
                  <li>• Service credit table visible</li>
                  <li>• UptimeRobot integration active</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-purple-200">Security Evidence</h4>
                <ul className="space-y-1">
                  <li>• Supabase RLS policies enforced</li>
                  <li>• MFA available for all users</li>
                  <li>• Audit log append-only</li>
                  <li>• Backups enabled and tested</li>
                </ul>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
