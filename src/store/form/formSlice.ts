import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './initialFormState';
import { loadApplication, saveApplication, submitApplication } from './formThunks';
import { FormState, DiligenceFileData } from './formTypes';

const mergeDiligenceInfo = (
  saved?: Partial<FormState['diligenceInfo']>
): FormState['diligenceInfo'] => {
  const base = initialState.diligenceInfo;
  return (Object.keys(base) as Array<keyof FormState['diligenceInfo']>).reduce(
    (merged, key) => {
      const savedField = saved?.[key];
      merged[key] = {
        files: savedField?.files ?? [],
        fileInfos: savedField?.fileInfos ?? [],
      };
      return merged;
    },
    {} as Record<keyof FormState['diligenceInfo'], DiligenceFileData>
  ) as FormState['diligenceInfo'];
};

const hydrateFormState = (saved: Partial<FormState>): FormState => ({
  ...initialState,
  ...saved,
  formData: {
    ...initialState.formData,
    ...saved.formData,
    personalInfo: {
      ...initialState.formData.personalInfo,
      ...saved.formData?.personalInfo,
    },
    companyInfo: {
      ...initialState.formData.companyInfo,
      ...saved.formData?.companyInfo,
    },
    ticketingInfo: {
      ...initialState.formData.ticketingInfo,
      ...saved.formData?.ticketingInfo,
    },
    volumeInfo: {
      ...initialState.formData.volumeInfo,
      ...saved.formData?.volumeInfo,
    },
    fundsInfo: {
      ...initialState.formData.fundsInfo,
      ...saved.formData?.fundsInfo,
    },
    ownershipInfo: {
      ...initialState.formData.ownershipInfo,
      ...saved.formData?.ownershipInfo,
    },
    financesInfo: {
      ...initialState.formData.financesInfo,
      ...saved.formData?.financesInfo,
    },
  },
  diligenceInfo: mergeDiligenceInfo(saved.diligenceInfo),
  isSubmitted: false,
});

// Fonction pour sauvegarder dans le localStorage
const saveToLocalStorage = (state: FormState) => {
  try {
    localStorage.setItem('soundcheckFormData', JSON.stringify({
      formData: state.formData,
      diligenceInfo: state.diligenceInfo,
      currentStep: state.currentStep
    }));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Fonction pour charger depuis le localStorage
const loadFromLocalStorage = (): Partial<FormState> | null => {
  try {
    const saved = localStorage.getItem('soundcheckFormData');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

const formSlice = createSlice({
  name: 'form',
  initialState: (() => {
    // Essayer de charger les données sauvegardées au démarrage
    const savedData = loadFromLocalStorage();
    if (savedData) {
      return hydrateFormState(savedData);
    }
    
    return initialState;
  })(),
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
      saveToLocalStorage(state);
    },
    updatePersonalInfo: (state, action: PayloadAction<Partial<FormState['formData']>>) => {
      state.formData = { ...state.formData, ...action.payload };
      saveToLocalStorage(state);
    },
    updateCompanyInfo: (state, action: PayloadAction<Partial<FormState['formData']['companyInfo']>>) => {
      state.formData.companyInfo = { ...state.formData.companyInfo, ...action.payload };
      saveToLocalStorage(state);
    },
    updateTicketingInfo: (state, action: PayloadAction<Partial<FormState['formData']['ticketingInfo']>>) => {
      state.formData.ticketingInfo = { ...state.formData.ticketingInfo, ...action.payload };
      saveToLocalStorage(state);
    },
    updateVolumeInfo: (state, action: PayloadAction<Partial<FormState['formData']['volumeInfo']>>) => {
      state.formData.volumeInfo = { ...state.formData.volumeInfo, ...action.payload };
      saveToLocalStorage(state);
    },
    updateFundsInfo: (state, action: PayloadAction<Partial<FormState['formData']['fundsInfo']>>) => {
      state.formData.fundsInfo = { ...state.formData.fundsInfo, ...action.payload };
      saveToLocalStorage(state);
    },
    updateOwnershipInfo: (state, action: PayloadAction<Partial<FormState['formData']['ownershipInfo'] >>) => {
      state.formData.ownershipInfo = { ...state.formData.ownershipInfo, ...action.payload };
      saveToLocalStorage(state);
    },
    updateFinancesInfo: (state, action: PayloadAction<Partial<FormState['formData']['financesInfo']>>) => {
      state.formData.financesInfo = { ...state.formData.financesInfo, ...action.payload };
      saveToLocalStorage(state);
    },
    updateBankInfo: (state, action: PayloadAction<Partial<FormState['formData']['bankInfo']>>) => {
      state.formData.bankInfo = { ...state.formData.bankInfo, ...action.payload };
      saveToLocalStorage(state);
    },
    updateDiligenceInfo: (state, action: PayloadAction<Partial<FormState['diligenceInfo']>>) => {
      state.diligenceInfo = mergeDiligenceInfo({
        ...state.diligenceInfo,
        ...action.payload,
      });
      saveToLocalStorage(state);
    },
    loadSavedApplication: (state, action) => {
      const newState = hydrateFormState({
        ...state,
        currentStep: action.payload.currentStep || 0,
        formData: action.payload.formData,
        diligenceInfo: action.payload.diligenceInfo,
      });
      saveToLocalStorage(newState);
      return newState;
    },
    clearFormData: (state) => {
      localStorage.removeItem('soundcheckFormData');
      return initialState;
    },
    setSubmitted: (state) => {
      state.isSubmitted = true;
      saveToLocalStorage(state);
    },
    resetSubmitted: (state) => {
      state.isSubmitted = false;
      localStorage.removeItem('soundcheckFormData');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadApplication.fulfilled, (state, action) => {
        const newState = hydrateFormState({
          ...state,
          currentStep: action.payload.currentStep || 1,
          formData: action.payload.formData,
          diligenceInfo: action.payload.diligenceInfo,
        });
        saveToLocalStorage(newState);
        return newState;
      })
      .addCase(saveApplication.fulfilled, (state, action) => {
        // tu peux ajouter une confirmation ou update une clé "lastSaved"
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        // MARQUER LE FORMULAIRE COMME SOUMIS LOCALEMENT
        state.isSubmitted = true;
        
        // Sauvegarder les données (sans isSubmitted dans localStorage)
        saveToLocalStorage(state);
      });
  }
});

export const { 
  setCurrentStep, 
  updatePersonalInfo, 
  updateCompanyInfo, 
  updateTicketingInfo, 
  updateVolumeInfo, 
  updateFundsInfo, 
  updateOwnershipInfo, 
  updateFinancesInfo,
  updateBankInfo,
  updateDiligenceInfo,
  loadSavedApplication,
  clearFormData,
  setSubmitted,
  resetSubmitted
} = formSlice.actions;
export default formSlice.reducer;
