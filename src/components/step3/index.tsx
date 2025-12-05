import React from 'react';
import BusinessOwnership from './BusinessOwnership';
import FinancesStep from './Finances';
import OtherStep from '../step3/OtherStep';

const Step3: React.FC = () => {
    return  (  <>

      <BusinessOwnership />
      <FinancesStep />
      <OtherStep />
      </>);
      
    };


export default Step3;