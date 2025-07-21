import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useFormValidation = () => {
  const formData = useSelector((state: RootState) => state.form);

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

  const validatePersonalInfo = (): { isValid: boolean; errors: string[] } => {
    const { personalInfo } = formData.formData;
    const errors: string[] = [];

    if (!personalInfo.email.trim()) errors.push('Email is required');
    if(!personalInfo.emailConfirm.trim()) errors.push('Email confirmation is required');
    if (!personalInfo.firstname.trim()) errors.push('First name is required');
    if (!personalInfo.lastname.trim()) errors.push('Last name is required');
    if (!personalInfo.phone.trim()) errors.push('Phone number is required');

    return { isValid: errors.length === 0, errors };
  };

  const validateCompanyInfo = (): { isValid: boolean; errors: string[] } => {
    const { companyInfo } = formData.formData;
    const { ticketingInfo } = formData.formData;
    const errors: string[] = [];

    if (!companyInfo.name.trim()) errors.push('Company name is required');
    if (!companyInfo.role) errors.push('Role is required');
    if (!companyInfo.socials) errors.push('Socials are required');
    if (!companyInfo.yearsInBusiness.trim()) errors.push('Years in business is required');
    if (!companyInfo.employees) errors.push('Number of employees is required');
    if (!companyInfo.companyType) errors.push('Company type is required');
    if (!ticketingInfo.membership.trim()) errors.push('Membership is required');

    return { isValid: errors.length === 0, errors };
  };

  const validateTicketingInfo = (): { isValid: boolean; errors: string[] } => {
    const { ticketingInfo, volumeInfo } = formData.formData;
    const errors: string[] = [];

    if (!ticketingInfo.ticketingPayout.trim()) errors.push('Ticketing payout is required');
    if (ticketingInfo.ticketingPayout === 'Other' && !ticketingInfo.otherTicketingPayout.trim()) errors.push('Other ticketing payout is required');

    if (!ticketingInfo.currentPartner.trim()) errors.push('Ticketing partner is required');
    if (ticketingInfo.currentPartner === 'Other' && !ticketingInfo.otherPartner.trim()) errors.push('Other ticketing partner is required');
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
    if (!fundsInfo.timeForFunding.trim()) errors.push('Timing for funding is required');
    if (!fundsInfo.fundUse.trim()) errors.push('Fund use is required');

    return { isValid: errors.length === 0, errors };
  };

  const validateOwnershipInfo = (): { isValid: boolean; errors: string[] } => {
    const { ownershipInfo } = formData.formData;
    const { companyInfo } = formData.formData;
    const errors: string[] = [];

    if (!companyInfo.name.trim()) errors.push('Company name is required');
    if (!companyInfo.ein.trim()) errors.push('EIN is required');
    if (!companyInfo.dba.trim()) errors.push('DBA name is required');
    if (!companyInfo.companyAddress.trim()) errors.push('Company address is required');
    if (!companyInfo.stateOfIncorporation.trim()) errors.push('State of incorporation is required');
    if (!companyInfo.legalEntityType.trim()) errors.push('Legal entity type is required');
    if (ownershipInfo.owners.length === 0) {
      errors.push('At least one owner is required');
    } else {
      ownershipInfo.owners.forEach((owner, index) => {
        if (!owner.name.trim()) errors.push(`Owner ${index + 1}: Name is required`);
        if (!owner.ownershipPercentage.trim()) errors.push(`Owner ${index + 1}: Ownership percentage is required`);
        if (!owner.ownerAddress.trim()) errors.push(`Owner ${index + 1}: Address is required`);
        if (!owner.ownerBirthDate.trim()) errors.push(`Owner ${index + 1}: Birth date is required`);

      
      });
    }

    return { isValid: errors.length === 0, errors };
  };

  const validateFinancesInfo = (): { isValid: boolean; errors: string[] } => {
    const { financesInfo, diligenceInfo } = formData;
    const errors: string[] = [];

  

    return { isValid: errors.length === 0, errors };
  };

  const validateTicketingDiligenceFiles = (): { isValid: boolean; errors: string[] } => {
    const { diligenceInfo } = formData;
    const errors: string[] = [];

    // Ticketing Information
    if (diligenceInfo.ticketingCompanyReport.files.length === 0) {
      errors.push('Ticketing company report is required');
    }
    if (diligenceInfo.ticketingServiceAgreement.files.length === 0) {
      errors.push('Ticketing service agreement is required');
    }

    return { isValid: errors.length === 0, errors };
  };
  const validateFinancialDiligenceFiles = (): { isValid: boolean; errors: string[] } => {
    const { diligenceInfo } = formData;
    const errors: string[] = [];

  
    // Financial Information
    if (diligenceInfo.financialStatements.files.length === 0) {
      errors.push('Financial statements are required');
    }
    if (diligenceInfo.bankStatement.files.length === 0) {
      errors.push('Bank statement is required');
    }

   

    return { isValid: errors.length === 0, errors };
  };
  const validateLegalDiligenceFiles = (): { isValid: boolean; errors: string[] } => {
    const { diligenceInfo, financesInfo } = formData;
    const errors: string[] = [];

   

    // Legal Information
    if (diligenceInfo.incorporationCertificate.files.length === 0) {
      errors.push('Incorporation certificate is required');
    }
    if (!financesInfo.singleEntity && diligenceInfo.legalEntityChart.files.length === 0) {
      errors.push('Legal entity chart is required');
    }
    if (diligenceInfo.governmentId.files.length === 0) {
      errors.push('Government ID is required');
    }

    if (diligenceInfo.w9form.files.length === 0) {
      errors.push('W9 form is required');
    }
  
    return { isValid: errors.length === 0, errors };
  };
  // New function to validate current step only
  const validateCurrentStep = (step: number): { isValid: boolean; errors: string[] } => {
    // Skip validation only if explicitly disabled in development mode
    // if (isDevelopment && localStorage.getItem('DISABLE_VALIDATION') === 'true') {
    //   return { isValid: true, errors: [] };
    // }

    switch (step) {
      case 1:
        return validatePersonalInfo();
      case 2:
        return validateCompanyInfo();
      case 3:
        return validateTicketingInfo();
      case 4:
        return validateFundsInfo();
      case 5:
        return validateOwnershipInfo();
      case 6:
        return validateFinancesInfo();
      case 7:
        return validateTicketingDiligenceFiles();
      case 8:
        return validateFinancialDiligenceFiles();
      case 9:
        return validateLegalDiligenceFiles();
      case 10:
        return { isValid: true, errors: [] }; // Other step - no validation needed
      case 11:
        return { isValid: true, errors: [] }; // Summary step - no validation needed
      default:
        return { isValid: true, errors: [] };
    }
  };

  const validateAllSteps = (): { isValid: boolean; errors: { [key: string]: string[] } } => {
    const personalInfo = validatePersonalInfo();
    const companyInfo = validateCompanyInfo();
    const ticketingInfo = validateTicketingInfo();
    const fundsInfo = validateFundsInfo();
    const ownershipInfo = validateOwnershipInfo();
    const financesInfo = validateFinancesInfo();
    const ticketingDiligenceFiles = validateTicketingDiligenceFiles();
    const financialDiligenceFiles = validateFinancialDiligenceFiles();
    const legalDiligenceFiles = validateLegalDiligenceFiles();

    const allErrors = {
      'Personal Information': personalInfo.errors,
      'Company Information': companyInfo.errors,
      'Ticketing Information': ticketingInfo.errors,
      'Funding Information': fundsInfo.errors,
      'Ownership Information': ownershipInfo.errors,
      'Financial Information': financesInfo.errors,
      'Ticketing Diligence Files': ticketingDiligenceFiles.errors,
      'Financial Diligence Files': financialDiligenceFiles.errors,
      'Legal Diligence Files': legalDiligenceFiles.errors,
    };

    const isValid = personalInfo.isValid && 
                   companyInfo.isValid && 
                   ticketingInfo.isValid && 
                   fundsInfo.isValid && 
                   ownershipInfo.isValid && 
                   financesInfo.isValid && 
                   ticketingDiligenceFiles.isValid &&
                   financialDiligenceFiles.isValid &&
                   legalDiligenceFiles.isValid;

    return { isValid, errors: allErrors };
  };

  return {
    validatePersonalInfo,
    validateCompanyInfo,
    validateTicketingInfo,
    validateFundsInfo,
    validateOwnershipInfo,
    validateFinancesInfo,
    validateTicketingDiligenceFiles,
    validateFinancialDiligenceFiles,
    validateLegalDiligenceFiles,
    validateCurrentStep,
    validateAllSteps,
    isDevelopment,
  };
}; 