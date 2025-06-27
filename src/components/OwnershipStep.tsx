import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {updateOwnershipInfo} from '../store/form/formSlice';
import StepTitle from './customComponents/StepTitle';
import TextField from './customComponents/TextField';
import AddressAutocomplete from './customComponents/AddressAutocomplete';
import NumberInput from './customComponents/NumberField';

interface Owner {
  id: string;
  name: string;
  ownershipPercentage: string;
  sameAddress: boolean;
  ownerAddress: string;
  ownerCity: string;
  ownerState: string;
  ownerZipCode: string;
}

const usStates = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const companyTypes = [
  'Limited Liability Company (LLC)', 'Partnership', 'Corporation', 'Sole Proprietorship',
];

const OwnershipStep: React.FC = () => {
  const dispatch = useDispatch();
  const ownershipInfo = useSelector((state: RootState) => state.form.formData.ownershipInfo);
  const [owners, setOwners] = useState<Owner[]>(ownershipInfo.owners || []);
  const addressInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (owners.length === 0) {
      addOwner();
    }
  }, []);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsGoogleLoaded(true);
      return;
    }

    const existing = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existing) return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA7_2peM-CW7KqJzdHEAmL2PYK-DEnjX0A&libraries=places&v=beta&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google Maps loaded successfully');
      setIsGoogleLoaded(true);
    };
    script.onerror = () => console.error('Google Maps failed to load');
    document.head.appendChild(script);
  }, []);


  useEffect(() => {
    if (!isGoogleLoaded || !addressInputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      addressInputRef.current,
      {
        componentRestrictions: { country: 'US' },
        fields: ['address_components', 'formatted_address', 'geometry'],
        types: ['address'],
      }
    );

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.address_components) return;

      let streetNumber = '', route = '', city = '', state = '', zipCode = '';
      place.address_components.forEach((c: any) => {
        if (c.types.includes('street_number')) streetNumber = c.long_name;
        if (c.types.includes('route')) route = c.long_name;
        if (c.types.includes('locality')) city = c.long_name;
        if (c.types.includes('administrative_area_level_1')) state = c.short_name;
        if (c.types.includes('postal_code')) zipCode = c.long_name;
      });

      dispatch(updateOwnershipInfo({ owners: owners.map(owner => ({
        ...owner,
        ownerAddress: `${streetNumber} ${route}`.trim(),
        ownerCity: city,
        ownerState: state,
        ownerZipCode: zipCode,
      })) }));
    });
  }, [isGoogleLoaded, dispatch]);
  const handleOwnerChange = (id: string, field: keyof Owner, value: string | boolean) => {
    const updatedOwners = owners.map(owner => {
      if(field === 'ownershipPercentage' && Number(value) > 100) {
        return owner.id === id ? { ...owner, [field]: '100' } : owner;
      } else {
        return owner.id === id ? { ...owner, [field]: value } : owner;
      }
    });
    setOwners(updatedOwners);
    // dispatch(updateOwnershipInfo({ owners: updatedOwners }));
  };

  const addOwner = () => {
    const newOwner: Owner = {
      id: Date.now().toString(),
      name: '',
      ownershipPercentage: '',
      sameAddress: true,
      ownerAddress: '',
      ownerCity: '',
      ownerState: '',
      ownerZipCode: ''
    };
    const updatedOwners = [...owners, newOwner];
    setOwners(updatedOwners);
    // dispatch(updateOwnershipInfo({ owners: updatedOwners }));
  };

  const removeOwner = (id: string) => {
    if (owners.length > 1) {
      const updatedOwners = owners.filter(owner => owner.id !== id);
      setOwners(updatedOwners);
      // dispatch(updateOwnershipInfo({ owners: updatedOwners }));
    }
  };

  const calculateTotalOwnership = () => {
    return owners.reduce((total, owner) => {
      return total + (parseFloat(owner.ownershipPercentage) || 0);
    }, 0);
  };

  const totalOwnership = calculateTotalOwnership();
  const hasOwnershipError = totalOwnership < 80;

  return (

    <div className="flex flex-col items-center justify-center w-full">
      <p className="text-gray-400 mb-8 text-center px-20 w-[40%] mt-8">Please carefully complete the information below and make sure that it is accurate including a complete address with city/state/zip and information about the control person and all beneficial owner(s) owning more than 20% of the company. If this information is inaccurate or incomplete, this could result in delay or denial of your application.</p>

      {owners.map((owner) => (
        <div key={owner.id} className="flex flex-col bg-white">
          <div className="flex flex-col justify-between">
            <p className='block text-sm font-medium text-gray-700'>Owner {owners.indexOf(owner) + 1}</p>
            {owners.length > 1 && (
              <button
                className="text-sm text-red-500 hover:text-red-500 focus:outline-none font-bold text-end mb-4"
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
          </div>

          {!owner.sameAddress && (
        
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
          )}
          {owners.length > 1 && (
              <div className='w-full border-b border-amber-200 my-8'></div>
            )}
        </div>
      ))}
      <button
        className="add-owner text-sm text-gray-500 hover:text-rose-500 focus:outline-none mb-10"
        onClick={addOwner}
        type="button"
      >
        + Add Owner
      </button>
    </div>

  );
};

export default OwnershipStep; 
