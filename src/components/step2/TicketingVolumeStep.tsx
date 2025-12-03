import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateFundsInfo,  } from '../../store/form/formSlice';
import CurrencyField from '../customComponents/CurrencyField';
import { timingOfFunding, useOfProceeds } from '../../store/form/hubspotLists';
import DropdownField from '../customComponents/DropdownField';
import { useValidation } from '../../contexts/ValidationContext';


const Funding: React.FC = () => {
  const dispatch = useDispatch();
  const fundsInfo = useSelector((state: RootState) => state.form.formData.fundsInfo);
  const ticketingVolume = useSelector((state: RootState) => state.form.formData.volumeInfo);
  const { setFieldError } = useValidation();
  // Capital amount calculation (from YourFundingStep)
  let capitalAmount = 0;
  if(ticketingVolume.lastYearSales > 0  && ticketingVolume.lastYearEvents > 0) {
    const maxAmount = ticketingVolume.lastYearSales * 0.15;
    capitalAmount = maxAmount > 1000000 ? 1000000 : maxAmount;
  }

  // Funding handlers
  const handleFundsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(updateFundsInfo({ [name]: value }));
    setFieldError(name, null);
  };

  const handleFundsCurrencyChange = (name: string, value: string) => {
    dispatch(updateFundsInfo({ [name]: value }));
    setFieldError(name, null);
  };

  return (
    
      <div className="flex flex-col items-center justify-center w-full mt-16 animate-fade-in-right duration-1000">

        {capitalAmount !== 0 && <div className='flex flex-col items-center justify-center w-full mb-4'>
          <p className='text-sm text-neutral-900 mx-auto mb-4 text-center '>You could qualify for a funding up to:</p>
          <h3 className='font-bold bg-gradient-to-r from-amber-500 to-rose-500 text-5xl text-center mb-4 text-transparent bg-clip-text'>${capitalAmount.toLocaleString('en-US')} </h3>
        </div>}
        <CurrencyField label="Funding Needs ($)"  name="yourFunds" value={fundsInfo.yourFunds === '0' ? '' : fundsInfo.yourFunds} onChange={(value) => handleFundsCurrencyChange('yourFunds', value)} required />
        <DropdownField label="Timing for Funding" name="timingOfFunding" value={fundsInfo.timingOfFunding} onChange={handleFundsChange} error='' onBlur={() => { }} options={timingOfFunding} required />
        <DropdownField label="What do you plan to use the money for?" name="useOfProceeds" value={fundsInfo.useOfProceeds} onChange={handleFundsChange} error='' onBlur={() => { }} options={useOfProceeds} required />

      </div>
  );
};

export default Funding; 

