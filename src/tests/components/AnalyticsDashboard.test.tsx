import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';

// Mock console methods
jest.spyOn(console, 'log').mockImplementation(() => {});

describe('AnalyticsDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<AnalyticsDashboard />);
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  });

  it('displays key metrics', async () => {
    render(<AnalyticsDashboard />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('Active Jobs')).toBeInTheDocument();
      expect(screen.getByText('Monthly Revenue')).toBeInTheDocument();
      expect(screen.getByText('Conversion Rate')).toBeInTheDocument();
    });
  });

  it('shows metric values', async () => {
    render(<AnalyticsDashboard />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('1,250')).toBeInTheDocument();
      expect(screen.getByText('156')).toBeInTheDocument();
      expect(screen.getByText('$180,000')).toBeInTheDocument();
      expect(screen.getByText('12.5%')).toBeInTheDocument();
    });
  });

  it('displays growth indicators', async () => {
    render(<AnalyticsDashboard />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('+15.2%')).toBeInTheDocument();
      expect(screen.getByText('+8.7%')).toBeInTheDocument();
      expect(screen.getByText('+22.1%')).toBeInTheDocument();
    });
  });

  it('shows time range buttons', () => {
    render(<AnalyticsDashboard />);
    
    expect(screen.getByText('7D')).toBeInTheDocument();
    expect(screen.getByText('30D')).toBeInTheDocument();
    expect(screen.getByText('90D')).toBeInTheDocument();
  });

  it('handles time range changes', async () => {
    render(<AnalyticsDashboard />);
    
    const sevenDayButton = screen.getByText('7D');
    fireEvent.click(sevenDayButton);
    
    // Button should be clickable
    expect(sevenDayButton).toBeInTheDocument();
  });

  it('displays performance metrics', async () => {
    render(<AnalyticsDashboard />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('User Activity')).toBeInTheDocument();
      expect(screen.getByText('Job Performance')).toBeInTheDocument();
      expect(screen.getByText('Revenue Metrics')).toBeInTheDocument();
    });
  });

  it('shows progress bars', async () => {
    render(<AnalyticsDashboard />);
    
    // Wait for data to load
    await waitFor(() => {
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars.length).toBeGreaterThan(0);
    });
  });

  it('displays top performers', async () => {
    render(<AnalyticsDashboard />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Top Performers')).toBeInTheDocument();
      expect(screen.getByText('Captain Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Elite Aviation Brokers')).toBeInTheDocument();
    });
  });

  it('shows performer metrics', async () => {
    render(<AnalyticsDashboard />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Jobs Completed')).toBeInTheDocument();
      expect(screen.getByText('Revenue Generated')).toBeInTheDocument();
      expect(screen.getByText('Applications')).toBeInTheDocument();
    });
  });

  it('displays growth trends section', async () => {
    render(<AnalyticsDashboard />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Growth Trends')).toBeInTheDocument();
      expect(screen.getByText('Chart visualization would be implemented here')).toBeInTheDocument();
    });
  });

  it('shows data points count', async () => {
    render(<AnalyticsDashboard />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Data points: 8')).toBeInTheDocument();
    });
  });

  it('handles refresh functionality', async () => {
    render(<AnalyticsDashboard />);
    
    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);
    
    // Button should be clickable
    expect(refreshButton).toBeInTheDocument();
  });
});
