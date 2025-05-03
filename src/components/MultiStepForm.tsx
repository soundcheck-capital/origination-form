import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setCurrentStep } from '../store/formSlice';
import PersonalInfoStep from './PersonalInfoStep';
import LegalInfoStep from './LegalInfoStep';
import CompanyInfoStep from './CompanyInfoStep';
import TicketingStep from './TicketingStep';
import VolumeStep from './VolumeStep';
import FundsStep from './FundsStep';
import OwnershipStep from './OwnershipStep';
import FinancesStep from './FinancesStep';
import DiligenceStep from './DiligenceStep';
import PreferencesStep from './PreferencesStep';

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
        return <VolumeStep />;
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
        return <PreferencesStep />;
      default:
        return null;
    }
  };

  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="multi-step-form">
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
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