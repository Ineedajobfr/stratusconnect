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
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            © September 2025 StratusConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
