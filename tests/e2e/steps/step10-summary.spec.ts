import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';

test.describe('Step 10 - Summary', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.navigateToApp();
    await formHelper.mockApiCalls();
    
    // Fill all previous steps to reach Step 10
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
    await formHelper.fillLegalFiles();
    await formHelper.goToNextStep();
    
    // Should now be on Step 10
    await expect(page.locator('text=Please review all your information before submitting')).toBeVisible();
  });

  test('Summary step is mounted correctly', async ({ page }) => {
    // Check that the main instruction text is visible
    await expect(page.locator('text=Please review all your information before submitting')).toBeVisible();
    await expect(page.locator('text=All required fields must be completed')).toBeVisible();
    
    // Check that all summary sections are present
    await expect(page.locator('text=Personal Information')).toBeVisible();
    await expect(page.locator('text=Company Information')).toBeVisible();
    await expect(page.locator('text=Ticketing Information')).toBeVisible();
    await expect(page.locator('text=Volume Information')).toBeVisible();
    await expect(page.locator('text=Funding Information')).toBeVisible();
    await expect(page.locator('text=Ownership Information')).toBeVisible();
    await expect(page.locator('text=Financial Information')).toBeVisible();
    await expect(page.locator('text=Due Diligence Files')).toBeVisible();
  });

  test('Personal Information section displays correct data', async ({ page }) => {
    const personalInfoSection = page.locator('text=Personal Information').locator('..').locator('..');
    
    // Check that personal info data is displayed
    await expect(personalInfoSection.locator('text=John')).toBeVisible();
    await expect(personalInfoSection.locator('text=Doe')).toBeVisible();
    await expect(personalInfoSection.locator('text=john.doe@example.com')).toBeVisible();
    await expect(personalInfoSection.locator('text=+1-555-123-4567')).toBeVisible();
    await expect(personalInfoSection.locator('text=CEO')).toBeVisible();
  });

  test('Company Information section displays correct data', async ({ page }) => {
    const companyInfoSection = page.locator('text=Company Information').locator('..').locator('..');
    
    // Check that company info data is displayed
    await expect(companyInfoSection.locator('text=Test Company')).toBeVisible();
    await expect(companyInfoSection.locator('text=Festival')).toBeVisible();
    await expect(companyInfoSection.locator('text=2-5 years')).toBeVisible();
    await expect(companyInfoSection.locator('text=50')).toBeVisible();
  });

  test('Ticketing Information section displays correct data', async ({ page }) => {
    const ticketingInfoSection = page.locator('text=Ticketing Information').locator('..').locator('..');
    
    // Check that ticketing info data is displayed
    await expect(ticketingInfoSection.locator('text=Ticketmaster')).toBeVisible();
    await expect(ticketingInfoSection.locator('text=From the Ticketing Co')).toBeVisible();
  });

  test('Volume Information section displays correct data', async ({ page }) => {
    const volumeInfoSection = page.locator('text=Volume Information').locator('..').locator('..');
    
    // Check that volume info data is displayed
    await expect(volumeInfoSection.locator('text=25')).toBeVisible(); // lastYearEvents
    await expect(volumeInfoSection.locator('text=1000')).toBeVisible(); // lastYearTickets
    await expect(volumeInfoSection.locator('text=$150,000')).toBeVisible(); // lastYearSales
  });

  test('Funding Information section displays correct data', async ({ page }) => {
    const fundingInfoSection = page.locator('text=Funding Information').locator('..').locator('..');
    
    // Check that funding info data is displayed
    await expect(fundingInfoSection.locator('text=$250,000')).toBeVisible(); // yourFunds
    await expect(fundingInfoSection.locator('text=Immediately')).toBeVisible(); // timingOfFunding
    await expect(fundingInfoSection.locator('text=Working Capital')).toBeVisible(); // useOfProceeds
  });

  test('Ownership Information section displays correct data', async ({ page }) => {
    const ownershipInfoSection = page.locator('text=Ownership Information').locator('..').locator('..');
    
    // Check that ownership info data is displayed
    await expect(ownershipInfoSection.locator('text=Owner 1')).toBeVisible();
    await expect(ownershipInfoSection.locator('text=John Doe')).toBeVisible();
    await expect(ownershipInfoSection.locator('text=50%')).toBeVisible();
  });

  test('Financial Information section displays correct data', async ({ page }) => {
    const financialInfoSection = page.locator('text=Financial Information').locator('..').locator('..');
    
    // Check that financial info data is displayed
    await expect(financialInfoSection.locator('text=Yes')).toBeVisible(); // singleEntity
    await expect(financialInfoSection.locator('text=No')).toBeVisible(); // assetsTransferred
  });

  test('Due Diligence Files section displays file counts', async ({ page }) => {
    const diligenceSection = page.locator('text=Due Diligence Files').locator('..').locator('..');
    
    // Check that file counts are displayed
    await expect(diligenceSection.locator('text=0 file(s)')).toBeVisible();
  });

  test('Summary sections are clickable', async ({ page }) => {
    // Check that sections have click functionality
    const personalInfoSection = page.locator('text=Personal Information').locator('..').locator('..');
    const companyInfoSection = page.locator('text=Company Information').locator('..').locator('..');
    
    // Check that sections have hover effects (cursor-pointer class)
    await expect(personalInfoSection).toHaveClass(/cursor-pointer/);
    await expect(companyInfoSection).toHaveClass(/cursor-pointer/);
  });

  test('Edit buttons are present in Due Diligence Files section', async ({ page }) => {
    const diligenceSection = page.locator('text=Due Diligence Files').locator('..').locator('..');
    
    // Check that edit buttons are present
    const editButtons = diligenceSection.locator('button:has-text("Edit")');
    const editButtonCount = await editButtons.count();
    expect(editButtonCount).toBeGreaterThan(0);
  });

  test('Form submission button is present', async ({ page }) => {
    // Check that the submit button is present
    await expect(page.locator('button:has-text("Submit")')).toBeVisible();
  });

  test('Navigation back to previous step works', async ({ page }) => {
    // Navigate back to previous step
    await formHelper.goToPreviousStep();
    
    // Should be on Step 9 (Legal Information)
    await expect(page.locator('p:has-text("Contractual and Legal Information")')).toBeVisible();
  });

  test('All summary sections have proper styling', async ({ page }) => {
    // Check that all sections have the proper card styling
    const sections = page.locator('.bg-white.rounded-lg.border.border-rose-200');
    const sectionCount = await sections.count();
    expect(sectionCount).toBeGreaterThan(0);
    
    // Check that sections have proper spacing
    await expect(sections.first()).toHaveClass(/p-6/);
  });
});
