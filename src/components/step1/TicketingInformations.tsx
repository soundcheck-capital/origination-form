import React, { useEffect } from 'react';
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
import { isValidTicketingPartner, findTicketingPartnerKey } from '../../utils/ticketingPartnerUtils';

const TicketingFundingStep: React.FC = () => {
  const dispatch = useDispatch();
  const ticketingInfo = useSelector((state: RootState) => state.form.formData.ticketingInfo);
  const ticketingVolume = useSelector((state: RootState) => state.form.formData.volumeInfo);
  const { setFieldError } = useValidation();
  
  // Récupérer le ticketing partner depuis l'environnement
  const ticketingCoEnv = process.env.REACT_APP_TICKETING_CO || '';
  const isTicketingCoLocked = Boolean(ticketingCoEnv && isValidTicketingPartner(ticketingCoEnv));
  const lockedTicketingPartnerKey = isTicketingCoLocked ? findTicketingPartnerKey(ticketingCoEnv) : null;
  
  // Initialiser les valeurs si REACT_APP_TICKETING_CO est défini
  useEffect(() => {
    if (isTicketingCoLocked && lockedTicketingPartnerKey) {
      // Initialiser paymentProcessing à "Ticketing Co" si pas déjà défini ou si différent
      if (ticketingInfo.paymentProcessing !== 'Ticketing Co') {
        dispatch(updateTicketingInfo({ paymentProcessing: 'Ticketing Co' }));
      }
      // Initialiser currentPartner au ticketing partner spécifié si pas déjà défini ou si différent
      if (ticketingInfo.currentPartner !== lockedTicketingPartnerKey) {
        dispatch(updateTicketingInfo({ currentPartner: lockedTicketingPartnerKey }));
      }
    }
  }, [isTicketingCoLocked, lockedTicketingPartnerKey, ticketingInfo.paymentProcessing, ticketingInfo.currentPartner, dispatch]);

  // Ticketing handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Bloquer les modifications si les champs sont verrouillés
    if (isTicketingCoLocked) {
      if (name === 'paymentProcessing' && value !== 'Ticketing Co') {
        // Empêcher le changement si on essaie de sélectionner autre chose que "Ticketing Co"
        return;
      }
      if (name === 'currentPartner' && value !== lockedTicketingPartnerKey) {
        // Empêcher le changement si on essaie de sélectionner autre chose que le partner verrouillé
        return;
      }
    }
    
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

      <DropdownField 
        label="Who do you receive the payout/settlement from?" 
        name="paymentProcessing" 
        value={ticketingInfo.paymentProcessing} 
        onChange={handleChange} 
        error='' 
        onBlur={() => { }} 
        options={paymentProcessing} 
        required
        disabled={isTicketingCoLocked}
      />
      
      <DropdownField 
        label="Ticketing Partner" 
        name="currentPartner" 
        value={ticketingInfo.currentPartner} 
        onChange={handleChange} 
        error='' 
        onBlur={() => { }} 
        options={ticketingPartners} 
        required
        disabled={isTicketingCoLocked}
      />
     
     {ticketingInfo.currentPartner === 'Other' && (
      <TextField label="Other Ticketing Partner" name="otherPartner" value={ticketingInfo.otherPartner} onChange={handleChange} error='' onBlur={() => { }} type='text' required />
     )}

      <DropdownField label="What is the payout/settlement policy?" name="settlementPayout" value={ticketingInfo.settlementPayout} onChange={handleChange} error='' onBlur={() => { }} options={settlementPayout} required />

    </div>
  );
};

export default TicketingFundingStep;