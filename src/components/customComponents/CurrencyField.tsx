import TextField from "./TextField";

    interface CurrencyFieldProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    id?: string;
  }
  
  const CurrencyField: React.FC<CurrencyFieldProps> = ({ value, onChange, placeholder, label, id }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      const numericValue = input.replace(/[^0-9.]/g, '');
      onChange(numericValue);
    };
  
    const formatCurrencyValue = (value: string) => {
      if (!value) return '';
  
      return new Intl.NumberFormat('en-US', {
      }).format(Number(value));
    };
  
  
    return (
        <TextField id={id} type="number" label={label || ''} name={label || ''} value={formatCurrencyValue(value)} onChange={handleChange} error='' onBlur={()=>{}} />
    //   <div className="relative w-full max-w-md mb-10">
    //   <input type="text" id="floating_outlined"       value={formatCurrencyValue(value)}
  
    //     className="block w-full p-4 text-sm text-gray-900 rounded-2xl text-gray-500 border-2 border-gray-300 focus:border-rose-300 peer focus:ring-1 focus:ring-rose-500 focus:outline-none" placeholder=" " required
    //     onChange={handleChange}
    //   />
    //   <label htmlFor="floating_outlined"
    //     className="absolute text-sm text-gray-500 bg-white rounded-t-md  focus:border-rose-300 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-1 z-10 origin-[0] 
    //          px-2 peer-focus:px-2 peer-focus:text-gray-500 peer-focus:text-rose-500 peer-placeholder-shown:scale-100 
    //         peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-3">{label}</label>
    // </div>
  
     
  
    );
  };

  export default CurrencyField;