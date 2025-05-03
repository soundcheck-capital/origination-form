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

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, min, max } = e.target;
    const percentage = ((parseInt(value) - parseInt(min)) / (parseInt(max) - parseInt(min))) * 100;
    e.target.style.background = `linear-gradient(to right, #F99927 0%, #F99927 ${percentage}%, #ddd ${percentage}%, #ddd 100%)`;
    dispatch(updateFundsInfo({ [name]: value }));
  };

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
        <input
          type="range"
          name="funds"
          min="0"
          max="1000000"
          step="10000"
          value={fundsInfo.funds}
          onChange={handleSliderChange}
          className="slider"
          style={{
            background: `linear-gradient(to right, #F99927 0%, #F99927 ${(parseInt(fundsInfo.funds) / 1000000) * 100}%, #ddd ${(parseInt(fundsInfo.funds) / 1000000) * 100}%, #ddd 100%)`
          }}
        />
        <span className="slider-value">${parseInt(fundsInfo.funds).toLocaleString()}</span>
      </div>

      <div className="slider-group">
        <label className="slider-label">Target recoupment period</label>
        <input
          type="range"
          name="recoupmentPeriod"
          min="1"
          max="24"
          step="1"
          value={fundsInfo.recoupmentPeriod}
          onChange={handleSliderChange}
          className="slider"
          style={{
            background: `linear-gradient(to right, #F99927 0%, #F99927 ${((parseInt(fundsInfo.recoupmentPeriod) - 1) / 23) * 100}%, #ddd ${((parseInt(fundsInfo.recoupmentPeriod) - 1) / 23) * 100}%, #ddd 100%)`
          }}
        />
        <span className="slider-value">{fundsInfo.recoupmentPeriod} months</span>
      </div>

      <div className="slider-group">
        <label className="slider-label">% recoupment from ticket sales</label>
        <input
          type="range"
          name="recoupmentPercentage"
          min="0"
          max="100"
          step="1"
          value={fundsInfo.recoupmentPercentage}
          onChange={handleSliderChange}
          className="slider"
          style={{
            background: `linear-gradient(to right, #F99927 0%, #F99927 ${parseInt(fundsInfo.recoupmentPercentage)}%, #ddd ${parseInt(fundsInfo.recoupmentPercentage)}%, #ddd 100%)`
          }}
        />
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