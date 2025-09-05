import { useState } from 'react';
import { CalendarIcon, Calculator, MapPin, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface QuoteEstimate {
  est_price_usd: number;
  block_time_hr: number;
  reposition_nm: number;
  factors: {
    base_usd_per_hr: number;
    reposition_factor: number;
    demand_factor: number;
    lead_time_factor: number;
  };
}

export default function QuoteEstimator() {
  const [formData, setFormData] = useState({
    origin_icao: '',
    dest_icao: '',
    pax: '',
    class: '',
    lead_days: '7'
  });
  
  const [estimate, setEstimate] = useState<QuoteEstimate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.origin_icao || !formData.dest_icao || !formData.class) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase.functions.invoke('quote-estimate', {
        body: {
          origin_icao: formData.origin_icao.toUpperCase(),
          dest_icao: formData.dest_icao.toUpperCase(),
          pax: formData.pax ? parseInt(formData.pax) : null,
          class: formData.class,
          lead_days: parseInt(formData.lead_days)
        }
      });

      if (error) throw error;
      setEstimate(data);
    } catch (err) {
      console.error('Quote error:', err);
      setError('Failed to generate quote estimate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Quote Estimator</h1>
        <p className="text-muted-foreground">Get instant pricing estimates for private jet charters</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Flight Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin Airport (ICAO)*</Label>
                <Input
                  id="origin"
                  placeholder="e.g., EGKB"
                  value={formData.origin_icao}
                  onChange={(e) => setFormData(prev => ({ ...prev, origin_icao: e.target.value }))}
                  className="uppercase"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dest">Destination Airport (ICAO)*</Label>
                <Input
                  id="dest"
                  placeholder="e.g., LFPB"
                  value={formData.dest_icao}
                  onChange={(e) => setFormData(prev => ({ ...prev, dest_icao: e.target.value }))}
                  className="uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pax">Passengers</Label>
                <Input
                  id="pax"
                  type="number"
                  placeholder="6"
                  value={formData.pax}
                  onChange={(e) => setFormData(prev => ({ ...prev, pax: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Aircraft Class*</Label>
                <Select value={formData.class} onValueChange={(value) => setFormData(prev => ({ ...prev, class: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very_light">Very Light Jet</SelectItem>
                    <SelectItem value="light">Light Jet</SelectItem>
                    <SelectItem value="midsize">Midsize Jet</SelectItem>
                    <SelectItem value="super_midsize">Super Midsize</SelectItem>
                    <SelectItem value="heavy">Heavy Jet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead_days">Lead Time (days)</Label>
                <Select value={formData.lead_days} onValueChange={(value) => setFormData(prev => ({ ...prev, lead_days: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="2">2 days</SelectItem>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">1 week</SelectItem>
                    <SelectItem value="14">2 weeks</SelectItem>
                    <SelectItem value="30">1 month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Calculating...' : 'Get Estimate'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {estimate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-primary">
              ${estimate.est_price_usd.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Block Time</span>
                </div>
                <Badge variant="secondary">{estimate.block_time_hr}h</Badge>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">Reposition</span>
                </div>
                <Badge variant="secondary">{estimate.reposition_nm}nm</Badge>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium mb-1">Base Rate</div>
                <Badge variant="outline">${estimate.factors.base_usd_per_hr}/hr</Badge>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium mb-1">Factors</div>
                <div className="text-xs space-y-1">
                  <div>Reposition: {estimate.factors.reposition_factor}x</div>
                  <div>Demand: {estimate.factors.demand_factor}x</div>
                  <div>Lead: {estimate.factors.lead_time_factor}x</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}