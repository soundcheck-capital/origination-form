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
    return (
      diligenceInfo.financialStatements.fileInfos.length > 0 &&
      diligenceInfo.bankStatement.fileInfos.length > 0
    );
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
    if (diligenceInfo.financialStatements.fileInfos.length === 0) {
      errors.push('Financial statements are required');
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