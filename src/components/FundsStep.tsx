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

  const yourFunds = parseFloat(fundsInfo.yourFunds) || 0;
  const lastYearSales = parseFloat(volumeInfo.lastYearSales) || 1;
  const minRecoupmentPercentage = (yourFunds / lastYearSales) * 100;
  const maxRecoupmentPercentage = Math.min(minRecoupmentPercentage * 12, 100);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, min, max } = e.target;
    const percentage = ((parseFloat(value) - parseFloat(min)) / (parseFloat(max) - parseFloat(min))) * 100;
    e.target.style.background = `linear-gradient(to right, #F99927 0%, #F99927 ${percentage}%, #ddd ${percentage}%, #ddd 100%)`;

    if (name === "recoupmentPeriod") {
      const months = parseInt(value);
      const recoupmentPercentage = Math.min(minRecoupmentPercentage * (12 / months), 100);
      dispatch(updateFundsInfo({
        recoupmentPeriod: months.toString(),
        recoupmentPercentage: recoupmentPercentage.toString()
      }));
    } else if (name === "recoupmentPercentage") {
      const percent = parseFloat(value);
      const newMonths = Math.max(1, Math.round(12 * (minRecoupmentPercentage / percent)));
      dispatch(updateFundsInfo({
        recoupmentPeriod: newMonths.toString(),
        recoupmentPercentage: percent.toString()
      }));
    } else {
      dispatch(updateFundsInfo({ [name]: value }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(updateFundsInfo({ [name]: value }));
  };

  const maxFundsValue = lastYearSales ? Math.round(lastYearSales * 0.2) : 0;

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
            step="1000"
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
          <span className="min-value">{minRecoupmentPercentage.toFixed(2)}%</span>
          <input
            type="range"
            name="recoupmentPercentage"
            min={minRecoupmentPercentage}
            max={maxRecoupmentPercentage}
            step="0.01"
            value={fundsInfo.recoupmentPercentage}
            onChange={handleSliderChange}
            className="slider"
            style={{
              background: `linear-gradient(to right, #F99927 0%, #F99927 ${((parseFloat(fundsInfo.recoupmentPercentage) - minRecoupmentPercentage) / (maxRecoupmentPercentage - minRecoupmentPercentage)) * 100}%, #ddd ${((parseFloat(fundsInfo.recoupmentPercentage) - minRecoupmentPercentage) / (maxRecoupmentPercentage - minRecoupmentPercentage)) * 100}%, #ddd 100%)`
            }}
          />
          <span className="max-value">{maxRecoupmentPercentage.toFixed(2)}%</span>
        </div>
        <span className="slider-value">{parseFloat(fundsInfo.recoupmentPercentage).toFixed(2)}%</span>
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
