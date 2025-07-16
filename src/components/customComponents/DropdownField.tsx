
const DropdownField = ({ label, name, value, onChange, error, onBlur, options }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, error: string, onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void, options: string[] }) => {
  const id = name.replace(/\s+/g, '_').toLowerCase();
    return (
        <div className="relative w-full mb-4">  
          <label className="text-xs text-gray-500 px-2 top-2 start-1">{label}</label>
            <select id={id} name={name} value={value} onChange={onChange} className="block w-full p-2 text-sm text-gray-900 
            rounded-xl border border-gray-300
            focus:border-rose-300 peer focus:ring-1 focus:ring-amber-500 focus:outline-none !important

            pr-8" onBlur={onBlur}>
                <option value="" className="text-gray-300"></option>
                {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};  

export default DropdownField;


