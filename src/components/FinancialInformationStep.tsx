import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateDiligenceInfo } from '../store/form/formSlice';
import StepTitle from './customComponents/StepTitle';

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
        <div className=" flex flex-col  w-full mb-8">
          <p className="upload-description text-sm font-300 text-gray-700 mb-2">
            Last 2 years and YTD detailed financial statements (P&L, B/S, Cash Flow) per month
          </p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange('financialStatements')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className=" flex flex-col  w-full mb-8">
          <p className="upload-description text-sm font-300 text-gray-700 mb-2">
            Last 6 months of bank statements
          </p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange('bankStatement')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialInformationStep; 