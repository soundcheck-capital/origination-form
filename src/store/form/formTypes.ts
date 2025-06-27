export interface Address {
    street: string;
    city: string;
    zipcode: string;
    state: string;
    country: string;
  }
  
  export interface Owner {
    id: string;
    name: string;
    ownershipPercentage: string;
    sameAddress: boolean;
    ownerAddress: string;
    ownerCity: string;
    ownerState: string;
    ownerZipCode: string;
  }
  
  export interface FormState {
    currentStep: number;
    email: string;
    emailError: string;
    formData: {
      personalInfo: {
        email: string;
        firstname: string;
        lastname: string;
        phone: string;
        role: string;
      };
      companyInfo: {
        employees: number;
        name: string;
        dba: string;
        yearsInBusiness: string;
        socials: string;
        clientType: string;
        taxId: string;
        legalEntityType: string;
        companyAddress: string;
        companyCity: string;
        companyState: string;
        companyZipCode: string;
        companyType: string;
        ein: string;
        stateOfIncorporation: string;
      };
      ticketingInfo: {
        currentPartner: string;
        settlementPolicy: string;
        membership: string;
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
        otherFunds: string;
        recoupmentPeriod: string;
        recoupmentPercentage: string;
        fundUse: string;
        timeForFunding: string;
        recoupableAgainst: string;
      };
      ownershipInfo: {
        owners: Owner[];
      };
    };
    financesInfo: {
      singleEntity: boolean;
      assetsTransferred: boolean;
      filedLastYearTaxes: boolean;
      lastYearTaxes: File[];
      hasTicketingDebt: boolean;
      hasBusinessDebt: boolean;
      debts: Array<{
        type: string;
        balance: string;
      }>;
      hasOverdueLiabilities: boolean;
      isLeasingLocation: boolean;
      leaseEndDate: string;
      hasTaxLiens: boolean;
      hasJudgments: boolean;
      hasBankruptcy: boolean;
      ownershipChanged: boolean;
    };
    diligenceInfo: {
      bankAccountLinked: boolean;
      ticketingCompanyReport: File[];
      ticketingServiceAgreement: File[];
      ticketingProjections: File[];
      incorporationCertificate: File[];
      legalEntityChart: File[];
      governmentId: File[];
      einAuthentication: File[];
      financialStatements: File[];
      bankStatement: File[];
    };
  }
  