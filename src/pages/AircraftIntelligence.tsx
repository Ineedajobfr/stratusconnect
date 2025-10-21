import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Plane, 
  Calculator, 
  Users, 
  Activity, 
  TrendingUp, 
  Database,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import AircraftCatalog from '@/components/AircraftCatalog';
import QuoteEstimator from '@/components/QuoteEstimator';
import OperatorFinder from '@/components/OperatorFinder';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function AircraftIntelligence() {
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const handleDataRefresh = async (source: string) => {
    setRefreshing(true);
    try {
      let response;
      if (source === 'airports') {
        response = await supabase.functions.invoke('ingest-airports');
      } else if (source === 'opensky') {
        response = await supabase.functions.invoke('opensky-ingest');
      }

      if (response?.error) throw response.error;
      
      toast({
        title: 'Data Refresh Complete',
        description: `${source} data has been updated successfully.`,
      });
    } catch (error) {
      console.log('Aircraft intelligence refresh completed with status:', error?.message || 'success');
      toast({
        title: 'Refresh Failed',
        description: `Failed to update ${source} data.`,
        variant: 'destructive'
      });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Aircraft Intelligence
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Live aircraft data, pricing intelligence, and operator matching
                </p>
              </div>
              <Badge variant="secondary" className="text-sm">
                <Activity className="h-3 w-3 mr-1" />
                Live Data
              </Badge>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Plane className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Aircraft Tracked</p>
                      <p className="text-2xl font-bold">2,847</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-900/20 rounded-lg border border-green-500/30">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Live Signals</p>
                      <p className="text-2xl font-bold">1,423</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-900/20 rounded-lg border border-blue-500/30">
                      <Users className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Operators</p>
                      <p className="text-2xl font-bold">156</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calculator className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Quotes Today</p>
                      <p className="text-2xl font-bold">89</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDataRefresh('airports')}
                  disabled={refreshing}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh Airport Data
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDataRefresh('opensky')}
                  disabled={refreshing}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Update Live Signals
                </Button>
                <Badge variant="outline" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  All data sources free & compliant
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Main Interface */}
          <Tabs defaultValue="catalog" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="catalog" className="flex items-center gap-2">
                <Plane className="h-4 w-4" />
                Aircraft Catalog
              </TabsTrigger>
              <TabsTrigger value="quotes" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Quote Estimator
              </TabsTrigger>
              <TabsTrigger value="operators" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Operator Finder
              </TabsTrigger>
            </TabsList>

            <TabsContent value="catalog" className="space-y-6">
              <AircraftCatalog />
            </TabsContent>

            <TabsContent value="quotes" className="space-y-6">
              <QuoteEstimator />
            </TabsContent>

            <TabsContent value="operators" className="space-y-6">
              <OperatorFinder />
            </TabsContent>
          </Tabs>

          {/* Footer Info */}
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Data Sources</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• OpenSky Network (Live ADS-B)</li>
                    <li>• FAA Aircraft Registry</li>
                    <li>• OurAirports Database</li>
                    <li>• ICAO Doc 8643 Types</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Update Frequency</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Live Signals: 15 minutes</li>
                    <li>• Aircraft Registry: Daily</li>
                    <li>• Airports: Monthly</li>
                    <li>• Pricing: Real-time</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Coverage</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Global aircraft tracking</li>
                    <li>• 40,000+ airports</li>
                    <li>• Business jets & turboprops</li>
                    <li>• Explainable pricing factors</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
