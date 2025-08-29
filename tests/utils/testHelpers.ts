import { Page, expect } from '@playwright/test';
import { TestFormData } from '../fixtures/testData';

export class FormHelper {
  constructor(private page: Page) {}

  // Navigation vers l'application avec mot de passe
  async navigateToApp() {
    await this.page.goto('/');
    
    // Entrer le mot de passe si nécessaire
    const passwordInput = this.page.locator('input[type="password"]');
    if (await passwordInput.isVisible()) {
      await passwordInput.fill('123456'); // Utilise le mot de passe de votre .env
      await this.page.locator('button[type="submit"]').click();
    }
    
    // Attendre que l'application soit chargée
    await expect(this.page.locator('h1')).toContainText('Get Funding', { timeout: 10000 });
  }

  // Remplir l'étape d'information personnelle
  async fillPersonalInfo(data: TestFormData['personalInfo']) {
    await this.page.fill('input[name="firstname"]', data.firstname);
    await this.page.fill('input[name="lastname"]', data.lastname);
    await this.page.fill('input[name="email"]', data.email);
    await this.page.fill('input[name="emailConfirm"]', data.emailConfirm);
    await this.page.fill('input[name="phone"]', data.phone);
    await this.page.selectOption('select[name="role"]', data.role);
  }

  // Remplir l'étape d'information de l'entreprise
  async fillCompanyInfo(data: TestFormData['companyInfo']) {
    await this.page.fill('input[name="name"]', data.name);
    await this.page.fill('input[name="dba"]', data.dba);
    await this.page.selectOption('select[name="clientType"]', data.clientType);
    await this.page.selectOption('select[name="businessType"]', data.businessType);
    await this.page.fill('input[name="yearsInBusiness"]', data.yearsInBusiness);
    await this.page.fill('input[name="ein"]', data.ein);
    await this.page.fill('input[name="companyAddress"]', data.companyAddress);
    await this.page.fill('input[name="companyCity"]', data.companyCity);
    await this.page.selectOption('select[name="companyState"]', data.companyState);
    await this.page.fill('input[name="companyZipcode"]', data.companyZipcode);
    await this.page.selectOption('select[name="stateOfIncorporation"]', data.stateOfIncorporation);
    await this.page.fill('input[name="employees"]', data.employees.toString());
    await this.page.fill('input[name="socials"]', data.socials);
    await this.page.selectOption('select[name="memberOf"]', data.memberOf);
  }

  // Remplir l'étape de ticketing
  async fillTicketingInfo(data: TestFormData['ticketingInfo']) {
    await this.page.selectOption('select[name="currentPartner"]', data.currentPartner);
    await this.page.selectOption('select[name="settlementPayout"]', data.settlementPayout);
    await this.page.selectOption('select[name="paymentProcessing"]', data.paymentProcessing);
  }

  // Remplir l'étape de volume
  async fillVolumeInfo(data: TestFormData['volumeInfo']) {
    await this.page.fill('input[name="lastYearEvents"]', data.lastYearEvents.toString());
    await this.page.fill('input[name="lastYearTickets"]', data.lastYearTickets.toString());
    await this.page.fill('input[name="lastYearSales"]', data.lastYearSales.toString());
    await this.page.fill('input[name="nextYearEvents"]', data.nextYearEvents.toString());
    await this.page.fill('input[name="nextYearTickets"]', data.nextYearTickets.toString());
    await this.page.fill('input[name="nextYearSales"]', data.nextYearSales.toString());
  }

  // Remplir l'étape de financement (YourFundsStep)
  async fillFundsInfo(data: TestFormData['fundsInfo']) {
    // Remplir le montant de financement (CurrencyField)
    await this.page.fill('input[name="yourFunds"]', data.yourFunds);
    
    // Sélectionner le timing
    await this.page.selectOption('select[name="timingOfFunding"]', data.timingOfFunding);
    
    // Sélectionner l'utilisation des fonds
    await this.page.selectOption('select[name="useOfProceeds"]', data.useOfProceeds);
  }

  // Remplir l'étape d'ownership avec propriétaires multiples
  async fillOwnershipInfo(data: TestFormData['ownershipInfo']) {
    const owners = data.owners;
    
    for (let i = 0; i < owners.length; i++) {
      const owner = owners[i];
      
      // Si ce n'est pas le premier propriétaire, ajouter un nouveau propriétaire
      if (i > 0) {
        await this.page.click('button:has-text("Add Owner")');
        await this.page.waitForTimeout(500);
      }
      
      // Remplir les informations du propriétaire (utiliser les noms corrects des champs)
      await this.page.fill(`input[name="owner${i}Name"]`, owner.ownerName);
      await this.page.fill(`input[name="owner${i}Percentage"]`, owner.ownershipPercentage);
      await this.page.fill(`input[name="owner${i}Address"]`, owner.ownerAddress);
      await this.page.fill(`input[name="owner${i}BirthDate"]`, owner.ownerBirthDate);
    }
  }

