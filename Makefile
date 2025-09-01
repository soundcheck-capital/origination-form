# ============================================================================
# 🎯 Origination Form - Makefile
# ============================================================================
# Commandes standardisées pour le développement, les tests et le déploiement
# Indépendant des scripts npm et compatible avec tous les environnements

.PHONY: help install dev build test clean lint format deploy

# Variables
NODE_VERSION := 18
NPM := npm
PORT := 3001

# Couleurs pour l'affichage
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
NC := \033[0m # No Color

# ============================================================================
# 📋 AIDE ET DOCUMENTATION
# ============================================================================

help: ## 📋 Afficher l'aide
	@echo "$(BLUE)🎯 Origination Form - Commandes Disponibles$(NC)"
	@echo ""
	@echo "$(YELLOW)📦 INSTALLATION & SETUP$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## .*📦/ {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(YELLOW)🚀 DÉVELOPPEMENT$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## .*🚀/ {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(YELLOW)🧪 TESTS$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## .*🧪/ {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(YELLOW)🔧 OUTILS$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## .*🔧/ {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(YELLOW)🚀 DÉPLOIEMENT$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## .*🚀/ {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# ============================================================================
# 📦 INSTALLATION & SETUP
# ============================================================================

check-node: ## 📦 Vérifier la version de Node.js
	@echo "$(BLUE)🔍 Vérification de Node.js...$(NC)"
	@node --version | grep -q "v$(NODE_VERSION)" || (echo "$(RED)❌ Node.js $(NODE_VERSION) requis$(NC)" && exit 1)
	@echo "$(GREEN)✅ Node.js version OK$(NC)"

install: check-node ## 📦 Installer les dépendances
	@echo "$(BLUE)📦 Installation des dépendances...$(NC)"
	$(NPM) ci
	@echo "$(GREEN)✅ Dépendances installées$(NC)"

install-browsers: ## 📦 Installer les navigateurs Playwright
	@echo "$(BLUE)🌐 Installation des navigateurs Playwright...$(NC)"
	npx playwright install
	@echo "$(GREEN)✅ Navigateurs installés$(NC)"

setup: install install-browsers ## 📦 Setup complet du projet
	@echo "$(GREEN)🎉 Setup terminé !$(NC)"

# ============================================================================
# 🚀 DÉVELOPPEMENT
# ============================================================================

dev: ## 🚀 Démarrer le serveur de développement
	@echo "$(BLUE)🚀 Démarrage du serveur de développement...$(NC)"
	PORT=$(PORT) $(NPM) start

build: ## 🚀 Build de production
	@echo "$(BLUE)🏗️  Build de production...$(NC)"
	$(NPM) run build
	@echo "$(GREEN)✅ Build terminé$(NC)"

preview: build ## 🚀 Prévisualiser le build
	@echo "$(BLUE)👀 Prévisualisation du build...$(NC)"
	npx serve -s build -l $(PORT)

# ============================================================================
# 🧪 TESTS PLAYWRIGHT
# ============================================================================

test: ## 🧪 Lancer tous les tests E2E
	@echo "$(BLUE)🧪 Lancement des tests E2E...$(NC)"
	$(NPM) run test:e2e

test-ui: ## 🧪 Tests E2E avec interface graphique
	@echo "$(BLUE)🧪 Tests E2E avec UI...$(NC)"
	$(NPM) run test:e2e:ui

test-debug: ## 🧪 Tests E2E en mode debug
	@echo "$(BLUE)🔍 Tests E2E en mode debug...$(NC)"
	$(NPM) run test:e2e:debug

test-headed: ## 🧪 Tests E2E avec navigateur visible
	@echo "$(BLUE)🧪 Tests E2E headed...$(NC)"
	$(NPM) run test:e2e:headed

# Tests par catégorie
test-components: ## 🧪 Tests des composants
	@echo "$(BLUE)🧪 Tests des composants...$(NC)"
	$(NPM) run test:components

test-api: ## 🧪 Tests des appels API
	@echo "$(BLUE)🧪 Tests API...$(NC)"
	$(NPM) run test:api

test-flows: ## 🧪 Tests des flux complets
	@echo "$(BLUE)🧪 Tests des flux...$(NC)"
	$(NPM) run test:flows

# Tests par étape (1-10)
test-step1: ## 🧪 Tests étape 1 (Personal Info)
	@echo "$(BLUE)🧪 Tests étape 1 - Personal Info...$(NC)"
	$(NPM) run test:step1

test-step2: ## 🧪 Tests étape 2 (Company Info)
	@echo "$(BLUE)🧪 Tests étape 2 - Company Info...$(NC)"
	$(NPM) run test:step2

test-step3: ## 🧪 Tests étape 3 (Ticketing)
	@echo "$(BLUE)🧪 Tests étape 3 - Ticketing...$(NC)"
	$(NPM) run test:step3

test-step4: ## 🧪 Tests étape 4 (Your Funds)
	@echo "$(BLUE)🧪 Tests étape 4 - Your Funds...$(NC)"
	$(NPM) run test:step4

test-step5: ## 🧪 Tests étape 5 (Ownership)
	@echo "$(BLUE)🧪 Tests étape 5 - Ownership...$(NC)"
	$(NPM) run test:step5

test-step6: ## 🧪 Tests étape 6 (Finances)
	@echo "$(BLUE)🧪 Tests étape 6 - Finances...$(NC)"
	$(NPM) run test:step6

test-step7: ## 🧪 Tests étape 7 (Ticketing Information)
	@echo "$(BLUE)🧪 Tests étape 7 - Ticketing Information...$(NC)"
	$(NPM) run test:step7

test-step8: ## 🧪 Tests étape 8 (Financial Information)
	@echo "$(BLUE)🧪 Tests étape 8 - Financial Information...$(NC)"
	$(NPM) run test:step8

test-step9: ## 🧪 Tests étape 9 (Legal Information)
	@echo "$(BLUE)🧪 Tests étape 9 - Legal Information...$(NC)"
	$(NPM) run test:step9

test-step10: ## 🧪 Tests étape 10 (Additional Information)
	@echo "$(BLUE)🧪 Tests étape 10 - Additional Information...$(NC)"
	$(NPM) run test:step10

test-navigation: ## 🧪 Tests de navigation
	@echo "$(BLUE)🧪 Tests de navigation...$(NC)"
	$(NPM) run test:navigation

# Tests avec options spécifiques
test-chrome: ## 🧪 Tests sur Chrome uniquement
	@echo "$(BLUE)🧪 Tests Chrome...$(NC)"
	npx playwright test --project=chromium

test-firefox: ## 🧪 Tests sur Firefox uniquement
	@echo "$(BLUE)🧪 Tests Firefox...$(NC)"
	npx playwright test --project=firefox

test-webkit: ## 🧪 Tests sur WebKit uniquement
	@echo "$(BLUE)🧪 Tests WebKit...$(NC)"
	npx playwright test --project=webkit

test-mobile: ## 🧪 Tests mobiles
	@echo "$(BLUE)🧪 Tests mobiles...$(NC)"
	npx playwright test --project="Mobile Chrome" --project="Mobile Safari"

# ============================================================================
# 🔧 OUTILS ET MAINTENANCE
# ============================================================================

lint: ## 🔧 Vérifier le code (ESLint)
	@echo "$(BLUE)🔧 Vérification du code...$(NC)"
	$(NPM) run lint 2>/dev/null || echo "$(YELLOW)⚠️  Pas de script lint configuré$(NC)"

format: ## 🔧 Formatter le code (Prettier)
	@echo "$(BLUE)🔧 Formatage du code...$(NC)"
	$(NPM) run format 2>/dev/null || npx prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,md}"

