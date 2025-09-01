# 🚀 Déploiement & CI/CD

## 🎯 **Vue d'Ensemble**

Pipeline automatisé avec tests, builds et déploiements multi-environnements via GitHub Actions et Netlify.

## 🏗️ **Architecture Pipeline**

```
Push/PR → GitHub Actions → Tests → Build → Deploy → Netlify
    ↓           ↓            ↓       ↓       ↓        ↓
  main     Determine    Playwright  React   Env      Production
develop   Environment     E2E      Build   Config    Staging
staging      ↓            ↓        ↓       ↓        Development
           Environment   Chrome   Optimized Multi-env
           Variables     Only     Bundle   Secrets
```

## 🌍 **Environnements**

### **🎯 Configuration par Branche**
| Branche | Environnement | Netlify Alias | URL |
|---------|---------------|---------------|-----|
| `main` | production | `--prod` | `app.yourdomain.com` |
| `staging` | staging | `--alias=staging` | `staging--app.netlify.app` |
| `develop` | development | `--alias=dev` | `dev--app.netlify.app` |
| `feature/*` | development | `--alias=preview` | `preview--app.netlify.app` |

### **📊 Variables d'Environnement**
```bash
# Communes à tous
REACT_APP_ENVIRONMENT=production|staging|development
REACT_APP_BRANCH=main|staging|develop

# Spécifiques par environnement (GitHub Secrets)
REACT_APP_FORM_PASSWORD
REACT_APP_WEBHOOK_URL
REACT_APP_WEBHOOK_URL_FILES
REACT_APP_SUBMISSION_STATUS_WEBHOOK
REACT_APP_HUBSPOT_COMPANY_ID
REACT_APP_HUBSPOT_DEAL_ID
REACT_APP_HUBSPOT_CONTACT_ID
REACT_APP_HUBSPOT_DRIVE_ID
```

## 🎮 **Déploiement Manuel (Makefile)**

### **🚀 Commandes Principales**
```bash
# Déploiement normal (avec tests)
make deploy-prod       # Production
make deploy-staging    # Staging  
make deploy-dev        # Development

# Déploiement d'urgence (sans tests)
make deploy-prod-skip-tests
make deploy-staging-skip-tests
make deploy-dev-skip-tests
```

### **🔄 Workflow Complet**
```bash
# Workflow de release
make release           # Tests + Build + Validation
make deploy-staging    # Test en staging
make deploy-prod       # Deploy en production
```

## 🤖 **CI/CD Automatique**

### **🎯 GitHub Actions Workflow**
```yaml
# Déclencheurs
on:
  push:
    branches: [main, develop, staging]
  pull_request:
    branches: [main, develop]

# Jobs
jobs:
  determine-environment  # Déterminer env selon branche
  test                  # Tests Playwright (skippable)
  deploy               # Build + Deploy vers Netlify
```

### **⚡ Simplification avec Makefile**
**Avant (146 lignes):**
```yaml
- run: npm ci
- run: npm test -- --watchAll=false --ci
- run: npm run build
- run: npx playwright install --with-deps
- run: npx serve -s build -l 5173 &
- run: npx wait-on http://127.0.0.1:5173
- run: npx playwright test --reporter=github
```

**Après (124 lignes - 15%):**
```yaml
- run: make ci-setup
- run: make ci-test
- run: make build
- run: make deploy-prod
```

## 🚨 **Skip Tests (Déploiement d'Urgence)**

### **🔥 Méthode 1 : Makefile Local**
```bash
# Bypass immédiat depuis votre machine
make deploy-prod-skip-tests
# ⚡ Déploie en 2-3 minutes
```

### **📝 Méthode 2 : Message de Commit**
```bash
# Skip automatique via message
git commit -m "hotfix: correction urgente [skip tests]"
git push origin main
# ⚡ CI détecte et skip les tests
```

### **🔧 Méthode 3 : Variable GitHub**
```
GitHub → Settings → Variables → New
Name: SKIP_TESTS
Value: true
# ⚡ Tous les pushes skipperont les tests
```

### **📊 Comparaison Méthodes Skip**
| Méthode | Temps | Scope | Cas d'Usage |
|---------|-------|-------|-------------|
| **Makefile** | Immédiat | Local | 🆘 Hotfix critique |
| **Message** | 3-5 min | Un commit | 📝 Fix ponctuel |
| **Variable** | Permanent | Tous commits | 🚧 Dev intensif |

