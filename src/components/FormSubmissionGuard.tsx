import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSubmissionStatus } from '../hooks/useSubmissionStatus';

interface FormSubmissionGuardProps {
  children: React.ReactNode;
}

const FormSubmissionGuard: React.FC<FormSubmissionGuardProps> = ({ children }) => {
  // Désactiver complètement le guard pendant les tests
  const isTestEnvironment = process.env.REACT_APP_DISABLE_FORM_GUARD === 'true';
  
  if (isTestEnvironment) {
    return <>{children}</>;
  }
  
  const { isLoading, isSubmitted } = useSubmissionStatus();
  
  // Vérifier l'environnement
  const isDevelopment = process.env.NODE_ENV === 'development';
  const allowFormAccess = localStorage.getItem('DEV_ALLOW_FORM_ACCESS') === 'true';

  // Seule la réponse backend détermine le blocage
  
  // Debug logs en développement uniquement
  isDevelopment && console.log('🔍 FormSubmissionGuard:', {
    isSubmitted,
    isLoading,
    allowFormAccess
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
  
  // Si formulaire déjà soumis selon le backend
  if (isSubmitted) {
    // En développement : possibilité de contourner avec localStorage
    if (isDevelopment) {
      if (!allowFormAccess) {
        return <Navigate to="/submit-success" replace />;
      } else {
        return <>{children}</>;
      }
    } else {
      // Production/Staging : toujours bloquer si backend dit soumis
      return <Navigate to="/submit-success" replace />;
    }
  }
  
  // Si pas encore soumis, permettre l'accès
  return <>{children}</>;
};

export default FormSubmissionGuard;
