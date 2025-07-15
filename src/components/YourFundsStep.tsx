import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateFundsInfo, updateTicketingInfo, updateVolumeInfo } from '../store/form/formSlice';
import TicketingVolumeStep from './TicketingVolumeStep';
import StepTitle from './customComponents/StepTitle';
import DropdownField from './customComponents/DropdownField';
import CurrencyField from './customComponents/CurrencyField';



const timeForFunding = [
    'In the next 2 weeks',
    'In the next month',
    'In the next 3 months',
  ];
const recoupableAgainst = [
  'Ongoing ticket sales (venue, movie, theater, etc.)',
  'Ticket sales from a list of events (tour, league,etc)',
  'Ticket sales from a specific event (festival, sporting event, expo, etc)',
];

const fundUses = [
  'Artist Deposit',
  'Show Marketing',
  'Operational / Show Expenses',
  'General Working Capital Needs',
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
  let capitalAmount = 0;
  if(ticketingVolume.lastYearSales > 0 && ticketingVolume.nextYearSales > 0 && ticketingVolume.lastYearTickets > 0 && ticketingVolume.nextYearTickets > 0 && ticketingVolume.lastYearEvents > 0 && ticketingVolume.nextYearEvents > 0) {
    const maxAmount = ticketingVolume.lastYearSales * 0.15;
    capitalAmount = maxAmount > 1000000 ? 1000000 : maxAmount;
  }
  return (
    <div className="flex flex-col items-center justify-center w-full mt-16 animate-fade-in-right duration-1000">

      {capitalAmount != 0 && <div className='flex flex-col items-center justify-center w-full mb-4'>
        <p className='text-sm text-neutral-900 mx-auto mb-4 lg:w-[30%] xs:w-[100%]'>Based on your ticketing sales volume, you could qualify for a Purchase Price up to:</p>
        <h3 className='font-bold bg-gradient-to-r from-amber-500 to-rose-500 text-5xl text-center mb-4 text-transparent bg-clip-text'>${capitalAmount.toLocaleString('en-US')} </h3>
        <p className='text-xs italic text-gray-500 mx-auto mb-4 lg:w-[30%] text-center'>*The capital amount stated is non-binding and is merely an indication of what you could be approved for after you've completed the due diligence process. Terms will be subject to a thorough review of the business.</p>
      </div>}
      <CurrencyField label="Funding Needs ($)"  value={fundsInfo.yourFunds == '0' ? '' : fundsInfo.yourFunds} onChange={(value) => handleCurrencyChange('yourFunds', value)}  />
      <DropdownField label="Timing for Funding" name="timeForFunding" value={fundsInfo.timeForFunding} onChange={handleChange} error='' onBlur={() => { }} options={timeForFunding} />
      <DropdownField label="How do you plan to use your purchase price?" name="fundUse" value={fundsInfo.fundUse} onChange={handleChange} error='' onBlur={() => { }} options={fundUses} />



    </div>
  );
};

export default YourFundingStep; 