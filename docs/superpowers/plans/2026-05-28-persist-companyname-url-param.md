# Persist companyName from URL Param Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When a client accesses the form via `?companyName=AcmeCorp`, persist that name into Redux state and lock the Company Name field as read-only, so the name stays consistent throughout the form.

**Architecture:** Add a `companyNameFromUrl` boolean flag to the Redux `FormState`. A `useEffect` in `MultiStepFormContent` reads the URL param on mount and populates `companyInfo.name` + sets the flag. `PasswordProtection` preserves query params through navigation. `CompanyInfo` renders the field as disabled when the flag is set.

**Tech Stack:** React 18, Redux Toolkit, React Router v6, TypeScript

---

### Task 1: Add `companyNameFromUrl` to Redux State

**Files:**
- Modify: `src/store/form/formTypes.ts:31-35`
- Modify: `src/store/form/initialFormState.ts:3-8`
- Modify: `src/store/form/formSlice.ts:86-205`

- [ ] **Step 1: Add the field to `FormState` interface**

In `src/store/form/formTypes.ts`, add `companyNameFromUrl` to the `FormState` interface, right after `isSubmitted`:

```typescript
export interface FormState {
    currentStep: number;
    email: string;
    emailError: string;
    isSubmitted: boolean;
    companyNameFromUrl: boolean;
    formData: {
```

- [ ] **Step 2: Set initial value in `initialFormState.ts`**

In `src/store/form/initialFormState.ts`, add `companyNameFromUrl: false` after `isSubmitted`:

```typescript
export const initialState: FormState = {
  currentStep: 1,
  email: '',
  emailError: '',
  isSubmitted: false,
  companyNameFromUrl: false,
  formData: {
```

- [ ] **Step 3: Add the reducer to `formSlice.ts`**

In `src/store/form/formSlice.ts`, add a new reducer `setCompanyNameFromUrl` inside the `reducers` object (after `resetSubmitted`):

```typescript
    setCompanyNameFromUrl: (state, action: PayloadAction<boolean>) => {
      state.companyNameFromUrl = action.payload;
      saveToLocalStorage(state);
    },
```

- [ ] **Step 4: Export the new action**

In `src/store/form/formSlice.ts`, add `setCompanyNameFromUrl` to the destructured exports:

```typescript
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
  resetSubmitted,
  setCompanyNameFromUrl
} = formSlice.actions;
```

- [ ] **Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No errors related to `companyNameFromUrl`.

- [ ] **Step 6: Commit**

```bash
git add src/store/form/formTypes.ts src/store/form/initialFormState.ts src/store/form/formSlice.ts
git commit -m "feat(store): add companyNameFromUrl flag to FormState (#44)"
```

---

### Task 2: Preserve query params in `PasswordProtection` navigation

**Files:**
- Modify: `src/components/PasswordProtection.tsx:58`

- [ ] **Step 1: Change navigate call to preserve query params**

In `src/components/PasswordProtection.tsx`, change line 58 from:

```typescript
        navigate('/form');
```

to:

```typescript
        navigate('/form' + window.location.search);
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/PasswordProtection.tsx
git commit -m "fix(auth): preserve URL query params after password validation (#44)"
```

---

### Task 3: Add `useEffect` in `MultiStepForm` to read URL param on mount

**Files:**
- Modify: `src/components/MultiStepForm.tsx:1-6,26-55`

- [ ] **Step 1: Add imports**

In `src/components/MultiStepForm.tsx`, add the new imports. Change line 5 from:

```typescript
import {   setSubmitted } from '../store/form/formSlice';
```

to:

```typescript
import { setSubmitted, updateCompanyInfo, setCompanyNameFromUrl } from '../store/form/formSlice';
```

Add the URL param import after the existing imports (after line 24):

```typescript
import { getCompanyNameFromUrl } from '../utils/urlParams';
```

- [ ] **Step 2: Add the useEffect for URL param reading**

In `src/components/MultiStepForm.tsx`, inside `MultiStepFormContent`, add a `useEffect` right after the existing `useEffect` for `isSubmitted` redirect (after line 55):

```typescript
  useEffect(() => {
    const companyNameFromUrl = getCompanyNameFromUrl();
    if (!companyNameFromUrl) return;

    if (!formData.formData.companyInfo.name) {
      dispatch(updateCompanyInfo({ name: companyNameFromUrl, dba: companyNameFromUrl, legalBusinessName: companyNameFromUrl }));
    }
    dispatch(setCompanyNameFromUrl(true));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/MultiStepForm.tsx
git commit -m "feat(form): read companyName from URL and persist to Redux on mount (#44)"
```

---

### Task 4: Add `disabled` prop support to `TextField` component

**Files:**
- Modify: `src/components/customComponents/TextField.tsx:3,12`

The `TextField` component currently does not accept a `disabled` prop. We need to add it before `CompanyInfo` can use it.

- [ ] **Step 1: Add `disabled` to the props interface and pass to `<input>`**

In `src/components/customComponents/TextField.tsx`, change the component signature on line 3 from:

```typescript
const TextField = ({ label, name, value, onChange, error, onBlur, onFocus, type, id, placeholder, required }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, error: string, onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void, onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void, type: string, id?: string, placeholder?: string, required?: boolean }) => {
```

to:

```typescript
const TextField = ({ label, name, value, onChange, error, onBlur, onFocus, type, id, placeholder, required, disabled }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, error: string, onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void, onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void, type: string, id?: string, placeholder?: string, required?: boolean, disabled?: boolean }) => {
```

