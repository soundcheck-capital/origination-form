import { useValidation } from '../../contexts/ValidationContext';

const TextField = ({ label, name, value, onChange, error, onBlur, onFocus, type, id, placeholder, required }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, error: string, onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void, onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void, type: string, id?: string, placeholder?: string, required?: boolean }) => {
  const inputId = id || name.replace(/\s+/g, '_').toLowerCase();
  const { hasError, getFieldError } = useValidation();
  const hasFieldError = hasError(name);
  const fieldError = getFieldError(name);

  return (
    <div className="w-full mb-4" onFocus={onFocus} data-field-name={name}>
      <label htmlFor={inputId} className="mb-[7px] ml-1 block text-left text-sm text-[#6b7280]">
        {label}
        {required ? <span className="text-[#ef6b2f]"> *</span> : null}
      </label>
      <input
        autoComplete="on"
        type={type}
        id={inputId}
        value={value}
        name={name}
        className={`w-full rounded-[14px] border bg-white px-[18px] py-3.5 text-base text-[#1f2a37] placeholder:text-[#aab1bb] focus:outline-none focus:ring-[3px] focus:ring-violet-500/10 ${
          hasFieldError
            ? 'border-red-300 focus:border-red-500'
            : 'border-[#dfe3e8] focus:border-violet-500'
        }`}
        placeholder={placeholder || ''}
        required={required}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        title='Please enter your information here'
      />
      {fieldError && (
        <p className="mt-1.5 ml-1 text-left text-sm text-red-600">{fieldError}</p>
      )}
    </div>
  );
};

export default TextField;
