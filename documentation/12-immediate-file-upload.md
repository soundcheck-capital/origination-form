# Upload Immédiat des Fichiers

## 📋 Vue d'ensemble

Le système d'upload de fichiers utilise une architecture d'**upload immédiat** : les fichiers sont uploadés vers Make.com dès que l'utilisateur les sélectionne, plutôt qu'au moment de la soumission finale du formulaire.

## 🎯 Avantages de cette approche

### 1. Feedback immédiat
- L'utilisateur voit immédiatement si son fichier est accepté ou rejeté
- Les erreurs (taille, type, serveur) sont affichées en temps réel
- Meilleure expérience utilisateur avec indicateurs visuels (loading, success, error)

### 2. Soumission finale plus rapide
- Le endpoint de soumission finale ne traite que les données du formulaire
- Pas d'attente pour uploader potentiellement des dizaines de fichiers
- Moins de risques de timeout lors de la soumission

### 3. Meilleure gestion des erreurs
- Les erreurs d'upload sont isolées par fichier
- L'utilisateur peut corriger immédiatement un fichier problématique
- Pas de perte de tout le formulaire si un fichier pose problème

## 🏗 Architecture

### Flux d'upload

```
1. Utilisateur sélectionne un fichier
   ↓
2. Le fichier est ajouté au contexte DiligenceFiles
   ↓
3. Upload immédiat vers Make.com (endpoint fichiers)
   ↓
4. Mise à jour du statut d'upload (uploading → success/error)
   ↓
5. Feedback visuel à l'utilisateur
```

### Flux de soumission finale

```
1. Utilisateur clique sur "Submit"
   ↓
2. Validation du formulaire
   ↓
3. Envoi uniquement des données du formulaire vers Make.com
   ↓
4. Redirection vers la page de succès
```

## 📁 Composants impliqués

### 1. `FileUploadField.tsx`

Composant d'interface pour l'upload de fichiers avec :
- Drag & drop
- Sélection de fichiers
- **Upload immédiat** lors de la sélection
- Feedback visuel par fichier (spinner, checkmark, erreur)

```tsx
// Exemple d'utilisation
<FileUploadField
  field="ticketingCompanyReport"
  title="Ticketing Company Report"
  description="Upload your report files"
  accept=".pdf,.xlsx,.csv"
  multiple={true}
  required={true}
/>
```

### 2. `DiligenceFilesContext.tsx`

Contexte qui gère :
- Le stockage des fichiers et leurs métadonnées
- Le **statut d'upload de chaque fichier** (`pending`, `uploading`, `success`, `error`)
- Les fonctions CRUD pour gérer les fichiers

```tsx
interface FileUploadStatus {
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}
```

### 3. `useFileUpload.ts`

Hook qui fournit :
- `uploadFile(file, fieldName)` - Upload un fichier immédiatement
- `sendFormData(formData)` - Envoie les données du formulaire (sans fichiers)
- `validateFileSize(file)` - Valide la taille du fichier (max 100MB)

### 4. `MultiStepForm.tsx`

Formulaire principal qui :
- N'uploade **plus** les fichiers lors du submit
- Envoie uniquement les données du formulaire via `sendFormData()`

## 🔄 Statuts d'upload

Chaque fichier a un statut qui évolue :

| Statut | Description | Icône | Couleur |
|--------|-------------|-------|---------|
| `pending` | Fichier sélectionné, en attente d'upload | 📄 | Gris |
| `uploading` | Upload en cours | ⏳ (spinner) | Bleu |
| `success` | Upload réussi | ✅ | Vert |
| `error` | Erreur lors de l'upload | ❌ | Rouge |

## 🔌 Endpoints Make.com

### Endpoint d'upload de fichiers

**URL** : `process.env.REACT_APP_WEBHOOK_URL_FILES`

**Méthode** : `POST`

**Content-Type** : `multipart/form-data`

**Payload** :
```
file: [File object]
fieldName: string (ex: "ticketingCompanyReport")
folder: string (ex: "Ticketing Information")
subFolder: string (ex: "Ticketing Report")
```

### Mapping des dossiers Google Drive

Chaque fichier est automatiquement associé à un dossier et sous-dossier :

| fieldName | folder | subFolder |
|-----------|--------|-----------|
| `ticketingCompanyReport` | Ticketing Information | Ticketing Report |
| `ticketingServiceAgreement` | Ticketing Information | Service Agreement |
| `financialStatements` | Financial Information | Financial Statements |
| `bankStatement` | Financial Information | Bank Statements |
| `lastYearTaxes` | Financial Information | Last Year Taxes |
| `incorporationCertificate` | Legal Information | Incorporation Certificate |
| `legalEntityChart` | Legal Information | Legal Entity Chart |
| `governmentId` | Legal Information | Government ID |
| `w9form` | Legal Information | W9 Form |
| `other` | Other Documents | Other |

**Exemple de requête reçue par Make.com** :
```
POST /webhook/file-upload

Content-Type: multipart/form-data

file: [binary data of financial-statement.pdf]
fieldName: "financialStatements"
folder: "Financial Information"
subFolder: "Financial Statements"
```

