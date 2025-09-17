import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from '@/utils/errorHandler';

interface NewRequestFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const NewRequestForm: React.FC<NewRequestFormProps> = ({
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departure_date: '',
    return_date: '',
    passenger_count: 1,
    budget_min: '',
    budget_max: '',
    currency: 'USD',
    notes: '',
    aircraft_preferences: {}
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const { error } = await supabase.functions.invoke('create-request', {
        body: {
          origin: formData.origin,
          destination: formData.destination,
          departure_date: formData.departure_date,
          return_date: formData.return_date || null,
          passenger_count: formData.passenger_count,
          budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
          budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
          currency: formData.currency,
          notes: formData.notes,
          aircraft_preferences: formData.aircraft_preferences
        }
      });

      if (error) throw error;

      onSuccess();
    } catch (error: unknown) {
      console.error('Error creating request:', error);
      setErrors({ submit: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.origin.trim()) {
      newErrors.origin = 'Origin is required';
    }
    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }
    if (!formData.departure_date) {
      newErrors.departure_date = 'Departure date is required';
    }
    if (formData.passenger_count < 1) {
      newErrors.passenger_count = 'At least 1 passenger is required';
    }
    if (formData.budget_min && formData.budget_max && parseFloat(formData.budget_min) > parseFloat(formData.budget_max)) {
      newErrors.budget_max = 'Maximum budget must be greater than minimum budget';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Charter Request</DialogTitle>
          <DialogDescription>
            Fill in the details for your charter flight request. Operators will be able to submit quotes for your trip.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Origin and Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Origin *</Label>
              <Input
                id="origin"
                value={formData.origin}
                onChange={(e) => handleInputChange('origin', e.target.value)}
                placeholder="e.g., New York (JFK)"
                className={errors.origin ? 'border-red-500' : ''}
              />
              {errors.origin && (
                <p className="text-sm text-red-500">{errors.origin}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination *</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                placeholder="e.g., Los Angeles (LAX)"
                className={errors.destination ? 'border-red-500' : ''}
              />
              {errors.destination && (
                <p className="text-sm text-red-500">{errors.destination}</p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Departure Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.departure_date && "text-muted-foreground",
                      errors.departure_date && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.departure_date ? format(new Date(formData.departure_date), "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.departure_date ? new Date(formData.departure_date) : undefined}
                    onSelect={(date) => handleInputChange('departure_date', date?.toISOString() || '')}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.departure_date && (
                <p className="text-sm text-red-500">{errors.departure_date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Return Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.return_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.return_date ? format(new Date(formData.return_date), "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.return_date ? new Date(formData.return_date) : undefined}
                    onSelect={(date) => handleInputChange('return_date', date?.toISOString() || '')}
                    disabled={(date) => {
                      if (!formData.departure_date) return date < new Date();
                      return date < new Date(formData.departure_date);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Passengers and Budget */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passenger_count">Passengers *</Label>
              <Input
                id="passenger_count"
                type="number"
                min="1"
                max="50"
                value={formData.passenger_count}
                onChange={(e) => handleInputChange('passenger_count', parseInt(e.target.value) || 1)}
                className={errors.passenger_count ? 'border-red-500' : ''}
              />
              {errors.passenger_count && (
                <p className="text-sm text-red-500">{errors.passenger_count}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget_min">Min Budget</Label>
              <Input
                id="budget_min"
                type="number"
                min="0"
                value={formData.budget_min}
                onChange={(e) => handleInputChange('budget_min', e.target.value)}
                placeholder="e.g., 50000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget_max">Max Budget</Label>
              <Input
                id="budget_max"
                type="number"
                min="0"
                value={formData.budget_max}
                onChange={(e) => handleInputChange('budget_max', e.target.value)}
                placeholder="e.g., 100000"
                className={errors.budget_max ? 'border-red-500' : ''}
              />
              {errors.budget_max && (
                <p className="text-sm text-red-500">{errors.budget_max}</p>
              )}
            </div>
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any special requirements, catering preferences, ground transportation needs, etc."
              rows={3}
            />
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="p-3 bg-slate-800 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !validateForm()}
              className="min-w-[120px]"
            >
              {loading ? 'Creating...' : 'Create Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
