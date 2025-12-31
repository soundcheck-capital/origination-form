/**
 * Tests for Underwriting Calculator
 * Validates the 4 acceptance criteria scenarios
 */

import { calculateUnderwritingResult, UnderwritingInputs } from '../underwritingCalculator';

describe('Underwriting Calculator - CSV Validation', () => {
  describe('CSV Test Case 1 - Score 16 (Medium-Low Risk)', () => {
    it('should match CSV example: 1-2 years, 7-10 events, Ticketing Co, Weekly', () => {
      const inputs: UnderwritingInputs = {
        yearsInBusiness: '1-2 years',      // score: 8 (from CSV)
        numberOfEvents: 8,                 // score: 6 (7-10 events)
        paymentRemittedBy: 'From the Ticketing Co (e.g. Ticketmaster)', // score: 1
        paymentFrequency: 'Weekly',        // score: 1
        grossAnnualTicketSales: 2500000    // $2.5M
      };

      const result = calculateUnderwritingResult(inputs);

      expect(result).not.toBeNull();
      expect(result!.totalRiskScore).toBe(16); // 8 + 6 + 1 + 1 = 16
      expect(result!.maxAdvancePercent).toBe(0.05); // 5% for score 16 (14.1-21 band)
      expect(result!.advanceAmount).toBe(125000); // $2.5M * 5% = $125k
      expect(result!.isCapped).toBe(false);
    });
  });

  describe('CSV Test Case 2 - Score 9 (Low-Medium Risk)', () => {
    it('should match CSV example: 6-9 years, 21+ events, Ticketing Co, Weekly', () => {
      const inputs: UnderwritingInputs = {
        yearsInBusiness: '5-10 years',     // score: 3 (6-9 years in CSV)
        numberOfEvents: 25,                // score: 4 (21+ events)
        paymentRemittedBy: 'From the Ticketing Co (e.g. Ticketmaster)', // score: 1
        paymentFrequency: 'Weekly',        // score: 1
        grossAnnualTicketSales: 1000000    // $1M
      };

      const result = calculateUnderwritingResult(inputs);

      expect(result).not.toBeNull();
      expect(result!.totalRiskScore).toBe(9); // 3 + 4 + 1 + 1 = 9
      expect(result!.maxAdvancePercent).toBe(0.075); // 7.5% for score 9 (7.1-14 band)
      expect(result!.advanceAmount).toBe(75000); // $1M * 7.5% = $75k
      expect(result!.isCapped).toBe(false);
    });
  });

  describe('CSV Test Case 3 - Score 2 (Low Risk)', () => {
    it('should match CSV example: 10+ years, 50+ events, Ticketing Co, Weekly', () => {
      const inputs: UnderwritingInputs = {
        yearsInBusiness: '10+ years',      // score: 0
        numberOfEvents: 60,                // score: 0 (50+ events)
        paymentRemittedBy: 'From the Ticketing Co (e.g. Ticketmaster)', // score: 1
        paymentFrequency: 'Weekly',        // score: 1
        grossAnnualTicketSales: 1000000    // $1M
      };

      const result = calculateUnderwritingResult(inputs);

      expect(result).not.toBeNull();
      expect(result!.totalRiskScore).toBe(2); // 0 + 0 + 1 + 1 = 2
      expect(result!.maxAdvancePercent).toBe(0.10); // 10% for score 2 (0-7 band)
      expect(result!.advanceAmount).toBe(100000); // $1M * 10% = $100k
      expect(result!.isCapped).toBe(false);
    });
  });

  describe('CSV Test Case 4 - Score 23 (High Risk)', () => {
    it('should match CSV example: 6-9 years, 11-20 events, Other, Post event', () => {
      const inputs: UnderwritingInputs = {
        yearsInBusiness: '5-10 years',     // score: 3 (6-9 years)
        numberOfEvents: 15,                // score: 5 (11-20 events)
        paymentRemittedBy: 'It varies',    // score: 10 (Other)
        paymentFrequency: 'Post event',    // score: 5
        grossAnnualTicketSales: 1800000    // $1.8M
      };

      const result = calculateUnderwritingResult(inputs);

      expect(result).not.toBeNull();
      expect(result!.totalRiskScore).toBe(23); // 3 + 5 + 10 + 5 = 23
      expect(result!.maxAdvancePercent).toBe(0.025); // 2.5% for score 23 (21.1-35 band)
      expect(result!.advanceAmount).toBe(45000); // $1.8M * 2.5% = $45k
      expect(result!.isCapped).toBe(false);
    });
  });

  describe('Cap Test - $500k Maximum', () => {
    it('should apply $500k cap for very high ticket sales', () => {
      const inputs: UnderwritingInputs = {
        yearsInBusiness: '10+ years',      // score: 0
        numberOfEvents: 50,                // score: 0
        paymentRemittedBy: 'From the Ticketing Co (e.g. Ticketmaster)', // score: 1
        paymentFrequency: 'Daily',         // score: 0
        grossAnnualTicketSales: 20000000   // $20M
      };

      const result = calculateUnderwritingResult(inputs);

      expect(result).not.toBeNull();
      expect(result!.totalRiskScore).toBe(1);
      expect(result!.maxAdvancePercent).toBe(0.10); // 10%
      // Raw amount would be $20M * 10% = $2M, but capped at $500k
      expect(result!.advanceAmount).toBe(500000);
      expect(result!.isCapped).toBe(true);
    });
  });

  describe('Risk Band Tests', () => {
    it('should calculate 10% for low risk (score 0-7)', () => {
      const inputs: UnderwritingInputs = {
        yearsInBusiness: '10+ years',      // 0 pts
        numberOfEvents: 50,                // 0 pts
        paymentRemittedBy: 'From the Ticketing Co (e.g. Ticketmaster)', // 1 pt
        paymentFrequency: 'Daily',         // 0 pts
        grossAnnualTicketSales: 1000000
      };

      const result = calculateUnderwritingResult(inputs);
      expect(result!.totalRiskScore).toBe(1); // Within 0-7 band
      expect(result!.maxAdvancePercent).toBe(0.10);
    });

    it('should calculate 7.5% for medium-low risk (score 7.1-14)', () => {
      const inputs: UnderwritingInputs = {
        yearsInBusiness: '2-5 years',      // 5 pts
        numberOfEvents: 5,                 // 7 pts (4-6 events)
        paymentRemittedBy: 'From the Ticketing Co (e.g. Ticketmaster)', // 1 pt
        paymentFrequency: 'Daily',         // 0 pts
        grossAnnualTicketSales: 1000000
      };

      const result = calculateUnderwritingResult(inputs);
      expect(result!.totalRiskScore).toBe(13); // 5 + 7 + 1 + 0 = 13 (within 7.1-14 band)
      expect(result!.maxAdvancePercent).toBe(0.075);
    });

    it('should calculate 5% for medium-high risk (score 14.1-21)', () => {
      const inputs: UnderwritingInputs = {
        yearsInBusiness: 'Less than 1 year', // 10 pts
        numberOfEvents: 5,                    // 7 pts (4-6 events)
        paymentRemittedBy: 'From the Ticketing Co (e.g. Ticketmaster)', // 1 pt
        paymentFrequency: 'Daily',            // 0 pts
        grossAnnualTicketSales: 1000000
      };

      const result = calculateUnderwritingResult(inputs);
      expect(result!.totalRiskScore).toBe(18); // Within 14.1-21 band
      expect(result!.maxAdvancePercent).toBe(0.05);
    });

    it('should calculate 2.5% for high risk (score 21.1-35)', () => {
      const inputs: UnderwritingInputs = {
        yearsInBusiness: 'Less than 1 year', // 10 pts
        numberOfEvents: 1,                    // 10 pts
        paymentRemittedBy: 'From the Venue (e.g. MSG)', // 5 pts
        paymentFrequency: 'Post event',       // 5 pts
        grossAnnualTicketSales: 1000000
      };

      const result = calculateUnderwritingResult(inputs);
      expect(result!.totalRiskScore).toBe(30); // Within 21.1-35 band
      expect(result!.maxAdvancePercent).toBe(0.025);
    });
  });

  describe('Edge Cases', () => {
    it('should return null for missing inputs', () => {
      const inputs: UnderwritingInputs = {
        yearsInBusiness: '',
        numberOfEvents: 0,
        paymentRemittedBy: '',
        paymentFrequency: '',
        grossAnnualTicketSales: 0
      };

      const result = calculateUnderwritingResult(inputs);
      expect(result).toBeNull();
    });

    it('should handle boundary conditions in risk matrix', () => {
      // Test exact boundary at 7.0
      const inputs1: UnderwritingInputs = {
        yearsInBusiness: '10+ years',      // 0
        numberOfEvents: 50,                // 0  
        paymentRemittedBy: 'From the Venue (e.g. MSG)', // 5
        paymentFrequency: 'Bi-monthly',    // 2
        grossAnnualTicketSales: 1000000
      };

      const result1 = calculateUnderwritingResult(inputs1);
      expect(result1!.totalRiskScore).toBe(7); // Exactly at boundary
      expect(result1!.maxAdvancePercent).toBe(0.10); // Should be in 10% band (0-7)

      // Test just above boundary at 7.1
      const inputs2: UnderwritingInputs = {
        yearsInBusiness: '2-5 years',      // 5
        numberOfEvents: 4,                 // 7 (4-6 events)
        paymentRemittedBy: 'From the Ticketing Co (e.g. Ticketmaster)', // 1
        paymentFrequency: 'Daily',         // 0
        grossAnnualTicketSales: 1000000
      };

      const result2 = calculateUnderwritingResult(inputs2);
      expect(result2!.totalRiskScore).toBe(13); // > 7.1
      expect(result2!.maxAdvancePercent).toBe(0.075); // Should be in 7.5% band (7.1-14)
    });
  });

  describe('Form Key Mapping Tests - Validates mapping from form keys to values', () => {
    /**
     * These tests verify that the calculator works with the actual VALUES
     * that should be passed after mapping from form keys.
     * 
     * Form keys (from hubspotLists.ts):
     * - yearsInBusiness: '0-1 year' -> 'Less than 1 year'
     * - paymentProcessing: 'Ticketing Co' -> 'From the Ticketing Co (e.g. Ticketmaster)'
     * - settlementPayout: 'Daily' -> 'Daily' (same)
     * 
     * The mapping happens in TicketingVolumeStep.tsx before calling calculateUnderwritingResult
     */
    
    it('should work with form values after mapping (not form keys)', () => {
      // These are the VALUES that should be passed after mapping
      // NOT the keys from the form dropdown
      const inputs: UnderwritingInputs = {
        yearsInBusiness: 'Less than 1 year',  // Mapped from '0-1 year'
        numberOfEvents: 1,
        paymentRemittedBy: 'From the Ticketing Co (e.g. Ticketmaster)', // Mapped from 'Ticketing Co'
        paymentFrequency: 'Daily',           // Same as form key
        grossAnnualTicketSales: 1000000
      };

      const result = calculateUnderwritingResult(inputs);
      
      expect(result).not.toBeNull();
      expect(result!.breakdown.yearsInBusinessScore).toBe(10); // Should be 10, not 0
      expect(result!.breakdown.eventsScore).toBe(10); // Should be 10, not 0
      expect(result!.breakdown.paymentRemittedByScore).toBe(1); // Should be 1, not 0
      expect(result!.totalRiskScore).toBe(21); // 10 + 10 + 1 + 0 = 21
    });

    it('should return 0 scores if form KEYS are passed instead of VALUES', () => {
      // This demonstrates the bug that was fixed
      // If form KEYS are passed directly (without mapping), scores will be 0
      const inputsWithKeys: UnderwritingInputs = {
        yearsInBusiness: '0-1 year',  // This is a FORM KEY, not the value
        numberOfEvents: 1,
        paymentRemittedBy: 'Ticketing Co',  // This is a FORM KEY, not the value
        paymentFrequency: 'Daily',
        grossAnnualTicketSales: 1000000
      };

      const result = calculateUnderwritingResult(inputsWithKeys);
      
      // These would return 0 because the keys don't match the config
      expect(result).not.toBeNull();
      expect(result!.breakdown.yearsInBusinessScore).toBe(0); // Key not found
      expect(result!.breakdown.paymentRemittedByScore).toBe(0); // Key not found
      // This demonstrates why mapping is necessary
    });
  });
});
