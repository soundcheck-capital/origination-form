import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useFormValidation = () => {
  const formData = useSelector((state: RootState) => state.form);

  const validatePersonalInfo = (): { isValid: boolean; errors: string[] } => {
    const { personalInfo } = formData.formData;
    const errors: string[] = [];

    if (!personalInfo.email.trim()) errors.push('Email is required');
    if (!personalInfo.firstname.trim()) errors.push('First name is required');
    if (!personalInfo.lastname.trim()) errors.push('Last name is required');
    if (!personalInfo.phone.trim()) errors.push('Phone number is required');
    if (!personalInfo.role.trim()) errors.push('Role is required');

    return { isValid: errors.length === 0, errors };
  };

  const validateCompanyInfo = (): { isValid: boolean; errors: string[] } => {
    const { companyInfo } = formData.formData;
    const { ticketingInfo } = formData.formData;
    const errors: string[] = [];

    if (!companyInfo.name.trim()) errors.push('Company name is required');
    if (!companyInfo.dba.trim()) errors.push('DBA name is required');
    if (!companyInfo.yearsInBusiness.trim()) errors.push('Years in business is required');
    if (!companyInfo.clientType.trim()) errors.push('Client type is required');
    if (!companyInfo.legalEntityType.trim()) errors.push('Legal entity type is required');
    if (!companyInfo.companyAddress.trim()) errors.push('Company address is required');
    if (!companyInfo.ein.trim()) errors.push('EIN is required');
    if (!companyInfo.stateOfIncorporation.trim()) errors.push('State of incorporation is required');
    if (!ticketingInfo.membership.trim()) errors.push('Membership is required');

    return { isValid: errors.length === 0, errors };
  };

  const validateTicketingInfo = (): { isValid: boolean; errors: string[] } => {
    const { ticketingInfo, volumeInfo } = formData.formData;
    const errors: string[] = [];

    if (!ticketingInfo.currentPartner.trim()) errors.push('Ticketing partner is required');
    if (!ticketingInfo.settlementPolicy.trim()) errors.push('Settlement policy is required');
    if (volumeInfo.lastYearEvents <= 0) errors.push('Last year events must be greater than 0');
    if (volumeInfo.lastYearTickets <= 0) errors.push('Last year tickets must be greater than 0');
    if (volumeInfo.lastYearSales <= 0) errors.push('Last year sales must be greater than 0');
    if (volumeInfo.nextYearEvents <= 0) errors.push('Next year events must be greater than 0');
    if (volumeInfo.nextYearTickets <= 0) errors.push('Next year tickets must be greater than 0');
    if (volumeInfo.nextYearSales <= 0) errors.push('Next year sales must be greater than 0');

    return { isValid: errors.length === 0, errors };
  };

  const validateFundsInfo = (): { isValid: boolean; errors: string[] } => {
    const { fundsInfo } = formData.formData;
    const errors: string[] = [];

    if (!fundsInfo.yourFunds.trim()) errors.push('Funding needs amount is required');
    if (!fundsInfo.timeForFunding.trim()) errors.push('Time for funding is required');
    if (!fundsInfo.fundUse.trim()) errors.push('Fund use is required');

    return { isValid: errors.length === 0, errors };
  };

  const validateOwnershipInfo = (): { isValid: boolean; errors: string[] } => {
    const { ownershipInfo } = formData.formData;
    const errors: string[] = [];

    if (ownershipInfo.owners.length === 0) {
      errors.push('At least one owner is required');
    } else {
      ownershipInfo.owners.forEach((owner, index) => {
        if (!owner.name.trim()) errors.push(`Owner ${index + 1}: Name is required`);
        if (!owner.ownershipPercentage.trim()) errors.push(`Owner ${index + 1}: Ownership percentage is required`);
      });
    }

    return { isValid: errors.length === 0, errors };
  };

  const validateFinancesInfo = (): { isValid: boolean; errors: string[] } => {
    const { financesInfo, diligenceInfo } = formData;
    const errors: string[] = [];

    // Validate based on singleEntity condition
    if (!financesInfo.singleEntity && diligenceInfo.legalEntityChart.files.length === 0) {
      errors.push('Legal entity chart is required when not a single entity');
    }

    return { isValid: errors.length === 0, errors };
  };

  const validateDiligenceFiles = (): { isValid: boolean; errors: string[] } => {
    const { diligenceInfo } = formData;
    const errors: string[] = [];

    // Ticketing Information
    if (diligenceInfo.ticketingCompanyReport.files.length === 0) {
      errors.push('Ticketing company report is required');
    }
    if (diligenceInfo.ticketingServiceAgreement.files.length === 0) {
      errors.push('Ticketing service agreement is required');
    }

    // Financial Information
    if (diligenceInfo.financialStatements.files.length === 0) {
      errors.push('Financial statements are required');
    }
    if (diligenceInfo.bankStatement.files.length === 0) {
      errors.push('Bank statement is required');
    }

    // Legal Information
    if (diligenceInfo.incorporationCertificate.files.length === 0) {
      errors.push('Incorporation certificate is required');
    }
    if (diligenceInfo.governmentId.files.length === 0) {
      errors.push('Government ID is required');
    }
    if (diligenceInfo.w9form.files.length === 0) {
      errors.push('W9 form is required');
    }

    return { isValid: errors.length === 0, errors };
  };

  const validateAllSteps = (): { isValid: boolean; errors: { [key: string]: string[] } } => {
    const personalInfo = validatePersonalInfo();
    const companyInfo = validateCompanyInfo();
    const ticketingInfo = validateTicketingInfo();
    const fundsInfo = validateFundsInfo();
    const ownershipInfo = validateOwnershipInfo();
    const financesInfo = validateFinancesInfo();
    const diligenceFiles = validateDiligenceFiles();

    const allErrors = {
      'Personal Information': personalInfo.errors,
      'Company Information': companyInfo.errors,
      'Ticketing Information': ticketingInfo.errors,
      'Funding Information': fundsInfo.errors,
      'Ownership Information': ownershipInfo.errors,
      'Financial Information': financesInfo.errors,
      'Diligence Files': diligenceFiles.errors,
    };

    const isValid = personalInfo.isValid && 
                   companyInfo.isValid && 
                   ticketingInfo.isValid && 
                   fundsInfo.isValid && 
                   ownershipInfo.isValid && 
                   financesInfo.isValid && 
                   diligenceFiles.isValid;

    return { isValid, errors: allErrors };
  };

  return {
    validatePersonalInfo,
    validateCompanyInfo,
    validateTicketingInfo,
    validateFundsInfo,
    validateOwnershipInfo,
    validateFinancesInfo,
    validateDiligenceFiles,
    validateAllSteps,
  };
}; 