import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { resetSubmitted } from '../store/form/formSlice';
import logo from '../assets/logo_side_black.svg';
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
    <div className="min-h-screen bg-stone-50 px-6 py-12 text-slate-900">
      <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
        <div className="w-full rounded-[32px] border border-stone-200 bg-white px-8 py-12 shadow-[0_20px_80px_rgba(15,23,42,0.08)] sm:px-12">
          <img
            src={logo}
            alt="SoundCheck"
            className="h-12 w-auto"
          />

          <div className="mt-10 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
              Submission received
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Application submitted successfully.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              We&apos;ve received your application. You will receive an email confirmation with your submission details.
            </p>
          </div>

          {isDevelopment && localStorage.getItem('DISABLE_SUBMISSION_BLOCK') === 'true' && (
            <button
              onClick={handleReset}
              className="mt-10 rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-stone-400 hover:bg-stone-50"
            >
              Reset and return to form
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitSuccess;
