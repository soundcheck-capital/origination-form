import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useFormValidation = () => {
  const formData = useSelector((state: RootState) => state.form);

  const validatePersonalInfo = (): boolean => {
    const { personalInfo } = formData.formData;
    return (
      personalInfo.email.trim() !== '' &&
      personalInfo.firstname.trim() !== '' &&
      personalInfo.lastname.trim() !== '' &&
      personalInfo.phone.trim() !== '' &&
      personalInfo.role.trim() !== ''
    );
  };

  const validateCompanyInfo = (): boolean => {
    const { companyInfo } = formData.formData;
    return (
      companyInfo.name.trim() !== '' &&
      companyInfo.dba.trim() !== '' &&
      companyInfo.yearsInBusiness.trim() !== '' &&
      companyInfo.clientType.trim() !== '' &&
      companyInfo.legalEntityType.trim() !== '' &&
      companyInfo.companyAddress.trim() !== '' &&
      companyInfo.companyCity.trim() !== '' &&
      companyInfo.companyState.trim() !== '' &&
      companyInfo.companyZipCode.trim() !== '' &&
      companyInfo.ein.trim() !== '' &&
      companyInfo.stateOfIncorporation.trim() !== ''
    );
  };

  const validateTicketingInfo = (): boolean => {
    const { ticketingInfo } = formData.formData;
    return (
      ticketingInfo.currentPartner.trim() !== '' &&
      ticketingInfo.settlementPolicy.trim() !== '' &&
      ticketingInfo.membership.trim() !== ''
    );
  };

  const validateVolumeInfo = (): boolean => {
    const { volumeInfo } = formData.formData;
    return (
      volumeInfo.lastYearEvents > 0 &&
      volumeInfo.lastYearTickets > 0 &&
      volumeInfo.lastYearSales > 0 &&
      volumeInfo.nextYearEvents > 0 &&
      volumeInfo.nextYearTickets > 0 &&
      volumeInfo.nextYearSales > 0
    );
  };

  const validateFundsInfo = (): boolean => {
    const { fundsInfo } = formData.formData;
    return (
      fundsInfo.yourFunds.trim() !== '' &&
      fundsInfo.fundUse.trim() !== '' &&
      fundsInfo.timeForFunding.trim() !== '' &&
      fundsInfo.recoupableAgainst.trim() !== ''
    );
  };

  const validateOwnershipInfo = (): boolean => {
    const { ownershipInfo } = formData.formData;
    return (
      ownershipInfo.owners.length > 0 &&
      ownershipInfo.owners.every(owner => 
        owner.name.trim() !== '' &&
        owner.ownershipPercentage.trim() !== '' &&
        owner.ownerAddress.trim() !== '' &&
        owner.ownerCity.trim() !== '' &&
        owner.ownerState.trim() !== '' &&
        owner.ownerZipCode.trim() !== ''
      )
    );
  };

  const getPersonalInfoErrors = (): string[] => {
    const { personalInfo } = formData.formData;
    const errors: string[] = [];

    if (personalInfo.email.trim() === '') errors.push('Email is required');
    if (personalInfo.firstname.trim() === '') errors.push('First name is required');
    if (personalInfo.lastname.trim() === '') errors.push('Last name is required');
    if (personalInfo.phone.trim() === '') errors.push('Phone number is required');
    if (personalInfo.role.trim() === '') errors.push('Role is required');

    return errors;
  };

  const getCompanyInfoErrors = (): string[] => {
    const { companyInfo } = formData.formData;
    const errors: string[] = [];

    if (companyInfo.name.trim() === '') errors.push('Company name is required');
    if (companyInfo.dba.trim() === '') errors.push('DBA name is required');
    if (companyInfo.yearsInBusiness.trim() === '') errors.push('Years in business is required');
    if (companyInfo.clientType.trim() === '') errors.push('Client type is required');
    if (companyInfo.legalEntityType.trim() === '') errors.push('Legal entity type is required');
    if (companyInfo.companyAddress.trim() === '') errors.push('Company address is required');
    if (companyInfo.companyCity.trim() === '') errors.push('Company city is required');
    if (companyInfo.companyState.trim() === '') errors.push('Company state is required');
    if (companyInfo.companyZipCode.trim() === '') errors.push('Company zip code is required');
    if (companyInfo.ein.trim() === '') errors.push('EIN is required');
    if (companyInfo.stateOfIncorporation.trim() === '') errors.push('State of incorporation is required');

    return errors;
  };

  const getTicketingInfoErrors = (): string[] => {
    const { ticketingInfo } = formData.formData;
    const errors: string[] = [];

    if (ticketingInfo.currentPartner.trim() === '') errors.push('Current partner is required');
    if (ticketingInfo.settlementPolicy.trim() === '') errors.push('Settlement policy is required');
    if (ticketingInfo.membership.trim() === '') errors.push('Membership is required');

    return errors;
  };

  const getVolumeInfoErrors = (): string[] => {
    const { volumeInfo } = formData.formData;
    const errors: string[] = [];

    if (volumeInfo.lastYearEvents <= 0) errors.push('Last year events must be greater than 0');
    if (volumeInfo.lastYearTickets <= 0) errors.push('Last year tickets must be greater than 0');
    if (volumeInfo.lastYearSales <= 0) errors.push('Last year sales must be greater than 0');
    if (volumeInfo.nextYearEvents <= 0) errors.push('Next year events must be greater than 0');
    if (volumeInfo.nextYearTickets <= 0) errors.push('Next year tickets must be greater than 0');
    if (volumeInfo.nextYearSales <= 0) errors.push('Next year sales must be greater than 0');

    return errors;
  };

  const getFundsInfoErrors = (): string[] => {
    const { fundsInfo } = formData.formData;
    const errors: string[] = [];

    if (fundsInfo.yourFunds.trim() === '') errors.push('Your funds amount is required');
    if (fundsInfo.fundUse.trim() === '') errors.push('Fund use is required');
    if (fundsInfo.timeForFunding.trim() === '') errors.push('Time for funding is required');
    if (fundsInfo.recoupableAgainst.trim() === '') errors.push('Recoupable against is required');

    return errors;
  };

  const getOwnershipInfoErrors = (): string[] => {
    const { ownershipInfo } = formData.formData;
    const errors: string[] = [];

    if (ownershipInfo.owners.length === 0) {
      errors.push('At least one owner is required');
    } else {
      ownershipInfo.owners.forEach((owner, index) => {
        if (owner.name.trim() === '') errors.push(`Owner ${index + 1}: Name is required`);
        if (owner.ownershipPercentage.trim() === '') errors.push(`Owner ${index + 1}: Ownership percentage is required`);
        if (owner.ownerAddress.trim() === '') errors.push(`Owner ${index + 1}: Address is required`);
        if (owner.ownerCity.trim() === '') errors.push(`Owner ${index + 1}: City is required`);
        if (owner.ownerState.trim() === '') errors.push(`Owner ${index + 1}: State is required`);
        if (owner.ownerZipCode.trim() === '') errors.push(`Owner ${index + 1}: Zip code is required`);
      });
    }

    return errors;
  };

  return {
    validatePersonalInfo,
    validateCompanyInfo,
    validateTicketingInfo,
    validateVolumeInfo,
    validateFundsInfo,
    validateOwnershipInfo,
    getPersonalInfoErrors,
    getCompanyInfoErrors,
    getTicketingInfoErrors,
    getVolumeInfoErrors,
    getFundsInfoErrors,
    getOwnershipInfoErrors,
  };
}; 