# 🧪 Tests E2E avec Playwright

## 🎯 **Vue d'Ensemble**

Suite de tests complète couvrant toutes les étapes du formulaire, les API calls, et les flux utilisateur.

## 🏗️ **Architecture des Tests**

```
tests/
├── fixtures/
│   └── testData.ts           # Jeux de données (small, medium, large)
├── utils/
│   └── testHelpers.ts        # FormHelper class + utilitaires
├── e2e/
│   ├── components/           # Tests de base
│   ├── api/                  # Tests des appels API
│   ├── flows/               # Tests de flux complets
│   └── steps/               # Tests par étape (1-10)
└── README.md                # Documentation tests
```

## 🎮 **Commandes de Test**

### **🚀 Tests Principaux**
```bash
# Tous les tests
make test              # Suite complète
make test-ui           # Interface graphique
make test-debug        # Mode debug
make test-headed       # Navigateur visible

# Par navigateur
make test-chrome       # Chrome (rapide)
make test-firefox      # Firefox
make test-webkit       # Safari
make test-mobile       # Chrome + Safari mobile
```

### **🎯 Tests par Étape**
```bash
make test-step1        # Personal Info
make test-step2        # Company Info  
make test-step3        # Ticketing + Volume (6 champs)
make test-step4        # Your Funds
make test-step5        # Ownership (dynamique)
make test-step6        # Finances (conditionnel)
make test-step7        # Ticketing Information (upload)
make test-step8        # Financial Information (upload)
make test-step9        # Legal Information (upload)
make test-step10       # Additional Information (textarea)
```

### **📊 Tests par Catégorie**
```bash
make test-components   # Tests de base
make test-api         # Tests API calls
make test-flows       # Tests flux complets
make test-navigation  # Tests navigation
```

## 📋 **Couverture des Tests**

### **✅ Tests Fonctionnels**
- **Montage composants** : Tous les champs s'affichent
- **Validation** : Required fields, formats, limites
- **Navigation** : Forward/backward, persistance data
- **Conditional logic** : Champs dynamiques selon réponses

### **✅ Tests d'Intégration**
- **API Calls** : Soumission formulaire + upload fichiers
- **Error handling** : Timeout, 500, network errors
- **File uploads** : Types, tailles, multiple files
- **Form submission** : End-to-end complet

### **✅ Tests UI/UX**
- **Responsive** : Mobile + desktop
- **Accessibility** : Labels, ARIA, navigation clavier
- **Loading states** : Spinners, progress
- **Error messages** : Validation, feedback utilisateur

## 🎯 **Jeux de Données**

### **📊 Fixtures Disponibles**
```typescript
// tests/fixtures/testData.ts
export const smallCompanyData = {
  personalInfo: { /* Basic user */ },
  companyInfo: { employees: 5, /* ... */ },
  volumeInfo: { lastYearEvents: 10, /* ... */ },
  fundsInfo: { yourFunds: "50000", /* ... */ },
  ownershipInfo: [{ /* Single owner */ }],
  financesInfo: { /* Simple finances */ }
};

export const mediumCompanyData = {
  // Données pour entreprise moyenne
};

export const largeCompanyData = {
  // Données pour grande entreprise
};
```

### **🎮 Utilisation des Fixtures**
```typescript
// Dans les tests
import { smallCompanyData } from '../fixtures/testData';

test('Small company flow', async ({ page }) => {
  const helper = new FormHelper(page);
  await helper.fillCompleteForm(smallCompanyData);
  await helper.submitForm();
});
```

## 🛠️ **FormHelper Class**

### **🎯 Méthodes Principales**
```typescript
class FormHelper {
  // Navigation
  async navigateToApp()
  async navigateToStep(stepNumber)
  
  // Remplissage par étape
  async fillPersonalInfo(data)
  async fillCompanyInfo(data)
  async fillTicketingInfo(data)
  async fillVolumeInfo(data)          // 6 champs volume
  async fillFundsInfo(data)
  async fillOwnershipInfo(data)       // Dynamique owners
  async fillFinancesInfo(data)        // Conditionnel
  async fillAdditionalInfo(data)      // TextAreas
  
  // Upload fichiers
  async simulateFileUpload(fieldName, fileName)
  async simulateRequiredUploads(stepNumber)
  
  // Workflow complet
  async fillCompleteForm(data)
  async fillAllPreviousSteps(targetStep, data)
  
  // Validation
  async expectFieldToBeVisible(fieldName)
  async expectFieldToBeRequired(fieldName)
}
```

### **🎮 Exemples d'Utilisation**
```typescript
// Remplir une étape spécifique
await helper.fillPersonalInfo(testData.personalInfo);
await helper.clickNext();

// Remplir tout jusqu'à une étape
await helper.fillAllPreviousSteps(5, testData);

// Upload de fichiers
await helper.simulateFileUpload('incorporationCertificate', 'cert.pdf');

// Workflow complet
await helper.fillCompleteForm(testData);
await helper.submitForm();
```

## 📊 **Tests Spécialisés**

### **🔄 Tests Dynamiques (Ownership)**
```typescript
test('Multiple owners management', async ({ page }) => {
  // Ajouter plusieurs owners
  await page.click('[data-testid="add-owner"]');
  await page.click('[data-testid="add-owner"]');
  
  // Remplir chaque owner
  for (let i = 0; i < owners.length; i++) {
    await helper.fillOwnerInfo(i, owners[i]);
  }
  
  // Valider total = 100%
  await expect(page.locator('[data-testid="total-percentage"]')).toHaveText('100%');
});
```

