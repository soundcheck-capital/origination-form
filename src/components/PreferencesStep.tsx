import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updatePreferences } from '../store/formSlice';
import type { RootState } from '../store/store';

const PreferencesStep: React.FC = () => {
  const dispatch = useDispatch();
  const preferences = useSelector((state: RootState) => state.form.formData.preferences);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    dispatch(updatePreferences({ [name]: checked }));
  };

  return (
    <div className="form-step">
      <h2>Préférences</h2>
      <div className="form-group checkbox">
        <label>
          <input
            type="checkbox"
            name="newsletter"
            checked={preferences.newsletter}
            onChange={handleChange}
          />
          S'abonner à la newsletter
        </label>
      </div>
      <div className="form-group checkbox">
        <label>
          <input
            type="checkbox"
            name="notifications"
            checked={preferences.notifications}
            onChange={handleChange}
          />
          Recevoir les notifications
        </label>
      </div>
    </div>
  );
};

export default PreferencesStep; 