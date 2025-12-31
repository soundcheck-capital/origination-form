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
      yearsInBusiness: `${result.breakdown.yearsInBusinessScore} pts (${inputs.yearsInBusiness})`,
      events: `${result.breakdown.eventsScore} pts (${inputs.numberOfEvents} events)`,
      paymentRemittedBy: `${result.breakdown.paymentRemittedByScore} pts (${inputs.paymentRemittedBy})`,
      paymentFrequency: `${result.breakdown.paymentFrequencyScore} pts (${inputs.paymentFrequency})`,
      total: `${result.totalRiskScore} / 24 pts`
    });
    
    // Determine risk band
    let riskBand = 'Unknown';
    if (result.totalRiskScore <= 6) riskBand = 'Low Risk (0-6)';
    else if (result.totalRiskScore <= 12) riskBand = 'Medium-Low Risk (6.01-12)';
    else if (result.totalRiskScore <= 18) riskBand = 'Medium-High Risk (12.01-18)';
    else riskBand = 'High Risk (18.01-24)';
    
    console.log('📈 Risk Assessment:', {
      riskBand,
      maxAdvancePercent: `${(result.maxAdvancePercent * 100).toFixed(1)}%`
    });
    
    console.log('💰 Final Calculation:', {
      grossSales: `$${inputs.grossAnnualTicketSales.toLocaleString()}`,
      advanceRate: `${(result.maxAdvancePercent * 100).toFixed(1)}%`,
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

/**
 * Quick risk score calculator for console debugging
 * Usage: window.calculateRisk({ yearsInBusiness: '10+ years', ... })
 */
export function quickRiskCalculator(inputs: UnderwritingInputs) {
  if (process.env.NODE_ENV !== 'development') {
    console.log('⚠️ Risk calculator only available in development mode');
    return;
  }
  
  const { calculateUnderwritingResult } = require('./underwritingCalculator');
  const result = calculateUnderwritingResult(inputs);
  
  if (result) {
    logUnderwritingBreakdown(inputs, result);
    return result;
  } else {
    console.log('❌ Invalid inputs provided');
    console.log('Validation errors:', validateInputsForDebug(inputs));
    return null;
  }
}

// Make it available globally in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  (window as any).calculateRisk = quickRiskCalculator;
  console.log('🔧 Debug tool available: window.calculateRisk({ yearsInBusiness: "10+ years", numberOfEvents: 50, ... })');
}
