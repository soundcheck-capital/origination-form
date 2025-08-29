export interface TestFormData {
  personalInfo: {
    firstname: string;
    lastname: string;
    email: string;
    emailConfirm: string;
    phone: string;
    role: string;
  };
  companyInfo: {
    name: string;
    dba: string;
    clientType: string;
    businessType: string;
    yearsInBusiness: string;
    ein: string;
    companyAddress: string;
    companyCity: string;
    companyState: string;
    companyZipcode: string;
    stateOfIncorporation: string;
    employees: number;
    socials: string;
    memberOf: string;
  };
  ticketingInfo: {
    currentPartner: string;
    settlementPayout: string;
    paymentProcessing: string;
  };
  volumeInfo: {
    lastYearEvents: number;
    lastYearTickets: number;
    lastYearSales: number;
    nextYearEvents: number;
    nextYearTickets: number;
    nextYearSales: number;
  };
  fundsInfo: {
    yourFunds: string;
    useOfProceeds: string;
    timingOfFunding: string;
  };
  ownershipInfo: {
    owners: Array<{
      id: string;
      ownerName: string;
      ownershipPercentage: string;
      ownerAddress: string;
      ownerBirthDate: string;
    }>;
  };
  financesInfo: {
    assetsTransferred?: boolean;
    filedLastYearTaxes?: boolean;
    hasTicketingDebt?: boolean;
    hasBusinessDebt?: boolean;
    hasOverdueLiabilities?: boolean;
    isLeasingLocation?: boolean;
    hasTaxLiens?: boolean;
    hasJudgments?: boolean;
    hasBankruptcy?: boolean;
    ownershipChanged?: boolean;
    leaseEndDate?: string;
    debts?: Array<{
      type: string;
      balance: string;
    }>;
    industryReferences?: string;
    additionalComments?: string;
  };
}

// Jeu de données 1 : Petite entreprise
export const smallCompanyData: TestFormData = {
  personalInfo: {
    firstname: "Jean",
    lastname: "Dupont",
    email: "jean.dupont@petiteentreprise.com",
    emailConfirm: "jean.dupont@petiteentreprise.com",
    phone: "0123456789",
    role: "CEO"
  },
  companyInfo: {
    name: "Petite Entreprise SAS",
    dba: "Petite Entreprise",
    clientType: "Promoter",
    businessType: "LLC",
    yearsInBusiness: "3",
    ein: "123456789",
    companyAddress: "123 Rue de la Paix",
    companyCity: "Paris",
    companyState: "CA",
    companyZipcode: "75001",
    stateOfIncorporation: "CA",
    employees: 5,
    socials: "@petiteentreprise",
    memberOf: "INTIX"
  },
  ticketingInfo: {
    currentPartner: "Eventbrite",
    settlementPayout: "Daily",
    paymentProcessing: "Venue"
  },
  volumeInfo: {
    lastYearEvents: 10,
    lastYearTickets: 500,
    lastYearSales: 25000,
    nextYearEvents: 15,
    nextYearTickets: 750,
    nextYearSales: 37500
  },
  fundsInfo: {
    yourFunds: "50000",
    useOfProceeds: "Show Marketing",
    timingOfFunding: "In the next month"
  },
  ownershipInfo: {
    owners: [{
      id: "1",
      ownerName: "Jean Dupont",
      ownershipPercentage: "100",
      ownerAddress: "123 Rue de la Paix, Paris, 75001",
      ownerBirthDate: "1985-06-15"
    }]
  },
  financesInfo: {
    assetsTransferred: false,
    filedLastYearTaxes: true,
    hasTicketingDebt: false,
    hasBusinessDebt: true,
    hasOverdueLiabilities: false,
    isLeasingLocation: true,
    hasTaxLiens: false,
    hasJudgments: false,
    hasBankruptcy: false,
    ownershipChanged: false,
    leaseEndDate: "2025-12-31",
    debts: [{
      type: "Credit Card",
      balance: "15000"
    }],
    industryReferences: "Local venue owners and sound equipment suppliers in Paris area. Contact: venue@example.com",
    additionalComments: "Small but growing event promotion company focused on intimate venues and emerging artists."
  }
};

