// Test setup configuration
import { beforeAll, afterAll, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { vi } from 'vitest';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
    functions: {
      invoke: vi.fn(),
    },
  },
}));

// Mock React Router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
  Link: ({ children, ...props }: any) => {
    const React = require('react');
    return React.createElement('a', props, children);
  },
}));

// Mock Auth Context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: { role: 'broker' }
    },
    login: vi.fn(),
    logout: vi.fn(),
    loading: false,
  }),
}));

// Mock window.speechSynthesis
Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: vi.fn(),
    cancel: vi.fn(),
    getVoices: vi.fn(() => [
      { name: 'Google US English Male', lang: 'en-US', voiceURI: 'Google US English Male' },
      { name: 'Microsoft David', lang: 'en-US', voiceURI: 'Microsoft David' },
    ]),
  },
  writable: true,
});

// Mock window.speechRecognition
Object.defineProperty(window, 'webkitSpeechRecognition', {
  value: vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    continuous: false,
    interimResults: false,
    lang: 'en-US',
    onresult: null,
    onerror: null,
  })),
  writable: true,
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Global test setup
beforeAll(() => {
  // Set up any global test configuration
  console.log('Setting up test environment...');
});

// Global test teardown
afterAll(() => {
  // Clean up any global test resources
  console.log('Cleaning up test environment...');
});
