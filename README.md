# 🚀 Origination Form - SoundCheck Capital

Une application React moderne pour la collecte et gestion des demandes de financement SoundCheck Capital, avec intégration Make.com.

## ⚡ **Démarrage Ultra-Rapide**

```bash
# Installation
make install && make dev
```

L'application sera disponible sur [http://localhost:3001](http://localhost:3001).

## 📚 **Documentation Complète**

📖 **Documentation**

## 🎮 **Commandes Principales**

```bash
# 🚀 Développement
make dev               # Serveur de développement

# 🚀 Déploiement
make deploy-prod       # Production

# 🔧 Maintenance
make help              # Toutes les commandes
make clean && make install   # Reset complet
```

## 🏗️ **Architecture Moderne**

### **🎯 Stack Technique**
- **Frontend** : React 18 + TypeScript + Redux Toolkit
- **CI/CD** : GitHub Actions + Netlify multi-environnements
- **Backend** : Make.com webhooks + HubSpot
- **Build** : Makefile standardisé + cache optimisé

### **🔒 Sécurité & Robustesse**
- **Double blocage** : Local + Backend centralisé
- **Protection formulaire** après soumission
- **Validation multi-niveaux** : Client + Serveur
- **Fallback gracieux** en cas d'erreurs

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
| `develop` | 🔵 Development | `dev--app.netlify.app` | Complets |

## 🛠️ **Développement**

### **🎯 Workflow Quotidien**
```bash
# Développement
make dev               # Serveur + watch
```

### **📁 Structure Projet**
```
src/
├── components/        # Composants + steps
├── store/            # Redux (auth + form)  
├── hooks/            # Hooks personnalisés
├── services/         # API + submission service
└── utils/            # Helpers

documentation/        # Docs organisées
├── README.md        # Index principal
├── 04-makefile.md   # Commandes
├── 05-deployment.md # CI/CD
└── 07-form-blocking.md # Sécurité
```

## 🎯 **Pour Bien Commencer**

### **👨‍💻 Développeur**
1. `make install` → Installation complète
2. `make dev` → Démarrer développement

### **🚀 DevOps**
1. **[Guide Deployment](./documentation/05-deployment.md)**
2. **[Environnements](./documentation/06-environments.md)**
3. `make deploy-staging` → Déploiement staging

### **🔒 Sécurité**
1. **[Blocage Formulaire](./documentation/07-form-blocking.md)**
2. **[Intégration Backend](./documentation/08-backend-integration.md)**

### **🆘 Support**
- **Reset** : `make clean-all && make install`
- **Aide** : `make help`

---

## 📊 **Métriques**

- **📝 Formulaire** : 10 étapes + 50+ champs
- **⚡ Performance** : < 3s chargement
- **📱 Responsive** : Mobile + Desktop
- **🔒 Sécurité** : Double validation + blocage
- **🚀 Deploy** : Automatisé

**Application prête pour la production ! 🎉**
