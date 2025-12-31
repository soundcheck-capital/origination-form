import React  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updatePersonalInfo } from '../../store/form/formSlice';
import TextField from '../customComponents/TextField';
import PhoneField from '../customComponents/PhoneField';
import StepTitle from '../customComponents/StepTitle';
import { useValidation } from '../../contexts/ValidationContext';

const PersonalInfo: React.FC = () => {
  const dispatch = useDispatch();
  const personalInfo = useSelector((state: RootState) => state.form.formData.personalInfo);
  const { setFieldError } = useValidation();
  const validateEmail = (email: string) => {
    email = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'firstname' || name === 'lastname') {
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


  

  return (
    <div className="animate-fadeIn w-full ">

      <StepTitle title="Contact" />

      <TextField type="text" label="First Name" name="firstname" value={personalInfo.firstname} onChange={handleInputChange} error='' onBlur={() => { }} required />
      <TextField type="text" label="Last Name" name="lastname" value={personalInfo.lastname} onChange={handleInputChange} error='' onBlur={() => { }} required />

      <TextField type="email" label="Email" name="email" value={personalInfo.email} onChange={handleInputChange} error='' onBlur={handleEmailBlur} required />
    
      <PhoneField 
        label="Phone" 
        name="phone" 
        value={personalInfo.phone} 
        onChange={(value) => {
          dispatch(updatePersonalInfo({
            personalInfo: {
              ...personalInfo,
              phone: value
            }
          }));
        }}
        error='' 
        onBlur={() => { }} 
        required 
      />
      

      
    
    
    
    </div>
  );
};

export default PersonalInfo;

