import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateFundsInfo,  } from '../../store/form/formSlice';
import { timingOfFunding, useOfProceeds, yearsInBusiness, paymentProcessing, settlementPayout } from '../../store/form/hubspotLists';
import DropdownField from '../customComponents/DropdownField';
import { useValidation } from '../../contexts/ValidationContext';
import { calculateUnderwritingResult, formatAdvanceAmount, UnderwritingInputs } from '../../utils/underwritingCalculator';
import { logUnderwritingBreakdown } from '../../utils/underwritingDebug';
import LoadingBars from '../customComponents/LoadingBars';


const Funding: React.FC = () => {
  const dispatch = useDispatch();
  const fundsInfo = useSelector((state: RootState) => state.form.formData.fundsInfo);
  const ticketingVolume = useSelector((state: RootState) => state.form.formData.volumeInfo);
  const ticketingInfo = useSelector((state: RootState) => state.form.formData.ticketingInfo);
  const companyInfo = useSelector((state: RootState) => state.form.formData.companyInfo);
  const { setFieldError } = useValidation();
  const [hasMounted, setHasMounted] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  
  // Helper functions to map keys to values for underwriting calculator
  const mapYearsInBusiness = (key: string): string => {
    return yearsInBusiness[key as keyof typeof yearsInBusiness] || key;
  };
  
  const mapPaymentRemittedBy = (key: string): string => {
    return paymentProcessing[key as keyof typeof paymentProcessing] || key;
  };
  
  const mapPaymentFrequency = (key: string): string => {
    return settlementPayout[key as keyof typeof settlementPayout] || key;
  };
  
  // New underwriting calculation
  let capitalAmount = 0;
  let underwritingResult = null;
  
  if (ticketingVolume.nextYearSales > 0 && 
      ticketingVolume.nextYearEvents > 0 && 
      companyInfo.yearsInBusiness &&
      ticketingInfo.paymentProcessing &&
      ticketingInfo.settlementPayout) {
    
    // Ensure numberOfEvents is a number (convert if needed)
    const numberOfEvents = Number(ticketingVolume.nextYearEvents);
    
    // Ensure grossAnnualTicketSales is a number
    const grossAnnualTicketSales = Number(ticketingVolume.nextYearSales);
    
    const inputs: UnderwritingInputs = {
      yearsInBusiness: mapYearsInBusiness(companyInfo.yearsInBusiness),
      numberOfEvents: numberOfEvents,
      paymentRemittedBy: mapPaymentRemittedBy(ticketingInfo.paymentProcessing),
      paymentFrequency: mapPaymentFrequency(ticketingInfo.settlementPayout),
      grossAnnualTicketSales: grossAnnualTicketSales
    };
    
    underwritingResult = calculateUnderwritingResult(inputs);
    if (underwritingResult) {
      capitalAmount = underwritingResult.advanceAmount;
      // Debug logging in development
      logUnderwritingBreakdown(inputs, underwritingResult);
    }
  }

  // Mount animation + show a small loader before revealing questions
  useEffect(() => {
    // Let the first paint happen, then enable transitions
    const raf = requestAnimationFrame(() => setHasMounted(true));
    const questionsTimer = setTimeout(() => setShowQuestions(true), 1800);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(questionsTimer);
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
      {capitalAmount !== 0 && (
        <div
          className={[
            'flex flex-col items-center justify-center w-full mb-8',
            'transition-all duration-500 ease-out',
            hasMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          ].join(' ')}
        >
          <div className="
            w-full max-w-2xl
            px-8 py-6
            rounded-3xl
            backdrop-blur-md
            bg-white/60
            border border-white/80
            shadow-lg
            relative
            before:absolute before:inset-0 before:rounded-3xl
            before:bg-gradient-to-br before:from-blue-200/20 before:via-purple-100/15 before:to-rose-200/20
            before:pointer-events-none
            after:absolute after:inset-0 after:rounded-3xl
            after:bg-gradient-to-tr after:from-transparent after:via-white/40 after:to-transparent
            after:pointer-events-none
            ring-1 ring-white/60
          " style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5), 0 0 20px rgba(147, 51, 234, 0.1), 0 0 30px rgba(236, 72, 153, 0.1)'
          }}>
            <p className='text-2xl text-neutral-900 mx-auto mb-4 text-center font-medium relative z-10'>You're eligible for an advance up to:</p>
            <h3 className='font-black text-6xl text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500 drop-shadow-sm relative z-10' 
                style={{ 
                  fontFamily: '"SF Pro Display", "Helvetica Neue", "Arial Black", "Impact", "Franklin Gothic Medium", sans-serif', 
                  fontWeight: 900, 
                  letterSpacing: '0.05em',
                  fontVariantNumeric: 'tabular-nums'
                }}>
              {formatAdvanceAmount(capitalAmount)}
            </h3>
            {underwritingResult && underwritingResult.isCapped && (
              <p className='text-xs text-amber-600 mx-auto mb-2 text-center font-medium relative z-10'>
                * Amount capped at maximum advance limit
              </p>
            )}
            <p className='text-xs text-neutral-500 mx-auto text-center font-normal relative z-10'>The estimate is based on your responses and SoundCheck's market insights. To receive a formal offer, please complete the application.</p>
          </div>

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
                  Raw Amount: ${(ticketingVolume.nextYearSales * underwritingResult.maxAdvancePercent).toLocaleString()}
                  {underwritingResult.isCapped && ' → Capped at $500k'}
                </div>
              </div>
            </div>
          )} 
        </div>
      )}
      
      {/* Questions reveal */}
      {!showQuestions ? (
        <div
          className={[
            'w-full mb-8 flex flex-col items-center justify-center',
            'transition-all duration-300 ease-out',
            hasMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
          ].join(' ')}
          aria-live="polite"
        >
          <LoadingBars className="mt-2 scale-75" visible />
          <p className="mt-4 text-gray-700 text-lg font-medium">A few more questions</p>
        </div>
      ) : (
        <div
          className={[
            'w-full space-y-6 mb-8',
            'transition-all duration-300 ease-out',
            'opacity-100 translate-y-0'
          ].join(' ')}
        >
          <DropdownField label="Timing for Funding" name="timingOfFunding" value={fundsInfo.timingOfFunding} onChange={handleFundsChange} error='' onBlur={() => { }} options={timingOfFunding} required />
          <DropdownField label="What do you plan to use the money for?" name="useOfProceeds" value={fundsInfo.useOfProceeds} onChange={handleFundsChange} error='' onBlur={() => { }} options={useOfProceeds} required />
        </div>
      )}

    </div>
  );
};

export default Funding; 

