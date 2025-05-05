import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
      postalCode: string;
    };
    preferences: {
      newsletter: boolean;
      notifications: boolean;
    };
    companyInfo: {
      name: string;
      yearsInBusiness: string;
      socials: string;
      type: string;
      address: string;
      zipCode: string;
      city: string;
      state: string;
      ein: string;
    };
    ticketingInfo: {
      currentPartner: string;
      settlementPolicy: string;
      membership: string;
    };
    volumeInfo: {
      lastYearEvents: string;
      lastYearTickets: string;
      lastYearSales: string;
      nextYearEvents: string;
      nextYearTickets: string;
      nextYearSales: string;
    };
    fundsInfo: {
      yourFunds: string;
      otherFunds: string;
      recoupmentPeriod: string;
      recoupmentPercentage: string;
      fundUse: string;
    };
  };
  ownershipInfo: {
    name: string;
    address: string;
    city: string;
    zipCode: string;
    state: string;
    ownership: string;
    sameAddress: boolean;
    ownerAddress: string;
    ownerCity: string;
    ownerZipCode: string;
    ownerState: string;
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
    ticketingFiles: File[];
    financialFiles: File[];
    otherFiles: File[];
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
      postalCode: '',
    },
    preferences: {
      newsletter: false,
      notifications: false,
    },
    companyInfo: {
      name: '',
      yearsInBusiness: '',
      socials: '',
      type: '',
      address: '',
      zipCode: '',
      city: '',
      state: '',
      ein: '',
    },
    ticketingInfo: {
      currentPartner: '',
      settlementPolicy: '',
      membership: '',
    },
    volumeInfo: {
      lastYearEvents: '',
      lastYearTickets: '',
      lastYearSales: '',
      nextYearEvents: '',
      nextYearTickets: '',
      nextYearSales: '',
    },
    fundsInfo: {
      yourFunds: '0',
      otherFunds: '0',
      recoupmentPeriod: '0',
      recoupmentPercentage: '0',
      fundUse: '',
    },
  },
  ownershipInfo: {
    name: '',
    address: '',
    city: '',
    zipCode: '',
    state: '',
    ownership: '',
    sameAddress: true,
    ownerAddress: '',
    ownerCity: '',
    ownerZipCode: '',
    ownerState: ''
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
    ticketingFiles: [],
    financialFiles: [],
    otherFiles: []
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
    updateOwnershipInfo: (state, action: PayloadAction<Partial<FormState['ownershipInfo']>>) => {
      state.ownershipInfo = { ...state.ownershipInfo, ...action.payload };
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