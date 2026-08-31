import React from 'react';
import { useValidation } from '../../contexts/ValidationContext';

const DropdownField = ({ label, name, value, onChange, error, onBlur, options, required = false, description = '', disabled = false }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, error: string, onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void, options: { [key: string]: string }, required?: boolean, description?: string, disabled?: boolean }) => {
  const id = name.replace(/\s+/g, '_').toLowerCase();
  const { hasError, getFieldError } = useValidation();
  const hasFieldError = hasError(name);
  const fieldError = getFieldError(name);
  
    return (
        <div className="relative w-full mb-4" data-field-name={name}>
          <label className="mb-[7px] ml-1 block text-left text-sm text-[#6b7280]">
            {label}
            {required ? <span className="text-[#ef6b2f]"> *</span> : null}
          </label>
          <div className="relative">
            <select
              id={id}
              name={name}
              value={value}
              onChange={onChange}
              className={`block w-full rounded-[14px] border bg-white px-[18px] py-3.5 text-base text-[#1f2a37]
             focus:outline-none focus:ring-[3px] focus:ring-violet-500/10 pr-10 appearance-none cursor-pointer ${
                hasFieldError
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-[#dfe3e8] focus:border-violet-500'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
              onBlur={onBlur}
              disabled={disabled}
            >
                <option value="" className="text-gray-300"></option>
                {Object.entries(options).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg 
                className="w-5 h-5 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            </div>
          </div>
            {description && <p className='text-[13px] text-[#9aa3af] text-left w-full ml-1 mt-1'>{description}</p>}
            {fieldError && (
              <p className="mt-1.5 ml-1 text-left text-sm text-red-600">{fieldError}</p>
            )}
        </div>
    );
};  

export default DropdownField;
