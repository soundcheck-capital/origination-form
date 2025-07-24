import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { resetSubmitted } from '../store/form/formSlice';
import logo from '../assets/logo_black_name.svg';
import { useNavigate } from 'react-router-dom';

const SubmitSuccess: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isDevelopment = process.env.NODE_ENV === 'development';
  const navigate = useNavigate();
  const handleReset = () => {
    dispatch(resetSubmitted());
      navigate('/form');
  };

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
          
          {/* Development Mode Reset Button */}
          {(
            <button
              onClick={handleReset}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reset & Return to Form (Dev Mode)
            </button>
          )}
        </div>
        
     

        
      </main>
    </div>

  );
}; 

export default SubmitSuccess; 