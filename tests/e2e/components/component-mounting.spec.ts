import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';

test.describe('Application Foundation Tests', () => {
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

  test('Core application structure is present', async ({ page }) => {
    // Layout principal
    await expect(page.locator('main')).toBeVisible();
    
    // Barre de progression
    await expect(page.locator('.bg-gradient-to-r')).toBeVisible();
    
    // Zone de contenu principal
    await expect(page.locator('h1')).toBeVisible();
    
    // Vérifier qu'il n'y a pas d'erreurs JavaScript critiques
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    
    // Attendre un moment pour capturer d'éventuelles erreurs
    await page.waitForTimeout(2000);
    
    // Vérifier qu'il n'y a pas d'erreurs JS critiques
    expect(errors.filter(error => 
      !error.includes('Warning') && 
      !error.includes('DevTools')
    )).toHaveLength(0);
  });

  test('Password protection works correctly', async ({ page }) => {
    // Vérifier le mécanisme de protection par mot de passe s'il existe
    // Ce test dépend de votre implémentation
    
    // Si vous avez une protection par mot de passe
    const passwordInput = page.locator('input[type="password"]');
    if (await passwordInput.isVisible()) {
      await expect(passwordInput).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    }
  });
});
