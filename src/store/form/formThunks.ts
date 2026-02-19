import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '..';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const loadApplication = createAsyncThunk(
  'form/loadApplication',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/applications/current`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Erreur chargement formulaire');
    }
  }
);

export const createApplication = createAsyncThunk(
  'form/createApplication',
  async (_, { getState, rejectWithValue }) => {
    const { form } = getState() as RootState;

    try {
      const payload = {
        currentStep: form.currentStep,
        formData: form.formData,
        diligenceInfo: form.diligenceInfo
        
      };

      const res = await axios.post(`${API_URL}/applications/new`, payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Erreur création formulaire');
    }
  }
);

export const saveApplication = createAsyncThunk(
  'form/saveApplication',
  async (_, { getState, rejectWithValue }) => {
    const { form } = getState() as RootState;

    try {
      const payload = {
        currentStep: form.currentStep,
        formData: form.formData,
        diligenceInfo: form.diligenceInfo

      };

      const res = await axios.post(`${API_URL}/applications/update`, payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Erreur sauvegarde formulaire');
    }
  }
);

export const submitApplication = createAsyncThunk(
  'form/submitApplication',
  async (_, { getState, rejectWithValue }) => {
    const { form } = getState() as RootState;

    try {
      const payload = {
        ...form,
        status: 'submitted'
      };

      const res = await axios.post(`${API_URL}/applications/submit`, payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Erreur envoi final formulaire');
    }
  }
);
