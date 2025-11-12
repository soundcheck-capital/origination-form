/**
 * Calculate the maximum advance amount based on ticket sales data
 * Formula: 10% × MIN(Last Sales, Next Sales), capped at $500,000
 *
 * @param lastGrossSales - Gross ticket sales from last 12 months
 * @param nextGrossSales - Gross ticket sales for next 12 months
 * @returns Maximum advance amount (number)
 */
export function calculateMaxAdvance(
  lastGrossSales: number,
  nextGrossSales: number
): number {
  // Convert to numbers if needed
  const lastSales = Number(lastGrossSales) || 0;
  const nextSales = Number(nextGrossSales) || 0;

  // Find minimum of the two
  const minSales = Math.min(lastSales, nextSales);

  // Multiply by 10%
  const calculatedAmount = minSales * 0.10;

  // Apply $500,000 cap
  const maxAdvance = Math.min(calculatedAmount, 500000);

  return maxAdvance;
}
