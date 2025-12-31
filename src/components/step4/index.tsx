import React from 'react';
import TicketingInformationStep from './TicketingInformationStep';
import FinancialInformationStep from './FinancialInformationStep';
import LegalInformationStep from './LegalInformationStep';

const Step4: React.FC = () => {
  return (
    <div className="flex flex-col justify-center w-full pt-8 animate-fade-in-right duration-1000">
      <TicketingInformationStep />
      <FinancialInformationStep />
      <LegalInformationStep />
    </div>
  );
};

export default Step4;
