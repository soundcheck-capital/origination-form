import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateOwnershipInfo } from '../store/formSlice';

const usStates = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const OwnershipStep: React.FC = () => {
  const dispatch = useDispatch();
  const ownershipInfo = useSelector((state: RootState) => state.form.ownershipInfo);
  const companyInfo = useSelector((state: RootState) => state.form.formData.companyInfo);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(updateOwnershipInfo({ [name]: value }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sameAddress = e.target.value === 'yes';
    dispatch(updateOwnershipInfo({ 
      sameAddress,
      ...(sameAddress ? {
        address: companyInfo.address,
        city: companyInfo.city,
        zipCode: companyInfo.zipCode,
        state: companyInfo.state
      } : {})
    }));
  };

  return (
    <div className="form-step">
      <h2 className="step-title">Let's get to know each other</h2>
      <h3 className="step-subtitle" style={{ color: '#F99927' }}>Ownership</h3>

      <div className="form-group">
        <input
          type="text"
          name="name"
          value={ownershipInfo.name}
          onChange={handleInputChange}
          placeholder="Name"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          name="ownership"
          value={ownershipInfo.ownership}
          onChange={handleInputChange}
          placeholder="Ownership"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          name="address"
          value={ownershipInfo.address}
          onChange={handleInputChange}
          placeholder="Company Address"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          name="city"
          value={ownershipInfo.city}
          onChange={handleInputChange}
          placeholder="City"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          name="zipCode"
          value={ownershipInfo.zipCode}
          onChange={handleInputChange}
          placeholder="ZIP code"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <select
          name="state"
          value={ownershipInfo.state}
          onChange={handleInputChange}
          className="form-control"
        >
          <option value="">Select state</option>
          {usStates.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="radio-label">Does the owner have the same address as the business?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="sameAddress"
              value="yes"
              checked={ownershipInfo.sameAddress}
              onChange={handleRadioChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="sameAddress"
              value="no"
              checked={!ownershipInfo.sameAddress}
              onChange={handleRadioChange}
            />
            No
          </label>
        </div>
      </div>

      {!ownershipInfo.sameAddress && (
        <>
          <div className="form-group">
            <input
              type="text"
              name="ownerAddress"
              value={ownershipInfo.ownerAddress}
              onChange={handleInputChange}
              placeholder="Owner Address"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="ownerCity"
              value={ownershipInfo.ownerCity}
              onChange={handleInputChange}
              placeholder="Owner City"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="ownerZipCode"
              value={ownershipInfo.ownerZipCode}
              onChange={handleInputChange}
              placeholder="Owner ZIP code"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <select
              name="ownerState"
              value={ownershipInfo.ownerState}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">Select owner state</option>
              {usStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
};

export default OwnershipStep; 