import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './initialFormState';
import { loadApplication, saveApplication, submitApplication } from './formThunks';
import { FormState } from './formTypes';

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    updatePersonalInfo: (state, action: PayloadAction<Partial<FormState['formData']>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    updateCompanyInfo: (state, action: PayloadAction<Partial<FormState['formData']['companyInfo']>>) => {
      state.formData.companyInfo = { ...state.formData.companyInfo, ...action.payload };
    },
    updateTicketingInfo: (state, action: PayloadAction<Partial<FormState['formData']['ticketingInfo']>>) => {
      state.formData.ticketingInfo = { ...state.formData.ticketingInfo, ...action.payload };
    },
    updateVolumeInfo: (state, action: PayloadAction<Partial<FormState['formData']>>) => {
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
    updateDiligenceInfo: (state, action: PayloadAction<Partial<FormState['formData']>>) => {
      state.diligenceInfo = { ...state.diligenceInfo, ...action.payload };
    },
    loadSavedApplication: (state, action) => {
      return {
        ...state,
        currentStep: action.payload.currentStep || 0,
        formData: action.payload.formData || initialState.formData,
        financesInfo: action.payload.financesInfo || initialState.financesInfo,
        diligenceInfo: action.payload.diligenceInfo || initialState.diligenceInfo
    
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadApplication.fulfilled, (state, action) => {
        return {
          ...state,
          currentStep: action.payload.currentStep || 1,
          formData: action.payload.formData || initialState.formData,
          financesInfo: action.payload.financesInfo || initialState.financesInfo,
          diligenceInfo: action.payload.diligenceInfo || initialState.diligenceInfo
        };
      })
      .addCase(saveApplication.fulfilled, (state, action) => {
        // tu peux ajouter une confirmation ou update une clé "lastSaved"
        console.log('Formulaire sauvegardé');
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        // tu peux vider le formulaire ou marquer comme "envoyé"
        console.log('Formulaire soumis');
      });
  }
});

export const { setCurrentStep, updatePersonalInfo, updateCompanyInfo, updateTicketingInfo, updateVolumeInfo, updateFundsInfo, updateOwnershipInfo, updateFinancesInfo, updateDiligenceInfo, loadSavedApplication } = formSlice.actions;
export default formSlice.reducer;
