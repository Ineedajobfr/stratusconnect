import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders without crashing', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders with default size', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('h-8 w-8');
  });

  it('renders with custom size', () => {
    render(<LoadingSpinner size="lg" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('h-12 w-12');
  });

  it('renders with text', () => {
    render(<LoadingSpinner text="Loading..." />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-class" />);
    const container = screen.getByRole('status').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('renders all size variants', () => {
    const sizes = ['sm', 'md', 'lg', 'xl'] as const;
    
    sizes.forEach(size => {
      const { unmount } = render(<LoadingSpinner size={size} />);
      const spinner = screen.getByRole('status');
      
      switch (size) {
        case 'sm':
          expect(spinner).toHaveClass('h-4 w-4');
          break;
        case 'md':
          expect(spinner).toHaveClass('h-8 w-8');
          break;
        case 'lg':
          expect(spinner).toHaveClass('h-12 w-12');
          break;
        case 'xl':
          expect(spinner).toHaveClass('h-16 w-16');
          break;
      }
      
      unmount();
    });
  });

  it('has correct accessibility attributes', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });

  it('applies animation classes', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('animate-spin');
  });

  it('renders with terminal theme classes', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('border-terminal-muted');
    expect(spinner).toHaveClass('border-t-terminal-accent');
  });
});
