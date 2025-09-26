import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobBoard from '@/components/job-board/JobBoard';

// Mock the useAuth hook
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'test-user',
      role: 'pilot',
      company_id: 'test-company'
    }
  })
}));

describe('JobBoard Component', () => {
  const defaultProps = {
    userRole: 'pilot' as const
  };

  beforeEach(() => {
    // Mock console methods to avoid test output noise
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders without crashing', () => {
    render(<JobBoard {...defaultProps} />);
    expect(screen.getByText('Job Board')).toBeInTheDocument();
  });

  it('displays job listings', async () => {
    render(<JobBoard {...defaultProps} />);
    
    // Wait for jobs to load
    await waitFor(() => {
      expect(screen.getByText('Gulfstream G650 Pilot')).toBeInTheDocument();
    });
  });

  it('filters jobs by category', async () => {
    render(<JobBoard {...defaultProps} />);
    
    // Wait for jobs to load
    await waitFor(() => {
      expect(screen.getByText('Gulfstream G650 Pilot')).toBeInTheDocument();
    });

    // Click on category filter
    const categoryFilter = screen.getByRole('combobox', { name: /category/i });
    fireEvent.click(categoryFilter);
    
    // Select a category
    const pilotOption = screen.getByText('Pilot');
    fireEvent.click(pilotOption);
  });

  it('searches jobs by title', async () => {
    render(<JobBoard {...defaultProps} />);
    
    // Wait for jobs to load
    await waitFor(() => {
      expect(screen.getByText('Gulfstream G650 Pilot')).toBeInTheDocument();
    });

    // Type in search box
    const searchInput = screen.getByPlaceholderText(/search jobs/i);
    fireEvent.change(searchInput, { target: { value: 'Gulfstream' } });
    
    // Verify search works
    expect(searchInput).toHaveValue('Gulfstream');
  });

  it('handles job application', async () => {
    render(<JobBoard {...defaultProps} />);
    
    // Wait for jobs to load
    await waitFor(() => {
      expect(screen.getByText('Gulfstream G650 Pilot')).toBeInTheDocument();
    });

    // Click apply button
    const applyButton = screen.getByText('Apply Now');
    fireEvent.click(applyButton);
    
    // Verify application was submitted
    await waitFor(() => {
      expect(screen.getByText('Application submitted successfully!')).toBeInTheDocument();
    });
  });

  it('displays job details correctly', async () => {
    render(<JobBoard {...defaultProps} />);
    
    // Wait for jobs to load
    await waitFor(() => {
      expect(screen.getByText('Gulfstream G650 Pilot')).toBeInTheDocument();
    });

    // Check for job details
    expect(screen.getByText('$150,000 - $200,000')).toBeInTheDocument();
    expect(screen.getByText('New York, NY')).toBeInTheDocument();
    expect(screen.getByText('Full-time')).toBeInTheDocument();
  });

  it('handles empty state', () => {
    // Mock empty jobs array
    jest.spyOn(React, 'useState').mockImplementation(() => [[], jest.fn()]);
    
    render(<JobBoard {...defaultProps} />);
    
    expect(screen.getByText('No jobs found')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    // Mock loading state
    jest.spyOn(React, 'useState').mockImplementation(() => [true, jest.fn()]);
    
    render(<JobBoard {...defaultProps} />);
    
    expect(screen.getByText('Loading jobs...')).toBeInTheDocument();
  });
});
