// Quick error fix utility for build resolution
export const handleError = (error: unknown): string => {
  if (error?.message) return error.message;
  if (typeof error === 'string') return error;
  return 'An error occurred';
};