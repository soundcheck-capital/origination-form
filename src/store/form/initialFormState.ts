import { FormState } from './formTypes';

export const initialState: FormState = {
  currentStep: 1,
  email: '',
  emailError: '',
  isSubmitted: false,
  formData: {
    personalInfo: { email: '', firstname: '', lastname: '', phone: '', role: '' },
    companyInfo: {
      name: '', legalBusinessName: '', dba: '', yearsInBusiness: '', socials: '', clientType: '',
      businessType: '', companyAddressDisplay: '', companyAddress: '', companyZipcode: '', companyState: '', companyCountry: '', companyCity: '',
      ein: '', stateOfIncorporation: '', memberOf: ''
    },
    ticketingInfo: { currentPartner: '', otherPartner: '', settlementPayout: '', paymentProcessing: '' },
    volumeInfo: {
      nextYearEvents: 0, nextYearSales: 0,
    },
    fundsInfo: {
      yourFunds: '', useOfProceeds: '', timingOfFunding: ''
    },
    ownershipInfo: {
      owners: [],
    },
    financesInfo: {
      singleEntity: true, assetsTransferred: false, filedLastYearTaxes: false, hasBusinessDebt: false,
      debts: [], hasOverdueLiabilities: false, 
       hasTaxLiens: false, hasJudgments: false,
      hasBankruptcy: false, ownershipChanged: false, hasTicketingDebt: false,
      industryReferences: '',
      additionalComments: '',
    },
  },

  diligenceInfo: {
    ticketingCompanyReport: { files: [], fileInfos: [] },
    ticketingServiceAgreement: { files: [], fileInfos: [] },
    financialStatements: { files: [], fileInfos: [] },
    bankStatement: { files: [], fileInfos: [] },
    incorporationCertificate: { files: [], fileInfos: [] },
    legalEntityChart: { files: [], fileInfos: [] },
    governmentId: { files: [], fileInfos: [] },
    w9form: { files: [], fileInfos: [] },
    lastYearTaxes: { files: [], fileInfos: [] },
    other: { files: [], fileInfos: [] },
  }
};
