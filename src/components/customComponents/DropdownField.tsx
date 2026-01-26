import React from 'react';
import { useValidation } from '../../contexts/ValidationContext';

const DropdownField = ({ label, name, value, onChange, error, onBlur, options, required = false, description = '' }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, error: string, onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void, options: { [key: string]: string }, required?: boolean, description?: string }) => {
  const id = name.replace(/\s+/g, '_').toLowerCase();
  const { hasError, getFieldError } = useValidation();
  const hasFieldError = hasError(name);
  const fieldError = getFieldError(name);
  
    return (
        <div className="relative w-full mb-4">  
          <label className="text-xs text-gray-500 px-2 top-2 start-1">{label}</label>
          <div className="relative">
            <select 
              id={id} 
              name={name} 
              value={value} 
              onChange={onChange} 
              className={`block w-full px-3 py-2 text-sm text-gray-900 
              rounded-3xl border
             focus:outline-none pr-10 appearance-none cursor-pointer ${
                hasFieldError 
                  ? 'border-gray-300 focus:border-red-500' 
                  : 'border-gray-300 focus:border-purple-400'
              }`} 
              onBlur={onBlur}
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
            {description && <p className='text-xs text-amber-500 text-left w-full ml-2 mt-1'>{description}</p>}
            {fieldError && (
              <p className="mt-1 text-sm text-red-600 px-2">{fieldError}</p>
            )}
        </div>
    );
};  

export default DropdownField;


