// Footer with Legal Links
// FCA Compliant Aviation Platform

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  FileText, 
  Eye, 
  Clock, 
  Lock,
  ExternalLink
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Platform Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">StratusConnect</h3>
            <p className="text-gray-300 text-sm mb-4">
              The trusted platform for private aviation. 
              Connecting brokers, operators, pilots, and crew.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Shield className="w-4 h-4" />
              <span>FCA Regulated Payments</span>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Privacy Notice
                </Link>
              </li>
              <li>
                <Link 
                  to="/cookies" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Cookies Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/sla" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Service Level Agreement
                </Link>
              </li>
              <li>
                <Link 
                  to="/security" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Security Overview
                </Link>
              </li>
            </ul>
          </div>

          {/* Status & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Status & Support</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/status" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Status Page
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:support@stratusconnect.com" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  support@stratusconnect.com
                </a>
              </li>
              <li>
                <a 
                  href="tel:+441234567890" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  +44 123 456 7890
                </a>
              </li>
            </ul>
          </div>

          {/* Compliance */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Compliance</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Payments processed by FCA regulated partners</p>
              <p>GDPR & DPA 2018 compliant</p>
              <p>ISO 27001 aligned security controls</p>
              <p>Audit logs for all transactions</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 StratusConnect. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