clean: ## 🔧 Nettoyer les fichiers temporaires
	@echo "$(BLUE)🧹 Nettoyage...$(NC)"
	rm -rf build/
	rm -rf node_modules/.cache/
	rm -rf test-results/
	rm -rf playwright-report/
	@echo "$(GREEN)✅ Nettoyage terminé$(NC)"

clean-all: clean ## 🔧 Nettoyage complet (y compris node_modules)
	@echo "$(BLUE)🧹 Nettoyage complet...$(NC)"
	rm -rf node_modules/
	@echo "$(GREEN)✅ Nettoyage complet terminé$(NC)"

reset: clean-all install ## 🔧 Reset complet du projet
	@echo "$(GREEN)🔄 Reset terminé !$(NC)"

# Reports et logs
test-report: ## 🔧 Générer et ouvrir le rapport de tests
	@echo "$(BLUE)📊 Génération du rapport...$(NC)"
	npx playwright show-report

test-trace: ## 🔧 Ouvrir les traces des tests
	@echo "$(BLUE)🔍 Ouverture des traces...$(NC)"
	npx playwright show-trace

# ============================================================================
# 🚀 DÉPLOIEMENT ET CI
# ============================================================================

ci-setup: ## 🚀 Setup pour l'environnement CI
	@echo "$(BLUE)🤖 Setup CI...$(NC)"
	$(NPM) ci
	npx playwright install --with-deps chromium

ci-test: ## 🚀 Tests pour l'environnement CI
	@echo "$(BLUE)🤖 Tests CI...$(NC)"
	CI=true npx playwright test --project=chromium

deploy-dev: build ## 🚀 Déployer en développement
	@echo "$(BLUE)🚀 Déploiement dev...$(NC)"
	npx netlify deploy --dir=build --alias=dev

deploy-dev-skip-tests: ## 🚀 Déployer en dev SANS tests
	@echo "$(YELLOW)⚠️  Déploiement dev SANS tests...$(NC)"
	@$(MAKE) build
	npx netlify deploy --dir=build --alias=dev

