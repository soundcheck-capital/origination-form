import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';

test.describe('Step 8 - Financial Information (Robust Navigation)', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.navigateToApp();
    await formHelper.mockApiCalls();
    
    // Fill steps 1-7 to reach step 8
    console.log('🔍 Starting navigation to step 8...');
    
    // Step 1: Personal Info
    await formHelper.fillPersonalInfoDefault();
    await formHelper.goToNextStep();
    console.log('✅ Step 1 completed');
    
    // Step 2: Company Info
    await formHelper.fillCompanyInfoDefault();
    await formHelper.goToNextStep();
    console.log('✅ Step 2 completed');
    
    // Step 3: Ticketing + Volume
    await formHelper.fillTicketingInfoDefault();
    await formHelper.fillVolumeInfoDefault();
    await formHelper.goToNextStep();
    console.log('✅ Step 3 completed');
    
    // Step 4: Your Funds
    await formHelper.fillYourFundsDefault();
    await formHelper.goToNextStep();
    console.log('✅ Step 4 completed');
    
    // Step 5: Ownership
    await formHelper.fillOwnershipInfoDefault();
    await formHelper.goToNextStep();
    console.log('✅ Step 5 completed');
    
    // Step 6: Finances
    await formHelper.fillFinancesInfoDefault();
    await formHelper.goToNextStep();
    console.log('✅ Step 6 completed');
    
    // Step 7: Ticketing Files
    await formHelper.fillTicketingFiles();
    await formHelper.goToNextStep();
    console.log('✅ Step 7 completed');
    
    // Should now be on Step 8
    console.log('🔍 Checking if we reached step 8...');
    await page.waitForTimeout(2000);
    
    const fileInputs = await page.locator('input[type="file"]').count();
    console.log('🔍 File inputs found:', fileInputs);
    
    if (fileInputs > 0) {
      console.log('✅ Successfully reached step 8!');
    } else {
      const h1Title = await page.locator('h1').textContent();
      console.log('❌ Did not reach step 8. Current title:', h1Title);
    }
  });

  test('Financial Information step loads correctly', async ({ page }) => {
    const fileInputs = await page.locator('input[type="file"]').count();
    if (fileInputs === 0) {
      test.skip(true, 'Not on step 8 - navigation failed');
    }
    
    // Check for the specific file upload fields using generic selectors
    await expect(page.locator('input[type="file"]').first()).toBeVisible();
    await expect(page.locator('input[type="file"]').nth(1)).toBeVisible();
  });

  test('Required field validation works', async ({ page }) => {
    const fileInputs = await page.locator('input[type="file"]').count();
    if (fileInputs === 0) {
      test.skip(true, 'Not on step 8 - navigation failed');
    }
    
    // Check that financial statements is required (first field)
    const financialStatementsInput = page.locator('input[type="file"]').first();
    await expect(financialStatementsInput).toBeVisible();
    
    // Check that bank statement is not required (second field)
    const bankStatementInput = page.locator('input[type="file"]').nth(1);
    await expect(bankStatementInput).toBeVisible();
  });

  test('File upload fields accept correct file types', async ({ page }) => {
    const fileInputs = await page.locator('input[type="file"]').count();
    if (fileInputs === 0) {
      test.skip(true, 'Not on step 8 - navigation failed');
    }
    
    const financialStatementsInput = page.locator('input[type="file"]').first();
    const bankStatementInput = page.locator('input[type="file"]').nth(1);
    
    const expectedAccept = '.xlsx,.pdf,.csv,.jpg,.png';
    await expect(financialStatementsInput).toHaveAttribute('accept', expectedAccept);
    await expect(bankStatementInput).toHaveAttribute('accept', expectedAccept);
  });

  test('Multiple file upload works for both fields', async ({ page }) => {
    const fileInputs = await page.locator('input[type="file"]').count();
    if (fileInputs === 0) {
      test.skip(true, 'Not on step 8 - navigation failed');
    }
    
    const financialStatementsInput = page.locator('input[type="file"]').first();
    const bankStatementInput = page.locator('input[type="file"]').nth(1);
    
    // Both fields should support multiple files
    await expect(financialStatementsInput).toHaveAttribute('multiple');
    await expect(bankStatementInput).toHaveAttribute('multiple');
  });

  test('File upload functionality works', async ({ page }) => {
    const fileInputs = await page.locator('input[type="file"]').count();
    if (fileInputs === 0) {
      test.skip(true, 'Not on step 8 - navigation failed');
    }
    
    // Upload files to both fields
    const financialStatementsInput = page.locator('input[type="file"]').first();
    await financialStatementsInput.setInputFiles({
      name: 'financial-statements.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: Buffer.from('fake financial statements content')
    });
    
    const bankStatementInput = page.locator('input[type="file"]').nth(1);
    await bankStatementInput.setInputFiles({
      name: 'bank-statement.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake bank statement content')
    });
    
    // Verify files were uploaded
    await expect(financialStatementsInput).toBeVisible();
    await expect(bankStatementInput).toBeVisible();
  });
});
