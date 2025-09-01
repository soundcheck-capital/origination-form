# 🛠️ Guide de Développement

## 🎯 **Workflow Quotidien**

### **🚀 Démarrage Journée**
```bash
# Pull des derniers changements
git pull origin main

# Démarrer développement
make dev

# Vérifier que tout fonctionne
make test-chrome
```

### **💻 Développement Actif**
```bash
# Développer une étape
make test-step3        # Tester l'étape en cours

# Tests rapides
make test-chrome       # Validation rapide

# Debug visuel
make test-ui          # Interface Playwright
```

### **📝 Fin de Session**
```bash
# Avant commit
make pre-commit       # Lint + format + tests

# Commit et push
git add .
git commit -m "feat: your changes"
git push origin feature-branch
```

## 🏗️ **Architecture du Code**

### **📁 Structure Source**
```
src/
├── components/
│   ├── customComponents/     # Composants réutilisables
│   │   ├── TextField.tsx     # Champ texte standard
│   │   ├── DropdownField.tsx # Dropdown avec options
│   │   ├── FileUploadField.tsx # Upload de fichiers
│   │   └── CurrencyField.tsx # Champ monétaire
│   ├── LoginForm.tsx         # Authentification
│   ├── MultiStepForm.tsx     # Orchestrateur principal
│   ├── FormSubmissionGuard.tsx # Protection formulaire
│   ├── PersonalInfoStep.tsx  # Étape 1
│   ├── CompanyInfoStep.tsx   # Étape 2
│   └── ...                   # Autres étapes
├── store/
│   ├── index.ts              # Configuration Redux
│   ├── auth/                 # État authentification
│   └── form/                 # État formulaire
├── hooks/
│   ├── useFormValidation.ts  # Validation formulaire
│   ├── useFileUpload.ts      # Gestion uploads
│   └── useSubmissionStatus.ts # Statut backend
├── services/
│   ├── googleDriveService.ts # (Legacy)
│   └── submissionService.ts  # API Make.com
└── utils/
    ├── format.tsx            # Formatage données
    └── usStates.tsx          # États US
```

### **🔄 Flux de Données**
```
User Input → Validation → Redux Store → localStorage → API
    ↑           ↓            ↓            ↓          ↓
Components ← Error State ← Persistence ← Auto-save ← Make.com
```

## 🎮 **Composants Clés**

### **📝 MultiStepForm.tsx**
```typescript
// Orchestrateur principal
const MultiStepForm = () => {
  const currentStep = useSelector(state => state.form.currentStep);
  const isSubmitted = useSelector(state => state.form.isSubmitted);
  
  // Navigation entre étapes
  const handleNext = () => {
    if (validateCurrentStep()) {
      dispatch(setCurrentStep(currentStep + 1));
    }
  };
  
  // Rendu conditionnel des étapes
  const renderStep = () => {
    switch (currentStep) {
      case 1: return <PersonalInfoStep />;
      case 2: return <CompanyInfoStep />;
      // ...
    }
  };
};
```

### **🔒 FormSubmissionGuard.tsx**
```typescript
// Protection après soumission
const FormSubmissionGuard = ({ children }) => {
  const isSubmittedLocal = useSelector(state => state.form.isSubmitted);
  const { isSubmittedBackend } = useSubmissionStatus();
  
  const isSubmitted = isSubmittedLocal || isSubmittedBackend;
  
  if (isSubmitted && !allowDevAccess) {
    return <Navigate to="/submit-success" />;
  }
  
  return <>{children}</>;
};
```

### **📤 submissionService.ts**
```typescript
// Communication avec Make.com
class SubmissionService {
  async checkSubmissionStatus() {
    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      body: JSON.stringify({ hubspotDealId })
    });
    
    return { isSubmitted: data.IsFormSubmitted === 'true' };
  }
}
```

## 🔧 **Patterns de Développement**

### **✅ Création d'une Nouvelle Étape**

1. **Créer le composant**
```typescript
// src/components/NewStep.tsx
export const NewStep: React.FC = () => {
  const dispatch = useDispatch();
  const data = useSelector(state => state.form.formData.newSection);
  
  const handleChange = (field: string, value: string) => {
    dispatch(updateFormData({ newSection: { [field]: value } }));
  };
  
  return (
    <div>
      <TextField 
        name="newField"
        value={data.newField}
        onChange={(value) => handleChange('newField', value)}
      />
    </div>
  );
};
```

2. **Ajouter au formTypes.ts**
```typescript
// src/store/form/formTypes.ts
export interface FormData {
  // ... existing
  newSection: {
    newField: string;
  };
}
```

3. **Mettre à jour initialFormState.ts**
```typescript
// src/store/form/initialFormState.ts
export const initialState: FormState = {
  formData: {
    // ... existing
    newSection: {
      newField: ''
    }
  }
};
```

4. **Ajouter au MultiStepForm.tsx**
```typescript
// Case dans renderStep()
case 12: return <NewStep />;
```

