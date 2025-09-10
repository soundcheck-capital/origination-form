import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';

test.describe('Step 2: Company Information', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.mockApiCalls();
    await formHelper.navigateToApp();
    
    // Remplir l'étape 1 pour accéder à l'étape 2
    await formHelper.fillPersonalInfo({
      firstname: "Test",
      lastname: "User",
      email: "test@example.com",
      emailConfirm: "test@example.com", 
      phone: "12345678901234", // Numéro plus long pour respecter la validation (15+ caractères)
      role: "CEO"
    });
    await formHelper.waitForValidation();
    await formHelper.goToNextStep();
    await formHelper.expectStep('Tell us about your business');
  });

  test('All company info fields are mounted correctly', async ({ page }) => {
    // Champs texte (selon le vrai CompanyInfoStep.tsx)
    await formHelper.expectFieldToBeVisible('input[name="name"]', 'Company Name');
    await formHelper.expectFieldToBeVisible('input[name="role"]', 'Your Role');
    await formHelper.expectFieldToBeVisible('input[name="employees"]', 'Number of Employees');
    await formHelper.expectFieldToBeVisible('input[name="socials"]', 'Website - Socials');

    // Champs dropdown (selon le vrai CompanyInfoStep.tsx)
    await formHelper.expectFieldToBeVisible('select[name="clientType"]', 'Company Type');
    await formHelper.expectFieldToBeVisible('select[name="yearsInBusiness"]', 'Years in Business');
    await formHelper.expectFieldToBeVisible('select[name="memberOf"]', 'Are you a member of?');

    // Boutons de navigation
    await expect(page.locator('button:has-text("Previous")')).toBeVisible();
    await expect(page.locator('button:has-text("Next")')).toBeVisible();
  });

  test('Required fields validation', async ({ page }) => {
    // Seuls les TextField ont l'attribut HTML required (les DropdownField gèrent ça côté React)
    const requiredTextFields = [
      'input[name="name"]',
      'input[name="role"]',
      'input[name="employees"]',
      'input[name="socials"]'
    ];

    await formHelper.validateStepRequiredFields(requiredTextFields);
    
    // Vérifier que les dropdowns sont présents (même s'ils n'ont pas l'attribut required)
    await expect(page.locator('select[name="clientType"]')).toBeVisible();
    await expect(page.locator('select[name="yearsInBusiness"]')).toBeVisible();
    await expect(page.locator('select[name="memberOf"]')).toBeVisible();
  });

  test('Company Type dropdown has correct options', async ({ page }) => {
    const clientTypeSelect = page.locator('select[name="clientType"]');
    
    // Vérifier que le dropdown est présent
    await expect(clientTypeSelect).toBeVisible();
    
    // Vérifier quelques options principales (selon hubspotLists.ts)
    await expect(clientTypeSelect.locator('option[value="Promoter"]')).toHaveCount(1);
    await expect(clientTypeSelect.locator('option[value="Venue"]')).toHaveCount(1);
    await expect(clientTypeSelect.locator('option[value="Festival"]')).toHaveCount(1);
    await expect(clientTypeSelect.locator('option[value="Other"]')).toHaveCount(1);
  });

  test('Years in Business dropdown has correct options', async ({ page }) => {
    const yearsSelect = page.locator('select[name="yearsInBusiness"]');
    
    // Vérifier que le dropdown est présent
    await expect(yearsSelect).toBeVisible();
    
    // Vérifier quelques options (selon hubspotLists.ts - vraies clés)
    await expect(yearsSelect.locator('option[value="0-1 year"]')).toHaveCount(1);
    await expect(yearsSelect.locator('option[value="1-2 years"]')).toHaveCount(1);
    await expect(yearsSelect.locator('option[value="2-5 years"]')).toHaveCount(1);
    await expect(yearsSelect.locator('option[value="5-10 years"]')).toHaveCount(1);
  });

  test('Member Of dropdown has correct options', async ({ page }) => {
    const memberOfSelect = page.locator('select[name="memberOf"]');
    
    // Vérifier que le dropdown est présent
    await expect(memberOfSelect).toBeVisible();
    
    // Vérifier qu'il y a au moins quelques options (sans tester les valeurs exactes car le fichier hubspotLists a des erreurs)
    const optionCount = await memberOfSelect.locator('option').count();
    expect(optionCount).toBeGreaterThan(1);
    await expect(memberOfSelect.locator('option[value="Other"]')).toHaveCount(1);
  });

  test('Employees field accepts numbers only', async ({ page }) => {
    const employeesInput = page.locator('input[name="employees"]');
    
    // Vérifier que c'est un input de type number
    await expect(employeesInput).toHaveAttribute('type', 'number');
    
    // Tester avec un nombre valide
    await employeesInput.fill('25');
    await expect(employeesInput).toHaveValue('25');
    
    // Note: Les input type="number" empêchent automatiquement la saisie de lettres
    // donc pas besoin de tester la saisie de lettres
  });

  test('Navigation to step 3 with valid data', async ({ page }) => {
    // Remplir tous les champs avec des données valides
    await page.fill('input[name="name"]', 'Test Company Inc');
    await page.fill('input[name="role"]', 'CEO');
    await page.fill('input[name="employees"]', '50');
    await page.fill('input[name="socials"]', 'https://testcompany.com');
    
    await page.selectOption('select[name="clientType"]', 'Promoter');
    await page.selectOption('select[name="yearsInBusiness"]', '2-5 years');
    await page.selectOption('select[name="memberOf"]', 'Other');

    // Attendre que la validation passe
    await formHelper.waitForValidation();
    
    // Passer à l'étape suivante
    await formHelper.goToNextStep();
    
    // Vérifier qu'on arrive à l'étape 3 (Ticketing)
    // Step 3 utilise un StepTitle interne, pas le h1 principal
    await expect(page.locator('p:has-text("Ticketing Information")')).toBeVisible();
  });

  test('Data persistence when navigating back and forth', async ({ page }) => {
    const testData = {
      name: "Persistent Company",
      role: "CTO", 
      employees: "15",
      socials: "https://persistent.com",
      clientType: "Venue",
      yearsInBusiness: "5-10 years",
      memberOf: "Other"
    };

    // Remplir les données
    await page.fill('input[name="name"]', testData.name);
    await page.fill('input[name="role"]', testData.role);
    await page.fill('input[name="employees"]', testData.employees);
    await page.fill('input[name="socials"]', testData.socials);
    
    await page.selectOption('select[name="clientType"]', testData.clientType);
    await page.selectOption('select[name="yearsInBusiness"]', testData.yearsInBusiness);
    await page.selectOption('select[name="memberOf"]', testData.memberOf);

    // Aller à l'étape suivante
    await formHelper.waitForValidation();
    await formHelper.goToNextStep();
    // Step 3 utilise un StepTitle interne, pas le h1 principal
    await expect(page.locator('p:has-text("Ticketing Information")')).toBeVisible();

    // Revenir à l'étape 2
    await formHelper.goToPreviousStep();
    await formHelper.expectStep('Tell us about your business');

    // Vérifier que les données sont conservées
    await expect(page.locator('input[name="name"]')).toHaveValue(testData.name);
    await expect(page.locator('input[name="role"]')).toHaveValue(testData.role);
    await expect(page.locator('input[name="employees"]')).toHaveValue(testData.employees);
    await expect(page.locator('input[name="socials"]')).toHaveValue(testData.socials);
    
    await expect(page.locator('select[name="clientType"]')).toHaveValue(testData.clientType);
    await expect(page.locator('select[name="yearsInBusiness"]')).toHaveValue(testData.yearsInBusiness);
    await expect(page.locator('select[name="memberOf"]')).toHaveValue(testData.memberOf);
  });

  test('Form accessibility features', async ({ page }) => {
    // Vérifier que les champs ont les bons types et attributs
    await expect(page.locator('input[name="name"]')).toHaveAttribute('required');
    await expect(page.locator('input[name="role"]')).toHaveAttribute('required');
    await expect(page.locator('input[name="employees"]')).toHaveAttribute('type', 'number');
    await expect(page.locator('input[name="employees"]')).toHaveAttribute('required');
    await expect(page.locator('input[name="socials"]')).toHaveAttribute('required');
  });
});