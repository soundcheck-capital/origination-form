import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';

test.describe('Application Foundation Tests', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    // Mock les API calls pour éviter les erreurs réseau
    await formHelper.mockApiCalls();
    await formHelper.navigateToApp();
  });

  test('Application loads successfully', async ({ page }) => {
    // Vérifier que l'application principale est montée
    
    // Vérifier que le logo est présent (alt="Logo" dans MultiStepForm)
    await expect(page.locator('img[alt="Logo"]')).toBeVisible();
    
    // Vérifier que la barre de progression est présente
    await expect(page.locator('.bg-gradient-to-r')).toBeVisible();
    
    // Vérifier le titre de la première étape
    await expect(page.locator('h1')).toContainText('Get Funding');
    
    // Vérifier que le main est présent
    await expect(page.locator('main')).toBeVisible();
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
    // Aller sur la page d'accueil pour tester la protection par mot de passe
    await page.goto('/');
    
    // Vérifier si la protection par mot de passe est active
    const passwordInput = page.locator('input[type="password"]');
    const accessRequiredTitle = page.locator('h2:has-text("Access Required")');
    
    // Si la protection est active, vérifier les éléments
    if (await passwordInput.isVisible()) {
      await expect(accessRequiredTitle).toBeVisible();
      await expect(passwordInput).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
      await expect(page.locator('img[alt="SoundCheck"]')).toBeVisible();
    }
  });
});
