import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateCompanyInfo } from '../store/formSlice';

const businessTypes = [
  'Sole proprietorship',
  'Partnership',
  'Limited liability company (LLC)',
  'Corporation'
];

const usStates =
  ['Alabama',
'Alaska',
'American Samoa',
'Arizona', 'Arkansas',
'California',
'Colorado',
'Connecticut',
'Delaware',
'District of Columbia',
'Federated States of Micronesia',
'Florida',
'Georgia',
'Guam',
'Hawaii',
'Idaho',
'Illinois',
'Indiana',
'Iowa',
'Kansas',
'Kentucky',
'Louisiana',
'Maine',
'Marshall Islands',
'Maryland',
'Massachusetts',
'Michigan',
'Minnesota',
'Mississippi',
'Missouri',
'Montana',
'Nebraska',
'Nevada',
'New Hampshire',
'New Jersey',
'New Mexico',
'New York',
'North Carolina',
'North Dakota',
'Northern Mariana Islands',
'Ohio',
'Oklahoma',
'Oregon',
'Palau',
'Pennsylvania',
'Puerto Rico',
'Rhode Island',
'South Carolina',
'South Dakota',
'Tennessee',
'Texas',
'Utah',
'Vermont',
'Virgin Island',
'Virginia',
'Washington',
'West Virginia',
'Wisconsin',
'Wyoming']
  ;

const LegalInfoStep: React.FC = () => {
  const dispatch = useDispatch();
  const companyInfo = useSelector((state: RootState) => state.form.formData.companyInfo);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(updateCompanyInfo({ [name]: value }));
  };

  return (
    <div className="form-step">
      <h2 className="step-title">Let's get to know each other</h2>
      <h3 className="step-subtitle" style={{ color: '#F99927' }}>Legal Information</h3>

      <div className="form-group">
        <input
          type="text"
          name="name"
          value={companyInfo.name}
          onChange={handleInputChange}
          placeholder="Legal entity name"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <select
          name="type"
          value={companyInfo.type}
          onChange={handleInputChange}
          className="form-control"
        >
          <option value="">Select business type</option>
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
          name="address"
          value={companyInfo.address.street}
          onChange={handleInputChange}
          placeholder="Legal entity address"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          name="zipCode"
          value={companyInfo.address.zipcode}
          onChange={handleInputChange}
          placeholder="ZIP code"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          name="city"
          value={companyInfo.address.city}
          onChange={handleInputChange}
          placeholder="City"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <select
          name="state"
          value={companyInfo.address.state}
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
          name="taxId"
          value={companyInfo.taxId}
          onChange={handleInputChange}
          placeholder="Company Tax ID (EIN)"
          className="form-control"
        />
      </div>
    </div>
  );
};

export default LegalInfoStep; 