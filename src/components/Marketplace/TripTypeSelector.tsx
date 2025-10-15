// Trip Type Selector - Wizard for creating one-way, round-trip, and multi-leg trips
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { type CreateTripRequestInput, type TripLeg, type TripType } from "@/lib/marketplace-service";
import { ArrowRight, Calendar, MapPin, Minus, Plus, Users } from "lucide-react";
import { useState } from "react";
import { AirportLookup } from "./AirportLookup";

interface TripTypeSelectorProps {
  onSubmit: (tripData: CreateTripRequestInput) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function TripTypeSelector({ onSubmit, onCancel, loading = false }: TripTypeSelectorProps) {
  const [tripType, setTripType] = useState<TripType>('one-way');
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [depTime, setDepTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [pax, setPax] = useState(1);
  const [legs, setLegs] = useState<TripLeg[]>([
    { origin: "", destination: "", dep_time: "" },
    { origin: "", destination: "", dep_time: "" }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const baseData = {
      trip_type: tripType,
      pax,
      origin,
      destination,
      dep_time: depTime
    };

    if (tripType === 'one-way') {
      onSubmit(baseData);
    } else if (tripType === 'round-trip') {
      onSubmit({
        ...baseData,
        return_date: returnDate
      });
    } else if (tripType === 'multi-leg') {
      const validLegs = legs.filter(leg => leg.origin && leg.destination && leg.dep_time);
      onSubmit({
        ...baseData,
        origin: validLegs[0]?.origin || origin,
        destination: validLegs[validLegs.length - 1]?.destination || destination,
        dep_time: validLegs[0]?.dep_time || depTime,
        legs: validLegs
      });
    }
  };

  const addLeg = () => {
    setLegs([...legs, { origin: "", destination: "", dep_time: "" }]);
  };

  const removeLeg = (index: number) => {
    if (legs.length > 2) {
      setLegs(legs.filter((_, i) => i !== index));
    }
  };

  const updateLeg = (index: number, field: keyof TripLeg, value: string) => {
    const newLegs = [...legs];
    newLegs[index] = { ...newLegs[index], [field]: value };
    setLegs(newLegs);
  };

  const calculateTotalDistance = () => {
    // Placeholder - would calculate using airport coordinates
    return "TBD";
  };

  return (
    <Card className="terminal-card border-orange-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-accent" />
          Create Trip Request
        </CardTitle>
        <CardDescription className="text-slate-400">
          Choose your trip type and provide details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Type Selector */}
          <div className="space-y-3">
            <Label className="text-white">Trip Type</Label>
            <RadioGroup value={tripType} onValueChange={(value) => setTripType(value as TripType)}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="relative">
                  <RadioGroupItem value="one-way" id="one-way" className="peer sr-only" />
                  <Label
                    htmlFor="one-way"
                    className="flex flex-col items-center justify-between rounded-lg border-2 border-slate-600 bg-slate-700 p-4 hover:bg-slate-600 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-slate-600 cursor-pointer transition-all"
                  >
                    <ArrowRight className="w-6 h-6 mb-2 text-white" />
                    <div className="text-center">
                      <div className="font-semibold text-white">One-Way</div>
                      <div className="text-xs text-slate-400">Single destination</div>
                    </div>
                  </Label>
                </div>

                <div className="relative">
                  <RadioGroupItem value="round-trip" id="round-trip" className="peer sr-only" />
                  <Label
                    htmlFor="round-trip"
                    className="flex flex-col items-center justify-between rounded-lg border-2 border-slate-600 bg-slate-700 p-4 hover:bg-slate-600 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-slate-600 cursor-pointer transition-all"
                  >
                    <div className="flex items-center mb-2">
                      <ArrowRight className="w-5 h-5 text-white" />
                      <ArrowRight className="w-5 h-5 text-white transform rotate-180 -ml-2" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-white">Round-Trip</div>
                      <div className="text-xs text-slate-400">Return journey</div>
                    </div>
                  </Label>
                </div>

                <div className="relative">
                  <RadioGroupItem value="multi-leg" id="multi-leg" className="peer sr-only" />
                  <Label
                    htmlFor="multi-leg"
                    className="flex flex-col items-center justify-between rounded-lg border-2 border-slate-600 bg-slate-700 p-4 hover:bg-slate-600 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-slate-600 cursor-pointer transition-all"
                  >
                    <MapPin className="w-6 h-6 mb-2 text-white" />
                    <div className="text-center">
                      <div className="font-semibold text-white">Multi-Leg</div>
                      <div className="text-xs text-slate-400">Multiple stops</div>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Trip Details Tabs */}
          <Tabs value={tripType} className="w-full">
            {/* One-Way */}
            <TabsContent value="one-way" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AirportLookup
                  value={origin}
                  onChange={(value) => setOrigin(value)}
                  label="Departure Airport"
                  placeholder="Select origin..."
                />

                <AirportLookup
                  value={destination}
                  onChange={(value) => setDestination(value)}
                  label="Arrival Airport"
                  placeholder="Select destination..."
                />

                <div className="space-y-2">
                  <Label className="text-white">Departure Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={depTime}
                    onChange={(e) => setDepTime(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Passengers</Label>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-accent" />
                    <Input
                      type="number"
                      value={pax}
                      onChange={(e) => setPax(parseInt(e.target.value) || 1)}
                      min="1"
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Round-Trip */}
            <TabsContent value="round-trip" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AirportLookup
                  value={origin}
                  onChange={(value) => setOrigin(value)}
                  label="Departure Airport"
                  placeholder="Select origin..."
                />

                <AirportLookup
                  value={destination}
                  onChange={(value) => setDestination(value)}
                  label="Destination Airport"
                  placeholder="Select destination..."
                />

                <div className="space-y-2">
                  <Label className="text-white">Outbound Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={depTime}
                    onChange={(e) => setDepTime(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Return Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Passengers</Label>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-accent" />
                    <Input
                      type="number"
                      value={pax}
                      onChange={(e) => setPax(parseInt(e.target.value) || 1)}
                      min="1"
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Multi-Leg */}
            <TabsContent value="multi-leg" className="space-y-4 mt-4">
              <div className="space-y-4">
                {legs.map((leg, index) => (
                  <Card key={index} className="bg-slate-700/50 border-slate-600">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm text-white flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-accent" />
                          Leg {index + 1}
                        </CardTitle>
                        {legs.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLeg(index)}
                            className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <AirportLookup
                          value={leg.origin}
                          onChange={(value) => updateLeg(index, 'origin', value)}
                          label="From"
                          placeholder="Origin..."
                        />

                        <AirportLookup
                          value={leg.destination}
                          onChange={(value) => updateLeg(index, 'destination', value)}
                          label="To"
                          placeholder="Destination..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white">Departure Date & Time</Label>
                        <Input
                          type="datetime-local"
                          value={leg.dep_time}
                          onChange={(e) => updateLeg(index, 'dep_time', e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addLeg}
                  className="w-full border-orange-500 text-orange-500 hover:bg-orange-500/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Leg
                </Button>

                <div className="space-y-2">
                  <Label className="text-white">Passengers</Label>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-accent" />
                    <Input
                      type="number"
                      value={pax}
                      onChange={(e) => setPax(parseInt(e.target.value) || 1)}
                      min="1"
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Route Preview */}
          <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-white mb-2">Route Preview</h4>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              {tripType === 'one-way' && (
                <>
                  <span>{origin || '???'}</span>
                  <ArrowRight className="w-4 h-4" />
                  <span>{destination || '???'}</span>
                </>
              )}
              {tripType === 'round-trip' && (
                <>
                  <span>{origin || '???'}</span>
                  <ArrowRight className="w-4 h-4" />
                  <span>{destination || '???'}</span>
                  <ArrowRight className="w-4 h-4 transform rotate-180" />
                  <span>{origin || '???'}</span>
                </>
              )}
              {tripType === 'multi-leg' && (
                <div className="flex flex-wrap items-center gap-2">
                  {legs.map((leg, idx) => (
                    <span key={idx} className="flex items-center gap-2">
                      {idx > 0 && <ArrowRight className="w-4 h-4" />}
                      <span>{leg.origin || '???'}</span>
                    </span>
                  ))}
                  <ArrowRight className="w-4 h-4" />
                  <span>{legs[legs.length - 1]?.destination || '???'}</span>
                </div>
              )}
            </div>
            <div className="text-xs text-slate-400 mt-2">
              {pax} passenger{pax !== 1 ? 's' : ''} • Total Distance: {calculateTotalDistance()}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 btn-terminal-accent"
            >
              {loading ? "Creating..." : "Create Trip Request"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="border-terminal-border"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

