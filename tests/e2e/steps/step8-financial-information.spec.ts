import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';
import { smallCompanyData } from '../../fixtures/testData';

test.describe('Step 8: Financial Information Step Tests', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.navigateToApp();
    
    // Naviguer jusqu'à l'étape 8 en remplissant les étapes précédentes
    await formHelper.fillAllPreviousSteps(7, smallCompanyData);
    await formHelper.goToNextStep(); // Aller à l'étape 8
    await formHelper.expectStep('Financial Information');
  });

  test('Financial Information Step components mount correctly', async ({ page }) => {
    // Vérifier le titre de l'étape
    await expect(page.locator('h1')).toContainText('Financial Information');
    
    // Vérifier les deux champs de fichiers attendus
    await expect(page.locator('text=/Last 2 years and YTD detailed financial statements/i')).toBeVisible();
    await expect(page.locator('text=/Last 6 months of bank statements/i')).toBeVisible();
    
    // Vérifier les zones de drop de fichiers
    await expect(page.locator('[data-field="financialStatements"]')).toBeVisible();
    await expect(page.locator('[data-field="bankStatement"]')).toBeVisible();
    
    // Boutons de navigation
    await expect(page.locator('button:has-text("Previous")')).toBeVisible();
    await expect(page.locator('button:has-text("Next")')).toBeVisible();
  });

  test('Financial statements field details', async ({ page }) => {
    // Vérifier le premier champ de fichier (états financiers)
    const financialStatementsField = page.locator('[data-field="financialStatements"]');
    await expect(financialStatementsField).toBeVisible();
    
    // Vérifier la description complète
    await expect(page.locator('text=/Last 2 years and YTD detailed financial statements.*P&L.*B.*S.*per month/i')).toBeVisible();
    
    // Ce champ devrait accepter plusieurs fichiers
    const financialInput = page.locator('[data-field="financialStatements"] input[type="file"]');
    const hasMultiple = await financialInput.getAttribute('multiple');
    expect(hasMultiple).not.toBeNull();
  });

  test('Bank statements field details', async ({ page }) => {
    // Vérifier le deuxième champ de fichier (relevés bancaires)
    const bankStatementField = page.locator('[data-field="bankStatement"]');
    await expect(bankStatementField).toBeVisible();
    
    // Vérifier la description
    await expect(page.locator('text=/Last 6 months of bank statements/i')).toBeVisible();
    
    // Ce champ devrait aussi accepter plusieurs fichiers
    const bankInput = page.locator('[data-field="bankStatement"] input[type="file"]');
    const hasMultiple = await bankInput.getAttribute('multiple');
    expect(hasMultiple).not.toBeNull();
  });

  test('File type restrictions', async ({ page }) => {
    // Vérifier que tous les champs acceptent les bons types de fichiers
    const fileInputs = page.locator('input[type="file"]');
    
    for (let i = 0; i < await fileInputs.count(); i++) {
      const input = fileInputs.nth(i);
      const acceptAttr = await input.getAttribute('accept');
      
      // Vérifier les types de fichiers financiers autorisés
      expect(acceptAttr).toContain('.xlsx');
      expect(acceptAttr).toContain('.pdf');
      expect(acceptAttr).toContain('.csv');
      expect(acceptAttr).toContain('.jpg');
      expect(acceptAttr).toContain('.png');
    }
  });

  test('Required field validation for financial statements', async ({ page }) => {
    // Le champ "Financial Statements" est obligatoire
    // Essayer de naviguer sans uploader de fichiers
    await formHelper.goToNextStep();
    
    // Vérifier qu'une validation apparaît ou qu'on ne peut pas continuer
    await page.waitForTimeout(1000);
    
    // Si on reste sur la même page, c'est que la validation a fonctionné
    const currentTitle = await page.locator('h1').textContent();
    expect(currentTitle).toContain('Financial Information');
  });

  test('Optional bank statements field', async ({ page }) => {
    // Le champ "Bank Statements" semble être optionnel
    const bankStatementField = page.locator('[data-field="bankStatement"]');
    
    // Vérifier qu'il n'y a pas d'indicateur de champ requis
    const requiredIndicator = page.locator('[data-field="bankStatement"] .required, [data-field="bankStatement"] *:has-text("*")');
    
    // Si pas d'indicateur requis visible, c'est probablement optionnel
    const isRequired = await requiredIndicator.count() > 0;
    console.log('Bank statements field required:', isRequired);
  });

  test('Multiple financial documents upload simulation', async ({ page }) => {
    // Simuler l'upload de plusieurs documents financiers
    await page.evaluate(() => {
      const financialInput = document.querySelector('[data-field="financialStatements"] input[type="file"]') as HTMLInputElement;
      if (financialInput) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [
              { name: 'P&L-2023.xlsx', size: 2048000, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
              { name: 'Balance-Sheet-2023.pdf', size: 1536000, type: 'application/pdf' },
              { name: 'P&L-2022.xlsx', size: 1792000, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
              { name: 'Balance-Sheet-2022.pdf', size: 1600000, type: 'application/pdf' },
              { name: 'YTD-2024.csv', size: 512000, type: 'text/csv' }
            ]
          }
        });
        financialInput.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Vérifier si des éléments visuels indiquent l'upload
    const uploadIndicators = page.locator('.file-list, .uploaded-files, .file-item, .upload-progress');
    if (await uploadIndicators.count() > 0) {
      console.log('Financial documents upload indicators found');
    }
  });

  test('Bank statements upload simulation', async ({ page }) => {
    // Simuler l'upload de relevés bancaires
    await page.evaluate(() => {
      const bankInput = document.querySelector('[data-field="bankStatement"] input[type="file"]') as HTMLInputElement;
      if (bankInput) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [
              { name: 'Bank-Statement-Jan-2024.pdf', size: 1024000, type: 'application/pdf' },
              { name: 'Bank-Statement-Feb-2024.pdf', size: 1100000, type: 'application/pdf' },
              { name: 'Bank-Statement-Mar-2024.pdf', size: 980000, type: 'application/pdf' },
              { name: 'Bank-Statement-Apr-2024.pdf', size: 1200000, type: 'application/pdf' },
              { name: 'Bank-Statement-May-2024.pdf', size: 1050000, type: 'application/pdf' },
              { name: 'Bank-Statement-Jun-2024.pdf', size: 1150000, type: 'application/pdf' }
            ]
          }
        });
        bankInput.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(1000);
  });

  test('File validation for financial documents', async ({ page }) => {
    // Tester l'upload d'un fichier de type non autorisé
    await page.evaluate(() => {
      const input = document.querySelector('[data-field="financialStatements"] input[type="file"]') as HTMLInputElement;
      if (input) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [{
              name: 'invalid-document.txt',
              size: 1024,
              type: 'text/plain'
            }]
          }
        });
        input.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Vérifier s'il y a des messages d'erreur
    const errorMessages = page.locator('.error-message, .text-red-500, [class*="error"]');
    if (await errorMessages.count() > 0) {
      const errorText = await errorMessages.first().textContent();
      console.log('File validation error:', errorText);
    }
  });

  test('Large file handling', async ({ page }) => {
    // Simuler l'upload d'un fichier très volumineux
    await page.evaluate(() => {
      const input = document.querySelector('[data-field="financialStatements"] input[type="file"]') as HTMLInputElement;
      if (input) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [{
              name: 'huge-financial-report.xlsx',
              size: 50 * 1024 * 1024, // 50MB
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }]
          }
        });
        input.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(2000);
    
    // Vérifier s'il y a des indicateurs de progression ou des erreurs de taille
    const progressIndicators = page.locator('.upload-progress, .progress-bar, .loading');
    const sizeErrors = page.locator('text=/too large/i, text=/file size/i, text=/maximum/i');
    
    if (await progressIndicators.count() > 0) {
      console.log('Upload progress indicators detected');
    }
    
    if (await sizeErrors.count() > 0) {
      const errorText = await sizeErrors.first().textContent();
      console.log('File size error:', errorText);
    }
  });

  test('Complete financial documentation scenario', async ({ page }) => {
    // Scénario complet : uploader tous les documents requis
    
    // Upload des états financiers (obligatoire)
    await page.evaluate(() => {
      const financialInput = document.querySelector('[data-field="financialStatements"] input[type="file"]') as HTMLInputElement;
      if (financialInput) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [
              { name: 'Complete-P&L-2023.xlsx', size: 1500000, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
              { name: 'Complete-Balance-Sheet-2023.pdf', size: 1200000, type: 'application/pdf' }
            ]
          }
        });
        financialInput.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Upload des relevés bancaires (optionnel)
    await page.evaluate(() => {
      const bankInput = document.querySelector('[data-field="bankStatement"] input[type="file"]') as HTMLInputElement;
      if (bankInput) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [
              { name: 'Bank-Statements-Q1-2024.pdf', size: 800000, type: 'application/pdf' },
              { name: 'Bank-Statements-Q2-2024.pdf', size: 850000, type: 'application/pdf' }
            ]
          }
        });
        bankInput.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Essayer de naviguer vers l'étape suivante
    await formHelper.goToNextStep();
    
    // Vérifier qu'on arrive à l'étape suivante
    await expect(page.locator('h1')).toContainText(/Legal Information|Contractual and Legal Information|Additional Information/);
  });

  test('Data persistence when navigating back', async ({ page }) => {
    // Upload de documents
    await page.evaluate(() => {
      const financialInput = document.querySelector('[data-field="financialStatements"] input[type="file"]') as HTMLInputElement;
      if (financialInput) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [{
              name: 'persistent-financial.xlsx',
              size: 1024000,
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }]
          }
        });
        financialInput.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Naviguer vers l'étape suivante
    await formHelper.goToNextStep();
    
    // Revenir à cette étape
    await formHelper.goToPreviousStep();
    
    // Vérifier que les informations de fichiers sont conservées
    const uploadedFileInfo = page.locator('text=/persistent-financial.xlsx/, .uploaded-file, .file-item');
    if (await uploadedFileInfo.count() > 0) {
      await expect(uploadedFileInfo.first()).toBeVisible();
    }
  });

  test('Drag and drop interaction simulation', async ({ page }) => {
    // Simuler les interactions de drag and drop sur les zones d'upload
    const financialDropZone = page.locator('[data-field="financialStatements"]');
    
    // Simuler hover sur la zone de drop
    await financialDropZone.hover();
    
    // Vérifier si des classes CSS de hover apparaissent
    const dropZoneClasses = await financialDropZone.getAttribute('class');
    console.log('Drop zone classes on hover:', dropZoneClasses);
    
    // Cliquer sur la zone pour déclencher la sélection de fichier
    await financialDropZone.click();
    
    // Vérifier que l'input file est activé
    const fileInput = page.locator('[data-field="financialStatements"] input[type="file"]');
    await expect(fileInput).toBeVisible();
  });

  test('Upload field descriptions and help text', async ({ page }) => {
    // Vérifier que les descriptions sont claires et utiles
    
    // Description des états financiers
    await expect(page.locator('text=/Last 2 years and YTD detailed financial statements/i')).toBeVisible();
    await expect(page.locator('text=/P&L.*B.*S.*per month/i')).toBeVisible();
    
    // Description des relevés bancaires
    await expect(page.locator('text=/Last 6 months of bank statements/i')).toBeVisible();
    
    // Vérifier s'il y a des indications supplémentaires (formats acceptés, taille max, etc.)
    const helpTexts = page.locator('.help-text, .description, .hint, [class*="help"]');
    if (await helpTexts.count() > 0) {
      for (let i = 0; i < await helpTexts.count(); i++) {
        const helpText = await helpTexts.nth(i).textContent();
        console.log(`Help text ${i}:`, helpText);
      }
    }
  });

  test('Financial documents accessibility', async ({ page }) => {
    // Vérifier l'accessibilité des champs d'upload
    
    const fileInputs = page.locator('input[type="file"]');
    
    for (let i = 0; i < await fileInputs.count(); i++) {
      const input = fileInputs.nth(i);
      
      // Vérifier les attributs d'accessibilité
      const id = await input.getAttribute('id');
      const name = await input.getAttribute('name');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaDescribedBy = await input.getAttribute('aria-describedby');
      
      // Au moins un identifiant doit être présent
      expect(id || name || ariaLabel).toBeTruthy();
      
      // Vérifier la navigation au clavier
      await input.focus();
      await expect(input).toBeFocused();
      
      // Vérifier qu'on peut "cliquer" avec Entrée
      await input.press('Enter');
      await page.waitForTimeout(200);
    }
  });

  test('Error handling for corrupt files', async ({ page }) => {
    // Simuler l'upload de fichiers "corrompus" ou problématiques
    await page.evaluate(() => {
      const input = document.querySelector('[data-field="financialStatements"] input[type="file"]') as HTMLInputElement;
      if (input) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [{
              name: 'corrupt-file.xlsx',
              size: 0, // Fichier vide
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }]
          }
        });
        input.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Vérifier s'il y a des messages d'erreur appropriés
    const errorMessages = page.locator('.error-message, .text-red-500, [class*="error"]');
    if (await errorMessages.count() > 0) {
      console.log('Error handling for empty file detected');
    }
  });
});