  // Remplir l'étape finances (questions oui/non progressives)
  async fillFinancesInfo(data: TestFormData['financesInfo']) {
    const questions = [
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
    
    // Répondre aux questions dans l'ordre (système progressif)
    for (const question of questions) {
      if (data[question] !== undefined) {
        // Attendre que la question soit visible
        await expect(this.page.locator(`input[name="${question}"]`)).toBeVisible({ timeout: 3000 });
        
        // Répondre à la question
        await this.page.check(`input[name="${question}"][value="${data[question]}"]`);
        await this.page.waitForTimeout(400); // Attendre l'animation
        
        // Gérer les champs conditionnels
        if (question === 'hasBusinessDebt' && data[question] === true && data.debts) {
          await this.page.waitForTimeout(500);
          for (let i = 0; i < data.debts.length; i++) {
            const debt = data.debts[i];
            if (i > 0) {
              // Ajouter une nouvelle dette si nécessaire
              const addDebtButton = this.page.locator('button:has-text("Add Debt")');
              if (await addDebtButton.isVisible()) {
                await addDebtButton.click();
                await this.page.waitForTimeout(300);
              }
            }
            await this.page.selectOption(`select[name*="debtType"]`, debt.type);
            await this.page.fill(`input[name*="debtBalance"]`, debt.balance);
          }
        }
        
        if (question === 'isLeasingLocation' && data[question] === true && data.leaseEndDate) {
          await this.page.waitForTimeout(500);
          await this.page.fill('input[name="leaseEndDate"]', data.leaseEndDate);
        }
      }
    }
    
    // Champs additionnels (étape OtherStep)
    if (data.industryReferences) {
      await this.page.fill('textarea[name="industryReferences"]', data.industryReferences);
    }
    if (data.additionalComments) {
      await this.page.fill('textarea[name="additionalComments"]', data.additionalComments);
    }
  }

  // Vérifier qu'un champ spécifique est visible et a les bonnes propriétés
  async expectFieldToBeVisible(fieldSelector: string, fieldName: string) {
    const field = this.page.locator(fieldSelector);
    await expect(field).toBeVisible({ timeout: 5000 });
    return field;
  }

  // Vérifier qu'un champ obligatoire a l'attribut required
  async expectFieldToBeRequired(fieldSelector: string) {
    await expect(this.page.locator(fieldSelector)).toHaveAttribute('required');
  }

  // Vérifier qu'une étape a tous ses champs obligatoires
  async validateStepRequiredFields(requiredFields: string[]) {
    for (const field of requiredFields) {
      await this.expectFieldToBeRequired(field);
    }
  }

  // Vérifier le numéro d'étape actuel dans l'URL ou l'état
  async expectCurrentStepNumber(stepNumber: number) {
    // Cette méthode peut être adaptée selon votre implémentation
    // Par exemple, vérifier l'URL, un attribut data, ou un état visible
    await expect(this.page.locator(`[data-step="${stepNumber}"]`)).toBeVisible();
  }

  // Naviguer vers l'étape suivante
  async goToNextStep() {
    await this.page.click('button:has-text("Next")');
    await this.page.waitForTimeout(500); // Attendre l'animation
  }

  // Naviguer vers l'étape précédente
  async goToPreviousStep() {
    await this.page.click('button:has-text("Previous")');
    await this.page.waitForTimeout(500);
  }

  // Vérifier qu'on est sur une étape spécifique
  async expectStep(stepTitle: string) {
    await expect(this.page.locator('h1')).toContainText(stepTitle);
  }

  // Uploader un fichier de test
  async uploadTestFile(fieldName: string, fileName: string = 'test-document.pdf') {
    const fileInput = this.page.locator(`input[type="file"][data-field="${fieldName}"]`);
    
    // Créer un fichier de test temporaire
    const testFileContent = Buffer.from('Test PDF content for testing purposes');
    
    await fileInput.setInputFiles({
      name: fileName,
      mimeType: 'application/pdf',
      buffer: testFileContent,
    });
  }

  // Intercepter les appels API
  async mockApiCalls() {
    // Mock pour l'envoi des données
    await this.page.route('**/hook.us1.make.com/wlownr9iuqvu6gujuonmyhaix5ids7my', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Data submitted successfully' })
      });
    });

    // Mock pour l'envoi des fichiers
    await this.page.route('**/hook.us1.make.com/xb8xxsf5qo48ox03jkxc42shojhu2sml', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'File uploaded successfully' })
      });
    });
  }

  // Attendre que la progress bar soit à un certain pourcentage
  async waitForProgress(percentage: number) {
    await expect(this.page.locator('.bg-gradient-to-r')).toHaveCSS('width', `${percentage}%`);
  }

  // Helper pour remplir toutes les étapes précédentes jusqu'à une étape donnée
  async fillAllPreviousSteps(targetStep: number, data: TestFormData) {
    // Étape 1: Personal Info
    if (targetStep >= 1) {
      await this.fillPersonalInfo(data.personalInfo);
      if (targetStep > 1) await this.goToNextStep();
    }

    // Étape 2: Company Info
    if (targetStep >= 2) {
      await this.fillCompanyInfo(data.companyInfo);
      if (targetStep > 2) await this.goToNextStep();
    }

    // Étape 3: Ticketing + Volume
    if (targetStep >= 3) {
      await this.fillTicketingInfo(data.ticketingInfo);
      await this.fillVolumeInfo(data.volumeInfo);
      if (targetStep > 3) await this.goToNextStep();
    }

    // Étape 4: Your Funds
    if (targetStep >= 4) {
      await this.fillFundsInfo(data.fundsInfo);
      if (targetStep > 4) await this.goToNextStep();
    }

    // Étape 5: Ownership
    if (targetStep >= 5) {
      await this.fillOwnershipInfo(data.ownershipInfo);
      if (targetStep > 5) await this.goToNextStep();
    }

    // Étape 6: Finances
    if (targetStep >= 6) {
      await this.fillFinancesInfo(data.financesInfo);
      if (targetStep > 6) await this.goToNextStep();
    }

    // Étape 7: Ticketing Information (upload)
    if (targetStep >= 7) {
      // Les uploads de fichiers sont simulés dans les tests
      if (targetStep > 7) await this.goToNextStep();
    }

    // Étape 8: Financial Information (upload)
    if (targetStep >= 8) {
      // Les uploads de fichiers sont simulés dans les tests
      if (targetStep > 8) await this.goToNextStep();
    }

    // Étape 9: Legal Information (upload)
    if (targetStep >= 9) {
      // Les uploads de fichiers sont simulés dans les tests
      if (targetStep > 9) await this.goToNextStep();
    }

    // Étape 10: Additional Information (OtherStep)
    if (targetStep >= 10) {
      await this.fillAdditionalInfo(data.financesInfo);
      if (targetStep > 10) await this.goToNextStep();
    }
  }

  // Remplir l'étape Additional Information (OtherStep)
  async fillAdditionalInfo(data: TestFormData['financesInfo']) {
    if (data.industryReferences) {
      await this.page.fill('textarea[name="industryReferences"]', data.industryReferences);
    }
    if (data.additionalComments) {
      await this.page.fill('textarea[name="additionalComments"]', data.additionalComments);
    }
  }

  // Simuler l'upload de fichiers pour les étapes d'upload
  async simulateFileUpload(fieldName: string, fileName: string, fileType: string = 'application/pdf', fileSize: number = 1024000) {
    await this.page.evaluate(({ fieldName, fileName, fileType, fileSize }) => {
      const input = document.querySelector(`[data-field="${fieldName}"] input[type="file"]`) as HTMLInputElement;
      if (input) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', {
          value: {
            files: [{
              name: fileName,
              size: fileSize,
              type: fileType
            }]
          }
        });
        input.dispatchEvent(event);
      }
    }, { fieldName, fileName, fileType, fileSize });
    
    await this.page.waitForTimeout(500);
  }

  // Simuler les uploads obligatoires pour une étape donnée
  async simulateRequiredUploads(stepNumber: number) {
    switch (stepNumber) {
      case 7: // Ticketing Information
        await this.simulateFileUpload('ticketingCompanyReport', 'ticketing-reports.pdf');
        // ticketingServiceAgreement est conditionnel
        break;
      
      case 8: // Financial Information
        await this.simulateFileUpload('financialStatements', 'financial-statements.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        // bankStatement est optionnel
        break;
      
      case 9: // Legal Information
        await this.simulateFileUpload('incorporationCertificate', 'certificate-of-incorporation.pdf');
        // Les autres sont optionnels
        break;
    }
  }
}
