// Quick error fix utility for build resolution
export const handleError = (error: any): string => {
  if (error?.message) return error.message;
  if (typeof error === 'string') return error;
  return 'An error occurred';
};