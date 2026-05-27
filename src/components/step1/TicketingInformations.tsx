import React, { useEffect }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateFinancesInfo, updateTicketingInfo, updateVolumeInfo } from '../../store/form/formSlice';
import StepTitle from '../customComponents/StepTitle';
import DropdownField from '../customComponents/DropdownField';
import TextField from '../customComponents/TextField';
import NumberInput from '../customComponents/NumberField';
import CurrencyField from '../customComponents/CurrencyField';
import { useValidation } from '../../contexts/ValidationContext';
import { accountingSystemOptions, paymentProcessing, paymentProcessorOptions, ticketingPartners, settlementPayout } from '../../store/form/hubspotLists';
import { findTicketingPartnerKey, getTicketingCoFromUrl } from '../../utils/ticketingPartnerUtils';

const TicketingFundingStep: React.FC = () => {
  const dispatch = useDispatch();
  const ticketingInfo = useSelector((state: RootState) => state.form.formData.ticketingInfo);
  const financesInfo = useSelector((state: RootState) => state.form.formData.financesInfo);
  const ticketingVolume = useSelector((state: RootState) => state.form.formData.volumeInfo);
  const { setFieldError } = useValidation();
  const ticketingCoParam = getTicketingCoFromUrl();
  const lockedTicketingPartnerKey = ticketingCoParam ? findTicketingPartnerKey(ticketingCoParam) : null;
  // When a ticketing co is locked via env, payout/settlement is forced to "Ticketing Co" (My Ticketing Co)
  const lockedPaymentProcessingValue = lockedTicketingPartnerKey ? 'Ticketing Co' : null;

  useEffect(() => {
    if (!lockedTicketingPartnerKey) return;
    const updates: Partial<typeof ticketingInfo> = {};
    if (ticketingInfo.currentPartner !== lockedTicketingPartnerKey) {
      updates.currentPartner = lockedTicketingPartnerKey;
    }
    if (ticketingInfo.paymentProcessing !== 'Ticketing Co') {
      updates.paymentProcessing = 'Ticketing Co';
    }
    if (Object.keys(updates).length > 0) {
      dispatch(updateTicketingInfo(updates));
    }
  }, [dispatch, lockedTicketingPartnerKey, ticketingInfo.currentPartner, ticketingInfo.paymentProcessing]);

  // Ticketing handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(updateTicketingInfo({ [name]: value }));
    setFieldError(name, null);
  };

  const handleFinancesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(updateFinancesInfo({ [name]: value }));
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

      <DropdownField label="Who do you receive the payout/settlement from?" name="paymentProcessing" value={lockedPaymentProcessingValue ?? ticketingInfo.paymentProcessing} onChange={handleChange} error='' onBlur={() => { }} options={paymentProcessing} required disabled={!!lockedTicketingPartnerKey} />
      
      <DropdownField label="Ticketing Partner" name="currentPartner" value={ticketingInfo.currentPartner} onChange={handleChange} error='' onBlur={() => { }} options={ticketingPartners} required disabled={!!lockedTicketingPartnerKey} />
     
     {ticketingInfo.currentPartner === 'Other' && (
      <TextField label="Other Ticketing Partner" name="otherPartner" value={ticketingInfo.otherPartner} onChange={handleChange} error='' onBlur={() => { }} type='text' required />
     )}

      <DropdownField label="What is the payout/settlement policy?" name="settlementPayout" value={ticketingInfo.settlementPayout} onChange={handleChange} error='' onBlur={() => { }} options={settlementPayout} required />

      <DropdownField label="Payment Processor" name="paymentProcessor" value={ticketingInfo.paymentProcessor} onChange={handleChange} error='' onBlur={() => { }} options={paymentProcessorOptions} required />

      {ticketingInfo.paymentProcessor === 'Other' && (
        <TextField label="Other Payment Processor" name="otherPaymentProcessor" value={ticketingInfo.otherPaymentProcessor} onChange={handleChange} error='' onBlur={() => { }} type='text' required />
      )}

      <DropdownField label="Accounting System" name="accountingSystem" value={financesInfo.accountingSystem} onChange={handleFinancesChange} error='' onBlur={() => { }} options={accountingSystemOptions} required />

      {financesInfo.accountingSystem === 'Other' && (
        <TextField label="Other Accounting System" name="otherAccountingSystem" value={financesInfo.otherAccountingSystem} onChange={handleFinancesChange} error='' onBlur={() => { }} type='text' required />
      )}

    </div>
  );
};

export default TicketingFundingStep;
