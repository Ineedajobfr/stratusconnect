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

  const publishRFQ = () => {
    setRfq(prev => ({
      ...prev,
      status: 'published'
    }));
    console.log('RFQ Published:', rfq);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-surface-1 shadow-card ring-1 ring-white/5 rounded-xl2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-text text-xl">
            <FileText className="w-5 h-5 text-brand" />
            Multi-Leg RFQ Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Flight Legs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text">Flight Legs</h3>
              <Button onClick={addLeg} size="sm" variant="outline" className="border-white/20 text-text/70 hover:bg-surface-2 rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Add Leg
              </Button>
            </div>
            
            {rfq.legs.map((leg, index) => (
              <Card key={leg.id} className="p-4 bg-surface-2 ring-1 ring-white/5 rounded-xl2">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-text">Leg {index + 1}</h4>
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
                    <Label htmlFor={`from_${leg.id}`} className="text-text">From (IATA)</Label>
                    <Input
                      id={`from_${leg.id}`}
                      value={leg.from}
                      onChange={(e) => updateLeg(leg.id, 'from', e.target.value.toUpperCase())}
                      placeholder="LHR"
                      maxLength={3}
                      className="bg-surface-1 border-terminal-border text-text placeholder:text-text/50 focus:ring-brand/50"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`to_${leg.id}`} className="text-text">To (IATA)</Label>
                    <Input
                      id={`to_${leg.id}`}
                      value={leg.to}
                      onChange={(e) => updateLeg(leg.id, 'to', e.target.value.toUpperCase())}
                      placeholder="JFK"
                      maxLength={3}
                      className="bg-surface-1 border-terminal-border text-text placeholder:text-text/50 focus:ring-brand/50"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`date_${leg.id}`} className="text-text">Departure Date</Label>
                    <Input
                      id={`date_${leg.id}`}
                      type="date"
                      value={leg.departureDate}
                      onChange={(e) => updateLeg(leg.id, 'departureDate', e.target.value)}
                      className="bg-surface-1 border-terminal-border text-text focus:ring-brand/50"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`time_${leg.id}`} className="text-text">Departure Time</Label>
                    <Input
                      id={`time_${leg.id}`}
                      type="time"
                      value={leg.departureTime}
                      onChange={(e) => updateLeg(leg.id, 'departureTime', e.target.value)}
                      className="bg-surface-1 border-terminal-border text-text focus:ring-brand/50"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`passengers_${leg.id}`} className="text-text">Passengers</Label>
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
                      className="bg-surface-1 border-terminal-border text-text focus:ring-brand/50"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`luggage_${leg.id}`} className="text-text">Luggage (pieces)</Label>
                    <Input
                      id={`luggage_${leg.id}`}
                      type="number"
                      min="0"
                      value={leg.luggage}
                      onChange={(e) => {
                        updateLeg(leg.id, 'luggage', parseInt(e.target.value) || 0);
                        calculateTotals();
                      }}
                      className="bg-surface-1 border-terminal-border text-text focus:ring-brand/50"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor={`requirements_${leg.id}`} className="text-text">Special Requirements</Label>
                    <Textarea
                      id={`requirements_${leg.id}`}
                      value={leg.specialRequirements}
                      onChange={(e) => updateLeg(leg.id, 'specialRequirements', e.target.value)}
                      placeholder="VIP handling, customs clearance, etc."
                      rows={2}
                      className="bg-surface-1 border-terminal-border text-text placeholder:text-text/50 focus:ring-brand/50"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Trip Summary */}
          <Card className="p-4 bg-surface-2 ring-1 ring-white/5 rounded-xl2">
            <h3 className="font-semibold mb-2 text-text">Trip Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand" />
                <span className="text-text">Total Passengers: {rfq.totalPassengers}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-brand" />
                <span className="text-text">Total Luggage: {rfq.totalLuggage}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand" />
                <span className="text-text">Legs: {rfq.legs.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand" />
                <span className="text-text">Expires: {new Date(rfq.expiresAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>

          {/* Catering and Compliance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="catering" className="text-text">Catering Requirements</Label>
              <Textarea
                id="catering"
                value={rfq.catering}
                onChange={(e) => setRfq(prev => ({ ...prev, catering: e.target.value }))}
                placeholder="Dietary restrictions, preferences, etc."
                rows={3}
                className="bg-surface-1 border-terminal-border text-text placeholder:text-text/50 focus:ring-brand/50"
              />
            </div>
            
            <div>
              <Label htmlFor="compliance" className="text-text">Compliance Notes</Label>
              <Textarea
                id="compliance"
                value={rfq.complianceNotes}
                onChange={(e) => setRfq(prev => ({ ...prev, complianceNotes: e.target.value }))}
                placeholder="Regulatory requirements, permits, etc."
                rows={3}
                className="bg-surface-1 border-terminal-border text-text placeholder:text-text/50 focus:ring-brand/50"
              />
            </div>
          </div>

          {/* Attachments */}
          <div>
            <Label htmlFor="attachments" className="text-text">Attachments (PDFs, Documents)</Label>
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
                className="w-full border-terminal-border text-text hover:bg-surface-2"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
            </div>
            
            {rfq.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {rfq.attachments.map(attachment => (
                  <div key={attachment.id} className="flex items-center justify-between p-2 bg-surface-2 ring-1 ring-white/5 rounded-xl2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-brand" />
                      <span className="text-sm text-text">{attachment.name}</span>
                      <Badge variant="secondary" className="text-xs bg-brand/15 text-brand border-brand/30">
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
            <Button variant="outline" className="border-terminal-border text-text hover:bg-surface-2 rounded-xl">Save Draft</Button>
            <Button onClick={publishRFQ} disabled={rfq.legs.some(leg => !leg.from || !leg.to || !leg.departureDate)} className="bg-brand hover:bg-brand-600 text-text shadow-glow rounded-xl px-6 py-3 transition-all duration-200 font-medium shadow-lg">
              Publish RFQ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
