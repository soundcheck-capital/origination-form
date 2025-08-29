# Tests End-to-End avec Playwright

Ce dossier contient tous les tests end-to-end pour l'application de formulaire d'origination SoundCheck.

## Structure des tests

```
tests/
├── e2e/
│   ├── components/          # Tests de base de l'application
│   │   └── component-mounting.spec.ts
│   ├── steps/               # Tests détaillés par étape
│   │   ├── step1-personal-info.spec.ts
│   │   ├── step2-company-info.spec.ts
│   │   ├── step3-ticketing.spec.ts
│   │   ├── step4-your-funds.spec.ts
│   │   └── step-navigation.spec.ts
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
# Tests de base de l'application
npm run test:components

# Tests détaillés par étape
npm run test:steps
npm run test:step1          # Étape 1: Informations personnelles
npm run test:step2          # Étape 2: Informations entreprise
npm run test:step3          # Étape 3: Ticketing (9 champs)
npm run test:step4          # Étape 4: Your Funding  
npm run test:step5          # Étape 5: Ownership (propriétaires multiples)
npm run test:step6          # Étape 6: Finances (questions conditionnelles)
npm run test:step7          # Étape 7: Ticketing Information (upload)
npm run test:step8          # Étape 8: Financial Information (upload)
npm run test:step9          # Étape 9: Legal Information (upload)
npm run test:step10         # Étape 10: Additional Information (texte)
npm run test:navigation     # Navigation entre étapes

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

### 1. Tests de base (`component-mounting.spec.ts`)
- ✅ Vérification que l'application se charge correctement
- ✅ Structure de base présente (header, navigation, etc.)
- ✅ Absence d'erreurs JavaScript critiques
- ✅ Mécanisme de protection par mot de passe

### 2. Tests par étape (`/steps/`)

#### **Étape 1 - Informations personnelles** (`step1-personal-info.spec.ts`)
- ✅ Présence de tous les champs (prénom, nom, email, téléphone, rôle)
- ✅ Validation des champs obligatoires
- ✅ Validation de confirmation d'email
- ✅ Options du dropdown "rôle"
- ✅ Format et validation du téléphone
- ✅ Navigation vers l'étape 2
- ✅ Persistance des données
- ✅ Accessibilité (labels, navigation clavier)

#### **Étape 2 - Informations entreprise** (`step2-company-info.spec.ts`)
- ✅ Tous les champs entreprise (nom, DBA, EIN, adresse, etc.)
- ✅ Dropdowns (type client, type business, états)
- ✅ Validation du format EIN
- ✅ Validation du code postal
- ✅ Champ employés (numérique seulement)
- ✅ Autocomplétion d'adresse (Google Maps)
- ✅ Persistance lors navigation
- ✅ Options dropdown conditionnelles

#### **Étape 3 - Ticketing** (`step3-ticketing.spec.ts`)
- ✅ Dropdowns partenaires ticketing
- ✅ Champ "Other Partner" conditionnel
- ✅ Options de politique de règlement
- ✅ Options de traitement de paiement
- ✅ Champ "Other Payment Processing" conditionnel
- ✅ **6 champs de volume** (Last/Next 12 months)
  - ✅ Number of Events (lastYearEvents, nextYearEvents)
  - ✅ Number of Tickets (lastYearTickets, nextYearTickets)
  - ✅ Sales Amount (lastYearSales, nextYearSales)
- ✅ Validation des champs obligatoires (9 champs total)
- ✅ Validation conditionnelle (champs "Other")
- ✅ Validation valeurs numériques réalistes
- ✅ Titres de sections volume
- ✅ Persistance données ticketing + volume

#### **Étape 4 - Your Funding** (`step4-your-funds.spec.ts`)
- ✅ Champ de montant de financement (CurrencyField)
- ✅ Dropdown timing de financement
- ✅ Dropdown utilisation des fonds
- ✅ Validation format monétaire
- ✅ Validation montants min/max
- ✅ Affichage conditionnel montant de qualification
- ✅ Calculs business logic
- ✅ Gestion cas limites (caractères non numériques)
- ✅ Textes d'aide et disclaimers

#### **Étape 5 - Ownership** (`step5-ownership.spec.ts`)
- ✅ **Propriétaires multiples** (ajout/suppression dynamique)
- ✅ Champs par propriétaire : nom, pourcentage, adresse, date de naissance
- ✅ **Validation pourcentages** (total = 100%, valeurs cohérentes)
- ✅ **DatePicker** pour dates de naissance (validation âge)
- ✅ **AddressAutocomplete** avec Google Maps
- ✅ Gestion cas limites (caractères spéciaux, adresses longues)
- ✅ Validation business logic (propriétaires réalistes)
- ✅ Persistance données multiples propriétaires

#### **Étape 6 - Finances** (`step6-finances.spec.ts`)  
- ✅ **Questions conditionnelles progressives** (10 questions oui/non)
- ✅ **Système de dettes dynamique** (types + montants)
- ✅ **Champs conditionnels** (date fin bail, détails dettes)
- ✅ **Logique de saut** et dépendances entre questions
- ✅ Validation business pour montants de dettes
- ✅ **Champs additionnels** (références industrie, commentaires)
- ✅ **Scénarios mixtes** (réponses cohérentes business)
- ✅ Persistance réponses complexes

#### **Étape 7 - Ticketing Information** (`step7-ticketing-information.spec.ts`)
- ✅ **2 champs d'upload de fichiers**
  - ✅ Reports ticketing company (obligatoire, multiples fichiers)
  - ✅ Service Agreement (conditionnel, fichier unique)
- ✅ **Validation types de fichiers** (.pdf, .xlsx, .csv, .jpg, .png)
- ✅ **Descriptions détaillées** et textes d'aide
- ✅ **Logique conditionnelle** (Service Agreement si paymentProcessing = 'Venue')
- ✅ Simulation upload et feedback visuel
- ✅ Gestion fichiers volumineux et erreurs
- ✅ **Accessibilité** navigation clavier

#### **Étape 8 - Financial Information** (`step8-financial-information.spec.ts`)
- ✅ **2 champs d'upload de fichiers**
  - ✅ Financial Statements (obligatoire, multiples fichiers)
  - ✅ Bank Statements (optionnel, multiples fichiers)
- ✅ **Validation documents financiers** (P&L, B/S, relevés bancaires)
- ✅ **Upload multiples** (plusieurs années, plusieurs mois)
- ✅ Simulation scénarios complets (tous documents)
- ✅ **Drag & Drop** interaction
- ✅ Gestion fichiers corrompus/vides
- ✅ Persistance uploads complexes

#### **Étape 9 - Legal Information** (`step9-legal-information.spec.ts`)
- ✅ **5 champs d'upload de fichiers**
  - ✅ Certificate of Incorporation (obligatoire)
  - ✅ Legal Entity Chart (optionnel) 
  - ✅ Government ID (optionnel)
  - ✅ W-9 Form (optionnel)
  - ✅ Other Documents (optionnel, multiples fichiers)
- ✅ **Descriptions détaillées** pour chaque type de document
- ✅ **Upload minimal vs complet** (obligatoire seul vs tous documents)
- ✅ **Validation types spécialisés** (ID photos, formulaires fiscaux)
- ✅ **Catégorie "Other"** avec multiples sous-types
- ✅ Gestion portfolios documentaires complexes

#### **Étape 10 - Additional Information** (`step10-additional-information.spec.ts`)
- ✅ **2 champs TextArea obligatoires**
  - ✅ Industry References (références industrie)
  - ✅ Additional Comments (commentaires additionnels)
- ✅ **Validation texte** (champs obligatoires, longueurs)
- ✅ **Caractères spéciaux** (emails, URLs, accents, symboles)
- ✅ **Formatage préservé** (sauts de ligne, espaces multiples)
- ✅ **Scénarios business réalistes** (petite/moyenne/grande entreprise)
- ✅ **Copy-paste** et édition de texte long
- ✅ **Accessibilité** TextArea (focus, labels, navigation clavier)
- ✅ **Interaction utilisateur** (resize, sélection, modification)

## 🎯 **Récapitulatif complet de la couverture**

### **Étapes testées (10/10)**
1. **Personal Info** - 7 champs + validation emails/téléphone
2. **Company Info** - 12 champs + autocomplétion Google Maps
3. **Ticketing** - 9 champs (3 ticketing + 6 volume) + logique conditionnelle
4. **Your Funding** - 3 champs + calculs métier + validations montants
5. **Ownership** - Propriétaires multiples + validation pourcentages + dates
6. **Finances** - 10 questions conditionnelles + système dettes dynamique
7. **Ticketing Information** - 2 uploads (obligatoire + conditionnel)
8. **Financial Information** - 2 uploads (P&L, relevés bancaires)
9. **Legal Information** - 5 uploads (certificat + documents optionnels)
10. **Additional Information** - 2 champs TextArea + validation texte

### **Statistiques de test**
- ✅ **75+ tests** répartis sur 10 fichiers spécialisés
- ✅ **3 jeux de données** complets (petit/moyen/grand)
- ✅ **42+ champs** de formulaire avec validations
- ✅ **9 uploads** de fichiers avec simulation complète
- ✅ **110+ scénarios** de validation métier

#### **Navigation globale** (`step-navigation.spec.ts`)
- ✅ Barre de progression sur toutes les étapes
- ✅ Titres corrects pour chaque étape
- ✅ Persistance des données sur navigation arrière
- ✅ Validation bloque navigation si incomplet
- ✅ Indicateurs de numéro d'étape

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
