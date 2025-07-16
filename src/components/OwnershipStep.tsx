import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {updateCompanyInfo, updateOwnershipInfo} from '../store/form/formSlice';
import StepTitle from './customComponents/StepTitle';
import TextField from './customComponents/TextField';
import { AddressAutocomplete } from './customComponents/AddressAutocomplete';
import NumberInput from './customComponents/NumberField';
import DatePickerField from './customComponents/DatePickerField';
import DropdownField from './customComponents/DropdownField';

interface Owner {
  id: string;
  name: string;
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
  const [owners, setOwners] = useState<Owner[]>(ownershipInfo.owners || []);
  useEffect(() => {
    if (owners.length === 0) {
      addOwner();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if(name === "legalEntityName"){
      dispatch(updateCompanyInfo({ name: value, dba: value  }));
    } else {
      dispatch(updateCompanyInfo({ [name]: value }));
    }
  };

  const updateCompanyAddress = (address: string) => {
    dispatch(updateCompanyInfo({ companyAddress: address }));
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
  const handleOwnerChange = (id: string, field: keyof Owner, value: string | boolean) => {
    const updatedOwners = owners.map(owner => {
      if(field === 'ownershipPercentage' && Number(value) > 100) {
        return owner.id === id ? { ...owner, [field]: '100' } : owner;
      } else {
        return owner.id === id ? { ...owner, [field]: value } : owner;
      }
    });
    setOwners(updatedOwners);
     dispatch(updateOwnershipInfo({ owners: updatedOwners }));
  };

  const addOwner = () => {
    const newOwner: Owner = {
      id: Date.now().toString(),
      name: '',
      ownershipPercentage: '',
      sameAddress: true,
      ownerAddress: '',
      ownerBirthDate: ''
    };
    const updatedOwners = [...owners, newOwner];
    setOwners(updatedOwners);
     dispatch(updateOwnershipInfo({ owners: updatedOwners }));
  };

  const removeOwner = (id: string) => {
    if (owners.length > 1) {
      const updatedOwners = owners.filter(owner => owner.id !== id);
      setOwners(updatedOwners);
       dispatch(updateOwnershipInfo({ owners: updatedOwners }));
    }
  };

  const updateOwnerAddress = (id: string, address: string) => {
    const updatedOwners = owners.map(owner => {
      if(owner.id === id) {
        return { ...owner, ownerAddress: address };
      }
      return owner;
    });
    setOwners(updatedOwners);
    dispatch(updateOwnershipInfo({ owners: updatedOwners }));
  };

  const calculateTotalOwnership = () => {
    return owners.reduce((total, owner) => {
      return total + (parseFloat(owner.ownershipPercentage) || 0);
    }, 0);
  };

  const totalOwnership = calculateTotalOwnership();
  const hasOwnershipError = totalOwnership < 80;

  return (

    <div className="flex flex-col items-center justify-center w-full animate-fade-in-right duration-1000">
      <p className="text-gray-400 mb-8 text-xs mt-8 text-center">Please carefully complete the information below and make sure that it is accurate including informations about the control person and all beneficial owner(s) owning more than 20% of the company. If this information is inaccurate or incomplete, this could result in delay or denial of your application.</p>

<StepTitle title="Business Legal Information" />
<TextField type="text" label="Company Name" name="name" value={companyInfo.name} onChange={handleChange} error='' onBlur={()=>{}}  /> 
<TextField type="text" label="DBA" name="dba" value={companyInfo.dba} onChange={handleChange} error='' onBlur={()=>{}}  />
      <DropdownField label="Business Type" name="clientType" value={companyInfo.clientType} onChange={handleChange} error='' onBlur={()=>{}} options={businessTypes} />

<DropdownField label="State of Incorporation" name="stateOfIncorporation" value={companyInfo.stateOfIncorporation} onChange={handleChange} error='' onBlur={()=>{}} options={usStates} />


<AddressAutocomplete
  label="Address"
  name="companyAddress"
  value={companyInfo.companyAddress}
  onChange={handleChange}
  dispatch={(address: string) => updateCompanyAddress(address)}
  error=''
  onBlur={()=>{}}
  type="text"
  id="companyAddress"
/>

<TextField type="text" label="Tax ID (EIN)" name="ein" value={ein} onChange={handleChangeEIN} error='' onBlur={()=>{}}  />

<StepTitle title="Beneficial ownership & control person" />


      {owners.map((owner) => (
        <div key={owner.id} className="flex flex-col bg-white w-full">
          <div className="flex flex-row justify-between w-full">
            <p className='block text-sm font-medium text-gray-700  '>Owner {owners.indexOf(owner) + 1}</p>
            {owners.length > 1 && (
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
            <TextField type="text" label="Owner Name" name="name" value={owner.name} onChange={(e) => handleOwnerChange(owner.id, 'name', e.target.value)} error='' onBlur={() => { }} />
           
            <NumberInput showPercent={true} label="Ownership Percentage"   value={owner.ownershipPercentage} onChange={(e) => handleOwnerChange(owner.id, 'ownershipPercentage', e)} />
          </div>
          <div className="flex flex-row justify-between  gap-x-4 ">
            <AddressAutocomplete label="Address" name="ownerAddress" value={owner.ownerAddress} dispatch={(address: string) => updateOwnerAddress(owner.id, address)} onChange={(e) => handleOwnerChange(owner.id, 'ownerAddress', e.target.value)} error='' onBlur={() => { } } type={''} id={''} />
            <DatePickerField label="Date of Birth" name="ownerBirthDate" value={owner.ownerBirthDate} onChange={(e) => handleOwnerChange(owner.id, 'ownerBirthDate', e.target.value)} />
          </div>

{/* 
          <div className="flex flex-row justify-between w-full">
            <div className="flex flex-row  w-full gap-4">
              <p className="text-sm text-gray-700  w-full">Same address as company?</p>
              <div className="flex flex-row justify-end w-full gap-4">
                <label>
                  <input className='mr-2'
                    type="radio"
                    name={`sameAddress-${owner.id}-yes`}
                    checked={owner.sameAddress}
                    onChange={(e) => handleOwnerChange(owner.id, 'sameAddress', e.target.checked)}
                  />
                  Yes
                </label>
                <label >
                  <input className='mr-2'
                    type="radio"
                    name={`sameAddress-${owner.id}-no`}
                    checked={!owner.sameAddress}
                    onChange={(e) => handleOwnerChange(owner.id, 'sameAddress', !e.target.checked)}
                  />
                  No
                </label>
              </div>
            </div>
          </div> */}

          {/* {!owner.sameAddress && (
        
            <div className="owner-address-fields mt-8">
              <AddressAutocomplete
                label="Address"
                name="companyAddress"
                value={owner.ownerAddress}
                onChange={(e) => handleOwnerChange(owner.id, 'ownerAddress', e.target.value)}
                error=''
                onBlur={() => { }}
                type="text"
                ref={addressInputRef as React.RefObject<HTMLInputElement>}
                id="ownerAddress"
              />
              <TextField type="text" label="Legal Entity ZIP code" name="companyZipCode" value={owner.ownerZipCode} onChange={(e) => handleOwnerChange(owner.id, 'ownerZipCode', e.target.value)} error='' onBlur={() => { }} />
              <TextField type="text" label="Legal Entity City" name="companyCity" value={owner.ownerCity} onChange={(e) => handleOwnerChange(owner.id, 'ownerCity', e.target.value)} error='' onBlur={() => { }} />
              <TextField type="text" label="Legal Entity State" name="companyState" value={owner.ownerState} onChange={(e) => handleOwnerChange(owner.id, 'ownerState', e.target.value)} error='' onBlur={() => { }} />
            </div>
          )} */}
          {owners.length > 1 && (
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
