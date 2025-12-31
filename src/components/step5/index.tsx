import React from 'react';
import SummaryStep from './SummaryStep';

interface Step5Props {
  renderValidationErrors: React.ReactNode;
  onStepClick: (stepNumber: number) => void;
}

const Step5: React.FC<Step5Props> = ({ renderValidationErrors, onStepClick }) => {
  return <SummaryStep renderValidationErrors={renderValidationErrors} onStepClick={onStepClick} />;
};

export default Step5;
