import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';

test.describe('Step 9 - Legal Information', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.navigateToApp();
    await formHelper.mockApiCalls();
    
    // Fill all previous steps to reach Step 9
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
    await formHelper.fillFinancialFiles();
    await formHelper.goToNextStep();
    
    // Should now be on Step 9
    await expect(page.locator('p:has-text("Contractual and Legal Information")')).toBeVisible();
  });

  test('Legal Information step is mounted correctly', async ({ page }) => {
    // Check that the step title is visible
    await expect(page.locator('p:has-text("Contractual and Legal Information")')).toBeVisible();
    
    // Check that all file upload fields are present
    await expect(page.locator('text=Certificate of Incorporation of contracting entity')).toBeVisible();
    await expect(page.locator('text=Legal entity chart if more than one entity exists')).toBeVisible();
    await expect(page.locator('text=Scanned copy of government issued ID')).toBeVisible();
    await expect(page.locator('text=Completed Form W-9')).toBeVisible();
    await expect(page.locator('text=Other')).toBeVisible();
    
    // Check file input elements
    await expect(page.locator('input[type="file"][name="incorporationCertificate"]')).toBeVisible();
    await expect(page.locator('input[type="file"][name="legalEntityChart"]')).toBeVisible();
    await expect(page.locator('input[type="file"][name="governmentId"]')).toBeVisible();
    await expect(page.locator('input[type="file"][name="w9form"]')).toBeVisible();
    await expect(page.locator('input[type="file"][name="other"]')).toBeVisible();
  });

  test('Required field validation works correctly', async ({ page }) => {
    // Incorporation certificate field should be required
    const incorporationCertificateInput = page.locator('input[type="file"][name="incorporationCertificate"]');
    await expect(incorporationCertificateInput).toHaveAttribute('required');
    
    // Other fields should not be required
    const legalEntityChartInput = page.locator('input[type="file"][name="legalEntityChart"]');
    const governmentIdInput = page.locator('input[type="file"][name="governmentId"]');
    const w9formInput = page.locator('input[type="file"][name="w9form"]');
    const otherInput = page.locator('input[type="file"][name="other"]');
    
    await expect(legalEntityChartInput).not.toHaveAttribute('required');
    await expect(governmentIdInput).not.toHaveAttribute('required');
    await expect(w9formInput).not.toHaveAttribute('required');
    await expect(otherInput).not.toHaveAttribute('required');
  });

  test('File upload fields accept correct file types', async ({ page }) => {
    const incorporationCertificateInput = page.locator('input[type="file"][name="incorporationCertificate"]');
    const legalEntityChartInput = page.locator('input[type="file"][name="legalEntityChart"]');
    const governmentIdInput = page.locator('input[type="file"][name="governmentId"]');
    const w9formInput = page.locator('input[type="file"][name="w9form"]');
    const otherInput = page.locator('input[type="file"][name="other"]');
    
    // Check accept attributes for all fields
    const expectedAccept = '.xlsx,.pdf,.csv,.jpg,.png';
    await expect(incorporationCertificateInput).toHaveAttribute('accept', expectedAccept);
    await expect(legalEntityChartInput).toHaveAttribute('accept', expectedAccept);
    await expect(governmentIdInput).toHaveAttribute('accept', expectedAccept);
    await expect(w9formInput).toHaveAttribute('accept', expectedAccept);
    await expect(otherInput).toHaveAttribute('accept', expectedAccept);
  });

  test('Single file upload works for required fields', async ({ page }) => {
    const incorporationCertificateInput = page.locator('input[type="file"][name="incorporationCertificate"]');
    const legalEntityChartInput = page.locator('input[type="file"][name="legalEntityChart"]');
    const governmentIdInput = page.locator('input[type="file"][name="governmentId"]');
    const w9formInput = page.locator('input[type="file"][name="w9form"]');
    
    // Check that these fields don't have multiple attribute (single file upload)
    await expect(incorporationCertificateInput).not.toHaveAttribute('multiple');
    await expect(legalEntityChartInput).not.toHaveAttribute('multiple');
    await expect(governmentIdInput).not.toHaveAttribute('multiple');
    await expect(w9formInput).not.toHaveAttribute('multiple');
  });

  test('Multiple file upload works for other field', async ({ page }) => {
    const otherInput = page.locator('input[type="file"][name="other"]');
    
    // Check that other field has multiple attribute
    await expect(otherInput).toHaveAttribute('multiple');
  });

  test('Form accessibility features', async ({ page }) => {
    // Check that file inputs have proper labels
    await expect(page.locator('label:has-text("Certificate of Incorporation of contracting entity")')).toBeVisible();
    await expect(page.locator('label:has-text("Legal entity chart if more than one entity exists")')).toBeVisible();
    await expect(page.locator('label:has-text("Scanned copy of government issued ID")')).toBeVisible();
    await expect(page.locator('label:has-text("Completed Form W-9")')).toBeVisible();
    await expect(page.locator('label:has-text("Other")')).toBeVisible();
    
    // Check that file inputs are accessible
    const incorporationCertificateInput = page.locator('input[type="file"][name="incorporationCertificate"]');
    const legalEntityChartInput = page.locator('input[type="file"][name="legalEntityChart"]');
    const governmentIdInput = page.locator('input[type="file"][name="governmentId"]');
    const w9formInput = page.locator('input[type="file"][name="w9form"]');
    const otherInput = page.locator('input[type="file"][name="other"]');
    
    await expect(incorporationCertificateInput).toBeVisible();
    await expect(legalEntityChartInput).toBeVisible();
    await expect(governmentIdInput).toBeVisible();
    await expect(w9formInput).toBeVisible();
    await expect(otherInput).toBeVisible();
  });

  test('Other field description is visible', async ({ page }) => {
    // Check that the description for the "Other" field is visible
    await expect(page.locator('text=Copy of the lease, rental agreement or property deed')).toBeVisible();
    await expect(page.locator('text=Outdoor event: copy of the event cancellation insurance')).toBeVisible();
    await expect(page.locator('text=Other: business plan, budget, insurance certificate')).toBeVisible();
  });

  test('Navigation to step 10 with valid data', async ({ page }) => {
    // Upload a file to the required field
    const incorporationCertificateInput = page.locator('input[type="file"][name="incorporationCertificate"]');
    await incorporationCertificateInput.setInputFiles({
      name: 'incorporation-certificate.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake pdf content')
    });
    
    // Wait for validation
    await formHelper.waitForValidation();
    
    // Navigate to next step
    await formHelper.goToNextStep();
    
    // Should be on Step 10 (Summary)
    await expect(page.locator('text=Please review all your information before submitting')).toBeVisible();
  });

  test('Data persistence when navigating back and forth', async ({ page }) => {
    // Upload files to multiple fields
    const incorporationCertificateInput = page.locator('input[type="file"][name="incorporationCertificate"]');
    const w9formInput = page.locator('input[type="file"][name="w9form"]');
    
    await incorporationCertificateInput.setInputFiles({
      name: 'incorporation-certificate.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake pdf content')
    });
    
    await w9formInput.setInputFiles({
      name: 'w9-form.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake w9 content')
    });
    
    // Navigate to next step
    await formHelper.goToNextStep();
    
    // Navigate back
    await formHelper.goToPreviousStep();
    
    // Check that we're back on the right step
    await expect(page.locator('p:has-text("Contractual and Legal Information")')).toBeVisible();
  });
});