5. **Créer les tests**
```typescript
// tests/e2e/steps/step12-new-step.spec.ts
test.describe('Step 12: New Step', () => {
  test('should display new field', async ({ page }) => {
    await helper.navigateToStep(12);
    await expect(page.locator('input[name="newField"]')).toBeVisible();
  });
});
```

### **✅ Création d'un Composant Réutilisable**

```typescript
// src/components/customComponents/NewField.tsx
interface NewFieldProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  error?: string;
}

export const NewField: React.FC<NewFieldProps> = ({
  name, value, onChange, label, required, error
}) => {
  return (
    <div className="mb-4">
      <label className={`block text-sm font-medium ${required ? 'required' : ''}`}>
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`form-input ${error ? 'border-red-500' : ''}`}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};
```

### **✅ Ajout de Validation**

```typescript
// src/hooks/useFormValidation.ts
export const validateStep = (stepNumber: number, data: FormData) => {
  const errors: ValidationErrors = {};
  
  switch (stepNumber) {
    case 12:
      if (!data.newSection.newField) {
        errors.newField = ['Ce champ est requis'];
      }
      break;
  }
  
  return errors;
};
```

## 🧪 **Tests pendant Développement**

### **🎯 Tests Ciblés**
```bash
# Test étape en cours
make test-step3

# Test composant spécifique
npx playwright test --grep "New Field"

# Test pattern
make test-grep PATTERN="validation"
```

### **🔍 Debug Tests**
```bash
# Mode debug interactif
make test-debug

# Interface graphique
make test-ui

# Voir navigateur
make test-headed
```

### **📊 Écriture de Tests**
```typescript
// tests/e2e/steps/stepX-feature.spec.ts
import { test, expect } from '@playwright/test';
import { FormHelper } from '../../utils/testHelpers';

test.describe('Feature Tests', () => {
  let formHelper: FormHelper;

  test.beforeEach(async ({ page }) => {
    formHelper = new FormHelper(page);
    await formHelper.navigateToApp();
  });

  test('should validate required fields', async () => {
    await formHelper.navigateToStep(X);
    
    // Try to proceed without filling
    await page.click('[data-testid="next-button"]');
    
    // Should see error
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });
});
```

## 🎮 **Commandes Utiles**

### **🔧 Debug et Maintenance**
```bash
# Vérifier état du projet
make status

# Nettoyer et reconstruire
make clean && make setup

# Vérifier variables
make debug-env

# Logs détaillés
DEBUG=* make dev
```

### **📊 Analyse Code**
```bash
# Linting
make lint

# Formatage
make format

# Build vérification
make build

# Prévisualisation build
make preview
```

### **🔄 Git Workflow**
```bash
# Créer branche feature
git checkout -b feature/new-feature

# Développement
make dev
# ... développer ...
make test-chrome

# Commit
make pre-commit
git add .
git commit -m "feat: add new feature"

# Push et PR
git push origin feature/new-feature
```

## 🚨 **Debugging**

### **🔍 Debug Frontend**
```typescript
// Dans les composants
console.log('Debug data:', { step, data, errors });

// Redux DevTools
window.__REDUX_DEVTOOLS_EXTENSION__

// React DevTools
Components → Profiler
```

### **📡 Debug API**
```typescript
// Dans submission service
console.log('Request:', { url, body });
console.log('Response:', await response.text());

// Tests API
fetch('https://hook.us1.make.com/...', {
  method: 'POST',
  body: JSON.stringify({ test: true })
})
.then(r => r.text())
.then(console.log);
```

### **🧪 Debug Tests**
```typescript
// Dans les tests
await page.pause(); // Pause pour inspection

// Screenshots debug
await page.screenshot({ path: 'debug.png' });

// Console logs
page.on('console', msg => console.log(msg.text()));
```

## 📈 **Performance**

### **⚡ Optimisations**
```typescript
// Lazy loading étapes
const PersonalInfoStep = lazy(() => import('./PersonalInfoStep'));

// Memoization
const MemoizedComponent = memo(Component);

// Debounce auto-save
const debouncedSave = useCallback(
  debounce((data) => dispatch(saveApplication(data)), 1000),
  []
);
```

### **📊 Monitoring**
```typescript
// Performance marks
performance.mark('step-start');
// ... code ...
performance.mark('step-end');
performance.measure('step-duration', 'step-start', 'step-end');
```

## 🎯 **Bonnes Pratiques**

### **✅ Code Quality**
- **TypeScript strict** : Pas de `any`
- **Props interfaces** : Toujours typées
- **Error boundaries** : Gestion erreurs React
- **Accessibility** : Labels, ARIA, navigation clavier

### **✅ State Management**
- **Redux actions** : Descriptives et typées
- **Selectors** : Réutilisables et optimisés
- **Side effects** : Dans des thunks séparés

### **✅ Testing**
- **Test behavior** : Pas d'implémentation
- **User perspective** : Interactions réelles
- **Data fixtures** : Données réalistes

**Happy coding ! 🚀**
