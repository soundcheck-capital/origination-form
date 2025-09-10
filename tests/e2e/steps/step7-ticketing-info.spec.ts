import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';

test.describe('Step 7 - Ticketing Information', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.navigateToApp();
    await formHelper.mockApiCalls();
    
    // Fill all previous steps to reach Step 7
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
    
    // Should now be on Step 7
    await expect(page.locator('p:has-text("Ticketing Information")')).toBeVisible();
  });

  test('Ticketing Information step is mounted correctly', async ({ page }) => {
    // Check that the step title is visible
    await expect(page.locator('p:has-text("Ticketing Information")')).toBeVisible();
    
    // Check that both file upload fields are present
    await expect(page.locator('text=Reports from ticketing company (last 3 years)')).toBeVisible();
    await expect(page.locator('text=Copy of Ticketing Service Agreement')).toBeVisible();
    
    // Check file input elements
    await expect(page.locator('input[type="file"][name="ticketingCompanyReport"]')).toBeVisible();
    await expect(page.locator('input[type="file"][name="ticketingServiceAgreement"]')).toBeVisible();
  });

  test('Required field validation works correctly', async ({ page }) => {
    // Ticketing company report field should be required
    const ticketingCompanyReportInput = page.locator('input[type="file"][name="ticketingCompanyReport"]');
    await expect(ticketingCompanyReportInput).toHaveAttribute('required');
    
    // Ticketing service agreement field should be required (based on paymentProcessing)
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

  test('Form accessibility features', async ({ page }) => {
    // Check that file inputs have proper labels
    await expect(page.locator('label:has-text("Reports from ticketing company (last 3 years)")')).toBeVisible();
    await expect(page.locator('label:has-text("Copy of Ticketing Service Agreement")')).toBeVisible();
    
    // Check that file inputs are accessible
    const ticketingCompanyReportInput = page.locator('input[type="file"][name="ticketingCompanyReport"]');
    const ticketingServiceAgreementInput = page.locator('input[type="file"][name="ticketingServiceAgreement"]');
    
    await expect(ticketingCompanyReportInput).toBeVisible();
    await expect(ticketingServiceAgreementInput).toBeVisible();
  });

  test('Ticketing company report description is visible', async ({ page }) => {
    // Check that the description for the ticketing company report is visible
    await expect(page.locator('text=Not just Excel summary, including # events, $ gross ticket sales, # tickets sold per month')).toBeVisible();
  });

  test('Navigation to step 8 with valid data', async ({ page }) => {
    // Upload files to both required fields
    const ticketingCompanyReportInput = page.locator('input[type="file"][name="ticketingCompanyReport"]');
    const ticketingServiceAgreementInput = page.locator('input[type="file"][name="ticketingServiceAgreement"]');
    
    await ticketingCompanyReportInput.setInputFiles({
      name: 'ticketing-report.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake pdf content')
    });
    
    await ticketingServiceAgreementInput.setInputFiles({
      name: 'service-agreement.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake agreement content')
    });
    
    // Wait for validation
    await formHelper.waitForValidation();
    
    // Navigate to next step
    await formHelper.goToNextStep();
    
    // Should be on Step 8 (Financial Information)
    await expect(page.locator('p:has-text("Financial Information")')).toBeVisible();
  });

  test('Data persistence when navigating back and forth', async ({ page }) => {
    // Upload files
    const ticketingCompanyReportInput = page.locator('input[type="file"][name="ticketingCompanyReport"]');
    const ticketingServiceAgreementInput = page.locator('input[type="file"][name="ticketingServiceAgreement"]');
    
    await ticketingCompanyReportInput.setInputFiles({
      name: 'ticketing-report.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake pdf content')
    });
    
    await ticketingServiceAgreementInput.setInputFiles({
      name: 'service-agreement.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake agreement content')
    });
    
    // Navigate to next step
    await formHelper.goToNextStep();
    
    // Navigate back
    await formHelper.goToPreviousStep();
    
    // Check that we're back on the right step
    await expect(page.locator('p:has-text("Ticketing Information")')).toBeVisible();
  });
});