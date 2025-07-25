import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ValidationContextType {
  currentStepErrors: { [key: string]: string } | null;
  setCurrentStepErrors: (errors: { [key: string]: string } | null) => void;
  hasError: (fieldName: string) => boolean;
  getFieldError: (fieldName: string) => string | null;
}

const ValidationContext = createContext<ValidationContextType | undefined>(undefined);

export const useValidation = () => {
  const context = useContext(ValidationContext);
  if (context === undefined) {
    throw new Error('useValidation must be used within a ValidationProvider');
  }
  return context;
};

interface ValidationProviderProps {
  children: ReactNode;
}

export const ValidationProvider: React.FC<ValidationProviderProps> = ({ children }) => {
  const [currentStepErrors, setCurrentStepErrors] = useState<{ [key: string]: string } | null>(null);

  const hasError = (fieldName: string): boolean => {
    if (!currentStepErrors) return false;
    return currentStepErrors.hasOwnProperty(fieldName);
  };

  const getFieldError = (fieldName: string): string | null => {
    if (!currentStepErrors) return null;
    return currentStepErrors[fieldName] || null;
  };

  const value = {
    currentStepErrors,
    setCurrentStepErrors,
    hasError,
    getFieldError,
  };

  return (
    <ValidationContext.Provider value={value}>
      {children}
    </ValidationContext.Provider>
  );
}; 