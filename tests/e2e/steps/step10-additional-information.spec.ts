import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';
import { smallCompanyData } from '../../fixtures/testData';

test.describe('Step 10: Additional Information Step Tests', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.navigateToApp();
    
    // Naviguer jusqu'à l'étape 10 (Additional Information / OtherStep)
    await formHelper.fillAllPreviousSteps(9, smallCompanyData);
    await formHelper.goToNextStep(); // Aller à l'étape 10
    await formHelper.expectStep('Additional Information');
  });

  test('Additional Information Step components mount correctly', async ({ page }) => {
    // Vérifier le titre de l'étape
    await expect(page.locator('h1')).toContainText('Additional Information');
    
    // Vérifier le texte d'explication
    await expect(page.locator('text=/Please provide any additional information.*helpful for our review process/i')).toBeVisible();
    
    // Vérifier les deux champs TextArea obligatoires
    await formHelper.expectFieldToBeVisible('textarea[name="industryReferences"]', 'Industry References');
    await formHelper.expectFieldToBeVisible('textarea[name="additionalComments"]', 'Additional Comments');
    
    // Vérifier les labels
    await expect(page.locator('text=/Industry References/i')).toBeVisible();
    await expect(page.locator('text=/Additional Comments/i')).toBeVisible();
    
    // Boutons de navigation
    await expect(page.locator('button:has-text("Previous")')).toBeVisible();
    await expect(page.locator('button:has-text("Next")')).toBeVisible();
  });

  test('Required fields validation', async ({ page }) => {
    const requiredFields = [
      'textarea[name="industryReferences"]',
      'textarea[name="additionalComments"]'
    ];

    // Vérifier que les champs sont marqués comme obligatoires
    for (const field of requiredFields) {
      await formHelper.expectFieldToBeRequired(field);
    }

    // Essayer de naviguer sans remplir les champs
    await formHelper.goToNextStep();
    
    // Vérifier qu'on reste sur la même étape (validation bloque)
    await page.waitForTimeout(1000);
    const currentTitle = await page.locator('h1').textContent();
    expect(currentTitle).toContain('Additional Information');
  });

  test('Industry References field functionality', async ({ page }) => {
    const industryRefTextarea = page.locator('textarea[name="industryReferences"]');
    
    // Vérifier le placeholder
    await expect(industryRefTextarea).toHaveAttribute('placeholder', /Please provide name.*contact.*industry references.*promoters.*venues.*agents.*vendors.*partners/i);
    
    // Vérifier le nombre de lignes
    const rows = await industryRefTextarea.getAttribute('rows');
    expect(rows).toBe('4');
    
    // Tester la saisie de texte
    const sampleReferences = `Industry References:
- VenueTech Solutions (contact: john@venuetech.com)
- Sound Equipment Rentals Inc. (contact: sarah@soundequip.com)  
- Local Promoters Network (contact: network@localpromoters.org)
- Event Insurance Partners (contact: claims@eventinsurance.com)`;
    
    await industryRefTextarea.fill(sampleReferences);
    await expect(industryRefTextarea).toHaveValue(sampleReferences);
  });

  test('Additional Comments field functionality', async ({ page }) => {
    const additionalCommentsTextarea = page.locator('textarea[name="additionalComments"]');
    
    // Vérifier le placeholder
    await expect(additionalCommentsTextarea).toHaveAttribute('placeholder', /Any additional comments.*information.*share/i);
    
    // Vérifier le nombre de lignes
    const rows = await additionalCommentsTextarea.getAttribute('rows');
    expect(rows).toBe('4');
    
    // Tester la saisie de texte
    const sampleComments = `Additional business context:
Our company has been growing steadily and we're planning to expand into new markets next year. 
We have strong relationships with our current venue partners and excellent reviews from past events.
This funding will help us secure better payment terms and take on larger events.`;
    
    await additionalCommentsTextarea.fill(sampleComments);
    await expect(additionalCommentsTextarea).toHaveValue(sampleComments);
  });

  test('Text validation and limits', async ({ page }) => {
    const industryRefTextarea = page.locator('textarea[name="industryReferences"]');
    const additionalCommentsTextarea = page.locator('textarea[name="additionalComments"]');
    
    // Test avec des textes courts
    await industryRefTextarea.fill('Short ref');
    await additionalCommentsTextarea.fill('Short comment');
    
    await expect(industryRefTextarea).toHaveValue('Short ref');
    await expect(additionalCommentsTextarea).toHaveValue('Short comment');
    
    // Test avec des textes très longs
    const longText = 'A'.repeat(2000); // 2000 caractères
    await industryRefTextarea.fill(longText);
    await additionalCommentsTextarea.fill(longText);
    
    // Vérifier que les textes longs sont acceptés
    await expect(industryRefTextarea).toHaveValue(longText);
    await expect(additionalCommentsTextarea).toHaveValue(longText);
  });

  test('Special characters and formatting', async ({ page }) => {
    const industryRefTextarea = page.locator('textarea[name="industryReferences"]');
    const additionalCommentsTextarea = page.locator('textarea[name="additionalComments"]');
    
    // Test avec caractères spéciaux, emails, URLs
    const specialCharText = `Special characters test:
- Email: contact@company.com
- Phone: +1 (555) 123-4567
- Website: https://www.example.com
- Address: 123 Main St. #456, City, State 12345
- Special chars: àáâäèéêë, ñÑ, ¿¡, €$£¥, 50% & more...`;
    
    await industryRefTextarea.fill(specialCharText);
    await additionalCommentsTextarea.fill(specialCharText);
    
    // Vérifier que tous les caractères spéciaux sont conservés
    await expect(industryRefTextarea).toHaveValue(specialCharText);
    await expect(additionalCommentsTextarea).toHaveValue(specialCharText);
  });

  test('Realistic business scenarios', async ({ page }) => {
    // Scénario 1: Petite entreprise
    const smallBusinessData = {
      industryReferences: `Small Business References:
- Local Event Venue "The Music Hall" (contact: manager@musichall.com)
- Sound engineer freelancer "Mike Johnson" (contact: mike.audio@gmail.com)
- Local marketing agency "City Events Marketing" (contact: info@cityevents.com)
- Equipment rental "Sound & Lights Co." (contact: rentals@soundlights.local)`,
      
      additionalComments: `We are a small but passionate event promotion company focused on supporting emerging local artists. 
Our events typically range from 100-500 attendees and we prioritize creating intimate, high-quality experiences. 
We have a strong social media presence and excellent relationships with local venues and suppliers.`
    };
    
    await page.fill('textarea[name="industryReferences"]', smallBusinessData.industryReferences);
    await page.fill('textarea[name="additionalComments"]', smallBusinessData.additionalComments);
    
    // Vérifier les valeurs
    await expect(page.locator('textarea[name="industryReferences"]')).toHaveValue(smallBusinessData.industryReferences);
    await expect(page.locator('textarea[name="additionalComments"]')).toHaveValue(smallBusinessData.additionalComments);
  });

  test('Error handling and validation messages', async ({ page }) => {
    // Laisser les champs vides et essayer de continuer
    await formHelper.goToNextStep();
    await page.waitForTimeout(1000);
    
    // Chercher des messages d'erreur
    const errorMessages = page.locator('.error-message, .text-red-500, [class*="error"]');
    
    if (await errorMessages.count() > 0) {
      // Vérifier que les erreurs sont visibles et pertinentes
      for (let i = 0; i < await errorMessages.count(); i++) {
        const errorText = await errorMessages.nth(i).textContent();
        console.log(`Validation error ${i}:`, errorText);
      }
    }
    
    // Remplir seulement le premier champ
    await page.fill('textarea[name="industryReferences"]', 'Some references');
    await formHelper.goToNextStep();
    await page.waitForTimeout(500);
    
    // Devrait encore y avoir une erreur pour le deuxième champ
    const currentTitle = await page.locator('h1').textContent();
    expect(currentTitle).toContain('Additional Information');
  });

  test('Navigation to next step with complete data', async ({ page }) => {
    // Remplir les deux champs obligatoires
    await page.fill('textarea[name="industryReferences"]', smallCompanyData.financesInfo.industryReferences || 'Default industry references');
    await page.fill('textarea[name="additionalComments"]', smallCompanyData.financesInfo.additionalComments || 'Default additional comments');
    
    // Naviguer vers l'étape suivante
    await formHelper.goToNextStep();
    
    // Vérifier qu'on arrive à l'étape suivante (probablement Summary)
    await expect(page.locator('h1')).toContainText(/Summary|Review|Submit/);
  });

  test('Data persistence when navigating back', async ({ page }) => {
    const testData = {
      industryReferences: `Persistent References:
- Industry Partner A (contact: partnera@example.com)
- Venue Network B (contact: venueB@network.com)
- Equipment Supplier C (contact: equipment@supplierC.com)`,
      
      additionalComments: `Persistent Comments:
This is a test of data persistence when navigating back and forth between steps.
Our business model focuses on sustainable event production and community engagement.`
    };
    
    // Remplir les champs
    await page.fill('textarea[name="industryReferences"]', testData.industryReferences);
    await page.fill('textarea[name="additionalComments"]', testData.additionalComments);
    
    // Aller à l'étape suivante puis revenir
    await formHelper.goToNextStep();
    await formHelper.goToPreviousStep();
    
    // Vérifier que les données sont conservées
    await expect(page.locator('textarea[name="industryReferences"]')).toHaveValue(testData.industryReferences);
    await expect(page.locator('textarea[name="additionalComments"]')).toHaveValue(testData.additionalComments);
  });

  test('Accessibility of textarea fields', async ({ page }) => {
    const textareas = page.locator('textarea');
    
    for (let i = 0; i < await textareas.count(); i++) {
      const textarea = textareas.nth(i);
      
      // Vérifier les attributs d'accessibilité
      const id = await textarea.getAttribute('id');
      const name = await textarea.getAttribute('name');
      const ariaLabel = await textarea.getAttribute('aria-label');
      const ariaDescribedBy = await textarea.getAttribute('aria-describedby');
      
      // Au moins un identifiant doit être présent
      expect(id || name || ariaLabel).toBeTruthy();
      
      // Vérifier que le champ peut recevoir le focus
      await textarea.focus();
      await expect(textarea).toBeFocused();
      
      // Tester la navigation au clavier
      await textarea.press('Tab');
      await page.waitForTimeout(100);
    }
  });

  test('Textarea resize and interaction', async ({ page }) => {
    const industryRefTextarea = page.locator('textarea[name="industryReferences"]');
    
    // Vérifier les propriétés CSS de base
    const computedStyle = await page.evaluate((element) => {
      const textarea = document.querySelector('textarea[name="industryReferences"]');
      if (textarea) {
        const style = window.getComputedStyle(textarea);
        return {
          resize: style.resize,
          minHeight: style.minHeight,
          display: style.display
        };
      }
      return null;
    });
    
    if (computedStyle) {
      console.log('Textarea computed style:', computedStyle);
    }
    
    // Tester le focus et la saisie
    await industryRefTextarea.focus();
    await industryRefTextarea.type('Testing typing interaction...', { delay: 50 });
    
    // Vérifier que le texte est bien saisi
    await expect(industryRefTextarea).toHaveValue('Testing typing interaction...');
  });

  test('Copy paste functionality', async ({ page }) => {
    const longTextToCopy = `This is a long text that we will copy and paste to test the copy-paste functionality:

Industry References:
1. Major Venue Partner - Nationwide Arena (contact: booking@nationwidearena.com)
2. Sound Production Company - Audio Excellence LLC (contact: production@audioexcellence.com)
3. Lighting Design Firm - Brilliant Lights Inc. (contact: design@brilliantlights.com)
4. Event Management Consultant - Premier Events Solutions (contact: consulting@premierevents.com)
5. Insurance Provider - Event Protection Services (contact: coverage@eventprotection.com)

These partners have worked with us on multiple successful events over the past 3 years.`;
    
    // Simuler le copy-paste en remplissant directement
    await page.fill('textarea[name="industryReferences"]', longTextToCopy);
    
    // Vérifier que le texte copié-collé est entièrement conservé
    await expect(page.locator('textarea[name="industryReferences"]')).toHaveValue(longTextToCopy);
    
    // Tester la sélection de texte et modification
    await page.locator('textarea[name="industryReferences"]').selectText();
    await page.keyboard.type('Replaced text after select all');
    
    await expect(page.locator('textarea[name="industryReferences"]')).toHaveValue('Replaced text after select all');
  });

  test('Multiple line breaks and formatting preservation', async ({ page }) => {
    const formattedText = `Line 1: Industry References

Line 3: After empty line

Line 5: Multiple spaces    between    words

Line 7: Tabs	between	words

Line 9: End with multiple lines



`;
    
    await page.fill('textarea[name="additionalComments"]', formattedText);
    
    // Vérifier que les retours à la ligne et espaces sont conservés
    await expect(page.locator('textarea[name="additionalComments"]')).toHaveValue(formattedText);
  });
});
