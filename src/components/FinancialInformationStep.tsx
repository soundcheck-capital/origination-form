import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateDiligenceInfo } from '../store/form/formSlice';
import StepTitle from './customComponents/StepTitle';
import FileUploadField from './customComponents/FileUploadField';

const FinancialInformationStep: React.FC = () => {
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
      <StepTitle title="Financial Information" />
      
      <div className="w-[40%] mb-8">
        <FileUploadField
          field="financialStatements"
          description="Last 2 years and YTD detailed financial statements (P&L, B/S, Cash Flow) per month"
          accept=".pdf"
          multiple={true}
        />

        <FileUploadField
          field="bankStatement"
          description="Last 6 months of bank statements"
          accept=".pdf"
          multiple={true}
        />
      </div>
    </div>
  );
};

export default FinancialInformationStep; 