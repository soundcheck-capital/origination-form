# Persist companyName from URL Query Param (Read-Only)

**Issue:** [#44](https://github.com/soundcheck-capital/origination-form/issues/44)
**Date:** 2026-05-28

## Problem

When a client accesses the form via `?companyName=AcmeCorp`, the company name is used for password verification but lost after `PasswordProtection` navigates to `/form` (without query params). The user can then type a different company name, creating inconsistency.

## Solution

Approach A: Redux flag + useEffect in MultiStepForm.

### 1. Redux State Changes

Add `companyNameFromUrl: boolean` to `FormState`.

**formTypes.ts** — Add field to `FormState` interface (top-level, alongside `isSubmitted`).

**initialFormState.ts** — Set `companyNameFromUrl: false` in initial state.

**formSlice.ts** — New reducer `setCompanyNameFromUrl` that sets the boolean flag and persists to localStorage. Export the action. The flag is hydrated by `hydrateFormState` and `loadFromLocalStorage` so it survives page refresh.

### 2. URL Param Reading (MultiStepForm.tsx)

Add a `useEffect` (runs once on mount) in `MultiStepFormContent`:

- Call `getCompanyNameFromUrl()` (already exists in `src/utils/urlParams.ts`)
- If non-empty AND `companyInfo.name` is empty: dispatch `updateCompanyInfo({ name, dba, legalBusinessName })` + `setCompanyNameFromUrl(true)`
- If non-empty AND `companyInfo.name` already set (e.g. from localStorage): dispatch only `setCompanyNameFromUrl(true)`
- If empty: do nothing

### 3. Preserve Query Params After Password (PasswordProtection.tsx)

Change line 58 from:
```
navigate('/form');
```
to:
```
navigate('/form' + window.location.search);
```

This preserves `?companyName=...` (and any other params) through the password flow. `RootRedirect` in `index.tsx` already preserves params for the `/` → `/form` redirect.

### 4. Read-Only Field (CompanyInfo.tsx)

- Read `companyNameFromUrl` from Redux state
- When `true`, render the Company Name `TextField` with `disabled={true}`
- Show helper text below the field: "Company name set from your invitation link"
- Guard `handleChange`: if `name === "name"` and locked, skip the dispatch

### 5. Lock Scope

Only the "Company Name" field in Step 1 is locked. DBA and Legal Business Name (Step 3) are pre-filled from the URL value but remain editable.

## Files Modified

| File | Change |
|---|---|
| `src/store/form/formTypes.ts` | Add `companyNameFromUrl: boolean` to `FormState` |
| `src/store/form/initialFormState.ts` | Add `companyNameFromUrl: false` |
| `src/store/form/formSlice.ts` | New `setCompanyNameFromUrl` reducer + export |
| `src/components/MultiStepForm.tsx` | useEffect to read URL param on mount |
| `src/components/PasswordProtection.tsx` | Preserve query params in navigate call |
| `src/components/step1/CompanyInfo.tsx` | Disabled field + helper text when locked |

## Testing

- Visit with `?companyName=TestCo` → field pre-filled and read-only
- Visit without query param → field editable as before
- Password screen still works with companyName in URL
- Refresh after password → field still locked (flag in localStorage)
- Plaid exchange and form submit send the correct (locked) companyName
- DBA / Legal Business Name remain editable in Step 3
