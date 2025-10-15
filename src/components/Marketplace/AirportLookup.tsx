// Airport Lookup Component - Autocomplete search for airports
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { marketplaceService, type Airport } from "@/lib/marketplace-service";
import { Check, MapPin, Plane } from "lucide-react";
import { useEffect, useState } from "react";

interface AirportLookupProps {
  value?: string;
  onChange: (value: string, airport?: Airport) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  showPopular?: boolean;
  className?: string;
}

export function AirportLookup({
  value = "",
  onChange,
  placeholder = "Search airports...",
  label,
  disabled = false,
  showPopular = true,
  className = ""
}: AirportLookupProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [airports, setAirports] = useState<Airport[]>([]);
  const [popularAirports, setPopularAirports] = useState<Airport[]>([]);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [loading, setLoading] = useState(false);

  // Load popular airports on mount
  useEffect(() => {
    if (showPopular) {
      loadPopularAirports();
    }
  }, [showPopular]);

  // Search airports when query changes
  useEffect(() => {
    if (searchQuery && searchQuery.length >= 2) {
      searchAirports(searchQuery);
    } else if (!searchQuery && showPopular) {
      setAirports(popularAirports);
    }
  }, [searchQuery]);

  const loadPopularAirports = async () => {
    try {
      const popular = await marketplaceService.getPopularAirports();
      setPopularAirports(popular);
      if (!searchQuery) {
        setAirports(popular);
      }
    } catch (error) {
      console.error('Error loading popular airports:', error);
    }
  };

  const searchAirports = async (query: string) => {
    if (query.length < 2) return;
    
    setLoading(true);
    try {
      const results = await marketplaceService.searchAirports(query);
      setAirports(results);
    } catch (error) {
      console.error('Error searching airports:', error);
      setAirports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (airport: Airport) => {
    setSelectedAirport(airport);
    onChange(airport.icao_code, airport);
    setOpen(false);
    setSearchQuery("");
  };

  const getDisplayValue = () => {
    if (value && selectedAirport && selectedAirport.icao_code === value) {
      return `${selectedAirport.icao_code} - ${selectedAirport.name}`;
    }
    return value || placeholder;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:text-white"
          >
            <span className="flex items-center gap-2 truncate">
              {value ? (
                <>
                  <Plane className="w-4 h-4 text-accent flex-shrink-0" />
                  <span className="truncate">{getDisplayValue()}</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">{placeholder}</span>
                </>
              )}
            </span>
            <Check
              className={`ml-2 h-4 w-4 flex-shrink-0 ${value ? "opacity-100" : "opacity-0"}`}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-slate-800 border-slate-700" align="start">
          <Command className="bg-slate-800">
            <CommandInput
              placeholder="Search by ICAO, IATA, city..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-9 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
            <CommandList>
              <CommandEmpty className="py-6 text-center text-sm text-slate-400">
                {loading ? "Searching..." : "No airports found"}
              </CommandEmpty>
              
              {!searchQuery && showPopular && popularAirports.length > 0 && (
                <CommandGroup heading="Popular Airports" className="text-slate-300">
                  {popularAirports.map((airport) => (
                    <CommandItem
                      key={airport.id}
                      value={`${airport.icao_code} ${airport.iata_code} ${airport.name} ${airport.city}`}
                      onSelect={() => handleSelect(airport)}
                      className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-slate-700 text-white"
                    >
                      <Plane className="w-4 h-4 text-accent flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{airport.icao_code}</span>
                          {airport.iata_code && (
                            <span className="text-xs text-slate-400">({airport.iata_code})</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-300 truncate">
                          {airport.name}
                        </div>
                        {airport.city && airport.country && (
                          <div className="text-xs text-slate-400 truncate">
                            {airport.city}, {airport.country}
                          </div>
                        )}
                      </div>
                      <Check
                        className={`ml-auto h-4 w-4 flex-shrink-0 ${
                          value === airport.icao_code ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {searchQuery && airports.length > 0 && (
                <CommandGroup heading="Search Results" className="text-slate-300">
                  {airports.map((airport) => (
                    <CommandItem
                      key={airport.id}
                      value={`${airport.icao_code} ${airport.iata_code} ${airport.name} ${airport.city}`}
                      onSelect={() => handleSelect(airport)}
                      className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-slate-700 text-white"
                    >
                      <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{airport.icao_code}</span>
                          {airport.iata_code && (
                            <span className="text-xs text-slate-400">({airport.iata_code})</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-300 truncate">
                          {airport.name}
                        </div>
                        {airport.city && airport.country && (
                          <div className="text-xs text-slate-400 truncate">
                            {airport.city}, {airport.country}
                          </div>
                        )}
                      </div>
                      <Check
                        className={`ml-auto h-4 w-4 flex-shrink-0 ${
                          value === airport.icao_code ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

