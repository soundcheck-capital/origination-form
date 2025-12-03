import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateFinancesInfo } from '../../store/form/formSlice';
import StepTitle from '../customComponents/StepTitle';
import FileUploadField from '../customComponents/FileUploadField';
import TextAreaField from '../customComponents/TextAreaField';
import { useFormValidation } from '../../hooks/useFormValidation';

const AllUploadsStep: React.FC = () => {
  const dispatch = useDispatch();
  const ticketingInfo = useSelector((state: RootState) => state.form.formData.ticketingInfo);
  const financesInfo = useSelector((state: RootState) => state.form.formData.financesInfo);
  const { validateAdditionalInfo } = useFormValidation();
  const { errors } = validateAdditionalInfo();
  
  const handleFilesChange = (field: string, fileInfos: any[]) => {
    // This will be called when files are added/removed
    // The actual files are managed by the FileUploadField component
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(updateFinancesInfo({ [name]: value }));
  };

  return (
    <div className="flex flex-col justify-center w-full pt-8 animate-fade-in-right duration-1000">
      {/* Ticketing Information Section - Exact copy from TicketingInformationStep */}
      <StepTitle title="Ticketing Information" />
      
      <div className="w-full">  
        <FileUploadField
          field="ticketingCompanyReport"
          title="Reports from ticketing company (last 3 years)"
          description="Not just Excel summary, including # events, $ gross ticket sales, # tickets sold per month"
          accept=".xlsx,.pdf,.csv,.jpg,.png"
          multiple={true}
          onFilesChange={(fileInfos) => handleFilesChange('ticketingCompanyReport', fileInfos)}
          required={true}
        />

        <FileUploadField
          field="ticketingServiceAgreement"
          title="Copy of Ticketing Service Agreement"
          accept=".xlsx,.pdf,.csv,.jpg,.png"
          multiple={false}
          onFilesChange={(fileInfos) => handleFilesChange('ticketingServiceAgreement', fileInfos)}
          required={ticketingInfo.paymentProcessing === 'Venue' ? true : false}
        />

      </div>

      {/* Financial Information Section - Exact copy from FinancialInformationStep */}
      <StepTitle title="Financial Information" />
      
      <div className="w-full">  
        <FileUploadField
          field="financialStatements"
          title="Last 2 years and YTD detailed financial statements (P&L, B/S) per month"
          accept=".xlsx,.pdf,.csv,.jpg,.png"
          multiple={true}
          onFilesChange={(fileInfos) => handleFilesChange('financialStatements', fileInfos)}
          required={true}
        />

        <FileUploadField
          field="bankStatement"
          title="Last 6 months of bank statements"
          accept=".xlsx,.pdf,.csv,.jpg,.png"
          multiple={true}
          onFilesChange={(fileInfos) => handleFilesChange('bankStatement', fileInfos)}
        />
      </div>

      {/* Legal Information Section - Exact copy from LegalInformationStep */}
      <StepTitle title="Contractual and Legal Information" />

      <div className="w-full">  
        <FileUploadField
          field="incorporationCertificate"
          title="Certificate of Incorporation of contracting entity"
          accept=".xlsx,.pdf,.csv,.jpg,.png"
          multiple={false}
          onFilesChange={(fileInfos) => handleFilesChange('incorporationCertificate', fileInfos)} 
          required={true}
        />

        <FileUploadField
          field="legalEntityChart"
          title="Legal entity chart if more than one entity exists OR if there have been distributions to other entities in the past"
          accept=".xlsx,.pdf,.csv,.jpg,.png"
          multiple={false}
          onFilesChange={(fileInfos) => handleFilesChange('legalEntityChart', fileInfos)}
        />

        <FileUploadField
          field="governmentId"
          title="Scanned copy of government issued ID of the signatory of the Agreement with SoundCheck"
          accept=".xlsx,.pdf,.csv,.jpg,.png"
          multiple={false}
          onFilesChange={(fileInfos) => handleFilesChange('governmentId', fileInfos)}
        />

        <FileUploadField
          field="w9form"
          title="Completed Form W-9"
          accept=".xlsx,.pdf,.csv,.jpg,.png"
          multiple={false}
          onFilesChange={(fileInfos) => handleFilesChange('w9form', fileInfos)}
        />

        <FileUploadField
          field="other"
          title="Other"
          description="Copy of the lease, rental agreement or property deed of the location where the event(s) take place <br>
          Outdoor event: copy of the event cancellation insurance <br>
          Other: business plan, budget, insurance certificate, bank letter, investor deck, etc"
          accept=".xlsx,.pdf,.csv,.jpg,.png"
          multiple={true}
          onFilesChange={(fileInfos) => handleFilesChange('other', fileInfos)}
        />
      </div>

      {/* Additional Information Section - Exact copy from OtherStep */}
      <div className="w-full mb-8 animate-fade-in-right duration-1000">  
        <StepTitle title="Additional Information" />
        
      

        <TextAreaField
          label="Industry References"
          name="industryReferences"
          value={financesInfo.industryReferences}
          onChange={handleChange}
          placeholder="Please provide name/contact of industry references (promoters, venues, agents, vendors, partners) we can reach out to"
          rows={4}
          required={true}
          error={errors.industryReferences}
        />

        <TextAreaField
          label="Additional Comments"
          name="additionalComments"
          value={financesInfo.additionalComments}
          onChange={handleChange}
          placeholder="Any additional comments or information you'd like to share"
          rows={4}
          required={true}
          error={errors.additionalComments}
        />
      </div>
    </div>
  );
};

export default AllUploadsStep;