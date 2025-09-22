import React from 'react';
import { Progress } from '@/components/ui/progress';
import { checkPasswordStrength } from '@/lib/security-config';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
  showFeedback?: boolean;
  className?: string;
}

export default function PasswordStrengthMeter({ 
  password, 
  showFeedback = true, 
  className = '' 
}: PasswordStrengthMeterProps) {
  const { score, feedback, isStrong } = checkPasswordStrength(password);
  
  const getScoreColor = (score: number) => {
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };
  
  const getScoreLabel = (score: number) => {
    if (score <= 1) return 'Very Weak';
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Fair';
    if (score <= 4) return 'Good';
    return 'Strong';
  };
  
  const getScoreIcon = (score: number) => {
    if (score <= 2) return <XCircle className="w-4 h-4 text-red-500" />;
    if (score <= 3) return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };
  
  if (!password) return null;
  
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength Meter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Password Strength
          </span>
          <div className="flex items-center gap-2">
            {getScoreIcon(score)}
            <span className={`text-sm font-medium ${
              score <= 2 ? 'text-red-500' : 
              score <= 3 ? 'text-yellow-500' : 
              'text-green-500'
            }`}>
              {getScoreLabel(score)}
            </span>
          </div>
        </div>
        
        <Progress 
          value={(score / 5) * 100} 
          className="h-2"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>5</span>
        </div>
      </div>
      
      {/* Feedback */}
      {showFeedback && feedback.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">
            Requirements:
          </h4>
          <ul className="space-y-1">
            {feedback.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-red-500">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Success Message */}
      {isStrong && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-sm text-green-700 dark:text-green-300">
            Password meets all security requirements
          </span>
        </div>
      )}
      
      {/* Security Tips */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
          Security Tips:
        </h4>
        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Use a mix of uppercase, lowercase, numbers, and symbols</li>
          <li>• Avoid common words, names, or personal information</li>
          <li>• Don't reuse passwords from other accounts</li>
          <li>• Consider using a password manager</li>
        </ul>
      </div>
    </div>
  );
}
