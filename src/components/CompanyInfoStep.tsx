import React  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateCompanyInfo, updatePersonalInfo } from '../store/form/formSlice';
import StepTitle from './customComponents/StepTitle';
import TextField from './customComponents/TextField';
import DropdownField from './customComponents/DropdownField';
import { useValidation } from '../contexts/ValidationContext';
import { clientType, yearsInBusiness, memberOf } from '../store/form/hubspotLists';

// Google Maps Autocomplete types
declare global {
  interface Window {
    google: any;
  }
}



const CompanyInfoStep: React.FC = () => {
  const dispatch = useDispatch();
  const companyInfo = useSelector((state: RootState) => state.form.formData.companyInfo);
  const personalInfo = useSelector((state: RootState) => state.form.formData.personalInfo);
  const { setFieldError } = useValidation();
 

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if(name === "name"){
      dispatch(updateCompanyInfo({ name: value, dba: value  }));
      setFieldError('name', null);
    } else if (name === "role"){
      dispatch(updatePersonalInfo({ personalInfo: { ...personalInfo, role: value } }));
      setFieldError( name, null);
    } else {
      dispatch(updateCompanyInfo({ [name]: value }));
      setFieldError(name, null);
    }
  };





  return (
    <div className="flex flex-col items-center justify-center w-full animate-fade-in-right duration-1000">
      <StepTitle title="Company Information" />

      <TextField type="text" label="Company Name" name="name" value={companyInfo.name} onChange={handleChange} error='' onBlur={()=>{}} required />
      <TextField type="text" label="Your Role" name="role" value={personalInfo.role} onChange={handleChange} error='' onBlur={()=>{}} required />

      <DropdownField label="Company Type" name="clientType" value={companyInfo.clientType} onChange={handleChange} error='' onBlur={()=>{}} options={clientType} required />

      <DropdownField label="Years in Business" name="yearsInBusiness" value={companyInfo.yearsInBusiness} onChange={handleChange} error='' onBlur={()=>{}} options={yearsInBusiness} required />

      <TextField type="text" label="Website - Socials" name="socials" value={companyInfo.socials} onChange={handleChange} error='' onBlur={()=>{}} required />
      <DropdownField label="Are you a member of?" name="memberOf" value={companyInfo.memberOf} onChange={handleChange} error='' onBlur={()=>{}} options={memberOf} required />
   </div>
  );
};

export default CompanyInfoStep;
