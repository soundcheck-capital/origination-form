import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateCompanyInfo, updateOwnershipInfo } from '../../store/form/formSlice';
import StepTitle from '../customComponents/StepTitle';
import TextField from '../customComponents/TextField';
import { AddressAutocomplete } from '../customComponents/AddressAutocomplete';
import NumberInput from '../customComponents/NumberField';
import DatePickerField from '../customComponents/DatePickerField';
import DropdownField from '../customComponents/DropdownField';
import { useValidation } from '../../contexts/ValidationContext';
import { businessType, usStates } from '../../store/form/hubspotLists';
import FinancesStep from '../FinancesStep';

interface Owner {
  id: string;
  ownerName: string;
  ownershipPercentage: string;
  sameAddress: boolean;
  ownerAddress: string;
  ownerBirthDate: string;
}

interface Question {
  id: string;
  text: string;
  name: 'hasTicketingDebt' | 'hasBusinessDebt' | 'hasOverdueLiabilities' | 'isLeasingLocation' | 'hasTaxLiens' | 'hasBankruptcy' | 'ownershipChanged';
  showDateInput?: boolean;
  condition?: (financesInfo: any) => boolean;
}

const BusinessFinancialStep: React.FC = () => {
  const dispatch = useDispatch();
  const ownershipInfo = useSelector((state: RootState) => state.form.formData.ownershipInfo);
  const companyInfo = useSelector((state: RootState) => state.form.formData.companyInfo);
  const financesInfo = useSelector((state: RootState) => state.form.formData.financesInfo);
  const { setFieldError } = useValidation();

  // Financial questions state (from FinancesStep)
  const [, setCurrentQuestionIndex] = useState(0);
  const [, setVisibleQuestions] = useState<number[]>([0]);
  const [hasBeenVisited, setHasBeenVisited] = useState(false);

  // Questions from FinancesStep (modified - removed the 3 obsolete questions)
  const questions: Question[] = [
    {
      id: 'debt',
      text: "Do you have any business debt or material liabilities (including ticketing company)?",
      name: 'hasBusinessDebt',
    },
    {
      id: 'overdue',
      text: "Are any of these liabilities not within terms and/or overdue?",
      name: 'hasOverdueLiabilities',
      condition: (financesInfo) => financesInfo.hasBusinessDebt && financesInfo.debts.length > 0
    },
    {
      id: 'taxLiens',
      text: "Does this legal entity have any outstanding tax arrears and/or liens?",
      name: 'hasTaxLiens'
    },
    {
      id: 'bankruptcy',
      text: "Has this business that you're currently applying for (or, if you are a sole proprietor, have you) applied for bankruptcy in the last two years?",
      name: 'hasBankruptcy'
    },
    {
      id: 'ownership',
      text: "Has any ownership of your business changed in the last two years?",
      name: 'ownershipChanged'
    }
  ];

  // Filter questions based on conditions (from FinancesStep)
  const filteredQuestions = questions.filter(question => {
    if (question.condition) {
      return question.condition(financesInfo);
    }
    return true;
  });

  // Check if user has already visited this step (from FinancesStep)
  useEffect(() => {
    const hasAnsweredAnyQuestion = Object.values(financesInfo).some(value =>
      typeof value === 'boolean' && value !== undefined
    );

    if (hasAnsweredAnyQuestion && !hasBeenVisited) {
      setHasBeenVisited(true);
      // Show all questions that should be visible based on current answers
      const allVisibleIndices = filteredQuestions.map((_, index) => index);
      setVisibleQuestions(allVisibleIndices);
      setCurrentQuestionIndex(allVisibleIndices.length - 1);
    }
  }, [financesInfo, hasBeenVisited, filteredQuestions]);

  // Business info handlers (from OwnershipStep)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "legalEntityName") {
      dispatch(updateCompanyInfo({ name: value, dba: value }));
    } else {
      dispatch(updateCompanyInfo({ [name]: value }));
    }
    
    // Real-time validation for company fields
    if (name === 'legalEntityName') {
      if (!value.trim() || value.length < 2) {
        setFieldError('name', 'Company name is required');
      } else {
        setFieldError('name', null);
      }
    } else if (name === 'dba') {
      if (!value.trim()) {
        setFieldError('dba', 'DBA name is required');
      } else {
        setFieldError('dba', null);
      }
    } else if (name === 'businessType') {
      if (!value) {
        setFieldError('businessType', 'Business type is required');
      } else {
        setFieldError('businessType', null);
      }
    } else if (name === 'stateOfIncorporation') {
      if (!value) {
        setFieldError('stateOfIncorporation', 'State of incorporation is required');
      } else {
        setFieldError('stateOfIncorporation', null);
      }
    } else if (name === 'companyAddressDisplay') {
      if (!value.trim()) {
        setFieldError('companyAddressDisplay', 'Company address is required');
      } else if (value.length < 5) {
        setFieldError('companyAddressDisplay', 'Company address is too short');
      } else {
        setFieldError('companyAddressDisplay', null);
      }
    } else {
      setFieldError(name, null);
    }
  };

  const updateCompanyAddress = (address: string) => {
    dispatch(updateCompanyInfo({ 
      companyAddressDisplay: address,
      companyAddress: `${address.split(',')[0]}`, 
      companyZipcode: address.split(',')[3], 
      companyState: address.split(',')[2], 
      companyCountry: address.split(',')[4], 
      companyCity: address.split(',')[1] 
    }));

    // Real-time validation for company address
    if (!address.trim()) {
      setFieldError('companyAddressDisplay', 'Company address is required');
    } else if (address.length < 5) {
      setFieldError('companyAddressDisplay', 'Company address is too short');
    } else {
      setFieldError('companyAddressDisplay', null);
    }
  };

  const [ein, setEin] = useState(companyInfo.ein);

  const handleChangeEIN = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatEIN(e.target.value);
    setEin(formatted);
    dispatch(updateCompanyInfo({ ein: formatted }));
    
    // Real-time validation for EIN
    if (!formatted.trim()) {
      setFieldError('ein', 'EIN is required');
    } else if (formatted.replace(/\D/g, '').length !== 9) {
      setFieldError('ein', 'EIN must be 9 digits');
    } else {
      setFieldError('ein', null);
    }
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

  // Owner handlers (from OwnershipStep)
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
    // Real-time validation
    const ownerIndex = updatedOwners.findIndex(o => o.id === id);
    if (ownerIndex !== -1) {
      let fieldName = '';
      if (field === 'ownerName') {
        fieldName = `owner${ownerIndex}Name`;
        const error = validateOwnerName(value as string);
        setFieldError(fieldName, error);
      } else if (field === 'ownershipPercentage') {
        fieldName = `owner${ownerIndex}Percentage`;
        const error = validateOwnershipPercentage(value as string);
        setFieldError(fieldName, error);
      } else if (field === 'ownerAddress') {
        fieldName = `owner${ownerIndex}Address`;
        const error = validateOwnerAddress(value as string);
        setFieldError(fieldName, error);
      } else if (field === 'ownerBirthDate') {
        fieldName = `owner${ownerIndex}BirthDate`;
        const error = validateOwnerBirthDate(value as string);
        setFieldError(fieldName, error);
      }
    }
    const totalPercentage = updatedOwners.reduce((sum, owner) => sum + parseFloat(owner.ownershipPercentage), 0);
    if(totalPercentage > 100){
     setFieldError('owner1Percentage', 'Total ownership percentage cannot exceed 100%');
    } else {
     setFieldError('owner1Percentage', null);
    }
    dispatch(updateOwnershipInfo({ owners: updatedOwners }));
  }, [dispatch, ownershipInfo.owners, setFieldError]);

  const addOwner = useCallback(() => {
    const newOwner: Owner = {
      id: crypto.randomUUID(),
      ownerName: '', 
      ownershipPercentage: '', 
      sameAddress: false,
      ownerAddress: '', 
      ownerBirthDate: ''
    };
    dispatch(updateOwnershipInfo({
      owners: [...ownershipInfo.owners, newOwner]
    }));
  }, [dispatch, ownershipInfo.owners]);

  useEffect(() => {
    if (!ownershipInfo.owners || ownershipInfo.owners.length === 0) {
      addOwner();
    }
  }, [ownershipInfo.owners, addOwner]);

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

  // Validation functions (from OwnershipStep)
  const validateOwnerName = (name: string): string | null => {
    if (!name.trim() || name.length < 2) return 'Owner name is required';
    if (name.length > 50) return 'Owner name is too long';
    return null;
  };

  const validateOwnershipPercentage = (percentage: string): string | null => {
    if (!percentage.trim()) return 'Ownership percentage is required';
    const num = parseFloat(percentage);
    if (isNaN(num)) return 'Ownership percentage must be a number';
    if (num < 0) return 'Ownership percentage cannot be negative';
    if (num > 100) return 'Ownership percentage cannot exceed 100%';
    return null;
  };

  const validateOwnerAddress = (address: string): string | null => {
    if (!address.trim()) return 'Owner address is required';
    if (address.length < 10) return 'Please enter a complete address';
    return null;
  };

  const validateOwnerBirthDate = (birthDate: string): string | null => {
    if (!birthDate.trim()) return 'Date of birth is required';
    const date = new Date(birthDate);
    if (isNaN(date.getTime())) return 'Please enter a valid date';
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    if (age < 18) return 'Owner must be at least 18 years old';
    if (age > 120) return 'Please enter a valid date of birth';
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full animate-fade-in-right duration-1000">
      <p className="text-gray-400 mb-8 text-xs mt-8 text-center">
        Please carefully complete the information below and make sure that it is accurate including information about the control person and all beneficial owner(s) owning more than 20% of the company. If this information is inaccurate or incomplete, this could result in delay or denial of your application.
      </p>

      {/* Business Legal Information Section - Exact copy from OwnershipStep */}
      <StepTitle title="Business Legal Information" />
      <TextField 
        type="text" 
        label="Legal Business Name" 
        name="legalEntityName" 
        value={companyInfo.name} 
        onChange={handleChange} 
        error='' 
        onBlur={() => { }} 
        required 
      />
      <TextField 
        type="text" 
        label="DBA" 
        name="dba" 
        value={companyInfo.dba} 
        onChange={handleChange} 
        error='' 
        onBlur={() => { }} 
        required 
      />
      <DropdownField 
        label="Business Type" 
        name="businessType" 
        value={companyInfo.businessType} 
        onChange={handleChange} 
        error='' 
        onBlur={() => { }} 
        options={businessType} 
        required 
      />

      <DropdownField 
        label="State of Incorporation" 
        name="stateOfIncorporation" 
        value={companyInfo.stateOfIncorporation} 
        onChange={handleChange} 
        error='' 
        onBlur={() => { }} 
        options={usStates} 
        required 
      />

      <AddressAutocomplete
        label="Address"
        name="companyAddressDisplay"
        value={companyInfo.companyAddressDisplay}
        onChange={handleChange}
        onSelect={(address: string) => updateCompanyAddress(address)}
        error=''
        onBlur={() => { }}
        type="text"
        id="companyAddressDisplay"  
      />

      <TextField 
        type="text" 
        label="Tax ID (EIN)" 
        name="ein" 
        value={ein} 
        onChange={handleChangeEIN} 
        error='' 
        onBlur={() => { }} 
        required 
      />

      {/* Beneficial Ownership Section - Exact copy from OwnershipStep */}
      <StepTitle title="Beneficial ownership & control person" />

      {ownershipInfo.owners.map((owner) => (
        <div key={owner.id} className="flex flex-col bg-white w-full">
          <div className="flex flex-row justify-between w-full">
            <p className='block text-sm font-medium text-gray-700  '>
              Owner {ownershipInfo.owners.indexOf(owner) + 1}
            </p>
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
            <TextField 
              type="text" 
              label="Owner Name" 
              name={`owner${ownershipInfo.owners.indexOf(owner)}Name`} 
              value={owner.ownerName} 
              onChange={(e) => handleOwnerChange(owner.id, 'ownerName', e.target.value)} 
              error='' 
              onBlur={() => { }} 
              required 
            />

            <NumberInput 
              showPercent={true} 
              label="Ownership Percentage" 
              name={`owner${ownershipInfo.owners.indexOf(owner)}Percentage`} 
              value={owner.ownershipPercentage} 
              onChange={(e) => handleOwnerChange(owner.id, 'ownershipPercentage', e)} 
              required 
            />
          </div>
          
          <div className="flex flex-row justify-between  gap-x-4 ">
            <AddressAutocomplete 
              label="Address" 
              name={`owner${ownershipInfo.owners.indexOf(owner)}Address`} 
              value={owner.ownerAddress}
              onSelect={(address: string) => handleOwnerChange(owner.id, 'ownerAddress', address)}
              onChange={(e) => handleOwnerChange(owner.id, 'ownerAddress', e.target.value)} 
              error={''} 
              onBlur={() => { }} 
              type={''} 
              id={''} 
              required 
            />
            <DatePickerField 
              label="Date of Birth" 
              name={`owner${ownershipInfo.owners.indexOf(owner)}BirthDate`} 
              value={owner.ownerBirthDate} 
              onChange={(e) => handleOwnerChange(owner.id, 'ownerBirthDate', e.target.value)} 
              required 
            />
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

      <FinancesStep />
    </div>
  );
};

export default BusinessFinancialStep;