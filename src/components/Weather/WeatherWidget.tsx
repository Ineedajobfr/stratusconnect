// Real-time Weather Widget - Industry Standard
// FCA Compliant Aviation Platform

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Eye, 
  Thermometer,
  Droplets,
  Gauge,
  AlertTriangle,
  RefreshCw,
  MapPin,
  Clock
} from 'lucide-react';
import { weatherService, type WeatherCondition, type WeatherAlert } from '@/lib/weather-service';
import { toast } from '@/hooks/use-toast';

interface WeatherWidgetProps {
  airports: string[];
  showAlerts?: boolean;
  showForecast?: boolean;
  className?: string;
}

export function WeatherWidget({ 
  airports, 
  showAlerts = true, 
  showForecast = false,
  className = ''
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherCondition[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    loadWeather();
    const interval = setInterval(loadWeather, 5 * 60 * 1000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, [airports]);

  const loadWeather = async () => {
    try {
      setLoading(true);
      const weatherData = await weatherService.getMultiAirportWeather(airports);
      setWeather(weatherData);
      
      if (showAlerts) {
        const alertData = await weatherService.getWeatherAlerts('region');
        setAlerts(alertData);
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading weather:', error);
      toast({
        title: "Weather Error",
        description: "Failed to load weather data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: WeatherCondition) => {
    if (condition.conditions.includes('TS')) return <CloudRain className="w-6 h-6 text-red-400" />;
    if (condition.conditions.includes('RA')) return <CloudRain className="w-6 h-6 text-blue-400" />;
    if (condition.conditions.includes('SN')) return <CloudRain className="w-6 h-6 text-gray-400" />;
    if (condition.conditions.includes('FG') || condition.conditions.includes('BR')) return <Cloud className="w-6 h-6 text-gray-400" />;
    if (condition.ceiling.height < 2000) return <Cloud className="w-6 h-6 text-gray-500" />;
    return <Sun className="w-6 h-6 text-yellow-400" />;
  };

  const getConditionColor = (condition: WeatherCondition) => {
    if (condition.visibility < 1) return 'text-red-400';
    if (condition.wind.speed > 25) return 'text-orange-400';
    if (condition.ceiling.height < 1000) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-500/20 text-blue-400';
      case 'moderate': return 'bg-yellow-500/20 text-yellow-400';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'severe': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatWind = (wind: WeatherCondition['wind']) => {
    const direction = Math.round(wind.direction / 10) * 10;
    return `${direction}°/${wind.speed}kt${wind.gust ? `G${wind.gust}` : ''}`;
  };

  if (loading && weather.length === 0) {
    return (
      <Card className={`terminal-card ${className}`}>
        <CardContent className="text-center py-12">
          <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-accent" />
          <p className="text-gunmetal">Loading weather data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="terminal-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-accent" />
              Weather Conditions
            </CardTitle>
            <div className="flex items-center gap-2">
              {lastUpdated && (
                <span className="text-xs text-gunmetal">
                  Updated {formatTime(lastUpdated.toISOString())}
                </span>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={loadWeather}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {weather.length === 0 ? (
            <div className="text-center py-8 text-gunmetal">
              <Cloud className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No weather data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {weather.map((condition, index) => (
                <div key={index} className="p-4 border border-terminal-border rounded-lg bg-terminal-card/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getWeatherIcon(condition)}
                      <div>
                        <h3 className="font-semibold text-foreground">{condition.airport}</h3>
                        <p className="text-sm text-gunmetal">{condition.icao}</p>
                      </div>
                    </div>
                    <Badge className={getConditionColor(condition)}>
                      {condition.conditions.length > 0 ? condition.conditions.join(' ') : 'CLR'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-gunmetal" />
                      <div>
                        <p className="text-xs text-gunmetal">Temp</p>
                        <p className="text-sm font-medium text-foreground">
                          {condition.temperature}°C
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-gunmetal" />
                      <div>
                        <p className="text-xs text-gunmetal">Wind</p>
                        <p className="text-sm font-medium text-foreground">
                          {formatWind(condition.wind)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gunmetal" />
                      <div>
                        <p className="text-xs text-gunmetal">Visibility</p>
                        <p className="text-sm font-medium text-foreground">
                          {condition.visibility}SM
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Cloud className="w-4 h-4 text-gunmetal" />
                      <div>
                        <p className="text-xs text-gunmetal">Ceiling</p>
                        <p className="text-sm font-medium text-foreground">
                          {condition.ceiling.height > 0 ? `${condition.ceiling.height}ft` : 'Unlimited'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 p-2 bg-terminal-card/50 rounded text-xs font-mono text-gunmetal">
                    <p className="font-semibold text-foreground mb-1">METAR:</p>
                    <p>{condition.metar}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showAlerts && alerts.length > 0 && (
        <Card className="terminal-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              Weather Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-3 border border-terminal-border rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{alert.title}</h4>
                        <Badge className={getAlertColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gunmetal mb-2">{alert.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gunmetal">
                        <span>Valid: {formatTime(alert.validFrom)} - {formatTime(alert.validTo)}</span>
                        <span>Source: {alert.source}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
