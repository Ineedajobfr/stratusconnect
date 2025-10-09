import { EnterpriseCard } from '@/components/enterprise/EnterpriseCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Calendar, Car, Clock, DollarSign, Leaf, Plane, Search, Train, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';

interface TravelOption {
  mode: 'private_aviation' | 'commercial' | 'train' | 'car';
  totalTime: number; // minutes
  travelTime: number; // actual transit minutes
  waitTime: number; // security, transfers, etc.
  cost: number;
  co2: number; // kg
  productivityHours: number;
  comfort: number; // 1-10
}

interface RouteResult {
  from: string;
  to: string;
  distance: number; // km
  options: TravelOption[];
  timeSaved: number; // minutes saved with private aviation
  costPerProductiveHour: number;
}

export const TravelComparator: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [result, setResult] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateRoute = async () => {
    if (!from || !to) return;
    
    setLoading(true);
    
    // Simulate calculation (in production, use real geocoding + route APIs)
    setTimeout(() => {
      const distance = 1200; // Mock distance in km
      
      const privateAviation: TravelOption = {
        mode: 'private_aviation',
        totalTime: 150, // 2.5 hours total
        travelTime: 120, // 2 hours flight
        waitTime: 30, // 30 min to airport + boarding
        cost: 24500,
        co2: 2400, // kg
        productivityHours: 1.5, // Can work during flight
        comfort: 10,
      };

      const commercial: TravelOption = {
        mode: 'commercial',
        totalTime: 420, // 7 hours total
        travelTime: 140, // 2h20m flight
        waitTime: 280, // 2h early, 1h security, 1h transfer, 40m baggage
        cost: 450,
        co2: 250, // kg per passenger
        productivityHours: 0.5, // Limited work on commercial
        comfort: 4,
      };

      const train: TravelOption = {
        mode: 'train',
        totalTime: 900, // 15 hours
        travelTime: 840, // 14 hours
        waitTime: 60,
        cost: 180,
        co2: 80, // kg
        productivityHours: 4, // Can work on train
        comfort: 6,
      };

      const car: TravelOption = {
        mode: 'car',
        totalTime: 780, // 13 hours
        travelTime: 780,
        waitTime: 0,
        cost: 250, // gas + wear
        co2: 180, // kg
        productivityHours: 0, // Can't work while driving
        comfort: 5,
      };

      const timeSaved = commercial.totalTime - privateAviation.totalTime;
      const costPerProductiveHour = privateAviation.cost / (privateAviation.productivityHours + (timeSaved / 60));

      setResult({
        from,
        to,
        distance,
        options: [privateAviation, commercial, train, car],
        timeSaved,
        costPerProductiveHour,
      });
      
      setLoading(false);
    }, 1000);
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'private_aviation': return <Plane className="w-5 h-5" />;
      case 'commercial': return <Plane className="w-5 h-5" />;
      case 'train': return <Train className="w-5 h-5" />;
      case 'car': return <Car className="w-5 h-5" />;
      default: return null;
    }
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'private_aviation': return 'Private Aviation';
      case 'commercial': return 'Commercial Flight';
      case 'train': return 'Train';
      case 'car': return 'Car/Road';
      default: return mode;
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      <EnterpriseCard
        title="Door-to-Door Travel Comparator"
        description="Compare private aviation against all alternatives - See the REAL time and cost savings"
        status="live"
      >
        {/* Search Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-mono text-white/60 mb-2 block">FROM</label>
            <Input
              type="text"
              placeholder="New York, NY"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="bg-black/30 border-enterprise-primary/20 text-white font-mono"
            />
          </div>
          
          <div>
            <label className="text-sm font-mono text-white/60 mb-2 block">TO</label>
            <Input
              type="text"
              placeholder="Miami, FL"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="bg-black/30 border-enterprise-primary/20 text-white font-mono"
            />
          </div>
          
          <div className="flex items-end">
            <Button
              onClick={calculateRoute}
              disabled={loading || !from || !to}
              className="w-full bg-enterprise-primary hover:bg-enterprise-primary/80"
            >
              {loading ? (
                <>
                  <div className="enterprise-spinner mr-2" />
                  Calculating...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Compare Routes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-enterprise-gold/10 border-enterprise-gold/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-mono text-enterprise-gold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    TIME SAVED
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-enterprise-gold font-mono">
                    {formatTime(result.timeSaved)}
                  </div>
                  <p className="text-xs text-white/60 mt-1 font-mono">
                    vs commercial aviation
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-enterprise-success/10 border-enterprise-success/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-mono text-enterprise-success flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    PRODUCTIVITY GAIN
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-enterprise-success font-mono">
                    {result.options[0].productivityHours.toFixed(1)}h
                  </div>
                  <p className="text-xs text-white/60 mt-1 font-mono">
                    work hours during flight
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-enterprise-primary/10 border-enterprise-primary/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-mono text-enterprise-primary flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    COST PER PRODUCTIVE HOUR
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-enterprise-primary font-mono">
                    ${Math.round(result.costPerProductiveHour)}
                  </div>
                  <p className="text-xs text-white/60 mt-1 font-mono">
                    effective hourly cost
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Comparison Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {result.options.map((option) => (
                <Card
                  key={option.mode}
                  className={cn(
                    'border-2 transition-all hover:scale-105',
                    option.mode === 'private_aviation'
                      ? 'bg-enterprise-gold/5 border-enterprise-gold'
                      : 'bg-black/30 border-enterprise-primary/20'
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getModeIcon(option.mode)}
                        <CardTitle className="text-sm font-mono">
                          {getModeLabel(option.mode)}
                        </CardTitle>
                      </div>
                      {option.mode === 'private_aviation' && (
                        <Badge className="status-badge status-badge-success">BEST</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Total Time */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-3 h-3 text-white/60" />
                        <span className="text-xs text-white/60 font-mono">TOTAL TIME</span>
                      </div>
                      <div className={cn(
                        'text-2xl font-bold font-mono',
                        option.mode === 'private_aviation' ? 'text-enterprise-gold' : 'text-white'
                      )}>
                        {formatTime(option.totalTime)}
                      </div>
                      <div className="text-xs text-white/50 font-mono mt-1">
                        {formatTime(option.travelTime)} travel + {formatTime(option.waitTime)} wait
                      </div>
                    </div>

                    {/* Cost */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-3 h-3 text-white/60" />
                        <span className="text-xs text-white/60 font-mono">COST</span>
                      </div>
                      <div className="text-xl font-bold font-mono text-white">
                        ${option.cost.toLocaleString()}
                      </div>
                    </div>

                    {/* CO2 */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Leaf className="w-3 h-3 text-white/60" />
                        <span className="text-xs text-white/60 font-mono">CO2 EMISSIONS</span>
                      </div>
                      <div className="text-lg font-mono text-white">
                        {option.co2.toLocaleString()} kg
                      </div>
                    </div>

                    {/* Productivity */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-3 h-3 text-white/60" />
                        <span className="text-xs text-white/60 font-mono">PRODUCTIVE HOURS</span>
                      </div>
                      <div className="text-lg font-bold text-enterprise-success font-mono">
                        {option.productivityHours}h
                      </div>
                    </div>

                    {/* Comfort Score */}
                    <div>
                      <div className="text-xs text-white/60 font-mono mb-1">COMFORT</div>
                      <div className="flex gap-1">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              'h-2 flex-1 rounded',
                              i < option.comfort
                                ? 'bg-enterprise-gold'
                                : 'bg-white/10'
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Book Button for Private Aviation */}
                    {option.mode === 'private_aviation' && (
                      <Button className="w-full bg-enterprise-gold text-black hover:bg-enterprise-gold/80 font-semibold">
                        Book This Flight
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Insights */}
            <EnterpriseCard
              title="Journey Insights"
              description="Why private aviation wins for business travelers"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-enterprise-gold/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-enterprise-gold" />
                    </div>
                    <div>
                      <div className="font-semibold text-white font-mono">Save {formatTime(result.timeSaved)}</div>
                      <div className="text-sm text-white/60 font-mono">
                        Eliminate {formatTime(result.options[1].waitTime)} of waiting time at airports
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-enterprise-success/20 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-enterprise-success" />
                    </div>
                    <div>
                      <div className="font-semibold text-white font-mono">
                        Work {result.options[0].productivityHours}h During Flight
                      </div>
                      <div className="text-sm text-white/60 font-mono">
                        Private cabins allow focused work vs {result.options[1].productivityHours}h on commercial
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-enterprise-info/20 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-enterprise-info" />
                    </div>
                    <div>
                      <div className="font-semibold text-white font-mono">Same-Day Return Possible</div>
                      <div className="text-sm text-white/60 font-mono">
                        Complete your meeting and return home the same day
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-enterprise-primary/20 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 text-enterprise-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-white font-mono">
                        ${Math.round(result.costPerProductiveHour)}/Productive Hour
                      </div>
                      <div className="text-sm text-white/60 font-mono">
                        When you factor in time saved and work done, the value is clear
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-enterprise-warning/20 flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-4 h-4 text-enterprise-warning" />
                    </div>
                    <div>
                      <div className="font-semibold text-white font-mono">Carbon Offset Available</div>
                      <div className="text-sm text-white/60 font-mono">
                        Offset {result.options[0].co2}kg CO2 for ${Math.round(result.options[0].co2 * 0.02)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-enterprise-danger/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-enterprise-danger" />
                    </div>
                    <div>
                      <div className="font-semibold text-white font-mono">No Overnight Stay Needed</div>
                      <div className="text-sm text-white/60 font-mono">
                        Save ${350} on hotel + meals
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </EnterpriseCard>

            {/* Value Proposition */}
            <div className="bg-enterprise-gradient p-6 rounded-lg border border-enterprise-gold/30">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-enterprise-gold font-mono">
                  FOR EXECUTIVES EARNING $200+/HOUR
                </h3>
                <p className="text-white/80 font-mono">
                  The time saved ({formatTime(result.timeSaved)}) equals{' '}
                  <span className="text-enterprise-gold font-bold">
                    ${Math.round((result.timeSaved / 60) * 200)}
                  </span>{' '}
                  in productivity value
                </p>
                <p className="text-xl font-semibold text-white font-mono">
                  Making private aviation a{' '}
                  <span className="text-enterprise-success">cost-effective</span> choice
                </p>
              </div>
            </div>
          </div>
        )}

        {!result && (
          <div className="text-center py-12 text-white/40 font-mono">
            Enter your route to see the door-to-door comparison
          </div>
        )}
      </EnterpriseCard>
    </div>
  );
};

