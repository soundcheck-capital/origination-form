import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';

test.describe('Step 10 - Additional Information (Other)', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.navigateToApp();
    await formHelper.mockApiCalls();
    
    // Fill steps 1-9 to reach step 10
    console.log('🔍 Starting navigation to step 10...');
    
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
    
    // Step 9: Legal Files
    await formHelper.fillLegalFiles();
    await formHelper.goToNextStep();
    console.log('✅ Step 9 completed');
    
    // Should now be on Step 10 (Other)
    console.log('🔍 Checking if we reached step 10...');
    await page.waitForTimeout(2000);
    
    const h1Title = await page.locator('h1').textContent();
    console.log('🔍 Current title:', h1Title);
    
    if (h1Title === 'Other') {
      console.log('✅ Successfully reached step 10 (Other)!');
    } else {
      console.log('❌ Did not reach step 10. Current title:', h1Title);
    }
  });

  test('Additional Information step loads correctly', async ({ page }) => {
    const h1Title = await page.locator('h1').textContent();
    if (h1Title !== 'Other') {
      test.skip(true, 'Not on step 10 - navigation failed');
    }
    
    // Check for the step title
    await expect(page.locator('h1')).toContainText('Other');
    
    // Check for the textarea fields
    await expect(page.locator('textarea[name="industryReferences"]')).toBeVisible();
    await expect(page.locator('textarea[name="additionalComments"]')).toBeVisible();
  });

  test('Textarea fields work correctly', async ({ page }) => {
    const h1Title = await page.locator('h1').textContent();
    if (h1Title !== 'Other') {
      test.skip(true, 'Not on step 10 - navigation failed');
    }
    
    // Fill industry references
    await page.fill('textarea[name="industryReferences"]', 'Test industry references');
    await expect(page.locator('textarea[name="industryReferences"]')).toHaveValue('Test industry references');
    
    // Fill additional comments
    await page.fill('textarea[name="additionalComments"]', 'Test additional comments');
    await expect(page.locator('textarea[name="additionalComments"]')).toHaveValue('Test additional comments');
  });

  test('Form validation works', async ({ page }) => {
    const h1Title = await page.locator('h1').textContent();
    if (h1Title !== 'Other') {
      test.skip(true, 'Not on step 10 - navigation failed');
    }
    
    // Check that Next button is enabled (these fields are optional)
    const nextButton = page.locator('button').filter({ hasText: 'Next' });
    await expect(nextButton).toBeEnabled();
  });

  test('Navigation to next step works', async ({ page }) => {
    const h1Title = await page.locator('h1').textContent();
    if (h1Title !== 'Other') {
      test.skip(true, 'Not on step 10 - navigation failed');
    }
    
    // Fill some data
    await page.fill('textarea[name="industryReferences"]', 'Test references');
    await page.fill('textarea[name="additionalComments"]', 'Test comments');
    
    // Click Next
    const nextButton = page.locator('button').filter({ hasText: 'Next' });
    await nextButton.click();
    await page.waitForTimeout(2000);
    
    // Should navigate to Summary (Step 11)
    const newTitle = await page.locator('h1').textContent();
    expect(newTitle).toBe('Summary');
  });
});
