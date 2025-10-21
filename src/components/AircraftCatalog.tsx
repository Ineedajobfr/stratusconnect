import { useState, useEffect } from 'react';
import { Search, Plane, MapPin, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Aircraft {
  tail_number: string;
  manufacturer: string;
  model: string;
  icao_type: string;
  seats: number;
  country: string;
}

export default function AircraftCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchAircraft = async (query: string) => {
    if (!query.trim()) {
      setAircraft([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.functions.invoke('aircraft-search', {
        body: { query }
      });

      if (error) throw error;
      setAircraft(data || []);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search aircraft');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchAircraft(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Aircraft Catalog</h1>
        <p className="text-muted-foreground">Search by model, tail number, or manufacturer</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search aircraft (e.g., Phenom 300, N123AB, Embraer)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Searching aircraft...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aircraft.map((ac) => (
          <Card key={ac.tail_number} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                {ac.tail_number}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="font-semibold">{ac.manufacturer} {ac.model}</h3>
                <Badge variant="secondary">{ac.icao_type}</Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {ac.seats} seats
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {ac.country}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {searchQuery && !loading && aircraft.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No aircraft found for "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}
