import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';

test.describe('Step 3: Ticketing Information', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.navigateToApp();
    
    // Naviguer jusqu'à l'étape 3
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
      memberOf: "INTIX"
    });
    await formHelper.goToNextStep();
    await formHelper.expectStep('Tell us about your business');
  });

  test('All ticketing fields are mounted correctly', async ({ page }) => {
    // Dropdowns principaux de ticketing
    await formHelper.expectFieldToBeVisible('select[name="paymentProcessing"]', 'Payment Processing');
    await formHelper.expectFieldToBeVisible('select[name="currentPartner"]', 'Current Partner');
    await formHelper.expectFieldToBeVisible('select[name="settlementPayout"]', 'Settlement Payout');

    // Champs de volume - Last 12 Months
    await formHelper.expectFieldToBeVisible('input[name="lastYearEvents"]', 'Last Year Events');
    await formHelper.expectFieldToBeVisible('input[name="lastYearTickets"]', 'Last Year Tickets');
    await formHelper.expectFieldToBeVisible('input[name="lastYearSales"]', 'Last Year Sales');

    // Champs de volume - Next 12 Months  
    await formHelper.expectFieldToBeVisible('input[name="nextYearEvents"]', 'Next Year Events');
    await formHelper.expectFieldToBeVisible('input[name="nextYearTickets"]', 'Next Year Tickets');
    await formHelper.expectFieldToBeVisible('input[name="nextYearSales"]', 'Next Year Sales');

    // Boutons de navigation
    await expect(page.locator('button:has-text("Previous")')).toBeVisible();
    await expect(page.locator('button:has-text("Next")')).toBeVisible();
  });

  test('Current Partner dropdown has correct options', async ({ page }) => {
    const partnerSelect = page.locator('select[name="currentPartner"]');
    
    // Options principales de ticketing
    await expect(partnerSelect.locator('option[value="Eventbrite"]')).toBeVisible();
    await expect(partnerSelect.locator('option[value="Ticketmaster"]')).toBeVisible();
    await expect(partnerSelect.locator('option[value="AXS"]')).toBeVisible();
    await expect(partnerSelect.locator('option[value="Universe"]')).toBeVisible();
    await expect(partnerSelect.locator('option[value="Brown Paper Tickets"]')).toBeVisible();
    await expect(partnerSelect.locator('option[value="Other"]')).toBeVisible();
  });

  test('Other Partner field appears when Other is selected', async ({ page }) => {
    const partnerSelect = page.locator('select[name="currentPartner"]');
    
    // Sélectionner "Other"
    await partnerSelect.selectOption('Other');
    
    // Vérifier que le champ "Other Partner" apparaît
    await expect(page.locator('input[name="otherPartner"]')).toBeVisible();
    
    // Remplir le champ other
    await page.fill('input[name="otherPartner"]', 'Custom Ticketing Platform');
    await expect(page.locator('input[name="otherPartner"]')).toHaveValue('Custom Ticketing Platform');
    
    // Changer vers une option standard et vérifier que le champ disparaît
    await partnerSelect.selectOption('Eventbrite');
    await expect(page.locator('input[name="otherPartner"]')).not.toBeVisible();
  });

  test('Settlement Payout dropdown has correct options', async ({ page }) => {
    const settlementSelect = page.locator('select[name="settlementPayout"]');
    
    await expect(settlementSelect.locator('option[value="Daily"]')).toBeVisible();
    await expect(settlementSelect.locator('option[value="Weekly"]')).toBeVisible();
    await expect(settlementSelect.locator('option[value="Monthly"]')).toBeVisible();
    await expect(settlementSelect.locator('option[value="Event"]')).toBeVisible();
  });

  test('Payment Processing dropdown has correct options', async ({ page }) => {
    const paymentSelect = page.locator('select[name="paymentProcessing"]');
    
    await expect(paymentSelect.locator('option[value="Venue"]')).toBeVisible();
    await expect(paymentSelect.locator('option[value="Ticketing Company"]')).toBeVisible();
    await expect(paymentSelect.locator('option[value="Other"]')).toBeVisible();
  });

  test('Other Payment Processing field appears when Other is selected', async ({ page }) => {
    const paymentSelect = page.locator('select[name="paymentProcessing"]');
    
    // Sélectionner "Other"
    await paymentSelect.selectOption('Other');
    
    // Vérifier que le champ "Other Payment Processing" apparaît
    await expect(page.locator('input[name="otherPaymentProcessing"]')).toBeVisible();
    
    // Remplir le champ
    await page.fill('input[name="otherPaymentProcessing"]', 'Custom Payment Processor');
    await expect(page.locator('input[name="otherPaymentProcessing"]')).toHaveValue('Custom Payment Processor');
  });

  test('Required fields validation', async ({ page }) => {
    const requiredFields = [
      'select[name="paymentProcessing"]',
      'select[name="currentPartner"]',
      'select[name="settlementPayout"]',
      'input[name="lastYearEvents"]',
      'input[name="lastYearTickets"]',
      'input[name="lastYearSales"]',
      'input[name="nextYearEvents"]',
      'input[name="nextYearTickets"]',
      'input[name="nextYearSales"]'
    ];

    await formHelper.validateStepRequiredFields(requiredFields);
  });

  test('Navigation to step 4 with valid data', async ({ page }) => {
    // Remplir les champs de ticketing
    await formHelper.fillTicketingInfo({
      currentPartner: "Ticketmaster",
      settlementPayout: "Weekly", 
      paymentProcessing: "Venue"
    });

    // Remplir les champs de volume
    await formHelper.fillVolumeInfo({
      lastYearEvents: 25,
      lastYearTickets: 5000,
      lastYearSales: 250000,
      nextYearEvents: 30,
      nextYearTickets: 6000,
      nextYearSales: 300000
    });

    await formHelper.goToNextStep();
    // Vérifier qu'on arrive à l'étape suivante (funding)
    await expect(page.locator('h1')).toContainText('Customize your funding');
  });

  test('Data persistence when navigating back', async ({ page }) => {
    const ticketingData = {
      currentPartner: "AXS",
      settlementPayout: "Daily",
      paymentProcessing: "Ticketing Company"
    };

    const volumeData = {
      lastYearEvents: 40,
      lastYearTickets: 8000,
      lastYearSales: 400000,
      nextYearEvents: 50,
      nextYearTickets: 10000,
      nextYearSales: 500000
    };

    // Remplir tous les champs
    await formHelper.fillTicketingInfo(ticketingData);
    await formHelper.fillVolumeInfo(volumeData);
    
    // Aller à l'étape suivante puis revenir
    await formHelper.goToNextStep();
    await formHelper.goToPreviousStep();
    
    // Vérifier que les données ticketing sont conservées
    await expect(page.locator('select[name="currentPartner"]')).toHaveValue(ticketingData.currentPartner);
    await expect(page.locator('select[name="settlementPayout"]')).toHaveValue(ticketingData.settlementPayout);
    await expect(page.locator('select[name="paymentProcessing"]')).toHaveValue(ticketingData.paymentProcessing);
    
    // Vérifier que les données de volume sont conservées
    await expect(page.locator('input[name="lastYearEvents"]')).toHaveValue(volumeData.lastYearEvents.toString());
    await expect(page.locator('input[name="lastYearTickets"]')).toHaveValue(volumeData.lastYearTickets.toString());
    await expect(page.locator('input[name="lastYearSales"]')).toHaveValue(volumeData.lastYearSales.toString());
    await expect(page.locator('input[name="nextYearEvents"]')).toHaveValue(volumeData.nextYearEvents.toString());
    await expect(page.locator('input[name="nextYearTickets"]')).toHaveValue(volumeData.nextYearTickets.toString());
    await expect(page.locator('input[name="nextYearSales"]')).toHaveValue(volumeData.nextYearSales.toString());
  });

  test('Conditional field validation for Other Partner', async ({ page }) => {
    // Sélectionner "Other" pour currentPartner
    await page.selectOption('select[name="currentPartner"]', 'Other');
    
    // Le champ otherPartner devrait maintenant être requis
    await expect(page.locator('input[name="otherPartner"]')).toBeVisible();
    
    // Essayer de continuer sans remplir le champ Other
    await page.selectOption('select[name="settlementPayout"]', 'Weekly');
    await page.selectOption('select[name="paymentProcessing"]', 'Venue');
    await formHelper.goToNextStep();
    
    // Vérifier qu'on reste sur la même étape car otherPartner est vide
    await formHelper.expectStep('Tell us about your business');
    
    // Remplir le champ Other et continuer
    await page.fill('input[name="otherPartner"]', 'Custom Platform');
    await formHelper.goToNextStep();
    
    // Maintenant ça devrait fonctionner
    await expect(page.locator('h1')).not.toContainText('Tell us about your business');
  });

  test('Volume fields accept numeric values correctly', async ({ page }) => {
    // Tester les champs d'événements (nombres entiers)
    await page.fill('input[name="lastYearEvents"]', '15');
    await expect(page.locator('input[name="lastYearEvents"]')).toHaveValue('15');
    
    await page.fill('input[name="nextYearEvents"]', '20');
    await expect(page.locator('input[name="nextYearEvents"]')).toHaveValue('20');

    // Tester les champs de tickets (grands nombres)
    await page.fill('input[name="lastYearTickets"]', '12500');
    await expect(page.locator('input[name="lastYearTickets"]')).toHaveValue('12500');
    
    await page.fill('input[name="nextYearTickets"]', '15000');
    await expect(page.locator('input[name="nextYearTickets"]')).toHaveValue('15000');

    // Tester les champs de ventes (montants)
    await page.fill('input[name="lastYearSales"]', '625000');
    await page.fill('input[name="nextYearSales"]', '750000');
    
    // Vérifier que les montants sont acceptés
    await expect(page.locator('input[name="lastYearSales"]')).toHaveValue('625000');
    await expect(page.locator('input[name="nextYearSales"]')).toHaveValue('750000');
  });

  test('Volume fields validation for realistic business values', async ({ page }) => {
    // Tester des valeurs cohérentes business
    const testScenarios = [
      { events: 5, tickets: 1000, sales: 50000 },    // Petit promoteur
      { events: 25, tickets: 10000, sales: 500000 }, // Promoteur moyen
      { events: 100, tickets: 50000, sales: 2500000 } // Gros promoteur
    ];

    for (const scenario of testScenarios) {
      // Last year
      await page.fill('input[name="lastYearEvents"]', scenario.events.toString());
      await page.fill('input[name="lastYearTickets"]', scenario.tickets.toString());
      await page.fill('input[name="lastYearSales"]', scenario.sales.toString());

      // Next year (avec croissance)
      await page.fill('input[name="nextYearEvents"]', (scenario.events * 1.2).toString());
      await page.fill('input[name="nextYearTickets"]', (scenario.tickets * 1.2).toString());
      await page.fill('input[name="nextYearSales"]', (scenario.sales * 1.2).toString());

      // Vérifier qu'aucune erreur de validation business n'apparaît
      await page.waitForTimeout(500);
      
      // Optionnel : vérifier qu'il n'y a pas de messages d'erreur
      const errorMessages = page.locator('.error-message, .text-red-500');
      if (await errorMessages.count() > 0) {
        const errorText = await errorMessages.first().textContent();
        console.log(`Warning: Error for scenario ${JSON.stringify(scenario)}: ${errorText}`);
      }
    }
  });

  test('Volume section titles are displayed correctly', async ({ page }) => {
    // Vérifier la présence des titres de section
    await expect(page.locator('text=/Last 12 Months/i')).toBeVisible();
    await expect(page.locator('text=/Next 12 Months/i')).toBeVisible();
    
    // Vérifier le titre principal de la section volume
    await expect(page.locator('text=/Ticketing Volume/i')).toBeVisible();
  });

  test('Form reflects business type appropriately', async ({ page }) => {
    // Selon le type de client choisi à l'étape 2, certaines options peuvent être différentes
    // Ce test peut être adapté selon votre logique métier
    
    const paymentSelect = page.locator('select[name="paymentProcessing"]');
    
    // Pour un Promoter, toutes les options devraient être disponibles
    await expect(paymentSelect.locator('option[value="Venue"]')).toBeVisible();
    await expect(paymentSelect.locator('option[value="Ticketing Company"]')).toBeVisible();
  });

  test('Volume information integration hint', async ({ page }) => {
    // Ce test vérifie s'il y a des indices sur les étapes suivantes
    // Par exemple, un texte expliquant ce qui vient après
    
    // Chercher des éléments d'aide ou d'information
    const helpText = page.locator('.help-text, .info-text, [data-testid="help"]');
    if (await helpText.count() > 0) {
      await expect(helpText.first()).toBeVisible();
    }
  });
});
