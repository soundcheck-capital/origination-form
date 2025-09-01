import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store';
import { useSubmissionStatus } from '../hooks/useSubmissionStatus';

interface FormSubmissionGuardProps {
  children: React.ReactNode;
}

const FormSubmissionGuard: React.FC<FormSubmissionGuardProps> = ({ children }) => {
  const isSubmittedLocal = useSelector((state: RootState) => state.form.isSubmitted);
  const { isLoading, isSubmitted: isSubmittedBackend, error } = useSubmissionStatus();
  
  // Vérifier l'environnement
  const isDevelopment = process.env.NODE_ENV === 'development';
  const allowFormAccess = localStorage.getItem('DEV_ALLOW_FORM_ACCESS') === 'true';
  
  // Combinaison des deux sources : local ET backend
  const isSubmitted = isSubmittedLocal || isSubmittedBackend;
  
  // DEBUG LOGS
  isDevelopment && console.log('🔍 FormSubmissionGuard Debug:', {
    isSubmittedLocal,
    isSubmittedBackend,
    isSubmitted,
    isLoading,
    error,
    isDevelopment,
    allowFormAccess,
    NODE_ENV: process.env.NODE_ENV,
    REACT_APP_ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT
  });
  
  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Vérification du statut...</p>
        </div>
      </div>
    );
  }
  
  // Si formulaire déjà soumis
  if (isSubmitted) {
    // En développement : possibilité de contourner avec localStorage
    if (isDevelopment && !isSubmittedBackend) {
      const allowFormAccess = localStorage.getItem('DEV_ALLOW_FORM_ACCESS') === 'true';
      if (!allowFormAccess) {
        isDevelopment && console.log('🔒 FormSubmissionGuard: Form already submitted, redirecting to success page');
        return <Navigate to="/submit-success" replace />;
      } else {
        isDevelopment && console.log('🔓 FormSubmissionGuard: DEV_ALLOW_FORM_ACCESS enabled, allowing form access');
        return <>{children}</>;
      }
    } else {
      // Production/Staging : toujours bloquer
      isDevelopment && console.log('🔒 FormSubmissionGuard: Form already submitted, access blocked');
      return <Navigate to="/submit-success" replace />;
    }
  }
  
  // Si pas encore soumis, permettre l'accès
  return <>{children}</>;
};

export default FormSubmissionGuard;
