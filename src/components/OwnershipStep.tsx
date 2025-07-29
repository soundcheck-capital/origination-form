import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateCompanyInfo, updateOwnershipInfo } from '../store/form/formSlice';
import StepTitle from './customComponents/StepTitle';
import TextField from './customComponents/TextField';
import { AddressAutocomplete } from './customComponents/AddressAutocomplete';
import NumberInput from './customComponents/NumberField';
import DatePickerField from './customComponents/DatePickerField';
import DropdownField from './customComponents/DropdownField';
import { useValidation } from '../contexts/ValidationContext';

interface Owner {
  id: string;
  ownerName: string;
  ownershipPercentage: string;
  sameAddress: boolean;
  ownerAddress: string;
  ownerBirthDate: string;
}

const usStates = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const businessTypes = [
  'Limited Liability Company (LLC)', 'Partnership', 'Corporation', 'Sole Proprietorship',
];

const OwnershipStep: React.FC = () => {
  const dispatch = useDispatch();
  const ownershipInfo = useSelector((state: RootState) => state.form.formData.ownershipInfo);
  const companyInfo = useSelector((state: RootState) => state.form.formData.companyInfo);
  const { setFieldError } = useValidation();
  useEffect(() => {
    if (!ownershipInfo.owners || ownershipInfo.owners.length === 0) {
      addOwner();
    }
  }, [ownershipInfo.owners]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "legalEntityName") {
      dispatch(updateCompanyInfo({ name: value, dba: value }));
    } else {
      dispatch(updateCompanyInfo({ [name]: value }));
    }
    setFieldError(name, null);
  };

  const updateCompanyAddress = (address: string) => {
    dispatch(updateCompanyInfo({ companyAddress: address }));
  };

  const [ein, setEin] = useState(companyInfo.ein);

  const handleChangeEIN = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatEIN(e.target.value);
    setEin(formatted);
    dispatch(updateCompanyInfo({ ein: formatted }));
    setFieldError('ein', null);
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
  const handleOwnerChange = useCallback((
    id: string,
    field: keyof Owner,
    value: string | boolean
  ) => {
    const updatedOwners = ownershipInfo.owners.map(o => {
      if (o.id !== id) return o;
      const newValue = (field === 'ownershipPercentage' && Number(value) > 100)
        ? '100'
        : value;
      return { ...o, [field]: newValue };
    });

    
    dispatch(updateOwnershipInfo({ owners: updatedOwners }));
  }, [dispatch, ownershipInfo.owners]);

  const addOwner = () => {
    const newOwner: Owner = {
      id: crypto.randomUUID(),
      ownerName: '', ownershipPercentage: '', 
      sameAddress: false,
       ownerAddress: '', 
       ownerBirthDate: ''
    };
    dispatch(updateOwnershipInfo({
      owners: [...ownershipInfo.owners, newOwner]
    }));
  };

  const removeOwner = (id: string) => {
    if (ownershipInfo.owners.length > 1) {
      dispatch(updateOwnershipInfo({
        owners: ownershipInfo.owners.filter(o => o.id !== id)
      }));
      // reset validation errors…
      setFieldError(`owner${ownershipInfo.owners.length - 1}Name`, null);
      setFieldError(`owner${ownershipInfo.owners.length - 1}Percentage`, null);
      setFieldError(`owner${ownershipInfo.owners.length - 1}Address`, null);
      setFieldError(`owner${ownershipInfo.owners.length - 1}BirthDate`, null);
    }
  };


  



  return (

    <div className="flex flex-col items-center justify-center w-full animate-fade-in-right duration-1000">
      <p className="text-gray-400 mb-8 text-xs mt-8 text-center">Please carefully complete the information below and make sure that it is accurate including information about the control person and all beneficial owner(s) owning more than 20% of the company. If this information is inaccurate or incomplete, this could result in delay or denial of your application.</p>

      <StepTitle title="Business Legal Information" />
      <TextField type="text" label="Legal Business Name" name="legalEntityName" value={companyInfo.name} onChange={handleChange} error='' onBlur={() => { }} required />
      <TextField type="text" label="DBA" name="dba" value={companyInfo.dba} onChange={handleChange} error='' onBlur={() => { }} required />
      <DropdownField label="Business Type" name="legalEntityType" value={companyInfo.legalEntityType} onChange={handleChange} error='' onBlur={() => { }} options={businessTypes} required />

      <DropdownField label="State of Incorporation" name="stateOfIncorporation" value={companyInfo.stateOfIncorporation} onChange={handleChange} error='' onBlur={() => { }} options={usStates} required />


      <AddressAutocomplete
        label="Address"
        name="companyAddress"
        value={companyInfo.companyAddress}
        onChange={handleChange}
        onSelect={(address: string) => updateCompanyAddress(address)}
        error=''
        onBlur={() => { }}
        type="text"
        id="companyAddress"
      />

      <TextField type="text" label="Tax ID (EIN)" name="ein" value={ein} onChange={handleChangeEIN} error='' onBlur={() => { }} required />

      <StepTitle title="Beneficial ownership & control person" />


      {ownershipInfo.owners.map((owner) => (
        <div key={owner.id} className="flex flex-col bg-white w-full">
          <div className="flex flex-row justify-between w-full">
            <p className='block text-sm font-medium text-gray-700  '>Owner {ownershipInfo.owners.indexOf(owner) + 1}</p>
            {ownershipInfo.owners.length > 1 && (
              <button
                className="text-sm text-red-500 hover:text-red-500 focus:outline-none font-bold text-end "
                onClick={() => removeOwner(owner.id)}
                type="button"
              >
                Delete owner
              </button>
            )}
          </div>


          <div className="flex flex-row justify-between w-full gap-x-4 mt-8">
            <TextField type="text" label="Owner Name" name="ownerName" value={owner.ownerName} onChange={(e) => handleOwnerChange(owner.id, 'ownerName', e.target.value)} error='' onBlur={() => { }} required />

            <NumberInput showPercent={true} label="Ownership Percentage" name="ownershipPercentage" value={owner.ownershipPercentage} onChange={(e) => handleOwnerChange(owner.id, 'ownershipPercentage', e)} required />
          </div>
          <div className="flex flex-row justify-between  gap-x-4 ">
            <AddressAutocomplete label="Address" name="ownerAddress" value={owner.ownerAddress}
              onSelect={(address: string) => handleOwnerChange(owner.id, 'ownerAddress', address)}
              onChange={(e) => handleOwnerChange(owner.id, 'ownerAddress', e.target.value)} error='' onBlur={() => { }} type={''} id={''} required />
            <DatePickerField label="Date of Birth" name="ownerBirthDate" value={owner.ownerBirthDate} onChange={(e) => handleOwnerChange(owner.id, 'ownerBirthDate', e.target.value)} required />
          </div>

          {ownershipInfo.owners.length > 1 && (
            <div className='w-[30%] mx-auto border-b border-amber-200 my-8 '></div>
          )}
        </div>
      ))}
      <button
        className="add-owner text-sm text-gray-500 hover:text-rose-500 focus:outline-none my-4"
        onClick={addOwner}
        type="button"
      >
        + Add Owner
      </button>
    </div>

  );
};

export default OwnershipStep;



