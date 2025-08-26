import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useFormValidation = () => {
  const formData = useSelector((state: RootState) => state.form);

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

  const validatePersonalInfo = (): { isValid: boolean; errors: { [key: string]: string } } => {
    const { personalInfo } = formData.formData;
    const errors: { [key: string]: string } = {};

    if (!personalInfo.email.trim()) errors.email = 'Email is required';
    if(!personalInfo.emailConfirm.trim()) errors.emailConfirm = 'Email confirmation is required';
    if (!personalInfo.firstname.trim() || personalInfo.firstname.length < 2 ) errors.firstname = 'First name is required';
    if (personalInfo.firstname.length > 25 ) errors.firstname = 'First name is too long';
    if (!personalInfo.lastname.trim() || personalInfo.lastname.length < 2 ) errors.lastname = 'Last name is required';
    if (personalInfo.lastname.length > 25 ) errors.lastname = 'Last name is too long';
    if (!personalInfo.phone.trim() || personalInfo.phone.length < 15) errors.phone = 'Phone number is required';

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const validateCompanyInfo = (): { isValid: boolean; errors: { [key: string]: string } } => {
    const { companyInfo, personalInfo } = formData.formData;
    const errors: { [key: string]: string } = {};
    if (!companyInfo.name.trim()) errors.name = 'Company name is required';
    // Role field is in personalInfo but it is in the companyInfo step
    if (!personalInfo.role) errors.role = 'Role is required';
    if (!companyInfo.socials) errors.socials = 'Socials are required';
    if (!companyInfo.yearsInBusiness.trim()) errors.yearsInBusiness = 'Years in business is required';
    if (!companyInfo.employees) errors.employees = 'Number of employees is required';
    if (!companyInfo.clientType) errors.clientType = 'Company type is required';
      if (!companyInfo.memberOf) errors.memberOf = 'Membership is required';

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const validateTicketingInfo = (): { isValid: boolean; errors: { [key: string]: string } } => {
    const { ticketingInfo, volumeInfo } = formData.formData;
    const errors: { [key: string]: string } = {};

    if (!ticketingInfo.paymentProcessing) errors.paymentProcessing = 'Payment processing is required';
    if (ticketingInfo.paymentProcessing === 'Other' && !ticketingInfo.otherPaymentProcessing.trim()) errors.otherPaymentProcessing = 'Other payment processing is required';

    if (!ticketingInfo.currentPartner.trim()) errors.currentPartner = 'Ticketing partner is required';
    if (ticketingInfo.currentPartner === 'Other' && !ticketingInfo.otherPartner.trim()) errors.otherPartner = 'Other ticketing partner is required';
    if (!ticketingInfo.settlementPayout) errors.settlementPayout = 'Settlement payout policy is required';
    if (volumeInfo.lastYearEvents <= 0) errors.lastYearEvents = 'Last year events must be greater than 0';
    if (volumeInfo.lastYearTickets <= 0) errors.lastYearTickets = 'Last year tickets must be greater than 0';
    if (volumeInfo.lastYearSales <= 0) errors.lastYearSales = 'Last year sales must be greater than 0';
    if (volumeInfo.nextYearEvents <= 0) errors.nextYearEvents = 'Next year events must be greater than 0';
    if (volumeInfo.nextYearTickets <= 0) errors.nextYearTickets = 'Next year tickets must be greater than 0';
    if (volumeInfo.nextYearSales <= 0) errors.nextYearSales = 'Next year sales must be greater than 0';

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const validateFundsInfo = (): { isValid: boolean; errors: { [key: string]: string } } => {
    const { fundsInfo } = formData.formData;
    const errors: { [key: string]: string } = {};

    if (!fundsInfo.yourFunds.trim()) errors.yourFunds = 'Funding needs amount is required';
    if (!fundsInfo.timingOfFunding) errors.timingOfFunding = 'Timing for funding is required';
    if (!fundsInfo.useOfProceeds) errors.useOfProceeds = 'Use of proceeds is required';

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const validateOwnershipInfo = (): { isValid: boolean; errors: { [key: string]: string } } => {
    const { ownershipInfo } = formData.formData;
    const { companyInfo } = formData.formData;
    const errors: { [key: string]: string } = {};

    if (!companyInfo.name.trim()) errors.name = 'Legal entity name is required';
    if (!companyInfo.ein.trim()) errors.ein = 'EIN is required';
    if (!companyInfo.dba.trim()) errors.dba = 'DBA name is required';
    if (!companyInfo.companyAddress.trim()) errors.companyAddress = 'Company address is required';
    if (!companyInfo.stateOfIncorporation.trim()) errors.stateOfIncorporation = 'State of incorporation is required';
    if (!companyInfo.businessType) errors.businessType = 'Business type is required';
    if (ownershipInfo.owners.length === 0) {
      errors.owners = 'At least one owner is required';
    } else {
      ownershipInfo.owners.forEach((owner, index) => {
        if (!owner.ownerName) errors[`owner${index}Name`] = `Owner ${index + 1}: Name is required`;
        if (!owner.ownershipPercentage.trim()) errors[`owner${index}Percentage`] = `Owner ${index + 1}: Ownership percentage is required`;
        if (!owner.ownerAddress.trim()) errors[`owner${index}Address`] = `Owner ${index + 1}: Address is required`;
        if (!owner.ownerBirthDate.trim()) errors[`owner${index}BirthDate`] = `Owner ${index + 1}: Birth date is required`;
      });
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const validateFinancesInfo = (): { isValid: boolean; errors: { [key: string]: string } } => {
    const { financesInfo } = formData.formData;
    const { diligenceInfo } = formData;
    const errors: { [key: string]: string } = {};

    // Validate based on singleEntity condition
    if (!financesInfo.singleEntity && diligenceInfo.legalEntityChart.files.length === 0) {
      errors.legalEntityChart = 'Legal entity chart is required when not a single entity';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const validateTicketingDiligenceFiles = (): { isValid: boolean; errors: { [key: string]: string } } => {
    const { diligenceInfo } = formData;
    const errors: { [key: string]: string } = {};

    // Ticketing Information
    if (diligenceInfo.ticketingCompanyReport.files.length === 0) {
      errors.ticketingCompanyReport = 'Ticketing company report is required';
    }
    if (formData.formData.ticketingInfo.paymentProcessing === 'Venue' && diligenceInfo.ticketingServiceAgreement.files.length === 0) {
      errors.ticketingServiceAgreement = 'Ticketing service agreement is required';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };
  const validateFinancialDiligenceFiles = (): { isValid: boolean; errors: { [key: string]: string } } => {
    const { diligenceInfo } = formData;
    const errors: { [key: string]: string } = {};

    // Financial Information
    if (diligenceInfo.financialStatements.files.length === 0) {
      errors.financialStatements = 'Financial statements are required';
    }
    if (diligenceInfo.bankStatement.files.length === 0) {
      //errors.bankStatement = 'Bank statement is required';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };
  const validateLegalDiligenceFiles = (): { isValid: boolean; errors: { [key: string]: string } } => {
    const { diligenceInfo } = formData;
    const { financesInfo } = formData.formData;
    const errors: { [key: string]: string } = {};

    // Legal Information
    if (diligenceInfo.incorporationCertificate.files.length === 0) {
      errors.incorporationCertificate = 'Incorporation certificate is required';
    }
    if (!financesInfo.singleEntity && diligenceInfo.legalEntityChart.files.length === 0) {
      errors.legalEntityChart = 'Legal entity chart is required';
    }
    if (diligenceInfo.governmentId.files.length === 0) {
      //errors.governmentId = 'Government ID is required';
    }

    if (diligenceInfo.w9form.files.length === 0) {
      //errors.w9form = 'W9 form is required';
    }
  
    return { isValid: Object.keys(errors).length === 0, errors };
  };
  // New function to validate current step only
  const validateCurrentStep = (step: number): { isValid: boolean; errors: { [key: string]: string } } => {
    // Skip validation only if explicitly disabled in development mode
    if (isDevelopment && localStorage.getItem('DISABLE_VALIDATION') === 'true') { 
      console.log("DISABLE_VALIDATION", localStorage.getItem('DISABLE_VALIDATION'));
      return { isValid: true, errors: {} };
    }

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
        return { isValid: true, errors: {} }; // Other step - no validation needed
      case 11:
        return { isValid: true, errors: {} }; // Summary step - no validation needed
      default:
        return { isValid: true, errors: {} };
    }
  };

  const validateAllSteps = (): { isValid: boolean; errors: { [key: string]: { [key: string]: string } } } => {
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