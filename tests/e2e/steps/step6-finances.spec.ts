import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';
import { smallCompanyData } from '../../fixtures/testData';

test.describe('Step 6: Finances Step Tests', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.navigateToApp();
    
    // Naviguer jusqu'à l'étape 6 en remplissant les étapes précédentes
    await formHelper.fillAllPreviousSteps(5, smallCompanyData);
    await formHelper.goToNextStep(); // Aller à l'étape 6
    await formHelper.expectStep('Finances');
  });

  test('Finances Step components mount correctly', async ({ page }) => {
    // Vérifier le titre de l'étape
    await expect(page.locator('h1')).toContainText('Finances');
    
    // Vérifier que la première question est visible
    await expect(page.locator('text=/Have you transferred any assets from your business to another entity/i')).toBeVisible();
    
    // Vérifier les boutons radio Yes/No pour la première question
    await expect(page.locator('input[name="assetsTransferred"][value="true"]')).toBeVisible();
    await expect(page.locator('input[name="assetsTransferred"][value="false"]')).toBeVisible();
    
    // Boutons de navigation
    await expect(page.locator('button:has-text("Previous")')).toBeVisible();
    await expect(page.locator('button:has-text("Next")')).toBeVisible();
  });

  test('Sequential question revealing system', async ({ page }) => {
    // Répondre à la première question
    await page.check('input[name="assetsTransferred"][value="false"]');
    
    // Attendre que la deuxième question apparaisse
    await page.waitForTimeout(500);
    await expect(page.locator('text=/Did you file last year.*s tax/i')).toBeVisible();
    
    // Répondre à la deuxième question
    await page.check('input[name="filedLastYearTaxes"][value="true"]');
    
    // Attendre que la troisième question apparaisse
    await page.waitForTimeout(500);
    await expect(page.locator('text=/Do you have any ticketing debt/i')).toBeVisible();
    
    // Continuer avec quelques questions de plus
    await page.check('input[name="hasTicketingDebt"][value="false"]');
    await page.waitForTimeout(500);
    await expect(page.locator('text=/Do you have any business debt/i')).toBeVisible();
  });

  test('Business debt conditional fields', async ({ page }) => {
    // Naviguer jusqu'à la question de dette business
    await page.check('input[name="assetsTransferred"][value="false"]');
    await page.waitForTimeout(300);
    await page.check('input[name="filedLastYearTaxes"][value="true"]');
    await page.waitForTimeout(300);
    await page.check('input[name="hasTicketingDebt"][value="false"]');
    await page.waitForTimeout(300);
    
    // Répondre "Yes" à la dette business
    await page.check('input[name="hasBusinessDebt"][value="true"]');
    await page.waitForTimeout(500);
    
    // Vérifier que les champs de dette apparaissent
    await expect(page.locator('select[name*="debtType"]')).toBeVisible();
    await expect(page.locator('input[name*="debtBalance"]')).toBeVisible();
    
    // Remplir les informations de dette
    await page.selectOption('select[name*="debtType"]', 'Credit Card');
    await page.fill('input[name*="debtBalance"]', '50000');
    
    // Vérifier les valeurs
    await expect(page.locator('select[name*="debtType"]')).toHaveValue('Credit Card');
    await expect(page.locator('input[name*="debtBalance"]')).toHaveValue('50000');
    
    // Tester l'ajout d'une deuxième dette
    const addDebtButton = page.locator('button:has-text("Add Debt")');
    if (await addDebtButton.isVisible()) {
      await addDebtButton.click();
      
      // Vérifier qu'une deuxième ligne de dette apparaît
      const debtTypeSelectors = page.locator('select[name*="debtType"]');
      await expect(debtTypeSelectors).toHaveCount(2);
    }
  });

  test('Leasing location conditional date field', async ({ page }) => {
    // Naviguer jusqu'à la question de location
    const questionsToAnswer = [
      'assetsTransferred',
      'filedLastYearTaxes', 
      'hasTicketingDebt',
      'hasBusinessDebt',
      'hasOverdueLiabilities'
    ];
    
    for (const question of questionsToAnswer) {
      await page.check(`input[name="${question}"][value="false"]`);
      await page.waitForTimeout(300);
    }
    
    // Répondre "Yes" à la question de leasing
    await page.check('input[name="isLeasingLocation"][value="true"]');
    await page.waitForTimeout(500);
    
    // Vérifier que le champ de date de fin de bail apparaît
    await expect(page.locator('input[name="leaseEndDate"]')).toBeVisible();
    
    // Remplir la date de fin de bail
    await page.fill('input[name="leaseEndDate"]', '2025-12-31');
    await expect(page.locator('input[name="leaseEndDate"]')).toHaveValue('2025-12-31');
  });

  test('All financial questions with Yes answers', async ({ page }) => {
    const yesAnswers = [
      'assetsTransferred',
      'filedLastYearTaxes',
      'hasTicketingDebt', 
      'hasBusinessDebt',
      'hasOverdueLiabilities',
      'isLeasingLocation',
      'hasTaxLiens',
      'hasJudgments',
      'hasBankruptcy',
      'ownershipChanged'
    ];
    
    for (const question of yesAnswers) {
      // Attendre que la question soit visible
      await expect(page.locator(`input[name="${question}"]`)).toBeVisible({ timeout: 2000 });
      
      // Répondre "Yes"
      await page.check(`input[name="${question}"][value="true"]`);
      await page.waitForTimeout(400);
      
      // Pour certaines questions, des champs conditionnels peuvent apparaître
      if (question === 'hasBusinessDebt') {
        // Vérifier les champs de dette
        await expect(page.locator('select[name*="debtType"]')).toBeVisible();
        await page.selectOption('select[name*="debtType"]', 'Bank Loan');
        await page.fill('input[name*="debtBalance"]', '100000');
      }
      
      if (question === 'isLeasingLocation') {
        // Remplir la date de fin de bail
        await page.fill('input[name="leaseEndDate"]', '2026-06-30');
      }
    }
    
    // Vérifier qu'on peut naviguer vers l'étape suivante
    await formHelper.goToNextStep();
    await expect(page.locator('h1')).toContainText(/Ticketing Information|Additional Information/);
  });

  test('All financial questions with No answers', async ({ page }) => {
    const noAnswers = [
      'assetsTransferred',
      'filedLastYearTaxes',
      'hasTicketingDebt',
      'hasBusinessDebt', 
      'hasOverdueLiabilities',
      'isLeasingLocation',
      'hasTaxLiens',
      'hasJudgments',
      'hasBankruptcy',
      'ownershipChanged'
    ];
    
    for (const question of noAnswers) {
      // Attendre que la question soit visible
      await expect(page.locator(`input[name="${question}"]`)).toBeVisible({ timeout: 2000 });
      
      // Répondre "No"
      await page.check(`input[name="${question}"][value="false"]`);
      await page.waitForTimeout(300);
    }
    
    // Vérifier qu'on peut naviguer vers l'étape suivante
    await formHelper.goToNextStep();
    await expect(page.locator('h1')).toContainText(/Ticketing Information|Additional Information/);
  });

  test('Mixed answers scenario', async ({ page }) => {
    // Scénario réaliste avec réponses mixtes
    const answers = [
      { question: 'assetsTransferred', answer: 'false' },
      { question: 'filedLastYearTaxes', answer: 'true' },
      { question: 'hasTicketingDebt', answer: 'false' },
      { question: 'hasBusinessDebt', answer: 'true' },
      { question: 'hasOverdueLiabilities', answer: 'false' },
      { question: 'isLeasingLocation', answer: 'true' },
      { question: 'hasTaxLiens', answer: 'false' },
      { question: 'hasJudgments', answer: 'false' },
      { question: 'hasBankruptcy', answer: 'false' },
      { question: 'ownershipChanged', answer: 'false' }
    ];
    
    for (const { question, answer } of answers) {
      await expect(page.locator(`input[name="${question}"]`)).toBeVisible({ timeout: 2000 });
      await page.check(`input[name="${question}"][value="${answer}"]`);
      await page.waitForTimeout(300);
      
      // Gérer les champs conditionnels
      if (question === 'hasBusinessDebt' && answer === 'true') {
        await page.selectOption('select[name*="debtType"]', 'Line of Credit');
        await page.fill('input[name*="debtBalance"]', '75000');
      }
      
      if (question === 'isLeasingLocation' && answer === 'true') {
        await page.fill('input[name="leaseEndDate"]', '2025-03-15');
      }
    }
  });

  test('Data persistence when navigating back', async ({ page }) => {
    // Répondre à quelques questions
    await page.check('input[name="assetsTransferred"][value="true"]');
    await page.waitForTimeout(300);
    await page.check('input[name="filedLastYearTaxes"][value="false"]');
    await page.waitForTimeout(300);
    await page.check('input[name="hasTicketingDebt"][value="true"]');
    await page.waitForTimeout(300);
    await page.check('input[name="hasBusinessDebt"][value="true"]');
    await page.waitForTimeout(300);
    
    // Remplir les informations de dette
    await page.selectOption('select[name*="debtType"]', 'Bank Loan');
    await page.fill('input[name*="debtBalance"]', '125000');
    
    // Naviguer vers l'étape suivante puis revenir
    await formHelper.goToNextStep();
    await formHelper.goToPreviousStep();
    
    // Vérifier que les réponses sont conservées
    await expect(page.locator('input[name="assetsTransferred"][value="true"]')).toBeChecked();
    await expect(page.locator('input[name="filedLastYearTaxes"][value="false"]')).toBeChecked();
    await expect(page.locator('input[name="hasTicketingDebt"][value="true"]')).toBeChecked();
    await expect(page.locator('input[name="hasBusinessDebt"][value="true"]')).toBeChecked();
    
    // Vérifier que les données de dette sont conservées
    await expect(page.locator('select[name*="debtType"]')).toHaveValue('Bank Loan');
    await expect(page.locator('input[name*="debtBalance"]')).toHaveValue('125000');
  });

  test('Question text validation', async ({ page }) => {
    // Vérifier que les textes des questions sont corrects
    const expectedQuestions = [
      /Have you transferred any assets from your business to another entity/i,
      /Did you file last year.*s tax/i,
      /Do you have any ticketing debt/i,
      /Do you have any business debt/i,
      /Do you have any overdue liabilities/i,
      /Are you leasing.*location/i,
      /Do you have any tax liens/i,
      /Do you have any judgments/i,
      /Have you.*filed.*bankruptcy/i,
      /Has the ownership.*changed/i
    ];
    
    // Répondre aux questions pour les faire apparaître une par une
    for (let i = 0; i < expectedQuestions.length; i++) {
      if (i > 0) {
        // Répondre à la question précédente pour révéler la suivante
        const previousQuestions = [
          'assetsTransferred', 'filedLastYearTaxes', 'hasTicketingDebt',
          'hasBusinessDebt', 'hasOverdueLiabilities', 'isLeasingLocation',
          'hasTaxLiens', 'hasJudgments', 'hasBankruptcy'
        ];
        
        if (previousQuestions[i - 1]) {
          await page.check(`input[name="${previousQuestions[i - 1]}"][value="false"]`);
          await page.waitForTimeout(300);
        }
      }
      
      // Vérifier que le texte de la question est présent
      await expect(page.locator(`text=${expectedQuestions[i]}`)).toBeVisible({ timeout: 2000 });
    }
  });

  test('Debt types dropdown options', async ({ page }) => {
    // Naviguer jusqu'à la question de dette business
    await page.check('input[name="assetsTransferred"][value="false"]');
    await page.waitForTimeout(300);
    await page.check('input[name="filedLastYearTaxes"][value="true"]');
    await page.waitForTimeout(300);
    await page.check('input[name="hasTicketingDebt"][value="false"]');
    await page.waitForTimeout(300);
    await page.check('input[name="hasBusinessDebt"][value="true"]');
    await page.waitForTimeout(500);
    
    // Vérifier les options du dropdown de type de dette
    const debtTypeSelect = page.locator('select[name*="debtType"]');
    await expect(debtTypeSelect).toBeVisible();
    
    // Vérifier quelques options de dette courantes
    const expectedDebtTypes = ['Bank Loan', 'Credit Card', 'Line of Credit', 'SBA Loan'];
    
    for (const debtType of expectedDebtTypes) {
      await debtTypeSelect.selectOption(debtType);
      await expect(debtTypeSelect).toHaveValue(debtType);
    }
  });

  test('Currency field validation for debt amounts', async ({ page }) => {
    // Naviguer jusqu'aux champs de dette
    await page.check('input[name="assetsTransferred"][value="false"]');
    await page.waitForTimeout(300);
    await page.check('input[name="filedLastYearTaxes"][value="true"]');
    await page.waitForTimeout(300);
    await page.check('input[name="hasTicketingDebt"][value="false"]');
    await page.waitForTimeout(300);
    await page.check('input[name="hasBusinessDebt"][value="true"]');
    await page.waitForTimeout(500);
    
    const debtBalanceField = page.locator('input[name*="debtBalance"]');
    
    // Test de montants valides
    const validAmounts = ['1000', '50000', '250000', '1500000'];
    
    for (const amount of validAmounts) {
      await debtBalanceField.fill(amount);
      await expect(debtBalanceField).toHaveValue(amount);
      await page.waitForTimeout(200);
    }
    
    // Test de caractères non numériques
    await debtBalanceField.fill('abc123');
    await page.waitForTimeout(500);
    
    // Le champ devrait rejeter ou nettoyer les caractères non numériques
    const finalValue = await debtBalanceField.inputValue();
    expect(finalValue).toMatch(/^\d*$/); // Seulement des chiffres
  });

  test('Skip logic and question dependencies', async ({ page }) => {
    // Tester la logique de saut de questions
    // Par exemple, certaines questions pourraient être conditionnelles
    
    // Répondre non à toutes les premières questions
    const questions = ['assetsTransferred', 'filedLastYearTaxes', 'hasTicketingDebt'];
    
    for (const question of questions) {
      await page.check(`input[name="${question}"][value="false"]`);
      await page.waitForTimeout(300);
    }
    
    // Vérifier que la question suivante apparaît
    await expect(page.locator('input[name="hasBusinessDebt"]')).toBeVisible();
    
    // Répondre non à la dette business
    await page.check('input[name="hasBusinessDebt"][value="false"]');
    await page.waitForTimeout(300);
    
    // Vérifier que les champs de dette ne sont PAS visibles
    await expect(page.locator('select[name*="debtType"]')).not.toBeVisible();
    await expect(page.locator('input[name*="debtBalance"]')).not.toBeVisible();
  });
});
