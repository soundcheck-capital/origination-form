# Intégration Webhook avec Gestion des Fichiers

## Architecture de gestion des fichiers

### Pourquoi cette approche ?

Les objets `File` ne doivent pas être stockés dans Redux car ils contiennent :
- Des références internes non sérialisables
- Des méthodes et propriétés complexes
- Des données binaires volumineuses

### Solution implémentée

1. **Gestion locale des fichiers** : Les fichiers sont stockés localement dans le contexte React
2. **FormData pour l'envoi** : Utilisation de `FormData` pour envoyer les fichiers au webhook
3. **Métadonnées dans Redux** : Seules les métadonnées des fichiers sont stockées dans Redux

## Structure technique

### 1. Contexte DiligenceFilesContext

```typescript
// src/contexts/DiligenceFilesContext.tsx
interface DiligenceFiles {
  ticketingCompanyReport: { files: File[]; fileInfos: FileInfo[] };
  ticketingServiceAgreement: { files: File[]; fileInfos: FileInfo[] };
  financialStatements: { files: File[]; fileInfos: FileInfo[] };
  bankStatement: { files: File[]; fileInfos: FileInfo[] };
  incorporationCertificate: { files: File[]; fileInfos: FileInfo[] };
  legalEntityChart: { files: File[]; fileInfos: FileInfo[] };
  governmentId: { files: File[]; fileInfos: FileInfo[] };
  einAuthentication: { files: File[]; fileInfos: FileInfo[] };
}
```

### 2. Types mis à jour

```typescript
// src/store/form/formTypes.ts
export interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

// Remplacement de File[] par FileInfo[] dans diligenceInfo
diligenceInfo: {
  ticketingCompanyReport: FileInfo[];
  ticketingServiceAgreement: FileInfo[];
  // ... autres champs
}
```

### 3. Composant FileUploadField

```typescript
// src/components/customComponents/FileUploadField.tsx
interface FileUploadFieldProps {
  field: string;
  description: string;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesChange?: (fileInfos: FileInfo[]) => void;
}
```

## Envoi des données

### Structure FormData envoyée

```typescript
const formDataObj = new FormData();

// Métadonnées de l'application
formDataObj.append('applicationId', 'new');
formDataObj.append('submittedAt', '2024-01-01T12:00:00.000Z');
formDataObj.append('userAgent', 'Mozilla/5.0...');

// Données du formulaire (JSON)
formDataObj.append('formData', JSON.stringify({
  personalInfo: { ... },
  companyInfo: { ... },
  // ... autres données
}));

// Métadonnées des fichiers (JSON)
formDataObj.append('fileMetadata', JSON.stringify({
  ticketingCompanyReport: [
    {
      id: 'file-1234567890-0',
      name: 'report.pdf',
      size: 1024000,
      type: 'application/pdf',
      uploadedAt: '2024-01-01T12:00:00.000Z'
    }
  ],
  // ... autres fichiers
}));

// Fichiers réels
formDataObj.append('ticketingCompanyReport_0', fileObject);
formDataObj.append('financialStatements_0', fileObject);
formDataObj.append('financialStatements_1', fileObject);
// ... etc
```

### URL du webhook

```
https://hook.us1.make.com/jgqcxlbrh75heny8znuyj8uel2de92hm
```

## Avantages de cette approche

### ✅ **Performance**
- Pas de stockage de fichiers volumineux dans Redux
- Pas de re-renders inutiles lors de l'upload
- Gestion locale efficace

### ✅ **Sécurité**
- Fichiers envoyés directement au webhook
- Pas de stockage temporaire côté client
- Contrôle total sur les données envoyées

### ✅ **Maintenabilité**
- Séparation claire des responsabilités
- Code modulaire et réutilisable
- Types TypeScript stricts

### ✅ **Flexibilité**
- Possibilité d'ajouter des validations côté client
- Gestion d'erreurs granulaire
- Extension facile pour de nouveaux types de fichiers

## Configuration Make.com

### Structure des données reçues

Le webhook Make.com recevra :

1. **applicationId** : Identifiant de l'application
2. **submittedAt** : Timestamp de soumission
3. **userAgent** : Navigateur de l'utilisateur
4. **formData** : Toutes les données du formulaire (JSON)
5. **fileMetadata** : Métadonnées de tous les fichiers (JSON)
6. **Fichiers individuels** : Chaque fichier avec un nom unique

### Exemple de traitement dans Make.com

```javascript
// Récupération des données
const applicationId = data.applicationId;
const formData = JSON.parse(data.formData);
const fileMetadata = JSON.parse(data.fileMetadata);

// Traitement des fichiers
const files = [];
for (const [key, value] of Object.entries(data)) {
  if (key.includes('_') && value instanceof File) {
    files.push({
      field: key.split('_')[0],
      index: key.split('_')[1],
      file: value
    });
  }
}
```

## Gestion des erreurs

