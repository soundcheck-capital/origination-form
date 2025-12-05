/**
 * Underwriting Calculator - New Risk-Based Formula
 * 
 * Implements the updated underwriting formula based on:
 * - Risk Score calculation from 4 categories
 * - Risk matrix for Max Advance %
 * - Final advance amount with $500k cap
 */

// Risk scoring tables based on underwriting guidelines

/**
 * Years in Business Risk Scores
 */
export const YEARS_IN_BUSINESS_SCORES = {
  'Less than 1 year': 5,
  '1-2 years': 3,
  '2-5 years': 1.5,  // Updated to match original dropdown
  '5-10 years': 0.5, // Updated to match original dropdown
  '10+ years': 0
} as const;

/**
 * Number of Events Risk Scores
 */
export const EVENTS_SCORES = {
  '1': 9,
  '2-3': 7.8,
  '4-6': 5.85,
  '7-12': 3.9,
  '13-24': 1.95,
  '25-49': 0.975,
  '50+': 0
} as const;

/**
 * Payment Remitted By Risk Scores
 */
export const PAYMENT_REMITTED_BY_SCORES = {
  'From the Ticketing Co (e.g. Ticketmaster)': 1,
  'From the Payment Processor (e.g. Stripe)': 2,
  'From the Venue (e.g. MSG)': 5,
  'It varies': 3
} as const;

/**
 * Payment Frequency Risk Scores
 */
export const PAYMENT_FREQUENCY_SCORES = {
  'Daily': 0,
  'Weekly': 1,
  'Bi-monthly': 2,  // Updated to match original dropdown
  'Monthly': 3,
  'Post event': 5,  // Updated to match original dropdown
  'It varies': 4
} as const;

/**
 * Risk Matrix for Max Advance %
 */
export const RISK_MATRIX = [
  { lowerBound: 0, upperBound: 6, maxAdvancePercent: 0.10 },
  { lowerBound: 6.0000001, upperBound: 12, maxAdvancePercent: 0.075 },
  { lowerBound: 12.10, upperBound: 18, maxAdvancePercent: 0.05 },
  { lowerBound: 18.10, upperBound: 24, maxAdvancePercent: 0.025 }
] as const;

/**
 * Maximum advance amount cap
 */
export const MAX_ADVANCE_CAP = 500000;

/**
 * Interface for underwriting inputs
 */
export interface UnderwritingInputs {
  yearsInBusiness: string;
  numberOfEvents: number;
  paymentRemittedBy: string;
  paymentFrequency: string;
  grossAnnualTicketSales: number;
}

/**
 * Interface for calculation result
 */
export interface UnderwritingResult {
  totalRiskScore: number;
  maxAdvancePercent: number;
  advanceAmount: number;
  isCapped: boolean;
  breakdown: {
    yearsInBusinessScore: number;
    eventsScore: number;
    paymentRemittedByScore: number;
    paymentFrequencyScore: number;
  };
}

/**
 * Get risk score for years in business
 */
function getYearsInBusinessScore(yearsInBusiness: string): number {
  return YEARS_IN_BUSINESS_SCORES[yearsInBusiness as keyof typeof YEARS_IN_BUSINESS_SCORES] ?? 0;
}

/**
 * Get risk score for number of events
 */
function getEventsScore(numberOfEvents: number): number {
  if (numberOfEvents >= 50) return EVENTS_SCORES['50+'];
  if (numberOfEvents >= 25) return EVENTS_SCORES['25-49'];
  if (numberOfEvents >= 13) return EVENTS_SCORES['13-24'];
  if (numberOfEvents >= 7) return EVENTS_SCORES['7-12'];
  if (numberOfEvents >= 4) return EVENTS_SCORES['4-6'];
  if (numberOfEvents >= 2) return EVENTS_SCORES['2-3'];
  if (numberOfEvents === 1) return EVENTS_SCORES['1'];
  return 0;
}

/**
 * Get risk score for payment remitted by
 */
function getPaymentRemittedByScore(paymentRemittedBy: string): number {
  return PAYMENT_REMITTED_BY_SCORES[paymentRemittedBy as keyof typeof PAYMENT_REMITTED_BY_SCORES] ?? 0;
}

/**
 * Get risk score for payment frequency
 */
function getPaymentFrequencyScore(paymentFrequency: string): number {
  return PAYMENT_FREQUENCY_SCORES[paymentFrequency as keyof typeof PAYMENT_FREQUENCY_SCORES] ?? 0;
}

/**
 * Determine max advance percentage from risk matrix
 */
function getMaxAdvancePercent(totalRiskScore: number): number {
  // Clamp risk score to valid range
  const clampedScore = Math.max(0, Math.min(24, totalRiskScore));
  
  for (const band of RISK_MATRIX) {
    if (clampedScore >= band.lowerBound && clampedScore <= band.upperBound) {
      return band.maxAdvancePercent;
    }
  }
  
  // Fallback to lowest percentage if no match (should not happen)
  return 0.025;
}

/**
 * Calculate underwriting result based on new formula
 */
export function calculateUnderwritingResult(inputs: UnderwritingInputs): UnderwritingResult | null {
  // Validate inputs
  if (!inputs.yearsInBusiness || 
      inputs.numberOfEvents <= 0 || 
      !inputs.paymentRemittedBy || 
      !inputs.paymentFrequency || 
      inputs.grossAnnualTicketSales <= 0) {
    return null;
  }

  // Calculate individual risk scores
  const yearsInBusinessScore = getYearsInBusinessScore(inputs.yearsInBusiness);
  const eventsScore = getEventsScore(inputs.numberOfEvents);
  const paymentRemittedByScore = getPaymentRemittedByScore(inputs.paymentRemittedBy);
  const paymentFrequencyScore = getPaymentFrequencyScore(inputs.paymentFrequency);

  // Calculate total risk score
  const totalRiskScore = yearsInBusinessScore + eventsScore + paymentRemittedByScore + paymentFrequencyScore;

  // Determine max advance percentage from risk matrix
  const maxAdvancePercent = getMaxAdvancePercent(totalRiskScore);

  // Calculate raw advance amount
  const rawAdvanceAmount = inputs.grossAnnualTicketSales * maxAdvancePercent;

  // Apply cap
  const advanceAmount = Math.min(rawAdvanceAmount, MAX_ADVANCE_CAP);
  const isCapped = rawAdvanceAmount > MAX_ADVANCE_CAP;

  return {
    totalRiskScore,
    maxAdvancePercent,
    advanceAmount,
    isCapped,
    breakdown: {
      yearsInBusinessScore,
      eventsScore,
      paymentRemittedByScore,
      paymentFrequencyScore
    }
  };
}

/**
 * Format advance amount for display
 */
export function formatAdvanceAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercentage(percent: number): string {
  return `${(percent * 100).toFixed(1)}%`;
}
