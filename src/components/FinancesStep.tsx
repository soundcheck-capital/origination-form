import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateFinancesInfo } from '../store/formSlice';

const debtTypes = [
  'Credit card debt',
  'Account payables',
  'Terms loans',
  'Other'
];

const FinancesStep: React.FC = () => {
  const dispatch = useDispatch();
  const financesInfo = useSelector((state: RootState) => state.form.financesInfo);

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isYes = value === 'yes';
    dispatch(updateFinancesInfo({ [name]: isYes }));
    
    // Automatically add a debt row when answering Yes
    if (name === 'hasBusinessDebt' && isYes && financesInfo.debts.length === 0) {
      dispatch(updateFinancesInfo({
        debts: [{ type: '', balance: '' }]
      }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    dispatch(updateFinancesInfo({ leaseEndDate: value }));
  };

  const handleDebtTypeChange = (index: number, value: string) => {
    const newDebts = [...financesInfo.debts];
    newDebts[index] = { ...newDebts[index], type: value };
    dispatch(updateFinancesInfo({ debts: newDebts }));
  };

  const handleDebtBalanceChange = (index: number, value: string) => {
    const newDebts = [...financesInfo.debts];
    newDebts[index] = { ...newDebts[index], balance: value };
    dispatch(updateFinancesInfo({ debts: newDebts }));
  };

  const addDebt = () => {
    dispatch(updateFinancesInfo({
      debts: [...financesInfo.debts, { type: '', balance: '' }]
    }));
  };

  const removeDebt = (index: number) => {
    const newDebts = financesInfo.debts.filter((_, i) => i !== index);
    dispatch(updateFinancesInfo({ debts: newDebts }));
  };

  const renderQuestion = (question: string, name: keyof Pick<typeof financesInfo, 'filedLastYearTaxes' | 'hasBusinessDebt' | 'hasOverdueLiabilities' | 'isLeasingLocation' | 'hasTaxLiens' | 'hasJudgments' | 'hasBankruptcy' | 'ownershipChanged'>, showDateInput = false) => (
    <div className="form-group">
      <div className="question-row">
        <label>{question}</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name={name}
              value="yes"
              checked={financesInfo[name]}
              onChange={handleRadioChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name={name}
              value="no"
              checked={!financesInfo[name]}
              onChange={handleRadioChange}
            />
            No
          </label>
        </div>
      </div>
      {name === 'hasBusinessDebt' && financesInfo[name] && (
        <div className="conditional-content">
          <div className="add-debt-container">
            <span className="add-debt-link" onClick={addDebt}>
              + Add Debt
            </span>
          </div>
          <div className="debts-container">
            {financesInfo.debts.map((debt, index) => (
              <div key={index} className="debt-row">
                <select
                  value={debt.type}
                  onChange={(e) => handleDebtTypeChange(index, e.target.value)}
                  className="form-control"
                >
                  <option value="">Select type of debt</option>
                  {debtTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={debt.balance}
                  onChange={(e) => handleDebtBalanceChange(index, e.target.value)}
                  placeholder="Current outstanding balance"
                  className="form-control"
                />
                <button
                  className="btn-icon remove-debt"
                  onClick={() => removeDebt(index)}
                  title="Remove debt"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {showDateInput && financesInfo[name] && (
        <div className="conditional-content">
          <label className="radio-label">If so, what is the lease end date?</label>
          <input
            type="date"
            value={financesInfo.leaseEndDate}
            onChange={handleDateChange}
            className="form-control"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="form-step">
      <h2 className="step-title">Let's get to know each other</h2>
      <h3 className="step-subtitle" style={{ color: '#F99927' }}>Finances</h3>

      {renderQuestion("Have you filed last year's business taxes?", 'filedLastYearTaxes')}
      {renderQuestion("Do you have any business debt or material liabilities?", 'hasBusinessDebt')}
      {renderQuestion("Are any of these liabilities not within terms and/or overdue?", 'hasOverdueLiabilities')}
      {renderQuestion("Are you currently leasing your business location?", 'isLeasingLocation', true)}
      {renderQuestion("Does this legal entity have any outstanding tax liens?", 'hasTaxLiens')}
      {renderQuestion("Does this business that you're currently applying or if you are a sole proprietor, do you have any judgments or lawsuits?", 'hasJudgments')}
      {renderQuestion("Has this business that you're currently applying for (or, if you are a sole proprietor, have you) applied for bankruptcy in the last two years?", 'hasBankruptcy')}
      {renderQuestion("Has any ownership of your business changed in the last two years?", 'ownershipChanged')}
    </div>
  );
};

export default FinancesStep; 