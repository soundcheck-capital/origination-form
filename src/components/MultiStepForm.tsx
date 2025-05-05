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

const MultiStepForm: React.FC = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector((state: RootState) => state.form.currentStep);
  const totalSteps = 10; // Updated total steps

  const nextStep = () => {
    if (currentStep < totalSteps) {
      dispatch(setCurrentStep(currentStep + 1));
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
        return <OwnershipStep />;
      case 7:
        return <FinancesStep />;
      case 8:
        return <DiligenceStep />;
      case 9:
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
          <button className="btn btn-success" onClick={() => console.log('Submit')}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm; 