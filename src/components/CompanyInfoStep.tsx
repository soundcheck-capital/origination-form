import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateCompanyInfo } from '../store/form/formSlice';

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

const memberships = [
  'NIVA (National Independent Venue Association)',
  'Promotores Unidos',
  'NATO (National Association of Theater Owners)',
  'Other'
];
const CompanyInfoStep: React.FC = () => {
  const dispatch = useDispatch();
  const companyInfo = useSelector((state: RootState) => state.form.formData.companyInfo);
  const ticketingInfo = useSelector((state: RootState) => state.form.formData.ticketingInfo);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(updateCompanyInfo({ [name]: value }));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <p className="text-gray-600 mb-8 text-2xl font-bold mt-10 ">Company Information</p>

      <div className="relative w-full max-w-md mb-10">
        <input type="text" id="floating_outlined" value={companyInfo.name}
          name="name"
          className="block w-full p-4 text-sm text-gray-900 rounded-2xl text-gray-500 border-2 border-gray-300 focus:border-rose-300 peer focus:ring-1 focus:ring-rose-500 focus:outline-none" placeholder=" " required
          onChange={handleChange}
        />
        <label htmlFor="floating_outlined"
          className="absolute text-sm text-gray-500 bg-white text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] 
           px-2 peer-focus:px-2 peer-focus:text-gray-500 peer-focus:text-rose-500 peer-placeholder-shown:scale-100 
          peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Company Name</label>
      </div>


      <div className="relative w-full max-w-md mb-10">
        <select
          name="type"
          value={companyInfo.type}
          onChange={handleChange}
          className="block w-full p-4 text-sm text-gray-900 rounded-2xl text-gray-500 border-2 border-gray-300 focus:border-rose-300 peer focus:ring-1 focus:ring-rose-500 focus:outline-none"
        >
          {companyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}

        </select>
        <label htmlFor="floating_outlined"
          className="absolute text-sm text-gray-500 bg-white text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] 
           px-2 peer-focus:px-2 peer-focus:text-gray-500 peer-focus:text-rose-500 peer-placeholder-shown:scale-100 
          peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Company Type</label>
      </div>


      <div className="relative w-full max-w-md mb-10">
        <select
          name="yearsInBusiness"
          value={companyInfo.yearsInBusiness}
          onChange={handleChange}
          className="block w-full p-4 text-sm text-gray-900 rounded-2xl text-gray-500 border-2 border-gray-300 focus:border-rose-300 peer focus:ring-1 focus:ring-rose-500 focus:outline-none"
        >
          <option value=""></option>
          {yearsInBusiness.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <label htmlFor="floating_outlined"
          className="absolute text-sm text-gray-500 bg-white text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] 
           px-2 peer-focus:px-2 peer-focus:text-gray-500 peer-focus:text-rose-500 peer-placeholder-shown:scale-100 
          peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Years in Business</label>
      </div>

      <div className="relative w-full max-w-md mb-10">
        <input
          type="number"
          name="employees"
          value={companyInfo.employees}
          onChange={handleChange}
          className="block w-full p-4 text-sm text-gray-900 rounded-2xl text-gray-500 border-2 border-gray-300 focus:border-rose-300 peer focus:ring-1 focus:ring-rose-500 focus:outline-none"
          placeholder=""
        />
        <label htmlFor="floating_outlined"
          className="absolute text-sm text-gray-500 bg-white text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] 
           px-2 peer-focus:px-2 peer-focus:text-gray-500 peer-focus:text-rose-500 peer-placeholder-shown:scale-100 
          peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Number of Employees</label>
      </div>

      <div className="relative w-full max-w-md mb-10">
        <input
          type="text"
          name="socials"
          value={companyInfo.socials}
          onChange={handleChange}
          placeholder=""
          className="block w-full p-4 text-sm text-gray-900 rounded-2xl text-gray-500 border-2 border-gray-300 focus:border-rose-300 peer focus:ring-1 focus:ring-rose-500 focus:outline-none"
        />
        <label htmlFor="floating_outlined"
          className="absolute text-sm text-gray-500 bg-white text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] 
           px-2 peer-focus:px-2 peer-focus:text-gray-500 peer-focus:text-rose-500 peer-placeholder-shown:scale-100 
          peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Social Media</label>
      </div>

      <div className="relative w-full max-w-md mb-10">
        <label htmlFor="floating_outlined"
          className="absolute text-sm text-gray-500 bg-white text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] 
           px-2 peer-focus:px-2 peer-focus:text-gray-500 peer-focus:text-rose-500 peer-placeholder-shown:scale-100 
          peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Are you a member of?</label>

        <select
          name="membership"
          value={ticketingInfo.membership}
          onChange={handleChange}
          className="block w-full p-4 text-sm text-gray-900 rounded-2xl text-gray-500 border-2 border-gray-300 focus:border-rose-300 peer focus:ring-1 focus:ring-rose-500 focus:outline-none"
        >
          <option value=""></option>
          {memberships.map((member) => (
            <option key={member} value={member}>
              {member}
            </option>
          ))}
        </select>

      </div>


    </div>
  );
};

export default CompanyInfoStep; 