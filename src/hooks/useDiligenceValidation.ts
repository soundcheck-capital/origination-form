import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useDiligenceValidation = () => {
  const { diligenceInfo } = useSelector((state: RootState) => state.form);
  const { singleEntity } = useSelector((state: RootState) => state.form.formData.financesInfo);
  const { ticketingInfo } = useSelector((state: RootState) => state.form.formData);
  const validateTicketingInformation = (): boolean => {
    return (
      diligenceInfo.ticketingCompanyReport.fileInfos.length > 0 &&
      diligenceInfo.ticketingServiceAgreement.fileInfos.length > 0
    );
  };

  const validateFinancialInformation = (): boolean => {
    const hasRequiredFinancialDocuments =
      diligenceInfo.financialsYtdPL.fileInfos.length > 0 &&
      diligenceInfo.financialsYtdBS.fileInfos.length > 0 &&
      diligenceInfo.financialsYear1PL.fileInfos.length > 0 &&
      diligenceInfo.financialsYear1BS.fileInfos.length > 0 &&
      diligenceInfo.financialsYear2PL.fileInfos.length > 0 &&
      diligenceInfo.financialsYear2BS.fileInfos.length > 0;

    return hasRequiredFinancialDocuments && diligenceInfo.bankStatement.fileInfos.length > 0;
  };

  const validateLegalInformation = (): boolean => {
    const requiredFields = [
      'incorporationCertificate',
      'governmentId',
      'w9form',
      'other'
    ];

    // legalEntityChart n'est requis que si singleEntity est false
    if (!singleEntity) {
      requiredFields.push('legalEntityChart');
    }

    return requiredFields.every(field => 
      diligenceInfo[field as keyof typeof diligenceInfo].fileInfos.length > 0
    );
  };

  const getValidationErrors = () => {
    const errors: string[] = [];

    // Validation Ticketing Information
    if (diligenceInfo.ticketingCompanyReport.fileInfos.length === 0) {
      errors.push('Reports from ticketing company is required');
    }
    if (ticketingInfo.paymentProcessing === 'Venue' && diligenceInfo.ticketingServiceAgreement.fileInfos.length === 0) {
      errors.push('Ticketing Service Agreement is required');
    }

    // Validation Financial Information
    if (diligenceInfo.financialsYtdPL.fileInfos.length === 0) {
      errors.push('Year To Date — P&L is required');
    }
    if (diligenceInfo.financialsYtdBS.fileInfos.length === 0) {
      errors.push('Year To Date — Balance Sheet is required');
    }
    if (diligenceInfo.financialsYear1PL.fileInfos.length === 0) {
      errors.push('Year - 1 — P&L is required');
    }
    if (diligenceInfo.financialsYear1BS.fileInfos.length === 0) {
      errors.push('Year - 1 — Balance Sheet is required');
    }
    if (diligenceInfo.financialsYear2PL.fileInfos.length === 0) {
      errors.push('Year - 2 — P&L is required');
    }
    if (diligenceInfo.financialsYear2BS.fileInfos.length === 0) {
      errors.push('Year - 2 — Balance Sheet is required');
    }
    if (diligenceInfo.bankStatement.fileInfos.length === 0) {
      errors.push('Bank statements are required');
    }

    // Validation Legal Information
    if (diligenceInfo.incorporationCertificate.fileInfos.length === 0) {
      errors.push('Certificate of Incorporation is required');
    }
    if (!singleEntity && diligenceInfo.legalEntityChart.fileInfos.length === 0) {
      errors.push('Legal entity chart is required when multiple entities exist');
    }
   
    if (diligenceInfo.w9form.fileInfos.length === 0) {
      errors.push('Form W-9 is required');
    }

    return errors;
  };

  return {
    validateTicketingInformation,
    validateFinancialInformation,
    validateLegalInformation,
    getValidationErrors,
    isAllValid: () => 
      validateTicketingInformation() && 
      validateFinancialInformation() && 
      validateLegalInformation()
  };
}; 