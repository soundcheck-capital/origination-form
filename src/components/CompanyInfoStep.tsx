import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateCompanyInfo, updateOwnershipInfo, updateTicketingInfo } from '../store/form/formSlice';
import StepTitle from './customComponents/StepTitle';
import TextField from './customComponents/TextField';
import DropdownField from './customComponents/DropdownField';
import { AddressAutocomplete } from './customComponents/AddressAutocomplete';
import { usStates } from '../utils/usStates'; // Import the usStates array

// Google Maps Autocomplete types
declare global {
  interface Window {
    google: any;
  }
}

const businessTypes = [
  'Sole proprietorship',
  'Partnership',
  'Limited liability company (LLC)',
  'Corporation'
];

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
  const ticketingInfo = useSelector((state: RootState) => state.form.formData.ticketingInfo);
  

 
  const handleTicketingInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

      dispatch(updateTicketingInfo({ [name]: value }));
    
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if(name === "legalEntityName"){
      dispatch(updateCompanyInfo({ name: value, dba: value  }));
    } else {
      dispatch(updateCompanyInfo({ [name]: value }));
    }
  };



  const [ein, setEin] = useState(companyInfo.ein);

  const handleChangeEIN = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatEIN(e.target.value);
    setEin(formatted);
    dispatch(updateCompanyInfo({ ein: formatted }));
  };

  const formatEIN = (value: string): string => {
    // Supprime tout ce qui n'est pas chiffre
    const digitsOnly = value.replace(/\D/g, '');

    // Tronque à 9 chiffres max
    const truncated = digitsOnly.slice(0, 9);

    // Formate en XX-XXXXXXX
    if (truncated.length <= 2) {
      return truncated;
    } else if (truncated.length <= 9) {
      return `${truncated.slice(0, 2)}-${truncated.slice(2)}`;
    }

    return truncated;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <StepTitle title="Company Information" />

      <TextField type="text" label="Legal Entity Name" name="legalEntityName" value={companyInfo.name} onChange={handleChange} error='' onBlur={()=>{}}  />
      <TextField type="text" label="DBA" name="dba" value={companyInfo.dba} onChange={handleChange} error='' onBlur={()=>{}}  />

      <DropdownField label="Client Type" name="clientType" value={companyInfo.clientType} onChange={handleChange} error='' onBlur={()=>{}} options={companyTypes} />
      <DropdownField label="Legal Entity Type" name="legalEntityType" value={companyInfo.legalEntityType} onChange={handleChange} error='' onBlur={()=>{}} options={businessTypes} />
      <DropdownField label="Years in Business" name="yearsInBusiness" value={companyInfo.yearsInBusiness} onChange={handleChange} error='' onBlur={()=>{}} options={yearsInBusiness} />
      <TextField type="number" label="Number of Employees" name="employees" value={companyInfo.employees.toString()} onChange={handleChange} error='' onBlur={()=>{}}  />
      <TextField type="text" label="Website - Socials" name="socials" value={companyInfo.socials} onChange={handleChange} error='' onBlur={()=>{}}  />
      <DropdownField label="Are you a member of?" name="membership" value={ticketingInfo.membership} onChange={handleTicketingInfoChange} error='' onBlur={()=>{}} options={memberships} />
      <DropdownField label="State of Incorporation" name="stateOfIncorporation" value={companyInfo.stateOfIncorporation} onChange={handleChange} error='' onBlur={()=>{}} options={usStates} />

     
      <AddressAutocomplete
        label="Address"
        name="companyAddress"
        value={companyInfo.companyAddress}
        onChange={handleChange}
        error=''
        onBlur={()=>{}}
        type="text"
        id="companyAddress"
      />
      {/*  <TextField type="text" label="Legal Entity ZIP code" name="companyZipCode" value={companyInfo.companyZipCode} onChange={handleChange} error='' onBlur={()=>{}}  />
      <TextField type="text" label="Legal Entity City" name="companyCity" value={companyInfo.companyCity} onChange={handleChange} error='' onBlur={()=>{}}  />
      <TextField type="text" label="Legal Entity State" name="companyState" value={companyInfo.companyState} onChange={handleChange} error='' onBlur={()=>{}}  /> */}
      
    <TextField type="text" label="Tax ID (EIN)" name="ein" value={ein} onChange={handleChangeEIN} error='' onBlur={()=>{}}  />
    </div>
  );
};

export default CompanyInfoStep;
