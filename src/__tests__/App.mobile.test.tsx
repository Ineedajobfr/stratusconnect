import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';

// Mock environment variable
const originalEnv = import.meta.env;

// Mock window.matchMedia for mobile detection
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: query === '(max-width: 767px)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock React Router
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ element }: { element: React.ReactNode }) => <div>{element}</div>,
  Navigate: () => <div>Navigate</div>,
}));

// Mock mobile component
vi.mock('../mobile', () => ({
  default: () => <div data-testid="mobile-shell">Mobile Shell</div>,
}));

describe('App Mobile Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment
    import.meta.env = { ...originalEnv };
  });

  it('renders mobile shell when VITE_MOBILE_V2 is true and screen is mobile', () => {
    // Set mobile environment
    import.meta.env.VITE_MOBILE_V2 = 'true';
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true, // Mobile breakpoint
      media: '(max-width: 767px)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<App />);
    
    expect(screen.getByTestId('mobile-shell')).toBeInTheDocument();
  });

  it('renders desktop app when VITE_MOBILE_V2 is false', () => {
    // Set desktop environment
    import.meta.env.VITE_MOBILE_V2 = 'false';
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true, // Mobile breakpoint but feature flag disabled
      media: '(max-width: 767px)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<App />);
    
    expect(screen.queryByTestId('mobile-shell')).not.toBeInTheDocument();
  });

  it('renders desktop app when screen is not mobile', () => {
    // Set desktop screen size
    import.meta.env.VITE_MOBILE_V2 = 'true';
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false, // Desktop breakpoint
      media: '(min-width: 768px)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<App />);
    
    expect(screen.queryByTestId('mobile-shell')).not.toBeInTheDocument();
  });

  it('defaults to mobile enabled when VITE_MOBILE_V2 is not set', () => {
    // Unset environment variable
    delete import.meta.env.VITE_MOBILE_V2;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true, // Mobile breakpoint
      media: '(max-width: 767px)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<App />);
    
    expect(screen.getByTestId('mobile-shell')).toBeInTheDocument();
  });
});
