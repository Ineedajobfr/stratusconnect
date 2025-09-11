// Comprehensive demo data for all terminals

export const demoAircraftData = [
  {
    id: "aircraft-001",
    tail_number: "N425SC",
    model: "Gulfstream G550",
    status: "in_flight",
    location: {
      lat: 40.7128,
      lng: -74.0060,
      airport: "KJFK",
      city: "New York",
      country: "USA"
    },
    current_flight: {
      origin: "KJFK",
      destination: "KLAX",
      departure_time: "14:30 UTC",
      arrival_time: "17:45 UTC",
      passengers: 8
    },
    crew: {
      captain: "Captain Sarah Johnson",
      first_officer: "Mike Chen"
    },
    next_scheduled: {
      route: "KLAX → KMIA",
      time: "Tomorrow 09:00"
    },
    seats: 12,
    range_nm: 6750,
    year: 2018,
    category: "heavy_jet"
  },
  {
    id: "aircraft-002",
    tail_number: "N892AV",
    model: "Citation X+",
    status: "available",
    location: {
      lat: 34.0522,
      lng: -118.2437,
      airport: "KLAX",
      city: "Los Angeles",
      country: "USA"
    },
    crew: {
      captain: "David Rodriguez",
      first_officer: "Emma Davis"
    },
    next_scheduled: {
      route: "KLAX → KJFK",
      time: "Today 18:00"
    },
    seats: 8,
    range_nm: 3500,
    year: 2020,
    category: "midsize_jet"
  },
  {
    id: "aircraft-003",
    tail_number: "N156JT",
    model: "Falcon 7X",
    status: "maintenance",
    location: {
      lat: 25.7617,
      lng: -80.1918,
      airport: "KMIA",
      city: "Miami",
      country: "USA"
    },
    crew: {
      captain: "James Mitchell",
      first_officer: "Lisa Wang"
    },
    next_scheduled: {
      route: "KMIA → KORD",
      time: "Jan 15 10:00"
    },
    seats: 14,
    range_nm: 5950,
    year: 2019,
    category: "heavy_jet"
  },
  {
    id: "aircraft-004",
    tail_number: "N789AB",
    model: "Gulfstream G650",
    status: "scheduled",
    location: {
      lat: 51.5074,
      lng: -0.1278,
      airport: "EGLL",
      city: "London",
      country: "UK"
    },
    current_flight: {
      origin: "EGLL",
      destination: "KJFK",
      departure_time: "16:00 UTC",
      arrival_time: "19:30 UTC",
      passengers: 12
    },
    crew: {
      captain: "Robert Smith",
      first_officer: "Anna Johnson"
    },
    seats: 16,
    range_nm: 7500,
    year: 2021,
    category: "heavy_jet"
  }
];

export const demoPilotData = [
  {
    id: "pilot-001",
    name: "Captain Sarah Johnson",
    role: "captain",
    status: "available",
    location: {
      lat: 40.7128,
      lng: -74.0060,
      airport: "KJFK",
      city: "New York",
      country: "USA"
    },
    ratings: ["Gulfstream G550", "Falcon 7X", "Citation X+"],
    hours_flown: 8500,
    rating: 4.9,
    next_available: "Available now"
  },
  {
    id: "pilot-002",
    name: "Captain Mike Chen",
    role: "captain",
    status: "in_flight",
    location: {
      lat: 34.0522,
      lng: -118.2437,
      airport: "KLAX",
      city: "Los Angeles",
      country: "USA"
    },
    current_assignment: {
      flight_id: "FL-001",
      route: "KLAX → KJFK",
      aircraft: "Gulfstream G550",
      departure_time: "14:30 UTC",
      arrival_time: "22:45 UTC"
    },
    ratings: ["Boeing 737", "Airbus A320", "Gulfstream G550"],
    hours_flown: 12000,
    rating: 4.8,
    next_available: "Tomorrow 08:00"
  },
  {
    id: "pilot-003",
    name: "First Officer Emma Davis",
    role: "first_officer",
    status: "on_duty",
    location: {
      lat: 25.7617,
      lng: -80.1918,
      airport: "KMIA",
      city: "Miami",
      country: "USA"
    },
    ratings: ["Falcon 7X", "Citation X+", "Challenger 350"],
    hours_flown: 3200,
    rating: 4.7,
    next_available: "Today 18:00"
  },
  {
    id: "pilot-004",
    name: "Captain James Mitchell",
    role: "captain",
    status: "available",
    location: {
      lat: 51.5074,
      lng: -0.1278,
      airport: "EGLL",
      city: "London",
      country: "UK"
    },
    ratings: ["Boeing 777", "Airbus A350", "Gulfstream G650"],
    hours_flown: 15000,
    rating: 4.9,
    next_available: "Available now"
  },
  {
    id: "pilot-005",
    name: "Captain Lisa Wang",
    role: "captain",
    status: "in_flight",
    location: {
      lat: 35.6762,
      lng: 139.6503,
      airport: "RJTT",
      city: "Tokyo",
      country: "Japan"
    },
    current_assignment: {
      flight_id: "FL-002",
      route: "RJTT → KLAX",
      aircraft: "Boeing 777",
      departure_time: "16:00 UTC",
      arrival_time: "08:30 UTC"
    },
    ratings: ["Boeing 777", "Boeing 787", "Airbus A350"],
    hours_flown: 11000,
    rating: 4.8,
    next_available: "Jan 15 10:00"
  }
];

