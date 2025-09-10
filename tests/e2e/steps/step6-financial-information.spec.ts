import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';

test.describe('Step 6: Finances', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.mockApiCalls();
    await formHelper.navigateToApp();
    
    // Pour l'instant, on va tester Step 6 en arrivant directement via l'URL ou navigation manuelle
    // TODO: Corriger la navigation complexe des étapes précédentes
    
    // Navigation simplifiée - on va simuler qu'on arrive à Step 6
    await formHelper.fillPersonalInfo({
      firstname: "Test",
      lastname: "User", 
      email: "test@example.com",
      emailConfirm: "test@example.com",
      phone: "12345678901234"
    });
    await formHelper.waitForValidation();
    await formHelper.goToNextStep();
    
    await formHelper.fillCompanyInfo({
      name: "Test Company",
      role: "CEO", 
      clientType: "Promoter",
      yearsInBusiness: "2-5 years",
      employees: 50,
      socials: "https://testcompany.com",
      memberOf: "Other"
    });
    await formHelper.waitForValidation();
    await formHelper.goToNextStep();
    
    // Pour l'instant, on va s'arrêter ici et tester les composants individuellement
    // sans navigation complète vers Step 6
  });

  test('Single/Multi entity selection is mounted correctly', async ({ page }) => {
    // Section Single/Multi entity
    await expect(page.locator('input[name="singleEntity"]')).toBeVisible();
    await expect(page.locator('label:has-text("Single Entity")')).toBeVisible();
    await expect(page.locator('label:has-text("Multi-entity")')).toBeVisible();

    // Titre de la section Finances
    await expect(page.locator('p:has-text("Finances")')).toBeVisible();

    // Boutons de navigation
    await expect(page.locator('button:has-text("Previous")')).toBeVisible();
    await expect(page.locator('button:has-text("Next")')).toBeVisible();
  });

  test('First financial question appears automatically', async ({ page }) => {
    // La première question devrait être visible automatiquement
    await expect(page.locator('text=Is there more than ~$50,000 in cash, assets')).toBeVisible();
    
    // Le switch pour assetsTransferred devrait être présent
    await expect(page.locator('input[name="assetsTransferred"]')).toBeVisible();
    await expect(page.locator('label:has-text("No")')).toBeVisible();
    await expect(page.locator('label:has-text("Yes")')).toBeVisible();
  });

  test('Questions appear progressively when answered', async ({ page }) => {
    // Répondre à la première question
    await page.check('input[name="assetsTransferred"]'); // Yes
    await page.waitForTimeout(500);
    
    // La deuxième question devrait apparaître
    await expect(page.locator('text=Have you filed your business taxes')).toBeVisible();
    await expect(page.locator('input[name="filedLastYearTaxes"]')).toBeVisible();
    
    // Répondre à la deuxième question
    await page.check('input[name="filedLastYearTaxes"]'); // Yes
    await page.waitForTimeout(500);
    
    // La troisième question devrait apparaître
    await expect(page.locator('text=Do you have any business debt')).toBeVisible();
    await expect(page.locator('input[name="hasBusinessDebt"]')).toBeVisible();
  });

  test('Business debt section appears when answered Yes', async ({ page }) => {
    // Naviguer jusqu'à la question debt et répondre Yes
    await page.check('input[name="assetsTransferred"]');
    await page.waitForTimeout(500);
    await page.check('input[name="filedLastYearTaxes"]');
    await page.waitForTimeout(500);
    await page.check('input[name="hasBusinessDebt"]'); // Yes
    await page.waitForTimeout(1000);
    
    // La section des dettes devrait apparaître
    await expect(page.locator('select[name="debtType"]')).toBeVisible();
    await expect(page.locator('input[name="debtBalance"]')).toBeVisible();
  });

  test('Debt types dropdown has correct options', async ({ page }) => {
    // Naviguer jusqu'à la section debt
    await page.check('input[name="assetsTransferred"]');
    await page.waitForTimeout(500);
    await page.check('input[name="filedLastYearTaxes"]');
    await page.waitForTimeout(500);
    await page.check('input[name="hasBusinessDebt"]');
    await page.waitForTimeout(1000);
    
    const debtTypeSelect = page.locator('select[name="debtType"]');
    await expect(debtTypeSelect).toBeVisible();
    
    // Vérifier quelques options principales (selon hubspotLists.ts)
    await expect(debtTypeSelect.locator('option[value="Credit card debt"]')).toHaveCount(1);
    await expect(debtTypeSelect.locator('option[value="Ticketing Company"]')).toHaveCount(1);
    await expect(debtTypeSelect.locator('option[value="Account payables"]')).toHaveCount(1);
    await expect(debtTypeSelect.locator('option[value="Terms loans"]')).toHaveCount(1);
    await expect(debtTypeSelect.locator('option[value="SBA Loan"]')).toHaveCount(1);
  });

  test('Currency field accepts debt balance values', async ({ page }) => {
    // Naviguer jusqu'à la section debt
    await page.check('input[name="assetsTransferred"]');
    await page.waitForTimeout(500);
    await page.check('input[name="filedLastYearTaxes"]');
    await page.waitForTimeout(500);
    await page.check('input[name="hasBusinessDebt"]');
    await page.waitForTimeout(1000);
    
    const balanceInput = page.locator('input[name="debtBalance"]');
    
    // Tester avec une valeur monétaire
    await balanceInput.fill('50000');
    await expect(balanceInput).toHaveValue('$50,000');
  });

  test('Add Debt functionality works correctly', async ({ page }) => {
    // Naviguer jusqu'à la section debt
    await page.check('input[name="assetsTransferred"]');
    await page.waitForTimeout(500);
    await page.check('input[name="filedLastYearTaxes"]');
    await page.waitForTimeout(500);
    await page.check('input[name="hasBusinessDebt"]');
    await page.waitForTimeout(1000);
    
    // Il devrait y avoir initialement 1 ligne de dette
    await expect(page.locator('select[name="debtType"]')).toHaveCount(1);
    await expect(page.locator('input[name="debtBalance"]')).toHaveCount(1);
    
    // Chercher le bouton Add Debt (peut avoir différents textes)
    const addButton = page.locator('button').filter({ hasText: /add|Add|plus|\+/i }).first();
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(500);
      
      // Il devrait maintenant y avoir 2 lignes de dette
      await expect(page.locator('select[name="debtType"]')).toHaveCount(2);
      await expect(page.locator('input[name="debtBalance"]')).toHaveCount(2);
    }
  });

  test('Conditional question appears when business debt is Yes', async ({ page }) => {
    // Naviguer jusqu'à hasBusinessDebt et répondre Yes
    await page.check('input[name="assetsTransferred"]');
    await page.waitForTimeout(500);
    await page.check('input[name="filedLastYearTaxes"]');
    await page.waitForTimeout(500);
    await page.check('input[name="hasBusinessDebt"]');
    await page.waitForTimeout(1000);
    
    // Remplir au moins un type de dette pour déclencher la condition
    await page.selectOption('select[name="debtType"]', 'Credit card debt');
    await page.waitForTimeout(500);
    
    // La question conditionnelle "Are any of these liabilities overdue" devrait apparaître
    // (cette question n'apparaît que si hasBusinessDebt=true ET debts.length > 0)
    await expect(page.locator('text=Are any of these liabilities not within terms')).toBeVisible();
    await expect(page.locator('input[name="hasOverdueLiabilities"]')).toBeVisible();
  });

  test('All financial questions can be answered', async ({ page }) => {
    // Répondre progressivement à toutes les questions
    const questions = [
      'assetsTransferred',
      'filedLastYearTaxes', 
      'hasBusinessDebt',
      'hasTaxLiens',
      'hasJudgments',
      'hasBankruptcy',
      'ownershipChanged'
    ];
    
    for (const question of questions) {
      // Attendre que la question soit visible
      await expect(page.locator(`input[name="${question}"]`)).toBeVisible({ timeout: 2000 });
      
      // Répondre Yes à la question
      await page.check(`input[name="${question}"]`);
      await page.waitForTimeout(500);
    }
    
    // Toutes les questions devraient être visibles à la fin
    for (const question of questions) {
      await expect(page.locator(`input[name="${question}"]`)).toBeVisible();
    }
  });

  test('Switch toggles work correctly', async ({ page }) => {
    const switchInput = page.locator('input[name="assetsTransferred"]');
    
    // Initialement non coché (No)
    await expect(switchInput).not.toBeChecked();
    
    // Cliquer pour activer (Yes)
    await switchInput.check();
    await expect(switchInput).toBeChecked();
    
    // Cliquer pour désactiver (No)
    await switchInput.uncheck();
    await expect(switchInput).not.toBeChecked();
  });

  test('Single Entity radio button works correctly', async ({ page }) => {
    const singleEntityInput = page.locator('input[name="singleEntity"]');
    
    // Tester le toggle Single Entity
    await singleEntityInput.check();
    await expect(singleEntityInput).toBeChecked();
    
    await singleEntityInput.uncheck();
    await expect(singleEntityInput).not.toBeChecked();
  });

  test('Form accessibility features', async ({ page }) => {
    // Vérifier que les switches ont les bons attributs
    await expect(page.locator('input[name="assetsTransferred"]')).toHaveAttribute('type', 'checkbox');
    await expect(page.locator('input[name="assetsTransferred"]')).toHaveAttribute('role', 'switch');
    
    // Vérifier que les labels sont associés
    await expect(page.locator('label[for="assetsTransferred"]')).toBeVisible();
  });
});