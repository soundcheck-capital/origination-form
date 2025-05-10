import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateOwnershipInfo } from '../store/formSlice';
import { usStates } from '../utils/usStates';

const businessTypes = [
  'Sole proprietorship',
  'Partnership',
  'Limited liability company (LLC)',
  'Corporation'
];



const LegalInfoStep: React.FC = () => {
  const dispatch = useDispatch();
  const ownershipInfo = useSelector((state: RootState) => state.form.formData.ownershipInfo);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(updateOwnershipInfo({ [name]: value }));
  };

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
          placeholder="Legal Entity Name"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="dba"
          value={ownershipInfo.dba}
          onChange={handleInputChange}
          placeholder="DBA"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="companyAddress"
          value={ownershipInfo.companyAddress}
          onChange={handleInputChange}
          placeholder="Legal Entity Address"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          name="companyCity"
          value={ownershipInfo.companyCity}
          onChange={handleInputChange}
          placeholder="Legal Entity City"
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
          <option value="">Select Legal Entity State</option>
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
          placeholder="Legal Entity ZIP code"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <select
          name="companyType"
          value={ownershipInfo.companyType}
          onChange={handleInputChange}
          className="form-control"
        >
          <option value="">Select Legal Entity Type</option> 
          {businessTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <input
          type="text"
          name="ein"
          value={ownershipInfo.ein}
          onChange={handleInputChange}
          placeholder="Tax ID (EIN)"
          className="form-control"
        />
      </div>
  
    </div>
    
          
  );
  
};

export default LegalInfoStep;   