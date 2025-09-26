import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SecurityMonitor from '@/components/security/SecurityMonitor';

// Mock console methods
jest.spyOn(console, 'log').mockImplementation(() => {});

describe('SecurityMonitor Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<SecurityMonitor />);
    expect(screen.getByText('Security Monitor')).toBeInTheDocument();
  });

  it('displays security stats', async () => {
    render(<SecurityMonitor />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Total Events')).toBeInTheDocument();
      expect(screen.getByText('Active Threats')).toBeInTheDocument();
      expect(screen.getByText('Resolved')).toBeInTheDocument();
      expect(screen.getByText('Security Score')).toBeInTheDocument();
    });
  });

  it('shows security events', async () => {
    render(<SecurityMonitor />);
    
    // Wait for events to load
    await waitFor(() => {
      expect(screen.getByText('Multiple failed login attempts detected')).toBeInTheDocument();
      expect(screen.getByText('Unusual data access pattern detected')).toBeInTheDocument();
    });
  });

  it('displays event severity correctly', async () => {
    render(<SecurityMonitor />);
    
    // Wait for events to load
    await waitFor(() => {
      expect(screen.getByText('high')).toBeInTheDocument();
      expect(screen.getByText('critical')).toBeInTheDocument();
    });
  });

  it('shows resolved status', async () => {
    render(<SecurityMonitor />);
    
    // Wait for events to load
    await waitFor(() => {
      expect(screen.getByText('Resolved')).toBeInTheDocument();
    });
  });

  it('handles security settings button click', async () => {
    render(<SecurityMonitor />);
    
    const settingsButton = screen.getByText('Security Settings');
    fireEvent.click(settingsButton);
    
    // Button should be clickable
    expect(settingsButton).toBeInTheDocument();
  });

  it('displays event timestamps', async () => {
    render(<SecurityMonitor />);
    
    // Wait for events to load
    await waitFor(() => {
      // Check for timestamp format (should contain month and day)
      const timestamps = screen.getAllByText(/\w{3} \d{1,2}, \d{4}/);
      expect(timestamps.length).toBeGreaterThan(0);
    });
  });

  it('shows IP addresses for events', async () => {
    render(<SecurityMonitor />);
    
    // Wait for events to load
    await waitFor(() => {
      expect(screen.getByText('192.168.1.100')).toBeInTheDocument();
      expect(screen.getByText('10.0.0.50')).toBeInTheDocument();
    });
  });

  it('displays user IDs for events', async () => {
    render(<SecurityMonitor />);
    
    // Wait for events to load
    await waitFor(() => {
      expect(screen.getByText('User user-123')).toBeInTheDocument();
      expect(screen.getByText('User user-456')).toBeInTheDocument();
    });
  });

  it('handles view button clicks', async () => {
    render(<SecurityMonitor />);
    
    // Wait for events to load
    await waitFor(() => {
      const viewButtons = screen.getAllByText('View');
      expect(viewButtons.length).toBeGreaterThan(0);
      
      // Click first view button
      fireEvent.click(viewButtons[0]);
    });
  });

  it('handles resolve button clicks', async () => {
    render(<SecurityMonitor />);
    
    // Wait for events to load
    await waitFor(() => {
      const resolveButtons = screen.getAllByText('Resolve');
      expect(resolveButtons.length).toBeGreaterThan(0);
      
      // Click first resolve button
      fireEvent.click(resolveButtons[0]);
    });
  });
});
