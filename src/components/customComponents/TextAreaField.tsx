import React from 'react';

interface TextAreaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  labelClassName?: string;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error = '',
  onBlur,
  placeholder = '',
  rows = 6,
  labelClassName = '',
  required = false,
}) => {
  return (
    <div className="w-full mb-4">
      <h4 className={labelClassName ? labelClassName : 'mb-[7px] ml-1 text-left text-sm text-[#6b7280]'}>{label}{required ? <span className="text-[#ef6b2f]"> *</span> : null}</h4>

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={`block w-full rounded-[14px] border border-[#dfe3e8] bg-white px-[18px] py-3.5 text-base text-[#1f2a37] placeholder:text-[#aab1bb] focus:border-violet-500 focus:ring-[3px] focus:ring-violet-500/10 focus:outline-none resize-vertical`}
      />

      {error && (
        <div className="mt-1.5 ml-1">
          <p className="text-left text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default TextAreaField; 