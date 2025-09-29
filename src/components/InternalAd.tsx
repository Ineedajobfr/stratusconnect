// Internal Advertising Component
// Only StratusConnect-approved advertisements
// FCA Compliant Aviation Platform

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Zap, Shield } from 'lucide-react';

interface InternalAdProps {
  type: 'premium' | 'feature' | 'promotion' | 'service';
  title: string;
  description: string;
  ctaText: string;
  ctaAction: () => void;
  icon?: React.ReactNode;
  className?: string;
}

const InternalAd: React.FC<InternalAdProps> = ({
  type,
  title,
  description,
  ctaText,
  ctaAction,
  icon,
  className = ''
}) => {
  const getAdStyling = () => {
    switch (type) {
      case 'premium':
        return {
          gradient: 'from-yellow-500/20 to-orange-500/20',
          border: 'border-yellow-500/30',
          icon: <Star className="w-5 h-5 text-yellow-500" />,
          bg: 'bg-yellow-500/10'
        };
      case 'feature':
        return {
          gradient: 'from-blue-500/20 to-cyan-500/20',
          border: 'border-blue-500/30',
          icon: <Zap className="w-5 h-5 text-blue-500" />,
          bg: 'bg-blue-500/10'
        };
      case 'promotion':
        return {
          gradient: 'from-green-500/20 to-emerald-500/20',
          border: 'border-green-500/30',
          icon: <ArrowRight className="w-5 h-5 text-green-500" />,
          bg: 'bg-green-500/10'
        };
      case 'service':
        return {
          gradient: 'from-purple-500/20 to-violet-500/20',
          border: 'border-purple-500/30',
          icon: <Shield className="w-5 h-5 text-purple-500" />,
          bg: 'bg-purple-500/10'
        };
      default:
        return {
          gradient: 'from-gray-500/20 to-slate-500/20',
          border: 'border-gray-500/30',
          icon: <Star className="w-5 h-5 text-gray-500" />,
          bg: 'bg-gray-500/10'
        };
    }
  };

  const styling = getAdStyling();

  return (
    <Card className={`terminal-card border-2 ${styling.border} bg-gradient-to-r ${styling.gradient} ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${styling.bg}`}>
            {icon || styling.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">{description}</p>
            <Button
              onClick={ctaAction}
              className={`bg-gradient-to-r ${styling.gradient} hover:opacity-90 text-white border ${styling.border} transition-all duration-200`}
              size="sm"
            >
              {ctaText}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Predefined internal advertisements
export const PremiumUpgradeAd: React.FC<{ onUpgrade: () => void }> = ({ onUpgrade }) => (
  <InternalAd
    type="premium"
    title="Upgrade to Premium"
    description="Unlock advanced features, priority support, and exclusive aviation insights with our premium membership."
    ctaText="Upgrade Now"
    ctaAction={onUpgrade}
  />
);

export const FeatureHighlightAd: React.FC<{ onLearnMore: () => void }> = ({ onLearnMore }) => (
  <InternalAd
    type="feature"
    title="New AI Intelligence Features"
    description="Discover our latest AI-powered tools for market analysis, route optimization, and intelligent recommendations."
    ctaText="Learn More"
    ctaAction={onLearnMore}
  />
);

export const ServicePromotionAd: React.FC<{ onContact: () => void }> = ({ onContact }) => (
  <InternalAd
    type="service"
    title="Professional Aviation Services"
    description="Connect with certified aviation professionals for aircraft transactions, crew placement, and operational support."
    ctaText="Contact Us"
    ctaAction={onContact}
  />
);

export const BetaProgramAd: React.FC<{ onJoin: () => void }> = ({ onJoin }) => (
  <InternalAd
    type="promotion"
    title="Join Our Beta Program"
    description="Be among the first to experience cutting-edge aviation technology and shape the future of our platform."
    ctaText="Join Beta"
    ctaAction={onJoin}
  />
);

export default InternalAd;