export const demoFlightData = [
  {
    id: "flight-001",
    route: "KTEB → KMIA",
    date: "Dec 20 • G550 • 2.9h • PIC",
    aircraft: "G550",
    status: "landed",
    passengers: 8,
    earnings: 1150,
    rating: 5.0
  },
  {
    id: "flight-002",
    route: "KJFK → KLAX",
    date: "Dec 18 • G650 • 5.2h • PIC",
    aircraft: "G650",
    status: "landed",
    passengers: 6,
    earnings: 2100,
    rating: 4.8
  },
  {
    id: "flight-003",
    route: "KMIA → KORD",
    date: "Dec 15 • Falcon 7X • 3.1h • PIC",
    aircraft: "Falcon 7X",
    status: "landed",
    passengers: 4,
    earnings: 1800,
    rating: 4.9
  },
  {
    id: "flight-004",
    route: "KTEB → KPBI",
    date: "Dec 28 at 14:30 UTC",
    aircraft: "G550",
    status: "scheduled",
    passengers: 6
  },
  {
    id: "flight-005",
    route: "KPBI → KLAX",
    date: "Dec 30 at 09:15 UTC",
    aircraft: "G650",
    status: "scheduled",
    passengers: 8
  },
  {
    id: "flight-006",
    route: "KLAX → KJFK",
    date: "Jan 2 at 16:45 UTC",
    aircraft: "Falcon 7X",
    status: "scheduled",
    passengers: 4
  }
];

export const demoRequestData = [
  {
    id: "req-001",
    origin: "New York (JFK)",
    destination: "Los Angeles (LAX)",
    departure_date: "2024-01-15T10:00:00Z",
    return_date: "2024-01-18T18:00:00Z",
    passenger_count: 4,
    status: "open",
    created_at: "2024-01-10T09:00:00Z",
    quotes: [
      {
        id: "quote-001",
        price: 45000,
        currency: "USD",
        status: "pending",
        created_at: "2024-01-10T14:30:00Z",
        companies: { name: "Elite Aviation" },
        aircraft: { model: "Gulfstream G550", tail_number: "N425SC" }
      },
      {
        id: "quote-002",
        price: 52000,
        currency: "USD",
        status: "pending",
        created_at: "2024-01-10T16:45:00Z",
        companies: { name: "Premier Jets" },
        aircraft: { model: "Citation X+", tail_number: "N892AV" }
      }
    ]
  },
  {
    id: "req-002",
    origin: "Miami (MIA)",
    destination: "London (LHR)",
    departure_date: "2024-01-20T08:00:00Z",
    passenger_count: 6,
    status: "accepted",
    created_at: "2024-01-08T11:00:00Z",
    quotes: [
      {
        id: "quote-003",
        price: 85000,
        currency: "USD",
        status: "accepted",
        created_at: "2024-01-08T15:20:00Z",
        companies: { name: "Global Aviation" },
        aircraft: { model: "Falcon 7X", tail_number: "N156JT" }
      }
    ]
  }
];

export const demoBookingData = [
  {
    id: "book-001",
    total_price: 85000,
    currency: "USD",
    status: "upcoming",
    created_at: "2024-01-08T15:30:00Z",
    requests: {
      origin: "Miami (MIA)",
      destination: "London (LHR)",
      departure_date: "2024-01-20T08:00:00Z"
    },
    quotes: {
      price: 85000,
      currency: "USD"
    },
    flights: [
      {
        id: "flight-001",
        departure_airport: "MIA",
        arrival_airport: "LHR",
        departure_datetime: "2024-01-20T08:00:00Z",
        arrival_datetime: "2024-01-20T18:30:00Z",
        status: "scheduled"
      }
    ]
  }
];

export const demoNotificationData = [
  {
    id: "notif-001",
    type: "crew_assigned",
    message: "You've been assigned as Captain for Miami→London flight",
    read: false,
    created_at: "2024-01-10T14:30:00Z"
  },
  {
    id: "notif-002",
    type: "flight_delay",
    message: "Flight JFK→LAX delayed by 45 minutes due to weather",
    read: false,
    created_at: "2024-01-15T09:15:00Z"
  },
  {
    id: "notif-003",
    type: "new_request",
    message: "New charter request: NYC→LAX on Jan 15",
    read: false,
    created_at: "2024-01-10T09:00:00Z"
  },
  {
    id: "notif-004",
    type: "quote_accepted",
    message: "Your quote was accepted for Miami→London",
    read: false,
    created_at: "2024-01-08T15:30:00Z"
  }
];

export const demoStatsData = {
  crew: {
    totalFlights: 47,
    hoursThisMonth: 89.5,
    upcomingFlights: 3,
    completedFlights: 44
  },
  pilot: {
    totalFlights: 89,
    hoursThisMonth: 156.5,
    upcomingFlights: 5,
    completedFlights: 84
  },
  broker: {
    totalRequests: 12,
    activeRequests: 3,
    totalBookings: 8,
    totalSpent: 425000
  },
  operator: {
    totalRequests: 8,
    myQuotes: 12,
    acceptedQuotes: 5,
    activeBookings: 3,
    fleetSize: 3,
    crewSize: 8,
    winRate: 41.7,
    totalRevenue: 425000
  }
};
