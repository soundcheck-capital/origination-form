import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateTicketingInfo } from '../store/formSlice';
import type { RootState } from '../store/store';

const TicketingInfoStep: React.FC = () => {
  const dispatch = useDispatch();
  const ticketingInfo = useSelector((state: RootState) => state.form.formData.ticketingInfo);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(updateTicketingInfo({ [name]: value }));
  };

  return (
    <div className="form-step">
      <h2 className="step-title">Let's get to know each other</h2>
      <h3 className="step-subtitle" style={{ color: '#F99927' }}>Ticketing Information</h3>

      <div className="form-group">
        <div className="field-group">
          <label className="field-label">Current ticketing partner</label>
          <input
            type="text"
            name="currentPartner"
            value={ticketingInfo.currentPartner}
            onChange={handleInputChange}
            placeholder="Please fill"
            className="form-control"
          />
        </div>
      </div>

      <div className="form-group">
        <div className="field-group">
          <label className="field-label">Settlement policy</label>
          <input
            type="text"
            name="settlementPolicy"
            value={ticketingInfo.settlementPolicy}
            onChange={handleInputChange}
            placeholder="Please fill"
            className="form-control"
          />
        </div>
      </div>

      <div className="form-group">
        <div className="field-group">
          <label className="field-label">Membership</label>
          <input
            type="text"
            name="membership"
            value={ticketingInfo.membership}
            onChange={handleInputChange}
            placeholder="Please fill"
            className="form-control"
          />
        </div>
      </div>
    </div>
  );
};

export default TicketingInfoStep; 