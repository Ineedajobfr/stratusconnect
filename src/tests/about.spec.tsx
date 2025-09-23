import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import About from '../pages/About';

// Mock analytics
const mockAnalytics = {
  track: vi.fn()
};

// Mock window.analytics
Object.defineProperty(window, 'analytics', {
  value: mockAnalytics,
  writable: true
});

const renderAbout = () => {
  return render(
    <BrowserRouter>
      <About />
    </BrowserRouter>
  );
};

describe('About Page', () => {
  it('renders the main heading', () => {
    renderAbout();
    expect(screen.getByText('About StratusConnect')).toBeInTheDocument();
  });

  it('renders all section headings', () => {
    renderAbout();
    expect(screen.getByText('From quiet post to living platform')).toBeInTheDocument();
    expect(screen.getByText('What we do')).toBeInTheDocument();
    expect(screen.getByText('How it works')).toBeInTheDocument();
    expect(screen.getByText('The standard')).toBeInTheDocument();
    expect(screen.getByText('Fees')).toBeInTheDocument();
    expect(screen.getByText('Global from day one')).toBeInTheDocument();
  });

  it('renders the CTA buttons', () => {
    renderAbout();
    expect(screen.getByText('Join the platform')).toBeInTheDocument();
    expect(screen.getByText('View live demo')).toBeInTheDocument();
  });

  it('tracks analytics on mount', () => {
    renderAbout();
    expect(mockAnalytics.track).toHaveBeenCalledWith('about_viewed');
  });

  it('renders step cards with numbers', () => {
    renderAbout();
    // Check that step numbers are rendered (they should be in the StepCard components)
    expect(screen.getByText('Verification first')).toBeInTheDocument();
    expect(screen.getByText('Signal')).toBeInTheDocument();
    expect(screen.getByText('Negotiate')).toBeInTheDocument();
    expect(screen.getByText('Commit')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('renders stat cards for different user types', () => {
    renderAbout();
    expect(screen.getByText('For brokers')).toBeInTheDocument();
    expect(screen.getByText('For operators')).toBeInTheDocument();
    expect(screen.getByText('For pilots and crew')).toBeInTheDocument();
  });

  it('renders fee information', () => {
    renderAbout();
    expect(screen.getByText('Charters')).toBeInTheDocument();
    expect(screen.getByText('Hires')).toBeInTheDocument();
    expect(screen.getByText('Pilots and crew')).toBeInTheDocument();
  });
});
