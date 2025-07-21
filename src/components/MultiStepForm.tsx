import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { saveApplication } from '../store/form/formThunks';
import { fetchApplicationById } from '../store/auth/authThunks';
import { setCurrentStep, clearFormData } from '../store/form/formSlice';
import { DiligenceFilesProvider, useDiligenceFiles } from '../contexts/DiligenceFilesContext';
import { ValidationProvider, useValidation } from '../contexts/ValidationContext';
import { useFileUpload } from '../hooks/useFileUpload';
import PersonalInfoStep from './PersonalInfoStep';
import CompanyInfoStep from './CompanyInfoStep';
import TicketingStep from './TicketingStep';
import OwnershipStep from './OwnershipStep';
import FinancesStep from './FinancesStep';
import SummaryStep from './SummaryStep';
import logo from '../assets/logo_black_bold.svg';
import ButtonPrimary from './customComponents/ButtonPrimary';
import ButtonSecondary from './customComponents/ButtonSecondary';
import YourFundingStep from './YourFundsStep';
import LegalInformationStep from './LegalInformationStep';
import TicketingInformationStep from './TicketingInformationStep';
import FinancialInformationStep from './FinancialInformationStep';
import OtherStep from './OtherStep';
import { useFormValidation } from '../hooks/useFormValidation';

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
  const { validateAllSteps, validateCurrentStep, isDevelopment } = useFormValidation();
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string[] } | null>(null);
  const { currentStepErrors, setCurrentStepErrors } = useValidation();

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
  const handleSubmit2 = () => {
    console.log("handleSubmit2");
    const validation = validateAllSteps();
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors(null);
    handleSubmit();
  };

  const handleNextStep = () => {
    const validation = validateCurrentStep(currentStep);
    
    if (!validation.isValid) {
      setCurrentStepErrors(validation.errors);
      return;
    }

    setCurrentStepErrors(null);
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const handlePreviousStep = () => {
    setCurrentStepErrors(null);
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    localStorage.removeItem('formAuthenticated');
    navigate('/');
  };

  const handleClearFormData = () => {
    if (window.confirm('Are you sure you want to clear all form data? This action cannot be undone.')) {
      dispatch(clearFormData());
      setCurrentStep(1);
      setSaveMessage('Form data cleared successfully!');
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    }
  };
  const renderValidationErrors = () => {
    if (!validationErrors) return null;

    const hasErrors = Object.values(validationErrors).some(errors => errors.length > 0);
    if (!hasErrors) return null;

    return (
      <div className="w-full mb-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-4">
            Please complete the following required fields before submitting:
          </h3>
          <div className="space-y-4">
            {Object.entries(validationErrors).map(([section, errors]) => {
              if (errors.length === 0) return null;
              
              return (
                <div key={section} className="border-l-4 border-red-400 pl-4">
                  <h4 className="font-medium text-red-700 mb-2">{section}</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="text-sm text-red-600">{error}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentStepErrors = () => {
    if (!currentStepErrors || currentStepErrors.length === 0) return null;

    return (
      <div className="w-full mb-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-md font-semibold text-red-800 mb-2">
            Please complete the following required fields:
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {currentStepErrors.map((error, index) => (
              <li key={index} className="text-sm text-red-600">{error}</li>
            ))}
          </ul>
        </div>
      </div>
    );
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
        return 'Business & Ownership';
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
        return <SummaryStep renderValidationErrors={renderValidationErrors()} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-row  animate-fade-in-right duration-1000 lg:w-[30%] xs:w-[100%] mx-auto">
      {/* <Sidebar activeMenuItem={activeMenuItem} setActiveMenuItem={setActiveMenuItem} /> */}

      <main className="w-full h-full flex flex-col bg-white p-6">
        <div className="flex justify-center items-center">
          <img src={logo} alt="Logo" className="w-32 " />
          {/* <div className="absolute top-8 right-8 flex gap-4">
            <button
              onClick={handleClearFormData}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear Form
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Logout
            </button>
          </div> */}
        </div>

        {/* Success/Error Message */}
        {saveMessage && (
          <div className={`w-full mx-auto mb-4 p-3 rounded-lg text-center ${saveMessage.includes('successfully')
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
            {saveMessage}
          </div>
        )}

        <div className="min-h-screen bg-white py-8">
          {/* Progress Bar */}
          <div className="w-full mx-auto">

            <div className="relative w-full">
              <div className="rounded-xl absolute top-0 left-0 h-2 bg-gray-200 w-full"></div>
              <div  //bg-[#F99927]
                className="rounded-xl absolute top-0 bg-gradient-to-r from-[#F99927] to-[#EF2A5F] left-0 h-2 transition-all duration-300"
                style={{ width: `${((currentStep) / 11) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white mx-auto mt-8 w-full">
            <h1 className="text-4xl text-center font-bold text-neutral-900">{stepTitles()}</h1>
            {renderStep()}
            {renderCurrentStepErrors()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 w-full mx-auto mt-4  justify-center">
            {currentStep === 1 && (
              <ButtonPrimary className='lg:first:w-[30%] ' onClick={handleNextStep} disabled={false}>
                Next
              </ButtonPrimary>
            )}
            {currentStep > 1 && (
              <ButtonSecondary onClick={handlePreviousStep} disabled={false}>Previous</ButtonSecondary>
            )}

            {(currentStep < 11 && currentStep > 1) && (
              <ButtonPrimary onClick={handleNextStep} disabled={false}>Next</ButtonPrimary>
            )}
            {currentStep === 11 && (
              <ButtonPrimary onClick={() => {
                console.log("onSubmit");
                handleSubmit2();
              }} disabled={false}>Submit</ButtonPrimary>
            )}
                    </div>

          {/* Development Mode Toggle */}
          {isDevelopment && (
            <div className="flex justify-center mt-4">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={localStorage.getItem('DISABLE_VALIDATION') === 'true'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      localStorage.setItem('DISABLE_VALIDATION', 'true');
                    } else {
                      localStorage.removeItem('DISABLE_VALIDATION');
                    }
                  }}
                  className="mr-2"
                />
                Disable validation (dev mode)
              </label>
            </div>
          )}

          </div>
        </main>
    </div>

  );
};

const MultiStepForm: React.FC = () => {
  return (
    <ValidationProvider>
      <DiligenceFilesProvider>
        <MultiStepFormContent />
      </DiligenceFilesProvider>
    </ValidationProvider>
  );
};

export default MultiStepForm;

