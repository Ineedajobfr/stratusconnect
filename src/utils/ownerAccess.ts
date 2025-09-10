// Owner access bypass utility for specific whitelisted emails
export const OWNER_EMAILS = ['stratuscharter@gmail.com', 'Lordbroctree1@gmail.com'];

export const isOwner = (email: string): boolean => {
  return OWNER_EMAILS.includes(email?.toLowerCase());
};

export const hasOwnerAccess = (user: Record<string, unknown>): boolean => {
  if (!user?.email) return false;
  return isOwner(user.email);
};