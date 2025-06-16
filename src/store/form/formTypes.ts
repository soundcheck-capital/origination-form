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
      };
      companyInfo: {
        employees: number;
        name: string;
        yearsInBusiness: string;
        socials: string;
        type: string;
        address: Address;
        taxId: string;
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
      };
      ownershipInfo: {
        legalEntityType: string;
        companyName: string;
        dba: string;
        companyAddress: string;
        companyCity: string;
        companyState: string;
        companyZipCode: string;
        companyType: string;
        owners: Owner[];
        ein: string;
      };
    };
    financesInfo: {
      filedLastYearTaxes: boolean;
      lastYearTaxes: File[];
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
  