// Jeu de données 2 : Moyenne entreprise
export const mediumCompanyData: TestFormData = {
  personalInfo: {
    firstname: "Marie",
    lastname: "Martin",
    email: "marie.martin@moyenneentreprise.com",
    emailConfirm: "marie.martin@moyenneentreprise.com",
    phone: "0987654321",
    role: "CFO"
  },
  companyInfo: {
    name: "Moyenne Entreprise Corp",
    dba: "Moyenne Events",
    clientType: "Venue",
    businessType: "Corporation",
    yearsInBusiness: "7",
    ein: "987654321",
    companyAddress: "456 Avenue des Champs",
    companyCity: "Lyon",
    companyState: "NY",
    companyZipcode: "69000",
    stateOfIncorporation: "NY",
    employees: 25,
    socials: "@moyenneevents",
    memberOf: "IAVM"
  },
  ticketingInfo: {
    currentPartner: "Ticketmaster",
    settlementPayout: "Weekly",
    paymentProcessing: "Ticketing Company"
  },
  volumeInfo: {
    lastYearEvents: 50,
    lastYearTickets: 15000,
    lastYearSales: 750000,
    nextYearEvents: 60,
    nextYearTickets: 18000,
    nextYearSales: 900000
  },
  fundsInfo: {
    yourFunds: "250000",
    useOfProceeds: "Venue deposit",
    timingOfFunding: "In the next 3 months"
  },
  ownershipInfo: {
    owners: [
      {
        id: "1",
        ownerName: "Marie Martin",
        ownershipPercentage: "60",
        ownerAddress: "456 Avenue des Champs, Lyon, 69000",
        ownerBirthDate: "1980-03-22"
      },
      {
        id: "2",
        ownerName: "Laurent Durand",
        ownershipPercentage: "40",
        ownerAddress: "789 Rue de la République, Lyon, 69003",
        ownerBirthDate: "1978-11-10"
      }
    ]
  },
  financesInfo: {
    assetsTransferred: false,
    filedLastYearTaxes: true,
    hasTicketingDebt: true,
    hasBusinessDebt: true,
    hasOverdueLiabilities: false,
    isLeasingLocation: false,
    hasTaxLiens: false,
    hasJudgments: false,
    hasBankruptcy: false,
    ownershipChanged: false,
    debts: [
      {
        type: "Bank Loan",
        balance: "125000"
      },
      {
        type: "Line of Credit",
        balance: "50000"
      }
    ],
    industryReferences: "Regional venue network, established partnerships with major booking agencies. Contact: booking@lyonevents.com",
    additionalComments: "Established venue management company with solid track record and expansion plans for additional locations."
  }
};

// Jeu de données 3 : Grande entreprise
export const largeCompanyData: TestFormData = {
  personalInfo: {
    firstname: "Pierre",
    lastname: "Dubois",
    email: "pierre.dubois@grandeentreprise.com",
    emailConfirm: "pierre.dubois@grandeentreprise.com",
    phone: "0147258369",
    role: "President"
  },
  companyInfo: {
    name: "Grande Entreprise International",
    dba: "Big Events Co",
    clientType: "Promoter",
    businessType: "Corporation",
    yearsInBusiness: "15",
    ein: "456789123",
    companyAddress: "789 Boulevard International",
    companyCity: "Marseille",
    companyState: "TX",
    companyZipcode: "13000",
    stateOfIncorporation: "TX",
    employees: 150,
    socials: "@bigeventsco",
    memberOf: "IAVM"
  },
  ticketingInfo: {
    currentPartner: "AXS",
    settlementPayout: "Monthly",
    paymentProcessing: "Venue"
  },
  volumeInfo: {
    lastYearEvents: 200,
    lastYearTickets: 500000,
    lastYearSales: 25000000,
    nextYearEvents: 250,
    nextYearTickets: 625000,
    nextYearSales: 31250000
  },
  fundsInfo: {
    yourFunds: "1000000",
    useOfProceeds: "General Working Capital Needs",
    timingOfFunding: "In the next 2 weeks"
  },
  ownershipInfo: {
    owners: [
      {
        id: "1",
        ownerName: "Pierre Dubois",
        ownershipPercentage: "45",
        ownerAddress: "789 Boulevard International, Marseille, 13000",
        ownerBirthDate: "1975-09-12"
      },
      {
        id: "2", 
        ownerName: "Sophie Bernard",
        ownershipPercentage: "30",
        ownerAddress: "321 Rue de l'Innovation, Marseille, 13008",
        ownerBirthDate: "1982-05-08"
      },
      {
        id: "3",
        ownerName: "Investment Group LTD",
        ownershipPercentage: "25",
        ownerAddress: "555 Corporate Center, Marseille, 13009",
        ownerBirthDate: "1990-01-01"
      }
    ]
  },
  financesInfo: {
    assetsTransferred: true,
    filedLastYearTaxes: true,
    hasTicketingDebt: false,
    hasBusinessDebt: true,
    hasOverdueLiabilities: false,
    isLeasingLocation: false,
    hasTaxLiens: false,
    hasJudgments: false,
    hasBankruptcy: false,
    ownershipChanged: true,
    debts: [
      {
        type: "Bank Loan",
        balance: "500000"
      },
      {
        type: "SBA Loan",
        balance: "300000"
      },
      {
        type: "Equipment Financing",
        balance: "150000"
      }
    ],
    industryReferences: "International venue partnerships, major festival collaborations, established relationships with top-tier booking agencies. Contact: partnerships@bigeventsco.com",
    additionalComments: "Large-scale event production company with international reach and significant infrastructure investments planned for expansion into new markets."
  }
};

export const testDataSets = [
  { name: "Small Company", data: smallCompanyData },
  { name: "Medium Company", data: mediumCompanyData },
  { name: "Large Company", data: largeCompanyData }
];
