import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './initialFormState';
import { loadApplication, saveApplication, submitApplication } from './formThunks';
import { FormState } from './formTypes';

// Fonction pour sauvegarder dans le localStorage
const saveToLocalStorage = (state: FormState) => {
  try {
    localStorage.setItem('soundcheckFormData', JSON.stringify({
      formData: state.formData,
      financesInfo: state.financesInfo,
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
      return {
        ...initialState,
        ...savedData
      };
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
    updateVolumeInfo: (state, action: PayloadAction<Partial<FormState['formData']>>) => {
      state.formData.volumeInfo = { ...state.formData.volumeInfo, ...action.payload };
      saveToLocalStorage(state);
    },
    updateFundsInfo: (state, action: PayloadAction<Partial<FormState['formData']['fundsInfo']>>) => {
      state.formData.fundsInfo = { ...state.formData.fundsInfo, ...action.payload };
      saveToLocalStorage(state);
    },
    updateOwnershipInfo: (state, action: PayloadAction<Partial<FormState['formData']['ownershipInfo']>>) => {
      state.formData.ownershipInfo = { ...state.formData.ownershipInfo, ...action.payload };
      saveToLocalStorage(state);
    },
    updateFinancesInfo: (state, action: PayloadAction<Partial<FormState['financesInfo']>>) => {
      state.financesInfo = { ...state.financesInfo, ...action.payload };
      saveToLocalStorage(state);
    },
    updateDiligenceInfo: (state, action: PayloadAction<Partial<FormState['formData']>>) => {
      state.diligenceInfo = { ...state.diligenceInfo, ...action.payload };
      saveToLocalStorage(state);
    },
    loadSavedApplication: (state, action) => {
      const newState = {
        ...state,
        currentStep: action.payload.currentStep || 0,
        formData: action.payload.formData || initialState.formData,
        financesInfo: action.payload.financesInfo || initialState.financesInfo,
        diligenceInfo: action.payload.diligenceInfo || initialState.diligenceInfo
      };
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
      saveToLocalStorage(state);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadApplication.fulfilled, (state, action) => {
        const newState = {
          ...state,
          currentStep: action.payload.currentStep || 1,
          formData: action.payload.formData || initialState.formData,
          financesInfo: action.payload.financesInfo || initialState.financesInfo,
          diligenceInfo: action.payload.diligenceInfo || initialState.diligenceInfo
        };
        saveToLocalStorage(newState);
        return newState;
      })
      .addCase(saveApplication.fulfilled, (state, action) => {
        // tu peux ajouter une confirmation ou update une clé "lastSaved"
        console.log('Formulaire sauvegardé');
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        // Vider le formulaire après soumission réussie
        localStorage.removeItem('soundcheckFormData');
        console.log('Formulaire soumis');
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
  updateDiligenceInfo, 
  loadSavedApplication,
  clearFormData,
  setSubmitted,
  resetSubmitted
} = formSlice.actions;
export default formSlice.reducer;
