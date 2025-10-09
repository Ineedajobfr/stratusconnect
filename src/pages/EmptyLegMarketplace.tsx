import { EnterpriseCard } from '@/components/enterprise/EnterpriseCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { smartLegFinder, type LegMatch } from '@/lib/smart-leg-finder';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Bell, Calendar as CalendarIcon, Plane, Search, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function EmptyLegMarketplace() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [flexibility, setFlexibility] = useState(2); // Days
  const [maxPrice, setMaxPrice] = useState(50000);
  const [aircraftType, setAircraftType] = useState('all');
  const [matches, setMatches] = useState<LegMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [watching, setWatching] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load popular routes on mount
    loadPopularEmptyLegs();
  }, []);

  const loadPopularEmptyLegs = async () => {
    setLoading(true);
    try {
      const allLegs = await smartLegFinder.getAllEmptyLegs();
      // Convert to matches with 100% score for display
      const displayMatches = allLegs.slice(0, 20).map(leg => ({
        emptyLeg: leg,
        matchScore: 100,
        matchType: 'exact' as const,
        savings: 60,
        explanation: 'Available now',
        confidence: 1.0,
      }));
      setMatches(displayMatches);
    } catch (error) {
      console.error('Failed to load empty legs:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchEmptyLegs = async () => {
    if (!from || !to) {
      alert('Please enter both origin and destination');
      return;
    }

    setLoading(true);
    try {
      // Mock coordinates - in production, geocode from airport names
      const foundMatches = await smartLegFinder.findMatches({
        from: { lat: 40.7128, lon: -74.0060, name: from },
        to: { lat: 25.7617, lon: -80.1918, name: to },
        date: date.toISOString().split('T')[0],
        flexibleDates: flexibility,
        flexibleDistance: 100,
        passengers: 1,
      });

      setMatches(foundMatches);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const watchRoute = async (legId: string) => {
    setWatching((prev) => {
      const updated = new Set(prev);
      if (updated.has(legId)) {
        updated.delete(legId);
      } else {
        updated.add(legId);
      }
      return updated;
    });
  };

  const shareEmptyLeg = (leg: any) => {
    const url = `${window.location.origin}/empty-legs/${leg.id}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const getMatchTypeBadge = (type: string) => {
    const config = {
      exact: { label: 'EXACT MATCH', className: 'status-badge-success' },
      partial: { label: 'PARTIAL MATCH', className: 'status-badge-info' },
      reroute: { label: 'REROUTE', className: 'status-badge-warning' },
      date_flexible: { label: 'DATE FLEX', className: 'status-badge-info' },
      backhaul: { label: 'BACKHAUL', className: 'status-badge-warning' },
    };

    return config[type as keyof typeof config] || { label: type, className: 'status-badge-neutral' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-enterprise-gold font-mono">Empty Leg Marketplace</h1>
            <p className="text-white/60 mt-2 font-mono">Save up to 75% on private aviation with AI-powered empty leg matching</p>
          </div>
          <Badge className="status-badge status-badge-success text-lg px-4 py-2">
            <span className="mr-2">●</span>
            {matches.length} AVAILABLE
          </Badge>
        </div>

        {/* Search Form */}
        <EnterpriseCard
          title="Find Your Perfect Empty Leg"
          description="Our AI matches you with the best available flights"
          actions={
            <Button
              onClick={searchEmptyLegs}
              disabled={loading}
              className="bg-enterprise-gold text-black hover:bg-enterprise-gold/80"
            >
              {loading ? (
                <>
                  <div className="enterprise-spinner mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search Flights
                </>
              )}
            </Button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-mono text-white/60 mb-2 block">FROM</label>
              <Input
                type="text"
                placeholder="Airport or City"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="bg-black/30 border-enterprise-primary/20 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-sm font-mono text-white/60 mb-2 block">TO</label>
              <Input
                type="text"
                placeholder="Airport or City"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="bg-black/30 border-enterprise-primary/20 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-sm font-mono text-white/60 mb-2 block">DATE</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-black/30 border-enterprise-primary/20 text-white justify-start"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, 'MMM dd, yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-mono text-white/60 mb-2 block">FLEXIBILITY (±{flexibility} days)</label>
              <Slider
                value={[flexibility]}
                onValueChange={([val]) => setFlexibility(val)}
                max={7}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-sm font-mono text-white/60 mb-2 block">MAX PRICE</label>
              <Input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="bg-black/30 border-enterprise-primary/20 text-white font-mono"
              />
            </div>
          </div>
        </EnterpriseCard>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {matches.map((match) => {
            const badgeConfig = getMatchTypeBadge(match.matchType);
            const isWatching = watching.has(match.emptyLeg.id);

            return (
              <Card
                key={match.emptyLeg.id}
                className="enterprise-card hover:shadow-2xl transition-all"
              >
                <CardHeader className="enterprise-card-header">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Plane className="w-5 h-5 text-enterprise-gold" />
                        <span className="font-semibold text-white font-mono">
                          {match.emptyLeg.aircraft_type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn('status-badge', badgeConfig.className)}>
                          {badgeConfig.label}
                        </Badge>
                        <Badge className="status-badge status-badge-success">
                          {match.matchScore}% MATCH
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-enterprise-gold font-mono">
                        ${match.emptyLeg.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/60 font-mono">
                        {match.savings}% off
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="enterprise-card-body space-y-4">
                  {/* Route */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="font-mono text-white text-sm">{match.emptyLeg.from.name}</div>
                      <div className="font-mono text-xs text-white/60">{match.emptyLeg.from.iata}</div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="h-px w-12 bg-enterprise-gold relative">
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                          <Plane className="w-3 h-3 text-enterprise-gold" />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 text-right">
                      <div className="font-mono text-white text-sm">{match.emptyLeg.to.name}</div>
                      <div className="font-mono text-xs text-white/60">{match.emptyLeg.to.iata}</div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div>
                      <div className="text-white/60 mb-1">DATE</div>
                      <div className="text-white">{format(new Date(match.emptyLeg.date), 'MMM dd, yyyy')}</div>
                    </div>
                    <div>
                      <div className="text-white/60 mb-1">OPERATOR</div>
                      <div className="text-white">{match.emptyLeg.operator_name}</div>
                    </div>
                    <div>
                      <div className="text-white/60 mb-1">CAPACITY</div>
                      <div className="text-white">{match.emptyLeg.aircraft_capacity} pax</div>
                    </div>
                    <div>
                      <div className="text-white/60 mb-1">CONFIDENCE</div>
                      <div className="text-enterprise-success">{(match.confidence * 100).toFixed(0)}%</div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="bg-black/20 p-3 rounded border border-enterprise-primary/10">
                    <p className="text-xs font-mono text-white/80">{match.explanation}</p>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      className="bg-enterprise-gold text-black hover:bg-enterprise-gold/80 font-semibold"
                      size="sm"
                    >
                      <Plane className="w-3 h-3 mr-1" />
                      Book
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => watchRoute(match.emptyLeg.id)}
                      className={cn(
                        'border-enterprise-primary/20 text-white hover:bg-enterprise-primary/10',
                        isWatching && 'bg-enterprise-warning/20 border-enterprise-warning'
                      )}
                    >
                      <Bell className={cn('w-3 h-3 mr-1', isWatching && 'fill-current')} />
                      {isWatching ? 'Watching' : 'Watch'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => shareEmptyLeg(match.emptyLeg)}
                      className="border-enterprise-primary/20 text-white hover:bg-enterprise-primary/10"
                    >
                      <Share2 className="w-3 h-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {matches.length === 0 && !loading && (
          <div className="text-center py-12">
            <Plane className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/40 font-mono">No empty legs found. Try adjusting your search criteria.</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="enterprise-spinner" />
            <span className="ml-3 text-white/60 font-mono">Searching for matches...</span>
          </div>
        )}
      </div>
    </div>
  );
}

