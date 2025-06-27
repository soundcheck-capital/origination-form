const TextField = ({ label, name, value, onChange, error, onBlur, onFocus, type, id, placeholder, required  }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, error: string, onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void, onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void, type: string, id?: string, placeholder?: string, required?: boolean }) => {
  const inputId = id || name.replace(/\s+/g, '_').toLowerCase();
  return (
      <div className="relative w-full max-w-md mb-8" onFocus={onFocus}>
      <input autoComplete="on" type={type} id={inputId} value={value} name={name} className="block w-full p-2 text-sm text-gray-900 rounded-xl border border-gray-300 focus:border-rose-300 peer focus:ring-1 focus:ring-amber-500 focus:outline-none" placeholder={placeholder || ''} required onChange={onChange} onBlur={onBlur} onFocus={onFocus} />
      <label htmlFor={inputId} className="absolute text-sm text-gray-500 bg-white text-gray-500 duration-300 transform -translate-y-8 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-gray-500 peer-focus:text-rose-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">{label}</label>
    </div>
  );
};  

export default TextField;