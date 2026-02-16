/**
 * Debug utilities for underwriting calculations
 * Only used in development mode
 */

import { UnderwritingResult, UnderwritingInputs } from './underwritingCalculator';

/**
 * Log detailed breakdown of underwriting calculation
 */
export function logUnderwritingBreakdown(_inputs: UnderwritingInputs, result: UnderwritingResult | null) {
  if (process.env.NODE_ENV !== 'development') return;
  if (!result) {
    return;
  }
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

/**
 * Quick risk score calculator for console debugging
 * Usage: window.calculateRisk({ yearsInBusiness: '10+ years', ... })
 */
export function quickRiskCalculator(inputs: UnderwritingInputs) {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  
  const { calculateUnderwritingResult } = require('./underwritingCalculator');
  const result = calculateUnderwritingResult(inputs);
  
  if (result) {
    logUnderwritingBreakdown(inputs, result);
    return result;
  } else {
    return null;
  }
}

// Make it available globally in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  (window as any).calculateRisk = quickRiskCalculator;
}
