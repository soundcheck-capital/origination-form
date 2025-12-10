# Underwriting Configuration

This folder contains the business logic configuration for the underwriting calculator.

## Files

- **`underwritingConfig.ts`** - Risk scoring tables and matrix

## How to Update Underwriting Rules

### 1. Modify Risk Scores

To change how different business characteristics are scored:

```typescript
// Example: Make "Less than 1 year" less risky
export const YEARS_IN_BUSINESS_SCORES = {
  'Less than 1 year': 3, // Changed from 5 to 3
  '1-2 years': 3,
  // ... rest unchanged
}
```

### 2. Update Risk Matrix

To change advance percentages for different risk levels:

```typescript
// Example: Increase advance % for low-risk customers
export const RISK_MATRIX = [
  { 
    lowerBound: 0, 
    upperBound: 6, 
    maxAdvancePercent: 0.15, // Changed from 0.10 to 0.15 (15%)
    description: 'Low Risk - 15% max advance'
  },
  // ... rest unchanged
]
```

### 3. Adjust Maximum Cap

To change the maximum advance amount:

```typescript
// Example: Increase cap to $750k
export const MAX_ADVANCE_CAP = 750000; // Changed from 500000
```

## Testing Changes

After making changes:

1. **Run tests**: `npm test -- --testPathPattern="underwritingCalculator"`
2. **Update test expectations** if needed
3. **Test manually** in the application
4. **Update documentation** to reflect new rules

## Validation

The configuration includes automatic validation that runs in development mode to ensure:

- Risk matrix starts at score 0
- Risk matrix covers the maximum possible score (24)
- No gaps in risk score coverage

Check the browser console for validation messages when the app loads.
