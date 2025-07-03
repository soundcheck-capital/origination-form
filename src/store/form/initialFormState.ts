import { FormState } from './formTypes';

export const initialState: FormState = {
  currentStep: 1,
  email: '',
  emailError: '',
  formData: {
    personalInfo: { email: '', firstname: '', lastname: '', phone: '', role: '' },
    companyInfo: {  
      employees: 0, name: '', dba: '', yearsInBusiness: '', socials: '', clientType: '',
      legalEntityType: '', companyAddress: '',
      companyCity: '', companyState: '', companyZipCode: '',
       ein: '', stateOfIncorporation: ''
    },
    ticketingInfo: { currentPartner: '', otherPartner: '', settlementPolicy: '', membership: '' },
    volumeInfo: {
      lastYearEvents: 0, lastYearTickets: 0, lastYearSales: 0,
      nextYearEvents: 0, nextYearTickets: 0, nextYearSales: 0
    },
    fundsInfo: {  
        yourFunds: '0', fundUse: '', timeForFunding: '', recoupableAgainst: ''
    },
    ownershipInfo: {
     owners: [],
    }
  },
  financesInfo: {
    singleEntity: true, assetsTransferred: false, filedLastYearTaxes: false, lastYearTaxes: [], hasBusinessDebt: false,   
    debts: [], hasOverdueLiabilities: false, isLeasingLocation: false,
    leaseEndDate: '', hasTaxLiens: false, hasJudgments: false,
    hasBankruptcy: false, ownershipChanged: false, hasTicketingDebt: false,
    industryReferences: '',
    additionalComments: '',
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
    otherFiles: { files: [], fileInfos: [] },
  } 
};
