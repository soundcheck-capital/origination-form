import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateFundsInfo, updateTicketingInfo, updateVolumeInfo } from '../store/form/formSlice';
import TicketingVolumeStep from './TicketingVolumeStep';
import StepTitle from './customComponents/StepTitle';
import DropdownField from './customComponents/DropdownField';
import CurrencyField from './customComponents/CurrencyField';



const timeForFunding = [
    'In the next week',
    'In the next month',
    'In the next 3 months',
  ];
const recoupableAgainst = [
  'Ongoing ticket sales (venue, movie, theater, etc.)',
  'Ticket sales from a list of events (tour, league,etc)',
  'Ticket sales from a specific event (festival, sporting event, expo, etc)',
];

const fundUses = [
    'Artist deposit',
    'Show marketing',
    'Other show expenses',
    'Operational expenses',
    'Existing location improvement',
    'Opening a new location',
    'Short term cash flow needs',
    'Refinance my debt'
  ];

const YourFundingStep: React.FC = () => {
  const dispatch = useDispatch();
  const fundsInfo = useSelector((state: RootState) => state.form.formData.fundsInfo);
  const ticketingVolume = useSelector((state: RootState) => state.form.formData.volumeInfo);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(updateFundsInfo({ [name]: value }));

  };
  const handleCurrencyChange = (name: string, value: string) => {
    dispatch(updateFundsInfo({ [name]: value }));
  };
 
  return (
    <div className="flex flex-col items-center justify-center w-full mt-16">

      <CurrencyField label="Funding Needs ($)"  value={fundsInfo.yourFunds} onChange={(value) => handleCurrencyChange('yourFunds', value)}  />
      <DropdownField label="Timing for Funding" name="timeForFunding" value={fundsInfo.timeForFunding} onChange={handleChange} error='' onBlur={() => { }} options={timeForFunding} />
      <DropdownField label="How do you plan to use your advance?" name="fundUse" value={fundsInfo.fundUse} onChange={handleChange} error='' onBlur={() => { }} options={fundUses} />
      <DropdownField label="Advance Recoupable Against" name="recoupableAgainst" value={fundsInfo.recoupableAgainst} onChange={handleChange} error='' onBlur={() => { }} options={recoupableAgainst} /> 



    </div>
  );
};

export default YourFundingStep; 