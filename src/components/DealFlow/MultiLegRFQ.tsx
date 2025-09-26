// Multi-leg RFQ with Attachments and Special Requirements
// FCA Compliant Aviation Platform

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Upload, X, Calendar, Users, Package, Clock, FileText } from 'lucide-react';
import { rfqService } from '@/lib/rfq-service';

export interface RFQLeg {
  id: string;
  from: string;
  to: string;
  departureDate: string;
  departureTime: string;
  passengers: number;
  luggage: number;
  specialRequirements: string;
}

export interface RFQAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface MultiLegRFQ {
  id: string;
  brokerId: string;
  legs: RFQLeg[];
  totalPassengers: number;
  totalLuggage: number;
  catering: string;
  complianceNotes: string;
  attachments: RFQAttachment[];
  status: 'draft' | 'published' | 'quoted' | 'accepted' | 'cancelled';
  createdAt: string;
  expiresAt: string;
}

export function MultiLegRFQ() {
  const [rfq, setRfq] = useState<MultiLegRFQ>({
    id: `RFQ_${Date.now()}`,
    brokerId: 'broker_001',
    legs: [{
      id: 'leg_1',
      from: '',
      to: '',
      departureDate: '',
      departureTime: '',
      passengers: 1,
      luggage: 0,
      specialRequirements: ''
    }],
    totalPassengers: 1,
    totalLuggage: 0,
    catering: '',
    complianceNotes: '',
    attachments: [],
    status: 'draft',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  });

  const addLeg = () => {
    const newLeg: RFQLeg = {
      id: `leg_${Date.now()}`,
      from: '',
      to: '',
      departureDate: '',
      departureTime: '',
      passengers: 1,
      luggage: 0,
      specialRequirements: ''
    };
    setRfq(prev => ({
      ...prev,
      legs: [...prev.legs, newLeg]
    }));
  };

  const removeLeg = (legId: string) => {
    if (rfq.legs.length > 1) {
      setRfq(prev => ({
        ...prev,
        legs: prev.legs.filter(leg => leg.id !== legId)
      }));
    }
  };

  const updateLeg = (legId: string, field: keyof RFQLeg, value: string | number) => {
    setRfq(prev => ({
      ...prev,
      legs: prev.legs.map(leg => 
        leg.id === legId ? { ...leg, [field]: value } : leg
      )
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newAttachments: RFQAttachment[] = Array.from(files).map(file => ({
        id: `att_${Date.now()}_${Math.random()}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      }));
      
      setRfq(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newAttachments]
      }));
    }
  };

  const removeAttachment = (attachmentId: string) => {
    setRfq(prev => ({
      ...prev,
      attachments: prev.attachments.filter(att => att.id !== attachmentId)
    }));
  };

  const calculateTotals = () => {
    const totalPassengers = rfq.legs.reduce((sum, leg) => sum + leg.passengers, 0);
    const totalLuggage = rfq.legs.reduce((sum, leg) => sum + leg.luggage, 0);
    
    setRfq(prev => ({
      ...prev,
      totalPassengers,
      totalLuggage
    }));
  };

  const publishRFQ = async () => {
    try {
      // Calculate pricing breakdown
      const pricing = await rfqService.calculatePricing(
        rfq.legs, 
        'Gulfstream G650', // Default aircraft for now
        rfq.totalPassengers
      );
      
      // Update RFQ with pricing
      const updatedRfq = {
        ...rfq,
        totalValue: pricing.total,
        currency: pricing.currency
      };
      
      // Save to database
      const savedRfq = await rfqService.createRFQ(updatedRfq);
      
      // Publish to operators
      await rfqService.publishRFQ(savedRfq.id);
      
      setRfq(prev => ({
        ...prev,
        status: 'published',
        id: savedRfq.id,
        totalValue: pricing.total,
        currency: pricing.currency
      }));
      
      console.log('RFQ Published:', savedRfq);
    } catch (error) {
      console.error('Error publishing RFQ:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Multi-Leg RFQ Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Flight Legs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Flight Legs</h3>
              <Button onClick={addLeg} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Leg
              </Button>
            </div>
            
            {rfq.legs.map((leg, index) => (
              <Card key={leg.id} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Leg {index + 1}</h4>
                  {rfq.legs.length > 1 && (
                    <Button
                      onClick={() => removeLeg(leg.id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor={`from_${leg.id}`}>From (IATA)</Label>
                    <Input
                      id={`from_${leg.id}`}
                      value={leg.from}
                      onChange={(e) => updateLeg(leg.id, 'from', e.target.value.toUpperCase())}
                      placeholder="LHR"
                      maxLength={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`to_${leg.id}`}>To (IATA)</Label>
                    <Input
                      id={`to_${leg.id}`}
                      value={leg.to}
                      onChange={(e) => updateLeg(leg.id, 'to', e.target.value.toUpperCase())}
                      placeholder="JFK"
                      maxLength={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`date_${leg.id}`}>Departure Date</Label>
                    <Input
                      id={`date_${leg.id}`}
                      type="date"
                      value={leg.departureDate}
                      onChange={(e) => updateLeg(leg.id, 'departureDate', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`time_${leg.id}`}>Departure Time</Label>
                    <Input
                      id={`time_${leg.id}`}
                      type="time"
                      value={leg.departureTime}
                      onChange={(e) => updateLeg(leg.id, 'departureTime', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`passengers_${leg.id}`}>Passengers</Label>
                    <Input
                      id={`passengers_${leg.id}`}
                      type="number"
                      min="1"
                      max="20"
                      value={leg.passengers}
                      onChange={(e) => {
                        updateLeg(leg.id, 'passengers', parseInt(e.target.value) || 1);
                        calculateTotals();
                      }}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`luggage_${leg.id}`}>Luggage (pieces)</Label>
                    <Input
                      id={`luggage_${leg.id}`}
                      type="number"
                      min="0"
                      value={leg.luggage}
                      onChange={(e) => {
                        updateLeg(leg.id, 'luggage', parseInt(e.target.value) || 0);
                        calculateTotals();
                      }}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor={`requirements_${leg.id}`}>Special Requirements</Label>
                    <Textarea
                      id={`requirements_${leg.id}`}
                      value={leg.specialRequirements}
                      onChange={(e) => updateLeg(leg.id, 'specialRequirements', e.target.value)}
                      placeholder="VIP handling, customs clearance, etc."
                      rows={2}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Trip Summary */}
          <Card className="p-4 bg-slate-800">
            <h3 className="font-semibold mb-2">Trip Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Total Passengers: {rfq.totalPassengers}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>Total Luggage: {rfq.totalLuggage}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Legs: {rfq.legs.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Expires: {new Date(rfq.expiresAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>

          {/* Catering and Compliance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="catering">Catering Requirements</Label>
              <Textarea
                id="catering"
                value={rfq.catering}
                onChange={(e) => setRfq(prev => ({ ...prev, catering: e.target.value }))}
                placeholder="Dietary restrictions, preferences, etc."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="compliance">Compliance Notes</Label>
              <Textarea
                id="compliance"
                value={rfq.complianceNotes}
                onChange={(e) => setRfq(prev => ({ ...prev, complianceNotes: e.target.value }))}
                placeholder="Regulatory requirements, permits, etc."
                rows={3}
              />
            </div>
          </div>

          {/* Attachments */}
          <div>
            <Label htmlFor="attachments">Attachments (PDFs, Documents)</Label>
            <div className="mt-2">
              <input
                id="attachments"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('attachments')?.click()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
            </div>
            
            {rfq.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {rfq.attachments.map(attachment => (
                  <div key={attachment.id} className="flex items-center justify-between p-2 bg-slate-800 rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">{attachment.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {(attachment.size / 1024).toFixed(1)} KB
                      </Badge>
                    </div>
                    <Button
                      onClick={() => removeAttachment(attachment.id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button variant="outline">Save Draft</Button>
            <Button onClick={publishRFQ} disabled={rfq.legs.some(leg => !leg.from || !leg.to || !leg.departureDate)}>
              Publish RFQ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
