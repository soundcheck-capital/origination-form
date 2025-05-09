import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateCompanyInfo } from '../store/formSlice';

const companyTypes = [
  'Promoter',
  'Venue',
  'Festival',
  'Performing Arts Center',
  'Theatre',
  'Movie Theatre',
  'Sports Team',
  'Museum',
  'Attraction',
  'Other'
];  

const yearsInBusiness = [
  'Less than 1 year',
  '1-2 years',
  '2-5 years',
  '5-10 years',
  'More than 10 years',
 
];


const CompanyInfoStep: React.FC = () => {
  const dispatch = useDispatch();
  const companyInfo = useSelector((state: RootState) => state.form.formData.companyInfo);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(updateCompanyInfo({ [name]: value }));
  };

  return (
    <div className="form-step">
      <h2 className="step-title">Tell us about your business</h2>
      <h3 className="step-subtitle" style={{ color: '#F99927' }}>Company Information</h3>
      
      <div className="form-group">
        <input
          type="text"
          name="name"
          value={companyInfo.name}
          onChange={handleChange}
          placeholder="Name of your company"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <select
          name="yearsInBusiness"
          value={companyInfo.yearsInBusiness}
          onChange={handleChange}
          className="form-control"
        >
          <option value="">Years in business</option>
          {yearsInBusiness.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <input
          type="number"
          name="employees"
          value={companyInfo.employees == 0 ? '' : companyInfo.employees}
          onChange={handleChange}
          placeholder="Number of employees"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <select
          name="type"
          value={companyInfo.type}
          onChange={handleChange}
          className="form-control"
        >
          <option value="">Company Type</option>
          {companyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <input
          type="text"
          name="socials"
          value={companyInfo.socials}
          onChange={handleChange}
          placeholder="Company Socials (Instagram, websites)"
          className="form-control"
        />
      </div>

      
    </div>
  );
};

export default CompanyInfoStep; 