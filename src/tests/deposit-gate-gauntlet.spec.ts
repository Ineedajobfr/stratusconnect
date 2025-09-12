// Deposit Gate Gauntlet Test - Universal Compliance
// FCA Compliant Aviation Platform

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DepositGate } from '../components/DepositGate/DepositGate';

// Mock Supabase
const mockSupabase = {
  auth: {
    getUser: vi.fn()
  },
  functions: {
    invoke: vi.fn()
  }
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase
}));

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('Deposit Gate Gauntlet Test', () => {
  const mockDealData = {
    dealId: 'DEAL-2025-001',
    totalAmount: 250000, // £2,500
    currency: 'GBP',
    broker: 'James Mitchell',
    operator: 'Elite Aviation Services'
  };

  const mockOnDepositSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'test-user-123' } }
    });
  });

  it('should block contact reveal without payment intent', async () => {
    render(
      <BrowserRouter>
        <DepositGate
          {...mockDealData}
          onDepositSuccess={mockOnDepositSuccess}
        />
      </BrowserRouter>
    );

    // Initial state should show deposit gate
    expect(screen.getByText(/Deposit Required/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact details will be revealed after deposit payment/i)).toBeInTheDocument();
    
    // Contact details should NOT be visible initially
    expect(screen.queryByText(/James Mitchell/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Elite Aviation Services/)).not.toBeInTheDocument();
    
    // Should show policy notice
    expect(screen.getByText(/This ensures serious inquiries only/i)).toBeInTheDocument();
    
    // Should show deposit CTA
    const depositButton = screen.getByRole('button', { name: /Pay Deposit/i });
    expect(depositButton).toBeInTheDocument();
  });

  it('should show correct financial breakdown', () => {
    render(
      <BrowserRouter>
        <DepositGate
          {...mockDealData}
          onDepositSuccess={mockOnDepositSuccess}
        />
      </BrowserRouter>
    );

    // Should show gross amount
    expect(screen.getByText(/£2,500.00/)).toBeInTheDocument();
    
    // Should show platform fee (7%)
    expect(screen.getByText(/Platform Fee \(7%\)/)).toBeInTheDocument();
    
    // Should show net to operator
    expect(screen.getByText(/Net to Operator/)).toBeInTheDocument();
  });

  it('should require minimum 5% deposit', () => {
    render(
      <BrowserRouter>
        <DepositGate
          {...mockDealData}
          onDepositSuccess={mockOnDepositSuccess}
        />
      </BrowserRouter>
    );

    // Should show minimum deposit amount (5% of £2,500 = £125)
    const depositInput = screen.getByDisplayValue('12500'); // £125 in pennies
    expect(depositInput).toBeInTheDocument();
    
    // Input should have correct min/max values
    expect(depositInput).toHaveAttribute('min', '12500'); // 5% minimum
    expect(depositInput).toHaveAttribute('max', '250000'); // 100% maximum
  });

  it('should process deposit and reveal contact after payment', async () => {
    // Mock successful payment intent creation
    mockSupabase.functions.invoke.mockResolvedValue({
      data: {
        paymentIntentId: 'pi_test_123',
        status: 'requires_capture'
      }
    });

    render(
      <BrowserRouter>
        <DepositGate
          {...mockDealData}
          onDepositSuccess={mockOnDepositSuccess}
        />
      </BrowserRouter>
    );

    // Click deposit button
    const depositButton = screen.getByRole('button', { name: /Pay Deposit/i });
    fireEvent.click(depositButton);

    // Should show processing state
    expect(screen.getByText(/Processing Payment/i)).toBeInTheDocument();
    expect(depositButton).toBeDisabled();

    // Wait for processing to complete
    await waitFor(() => {
      expect(screen.getByText(/Deposit Verified/i)).toBeInTheDocument();
    });

    // Should eventually reveal contact details
    await waitFor(() => {
      expect(screen.getByText(/Contact Details Unlocked/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Should show broker and operator contact info
    expect(screen.getByText(/James Mitchell/)).toBeInTheDocument();
    expect(screen.getByText(/Elite Aviation Services/)).toBeInTheDocument();
  });

  it('should generate signed terms with all required elements', async () => {
    render(
      <BrowserRouter>
        <DepositGate
          {...mockDealData}
          onDepositSuccess={mockOnDepositSuccess}
        />
      </BrowserRouter>
    );

    // The component should generate signed terms internally
    // We can't directly test the private method, but we can verify
    // that the deposit success callback includes the required data
    const depositButton = screen.getByRole('button', { name: /Pay Deposit/i });
    
    // Mock successful payment
    mockSupabase.functions.invoke.mockResolvedValue({
      data: { paymentIntentId: 'pi_test_123' }
    });

    fireEvent.click(depositButton);

    await waitFor(() => {
      expect(mockOnDepositSuccess).toHaveBeenCalledWith(
        expect.objectContaining({
          depositId: expect.any(String),
          amount: expect.any(Number),
          currency: 'GBP',
          auditHash: expect.any(String),
          signedTerms: expect.any(String),
          contactRevealed: true
        })
      );
    });
  });

  it('should enforce deposit gate universally', () => {
    render(
      <BrowserRouter>
        <DepositGate
          {...mockDealData}
          onDepositSuccess={mockOnDepositSuccess}
        />
      </BrowserRouter>
    );

    // Should show universal compliance notice
    expect(screen.getByText(/Universal Compliance/i)).toBeInTheDocument();
    expect(screen.getByText(/This deposit gate is active on every deal/i)).toBeInTheDocument();
    expect(screen.getByText(/No exceptions, no tiers, no opt-outs/i)).toBeInTheDocument();
  });

  it('should handle payment intent status correctly', async () => {
    // Test with different payment intent statuses
    const validStatuses = ['requires_capture', 'succeeded'];
    const invalidStatuses = ['requires_payment_method', 'requires_confirmation', 'canceled'];

    for (const status of validStatuses) {
      mockSupabase.functions.invoke.mockResolvedValue({
        data: { paymentIntentId: 'pi_test_123', status }
      });

      const { unmount } = render(
        <BrowserRouter>
          <DepositGate
            {...mockDealData}
            onDepositSuccess={mockOnDepositSuccess}
          />
        </BrowserRouter>
      );

      const depositButton = screen.getByRole('button', { name: /Pay Deposit/i });
      fireEvent.click(depositButton);

      await waitFor(() => {
        expect(screen.getByText(/Deposit Verified/i)).toBeInTheDocument();
      });

      unmount();
    }

    for (const status of invalidStatuses) {
      mockSupabase.functions.invoke.mockResolvedValue({
        data: { paymentIntentId: 'pi_test_123', status }
      });

      const { unmount } = render(
        <BrowserRouter>
          <DepositGate
            {...mockDealData}
            onDepositSuccess={mockOnDepositSuccess}
          />
        </BrowserRouter>
      );

      const depositButton = screen.getByRole('button', { name: /Pay Deposit/i });
      fireEvent.click(depositButton);

      // Should not show deposit verified for invalid statuses
      await waitFor(() => {
        expect(screen.queryByText(/Deposit Verified/i)).not.toBeInTheDocument();
      }, { timeout: 2000 });

      unmount();
    }
  });

  it('should show deposit amount in correct currency format', () => {
    render(
      <BrowserRouter>
        <DepositGate
          {...mockDealData}
          onDepositSuccess={mockOnDepositSuccess}
        />
      </BrowserRouter>
    );

    // Should show deposit amount badge with correct formatting
    const depositBadge = screen.getByText(/£125.00/);
    expect(depositBadge).toBeInTheDocument();
  });
});
