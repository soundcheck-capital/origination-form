import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateVolumeInfo } from '../store/formSlice';

const VolumeStep: React.FC = () => {
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
          <input
            type="number"
            name="lastYearSales"
            value={volumeInfo.lastYearSales}
            onChange={handleChange}
            placeholder="Online Gross Tickets Sales ($)"
            className="form-control"
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
          <input
            type="number"
            name="nextYearSales"
            value={volumeInfo.nextYearSales}
            onChange={handleChange}
            placeholder="Online Gross Tickets Sales ($)"
            className="form-control"
          />
        </div>
      </div>
    </div>
  );
};

export default VolumeStep; 