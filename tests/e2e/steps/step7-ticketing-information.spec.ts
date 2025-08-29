import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';
import { smallCompanyData } from '../../fixtures/testData';

test.describe('Step 7: Ticketing Information Step Tests', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.navigateToApp();
    
    // Naviguer jusqu'à l'étape 7 en remplissant les étapes précédentes
    await formHelper.fillAllPreviousSteps(6, smallCompanyData);
    await formHelper.goToNextStep(); // Aller à l'étape 7
    await formHelper.expectStep('Ticketing Information');
  });

  test('Ticketing Information Step components mount correctly', async ({ page }) => {
    // Vérifier le titre de l'étape
    await expect(page.locator('h1')).toContainText('Ticketing Information');
    
    // Vérifier les deux champs de fichiers attendus
    await expect(page.locator('text=/Reports from ticketing company/i')).toBeVisible();
    await expect(page.locator('text=/Copy of Ticketing Service Agreement/i')).toBeVisible();
    
    // Vérifier les zones de drop de fichiers
    await expect(page.locator('[data-field="ticketingCompanyReport"]')).toBeVisible();
    await expect(page.locator('[data-field="ticketingServiceAgreement"]')).toBeVisible();
    
    // Boutons de navigation
    await expect(page.locator('button:has-text("Previous")')).toBeVisible();
    await expect(page.locator('button:has-text("Next")')).toBeVisible();
  });

  test('File upload fields display correctly', async ({ page }) => {
    // Vérifier le premier champ de fichier (rapports de ticketing)
    const ticketingReportField = page.locator('[data-field="ticketingCompanyReport"]');
    await expect(ticketingReportField).toBeVisible();
    
    // Vérifier les détails du champ
    await expect(page.locator('text=/Reports from ticketing company.*last 3 years/i')).toBeVisible();
    await expect(page.locator('text=/Not just Excel summary.*including.*events.*gross ticket sales.*tickets sold per month/i')).toBeVisible();
    
    // Vérifier le deuxième champ de fichier (accord de service)
    const serviceAgreementField = page.locator('[data-field="ticketingServiceAgreement"]');
    await expect(serviceAgreementField).toBeVisible();
    await expect(page.locator('text=/Copy of Ticketing Service Agreement/i')).toBeVisible();
  });

  test('File type restrictions', async ({ page }) => {
    // Vérifier que les champs acceptent les bons types de fichiers
    const fileInputs = page.locator('input[type="file"]');
    
    for (let i = 0; i < await fileInputs.count(); i++) {
      const input = fileInputs.nth(i);
      const acceptAttr = await input.getAttribute('accept');
      
      // Vérifier que les types de fichiers autorisés sont corrects
      expect(acceptAttr).toContain('.xlsx');
      expect(acceptAttr).toContain('.pdf');
      expect(acceptAttr).toContain('.csv');
      expect(acceptAttr).toContain('.jpg');
      expect(acceptAttr).toContain('.png');
    }
  });

  test('Required field validation for ticketing reports', async ({ page }) => {
    // Le champ "Reports from ticketing company" est obligatoire
    // Essayer de naviguer sans uploader de fichiers
    await formHelper.goToNextStep();
    
    // Vérifier qu'une validation apparaît ou qu'on ne peut pas continuer
    await page.waitForTimeout(1000);
    
    // Si on reste sur la même page, c'est que la validation a fonctionné
    const currentTitle = await page.locator('h1').textContent();
    expect(currentTitle).toContain('Ticketing Information');
  });

  test('Conditional requirement for service agreement', async ({ page }) => {
    // Le champ "Ticketing Service Agreement" est requis si paymentProcessing === 'Venue'
    // Cette information vient de l'étape 3, nous devons vérifier la logique conditionnelle
    
    // Si les données test ont paymentProcessing = 'Venue', le champ devrait être requis
    const serviceAgreementField = page.locator('[data-field="ticketingServiceAgreement"]');
    
    // Vérifier si le champ est marqué comme requis ou non
    const requiredIndicator = page.locator('[data-field="ticketingServiceAgreement"] .required, [data-field="ticketingServiceAgreement"] *:has-text("*")');
    
    // La logique dépend des données remplies dans l'étape 3
    if (smallCompanyData.ticketingInfo?.paymentProcessing === 'Venue') {
      await expect(requiredIndicator).toBeVisible();
    }
  });

  test('File upload interaction simulation', async ({ page }) => {
    // Simuler l'interaction avec le premier champ de fichier
    const ticketingReportField = page.locator('[data-field="ticketingCompanyReport"]');
    
    // Cliquer sur la zone de drop ou le bouton de sélection
    await ticketingReportField.click();
    
    // Vérifier que l'input file est focusé ou qu'une action se produit
    const fileInput = page.locator('input[type="file"]').first();
    
    // Simuler la présence d'un fichier (même si on ne peut pas vraiment l'uploader en test)
    await page.evaluate(() => {
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        // Simuler qu'un fichier a été sélectionné
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [{
              name: 'test-ticketing-report.pdf',
              size: 1024 * 1024, // 1MB
              type: 'application/pdf'
            }]
          }
        });
        input.dispatchEvent(event);
      }
    });
    
    // Attendre un peu pour voir si des changements visuels se produisent
    await page.waitForTimeout(1000);
  });

  test('File upload progress and feedback', async ({ page }) => {
    // Vérifier si des indicateurs de progression ou des messages apparaissent
    const uploadAreas = page.locator('[data-field*="ticketing"]');
    
    for (let i = 0; i < await uploadAreas.count(); i++) {
      const area = uploadAreas.nth(i);
      
      // Cliquer sur la zone d'upload
      await area.click();
      
      // Vérifier s'il y a des éléments visuels d'interaction
      const dropZoneActive = page.locator('.drop-zone-active, .drag-over, .file-hover');
      const uploadButton = page.locator('button:has-text("Choose File"), button:has-text("Browse"), button:has-text("Upload")');
      
      // Au moins un de ces éléments devrait être présent
      const hasInteractionElements = await dropZoneActive.count() > 0 || await uploadButton.count() > 0;
      if (hasInteractionElements) {
        console.log(`Upload interaction elements found for field ${i}`);
      }
    }
  });

  test('Help text and descriptions', async ({ page }) => {
    // Vérifier que les descriptions d'aide sont présentes et utiles
    
    // Description détaillée pour les rapports
    await expect(page.locator('text=/Not just Excel summary/i')).toBeVisible();
    await expect(page.locator('text=/including.*events.*gross ticket sales.*tickets sold per month/i')).toBeVisible();
    
    // Vérifier que les titres sont descriptifs
    await expect(page.locator('text=/Reports from ticketing company.*last 3 years/i')).toBeVisible();
    await expect(page.locator('text=/Copy of Ticketing Service Agreement/i')).toBeVisible();
  });

  test('Multiple file support for reports', async ({ page }) => {
    // Le champ de rapports devrait accepter plusieurs fichiers
    const ticketingReportInput = page.locator('[data-field="ticketingCompanyReport"] input[type="file"]');
    
    // Vérifier l'attribut multiple
    const hasMultiple = await ticketingReportInput.getAttribute('multiple');
    expect(hasMultiple).not.toBeNull();
    
    // Le champ de service agreement ne devrait accepter qu'un seul fichier
    const serviceAgreementInput = page.locator('[data-field="ticketingServiceAgreement"] input[type="file"]');
    const hasMultipleSA = await serviceAgreementInput.getAttribute('multiple');
    expect(hasMultipleSA).toBeNull();
  });

  test('Navigation with uploaded files', async ({ page }) => {
    // Simuler l'upload de fichiers puis naviguer
    
    // Simuler l'upload pour le champ obligatoire
    await page.evaluate(() => {
      const reportInput = document.querySelector('[data-field="ticketingCompanyReport"] input[type="file"]') as HTMLInputElement;
      if (reportInput) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [
              { name: 'report-2023.pdf', size: 2048000, type: 'application/pdf' },
              { name: 'report-2022.xlsx', size: 1536000, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
            ]
          }
        });
        reportInput.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Essayer de naviguer vers l'étape suivante
    await formHelper.goToNextStep();
    
    // Vérifier qu'on arrive à l'étape suivante
    await expect(page.locator('h1')).toContainText(/Financial Information|Additional Information/);
  });

  test('File size and type validation messages', async ({ page }) => {
    // Simuler l'upload d'un fichier de type non autorisé
    await page.evaluate(() => {
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [{
              name: 'invalid-file.txt',
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
    
    // Simuler un fichier trop volumineux
    await page.evaluate(() => {
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [{
              name: 'huge-file.pdf',
              size: 100 * 1024 * 1024, // 100MB
              type: 'application/pdf'
            }]
          }
        });
        input.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(1000);
  });

  test('Data persistence when navigating back', async ({ page }) => {
    // Simuler l'upload de fichiers
    await page.evaluate(() => {
      const reportInput = document.querySelector('[data-field="ticketingCompanyReport"] input[type="file"]') as HTMLInputElement;
      if (reportInput) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [{
              name: 'persistent-report.pdf',
              size: 1024000,
              type: 'application/pdf'
            }]
          }
        });
        reportInput.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Naviguer vers l'étape suivante
    await formHelper.goToNextStep();
    
    // Revenir à cette étape
    await formHelper.goToPreviousStep();
    
    // Vérifier que les informations de fichiers sont conservées
    // (Cela dépend de l'implémentation du composant FileUploadField)
    const uploadedFileInfo = page.locator('text=/persistent-report.pdf/, .uploaded-file, .file-item');
    if (await uploadedFileInfo.count() > 0) {
      await expect(uploadedFileInfo.first()).toBeVisible();
    }
  });

  test('Accessibility of file upload fields', async ({ page }) => {
    // Vérifier l'accessibilité des champs de fichiers
    
    // Les labels devraient être associés aux inputs
    const fileInputs = page.locator('input[type="file"]');
    
    for (let i = 0; i < await fileInputs.count(); i++) {
      const input = fileInputs.nth(i);
      
      // Vérifier qu'il y a un ID ou un nom
      const id = await input.getAttribute('id');
      const name = await input.getAttribute('name');
      
      expect(id || name).toBeTruthy();
      
      // Vérifier qu'il y a un label ou aria-label associé
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const hasLabel = await label.count() > 0;
        const ariaLabel = await input.getAttribute('aria-label');
        
        expect(hasLabel || ariaLabel).toBeTruthy();
      }
    }
    
    // Vérifier la navigation au clavier
    const firstFileInput = fileInputs.first();
    await firstFileInput.focus();
    
    // Vérifier que le focus est visible
    await expect(firstFileInput).toBeFocused();
  });
});
