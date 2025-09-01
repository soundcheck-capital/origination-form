import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store';

interface FormSubmissionGuardProps {
  children: React.ReactNode;
}

const FormSubmissionGuard: React.FC<FormSubmissionGuardProps> = ({ children }) => {
  const isSubmitted = useSelector((state: RootState) => state.form.isSubmitted);
  
  // Vérifier l'environnement
  const isDevelopment = process.env.NODE_ENV === 'development';
  const allowFormAccess = localStorage.getItem('DEV_ALLOW_FORM_ACCESS') === 'true';
  
  // DEBUG LOGS
  isDevelopment && console.log('🔍 FormSubmissionGuard Debug:', {
    isSubmitted,
    isDevelopment,
    allowFormAccess,
    NODE_ENV: process.env.NODE_ENV,
    REACT_APP_ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT
  });
  
  // Si formulaire déjà soumis
  if (isSubmitted) {
    // En développement : possibilité de contourner avec localStorage
    if (isDevelopment) {
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
