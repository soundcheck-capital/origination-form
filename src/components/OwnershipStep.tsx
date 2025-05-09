import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateOwnershipInfo } from '../store/formSlice';

interface OwnerInterface {
  id: string;
  name: string;
  ownershipPercentage: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
  };
  sameAddress: boolean;

}


const OwnershipStep: React.FC = () => {
  const dispatch = useDispatch();
  const ownershipInfo = useSelector((state: RootState) => state.form.formData.ownershipInfo);

  useEffect(() => {
    if (ownershipInfo.owners.length === 0) {
      dispatch(updateOwnershipInfo({
        ...ownershipInfo,
        owners:
        [{
          id: '',
          name: '',
          ownershipPercentage: 0,
          sameAddress: false,
          address: {street: '', city: '', zipcode: '', state: '', country: ''},
        }]
      }));
    }
  }, [dispatch, ownershipInfo]);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(updateOwnershipInfo({
      ...ownershipInfo,
      [name]: value
    }));
  };

  const handleOwnerChange = (index: number, field: string, value: string) => {
    const updatedOwners = [...ownershipInfo.owners];
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      updatedOwners[index] = {
        ...updatedOwners[index],
      };
    } else {
      updatedOwners[index] = {
        ...updatedOwners[index],
        [field]: value
      };
    }
    dispatch(updateOwnershipInfo({
      ...ownershipInfo,
      owners: updatedOwners
    }));
  };

  const addOwner = () => {
    dispatch(updateOwnershipInfo({
      ...ownershipInfo,
      owners: [
        ...ownershipInfo.owners,
        {
          id: '',
          name: '',
          ownershipPercentage: 0,
          sameAddress: false,
          address: {
            street: '',
            city: '',
            state: '',
            zipcode: '',
            country: ''
          }
        }
      ]
    }));
  };

  const removeOwner = (index: number) => {
    const updatedOwners = ownershipInfo.owners.filter((_, i: number) => i !== index);
    dispatch(updateOwnershipInfo({
      ...ownershipInfo,
      owners: updatedOwners
    }));
  };

  const calculateTotalOwnership = () => {
    let total = 0;
    ownershipInfo.owners.forEach(owner => {
      total += owner.ownershipPercentage;
    });
    return total;
  };

  const totalOwnership = calculateTotalOwnership();
  const hasOwnershipError = totalOwnership < 80;

  return (
    <div className="form-step">
      <h2 className="step-title">Let's get to know each other</h2>
      <h3 className="step-subtitle" style={{ color: '#F99927' }}>Ownership</h3>
      
      <p className="step-description">
        Please provide information about your company and its owners. We need this information to verify your business structure and ownership details.
      </p>

      <div className="form-group">
        <label className="form-label">Company Name</label>
        <input
          type="text"
          name="companyName"
          value={ownershipInfo.companyName}
          onChange={handleCompanyChange}
          className="form-control"
          placeholder="Enter your company name"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Company Address</label>
        <input
          type="text"
          name="companyAddress"
          value={ownershipInfo.companyAddress.street}
          onChange={handleCompanyChange}
          className="form-control"
          placeholder="Enter your company address"
        />
      </div>

      <div className="owners-container">
        <div className="owner-header">
          <h5>Owners</h5>
          <button className="add-owner" onClick={addOwner}>
            + Add Owner
          </button>
        </div>

          {ownershipInfo.owners.map((owner: OwnerInterface, index: number) => (
          <div key={index} className="owner-section">
            <div className="owner-header">
              <h5>Owner {index + 1}</h5>
              {index > 0 && (
                <button className="btn-icon" onClick={() => removeOwner(index)}>
                  ×
                </button>
              )}
            </div>
            <div className="owner-fields">
              <input
                type="text"
                value={owner.name}
                onChange={(e) => handleOwnerChange(index, 'name', e.target.value)}
                className="form-control"
                placeholder="Owner Name"
              />
             
              <input
                type="number"
                value={owner.ownershipPercentage}
                onChange={(e) => handleOwnerChange(index, 'ownershipPercentage', e.target.value)}
                className={`form-control ${hasOwnershipError ? 'error' : ''}`}
                placeholder="Ownership Percentage"
                min="0"
                max="100"
              />
              {hasOwnershipError && (
                <span className="error-message">Ownership percentage must be higher or equal than 80%</span>
              )}
              <div className="owner-address-fields">
                <input
                  type="text"
                  value={owner.address.street}
                  onChange={(e) => handleOwnerChange(index, 'address.street', e.target.value)}
                  className="form-control"
                  placeholder="Street Address"
                />
                <input
                  type="text"
                  value={owner.address.city}
                  onChange={(e) => handleOwnerChange(index, 'address.city', e.target.value)}
                  className="form-control"
                  placeholder="City"
                />
                <input
                  type="text"
                  value={owner.address.state}
                  onChange={(e) => handleOwnerChange(index, 'address.state', e.target.value)}
                  className="form-control"
                  placeholder="State"
                />
                <input
                  type="text"
                  value={owner.address.zipcode}
                  onChange={(e) => handleOwnerChange(index, 'address.zipcode', e.target.value)}
                  className="form-control"
                  placeholder="ZIP Code"
                />
                <input
                  type="text"
                  value={owner.address.country}
                  onChange={(e) => handleOwnerChange(index, 'address.country', e.target.value)}
                  className="form-control"
                  placeholder="Country"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnershipStep; 