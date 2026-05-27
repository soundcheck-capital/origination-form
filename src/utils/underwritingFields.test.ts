import { describe, expect, it } from '@jest/globals';
import {
  buildUnderwritingWebhookCompanyFields,
  FINANCIAL_DOCUMENT_UPLOAD_KEYS,
  getDiligenceFileCount,
  getUploadLabelForField,
  UPLOAD_LABELS,
  validateAccountingSystemFields,
  validateFinancialDocumentUploads,
  validatePaymentProcessorFields,
  validateUnderwritingUploadFields,
} from './underwritingFields';

// ─── getUploadLabelForField ───────────────────────────────────────────────────

describe('getUploadLabelForField', () => {
  it('maps ticketing uploads to the ticketing label', () => {
    for (const field of ['ticketingCompanyReport', 'ticketingServiceAgreement', 'futureEventSchedule', 'venueAgreements']) {
      expect(getUploadLabelForField(field)).toBe(UPLOAD_LABELS.TICKETING);
    }
  });

  it('maps every financial document upload to the financial label', () => {
    for (const key of FINANCIAL_DOCUMENT_UPLOAD_KEYS) {
      expect(getUploadLabelForField(key)).toBe(UPLOAD_LABELS.FINANCIAL);
    }
  });

  it('maps bank statement to the bank label', () => {
    expect(getUploadLabelForField('bankStatement')).toBe(UPLOAD_LABELS.BANK);
  });

  it('maps kyb documents to the kyb label', () => {
    for (const field of ['incorporationCertificate', 'legalEntityChart', 'governmentId', 'w9form', 'other']) {
      expect(getUploadLabelForField(field)).toBe(UPLOAD_LABELS.KYB);
    }
  });

  it('falls back to kyb for unknown field names', () => {
    expect(getUploadLabelForField('somethingUnknown')).toBe(UPLOAD_LABELS.KYB);
  });
});

// ─── getDiligenceFileCount ────────────────────────────────────────────────────

describe('getDiligenceFileCount', () => {
  it('returns 0 for undefined (field missing from persisted state)', () => {
    expect(getDiligenceFileCount(undefined)).toBe(0);
  });

  it('returns 0 when files array is absent', () => {
    expect(getDiligenceFileCount({})).toBe(0);
  });

  it('returns the correct count when files are present', () => {
    const file = new File(['x'], 'test.pdf');
    expect(getDiligenceFileCount({ files: [file, file] })).toBe(2);
  });
});

// ─── validateFinancialDocumentUploads ────────────────────────────────────────

describe('validateFinancialDocumentUploads', () => {
  it('does not throw when the whole diligenceInfo object is missing fields (hydration gap)', () => {
    expect(() => validateFinancialDocumentUploads({})).not.toThrow();
  });

  it('returns one error per missing financial document', () => {
    const errors = validateFinancialDocumentUploads({});
    expect(Object.keys(errors)).toHaveLength(FINANCIAL_DOCUMENT_UPLOAD_KEYS.length);
  });

  it('returns no errors when every field has at least one file', () => {
    const file = new File(['x'], 'p&l.pdf');
    const diligenceInfo = Object.fromEntries(
      FINANCIAL_DOCUMENT_UPLOAD_KEYS.map((key) => [key, { files: [file] }])
    ) as Record<(typeof FINANCIAL_DOCUMENT_UPLOAD_KEYS)[number], { files: File[] }>;
    expect(validateFinancialDocumentUploads(diligenceInfo)).toEqual({});
  });

  it('reports the correct label in the error message', () => {
    const errors = validateFinancialDocumentUploads({
      financialsYtdPL: { files: [] },
    });
    expect(errors.financialsYtdPL).toMatch(/Year To Date.*P&L/i);
  });
});

// ─── validateUnderwritingUploadFields ────────────────────────────────────────

