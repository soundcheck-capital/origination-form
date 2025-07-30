import React  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateCompanyInfo } from '../store/form/formSlice';
import StepTitle from './customComponents/StepTitle';
import TextField from './customComponents/TextField';
import DropdownField from './customComponents/DropdownField';
import { useValidation } from '../contexts/ValidationContext';

// Google Maps Autocomplete types
declare global {
  interface Window {
    google: any;
  }
}

const companyTypes = [
  'Promoter',
  'Venue',
  'Festival',
  'Performing Arts Center',
  'Theatre',
  'Movie Theatre',
  'Sports Team',
  'Museum',
  'Attraction',
  'Other'
];

const yearsInBusiness = [
  'Less than 1 year',
  '1-2 years',
  '2-5 years',
  '5-10 years',
  'More than 10 years',
];

const memberships = [
  'NIVA (National Independent Venue Association)',
  'Promotores Unidos',
  'NATO (National Association of Theater Owners)',
  'Other'
];

const CompanyInfoStep: React.FC = () => {
  const dispatch = useDispatch();
  const companyInfo = useSelector((state: RootState) => state.form.formData.companyInfo);
  const { setFieldError } = useValidation();
 

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if(name === "name"){
      dispatch(updateCompanyInfo({ name: value, dba: value  }));
      setFieldError('name', null);
    } else {
      dispatch(updateCompanyInfo({ [name]: value }));
      setFieldError(name, null);
    }
  };





  return (
    <div className="flex flex-col items-center justify-center w-full animate-fade-in-right duration-1000">
      <StepTitle title="Company Information" />

      <TextField type="text" label="Company Name" name="name" value={companyInfo.name} onChange={handleChange} error='' onBlur={()=>{}} required />
      <TextField type="text" label="Your Role" name="role" value={companyInfo.role} onChange={handleChange} error='' onBlur={()=>{}} required />

      <DropdownField label="Company Type" name="companyType" value={companyInfo.companyType} onChange={handleChange} error='' onBlur={()=>{}} options={companyTypes} required />

      <DropdownField label="Years in Business" name="yearsInBusiness" value={companyInfo.yearsInBusiness} onChange={handleChange} error='' onBlur={()=>{}} options={yearsInBusiness} required />

      <TextField type="number" label="Number of Employees" name="employees" value={companyInfo.employees.toString()} onChange={handleChange} error='' onBlur={()=>{}} required />
      <TextField type="text" label="Website - Socials" name="socials" value={companyInfo.socials} onChange={handleChange} error='' onBlur={()=>{}} required />
      <DropdownField label="Are you a member of?" name="membership" value={companyInfo.membership} onChange={handleChange} error='' onBlur={()=>{}} options={memberships} required />
   </div>
  );
};

export default CompanyInfoStep;
