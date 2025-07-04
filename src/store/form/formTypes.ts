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
        legalEntityType: string;
        companyAddress: string;
       
        ein: string;
        stateOfIncorporation: string;
      };
      ticketingInfo: {
        currentPartner: string;
        otherPartner: string;
        settlementPolicy: string;
        membership: string;
        ticketingPayout: string;
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
        fundUse: string;
        timeForFunding: string;
      };
      ownershipInfo: {
        owners: Owner[];
      };
    };
    financesInfo: {
      singleEntity: boolean;
      assetsTransferred: boolean;
      filedLastYearTaxes: boolean;
      lastYearTaxes: FileInfo[];
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
      otherFiles: DiligenceFileData;
    };
  }
  