describe('validateUnderwritingUploadFields', () => {
  it('requires future event schedule when absent', () => {
    const errors = validateUnderwritingUploadFields({
      futureEventSchedule: { files: [] },
      venueAgreements: { files: [new File(['x'], 'v.pdf')] },
    });
    expect(errors).toMatchObject({ futureEventSchedule: expect.any(String) });
    expect(errors.venueAgreements).toBeUndefined();
  });

  it('requires venue agreements when absent', () => {
    const errors = validateUnderwritingUploadFields({
      futureEventSchedule: { files: [new File(['x'], 'f.pdf')] },
      venueAgreements: { files: [] },
    });
    expect(errors).toMatchObject({ venueAgreements: expect.any(String) });
    expect(errors.futureEventSchedule).toBeUndefined();
  });

  it('returns no errors when both fields have files', () => {
    const file = new File(['x'], 'doc.pdf');
    expect(
      validateUnderwritingUploadFields({
        futureEventSchedule: { files: [file] },
        venueAgreements: { files: [file] },
      })
    ).toEqual({});
  });

  it('does not throw when called with an empty object', () => {
    expect(() => validateUnderwritingUploadFields({})).not.toThrow();
  });
});

// ─── validatePaymentProcessorFields ──────────────────────────────────────────

describe('validatePaymentProcessorFields', () => {
  it('requires a selection', () => {
    const errors = validatePaymentProcessorFields({ paymentProcessor: '', otherPaymentProcessor: '' });
    expect(errors.paymentProcessor).toBeDefined();
  });

  it('requires free-text when Other is selected', () => {
    const errors = validatePaymentProcessorFields({ paymentProcessor: 'Other', otherPaymentProcessor: '' });
    expect(errors.otherPaymentProcessor).toBeDefined();
    expect(errors.paymentProcessor).toBeUndefined();
  });

  it('passes for a known processor', () => {
    const errors = validatePaymentProcessorFields({ paymentProcessor: 'Stripe', otherPaymentProcessor: '' });
    expect(errors).toEqual({});
  });

  it('passes for Other with free text filled', () => {
    const errors = validatePaymentProcessorFields({ paymentProcessor: 'Other', otherPaymentProcessor: 'MyPay' });
    expect(errors).toEqual({});
  });
});

// ─── validateAccountingSystemFields ──────────────────────────────────────────

describe('validateAccountingSystemFields', () => {
  it('requires a selection', () => {
    const errors = validateAccountingSystemFields({ accountingSystem: '', otherAccountingSystem: '' });
    expect(errors.accountingSystem).toBeDefined();
  });

  it('requires free-text when Other is selected', () => {
    const errors = validateAccountingSystemFields({ accountingSystem: 'Other', otherAccountingSystem: '' });
    expect(errors.otherAccountingSystem).toBeDefined();
    expect(errors.accountingSystem).toBeUndefined();
  });

  it('passes for a known system', () => {
    const errors = validateAccountingSystemFields({ accountingSystem: 'QuickBooks', otherAccountingSystem: '' });
    expect(errors).toEqual({});
  });
});

// ─── buildUnderwritingWebhookCompanyFields ────────────────────────────────────

describe('buildUnderwritingWebhookCompanyFields', () => {
  it('includes both dropdown values in the submit payload', () => {
    expect(
      buildUnderwritingWebhookCompanyFields(
        { paymentProcessor: 'Stripe', otherPaymentProcessor: '' },
        { accountingSystem: 'QuickBooks', otherAccountingSystem: '' }
      )
    ).toEqual({
      paymentProcessor: 'Stripe',
      otherPaymentProcessor: '',
      accountingSystem: 'QuickBooks',
      otherAccountingSystem: '',
    });
  });

  it('includes free-text when Other is selected for both fields', () => {
    expect(
      buildUnderwritingWebhookCompanyFields(
        { paymentProcessor: 'Other', otherPaymentProcessor: 'CustomPay' },
        { accountingSystem: 'Other', otherAccountingSystem: 'Google Sheets' }
      )
    ).toEqual({
      paymentProcessor: 'Other',
      otherPaymentProcessor: 'CustomPay',
      accountingSystem: 'Other',
      otherAccountingSystem: 'Google Sheets',
    });
  });

  it('clears otherPaymentProcessor when processor is not Other', () => {
    const result = buildUnderwritingWebhookCompanyFields(
      { paymentProcessor: 'Adyen', otherPaymentProcessor: 'leftover' },
      { accountingSystem: 'Xero', otherAccountingSystem: '' }
    );
    expect(result.otherPaymentProcessor).toBe('');
  });

  it('clears otherAccountingSystem when system is not Other', () => {
    const result = buildUnderwritingWebhookCompanyFields(
      { paymentProcessor: 'Square', otherPaymentProcessor: '' },
      { accountingSystem: 'NetSuite', otherAccountingSystem: 'leftover' }
    );
    expect(result.otherAccountingSystem).toBe('');
  });
});
