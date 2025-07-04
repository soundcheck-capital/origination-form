import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useFormValidation } from '../hooks/useFormValidation';
import StepTitle from './customComponents/StepTitle';
import ButtonPrimary from './customComponents/ButtonPrimary';

interface SummaryStepProps {
  onSubmit?: () => void;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ onSubmit }) => {
  const formData = useSelector((state: RootState) => state.form.formData);
  const financesInfo = useSelector((state: RootState) => state.form.financesInfo);
  const diligenceInfo = useSelector((state: RootState) => state.form.diligenceInfo);
  const { validateAllSteps } = useFormValidation();
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string[] } | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: string) => {
    return `${value}%`;
  };

  const handleSubmit = () => {
    const validation = validateAllSteps();
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors(null);
    if (onSubmit) {
      onSubmit();
    }
  };

  const renderValidationErrors = () => {
    if (!validationErrors) return null;

    const hasErrors = Object.values(validationErrors).some(errors => errors.length > 0);
    if (!hasErrors) return null;

    return (
      <div className="w-full max-w-2xl mb-8">
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

  return (
    <div className="flex flex-col items-center justify-center w-full mt-16">
      
      <p className="text-gray-400 mb-8 text-xs w-full md:w-[30%] text-justify">
        Please review all your information before submitting. All required fields must be completed.
      </p>

      {renderValidationErrors()}

      {/* <div className="w-full max-w-2xl space-y-6">
        {/* Personal Information
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Name:</span>
              <span className="ml-2 text-gray-800">{formData.personalInfo.firstname} {formData.personalInfo.lastname}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Email:</span>
              <span className="ml-2 text-gray-800">{formData.personalInfo.email}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Phone:</span>
              <span className="ml-2 text-gray-800">{formData.personalInfo.phone}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Role:</span>
              <span className="ml-2 text-gray-800">{formData.personalInfo.role}</span>
            </div>
          </div>
        </div>

        {/* Company Information 
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Company Name:</span>
              <span className="ml-2 text-gray-800">{formData.companyInfo.name}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">DBA:</span>
              <span className="ml-2 text-gray-800">{formData.companyInfo.dba}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Client Type:</span>
              <span className="ml-2 text-gray-800">{formData.companyInfo.clientType}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Legal Entity Type:</span>
              <span className="ml-2 text-gray-800">{formData.companyInfo.legalEntityType}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Years in Business:</span>
              <span className="ml-2 text-gray-800">{formData.companyInfo.yearsInBusiness}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">EIN:</span>
              <span className="ml-2 text-gray-800">{formData.companyInfo.ein}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Address:</span>
              <span className="ml-2 text-gray-800">{formData.companyInfo.companyAddress}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">State of Incorporation:</span>
              <span className="ml-2 text-gray-800">{formData.companyInfo.stateOfIncorporation}</span>
            </div>
          </div>
        </div>

        {/* Ticketing Information 
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ticketing Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Ticketing Partner:</span>
              <span className="ml-2 text-gray-800">{formData.ticketingInfo.currentPartner}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Settlement Policy:</span>
              <span className="ml-2 text-gray-800">{formData.ticketingInfo.settlementPolicy}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Membership:</span>
              <span className="ml-2 text-gray-800">{formData.ticketingInfo.membership}</span>
            </div>
          </div>
        </div>

        {/* Volume Information 
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Volume Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Last Year Events:</span>
              <span className="ml-2 text-gray-800">{formData.volumeInfo.lastYearEvents}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Last Year Tickets:</span>
              <span className="ml-2 text-gray-800">{formData.volumeInfo.lastYearTickets}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Last Year Sales:</span>
              <span className="ml-2 text-gray-800">{formatCurrency(formData.volumeInfo.lastYearSales)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Next Year Events:</span>
              <span className="ml-2 text-gray-800">{formData.volumeInfo.nextYearEvents}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Next Year Tickets:</span>
              <span className="ml-2 text-gray-800">{formData.volumeInfo.nextYearTickets}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Next Year Sales:</span>
              <span className="ml-2 text-gray-800">{formatCurrency(formData.volumeInfo.nextYearSales)}</span>
            </div>
          </div>
        </div>

        {/* Funding Information 
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Funding Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Funding Needs:</span>
              <span className="ml-2 text-gray-800">{formatCurrency(parseFloat(formData.fundsInfo.yourFunds) || 0)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Time for Funding:</span>
              <span className="ml-2 text-gray-800">{formData.fundsInfo.timeForFunding}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Fund Use:</span>
              <span className="ml-2 text-gray-800">{formData.fundsInfo.fundUse}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Recoupable Against:</span>
              <span className="ml-2 text-gray-800">{formData.fundsInfo.recoupableAgainst}</span>
            </div>
          </div>
        </div>

        {/* Ownership Information 
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ownership Information</h3>
          {formData.ownershipInfo.owners.map((owner, index) => (
            <div key={owner.id} className="mb-4 last:mb-0">
              <h4 className="font-medium text-gray-700 mb-2">Owner {index + 1}</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Name:</span>
                  <span className="ml-2 text-gray-800">{owner.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Ownership Percentage:</span>
                  <span className="ml-2 text-gray-800">{formatPercentage(owner.ownershipPercentage)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

       
      </div> */}
     {/* Submit Button */}
     <div className="flex justify-center pt-6 w-[30%] mx-auto mb-4">
          <ButtonPrimary onClick={handleSubmit} disabled={false}  >Submit Application</ButtonPrimary>
        </div>
    </div>
  );
};

export default SummaryStep; 