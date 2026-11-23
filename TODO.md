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

## Secret Plaid exposé dans le bundle public

`REACT_APP_PLAID_SECRET` (Netlify, projet `stagging-application-form`, site `application.soundcheckcapital.com`)
est compilé dans le JavaScript servi aux navigateurs : sa valeur a été retrouvée dans le bundle.
`REACT_APP_PLAID_CLIENT_ID` aussi. Le front n'en a pas besoin : les appels Plaid passent par les webhooks n8n
`plaid/create-link-token` et `plaid/exchange-token`.

1. Sami régénère le secret chez Plaid (et met à jour la credential n8n qui l'utilise).
2. Supprimer les deux variables dans Netlify (le code ne les lit pas, vérifié le 23/11/2026).
3. Redéployer, puis chercher la valeur de l'ancien secret dans le nouveau bundle : elle ne doit plus y être.

Le site étant désactivé, l'exposition ne vaut que pour les bundles déjà servis ; la régénération reste nécessaire.

## Uploads lents (n8n `API /uploadFiles (2.0)`, id `GMu5PNtQQO0cwwLs`)

Le workflow ne répond qu'une fois le fichier déposé dans le Drive : ~4 s par fichier, 10 fichiers obligatoires.
L'ancien scénario Make répondait « Accepted » tout de suite. À choisir :

- réponse immédiate (rapide, mais le formulaire ne voit plus les échecs, et des uploads simultanés peuvent créer
  des dossiers Drive en double) ;
- ou accélérer le workflow actuel.

Appelants vérifiés le 23/11/2026 : ce formulaire seulement. `express-form` déclare `N8N_UPLOAD_FILES_WEBHOOK_URL`
sans la lire, `fast-ticketon-form` uploade directement dans le Drive, et les 31 exécutions n8n du workflow sont
toutes des tests de migration (Playwright local, curl).

## Resoumission d'un client existant (n8n `API /submitForm (2.0)`, id `Q07X7an0VFDRBqpv`)

Quand la société existe déjà dans HubSpot, `List Company Deals` → `IF Deal Found` → `Update HubSpot Deal`
met à jour son premier deal : il est renommé et remis à l'étape `1116419733`. Voulu : créer un **nouveau** deal
associé à la société existante, sans toucher aux deals existants. Procédure : `n8n-backup/MEMORY.md`
(copie de test, accord explicite, publication, commit du JSON).