Then add the `disabled` attribute and a conditional style to the `<input>` element. Change the `<input>` (lines 12-28) from:

```tsx
      <input 
        autoComplete="on" 
        type={type} 
        id={inputId} 
        value={value} 
        name={name} 
        className={`w-full px-4 py-2 text-sm text-gray-900 rounded-3xl border focus:outline-none  focus:ring-purple-400 ${
          hasFieldError 
            ? 'border-gray-300 focus:border-red-500' 
            : 'border-gray-300 focus:border-purple-400'
        }`} 
        placeholder={placeholder || ''} 
        required={required}
        onChange={onChange} 
        onBlur={onBlur} 
        onFocus={onFocus} 
        title='Please enter your information here' 
      />
```

to:

```tsx
      <input 
        autoComplete="on" 
        type={type} 
        id={inputId} 
        value={value} 
        name={name} 
        className={`w-full px-4 py-2 text-sm text-gray-900 rounded-3xl border focus:outline-none  focus:ring-purple-400 ${
          hasFieldError 
            ? 'border-gray-300 focus:border-red-500' 
            : 'border-gray-300 focus:border-purple-400'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-75' : ''}`} 
        placeholder={placeholder || ''} 
        required={required}
        disabled={disabled}
        onChange={onChange} 
        onBlur={onBlur} 
        onFocus={onFocus} 
        title='Please enter your information here' 
      />
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/customComponents/TextField.tsx
git commit -m "feat(ui): add disabled prop to TextField component (#44)"
```

---

### Task 5: Lock Company Name field in `CompanyInfo` when from URL

**Files:**
- Modify: `src/components/step1/CompanyInfo.tsx:2-4,22-39,50`

- [ ] **Step 1: Add Redux selector for `companyNameFromUrl`**

In `src/components/step1/CompanyInfo.tsx`, add the selector inside the component (after line 23):

```typescript
  const companyNameLocked = useSelector((state: RootState) => state.form.companyNameFromUrl);
```

- [ ] **Step 2: Guard `handleChange` to skip dispatch when locked**

In `src/components/step1/CompanyInfo.tsx`, change the `handleChange` function (lines 28-39) from:

```typescript
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if(name === "name"){
      dispatch(updateCompanyInfo({ name: value, dba: value, legalBusinessName: value }));
      setFieldError('name', null);
    } else if (name === "role"){
      dispatch(updatePersonalInfo({ personalInfo: { ...personalInfo, role: value } }));
      setFieldError( name, null);
    } else {
      dispatch(updateCompanyInfo({ [name]: value }));
      setFieldError(name, null);
    }
  };
```

to:

```typescript
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if(name === "name"){
      if (companyNameLocked) return;
      dispatch(updateCompanyInfo({ name: value, dba: value, legalBusinessName: value }));
      setFieldError('name', null);
    } else if (name === "role"){
      dispatch(updatePersonalInfo({ personalInfo: { ...personalInfo, role: value } }));
      setFieldError( name, null);
    } else {
      dispatch(updateCompanyInfo({ [name]: value }));
      setFieldError(name, null);
    }
  };
```

- [ ] **Step 3: Make the Company Name field disabled and add helper text**

In `src/components/step1/CompanyInfo.tsx`, change the Company Name TextField (line 50) from:

```tsx
      <TextField type="text" label="Company Name" name="name" value={companyInfo.name} onChange={handleChange} error='' onBlur={()=>{}} required />
```

to:

```tsx
      <TextField type="text" label="Company Name" name="name" value={companyInfo.name} onChange={handleChange} error='' onBlur={()=>{}} required disabled={companyNameLocked} />
      {companyNameLocked && (
        <p className="text-xs text-gray-500 -mt-3 mb-3 px-2">Company name set from your invitation link</p>
      )}
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/step1/CompanyInfo.tsx
git commit -m "feat(form): lock Company Name field when set from URL param (#44)"
```

---

### Task 6: Write unit test for `companyNameFromUrl` reducer

**Files:**
- Create: `src/store/form/formSlice.test.ts`

- [ ] **Step 1: Write the test file**

Create `src/store/form/formSlice.test.ts`:

```typescript
import { describe, expect, it } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
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
```

- [ ] **Step 2: Run the tests**

Run: `npx react-scripts test --watchAll=false --testPathPattern='src/store/form/formSlice.test.ts' 2>&1 | tail -20`
Expected: All 4 tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/store/form/formSlice.test.ts
git commit -m "test(store): add unit tests for companyNameFromUrl reducer (#44)"
```

---

### Task 7: Manual verification in browser

- [ ] **Step 1: Start the dev server**

Run: `npm start`

- [ ] **Step 2: Test with companyName in URL**

Navigate to `http://localhost:3000/form?companyName=TestCo`
- Verify: Password screen appears
- Enter the password, click "Access Form"
- Verify: URL after login is `/form?companyName=TestCo` (params preserved)
- Verify: Company Name field shows "TestCo" and is disabled (grayed out)
- Verify: Helper text "Company name set from your invitation link" appears below the field
- Navigate to Step 3 and verify DBA and Legal Business Name are pre-filled with "TestCo" but editable

- [ ] **Step 3: Test without companyName in URL**

Navigate to `http://localhost:3000/form`
- Verify: No password screen (direct access)
- Verify: Company Name field is empty and editable
- Verify: No helper text below the field

- [ ] **Step 4: Test persistence on refresh**

After logging in with `?companyName=TestCo`:
- Refresh the page
- Verify: Company Name field is still "TestCo" and still disabled (flag persisted in localStorage)
