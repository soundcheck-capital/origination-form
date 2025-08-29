import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';

test.describe('Step 1: Personal Information', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.navigateToApp();
    await formHelper.expectStep('Get Funding');
  });

  test('All personal info fields are mounted correctly', async ({ page }) => {
    // Vérifier la présence de tous les champs
    await formHelper.expectFieldToBeVisible('input[name="firstname"]', 'First Name');
    await formHelper.expectFieldToBeVisible('input[name="lastname"]', 'Last Name');
    await formHelper.expectFieldToBeVisible('input[name="email"]', 'Email');
    await formHelper.expectFieldToBeVisible('input[name="emailConfirm"]', 'Email Confirmation');
    await formHelper.expectFieldToBeVisible('input[name="phone"]', 'Phone');
    await formHelper.expectFieldToBeVisible('select[name="role"]', 'Role');

    // Vérifier les boutons de navigation
    await expect(page.locator('button:has-text("Next")')).toBeVisible();
    await expect(page.locator('button:has-text("Previous")')).not.toBeVisible(); // Pas de Previous sur étape 1
  });

  test('Required fields validation', async ({ page }) => {
    const requiredFields = [
      'input[name="firstname"]',
      'input[name="lastname"]', 
      'input[name="email"]',
      'input[name="emailConfirm"]',
      'input[name="phone"]',
      'select[name="role"]'
    ];

    // Vérifier que tous les champs obligatoires ont l'attribut required
    await formHelper.validateStepRequiredFields(requiredFields);
  });

  test('Email confirmation validation', async ({ page }) => {
    // Remplir des emails différents
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="emailConfirm"]', 'different@example.com');
    
    // Essayer de passer à l'étape suivante
    await formHelper.goToNextStep();
    
    // Vérifier qu'on reste sur la même étape (validation échoue)
    await formHelper.expectStep('Get Funding');
    
    // Corriger l'email de confirmation
    await page.fill('input[name="emailConfirm"]', 'test@example.com');
  });

  test('Role dropdown has correct options', async ({ page }) => {
    const roleSelect = page.locator('select[name="role"]');
    
    // Vérifier que les options principales sont présentes
    await expect(roleSelect.locator('option[value="CEO"]')).toBeVisible();
    await expect(roleSelect.locator('option[value="CFO"]')).toBeVisible();
    await expect(roleSelect.locator('option[value="President"]')).toBeVisible();
    await expect(roleSelect.locator('option[value="Owner"]')).toBeVisible();
  });

  test('Phone number formatting and validation', async ({ page }) => {
    const phoneInput = page.locator('input[name="phone"]');
    
    // Tester différents formats
    await phoneInput.fill('1234567890');
    await expect(phoneInput).toHaveValue('1234567890'); // ou formaté selon votre implémentation
    
    // Tester un numéro trop court
    await phoneInput.clear();
    await phoneInput.fill('123');
    await formHelper.goToNextStep();
    
    // Vérifier qu'on reste sur la même étape
    await formHelper.expectStep('Get Funding');
  });

  test('Navigation to step 2 with valid data', async ({ page }) => {
    // Remplir tous les champs avec des données valides
    await formHelper.fillPersonalInfo({
      firstname: "John",
      lastname: "Doe", 
      email: "john.doe@example.com",
      emailConfirm: "john.doe@example.com",
      phone: "1234567890",
      role: "CEO"
    });

    // Passer à l'étape suivante
    await formHelper.goToNextStep();

    // Vérifier qu'on arrive à l'étape 2
    await formHelper.expectStep('Tell us about your business');
  });

  test('Data persistence when navigating back', async ({ page }) => {
    // Remplir les données
    const testData = {
      firstname: "Jane",
      lastname: "Smith",
      email: "jane.smith@example.com", 
      emailConfirm: "jane.smith@example.com",
      phone: "0987654321",
      role: "CFO"
    };

    await formHelper.fillPersonalInfo(testData);
    await formHelper.goToNextStep();
    
    // Aller à l'étape 2 puis retourner
    await formHelper.expectStep('Tell us about your business');
    await formHelper.goToPreviousStep();
    
    // Vérifier que les données sont conservées
    await expect(page.locator('input[name="firstname"]')).toHaveValue(testData.firstname);
    await expect(page.locator('input[name="lastname"]')).toHaveValue(testData.lastname);
    await expect(page.locator('input[name="email"]')).toHaveValue(testData.email);
    await expect(page.locator('input[name="emailConfirm"]')).toHaveValue(testData.emailConfirm);
    await expect(page.locator('input[name="phone"]')).toHaveValue(testData.phone);
    await expect(page.locator('select[name="role"]')).toHaveValue(testData.role);
  });

  test('Form accessibility features', async ({ page }) => {
    // Vérifier les labels pour l'accessibilité
    await expect(page.locator('label[for="firstname"], label:has(input[name="firstname"])').first()).toBeVisible();
    await expect(page.locator('label[for="lastname"], label:has(input[name="lastname"])').first()).toBeVisible();
    await expect(page.locator('label[for="email"], label:has(input[name="email"])').first()).toBeVisible();
    
    // Vérifier la navigation au clavier (optionnel)
    await page.locator('input[name="firstname"]').focus();
    await page.keyboard.press('Tab');
    await expect(page.locator('input[name="lastname"]')).toBeFocused();
  });
});
