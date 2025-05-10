import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setCurrentStep } from '../store/formSlice';
import PersonalInfoStep from './PersonalInfoStep';
import CompanyInfoStep from './CompanyInfoStep';
import TicketingStep from './TicketingStep';
import TicketingVolumeStep from './TicketingVolumeStep';
import OwnershipStep from './OwnershipStep';
import FinancesStep from './FinancesStep';
import FundsStep from './FundsStep';
import DiligenceStep from './DiligenceStep';
import SummaryStep from './SummaryStep';
import logo from '../assets/logo_black_name.svg';
import LegalInfoStep from './LegalInfoStep';

const MultiStepForm: React.FC = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector((state: RootState) => state.form.currentStep);
  const totalSteps = 10; // Updated total steps
  const application = useSelector((state: RootState) => state.form.formData);
  const financesInfo = useSelector((state: RootState) => state.form.financesInfo);
  const diligenceInfo = useSelector((state: RootState) => state.form.diligenceInfo);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('email', application.personalInfo.email);
    formData.append('currentPartner', application.ticketingInfo.currentPartner);
    formData.append('settlementPolicy', application.ticketingInfo.settlementPolicy);
    formData.append('membership', application.ticketingInfo.membership);
    formData.append('lastYearEvents', application.volumeInfo.lastYearEvents.toString());
    formData.append('lastYearTickets', application.volumeInfo.lastYearTickets.toString());
    formData.append('lastYearSales', application.volumeInfo.lastYearSales.toString());
    formData.append('nextYearEvents', application.volumeInfo.nextYearEvents.toString());
    formData.append('nextYearTickets', application.volumeInfo.nextYearTickets.toString());
    formData.append('nextYearSales', application.volumeInfo.nextYearSales.toString());
    formData.append('yourFunds', application.fundsInfo.yourFunds);
    formData.append('recoupmentPeriod', application.fundsInfo.recoupmentPeriod);
    formData.append('recoupmentPercentage', application.fundsInfo.recoupmentPercentage);
    formData.append('fundUse', application.fundsInfo.fundUse);
    formData.append('companyName', application.companyInfo.name);
    formData.append('companyWebsite', application.companyInfo.socials);
    formData.append('companySize', application.companyInfo.employees.toString());
    formData.append('companyYearsInBusiness', application.companyInfo.yearsInBusiness);
    formData.append('companyTaxId', application.companyInfo.taxId);
    
    formData.append('ein', application.ownershipInfo.ein);
    formData.append('dba', application.ownershipInfo.dba);
    formData.append('companyType', application.ownershipInfo.companyType);
    formData.append('legalEntityType', application.ownershipInfo.legalEntityType);
    formData.append('companyAddress', application.ownershipInfo.companyAddress);
    formData.append('companyCity', application.ownershipInfo.companyCity);
    formData.append('companyState', application.ownershipInfo.companyState);
    formData.append('companyZipCode', application.ownershipInfo.companyZipCode);
    formData.append('companyOwners', application.ownershipInfo.owners.toString());

    formData.append('filedLastYearTaxes', financesInfo.filedLastYearTaxes.toString());
    formData.append('hasBusinessDebt', financesInfo.hasBusinessDebt.toString());
    formData.append('hasOverdueLiabilities', financesInfo.hasOverdueLiabilities.toString());
    formData.append('isLeasingLocation', financesInfo.isLeasingLocation.toString());
    formData.append('leaseEndDate', financesInfo.leaseEndDate);
    formData.append('hasTaxLiens', financesInfo.hasTaxLiens.toString());
    formData.append('hasJudgments', financesInfo.hasJudgments.toString());
    formData.append('hasBankruptcy', financesInfo.hasBankruptcy.toString());
    formData.append('ownershipChanged', financesInfo.ownershipChanged.toString());

    formData.append('bankAccountLinked', diligenceInfo.bankAccountLinked.toString()); 
    formData.append('ticketingCompanyReport', diligenceInfo.ticketingCompanyReport[0]); 
    formData.append('ticketingProjections', diligenceInfo.ticketingProjections[0]); 
    formData.append('ticketingServiceAgreement', diligenceInfo.ticketingServiceAgreement[0]); 
    formData.append('incorporationCertificate', diligenceInfo.incorporationCertificate[0]); 
    formData.append('legalEntityChart', diligenceInfo.legalEntityChart[0]); 
    formData.append('governmentId', diligenceInfo.governmentId[0]); 
    formData.append('einAuthentication', diligenceInfo.einAuthentication[0]); 
    formData.append('financialStatements', diligenceInfo.financialStatements[0]); 
    formData.append('bankStatement', diligenceInfo.bankStatement[0]); 
    if(financesInfo.hasBusinessDebt) {
      formData.append('hasBusinessDebt', financesInfo.hasBusinessDebt.toString());
      let debts = '';
      financesInfo.debts.forEach(debt => {
        debts += debt.type + ' ' + debt.balance + '-';
     
      });
      formData.append('debts', debts);

    }else{
      formData.append('hasBusinessDebt', financesInfo.hasBusinessDebt.toString());
    }

  
    await fetch('https://hook.us1.make.com/i5625jtll5v0h4i8ru26v26nf6rogyd5', {
      method: 'POST',
      body: formData, // pas de headers ! Let the browser set it
    });
  };
  
  
  const nextStep = () => {
    if (currentStep < totalSteps) {
      dispatch(setCurrentStep(currentStep + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });

    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      dispatch(setCurrentStep(currentStep - 1));
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep />;
      case 2:
        return <CompanyInfoStep />;
      case 3:
        return <TicketingStep />;
      case 4:
        return <TicketingVolumeStep />;
      case 5:
        return <FundsStep />;
      case 6:
        return <LegalInfoStep />;
      case 7:
        return <OwnershipStep />;
      case 8:
        return <FinancesStep />;
      case 9:
        return <DiligenceStep />;
      case 10:
        return <SummaryStep />;
      default:
        return null;
    }

  };

  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
  return (
    <div className="multi-step-form">
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      {renderStep()}

      <div className="form-navigation">
        {currentStep > 1 && (
          <button className="btn btn-secondary" onClick={previousStep}>
            Previous
          </button>
        )}
        {currentStep < totalSteps && (
          <button className="btn btn-primary" onClick={nextStep}>
            Next
          </button>
        )}
        {currentStep === totalSteps && (
          <button className="btn btn-success" onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm; 