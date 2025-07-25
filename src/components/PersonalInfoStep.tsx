import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updatePersonalInfo } from '../store/form/formSlice';
import TextField from './customComponents/TextField';
import StepTitle from './customComponents/StepTitle';
import { useValidation } from '../contexts/ValidationContext';

const PersonalInfoStep: React.FC = () => {
  const dispatch = useDispatch();
  const personalInfo = useSelector((state: RootState) => state.form.formData.personalInfo);
  const { setFieldError } = useValidation();
  const validateEmail = (email: string) => {
    email = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateEmailConfirm = (emailConfirm: string) => {
    emailConfirm = emailConfirm.trim();
    if (personalInfo.email !== emailConfirm) {
      return 'Emails do not match';
    }
    return '';
  };

 

  const formatPhoneNumber = (value: string) => {
    let digits;
    // Remove all non-digits
    value = value.trim();
    value = value.replace(/[^0-9]/g, '');
    if (value.includes('+1')) {
      digits = value.replace(/\D/g, '');
      digits = digits.substring(1);
    } else if (value.includes('1')) {
      digits = value.replace(/\D/g, '');
      digits = digits.substring(1);
    } else {
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
    } else if (name === 'firstname' || name === 'lastname') {
      const formattedValue = value.trim().replace(/[^a-zA-Z\s]/g, '');
      dispatch(updatePersonalInfo({
        personalInfo: {
          ...personalInfo,
          [name]: formattedValue
        }
      }));
      setFieldError(name, null);
    } else {
      dispatch(updatePersonalInfo({
        personalInfo: {
          ...personalInfo,
          [name]: value
        }
      }));

      // Real-time validation for emails
      if (name === 'email' && value) {
        if (!validateEmail(value)) {
          setFieldError('email', 'Please enter a valid email address');
        } else {
          setFieldError('email', null);
        }
      }

      if (name === 'emailConfirm' && value) {
        if (validateEmailConfirm(value) !== '') {
          setFieldError('emailConfirm', 'Emails do not match');
        } else {
          setFieldError('emailConfirm', null);
        }
      }
    }
  };

  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value;
    
    if (email && !validateEmail(email)) {
      setFieldError('email', 'Please enter a valid email address');
    } else {
      setFieldError('email', null);
    }
  };

  const handleEmailConfirmBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const emailConfirm = e.target.value;
    if (emailConfirm && validateEmailConfirm(emailConfirm) !== '') {
      setFieldError('emailConfirm', 'Emails do not match');
    } else {
      setFieldError('emailConfirm', null);
    }
  };

  

  return (
    <div className="animate-fadeIn w-full ">

      <StepTitle title="Contact Information" />

      <TextField type="text" label="First Name" name="firstname" value={personalInfo.firstname} onChange={handleInputChange} error='' onBlur={() => { }} required />
      <TextField type="text" label="Last Name" name="lastname" value={personalInfo.lastname} onChange={handleInputChange} error='' onBlur={() => { }} required />

      <TextField type="email" label="Email" name="email" value={personalInfo.email} onChange={handleInputChange} error='' onBlur={handleEmailBlur} required />
      
      <TextField type="email" label="Confirm Email" name="emailConfirm" value={personalInfo.emailConfirm} onChange={handleInputChange} error='' onBlur={handleEmailConfirmBlur} required />

      
      
      <TextField type="tel" label="Phone" name="phone" value={personalInfo.phone} onChange={handleInputChange} error='' onBlur={() => { }} required />
      


      <p className="text-sm text-gray-500 my-4 text-center ">By filling this form, you agree to SoundCheck Capital <a href="https://soundcheckcapital.com/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-blue-500">Terms of Service</a> and <a href="https://soundcheckcapital.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-500">Privacy Policy</a></p>
    </div>
  );
};

export default PersonalInfoStep;

