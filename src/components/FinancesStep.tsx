import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateFinancesInfo } from '../store/form/formSlice';
import StepTitle from './customComponents/StepTitle';
import FileUploadField from './customComponents/FileUploadField';
import { Switch } from "@material-tailwind/react";

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
  const [hasBeenVisited, setHasBeenVisited] = useState(false);

  interface Question {
    id: string;
    text: string;
    name: keyof Pick<typeof financesInfo, 'assetsTransferred' | 'filedLastYearTaxes' | 'hasTicketingDebt' | 'hasBusinessDebt' | 'hasOverdueLiabilities' | 'isLeasingLocation' | 'hasTaxLiens' | 'hasJudgments' | 'hasBankruptcy' | 'ownershipChanged'>;
    showDateInput?: boolean;
    condition?: (financesInfo: any) => boolean;
  }

  const questions: Question[] = [
    {
      id: 'assetsTransferred',
      text: "Is there more than ~$50,000 in cash, assets, or liabilities transferred to other entities, in a given month? This could include intercompany AR, intercompany AP, and intercompany loans*",
      name: 'assetsTransferred'
    },
    {
      id: 'taxes',
      text: "Have you filed your business taxes for last year?",
      name: 'filedLastYearTaxes'
    },
    {
      id: 'ticketing',
      text: "Do you have any debt or liability to any existing or former ticketing agents?",
      name: 'hasTicketingDebt'
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
      id: 'taxLiens',
      text: "Does this legal entity have any outstanding tax arrears and/or liens?",
      name: 'hasTaxLiens'
    },
    {
      id: 'judgments',
      text: "Does this business that you're currently applying for (or, if you are a sole proprietor, do you) have any other material liabilities?",
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

  // Check if user has already visited this step
  useEffect(() => {
    const hasAnsweredAnyQuestion = Object.values(financesInfo).some(value =>
      typeof value === 'boolean' && value !== undefined
    );

    if (hasAnsweredAnyQuestion && !hasBeenVisited) {
      setHasBeenVisited(true);
      // Show all questions that should be visible based on current answers
      const allVisibleIndices = filteredQuestions.map((_, index) => index);
      setVisibleQuestions(allVisibleIndices);
      setCurrentQuestionIndex(allVisibleIndices.length - 1);
    }
  }, [financesInfo, hasBeenVisited, filteredQuestions]);

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    dispatch(updateFinancesInfo({ [name]: e.target.checked }));

    // Automatically add a debt row when answering Yes
    if (name === 'hasBusinessDebt' && e.target.checked && financesInfo.debts.length === 0) {
      dispatch(updateFinancesInfo({
        debts: [{ type: '', balance: '' }]
      }));
    }

    if (name === 'filedLastYearTaxes' && e.target.checked) {
      dispatch(updateFinancesInfo({
        filedLastYearTaxes: true,
        lastYearTaxes: []
      }));
    }

    // Only show next question if this is the first visit
    if (!hasBeenVisited) {
      setTimeout(() => {
        const nextIndex = currentQuestionIndex + 1;

        if (nextIndex < filteredQuestions.length) {
          setCurrentQuestionIndex(nextIndex);
          setVisibleQuestions(prev => [...prev, nextIndex]);
        }
      }, 300);
    }

  };

  const handleSingleEntityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target; 
    dispatch(updateFinancesInfo({ [name]: checked }));
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
    const isVisible = hasBeenVisited || visibleQuestions.includes(index);
    const isCurrent = currentQuestionIndex === index;

    return (
      <div
        key={question.id}
        className={`transition-all duration-500 ease-in-out`}
        style={{
          display: isVisible ? 'block' : 'none',
          animation: isVisible && isCurrent && !hasBeenVisited ? 'slideIn 0.5s ease-out' : 'none'
        }}
      >

        <div className="mb-8 w-full flex flex-row space-between items-center">
          <p className='text-sm font-400 text-gray-700 w-full justify-start w-[75%]'>{question.text}</p>

          <div className='w-full flex flex-row gap-2 justify-end w-[25%]'>
            <label
              className={`inline-block pl-[0.15rem] hover:cursor-pointer font-300 text-sm ${financesInfo[question.name] ? '  text-gray-400 ' : 'text-gray-700 '}`}
              htmlFor={question.name}
            > Yes</label>
            <input
              className="mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-rose-300 accent-rose-500
                before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full
                 before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem]
                  after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)]
                   after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] 
                   checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none
                    checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)]
                     checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 
                     focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)]
                      focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block
                       focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary 
                       checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]
                        checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-rose-200 dark:after:bg-rose-500 dark:checked:bg-primary
                         dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
              type="checkbox"
              role="switch"
              name={question.name}
              id={question.name}
              checked={financesInfo[question.name]}
              onChange={handleRadioChange}
            />
            <label
              className={`inline-block pl-[0.15rem] hover:cursor-pointer font-300 text-sm ${financesInfo[question.name] ? '  text-gray-700 ' : 'text-gray-400 '}`}
              htmlFor={question.name}
            > No</label>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500"
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
                  {/* {financesInfo.debts.length > 1 && (
                    <div className="border-b border-rose-300 w-[50%] mx-auto my-4 mt-8"></div>
                  )} */}
                </div>
              ))}
            </div>

            <div className="add-debt-container flex flex-row justify-center text-rose-500 hover:text-rose-700 hover:cursor-pointer" onClick={addDebt}>
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

            <FileUploadField
              field="lastYearTaxes"
              title="Last year tax file"
              accept=".pdf,.xlsx,.csv,.jpg,.png"
              multiple={false}
              onFilesChange={() => handleFileChange('lastYearTaxes')}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className=" w-full lg:w-[30%] mx-auto">
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
      <StepTitle title="Single vs Multi-entity" />
      <div className="flex flex-col space-between gap-4 mx-auto items-center w-full mb-4" >
        <p className='text-sm font-300 text-gray-700'>Is the Company a single entity or part of a multi-entity group structure? <br />This includes a group of affiliates that share ownership</p>
        <div className="flex items-center gap-4">
        <div className='w-full flex flex-row gap-2 justify-end'>
            <label
              className={`inline-block pl-[0.15rem] hover:cursor-pointer font-300 text-sm ${financesInfo['singleEntity'] ? '  text-gray-400 ' : 'text-gray-700 '}`}
              htmlFor="singleEntity"
            > Single entity</label>
            <input
              className="mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-rose-300 accent-rose-500
                before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full
                 before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem]
                  after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)]
                   after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] 
                   checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none
                    checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)]
                     checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 
                     focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)]
                      focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block
                       focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary 
                       checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]
                        checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-rose-200 dark:after:bg-rose-500 dark:checked:bg-primary
                         dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
              type="checkbox"
              role="switch"
              name="singleEntity"
              id="singleEntity"
              checked={financesInfo['singleEntity']}
              onChange={handleRadioChange}
            />
            <label
              className={`inline-block pl-[0.15rem] hover:cursor-pointer font-300 text-sm ${financesInfo['singleEntity'] ? '  text-gray-700 ' : 'text-gray-400 '}`}
              htmlFor="singleEntity"
            > Multi-entity</label>
          </div>
          {/* <label className="flex items-center">
            <input
              type="radio"
              name="singleEntity"
              value="yes"
              checked={financesInfo['singleEntity']}
              onChange={handleSingleEntityChange}
              className="mr-2 accent-rose-500 size-4"
            />
            Single entity
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="singleEntity"
              value="no"
              checked={!financesInfo['singleEntity']}
              onChange={handleSingleEntityChange}
              className="mr-2 accent-rose-500 size-4"
            />
            Multi-entity
          </label> */}

        </div>
      </div>
      <StepTitle title="Finances" />

      {filteredQuestions.map((question, index) => renderQuestion(question, index))}
    </div>
  );
};

export default FinancesStep; 