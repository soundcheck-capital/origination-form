import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateDiligenceInfo } from '../store/form/formSlice';
import StepTitle from './customComponents/StepTitle';
import FileUploadField from './customComponents/FileUploadField';

const LegalInformationStep: React.FC = () => {
  const dispatch = useDispatch();
  const diligenceInfo = useSelector((state: RootState) => state.form.diligenceInfo);

  const handleFileChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      dispatch(updateDiligenceInfo({ [field]: Array.from(files) }));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full pt-10">
      <StepTitle title="Contractual and Legal Information" />
      
      <div className="w-[40%] mb-8">
        <FileUploadField
          field="incorporationCertificate"
          description="Certificate of Incorporation of contracting entity"
          accept=".pdf"
          multiple={false}
        />

        <FileUploadField
          field="legalEntityChart"
          description="Legal entity chart if more than one entity exists OR there have been distributions to other entities in the past"
          accept=".pdf"
          multiple={false}
        />

        <FileUploadField
          field="governmentId"
          description="Scanned copy of government issued ID of the signatory of the Agreement with SoundCheck"
          accept=".pdf"
          multiple={false}
        />

        <FileUploadField
          field="einAuthentication"
          description="Completed Form W-9"
          accept=".pdf"
          multiple={false}
        />
      </div>
    </div>
  );
};

export default LegalInformationStep; 