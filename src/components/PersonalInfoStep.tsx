import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updatePersonalInfo } from '../store/form/formSlice';

const PersonalInfoStep: React.FC = () => {
  const dispatch = useDispatch();
  const personalInfo = useSelector((state: RootState) => state.form.formData.personalInfo);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    dispatch(updatePersonalInfo({
      personalInfo: {
        ...personalInfo,
        [name]: value
      }
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <p className="text-gray-600 mb-8 text-2xl font-bold mt-10">Email Address</p>

         
      <div className="relative w-full max-w-md mb-10">
      <input type="email" id="floating_outlined" value={personalInfo.email}
            name="email"
            className="block w-full p-4 text-sm text-gray-900 rounded-2xl border-2 border-gray-300 focus:border-rose-300 peer focus:ring-1 focus:ring-rose-500 focus:outline-none" placeholder=" " required
            onChange={handleInputChange}
          />
          <label htmlFor="floating_outlined"
            className="absolute text-sm text-gray-500 bg-white text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] 
           px-2 peer-focus:px-2 peer-focus:text-gray-500 peer-focus:text-rose-500 peer-placeholder-shown:scale-100 
          peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Email</label>
        </div>
    </div>
  );
};

export default PersonalInfoStep;

