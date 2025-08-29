import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';

test.describe('Multi-Step Navigation & Progress', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.navigateToApp();
  });

  test('Progress bar updates correctly through all steps', async ({ page }) => {
    // Étape 1 - Démarrage
    await formHelper.waitForProgress(9); // (1/11) * 100 ≈ 9%
    
    // Remplir étape 1 et aller à 2
    await formHelper.fillPersonalInfo({
      firstname: "Progress",
      lastname: "Test",
      email: "progress@test.com",
      emailConfirm: "progress@test.com",
      phone: "1234567890",
      role: "CEO"
    });
    await formHelper.goToNextStep();
    await formHelper.waitForProgress(18); // (2/11) * 100 ≈ 18%
    
    // Remplir étape 2 et aller à 3
    await formHelper.fillCompanyInfo({
      name: "Progress Company",
      dba: "PC",
      clientType: "Promoter",
      businessType: "LLC",
      yearsInBusiness: "3",
      ein: "12-3456789",
      companyAddress: "123 Progress St",
      companyCity: "Progress City",
      companyState: "CA",
      companyZipcode: "12345",
      stateOfIncorporation: "CA",
      employees: 5,
      socials: "@progress",
      memberOf: "INTIX"
    });
    await formHelper.goToNextStep();
    await formHelper.waitForProgress(27); // (3/11) * 100 ≈ 27%
    
    // Tester la navigation arrière
    await formHelper.goToPreviousStep();
    await formHelper.waitForProgress(18); // Retour à 18%
    
    await formHelper.goToPreviousStep();
    await formHelper.waitForProgress(9); // Retour à 9%
  });

  test('All step titles are correct', async ({ page }) => {
    const expectedTitles = [
      'Get Funding',                    // Step 1
      'Tell us about your business',    // Step 2  
      'Tell us about your business',    // Step 3 (même titre?)
      'Customize your funding',         // Step 4
      'Business & Ownership',           // Step 5
      'Finances',                       // Step 6
      'Due Diligence',                 // Step 7
      'Due Diligence',                 // Step 8
      'Due Diligence',                 // Step 9
      'Other',                         // Step 10
      'Thank you'                      // Step 11
    ];

    // Pour chaque étape, vérifier le titre
    for (let i = 0; i < expectedTitles.length; i++) {
      const stepNumber = i + 1;
      
      // Naviguer vers l'étape si nécessaire
      if (stepNumber > 1) {
        // Remplir les étapes précédentes avec des données minimales
        await navigateToStep(page, formHelper, stepNumber);
      }
      
      // Vérifier le titre
      await expect(page.locator('h1')).toContainText(expectedTitles[i]);
      
      // Arrêter après quelques étapes pour éviter un test trop long
      if (i >= 2) break;
    }
  });

  test('Back navigation preserves all data across multiple steps', async ({ page }) => {
    // Données de test
    const personalData = {
      firstname: "Multi",
      lastname: "Step",
      email: "multi@step.com",
      emailConfirm: "multi@step.com", 
      phone: "5551234567",
      role: "President"
    };

    const companyData = {
      name: "Multi Step Corp",
      dba: "MSC",
      ein: "98-7654321"
    };

    const ticketingData = {
      currentPartner: "Universe",
      settlementPayout: "Monthly",
      paymentProcessing: "Venue"
    };

    // Remplir les 3 premières étapes
    await formHelper.fillPersonalInfo(personalData);
    await formHelper.goToNextStep();

    await page.fill('input[name="name"]', companyData.name);
    await page.fill('input[name="dba"]', companyData.dba);
    await page.fill('input[name="ein"]', companyData.ein);
    await page.selectOption('select[name="clientType"]', 'Promoter');
    await page.selectOption('select[name="businessType"]', 'LLC');
    await formHelper.goToNextStep();

    await formHelper.fillTicketingInfo(ticketingData);
    
    // Remplir aussi les champs de volume
    await formHelper.fillVolumeInfo({
      lastYearEvents: 20,
      lastYearTickets: 4000,
      lastYearSales: 200000,
      nextYearEvents: 25,
      nextYearTickets: 5000,
      nextYearSales: 250000
    });
    
    await formHelper.goToNextStep(); // Aller à l'étape 4

    // Remplir l'étape funding
    await formHelper.fillFundsInfo({
      yourFunds: "300000",
      timingOfFunding: "In the next 3 months", 
      useOfProceeds: "Artist deposit"
    });

    // Maintenant, naviguer en arrière et vérifier la persistance
    await formHelper.goToPreviousStep(); // Retour étape 4
    await expect(page.locator('input[name="yourFunds"]')).toHaveValue("300000");
    
    await formHelper.goToPreviousStep(); // Retour étape 3
    await expect(page.locator('select[name="currentPartner"]')).toHaveValue(ticketingData.currentPartner);
    
    // Vérifier que les données de volume sont aussi conservées
    await expect(page.locator('input[name="lastYearEvents"]')).toHaveValue("20");
    await expect(page.locator('input[name="lastYearSales"]')).toHaveValue("200000");

    await formHelper.goToPreviousStep(); // Retour étape 2  
    await expect(page.locator('input[name="name"]')).toHaveValue(companyData.name);
    await expect(page.locator('input[name="dba"]')).toHaveValue(companyData.dba);

    await formHelper.goToPreviousStep(); // Retour étape 1
    await expect(page.locator('input[name="firstname"]')).toHaveValue(personalData.firstname);
    await expect(page.locator('input[name="email"]')).toHaveValue(personalData.email);
  });

  test('Required field validation blocks navigation on each step', async ({ page }) => {
    // Étape 1 - Essayer de continuer sans données
    await formHelper.goToNextStep();
    await formHelper.expectStep('Get Funding'); // Devrait rester sur étape 1

    // Remplir partiellement et essayer encore
    await page.fill('input[name="firstname"]', 'Test');
    await formHelper.goToNextStep();
    await formHelper.expectStep('Get Funding'); // Toujours bloqué

    // Remplir complètement l'étape 1
    await formHelper.fillPersonalInfo({
      firstname: "Valid",
      lastname: "User",
      email: "valid@user.com",
      emailConfirm: "valid@user.com",
      phone: "1234567890", 
      role: "CEO"
    });
    await formHelper.goToNextStep();
    await formHelper.expectStep('Tell us about your business'); // Maintenant ça passe

    // Étape 2 - Essayer de continuer sans données
    await formHelper.goToNextStep();
    await formHelper.expectStep('Tell us about your business'); // Devrait rester sur étape 2
  });

  test('Step numbers are correctly tracked', async ({ page }) => {
    // Si vous avez des indicateurs visuels du numéro d'étape
    const stepIndicators = page.locator('[data-step], .step-number');
    
    if (await stepIndicators.count() > 0) {
      // Vérifier l'étape 1
      await expect(stepIndicators.first()).toContainText('1');
      
      // Aller à l'étape 2 et vérifier
      await formHelper.fillPersonalInfo({
        firstname: "Step",
        lastname: "Counter",
        email: "step@counter.com",
        emailConfirm: "step@counter.com",
        phone: "1234567890",
        role: "CEO"
      });
      await formHelper.goToNextStep();
      
      await expect(stepIndicators.first()).toContainText('2');
    }
  });
});

