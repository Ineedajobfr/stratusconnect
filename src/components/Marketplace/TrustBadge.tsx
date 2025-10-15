// Trust Badge Component - Display operator trust scores and certifications
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { marketplaceService, type ArgusRating, type WyvernStatus } from "@/lib/marketplace-service";
import { Award, Check, Shield, Star, TrendingUp } from "lucide-react";

interface TrustBadgeProps {
  trustScore?: number;
  reputationScore?: number;
  verified?: boolean;
  argusRating?: ArgusRating;
  wyvernStatus?: WyvernStatus;
  avgResponseTime?: number;
  completionRate?: number;
  totalDeals?: number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export function TrustBadge({
  trustScore = 0,
  reputationScore,
  verified = false,
  argusRating,
  wyvernStatus,
  avgResponseTime,
  completionRate,
  totalDeals,
  size = 'md',
  showDetails = true
}: TrustBadgeProps) {
  const badge = marketplaceService.getTrustBadge(trustScore);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const hasArgus = argusRating && argusRating !== 'not_rated';
  const hasWyvern = wyvernStatus && wyvernStatus !== 'not_certified';

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Main Trust Score Badge */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              className={`${badge.bgClass} ${sizeClasses[size]} flex items-center gap-1.5 cursor-help`}
            >
              <Star className={`${iconSizes[size]} fill-current`} />
              <span className="font-semibold">{badge.label}</span>
              <span className="opacity-80 font-normal">({Math.round(trustScore)})</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-800 border-slate-700 text-white max-w-xs">
            <div className="space-y-2">
              <div className="font-semibold">Trust Score: {Math.round(trustScore)}/100</div>
              <div className="text-xs text-slate-300">
                Based on verification status, reputation, response time, and platform activity
              </div>
              {showDetails && (
                <div className="grid grid-cols-2 gap-2 text-xs mt-2 pt-2 border-t border-slate-600">
                  {reputationScore !== undefined && (
                    <div>
                      <div className="text-slate-400">Reputation</div>
                      <div className="font-medium">{reputationScore.toFixed(1)}/5.0</div>
                    </div>
                  )}
                  {avgResponseTime !== undefined && (
                    <div>
                      <div className="text-slate-400">Avg Response</div>
                      <div className="font-medium">{avgResponseTime}m</div>
                    </div>
                  )}
                  {completionRate !== undefined && (
                    <div>
                      <div className="text-slate-400">Completion</div>
                      <div className="font-medium">{completionRate.toFixed(1)}%</div>
                    </div>
                  )}
                  {totalDeals !== undefined && (
                    <div>
                      <div className="text-slate-400">Total Deals</div>
                      <div className="font-medium">{totalDeals}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Verified Badge */}
      {verified && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className={`${sizeClasses[size]} border-green-500 text-green-500 flex items-center gap-1`}>
                <Check className={iconSizes[size]} />
                <span>Verified</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-800 border-slate-700 text-white">
              <div className="text-xs">
                Identity and credentials verified by StratusConnect
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* ARGUS Rating Badge */}
      {hasArgus && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className={`${sizeClasses[size]} flex items-center gap-1 ${
                  argusRating === 'platinum' ? 'border-purple-400 text-purple-400' :
                  argusRating === 'gold' ? 'border-yellow-400 text-yellow-400' :
                  'border-gray-400 text-gray-400'
                }`}
              >
                <Shield className={iconSizes[size]} />
                <span>{marketplaceService.formatArgusRating(argusRating)}</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-800 border-slate-700 text-white max-w-xs">
              <div className="text-xs space-y-1">
                <div className="font-semibold">ARGUS {argusRating.toUpperCase()} Rating</div>
                <div className="text-slate-300">
                  ARGUS International safety audit certification
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* WYVERN Status Badge */}
      {hasWyvern && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className={`${sizeClasses[size]} flex items-center gap-1 ${
                  wyvernStatus === 'elite' ? 'border-blue-400 text-blue-400' : 'border-cyan-400 text-cyan-400'
                }`}
              >
                <Award className={iconSizes[size]} />
                <span>{marketplaceService.formatWyvernStatus(wyvernStatus)}</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-800 border-slate-700 text-white max-w-xs">
              <div className="text-xs space-y-1">
                <div className="font-semibold">WYVERN {wyvernStatus.toUpperCase()}</div>
                <div className="text-slate-300">
                  WYVERN safety management system certification
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* High Performance Indicator */}
      {completionRate && completionRate >= 98 && avgResponseTime && avgResponseTime <= 10 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className={`${sizeClasses[size]} border-orange-400 text-orange-400 flex items-center gap-1`}>
                <TrendingUp className={iconSizes[size]} />
                <span>Top Performer</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-800 border-slate-700 text-white">
              <div className="text-xs">
                Exceptional response time and completion rate
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

