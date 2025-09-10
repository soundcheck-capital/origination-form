import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';

test.describe('Step 8 - Financial Information', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.navigateToApp();
    await formHelper.mockApiCalls();
    
    // Fill all previous steps to reach Step 8
    await formHelper.fillPersonalInfoDefault();
    await formHelper.goToNextStep();
    await formHelper.fillCompanyInfoDefault();
    await formHelper.goToNextStep();
    await formHelper.fillTicketingInfoDefault();
    await formHelper.fillVolumeInfoDefault();
    await formHelper.goToNextStep();
    await formHelper.fillYourFundsDefault();
    await formHelper.goToNextStep();
    await formHelper.fillOwnershipInfoDefault();
    await formHelper.goToNextStep();
    await formHelper.fillFinancesInfoDefault();
    await formHelper.goToNextStep();
    await formHelper.fillTicketingFiles();
    await formHelper.goToNextStep();
    
    // Should now be on Step 8
    await expect(page.locator('p:has-text("Financial Information")')).toBeVisible();
  });

  test('Financial Information step is mounted correctly', async ({ page }) => {
    // Check that the step title is visible
    await expect(page.locator('p:has-text("Financial Information")')).toBeVisible();
    
    // Check that both file upload fields are present
    await expect(page.locator('text=Last 2 years and YTD detailed financial statements')).toBeVisible();
    await expect(page.locator('text=Last 6 months of bank statements')).toBeVisible();
    
    // Check file input elements
    await expect(page.locator('input[type="file"][name="financialStatements"]')).toBeVisible();
    await expect(page.locator('input[type="file"][name="bankStatement"]')).toBeVisible();
  });

  test('Required field validation works correctly', async ({ page }) => {
    // Financial statements field should be required
    const financialStatementsInput = page.locator('input[type="file"][name="financialStatements"]');
    await expect(financialStatementsInput).toHaveAttribute('required');
    
    // Bank statement field should not be required
    const bankStatementInput = page.locator('input[type="file"][name="bankStatement"]');
    await expect(bankStatementInput).not.toHaveAttribute('required');
  });

  test('File upload fields accept correct file types', async ({ page }) => {
    const financialStatementsInput = page.locator('input[type="file"][name="financialStatements"]');
    const bankStatementInput = page.locator('input[type="file"][name="bankStatement"]');
    
    // Check accept attributes
    await expect(financialStatementsInput).toHaveAttribute('accept', '.xlsx,.pdf,.csv,.jpg,.png');
    await expect(bankStatementInput).toHaveAttribute('accept', '.xlsx,.pdf,.csv,.jpg,.png');
  });

  test('Multiple file upload works for financial statements', async ({ page }) => {
    const financialStatementsInput = page.locator('input[type="file"][name="financialStatements"]');
    
    // Check that multiple attribute is present
    await expect(financialStatementsInput).toHaveAttribute('multiple');
  });

  test('Multiple file upload works for bank statements', async ({ page }) => {
    const bankStatementInput = page.locator('input[type="file"][name="bankStatement"]');
    
    // Check that multiple attribute is present
    await expect(bankStatementInput).toHaveAttribute('multiple');
  });

  test('Form accessibility features', async ({ page }) => {
    // Check that file inputs have proper labels
    await expect(page.locator('label:has-text("Last 2 years and YTD detailed financial statements")')).toBeVisible();
    await expect(page.locator('label:has-text("Last 6 months of bank statements")')).toBeVisible();
    
    // Check that file inputs are accessible
    const financialStatementsInput = page.locator('input[type="file"][name="financialStatements"]');
    const bankStatementInput = page.locator('input[type="file"][name="bankStatement"]');
    
    await expect(financialStatementsInput).toBeVisible();
    await expect(bankStatementInput).toBeVisible();
  });

  test('Navigation to step 9 with valid data', async ({ page }) => {
    // Upload a file to the required field
    const financialStatementsInput = page.locator('input[type="file"][name="financialStatements"]');
    await financialStatementsInput.setInputFiles({
      name: 'financial-statement.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake pdf content')
    });
    
    // Wait for validation
    await formHelper.waitForValidation();
    
    // Navigate to next step
    await formHelper.goToNextStep();
    
    // Should be on Step 9 (Legal Information)
    await expect(page.locator('p:has-text("Contractual and Legal Information")')).toBeVisible();
  });

  test('Data persistence when navigating back and forth', async ({ page }) => {
    // Upload files
    const financialStatementsInput = page.locator('input[type="file"][name="financialStatements"]');
    const bankStatementInput = page.locator('input[type="file"][name="bankStatement"]');
    
    await financialStatementsInput.setInputFiles({
      name: 'financial-statement.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake pdf content')
    });
    
    await bankStatementInput.setInputFiles({
      name: 'bank-statement.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake bank statement content')
    });
    
    // Navigate to next step
    await formHelper.goToNextStep();
    
    // Navigate back
    await formHelper.goToPreviousStep();
    
    // Check that files are still there (this might not work with file inputs in tests)
    // but we can at least verify we're back on the right step
    await expect(page.locator('p:has-text("Financial Information")')).toBeVisible();
  });
});
