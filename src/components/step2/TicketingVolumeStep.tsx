import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateFundsInfo,  } from '../../store/form/formSlice';
import { timingOfFunding, useOfProceeds } from '../../store/form/hubspotLists';
import DropdownField from '../customComponents/DropdownField';
import { useValidation } from '../../contexts/ValidationContext';
import { calculateUnderwritingResult, formatAdvanceAmount, UnderwritingInputs } from '../../utils/underwritingCalculator';
import { logUnderwritingBreakdown } from '../../utils/underwritingDebug';


const Funding: React.FC = () => {
  const dispatch = useDispatch();
  const fundsInfo = useSelector((state: RootState) => state.form.formData.fundsInfo);
  const ticketingVolume = useSelector((state: RootState) => state.form.formData.volumeInfo);
  const ticketingInfo = useSelector((state: RootState) => state.form.formData.ticketingInfo);
  const companyInfo = useSelector((state: RootState) => state.form.formData.companyInfo);
  const { setFieldError } = useValidation();
  const [showPreOffer, setShowPreOffer] = useState(false);
  const [showFields, setShowFields] = useState(false);
  
  // New underwriting calculation
  let capitalAmount = 0;
  let underwritingResult = null;
  
  if (ticketingVolume.lastYearSales > 0 && 
      ticketingVolume.lastYearEvents > 0 && 
      companyInfo.yearsInBusiness &&
      ticketingInfo.paymentProcessing &&
      ticketingInfo.settlementPayout) {
    
    const inputs: UnderwritingInputs = {
      yearsInBusiness: companyInfo.yearsInBusiness,
      numberOfEvents: ticketingVolume.lastYearEvents,
      paymentRemittedBy: ticketingInfo.paymentProcessing,
      paymentFrequency: ticketingInfo.settlementPayout,
      grossAnnualTicketSales: ticketingVolume.lastYearSales
    };
    
    underwritingResult = calculateUnderwritingResult(inputs);
    if (underwritingResult) {
      capitalAmount = underwritingResult.advanceAmount;
      // Debug logging in development
      logUnderwritingBreakdown(inputs, underwritingResult);
    }
  }

  // Show pre-offer immediately, then fields after delay
  useEffect(() => {
    // Show pre-offer immediately
    setShowPreOffer(true);

    // Show fields after 2 seconds delay
    const fieldsTimer = setTimeout(() => {
      setShowFields(true);
    }, 2000);

    return () => {
      clearTimeout(fieldsTimer);
    };
  }, []);

  // Funding handlers
  const handleFundsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(updateFundsInfo({ [name]: value }));
    setFieldError(name, null);
  };

  

  return (
    <div className="flex flex-col items-center justify-center w-full mt-16">
      
      {/* Pre-offer section */}
      {capitalAmount !== 0 && showPreOffer && (
        <div className='flex flex-col items-center justify-center w-full mb-8 transition-all duration-1000 ease-out animate-fade-in-up'>
          <p className='text-sm text-neutral-900 mx-auto mb-4 text-center'>You could qualify for a funding up to:</p>
          <h3 className='font-black text-6xl text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500 drop-shadow-sm' 
              style={{ 
                fontFamily: '"SF Pro Display", "Helvetica Neue", "Arial Black", "Impact", "Franklin Gothic Medium", sans-serif', 
                fontWeight: 900, 
                letterSpacing: '0.05em',
                fontVariantNumeric: 'tabular-nums'
              }}>
            {formatAdvanceAmount(capitalAmount)}
          </h3>
          {underwritingResult && underwritingResult.isCapped && (
            <p className='text-xs text-amber-600 mx-auto mb-2 text-center font-medium'>
              * Amount capped at maximum advance limit
            </p>
          )}
          
          {/* Development Risk Score Display */}
          {process.env.NODE_ENV === 'development' && underwritingResult && (
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 text-left'>
              <h4 className='text-sm font-bold text-blue-800 mb-2'>🔍 Risk Score Debug (Dev Only)</h4>
              <div className='grid grid-cols-2 gap-2 text-xs text-blue-700'>
                <div>
                  <span className='font-medium'>Years in Business:</span> {underwritingResult.breakdown.yearsInBusinessScore} pts
                </div>
                <div>
                  <span className='font-medium'>Number of Events:</span> {underwritingResult.breakdown.eventsScore} pts
                </div>
                <div>
                  <span className='font-medium'>Payment Remitted By:</span> {underwritingResult.breakdown.paymentRemittedByScore} pts
                </div>
                <div>
                  <span className='font-medium'>Payment Frequency:</span> {underwritingResult.breakdown.paymentFrequencyScore} pts
                </div>
              </div>
              <div className='mt-3 pt-2 border-t border-blue-300'>
                <div className='text-sm font-bold text-blue-800'>
                  Total Risk Score: {underwritingResult.totalRiskScore} / 24
                </div>
                <div className='text-xs text-blue-600'>
                  Max Advance %: {(underwritingResult.maxAdvancePercent * 100).toFixed(1)}%
                </div>
                <div className='text-xs text-blue-600'>
                  Raw Amount: ${(ticketingVolume.lastYearSales * underwritingResult.maxAdvancePercent).toLocaleString()}
                  {underwritingResult.isCapped && ' → Capped at $500k'}
                </div>
              </div>
            </div>
          )}
          <p className='text-xs text-neutral-900 mx-auto mb-4 text-center font-bold'>The estimate is based on your responses and SoundCheck's market insights. To receive a formal offer, please complete the application.</p>
        </div>
      )}
      
      {/* Funding fields with smooth animation */}
      {showFields && (
        <div className="w-full space-y-6 transition-all duration-1000 ease-out animate-fade-in-up">
         {/*   <CurrencyField label="Funding Needs ($)" name="yourFunds" value={fundsInfo.yourFunds === '0' ? '' : fundsInfo.yourFunds} onChange={(value) => handleFundsCurrencyChange('yourFunds', value)} required /> */}
          <DropdownField label="Timing for Funding" name="timingOfFunding" value={fundsInfo.timingOfFunding} onChange={handleFundsChange} error='' onBlur={() => { }} options={timingOfFunding} required />
          <DropdownField label="What do you plan to use the money for?" name="useOfProceeds" value={fundsInfo.useOfProceeds} onChange={handleFundsChange} error='' onBlur={() => { }} options={useOfProceeds} required />
        </div>
      )}

    </div>
  );
};

export default Funding; 

