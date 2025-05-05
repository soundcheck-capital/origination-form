import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateFundsInfo } from '../store/formSlice';

const fundUses = [
  'Artist deposit',
  'Show marketing',
  'Other show expenses',
  'Operational expenses',
  'Existing location improvement',
  'Opening a new location',
  'Short term cash flow needs',
  'Refinance my debt'
];

const FundsStep: React.FC = () => {
  const dispatch = useDispatch();
  const fundsInfo = useSelector((state: RootState) => state.form.formData.fundsInfo);
  const volumeInfo = useSelector((state: RootState) => state.form.formData.volumeInfo);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, min, max } = e.target;
    const percentage = ((parseInt(value) - parseInt(min)) / (parseInt(max) - parseInt(min))) * 100;
    e.target.style.background = `linear-gradient(to right, #F99927 0%, #F99927 ${percentage}%, #ddd ${percentage}%, #ddd 100%)`;
    dispatch(updateFundsInfo({ [name]: value }));
  };

  // Calculate max value for "Your funds" slider (20% of last year's sales)
  const maxFundsValue = volumeInfo.lastYearSales ? Math.round(parseFloat(volumeInfo.lastYearSales) * 0.2) : 0;

  // Calculate min/max values for recoupment percentage
  const lastYearSales = parseFloat(volumeInfo.lastYearSales) || 0;
  const lastYearTickets = parseFloat(volumeInfo.lastYearTickets) || 0;
  const lastYearSalesPerTicket = lastYearSales / lastYearTickets;
  const yourFunds = parseFloat(fundsInfo.yourFunds) || 0;
  const recoupmentPercentage = parseFloat(fundsInfo.recoupmentPercentage) || 0;
  const minRecoupmentPercentage = lastYearSales > 0 ? Math.round(yourFunds/((lastYearSales*recoupmentPercentage)*12)) : 0;
  const maxRecoupmentPercentage = minRecoupmentPercentage * 12;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(updateFundsInfo({ [name]: value }));
  };

  return (
    <div className="form-step">
      <h2 className="step-title">Let's get to know each other</h2>
      <h3 className="step-subtitle" style={{ color: '#F99927' }}>Personalize your funds</h3>

      <div className="slider-group">
        <label className="slider-label">Your funds</label>
        <div className="slider-range">
          <span className="min-value">$0</span>
          <input
            type="range"
            name="yourFunds"
            min="0"
            max={maxFundsValue}
            step="10000"
            value={fundsInfo.yourFunds}
            onChange={handleSliderChange}
            className="slider"
            style={{
              background: `linear-gradient(to right, #F99927 0%, #F99927 ${(parseInt(fundsInfo.yourFunds) / maxFundsValue) * 100}%, #ddd ${(parseInt(fundsInfo.yourFunds) / maxFundsValue) * 100}%, #ddd 100%)`
            }}
          />
          <span className="max-value">${maxFundsValue.toLocaleString()}</span>
        </div>
        <span className="slider-value">${parseInt(fundsInfo.yourFunds).toLocaleString()}</span>
      </div>

      <div className="slider-group">
        <label className="slider-label">Target recoupment period</label>
        <div className="slider-range">
          <span className="min-value">1 month</span>
          <input
            type="range"
            name="recoupmentPeriod"
            min="1"
            max="12"
            step="1"
            value={fundsInfo.recoupmentPeriod}
            onChange={handleSliderChange}
            className="slider"
            style={{
              background: `linear-gradient(to right, #F99927 0%, #F99927 ${((parseInt(fundsInfo.recoupmentPeriod) - 1) / 11) * 100}%, #ddd ${((parseInt(fundsInfo.recoupmentPeriod) - 1) / 11) * 100}%, #ddd 100%)`
            }}
          />
          <span className="max-value">12 months</span>
        </div>
        <span className="slider-value">{fundsInfo.recoupmentPeriod} months</span>
      </div>

      <div className="slider-group">
        <label className="slider-label">% recoupment from ticket sales</label>
        <div className="slider-range">
          <span className="min-value">{minRecoupmentPercentage}%</span>
          <input
            type="range"
            name="recoupmentPercentage"
            min={minRecoupmentPercentage}
            max={maxRecoupmentPercentage}
            step="1"
            value={fundsInfo.recoupmentPercentage}
            onChange={handleSliderChange}
            className="slider"
            style={{
              background: `linear-gradient(to right, #F99927 0%, #F99927 ${((parseInt(fundsInfo.recoupmentPercentage) - minRecoupmentPercentage) / (maxRecoupmentPercentage - minRecoupmentPercentage)) * 100}%, #ddd ${((parseInt(fundsInfo.recoupmentPercentage) - minRecoupmentPercentage) / (maxRecoupmentPercentage - minRecoupmentPercentage)) * 100}%, #ddd 100%)`
            }}
          />
          <span className="max-value">{maxRecoupmentPercentage}%</span>
        </div>
        <span className="slider-value">{fundsInfo.recoupmentPercentage}%</span>
      </div>

      <div className="form-group">
        <label className="select-label">How do you plan to use your funds?</label>
        <select
          name="fundUse"
          value={fundsInfo.fundUse}
          onChange={handleSelectChange}
          className="form-control"
        >
          <option value="">Select an option</option>
          {fundUses.map((use) => (
            <option key={use} value={use}>
              {use}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FundsStep; 