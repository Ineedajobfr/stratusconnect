// Carbon Methodology Selector with Footer Citation
// FCA Compliant Aviation Platform

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Leaf, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle,
  Info,
  BookOpen
} from 'lucide-react';
import { BadgeVerificationService } from '@/lib/badge-verification';

export interface CarbonMethodologySelectorProps {
  onMethodologyChange: (methodology: Record<string, unknown>) => void;
  selectedMethodology?: string;
}

export function CarbonMethodologySelector({ 
  onMethodologyChange, 
  selectedMethodology 
}: CarbonMethodologySelectorProps) {
  const [selected, setSelected] = useState(selectedMethodology || 'icao_carbon_calculator');
  
  const methodologies = BadgeVerificationService.getAllCarbonMethodologies();
  const currentMethodology = BadgeVerificationService.getCarbonMethodology(selected);

  const handleMethodologyChange = (value: string) => {
    setSelected(value);
    const methodology = BadgeVerificationService.getCarbonMethodology(value);
    onMethodologyChange(methodology);
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-white bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case 'high': return <CheckCircle className="w-4 h-4" />;
      case 'medium': return <AlertTriangle className="w-4 h-4" />;
      case 'low': return <AlertTriangle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Methodology Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            Carbon Calculation Methodology
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Methodology</label>
              <Select value={selected} onValueChange={handleMethodologyChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose carbon calculation method" />
                </SelectTrigger>
                <SelectContent>
                  {methodologies.map((methodology) => (
                    <SelectItem key={methodology.id} value={methodology.id}>
                      <div className="flex items-center gap-2">
                        <span>{methodology.name}</span>
                        <Badge className={getConfidenceColor(methodology.confidence)}>
                          {methodology.confidence}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {currentMethodology && (
              <div className="p-4 bg-slate-800 rounded-lg">
                <div className="flex items-start gap-3">
                  {getConfidenceIcon(currentMethodology.confidence)}
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">{currentMethodology.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{currentMethodology.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Confidence:</span>
                        <Badge className={getConfidenceColor(currentMethodology.confidence)}>
                          {currentMethodology.confidence}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Updated:</span>
                        <span>{new Date(currentMethodology.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(currentMethodology.source, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Source
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer Citation */}
      <Card className="border-blue-200 bg-slate-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Methodology Citation</h4>
              <p className="text-blue-700 text-sm mb-2">
                Carbon emissions are calculated using the selected methodology. 
                All calculations are estimates and should not be considered as verified third-party attestations.
              </p>
              {currentMethodology && (
                <div className="text-xs text-blue-600">
                  <p><strong>Source:</strong> {currentMethodology.source}</p>
                  <p><strong>Last Updated:</strong> {new Date(currentMethodology.lastUpdated).toLocaleDateString()}</p>
                  <p><strong>Confidence Level:</strong> {currentMethodology.confidence}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-yellow-200 bg-slate-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Important Disclaimer</h4>
              <p className="text-yellow-700 text-sm">
                Carbon emission calculations are estimates based on the selected methodology. 
                These figures are provided for informational purposes only and do not constitute 
                verified third-party attestations. For official carbon reporting, please consult 
                certified environmental consultants or use verified carbon calculation tools.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
