import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEmail, setEmailError } from '../store/formSlice';
import { RootState } from '../store';
import logo from '../assets/logo_black_name.svg';

const PersonalInfoStep: React.FC = () => {
  const dispatch = useDispatch();
  const { email, emailError } = useSelector((state: RootState) => state.form);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setEmail(value));
    
    if (!value) {
      dispatch(setEmailError('Please enter a valid email address.'));
    } else if (!validateEmail(value)) {
      dispatch(setEmailError('Please enter a valid email address.'));
    } else {
      dispatch(setEmailError(''));
    }
  };

  return (
    <div className="form-step">
    
      <h2 className="step-title">Get Funding !</h2>
      <div className="form-group">
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          className={`form-control ${emailError ? 'error' : ''}`}
        />
        {emailError && <span className="error-message">{emailError}</span>}
      </div>
    </div>
  );
};

export default PersonalInfoStep; 