/**
 * Tests for Form Key Mapping
 * Validates that form keys are correctly mapped to underwriting values
 */

import { yearsInBusiness, paymentProcessing, settlementPayout } from '../../store/form/hubspotLists';
import { calculateUnderwritingResult, UnderwritingInputs } from '../underwritingCalculator';

describe('Form Key Mapping - Integration Test', () => {
  /**
   * These tests use the ACTUAL form keys (as stored in Redux state)
   * and verify that the mapping functions work correctly
   */

  describe('Mapping Functions', () => {
    it('should map yearsInBusiness keys to correct values', () => {
      // Test all mappings
      expect(yearsInBusiness['0-1 year']).toBe('Less than 1 year');
      expect(yearsInBusiness['1-2 years']).toBe('1-2 years');
      expect(yearsInBusiness['2-5 years']).toBe('2-5 years');
      expect(yearsInBusiness['5-10 years']).toBe('5-10 years');
      expect(yearsInBusiness['10+ years']).toBe('10+ years');
    });

    it('should map paymentProcessing keys to correct values', () => {
      expect(paymentProcessing['Ticketing Co']).toBe('From the Ticketing Co (e.g. Ticketmaster)');
      expect(paymentProcessing['Own Processor']).toBe('From the Payment Processor (e.g. Stripe)');
      expect(paymentProcessing['Venue']).toBe('From the Venue (e.g. MSG)');
      expect(paymentProcessing['It varies']).toBe('It varies');
    });

    it('should map settlementPayout keys to correct values', () => {
      expect(settlementPayout['Daily']).toBe('Daily');
      expect(settlementPayout['Weekly']).toBe('Weekly');
      expect(settlementPayout['Bi-monthly']).toBe('Bi-monthly');
      expect(settlementPayout['Monthly']).toBe('Monthly');
      expect(settlementPayout['Post event']).toBe('Post event');
      expect(settlementPayout['It varies']).toBe('It varies');
    });
  });

  describe('End-to-End: Form Keys → Mapped Values → Calculation', () => {
    /**
     * This simulates what happens in TicketingVolumeStep.tsx:
     * 1. Form stores keys (e.g., '0-1 year', 'Ticketing Co')
     * 2. Mapping functions convert to values (e.g., 'Less than 1 year', 'From the Ticketing Co...')
     * 3. Calculator uses values to compute scores
     */

    it('should calculate correct scores when using form keys after mapping', () => {
      // Simulate form state with KEYS (what Redux actually stores)
      const formKey_yearsInBusiness = '0-1 year';  // Form key
      const formKey_paymentProcessing = 'Ticketing Co';  // Form key
      const formKey_settlementPayout = 'Daily';  // Form key (same as value)

      // Apply mapping (what TicketingVolumeStep.tsx does)
      const mapped_yearsInBusiness = yearsInBusiness[formKey_yearsInBusiness as keyof typeof yearsInBusiness];
      const mapped_paymentRemittedBy = paymentProcessing[formKey_paymentProcessing as keyof typeof paymentProcessing];
      const mapped_paymentFrequency = settlementPayout[formKey_settlementPayout as keyof typeof settlementPayout];

      // Verify mapping worked
      expect(mapped_yearsInBusiness).toBe('Less than 1 year');
      expect(mapped_paymentRemittedBy).toBe('From the Ticketing Co (e.g. Ticketmaster)');
      expect(mapped_paymentFrequency).toBe('Daily');

      // Now calculate with mapped values
      const inputs: UnderwritingInputs = {
        yearsInBusiness: mapped_yearsInBusiness,
        numberOfEvents: 1,
        paymentRemittedBy: mapped_paymentRemittedBy,
        paymentFrequency: mapped_paymentFrequency,
        grossAnnualTicketSales: 1000000
      };

      const result = calculateUnderwritingResult(inputs);

      // Verify scores are NOT zero (the bug we fixed)
      expect(result).not.toBeNull();
      expect(result!.breakdown.yearsInBusinessScore).toBe(10); // Should be 10, NOT 0!
      expect(result!.breakdown.eventsScore).toBe(10); // Should be 10, NOT 0!
      expect(result!.breakdown.paymentRemittedByScore).toBe(1); // Should be 1, NOT 0!
      expect(result!.breakdown.paymentFrequencyScore).toBe(0); // Daily = 0 (correct)
      expect(result!.totalRiskScore).toBe(21); // 10 + 10 + 1 + 0 = 21
    });

    it('should demonstrate the bug: scores are 0 if keys are used directly', () => {
      // This shows what happened BEFORE the fix
      const inputsWithKeys: UnderwritingInputs = {
        yearsInBusiness: '0-1 year',  // Form KEY (wrong!)
        numberOfEvents: 1,
        paymentRemittedBy: 'Ticketing Co',  // Form KEY (wrong!)
        paymentFrequency: 'Daily',
        grossAnnualTicketSales: 1000000
      };

      const result = calculateUnderwritingResult(inputsWithKeys);

      // These would be 0 because keys don't match config
      expect(result).not.toBeNull();
      expect(result!.breakdown.yearsInBusinessScore).toBe(0); // Key not found!
      expect(result!.breakdown.paymentRemittedByScore).toBe(0); // Key not found!
      // This is why mapping is essential!
    });

    it('should work with all form key combinations', () => {
      const testCases = [
        {
          formKeys: {
            yearsInBusiness: '1-2 years',
            paymentProcessing: 'Own Processor',
            settlementPayout: 'Weekly'
          },
          expectedScores: {
            yearsInBusiness: 8,
            paymentRemittedBy: 3,
            paymentFrequency: 1
          }
        },
        {
          formKeys: {
            yearsInBusiness: '10+ years',
            paymentProcessing: 'Venue',
            settlementPayout: 'Post event'
          },
          expectedScores: {
            yearsInBusiness: 0,
            paymentRemittedBy: 5,
            paymentFrequency: 5
          }
        }
      ];

      testCases.forEach(({ formKeys, expectedScores }) => {
        const mapped_yearsInBusiness = yearsInBusiness[formKeys.yearsInBusiness as keyof typeof yearsInBusiness];
        const mapped_paymentRemittedBy = paymentProcessing[formKeys.paymentProcessing as keyof typeof paymentProcessing];
        const mapped_paymentFrequency = settlementPayout[formKeys.settlementPayout as keyof typeof settlementPayout];

        const inputs: UnderwritingInputs = {
          yearsInBusiness: mapped_yearsInBusiness,
          numberOfEvents: 10,
          paymentRemittedBy: mapped_paymentRemittedBy,
          paymentFrequency: mapped_paymentFrequency,
          grossAnnualTicketSales: 1000000
        };

        const result = calculateUnderwritingResult(inputs);

        expect(result).not.toBeNull();
        expect(result!.breakdown.yearsInBusinessScore).toBe(expectedScores.yearsInBusiness);
        expect(result!.breakdown.paymentRemittedByScore).toBe(expectedScores.paymentRemittedBy);
        expect(result!.breakdown.paymentFrequencyScore).toBe(expectedScores.paymentFrequency);
      });
    });
  });
});