**Utilisation dans Make.com** :
```javascript
// Récupérer les informations
const file = data.file;
const folder = data.folder; // "Financial Information"
const subFolder = data.subFolder; // "Financial Statements"

// Créer la structure dans Google Drive :
// Root Folder > "Financial Information" > "Financial Statements" > file
```

### Endpoint de soumission du formulaire

**URL** : `process.env.REACT_APP_WEBHOOK_URL`

**Méthode** : `POST`

**Content-Type** : `application/json`

**Payload** :
```json
{
  "formData": {
    "contact": {...},
    "company": {...},
    "deal": {...}
  },
}
```

## 🎨 Feedback visuel

### Pendant l'upload
```
📁 document.pdf
   2.5 MB • application/pdf • Uploading...
   [Spinner bleu animé]
```

### Upload réussi
```
✅ document.pdf
   2.5 MB • application/pdf • Uploaded
   [Checkmark vert]
```

### Erreur d'upload
```
❌ document.pdf
   2.5 MB • application/pdf • Error: File exceeds maximum size
   [Icône d'erreur rouge]
```

## ⚠️ Gestion des erreurs

### Erreurs possibles

1. **Taille de fichier excessive** (> 100MB)
   - Détectée en amont avant l'upload
   - Message : "File exceeds the maximum size of 100MB"

2. **Erreur réseau**
   - Timeout de connexion
   - Serveur indisponible
   - Message : Error message from the server

3. **Erreur serveur**
   - Make.com retourne une erreur
   - Message personnalisé selon la réponse

### Retry

Actuellement, il n'y a pas de retry automatique. L'utilisateur doit :
1. Supprimer le fichier en erreur
2. Le re-sélectionner pour réessayer l'upload

## 🔧 Configuration

### Variables d'environnement requises

```env
# Endpoint pour upload de fichiers
REACT_APP_WEBHOOK_URL_FILES=https://hook.us1.make.com/...

# Endpoint pour soumission du formulaire
REACT_APP_WEBHOOK_URL=https://hook.us1.make.com/...

# Identifiants HubSpot

# Environnement
```

## 📊 Suivi et monitoring

### Dans le code

Les logs suivants sont disponibles dans la console :

```javascript
// Fichier trop volumineux
console.error(`File ${file.name} is too large: ${size}MB (max: 100MB)`)

// Erreur d'upload
console.error(`Error sending file ${file.name}:`, error)

// Avertissement fichier échoué
console.warn(`File upload failed: ${fileName} - ${error}`)
```

### Côté Make.com

Chaque fichier uploadé inclut :
- `fieldName` - Type de document
- Métadonnées HubSpot (company, deal, contact, drive)
- Le fichier lui-même

## 🚀 Améliorations futures possibles

1. **Retry automatique**
   - Réessayer automatiquement en cas d'erreur réseau temporaire
   - Avec exponential backoff

2. **Compression d'images**
   - Compresser automatiquement les images avant upload
   - Réduire la taille des uploads

3. **Upload en parallèle**
   - Uploader plusieurs fichiers simultanément
   - Avec limitation du nombre de requêtes parallèles

4. **Sauvegarde temporaire**
   - Sauvegarder les fichiers uploadés avec succès dans le localStorage
   - Pour éviter de re-uploader après un refresh

5. **Barre de progression globale**
   - Afficher une barre de progression pour tous les fichiers
   - Avec compteur (3/5 fichiers uploadés)

## 📝 Exemples de code

### Upload immédiat dans FileUploadField

```tsx
const uploadFileImmediately = async (file: File, fileIndex: number) => {
  // Validation
  if (!validateFileSize(file)) {
    updateFileUploadStatus(field, fileIndex, {
      status: 'error',
      error: 'File exceeds the maximum size of 100MB'
    });
    return;
  }

  // Upload en cours
  updateFileUploadStatus(field, fileIndex, { status: 'uploading' });

  // Upload
  const result = await uploadFile(file, field);

  // Mise à jour du statut
  if (result.success) {
    updateFileUploadStatus(field, fileIndex, { status: 'success' });
  } else {
    updateFileUploadStatus(field, fileIndex, {
      status: 'error',
      error: result.error || 'Upload failed'
    });
  }
};
```

### Soumission finale simplifiée

```tsx
const handleSubmit = async () => {
  const formDataToSend = {
    contact: {...},
    company: {...},
    deal: {...}
  };

  // Les fichiers sont déjà uploadés individuellement
  // Envoyer uniquement les données du formulaire
  const result = await sendFormData(formDataToSend);

  if (result.success) {
    navigate('/submit-success');
  }
};
```

## 🔗 Fichiers liés

- `src/components/customComponents/FileUploadField.tsx`
- `src/contexts/DiligenceFilesContext.tsx`
- `src/hooks/useFileUpload.ts`
- `src/components/MultiStepForm.tsx`
- `documentation/08-backend-integration.md`
- `documentation/09-webhooks.md`
