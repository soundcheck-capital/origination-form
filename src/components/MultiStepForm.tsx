import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { saveApplication } from '../store/form/formThunks';
import { fetchApplicationById } from '../store/auth/authThunks';
import { setCurrentStep } from '../store/form/formSlice';
import { DiligenceFilesProvider, useDiligenceFiles } from '../contexts/DiligenceFilesContext';
import { useFileUpload } from '../hooks/useFileUpload';
import PersonalInfoStep from './PersonalInfoStep';
import CompanyInfoStep from './CompanyInfoStep';
import TicketingStep from './TicketingStep';
import TicketingVolumeStep from './TicketingVolumeStep';
import OwnershipStep from './OwnershipStep';
import FinancesStep from './FinancesStep';
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
import OtherStep from './OtherStep';

const MultiStepFormContent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState(1);
  const formData = useSelector((state: RootState) => state.form);
  const { user } = useSelector((state: RootState) => state.auth);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [activeMenuItem, setActiveMenuItem] = useState('applications');
  const { getAllFiles } = useDiligenceFiles();
  const { isUploading, uploadToMake } = useFileUpload();

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
    setIsSaving(true);
    setSaveMessage('');

    try {
      // Préparer les données du formulaire avec diligenceInfo déjà inclus
      const formDataToSend = {
        // Application metadata
        applicationId: id || 'new',
        submittedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,

        // Form data (incluant diligenceInfo)
        personalInfo: formData.formData.personalInfo,
        companyInfo: formData.formData.companyInfo,
        ticketingInfo: formData.formData.ticketingInfo,
        volumeInfo: formData.formData.volumeInfo,
        ownershipInfo: formData.formData.ownershipInfo,
        financesInfo: formData.financesInfo,
        fundsInfo: formData.formData.fundsInfo,
        diligenceInfo: formData.diligenceInfo,
        user: user ? { id: user.id, email: user.email } : null,
      };

      console.log("formDataToSend => ", formDataToSend);

      // Récupérer tous les fichiers pour l'upload
      const allFiles = getAllFiles();

      // Upload direct vers Make.com avec les fichiers
      const result = await uploadToMake(formDataToSend, allFiles);

      if (result.success) {
        setSaveMessage('Application submitted successfully!');

        // Navigate to success page after a delay
        setTimeout(() => {
          navigate('/submit-success');
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to submit application');
      }

    } catch (error) {
      console.error('Submission error:', error);
      setSaveMessage(error instanceof Error ? error.message : 'Failed to submit application. Please try again.');
    } finally {
      setIsSaving(false);
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
      case 4:
        return 'Customize your funding';
      case 5:
        return 'Beneficial ownership & control person';
      case 6:
        return 'Finances';
      case 7:
        return 'Due Diligence';
      case 8:
        return 'Due Diligence';
      case 9:
        return 'Due Diligence';
      case 10:
        return 'Other';
      case 11:
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
        return <OtherStep />;
      case 11:
        return <SummaryStep onSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-row ">
      {/* <Sidebar activeMenuItem={activeMenuItem} setActiveMenuItem={setActiveMenuItem} /> */}

      <main className="w-full h-full flex flex-col bg-white p-6">
        <div className="flex justify-center items-center mt-8">
          <div className="flex flex-col items-center gap-4">
            <img src={logo} alt="Logo" className="w-24 " />
          </div>
        </div>

        {/* Success/Error Message */}
        {saveMessage && (
          <div className={`w-[30%] mx-auto mb-4 p-3 rounded-lg text-center ${saveMessage.includes('successfully')
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
            {saveMessage}
          </div>
        )}

        <div className="min-h-screen bg-white py-8">
          {/* Progress Bar */}
          <div className="w-[30%] mx-auto">

            <div className="relative ">
              <div className="rounded-xl absolute top-0 left-0 h-2 bg-gray-200 w-full"></div>
              <div  //bg-[#F99927]
                className="rounded-xl absolute top-0 bg-gradient-to-r from-[#F99927] to-[#EF2A5F] left-0 h-2 transition-all duration-300"
                style={{ width: `${((currentStep) / 11) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white w-full mx-auto">
            <h1 className="text-4xl text-center font-bold text-neutral-900 mt-8">{stepTitles()}</h1>
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 w-[30%] mx-auto ">
            {currentStep === 1 && (<ButtonPrimary className='first:w-[40%]' onClick={() => {
              setCurrentStep(currentStep + 1);
              window.scrollTo(0, 0);
            }} disabled={false}>
              Next
            </ButtonPrimary>)}
            {currentStep > 1 && (
              <ButtonSecondary onClick={() => { setCurrentStep(currentStep - 1); window.scrollTo(0, 0); }} disabled={false}>Previous</ButtonSecondary>
            )}

            {(currentStep < 11 && currentStep > 1) && (
              <ButtonPrimary onClick={() => {
                setCurrentStep(currentStep + 1);
                window.scrollTo(0, 0);
              }} disabled={false}>Next</ButtonPrimary>

            )}
          </div>

        </div>
      </main>
    </div>

  );
};

const MultiStepForm: React.FC = () => {
  return (
    <DiligenceFilesProvider>
      <MultiStepFormContent />
    </DiligenceFilesProvider>
  );
};

export default MultiStepForm;

