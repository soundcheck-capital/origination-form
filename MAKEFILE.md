# 🛠️ Makefile - Guide d'Utilisation

## 🎯 Avantages du Makefile

### **✅ Standardisation**
- **Commandes unifiées** : `make test` au lieu de `npm run test:e2e`
- **Indépendant des scripts npm** : Fonctionne même si `package.json` change
- **Compatible tous OS** : Linux, macOS, Windows (avec make installé)

### **✅ CI/CD Agnostique**
- **GitHub Actions** : `run: make ci-test`
- **GitLab CI** : `script: make ci-test`
- **Jenkins** : `sh 'make ci-test'`
- **Local** : `make test`

### **✅ Documentation Intégrée**
- **Auto-documenté** : `make help` affiche toutes les commandes
- **Exemples inclus** : `make examples`
- **Couleurs et emojis** : Interface claire et lisible

## 🚀 Utilisation Rapide

### **🎬 Démarrage**
```bash
# Setup complet du projet
make setup

# Développement
make dev
```

### **🧪 Tests**
```bash
# Tous les tests
make test

# Tests par étape
make test-step1        # Personal Info
make test-step2        # Company Info
make test-step3        # Ticketing (avec volume)
# ... jusqu'à test-step10

# Tests par catégorie
make test-components   # Tests des composants
make test-api         # Tests des API calls
make test-flows       # Tests des flux complets

# Tests par navigateur
make test-chrome      # Chrome uniquement
make test-firefox     # Firefox uniquement
make test-mobile      # Chrome + Safari mobile
```

### **🔧 Maintenance**
```bash
# Avant commit
make pre-commit       # Lint + Format + Tests Chrome

# Nettoyage
make clean           # Fichiers temporaires
make clean-all       # + node_modules
make reset           # Clean + reinstall
```

### **🚀 Déploiement**
```bash
# Build
make build

# Déploiements
make deploy-dev      # Netlify dev
make deploy-staging  # Netlify staging
make deploy-prod     # Netlify production

# Release complète
make release         # Tests + Build + Vérifications
```

## 📋 Commandes Disponibles

### **📦 Installation & Setup**
| Commande | Description |
|----------|-------------|
| `make install` | Installer les dépendances npm |
| `make install-browsers` | Installer les navigateurs Playwright |
| `make setup` | Setup complet (npm + navigateurs) |

### **🚀 Développement**
| Commande | Description |
|----------|-------------|
| `make dev` | Serveur de développement (port 3001) |
| `make build` | Build de production |
| `make preview` | Prévisualiser le build |

### **🧪 Tests E2E**
| Commande | Description |
|----------|-------------|
| `make test` | Tous les tests E2E |
| `make test-ui` | Interface graphique Playwright |
| `make test-debug` | Mode debug |
| `make test-headed` | Navigateur visible |
| `make test-watch` | Mode watch (auto-relance) |

### **🧪 Tests par Étape**
| Commande | Étape | Description |
|----------|-------|-------------|
| `make test-step1` | 1 | Personal Info |
| `make test-step2` | 2 | Company Info |
| `make test-step3` | 3 | Ticketing + Volume |
| `make test-step4` | 4 | Your Funds |
| `make test-step5` | 5 | Ownership |
| `make test-step6` | 6 | Finances |
| `make test-step7` | 7 | Ticketing Information |
| `make test-step8` | 8 | Financial Information |
| `make test-step9` | 9 | Legal Information |
| `make test-step10` | 10 | Additional Information |

### **🧪 Tests par Navigateur**
| Commande | Navigateur |
|----------|-----------|
| `make test-chrome` | Chrome Desktop |
| `make test-firefox` | Firefox Desktop |
| `make test-webkit` | Safari Desktop |
| `make test-mobile` | Chrome + Safari Mobile |

### **🔧 Outils**
| Commande | Description |
|----------|-------------|
| `make lint` | Vérification ESLint |
| `make format` | Formatage Prettier |
| `make clean` | Nettoyer temp files |
| `make test-report` | Ouvrir rapport HTML |

## 🎮 Exemples d'Utilisation

### **🚀 Workflow Développement**
```bash
# Première fois
make setup
make dev

# Tests pendant développement
make test-step3          # Tester l'étape en cours
make test-chrome         # Tests rapides Chrome
```

### **🧪 Workflow Tests**
```bash
# Tests complets
make test                # Tous les tests
make full-test          # Tests par catégorie

# Tests spécifiques
make test-grep PATTERN="Personal Info"
make test-step5         # Ownership uniquement
```

### **🚀 Workflow CI/CD**
```bash
# Dans GitHub Actions
- name: Setup
  run: make ci-setup

- name: Tests
  run: make ci-test

- name: Deploy
  run: make deploy-prod
```

### **🔧 Workflow Maintenance**
```bash
# Avant commit
make pre-commit         # Lint + Format + Tests

# Reset complet
make reset              # Clean + reinstall

# Release
make release            # Tests + Build complet
```

## 🔍 Debug et Diagnostic

### **🔍 Commandes de Debug**
```bash
# Statut du projet
make status

# Variables d'environnement
make debug-env

# Aide contextuelle
make help
make examples
```

### **🧪 Tests avec Options**
```bash
# Tests avec pattern
make test-grep PATTERN="API calls"

# Mise à jour des screenshots
make test-update-snapshots

# Mode watch (interface graphique)
make test-watch
```

## 🏗️ Structure du Makefile

### **🎨 Organisation**
```makefile
# 📋 Aide et documentation
help, examples

# 📦 Installation & Setup  
install, setup, check-node

# 🚀 Développement
dev, build, preview

# 🧪 Tests (organisés par type)
test-*, test-step*, test-chrome*

# 🔧 Outils et maintenance
lint, format, clean

# 🚀 Déploiement
deploy-*, ci-*, release
```

### **🎨 Fonctionnalités**
- **Auto-documentation** : `## 🧪` dans les commentaires
- **Couleurs** : Variables `RED`, `GREEN`, `BLUE`
- **Validation** : Vérification Node.js
- **Flexibilité** : Variables configurables

## 🚀 Intégration CI/CD

### **GitHub Actions**
```yaml
- name: Tests
  run: make ci-test

- name: Deploy
  run: make deploy-prod
```

### **GitLab CI**
```yaml
script:
  - make ci-test
  - make deploy-staging
```

### **Jenkins**
```groovy
sh 'make ci-setup'
sh 'make ci-test'
sh 'make deploy-prod'
```

## 💡 Bonnes Pratiques

### **🎯 Développement Local**
1. `make setup` une seule fois
2. `make dev` pour démarrer
3. `make test-stepX` pour tester en cours de dev
4. `make pre-commit` avant de commiter

### **🧪 Tests**
1. `make test-chrome` pour des tests rapides
2. `make test` pour la validation complète
3. `make test-ui` pour le debug visuel
4. `make test-grep PATTERN="..."` pour des tests spécifiques

### **🚀 Déploiement**
1. `make release` pour valider avant deploy
2. `make deploy-staging` pour tester
3. `make deploy-prod` pour la production

**Le Makefile rend votre workflow plus professionnel et portable ! 🎯**
