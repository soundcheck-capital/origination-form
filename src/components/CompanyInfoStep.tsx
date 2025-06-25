import React, { useState, useEffect, useRef }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateCompanyInfo, updateOwnershipInfo } from '../store/form/formSlice';
import StepTitle from './StepTitle';
import TextField from './TextField';
import DropdownField from './DropdownField';

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
  const ownershipInfo = useSelector((state: RootState) => state.form.formData.ownershipInfo);
  
  const addressInputRef = useRef<HTMLInputElement>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      // Check if already loaded
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsGoogleLoaded(true);
        return;
      }

      // Check if script is already being loaded
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA7_2peM-CW7KqJzdHEAmL2PYK-DEnjX0A&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google Maps loaded successfully');
        setIsGoogleLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Google Maps');
      };
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  // Initialize autocomplete when Google Maps is loaded
  useEffect(() => {
    if (isGoogleLoaded && addressInputRef.current) {
      try {
        const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'us' }
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          console.log('Place selected:', place);
          
          if (place.geometry) {
            // Extract address components
            let streetNumber = '';
            let route = '';
            let city = '';
            let state = '';
            let zipCode = '';

            place.address_components.forEach((component: any) => {
              const types = component.types;
              if (types.includes('street_number')) {
                streetNumber = component.long_name;
              }
              if (types.includes('route')) {
                route = component.long_name;
              }
              if (types.includes('locality')) {
                city = component.long_name;
              }
              if (types.includes('administrative_area_level_1')) {
                state = component.short_name;
              }
              if (types.includes('postal_code')) {
                zipCode = component.long_name;
              }
            });

            const fullAddress = `${streetNumber} ${route}`.trim();
            
            console.log('Extracted address:', { fullAddress, city, state, zipCode });
            
            // Update all address fields
            dispatch(updateOwnershipInfo({
              ownershipInfo: {
                ...ownershipInfo,
                companyAddress: fullAddress,
                companyCity: city,
                companyState: state,
                companyZipCode: zipCode
              }
            }));
          }
        });

        console.log('Autocomplete initialized successfully');
      } catch (error) {
        console.error('Error initializing autocomplete:', error);
      }
    }
  }, [isGoogleLoaded, dispatch, ownershipInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(updateCompanyInfo({ [name]: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(updateOwnershipInfo({ [name]: value }));
  };

  const [ein, setEin] = useState(ownershipInfo.ein);

  const handleChangeEIN = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatEIN(e.target.value);
    setEin(formatted);
    dispatch(updateOwnershipInfo({ ownershipInfo: { ...ownershipInfo, ein: formatted } }));
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

      <TextField type="text" label="Legal Entity Name" name="name" value={companyInfo.name} onChange={handleChange} error='' onBlur={()=>{}}  />
      <TextField type="text" label="DBA" name="name" value={companyInfo.dba} onChange={handleChange} error='' onBlur={()=>{}}  />

      <DropdownField label="Client Type" name="type" value={companyInfo.clientType} onChange={handleChange} error='' onBlur={()=>{}} options={companyTypes} />
      <DropdownField label="Legal Entity Type" name="legalEntityType" value={ownershipInfo.legalEntityType} onChange={handleInputChange} error='' onBlur={()=>{}} options={businessTypes} />
      <DropdownField label="Years in Business" name="yearsInBusiness" value={companyInfo.yearsInBusiness} onChange={handleChange} error='' onBlur={()=>{}} options={yearsInBusiness} />
      <TextField type="number" label="Number of Employees" name="employees" value={companyInfo.employees.toString()} onChange={handleChange} error='' onBlur={()=>{}}  />
      <TextField type="text" label="Social Media" name="socials" value={companyInfo.socials} onChange={handleChange} error='' onBlur={()=>{}}  />
      <DropdownField label="Are you a member of?" name="membership" value={ticketingInfo.membership} onChange={handleChange} error='' onBlur={()=>{}} options={memberships} />
      
      <div className="relative w-full max-w-md mb-10">
        <input
          ref={addressInputRef}
          type="text"
          id="floating_outlined"
          value={ownershipInfo.companyAddress}
          name="companyAddress"
          className="block w-full p-4 text-sm text-gray-900 rounded-2xl border-2 border-gray-300 focus:border-rose-300 peer focus:ring-1 focus:ring-rose-500 focus:outline-none"
          placeholder=" "
          required
          onChange={handleInputChange}
        />
        <label htmlFor="floating_outlined"
          className="absolute text-sm text-gray-500 bg-white text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] 
         px-2 peer-focus:px-2 peer-focus:text-gray-500 peer-focus:text-rose-500 peer-placeholder-shown:scale-100 
        peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Legal Entity Address</label>
      </div>
      
      <TextField type="text" label="Legal Entity ZIP code" name="companyZipCode" value={ownershipInfo.companyZipCode} onChange={handleInputChange} error='' onBlur={()=>{}}  />
      <TextField type="text" label="Legal Entity City" name="companyCity" value={ownershipInfo.companyCity} onChange={handleInputChange} error='' onBlur={()=>{}}  />
      <TextField type="text" label="Legal Entity State" name="companyState" value={ownershipInfo.companyState} onChange={handleInputChange} error='' onBlur={()=>{}}  />
      <TextField type="text" label="Tax ID (EIN)" name="ein" value={ein} onChange={handleChangeEIN} error='' onBlur={()=>{}}  />
    </div>
  );
};

export default CompanyInfoStep; 