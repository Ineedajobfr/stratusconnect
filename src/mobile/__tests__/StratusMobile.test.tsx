import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StratusMobile from '../StratusMobile';

// Mock window.matchMedia for mobile detection
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: query === '(max-width: 767px)',
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('StratusMobile', () => {
  it('renders mobile shell with correct branding', () => {
    render(<StratusMobile />);
    
    // Check for StratusConnect branding
    expect(screen.getByText('StratusConnect')).toBeInTheDocument();
    expect(screen.getByText('Elite Aviation Brokerage')).toBeInTheDocument();
  });

  it('renders all tab navigation', () => {
    render(<StratusMobile />);
    
    // Check for all tab labels
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Market')).toBeInTheDocument();
    expect(screen.getByText('Requests')).toBeInTheDocument();
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('Wallet')).toBeInTheDocument();
  });

  it('renders search functionality', () => {
    render(<StratusMobile />);
    
    const searchInput = screen.getByPlaceholderText('Search jets, routes, operators...');
    expect(searchInput).toBeInTheDocument();
  });

  it('renders demo data correctly', () => {
    render(<StratusMobile />);
    
    // Check for demo RFQ data
    expect(screen.getByText('LON → NCE')).toBeInTheDocument();
    expect(screen.getByText('LHR → DXB')).toBeInTheDocument();
    
    // Check for demo jet data
    expect(screen.getByText('Phenom 300E')).toBeInTheDocument();
    expect(screen.getByText('Challenger 350')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<StratusMobile />);
    
    // Check for aria-labels on tab buttons
    const homeTab = screen.getByLabelText('Home');
    expect(homeTab).toBeInTheDocument();
    
    const marketTab = screen.getByLabelText('Market');
    expect(marketTab).toBeInTheDocument();
  });
});