- **Upload de fichiers** : Validation côté client avant envoi
- **Envoi webhook** : Retry automatique en cas d'échec
- **Feedback utilisateur** : Messages d'erreur clairs et informatifs

## Code conservé

L'ancien code d'API est conservé en commentaires pour une utilisation future :

```typescript
// OLD CODE - KEPT FOR LATER USE
/*
const handleSubmit = async () => {
  try {
    await dispatch(saveApplication());
    navigate('/dashboard');
  } catch (error) {
    setSaveMessage('Failed to submit application. Please try again.');
  }
};
*/
```

## Configuration actuelle

Le formulaire envoie maintenant toutes les données vers le webhook Make.com au lieu d'utiliser l'API existante.

### URL du webhook
```
https://hook.us1.make.com/jgqcxlbrh75heny8znuyj8uel2de92hm
```

## Structure des données envoyées

### Métadonnées de l'application
```json
{
  "applicationId": "new" | "existing-id",
  "submittedAt": "2024-01-01T12:00:00.000Z",
  "userAgent": "Mozilla/5.0..."
}
```

### Informations personnelles
```json
{
  "personalInfo": {
    "email": "user@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "phone": "+1234567890",
    "role": "Owner"
  }
}
```

### Informations de l'entreprise
```json
{
  "companyInfo": {
    "employees": 10,
    "name": "Company Name",
    "dba": "DBA Name",
    "yearsInBusiness": "5-10",
    "socials": "Social media links",
    "clientType": "Venue",
    "taxId": "123456789",
    "legalEntityType": "LLC",
    "companyAddress": "123 Main St",
    "companyCity": "New York",
    "companyState": "NY",
    "companyZipCode": "10001",
    "companyType": "Venue",
    "ein": "12-3456789",
    "stateOfIncorporation": "NY"
  }
}
```

### Informations de ticketing
```json
{
  "ticketingInfo": {
    "currentPartner": "Partner Name",
    "settlementPolicy": "Policy details",
    "membership": "Membership type"
  }
}
```

### Informations de volume
```json
{
  "volumeInfo": {
    "lastYearEvents": 50,
    "lastYearTickets": 10000,
    "lastYearSales": 500000,
    "nextYearEvents": 60,
    "nextYearTickets": 12000,
    "nextYearSales": 600000
  }
}
```

### Informations de propriété
```json
{
  "ownershipInfo": {
    "owners": [
      {
        "id": "1",
        "name": "Owner Name",
        "ownershipPercentage": "100",
        "sameAddress": true,
        "ownerAddress": "123 Main St",
        "ownerCity": "New York",
        "ownerState": "NY",
        "ownerZipCode": "10001"
      }
    ]
  }
}
```

### Informations financières
```json
{
  "financesInfo": {
    "singleEntity": true,
    "assetsTransferred": false,
    "filedLastYearTaxes": true,
    "lastYearTaxes": [],
    "hasTicketingDebt": false,
    "hasBusinessDebt": true,
    "debts": [
      {
        "type": "Credit card debt",
        "balance": "50000"
      }
    ],
    "hasOverdueLiabilities": false,
    "isLeasingLocation": true,
    "leaseEndDate": "2025-12-31",
    "hasTaxLiens": false,
    "hasJudgments": false,
    "hasBankruptcy": false,
    "ownershipChanged": false
  }
}
```

### Informations de diligence (fichiers)
```json
{
  "diligenceInfo": {
    "ticketingCompanyReport": [
      {
        "name": "report.pdf",
        "size": 1024000,
        "type": "application/pdf",
        "lastModified": 1704067200000
      }
    ],
    "ticketingServiceAgreement": [],
    "financialStatements": [],
    "bankStatement": [],
    "incorporationCertificate": [],
    "legalEntityChart": [],
    "governmentId": [],
    "einAuthentication": []
  }
}
```

### Informations de financement
```json
{
  "fundsInfo": {
    "yourFunds": "100000",
    "otherFunds": "50000",
    "recoupmentPeriod": "12 months",
    "recoupmentPercentage": "10%",
    "fundUse": "Working capital",
    "timeForFunding": "30 days",
    "recoupableAgainst": "Ticket sales"
  }
}
```

### Informations utilisateur (si disponible)
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com"
  }
}
```

## Gestion des fichiers

Les fichiers sont convertis en métadonnées pour le webhook :
- **Nom du fichier**
- **Taille** (en bytes)
- **Type MIME**
- **Date de dernière modification**

Les fichiers eux-mêmes ne sont pas envoyés via le webhook pour des raisons de sécurité et de performance.

## Gestion des erreurs

- **Succès** : Message de confirmation et redirection après 2 secondes
- **Erreur** : Message d'erreur affiché à l'utilisateur
- **Logs** : Erreurs détaillées dans la console du navigateur

## Configuration Make.com

Pour configurer le webhook dans Make.com :
1. Créer un nouveau scénario
2. Ajouter un webhook HTTP
3. Utiliser l'URL fournie
4. Configurer les actions suivantes selon vos besoins (email, base de données, etc.) 