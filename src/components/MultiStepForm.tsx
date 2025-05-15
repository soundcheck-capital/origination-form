import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { saveApplication, fetchApplicationById } from '../store/authSlice';
import { setCurrentStep } from '../store/formSlice';
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

const MultiStepForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState(0);
  const formData = useSelector((state: RootState) => state.form);
  const { user } = useSelector((state: RootState) => state.auth);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

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
      await dispatch(saveApplication({ ...formData, currentStep }));
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
      await dispatch(saveApplication({ ...formData, currentStep, status: 'submitted' }));
      navigate('/dashboard');
    } catch (error) {
      setSaveMessage('Failed to submit application. Please try again.');
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
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
        return <TicketingVolumeStep />;
      case 5:
        return <FundsStep />;
      case 6:
        return <LegalInfoStep />;
      case 7:
        return <OwnershipStep />;
      case 8:
        return <FinancesStep />;
      case 9:
        return <DiligenceStep />;
      case 10:
        return <SummaryStep />;
      default:
        return null;
    }
  };

  return (
    <div className="multi-step-form">
      <div className="form-header">
        <button 
          onClick={handleBackToDashboard} 
          className="back-to-dashboard"
        >
          ← Back to Dashboard
        </button>
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
      </div>

      <div className="funding-label">Origination Form</div>
      
      <div className="progress-bar">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${((currentStep + 1) / 10) * 100}%` }}
        ></div>
      </div>

      {saveMessage && <div className="save-message">{saveMessage}</div>}
      
      <div className="form-actions top-actions">
        <button 
          onClick={handleSave} 
          className="btn btn-secondary save-button"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Progress'}
        </button>
      </div>

      {renderStep()}

      <div className="form-navigation">
        {currentStep > 0 && (
          <button 
            onClick={() => setCurrentStep(currentStep - 1)} 
            className="btn btn-secondary"
          >
            Previous
          </button>
        )}
        
        {currentStep < 10 ? (
          <button 
            onClick={() => setCurrentStep(currentStep + 1)} 
            className="btn btn-primary"
          >
            Next
          </button>
        ) : (
          <button 
            onClick={handleSubmit} 
            className="btn btn-success"
          >
            Submit Application
          </button>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm; 