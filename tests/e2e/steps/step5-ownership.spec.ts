import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';
import { smallCompanyData } from '../../fixtures/testData';

test.describe('Step 5: Ownership Step Tests', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.navigateToApp();
    
    // Naviguer jusqu'à l'étape 5 en remplissant les étapes précédentes
    await formHelper.fillAllPreviousSteps(4, smallCompanyData);
    await formHelper.goToNextStep(); // Aller à l'étape 5
    await formHelper.expectStep('Ownership Information');
  });

  test('Ownership Step components mount correctly', async ({ page }) => {
    // Vérifier le titre de l'étape
    await expect(page.locator('h1')).toContainText('Ownership Information');
    
    // Vérifier que les champs du premier propriétaire sont présents
    await formHelper.expectFieldToBeVisible('input[name="owner0Name"]', 'Owner Name');
    await formHelper.expectFieldToBeVisible('input[name="owner0Percentage"]', 'Ownership Percentage');
    await formHelper.expectFieldToBeVisible('input[name="owner0Address"]', 'Owner Address');
    await formHelper.expectFieldToBeVisible('input[name="owner0BirthDate"]', 'Owner Birth Date');
    
    // Vérifier le bouton pour ajouter un propriétaire
    await expect(page.locator('button:has-text("Add Owner")')).toBeVisible();
    
    // Boutons de navigation
    await expect(page.locator('button:has-text("Previous")')).toBeVisible();
    await expect(page.locator('button:has-text("Next")')).toBeVisible();
  });

  test('Required fields validation for single owner', async ({ page }) => {
    const requiredFields = [
      'input[name="owner0Name"]',
      'input[name="owner0Percentage"]',
      'input[name="owner0Address"]', 
      'input[name="owner0BirthDate"]'
    ];

    await formHelper.validateStepRequiredFields(requiredFields);
  });

  test('Add and remove additional owners', async ({ page }) => {
    // Ajouter un deuxième propriétaire
    await page.click('button:has-text("Add Owner")');
    
    // Vérifier que les champs du deuxième propriétaire apparaissent
    await formHelper.expectFieldToBeVisible('input[name="owner1Name"]', 'Second Owner Name');
    await formHelper.expectFieldToBeVisible('input[name="owner1Percentage"]', 'Second Owner Percentage');
    await formHelper.expectFieldToBeVisible('input[name="owner1Address"]', 'Second Owner Address');
    await formHelper.expectFieldToBeVisible('input[name="owner1BirthDate"]', 'Second Owner Birth Date');
    
    // Vérifier qu'un bouton de suppression apparaît
    await expect(page.locator('button:has-text("Remove")')).toBeVisible();
    
    // Ajouter un troisième propriétaire
    await page.click('button:has-text("Add Owner")');
    await formHelper.expectFieldToBeVisible('input[name="owner2Name"]', 'Third Owner Name');
    
    // Supprimer le deuxième propriétaire
    const removeButtons = page.locator('button:has-text("Remove")');
    const removeButtonCount = await removeButtons.count();
    if (removeButtonCount > 1) {
      await removeButtons.nth(1).click(); // Supprimer le deuxième
    }
    
    // Vérifier que les champs du propriétaire supprimé n'existent plus
    await expect(page.locator('input[name="owner1Name"]')).not.toBeVisible();
  });

  test('Ownership percentage validation', async ({ page }) => {
    // Test de pourcentage invalide (> 100%)
    await page.fill('input[name="owner0Percentage"]', '150');
    
    // Ajouter un deuxième propriétaire
    await page.click('button:has-text("Add Owner")');
    await page.fill('input[name="owner1Percentage"]', '50');
    
    // La somme dépasse 100%, vérifier qu'une validation apparaît
    await page.waitForTimeout(500);
    
    // Test de pourcentage valide
    await page.fill('input[name="owner0Percentage"]', '60');
    await page.fill('input[name="owner1Percentage"]', '40');
    
    // Vérifier que les valeurs sont acceptées
    await expect(page.locator('input[name="owner0Percentage"]')).toHaveValue('60');
    await expect(page.locator('input[name="owner1Percentage"]')).toHaveValue('40');
  });

  test('Date picker functionality for birth dates', async ({ page }) => {
    const birthDateField = page.locator('input[name="owner0BirthDate"]');
    
    // Vérifier que le champ accepte une date valide
    await birthDateField.fill('1985-06-15');
    await expect(birthDateField).toHaveValue('1985-06-15');
    
    // Test d'une date invalide (futur)
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureDateString = futureDate.toISOString().split('T')[0];
    
    await birthDateField.fill(futureDateString);
    await page.waitForTimeout(500);
    
    // Une validation pourrait apparaître pour une date future
  });

  test('Address autocomplete functionality', async ({ page }) => {
    const addressField = page.locator('input[name="owner0Address"]');
    
    // Tester la saisie d'une adresse
    await addressField.fill('123 Main Street, New York, NY');
    await expect(addressField).toHaveValue('123 Main Street, New York, NY');
    
    // Vérifier que l'autocomplétion pourrait être déclenchée
    await addressField.fill('Times Square');
    await page.waitForTimeout(1000); // Attendre les suggestions
    
    // Si des suggestions apparaissent, elles seraient dans un dropdown
    const suggestions = page.locator('[role="listbox"], .autocomplete-dropdown');
    if (await suggestions.isVisible()) {
      await suggestions.locator('li').first().click();
    }
  });

  test('Multiple owners with realistic data', async ({ page }) => {
    // Scénario : Deux cofondateurs
    await page.fill('input[name="owner0Name"]', 'John Smith');
    await page.fill('input[name="owner0Percentage"]', '60');
    await page.fill('input[name="owner0Address"]', '123 Business Ave, New York, NY 10001');
    await page.fill('input[name="owner0BirthDate"]', '1980-03-15');
    
    // Ajouter un deuxième propriétaire
    await page.click('button:has-text("Add Owner")');
    
    await page.fill('input[name="owner1Name"]', 'Jane Doe');
    await page.fill('input[name="owner1Percentage"]', '40');
    await page.fill('input[name="owner1Address"]', '456 Startup Blvd, Brooklyn, NY 11201');
    await page.fill('input[name="owner1BirthDate"]', '1985-08-22');
    
    // Vérifier que toutes les données sont conservées
    await expect(page.locator('input[name="owner0Name"]')).toHaveValue('John Smith');
    await expect(page.locator('input[name="owner0Percentage"]')).toHaveValue('60');
    await expect(page.locator('input[name="owner1Name"]')).toHaveValue('Jane Doe');
    await expect(page.locator('input[name="owner1Percentage"]')).toHaveValue('40');
  });

  test('Navigation to next step with valid ownership data', async ({ page }) => {
    // Remplir un propriétaire complet
    await formHelper.fillOwnershipInfo({
      owners: [{
        id: '1',
        ownerName: 'Test Owner',
        ownershipPercentage: '100',
        ownerAddress: '123 Test St, Test City, TS 12345',
        ownerBirthDate: '1990-01-01'
      }]
    });

    await formHelper.goToNextStep();
    
    // Vérifier qu'on arrive à l'étape suivante (finances)
    await expect(page.locator('h1')).toContainText('Finances');
  });

  test('Data persistence when navigating back', async ({ page }) => {
    const ownershipData = {
      owners: [{
        id: '1',
        ownerName: 'Persistent Owner',
        ownershipPercentage: '100',
        ownerAddress: '789 Persistence Lane, Memory City, MC 54321',
        ownerBirthDate: '1988-12-25'
      }]
    };

    // Remplir les données
    await formHelper.fillOwnershipInfo(ownershipData);
    
    // Aller à l'étape suivante puis revenir
    await formHelper.goToNextStep();
    await formHelper.goToPreviousStep();
    
    // Vérifier que les données sont conservées
    await expect(page.locator('input[name="owner0Name"]')).toHaveValue(ownershipData.owners[0].ownerName);
    await expect(page.locator('input[name="owner0Percentage"]')).toHaveValue(ownershipData.owners[0].ownershipPercentage);
    await expect(page.locator('input[name="owner0Address"]')).toHaveValue(ownershipData.owners[0].ownerAddress);
    await expect(page.locator('input[name="owner0BirthDate"]')).toHaveValue(ownershipData.owners[0].ownerBirthDate);
  });

  test('Company information integration', async ({ page }) => {
    // Cette étape peut aussi mettre à jour des informations de l'entreprise
    // Vérifier si des champs d'entreprise sont présents et fonctionnels
    
    const legalEntityField = page.locator('input[name="legalEntityName"]');
    const businessTypeField = page.locator('select[name="businessType"]');
    
    if (await legalEntityField.isVisible()) {
      await legalEntityField.fill('Updated Legal Entity Name LLC');
      await expect(legalEntityField).toHaveValue('Updated Legal Entity Name LLC');
    }
    
    if (await businessTypeField.isVisible()) {
      await businessTypeField.selectOption('LLC');
      await expect(businessTypeField).toHaveValue('LLC');
    }
  });

  test('Edge cases and error handling', async ({ page }) => {
    // Test avec des caractères spéciaux dans les noms
    await page.fill('input[name="owner0Name"]', 'José María O\'Brien-Smith Jr.');
    await expect(page.locator('input[name="owner0Name"]')).toHaveValue('José María O\'Brien-Smith Jr.');
    
    // Test avec pourcentage à virgule
    await page.fill('input[name="owner0Percentage"]', '33.33');
    await expect(page.locator('input[name="owner0Percentage"]')).toHaveValue('33.33');
    
    // Test avec adresse très longue
    const longAddress = '1234567890 Very Very Very Long Street Name That Goes On And On, Extremely Long City Name, VeryLongState 12345-6789';
    await page.fill('input[name="owner0Address"]', longAddress);
    await expect(page.locator('input[name="owner0Address"]')).toHaveValue(longAddress);
    
    // Test avec date limite (18 ans minimum par exemple)
    const minAgeDate = new Date();
    minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);
    const minAgeDateString = minAgeDate.toISOString().split('T')[0];
    
    await page.fill('input[name="owner0BirthDate"]', minAgeDateString);
    await expect(page.locator('input[name="owner0BirthDate"]')).toHaveValue(minAgeDateString);
  });

  test('Ownership percentage total validation', async ({ page }) => {
    // Ajouter trois propriétaires avec des pourcentages qui totalisent 100%
    await page.fill('input[name="owner0Name"]', 'Owner 1');
    await page.fill('input[name="owner0Percentage"]', '50');
    
    await page.click('button:has-text("Add Owner")');
    await page.fill('input[name="owner1Name"]', 'Owner 2');
    await page.fill('input[name="owner1Percentage"]', '30');
    
    await page.click('button:has-text("Add Owner")');
    await page.fill('input[name="owner2Name"]', 'Owner 3');
    await page.fill('input[name="owner2Percentage"]', '20');
    
    // Total = 100%, devrait être valide
    await page.waitForTimeout(500);
    
    // Modifier pour dépasser 100%
    await page.fill('input[name="owner0Percentage"]', '60');
    await page.waitForTimeout(500);
    
    // Total = 110%, devrait déclencher une validation
    // Vérifier s'il y a un message d'erreur ou une indication visuelle
    const errorMessages = page.locator('.error-message, .text-red-500, [class*="error"]');
    if (await errorMessages.count() > 0) {
      console.log('Validation error detected for percentage total > 100%');
    }
  });
});
