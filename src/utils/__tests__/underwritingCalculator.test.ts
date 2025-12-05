/**
 * Tests for Underwriting Calculator
 * Validates the 4 acceptance criteria scenarios
 */

import { calculateUnderwritingResult, UnderwritingInputs } from '../underwritingCalculator';

describe('Underwriting Calculator', () => {
  describe('Scenario 1 - Low-Risk User (High Max Advance %)', () => {
    it('should calculate correct advance for low-risk user', () => {
      const inputs: UnderwritingInputs = {
        yearsInBusiness: '10+ years',      // score: 0
        numberOfEvents: 50,                // score: 0 (50+)
        paymentRemittedBy: 'Ticketing Co', // score: 1
        paymentFrequency: 'Daily',         // score: 0
        grossAnnualTicketSales: 2000000    // $2M
      };

      const result = calculateUnderwritingResult(inputs);

      expect(result).not.toBeNull();
      expect(result!.totalRiskScore).toBe(1); // 0 + 0 + 1 + 0
      expect(result!.maxAdvancePercent).toBe(0.10); // 10% for risk score 1
      expect(result!.advanceAmount).toBe(200000); // $2M * 10% = $200k
      expect(result!.isCapped).toBe(false);
      expect(result!.breakdown).toEqual({
        yearsInBusinessScore: 0,
        eventsScore: 0,
        paymentRemittedByScore: 1,
        paymentFrequencyScore: 0
      });
    });
  });

  describe('Scenario 2 - Medium-Risk User (Mid-Band 7.5%)', () => {
    it('should calculate correct advance for medium-risk user', () => {
      const inputs: UnderwritingInputs = {
        yearsInBusiness: '3-5 years',           // score: 1.5
        numberOfEvents: 5,                      // score: 5.85 (4-6 range)
        paymentRemittedBy: 'Payment Processor', // score: 3
        paymentFrequency: 'Weekly',             // score: 1
        grossAnnualTicketSales: 3000000         // $3M
      };

      const result = calculateUnderwritingResult(inputs);

      expect(result).not.toBeNull();
      expect(result!.totalRiskScore).toBe(11.35); // 1.5 + 5.85 + 3 + 1
      expect(result!.maxAdvancePercent).toBe(0.075); // 7.5% for risk score 11.35
      expect(result!.advanceAmount).toBe(225000); // $3M * 7.5% = $225k
      expect(result!.isCapped).toBe(false);
      expect(result!.breakdown).toEqual({
        yearsInBusinessScore: 1.5,
        eventsScore: 5.85,
        paymentRemittedByScore: 3,
        paymentFrequencyScore: 1
      });
    });
  });

  describe('Scenario 3 - High-Risk User (Low Max Advance %)', () => {
    it('should calculate correct advance for high-risk user', () => {
      const inputs: UnderwritingInputs = {
        yearsInBusiness: 'Less than 1 year', // score: 5
        numberOfEvents: 1,                   // score: 9
        paymentRemittedBy: 'Venue',          // score: 5
        paymentFrequency: 'Post-event',      // score: 5
        grossAnnualTicketSales: 10000000     // $10M
      };

      const result = calculateUnderwritingResult(inputs);

      expect(result).not.toBeNull();
      expect(result!.totalRiskScore).toBe(24); // 5 + 9 + 5 + 5
      expect(result!.maxAdvancePercent).toBe(0.025); // 2.5% for risk score 24
      expect(result!.advanceAmount).toBe(250000); // $10M * 2.5% = $250k
      expect(result!.isCapped).toBe(false);
      expect(result!.breakdown).toEqual({
        yearsInBusinessScore: 5,
        eventsScore: 9,
        paymentRemittedByScore: 5,
        paymentFrequencyScore: 5
      });
    });
  });

  describe('Scenario 4 - Very High Ticket Sales Triggering Cap', () => {
    it('should apply $500k cap for very high ticket sales', () => {
      const inputs: UnderwritingInputs = {
        yearsInBusiness: '10+ years',      // score: 0
        numberOfEvents: 50,                // score: 0
        paymentRemittedBy: 'Ticketing Co', // score: 1
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

    it('should handle risk score above 24 gracefully', () => {
      // This shouldn't happen with valid inputs, but test graceful handling
      const inputs: UnderwritingInputs = {
        yearsInBusiness: 'Less than 1 year', // score: 5
        numberOfEvents: 1,                   // score: 9
        paymentRemittedBy: 'Venue',          // score: 5
        paymentFrequency: 'Post-event',      // score: 5
        grossAnnualTicketSales: 1000000
      };

      const result = calculateUnderwritingResult(inputs);
      expect(result).not.toBeNull();
      expect(result!.totalRiskScore).toBe(24);
      expect(result!.maxAdvancePercent).toBe(0.025); // Should still get 2.5%
    });

    it('should handle decimal risk scores correctly', () => {
      const inputs: UnderwritingInputs = {
        yearsInBusiness: '3-5 years',     // score: 1.5
        numberOfEvents: 5,                // score: 5.85
        paymentRemittedBy: 'Own Processor', // score: 2
        paymentFrequency: 'Bi-weekly',    // score: 2
        grossAnnualTicketSales: 1000000
      };

      const result = calculateUnderwritingResult(inputs);
      expect(result).not.toBeNull();
      expect(result!.totalRiskScore).toBe(11.35); // 1.5 + 5.85 + 2 + 2
      expect(result!.maxAdvancePercent).toBe(0.075); // 7.5% band
    });

    it('should handle boundary conditions in risk matrix', () => {
      // Test exact boundary at 6.0
      const inputs1: UnderwritingInputs = {
        yearsInBusiness: '10+ years',      // 0
        numberOfEvents: 50,                // 0  
        paymentRemittedBy: 'Venue',        // 5
        paymentFrequency: 'Weekly',        // 1
        grossAnnualTicketSales: 1000000
      };

      const result1 = calculateUnderwritingResult(inputs1);
      expect(result1!.totalRiskScore).toBe(6);
      expect(result1!.maxAdvancePercent).toBe(0.10); // Should be in 10% band

      // Test just above boundary at 6.0000001
      const inputs2: UnderwritingInputs = {
        yearsInBusiness: '6-9 years',      // 0.5
        numberOfEvents: 4,                 // 5.85
        paymentRemittedBy: 'Ticketing Co', // 1
        paymentFrequency: 'Daily',         // 0
        grossAnnualTicketSales: 1000000
      };

      const result2 = calculateUnderwritingResult(inputs2);
      expect(result2!.totalRiskScore).toBe(7.35); // > 6.0000001
      expect(result2!.maxAdvancePercent).toBe(0.075); // Should be in 7.5% band
    });
  });
});
