# 📚 Documentation - Origination Form

## 🎯 **Vue d'Ensemble**

Cette documentation couvre tous les aspects du projet : développement, tests, déploiement et architecture.

## 📋 **Index de la Documentation**

### **🚀 Pour Commencer**
- [**Setup & Installation**](./01-setup.md) - Installation et configuration initiale
- [**Développement**](./02-development.md) - Workflow de développement quotidien

### **🧪 Tests & Qualité**
- [**Tests E2E avec Playwright**](./03-testing.md) - Guide complet des tests
- [**Makefile & Commandes**](./04-makefile.md) - Toutes les commandes disponibles

### **🚀 Déploiement & CI/CD**
- [**CI/CD & Déploiements**](./05-deployment.md) - Pipeline et déploiements
- [**Environnements**](./06-environments.md) - Configuration multi-environnements

### **🔒 Sécurité & Contrôles**
- [**Blocage de Formulaire**](./07-form-blocking.md) - Système de blocage après soumission
- [**Intégration Backend**](./08-backend-integration.md) - Connexion avec Make.com

### **🛠️ Technique & Architecture**
- [**Intégration Webhooks**](./09-webhooks.md) - Configuration Make.com
- [**Migration & Historique**](./10-migration.md) - Historique des changements
- [**Upload Immédiat de Fichiers**](./12-immediate-file-upload.md) - Architecture d'upload en temps réel

## 🎮 **Commandes Rapides**

```bash
# Setup complet
make setup

# Développement
make dev

# Tests
make test              # Tous les tests
make test-step1        # Tests d'une étape
make test-chrome       # Chrome uniquement

# Déploiement
make deploy-prod       # Production avec tests
make deploy-prod-skip-tests  # Production sans tests

# Aide
make help              # Toutes les commandes
make examples          # Exemples d'utilisation
```

## 🆘 **Support Rapide**

### **🐛 Problème de Tests**
```bash
make test-debug        # Mode debug
make test-ui          # Interface graphique
```

### **🚀 Déploiement d'Urgence**
```bash
make deploy-prod-skip-tests
# ou commit avec [skip tests]
```

### **🔧 Reset Complet**
```bash
make clean-all && make setup
```

## 📞 **Contact & Aide**

- **Tests** : Voir `./03-testing.md`
- **Déploiement** : Voir `./05-deployment.md`  
- **Makefile** : `make help`
- **Debug** : Voir `./07-form-blocking.md`

---

*Documentation maintenue à jour - Dernière mise à jour: $(date)*