deploy-staging: build ## 🚀 Déployer en staging
	@echo "$(BLUE)🚀 Déploiement staging...$(NC)"
	npx netlify deploy --dir=build --alias=staging

deploy-staging-skip-tests: ## 🚀 Déployer en staging SANS tests
	@echo "$(YELLOW)⚠️  Déploiement staging SANS tests...$(NC)"
	@$(MAKE) build
	npx netlify deploy --dir=build --alias=staging

ahdeploy-prod: build ## 🚀 Déployer en production
	@echo "$(BLUE)🚀 Déploiement production...$(NC)"
	npx netlify deploy --dir=build --prod

deploy-prod-skip-tests: ## 🚀 Déployer en production SANS tests
	@echo "$(YELLOW)⚠️  Déploiement production SANS tests...$(NC)"
	@$(MAKE) build
	npx netlify deploy --dir=build --prod

# ============================================================================
# 🏃‍♂️ WORKFLOWS COMPLETS
# ============================================================================

full-test: ## 🧪 Suite de tests complète
	@echo "$(BLUE)🧪 Suite de tests complète...$(NC)"
	@$(MAKE) test-components
	@$(MAKE) test-api
	@$(MAKE) test-flows
	@echo "$(GREEN)✅ Tous les tests terminés$(NC)"

pre-commit: ## 🔧 Vérifications avant commit
	@echo "$(BLUE)🔧 Vérifications avant commit...$(NC)"
	@$(MAKE) lint
	@$(MAKE) format
	@$(MAKE) test-chrome
	@echo "$(GREEN)✅ Prêt pour commit$(NC)"

release: ## 🚀 Processus de release complet
	@echo "$(BLUE)🚀 Processus de release...$(NC)"
	@$(MAKE) clean
	@$(MAKE) install
	@$(MAKE) full-test
	@$(MAKE) build
	@echo "$(GREEN)🎉 Release prête !$(NC)"

# ============================================================================
# 🔍 DEBUG ET DIAGNOSTIC
# ============================================================================

debug-env: ## 🔍 Afficher les variables d'environnement
	@echo "$(BLUE)🔍 Variables d'environnement$(NC)"
	@echo "NODE_VERSION: $(NODE_VERSION)"
	@echo "PORT: $(PORT)"
	@echo "PWD: $(PWD)"
	@node --version
	@npm --version

status: ## 🔍 Statut du projet
	@echo "$(BLUE)📊 Statut du projet$(NC)"
	@echo "$(YELLOW)📁 Structure:$(NC)"
	@ls -la | head -10
	@echo "$(YELLOW)📦 Package.json:$(NC)"
	@test -f package.json && echo "✅ Présent" || echo "❌ Manquant"
	@echo "$(YELLOW)🧪 Tests:$(NC)"
	@test -d tests && echo "✅ Dossier tests présent" || echo "❌ Dossier tests manquant"
	@echo "$(YELLOW)🌐 Playwright:$(NC)"
	@test -f playwright.config.ts && echo "✅ Configuration présente" || echo "❌ Configuration manquante"

# ============================================================================
# 🎮 COMMANDES AVANCÉES
# ============================================================================

test-watch: ## 🧪 Tests en mode watch (relance automatique)
	@echo "$(BLUE)👀 Tests en mode watch...$(NC)"
	npx playwright test --ui

test-update-snapshots: ## 🧪 Mettre à jour les captures d'écran
	@echo "$(BLUE)📸 Mise à jour des snapshots...$(NC)"
	npx playwright test --update-snapshots

test-grep: ## 🧪 Lancer un test spécifique (usage: make test-grep PATTERN="nom du test")
	@echo "$(BLUE)🔍 Test grep: $(PATTERN)$(NC)"
	npx playwright test --grep "$(PATTERN)"

# Exemple d'usage des variables
# make test-grep PATTERN="Personal Info"

# ============================================================================
# 💡 AIDE CONTEXTUELLE
# ============================================================================

examples: ## 💡 Exemples d'utilisation
	@echo "$(BLUE)💡 Exemples d'utilisation$(NC)"
	@echo ""
	@echo "$(YELLOW)🚀 Développement rapide:$(NC)"
	@echo "  make setup && make dev"
	@echo ""
	@echo "$(YELLOW)🧪 Tests spécifiques:$(NC)"
	@echo "  make test-step1           # Tester l'étape 1"
	@echo "  make test-chrome          # Chrome uniquement"
	@echo "  make test-grep PATTERN=\"Personal Info\""
	@echo ""
	@echo "$(YELLOW)🔧 Maintenance:$(NC)"
	@echo "  make clean && make install"
	@echo "  make pre-commit           # Avant de commiter"
	@echo ""
	@echo "$(YELLOW)🚀 Déploiement:$(NC)"
	@echo "  make deploy-dev           # Version de dev"
	@echo "  make release              # Release complète"

# Définir la target par défaut
.DEFAULT_GOAL := help
