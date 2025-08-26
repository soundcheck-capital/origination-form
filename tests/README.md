# Tests End-to-End avec Playwright

Ce dossier contient tous les tests end-to-end pour l'application de formulaire d'origination SoundCheck.

## Structure des tests

```
tests/
├── e2e/
│   ├── components/          # Tests de montage des composants
│   │   └── component-mounting.spec.ts
│   ├── api/                 # Tests des appels API
│   │   └── api-calls.spec.ts
│   └── flows/               # Tests de flux complets
│       └── complete-flow.spec.ts
├── utils/                   # Utilitaires de test
│   └── testHelpers.ts       # Helper pour automatiser le formulaire
├── fixtures/                # Données de test
│   └── testData.ts          # Jeux de données pour les tests
└── README.md               # Cette documentation
```

## Installation et Configuration

### 1. Installer les dépendances
```bash
npm install -D @playwright/test
npx playwright install
```

### 2. Configuration
La configuration Playwright se trouve dans `playwright.config.ts` à la racine du projet.

### 3. Variables d'environnement
Assurez-vous que votre fichier `.env` contient les bonnes variables :
```env
REACT_APP_WEBHOOK_URL=votre_webhook_url
REACT_APP_WEBHOOK_URL_FILES=votre_webhook_files_url
REACT_APP_HUBSPOT_COMPANY_ID=votre_company_id
# etc.
```

## Commandes disponibles

### Tests complets
```bash
# Lancer tous les tests
npm run test:e2e

# Lancer avec interface graphique
npm run test:e2e:ui

# Lancer en mode headed (voir le navigateur)
npm run test:e2e:headed

# Lancer en mode debug (pas à pas)
npm run test:e2e:debug
```

### Tests par catégorie
```bash
# Tests de composants uniquement
npm run test:components

# Tests API uniquement
npm run test:api

# Tests de flux complets uniquement
npm run test:flows
```

### Rapports
```bash
# Voir le rapport HTML des derniers tests
npm run test:report
```

## Types de tests

### 1. Tests de montage des composants (`component-mounting.spec.ts`)
- ✅ Vérification que l'application se charge correctement
- ✅ Montage correct de chaque étape du formulaire
- ✅ Présence de tous les champs requis
- ✅ Navigation entre les étapes
- ✅ Barre de progression
- ✅ Validation des formulaires

**Exemple :**
```typescript
test('Personal Info Step components mount correctly', async ({ page }) => {
  // Vérifie que tous les champs sont présents et visibles
});
```

### 2. Tests des appels API (`api-calls.spec.ts`)
- ✅ Test de soumission des données du formulaire
- ✅ Test d'upload de fichiers
- ✅ Gestion des erreurs API
- ✅ Vérification des paramètres envoyés
- ✅ Test avec 3 jeux de données différents

**Jeux de données testés :**
1. **Petite entreprise** : 5 employés, $50k de financement
2. **Moyenne entreprise** : 25 employés, $250k de financement  
3. **Grande entreprise** : 150 employés, $1M de financement

### 3. Tests de flux complets (`complete-flow.spec.ts`)
- ✅ Parcours complet du formulaire
- ✅ Navigation bidirectionnelle avec conservation des données
- ✅ Fonctionnalité du Summary (clic pour retourner aux étapes)
- ✅ Tests responsive (mobile/desktop)
- ✅ Upload de fichiers intégré au flux

## Données de test

Les jeux de données sont définis dans `fixtures/testData.ts` :

```typescript
// Exemple d'utilisation
import { smallCompanyData, mediumCompanyData, largeCompanyData } from '../fixtures/testData';

test('Test avec petite entreprise', async ({ page }) => {
  await formHelper.fillPersonalInfo(smallCompanyData.personalInfo);
  // ...
});
```

## Utilitaires disponibles

La classe `FormHelper` dans `utils/testHelpers.ts` fournit des méthodes utiles :

```typescript
const formHelper = new FormHelper(page);

// Navigation
await formHelper.navigateToApp();
await formHelper.goToNextStep();
await formHelper.goToPreviousStep();

// Remplissage de formulaire
await formHelper.fillPersonalInfo(data.personalInfo);
await formHelper.fillCompanyInfo(data.companyInfo);

// Upload de fichiers
await formHelper.uploadTestFile('ticketingCompanyReport', 'test.pdf');

// Mock des API
await formHelper.mockApiCalls();

// Attentes
await formHelper.expectStep('Get Funding');
await formHelper.waitForProgress(50);
```

## Debugging des tests

### Mode debug
```bash
npm run test:e2e:debug
```
Permet d'exécuter les tests pas à pas avec inspection du navigateur.

### Screenshots et vidéos
En cas d'échec, Playwright capture automatiquement :
- Screenshots des échecs
- Vidéos des tests échoués
- Traces complètes de l'exécution

### Logs
Les tests incluent des logs détaillés pour debugger les problèmes :
```typescript
console.log('=== Environment Variables Debug ===');
console.log('REACT_APP_WEBHOOK_URL:', process.env.REACT_APP_WEBHOOK_URL);
```

## Bonnes pratiques

### 1. Isolation des tests
Chaque test est isolé avec son propre contexte de navigateur.

### 2. Mock des API
Les tests utilisent des mocks pour éviter les vraies requêtes en production :
```typescript
await page.route('**/hook.us1.make.com/**', route => {
  route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
});
```

### 3. Attentes robustes
Utilisation d'attentes avec auto-retry :
```typescript
await expect(page.locator('button')).toBeVisible();
await expect(page.locator('input')).toHaveValue('expected');
```

### 4. Données de test réalistes
Les jeux de données reflètent des cas d'usage réels avec des variations significatives.

## CI/CD

Les tests peuvent être intégrés dans votre pipeline CI/CD :
```yaml
# Exemple GitHub Actions
- name: Run Playwright tests
  run: npm run test:e2e
  
- name: Upload test results
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Maintenance

### Mise à jour des tests
Lorsque vous modifiez l'interface :
1. Mettez à jour les sélecteurs dans `testHelpers.ts`
2. Ajustez les données de test si nécessaire
3. Exécutez les tests pour vérifier la compatibilité

### Ajout de nouveaux tests
1. Créez un nouveau fichier `.spec.ts` dans le dossier approprié
2. Importez les utilitaires et fixtures nécessaires
3. Suivez les patterns existants pour la cohérence
