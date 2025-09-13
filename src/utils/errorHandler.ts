// Error handling utilities
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

export function safeJsonCast<T extends Record<string, unknown>>(
  jsonValue: unknown, 
  defaultValue: T = {} as T
): T {
  if (jsonValue === null || jsonValue === undefined) {
    return defaultValue;
  }
  
  if (typeof jsonValue === 'object' && jsonValue !== null) {
    return jsonValue as T;
  }
  
  return defaultValue;
}