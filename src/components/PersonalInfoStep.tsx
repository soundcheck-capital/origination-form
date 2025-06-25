import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updatePersonalInfo } from '../store/form/formSlice';
import TextField from './TextField';
import StepTitle from './StepTitle';

const PersonalInfoStep: React.FC = () => {
  const dispatch = useDispatch();
  const personalInfo = useSelector((state: RootState) => state.form.formData.personalInfo);
  const [emailError, setEmailError] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    // US phone format with country code: +1 (XXX) XXX-XXXX or +1-XXX-XXX-XXXX
    const phoneRegex = /^\+1\s?\(?[0-9]{3}\)?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}$/;
    return phoneRegex.test(phone);
  };

  const formatPhoneNumber = (value: string) => {
    let digits;
    // Remove all non-digits
    if(value.includes('+1')){
       digits = value.replace(/\D/g, '');
       digits = digits.substring(1);
    }else if(value.includes('1')){
      digits = value.replace(/\D/g, '');
      digits = digits.substring(1);
    }else{
      digits = value;
    }
    // If it starts with 1, treat as US number
    if (digits.startsWith('1') && digits.length > 1) {
      const number = digits; // Remove the 1
      if (number.length <= 3) {
        return `+1-${number}`;
      } else if (number.length <= 6) {
        return `+1-${number.substring(0, 3)}-${number.substring(3)}`;
      } else {
        return `+1-${number.substring(0, 3)}-${number.substring(3, 6)}-${number.substring(6, 10)}`;
      }
    } else if (digits.length > 0) {
      // If it doesn't start with 1, add +1 prefix
      if (digits.length <= 3) {
        return `+1-${digits}`;
      } else if (digits.length <= 6) {
        return `+1-${digits.substring(0, 3)}-${digits.substring(3)}`;
      } else {
        return `+1-${digits.substring(0, 3)}-${digits.substring(3, 6)}-${digits.substring(6, 10)}`;
      }
    }
    
    return value;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const formattedValue = formatPhoneNumber(value);
      dispatch(updatePersonalInfo({
        personalInfo: {
          ...personalInfo,
          [name]: formattedValue
        }
      }));
    } else {
      dispatch(updatePersonalInfo({
        personalInfo: {
          ...personalInfo,
          [name]: value
        }
      }));
    }
  };

  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value;
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    if (phone && !validatePhone(phone)) {
      setPhoneError('Please enter a valid US phone number with country code (+1)');
    } else {
      setPhoneError('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <StepTitle title="Contact Information" />

      <TextField type="text" label="First Name" name="firstname" value={personalInfo.firstname} onChange={handleInputChange}    error='' onBlur={()=>{}}  /> 
      <TextField type="text" label="Last Name" name="lastname" value={personalInfo.lastname} onChange={handleInputChange}    error='' onBlur={()=>{}}  /> 

      <TextField type="email" label="Email" name="email" value={personalInfo.email} onChange={handleInputChange}    error='' onBlur={handleEmailBlur}  /> 
      {emailError && (
          <div className="w-full max-w-md  mt-2 ml-2">
            <p className="text-red-500 text-xs">{emailError}</p>
          </div>
        )}
        
       <TextField type="tel" label="Phone" name="phone" value={personalInfo.phone} onChange={handleInputChange}    error='' onBlur={handlePhoneBlur}  /> 
         {/* {phoneError && (
          <div className="w-full max-w-md  mt-2 ml-2">
            <p className="text-red-500 text-xs">{phoneError}</p>
          </div>
        )} */}

      <TextField type="text" label="Role" name="role" value={personalInfo.role} onChange={handleInputChange}    error='' onBlur={()=>{}}  /> 

        
    </div>
  );
};

export default PersonalInfoStep;

