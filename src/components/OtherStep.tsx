import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateDiligenceInfo } from '../store/form/formSlice';
import StepTitle from './customComponents/StepTitle';
import TextAreaField from './customComponents/TextAreaField';

const OtherStep: React.FC = () => {
  const dispatch = useDispatch();
  const financesInfo = useSelector((state: RootState) => state.form.financesInfo);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(updateDiligenceInfo({ [name]: value }));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <StepTitle title="Additional Information" />
      
      <p className="text-gray-400 mb-8 text-xs w-full md:w-[30%] text-justify">
        Please provide any additional information that might be helpful for our review process.
      </p>

      <TextAreaField
        label="Industry References"
        name="industryReferences"
        value={financesInfo.industryReferences}
        onChange={handleChange}
        placeholder="Please provide name/contact of industry references (promoters, venues, agents, vendors, partners) we can reach out to"
        rows={8}
      />

      <TextAreaField
        label="Additional Comments"
        name="additionalComments"
        value={financesInfo.additionalComments}
        onChange={handleChange}
        placeholder="Any additional comments or information you'd like to share"
        rows={8}
      />
    </div>
  );
};

export default OtherStep;