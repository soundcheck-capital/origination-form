import { configureStore } from '@reduxjs/toolkit';
import formReducer from './form/formSlice';

export const store = configureStore({
  reducer: {
    form: formReducer
  },
});

// Expose store on window for E2E tests (Playwright) to dispatch actions
// without going through Plaid Link sandbox. Harmless in production.
if (typeof window !== 'undefined') {
  (window as any).__STORE__ = store;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

