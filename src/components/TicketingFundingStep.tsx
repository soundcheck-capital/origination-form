import React  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateTicketingInfo, updateVolumeInfo, updateFundsInfo } from '../store/form/formSlice';
import StepTitle from './customComponents/StepTitle';
import DropdownField from './customComponents/DropdownField';
import TextField from './customComponents/TextField';
import NumberInput from './customComponents/NumberField';
import CurrencyField from './customComponents/CurrencyField';
import { useValidation } from '../contexts/ValidationContext';
import { paymentProcessing, ticketingPartners, settlementPayout, precision, timingOfFunding, useOfProceeds } from '../store/form/hubspotLists';

const TicketingFundingStep: React.FC = () => {
  const dispatch = useDispatch();
  const ticketingInfo = useSelector((state: RootState) => state.form.formData.ticketingInfo);
  const ticketingVolume = useSelector((state: RootState) => state.form.formData.volumeInfo);
  const fundsInfo = useSelector((state: RootState) => state.form.formData.fundsInfo);
  const { setFieldError } = useValidation();

  // Ticketing handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(updateTicketingInfo({ [name]: value }));
    setFieldError(name, null);
  };

  const handleNumberChange = (name: string, value: string) => {
    dispatch(updateVolumeInfo({ [name]: value }));
    setFieldError(name, null);
  };

  const handleCurrencyChange = (name: string, value: string) => {
    dispatch(updateVolumeInfo({ [name]: value }));
    setFieldError(name, null);
  };

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

  const getPrecision = (paymentProcessing: string) => {
    switch(paymentProcessing) {
      case 'Ticketing Co':
        return precision[0];
      case 'Own Processor':
        return precision[1];
      case 'Venue':
        return precision[2];
      case 'It varies':
        return precision[3];
      default:
        return '';
    }
  }

  // Capital amount calculation (from YourFundingStep)
  let capitalAmount = 0;
  if(ticketingVolume.lastYearSales > 0  && ticketingVolume.lastYearEvents > 0) {
    const maxAmount = ticketingVolume.lastYearSales * 0.15;
    capitalAmount = maxAmount > 1000000 ? 1000000 : maxAmount;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full animate-fade-in-right duration-1000">
      {/* Ticketing Information Section - Exact copy from TicketingStep */}
      <StepTitle title="Ticketing Information" />
    
      <DropdownField label="Who do you receive the payout/settlement from?" name="paymentProcessing" value={ticketingInfo.paymentProcessing} onChange={handleChange} error='' onBlur={() => { }} options={paymentProcessing} required description={getPrecision(ticketingInfo.paymentProcessing)} />
      
      <DropdownField label="Ticketing Partner" name="currentPartner" value={ticketingInfo.currentPartner} onChange={handleChange} error='' onBlur={() => { }} options={ticketingPartners} required />
     
     {ticketingInfo.currentPartner === 'Other' && (
      <TextField label="Other Ticketing Partner" name="otherPartner" value={ticketingInfo.otherPartner} onChange={handleChange} error='' onBlur={() => { }} type='text' required />
     )}

      <DropdownField label="What is the payout/settlement policy?" name="settlementPayout" value={ticketingInfo.settlementPayout} onChange={handleChange} error='' onBlur={() => { }} options={settlementPayout} required />

      {/* Ticketing Volume Section - Exact copy from TicketingStep (modified) */}
      <StepTitle title="Ticketing Volume" />

      <p className='text-sm text-amber-500 my-4 text-center lg:w-[30%] mx-auto'>Last 12 Months</p>
      <NumberInput label="Number of Events" name="lastYearEvents" value={ticketingVolume.lastYearEvents.toString()} onChange={(value) => handleNumberChange('lastYearEvents', value)} placeholder="Fill in" id="lastYearEvents" required />
      <CurrencyField label="Gross Annual Ticketing Volume ($)" name="lastYearSales" value={ticketingVolume.lastYearSales.toString()} onChange={(value) => handleCurrencyChange('lastYearSales', value)} placeholder="Fill in" id="lastYearSales" required />

      {/* Funding Section - Exact copy from YourFundingStep */}
      <div className="flex flex-col items-center justify-center w-full mt-16 animate-fade-in-right duration-1000">

        {capitalAmount !== 0 && <div className='flex flex-col items-center justify-center w-full mb-4'>
          <p className='text-sm text-neutral-900 mx-auto mb-4 text-center '>Based on your ticketing sales volume, you could qualify for a funding up to:</p>
          <h3 className='font-bold bg-gradient-to-r from-amber-500 to-rose-500 text-5xl text-center mb-4 text-transparent bg-clip-text'>${capitalAmount.toLocaleString('en-US')} </h3>
          <p className='text-xs italic text-gray-500 mx-auto mb-4 text-center'>*The capital amount stated is non-binding and is merely an indication of what you could be approved for after you've completed the due diligence process. Terms will be subject to a thorough review of the business.</p>
        </div>}
        <CurrencyField label="Funding Needs ($)"  name="yourFunds" value={fundsInfo.yourFunds === '0' ? '' : fundsInfo.yourFunds} onChange={(value) => handleFundsCurrencyChange('yourFunds', value)} required />
        <DropdownField label="Timing for Funding" name="timingOfFunding" value={fundsInfo.timingOfFunding} onChange={handleFundsChange} error='' onBlur={() => { }} options={timingOfFunding} required />
        <DropdownField label="What do you plan to use the money for?" name="useOfProceeds" value={fundsInfo.useOfProceeds} onChange={handleFundsChange} error='' onBlur={() => { }} options={useOfProceeds} required />

      </div>
    </div>
  );
};

export default TicketingFundingStep;