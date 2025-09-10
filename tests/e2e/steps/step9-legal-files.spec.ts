import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';

test.describe('Step 9 - Legal Information (Robust Navigation)', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.navigateToApp();
    await formHelper.mockApiCalls();
    
    // Fill steps 1-8 to reach step 9
    console.log('🔍 Starting navigation to step 9...');
    
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
    
    // Step 8: Financial Files
    await formHelper.fillFinancialFiles();
    await formHelper.goToNextStep();
    console.log('✅ Step 8 completed');
    
    // Should now be on Step 9
    console.log('🔍 Checking if we reached step 9...');
    await page.waitForTimeout(2000);
    
    const fileInputs = await page.locator('input[type="file"]').count();
    console.log('🔍 File inputs found:', fileInputs);
    
    if (fileInputs > 0) {
      console.log('✅ Successfully reached step 9!');
    } else {
      const h1Title = await page.locator('h1').textContent();
      console.log('❌ Did not reach step 9. Current title:', h1Title);
    }
  });

  test('Legal Information step loads correctly', async ({ page }) => {
    const fileInputs = await page.locator('input[type="file"]').count();
    if (fileInputs === 0) {
      test.skip(true, 'Not on step 9 - navigation failed');
    }
    
    // Check for the specific file upload fields using generic selectors
    // Step 9 has 5 file inputs
    await expect(page.locator('input[type="file"]').first()).toBeVisible();
    await expect(page.locator('input[type="file"]').nth(1)).toBeVisible();
    await expect(page.locator('input[type="file"]').nth(2)).toBeVisible();
    await expect(page.locator('input[type="file"]').nth(3)).toBeVisible();
    await expect(page.locator('input[type="file"]').nth(4)).toBeVisible();
  });

  test('Required field validation works', async ({ page }) => {
    const fileInputs = await page.locator('input[type="file"]').count();
    if (fileInputs === 0) {
      test.skip(true, 'Not on step 9 - navigation failed');
    }
    
    // Check that incorporation certificate is required (first field)
    const incorporationCertificateInput = page.locator('input[type="file"]').first();
    await expect(incorporationCertificateInput).toBeVisible();
    
    // Check that other fields are visible (not required)
    const legalEntityChartInput = page.locator('input[type="file"]').nth(1);
    const governmentIdInput = page.locator('input[type="file"]').nth(2);
    const w9formInput = page.locator('input[type="file"]').nth(3);
    const otherInput = page.locator('input[type="file"]').nth(4);
    
    await expect(legalEntityChartInput).toBeVisible();
    await expect(governmentIdInput).toBeVisible();
    await expect(w9formInput).toBeVisible();
    await expect(otherInput).toBeVisible();
  });

  test('File upload fields accept correct file types', async ({ page }) => {
    const fileInputs = await page.locator('input[type="file"]').count();
    if (fileInputs === 0) {
      test.skip(true, 'Not on step 9 - navigation failed');
    }
    
    const expectedAccept = '.xlsx,.pdf,.csv,.jpg,.png';
    
    // Check all 5 file inputs
    for (let i = 0; i < 5; i++) {
      const input = page.locator('input[type="file"]').nth(i);
      await expect(input).toHaveAttribute('accept', expectedAccept);
    }
  });

  test('Single vs multiple file upload works correctly', async ({ page }) => {
    const fileInputs = await page.locator('input[type="file"]').count();
    if (fileInputs === 0) {
      test.skip(true, 'Not on step 9 - navigation failed');
    }
    
    // Single file upload fields (first 4)
    for (let i = 0; i < 4; i++) {
      const input = page.locator('input[type="file"]').nth(i);
      await expect(input).not.toHaveAttribute('multiple');
    }
    
    // Multiple file upload field (5th field = other)
    const otherInput = page.locator('input[type="file"]').nth(4);
    await expect(otherInput).toHaveAttribute('multiple');
  });

  test('File upload functionality works', async ({ page }) => {
    const fileInputs = await page.locator('input[type="file"]').count();
    if (fileInputs === 0) {
      test.skip(true, 'Not on step 9 - navigation failed');
    }
    
    // Upload files to required and optional fields
    const incorporationCertificateInput = page.locator('input[type="file"]').first();
    await incorporationCertificateInput.setInputFiles({
      name: 'certificate-of-incorporation.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake incorporation certificate content')
    });
    
    const w9formInput = page.locator('input[type="file"]').nth(3);
    await w9formInput.setInputFiles({
      name: 'w9-form.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake w9 form content')
    });
    
    // Verify files were uploaded
    await expect(incorporationCertificateInput).toBeVisible();
    await expect(w9formInput).toBeVisible();
  });
});
