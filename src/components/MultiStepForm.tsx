import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { saveApplication } from '../store/form/formThunks';
import { fetchApplicationById } from '../store/auth/authThunks';
import { setCurrentStep } from '../store/form/formSlice';
import PersonalInfoStep from './PersonalInfoStep';
import CompanyInfoStep from './CompanyInfoStep';
import TicketingStep from './TicketingStep';
import TicketingVolumeStep from './TicketingVolumeStep';
import OwnershipStep from './OwnershipStep';
import FinancesStep from './FinancesStep';
import FundsStep from './AdvanceSliderStep';
import SummaryStep from './SummaryStep';
import logo from '../assets/logo_black_name.svg';
import LegalInfoStep from './LegalInfoStep';
import Sidebar from './Sidebar';
import ButtonPrimary from './customComponents/ButtonPrimary';
import ButtonSecondary from './customComponents/ButtonSecondary';
import YourFundingStep from './YourFundsStep';
import LegalInformationStep from './LegalInformationStep';
import TicketingInformationStep from './TicketingInformationStep';
import FinancialInformationStep from './FinancialInformationStep';

const MultiStepForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState(1);
  const formData = useSelector((state: RootState) => state.form);
  const { user } = useSelector((state: RootState) => state.auth);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [activeMenuItem, setActiveMenuItem] = useState('applications');
  // Load application data if ID is provided
  useEffect(() => {
    if (id) {
      dispatch(fetchApplicationById(id));
    }
  }, [id, dispatch]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      await dispatch(saveApplication());
      setSaveMessage('Application saved successfully!');

      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    } catch (error) {
      setSaveMessage('Failed to save application. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await dispatch(saveApplication());
      navigate('/dashboard');
    } catch (error) {
      setSaveMessage('Failed to submit application. Please try again.');
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const stepTitles = () => {
    switch (currentStep) {
      case 1:
        return 'Get Funding';
      case 2:
        return 'Tell us about your business';
      case 3:
        return 'Tell us about your business';
      // case 4:
      //   return 'Customize your funding';
      case 4:
        return 'Business & Ownership';
      case 5:
        return 'Beneficial ownership & control person';
      case 6:
        return 'Finances';
      case 7:
        return 'Ticketing Information';
      case 8:
        return 'Financial Information';
      case 9:
        return 'Legal Information';
      case 10:
        return 'Thank you';
      default:
        return 'SoundCheck';
    }
  };




  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep />;
      case 2:
        return <CompanyInfoStep />;
      case 3:
        return <TicketingStep />;
      case 4:
        return <YourFundingStep />;
     
      case 5:
        return <OwnershipStep />;
      case 6:
        return <FinancesStep />;
      case 7:
        return <TicketingInformationStep />;
      case 8:
        return <FinancialInformationStep />;
      case 9:
        return <LegalInformationStep />;
     
      case 10:
        return <SummaryStep />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-row">
      {/* <Sidebar activeMenuItem={activeMenuItem} setActiveMenuItem={setActiveMenuItem} /> */}


      <main className="w-full h-full flex flex-col bg-white p-6">
        <div className="flex justify-center items-center mt-8">
            <div className="flex flex-col items-center gap-4">
            <img src={logo} alt="Logo" className="w-24 " />
            </div>
        
        </div>
        <div className="min-h-screen bg-white py-8">
          {/* Progress Bar */}
          <div className="w-[30%] mx-auto ">

            <div className="relative ">
              <div className="rounded-xl absolute top-0 left-0 h-2 bg-gray-200 w-full"></div>
              <div  //bg-[#F99927]
                  className="rounded-xl absolute top-0 bg-gradient-to-r from-[#F99927] to-[#EF2A5F] left-0 h-2 transition-all duration-300"
                style={{ width: `${((currentStep) / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white w-full mx-auto">
          <h1 className="text-3xl text-center font-bold text-neutral-600 mt-8">{stepTitles()}</h1>
            {renderStep()}
          </div>
{/* Navigation Buttons */}
          <div className="flex justify-center gap-4 w-[30%] mx-auto ">
            
            {currentStep > 1 && (
              <ButtonSecondary onClick={() => {setCurrentStep(currentStep - 1);window.scrollTo(0, 0);}} disabled={false}>Previous</ButtonSecondary>
            
            )}

            {currentStep < 10 ? (
              <ButtonPrimary onClick={() => {
                setCurrentStep(currentStep + 1);
                window.scrollTo(0, 0);
              }} disabled={false}>Next</ButtonPrimary>
             
            ) : (
              <ButtonPrimary onClick={handleSubmit} disabled={isSaving}>Submit Application</ButtonPrimary>
            )}
          </div>

        </div>
      </main>
    </div>

  );
};

export default MultiStepForm; 

