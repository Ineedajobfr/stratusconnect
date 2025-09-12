import React from 'react';
import { Badge } from '@/components/ui/badge';
import { LEAGUE_COLORS, LEAGUE_ICONS } from '@/lib/league-constants';
import { 
  Medal, 
  Star, 
  Trophy, 
  Crown, 
  Gem, 
  Shield 
} from 'lucide-react';

interface LeagueBadgeProps {
  code: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const iconMap = {
  medal: Medal,
  star: Star,
  trophy: Trophy,
  crown: Crown,
  gem: Gem,
  shield: Shield,
};

export default function LeagueBadge({ 
  code, 
  name, 
  size = 'md', 
  showIcon = true 
}: LeagueBadgeProps) {
  const hsl = LEAGUE_COLORS[code] ?? "25 70% 45%";
  const iconName = LEAGUE_ICONS[code] ?? "medal";
  const IconComponent = iconMap[iconName as keyof typeof iconMap] || Medal;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <Badge 
      className={`${sizeClasses[size]} border-glow`}
      style={{
        background: `color-mix(in oklab, hsl(${hsl}) 18%, transparent)`,
        color: `hsl(${hsl})`,
        borderColor: `hsl(${hsl} / 0.3)`,
        boxShadow: `0 0 10px hsl(${hsl} / 0.2)`
      }}
    >
      <div className="flex items-center gap-2">
        {showIcon && (
          <IconComponent className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'} icon-glow`} />
        )}
        <span className="font-semibold">{name}</span>
      </div>
    </Badge>
  );
}
