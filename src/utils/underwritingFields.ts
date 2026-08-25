export const UPLOAD_LABELS = {
  TICKETING: 'ticketing',
  FINANCIAL: 'financial',
  BANK: 'bank',
  KYB: 'kyb',
} as const;

export type UploadLabel = (typeof UPLOAD_LABELS)[keyof typeof UPLOAD_LABELS];

export const FINANCIAL_DOCUMENT_UPLOAD_KEYS = [
  'financialsYtdPL',
  'financialsYtdBS',
  'financialsYear1PL',
  'financialsYear1BS',
  'financialsYear2PL',
  'financialsYear2BS',
] as const;

export type FinancialDocumentUploadKey = (typeof FINANCIAL_DOCUMENT_UPLOAD_KEYS)[number];

export const DILIGENCE_UPLOAD_FIELD_KEYS = [
  'futureEventSchedule',
  ...FINANCIAL_DOCUMENT_UPLOAD_KEYS,
  'venueAgreements',
] as const;

export type DiligenceUploadFieldKey = (typeof DILIGENCE_UPLOAD_FIELD_KEYS)[number];

export const PAYMENT_PROCESSOR_OTHER = 'Other';
export const ACCOUNTING_SYSTEM_OTHER = 'Other';

const FINANCIAL_DOCUMENT_LABELS: Record<FinancialDocumentUploadKey, string> = {
  financialsYtdPL: 'Year To Date — P&L',
  financialsYtdBS: 'Year To Date — Balance Sheet',
  financialsYear1PL: 'Year - 1 — P&L',
  financialsYear1BS: 'Year - 1 — Balance Sheet',
  financialsYear2PL: 'Year - 2 — P&L',
  financialsYear2BS: 'Year - 2 — Balance Sheet',
};

const uploadLabelByFieldName: Record<string, UploadLabel> = {
  // ticketing
  ticketingCompanyReport: UPLOAD_LABELS.TICKETING,
  ticketingServiceAgreement: UPLOAD_LABELS.TICKETING,
  futureEventSchedule: UPLOAD_LABELS.TICKETING,
  venueAgreements: UPLOAD_LABELS.TICKETING,

  // financial
  ...Object.fromEntries(
    FINANCIAL_DOCUMENT_UPLOAD_KEYS.map((key) => [key, UPLOAD_LABELS.FINANCIAL])
  ),
  lastYearTaxes: UPLOAD_LABELS.FINANCIAL,

  // bank
  bankStatement: UPLOAD_LABELS.BANK,

  // kyb
  incorporationCertificate: UPLOAD_LABELS.KYB,
  legalEntityChart: UPLOAD_LABELS.KYB,
  governmentId: UPLOAD_LABELS.KYB,
  w9form: UPLOAD_LABELS.KYB,
  other: UPLOAD_LABELS.KYB,
};

export function getUploadLabelForField(fieldName: string): UploadLabel {
  return uploadLabelByFieldName[fieldName] ?? UPLOAD_LABELS.KYB;
}

export interface TicketingUnderwritingFields {
  paymentProcessor: string;
  otherPaymentProcessor: string;
}

export interface FinancesUnderwritingFields {
  accountingSystem: string;
  otherAccountingSystem: string;
}

export function buildUnderwritingWebhookCompanyFields(
  ticketing: TicketingUnderwritingFields,
  finances: FinancesUnderwritingFields
) {
  return {
    paymentProcessor: ticketing.paymentProcessor,
    otherPaymentProcessor:
      ticketing.paymentProcessor === PAYMENT_PROCESSOR_OTHER
        ? ticketing.otherPaymentProcessor
        : '',
    accountingSystem: finances.accountingSystem,
    otherAccountingSystem:
      finances.accountingSystem === ACCOUNTING_SYSTEM_OTHER
        ? finances.otherAccountingSystem
        : '',
  };
}

export function validatePaymentProcessorFields(
  ticketing: TicketingUnderwritingFields
): { [key: string]: string } {
  const errors: { [key: string]: string } = {};
  if (!ticketing.paymentProcessor.trim()) {
    errors.paymentProcessor = 'Payment processor is required';
  }
  if (
    ticketing.paymentProcessor === PAYMENT_PROCESSOR_OTHER &&
    !ticketing.otherPaymentProcessor.trim()
  ) {
    errors.otherPaymentProcessor = 'Please specify your payment processor';
  }
  return errors;
}

export function validateAccountingSystemFields(
  finances: FinancesUnderwritingFields
): { [key: string]: string } {
  const errors: { [key: string]: string } = {};
  if (!finances.accountingSystem.trim()) {
    errors.accountingSystem = 'Accounting system is required';
  }
  if (
    finances.accountingSystem === ACCOUNTING_SYSTEM_OTHER &&
    !finances.otherAccountingSystem.trim()
  ) {
    errors.otherAccountingSystem = 'Please specify your accounting system';
  }
  return errors;
}

export function getDiligenceFileCount(
  field: { files?: File[] } | undefined
): number {
  return field?.files?.length ?? 0;
}

export function validateFinancialDocumentUploads(
  diligenceInfo: Partial<Record<FinancialDocumentUploadKey, { files?: File[] }>>
): { [key: string]: string } {
  const errors: { [key: string]: string } = {};

  for (const key of FINANCIAL_DOCUMENT_UPLOAD_KEYS) {
    if (getDiligenceFileCount(diligenceInfo[key]) === 0) {
      errors[key] = `${FINANCIAL_DOCUMENT_LABELS[key]} is required`;
    }
  }

  return errors;
}

export function validateUnderwritingUploadFields(
  diligenceInfo: Partial<
    Pick<Record<DiligenceUploadFieldKey, { files?: File[] }>, 'futureEventSchedule' | 'venueAgreements'>
  >
): { [key: string]: string } {
  const errors: { [key: string]: string } = {};

  if (getDiligenceFileCount(diligenceInfo.futureEventSchedule) === 0) {
    errors.futureEventSchedule = 'Future event schedule is required';
  }
  if (getDiligenceFileCount(diligenceInfo.venueAgreements) === 0) {
    errors.venueAgreements = 'Venue agreements are required';
  }

  return errors;
}
