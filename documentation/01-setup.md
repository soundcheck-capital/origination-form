# 🚀 Setup & Installation

## 🎯 **Installation Rapide**

### **⚡ Méthode Recommandée (Makefile)**
```bash
# Installation complète en une commande
make setup

# Démarrage développement
make dev
```

### **📦 Méthode Classique (npm)**
```bash
# Installation dépendances
npm install

# Installation navigateurs Playwright
npx playwright install

# Démarrage
npm start
```

## ⚙️ **Configuration**

### **🔑 Variables d'Environnement**
```bash
# Copier le template
cp env.example .env

# Éditer les variables
REACT_APP_FORM_PASSWORD=your_secure_password
REACT_APP_WEBHOOK_URL=https://hook.us1.make.com/your_webhook
REACT_APP_WEBHOOK_URL_FILES=https://hook.us1.make.com/your_files_webhook
REACT_APP_SUBMISSION_STATUS_WEBHOOK=https://hook.us1.make.com/your_status_webhook
```

### **🌐 Netlify (Déploiement)**
```bash
# Installation CLI Netlify
npm install -g netlify-cli

# Variables requises pour deploy
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_site_id
```

## 🔧 **Prérequis**

### **💻 Système**
- **Node.js** : Version 18+ recommandée
- **npm** : Version 8+
- **Git** : Pour le versioning
- **Make** : Pour les commandes (inclus sur macOS/Linux)

### **🌐 Navigateurs (Tests)**
```bash
# Automatique avec make setup
make install-browsers

# Ou manuel
npx playwright install
```

## 🎮 **Première Utilisation**

### **1. Configuration Initiale**
```bash
# Clone + setup
git clone [repo-url]
cd origination-form
make setup
```

### **2. Configuration Variables**
```bash
# Copier template
cp env.example .env

# Éditer avec vos URLs Make.com
code .env  # ou votre éditeur
```

### **3. Test de Fonctionnement**
```bash
# Démarrer développement
make dev

# Dans un autre terminal - test rapide
make test-chrome
```

### **4. Accès Application**
- **URL** : http://localhost:3001
- **Mot de passe** : Celui défini dans `REACT_APP_FORM_PASSWORD`

## 🔍 **Vérification Installation**

### **✅ Checklist Setup**
```bash
# Vérifier Node.js
make check-node

# Statut du projet
make status

# Variables d'environnement
make debug-env

# Test simple
make test-chrome
```

### **🎯 Réponses Attendues**
```bash
$ make check-node
✅ Node.js version OK

$ make status
📊 Statut du projet
📁 Structure: ✅
📦 Package.json: ✅ Présent
🧪 Tests: ✅ Dossier tests présent
🌐 Playwright: ✅ Configuration présente

$ make test-chrome
# Tests doivent passer (peuvent être longs la première fois)
```

## 🛠️ **Développement**

### **🚀 Commandes Quotidiennes**
```bash
# Démarrer dev server
make dev

# Tests pendant développement
make test-step1        # Tester une étape
make test-chrome       # Tests rapides

# Avant commit
make pre-commit        # Lint + format + tests
```

### **📁 Structure Recommandée**
```
origination-form/
├── .env               # Variables locales (pas commitées)
├── .env.example       # Template variables
├── Makefile          # Commandes standardisées
├── package.json      # Dépendances
├── src/              # Code source
├── tests/            # Tests Playwright
├── documentation/    # Docs organisées
└── README.md         # Guide principal
```

## 🚨 **Dépannage**

### **❌ Problèmes Courants**

**Node.js version incompatible**
```bash
# Installer Node 18+
nvm install 18  # Si vous utilisez nvm
nvm use 18

# Ou télécharger depuis nodejs.org
```

**Variables d'environnement non trouvées**
```bash
# Vérifier le fichier .env existe
ls -la .env

# Vérifier le contenu
cat .env

# Vérifier le préfixe REACT_APP_
grep REACT_APP_ .env
```

**Tests Playwright échouent**
```bash
# Réinstaller navigateurs
make install-browsers

# Ou manuel
npx playwright install --with-deps
```

**Port 3001 occupé**
```bash
# Trouver processus
lsof -i :3001

# Tuer processus
kill -9 [PID]

# Ou utiliser autre port
PORT=3002 make dev
```

### **🔧 Reset Complet**
```bash
# Si problèmes persistants
make clean-all        # Supprime node_modules
make setup           # Réinstalle tout
```

## 🎯 **Configuration Avancée**

### **🔒 GitHub Environments**
Pour CI/CD multi-environnements :

1. **GitHub** → Settings → Environments
2. **Créer** : `production`, `staging`, `development`
3. **Ajouter secrets** par environnement
4. **Protection rules** : Required reviewers pour prod

### **🌐 Netlify Sites**
```bash
# Créer site Netlify
netlify sites:create --name your-app-name

# Configurer variables
netlify env:set REACT_APP_FORM_PASSWORD "your_password" --context production
netlify env:set REACT_APP_WEBHOOK_URL "your_webhook" --context production
```

### **📊 Monitoring**
```bash
# Logs de l'application
make dev  # Voir logs dans terminal

# Logs des tests
make test-ui  # Interface graphique
make test-report  # Rapport HTML

# Debugging
make test-debug  # Mode interactif
```

## ✅ **Validation Setup**

### **🎯 Test Final**
```bash
# Setup complet
make setup

# Test développement
make dev &
curl http://localhost:3001  # Doit répondre

# Test production
make build
make preview &
curl http://localhost:3001

# Tests E2E
make test-chrome  # Doit passer

# Cleanup
make clean
```

### **📋 Checklist Complète**
- [ ] Node.js 18+ installé
- [ ] Projet cloné et `make setup` réussi
- [ ] Fichier `.env` configuré avec vraies valeurs
- [ ] `make dev` démarre sans erreur
- [ ] Application accessible sur http://localhost:3001
- [ ] Connexion possible avec mot de passe
- [ ] `make test-chrome` passe
- [ ] `make build` réussit

**Votre environnement de développement est prêt ! 🎉**
