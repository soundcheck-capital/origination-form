# Intégration Webhook Make.com (Approche Simple)

## 🎯 **Solution simplifiée**

Nous avons simplifié l'approche pour envoyer directement les fichiers à Make.com sans passer par Google Drive. Cette solution est :

- ✅ **Plus simple** : Pas de configuration Google Drive complexe
- ✅ **Plus rapide** : Upload direct vers Make.com
- ✅ **Plus fiable** : Moins de points de défaillance
- ✅ **Transparente** : L'utilisateur ne voit que "Envoi en cours..."

## 📋 **Configuration requise**

### 1. Créer un webhook dans Make.com

1. Allez sur [Make.com](https://www.make.com/)
2. Créez un nouveau scénario
3. Ajoutez un module "Webhook" comme déclencheur
4. Copiez l'URL du webhook

### 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
REACT_APP_WEBHOOK_URL=https://hook.us1.make.com/jgqcxlbrh75heny8znuyj8uel2de92hm
```

### 3. Redémarrer le serveur

```bash
npm start
```

## 🔄 **Flux de données**

### Avant (avec Google Drive) :
1. Upload fichiers → Google Drive
2. Récupérer liens → Envoyer à Make.com
3. Make.com traite les liens

### Maintenant (direct) :
1. Upload fichiers → Make.com directement
2. Make.com reçoit les fichiers
3. Make.com peut les traiter et les stocker

## 📊 **Structure des données reçues**

Make.com recevra un `FormData` avec :

### Données du formulaire :
```json
{
  "applicationId": "new",
  "userAgent": "Mozilla/5.0...",
  "personalInfo": { ... },
  "companyInfo": { ... },
  "ticketingInfo": { ... },
  "volumeInfo": { ... },
  "ownershipInfo": { ... },
  "financesInfo": { ... },
  "fundsInfo": { ... },
  "diligenceInfo": {
    "ticketingCompanyReport": {
      "files": [],
      "fileInfos": [
        {
          "id": "file-1234567890-0",
          "name": "report.pdf",
          "size": 1024000,
          "type": "application/pdf",
          "uploadedAt": "2024-01-01T12:00:00.000Z"
        }
      ]
    },
    "financialStatements": {
      "files": [],
      "fileInfos": [
        {
          "id": "file-1234567890-1",
          "name": "statements.xlsx",
          "size": 2048000,
          "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "uploadedAt": "2024-01-01T12:00:00.000Z"
        }
      ]
    }
  },
  "user": { "id": "123", "email": "user@example.com" }
}
```

### Fichiers :
- `ticketingCompanyReport[0]` : Fichier 1
- `ticketingCompanyReport[1]` : Fichier 2
- `financialStatements[0]` : Fichier 1
- `legalDocuments[0]` : Fichier 1
- etc.

## 🛠 **Configuration Make.com**

### Module Webhook (Déclencheur)
- **Type** : Webhook
- **Méthode** : POST
- **Content-Type** : `multipart/form-data`

### Traitement des fichiers
Vous pouvez ajouter des modules pour :

1. **Stocker les fichiers** :
   - Google Drive
   - Dropbox
   - OneDrive
   - FTP
   - etc.

2. **Traiter les données** :
   - Envoyer un email de confirmation
   - Créer une entrée dans une base de données
   - Notifier une équipe
   - etc.

### Exemple de scénario Make.com avec boucle

```
Webhook → Parse JSON → Iterator (diligenceInfo) → Google Drive → Email → Database
```

#### Configuration détaillée :

**1. Webhook (Déclencheur)**
```
URL: https://hook.us1.make.com/jgqcxlbrh75heny8znuyj8uel2de92hm
Méthode: POST
Content-Type: multipart/form-data
```

**2. Parse JSON**
```
Parse: {{formData}}
```

**3. Iterator (Boucle sur diligenceInfo)**
```
Collection: {{diligenceInfo}}
```

**4. Google Drive (Stockage)**
```
Action: Upload a file
Folder: SoundCheck Applications/{{item.key}}
File: {{item.value.files[0]}}
```

**5. Email (Notification)**
```
To: admin@soundcheck.com
Subject: Nouvelle demande SoundCheck - {{personalInfo.firstname}} {{personalInfo.lastname}}
Body: |
  Une nouvelle demande a été soumise :
  
  Nom: {{personalInfo.firstname}} {{personalInfo.lastname}}
  Email: {{personalInfo.email}}
  Entreprise: {{companyInfo.name}}
  
  Fichiers uploadés:
  {{#each diligenceInfo}}
  - {{@key}}: {{fileInfos.length}} fichier(s)
  {{/each}}
```

## 🎨 **Expérience utilisateur**

1. **Upload des fichiers** : Normal
2. **Soumission** : "Submit Application"
3. **Progression** : "Envoi en cours..." (barre de progression)
4. **Succès** : "Application submitted successfully!"
5. **Redirection** : Page de succès

## 🔧 **Avantages de cette approche**

✅ **Simplicité** : Une seule configuration (webhook URL)
✅ **Fiabilité** : Moins de dépendances externes
✅ **Flexibilité** : Make.com peut traiter les fichiers comme vous voulez
✅ **Performance** : Upload direct, pas d'intermédiaire
✅ **Maintenance** : Moins de code à maintenir

## 🚨 **Limitations**

⚠️ **Taille des fichiers** : Limite de Make.com (généralement 100MB par fichier)
⚠️ **Timeout** : Limite de temps pour l'upload (généralement 30 secondes)
⚠️ **Dépendance** : Nécessite que Make.com soit disponible

## 🛠 **Dépannage**

### Erreur "Failed to submit application"
- Vérifiez l'URL du webhook
- Assurez-vous que Make.com est accessible
- Vérifiez les logs de Make.com

### Fichiers manquants
- Vérifiez que les fichiers ne dépassent pas la limite de taille
- Assurez-vous que le webhook accepte `multipart/form-data`

### Timeout
- Réduisez la taille des fichiers
- Optimisez le scénario Make.com

## 📝 **Exemple de configuration Make.com**

### 1. Webhook (Déclencheur)
```
URL: https://hook.us1.make.com/votre-id
Méthode: POST
Content-Type: multipart/form-data
```

### 2. Parse JSON (Optionnel)
```
Parse: {{formData}}
```

### 3. Iterator (Boucle sur diligenceInfo)
```
Collection: {{diligenceInfo}}
```

### 4. Google Drive (Stockage)
```
Action: Upload a file
Folder: SoundCheck Applications/{{item.key}}
File: {{item.value.files[0]}}
```

### 5. Email (Notification)
```
To: admin@soundcheck.com
Subject: Nouvelle demande SoundCheck
Body: Une nouvelle demande a été soumise...
```

Cette approche est beaucoup plus simple et vous donne le contrôle total sur le traitement des fichiers dans Make.com ! 