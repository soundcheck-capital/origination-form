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
    <div className="flex flex-col items-center justify-center w-full pt-8 animate-fade-in-right duration-1000">
      <StepTitle title="Contractual and Legal Information" />

      <div className="w-full lg:w-[30%] mx-auto">  
        <FileUploadField
          field="incorporationCertificate"
          title="Certificate of Incorporation of contracting entity"
          accept=".xlsx,.pdf,.csv,.jpg,.png"
          multiple={false}
          onFilesChange={(fileInfos) => handleFilesChange('incorporationCertificate', fileInfos)}
        />

        <FileUploadField
          field="legalEntityChart"
          title="Legal entity chart if more than one entity exists OR there have been distributions to other entities in the past"
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
          description="Venue/Movie Theater/Performing Arts Center: copy of the lease or property deed <br>
          Promoter: copy of the venue/rental agreement <br>
          Outdoor event: copy of the event cancellation insurance <br>
          Other: business plan, budget, insurance certificate, bank letter, investor deck, etc."
          accept=".xlsx,.pdf,.csv,.jpg,.png"
          multiple={false}
          onFilesChange={(fileInfos) => handleFilesChange('other', fileInfos)}
        />
      </div>
    </div>
  );
};

export default LegalInformationStep; 