// Demo Bots Personas - Beta Terminal Testing
// FCA Compliant Aviation Platform - Realistic User Behavior

export type Persona = {
  email: string;
  password: string;
  role: 'broker'|'operator'|'pilot'|'crew';
  typing_wpm: number;
  hesitation: number;
  error_rate: number;
  patience_s: [number, number];
  followups: boolean;
};

export const personas: Record<string, Persona> = {
  ethan: {
    email: 'demo.broker1@stratus.test',
    password: 'DemoPass123',
    role: 'broker',
    typing_wpm: 48,
    hesitation: 0.25,
    error_rate: 0.04,
    patience_s: [20, 45],
    followups: true
  },
  amelia: {
    email: 'demo.operator1@stratus.test',
    password: 'DemoPass123',
    role: 'operator',
    typing_wpm: 36,
    hesitation: 0.35,
    error_rate: 0.06,
    patience_s: [30, 70],
    followups: true
  },
  sam: {
    email: 'demo.pilot1@stratus.test',
    password: 'DemoPass123',
    role: 'pilot',
    typing_wpm: 40,
    hesitation: 0.2,
    error_rate: 0.03,
    patience_s: [15, 35],
    followups: false
  },
  nadia: {
    email: 'demo.crew1@stratus.test',
    password: 'DemoPass123',
    role: 'crew',
    typing_wpm: 38,
    hesitation: 0.3,
    error_rate: 0.05,
    patience_s: [25, 50],
    followups: true
  }
};
