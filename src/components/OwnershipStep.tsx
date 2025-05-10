import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateOwnershipInfo } from '../store/formSlice';

interface Owner {
  id: string;
  name: string;
  ownershipPercentage: string;
  sameAddress: boolean;
  ownerAddress: string;
  ownerCity: string;
  ownerState: string;
  ownerZipCode: string;
}

const usStates = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const OwnershipStep: React.FC = () => {
  const dispatch = useDispatch();
  const ownershipInfo = useSelector((state: RootState) => state.form.formData.ownershipInfo);
  const [owners, setOwners] = useState<Owner[]>(ownershipInfo.owners || []);

  useEffect(() => {
    if (owners.length === 0) {
      addOwner();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(updateOwnershipInfo({ [name]: value }));
  };

  const handleOwnerChange = (id: string, field: keyof Owner, value: string | boolean) => {
    const updatedOwners = owners.map(owner => 
      owner.id === id ? { ...owner, [field]: value } : owner
    );
    setOwners(updatedOwners);
    dispatch(updateOwnershipInfo({ owners: updatedOwners }));
  };

  const addOwner = () => {
    const newOwner: Owner = {
      id: Date.now().toString(),
      name: '',
      ownershipPercentage: '',
      sameAddress: true,
      ownerAddress: '',
      ownerCity: '',
      ownerState: '',
      ownerZipCode: ''
    };
    const updatedOwners = [...owners, newOwner];
    setOwners(updatedOwners);
    dispatch(updateOwnershipInfo({ owners: updatedOwners }));
  };

  const removeOwner = (id: string) => {
    if (owners.length > 1) {
      const updatedOwners = owners.filter(owner => owner.id !== id);
      setOwners(updatedOwners);
      dispatch(updateOwnershipInfo({ owners: updatedOwners }));
    }
  };

  const calculateTotalOwnership = () => {
    return owners.reduce((total, owner) => {
      return total + (parseFloat(owner.ownershipPercentage) || 0);
    }, 0);
  };

  const totalOwnership = calculateTotalOwnership();
  const hasOwnershipError = totalOwnership < 80;

  return (
    <div className="form-step">
      <h2 className="step-title">Business & Ownership</h2>
      <h3 className="step-subtitle" style={{ color: '#F99927' }}>Tell us about your business legal information</h3>
      
      <p className="step-description">
        We use your historical ticket sales, 3rd party and proprietary data to determine your advance eligibility in minutes. We only collect the information we need to provide you the best possible offer.
      </p>

      <div className="form-group">
        <input
          type="text"
          name="companyName"
          value={ownershipInfo.companyName}
          onChange={handleInputChange}
          placeholder="Enter company name"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          name="companyAddress"
          value={ownershipInfo.companyAddress}
          onChange={handleInputChange}
          placeholder="Enter company address"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          name="companyCity"
          value={ownershipInfo.companyCity}
          onChange={handleInputChange}
          placeholder="Enter company city"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <select
          name="companyState"
          value={ownershipInfo.companyState}
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
        <input
          type="text"
          name="companyZipCode"
          value={ownershipInfo.companyZipCode}
          onChange={handleInputChange}
          placeholder="Enter company ZIP code"
          className="form-control"
        />
      </div>

      <div className="owners-container">
        <h4 className="section-title">Owners</h4>
        {owners.map((owner) => (
          <div key={owner.id} className="owner-section">
            <div className="owner-header">
              <h5>Owner Information</h5>
              {owners.length > 1 && (
                <button
                  className="btn-icon"
                  onClick={() => removeOwner(owner.id)}
                  type="button"
                >
                  ×
                </button>
              )}
            </div>

            <div className="owner-fields">
              <div className="form-group">
                <input
                  type="text"
                  value={owner.name}
                  onChange={(e) => handleOwnerChange(owner.id, 'name', e.target.value)}
                  placeholder="Enter owner name"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  value={owner.ownershipPercentage}
                  onChange={(e) => handleOwnerChange(owner.id, 'ownershipPercentage', e.target.value)}
                  placeholder="Enter ownership percentage"
                  className={`form-control ${hasOwnershipError ? 'error' : ''}`}
                />
                {hasOwnershipError && (
                  <span className="error-message">Ownership percentage must be higher or equal than 80%</span>
                )}
              </div>

              <div className="form-group">
                <div className="radio-label-container">
                  <label className="radio-label">Same address as company?</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        checked={owner.sameAddress}
                        onChange={(e) => handleOwnerChange(owner.id, 'sameAddress', e.target.checked)}
                      />
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        checked={!owner.sameAddress}
                        onChange={(e) => handleOwnerChange(owner.id, 'sameAddress', !e.target.checked)}
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>

              {!owner.sameAddress && (
                <div className="owner-address-fields">
                  <div className="form-group">
                    <input
                      type="text"
                      value={owner.ownerAddress}
                      onChange={(e) => handleOwnerChange(owner.id, 'ownerAddress', e.target.value)}
                      placeholder="Enter owner address"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      value={owner.ownerCity}
                      onChange={(e) => handleOwnerChange(owner.id, 'ownerCity', e.target.value)}
                      placeholder="Enter owner city"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <select
                      value={owner.ownerState}
                      onChange={(e) => handleOwnerChange(owner.id, 'ownerState', e.target.value)}
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
                    <input
                      type="text"
                      value={owner.ownerZipCode}
                      onChange={(e) => handleOwnerChange(owner.id, 'ownerZipCode', e.target.value)}
                      placeholder="Enter owner ZIP code"
                      className="form-control"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <button
          className="add-owner"
          onClick={addOwner}
          type="button"
        >
          + Add Owner
        </button>
      </div>
    </div>
  );
};

export default OwnershipStep; 