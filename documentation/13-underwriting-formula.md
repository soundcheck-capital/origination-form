# Underwriting Formula Implementation

## Overview

This document describes the implementation of the new risk-based underwriting formula for calculating advance amounts in the origination form.

## Formula Components

### 1. Risk Score Calculation

The total risk score is calculated by summing scores from four categories:

```
TotalRiskScore = YearsInBusinessScore + EventsScore + PaymentRemittedByScore + PaymentFrequencyScore
```

#### Years in Business Scoring
| Range | Score |
|-------|-------|
| Less than 1 year | 5 |
| 1-2 years | 3 |
| 3-5 years | 1.5 |
| 6-9 years | 0.5 |
| 10+ years | 0 |

#### Number of Events Scoring
| Range | Score |
|-------|-------|
| 1 | 9 |
| 2-3 | 7.8 |
| 4-6 | 5.85 |
| 7-12 | 3.9 |
| 13-24 | 1.95 |
| 25-49 | 0.975 |
| 50+ | 0 |

#### Payment Remitted By Scoring
| Option | Score |
|--------|-------|
| Ticketing Co | 1 |
| Own Processor | 2 |
| Payment Processor | 3 |
| Venue | 5 |

#### Payment Frequency Scoring
| Option | Score |
|--------|-------|
| Daily | 0 |
| Weekly | 1 |
| Bi-weekly | 2 |
| Monthly | 3 |
| Post-event | 5 |

### 2. Risk Matrix for Max Advance %

| Risk Score Range | Max Advance % |
|------------------|---------------|
| 0.00 - 6.00 | 10% |
| 6.0000001 - 12.00 | 7.5% |
| 12.10 - 18.00 | 5% |
| 18.10 - 24.00 | 2.5% |

### 3. Final Advance Calculation

```
AdvanceAmount = GrossAnnualTicketSales × MaxAdvancePercent
```

With a maximum cap of $500,000:

```
If AdvanceAmount > $500,000 → AdvanceAmount = $500,000
```

## Implementation Files

- **`src/utils/underwritingCalculator.ts`** - Main calculation logic
- **`src/utils/underwritingDebug.ts`** - Development debugging utilities
- **`src/utils/__tests__/underwritingCalculator.test.ts`** - Test cases for all scenarios
- **`src/components/step2/TicketingVolumeStep.tsx`** - Integration in Step 2

## Test Scenarios

The implementation includes comprehensive tests covering:

1. **Low-Risk User** (10% advance rate)
2. **Medium-Risk User** (7.5% advance rate)  
3. **High-Risk User** (2.5% advance rate)
4. **Cap Triggering** ($500k maximum)
5. **Edge Cases** (boundary conditions, missing inputs)

## Usage

The calculation is automatically performed in Step 2 when all required inputs are available:

- Years in business (from company info)
- Number of events (from ticketing volume)
- Payment remitted by (from ticketing info)
- Payment frequency (from ticketing info)
- Gross annual ticket sales (from ticketing volume)

## Debug Mode

In development mode, detailed calculation breakdowns are logged to the console, showing:

- Input values
- Individual risk scores
- Total risk score
- Max advance percentage
- Final calculated amount
- Whether the cap was applied

## Future Considerations

- The risk matrix and scoring tables are hardcoded for performance
- Any changes to underwriting guidelines require code updates and redeployment
- Consider moving to a configuration-based system if frequent updates are needed
