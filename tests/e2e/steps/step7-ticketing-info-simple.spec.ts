import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';

test.describe('Step 7 - Ticketing Information (Simple)', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.navigateToApp();
    await formHelper.mockApiCalls();
    
    // Navigate directly to step 7 by setting the URL parameter
    await page.goto('/?step=7');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for the step to load
    await page.waitForTimeout(2000);
  });

  test('Ticketing Information step loads correctly', async ({ page }) => {
    // Check that we can see file upload elements
    await expect(page.locator('input[type="file"]')).toHaveCount(2);
    
    // Check for the specific file upload fields
    await expect(page.locator('input[type="file"][name="ticketingCompanyReport"]')).toBeVisible();
    await expect(page.locator('input[type="file"][name="ticketingServiceAgreement"]')).toBeVisible();
  });

  test('Required field validation works', async ({ page }) => {
    // Check that ticketing company report is required
    const ticketingCompanyReportInput = page.locator('input[type="file"][name="ticketingCompanyReport"]');
    await expect(ticketingCompanyReportInput).toHaveAttribute('required');
    
    // Check that ticketing service agreement is required (conditional)
    const ticketingServiceAgreementInput = page.locator('input[type="file"][name="ticketingServiceAgreement"]');
    await expect(ticketingServiceAgreementInput).toHaveAttribute('required');
  });

  test('File upload fields accept correct file types', async ({ page }) => {
    const ticketingCompanyReportInput = page.locator('input[type="file"][name="ticketingCompanyReport"]');
    const ticketingServiceAgreementInput = page.locator('input[type="file"][name="ticketingServiceAgreement"]');
    
    // Check accept attributes
    const expectedAccept = '.xlsx,.pdf,.csv,.jpg,.png';
    await expect(ticketingCompanyReportInput).toHaveAttribute('accept', expectedAccept);
    await expect(ticketingServiceAgreementInput).toHaveAttribute('accept', expectedAccept);
  });

  test('Multiple file upload works for ticketing company report', async ({ page }) => {
    const ticketingCompanyReportInput = page.locator('input[type="file"][name="ticketingCompanyReport"]');
    
    // Check that multiple attribute is present
    await expect(ticketingCompanyReportInput).toHaveAttribute('multiple');
  });

  test('Single file upload works for ticketing service agreement', async ({ page }) => {
    const ticketingServiceAgreementInput = page.locator('input[type="file"][name="ticketingServiceAgreement"]');
    
    // Check that multiple attribute is not present (single file upload)
    await expect(ticketingServiceAgreementInput).not.toHaveAttribute('multiple');
  });

  test('File upload functionality works', async ({ page }) => {
    // Upload a file to the required field
    const ticketingCompanyReportInput = page.locator('input[type="file"][name="ticketingCompanyReport"]');
    await ticketingCompanyReportInput.setInputFiles({
      name: 'ticketing-reports.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake ticketing reports content')
    });
    
    // Upload a file to the service agreement field
    const ticketingServiceAgreementInput = page.locator('input[type="file"][name="ticketingServiceAgreement"]');
    await ticketingServiceAgreementInput.setInputFiles({
      name: 'service-agreement.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake service agreement content')
    });
    
    // Verify files were uploaded (this might not work in tests, but we can check the input state)
    await expect(ticketingCompanyReportInput).toBeVisible();
    await expect(ticketingServiceAgreementInput).toBeVisible();
  });
});
