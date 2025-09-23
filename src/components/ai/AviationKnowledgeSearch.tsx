import React, { useState, useEffect } from 'react';
import { Search, Plane, MapPin, Clock, Users, DollarSign, Shield, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface KnowledgeResult {
  id: string;
  category: 'aircraft' | 'airport' | 'regulation' | 'route' | 'crew' | 'market' | 'safety';
  title: string;
  summary: string;
  details: string;
  confidence: number;
  sources: string[];
  lastUpdated: Date;
}

interface AviationKnowledgeSearchProps {
  isVisible: boolean;
  onClose: () => void;
}

export const AviationKnowledgeSearch: React.FC<AviationKnowledgeSearchProps> = ({
  isVisible,
  onClose
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<KnowledgeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState<KnowledgeResult | null>(null);

  // Aviation knowledge base
  const aviationKnowledge: KnowledgeResult[] = [
    {
      id: 'g650-specs',
      category: 'aircraft',
      title: 'Gulfstream G650ER Specifications',
      summary: 'Ultra-long-range business jet with 7,500nm range',
      details: 'The Gulfstream G650ER can carry up to 19 passengers with a range of 7,500nm. It features a maximum cruise speed of Mach 0.925 and can fly at altitudes up to 51,000 feet. The aircraft has a cabin volume of 2,140 cubic feet and includes a full galley, private lavatory, and 16 large panoramic windows.',
      confidence: 0.98,
      sources: ['Gulfstream Specifications', 'FAA Type Certificate', 'Industry Reports'],
      lastUpdated: new Date('2024-01-15')
    },
    {
      id: 'european-ets',
      category: 'regulation',
      title: 'European Union Emissions Trading System (EU ETS)',
      summary: 'Carbon pricing system for flights within the EU',
      details: 'EU ETS applies to all flights departing from or arriving at airports in the European Economic Area. Operators must surrender allowances for their CO2 emissions. The system covers approximately 40% of EU emissions and includes both domestic and international flights.',
      confidence: 0.95,
      sources: ['EU Commission', 'EASA Regulations', 'Carbon Market Reports'],
      lastUpdated: new Date('2024-01-10')
    },
    {
      id: 'transatlantic-routes',
      category: 'route',
      title: 'Transatlantic Flight Routes and Alternatives',
      summary: 'Optimal routing between North America and Europe',
      details: 'Popular transatlantic routes include JFK-LHR, BOS-LHR, and LAX-LHR. Alternative routing options via Shannon (EINN), Reykjavik (BIKF), or Gander (CYQX) can provide fuel stops and weather alternatives. North Atlantic Tracks (NAT) provide organized routes that change daily based on weather.',
      confidence: 0.92,
      sources: ['NAT OPS Manual', 'FAA Advisory Circulars', 'Eurocontrol'],
      lastUpdated: new Date('2024-01-12')
    },
    {
      id: 'crew-requirements',
      category: 'crew',
      title: 'Business Aviation Crew Requirements',
      summary: 'Minimum crew requirements for different aircraft categories',
      details: 'For aircraft over 12,500 lbs, two pilots are required. Cabin crew requirements vary by passenger count: 1-19 passengers typically require 1-2 cabin crew, 20+ passengers may require additional crew. All crew must hold appropriate licenses and medical certificates.',
      confidence: 0.94,
      sources: ['FAR Part 91', 'EASA Regulations', 'Industry Standards'],
      lastUpdated: new Date('2024-01-08')
    },
    {
      id: 'fuel-costs-2024',
      category: 'market',
      title: 'Jet Fuel Market Analysis 2024',
      summary: 'Current fuel pricing and market trends',
      details: 'Jet fuel prices in 2024 average $2.85/gallon globally, with regional variations. Prices are influenced by crude oil costs, refining margins, and seasonal demand. Sustainable Aviation Fuel (SAF) premiums range from $3-6/gallon above conventional jet fuel.',
      confidence: 0.89,
      sources: ['IATA Fuel Monitor', 'Energy Information Administration', 'Market Reports'],
      lastUpdated: new Date('2024-01-20')
    },
    {
      id: 'weather-minimums',
      category: 'safety',
      title: 'Weather Minimums for Business Aviation',
      summary: 'Instrument approach and landing minimums',
      details: 'Standard instrument approach minimums vary by approach type: ILS Category I (200 ft decision height), ILS Category II (100 ft), ILS Category III (0 ft). Weather minimums for VFR operations require 3 miles visibility and 1,000 ft ceiling. Special considerations apply for mountainous terrain and coastal areas.',
      confidence: 0.96,
      sources: ['FAA AIM', 'ICAO Standards', 'Weather Services'],
      lastUpdated: new Date('2024-01-05')
    }
  ];

  const searchKnowledge = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter results based on query
    const filteredResults = aviationKnowledge.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.details.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setResults(filteredResults);
    setIsSearching(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'aircraft': return <Plane className="w-4 h-4" />;
      case 'airport': return <MapPin className="w-4 h-4" />;
      case 'regulation': return <Shield className="w-4 h-4" />;
      case 'route': return <MapPin className="w-4 h-4" />;
      case 'crew': return <Users className="w-4 h-4" />;
      case 'market': return <DollarSign className="w-4 h-4" />;
      case 'safety': return <Shield className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'aircraft': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'airport': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'regulation': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'route': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'crew': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'market': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'safety': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.95) return 'bg-green-500';
    if (confidence >= 0.9) return 'bg-yellow-500';
    if (confidence >= 0.8) return 'bg-orange-500';
    return 'bg-red-500';
  };

  useEffect(() => {
    if (query) {
      const timeoutId = setTimeout(() => {
        searchKnowledge(query);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="terminal-card border-terminal-border bg-terminal-card/95 backdrop-blur-sm w-full max-w-4xl max-h-[90vh]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-orange-400" />
              Aviation Knowledge Search
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-neutral-400 hover:text-white"
            >
              ×
            </Button>
          </div>
          <div className="relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search aircraft specs, regulations, routes, crew requirements..."
              className="pl-10 bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          </div>
        </CardHeader>

        <CardContent>
          {isSearching && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
              <span className="ml-3 text-neutral-400">Searching aviation knowledge...</span>
            </div>
          )}

          {results.length > 0 && (
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="p-4 bg-neutral-800 rounded-lg border border-neutral-700 hover:border-orange-500/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedResult(result)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded ${getCategoryColor(result.category)}`}>
                          {getCategoryIcon(result.category)}
                        </div>
                        <h3 className="font-semibold text-white">{result.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getConfidenceColor(result.confidence)}`}></div>
                        <span className="text-xs text-neutral-400">
                          {Math.round(result.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-neutral-300 mb-3">{result.summary}</p>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getCategoryColor(result.category)}>
                        {result.category}
                      </Badge>
                      <span className="text-xs text-neutral-500">
                        Updated: {result.lastUpdated.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {query && !isSearching && results.length === 0 && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400">No results found for "{query}"</p>
              <p className="text-sm text-neutral-500 mt-2">
                Try searching for aircraft, regulations, routes, or crew requirements
              </p>
            </div>
          )}

          {!query && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400 mb-4">Search our aviation knowledge base</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-neutral-500">
                  <strong className="text-white">Popular searches:</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• Gulfstream G650ER specs</li>
                    <li>• EU ETS regulations</li>
                    <li>• Transatlantic routes</li>
                    <li>• Crew requirements</li>
                  </ul>
                </div>
                <div className="text-neutral-500">
                  <strong className="text-white">Categories:</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• Aircraft specifications</li>
                    <li>• Regulatory compliance</li>
                    <li>• Route planning</li>
                    <li>• Market intelligence</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Result Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <Card className="terminal-card border-terminal-border bg-terminal-card/95 backdrop-blur-sm w-full max-w-2xl max-h-[90vh]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded ${getCategoryColor(selectedResult.category)}`}>
                    {getCategoryIcon(selectedResult.category)}
                  </div>
                  <CardTitle className="text-white">{selectedResult.title}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedResult(null)}
                  className="text-neutral-400 hover:text-white"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getCategoryColor(selectedResult.category)}>
                    {selectedResult.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${getConfidenceColor(selectedResult.confidence)}`}></div>
                    <span className="text-sm text-neutral-400">
                      {Math.round(selectedResult.confidence * 100)}% confidence
                    </span>
                  </div>
                </div>
                
                <div className="p-4 bg-neutral-800 rounded-lg">
                  <p className="text-neutral-300 leading-relaxed">{selectedResult.details}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Sources:</h4>
                  <ul className="space-y-1">
                    {selectedResult.sources.map((source, index) => (
                      <li key={index} className="text-sm text-neutral-400">• {source}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="text-xs text-neutral-500">
                  Last updated: {selectedResult.lastUpdated.toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
