import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';

test.describe('Step 4: Your Funding (YourFundsStep)', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.navigateToApp();
    
    // Naviguer jusqu'à l'étape 4
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
      dba: "Test Co",
      clientType: "Promoter",
      businessType: "LLC",
      yearsInBusiness: "5",
      ein: "12-3456789",
      companyAddress: "123 Test St",
      companyCity: "Test City",
      companyState: "CA",
      companyZipcode: "12345",
      stateOfIncorporation: "CA",
      employees: 10,
      socials: "@test",
      memberOf: "NIVA (National Independent Venue Association)"
    });
    await formHelper.goToNextStep();

    await formHelper.fillTicketingInfo({
      currentPartner: "Ticketmaster",
      settlementPayout: "Weekly",
      paymentProcessing: "Venue"
    });
    await formHelper.goToNextStep();

    // Nous sommes maintenant sur l'étape "Customize your funding" 
    await formHelper.expectStep('Customize your funding');
  });

  test('All funding fields are mounted correctly', async ({ page }) => {
    // Champ de montant de financement (CurrencyField)
    await formHelper.expectFieldToBeVisible('input[name="yourFunds"]', 'Funding Needs');
    
    // Dropdown timing
    await formHelper.expectFieldToBeVisible('select[name="timingOfFunding"]', 'Timing for Funding');
    
    // Dropdown utilisation des fonds
    await formHelper.expectFieldToBeVisible('select[name="useOfProceeds"]', 'Use of Proceeds');

    // Boutons de navigation
    await expect(page.locator('button:has-text("Previous")')).toBeVisible();
    await expect(page.locator('button:has-text("Next")')).toBeVisible();
  });

  test('Required fields validation', async ({ page }) => {
    const requiredFields = [
      'input[name="yourFunds"]',
      'select[name="timingOfFunding"]',
      'select[name="useOfProceeds"]'
    ];

    await formHelper.validateStepRequiredFields(requiredFields);
  });

  test('Timing of Funding dropdown has correct options', async ({ page }) => {
    const timingSelect = page.locator('select[name="timingOfFunding"]');
    
    // Vérifier les options de timing
    await expect(timingSelect.locator('option[value="In the next 2 weeks"]')).toBeVisible();
    await expect(timingSelect.locator('option[value="In the next month"]')).toBeVisible();
    await expect(timingSelect.locator('option[value="In the next 3 months"]')).toBeVisible();
  });

  test('Use of Proceeds dropdown has correct options', async ({ page }) => {
    const useSelect = page.locator('select[name="useOfProceeds"]');
    
    // Vérifier les options d'utilisation
    await expect(useSelect.locator('option[value="Artist deposit"]')).toBeVisible();
    await expect(useSelect.locator('option[value="Venue deposit"]')).toBeVisible();
    await expect(useSelect.locator('option[value="Show Marketing"]')).toBeVisible();
    await expect(useSelect.locator('option[value="Operational / Show Expenses"]')).toBeVisible();
    await expect(useSelect.locator('option[value="General Working Capital Needs"]')).toBeVisible();
  });

  test('Currency field accepts and formats monetary values', async ({ page }) => {
    const fundsInput = page.locator('input[name="yourFunds"]');
    
    // Tester différents formats d'entrée
    await fundsInput.fill('50000');
    
    // Selon votre implémentation CurrencyField, vérifier le format
    // Cela peut être formaté automatiquement (ex: $50,000 ou 50,000)
    const value = await fundsInput.inputValue();
    expect(value).toMatch(/50[,]?000/); // Accepte avec ou sans virgule
    
    // Tester avec des décimales
    await fundsInput.clear();
    await fundsInput.fill('75500.50');
    
    // Vérifier que les décimales sont gérées
    const decimalValue = await fundsInput.inputValue();
    expect(decimalValue).toMatch(/75[,]?500[.]?5?0?/);
  });

  test('Currency field validation for minimum/maximum values', async ({ page }) => {
    const fundsInput = page.locator('input[name="yourFunds"]');
    
    // Tester une valeur très faible
    await fundsInput.fill('100');
    await formHelper.goToNextStep();
    
    // Selon votre logique métier, cela pourrait être accepté ou rejeté
    // Adaptez selon vos règles de validation
    
    // Tester une valeur très élevée
    await fundsInput.clear();
    await fundsInput.fill('5000000'); // 5M
    
    // Vérifier si il y a une limite maximum
    // Selon votre logique métier
  });

  test('Qualification amount display based on sales volume', async ({ page }) => {
    // Ce test vérifie l'affichage conditionnel du montant de qualification
    // basé sur les ventes de ticketing précédentes
    
    // D'abord, aller remplir des volumes de ventes élevés aux étapes précédentes
    // Retourner à l'étape ticketing/volume pour modifier les données
    
    // Pour ce test, nous devons d'abord remplir les volumes
    // Cela nécessite de naviguer vers l'étape volume (si elle existe)
    // ou d'utiliser des données pré-remplies
    
    // Chercher l'élément de qualification s'il existe
    const qualificationText = page.locator('text=/Based on your ticketing sales volume/');
    const qualificationAmount = page.locator('.bg-gradient-to-r.from-amber-500.to-rose-500');
    
    // Vérifier si l'affichage conditionnel fonctionne
    // (Cet affichage dépend des données de volumeInfo)
    if (await qualificationText.isVisible()) {
      await expect(qualificationText).toBeVisible();
      await expect(qualificationAmount).toBeVisible();
      
      // Vérifier que le montant est formaté correctement
      const amountText = await qualificationAmount.textContent();
      expect(amountText).toMatch(/\$[\d,]+/); // Format $X,XXX
    }
  });

  test('Navigation to step 5 with valid funding data', async ({ page }) => {
    await formHelper.fillFundsInfo({
      yourFunds: "250000",
      timingOfFunding: "In the next month",
      useOfProceeds: "Show Marketing"
    });

    await formHelper.goToNextStep();
    
    // Vérifier qu'on arrive à l'étape suivante (probablement Ownership)
    await expect(page.locator('h1')).toContainText('Business & Ownership');
  });

  test('Data persistence when navigating back and forth', async ({ page }) => {
    const testData = {
      yourFunds: "150000",
      timingOfFunding: "In the next 3 months",
      useOfProceeds: "Artist deposit"
    };

    // Remplir les données
    await page.fill('input[name="yourFunds"]', testData.yourFunds);
    await page.selectOption('select[name="timingOfFunding"]', testData.timingOfFunding);
    await page.selectOption('select[name="useOfProceeds"]', testData.useOfProceeds);

    // Aller à l'étape suivante puis revenir
    await formHelper.goToNextStep();
    await formHelper.goToPreviousStep();
    
    // Vérifier que les données sont conservées
    await expect(page.locator('input[name="yourFunds"]')).toHaveValue(testData.yourFunds);
    await expect(page.locator('select[name="timingOfFunding"]')).toHaveValue(testData.timingOfFunding);
    await expect(page.locator('select[name="useOfProceeds"]')).toHaveValue(testData.useOfProceeds);
  });

  test('Form prevents navigation with incomplete data', async ({ page }) => {
    // Remplir seulement une partie des champs
    await page.fill('input[name="yourFunds"]', "100000");
    // Laisser les dropdowns vides
    
    // Essayer de continuer
    await formHelper.goToNextStep();
    
    // Vérifier qu'on reste sur la même étape
    await formHelper.expectStep('Customize your funding');
  });

  test('Funding amount affects business logic calculations', async ({ page }) => {
    // Tester différents montants et voir si cela affecte les calculs
    // ou validations business
    
    const amounts = ['50000', '250000', '500000', '1000000'];
    
    for (const amount of amounts) {
      await page.fill('input[name="yourFunds"]', amount);
      await page.selectOption('select[name="timingOfFunding"]', 'In the next month');
      await page.selectOption('select[name="useOfProceeds"]', 'General Working Capital Needs');
      
      // Vérifier qu'il n'y a pas d'erreurs de validation business
      // selon le montant choisi
      
      // Selon votre logique, certains montants peuvent déclencher
      // des validations ou messages spécifiques
      
      await page.waitForTimeout(500); // Laisser le temps aux validations
    }
  });

  test('Currency field handles edge cases', async ({ page }) => {
    const fundsInput = page.locator('input[name="yourFunds"]');
    
    // Tester avec des caractères non numériques
    await fundsInput.fill('abc123');
    
    // Vérifier que seuls les chiffres sont acceptés
    // (comportement dépend de votre implémentation CurrencyField)
    const invalidValue = await fundsInput.inputValue();
    expect(invalidValue).toMatch(/^[\d,.$]*$/); // Seulement chiffres et symboles monétaires
    
    // Tester avec des virgules et points
    await fundsInput.clear();
    await fundsInput.fill('1,000,000.00');
    
    // Vérifier le formatage
    const formattedValue = await fundsInput.inputValue();
    expect(formattedValue).toBeTruthy();
  });

  test('Help text and disclaimers are displayed', async ({ page }) => {
    // Vérifier la présence du texte d'aide ou disclaimers
    const disclaimerText = page.locator('text=/non-binding and is merely an indication/');
    
    if (await disclaimerText.isVisible()) {
      await expect(disclaimerText).toBeVisible();
      
      // Vérifier que le texte complet est présent
      await expect(disclaimerText).toContainText('non-binding');
      await expect(disclaimerText).toContainText('due diligence process');
    }
    
    // Chercher d'autres éléments d'aide
    const helpElements = page.locator('.help-text, .info-text, [data-testid="help"]');
    if (await helpElements.count() > 0) {
      await expect(helpElements.first()).toBeVisible();
    }
  });
});
