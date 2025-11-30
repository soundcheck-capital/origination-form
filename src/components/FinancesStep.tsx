import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateFinancesInfo } from '../store/form/formSlice';
import StepTitle from './customComponents/StepTitle';
import FileUploadField from './customComponents/FileUploadField';
import DropdownField from './customComponents/DropdownField';
import CurrencyField from './customComponents/CurrencyField';
import { debtTypes } from '../store/form/hubspotLists';




const FinancesStep: React.FC = () => {
  const dispatch = useDispatch();
  const financesInfo = useSelector((state: RootState) => state.form.formData.financesInfo);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [visibleQuestions, setVisibleQuestions] = useState<number[]>([0]);
  const [hasBeenVisited, setHasBeenVisited] = useState(false);

  interface Question {
    id: string;
    text: string;
    name: keyof Pick<typeof financesInfo, 'hasTicketingDebt' | 'hasBusinessDebt' | 'hasOverdueLiabilities' | 'isLeasingLocation' | 'hasTaxLiens' | 'hasBankruptcy' | 'ownershipChanged'>;
    showDateInput?: boolean;
    condition?: (financesInfo: any) => boolean;
  }

  const questions: Question[] = [

    {
      id: 'debt',
      text: "Do you have any business debt or material liabilities (including ticketing company)?",
      name: 'hasBusinessDebt',
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
    
    // Special handling for singleEntity - invert the logic for correct visual representation
    if (name === 'singleEntity') {
      // When switch is checked (right/Multi-entity), singleEntity should be false
      // When switch is unchecked (left/Single entity), singleEntity should be true
      dispatch(updateFinancesInfo({ [name]: !e.target.checked }));
    } else {
      dispatch(updateFinancesInfo({ [name]: e.target.checked }));
    }
    
    // Automatically add a debt row when answering Yes
    if (name === 'hasBusinessDebt' && e.target.checked && financesInfo.debts.length === 0) {
      dispatch(updateFinancesInfo({
        debts: [{ type: '', balance: '' }]
      }));
    }

    if (name === 'filedLastYearTaxes' && e.target.checked) {
      dispatch(updateFinancesInfo({
        filedLastYearTaxes: true,
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

  };

  const addDebt = () => {
    dispatch(updateFinancesInfo({
      debts: [...financesInfo.debts, { type: '', balance: '' }]
    }));
  };

  const removeDebt = (index: number) => {
    const newDebts = financesInfo.debts.filter((_, i) => i !== index);
    dispatch(updateFinancesInfo({ debts: newDebts }));
    
    // Si on efface la dernière dette, remettre le switch à "No"
    if (newDebts.length === 0) {
      dispatch(updateFinancesInfo({ hasBusinessDebt: false }));
    }
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

        <div className="w-full flex items-center justify-between mb-8">
          {/* Question à gauche */}
          <span className="text-sm font-medium text-gray-700 w-[60%]">
            {question.text}
          </span>

          {/* Bloc No | switch | Yes à droite */}
          <div className="flex items-center gap-2">
            <label
              className={`text-sm font-semibold transition-colors
                  ${financesInfo[question.name] ? 'text-gray-400/70' : 'text-gray-700'}`}
              htmlFor={question.name}
            >
              No
            </label>

            <input
              id={question.name}
              name={question.name}
              type="checkbox"
              role="switch"
              checked={financesInfo[question.name]}
              onChange={handleRadioChange}
              className="shrink-0 mt-[0.2rem] h-5 w-10 cursor-pointer appearance-none rounded-full bg-rose-300
                 relative transition-colors duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                 after:absolute after:left-[2px] after:top-1/2 after:-translate-y-1/2
                 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow
                 after:transition-transform after:duration-[380ms] after:ease-[cubic-bezier(0.22,1,0.36,1)]
                 checked:bg-emerald-500 checked:after:translate-x-[1.25rem]
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2
                 dark:bg-rose-200 dark:checked:bg-emerald-400
                 motion-reduce:transition-none motion-reduce:after:transition-none"
            />

            <label
              className={`text-sm font-semibold transition-colors
                  ${financesInfo[question.name] ? 'text-gray-700' : 'text-gray-400/70'}`}
              htmlFor={question.name}
            >
              Yes
            </label>
          </div>
        </div>


        {question.name === 'hasBusinessDebt' && financesInfo[question.name] && (
          <div className="conditional-content animate-fadeIn w-full flex flex-col gap-4 mb-4">

            <div className="debts-container flex flex-col gap-4 w-full ">
              {financesInfo.debts.map((debt, debtIndex) => (
                <div key={debtIndex} className="debt-row">

                  <div className="flex flex-row gap-4 ">
                    <DropdownField
                      options={debtTypes}
                      value={debt.type}
                      onChange={(e) => handleDebtTypeChange(debtIndex, e.target.value)}
                      label="Select type of debt"
                      name="debtType"
                      onBlur={() => { }}
                      required={true}
                      error=''
                    />
                    <CurrencyField
                      value={debt.balance}
                      onChange={(e) => handleDebtBalanceChange(debtIndex, e.toString())}
                      label="outstanding balance"
                      name="debtBalance"
                      required={true}
                    />


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
                  </div>
                  {/* {financesInfo.debts.length > 1 && (
                    <div className="border-b border-rose-300 w-[50%] mx-auto my-4 mt-8"></div>
                  )} */}
                </div>
              ))}
            </div>

            <div className="w-full mb-4 flex justify-center" onClick={addDebt}>
              <span className="text-rose-500 hover:text-rose-700 hover:cursor-pointer">
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

      </div>
    );
  };

  return (
    <div className="w-full animate-fade-in-right duration-1000">
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
          <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <label
              className={`text-sm text-right whitespace-nowrap transition-colors
                ${financesInfo.singleEntity ? 'text-gray-700 font-bold' : 'text-gray-400'}`}
              htmlFor="singleEntity"
            >
              Single entity
            </label>

            <input
              className="shrink-0 mt-[0.3rem] h-5 w-10 cursor-pointer appearance-none rounded-full bg-rose-300
               relative transition-colors duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)]
               after:absolute after:left-[2px] after:top-1/2 after:-translate-y-1/2
               after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow
               after:transition-transform after:duration-[380ms] after:ease-[cubic-bezier(0.22,1,0.36,1)]
               checked:bg-emerald-500 checked:after:translate-x-[1.25rem]
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2
               dark:bg-rose-200 dark:checked:bg-emerald-400
               motion-reduce:transition-none motion-reduce:after:transition-none"
              type="checkbox"
              role="switch"
              name="singleEntity"
              id="singleEntity"
              checked={!financesInfo.singleEntity}
              onChange={handleRadioChange}
            />

            <label
              className={`text-sm text-left whitespace-nowrap transition-colors
                ${financesInfo.singleEntity ? 'text-gray-400' : 'text-gray-700 font-bold'}`}
              htmlFor="singleEntity"
            >
              Multi-entity
            </label>
          </div>



        </div>
      </div>
      <StepTitle title="Finances" />

      {filteredQuestions.map((question, index) => renderQuestion(question, index))}
    </div>
  );
};

export default FinancesStep; 