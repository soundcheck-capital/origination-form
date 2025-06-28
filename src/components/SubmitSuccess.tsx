import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import logo from '../assets/logo_black_name.svg';

const SubmitSuccess: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  
  return (
    <div className="flex flex-row">

      <main className="w-full h-full flex flex-col bg-white p-6 gap-10">
        <div className="flex justify-center items-center mt-8">
            <div className="flex flex-col items-center gap-4">
            <img src={logo} alt="Logo" className="w-24 " />
            </div>
        </div>
        
        <div className='flex flex-col items-center justify-center gap-4'>
          <h1 className='text-2xl font-bold'>Application submitted successfully!</h1>
          <p className='text-sm text-gray-500'>You will receive an email with your application details.</p>
        </div>
        
     

        
      </main>
    </div>

  );
}; 

export default SubmitSuccess; 