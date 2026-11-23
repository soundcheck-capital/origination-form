# TODO

## Projet en pause (23/11/2026)

L'origination form n'est pas utilisé pour l'instant. Rien n'est réparé tant qu'il n'est pas repris.

## CI Playwright cassée (`.github/workflows/playwright-pr.yml`, job `e2e-prod-critical-path`)

Dernier passage vert : août 2026. Deux causes :

1. **Runner** : `ubuntu-latest` = Ubuntu 26.04 ; Playwright 1.56.1 refuse d'y installer Chromium
   (« Playwright does not support chromium on ubuntu26.04-x64 »). Fix : `runs-on: ubuntu-24.04` ou monter Playwright.
2. **Secrets GitHub** : ils pointent encore vers les webhooks Make (désactivés). Remplacer par
   `https://soundcheck-capital.app.n8n.cloud/webhook/` + :
   - `REACT_APP_WEBHOOK_URL` → `api/submitForm`
   - `REACT_APP_WEBHOOK_URL_FILES` → `api/uploadFiles`
   - `REACT_APP_SEND_SUMMARY` → `api/sendSummary`
   - `REACT_APP_CHECK_PASSWORD_CUSTOMER_LINK_WEBHOOK` → `api/checkPassword`
   - `REACT_APP_PLAID_LINK_TOKEN_URL` → `plaid/create-link-token`
   - `REACT_APP_PLAID_WEBHOOK_URL` → `plaid/exchange-token`

**À décider avant de réparer** : le job joue le parcours complet sur les vrais systèmes à chaque PR
(société « GENERIC E2E » dans HubSpot, fichiers dans le Drive LEADS, e-mail récap avec credit@ et hello@ en copie,
notif Slack) et consomme ~25 exécutions n8n par passage (quota épuisé le 23/11/2026 → 32 min de coupure des webhooks).
Options :

- (a) réparer tel quel ;
- (b) ne garder en automatique que `tests/plaid-connection.spec.ts`, le parcours complet en `workflow_dispatch` ;
- (c) supprimer le job.

Notes : les tests e2e attendent déjà le webhook d'upload n8n (PR #72). En local, tester sur le build de production
servi en statique (`npm start` bloque l'étape fichiers avec « Script error »).
