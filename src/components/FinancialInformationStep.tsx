import React from 'react';

import StepTitle from './customComponents/StepTitle';
import FileUploadField from './customComponents/FileUploadField';

const FinancialInformationStep: React.FC = () => {


  const handleFilesChange = (field: string, fileInfos: any[]) => {
    // This will be called when files are added/removed
    // The actual files are managed by the FileUploadField component
  };

  return (
    <div className="flex flex-col items-center justify-center w-full pt-8 animate-fade-in-right duration-1000">
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
    </div>
  );
};

export default FinancialInformationStep; 