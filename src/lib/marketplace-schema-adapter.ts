// Marketplace Schema Adapter
// Maps between frontend types and actual database column names

import type { MarketplaceListing } from "./marketplace-service";

/**
 * Database column mapping for marketplace_listings table
 * The actual database uses different column names than our types
 */
export const DB_COLUMN_MAP = {
  // Frontend -> Database
  price: 'asking_price',
  min_bid: 'minimum_bid',
  departure_airport: 'departure_location',
  destination_airport: 'destination',
  dep_time: 'departure_date',
  arr_time: 'arrival_date',
  seats: 'passengers',
} as const;

/**
 * Convert frontend listing object to database format
 */
export function toDbListing(listing: Partial<MarketplaceListing>): Record<string, any> {
  const dbListing: Record<string, any> = { ...listing };

  // Map frontend names to database names
  if ('price' in listing && listing.price !== undefined) {
    dbListing.asking_price = listing.price;
    delete dbListing.price;
  }

  if ('departure_airport' in listing && listing.departure_airport !== undefined) {
    dbListing.departure_location = listing.departure_airport;
    delete dbListing.departure_airport;
  }

  if ('destination_airport' in listing && listing.destination_airport !== undefined) {
    dbListing.destination = listing.destination_airport;
    delete dbListing.destination_airport;
  }

  if ('dep_time' in listing && listing.dep_time !== undefined) {
    dbListing.departure_date = listing.dep_time;
    delete dbListing.dep_time;
  }

  if ('arr_time' in listing && listing.arr_time !== undefined) {
    dbListing.arrival_date = listing.arr_time;
    delete dbListing.arr_time;
  }

  if ('seats' in listing && listing.seats !== undefined) {
    dbListing.passengers = listing.seats;
    delete dbListing.seats;
  }

  return dbListing;
}

/**
 * Convert database listing to frontend format
 */
export function fromDbListing(dbListing: Record<string, any>): any {
  const listing: Record<string, any> = { ...dbListing };

  // Map database names to frontend names
  if ('asking_price' in dbListing) {
    listing.price = dbListing.asking_price;
  }

  if ('minimum_bid' in dbListing) {
    listing.min_bid = dbListing.minimum_bid;
  }

  if ('departure_location' in dbListing) {
    listing.departure_airport = dbListing.departure_location;
  }

  if ('destination' in dbListing) {
    listing.destination_airport = dbListing.destination;
  }

  if ('departure_date' in dbListing) {
    listing.dep_time = dbListing.departure_date;
  }

  if ('arrival_date' in dbListing) {
    listing.arr_time = dbListing.arrival_date;
  }

  if ('passengers' in dbListing) {
    listing.seats = dbListing.passengers;
  }

  // Map status to active boolean for compatibility
  if ('status' in dbListing) {
    listing.active = dbListing.status === 'active';
  }

  return listing;
}

/**
 * Get the correct database column name
 */
export function getDbColumn(frontendColumn: string): string {
  return DB_COLUMN_MAP[frontendColumn as keyof typeof DB_COLUMN_MAP] || frontendColumn;
}