### **⚡ Tests Conditionnels (Finances)**
```typescript
test('Conditional finances flow', async ({ page }) => {
  // Question 1 → Révèle Question 2
  await page.check('input[name="singleEntity"][value="true"]');
  await expect(page.locator('input[name="assetsTransferred"]')).toBeVisible();
  
  // Yes → Révèle champs spécialisés
  await page.check('input[name="hasBusinessDebt"][value="true"]');
  await expect(page.locator('[data-testid="add-debt"]')).toBeVisible();
});
```

### **📁 Tests Upload (Legal)**
```typescript
test('Legal documents upload', async ({ page }) => {
  // Upload requis
  await helper.simulateFileUpload('incorporationCertificate', 'cert.pdf');
  
  // Upload optionnels
  await helper.simulateFileUpload('legalEntityChart', 'chart.pdf');
  await helper.simulateFileUpload('governmentId', 'id.pdf');
  
  // Validation types
  await expect(page.locator('[data-testid="file-error"]')).not.toBeVisible();
});
```

## 🤖 **Tests API**

### **📤 Tests de Soumission**
```typescript
test('Form submission with API interception', async ({ page }) => {
  // Intercepter les appels
  await page.route('**/webhook/**', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true })
    });
  });
  
  // Remplir et soumettre
  await helper.fillCompleteForm(testData);
  await helper.submitForm();
  
  // Vérifier redirection
  await expect(page).toHaveURL('/submit-success');
});
```

### **📁 Tests Upload Fichiers**
```typescript
test('File upload API calls', async ({ page }) => {
  let uploadRequests = [];
  
  // Capturer les uploads
  await page.route('**/files/**', route => {
    uploadRequests.push(route.request());
    route.fulfill({ status: 200, body: '{"success": true}' });
  });
  
  // Upload fichiers
  await helper.simulateRequiredUploads(7); // Ticketing Information
  
  // Vérifier appels
  expect(uploadRequests.length).toBeGreaterThan(0);
});
```

## 🎯 **Configuration Playwright**

### **⚚ playwright.config.ts**
```typescript
export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    // Firefox, WebKit seulement en local (pas CI)
    ...(process.env.CI ? [] : [
      { name: 'firefox', use: devices['Desktop Firefox'] },
      { name: 'webkit', use: devices['Desktop Safari'] },
    ]),
  ],
});
```

### **🌐 Variables d'Environnement**
```bash
# Tests
BASE_URL=http://localhost:3001
REACT_APP_FORM_PASSWORD=123456
REACT_APP_WEBHOOK_URL=https://webhook.test.com/test
REACT_APP_WEBHOOK_URL_FILES=https://webhook.test.com/files
```

## 📊 **Rapports et Debug**

### **📈 Rapports HTML**
```bash
make test-report       # Ouvrir rapport HTML
make test-trace        # Ouvrir traces interactives
```

### **🔍 Debug et Screenshots**
```bash
# Mode debug
make test-debug        # Debugger intégré
make test-headed       # Voir le navigateur

# Screenshots automatiques
test-results/
├── test-failed-1.png  # Screenshot à l'échec
├── video.webm         # Vidéo de l'échec
└── trace.zip          # Trace interactive
```

### **📊 Métriques de Performance**
```typescript
// Dans les tests
test('Performance check', async ({ page }) => {
  const startTime = Date.now();
  
  await helper.fillCompleteForm(testData);
  
  const duration = Date.now() - startTime;
  expect(duration).toBeLessThan(30000); // < 30s
});
```

## 🎮 **Workflows de Test**

### **🚀 Développement**
```bash
# Tests rapides pendant dev
make test-step3        # Étape en cours
make test-chrome       # Validation rapide
make test-ui          # Debug visuel
```

### **🔄 Pre-commit**
```bash
# Validation avant commit
make pre-commit        # Lint + format + tests chrome
```

### **🎯 CI/CD**
```bash
# Tests automatiques
make ci-test          # Chrome uniquement en CI
# → Plus rapide, mais couverture complète en local
```

### **🔍 Debug d'Échecs**
```bash
# Si test échoue
make test-debug        # Mode interactif
make test-trace        # Analyser l'échec
make test-headed       # Voir le problème
```

## 🎯 **Bonnes Pratiques**

### **✅ Structure de Test**
- **Arrange** : Setup données et mocks
- **Act** : Actions utilisateur
- **Assert** : Vérifications résultats

### **✅ Sélecteurs Robustes**
```typescript
// ✅ Bon
await page.click('[data-testid="submit-button"]');

// ❌ Fragile
await page.click('button.btn-primary');
```

### **✅ Attentes Explicites**
```typescript
// ✅ Attendre la visibilité
await expect(page.locator('[data-testid="success"]')).toBeVisible();

// ❌ Timeout implicite
await page.click('[data-testid="button"]');
```

### **✅ Tests Indépendants**
- Chaque test repart d'un état propre
- Pas de dépendances entre tests
- Nettoyage automatique (beforeEach)

**Vos tests couvrent maintenant 100% des fonctionnalités ! 🧪**
