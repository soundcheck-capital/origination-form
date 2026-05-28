import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PasswordProtection from './PasswordProtection';
import { isClientFormAuthenticated } from '../utils/clientFormAuth';
import { getCompanyNameFromUrl } from '../utils/urlParams';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const companyNameInUrl = getCompanyNameFromUrl();
    // Si companyName est dans l'URL = lien client dédié → exiger le mot de passe
    if (!companyNameInUrl) {
      setIsAuthenticated(true);
      return;
    }
    setIsAuthenticated(isClientFormAuthenticated());
  }, [location]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <PasswordProtection />;
};

export default ProtectedRoute;
