import { FormState } from './formTypes';

export const initialState: FormState = {
  currentStep: 1,
  email: '',
  emailError: '',
  formData: {
    personalInfo: { email: '' },
    companyInfo: {
      employees: 0, name: '', yearsInBusiness: '', socials: '', type: '',
      address: { street: '', city: '', zipcode: '', state: '', country: '' },
      taxId: ''
    },
    ticketingInfo: { currentPartner: '', settlementPolicy: '', membership: '' },
    volumeInfo: {
      lastYearEvents: 0, lastYearTickets: 0, lastYearSales: 0,
      nextYearEvents: 0, nextYearTickets: 0, nextYearSales: 0
    },
    fundsInfo: {
      yourFunds: '0', otherFunds: '0', recoupmentPeriod: '0',
      recoupmentPercentage: '0', fundUse: ''
    },
    ownershipInfo: {
      legalEntityType: '', companyName: '', dba: '', companyAddress: '',
      companyCity: '', companyState: '', companyZipCode: '', companyType: '',
      owners: [], ein: ''
    }
  },
  financesInfo: {
    filedLastYearTaxes: false, lastYearTaxes: [], hasBusinessDebt: false,
    debts: [], hasOverdueLiabilities: false, isLeasingLocation: false,
    leaseEndDate: '', hasTaxLiens: false, hasJudgments: false,
    hasBankruptcy: false, ownershipChanged: false
  },
  diligenceInfo: {
    bankAccountLinked: false, ticketingCompanyReport: [],
    ticketingServiceAgreement: [], ticketingProjections: [],
    incorporationCertificate: [], legalEntityChart: [],
    governmentId: [], einAuthentication: [],
    financialStatements: [], bankStatement: []
  }
};
