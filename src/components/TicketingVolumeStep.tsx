import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateVolumeInfo } from '../store/formSlice';

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ value, onChange, placeholder }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const numericValue = input.replace(/[^0-9]/g, '');
    onChange(numericValue);
  };

  const formatValue = (value: string) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(value));
  };

  return (
    <input
      type="text"
      value={formatValue(value)}
      onChange={handleChange}
      placeholder={placeholder}
      className="form-control"
    />
  );
};

const TicketingVolumeStep: React.FC = () => {
  const dispatch = useDispatch();
  const ticketingVolume = useSelector((state: RootState) => state.form.formData.volumeInfo);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(updateVolumeInfo({ [name]: value }));
  };

  const handleCurrencyChange = (name: string, value: string) => {
    dispatch(updateVolumeInfo({ [name]: value }));
  };

  return (
    <div className="form-step">
      <h2 className="step-title">Tell us about your business</h2>
      <h3 className="step-subtitle" style={{ color: '#F99927' }}>Annual ticketing volume</h3>
      
      <p className="step-description">
        We use your historical ticket sales, 3rd party and proprietary data to determine your advance eligibility in minutes. We only collect the information we need to provide you the best possible offer.
      </p>

      <div className="volume-matrix">
        <div className="matrix-header">
          <div className="matrix-cell"></div>
          <div className="matrix-cell">Number of Events</div>
          <div className="matrix-cell">Number of Tickets sold online</div>
          <div className="matrix-cell">Online Gross Tickets Sales ($)</div>
        </div>

        <div className="matrix-row">
          <div className="matrix-cell">Last 12 months</div>
          <div className="matrix-cell">
            <input
              type="text"
              name="lastYearEvents"
              value={ticketingVolume.lastYearEvents}
              onChange={handleInputChange}
              placeholder="Fill in"
              className="form-control"
            />
          </div>
          <div className="matrix-cell">
            <input
              type="text"
              name="lastYearTickets"
              value={ticketingVolume.lastYearTickets}
              onChange={handleInputChange}
              placeholder="Fill in"
              className="form-control"
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
          <div className="matrix-cell">Next 12 months</div>
          <div className="matrix-cell">
            <input
              type="text"
              name="nextYearEvents"
              value={ticketingVolume.nextYearEvents}
              onChange={handleInputChange}
              placeholder="Fill in"
              className="form-control"
            />
          </div>
          <div className="matrix-cell">
            <input
              type="text"
              name="nextYearTickets"
              value={ticketingVolume.nextYearTickets}
              onChange={handleInputChange}
              placeholder="Fill in"
              className="form-control"
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
      </div>
    </div>
  );
};

export default TicketingVolumeStep; 