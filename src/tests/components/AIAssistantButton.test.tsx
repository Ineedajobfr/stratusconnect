import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AIAssistantButton from '@/components/AIAssistantButton';

// Mock the useAuth hook
const mockUseAuth = vi.fn();
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock the PremiumAIChatbot component
vi.mock('@/components/PremiumAIChatbot', () => ({
  default: ({ userType, isMinimized, onClose }: any) => (
    <div data-testid="premium-ai-chatbot">
      <div>AI Chatbot for {userType}</div>
      <div>Minimized: {isMinimized ? 'true' : 'false'}</div>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('AIAssistantButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders for authenticated user', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'test-user', email: 'test@example.com' },
    });

    renderWithRouter(<AIAssistantButton userType="broker" />);
    
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('ULTRA')).toBeInTheDocument();
    expect(screen.getByText('PREMIUM')).toBeInTheDocument();
  });

  it('shows premium badge for unauthenticated user', () => {
    mockUseAuth.mockReturnValue({
      user: null,
    });

    renderWithRouter(<AIAssistantButton userType="broker" />);
    
    expect(screen.getByText('PREMIUM')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('opens AI chatbot when clicked', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'test-user', email: 'test@example.com' },
    });

    renderWithRouter(<AIAssistantButton userType="broker" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByTestId('premium-ai-chatbot')).toBeInTheDocument();
    });
  });

  it('closes AI chatbot when close button is clicked', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'test-user', email: 'test@example.com' },
    });

    renderWithRouter(<AIAssistantButton userType="broker" />);
    
    // Open chatbot
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByTestId('premium-ai-chatbot')).toBeInTheDocument();
    });
    
    // Close chatbot
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByTestId('premium-ai-chatbot')).not.toBeInTheDocument();
    });
  });

  it('renders with correct user type', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'test-user', email: 'test@example.com' },
    });

    renderWithRouter(<AIAssistantButton userType="operator" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByText('AI Chatbot for operator')).toBeInTheDocument();
  });
});
