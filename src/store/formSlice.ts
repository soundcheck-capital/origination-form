import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Address {
  street: string;
  city: string;
  zipcode: string;
  state: string;
  country: string;
}
interface Owner {
  id: string;
  name: string;
  ownershipPercentage: string;
  sameAddress: boolean;
  ownerAddress: string;
  ownerCity: string;
  ownerState: string;
  ownerZipCode: string;
}

interface FormState {
  currentStep: number;
  email: string;
  emailError: string;
  formData: {
    personalInfo: {
      email: string;
    };
    address: {
      street: string;
      city: string;
      zipcode: string;
      state: string;
      country: string;
    };
    preferences: {
      newsletter: boolean;
      notifications: boolean;
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

const initialState: FormState = {
  currentStep: 1,
  email: '',
  emailError: '',
  formData: {
    personalInfo: {
      email: '',
    },
    address: {
      street: '',
      city: '',
      zipcode: '',
      state: '',
      country: '',
    },
    preferences: {
      newsletter: false,
      notifications: false,
    },
    companyInfo: {
      employees: 0,
      name: '',
      yearsInBusiness: '',
      socials: '',
      type: '',
      address: {street: '', city: '', zipcode: '', state: '', country: ''},
      taxId: '',
    },
    ticketingInfo: {
      currentPartner: '',
      settlementPolicy: '',
      membership: '',
    },
    volumeInfo: {
      lastYearEvents: 0,
      lastYearTickets: 0,
      lastYearSales: 0,
      nextYearEvents: 0,
      nextYearTickets: 0,
      nextYearSales: 0,
    },
    fundsInfo: {
      yourFunds: '0',
      otherFunds: '0',
      recoupmentPeriod: '0',
      recoupmentPercentage: '0',
      fundUse: '',
    },
    ownershipInfo: {  
      companyName: '',
      dba: '',
      companyAddress: '',
      companyCity: '',
      companyState: '',
      companyZipCode: '',
      companyType: '',
      owners: [],
      ein: '',
    },
  },
 
  financesInfo: {
    filedLastYearTaxes: false,
    hasBusinessDebt: false,
    debts: [],
    hasOverdueLiabilities: false,
    isLeasingLocation: false,
    leaseEndDate: '',
    hasTaxLiens: false,
    hasJudgments: false,
    hasBankruptcy: false,
    ownershipChanged: false
  },
  diligenceInfo: {
    bankAccountLinked: false,
    ticketingCompanyReport: [],
    ticketingServiceAgreement: [],
    ticketingProjections: [],
    incorporationCertificate: [],
    legalEntityChart: [],
    governmentId: [],
    einAuthentication: [],
    financialStatements: [],
    bankStatement: []
  },
};

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setEmailError: (state, action: PayloadAction<string>) => {
      state.emailError = action.payload;
    },
    nextStep: (state) => {
      state.currentStep += 1;
    },
    prevStep: (state) => {
      state.currentStep -= 1;
    },
    updatePersonalInfo: (state, action: PayloadAction<Partial<FormState['formData']['personalInfo']>>) => {
      state.formData.personalInfo = { ...state.formData.personalInfo, ...action.payload };
    },
    updateAddress: (state, action: PayloadAction<Partial<FormState['formData']['address']>>) => {
      state.formData.address = { ...state.formData.address, ...action.payload };
    },
    updatePreferences: (state, action: PayloadAction<Partial<FormState['formData']['preferences']>>) => {
      state.formData.preferences = { ...state.formData.preferences, ...action.payload };
    },
    updateCompanyInfo: (state, action: PayloadAction<Partial<FormState['formData']['companyInfo']>>) => {
      state.formData.companyInfo = { ...state.formData.companyInfo, ...action.payload };
    },
    updateTicketingInfo: (state, action: PayloadAction<Partial<FormState['formData']['ticketingInfo']>>) => {
      state.formData.ticketingInfo = { ...state.formData.ticketingInfo, ...action.payload };
    },
    updateVolumeInfo: (state, action: PayloadAction<Partial<FormState['formData']['volumeInfo']>>) => {
      state.formData.volumeInfo = { ...state.formData.volumeInfo, ...action.payload };
    },
    updateFundsInfo: (state, action: PayloadAction<Partial<FormState['formData']['fundsInfo']>>) => {
      state.formData.fundsInfo = { ...state.formData.fundsInfo, ...action.payload };
    },
    updateOwnershipInfo: (state, action: PayloadAction<Partial<FormState['formData']['ownershipInfo']>>) => {
      state.formData.ownershipInfo = { ...state.formData.ownershipInfo, ...action.payload };
    },
    updateFinancesInfo: (state, action: PayloadAction<Partial<FormState['financesInfo']>>) => {
      state.financesInfo = { ...state.financesInfo, ...action.payload };
    },
    updateDiligenceInfo: (state, action: PayloadAction<Partial<FormState['diligenceInfo']>>) => {
      state.diligenceInfo = { ...state.diligenceInfo, ...action.payload };
    },
  },
});

export const {
  setCurrentStep,
  setEmail,
  setEmailError,
  nextStep,
  prevStep,
  updatePersonalInfo,
  updateAddress,
  updatePreferences,
  updateCompanyInfo,
  updateTicketingInfo,
  updateVolumeInfo,
  updateFundsInfo,
  updateOwnershipInfo,
  updateFinancesInfo,
  updateDiligenceInfo
} = formSlice.actions;
export default formSlice.reducer; 


