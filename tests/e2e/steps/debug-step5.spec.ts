import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';

test.describe('Debug Step 5 - Ownership', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.navigateToApp();
    await formHelper.mockApiCalls();
    
    // Fill steps 1-4 to reach step 5
    console.log('🔍 Starting navigation to step 5...');
    
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
    
    // Should now be on Step 5
    console.log('🔍 Checking if we reached step 5...');
    await page.waitForTimeout(2000);
    
    const h1Title = await page.locator('h1').textContent();
    console.log('🔍 Current h1 title:', h1Title);
  });

  test('Step 5 loads correctly', async ({ page }) => {
    const h1Title = await page.locator('h1').textContent();
    expect(h1Title).toBe('Business & Ownership');
  });

  test('Step 5 fields are visible', async ({ page }) => {
    // Check for company fields
    await expect(page.locator('input[name="legalEntityName"]')).toBeVisible();
    await expect(page.locator('input[name="dba"]')).toBeVisible();
    await expect(page.locator('input[name="ein"]')).toBeVisible();
    await expect(page.locator('input[name="companyAddressDisplay"]')).toBeVisible();
    await expect(page.locator('select[name="stateOfIncorporation"]')).toBeVisible();
    await expect(page.locator('select[name="businessType"]')).toBeVisible();
    
    // Check for owner fields
    await expect(page.locator('input[name="owner0Name"]')).toBeVisible();
    await expect(page.locator('input[name="owner0Percentage"]')).toBeVisible();
    await expect(page.locator('input[name="owner0Address"]')).toBeVisible();
    await expect(page.locator('input[name="owner0BirthDate"]')).toBeVisible();
  });

  test('Fill Step 5 and check validation', async ({ page }) => {
    // Fill company fields
    await page.fill('input[name="legalEntityName"]', 'Test Company LLC');
    await page.fill('input[name="dba"]', 'Test Company');
    await page.fill('input[name="ein"]', '12-3456789');
    await page.fill('input[name="companyAddressDisplay"]', '123 Main St, New York, NY 10001');
    await page.selectOption('select[name="stateOfIncorporation"]', 'NY');
    await page.selectOption('select[name="businessType"]', 'Limited Liability Company (LLC)');
    
    // Fill owner fields
    await page.fill('input[name="owner0Name"]', 'John Doe');
    await page.fill('input[name="owner0Percentage"]', '50');
    await page.fill('input[name="owner0Address"]', '123 Main St, New York, NY 10001');
    await page.fill('input[name="owner0BirthDate"]', '1980-01-01');
    
    // Wait for validation
    await page.waitForTimeout(1000);
    
    // Check if Next button is enabled
    const nextButton = page.locator('button:has-text("Next")');
    const isEnabled = await nextButton.isEnabled();
    console.log('🔍 Next button enabled:', isEnabled);
    
    // Try to click Next
    if (isEnabled) {
      await nextButton.click();
      await page.waitForTimeout(2000);
      
      const newTitle = await page.locator('h1').textContent();
      console.log('🔍 After Next click, title:', newTitle);
    } else {
      console.log('❌ Next button is disabled');
      
      // Check for validation errors
      const errorElements = await page.locator('.text-red-500, .error, [class*="error"]').count();
      console.log('🔍 Error elements found:', errorElements);
      
      if (errorElements > 0) {
        const errorTexts = await page.locator('.text-red-500, .error, [class*="error"]').allTextContents();
        console.log('🔍 Error texts:', errorTexts);
      }
    }
  });
});
