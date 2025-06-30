# Configuration Google Drive API (Transparente)

## Approche transparente

L'upload vers Google Drive est maintenant **complètement transparent** pour l'utilisateur :
- ✅ **Aucune popup d'authentification**
- ✅ **Aucune mention de Google Drive**
- ✅ **L'utilisateur pense que tout passe par Make.com**
- ✅ **Upload automatique en arrière-plan**

## Étape 1 : Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un existant
3. Notez l'ID du projet

## Étape 2 : Activer l'API Google Drive

1. Dans le menu, allez à "APIs & Services" > "Library"
2. Recherchez "Google Drive API"
3. Cliquez dessus et activez-la

## Étape 3 : Créer un Service Account

1. Dans "APIs & Services" > "Credentials"
2. Cliquez "Create Credentials" > "Service Account"
3. Remplissez les informations :
   - Nom : `soundcheck-drive-service`
   - Description : `Service account pour l'upload de fichiers`
4. Cliquez "Create and Continue"
5. Cliquez "Done"

## Étape 4 : Créer et télécharger la clé

1. Cliquez sur le Service Account créé
2. Allez dans l'onglet "Keys"
3. Cliquez "Add Key" > "Create new key"
4. Sélectionnez "JSON"
5. Cliquez "Create"
6. Le fichier JSON se télécharge automatiquement

## Étape 5 : Créer une clé API

1. Dans "APIs & Services" > "Credentials"
2. Cliquez "Create Credentials" > "API Key"
3. Notez la **API Key**

## Étape 6 : Créer le dossier Google Drive

1. Allez sur [Google Drive](https://drive.google.com/)
2. Créez un dossier nommé "SoundCheck Applications"
3. Clic droit sur le dossier > "Partager" > "Partager avec d'autres"
4. Ajoutez l'email du Service Account avec les droits "Éditeur"
5. Copiez l'ID du dossier depuis l'URL

## Étape 7 : Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Google Drive API Configuration (Service Account)
REACT_APP_GOOGLE_API_KEY=your_google_api_key_here
REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
REACT_APP_GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
REACT_APP_GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here

# Webhook URL
REACT_APP_WEBHOOK_URL=https://hook.us1.make.com/jgqcxlbrh75heny8znuyj8uel2de92hm
```

**Important** : Le `PRIVATE_KEY` doit être entre guillemets et avec les `\n` pour les retours à la ligne.

## Étape 8 : Extraire les informations du fichier JSON

Dans le fichier JSON téléchargé, vous trouverez :

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "soundcheck-drive-service@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

Utilisez :
- `client_email` pour `REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` pour `REACT_APP_GOOGLE_PRIVATE_KEY`

## Étape 9 : Tester la configuration

1. Redémarrez votre serveur de développement
2. Allez sur votre formulaire
3. Uploadez des fichiers et soumettez
4. Vous devriez voir "Envoi en cours..." sans mention de Google Drive

## Structure des données envoyées au webhook

Le webhook recevra toujours la même structure, mais l'upload sera transparent :

```json
{
  "applicationId": "new",
  "submittedAt": "2024-01-01T12:00:00.000Z",
  "userAgent": "Mozilla/5.0...",
  "formData": {
    "personalInfo": { ... },
    "companyInfo": { ... },
    // ... autres données
  },
  "googleDriveFiles": {
    "ticketingCompanyReport": [
      {
        "success": true,
        "fileId": "1ABC123...",
        "webViewLink": "https://drive.google.com/file/d/1ABC123.../view",
        "originalName": "report.pdf",
        "originalSize": 1024000,
        "originalType": "application/pdf"
      }
    ]
  },
  "fileMetadata": {
    // Métadonnées originales des fichiers
  }
}
```

## Avantages de cette approche

✅ **Transparent** : L'utilisateur ne sait pas qu'on utilise Google Drive
✅ **Pas de popup** : Aucune authentification requise
✅ **Rapide** : Upload direct sans friction
✅ **Sécurisé** : Service Account dédié
✅ **Contrôlé** : Vous gérez tous les fichiers
✅ **Organisé** : Dossier dédié automatique

## Expérience utilisateur

1. **Upload des fichiers** : Normal, comme avant
2. **Soumission** : Bouton "Submit Application"
3. **Progression** : "Envoi en cours..." (pas de mention Google Drive)
4. **Succès** : "Application submitted successfully!"
5. **Redirection** : Vers la page de succès

L'utilisateur pense que tout passe par Make.com, mais en réalité :
- Les fichiers sont uploadés vers Google Drive
- Les liens sont envoyés au webhook Make.com
- Make.com peut traiter les liens pour les stocker ou les organiser

## Dépannage

### Erreur "Service Account not found"
- Vérifiez l'email du Service Account
- Assurez-vous que le Service Account a accès au dossier

### Erreur "Invalid private key"
- Vérifiez que la clé privée est entre guillemets
- Assurez-vous que les `\n` sont présents

### Erreur "Folder not found"
- Vérifiez l'ID du dossier Google Drive
- Assurez-vous que le Service Account a les droits d'accès 