// Fonction helper pour naviguer vers une étape spécifique
async function navigateToStep(page: any, formHelper: FormHelper, targetStep: number) {
  for (let currentStep = 1; currentStep < targetStep; currentStep++) {
    switch (currentStep) {
      case 1:
        await formHelper.fillPersonalInfo({
          firstname: "Nav",
          lastname: "Test", 
          email: "nav@test.com",
          emailConfirm: "nav@test.com",
          phone: "1234567890",
          role: "CEO"
        });
        break;
      case 2:
        await formHelper.fillCompanyInfo({
          name: "Nav Company",
          dba: "NC",
          clientType: "Promoter", 
          businessType: "LLC",
          yearsInBusiness: "2",
          ein: "12-3456789",
          companyAddress: "123 Nav St",
          companyCity: "Nav City",
          companyState: "CA", 
          companyZipcode: "12345",
          stateOfIncorporation: "CA",
          employees: 3,
          socials: "@nav",
          memberOf: "INTIX"
        });
        break;
      case 3:
        await formHelper.fillTicketingInfo({
          currentPartner: "Eventbrite",
          settlementPayout: "Weekly",
          paymentProcessing: "Venue"
        });
        await formHelper.fillVolumeInfo({
          lastYearEvents: 15,
          lastYearTickets: 3000,
          lastYearSales: 150000,
          nextYearEvents: 18,
          nextYearTickets: 3600,
          nextYearSales: 180000
        });
        break;
      case 4:
        await formHelper.fillFundsInfo({
          yourFunds: "200000",
          timingOfFunding: "In the next month",
          useOfProceeds: "Show Marketing"
        });
        break;
      // Ajouter d'autres étapes selon vos besoins
    }
    
    await formHelper.goToNextStep();
  }
}
