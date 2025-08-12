import React  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateTicketingInfo, updateVolumeInfo } from '../store/form/formSlice';
import StepTitle from './customComponents/StepTitle';
import DropdownField from './customComponents/DropdownField';
import TextField from './customComponents/TextField';
import NumberInput from './customComponents/NumberField';
import CurrencyField from './customComponents/CurrencyField';
import { useValidation } from '../contexts/ValidationContext';
import { ticketingPayouts, ticketingPartners, settlementPolicies } from '../store/form/hubspotLists';



const TicketingStep: React.FC = () => {
  const dispatch = useDispatch();
  const ticketingInfo = useSelector((state: RootState) => state.form.formData.ticketingInfo);
  const ticketingVolume = useSelector((state: RootState) => state.form.formData.volumeInfo);
  const { setFieldError } = useValidation();
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




  return (
    <div className="flex flex-col items-center justify-center w-full animate-fade-in-right duration-1000">
      <StepTitle title="Ticketing Information" />
    
      <DropdownField label="Who do you receive ticketing payouts from?" name="ticketingPayout" value={ticketingInfo.ticketingPayout} onChange={handleChange} error='' onBlur={() => { }} options={ticketingPayouts} required />
      {ticketingInfo.ticketingPayout === 'Other' && (
      <TextField label="Other Ticketing Payout" name="otherTicketingPayout" value={ticketingInfo.otherTicketingPayout} onChange={handleChange} error='' onBlur={() => { }} type='text' required />
     )}
      <DropdownField label="Ticketing Partner" name="currentPartner" value={ticketingInfo.currentPartner} onChange={handleChange} error='' onBlur={() => { }} options={ticketingPartners} required />
     
     {ticketingInfo.currentPartner === 'Other' && (
      <TextField label="Other Ticketing Partner" name="otherPartner" value={ticketingInfo.otherPartner} onChange={handleChange} error='' onBlur={() => { }} type='text' required />
     )}

      <DropdownField label="What is your ticketing partner settlement/payout policy?" name="settlementPolicy" value={ticketingInfo.settlementPolicy} onChange={handleChange} error='' onBlur={() => { }} options={settlementPolicies} required />

      {/* <TicketingVolumeStep /> */}

      <StepTitle title="Ticketing Volume" />

      <p className='text-sm text-amber-500 my-4 text-center lg:w-[30%] mx-auto'>Last 12 Months</p>
      <NumberInput label="Number of Events" name="lastYearEvents" value={ticketingVolume.lastYearEvents.toString()} onChange={(value) => handleNumberChange('lastYearEvents', value)} placeholder="Fill in" id="lastYearEvents" required />
      <NumberInput label="Number of Tickets sold online" name="lastYearTickets" value={ticketingVolume.lastYearTickets.toString()} onChange={(value) => handleNumberChange('lastYearTickets', value)} placeholder="Fill in" id="lastYearTickets" required />
      <CurrencyField label="Online Gross Tickets Sales" name="lastYearSales" value={ticketingVolume.lastYearSales.toString()} onChange={(value) => handleCurrencyChange('lastYearSales', value)} placeholder="Fill in" id="lastYearSales" required />

      {/* Colonne 3 : Next 12 Months */}
      <p className='text-sm text-amber-500 my-4 text-center lg:w-[30%] mx-auto'>Next 12 Months</p>
          <NumberInput label="Number of Events" name="nextYearEvents" value={ticketingVolume.nextYearEvents.toString()} onChange={(value) => handleNumberChange('nextYearEvents', value)} placeholder="Fill in" id="nextYearEvents" required />
      <NumberInput label="Number of Tickets sold online" name="nextYearTickets" value={ticketingVolume.nextYearTickets.toString()} onChange={(value) => handleNumberChange('nextYearTickets', value)} placeholder="Fill in" id="nextYearTickets" required />
      <CurrencyField label="Online Gross Tickets Sales" name="nextYearSales" value={ticketingVolume.nextYearSales.toString()} onChange={(value) => handleCurrencyChange('nextYearSales', value)} placeholder="Fill in" id="nextYearSales" required />
      {/* <LoginPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onSuccess={handleLoginSuccess}
      /> */}
    </div>
  );
};

export default TicketingStep; 