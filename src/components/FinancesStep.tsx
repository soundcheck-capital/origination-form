import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateFinancesInfo } from '../store/form/formSlice';
import StepTitle from './customComponents/StepTitle';

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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [visibleQuestions, setVisibleQuestions] = useState<number[]>([0]);

  interface Question {
    id: string;
    text: string;
    name: keyof Pick<typeof financesInfo, 'filedLastYearTaxes' | 'hasBusinessDebt' | 'hasOverdueLiabilities' | 'isLeasingLocation' | 'hasTaxLiens' | 'hasJudgments' | 'hasBankruptcy' | 'ownershipChanged'>;
    showDateInput?: boolean;
    condition?: (financesInfo: any) => boolean;
  }

  const questions: Question[] = [
    {
      id: 'taxes',
      text: "Have you filed last year's business taxes?",
      name: 'filedLastYearTaxes'
    },
    {
      id: 'debt',
      text: "Do you have any business debt or material liabilities?",
      name: 'hasBusinessDebt'
    },
    {
      id: 'overdue',
      text: "Are any of these liabilities not within terms and/or overdue?",
      name: 'hasOverdueLiabilities',
      condition: (financesInfo) => financesInfo.hasBusinessDebt && financesInfo.debts.length > 0
    },
    {
      id: 'leasing',
      text: "Are you currently leasing your business location?",
      name: 'isLeasingLocation',
      showDateInput: true
    },
    {
      id: 'taxLiens',
      text: "Does this legal entity have any outstanding tax liens?",
      name: 'hasTaxLiens'
    },
    {
      id: 'judgments',
      text: "Does this business that you're currently applying or if you are a sole proprietor, do you have any judgments or lawsuits?",
      name: 'hasJudgments'
    },
    {
      id: 'bankruptcy',
      text: "Has this business that you're currently applying for (or, if you are a sole proprietor, have you) applied for bankruptcy in the last two years?",
      name: 'hasBankruptcy'
    },
    {
      id: 'ownership',
      text: "Has any ownership of your business changed in the last two years?",
      name: 'ownershipChanged'
    }
  ];

  // Filter questions based on conditions
  const filteredQuestions = questions.filter(question => {
    if (question.condition) {
      return question.condition(financesInfo);
    }
    return true;
  });

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

    // Show next question after a short delay
    setTimeout(() => {
      const currentQuestion = filteredQuestions[currentQuestionIndex];
      const nextIndex = currentQuestionIndex + 1;
      
      if (nextIndex < filteredQuestions.length) {
        setCurrentQuestionIndex(nextIndex);
        setVisibleQuestions(prev => [...prev, nextIndex]);
      }
    }, 300);
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

  const renderQuestion = (question: Question, index: number) => {
    const isVisible = visibleQuestions.includes(index);
    const isCurrent = currentQuestionIndex === index;
    
    return (
      <div 
        key={question.id}
        className={`w-[40%] mb-10 transition-all duration-500 ease-in-out ${
          isVisible 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-4 pointer-events-none'
        } ${isCurrent ? 'scale-100' : 'scale-95'}`}
        style={{ 
          display: isVisible ? 'block' : 'none',
          animation: isVisible && isCurrent ? 'slideIn 0.5s ease-out' : 'none'
        }}
      >
        <div className="flex flex-row justify-between gap-6 mb-8">
          <label className='text-sm font-300 text-gray-700'>{question.text}</label>
          <div className="flex items-center space-x-8">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name={question.name}
                value="yes"
                checked={financesInfo[question.name]}
                onChange={handleRadioChange}
                className="mr-2 accent-rose-500 size-6"
              />
              Yes
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name={question.name}
                value="no"
                checked={!financesInfo[question.name]}
                onChange={handleRadioChange}
                className="mr-2 accent-rose-500 size-6"
              />
              No
            </label>
          </div>
        </div>
        
        {question.name === 'hasBusinessDebt' && financesInfo[question.name] && (
          <div className="conditional-content animate-fadeIn w-full flex flex-col gap-4">
            
            <div className="debts-container flex flex-col gap-4 w-full">
              {financesInfo.debts.map((debt, debtIndex) => (
                <div key={debtIndex} className="debt-row">
                 
                  <div className="flex flex-row gap-4">
                  <select
                    value={debt.type}
                    onChange={(e) => handleDebtTypeChange(debtIndex, e.target.value)}
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
                    onChange={(e) => handleDebtBalanceChange(debtIndex, e.target.value)}
                    placeholder="outstanding balance"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                 {financesInfo.debts.length > 1 && (
                   <button
                    className="btn-icon remove-debt text-red-300 hover:text-red-500 hover:cursor-pointer right-0"
                    onClick={() => removeDebt(debtIndex)}
                    title="Remove debt"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </button>
                  )}
                  </div>
                  {financesInfo.debts.length > 1 && (
              <div className="border-b border-amber-300 w-[50%] mx-auto my-4 mt-8"></div>
            )}
                </div>
              ))}
            </div>
            
            <div className="add-debt-container flex flex-row justify-center text-amber-500 hover:text-amber-700 hover:cursor-pointer" onClick={addDebt}>
              <span className="add-debt-link">
                + Add Debt
              </span>
            </div>
          </div>
        )}
        
        {question.showDateInput && financesInfo[question.name] && (
          <div className="conditional-content animate-fadeIn">
            <label className="radio-label">If so, what is the lease end date?</label>
            <input
              type="date"
              value={financesInfo.leaseEndDate}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        
        {question.name === 'filedLastYearTaxes' && financesInfo[question.name] && (
          <div className="conditional-content animate-fadeIn">
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
  };

  return (
    <div className="flex flex-col items-center justify-center w-full pt-10">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-in;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `
      }} />
      
      {filteredQuestions.map((question, index) => renderQuestion(question, index))}
    </div>
  );
};

export default FinancesStep; 