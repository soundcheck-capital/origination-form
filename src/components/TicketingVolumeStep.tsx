import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateVolumeInfo } from '../store/formSlice';
import { formatCurrency } from '../utils/format';

interface CurrencyInputProps {
  fieldName: string;
  initialValue?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ fieldName, initialValue = "" }) => {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [displayValue, setDisplayValue] = useState(() => formatCurrency(initialValue));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Autorise suppression
    const cleanInput = input.replace(/[$,]/g, '');
    
    if (cleanInput === '') {
      setDisplayValue('');
      dispatch(updateVolumeInfo({ [fieldName]: '' }));
      return;
    }
  
    // Autorise chiffres + point décimal (y compris entrée partielle comme "12.")
    if (!/^\d*\.?\d*$/.test(cleanInput)) return;
  
    // Ne formatte pas tant qu'on est sur une saisie partielle (ex: "12.")
    if (cleanInput.endsWith('.')) {
      setDisplayValue(cleanInput);
      return;
    }
  
    const numericValue = parseFloat(cleanInput);
    if (isNaN(numericValue)) return;
  
    const newFormatted = formatCurrency(numericValue);
    setDisplayValue(newFormatted);
    dispatch(updateVolumeInfo({ [fieldName]: numericValue }));
  
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (el) el.setSelectionRange(el.value.length, el.value.length);
    });
  };
  

  return (
    <input
      type="text"
      ref={inputRef}
      name={fieldName}
      value={displayValue}
      onChange={handleChange}
      placeholder="Online Gross Ticket Sales ($)"
      className="form-control"
    />
  );
};

const TicketingVolumeStep: React.FC = () => {
  const dispatch = useDispatch();
  const volumeInfo = useSelector((state: RootState) => state.form.formData.volumeInfo);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(updateVolumeInfo({ [name]: value }));
  };

  return (
    <div className="form-step">
      <h2 className="step-title">Let's get to know each other</h2>
      <h3 className="step-subtitle" style={{ color: '#F99927' }}>Annual ticketing volume</h3>
      
      <p className="step-description">
        We use your historical ticket sales, 3rd party and proprietary data to determine your advance eligibility in minutes. We only collect the information we need to provide you the best possible offer.
      </p>

      <div className="volume-section">
        <h3 className="section-title">Last 12 months</h3>
        <div className="form-group">
          <input
            type="number"
            name="lastYearEvents"
            value={volumeInfo.lastYearEvents}
            onChange={handleChange}
            placeholder="Number of events"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="lastYearTickets"
            value={volumeInfo.lastYearTickets}
            onChange={handleChange}
            placeholder="Number of tickets sold online"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <CurrencyInput
            fieldName="lastYearSales"
            initialValue={volumeInfo.lastYearSales}
          />
        </div>
      </div>

      <div className="volume-section">
        <h3 className="section-title">Next 12 months</h3>
        <div className="form-group">
          <input
            type="number"
            name="nextYearEvents"
            value={volumeInfo.nextYearEvents}
            onChange={handleChange}
            placeholder="Number of events"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="nextYearTickets"
            value={volumeInfo.nextYearTickets}
            onChange={handleChange}
            placeholder="Number of tickets sold online"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <CurrencyInput
            fieldName="nextYearSales"
            initialValue={volumeInfo.nextYearSales}
          />
        </div>
      </div>
    </div>
  );
};

export default TicketingVolumeStep; 