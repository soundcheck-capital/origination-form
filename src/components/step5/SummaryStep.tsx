import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { formatCurrency } from '../../utils/format';

interface SummaryStepProps {
  renderValidationErrors?: React.ReactNode;
  onStepClick?: (stepNumber: number) => void;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ renderValidationErrors, onStepClick }) => {
  const formData = useSelector((state: RootState) => state.form.formData);
  const diligenceInfo = useSelector((state: RootState) => state.form.diligenceInfo);
  
  const { personalInfo, companyInfo, ticketingInfo, volumeInfo, fundsInfo, ownershipInfo, financesInfo } = formData;

  // Check if we're in development mode
  const [disableSubmissionBlock] = useState(() => {
    return localStorage.getItem('DISABLE_SUBMISSION_BLOCK') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('DISABLE_SUBMISSION_BLOCK', disableSubmissionBlock.toString());
  }, [disableSubmissionBlock]);

 

  return (
    <div className="flex flex-col items-center justify-center w-full mt-16 animate-fade-in-right duration-1000">
      
     
      {/* <p className="text-gray-500 w-[30%] mx-auto mb-8 text-center text-justify"><span className="font-bold text-neutral-800 text-md">Notes and Disclosures:</span> The information appearing in this form (the "Form") is confidential and is being delivered and requested to clients and prospective clients of SoundCheck Capital to assess their eligibility to SoundCheck's Capital Advance program. This Form is not to be reproduced or distributed and is intended solely for the use of the person to whom it has been delivered. Unauthorized reproduction or distribution of all or any of this material or the information contained herein is strictly prohibited. Each prospective client agrees to the foregoing.</p>
 */}
      {renderValidationErrors}

   

       <div className="w-full max-w-2xl space-y-6">
        {/* Personal Information */}
        <div 
          className="bg-white rounded-lg  p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200" 
          onClick={() => onStepClick?.(1)}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            Personal Information
            <span className="ml-2 text-xs text-blue-600 font-normal">(Click to edit)</span>
          </h3>
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div>
              <span className=" text-gray-600 font-bold">Name:</span>
              <span className="ml-2 text-gray-800">{personalInfo.firstname} {personalInfo.lastname}</span>
            </div>
            <div>
              <span className=" text-gray-600 font-bold">Email:</span>
              <span className="ml-2 text-gray-800">{personalInfo.email}</span>
            </div>
            <div>
              <span className=" text-gray-600 font-bold">Phone:</span>
              <span className="ml-2 text-gray-800">{personalInfo.phone}</span>
            </div>
            <div>
              <span className=" text-gray-600 font-bold">Role:</span>
              <span className="ml-2 text-gray-800">{personalInfo.role}</span>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div 
          className="bg-white rounded-lg  p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200" 
          onClick={() => onStepClick?.(2)}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            Company Information
            <span className="ml-2 text-xs text-blue-600 font-normal">(Click to edit)</span>
          </h3>
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div>
              <span className=" text-gray-600 font-bold">Company Name:</span>
              <span className="ml-2 text-gray-800">{companyInfo.name}</span>
            </div>
            <div>
              <span className=" text-gray-600 font-bold">DBA:</span>
              <span className="ml-2 text-gray-800">{companyInfo.dba}</span>
            </div>
            <div>
              <span className=" text-gray-600 font-bold">Client Type:</span>
              <span className="ml-2 text-gray-800">{companyInfo.clientType}</span>
            </div>
            <div>
              <span className=" text-gray-600 font-bold">Legal Entity Type:</span>
              <span className="ml-2 text-gray-800">{companyInfo.businessType}</span>
            </div>
            <div>
              <span className=" text-gray-600 font-bold">Years in Business:</span>
              <span className="ml-2 text-gray-800">{companyInfo.yearsInBusiness}</span>
            </div>
            <div>
              <span className=" text-gray-600 font-bold">EIN:</span>
              <span className="ml-2 text-gray-800">{companyInfo.ein}</span>
            </div>
            <div>
              <span className=" text-gray-600 font-bold">Address:</span>
              <span className="ml-2 text-gray-800">{companyInfo.companyAddressDisplay}</span>
            </div>
            <div>
              <span className=" text-gray-600 font-bold">State of Incorporation:</span>
              <span className="ml-2 text-gray-800">{companyInfo.stateOfIncorporation}</span>
            </div>
            <div>
              <span className=" text-gray-600 font-bold">Socials:</span>
              <span className="ml-2 text-gray-800">{companyInfo.socials}</span>
            </div>
            <div>
              <span className=" text-gray-600 font-bold">Member Of:</span>
              <span className="ml-2 text-gray-800">{companyInfo.memberOf}</span>
            </div>
          </div>
        </div>

        {/* Ticketing Information */}
        <div 
          className="bg-white rounded-lg  p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200" 
          onClick={() => onStepClick?.(3)}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            Ticketing Information
            <span className="ml-2 text-xs text-blue-600 font-normal">(Click to edit)</span>
          </h3>
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div>
              <span className=" text-gray-600 font-bold">Ticketing Partner:</span>
              <span className="ml-2 text-gray-800">{ticketingInfo.currentPartner}</span>
            </div>
            <div>
              <span className=" text-gray-600 font-bold">Settlement Policy:</span>
              <span className="ml-2 text-gray-800">{ticketingInfo.settlementPayout}</span>
            </div>
            <div>
              <span className=" text-gray-600 font-bold">Membership:</span>
              <span className="ml-2 text-gray-800">{ticketingInfo.paymentProcessing}</span>
            </div>
            {ticketingInfo.otherPartner && (
              <div>
                <span className=" text-gray-600 font-bold">Other Partner:</span>
                <span className="ml-2 text-gray-800">{ticketingInfo.otherPartner}</span>
              </div>
            )}
            
          </div>
        </div>

        {/* Volume Information */}
        <div 
          className="bg-white rounded-lg  p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200" 
          onClick={() => onStepClick?.(3)}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            Volume Information
            <span className="ml-2 text-xs text-blue-600 font-normal">(Click to edit)</span>
          </h3>
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div>
              <span className=" text-gray-600 font-bold">Number of Events:</span>
              <span className="ml-2 text-gray-800">{volumeInfo.lastYearEvents}</span>
            </div>
            <div>
              <span className=" text-gray-600 font-bold">Online Gross Tickets Sales ($):</span>
              <span className="ml-2 text-gray-800">{formatCurrency(volumeInfo.lastYearSales)}</span>
            </div>
          </div>
        </div>

        {/* Funding Information */}
        <div 
          className="bg-white rounded-lg  p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200" 
          onClick={() => onStepClick?.(4)}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            Funding Information
            <span className="ml-2 text-xs text-blue-600 font-normal">(Click to edit)</span>
          </h3>
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div>
              <span className=" text-gray-600 font-bold">Purchase Price:</span>
              <span className="ml-2 text-gray-800">{formatCurrency(parseFloat(fundsInfo.yourFunds) || 0)}</span>
            </div>
            <div>
              <span className=" text-gray-600 font-bold">Timing of Funding:</span>
              <span className="ml-2 text-gray-800">{fundsInfo.timingOfFunding}</span>
            </div>
            <div>
              <span className=" text-gray-600 font-bold">Use of Proceeds:</span>
              <span className="ml-2 text-gray-800">{fundsInfo.useOfProceeds}</span>
            </div>
            
          </div>
        </div>

        {/* Ownership Information */}
        <div 
          className="bg-white rounded-lg  p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200" 
          onClick={() => onStepClick?.(5)}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            Ownership Information
            <span className="ml-2 text-xs text-blue-600 font-normal">(Click to edit)</span>
          </h3>
          {ownershipInfo.owners.map((owner, index) => (
            <div key={owner.id} className="mb-4 last:mb-0">
              <h4 className="font-bold text-gray-700 mb-2 underline">Owner {index + 1}</h4>
              <div className="grid grid-cols-1 gap-4 text-sm mb-4">
                <div>
                  <span className=" text-gray-600 font-bold">Name:</span>
                  <span className="ml-2 text-gray-800">{owner.ownerName}</span>
                </div>
                <div>
                  <span className=" text-gray-600 font-bold">Ownership Percentage:</span>
                  <span className="ml-2 text-gray-800">{owner.ownershipPercentage}%</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 text-sm mb-4">
                <div>
                    <span className=" text-gray-600 font-bold">Address:</span>
                  <span className="ml-2 text-gray-800">{owner.ownerAddress}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 text-sm mb-4">
                <div>
                  <span className=" text-gray-600 font-bold">Birth Date:</span>
                  <span className="ml-2 text-gray-800">{owner.ownerBirthDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Financial Information */}
        <div 
          className="bg-white rounded-lg  p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200" 
          onClick={() => onStepClick?.(6)}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            Financial Information
            <span className="ml-2 text-xs text-blue-600 font-normal">(Click to edit)</span>
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className=" text-gray-600 font-bold">Single Entity:</span>
              <span className="ml-2 text-gray-800">{financesInfo.singleEntity ? 'Yes' : 'No'}</span>
            </div>
            <div>
              <span className=" text-gray-600 font-bold">Has Business Debt:</span>
              <span className="ml-2 text-gray-800">{financesInfo.hasBusinessDebt ? 'Yes' : 'No'}</span>
            </div>
            <div>
              <span className=" text-gray-600 font-bold">Has Tax Liens:</span>
              <span className="ml-2 text-gray-800">{financesInfo.hasTaxLiens ? 'Yes' : 'No'}</span>
            </div>
            <div>
              <span className=" text-gray-600 font-bold">Has Overdue Liabilities:</span>
              <span className="ml-2 text-gray-800">{financesInfo.hasOverdueLiabilities ? 'Yes' : 'No'}</span>
            </div>
         
           
          
            <div>
                <span className=" text-gray-600 font-bold">Has Bankruptcy:</span>
              <span className="ml-2 text-gray-800">{financesInfo.hasBankruptcy ? 'Yes' : 'No'}</span>
            </div>
            <div>
              <span className=" text-gray-600 font-bold">Ownership Changed:</span>
              <span className="ml-2 text-gray-800">{financesInfo.ownershipChanged ? 'Yes' : 'No'}</span>
            </div>
          
            {financesInfo.debts.length > 0 && (
              <div className="col-span-2">
                <span className=" text-gray-600 font-bold">Debts:</span>
                <div className="ml-2 text-gray-800">
                  {financesInfo.debts.map((debt, index) => (
                    <div key={index} className="mb-1">
                      {debt.type}: {formatCurrency(parseFloat(debt.balance) || 0)}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {financesInfo.industryReferences && (
              <div className="col-span-2">
                <span className=" text-gray-600 font-bold">Industry References:</span>
                <span className="ml-2 text-gray-800">{financesInfo.industryReferences}</span>
              </div>
            )}
            {financesInfo.additionalComments && (
              <div className="col-span-2">
                <span className=" text-gray-600 font-bold">Additional Comments:</span>
                <span className="ml-2 text-gray-800">{financesInfo.additionalComments}</span>
              </div>
            )}
          </div>
        </div>

        {/* Due Diligence Files Summary */}
        <div className="bg-white rounded-lg  p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Due Diligence Files</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className=" text-gray-600 font-bold">Ticketing Company Report:</span>
              <div className="flex items-center">
                <span className="text-sm text-gray-800 mr-2">
                  {diligenceInfo.ticketingCompanyReport.fileInfos.length} file(s)
                </span>
                <button 
                  onClick={() => onStepClick?.(7)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className=" text-gray-600 font-bold">Ticketing Service Agreement:</span>
              <div className="flex items-center">
                <span className="text-sm text-gray-800 mr-2">
                  {diligenceInfo.ticketingServiceAgreement.fileInfos.length} file(s)
                </span>
                <button 
                  onClick={() => onStepClick?.(7)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className=" text-gray-600 font-bold">Financial Statements:</span>
              <div className="flex items-center">
                <span className="text-sm text-gray-800 mr-2">
                  {diligenceInfo.financialStatements.fileInfos.length} file(s)
                </span>
                <button 
                  onClick={() => onStepClick?.(8)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className=" text-gray-600 font-bold">Bank Statement:</span>
              <div className="flex items-center">
                <span className="text-sm text-gray-800 mr-2">
                  {diligenceInfo.bankStatement.fileInfos.length} file(s)
                </span>
                <button 
                  onClick={() => onStepClick?.(8)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className=" text-gray-600 font-bold">Incorporation Certificate:</span>
              <div className="flex items-center">
                <span className="text-sm text-gray-800 mr-2">
                  {diligenceInfo.incorporationCertificate.fileInfos.length} file(s)
                </span>
                <button 
                  onClick={() => onStepClick?.(9)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
                  <span className=" text-gray-600 font-bold">Legal Entity Chart:</span>
              <div className="flex items-center">
                <span className="text-sm text-gray-800 mr-2">
                  {diligenceInfo.legalEntityChart.fileInfos.length} file(s)
                </span>
                <button 
                  onClick={() => onStepClick?.(9)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className=" text-gray-600 font-bold">Government ID:</span>
              <div className="flex items-center">
                <span className="text-sm text-gray-800 mr-2">
                  {diligenceInfo.governmentId.fileInfos.length} file(s)
                </span>
                <button 
                  onClick={() => onStepClick?.(9)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className=" text-gray-600 font-bold">W9 Form:</span>
              <div className="flex items-center">
                <span className="text-sm text-gray-800 mr-2">
                  {diligenceInfo.w9form.fileInfos.length} file(s)
                </span>
                <button 
                  onClick={() => onStepClick?.(9)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Edit
                </button>
              </div>
            </div>
    
            <div className="flex items-center justify-between">
              <span className=" text-gray-600 font-bold">Other Documents:</span>
              <div className="flex items-center">
                <span className="text-sm text-gray-800 mr-2">
                  {diligenceInfo.other.fileInfos.length} file(s)
                </span>
                <button 
                  onClick={() => onStepClick?.(10)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
       
      </div> 

     
    </div>
  );
};

export default SummaryStep; 