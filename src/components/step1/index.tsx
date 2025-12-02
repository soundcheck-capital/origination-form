import React from 'react';
import PersonalInfoStep from './PersonalInfoStep';
import CompanyInfoStep from './CompanyInfoStep';

const Step1: React.FC = () => {
  return (
    <>
      <PersonalInfoStep />
      <CompanyInfoStep />
    </>
  );
};

export default Step1;
