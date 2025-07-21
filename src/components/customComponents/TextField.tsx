import { useValidation } from '../../contexts/ValidationContext';

const TextField = ({ label, name, value, onChange, error, onBlur, onFocus, type, id, placeholder, required }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, error: string, onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void, onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void, type: string, id?: string, placeholder?: string, required?: boolean }) => {
  const inputId = id || name.replace(/\s+/g, '_').toLowerCase();
  const { hasError } = useValidation();
  const hasFieldError = hasError(name);
  
  return (  
    <div className="w-full mb-4" onFocus={onFocus}>
      <label className="text-xs text-gray-500 px-2 top-2 start-1">{label}</label>
      <input 
        autoComplete="on" 
        type={type} 
        id={inputId} 
        value={value} 
        name={name} 
        className={`w-full p-2 text-sm text-gray-900 rounded-xl border focus:outline-none focus:ring-1 focus:ring-amber-500 ${
          hasFieldError 
            ? 'border-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:border-rose-300'
        }`} 
        placeholder={placeholder || ''} 
        required 
        onChange={onChange} 
        onBlur={onBlur} 
        onFocus={onFocus} 
        title='Please enter your information here' 
      />
    </div>
  );
};

export default TextField;


