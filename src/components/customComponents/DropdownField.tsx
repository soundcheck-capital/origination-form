
import { useValidation } from '../../contexts/ValidationContext';

const DropdownField = ({ label, name, value, onChange, error, onBlur, options, required = false }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, error: string, onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void, options: string[], required?: boolean }) => {
  const id = name.replace(/\s+/g, '_').toLowerCase();
  const { hasError } = useValidation();
  const hasFieldError = hasError(name);
  
    return (
        <div className="relative w-full mb-4">  
          <label className="text-xs text-gray-500 px-2 top-2 start-1">{label} {required && <span className="text-red-500">*</span>}</label>
            <select 
              id={id} 
              name={name} 
              value={value} 
              onChange={onChange} 
              className={`block w-full p-2 text-sm text-gray-900 
              rounded-xl border
              focus:ring-1 focus:ring-amber-500 focus:outline-none pr-8 ${
                hasFieldError 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:border-rose-300'
              }`} 
              onBlur={onBlur}
            >
                <option value="" className="text-gray-300"></option>
                {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};  

export default DropdownField;


