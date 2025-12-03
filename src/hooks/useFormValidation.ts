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
    if (!companyInfo.clientType) errors.clientType = 'Company type is required';
      if (!companyInfo.memberOf) errors.memberOf = 'Membership is required';

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const validateTicketingFundingInfo = (): { isValid: boolean; errors: { [key: string]: string } } => {
    const { ticketingInfo, volumeInfo, fundsInfo } = formData.formData;
    const errors: { [key: string]: string } = {};

    // Ticketing validation
    if (!ticketingInfo.paymentProcessing) errors.paymentProcessing = 'Payment processing is required';
    if (!ticketingInfo.currentPartner.trim()) errors.currentPartner = 'Ticketing partner is required';
    if (ticketingInfo.currentPartner === 'Other' && !ticketingInfo.otherPartner.trim()) errors.otherPartner = 'Other ticketing partner is required';
    if (!ticketingInfo.settlementPayout) errors.settlementPayout = 'Settlement payout policy is required';
    if (volumeInfo.lastYearEvents <= 0) errors.lastYearEvents = 'Last year events must be greater than 0';
    if (volumeInfo.lastYearSales <= 0) errors.lastYearSales = 'Last year sales must be greater than 0';

    // Funding validation
    if (!fundsInfo.yourFunds.trim()) errors.yourFunds = 'Funding needs amount is required';
    if (!fundsInfo.timingOfFunding) errors.timingOfFunding = 'Timing for funding is required';
    if (!fundsInfo.useOfProceeds) errors.useOfProceeds = 'Use of proceeds is required';

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const validateBusinessFinancialInfo = (): { isValid: boolean; errors: { [key: string]: string } } => {
    const { ownershipInfo, companyInfo, financesInfo } = formData.formData;
    const errors: { [key: string]: string } = {};

    // Business info validation (legal information)
    if (!companyInfo.ein.trim()) errors.ein = 'EIN is required';
    if (!companyInfo.stateOfIncorporation.trim()) errors.stateOfIncorporation = 'State of incorporation is required';
    if (!companyInfo.businessType) errors.businessType = 'Business type is required';
    if (!companyInfo.companyAddressDisplay.trim()) errors.companyAddressDisplay = 'Company address is required';
    
    // Ownership validation
    if (ownershipInfo.owners.length === 0) {
      errors.owners = 'At least one owner is required';
    } else {
      ownershipInfo.owners.forEach((owner, index) => {
        if (!owner.ownerName) errors[`owner${index}Name`] = `Owner ${index + 1}: Name is required`;
        if (!owner.ownershipPercentage.trim()) errors[`owner${index}Percentage`] = `Owner ${index + 1}: Ownership percentage is required`;
        if (!owner.ownerAddress.trim()) errors[`owner${index}Address`] = `Owner ${index + 1}: Address is required`;
        if (!owner.ownerBirthDate.trim()) errors[`owner${index}BirthDate`] = `Owner ${index + 1}: Birth date is required`;
      });
      const totalPercentage = ownershipInfo.owners.reduce((sum, owner) => sum + parseFloat(owner.ownershipPercentage), 0);
      if(totalPercentage > 100){
        errors.ownershipPercentage = 'Total ownership percentage cannot exceed 100%';
      }
    }

    // Financial validation (basic required fields only)
    if (financesInfo.hasBusinessDebt && financesInfo.debts.length === 0) {
      errors.debts = 'Please provide debt details';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const validateAllUploadsInfo = (): { isValid: boolean; errors: { [key: string]: string } } => {
    const { diligenceInfo } = formData;
    const { financesInfo } = formData.formData;
    const errors: { [key: string]: string } = {};

    // Ticketing Information files
    if (diligenceInfo.ticketingCompanyReport.files.length === 0) {
      errors.ticketingCompanyReport = 'Ticketing company report is required';
    }
    if (formData.formData.ticketingInfo.paymentProcessing === 'Venue' && diligenceInfo.ticketingServiceAgreement.files.length === 0) {
      errors.ticketingServiceAgreement = 'Ticketing service agreement is required';
    }

    // Financial Information files
    if (diligenceInfo.financialStatements.files.length === 0) {
      errors.financialStatements = 'Financial statements are required';
    }

    // Legal Information files
    if (diligenceInfo.incorporationCertificate.files.length === 0) {
      errors.incorporationCertificate = 'Incorporation certificate is required';
    }
    if (!financesInfo.singleEntity && diligenceInfo.legalEntityChart.files.length === 0) {
      errors.legalEntityChart = 'Legal entity chart is required';
    }

    // Additional Information
    if (!financesInfo.additionalComments.trim()) errors.additionalComments = 'Additional comments are required';
    if (!financesInfo.industryReferences.trim()) errors.industryReferences = 'Industry references are required';

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const validateAdditionalInfo = (): { isValid: boolean; errors: { [key: string]: string } } => {
    const { additionalComments, industryReferences } = formData.formData.financesInfo;
    const errors: { [key: string]: string } = {};
    if (!additionalComments.trim()) errors.additionalComments = 'Additional comments are required';
    if (!industryReferences.trim()) errors.industryReferences = 'Industry references are required';
    return { isValid: Object.keys(errors).length === 0, errors };
  };

  // Validate Step 1: Personal + Company Info (consolidated)
  const validateStep1 = (): { isValid: boolean; errors: { [key: string]: string } } => {
    const personalValidation = validatePersonalInfo();
    const companyValidation = validateCompanyInfo();
    
    return {
      isValid: personalValidation.isValid && companyValidation.isValid,
      errors: { ...personalValidation.errors, ...companyValidation.errors }
    };
  };

  // New function to validate current step only
  const validateCurrentStep = (step: number): { isValid: boolean; errors: { [key: string]: string } } => {
    // Skip validation only if explicitly disabled in development mode
    if (isDevelopment && localStorage.getItem('DISABLE_VALIDATION') === 'true') { 
        isDevelopment && console.log("DISABLE_VALIDATION", localStorage.getItem('DISABLE_VALIDATION'));
      return { isValid: true, errors: {} };
    }

    switch (step) {
      case 1:
        return validateStep1(); // Personal + Company Info
      case 2:
        return validateTicketingFundingInfo(); // Ticketing + Funding
      case 3:
        return validateBusinessFinancialInfo(); // Business + Financial
      case 4:
        return validateAllUploadsInfo(); // All Uploads
      case 5:
        return { isValid: true, errors: {} }; // Summary step - no validation needed
      default:
        return { isValid: true, errors: {} };
    }
  };

  const validateAllSteps = (): { isValid: boolean; errors: { [key: string]: { [key: string]: string } } } => {
    const step1Info = validateStep1();
    const ticketingFundingInfo = validateTicketingFundingInfo();
    const businessFinancialInfo = validateBusinessFinancialInfo();
    const allUploadsInfo = validateAllUploadsInfo();
    
    const allErrors = {
      'Tell us about your business': step1Info.errors,
      'Ticketing & Funding': ticketingFundingInfo.errors,
      'Business & Ownership': businessFinancialInfo.errors,
      'Diligence': allUploadsInfo.errors,
    };

    const isValid = step1Info.isValid && 
                   ticketingFundingInfo.isValid && 
                   businessFinancialInfo.isValid && 
                   allUploadsInfo.isValid;

    return { isValid, errors: allErrors };
  };

  return {
    validatePersonalInfo,
    validateCompanyInfo,
    validateStep1,
    validateTicketingFundingInfo,
    validateBusinessFinancialInfo,
    validateAllUploadsInfo,
    validateAdditionalInfo,
    validateCurrentStep,
    validateAllSteps,
    isDevelopment,
  };
}; 