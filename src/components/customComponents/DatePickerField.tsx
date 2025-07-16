import TextField from "./TextField";

const DatePickerField = ({ label, name, value, onChange }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  return (
    <div className="w-full">
        <TextField type="date" name={name} value={value} onChange={onChange} label={label} error='' onBlur={() => { }} />
    </div>
  );
};

export default DatePickerField;