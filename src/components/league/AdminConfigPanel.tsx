import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  AlertTriangle,
  CheckCircle,
  Target,
  Shield,
  Zap
} from 'lucide-react';
import { LEAGUE_RULES, updateThreshold, updatePoints, updateTarget, togglePerk, toggleComplianceGate } from '@/lib/league-config';

export function AdminConfigPanel() {
  const [config, setConfig] = useState(LEAGUE_RULES);
  const [hasChanges, setHasChanges] = useState(false);

  const handleThresholdChange = (key: keyof typeof config.thresholds, value: number | boolean) => {
    setConfig(prev => ({
      ...prev,
      thresholds: { ...prev.thresholds, [key]: value }
    }));
    setHasChanges(true);
  };

  const handlePointsChange = (key: keyof typeof config.points, value: number) => {
    setConfig(prev => ({
      ...prev,
      points: { ...prev.points, [key]: value }
    }));
    setHasChanges(true);
  };

  const handleTargetChange = (key: keyof typeof config.targets, value: number) => {
    setConfig(prev => ({
      ...prev,
      targets: { ...prev.targets, [key]: value }
    }));
    setHasChanges(true);
  };

  const handlePerkToggle = (key: keyof typeof config.perks, value: boolean) => {
    setConfig(prev => ({
      ...prev,
      perks: { ...prev.perks, [key]: value }
    }));
    setHasChanges(true);
  };

  const handleComplianceToggle = (key: keyof typeof config.complianceGates, value: boolean) => {
    setConfig(prev => ({
      ...prev,
      complianceGates: { ...prev.complianceGates, [key]: value }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Apply changes to the actual config
    Object.entries(config.thresholds).forEach(([key, value]) => {
      updateThreshold(key as keyof typeof config.thresholds, value);
    });
    
    // Handle nested points structure
    Object.entries(config.points).forEach(([role, points]) => {
      if (typeof points === 'object' && points !== null) {
        Object.entries(points).forEach(([eventType, value]) => {
          updatePoints(role as keyof typeof config.points, eventType, value as number);
        });
      }
    });
    
    Object.entries(config.targets).forEach(([key, value]) => {
      updateTarget(key as keyof typeof config.targets, value as number);
    });
    Object.entries(config.perks).forEach(([key, value]) => {
      togglePerk(key as keyof typeof config.perks, value as boolean);
    });
    Object.entries(config.complianceGates).forEach(([key, value]) => {
      toggleComplianceGate(key as keyof typeof config.complianceGates, value as boolean);
    });
    setHasChanges(false);
  };

  const handleReset = () => {
    setConfig(LEAGUE_RULES);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground title-glow">League Configuration</h2>
          <p className="text-muted-foreground subtitle-glow">
            Tune the levers that create structural edge. Changes apply immediately.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <Badge variant="outline" className="text-yellow-500 border-yellow-500">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Unsaved Changes
            </Badge>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
            disabled={!hasChanges}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!hasChanges}
            className="button-glow"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Speed Thresholds */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 title-glow">
            <Zap className="w-6 h-6 text-accent" />
            <span>Speed Thresholds</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            These create the speed monopoly. Tighten to chase liquidity.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fastQuoteMinutes">Fast Quote Minutes</Label>
              <Input
                id="fastQuoteMinutes"
                type="number"
                value={config.thresholds.fastQuoteMinutes}
                onChange={(e) => handleThresholdChange('fastQuoteMinutes', parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Quote must be submitted within this time to earn fast points
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="savedSearchResponseMinutes">Saved Search Response Minutes</Label>
              <Input
                id="savedSearchResponseMinutes"
                type="number"
                value={config.thresholds.savedSearchResponseMinutes}
                onChange={(e) => handleThresholdChange('savedSearchResponseMinutes', parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Response time for saved search alerts
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="onTimeGraceMinutes">On-Time Grace Minutes</Label>
              <Input
                id="onTimeGraceMinutes"
                type="number"
                value={config.thresholds.onTimeGraceMinutes}
                onChange={(e) => handleThresholdChange('onTimeGraceMinutes', parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Grace period for "on-time" completion
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="disputeFreeWindow">Dispute-Free Window (Hours)</Label>
              <Input
                id="disputeFreeWindow"
                type="number"
                value={config.thresholds.disputeFreeWindow}
                onChange={(e) => handleThresholdChange('disputeFreeWindow', parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Hours after completion to verify no disputes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Point Values */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 title-glow">
            <Target className="w-6 h-6 text-accent" />
            <span>Point Values</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Raise on-time points if completion starts to slip. Adjust to drive behavior.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Points system is configured per role. This is a simplified view.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Broker Fast Quote Points</Label>
              <Input
                type="number"
                value={10}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label>Deal Completion Points</Label>
              <Input
                type="number"
                value={25}
                disabled
                className="bg-muted"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Targets */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 title-glow">
            <CheckCircle className="w-6 h-6 text-accent" />
            <span>Performance Targets</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Week 4 goals. Hit these and the league is paying for itself.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeToFirstQuote">Time to First Quote (minutes)</Label>
              <Input
                id="timeToFirstQuote"
                type="number"
                step="0.1"
                value={config.targets.timeToFirstQuote}
                onChange={(e) => handleTargetChange('timeToFirstQuote', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quoteResponseRate">Quote Response Rate (%)</Label>
              <Input
                id="quoteResponseRate"
                type="number"
                step="0.01"
                value={config.targets.quoteResponseRate * 100}
                onChange={(e) => handleTargetChange('quoteResponseRate', parseFloat(e.target.value) / 100)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dealConversion">Deal Conversion (%)</Label>
              <Input
                id="dealConversion"
                type="number"
                step="0.01"
                value={config.targets.dealConversion * 100}
                onChange={(e) => handleTargetChange('dealConversion', parseFloat(e.target.value) / 100)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="disputeRate">Dispute Rate (%)</Label>
              <Input
                id="disputeRate"
                type="number"
                step="0.001"
                value={config.targets.disputeRate * 100}
                onChange={(e) => handleTargetChange('disputeRate', parseFloat(e.target.value) / 100)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="onPlatformSettlement">On-Platform Settlement (%)</Label>
              <Input
                id="onPlatformSettlement"
                type="number"
                step="0.01"
                value={config.targets.onPlatformSettlement * 100}
                onChange={(e) => handleTargetChange('onPlatformSettlement', parseFloat(e.target.value) / 100)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leakageBlocked">Leakage Blocked (%)</Label>
              <Input
                id="leakageBlocked"
                type="number"
                step="0.01"
                value={config.targets.leakageBlocked * 100}
                onChange={(e) => handleTargetChange('leakageBlocked', parseFloat(e.target.value) / 100)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Perks Configuration */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 title-glow">
            <Settings className="w-6 h-6 text-accent" />
            <span>Perks & Lock-in</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            These create behavioral lock-in. Turn off rankingBias if you see unfair clustering.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="earlyAccessMultiplier">Early Access Multiplier</Label>
                  <p className="text-xs text-muted-foreground">More RFQs shown to top leagues</p>
                </div>
                <Input
                  id="earlyAccessMultiplier"
                  type="number"
                  step="0.1"
                  value={config.perks.earlyAccessMultiplier}
                  onChange={(e) => {
                    const newConfig = { ...config };
                    newConfig.perks.earlyAccessMultiplier = parseFloat(e.target.value) || 1;
                    setConfig(newConfig);
                  }}
                  className="w-20"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="rankingBias">Ranking Bias</Label>
                  <p className="text-xs text-muted-foreground">Max ordering lift for performance</p>
                </div>
                <Input
                  id="rankingBias"
                  type="number"
                  step="0.01"
                  value={config.perks.rankingBias}
                  onChange={(e) => {
                    const newConfig = { ...config };
                    newConfig.perks.rankingBias = parseFloat(e.target.value) || 0;
                    setConfig(newConfig);
                  }}
                  className="w-20"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="supportPriority">Support Priority</Label>
                  <p className="text-xs text-muted-foreground">Faster SLA for top leagues</p>
                </div>
                <Switch
                  id="supportPriority"
                  checked={Boolean(config.perks.supportPriority)}
                  onCheckedChange={(checked) => {
                    const newConfig = { ...config };
                    newConfig.perks.supportPriority = checked;
                    setConfig(newConfig);
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="depositRequiredForPerks">Deposit Required for Perks</Label>
                  <p className="text-xs text-muted-foreground">Perks only after deposit</p>
                </div>
                <Switch
                  id="depositRequiredForPerks"
                  checked={Boolean(config.perks.depositRequiredForPerks)}
                  onCheckedChange={(checked) => {
                    const newConfig = { ...config };
                    newConfig.perks.depositRequiredForPerks = checked;
                    setConfig(newConfig);
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Gates */}
      <Card className="terminal-card border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 title-glow">
            <Shield className="w-6 h-6 text-red-500" />
            <span>Compliance Gates</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            These protect margins. Never disable unless absolutely necessary.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(config.complianceGates).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <Label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</Label>
                  <p className="text-xs text-muted-foreground">
                    {getComplianceDescription(key)}
                  </p>
                </div>
                <Switch
                  id={key}
                  checked={value}
                  onCheckedChange={(checked) => handleComplianceToggle(key as keyof typeof config.complianceGates, checked)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getComplianceDescription(key: string): string {
  const descriptions: Record<string, string> = {
    depositRequiredForPerks: 'Must have deposit to access perks',
    expiredCredentialsZeroScore: 'No points if credentials expired',
    kycRequiredForPoints: 'Must complete KYC to earn points',
    complianceCleanRequired: 'Must have clean compliance status',
    onPlatformOnly: 'Only on-platform deals count'
  };
  return descriptions[key] || 'Compliance gate';
}
