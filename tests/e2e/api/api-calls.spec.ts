import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';
import { testDataSets } from '../../fixtures/testData';

test.describe('API Calls Tests', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.navigateToApp();
  });

  // Tests pour chaque jeu de données
  for (const testSet of testDataSets) {
    test(`Form submission API call - ${testSet.name}`, async ({ page }) => {
      // Variables pour capturer les requêtes
      let formDataSubmitted = false;
      let submittedData: any = null;

      // Intercepter l'appel API pour la soumission du formulaire
      await page.route('**/hook.us1.make.com/wlownr9iuqvu6gujuonmyhaix5ids7my', async route => {
        const request = route.request();
        submittedData = await request.postDataJSON();
        formDataSubmitted = true;
        
        // Simuler une réponse de succès
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ 
            success: true, 
            message: 'Application submitted successfully',
            id: '12345'
          })
        });
      });

      // Remplir le formulaire avec les données de test
      await formHelper.fillPersonalInfo(testSet.data.personalInfo);
      await formHelper.goToNextStep();

      await formHelper.fillCompanyInfo(testSet.data.companyInfo);
      await formHelper.goToNextStep();

      await formHelper.fillTicketingInfo(testSet.data.ticketingInfo);
      await formHelper.goToNextStep();

      await formHelper.fillFundsInfo(testSet.data.fundsInfo);
      await formHelper.goToNextStep();

      // Remplir rapidement les autres étapes (ownership, finances, etc.)
      // Ici on peut soit simuler soit avoir des données par défaut
      
      // Naviguer vers le summary et soumettre
      // (Cette partie dépend de votre implémentation exacte)
      
      // Vérifier que l'API a été appelée
      expect(formDataSubmitted).toBe(true);
      
      // Vérifier le contenu des données soumises
      expect(submittedData).toBeDefined();
      expect(submittedData.contact.firstname).toBe(testSet.data.personalInfo.firstname);
      expect(submittedData.contact.email).toBe(testSet.data.personalInfo.email);
      expect(submittedData.company.name).toBe(testSet.data.companyInfo.name);
      expect(submittedData.deal.purchasePrice).toBe(testSet.data.fundsInfo.yourFunds);
    });
  }

  test('File upload API calls', async ({ page }) => {
    let fileUploaded = false;
    let uploadedFileData: any = null;

    // Intercepter l'appel API pour l'upload de fichiers
    await page.route('**/hook.us1.make.com/xb8xxsf5qo48ox03jkxc42shojhu2sml', async route => {
      const request = route.request();
      uploadedFileData = {
        method: request.method(),
        headers: request.headers(),
        url: request.url()
      };
      fileUploaded = true;
      
      // Simuler une réponse de succès
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: true, 
          message: 'File uploaded successfully',
          fileId: 'file_12345'
        })
      });
    });

    // Naviguer vers une étape avec upload de fichier
    // (Adapter selon votre structure exacte)
    
    // Simuler l'upload d'un fichier
    await formHelper.uploadTestFile('ticketingCompanyReport', 'test-report.pdf');
    
    // Attendre que l'upload se termine
    await page.waitForTimeout(2000);
    
    // Vérifier que l'API d'upload a été appelée
    expect(fileUploaded).toBe(true);
    expect(uploadedFileData.method).toBe('POST');
    expect(uploadedFileData.url).toContain('xb8xxsf5qo48ox03jkxc42shojhu2sml');
  });

  test('API error handling - Form submission failure', async ({ page }) => {
    // Intercepter l'appel API pour simuler une erreur
    await page.route('**/hook.us1.make.com/wlownr9iuqvu6gujuonmyhaix5ids7my', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: false, 
          error: 'Internal server error'
        })
      });
    });

    // Remplir le formulaire rapidement
    await formHelper.fillPersonalInfo(testDataSets[0].data.personalInfo);
    // ... remplir les autres étapes
    
    // Tenter de soumettre
    // await page.click('button:has-text("Submit")');
    
    // Vérifier qu'un message d'erreur est affiché
    await expect(page.locator('text=Failed to submit')).toBeVisible();
  });

  test('API error handling - File upload failure', async ({ page }) => {
    // Intercepter l'appel API pour simuler une erreur d'upload
    await page.route('**/hook.us1.make.com/xb8xxsf5qo48ox03jkxc42shojhu2sml', route => {
      route.fulfill({
        status: 413,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: false, 
          error: 'File too large'
        })
      });
    });

    // Tenter d'uploader un fichier
    await formHelper.uploadTestFile('ticketingCompanyReport', 'large-file.pdf');
    
    // Attendre et vérifier qu'un message d'erreur est affiché
    await expect(page.locator('text=Upload failed')).toBeVisible();
  });

  test('Environment variables are correctly used in API calls', async ({ page }) => {
    let capturedRequest: any = null;

    // Capturer la requête pour vérifier les paramètres
    await page.route('**/hook.us1.make.com/**', async route => {
      const request = route.request();
      capturedRequest = {
        url: request.url(),
        method: request.method(),
        postData: await request.postData()
      };
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    // Déclencher un appel API (par exemple un upload)
    await formHelper.uploadTestFile('ticketingCompanyReport');
    
    // Vérifier que l'URL correspond à celle configurée
    expect(capturedRequest?.url).toContain('hook.us1.make.com');
    
    // Vérifier que les paramètres HubSpot sont inclus
    if (capturedRequest?.postData) {
      expect(capturedRequest.postData).toContain('hubspotCompanyId');
      expect(capturedRequest.postData).toContain('hubspotDealId');
      expect(capturedRequest.postData).toContain('hubspotContactId');
    }
  });

  test('Multiple file uploads are handled correctly', async ({ page }) => {
    const uploadedFiles: string[] = [];

    // Intercepter tous les uploads
    await page.route('**/hook.us1.make.com/xb8xxsf5qo48ox03jkxc42shojhu2sml', async route => {
      const request = route.request();
      const postData = await request.postData();
      
      if (postData?.includes('fieldName')) {
        // Extraire le nom du champ depuis les données POST
        const fieldMatch = postData.match(/name="fieldName"\r?\n\r?\n([^\\r\\n]+)/);
        if (fieldMatch) {
          uploadedFiles.push(fieldMatch[1]);
        }
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    // Uploader plusieurs fichiers
    await formHelper.uploadTestFile('ticketingCompanyReport', 'report1.pdf');
    await formHelper.uploadTestFile('financialStatements', 'statements.pdf');
    await formHelper.uploadTestFile('bankStatement', 'bank.pdf');
    
    // Attendre que tous les uploads se terminent
    await page.waitForTimeout(3000);
    
    // Vérifier que tous les fichiers ont été uploadés
    expect(uploadedFiles).toContain('ticketingCompanyReport');
    expect(uploadedFiles).toContain('financialStatements');
    expect(uploadedFiles).toContain('bankStatement');
  });
});
