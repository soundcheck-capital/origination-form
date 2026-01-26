import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { fetchApplicationById } from '../store/auth/authThunks';
import {   setSubmitted } from '../store/form/formSlice';
import { DiligenceFilesProvider } from '../contexts/DiligenceFilesContext';
import { ValidationProvider, useValidation } from '../contexts/ValidationContext';
import { useFileUpload } from '../hooks/useFileUpload';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import Step4 from './step4';
import Step5 from './step5';
import LoadingScreen from './customComponents/LoadingScreen';
import logo from '../assets/logo_side_black.svg';
import ButtonPrimary from './customComponents/ButtonPrimary';
import ButtonSecondary from './customComponents/ButtonSecondary';
import { useFormValidation } from '../hooks/useFormValidation';
// Import debug utils to auto-clear validation bypass flags
import '../utils/debugUtils';

const MultiStepFormContent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const formData = useSelector((state: RootState) => state.form);
  const [saveMessage, setSaveMessage] = useState('');
  const { sendFormData, isUploading } = useFileUpload();
  const { validateAllSteps, validateCurrentStep, isDevelopment } = useFormValidation();
  
  // Vérifier l'environnement (development, staging, production)
  const currentEnvironment = process.env.REACT_APP_ENVIRONMENT || 'development';
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string[] } | null>(null);
  const { currentStepErrors, setCurrentStepErrors, focusFirstErrorField } = useValidation();
  const [isSavingStep, setIsSavingStep] = useState(false);
  const isSubmitted = useSelector((state: RootState) => state.form.isSubmitted);
  // Redirection après soumission locale réussie
  useEffect(() => {
    if (isSubmitted) {
      navigate('/submit-success');
    }
  }, [isSubmitted, navigate]);

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
          legalBusinessName: formData.formData.companyInfo.legalBusinessName,
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
          settlementPayout: formData.formData.ticketingInfo.settlementPayout,
          nextYearEvents: formData.formData.volumeInfo.nextYearEvents,
          nextYearSales: formData.formData.volumeInfo.nextYearSales,
          owners: formData.formData.ownershipInfo.owners,
          singleEntity: formData.formData.financesInfo.singleEntity ? 'Single Entity' : 'Multi Entity group structure',
          assetsTransferred: formData.formData.financesInfo.assetsTransferred ? 'Yes' : 'No',
          filedLastYearTaxes: formData.formData.financesInfo.filedLastYearTaxes ? 'Yes' : 'No',
          hasTicketingDebt: formData.formData.financesInfo.hasTicketingDebt ? 'Yes' : 'No',
          hasBusinessDebt: formData.formData.financesInfo.hasBusinessDebt ? 'Yes' : 'No',
          hasOverdueLiabilities: formData.formData.financesInfo.hasOverdueLiabilities ? 'Yes' : 'No',
          hasTaxLiens: formData.formData.financesInfo.hasTaxLiens ? 'Yes' : 'No',
          hasJudgments: formData.formData.financesInfo.hasJudgments ? 'Yes' : 'No',
          hasBankruptcy: formData.formData.financesInfo.hasBankruptcy ? 'Yes' : 'No',
          ownershipChanged: formData.formData.financesInfo.ownershipChanged ? 'Yes' : 'No',
          debts: formData.formData.financesInfo.debts,
        },
        deal: {
          nextYearEvents: formData.formData.volumeInfo.nextYearEvents,
          nextYearSales: formData.formData.volumeInfo.nextYearSales,
          settlementPolicy: formData.formData.ticketingInfo.settlementPayout,
          purchasePrice: formData.formData.fundsInfo.yourFunds,
          useOfProceeds: formData.formData.fundsInfo.useOfProceeds,
          timingOfFunding: formData.formData.fundsInfo.timingOfFunding,
          additionalComments: formData.formData.financesInfo.additionalComments,
          industryReferences: formData.formData.financesInfo.industryReferences,
        },

      };

      // Les fichiers sont déjà uploadés individuellement lors de leur sélection
      // Envoyer uniquement les données du formulaire
      const result = await sendFormData(formDataToSend);

      if (result.success) {
        setSaveMessage('Application submitted successfully!');
        
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
  const triggerValidationThenSubmit = () => {
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
    
    // Debug logging
    if (isDevelopment) {
      console.log('🔍 HandleNextStep Debug:', {
        currentStep,
        validation,
        formData: formData.formData.ticketingInfo
      });
    }
    
    if (!validation.isValid) {
      // Merge validation errors with existing field errors
      const currentErrors = currentStepErrors || {};
      const merged = { ...currentErrors, ...validation.errors };
      setCurrentStepErrors(merged);
      
      if (isDevelopment) {
        console.log('❌ Validation failed:', merged);
      }
      
      // Scroll vers le haut pour que l'utilisateur voie les erreurs
      setTimeout(() => {
        focusFirstErrorField();
      }, 100);
      
      return;
    }
    
    if (isDevelopment) {
      console.log('✅ Validation passed, proceeding to next step');
    }

    // Si on passe de l'étape 1 à l'étape 2, afficher le loader
    if (currentStep === 1) {
      setIsLoading(true);
      
      // Simuler l'analyse des informations pendant 3 secondes
      setTimeout(() => {
        setIsLoading(false);
        setCurrentStep(currentStep + 1);
        setCurrentStepErrors({});
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 3000);
      
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
        return 'Tell us about your business';
      case 2:
        return 'Get funding';
      case 3:
        return 'Business & Ownership';
      case 4:
        return 'Diligence Files';
      case 5:
        return 'Review & Submit';
      default:
        return 'SoundCheck';
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      case 5:
        return <Step5 renderValidationErrors={renderValidationErrors()} onStepClick={handleStepClick} />;
      default:
        return null;
    }
  };

  function DevToggle({ isDevelopment }: { isDevelopment: boolean }) {
    // Toggle pour la validation d'étapes
    const [disableValidation, setDisableValidation] = useState(() => {
      return localStorage.getItem('DISABLE_VALIDATION') === 'true';
    });
    
    // Toggle pour permettre l'accès au formulaire après soumission
    const [allowFormAccess, setAllowFormAccess] = useState(() => {
      return localStorage.getItem('DEV_ALLOW_FORM_ACCESS') === 'true';
    });
  
    useEffect(() => {
      localStorage.setItem('DISABLE_VALIDATION', disableValidation.toString());
    }, [disableValidation]);
    
    useEffect(() => {
      localStorage.setItem('DEV_ALLOW_FORM_ACCESS', allowFormAccess.toString());
    }, [allowFormAccess]);
  
    if (!isDevelopment) return null;
  
    return (
      <div className="flex flex-col items-center mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="text-sm font-medium text-yellow-800 mb-2">🛠️ Development Tools</div>
        
        <label className="flex items-center text-sm text-gray-600 mb-2">
          <input
            type="checkbox"
            checked={disableValidation}
            onChange={(e) => {
              setDisableValidation(e.target.checked);
              isDevelopment && console.log("DISABLE_VALIDATION", e.target.checked);
            }}
            className="mr-2"
          />
          Disable step validation
        </label>
        
        <label className="flex items-center text-sm text-gray-600">
          <input
            type="checkbox"
            checked={allowFormAccess}
            onChange={(e) => {
              setAllowFormAccess(e.target.checked);
              isDevelopment && console.log("DEV_ALLOW_FORM_ACCESS", e.target.checked);
            }}
            className="mr-2"
          />
          Allow form access after submission
        </label>
      </div>
    );
  }
  
  // Afficher le loader si en cours de chargement
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-row  animate-fade-in-right duration-1000 lg:w-[30%] xs:w-[100%] mx-auto">
      {/* <Sidebar activeMenuItem={activeMenuItem} setActiveMenuItem={setActiveMenuItem} /> */}

      <main className="w-full h-full flex flex-col bg-white p-6 relative overflow-hidden">
        <div className="flex justify-center items-center">
          <img src={logo} alt="Logo" className="w-48 " />
        </div>

       

        <div className="min-h-screen bg-white py-8">
          {/* Progress Bar */}
          <div className="w-full mx-auto">
            <div className="relative w-full">
              {/* Background track with glass effect */}
              <div className="
                rounded-xl 
                absolute top-0 left-0 
                h-2 w-full
                backdrop-blur-sm
                border border-gray-300/30
                bg-white/30
                shadow-inner
              "></div>
              
              {/* Progress fill with glass effect */}
              <div 
                className="
                  rounded-xl 
                  absolute top-0 left-0 
                  h-2
                  backdrop-blur-md
                  border border-white/40
                  bg-gradient-to-r from-amber-400/60 via-orange-400/60 to-rose-500/60
                  shadow-lg shadow-amber-300/40
                  transition-all duration-300 ease-out
                  before:absolute before:inset-0 before:rounded-xl
                  before:bg-gradient-to-r before:from-white/20 before:to-transparent
                  before:pointer-events-none
                  relative
                "
                style={{ width: `${((currentStep) / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white mx-auto mt-8 w-full">
            <h1 className="text-2xl mb-4 text-center font-bold text-neutral-900">{stepTitles()}</h1>
            {renderStep()}
            {/* {renderCurrentStepErrors()} */}
          </div>
         

          {/* Navigation Buttons */}
          <div className="flex gap-4 w-full mx-auto mt-4  justify-center">
            {currentStep === 1 && (
              <ButtonPrimary className='lg:first:w-[40%] ' onClick={handleNextStep} disabled={isSavingStep}>
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

            {(currentStep < 5 && currentStep > 1) && (
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
            {currentStep === 5 && (
              <ButtonPrimary onClick={() => {
                triggerValidationThenSubmit();
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

        {/* Submission in progress */}
        {isUploading && (
          <div className="w-full mx-auto my-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-blue-700 font-medium">Submitting application...</span>
            </div>
          </div>
        )}
           

          {/* Development Mode Toggle */}
          {isDevelopment && <DevToggle isDevelopment={isDevelopment} />}
          
          {/* Status Indicator (Development Only) */}
          {isDevelopment && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-center">
              <span className="font-medium">🌍 {currentEnvironment}</span>
              <span className="mx-2">•</span>
              <span className={isSubmitted ? 'text-green-600' : 'text-orange-600'}>
                {isSubmitted ? '✅ Submitted' : '⏳ Not Submitted'}
              </span>
              {isSubmitted && (
                <>
                  <span className="mx-2">•</span>
                  <span className={localStorage.getItem('DEV_ALLOW_FORM_ACCESS') === 'true' ? 'text-red-600' : 'text-green-600'}>
                    {localStorage.getItem('DEV_ALLOW_FORM_ACCESS') === 'true' ? '🔓 Access Allowed' : '🔒 Access Blocked'}
                  </span>
                </>
              )}
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

