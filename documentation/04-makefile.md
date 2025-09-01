# 🛠️ Makefile - Commandes & Migration

## 🎯 **Vue d'Ensemble**

Le Makefile centralise toutes les commandes du projet, rendant le workflow standardisé et portable.

## 🚀 **Commandes Principales**

### **📦 Installation & Setup**
```bash
make setup              # Setup complet (npm + navigateurs)
make install            # Installer les dépendances npm
make install-browsers   # Installer navigateurs Playwright
```

### **🚀 Développement**
```bash
make dev               # Serveur de développement (port 3001)
make build             # Build de production
make preview           # Prévisualiser le build
```

### **🧪 Tests**
```bash
# Tests principaux
make test              # Tous les tests E2E
make test-ui           # Interface graphique Playwright
make test-debug        # Mode debug
make test-chrome       # Chrome uniquement
make test-firefox      # Firefox uniquement
make test-mobile       # Tests mobiles

# Tests par étape
make test-step1        # Personal Info
make test-step2        # Company Info
make test-step3        # Ticketing + Volume
make test-step4        # Your Funds
make test-step5        # Ownership
make test-step6        # Finances
make test-step7        # Ticketing Information
make test-step8        # Financial Information
make test-step9        # Legal Information
make test-step10       # Additional Information

# Tests par catégorie
make test-components   # Tests des composants
make test-api         # Tests des API calls
make test-flows       # Tests des flux complets
make test-navigation  # Tests de navigation
```

### **🚀 Déploiement**
```bash
# Déploiement normal (avec tests)
make deploy-prod       # Production
make deploy-staging    # Staging
make deploy-dev        # Développement

# Déploiement sans tests (urgence)
make deploy-prod-skip-tests
make deploy-staging-skip-tests
make deploy-dev-skip-tests
```

### **🔧 Maintenance**
```bash
make clean             # Nettoyer fichiers temporaires
make clean-all         # Nettoyage complet
make reset             # Reset complet du projet
make pre-commit        # Vérifications avant commit
make release           # Release complète
```

### **🤖 CI/CD**
```bash
make ci-setup          # Setup pour environnement CI
make ci-test           # Tests pour CI (Chrome uniquement)
```

## 💡 **Exemples d'Utilisation**

### **🚀 Workflow Développement**
```bash
# Première fois
make setup
make dev

# Tests pendant développement
make test-step3        # Tester l'étape en cours
make test-chrome       # Tests rapides
```

### **🧪 Workflow Tests**
```bash
# Tests complets
make test              # Tous les tests
make full-test         # Tests par catégorie

# Tests spécifiques
make test-grep PATTERN="Personal Info"
make test-step5        # Ownership uniquement
```

### **🆘 Workflow Urgence**
```bash
# Hotfix critique
make deploy-prod-skip-tests

# Reset si problème
make reset
```

## 📊 **Migration CI/CD**

### **Avant - GitHub Actions (146 lignes)**
```yaml
- name: Install deps
  run: npm ci
- name: Unit tests
  run: npm test -- --watchAll=false --ci
- name: Build
  run: npm run build
- name: Install Playwright
  run: npx playwright install --with-deps
- name: Start server
  run: npx serve -s build -l 5173 &
- name: Wait for server
  run: npx wait-on http://127.0.0.1:5173
- name: Run tests
  run: npx playwright test --reporter=github
```

### **Après - Avec Makefile (124 lignes - 15%)**
```yaml
- name: 🚀 CI Setup
  run: make ci-setup
- name: 🧪 Tests
  run: make ci-test
- name: 🏗️ Build
  run: make build
- name: 🚀 Deploy
  run: make deploy-prod
```

### **Avantages de la Migration**
- **75% moins d'étapes** dans le CI
- **Standardisation** : même commandes partout
- **Portabilité** : GitHub, GitLab, Jenkins, local
- **Maintenance** : une source de vérité

## 🎮 **Commandes Avancées**

### **Tests avec Options**
```bash
# Tests en mode watch
make test-watch

# Mise à jour screenshots
make test-update-snapshots

# Tests avec pattern spécifique
make test-grep PATTERN="API calls"
```

### **Debug et Diagnostic**
```bash
make status            # Statut du projet
make debug-env         # Variables d'environnement
make test-report       # Ouvrir rapport HTML
make test-trace        # Ouvrir traces Playwright
```

### **Workflows Complets**
```bash
make full-test         # Suite complète
make pre-commit        # Avant commit
make release           # Release complète
```

## 🔧 **Personnalisation**

### **Variables Configurables**
```makefile
NODE_VERSION := 18     # Version Node requise
PORT := 3001          # Port de dev
NPM := npm            # Gestionnaire de packages
```

### **Ajout de Commandes**
```makefile
# Exemple d'ajout
my-command: ## 🎯 Ma commande personnalisée
	@echo "Ma commande"
	npm run my-script
```

## 🎯 **Bonnes Pratiques**

### **Développement Local**
1. `make setup` une seule fois
2. `make dev` pour démarrer
3. `make test-stepX` pour tester en cours
4. `make pre-commit` avant de commit

### **Tests**
1. `make test-chrome` pour rapidité
2. `make test` pour validation complète
3. `make test-ui` pour debug visuel

### **Déploiement**
1. `make release` pour valider
2. `make deploy-staging` pour tester
3. `make deploy-prod` pour production

## 📈 **Comparaison Avant/Après**

| Aspect | Avant | Après | Gain |
|--------|--------|-------|------|
| **Lignes CI** | 146 | 124 | -15% |
| **Étapes** | 8 | 2 | -75% |
| **Maintenance** | Difficile | Simple | ✅ |
| **Portabilité** | GitHub only | Tous CI | ✅ |

**Le Makefile rend le projet plus professionnel et maintenable ! 🎯**
