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
    await expect(this.page.locator('h1')).toContainText('Get Funding');
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

  // Remplir l'étape de financement
  async fillFundsInfo(data: TestFormData['fundsInfo']) {
    await this.page.fill('input[name="yourFunds"]', data.yourFunds);
    await this.page.selectOption('select[name="useOfProceeds"]', data.useOfProceeds);
    await this.page.selectOption('select[name="timingOfFunding"]', data.timingOfFunding);
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
}
