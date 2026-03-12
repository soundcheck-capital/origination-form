/**
 * Underwriting Configuration - Risk Scoring Tables and Matrix
 * 
 * This file contains all the risk scoring data used by the underwriting calculator.
 * Modify these values to update the underwriting logic without changing the code.
 */

/**
 * Years in Business Risk Scores (from CSV)
 */
export const YEARS_IN_BUSINESS_SCORES = {
  'Less than 1 year': 10,  // "0" in CSV
  '1-2 years': 8,          // "1, 2" in CSV
  '2-5 years': 5,          // "3, 4, 5" in CSV
  '5-10 years': 3,         // "6,7,8,9" in CSV
  '10+ years': 0           // "10+" in CSV
} as const;

/**
 * Number of Events Risk Scores (from CSV)
 */
export const EVENTS_SCORES = {
  '1': 10,        // "1 event" in CSV
  '2-3': 8,       // "2-3 events" in CSV
  '4-6': 7,       // "4-6 events" in CSV
  '7-10': 6,      // "7-10 events" in CSV
  '11-20': 5,     // "11-20 events" in CSV
  '21+': 4,       // "21+ events" in CSV
  '50+': 0        // "50+ events" in CSV
} as const;

/**
 * Payment Remitted By Risk Scores (from CSV)
 */
export const PAYMENT_REMITTED_BY_SCORES = {
  'From the Ticketing Co (e.g. Ticketmaster)': 1,  // "From Ticketing Co" in CSV
  'From the Payment Processor (e.g. Stripe)': 3,   // "From Payment Processor" in CSV
  'From the Venue (e.g. MSG)': 5,                  // "From Venue" in CSV
  'It varies': 10                                   // "Other" in CSV
} as const;

/**
 * Aliases for payment remitted by values coming from the form/UI.
 * We keep a canonical set of score keys and normalize user selections to them.
 */
export const PAYMENT_REMITTED_BY_ALIASES: Record<string, keyof typeof PAYMENT_REMITTED_BY_SCORES> = {
  'My Ticketing Co': 'From the Ticketing Co (e.g. Ticketmaster)',
  'The Payment Processor (e.g. Stripe)': 'From the Payment Processor (e.g. Stripe)',
  'The Venue (e.g. MSG)': 'From the Venue (e.g. MSG)'
};

/**
 * Payment Frequency Risk Scores (from CSV)
 */
export const PAYMENT_FREQUENCY_SCORES = {
  'Daily': 0,        // "Daily" in CSV
  'Weekly': 1,       // "Weekly" in CSV
  'Bi-monthly': 2,   // "Bi Monthly" in CSV
  'Monthly': 3,      // "Monthly" in CSV
  'Post event': 5,   // "Post Event" in CSV
  'It varies': 5     // "Other" in CSV
} as const;

/**
 * Risk Matrix for Max Advance % (from CSV)
 * 
 * Each band defines:
 * - lowerBound: Minimum risk score (inclusive)
 * - upperBound: Maximum risk score (inclusive)
 * - maxAdvancePercent: Maximum advance percentage for this risk band by customer type
 */
export const RISK_MATRIX = [
  {
    lowerBound: 0,
    upperBound: 7,
    maxAdvancePercent: {
      V_O: 0.14,
      P: 0.20,
      F: 0.26
    },
    description: 'Low Risk'
  },
  {
    lowerBound: 7.1,
    upperBound: 14,
    maxAdvancePercent: {
      V_O: 0.11,
      P: 0.15,
      F: 0.19
    },
    description: 'Medium-Low Risk'
  },
  {
    lowerBound: 14.1,
    upperBound: 21,
    maxAdvancePercent: {
      V_O: 0.08,
      P: 0.10,
      F: 0.12
    },
    description: 'Medium-High Risk'
  },
  {
    lowerBound: 21.1,
    upperBound: 35,
    maxAdvancePercent: {
      V_O: 0.05,
      P: 0.05,
      F: 0.05
    },
    description: 'High Risk'
  }
] as const;

/**
 * Maximum advance amount cap (in dollars)
 */
export const MAX_ADVANCE_CAP = 500000;

/**
 * Customer type groups used by the matrix in the CSV:
 * - V_O: Venue / Operator / Other
 * - P: Promoter
 * - F: Festival
 */
export const CUSTOMER_TYPE_MATRIX_GROUP: Record<string, 'V_O' | 'P' | 'F'> = {
  Festival: 'F',
  Promoter: 'P',
  Venue: 'V_O'
};
export const DEFAULT_CUSTOMER_TYPE_MATRIX_GROUP = 'V_O';

/**
 * Maximum possible risk score from the CSV scoring model.
 */
export const MAX_RISK_SCORE = 35;

/**
 * Configuration metadata
 */
export const UNDERWRITING_CONFIG_VERSION = '1.1.0';
export const LAST_UPDATED = '2026-03-12';

/**
 * Validation: Ensure risk matrix covers full range
 */
const validateRiskMatrix = () => {
  const minScore = Math.min(...RISK_MATRIX.map(band => band.lowerBound));
  const maxScore = Math.max(...RISK_MATRIX.map(band => band.upperBound));
  
  if (minScore !== 0) {
    console.warn('⚠️ Risk matrix does not start at 0');
  }
  
  if (maxScore < MAX_RISK_SCORE) {
    console.warn(`⚠️ Risk matrix does not cover maximum possible score (${MAX_RISK_SCORE})`);
  }
  
  return { minScore, maxScore, isValid: minScore === 0 && maxScore >= MAX_RISK_SCORE };
};

// Auto-validate in development
if (process.env.NODE_ENV === 'development') {
  validateRiskMatrix();
}
