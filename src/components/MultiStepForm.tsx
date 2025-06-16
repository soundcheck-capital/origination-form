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
import FundsStep from './FundsStep';
import DiligenceStep from './DiligenceStep';
import SummaryStep from './SummaryStep';
import logo from '../assets/logo_black_name.svg';
import LegalInfoStep from './LegalInfoStep';
import Sidebar from './Sidebar';

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
        return 'Authentication';
      case 2:
        return 'Tell us about your business';
      case 3:
        return 'Tell us about your business';
      case 4:
        return 'Customize your funding';
      case 5:
        return 'Business & Ownership';
      case 6:
        return 'Ownership Information';
      case 7:
        return 'Finances';
      case 8:
        return 'Diligence';
      case 9:
        return 'Summary';
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
        return <FundsStep />;
      case 5:
        return <LegalInfoStep />;
      case 6:
        return <OwnershipStep />;
      case 7:
        return <FinancesStep />;
      case 8:
        return <DiligenceStep />;
      case 9:
        return <SummaryStep />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-row">
      {/* <Sidebar activeMenuItem={activeMenuItem} setActiveMenuItem={setActiveMenuItem} /> */}


      <main className="w-full h-full flex flex-col m-4 bg-gray-50 rounded-xl shadow-sm p-6 border border-gray-100 ">
        <div className="flex justify-between items-center m-4">
            <img src={logo} alt="Logo" className="" />
            <h1 className="text-4xl font-bold text-neutral-600">{stepTitles()}</h1>
          

          {/* Navigation Buttons */}
          <div className="flex justify-end gap-4">
            {/* <button
              onClick={handleBackToDashboard}
              className="px-6 py-2 shadow-md rounded-3xl bg-gradient-to-bl from-amber-400 to-orange-600 text-white hover:bg-orange-900 font-bold"
            >
              Dashboard
            </button> */}
            {/* {saveMessage && <div className="save-message">{saveMessage}</div>}

          <button
            onClick={handleSave}
            className="btn-save"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Progress'}
          </button> */}

            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className={`px-6 py-2 shadow-md rounded-3xl border border-orange-600  text-white hover:bg-orange-500 hover:text-white font-bold text-orange-700 active:translate-y-1 transition-all duration-300`}
              >
                Previous
              </button>
            )}

            {currentStep < 9 ? (
              <button
                onClick={() => {
                  setCurrentStep(currentStep + 1);
                  window.scrollTo(0, 0);
                }}
                className="px-6 py-2 shadow-md rounded-3xl bg-gradient-to-bl from-rose-500 to-rose-700 hover:bg-gradient-to-bl hover:from-rose-600 hover:to-rose-800 hover:text-white text-white font-bold active:translate-y-1 transition-all duration-300"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 shadow-md rounded-3xl bg-gradient-to-bl from-rose-500 to-orange-600 text-white font-bold active:translate-y-1 transition-all duration-300"
              >
                Submit Application
              </button>
            )}
          </div>
        </div>
        <div className="min-h-screen bg-gray-50 py-8">
          {/* Progress Bar */}
          <div className="mb-8 ">

            <div className="relative ">
              <div className="rounded-xl absolute top-0 left-0 h-3 bg-gray-200 w-full"></div>
              <div  //bg-[#F99927]
                className="rounded-xl absolute top-0 bg-gradient-to-r from-[#F99927] to-[#EF2A5F] left-0 h-3 transition-all duration-300"
                style={{ width: `${((currentStep) / 9) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 w-3/4 mx-auto">
            {renderStep()}
          </div>


        </div>
      </main>
    </div>

  );
};

export default MultiStepForm; 