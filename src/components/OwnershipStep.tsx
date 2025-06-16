import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import  updateOwnershipInfo from '../store/form/formSlice';

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

const companyTypes = [
  'Limited Liability Company (LLC)', 'Partnership', 'Corporation', 'Sole Proprietorship',
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

  const handleOwnerChange = (id: string, field: keyof Owner, value: string | boolean) => {
    const updatedOwners = owners.map(owner =>
      owner.id === id ? { ...owner, [field]: value } : owner
    );
    setOwners(updatedOwners);
   // dispatch(updateOwnershipInfo({ owners: updatedOwners }));
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
   // dispatch(updateOwnershipInfo({ owners: updatedOwners }));
  };

  const removeOwner = (id: string) => {
    if (owners.length > 1) {
      const updatedOwners = owners.filter(owner => owner.id !== id);
      setOwners(updatedOwners);
     // dispatch(updateOwnershipInfo({ owners: updatedOwners }));
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

    <div className="flex flex-col items-center justify-center w-full">
      <h3 className="text-gray-600 mb-8 text-2xl font-bold mt-10">Beneficial ownership & control person</h3>
      <p className="text-gray-400 mb-16 text-center px-20">Please carefully complete the information below and make sure that it is accurate including a complete address with city/state/zip and information about the control person and all beneficial owner(s) owning more than 20% of the company. If this information is inaccurate or incomplete, this could result in delay or denial of your application.</p>
     
      {owners.map((owner) => (
        <div key={owner.id} className="space-y-4 bg-white p-8 rounded-xl shadow-md border-rose-400 border-2 mb-10">
          <div className="">
            <label className='block text-sm font-medium text-gray-700 mb-2'>Owner Information</label>
            {owners.length > 1 && (
              <button
                className="text-sm text-gray-500 hover:text-red-500 focus:outline-none"
                onClick={() => removeOwner(owner.id)}
                type="button"
              >
                Delete owner
              </button>
            )}
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={owner.name}
              onChange={(e) => handleOwnerChange(owner.id, 'name', e.target.value)}
              placeholder="Enter owner name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={owner.ownershipPercentage}
              onChange={(e) => handleOwnerChange(owner.id, 'ownershipPercentage', e.target.value)}
              placeholder="Enter ownership percentage"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          
          </div>

          <div className="space-y-2">
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
              <div className="space-y-2">
                <input
                  type="text"
                  value={owner.ownerAddress}
                  onChange={(e) => handleOwnerChange(owner.id, 'ownerAddress', e.target.value)}
                  placeholder="Enter owner address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={owner.ownerCity}
                  onChange={(e) => handleOwnerChange(owner.id, 'ownerCity', e.target.value)}
                  placeholder="Enter owner city"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-2">
                <select
                  value={owner.ownerState}
                  onChange={(e) => handleOwnerChange(owner.id, 'ownerState', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">Select state</option>
                  {usStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={owner.ownerZipCode}
                  onChange={(e) => handleOwnerChange(owner.id, 'ownerZipCode', e.target.value)}
                  placeholder="Enter owner ZIP code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          )}
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

  );
};

export default OwnershipStep; 
