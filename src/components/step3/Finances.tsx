import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateFinancesInfo } from '../../store/form/formSlice';
import StepTitle from '../customComponents/StepTitle';
import DropdownField from '../customComponents/DropdownField';
import CurrencyField from '../customComponents/CurrencyField';
import Switch from '../customComponents/Switch';
import { debtTypes } from '../../store/form/hubspotLists';




const FinancesStep: React.FC = () => {
  const dispatch = useDispatch();
  const financesInfo = useSelector((state: RootState) => state.form.formData.financesInfo);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [visibleQuestions, setVisibleQuestions] = useState<number[]>([0]);
  const [hasBeenVisited, setHasBeenVisited] = useState(false);

  interface Question {
    id: string;
    text: string;
    name: keyof Pick<typeof financesInfo, 'hasBusinessDebt' | 'hasOverdueLiabilities' | 'hasTaxLiens' | 'hasBankruptcy' | 'ownershipChanged'>;
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
      console.log('singleEntity', e.target.checked);
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
            {/* <label
              className={`text-sm font-semibold transition-colors
                  ${financesInfo[question.name] ? 'text-gray-400/70' : 'text-gray-700'}`}
              htmlFor={question.name}
            >
              No
            </label> */}

            <Switch
              id={question.name}
              name={question.name}
              checked={financesInfo[question.name]}
              onChange={handleRadioChange}
            />

            {/* <label
              className={`text-sm font-semibold transition-colors
                  ${financesInfo[question.name] ? 'text-gray-700' : 'text-gray-400/70'}`}
              htmlFor={question.name}
            >
              Yes
            </label> */}
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

            <div className="w-full mb-4 flex justify-center">
              <button
                onClick={addDebt}
                className="
                  inline-block
                  px-4 py-2
                  backdrop-blur-md
                  border border-white/60
                  bg-gradient-to-br from-blue-200/50 via-purple-100/45 to-rose-200/50
                  shadow-lg shadow-blue-200/30
                  rounded-full
                  before:absolute before:inset-0 before:rounded-full
                  before:bg-gradient-to-br before:from-white/20 before:to-transparent
                  before:pointer-events-none
                  relative
                  ring-1 ring-white/50
                  hover:shadow-xl hover:shadow-blue-300/40
                  hover:border-white/70
                  transition-all duration-300 ease-out
                  cursor-pointer
                "
              >
                <span className="relative z-10 text-gray-700 font-semibold text-sm">
                  Add Debt
                </span>
              </button>
            </div>
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
      
      <StepTitle title="Diligence Questions" />
      <div className="flex space-between  items-center w-full mb-8" >
        <div className="flex mb-2 items-center w-full">
          <p className='text-sm font-300 text-gray-700 '>Is the Company part of a multi-entity group structure?</p>
          <div className="relative group w-[30%]">
            <svg className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help absolute left-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              This includes a group of affiliates that share ownership
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="flex items-center">
            {/* <label
              className={`text-sm text-left whitespace-nowrap transition-colors
                ${financesInfo.singleEntity ? 'text-gray-700 font-bold' : 'text-gray-400'}`}
              htmlFor="singleEntity"
            >
              No
            </label> */}

            <Switch
              id="singleEntity"
              name="singleEntity"
              checked={!financesInfo.singleEntity}
              onChange={handleRadioChange}
            />

            {/* <label
              className={`text-sm text-left whitespace-nowrap transition-colors
                ${financesInfo.singleEntity ? 'text-gray-400' : 'text-gray-700 font-bold'}`}
              htmlFor="singleEntity"
            >
              Yes
            </label> */}
          </div>
        </div>
      </div>
      {filteredQuestions.map((question, index) => renderQuestion(question, index))}
    </div>
  );
};

export default FinancesStep; 