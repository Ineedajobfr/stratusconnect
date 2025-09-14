import { describe, it, expect } from 'vitest';
import { redactSensitive } from '../ContactRedactor';

describe('ContactRedactor', () => {
  it('masks email addresses correctly', () => {
    const input = 'Contact me at john.doe@example.com for more info';
    const result = redactSensitive(input);
    
    expect(result).toBe('Contact me at j•••e@•••••••••••••••• for more info');
  });

  it('masks phone numbers correctly', () => {
    const input = 'Call me at +1 (555) 123-4567 or 555-123-4567';
    const result = redactSensitive(input);
    
    expect(result).toBe('Call me at ••• ••• ••67 or ••• ••• ••67');
  });

  it('handles multiple emails and phones in same text', () => {
    const input = 'Email: john@example.com, Phone: +44 20 7946 0958, Backup: jane@company.co.uk';
    const result = redactSensitive(input);
    
    expect(result).toBe('Email: j•••n@••••••••••••••, Phone: ••• ••• ••58, Backup: j•••e@••••••••••••••••');
  });

  it('returns original text if no sensitive data found', () => {
    const input = 'This is just regular text with no contacts';
    const result = redactSensitive(input);
    
    expect(result).toBe('This is just regular text with no contacts');
  });

  it('handles empty string', () => {
    const result = redactSensitive('');
    expect(result).toBe('');
  });

  it('handles null/undefined input', () => {
    expect(redactSensitive(null as any)).toBe(null);
    expect(redactSensitive(undefined as any)).toBe(undefined);
  });

  it('preserves short phone numbers (less than 7 digits)', () => {
    const input = 'Short number: 123-456';
    const result = redactSensitive(input);
    
    expect(result).toBe('Short number: 123-456');
  });

  it('handles international phone formats', () => {
    const input = 'UK: +44 20 7946 0958, US: +1 555 123 4567';
    const result = redactSensitive(input);
    
    expect(result).toBe('UK: ••• ••• ••58, US: ••• ••• ••67');
  });

  it('handles email with subdomains', () => {
    const input = 'Contact: admin@subdomain.example.com';
    const result = redactSensitive(input);
    
    expect(result).toBe('Contact: a•••n@••••••••••••••••••••••••••••••');
  });
});
