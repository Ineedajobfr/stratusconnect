import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  ArrowRight,
  Check,
  X
} from "lucide-react";

interface TripRequestData {
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  returnDate: string;
  returnTime: string;
  passengers: number;
  aircraftType: string;
  budget: string;
  specialRequirements: string;
  clientName: string;
  clientEmail: string;
  urgency: string;
}

export default function PostTripRequest() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TripRequestData>({
    origin: '',
    destination: '',
    departureDate: '',
    departureTime: '',
    returnDate: '',
    returnTime: '',
    passengers: 1,
    aircraftType: '',
    budget: '',
    specialRequirements: '',
    clientName: '',
    clientEmail: '',
    urgency: 'standard'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof TripRequestData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    // Handle success - redirect or show confirmation
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.origin && formData.destination && formData.departureDate;
      case 2:
        return formData.passengers > 0 && formData.aircraftType;
      case 3:
        return formData.clientName && formData.clientEmail;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Plane className="h-4 w-4 text-black" />
              </div>
              <span className="text-xl font-bold">STRATUSCONNECT</span>
            </div>
            <div className="text-sm text-slate-400">POST TRIP REQUEST</div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-400">Step {currentStep} of 4</div>
            <div className="w-32 bg-slate-700 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step <= currentStep ? 'bg-orange-500 text-black' : 'bg-slate-700 text-slate-400'
              }`}>
                {step < currentStep ? <Check className="h-4 w-4" /> : step}
              </div>
              {step < 4 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  step < currentStep ? 'bg-orange-500' : 'bg-slate-700'
                }`} />
              )}
            </div>
          ))}
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-orange-400">
              {currentStep === 1 && "Flight Details"}
              {currentStep === 2 && "Aircraft & Passengers"}
              {currentStep === 3 && "Client Information"}
              {currentStep === 4 && "Review & Submit"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Enter the basic flight information for your charter request"}
              {currentStep === 2 && "Specify aircraft requirements and passenger count"}
              {currentStep === 3 && "Provide client contact details and special requirements"}
              {currentStep === 4 && "Review all details before submitting your request"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Flight Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="origin" className="text-slate-300">Origin Airport</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="origin"
                        placeholder="e.g., JFK, LAX, LHR"
                        value={formData.origin}
                        onChange={(e) => handleInputChange('origin', e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination" className="text-slate-300">Destination Airport</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="destination"
                        placeholder="e.g., SFO, MIA, CDG"
                        value={formData.destination}
                        onChange={(e) => handleInputChange('destination', e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="departureDate" className="text-slate-300">Departure Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="departureDate"
                        type="date"
                        value={formData.departureDate}
                        onChange={(e) => handleInputChange('departureDate', e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="departureTime" className="text-slate-300">Departure Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="departureTime"
                        type="time"
                        value={formData.departureTime}
                        onChange={(e) => handleInputChange('departureTime', e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="returnDate" className="text-slate-300">Return Date (Optional)</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="returnDate"
                        type="date"
                        value={formData.returnDate}
                        onChange={(e) => handleInputChange('returnDate', e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="returnTime" className="text-slate-300">Return Time (Optional)</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="returnTime"
                        type="time"
                        value={formData.returnTime}
                        onChange={(e) => handleInputChange('returnTime', e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Aircraft & Passengers */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="passengers" className="text-slate-300">Number of Passengers</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="passengers"
                      type="number"
                      min="1"
                      max="20"
                      value={formData.passengers}
                      onChange={(e) => handleInputChange('passengers', parseInt(e.target.value))}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aircraftType" className="text-slate-300">Preferred Aircraft Type</Label>
                  <Select value={formData.aircraftType} onValueChange={(value) => handleInputChange('aircraftType', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select aircraft type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="light-jet">Light Jet (4-8 passengers)</SelectItem>
                      <SelectItem value="mid-size-jet">Mid-Size Jet (6-9 passengers)</SelectItem>
                      <SelectItem value="heavy-jet">Heavy Jet (8-16 passengers)</SelectItem>
                      <SelectItem value="ultra-long-range">Ultra Long Range (8-19 passengers)</SelectItem>
                      <SelectItem value="turboprop">Turboprop (4-9 passengers)</SelectItem>
                      <SelectItem value="any">Any suitable aircraft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-slate-300">Budget Range (Optional)</Label>
                  <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="under-25k">Under $25,000</SelectItem>
                      <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100k-200k">$100,000 - $200,000</SelectItem>
                      <SelectItem value="over-200k">Over $200,000</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urgency" className="text-slate-300">Urgency Level</Label>
                  <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="standard">Standard (24-48 hours)</SelectItem>
                      <SelectItem value="urgent">Urgent (12-24 hours)</SelectItem>
                      <SelectItem value="emergency">Emergency (Same day)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Client Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="clientName" className="text-slate-300">Client Name</Label>
                    <Input
                      id="clientName"
                      placeholder="Enter client name"
                      value={formData.clientName}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientEmail" className="text-slate-300">Client Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      placeholder="client@example.com"
                      value={formData.clientEmail}
                      onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequirements" className="text-slate-300">Special Requirements</Label>
                  <Textarea
                    id="specialRequirements"
                    placeholder="Any special requirements, dietary needs, accessibility needs, etc."
                    value={formData.specialRequirements}
                    onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-slate-700 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-orange-400">Trip Request Summary</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-slate-400">Route</div>
                      <div className="text-white font-medium">{formData.origin} → {formData.destination}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Departure</div>
                      <div className="text-white font-medium">{formData.departureDate} at {formData.departureTime}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Passengers</div>
                      <div className="text-white font-medium">{formData.passengers}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Aircraft Type</div>
                      <div className="text-white font-medium">{formData.aircraftType}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Client</div>
                      <div className="text-white font-medium">{formData.clientName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400">Urgency</div>
                      <div className="text-white font-medium capitalize">{formData.urgency}</div>
                    </div>
                  </div>

                  {formData.returnDate && (
                    <div>
                      <div className="text-sm text-slate-400">Return</div>
                      <div className="text-white font-medium">{formData.returnDate} at {formData.returnTime}</div>
                    </div>
                  )}

                  {formData.specialRequirements && (
                    <div>
                      <div className="text-sm text-slate-400">Special Requirements</div>
                      <div className="text-white font-medium">{formData.specialRequirements}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-700">
              <Button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="btn-terminal-secondary"
              >
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={!isStepValid(currentStep)}
                  className="btn-terminal-accent"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-terminal-accent"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
