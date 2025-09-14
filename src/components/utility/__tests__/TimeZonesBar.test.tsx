import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TimeZonesBar from '../TimeZonesBar';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('TimeZonesBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders default time zones', () => {
    render(<TimeZonesBar />);
    
    // Check for default zones
    expect(screen.getByText('UTC')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('Dubai')).toBeInTheDocument();
    expect(screen.getByText('Singapore')).toBeInTheDocument();
    expect(screen.getByText('Sydney')).toBeInTheDocument();
  });

  it('shows add button', () => {
    render(<TimeZonesBar />);
    
    const addButton = screen.getByRole('button', { name: /add/i });
    expect(addButton).toBeInTheDocument();
  });

  it('opens add dropdown when add button is clicked', () => {
    render(<TimeZonesBar />);
    
    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addButton);
    
    // Check for dropdown content
    expect(screen.getByText('Add a city')).toBeInTheDocument();
    expect(screen.getByText('Los Angeles')).toBeInTheDocument();
    expect(screen.getByText('Johannesburg')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<TimeZonesBar />);
    
    // Check for aria-label on main container
    const container = screen.getByLabelText('Global time zones');
    expect(container).toBeInTheDocument();
    
    // Check for aria-labels on time zone groups
    expect(screen.getByLabelText('UTC time')).toBeInTheDocument();
    expect(screen.getByLabelText('London time')).toBeInTheDocument();
  });

  it('shows remove buttons for each time zone', () => {
    render(<TimeZonesBar />);
    
    // Check for remove buttons (X icons)
    const removeButtons = screen.getAllByTitle('Remove');
    expect(removeButtons).toHaveLength(6); // Default zones
  });

  it('calls localStorage when adding/removing zones', () => {
    render(<TimeZonesBar />);
    
    // Click add button
    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addButton);
    
    // Click on Los Angeles to add it
    const laButton = screen.getByText('Los Angeles');
    fireEvent.click(laButton);
    
    // Should have called setItem to save preferences
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
});
