import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgressRing from '@/components/ui/ProgressRing';

describe('ProgressRing Component', () => {
  it('renders without crashing', () => {
    render(<ProgressRing value={50} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('displays correct percentage', () => {
    render(<ProgressRing value={75} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('handles custom max value', () => {
    render(<ProgressRing value={25} max={50} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<ProgressRing value={60} label="Progress" />);
    expect(screen.getByText('Progress')).toBeInTheDocument();
  });

  it('hides value when showValue is false', () => {
    render(<ProgressRing value={80} showValue={false} />);
    expect(screen.queryByText('80%')).not.toBeInTheDocument();
  });

  it('applies custom size', () => {
    render(<ProgressRing value={50} size={200} />);
    const svg = screen.getByRole('img');
    expect(svg).toHaveAttribute('width', '200');
    expect(svg).toHaveAttribute('height', '200');
  });

  it('applies custom stroke width', () => {
    render(<ProgressRing value={50} strokeWidth={12} />);
    const circles = screen.getAllByRole('img');
    expect(circles[0]).toHaveAttribute('stroke-width', '12');
  });

  it('renders with different colors', () => {
    const colors = ['terminal-accent', 'green', 'red', 'yellow', 'blue'];
    
    colors.forEach(color => {
      const { unmount } = render(<ProgressRing value={50} color={color} />);
      const svg = screen.getByRole('img');
      expect(svg).toBeInTheDocument();
      unmount();
    });
  });

  it('clamps value to max', () => {
    render(<ProgressRing value={150} max={100} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('handles zero value', () => {
    render(<ProgressRing value={0} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('handles negative value', () => {
    render(<ProgressRing value={-10} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ProgressRing value={50} className="custom-class" />);
    const container = screen.getByText('50%').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('renders background circle', () => {
    render(<ProgressRing value={50} />);
    const circles = screen.getAllByRole('img');
    expect(circles).toHaveLength(2); // Background and progress circles
  });

  it('has correct SVG structure', () => {
    render(<ProgressRing value={50} />);
    const svg = screen.getByRole('img');
    expect(svg).toHaveAttribute('width', '120');
    expect(svg).toHaveAttribute('height', '120');
    expect(svg).toHaveClass('transform -rotate-90');
  });
});
