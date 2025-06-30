import React from 'react';
import { useDiligenceFiles } from '../contexts/DiligenceFilesContext';
import StepTitle from './customComponents/StepTitle';
import FileUploadField from './customComponents/FileUploadField';

const LegalInformationStep: React.FC = () => {
  const { addFiles } = useDiligenceFiles();

  const handleFilesChange = (field: string, fileInfos: any[]) => {
    // This will be called when files are added/removed
    // The actual files are managed by the FileUploadField component
  };

  return (
    <div className="flex flex-col items-center justify-center w-full pt-10">
      <StepTitle title="Contractual and Legal Information" />
      
      <div className="w-full md:w-[40%] mb-8">
        <FileUploadField
          field="incorporationCertificate"
          description="Certificate of Incorporation of contracting entity"
          accept=".pdf"
          multiple={false}
          onFilesChange={(fileInfos) => handleFilesChange('incorporationCertificate', fileInfos)}
        />

        <FileUploadField
          field="legalEntityChart"
          description="Legal entity chart if more than one entity exists OR there have been distributions to other entities in the past"
          accept=".pdf"
          multiple={false}
          onFilesChange={(fileInfos) => handleFilesChange('legalEntityChart', fileInfos)}
        />

        <FileUploadField
          field="governmentId"
          description="Scanned copy of government issued ID of the signatory of the Agreement with SoundCheck"
          accept=".pdf"
          multiple={false}
          onFilesChange={(fileInfos) => handleFilesChange('governmentId', fileInfos)}
        />

        <FileUploadField
          field="einAuthentication"
          description="Completed Form W-9"
          accept=".pdf"
          multiple={false}
          onFilesChange={(fileInfos) => handleFilesChange('einAuthentication', fileInfos)}
        />
      </div>
    </div>
  );
};

export default LegalInformationStep; 