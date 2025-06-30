import React from 'react';
import { useDiligenceFiles } from '../contexts/DiligenceFilesContext';
import StepTitle from './customComponents/StepTitle';
import FileUploadField from './customComponents/FileUploadField';

const TicketingInformationStep: React.FC = () => {
  const { addFiles } = useDiligenceFiles();

  const handleFilesChange = (field: string, fileInfos: any[]) => {
    // This will be called when files are added/removed
    // The actual files are managed by the FileUploadField component
  };

  return (
    <div className="flex flex-col items-center justify-center w-full pt-10">
      <StepTitle title="Ticketing Information" />
      
      <div className="w-full md:w-[40%] mb-8">
        <FileUploadField
          field="ticketingCompanyReport"
          description="Reports from ticketing company (last 3 years), not just Excel summary, including # events, $ gross ticket sales, # tickets sold per month"
          accept=".xlsx,.pdf,.csv,.jpg,.png"
          multiple={true}
          onFilesChange={(fileInfos) => handleFilesChange('ticketingCompanyReport', fileInfos)}
        />

        <FileUploadField
          field="ticketingServiceAgreement"
          description="Copy of Ticketing Service Agreement"
          accept=".xlsx,.pdf,.csv,.jpg,.png"
          multiple={false}
          onFilesChange={(fileInfos) => handleFilesChange('ticketingServiceAgreement', fileInfos)}
        />
      </div>
    </div>
  );
};

export default TicketingInformationStep; 