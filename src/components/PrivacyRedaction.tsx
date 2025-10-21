import { useState } from 'react';
import { Shield, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PrivacyRedactionProps {
  content: string;
  dealConfirmed: boolean;
  onViolationDetected?: (content: string, violations: string[]) => void;
}

export const PrivacyRedaction = ({ 
  content, 
  dealConfirmed, 
  onViolationDetected 
}: PrivacyRedactionProps) => {
  const [showRedacted, setShowRedacted] = useState(false);

  // Regex patterns for detecting contact information
  const patterns = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    phone: /(\+?1[-.\s]?)?(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\d{10})/g,
    social: /@[A-Za-z0-9_]+|linkedin\.com\/|facebook\.com\/|instagram\.com\/|twitter\.com\/|whatsapp/gi,
    website: /https?:\/\/[^\s]+|www\.[^\s]+/g
  };

  // Detect violations
  const detectViolations = (text: string): { violations: string[], hasViolations: boolean } => {
    const violations: string[] = [];
    
    if (patterns.email.test(text)) violations.push('email address');
    if (patterns.phone.test(text)) violations.push('phone number');
    if (patterns.social.test(text)) violations.push('social media handle');
    if (patterns.website.test(text)) violations.push('website URL');
    
    return { violations, hasViolations: violations.length > 0 };
  };

  // Redact sensitive information
  const redactContent = (text: string): string => {
    if (dealConfirmed) return text;

    let redacted = text;
    redacted = redacted.replace(patterns.email, '[EMAIL REDACTED]');
    redacted = redacted.replace(patterns.phone, '[PHONE REDACTED]');
    redacted = redacted.replace(patterns.social, '[SOCIAL REDACTED]');
    redacted = redacted.replace(patterns.website, '[URL REDACTED]');
    
    return redacted;
  };

  const { violations, hasViolations } = detectViolations(content);
  const redactedContent = redactContent(content);
  
  // Notify parent component of violations
  if (hasViolations && onViolationDetected) {
    onViolationDetected(content, violations);
  }

  // If deal is confirmed, show original content
  if (dealConfirmed) {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-green-400" />
          <Badge variant="outline" className="text-green-400 border-green-400">
            Deal Confirmed - Privacy Screen Disabled
          </Badge>
        </div>
        <div>{content}</div>
      </div>
    );
  }

  // If no violations, show content normally
  if (!hasViolations) {
    return <div>{content}</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
          <Badge variant="destructive" className="text-xs">
            Privacy Violation Detected
          </Badge>
        </div>
        <Button
          variant="ghost" 
          size="sm"
          onClick={() => setShowRedacted(!showRedacted)}
          className="text-xs text-slate-400 hover:text-white"
        >
          {showRedacted ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
          {showRedacted ? 'Hide Original' : 'Show Original'}
        </Button>
      </div>
      
      <div className="bg-slate-900/50 border border-yellow-500/30 rounded p-3">
        <div className="text-sm text-yellow-400 mb-2 font-mono">
          BLOCKED: {violations.join(', ')}
        </div>
        <div className="text-slate-300">
          {showRedacted ? content : redactedContent}
        </div>
      </div>
      
      <div className="text-xs text-slate-500 font-mono">
        ⚠️ Contact information sharing is prohibited before deal confirmation
      </div>
    </div>
  );
};
