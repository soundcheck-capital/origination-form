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
    <div className="flex flex-col items-center justify-center w-full pt-8 animate-fade-in-right duration-1000">
      <StepTitle title="Ticketing Information" />
      
      <div className="w-full lg:w-[30%] mx-auto">  
        <FileUploadField
          field="ticketingCompanyReport"
          title="Reports from ticketing company (last 3 years)"
          description="Not just Excel summary, including # events, $ gross ticket sales, # tickets sold per month"
          accept=".xlsx,.pdf,.csv,.jpg,.png"
          multiple={true}
          onFilesChange={(fileInfos) => handleFilesChange('ticketingCompanyReport', fileInfos)}
        />

        <FileUploadField
          field="ticketingServiceAgreement"
          title="Copy of Ticketing Service Agreement"
          accept=".xlsx,.pdf,.csv,.jpg,.png"
          multiple={false}
          onFilesChange={(fileInfos) => handleFilesChange('ticketingServiceAgreement', fileInfos)}
        />
      </div>
    </div>
  );
};

export default TicketingInformationStep; 