## 🔒 **Secrets et Configuration**

### **🏗️ GitHub Environments**
1. **Créer environments** : Settings → Environments
   - `production` (protection main branch)
   - `staging` (protection staging branch)  
   - `development` (open access)

2. **Ajouter secrets par environment** :
   ```
   REACT_APP_FORM_PASSWORD
   REACT_APP_WEBHOOK_URL
   REACT_APP_WEBHOOK_URL_FILES
   REACT_APP_SUBMISSION_STATUS_WEBHOOK
   REACT_APP_HUBSPOT_COMPANY_ID
   REACT_APP_HUBSPOT_DEAL_ID
   REACT_APP_HUBSPOT_CONTACT_ID
   REACT_APP_HUBSPOT_DRIVE_ID
   NETLIFY_AUTH_TOKEN
   NETLIFY_SITE_ID
   ```

### **🌐 Netlify Configuration**
```bash
# Variables requises
NETLIFY_AUTH_TOKEN    # Token d'API Netlify
NETLIFY_SITE_ID       # ID du site Netlify

# Commandes de déploiement
netlify deploy --prod --dir=build                    # Production
netlify deploy --alias=staging --dir=build           # Staging
netlify deploy --alias=dev --dir=build              # Development
```

## 📊 **Monitoring et Debug**

### **🔍 Logs GitHub Actions**
```yaml
# Logs détaillés disponibles
✅ determine-environment
⏭️  test (skipped si SKIP_TESTS=true)
✅ deploy
  └── 🚀 CI Setup (via Makefile)
  └── 🧪 Run CI Tests (via Makefile)
  └── 🏗️ Build (via Makefile)
  └── 🚀 Deploy to Netlify
```

### **🎯 Artifacts**
```yaml
# Sauvegardés automatiquement
playwright-artifacts/
├── playwright-report/    # Rapport HTML
├── test-results/        # Screenshots + vidéos
└── error-context.md     # Contexte d'erreurs
```

### **📈 Status Checks**
- **Tests Required** : Configurable par branche
- **Environment Protection** : Rules par environment  
- **Auto-deploy** : Triggers par branche

## 🛠️ **Maintenance et Dépannage**

### **🔄 Reset Pipeline**
```bash
# En cas de problème CI
git commit --allow-empty -m "trigger rebuild"
git push origin main
```

### **🔧 Debug Local**
```bash
# Reproduire le CI en local
make ci-setup
make ci-test

# Vérifier build
make build
make preview
```

### **📊 Vérification Déploiement**
```bash
# Check des environnements
curl https://app.yourdomain.com/health
curl https://staging--app.netlify.app/health
curl https://dev--app.netlify.app/health
```

## 🎯 **Workflow Types**

### **🚀 Release Normale**
```bash
# Develop → Staging → Production
git checkout develop
# ... développement ...
git checkout staging
git merge develop
git push origin staging    # Deploy auto staging

git checkout main  
git merge staging
git push origin main       # Deploy auto production
```

### **🆘 Hotfix Urgent**
```bash
# Direct sur main avec skip tests
git checkout main
# ... fix critique ...
git commit -m "hotfix: critical fix [skip tests]"
git push origin main       # Deploy immédiat
```

### **🚧 Feature Development**
```bash
# Feature branch avec tests disabled
# 1. Set SKIP_TESTS=true sur GitHub
git checkout -b feature/new-feature
# ... développement intensif ...
git push origin feature/new-feature  # Pas de tests

# 2. Avant merge, réactiver tests
# Set SKIP_TESTS=false
git checkout develop
git merge feature/new-feature
git push origin develop               # Avec tests
```

## 📈 **Métriques et Performance**

### **⚡ Temps de Déploiement**
| Type | Temps | Étapes |
|------|-------|---------|
| **Avec tests** | 8-12 min | Setup + Tests + Build + Deploy |
| **Skip tests** | 3-5 min | Setup + Build + Deploy |
| **Local skip** | 2-3 min | Build + Deploy direct |

### **🎯 Optimisations**
- **Cache npm** : `cache: npm` dans GitHub Actions
- **Playwright cache** : Navigateurs en cache
- **Build cache** : Réutilisation des builds
- **Chrome only** : Tests CI optimisés

**Votre pipeline est maintenant robuste et flexible ! 🚀**
