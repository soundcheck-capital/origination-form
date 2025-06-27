import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateDiligenceInfo } from '../store/form/formSlice';
import StepTitle from './customComponents/StepTitle';

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
        <div className=" flex flex-col  w-full mb-8">
          <p className="upload-description text-sm font-300 text-gray-700 mb-2">
            Certificate of Incorporation of contracting entity
          </p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange('incorporationCertificate')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className=" flex flex-col  w-full mb-8">
          <p className="upload-description text-sm font-300 text-gray-700 mb-2">
            Legal entity chart if more than one entity exists OR there have been distributions to other entities in the past
          </p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange('legalEntityChart')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className=" flex flex-col  w-full mb-8">
          <p className="upload-description text-sm font-300 text-gray-700 mb-2">
            Scanned copy of government issued ID of the signatory of the Agreement with SoundCheck
          </p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange('governmentId')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className=" flex flex-col  w-full mb-8">
          <p className="upload-description text-sm font-300 text-gray-700 mb-2">
            Completed Form W-9
          </p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange('einAuthentication')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default LegalInformationStep; 