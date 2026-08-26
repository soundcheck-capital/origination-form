/**
 * Validation vectors from the "New Model 8-24-26" sheet
 * (Google Sheet "PreQual and Application Form Model", TEST 8/25/26 rows).
 */
import { expect, test } from '@jest/globals';
import { calculateUnderwritingResult } from './underwritingCalculator';

const base = {
  paymentRemittedBy: 'From the Ticketing Co (e.g. Ticketmaster)',
  paymentFrequency: 'Weekly',
};

test('score 16 → 10% band: Promoter, $2.5M GTS → $250,000', () => {
  const r = calculateUnderwritingResult({
    ...base,
    yearsInBusiness: '1-2 years', // 8
    numberOfEvents: 8, // 7-10 → 6
    grossAnnualTicketSales: 2_500_000,
    customerType: 'Promoter',
  })!;
  expect(r.totalRiskScore).toBe(16);
  expect(r.advanceAmount).toBe(250_000);
});

test('score 2 → 20% band: Venue, $2,724,422 GTS → $544,884 (not capped at old $500k)', () => {
  const r = calculateUnderwritingResult({
    ...base,
    yearsInBusiness: '10+ years', // 0
    numberOfEvents: 50, // 50+ → 0
    grossAnnualTicketSales: 2_724_422,
    customerType: 'Venue',
  })!;
  expect(r.totalRiskScore).toBe(2);
  expect(r.advanceAmount).toBeCloseTo(544_884.4, 0);
  expect(r.isCapped).toBe(false);
});

test('score 2 → 25% band: Festival, $2,724,422 GTS → $681,106', () => {
  const r = calculateUnderwritingResult({
    ...base,
    yearsInBusiness: '10+ years',
    numberOfEvents: 50,
    grossAnnualTicketSales: 2_724_422,
    customerType: 'Festival',
  })!;
  expect(r.advanceAmount).toBeCloseTo(681_105.5, 0);
});

test('score 23 → 5% band: Other/Post event, $1.8M GTS → $90,000', () => {
  const r = calculateUnderwritingResult({
    yearsInBusiness: '5-10 years', // 3
    numberOfEvents: 15, // 11-20 → 5
    paymentRemittedBy: 'It varies', // 10
    paymentFrequency: 'Post event', // 5
    grossAnnualTicketSales: 1_800_000,
    customerType: 'Promoter',
  })!;
  expect(r.totalRiskScore).toBe(23);
  expect(r.advanceAmount).toBe(90_000);
});

test('cap is $1,000,000: score 2, $15M GTS → capped', () => {
  const r = calculateUnderwritingResult({
    ...base,
    yearsInBusiness: '10+ years',
    numberOfEvents: 50,
    grossAnnualTicketSales: 15_000_000,
    customerType: 'Promoter',
  })!;
  expect(r.advanceAmount).toBe(1_000_000);
  expect(r.isCapped).toBe(true);
});
