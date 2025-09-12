// Signed Quote Integrity Gauntlet Test - Universal Compliance
// FCA Compliant Aviation Platform

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { signedQuotePDFGenerator } from '../lib/signed-quote-pdf';

// Mock crypto-js for SHA-256 hashing
vi.mock('crypto-js/sha256', () => ({
  default: vi.fn(() => 'sha256:mock-hash-123456789abcdef')
}));

// Mock jsPDF
const mockPDF = {
  text: vi.fn(),
  setFontSize: vi.fn(),
  setTextColor: vi.fn(),
  rect: vi.fn(),
  line: vi.fn(),
  save: vi.fn(),
  output: vi.fn(() => 'mock-pdf-data')
};

vi.mock('jspdf', () => ({
  jsPDF: vi.fn(() => mockPDF)
}));

describe('Signed Quote Integrity Gauntlet Test', () => {
  const mockQuoteData = {
    quoteId: 'QUOTE-2025-001',
    dealId: 'DEAL-2025-001',
    broker: {
      name: 'James Mitchell',
      company: 'Elite Aviation Brokers',
      email: 'james@eliteaviation.co.uk',
      phone: '+44 20 7946 0958'
    },
    operator: {
      name: 'Sarah Chen',
      company: 'Atlantic Aviation Group',
      email: 'sarah@atlanticaviation.com',
      phone: '+44 20 7946 0959'
    },
    route: 'London (EGLL) → Paris (LFPG)',
    aircraft: 'Citation X',
    departureDate: '2025-01-20',
    totalAmount: 250000, // £2,500 in pennies
    currency: 'GBP',
    platformFeePercentage: 7,
    cancellationGrid: {
      '24+ hours': '0% cancellation fee',
      '12-24 hours': '25% cancellation fee',
      '6-12 hours': '50% cancellation fee',
      '<6 hours': '100% cancellation fee'
    },
    terms: [
      'Flight subject to weather and operational conditions',
      'All passengers must provide valid travel documentation',
      'Catering preferences must be confirmed 24 hours prior'
    ],
    signedAt: '2025-01-15T14:30:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate signed quote with all required elements', async () => {
    const result = await signedQuotePDFGenerator.generate(mockQuoteData);

    expect(result).toMatchObject({
      pdfBase64: expect.any(String),
      hash: expect.stringMatching(/^sha256:/),
      filename: expect.stringMatching(/^signed-quote-QUOTE-2025-001/)
    });

    // Verify PDF generation methods were called
    expect(mockPDF.text).toHaveBeenCalled();
    expect(mockPDF.setFontSize).toHaveBeenCalled();
    expect(mockPDF.setTextColor).toHaveBeenCalled();
    expect(mockPDF.output).toHaveBeenCalled();
  });

  it('should include parties information in PDF', async () => {
    await signedQuotePDFGenerator.generate(mockQuoteData);

    // Verify broker information is included
    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('James Mitchell'),
      expect.any(Number),
      expect.any(Number)
    );
    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('Elite Aviation Brokers'),
      expect.any(Number),
      expect.any(Number)
    );
    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('james@eliteaviation.co.uk'),
      expect.any(Number),
      expect.any(Number)
    );

    // Verify operator information is included
    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('Sarah Chen'),
      expect.any(Number),
      expect.any(Number)
    );
    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('Atlantic Aviation Group'),
      expect.any(Number),
      expect.any(Number)
    );
    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('sarah@atlanticaviation.com'),
      expect.any(Number),
      expect.any(Number)
    );
  });

  it('should include route and aircraft information', async () => {
    await signedQuotePDFGenerator.generate(mockQuoteData);

    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('London (EGLL) → Paris (LFPG)'),
      expect.any(Number),
      expect.any(Number)
    );
    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('Citation X'),
      expect.any(Number),
      expect.any(Number)
    );
    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('2025-01-20'),
      expect.any(Number),
      expect.any(Number)
    );
  });

  it('should include 7% platform fee line item', async () => {
    await signedQuotePDFGenerator.generate(mockQuoteData);

    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('Platform Fee (7%)'),
      expect.any(Number),
      expect.any(Number)
    );
    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('£1,750.00'), // 7% of £2,500
      expect.any(Number),
      expect.any(Number)
    );
    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('£2,500.00'), // Gross amount
      expect.any(Number),
      expect.any(Number)
    );
    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('£750.00'), // Net to operator
      expect.any(Number),
      expect.any(Number)
    );
  });

  it('should include cancellation grid with correct version', async () => {
    await signedQuotePDFGenerator.generate(mockQuoteData);

    // Verify cancellation grid is included
    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('Cancellation Terms'),
      expect.any(Number),
      expect.any(Number)
    );
    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('24+ hours'),
      expect.any(Number),
      expect.any(Number)
    );
    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('0% cancellation fee'),
      expect.any(Number),
      expect.any(Number)
    );
    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('12-24 hours'),
      expect.any(Number),
      expect.any(Number)
    );
    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('25% cancellation fee'),
      expect.any(Number),
      expect.any(Number)
    );
  });

  it('should include timestamp and IP address', async () => {
    await signedQuotePDFGenerator.generate(mockQuoteData);

    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('2025-01-15T14:30:00Z'),
      expect.any(Number),
      expect.any(Number)
    );
    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('192.168.1.100'),
      expect.any(Number),
      expect.any(Number)
    );
  });

  it('should include SHA-256 hash in footer', async () => {
    const result = await signedQuotePDFGenerator.generate(mockQuoteData);

    expect(result.hash).toMatch(/^sha256:/);
    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('sha256:'),
      expect.any(Number),
      expect.any(Number)
    );
  });

  it('should include terms and conditions', async () => {
    await signedQuotePDFGenerator.generate(mockQuoteData);

    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('Terms and Conditions'),
      expect.any(Number),
      expect.any(Number)
    );
    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('Flight subject to weather and operational conditions'),
      expect.any(Number),
      expect.any(Number)
    );
    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('All passengers must provide valid travel documentation'),
      expect.any(Number),
      expect.any(Number)
    );
  });

  it('should include user agent for audit trail', async () => {
    await signedQuotePDFGenerator.generate(mockQuoteData);

    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('Mozilla/5.0'),
      expect.any(Number),
      expect.any(Number)
    );
  });

  it('should generate unique filename with quote ID', async () => {
    const result = await signedQuotePDFGenerator.generate(mockQuoteData);

    expect(result.filename).toBe('signed-quote-QUOTE-2025-001.pdf');
  });

  it('should handle different currencies correctly', async () => {
    const usdQuoteData = {
      ...mockQuoteData,
      currency: 'USD',
      totalAmount: 300000 // $3,000 in cents
    };

    await signedQuotePDFGenerator.generate(usdQuoteData);

    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('$3,000.00'),
      expect.any(Number),
      expect.any(Number)
    );
    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('$210.00'), // 7% platform fee
      expect.any(Number),
      expect.any(Number)
    );
  });

  it('should include compliance verification', async () => {
    await signedQuotePDFGenerator.generate(mockQuoteData);

    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('FCA Compliant'),
      expect.any(Number),
      expect.any(Number)
    );
    expect(mockPDF.text).toHaveBeenCalledWith(
      expect.stringContaining('Audit Hash'),
      expect.any(Number),
      expect.any(Number)
    );
  });

  it('should be idempotent - same input produces same hash', async () => {
    const result1 = await signedQuotePDFGenerator.generate(mockQuoteData);
    const result2 = await signedQuotePDFGenerator.generate(mockQuoteData);

    expect(result1.hash).toBe(result2.hash);
    expect(result1.filename).toBe(result2.filename);
  });
});
