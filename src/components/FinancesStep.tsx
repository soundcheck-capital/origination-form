import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateFinancesInfo } from '../store/form/formSlice';
const debtTypes = [
  'Credit card debt',
  'Account payables',
  'Terms loans',
  'Merchant Cash Advance', 
  'Line of Credit', 'Term Loan',
   'Equipment Loan',
    'SBA Loan',
     'Bank Note', 'Shareholder Loan', 'Convertible Note',
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

    if (name === 'filedLastYearTaxes' && isYes) {
      dispatch(updateFinancesInfo({
        filedLastYearTaxes: true,
        lastYearTaxes:[]
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

  const handleFileChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        dispatch(updateFinancesInfo({ [field]: content }));
      };
      reader.readAsDataURL(file);
    }
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
    <div className="space-y-6">
          <div className="flex flex-col gap-6 mb-8">
        <label>{question}</label>
        <div className="flex items-center space-x-8">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name={name}
              value="yes"
              checked={financesInfo[name]}
              onChange={handleRadioChange}
              className="mr-2 accent-rose-500 size-6"
            />
            Yes
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name={name}
              value="no"
              checked={!financesInfo[name]}
              onChange={handleRadioChange}
              className="mr-2 accent-rose-500 size-6"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  placeholder="outstanding balance"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
      )}
      {name === 'filedLastYearTaxes' && financesInfo[name] && (
        <div className="conditional-content">
         <div className="space-y-2">
        <p className="upload-description">Last year tax file</p>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange('lastYearTaxes')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
        </div>
      )}
    </div>
  );

  return (

    <div className="w-full flex flex-col p-4 justify-center items-center">
          
      <p className="text-gray-600 mb-8 text-2xl font-bold ">Tell us about your finances</p>
  
      {renderQuestion("Have you filed last year's business taxes?", 'filedLastYearTaxes')}
      {renderQuestion("Do you have any business debt or material liabilities?", 'hasBusinessDebt')}
      {financesInfo.hasBusinessDebt && financesInfo.debts.length > 0 && renderQuestion("Are any of these liabilities not within terms and/or overdue?", 'hasOverdueLiabilities')}
      {renderQuestion("Are you currently leasing your business location?", 'isLeasingLocation', true)}
      {renderQuestion("Does this legal entity have any outstanding tax liens?", 'hasTaxLiens')}
      {renderQuestion("Does this business that you're currently applying or if you are a sole proprietor, do you have any judgments or lawsuits?", 'hasJudgments')}
      {renderQuestion("Has this business that you're currently applying for (or, if you are a sole proprietor, have you) applied for bankruptcy in the last two years?", 'hasBankruptcy')}
      {renderQuestion("Has any ownership of your business changed in the last two years?", 'ownershipChanged')}
    </div>
  );
};

export default FinancesStep; 