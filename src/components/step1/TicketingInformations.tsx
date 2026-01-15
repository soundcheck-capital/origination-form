import React  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateTicketingInfo, updateVolumeInfo } from '../../store/form/formSlice';
import StepTitle from '../customComponents/StepTitle';
import DropdownField from '../customComponents/DropdownField';
import TextField from '../customComponents/TextField';
import NumberInput from '../customComponents/NumberField';
import CurrencyField from '../customComponents/CurrencyField';
import { useValidation } from '../../contexts/ValidationContext';
import { paymentProcessing, ticketingPartners, settlementPayout } from '../../store/form/hubspotLists';

const TicketingFundingStep: React.FC = () => {
  const dispatch = useDispatch();
  const ticketingInfo = useSelector((state: RootState) => state.form.formData.ticketingInfo);
  const ticketingVolume = useSelector((state: RootState) => state.form.formData.volumeInfo);
  const { setFieldError } = useValidation();

  // Ticketing handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(updateTicketingInfo({ [name]: value }));
    setFieldError(name, null);
  };

  const handleNumberChange = (name: string, value: string) => {
    // Enforce integer only for number of events fields
    if (name === 'lastYearEvents' || name === 'nextYearEvents') {
      const intValue = value === '' ? 0 : parseInt(value, 10);
      dispatch(updateVolumeInfo({ [name]: isNaN(intValue) ? 0 : intValue }));
    } else {
      dispatch(updateVolumeInfo({ [name]: value }));
    }
    setFieldError(name, null);
  };

  const handleCurrencyChange = (name: string, value: string) => {
    dispatch(updateVolumeInfo({ [name]: value }));
    setFieldError(name, null);
  };





  return (
    <div className="flex flex-col justify-center w-full animate-fade-in-right duration-1000">
      {/* Ticketing Information Section - Exact copy from TicketingStep */}
      <StepTitle title="Ticketing" />
    
      <NumberInput label="Number of Events/Year" name="nextYearEvents" value={ticketingVolume.nextYearEvents.toString()} onChange={(value) => handleNumberChange('nextYearEvents', value)} placeholder="Fill in" id="nextYearEvents" required integerOnly />
      <CurrencyField label="Gross Annual Ticketing Volume ($)" name="nextYearSales" value={ticketingVolume.nextYearSales.toString()} onChange={(value) => handleCurrencyChange('nextYearSales', value)} placeholder="Fill in" id="nextYearSales" required />

      <DropdownField label="Who do you receive the payout/settlement from?" name="paymentProcessing" value={ticketingInfo.paymentProcessing} onChange={handleChange} error='' onBlur={() => { }} options={paymentProcessing} required  />
      
      <DropdownField label="Ticketing Partner" name="currentPartner" value={ticketingInfo.currentPartner} onChange={handleChange} error='' onBlur={() => { }} options={ticketingPartners} required />
     
     {ticketingInfo.currentPartner === 'Other' && (
      <TextField label="Other Ticketing Partner" name="otherPartner" value={ticketingInfo.otherPartner} onChange={handleChange} error='' onBlur={() => { }} type='text' required />
     )}

      <DropdownField label="What is the payout/settlement policy?" name="settlementPayout" value={ticketingInfo.settlementPayout} onChange={handleChange} error='' onBlur={() => { }} options={settlementPayout} required />

    </div>
  );
};

export default TicketingFundingStep;