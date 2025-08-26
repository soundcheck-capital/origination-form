import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateFinancesInfo } from '../store/form/formSlice';
import StepTitle from './customComponents/StepTitle';
import TextAreaField from './customComponents/TextAreaField';
import { useFormValidation } from '../hooks/useFormValidation';
const OtherStep: React.FC = () => {
  const dispatch = useDispatch();
  const financesInfo = useSelector((state: RootState) => state.form.formData.financesInfo);
  const { validateAdditionalInfo } = useFormValidation();
  const { errors } = validateAdditionalInfo();
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(updateFinancesInfo({ [name]: value }));
  };

  return (
      <div className="w-full mb-8 animate-fade-in-right duration-1000">  
      <StepTitle title="Additional Information" />
      
      <p className="text-gray-400 mb-8 text-xs w-full text-center mx-auto items-center">
        Please provide any additional information that might be helpful for our review process.
      </p>

      <TextAreaField
        label="Industry References"
        name="industryReferences"
        value={financesInfo.industryReferences}
        onChange={handleChange}
        placeholder="Please provide name/contact of industry references (promoters, venues, agents, vendors, partners) we can reach out to"
        rows={4}
        required={true}
        error={errors.industryReferences}
      />

      <TextAreaField
        label="Additional Comments"
        name="additionalComments"
        value={financesInfo.additionalComments}
        onChange={handleChange}
        placeholder="Any additional comments or information you'd like to share"
        rows={4}
        required={true}
        error={errors.additionalComments}
      />
    </div>
  );
};

export default OtherStep;