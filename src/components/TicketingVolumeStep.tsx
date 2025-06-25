import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateVolumeInfo } from '../store/form/formSlice';

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ value, onChange, placeholder, label }) => {
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

    <div className="relative w-full max-w-md mb-10">
    <input type="text" id="floating_outlined"       value={formatCurrencyValue(value)}

      className="block w-full p-4 text-sm text-gray-900 rounded-2xl text-gray-500 border-2 border-gray-300 focus:border-rose-300 peer focus:ring-1 focus:ring-rose-500 focus:outline-none" placeholder=" " required
      onChange={handleChange}
    />
    <label htmlFor="floating_outlined"
      className="absolute text-sm text-gray-500 bg-white rounded-t-md  focus:border-rose-300 text-gray-500 duration-300 transform -translate-y-8 scale-75 top-1 z-10 origin-[0] 
           px-2 peer-focus:px-2 peer-focus:text-gray-500 peer-focus:text-rose-500 peer-placeholder-shown:scale-100 
          peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-8 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-3">{label}</label>
  </div>

   

  );
};

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
    <div className="relative w-full max-w-md ">
      <input type="text" id="floating_outlined" value={formatNumberValue(value)}
       
        className="block w-full p-4 text-sm text-gray-900 rounded-2xl text-gray-500 border-2 border-gray-300 focus:border-rose-300 peer focus:ring-1 focus:ring-rose-500 focus:outline-none" placeholder=" " required
        onChange={handleChange}
      />
      <label htmlFor="floating_outlined"
        className="absolute text-sm text-gray-500 bg-white rounded-t-md  focus:border-rose-300 text-gray-500 duration-300 transform -translate-y-8 scale-75 top-1 z-10 origin-[0] 
           px-2 peer-focus:px-2 peer-focus:text-gray-500 peer-focus:text-rose-500 peer-placeholder-shown:scale-100 
          peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-8 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-3">{label}</label>
    </div>

  )



    
};
const TicketingVolumeStep: React.FC = () => {
  const dispatch = useDispatch();
  const ticketingVolume = useSelector((state: RootState) => state.form.formData.volumeInfo);

  const handleNumberChange = (name: string, value: string) => {
    dispatch(updateVolumeInfo({ [name]: value }));
  };

  const handleCurrencyChange = (name: string, value: string) => {
    dispatch(updateVolumeInfo({ [name]: value }));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full mb-10">


      {/*  <div className="w-full max-w-4xl flex flex-col gap-4  rounded-3xl p-8 bg-white mb-16">
        <div className="grid grid-cols-3">
          <div className="text-black text-lg font-bold "></div>
          <div className="text-orange-500 text-lg font-bold mb-8 text-center ">LAST 12 MONTHS</div>
          <div className="text-orange-500 text-lg font-bold mb-8 text-center">NEXT 12 MONTHS</div>

        </div>

        <div className="grid grid-cols-3 gap-8 mb-8">
        <div className="text-black text-sm font-bold pt-2">Number of Events</div>
          <div className="relative">
            <NumberInput
              value={ticketingVolume.lastYearEvents.toString()}
              onChange={(value) => handleNumberChange('lastYearEvents', value)}
              placeholder="Fill in"
            />
          </div>
          <div className="relative">
            <NumberInput
              value={ticketingVolume.nextYearEvents.toString()}
              onChange={(value) => handleNumberChange('nextYearEvents', value)}
              placeholder="Fill in"
            />
          </div>
         
        </div>

        <div className="grid grid-cols-3 gap-8 mb-8">
        <div className="text-black text-sm font-bold pt-2">Number of Tickets sold online</div>
        
          <div className="relative">
            <NumberInput
              value={ticketingVolume.lastYearTickets.toString()}
              onChange={(value) => handleNumberChange('lastYearTickets', value)}
              placeholder="Fill in"
            />
          </div>
          <div className="relative  ">
            <NumberInput
              value={ticketingVolume.nextYearTickets.toString()}
              onChange={(value) => handleNumberChange('nextYearTickets', value)}
              placeholder="Fill in"
            />
          </div>
       
        </div>

        <div className="grid grid-cols-3 gap-8">
        <div className="text-black text-sm font-bold pt-2">Online Gross Tickets Sales ($)</div>
        <div className="relative">
            <CurrencyInput
              value={ticketingVolume.lastYearSales.toString()}
              onChange={(value) => handleCurrencyChange('lastYearSales', value)}
              placeholder="Fill in"
            />
          </div>
        
          
          <div className="relative">

            <CurrencyInput
              value={ticketingVolume.nextYearSales.toString()}
              onChange={(value) => handleCurrencyChange('nextYearSales', value)}
              placeholder="Fill in"
            />
          </div>
        </div>

      </div> */}

      <div className="grid grid-cols-2 gap-6 w-full max-w-2xl ">
        {/* Colonne 1 */}
       

        {/* Colonne 2 : Last 12 Months */}
        <div className="flex flex-col gap-8 shadow-lg shadow-rose-500/20 rounded-2xl p-4 bg-gradient-to-br from-orange-300 to-rose-400">
          <div className="text-white text-lg font-bold text-center">LAST 12 MONTHS</div>
          <NumberInput label="Number of Events" value={ticketingVolume.lastYearEvents.toString()} onChange={(value) => handleNumberChange('lastYearEvents', value)} placeholder="Fill in" />
          <NumberInput label="Number of Tickets sold online" value={ticketingVolume.lastYearTickets.toString()} onChange={(value) => handleNumberChange('lastYearTickets', value)} placeholder="Fill in" />
          <CurrencyInput label="Online Gross Tickets Sales" value={ticketingVolume.lastYearSales.toString()} onChange={(value) => handleCurrencyChange('lastYearSales', value)} placeholder="Fill in" />
        </div>

        {/* Colonne 3 : Next 12 Months */}
        <div className="flex flex-col gap-8 shadow-lg shadow-rose-500/20 rounded-2xl p-4 bg-gradient-to-br from-orange-400 to-rose-500 ">
          <div className="text-white text-lg font-bold text-center">NEXT 12 MONTHS</div>
          <NumberInput label="Number of Events" value={ticketingVolume.nextYearEvents.toString()} onChange={(value) => handleNumberChange('nextYearEvents', value)} placeholder="Fill in" />
          <NumberInput label="Number of Tickets sold online" value={ticketingVolume.nextYearTickets.toString()} onChange={(value) => handleNumberChange('nextYearTickets', value)} placeholder="Fill in" />
          <CurrencyInput label="Online Gross Tickets Sales" value={ticketingVolume.nextYearSales.toString()} onChange={(value) => handleCurrencyChange('nextYearSales', value)} placeholder="Fill in" />
        </div>
      </div>

      {/*   <div className='gap-4'></div>

        <div className="volume-matrix">
        <div className="matrix-header">
          <div className="text-black text-lg font-bold "></div>
          <div className="text-black text-lg font-bold ">Number of Events</div>
          <div className="text-black text-lg font-bold ">Number of Tickets sold online</div>
          <div className="text-black text-lg font-bold ">Online Gross Tickets Sales ($)</div>
        </div>

        <div className="matrix-row ">
          <div className="text-black text-lg font-bold ">LAST 12 MONTHS</div>
          <div className="matrix-cell">
            <NumberInput
              value={ticketingVolume.lastYearEvents.toString()}
              onChange={(value) => handleNumberChange('lastYearEvents', value)}
              placeholder="Fill in"
            />
          </div>
          <div className="matrix-cell">
            <NumberInput
              value={ticketingVolume.lastYearTickets.toString()}
              onChange={(value) => handleNumberChange('lastYearTickets', value)}
              placeholder="Fill in"
            />
          </div>
          <div className="matrix-cell">
            <CurrencyInput
              value={ticketingVolume.lastYearSales.toString()}
              onChange={(value) => handleCurrencyChange('lastYearSales', value)}
              placeholder="Fill in"
            />
          </div>
        </div>

        <div className="matrix-row">
          <div className="text-black text-lg font-bold ">NEXT 12 MONTHS</div>
          <div className="matrix-cell">
            <NumberInput
              value={ticketingVolume.nextYearEvents.toString()}
              onChange={(value) => handleNumberChange('nextYearEvents', value)}
              placeholder="Fill in"
            />
          </div>
          <div className="matrix-cell">
            <NumberInput
              value={ticketingVolume.nextYearTickets.toString()}
              onChange={(value) => handleNumberChange('nextYearTickets', value)}
              placeholder="Fill in"
            />
          </div>
          <div className="matrix-cell">

            <CurrencyInput
              value={ticketingVolume.nextYearSales.toString()}
              onChange={(value) => handleCurrencyChange('nextYearSales', value)}
              placeholder="Fill in"
            />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default TicketingVolumeStep; 