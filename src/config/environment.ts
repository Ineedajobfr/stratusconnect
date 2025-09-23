// StratusConnect Environment Configuration for Max AI

export const ENV_CONFIG = {
  // OpenAI API Configuration
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
  
  // Development Settings
  DEV_MODE: import.meta.env.VITE_DEV_MODE === 'true',
  ENABLE_MAX_AI: import.meta.env.VITE_ENABLE_MAX_AI !== 'false',
  
  // Security Settings
  MAX_AI_RATE_LIMIT: parseInt(import.meta.env.VITE_MAX_AI_RATE_LIMIT || '100'),
  MAX_AI_SESSION_TIMEOUT: parseInt(import.meta.env.VITE_MAX_AI_SESSION_TIMEOUT || '30'),
  
  // Feature Flags
  ENABLE_SECURITY_AI: import.meta.env.VITE_ENABLE_SECURITY_AI !== 'false',
  ENABLE_PREDICTIVE_ANALYTICS: import.meta.env.VITE_ENABLE_PREDICTIVE_ANALYTICS !== 'false',
  ENABLE_REAL_TIME_DATA: import.meta.env.VITE_ENABLE_REAL_TIME_DATA !== 'false',
};

// Validate required environment variables
export const validateEnvironment = () => {
  const errors: string[] = [];
  
  if (ENV_CONFIG.ENABLE_MAX_AI && !ENV_CONFIG.OPENAI_API_KEY) {
    errors.push('VITE_OPENAI_API_KEY is required when Max AI is enabled');
  }
  
  if (errors.length > 0) {
    console.warn('Environment configuration warnings:', errors);
    if (ENV_CONFIG.DEV_MODE) {
      console.info('Running in development mode - some features may be limited');
    }
  }
  
  return errors.length === 0;
};

// Initialize environment validation
validateEnvironment();
