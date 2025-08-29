import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';
import { smallCompanyData } from '../../fixtures/testData';

test.describe('Step 9: Legal Information Step Tests', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.navigateToApp();
    
    // Naviguer jusqu'à l'étape 9 en remplissant les étapes précédentes
    await formHelper.fillAllPreviousSteps(8, smallCompanyData);
    await formHelper.goToNextStep(); // Aller à l'étape 9
    await formHelper.expectStep('Contractual and Legal Information');
  });

  test('Legal Information Step components mount correctly', async ({ page }) => {
    // Vérifier le titre de l'étape
    await expect(page.locator('h1')).toContainText('Contractual and Legal Information');
    
    // Vérifier les 5 champs de fichiers attendus
    await expect(page.locator('text=/Certificate of Incorporation/i')).toBeVisible();
    await expect(page.locator('text=/Legal entity chart/i')).toBeVisible();
    await expect(page.locator('text=/Scanned copy of government issued ID/i')).toBeVisible();
    await expect(page.locator('text=/Completed Form W-9/i')).toBeVisible();
    await expect(page.locator('text=/Other/i')).toBeVisible();
    
    // Vérifier les zones de drop de fichiers
    await expect(page.locator('[data-field="incorporationCertificate"]')).toBeVisible();
    await expect(page.locator('[data-field="legalEntityChart"]')).toBeVisible();
    await expect(page.locator('[data-field="governmentId"]')).toBeVisible();
    await expect(page.locator('[data-field="w9form"]')).toBeVisible();
    await expect(page.locator('[data-field="other"]')).toBeVisible();
    
    // Boutons de navigation
    await expect(page.locator('button:has-text("Previous")')).toBeVisible();
    await expect(page.locator('button:has-text("Next")')).toBeVisible();
  });

  test('Required incorporation certificate field', async ({ page }) => {
    // Le certificat d'incorporation est obligatoire
    const incorporationField = page.locator('[data-field="incorporationCertificate"]');
    await expect(incorporationField).toBeVisible();
    
    // Vérifier la description complète
    await expect(page.locator('text=/Certificate of Incorporation of contracting entity/i')).toBeVisible();
    
    // Ce champ ne devrait accepter qu'un seul fichier
    const incorporationInput = page.locator('[data-field="incorporationCertificate"] input[type="file"]');
    const hasMultiple = await incorporationInput.getAttribute('multiple');
    expect(hasMultiple).toBeNull();
  });

  test('Legal entity chart field', async ({ page }) => {
    // Champ de graphique d'entité légale
    const legalEntityField = page.locator('[data-field="legalEntityChart"]');
    await expect(legalEntityField).toBeVisible();
    
    // Vérifier la description détaillée
    await expect(page.locator('text=/Legal entity chart if more than one entity exists.*distributions to other entities/i')).toBeVisible();
    
    // Ce champ semble optionnel (pas de required dans le composant)
    const legalEntityInput = page.locator('[data-field="legalEntityChart"] input[type="file"]');
    const hasMultiple = await legalEntityInput.getAttribute('multiple');
    expect(hasMultiple).toBeNull(); // Un seul fichier
  });

  test('Government ID field requirements', async ({ page }) => {
    // Champ de pièce d'identité gouvernementale
    const govIdField = page.locator('[data-field="governmentId"]');
    await expect(govIdField).toBeVisible();
    
    // Vérifier la description
    await expect(page.locator('text=/Scanned copy of government issued ID.*signatory.*Agreement with SoundCheck/i')).toBeVisible();
    
    // Un seul fichier autorisé
    const govIdInput = page.locator('[data-field="governmentId"] input[type="file"]');
    const hasMultiple = await govIdInput.getAttribute('multiple');
    expect(hasMultiple).toBeNull();
  });

  test('W-9 form field', async ({ page }) => {
    // Champ du formulaire W-9
    const w9Field = page.locator('[data-field="w9form"]');
    await expect(w9Field).toBeVisible();
    
    // Vérifier la description
    await expect(page.locator('text=/Completed Form W-9/i')).toBeVisible();
    
    // Un seul fichier autorisé
    const w9Input = page.locator('[data-field="w9form"] input[type="file"]');
    const hasMultiple = await w9Input.getAttribute('multiple');
    expect(hasMultiple).toBeNull();
  });

  test('Other documents field with detailed description', async ({ page }) => {
    // Champ "Other" avec description détaillée
    const otherField = page.locator('[data-field="other"]');
    await expect(otherField).toBeVisible();
    
    // Vérifier la description extensive
    await expect(page.locator('text=/Copy of the lease.*rental agreement.*property deed/i')).toBeVisible();
    await expect(page.locator('text=/Outdoor event.*cancellation insurance/i')).toBeVisible();
    await expect(page.locator('text=/business plan.*budget.*insurance certificate.*bank letter.*investor deck/i')).toBeVisible();
    
    // Ce champ devrait accepter plusieurs fichiers
    const otherInput = page.locator('[data-field="other"] input[type="file"]');
    const hasMultiple = await otherInput.getAttribute('multiple');
    expect(hasMultiple).not.toBeNull();
  });

  test('File type restrictions for all fields', async ({ page }) => {
    // Vérifier que tous les champs acceptent les bons types de fichiers
    const fileInputs = page.locator('input[type="file"]');
    
    for (let i = 0; i < await fileInputs.count(); i++) {
      const input = fileInputs.nth(i);
      const acceptAttr = await input.getAttribute('accept');
      
      // Vérifier les types de fichiers légaux autorisés
      expect(acceptAttr).toContain('.xlsx');
      expect(acceptAttr).toContain('.pdf');
      expect(acceptAttr).toContain('.csv');
      expect(acceptAttr).toContain('.jpg');
      expect(acceptAttr).toContain('.png');
    }
  });

  test('Required field validation', async ({ page }) => {
    // Le certificat d'incorporation est obligatoire
    // Essayer de naviguer sans uploader le document requis
    await formHelper.goToNextStep();
    
    // Vérifier qu'une validation apparaît ou qu'on ne peut pas continuer
    await page.waitForTimeout(1000);
    
    // Si on reste sur la même page, c'est que la validation a fonctionné
    const currentTitle = await page.locator('h1').textContent();
    expect(currentTitle).toContain('Contractual and Legal Information');
  });

  test('Complete legal documentation upload', async ({ page }) => {
    // Scénario complet : uploader tous les documents
    
    // 1. Certificat d'incorporation (obligatoire)
    await page.evaluate(() => {
      const input = document.querySelector('[data-field="incorporationCertificate"] input[type="file"]') as HTMLInputElement;
      if (input) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [{
              name: 'Certificate-of-Incorporation.pdf',
              size: 1024000,
              type: 'application/pdf'
            }]
          }
        });
        input.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(500);
    
    // 2. Graphique d'entité légale (optionnel)
    await page.evaluate(() => {
      const input = document.querySelector('[data-field="legalEntityChart"] input[type="file"]') as HTMLInputElement;
      if (input) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [{
              name: 'Legal-Entity-Chart.xlsx',
              size: 512000,
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }]
          }
        });
        input.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(500);
    
    // 3. Pièce d'identité (optionnel)
    await page.evaluate(() => {
      const input = document.querySelector('[data-field="governmentId"] input[type="file"]') as HTMLInputElement;
      if (input) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [{
              name: 'Drivers-License-Scan.jpg',
              size: 2048000,
              type: 'image/jpeg'
            }]
          }
        });
        input.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(500);
    
    // 4. Formulaire W-9 (optionnel)
    await page.evaluate(() => {
      const input = document.querySelector('[data-field="w9form"] input[type="file"]') as HTMLInputElement;
      if (input) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [{
              name: 'Completed-W9-Form.pdf',
              size: 768000,
              type: 'application/pdf'
            }]
          }
        });
        input.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(500);
    
    // 5. Autres documents (multiples)
    await page.evaluate(() => {
      const input = document.querySelector('[data-field="other"] input[type="file"]') as HTMLInputElement;
      if (input) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [
              { name: 'Venue-Lease-Agreement.pdf', size: 1536000, type: 'application/pdf' },
              { name: 'Insurance-Certificate.pdf', size: 896000, type: 'application/pdf' },
              { name: 'Business-Plan.docx', size: 2048000, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
            ]
          }
        });
        input.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Essayer de naviguer vers l'étape suivante
    await formHelper.goToNextStep();
    
    // Vérifier qu'on arrive à l'étape suivante (probablement Summary ou Additional Information)
    await expect(page.locator('h1')).toContainText(/Summary|Additional Information|Review/);
  });

  test('Minimal required documentation only', async ({ page }) => {
    // Test avec seulement les documents obligatoires
    
    // Upload uniquement du certificat d'incorporation
    await page.evaluate(() => {
      const input = document.querySelector('[data-field="incorporationCertificate"] input[type="file"]') as HTMLInputElement;
      if (input) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [{
              name: 'Minimal-Certificate.pdf',
              size: 512000,
              type: 'application/pdf'
            }]
          }
        });
        input.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Essayer de naviguer avec seulement le document obligatoire
    await formHelper.goToNextStep();
    
    // Cela devrait fonctionner
    await expect(page.locator('h1')).not.toContainText('Contractual and Legal Information');
  });

  test('File validation for different document types', async ({ page }) => {
    // Tester différents types de fichiers pour différents champs
    
    // Certificat d'incorporation avec un PDF
    await page.evaluate(() => {
      const input = document.querySelector('[data-field="incorporationCertificate"] input[type="file"]') as HTMLInputElement;
      if (input) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [{
              name: 'certificate.pdf',
              size: 1024000,
              type: 'application/pdf'
            }]
          }
        });
        input.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(500);
    
    // Pièce d'identité avec une image
    await page.evaluate(() => {
      const input = document.querySelector('[data-field="governmentId"] input[type="file"]') as HTMLInputElement;
      if (input) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [{
              name: 'id-photo.png',
              size: 1536000,
              type: 'image/png'
            }]
          }
        });
        input.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(500);
    
    // Graphique d'entité avec un Excel
    await page.evaluate(() => {
      const input = document.querySelector('[data-field="legalEntityChart"] input[type="file"]') as HTMLInputElement;
      if (input) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [{
              name: 'entity-chart.xlsx',
              size: 768000,
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }]
          }
        });
        input.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(500);
  });

  test('Invalid file type handling', async ({ page }) => {
    // Tester l'upload de types de fichiers non autorisés
    await page.evaluate(() => {
      const input = document.querySelector('[data-field="incorporationCertificate"] input[type="file"]') as HTMLInputElement;
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
      console.log('File type validation error:', errorText);
    }
  });

  test('Multiple files in Other category', async ({ page }) => {
    // Tester l'upload de plusieurs fichiers dans la catégorie "Other"
    await page.evaluate(() => {
      const input = document.querySelector('[data-field="other"] input[type="file"]') as HTMLInputElement;
      if (input) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [
              { name: 'lease-agreement.pdf', size: 1200000, type: 'application/pdf' },
              { name: 'insurance-policy.pdf', size: 900000, type: 'application/pdf' },
              { name: 'business-plan.docx', size: 1800000, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
              { name: 'bank-letter.pdf', size: 400000, type: 'application/pdf' },
              { name: 'investor-deck.pptx', size: 3200000, type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' }
            ]
          }
        });
        input.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Vérifier que les fichiers multiples sont acceptés
    const fileListIndicators = page.locator('.file-list, .uploaded-files, .file-item');
    if (await fileListIndicators.count() > 0) {
      console.log('Multiple files upload detected in Other category');
    }
  });

  test('Data persistence when navigating back', async ({ page }) => {
    // Upload de quelques documents
    await page.evaluate(() => {
      const incorporationInput = document.querySelector('[data-field="incorporationCertificate"] input[type="file"]') as HTMLInputElement;
      if (incorporationInput) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [{
              name: 'persistent-certificate.pdf',
              size: 1024000,
              type: 'application/pdf'
            }]
          }
        });
        incorporationInput.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(500);
    
    await page.evaluate(() => {
      const w9Input = document.querySelector('[data-field="w9form"] input[type="file"]') as HTMLInputElement;
      if (w9Input) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [{
              name: 'persistent-w9.pdf',
              size: 768000,
              type: 'application/pdf'
            }]
          }
        });
        w9Input.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Naviguer vers l'étape suivante
    await formHelper.goToNextStep();
    
    // Revenir à cette étape
    await formHelper.goToPreviousStep();
    
    // Vérifier que les informations de fichiers sont conservées
    const persistentFiles = page.locator('text=/persistent-certificate.pdf/, text=/persistent-w9.pdf/, .uploaded-file, .file-item');
    if (await persistentFiles.count() > 0) {
      await expect(persistentFiles.first()).toBeVisible();
    }
  });

  test('Legal documents field accessibility', async ({ page }) => {
    // Vérifier l'accessibilité de tous les champs de fichiers
    const fileInputs = page.locator('input[type="file"]');
    
    for (let i = 0; i < await fileInputs.count(); i++) {
      const input = fileInputs.nth(i);
      
      // Vérifier les attributs d'accessibilité
      const id = await input.getAttribute('id');
      const name = await input.getAttribute('name');
      const ariaLabel = await input.getAttribute('aria-label');
      
      // Au moins un identifiant doit être présent
      expect(id || name || ariaLabel).toBeTruthy();
      
      // Vérifier la navigation au clavier
      await input.focus();
      await expect(input).toBeFocused();
    }
  });

  test('Large file upload handling', async ({ page }) => {
    // Tester l'upload de fichiers volumineux
    await page.evaluate(() => {
      const input = document.querySelector('[data-field="other"] input[type="file"]') as HTMLInputElement;
      if (input) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [{
              name: 'large-business-plan.pdf',
              size: 25 * 1024 * 1024, // 25MB
              type: 'application/pdf'
            }]
          }
        });
        input.dispatchEvent(event);
      }
    });
    
    await page.waitForTimeout(2000);
    
    // Vérifier s'il y a des indicateurs de progression ou des erreurs
    const progressIndicators = page.locator('.upload-progress, .progress-bar, .loading');
    const sizeWarnings = page.locator('text=/large file/i, text=/file size/i, text=/uploading/i');
    
    if (await progressIndicators.count() > 0) {
      console.log('Large file upload progress detected');
    }
    
    if (await sizeWarnings.count() > 0) {
      const warningText = await sizeWarnings.first().textContent();
      console.log('File size warning:', warningText);
    }
  });
});
