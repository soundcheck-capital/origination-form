import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';

test.describe('Component Mounting Tests', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.navigateToApp();
  });

  test('Application loads successfully', async ({ page }) => {
    // Vérifier que l'application principale est montée
    await expect(page.locator('main')).toBeVisible();
    
    // Vérifier que le logo est présent
    await expect(page.locator('img[alt="Logo"]')).toBeVisible();
    
    // Vérifier que la barre de progression est présente
    await expect(page.locator('.bg-gradient-to-r')).toBeVisible();
    
    // Vérifier le titre de la première étape
    await expect(page.locator('h1')).toContainText('Get Funding');
  });

  test('Personal Info Step components mount correctly', async ({ page }) => {
    await formHelper.expectStep('Get Funding');
    
    // Vérifier tous les champs du formulaire personnel
    await expect(page.locator('input[name="firstname"]')).toBeVisible();
    await expect(page.locator('input[name="lastname"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="emailConfirm"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('select[name="role"]')).toBeVisible();
    
    // Vérifier le bouton Next
    await expect(page.locator('button:has-text("Next")')).toBeVisible();
  });

  test('Company Info Step components mount correctly', async ({ page }) => {
    // Remplir la première étape pour accéder à la deuxième
    await formHelper.fillPersonalInfo({
      firstname: "Test",
      lastname: "User",
      email: "test@example.com",
      emailConfirm: "test@example.com",
      phone: "1234567890",
      role: "CEO"
    });
    await formHelper.goToNextStep();
    
    await formHelper.expectStep('Tell us about your business');
    
    // Vérifier tous les champs de l'entreprise
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="dba"]')).toBeVisible();
    await expect(page.locator('select[name="clientType"]')).toBeVisible();
    await expect(page.locator('select[name="businessType"]')).toBeVisible();
    await expect(page.locator('input[name="yearsInBusiness"]')).toBeVisible();
    await expect(page.locator('input[name="ein"]')).toBeVisible();
    
    // Vérifier les boutons de navigation
    await expect(page.locator('button:has-text("Previous")')).toBeVisible();
    await expect(page.locator('button:has-text("Next")')).toBeVisible();
  });

  test('Ticketing Step components mount correctly', async ({ page }) => {
    // Navigation vers l'étape 3
    await formHelper.fillPersonalInfo({
      firstname: "Test",
      lastname: "User",
      email: "test@example.com",
      emailConfirm: "test@example.com",
      phone: "1234567890",
      role: "CEO"
    });
    await formHelper.goToNextStep();
    
    await formHelper.fillCompanyInfo({
      name: "Test Company",
      dba: "Test",
      clientType: "Promoter",
      businessType: "LLC",
      yearsInBusiness: "5",
      ein: "123456789",
      companyAddress: "123 Test St",
      companyCity: "Test City",
      companyState: "CA",
      companyZipcode: "12345",
      stateOfIncorporation: "CA",
      employees: 10,
      socials: "@test",
      memberOf: "INTIX"
    });
    await formHelper.goToNextStep();
    
    await formHelper.expectStep('Tell us about your business');
    
    // Vérifier les champs de ticketing
    await expect(page.locator('select[name="currentPartner"]')).toBeVisible();
    await expect(page.locator('select[name="settlementPayout"]')).toBeVisible();
    await expect(page.locator('select[name="paymentProcessing"]')).toBeVisible();
  });

  test('Progress bar updates correctly', async ({ page }) => {
    // Vérifier la progression initiale (étape 1/11)
    await formHelper.waitForProgress(9); // (1/11) * 100 ≈ 9%
    
    // Aller à l'étape 2
    await formHelper.fillPersonalInfo({
      firstname: "Test",
      lastname: "User",
      email: "test@example.com",
      emailConfirm: "test@example.com",
      phone: "1234567890",
      role: "CEO"
    });
    await formHelper.goToNextStep();
    
    // Vérifier la progression (étape 2/11)
    await formHelper.waitForProgress(18); // (2/11) * 100 ≈ 18%
  });

  test('Navigation between steps works', async ({ page }) => {
    // Aller à l'étape 2
    await formHelper.fillPersonalInfo({
      firstname: "Test",
      lastname: "User",
      email: "test@example.com",
      emailConfirm: "test@example.com",
      phone: "1234567890",
      role: "CEO"
    });
    await formHelper.goToNextStep();
    
    await formHelper.expectStep('Tell us about your business');
    
    // Retourner à l'étape 1
    await formHelper.goToPreviousStep();
    await formHelper.expectStep('Get Funding');
    
    // Vérifier que les données sont conservées
    await expect(page.locator('input[name="firstname"]')).toHaveValue('Test');
    await expect(page.locator('input[name="email"]')).toHaveValue('test@example.com');
  });

  test('Form validation prevents navigation with empty fields', async ({ page }) => {
    // Essayer d'aller à l'étape suivante sans remplir les champs
    await formHelper.goToNextStep();
    
    // Vérifier qu'on reste sur la première étape
    await formHelper.expectStep('Get Funding');
    
    // Vérifier qu'un message d'erreur est affiché (si implémenté)
    // Cette partie dépend de votre implémentation de validation
  });

  test('SummaryStep displays all form sections', async ({ page }) => {
    // Remplir toutes les étapes pour arriver au summary (test simplifié)
    // Cette partie pourrait être développée selon vos besoins
    
    // Navigation directe vers le summary pour tester le montage
    await page.evaluate(() => {
      // Simuler la navigation vers l'étape 11 via le state Redux
      window.history.pushState({}, '', '/?step=11');
    });
    
    // Vérifier que les sections du summary sont présentes
    await expect(page.locator('text=Personal Information')).toBeVisible();
    await expect(page.locator('text=Company Information')).toBeVisible();
    await expect(page.locator('text=Ticketing Information')).toBeVisible();
    await expect(page.locator('text=Due Diligence Files')).toBeVisible();
  });
});
