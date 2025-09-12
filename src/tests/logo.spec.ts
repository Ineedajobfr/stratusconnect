// Logo Component Tests - Navigation and Glow Effects
// FCA Compliant Aviation Platform

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StratusConnectLogo } from '../components/StratusConnectLogo';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('StratusConnectLogo', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render the StratusConnect logo text', () => {
    render(
      <BrowserRouter>
        <StratusConnectLogo />
      </BrowserRouter>
    );

    expect(screen.getByText('StratusConnect')).toBeInTheDocument();
  });

  it('should have cursor pointer styling', () => {
    render(
      <BrowserRouter>
        <StratusConnectLogo />
      </BrowserRouter>
    );

    const logo = screen.getByText('StratusConnect');
    expect(logo).toHaveClass('cursor-pointer');
  });

  it('should have glow effects applied', () => {
    render(
      <BrowserRouter>
        <StratusConnectLogo />
      </BrowserRouter>
    );

    const logo = screen.getByText('StratusConnect');
    
    // Check for glow effects
    expect(logo).toHaveClass('drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]');
    expect(logo).toHaveClass('hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]');
    expect(logo).toHaveClass('shadow-[0_0_10px_rgba(255,165,0,0.3)]');
    expect(logo).toHaveClass('hover:shadow-[0_0_20px_rgba(255,165,0,0.6)]');
  });

  it('should have hover scale effect', () => {
    render(
      <BrowserRouter>
        <StratusConnectLogo />
      </BrowserRouter>
    );

    const logo = screen.getByText('StratusConnect');
    expect(logo).toHaveClass('hover:scale-110');
  });

  it('should navigate to home page when clicked', () => {
    render(
      <BrowserRouter>
        <StratusConnectLogo />
      </BrowserRouter>
    );

    const logo = screen.getByText('StratusConnect');
    fireEvent.click(logo);

    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('should always navigate to home page regardless of current location', () => {
    // Mock different current locations
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/some/other/page',
      },
      writable: true,
    });

    render(
      <BrowserRouter>
        <StratusConnectLogo />
      </BrowserRouter>
    );

    const logo = screen.getByText('StratusConnect');
    fireEvent.click(logo);

    // Should always navigate to home, not stay on current page
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should accept custom className prop', () => {
    render(
      <BrowserRouter>
        <StratusConnectLogo className="custom-class" />
      </BrowserRouter>
    );

    const logo = screen.getByText('StratusConnect');
    expect(logo).toHaveClass('custom-class');
  });

  it('should have transition effects', () => {
    render(
      <BrowserRouter>
        <StratusConnectLogo />
      </BrowserRouter>
    );

    const logo = screen.getByText('StratusConnect');
    expect(logo).toHaveClass('transition-all');
    expect(logo).toHaveClass('duration-300');
  });

  it('should be white text', () => {
    render(
      <BrowserRouter>
        <StratusConnectLogo />
      </BrowserRouter>
    );

    const logo = screen.getByText('StratusConnect');
    expect(logo).toHaveClass('text-white');
  });

  it('should be bold and large text', () => {
    render(
      <BrowserRouter>
        <StratusConnectLogo />
      </BrowserRouter>
    );

    const logo = screen.getByText('StratusConnect');
    expect(logo).toHaveClass('text-2xl');
    expect(logo).toHaveClass('font-bold');
  });
});
