import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateDiligenceInfo } from '../store/form/formSlice';
import StepTitle from './customComponents/StepTitle';
import FileUploadField from './customComponents/FileUploadField';

const TicketingInformationStep: React.FC = () => {
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
      <StepTitle title="Ticketing Information" />
      
      <div className="w-[40%] mb-8">
        <FileUploadField
          field="ticketingCompanyReport"
          description="Reports from ticketing company (last 3 years), not just Excel summary, including # events, $ gross ticket sales, # tickets sold per month"
          accept=".xlsx,.pdf,.csv,.jpg,.png"
          multiple={true}
        />

        <FileUploadField
          field="ticketingServiceAgreement"
          description="Copy of Ticketing Service Agreement"
          accept=".pdf"
          multiple={false}
        />
      </div>
    </div>
  );
};

export default TicketingInformationStep; 