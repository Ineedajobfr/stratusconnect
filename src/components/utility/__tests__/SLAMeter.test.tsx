import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SLAMeter from '../SLAMeter';

describe('SLAMeter', () => {
  it('renders with good performance (green)', () => {
    render(<SLAMeter minutes={8} />);
    
    expect(screen.getByText('First quote time')).toBeInTheDocument();
    expect(screen.getByText('8 min')).toBeInTheDocument();
    
    const timeElement = screen.getByText('8 min');
    expect(timeElement).toHaveClass('text-emerald-400');
  });

  it('renders with ok performance (amber)', () => {
    render(<SLAMeter minutes={15} />);
    
    const timeElement = screen.getByText('15 min');
    expect(timeElement).toHaveClass('text-amber-300');
  });

  it('renders with poor performance (red)', () => {
    render(<SLAMeter minutes={25} />);
    
    const timeElement = screen.getByText('25 min');
    expect(timeElement).toHaveClass('text-rose-300');
  });

  it('renders with custom label', () => {
    render(<SLAMeter label="Response time" minutes={5} />);
    
    expect(screen.getByText('Response time')).toBeInTheDocument();
    expect(screen.getByText('5 min')).toBeInTheDocument();
  });

  it('has proper accessibility', () => {
    render(<SLAMeter minutes={10} />);
    
    // Check for clock icon
    const clockIcon = screen.getByRole('img', { hidden: true });
    expect(clockIcon).toBeInTheDocument();
  });

  it('shows correct color thresholds', () => {
    // Test good threshold (≤10)
    const { rerender } = render(<SLAMeter minutes={10} />);
    expect(screen.getByText('10 min')).toHaveClass('text-emerald-400');
    
    // Test ok threshold (≤20)
    rerender(<SLAMeter minutes={20} />);
    expect(screen.getByText('20 min')).toHaveClass('text-amber-300');
    
    // Test poor threshold (>20)
    rerender(<SLAMeter minutes={21} />);
    expect(screen.getByText('21 min')).toHaveClass('text-rose-300');
  });
});
