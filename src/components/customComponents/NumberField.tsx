import TextField from "./TextField";

    interface NumberInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
  }
  
  const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, placeholder, label }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      const numericValue = input.replace(/[^0-9.]/g, '');
      onChange(numericValue);
    };
  
    const formatNumberValue = (value: string) => {
      if (!value) return '';
      return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2,
      }).format(Number(value));
    };
  
  
    return (

        <TextField type="number"    name={label || ''} value={value} onChange={handleChange} error='' onBlur={()=>{}} label={label || ''} />
     
  
    )
  
  
  
      
  };

  export default NumberInput;