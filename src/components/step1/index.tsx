import React from 'react';
import PersonalInfo from './PersonalInfo';
import CompanyInfo from './CompanyInfo';
import TicketingFunding from './TicketingInformations';

const Step1: React.FC = () => {
  return (
    <>
      <PersonalInfo />
      <CompanyInfo />
      <TicketingFunding />
      <p className="text-sm text-gray-500 my-4 text-center ">By filling this form, you agree to SoundCheck Capital <a href="https://soundcheckcapital.com/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-blue-500">Terms of Service</a> and <a href="https://soundcheckcapital.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-500">Privacy Policy</a></p>

    </>
  );
};

export default Step1;
