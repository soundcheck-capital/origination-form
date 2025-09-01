# 🚀 Origination Form - SoundCheck Capital

Une application React moderne pour la collecte et gestion des demandes de financement SoundCheck Capital, avec système de tests E2E complet et intégration Make.com.

## ⚡ **Démarrage Ultra-Rapide**

```bash
# Setup complet en une commande
make setup && make dev

# Ou installation classique
npm install && npm start
```

L'application sera disponible sur [http://localhost:3001](http://localhost:3001).

## 📚 **Documentation Complète**

📖 **[Voir la documentation complète](./documentation/README.md)**

### 🎯 **Guides Rapides**
- [**Tests E2E**](./documentation/03-testing.md)
- [**Commandes Makefile**](./documentation/04-makefile.md)
- [**Déploiement CI/CD**](./documentation/05-deployment.md)
- [**Blocage Formulaire**](./documentation/07-form-blocking.md)
- [**Intégration Backend**](./documentation/08-backend-integration.md)

## 🎮 **Commandes Principales**

```bash
# 🚀 Développement
make dev               # Serveur de développement
make test              # Tests E2E complets
make test-chrome       # Tests rapides

# 🧪 Tests par étape
make test-step1        # Personal Info
make test-step3        # Ticketing + Volume
make test-step5        # Ownership (dynamique)

# 🚀 Déploiement
make deploy-prod       # Production avec tests
make deploy-prod-skip-tests  # Urgence sans tests

# 🔧 Maintenance
make help              # Toutes les commandes
make clean && make setup     # Reset complet
```

## 🏗️ **Architecture Moderne**

### **🎯 Stack Technique**
- **Frontend** : React 18 + TypeScript + Redux Toolkit
- **Tests** : Playwright E2E (10 étapes + API + flows)
- **CI/CD** : GitHub Actions + Netlify multi-environnements
- **Backend** : Make.com webhooks + HubSpot
- **Build** : Makefile standardisé + cache optimisé

### **🔒 Sécurité & Robustesse**
- **Double blocage** : Local + Backend centralisé
- **Protection formulaire** après soumission
- **Validation multi-niveaux** : Client + Serveur
- **Fallback gracieux** en cas d'erreurs

### **📊 Couverture Tests**
- **150+ tests** Playwright automatisés
- **10 étapes** testées individuellement  
- **API mocking** : Soumission + Upload
- **3 jeux de données** : Small/Medium/Large Company
- **Multi-navigateurs** : Chrome, Firefox, Safari, Mobile

## 🎯 **Fonctionnalités Clés**

### **✅ Formulaire Multi-Étapes (10 + Summary)**
1. **Personal Info** - Email, nom, rôle
2. **Company Info** - Entreprise, adresse, employés
3. **Ticketing** - Partenaire + 6 champs volume
4. **Your Funds** - Montant, utilisation, timing
5. **Ownership** - Propriétaires dynamiques (%)
6. **Finances** - Questions conditionnelles + dettes
7. **Ticketing Files** - Upload documents billetterie
8. **Financial Files** - États financiers + relevés
9. **Legal Files** - 5 types de documents légaux
10. **Additional Info** - Références + commentaires
11. **Summary** - Récapitulatif navigable

### **⚡ Système Avancé**
- **Auto-save** : Sauvegarde à chaque changement
- **Data persistence** : Survit aux rechargements
- **Conditional logic** : Champs dynamiques selon réponses
- **File uploads** : Multiple types, validation taille/format
- **Mobile responsive** : Optimisé tous devices

## 🔗 **Intégrations**

### **📤 Make.com Webhooks**
```json
// Données formulaire
POST /webhook/data
{
  "personalInfo": {...},
  "companyInfo": {...},
  "ticketingInfo": {...}
}

// Upload fichiers
POST /webhook/files
FormData with metadata

// Vérification statut
POST /webhook/status
{"hubspotDealId": "123"}
→ {"IsFormSubmitted": "true/false"}
```

### **🎯 HubSpot Integration**
- **Deal tracking** : Lié aux deals HubSpot
- **Contact sync** : Création/mise à jour contacts
- **Pipeline automation** : Déclencheurs selon soumissions

## 🚀 **CI/CD & Déploiements**

### **🌍 Multi-Environnements**
| Branche | Environnement | URL | Tests |
|---------|---------------|-----|-------|
| `main` | 🟢 Production | `app.domain.com` | Complets |
| `staging` | 🟡 Staging | `staging--app.netlify.app` | Complets |
| `develop` | 🔵 Development | `dev--app.netlify.app` | Chrome only |

### **⚡ Pipeline Optimisé**
```
Push → Tests E2E → Build → Deploy
 ↓       ↓         ↓      ↓
2min   8-12min    3min   2min
```

**Total : 15-20 min** (ou 7 min avec skip tests)

## 🛠️ **Développement**

### **🎯 Workflow Quotidien**
```bash
# Setup initial (une fois)
make setup

# Développement
make dev               # Serveur + watch
make test-step3        # Test étape en cours
make pre-commit        # Avant commit

# Debug
make test-ui           # Interface graphique
make test-debug        # Mode debug
```

### **📁 Structure Projet**
```
src/
├── components/        # Composants + steps
├── store/            # Redux (auth + form)  
├── hooks/            # Hooks personnalisés
├── services/         # API + submission service
└── utils/            # Helpers

tests/
├── fixtures/         # Jeux de données
├── utils/           # FormHelper class
└── e2e/             # Tests par catégorie
    ├── steps/       # Tests étapes 1-10
    ├── api/         # Tests API calls
    └── flows/       # Tests flux complets

documentation/        # Docs organisées
├── README.md        # Index principal
├── 03-testing.md    # Guide tests
├── 04-makefile.md   # Commandes
├── 05-deployment.md # CI/CD
└── 07-form-blocking.md # Sécurité
```

## 🎯 **Pour Bien Commencer**

### **👨‍💻 Développeur**
1. `make setup` → Installation complète
2. `make dev` → Démarrer développement  
3. `make test-step1` → Tester une étape
4. **[Guide Testing](./documentation/03-testing.md)** 

### **🚀 DevOps**
1. **[Guide Deployment](./documentation/05-deployment.md)**
2. **[Environnements](./documentation/06-environments.md)**
3. `make deploy-staging` → Test déploiement

### **🔒 Sécurité**
1. **[Blocage Formulaire](./documentation/07-form-blocking.md)**
2. **[Intégration Backend](./documentation/08-backend-integration.md)**

### **🆘 Support**
- **Tests** : `make test-debug`
- **Deploy urgent** : `make deploy-prod-skip-tests`
- **Reset** : `make clean-all && make setup`
- **Aide** : `make help`

---

## 📊 **Métriques**

- **📝 Formulaire** : 10 étapes + 50+ champs
- **🧪 Tests** : 150+ tests automatisés
- **⚡ Performance** : < 3s chargement
- **📱 Responsive** : Mobile + Desktop
- **🔒 Sécurité** : Double validation + blocage
- **🚀 Deploy** : 15 min avec tests, 7 min sans

**Application prête pour la production ! 🎉**