import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { fetchApplicationById } from '../store/auth/authThunks';
import {   setSubmitted } from '../store/form/formSlice';
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
import FileLossNotification from './FileLossNotification';

const MultiStepFormContent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState(1);
  const formData = useSelector((state: RootState) => state.form);
  const [saveMessage, setSaveMessage] = useState('');
  const { getAllFiles } = useDiligenceFiles();
  const { uploadToMake, uploadProgress, isUploading } = useFileUpload();
  const { validateAllSteps, validateCurrentStep, isDevelopment } = useFormValidation();
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string[] } | null>(null);
  const { currentStepErrors, setCurrentStepErrors } = useValidation();
  const [isSavingStep, setIsSavingStep] = useState(false);

  // Vérifier si le formulaire a été soumis avec succès
  useEffect(() => {
    const disableSubmissionBlock = localStorage.getItem('DISABLE_SUBMISSION_BLOCK') === 'true';
    if (formData.isSubmitted && !isDevelopment && !disableSubmissionBlock) {
      // Rediriger vers la page de succès si le formulaire a été soumis
      navigate('/submit-success');
    }
  }, [formData.isSubmitted, navigate, isDevelopment]);

  // Load application data if ID is provided
  useEffect(() => {
    if (id) {
      dispatch(fetchApplicationById(id));
    }
  }, [id, dispatch]);


  const handleSubmit = async () => {
    setSaveMessage('');

    try {
      // Préparer les données du formulaire avec diligenceInfo déjà inclus
      const formDataToSend = {
        contact: formData.formData.personalInfo,
        company: {
          name: formData.formData.companyInfo.name,
          address: formData.formData.companyInfo.companyAddress,
          city: formData.formData.companyInfo.companyCity,
          state: formData.formData.companyInfo.companyState,
          zip: formData.formData.companyInfo.companyZipcode,
          employees: formData.formData.companyInfo.employees,
          dba: formData.formData.companyInfo.dba,
          yearsInBusiness: formData.formData.companyInfo.yearsInBusiness,
          socials: formData.formData.companyInfo.socials,
          clientType: formData.formData.companyInfo.clientType,
          businessType: formData.formData.companyInfo.businessType,
          ein: formData.formData.companyInfo.ein,
          stateOfIncorporation: formData.formData.companyInfo.stateOfIncorporation,
          memberOf: formData.formData.companyInfo.memberOf,
          currentPartner: formData.formData.ticketingInfo.currentPartner,
          otherPartner: formData.formData.ticketingInfo.otherPartner,
          paymentProcessing: formData.formData.ticketingInfo.paymentProcessing,
          otherPaymentProcessing: formData.formData.ticketingInfo.otherPaymentProcessing,
          settlementPayout: formData.formData.ticketingInfo.settlementPayout,
          lastYearEvents: formData.formData.volumeInfo.lastYearEvents,
          lastYearTickets: formData.formData.volumeInfo.lastYearTickets,
          lastYearSales: formData.formData.volumeInfo.lastYearSales,
          nextYearEvents: formData.formData.volumeInfo.nextYearEvents,
          nextYearTickets: formData.formData.volumeInfo.nextYearTickets,
          nextYearSales: formData.formData.volumeInfo.nextYearSales,
          owners: formData.formData.ownershipInfo.owners,
          singleEntity: formData.formData.financesInfo.singleEntity ? 'Single Entity' : 'Multi Entity group structure',
          assetsTransferred: formData.formData.financesInfo.assetsTransferred ? 'Yes' : 'No',
          filedLastYearTaxes: formData.formData.financesInfo.filedLastYearTaxes ? 'Yes' : 'No',
          hasTicketingDebt: formData.formData.financesInfo.hasTicketingDebt ? 'Yes' : 'No',
          hasBusinessDebt: formData.formData.financesInfo.hasBusinessDebt ? 'Yes' : 'No',
          hasOverdueLiabilities: formData.formData.financesInfo.hasOverdueLiabilities ? 'Yes' : 'No',
          isLeasingLocation: formData.formData.financesInfo.isLeasingLocation ? 'Yes' : 'No',
          hasTaxLiens: formData.formData.financesInfo.hasTaxLiens ? 'Yes' : 'No',
          hasJudgments: formData.formData.financesInfo.hasJudgments ? 'Yes' : 'No',
          hasBankruptcy: formData.formData.financesInfo.hasBankruptcy ? 'Yes' : 'No',
          ownershipChanged: formData.formData.financesInfo.ownershipChanged ? 'Yes' : 'No',
          leaseEndDate: formData.formData.financesInfo.leaseEndDate,
          debts: formData.formData.financesInfo.debts,
        },
        deal: {
          nextYearEvents: formData.formData.volumeInfo.nextYearEvents,
          nextYearTickets: formData.formData.volumeInfo.nextYearTickets,
          nextYearSales: formData.formData.volumeInfo.nextYearSales,
          settlementPolicy: formData.formData.ticketingInfo.settlementPayout,
          purchasePrice: formData.formData.fundsInfo.yourFunds,
          useOfProceeds: formData.formData.fundsInfo.useOfProceeds,
          timingOfFunding: formData.formData.fundsInfo.timingOfFunding,
          additionalComments: formData.formData.financesInfo.additionalComments,
        },
        hubspotContact: process.env.REACT_APP_HUBSPOT_CONTACT_ID,
        hubspotCompany: process.env.REACT_APP_HUBSPOT_COMPANY_ID,
        hubspotDeal: process.env.REACT_APP_HUBSPOT_DEAL_ID,
      };

      console.log("formDataToSend => ", formDataToSend);

      // Récupérer tous les fichiers pour l'upload
      const allFiles = getAllFiles();

      // Upload direct vers Make.com avec les fichiers
      const result = await uploadToMake(formDataToSend, allFiles);

      if (result.success) {
        setSaveMessage('Application submitted successfully!');
        
        // Marquer comme soumis
        dispatch(setSubmitted());

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
    } 
  };
  const handleSubmit2 = () => {
    console.log("handleSubmit2");
    const validation = validateAllSteps();
    
    if (!validation.isValid) {
      // Convert the new error format to the old format for backward compatibility
      const oldFormatErrors: { [key: string]: string[] } = {};
      Object.entries(validation.errors).forEach(([section, fieldErrors]) => {
        oldFormatErrors[section] = Object.values(fieldErrors);
      });
      setValidationErrors(oldFormatErrors);
      return;
    }

    setValidationErrors(null);
    handleSubmit();
  };

  const handleNextStep = async () => {
    const validation = validateCurrentStep(currentStep);
    
    if (!validation.isValid) {
      // Merge validation errors with existing field errors
      const currentErrors = currentStepErrors || {};
      const merged = { ...currentErrors, ...validation.errors };
      setCurrentStepErrors(merged);
      return;
    }

    // Démarrer l'animation de sauvegarde
    setIsSavingStep(true);

    try {
      // Simuler une petite pause pour l'animation (500ms)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Only clear errors if validation passes
      setCurrentStepErrors(null);
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } finally {
      setIsSavingStep(false);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStepErrors(null);
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleStepClick = (stepNumber: number) => {
    setCurrentStepErrors(null);
    setCurrentStep(stepNumber);
    window.scrollTo(0, 0);
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
        return <SummaryStep renderValidationErrors={renderValidationErrors()} onStepClick={handleStepClick} />;
      default:
        return null;
    }
  };

  function DevToggle({ isDevelopment }: { isDevelopment: boolean }) {
    // 1. initialiser le state depuis localStorage (vaut true/false selon la chaîne stockée)
    const [disableValidation, setDisableValidation] = useState(() => {
      return localStorage.getItem('DISABLE_VALIDATION') === 'true' ? true : false;
    });
  
    // 2. synchroniser localStorage si le state change (optionnel, car on l'écrit déjà dans onChange)
    useEffect(() => {
      localStorage.setItem('DISABLE_VALIDATION', disableValidation.toString());
    }, [disableValidation]);
  
    if (!isDevelopment) return null;
  
    return (
      <div className="flex justify-center mt-4">
        <label className="flex items-center text-sm text-gray-600">
          <input
            type="checkbox"
            checked={disableValidation}
            onChange={(e) => {
              // 3. mettre à jour le state (ce qui force le re-render)
              setDisableValidation(e.target.checked);
              console.log("DISABLE_VALIDATION", e.target.checked);
            }}
            className="mr-2"
          />
          Disable step validation (dev mode only)
        </label>
      </div>
    );
  }
  
  return (
    <div className="flex flex-row  animate-fade-in-right duration-1000 lg:w-[30%] xs:w-[100%] mx-auto">
      {/* <Sidebar activeMenuItem={activeMenuItem} setActiveMenuItem={setActiveMenuItem} /> */}

      <main className="w-full h-full flex flex-col bg-white p-6">
        <div className="flex justify-center items-center">
          <img src={logo} alt="Logo" className="w-24 " />
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

       

        <div className="min-h-screen bg-white py-8">
          {/* Progress Bar */}
          <div className="w-full mx-auto">

            <div className="relative w-full">
              <div className="rounded-xl absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
              <div  //bg-[#F99927]
                className="rounded-xl absolute top-0 bg-gradient-to-r from-[#F99927] to-[#EF2A5F] left-0 h-1 transition-all duration-300"
                style={{ width: `${((currentStep) / 11) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white mx-auto mt-8 w-full">
          <FileLossNotification />

            <h1 className="text-3xl text-center font-bold text-neutral-900">{stepTitles()}</h1>
            {renderStep()}
            {/* {renderCurrentStepErrors()} */}
          </div>
          {(currentStep < 11 && currentStep > 0 && currentStep !== 6) && (
             <p className='text-xs text-gray-500 text-center'><span className='text-red-500'>*</span> Required fields</p>
            )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 w-full mx-auto mt-4  justify-center">
            {currentStep === 1 && (
              <ButtonPrimary className='lg:first:w-[30%] ' onClick={handleNextStep} disabled={isSavingStep}>
                {isSavingStep ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Next'
                )}
              </ButtonPrimary>
            )}
            {currentStep > 1 && (
              <ButtonSecondary onClick={handlePreviousStep} disabled={false}>Previous</ButtonSecondary>
            )}

            {(currentStep < 11 && currentStep > 1) && (
              <ButtonPrimary onClick={handleNextStep} disabled={isSavingStep}>
                {isSavingStep ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Next'
                )}
              </ButtonPrimary>
            )}
            {currentStep === 11 && (
              <ButtonPrimary onClick={() => {
                console.log("onSubmit");
                handleSubmit2();
              }} disabled={false}>Submit</ButtonPrimary>
            )}
                    </div>
 {/* Success/Error Message */}
 {saveMessage && (
          <div className={`w-full mx-auto my-4 p-3 rounded-lg text-center ${saveMessage.includes('successfully')
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
            {saveMessage}
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="w-full mx-auto my-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="text-center mb-2">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-blue-700 font-medium">Uploading files...</span>
            </div>
            {Object.keys(uploadProgress).length > 0 && (
              <div className="space-y-2">
                {Object.entries(uploadProgress).map(([fieldName, progress]) => (
                  <div key={fieldName} className="w-full">
                    <div className="flex justify-between text-sm text-blue-600 mb-1">
                      <span className="capitalize">{fieldName.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
           

          {/* Development Mode Toggle */}
           {isDevelopment && <DevToggle isDevelopment={isDevelopment} />}

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

