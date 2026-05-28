import { describe, expect, it, jest } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';

jest.mock('axios');
import formReducer, {
  setCompanyNameFromUrl,
  updateCompanyInfo,
} from './formSlice';

const createTestStore = () =>
  configureStore({ reducer: { form: formReducer } });

describe('setCompanyNameFromUrl', () => {
  it('sets flag to true', () => {
    const store = createTestStore();
    store.dispatch(setCompanyNameFromUrl(true));
    expect(store.getState().form.companyNameFromUrl).toBe(true);
  });

  it('defaults to false', () => {
    const store = createTestStore();
    expect(store.getState().form.companyNameFromUrl).toBe(false);
  });

  it('can be toggled back to false', () => {
    const store = createTestStore();
    store.dispatch(setCompanyNameFromUrl(true));
    store.dispatch(setCompanyNameFromUrl(false));
    expect(store.getState().form.companyNameFromUrl).toBe(false);
  });
});

describe('companyName URL flow', () => {
  it('updateCompanyInfo sets name, dba, and legalBusinessName together', () => {
    const store = createTestStore();
    store.dispatch(updateCompanyInfo({ name: 'TestCo', dba: 'TestCo', legalBusinessName: 'TestCo' }));
    const { companyInfo } = store.getState().form.formData;
    expect(companyInfo.name).toBe('TestCo');
    expect(companyInfo.dba).toBe('TestCo');
    expect(companyInfo.legalBusinessName).toBe('TestCo');
  });
});
