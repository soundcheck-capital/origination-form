# Guide de Debug - Risk Score

## 🔍 Affichage automatique en développement

### Dans l'étape 2 du formulaire

Quand vous êtes en mode développement (`NODE_ENV=development`), un panneau de debug s'affiche automatiquement sous le montant d'avance :

```
🔍 Risk Score Debug (Dev Only)
Years in Business: 0 pts    Number of Events: 0 pts
Payment Remitted By: 1 pts  Payment Frequency: 0 pts

Total Risk Score: 1 / 24
Max Advance %: 10.0%
Raw Amount: $200,000
```

### Dans la console du navigateur

Des logs détaillés s'affichent automatiquement quand le calcul se fait :

```
🏦 Underwriting Calculation Breakdown
📊 Inputs: { yearsInBusiness: "10+ years", ... }
🎯 Risk Score Breakdown: { yearsInBusiness: "0 pts (10+ years)", ... }
📈 Risk Assessment: { riskBand: "Low Risk (0-6)", ... }
💰 Final Calculation: { rawAmount: "$200,000", ... }
```

## 🛠️ Outils de debug manuels

### Calculateur rapide dans la console

Vous pouvez tester n'importe quelle combinaison directement dans la console :

```javascript
// Exemple 1: Client à faible risque
window.calculateRisk({
  yearsInBusiness: '10+ years',
  numberOfEvents: 50,
  paymentRemittedBy: 'From the Ticketing Co (e.g. Ticketmaster)',
  paymentFrequency: 'Daily',
  grossAnnualTicketSales: 2000000
});

// Exemple 2: Client à haut risque
window.calculateRisk({
  yearsInBusiness: 'Less than 1 year',
  numberOfEvents: 1,
  paymentRemittedBy: 'From the Venue (e.g. MSG)',
  paymentFrequency: 'Post event',
  grossAnnualTicketSales: 1000000
});
```

## 📊 Interprétation des scores

### Scores individuels

- **Years in Business**: 0-5 points (moins d'expérience = plus de risque)
- **Number of Events**: 0-9 points (moins d'événements = plus de risque)
- **Payment Remitted By**: 1-5 points (venue = plus risqué que ticketing co)
- **Payment Frequency**: 0-5 points (post-event = plus risqué que daily)

### Bandes de risque

- **0-6 points**: Low Risk → 10% max advance
- **6.01-12 points**: Medium-Low Risk → 7.5% max advance  
- **12.01-18 points**: Medium-High Risk → 5% max advance
- **18.01-24 points**: High Risk → 2.5% max advance

### Plafonnement

- Montant maximum: $500,000
- Si le calcul dépasse, il est automatiquement plafonné

## 🚫 En production

Tous ces outils de debug sont automatiquement désactivés en production pour :
- Éviter d'exposer la logique métier
- Maintenir des performances optimales
- Garder une interface utilisateur propre
