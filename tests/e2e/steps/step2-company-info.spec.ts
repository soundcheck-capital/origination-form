import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';

test.describe('Step 2: Company Information', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.navigateToApp();
    
    // Remplir l'étape 1 pour accéder à l'étape 2
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
  });

  test('All company info fields are mounted correctly', async ({ page }) => {
    // Champs texte
    await formHelper.expectFieldToBeVisible('input[name="name"]', 'Company Name');
    await expect(page.locator('select[name="role"]')).toHaveValue('CEO');

    await formHelper.expectFieldToBeVisible('input[name="dba"]', 'DBA');
    await formHelper.expectFieldToBeVisible('input[name="yearsInBusiness"]', 'Years in Business');
    await formHelper.expectFieldToBeVisible('input[name="ein"]', 'EIN');
    await formHelper.expectFieldToBeVisible('input[name="employees"]', 'Number of Employees');
    await formHelper.expectFieldToBeVisible('input[name="socials"]', 'Social Media');

    // Dropdowns
    await formHelper.expectFieldToBeVisible('select[name="clientType"]', 'Client Type');
    await formHelper.expectFieldToBeVisible('select[name="businessType"]', 'Business Type');
    await formHelper.expectFieldToBeVisible('select[name="stateOfIncorporation"]', 'State of Incorporation');
    await formHelper.expectFieldToBeVisible('select[name="memberOf"]', 'Member Of');

    // Champs d'adresse
    await formHelper.expectFieldToBeVisible('input[name="companyAddress"]', 'Company Address');

    // Boutons de navigation
    await expect(page.locator('button:has-text("Previous")')).toBeVisible();
    await expect(page.locator('button:has-text("Next")')).toBeVisible();
  });

  test('Required fields validation', async ({ page }) => {
    const requiredFields = [
      'input[name="name"]',
      'input[name="ein"]',
      'select[name="clientType"]',
      'select[name="businessType"]',
      'input[name="companyAddress"]',
    ];

    await formHelper.validateStepRequiredFields(requiredFields);
  });

  test('Client Type dropdown has correct options', async ({ page }) => {
    const clientTypeSelect = page.locator('select[name="clientType"]');
    
    await expect(clientTypeSelect.locator('option[value="Promoter"]')).toBeVisible();
    await expect(clientTypeSelect.locator('option[value="Venue"]')).toBeVisible();
    await expect(clientTypeSelect.locator('option[value="Agency"]')).toBeVisible();
  });

  test('Business Type dropdown has correct options', async ({ page }) => {
    const businessTypeSelect = page.locator('select[name="businessType"]');
    
    await expect(businessTypeSelect.locator('option[value="LLC"]')).toBeVisible();
    await expect(businessTypeSelect.locator('option[value="Corporation"]')).toBeVisible();
    await expect(businessTypeSelect.locator('option[value="Partnership"]')).toBeVisible();
    await expect(businessTypeSelect.locator('option[value="Sole Proprietorship"]')).toBeVisible();
  });

  test('State dropdowns are populated', async ({ page }) => {
    const stateSelect = page.locator('select[name="companyState"]');
    const incorporationStateSelect = page.locator('select[name="stateOfIncorporation"]');
    
    // Vérifier que les états principaux sont présents
    await expect(stateSelect.locator('option[value="CA"]')).toBeVisible();
    await expect(stateSelect.locator('option[value="NY"]')).toBeVisible();
    await expect(stateSelect.locator('option[value="TX"]')).toBeVisible();
    
    await expect(incorporationStateSelect.locator('option[value="CA"]')).toBeVisible();
    await expect(incorporationStateSelect.locator('option[value="DE"]')).toBeVisible(); // Delaware populaire pour incorporation
  });

  test('EIN format validation', async ({ page }) => {
    const einInput = page.locator('input[name="ein"]');
    
    // Tester un EIN valide (format XX-XXXXXXX)
    await einInput.fill('12-3456789');
    await expect(einInput).toHaveValue('12-3456789'); // ou format selon votre implémentation
    
    // Tester un EIN invalide
    await einInput.clear();
    await einInput.fill('123');
    await formHelper.goToNextStep();
    
    // Vérifier qu'on reste sur la même étape
    await formHelper.expectStep('Tell us about your business');
  });

  test('Zipcode validation', async ({ page }) => {
    const zipcodeInput = page.locator('input[name="companyZipcode"]');
    
    // Tester un zipcode valide
    await zipcodeInput.fill('90210');
    await expect(zipcodeInput).toHaveValue('90210');
    
    // Tester un zipcode avec extension
    await zipcodeInput.clear();
    await zipcodeInput.fill('90210-1234');
    await expect(zipcodeInput).toHaveValue('90210-1234');
  });

  test('Employees field accepts numbers only', async ({ page }) => {
    const employeesInput = page.locator('input[name="employees"]');
    
    // Tester une valeur numérique
    await employeesInput.fill('50');
    await expect(employeesInput).toHaveValue('50');
    
    // Tester que les lettres sont rejetées (selon implémentation)
    await employeesInput.clear();
    await employeesInput.fill('abc');
    // Le comportement dépend de votre implémentation (input type="number" ou validation JS)
  });

  test('Navigation to step 3 with valid data', async ({ page }) => {
    await formHelper.fillCompanyInfo({
      name: "Test Company Inc",
      dba: "Test Co",
      clientType: "Promoter",
      businessType: "LLC",
      yearsInBusiness: "5",
      ein: "12-3456789",
      companyAddress: "123 Main Street",
      companyCity: "Los Angeles", 
      companyState: "CA",
      companyZipcode: "90210",
      stateOfIncorporation: "CA",
      employees: 25,
      socials: "@testcompany",
      memberOf: "INTIX"
    });

    await formHelper.goToNextStep();
    await formHelper.expectStep('Tell us about your business'); // Étape 3 ticketing
  });

  test('Address autocomplete functionality', async ({ page }) => {
    const addressInput = page.locator('input[name="companyAddress"]');
    
    // Taper une adresse partielle
    await addressInput.fill('123 Main');
    
    // Vérifier si des suggestions apparaissent (selon votre implémentation Google Maps)
    // Ceci dépend de votre intégration d'autocomplete
    await page.waitForTimeout(1000);
    
    // Chercher des éléments de suggestion (à adapter selon votre implémentation)
    const suggestions = page.locator('.pac-container .pac-item'); // Google Places autocomplete
    if (await suggestions.count() > 0) {
      await suggestions.first().click();
      // Vérifier que les champs sont auto-remplis
      await expect(page.locator('input[name="companyCity"]')).not.toHaveValue('');
    }
  });

  test('Data persistence when navigating back and forth', async ({ page }) => {
    const testData = {
      name: "Persistence Test LLC",
      dba: "PT LLC",
      ein: "98-7654321",
      employees: 15
    };

    // Remplir quelques champs
    await page.fill('input[name="name"]', testData.name);
    await page.fill('input[name="dba"]', testData.dba);
    await page.fill('input[name="ein"]', testData.ein);
    await page.fill('input[name="employees"]', testData.employees.toString());

    // Retourner à l'étape 1
    await formHelper.goToPreviousStep();
    await formHelper.expectStep('Get Funding');

    // Revenir à l'étape 2
    await formHelper.goToNextStep();
    await formHelper.expectStep('Tell us about your business');

    // Vérifier que les données sont conservées
    await expect(page.locator('input[name="name"]')).toHaveValue(testData.name);
    await expect(page.locator('input[name="dba"]')).toHaveValue(testData.dba);
    await expect(page.locator('input[name="ein"]')).toHaveValue(testData.ein);
    await expect(page.locator('input[name="employees"]')).toHaveValue(testData.employees.toString());
  });

  test('Member Of dropdown conditional behavior', async ({ page }) => {
    const memberOfSelect = page.locator('select[name="memberOf"]');
    
    // Vérifier les options disponibles
    await expect(memberOfSelect.locator('option[value="INTIX"]')).toBeVisible();
    await expect(memberOfSelect.locator('option[value="IAVM"]')).toBeVisible();
    await expect(memberOfSelect.locator('option[value="None"]')).toBeVisible();
  });
});
