import { useState } from 'react';
import { Search, Award, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Operator {
  name: string;
  score: number;
  reasons: string[];
}

interface OperatorMatchResponse {
  operators: Operator[];
}

export default function OperatorFinder() {
  const [formData, setFormData] = useState({
    origin_icao: '',
    dest_icao: '',
    window_start: '',
    window_end: '',
    class: ''
  });
  
  const [operators, setOperators] = useState<Operator[]>([]);
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
      const { data, error } = await supabase.functions.invoke('operator-match', {
        body: {
          origin_icao: formData.origin_icao.toUpperCase(),
          dest_icao: formData.dest_icao.toUpperCase(),
          window_start: formData.window_start,
          window_end: formData.window_end,
          class: formData.class
        }
      });

      if (error) throw error;
      const response: OperatorMatchResponse = data;
      setOperators(response.operators || []);
    } catch (err) {
      console.error('Operator match error:', err);
      setError('Failed to find matching operators');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-900/20 text-green-400 border-green-500/30';
    if (score >= 60) return 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30';
    return 'bg-slate-900/20 text-slate-400 border-slate-500/30';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Operator Finder</h1>
        <p className="text-muted-foreground">Find qualified operators for your route and requirements</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Flight Requirements
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
                <Label htmlFor="window_start">Window Start</Label>
                <Input
                  id="window_start"
                  type="datetime-local"
                  value={formData.window_start}
                  onChange={(e) => setFormData(prev => ({ ...prev, window_start: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="window_end">Window End</Label>
                <Input
                  id="window_end"
                  type="datetime-local"
                  value={formData.window_end}
                  onChange={(e) => setFormData(prev => ({ ...prev, window_end: e.target.value }))}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Finding Operators...' : 'Find Operators'}
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

      {operators.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Matching Operators</h2>
          <div className="grid gap-4">
            {operators.map((operator, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{operator.name}</h3>
                        <Badge className={`${getScoreColor(operator.score)} font-bold`}>
                          {operator.score}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {operator.reasons.map((reason, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Award className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Score</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {formData.origin_icao && formData.dest_icao && formData.class && !loading && operators.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No operators found for the specified requirements</p>
        </div>
      )}
    </div>
  );
}
