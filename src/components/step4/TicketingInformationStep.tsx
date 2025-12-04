import React from 'react';
import StepTitle from '../customComponents/StepTitle';
import FileUploadField from '../customComponents/FileUploadField';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const TicketingInformationStep: React.FC = () => {
  const ticketingInfo = useSelector((state: RootState) => state.form.formData.ticketingInfo);
  const handleFilesChange = (field: string, fileInfos: any[]) => {
    // This will be called when files are added/removed
    // The actual files are managed by the FileUploadField component
  };

  return (
    <div className="flex flex-col w-full animate-fade-in-right duration-1000">
      <StepTitle title="Ticketing" />
      
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
    </div>
  );
};

export default TicketingInformationStep; 