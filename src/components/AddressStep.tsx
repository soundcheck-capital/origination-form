import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateAddress } from '../store/formSlice';
import type { RootState } from '../store/store';

const AddressStep: React.FC = () => {
  const dispatch = useDispatch();
  const address = useSelector((state: RootState) => state.form.formData.address);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(updateAddress({ [name]: value }));
  };

  return (
    <div className="form-step">
      <h2>Adresse</h2>
      <div className="form-group">
        <label htmlFor="street">Rue</label>
        <input
          type="text"
          id="street"
          name="street"
          value={address.street}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="city">Ville</label>
        <input
          type="text"
          id="city"
          name="city"
          value={address.city}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="postalCode">Code Postal</label>
        <input
          type="text"
          id="postalCode"
          name="postalCode"
          value={address.postalCode}
          onChange={handleChange}
          required
        />
      </div>
    </div>
  );
};

export default AddressStep; 