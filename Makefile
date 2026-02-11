# ============================================================================
# 🎯 Origination Form - Makefile
# ============================================================================
# Commandes standardisées pour le développement et le déploiement
# Indépendant des scripts npm et compatible avec tous les environnements

.PHONY: help install dev build clean lint format deploy

# Variables
NODE_VERSION := 24
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
	@echo "$(GREEN)✅ Nettoyage terminé$(NC)"

clean-all: clean ## 🔧 Nettoyage complet (y compris node_modules)
	@echo "$(BLUE)🧹 Nettoyage complet...$(NC)"
	rm -rf node_modules/
	@echo "$(GREEN)✅ Nettoyage complet terminé$(NC)"

reset: clean-all install ## 🔧 Reset complet du projet
	@echo "$(GREEN)🔄 Reset terminé !$(NC)"

# ============================================================================
# 🚀 DÉPLOIEMENT ET CI
# ============================================================================

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

# ============================================================================
# 💡 AIDE CONTEXTUELLE
# ============================================================================

examples: ## 💡 Exemples d'utilisation
	@echo "$(BLUE)💡 Exemples d'utilisation$(NC)"
	@echo ""
	@echo "$(YELLOW)🚀 Développement rapide:$(NC)"
	@echo "  make install && make dev"
	@echo ""
	@echo "$(YELLOW)🔧 Maintenance:$(NC)"
	@echo "  make clean && make install"
	@echo ""
	@echo "$(YELLOW)🚀 Déploiement:$(NC)"
	@echo "  make deploy-dev           # Version de dev"

# Définir la target par défaut
.DEFAULT_GOAL := help
