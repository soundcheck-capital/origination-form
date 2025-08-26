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
    useOfProceeds: "Marketing and promotion",
    timingOfFunding: "Within 30 days"
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
    useOfProceeds: "Venue improvements",
    timingOfFunding: "Within 60 days"
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
    useOfProceeds: "Expansion",
    timingOfFunding: "Within 90 days"
  }
};

export const testDataSets = [
  { name: "Small Company", data: smallCompanyData },
  { name: "Medium Company", data: mediumCompanyData },
  { name: "Large Company", data: largeCompanyData }
];
