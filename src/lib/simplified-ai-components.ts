// Simplified AI and component modules

export interface SimpleCategory {
  aircraft: 'aircraft';
  route: 'route'; 
  crew: 'crew';
  market: 'market';
  regulation: 'regulation';
  safety: 'safety';
}

export interface SimpleSecurityLevel {
  high: 'high';
  low: 'low';
  medium: 'medium';
  critical: 'critical';
}

export const getValidCategory = (category: string): keyof SimpleCategory => {
  const validCategories = ['aircraft', 'route', 'crew', 'market', 'regulation', 'safety'];
  return validCategories.includes(category) ? category as keyof SimpleCategory : 'aircraft';
};

export const getValidSecurityLevel = (level: string): keyof SimpleSecurityLevel => {
  const validLevels = ['high', 'low', 'medium', 'critical'];
  return validLevels.includes(level) ? level as keyof SimpleSecurityLevel : 'medium';
};