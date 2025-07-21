import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ValidationContextType {
  currentStepErrors: string[] | null;
  setCurrentStepErrors: (errors: string[] | null) => void;
  hasError: (fieldName: string) => boolean;
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
  const [currentStepErrors, setCurrentStepErrors] = useState<string[] | null>(null);

  const hasError = (fieldName: string): boolean => {
    if (!currentStepErrors) return false;
    
    // Check if any error message contains the field name
    return currentStepErrors.some(error => {
      const errorLower = error.toLowerCase();
      const fieldNameLower = fieldName.toLowerCase();
      
      // Check for exact field name matches or common variations
      return errorLower.includes(fieldNameLower) ||
             errorLower.includes(fieldNameLower.replace(/([A-Z])/g, ' $1').toLowerCase()) ||

             // Personal info
             (fieldNameLower === 'email' && errorLower.includes('email')) ||
             (fieldNameLower === 'emailconfirm' && errorLower.includes('confirmation')) ||
             (fieldNameLower === 'firstname' && errorLower.includes('first name')) ||
             (fieldNameLower === 'lastname' && errorLower.includes('last name')) ||
             (fieldNameLower === 'phone' && errorLower.includes('phone')) ||

             // Company info
             (fieldNameLower === 'role' && errorLower.includes('role')) ||
             (fieldNameLower === 'legalentityname' && errorLower.includes('company name')) ||
             (fieldNameLower === 'employees' && errorLower.includes('employees')) ||
             (fieldNameLower === 'companytype' && errorLower.includes('company type')) ||
             (fieldNameLower === 'membership' && errorLower.includes('membership')) ||
             (fieldNameLower === 'yearsinbusiness' && errorLower.includes('years in business')) ||
             (fieldNameLower === 'socials' && errorLower.includes('socials')) ||


             // Ticketing info
             (fieldNameLower === 'currentpartner' && errorLower.includes('ticketing partner')) ||
             (fieldNameLower === 'otherpartner' && errorLower.includes('other ticketing partner')) ||
             (fieldNameLower === 'settlementpolicy' && errorLower.includes('settlement policy')) ||
             (fieldNameLower === 'membership' && errorLower.includes('membership')) ||
             (fieldNameLower === 'ticketingpayout' && errorLower.includes('ticketing payout')) ||
             (fieldNameLower === 'otherticketingpayout' && errorLower.includes('other ticketing payout')) ||

             // Ticketing volume
             (fieldNameLower === 'lastyearevents' && errorLower.includes('last year events')) ||
             (fieldNameLower === 'lastyeartickets' && errorLower.includes('last year tickets')) ||
             (fieldNameLower === 'lastyearsales' && errorLower.includes('last year sales')) ||
             (fieldNameLower === 'nextyearevents' && errorLower.includes('next year events')) ||
             (fieldNameLower === 'nextyeartickets' && errorLower.includes('next year tickets')) ||
             (fieldNameLower === 'nextyearsales' && errorLower.includes('next year sales')) ||

             // Funding info
             (fieldNameLower === 'yourfunds' && errorLower.includes('funding needs')) ||
             (fieldNameLower === 'timeforfunding' && errorLower.includes('timing for funding')) ||
             (fieldNameLower === 'funduse' && errorLower.includes('fund use')) ||

             //Business info
             (fieldNameLower === 'legalentitytype' && errorLower.includes('legal entity type')) ||
             (fieldNameLower === 'stateofincorporation' && errorLower.includes('state of incorporation')) ||
             (fieldNameLower === 'currentpartner' && errorLower.includes('ticketing partner')) ||
             (fieldNameLower === 'settlementpolicy' && errorLower.includes('settlement policy')) ||
             (fieldNameLower === 'ein' && errorLower.includes('ein')) ||
             (fieldNameLower === 'dba' && errorLower.includes('dba')) ||
             (fieldNameLower === 'companyaddress' && errorLower.includes('company address')) ||

             // Ownership info
             (fieldNameLower === 'owners' && errorLower.includes('owners')) ||
             (fieldNameLower === 'ownershippercentage' && errorLower.includes('ownership percentage')) ||
             (fieldNameLower === 'owneraddress' && errorLower.includes('address')) ||
             (fieldNameLower === 'ownerbirthdate' && errorLower.includes('birth date'))


             // Ticketing info Uploads
             
             ;
    });
  };

  const value = {
    currentStepErrors,
    setCurrentStepErrors,
    hasError,
  };

  return (
    <ValidationContext.Provider value={value}>
      {children}
    </ValidationContext.Provider>
  );
}; 