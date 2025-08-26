import { FormState } from './formTypes';

export const initialState: FormState = {
  currentStep: 1,
  email: '',
  emailError: '',
  isSubmitted: false,
  formData: {
    personalInfo: { email: '', emailConfirm: '', firstname: '', lastname: '', phone: '', role: '' },
    companyInfo: {
      employees: 0, name: '', dba: '', yearsInBusiness: '', socials: '', clientType: '',
      businessType: '', companyAddressDisplay: '', companyAddress: '', companyZipcode: '', companyState: '', companyCountry: '', companyCity: '',
      ein: '', stateOfIncorporation: '', memberOf: ''
    },
    ticketingInfo: { currentPartner: '', otherPartner: '', settlementPayout: '', paymentProcessing: '', otherPaymentProcessing: '' },
    volumeInfo: {
      lastYearEvents: 0, lastYearTickets: 0, lastYearSales: 0,
      nextYearEvents: 0, nextYearTickets: 0, nextYearSales: 0
    },
    fundsInfo: {
      yourFunds: '', useOfProceeds: '', timingOfFunding: ''
    },
    ownershipInfo: {
      owners: [],
    },
    financesInfo: {
      singleEntity: true, assetsTransferred: false, filedLastYearTaxes: false, lastYearTaxes: [], hasBusinessDebt: false,
      debts: [], hasOverdueLiabilities: false, isLeasingLocation: false,
      leaseEndDate: '', hasTaxLiens: false, hasJudgments: false,
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
