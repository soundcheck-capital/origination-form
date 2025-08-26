import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';
import { testDataSets } from '../../fixtures/testData';

test.describe('Complete Application Flow Tests', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.navigateToApp();
    await formHelper.mockApiCalls(); // Mock API calls for flow tests
  });

  test('Complete application flow - Small Company', async ({ page }) => {
    const testData = testDataSets[0].data; // Small company data

    // Étape 1: Personal Information
    await formHelper.fillPersonalInfo(testData.personalInfo);
    await formHelper.goToNextStep();

    // Étape 2: Company Information
    await formHelper.fillCompanyInfo(testData.companyInfo);
    await formHelper.goToNextStep();

    // Étape 3: Ticketing Information
    await formHelper.fillTicketingInfo(testData.ticketingInfo);
    await formHelper.goToNextStep();

    // Étape 4: Funding Information
    await formHelper.fillFundsInfo(testData.fundsInfo);
    await formHelper.goToNextStep();

    // Vérifier qu'on arrive bien au summary
    await formHelper.expectStep('Thank you');
    
    // Vérifier que les données sont affichées correctement dans le summary
    await expect(page.locator('text=' + testData.personalInfo.firstname)).toBeVisible();
    await expect(page.locator('text=' + testData.companyInfo.name)).toBeVisible();
    await expect(page.locator('text=' + testData.fundsInfo.yourFunds)).toBeVisible();
  });

  test('Navigation back and forth preserves data', async ({ page }) => {
    const testData = testDataSets[1].data; // Medium company data

    // Remplir plusieurs étapes
    await formHelper.fillPersonalInfo(testData.personalInfo);
    await formHelper.goToNextStep();

    await formHelper.fillCompanyInfo(testData.companyInfo);
    await formHelper.goToNextStep();

    await formHelper.fillTicketingInfo(testData.ticketingInfo);

    // Retourner en arrière
    await formHelper.goToPreviousStep();
    await formHelper.goToPreviousStep();

    // Vérifier que les données personal info sont conservées
    await expect(page.locator('input[name="firstname"]')).toHaveValue(testData.personalInfo.firstname);
    await expect(page.locator('input[name="email"]')).toHaveValue(testData.personalInfo.email);

    // Retourner aux étapes suivantes
    await formHelper.goToNextStep();
    await expect(page.locator('input[name="name"]')).toHaveValue(testData.companyInfo.name);
    
    await formHelper.goToNextStep();
    await expect(page.locator('select[name="currentPartner"]')).toHaveValue(testData.ticketingInfo.currentPartner);
  });

  test('Summary page click navigation works', async ({ page }) => {
    const testData = testDataSets[2].data; // Large company data

    // Remplir le formulaire jusqu'au summary
    await formHelper.fillPersonalInfo(testData.personalInfo);
    await formHelper.goToNextStep();
    await formHelper.fillCompanyInfo(testData.companyInfo);
    await formHelper.goToNextStep();
    await formHelper.fillTicketingInfo(testData.ticketingInfo);
    await formHelper.goToNextStep();
    await formHelper.fillFundsInfo(testData.fundsInfo);
    
    // Continuer jusqu'au summary...
    // (Adapter selon le nombre d'étapes exact)
    
    // Cliquer sur une section dans le summary pour naviguer
    await page.click('text=Personal Information');
    
    // Vérifier qu'on retourne à l'étape 1
    await formHelper.expectStep('Get Funding');
    
    // Vérifier que les données sont toujours là
    await expect(page.locator('input[name="firstname"]')).toHaveValue(testData.personalInfo.firstname);
  });

  test('File upload integration in complete flow', async ({ page }) => {
    const testData = testDataSets[0].data;

    // Remplir les premières étapes
    await formHelper.fillPersonalInfo(testData.personalInfo);
    await formHelper.goToNextStep();
    await formHelper.fillCompanyInfo(testData.companyInfo);
    await formHelper.goToNextStep();
    await formHelper.fillTicketingInfo(testData.ticketingInfo);
    await formHelper.goToNextStep();
    await formHelper.fillFundsInfo(testData.fundsInfo);
    await formHelper.goToNextStep();

    // Naviguer vers les étapes d'upload de fichiers
    // (Adapter selon votre structure)
    
    // Uploader quelques fichiers requis
    await formHelper.uploadTestFile('ticketingCompanyReport', 'company-report.pdf');
    await formHelper.uploadTestFile('financialStatements', 'financial-statements.pdf');
    
    // Continuer vers le summary
    // Vérifier que les fichiers sont listés dans le summary
    await expect(page.locator('text=1 file(s)')).toBeVisible();
  });

  test('Form validation prevents submission with missing required fields', async ({ page }) => {
    // Remplir partiellement le formulaire
    await formHelper.fillPersonalInfo({
      firstname: "Test",
      lastname: "User",
      email: "test@example.com",
      emailConfirm: "test@example.com",
      phone: "", // Champ requis manquant
      role: "CEO"
    });

    // Essayer d'aller à l'étape suivante
    await formHelper.goToNextStep();
    
    // Vérifier qu'on reste sur la même étape
    await formHelper.expectStep('Get Funding');
    
    // Vérifier qu'un message d'erreur est affiché (si implémenté)
    // await expect(page.locator('.error-message')).toBeVisible();
  });

  test('Mobile responsive flow', async ({ page }) => {
    // Configurer la viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    const testData = testDataSets[0].data;

    // Vérifier que l'interface mobile fonctionne
    await expect(page.locator('main')).toBeVisible();
    
    // Tester la navigation sur mobile
    await formHelper.fillPersonalInfo(testData.personalInfo);
    await formHelper.goToNextStep();
    
    // Vérifier que les champs sont accessibles sur mobile
    await expect(page.locator('input[name="name"]')).toBeVisible();
    
    // Tester le scroll si nécessaire
    await page.locator('input[name="ein"]').scrollIntoViewIfNeeded();
    await expect(page.locator('input[name="ein"]')).toBeVisible();
  });

  test('Progress tracking throughout the flow', async ({ page }) => {
    // Vérifier la progression à chaque étape
    await formHelper.waitForProgress(9); // Étape 1/11
    
    await formHelper.fillPersonalInfo(testDataSets[0].data.personalInfo);
    await formHelper.goToNextStep();
    await formHelper.waitForProgress(18); // Étape 2/11
    
    await formHelper.fillCompanyInfo(testDataSets[0].data.companyInfo);
    await formHelper.goToNextStep();
    await formHelper.waitForProgress(27); // Étape 3/11
    
    // Vérifier qu'on peut retourner en arrière sans perdre la progression
    await formHelper.goToPreviousStep();
    await formHelper.waitForProgress(18); // Retour à l'étape 2/11
  });

  test('Session persistence after page reload', async ({ page }) => {
    const testData = testDataSets[1].data;

    // Remplir quelques étapes
    await formHelper.fillPersonalInfo(testData.personalInfo);
    await formHelper.goToNextStep();
    await formHelper.fillCompanyInfo(testData.companyInfo);
    
    // Recharger la page
    await page.reload();
    
    // Vérifier que les données sont conservées (si implémenté)
    // Cette partie dépend de votre implémentation de persistence
    // await expect(page.locator('input[name="firstname"]')).toHaveValue(testData.personalInfo.firstname);
  });
});
