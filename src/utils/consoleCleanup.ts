// Console cleanup utility for production builds

// Replace all console statements in production with optimized versions
export const replaceConsoleStatements = (code: string): string => {
  if (import.meta.env.PROD) {
    return code
      .replace(/console\.log\([^)]*\);?/g, '// console.log removed in production')
      .replace(/console\.debug\([^)]*\);?/g, '// console.debug removed in production')
      .replace(/console\.warn\([^)]*\);?/g, '// console.warn removed in production')
      // Keep console.error for production debugging
      .replace(/console\.error\(/g, 'logger.error(');
  }
  return code;
};

// Production logger that only shows errors
export const productionLogger = {
  log: () => {},
  debug: () => {},
  warn: () => {},
  error: console.error,
};

// Development logger with full functionality
export const developmentLogger = {
  log: console.log,
  debug: console.debug,
  warn: console.warn,
  error: console.error,
};

// Export the appropriate logger based on environment
export const logger = import.meta.env.DEV ? developmentLogger : productionLogger;
