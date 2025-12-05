/**
 * Debug utilities for underwriting calculations
 * Only used in development mode
 */

import { UnderwritingResult, UnderwritingInputs } from './underwritingCalculator';

/**
 * Log detailed breakdown of underwriting calculation
 */
export function logUnderwritingBreakdown(inputs: UnderwritingInputs, result: UnderwritingResult | null) {
  if (process.env.NODE_ENV !== 'development') return;
  
  console.group('🏦 Underwriting Calculation Breakdown');
  
  console.log('📊 Inputs:', {
    yearsInBusiness: inputs.yearsInBusiness,
    numberOfEvents: inputs.numberOfEvents,
    paymentRemittedBy: inputs.paymentRemittedBy,
    paymentFrequency: inputs.paymentFrequency,
    grossAnnualTicketSales: `$${inputs.grossAnnualTicketSales.toLocaleString()}`
  });
  
  if (result) {
    console.log('🎯 Risk Score Breakdown:', {
      yearsInBusiness: `${result.breakdown.yearsInBusinessScore} pts`,
      events: `${result.breakdown.eventsScore} pts`,
      paymentRemittedBy: `${result.breakdown.paymentRemittedByScore} pts`,
      paymentFrequency: `${result.breakdown.paymentFrequencyScore} pts`,
      total: `${result.totalRiskScore} pts`
    });
    
    console.log('💰 Final Calculation:', {
      maxAdvancePercent: `${(result.maxAdvancePercent * 100).toFixed(1)}%`,
      rawAmount: `$${(inputs.grossAnnualTicketSales * result.maxAdvancePercent).toLocaleString()}`,
      finalAmount: `$${result.advanceAmount.toLocaleString()}`,
      isCapped: result.isCapped ? '⚠️ YES (at $500k)' : '✅ NO'
    });
  } else {
    console.log('❌ Calculation failed - missing required inputs');
  }
  
  console.groupEnd();
}

/**
 * Validate that all required inputs are present for calculation
 */
export function validateInputsForDebug(inputs: Partial<UnderwritingInputs>): string[] {
  const errors: string[] = [];
  
  if (!inputs.yearsInBusiness) errors.push('Years in business is required');
  if (!inputs.numberOfEvents || inputs.numberOfEvents <= 0) errors.push('Number of events must be > 0');
  if (!inputs.paymentRemittedBy) errors.push('Payment remitted by is required');
  if (!inputs.paymentFrequency) errors.push('Payment frequency is required');
  if (!inputs.grossAnnualTicketSales || inputs.grossAnnualTicketSales <= 0) errors.push('Gross annual ticket sales must be > 0');
  
  return errors;
}
