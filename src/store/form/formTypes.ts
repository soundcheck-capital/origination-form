export interface Address {
    street: string;
    city: string;
    zipcode: string;
    state: string;
    country: string;
  }
  
  export interface Owner {
    id: string;
    ownerName: string;
    ownershipPercentage: string;
    sameAddress: boolean;
    ownerAddress: string;
    ownerBirthDate: string;
  }
  
  export interface FileInfo {
    id: string;
    name: string;
    size: number;
    type: string;
    uploadedAt: string;
  }

  export interface DiligenceFileData {
    files: File[];
    fileInfos: FileInfo[];
  }
  
  export interface FormState {
    currentStep: number;
    email: string;
    emailError: string;
    isSubmitted: boolean;
    formData: {
      personalInfo: {
        email: string;
        firstname: string;
        lastname: string;
        phone: string;
        role: string;
      };
      companyInfo: {
        name: string;
        dba: string;
        yearsInBusiness: string;
        socials: string;
        clientType: string;
        businessType: string;
        companyAddressDisplay: string;
        companyAddress: string;
        companyZipcode: string;
        companyState: string;
        companyCountry: string;
        companyCity: string;
        ein: string;
        stateOfIncorporation: string;
        memberOf: string;

      };
      ticketingInfo: {
        currentPartner: string;
        otherPartner: string;
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
        owners: Owner[];
      };
      financesInfo: {
        singleEntity: boolean;
        assetsTransferred: boolean;
        filedLastYearTaxes: boolean;
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
        industryReferences: string;
        additionalComments: string;
      };
    };
  
    diligenceInfo: {
      ticketingCompanyReport: DiligenceFileData;
      ticketingServiceAgreement: DiligenceFileData;
      financialStatements: DiligenceFileData;
      bankStatement: DiligenceFileData;
      incorporationCertificate: DiligenceFileData;
      legalEntityChart: DiligenceFileData;
      governmentId: DiligenceFileData;
      w9form: DiligenceFileData;
      lastYearTaxes: DiligenceFileData;
      other: DiligenceFileData;
    };
  }
  