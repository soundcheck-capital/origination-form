import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateFundsInfo } from '../store/form/formSlice';

const fundUses = [
  'Artist deposit',
  'Show marketing',
  'Other show expenses',
  'Operational expenses',
  'Existing location improvement',
  'Opening a new location',
  'Short term cash flow needs',
  'Refinance my debt'
];

const FundsStep: React.FC = () => {
  const dispatch = useDispatch();
  const fundsInfo = useSelector((state: RootState) => state.form.formData.fundsInfo);
  const volumeInfo = useSelector((state: RootState) => state.form.formData.volumeInfo);

  const yourFunds = parseFloat(fundsInfo.yourFunds) || 0;
  const lastYearSales = volumeInfo.lastYearSales;
  const minRecoupmentPercentage = (yourFunds / lastYearSales) * 100;
  const maxRecoupmentPercentage = Math.min(minRecoupmentPercentage * 12, 100);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, min, max } = e.target;
    const percentage = ((parseFloat(value) - parseFloat(min)) / (parseFloat(max) - parseFloat(min))) * 100;
    e.target.style.background = `linear-gradient(to right, #F99927 0%, #F99927 ${percentage}%, #ddd ${percentage}%, #ddd 100%)`;

    if (name === "recoupmentPeriod") {
      const months = parseInt(value);
      const recoupmentPercentage = Math.min(minRecoupmentPercentage * (12 / months), 100);
      dispatch(updateFundsInfo({
        // recoupmentPeriod: months.toString(),
        //recoupmentPercentage: recoupmentPercentage.toString()
      }));
    } else if (name === "recoupmentPercentage") {
      const percent = parseFloat(value);
      const newMonths = Math.max(1, Math.round(12 * (minRecoupmentPercentage / percent)));
      dispatch(updateFundsInfo({
        //recoupmentPeriod: newMonths.toString(),
        //recoupmentPercentage: percent.toString()
      }));
    } else {
      dispatch(updateFundsInfo({ [name]: value }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(updateFundsInfo({ [name]: value }));
  };

  const maxFundsValue = lastYearSales ? Math.round(lastYearSales * 0.2) : 0;

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(value));
  };


  // const calculateSoundCheckFees = () => {
  //     const totalFunds = Number(fundsInfo.yourFunds) + Number(fundsInfo.otherFunds);
  //     const recoupmentPeriod = Number(fundsInfo.recoupmentPeriod);
  //     const recoupmentPercentage = Number(fundsInfo.recoupmentPercentage);

  //   // Calculate monthly payment
  //   const monthlyPayment = (totalFunds * (recoupmentPercentage / 100)) / recoupmentPeriod;

  //   // Calculate SoundCheck fees (2% of total funds)
  //   const soundCheckFees = totalFunds * 0.02;

  //   return {
  //     monthlyPayment,
  //     soundCheckFees
  //   };
  // };

  //const { monthlyPayment, soundCheckFees } = calculateSoundCheckFees();

  return (
    <div className="flex flex-col items-center justify-center w-full bg-white rounded-2xl shadow-sm ">
            <p className="text-gray-600 mb-8 text-2xl font-bold mt-10">Your funding offer</p>

      <p className="text-gray-400 mb-8 text-center">
        Select your advance, target recoupment period and % of recoupment. See your repayment terms below.
      </p>
      <div className="grid grid-cols-1 gap-x-24 ">
        <div className="w-full space-y-6 mb-10">
          <div className="">
            <div className="flex justify-between">
              <label className="">Purchase Price</label>
              {/* <span className="">{formatCurrency(fundsInfo.yourFunds.toString())}</span> */}
            </div>
            {/* <span className="min-value">$0</span> */}

            {/* <span className="max-value">${maxFundsValue.toLocaleString()}</span> */}
              <div className="  ">  
              <input
                type="range"
                name="yourFunds"
                min="0"
                max={maxFundsValue}
                step="1000"
                value={fundsInfo.yourFunds}
                onChange={handleSliderChange}
                className="w-full slider"
                style={{
                  background: `linear-gradient(to right, #F99927 0%, #F23561 ${(parseInt(fundsInfo.yourFunds) / maxFundsValue) * 100}%, #ddd ${(parseInt(fundsInfo.yourFunds) / maxFundsValue) * 100}%, #ddd 100%)`
                }}
              />

            </div>
          </div>



          <div className="">
            <div className="flex justify-between">
              <label className="">% Remittance from Ticket Sales</label>
              {/* <span className="">{parseFloat(fundsInfo.recoupmentPercentage).toFixed(2)}%</span> */}
            </div>
            {/* <span className="min-value">{minRecoupmentPercentage.toFixed(2)}%</span> */}

            {/* <span className="max-value">{maxRecoupmentPercentage.toFixed(2)}%</span> */}
            <div className="">
             {/*  <input
                type="range"
                name="recoupmentPercentage"
                min={minRecoupmentPercentage}
                max={maxRecoupmentPercentage}
                step="0.01"
                //value={fundsInfo.recoupmentPercentage}
                onChange={handleSliderChange}
                className="w-full slider "
                style={{
                  background: `linear-gradient(to right, #F99927 0%, #F99927 ${((parseFloat(fundsInfo.recoupmentPercentage) - minRecoupmentPercentage) / (maxRecoupmentPercentage - minRecoupmentPercentage)) * 100}%, #ddd ${((parseFloat(fundsInfo.recoupmentPercentage) - minRecoupmentPercentage) / (maxRecoupmentPercentage - minRecoupmentPercentage)) * 100}%, #ddd 100%)`
                }}
              />
 */}
            </div>
          </div>


          <div className="">
            <label className="block text-sm font-medium text-gray-700">How do you plan to use your funds?</label>
            <select
              name="fundUse"
              value={fundsInfo.fundUse}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an option</option>
              {fundUses.map((use) => (
                <option key={use} value={use}>
                  {use}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-full space-y-4 text-gray-700 leading-relaxed bg-gray-100 rounded-2xl p-6 ">
          <div className="space-y-4">
            <h4 className="text-gray-600 mb-8 text-2xl font-bold text-center">Your pre-qualified offer</h4>
            <div className="">
              {/* <span className="">We are buying <b>$amount</b> of Future Ticket Receivables from you at <b>amount% discount</b> and you receive <b>{formatCurrency(fundsInfo.yourFunds.toString())}</b>  </span> */}
            </div>

            <div className="">
             {/* <span className="">You repay us <b>$amount</b> by remitting <b>{fundsInfo.recoupmentPercentage}% of your Tickets Sales</b> (5% to recoup the advance and {formatCurrency(soundCheckFees.toString())}% for our fees) </span> */}
            </div>
            <div className="">
              <span className="">Timing to pay the full Total Value is determined by the <b>pace of Ticket Sales</b></span>
            </div>
            

            </div>  </div>
          <p className="text-gray-400 my-4 text-center">SoundCheck fee is charged until advance is fully recouped.
            Binding offer is subject to final due diligence.</p>
        
      </div>
    </div>
  );
};

export default FundsStep;
/*


import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateFundsInfo } from '../store/form/formSlice';
import { FormState } from '../store/form/formTypes';

const FundsStep: React.FC = () => {
  const dispatch = useDispatch();
  const fundsInfo = useSelector((state: RootState) => state.form.formData.fundsInfo);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(updateFundsInfo({ [name]: value }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculateSoundCheckFees = () => {
    const yourFunds = Number(fundsInfo.yourFunds);
    const recoupmentPercentage = Number(fundsInfo.recoupmentPercentage);
    const recoupmentPeriod = Number(fundsInfo.recoupmentPeriod);
    
    const totalFees = yourFunds * 0.02; // 2% of total funds
    const monthlyPayment = (yourFunds * (recoupmentPercentage / 100)) / recoupmentPeriod;
    
    return {
      totalFees,
      monthlyPayment
    };
  };

  const { totalFees, monthlyPayment } = calculateSoundCheckFees();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Your Funds</label>
          <input
            type="number"
            name="yourFunds"
            value={fundsInfo.yourFunds}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your funds amount"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Other Funds</label>
          <input
            type="number"
            name="otherFunds"
            value={fundsInfo.otherFunds}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter other funds amount"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Recoupment Period (months)</label>
          <input
            type="number"
            name="recoupmentPeriod"
            value={fundsInfo.recoupmentPeriod}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter recoupment period"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Recoupment Percentage (%)</label>
          <input
            type="number"
            name="recoupmentPercentage"
            value={fundsInfo.recoupmentPercentage}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter recoupment percentage"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fund Use</label>
          <input
            type="text"
            name="fundUse"
            value={fundsInfo.fundUse}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter fund use"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Your Funds</span>
            <span className="font-medium text-gray-800">{formatCurrency(Number(fundsInfo.yourFunds))}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Other Funds</span>
            <span className="font-medium text-gray-800">{formatCurrency(Number(fundsInfo.otherFunds))}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Recoupment Period</span>
            <span className="font-medium text-gray-800">{fundsInfo.recoupmentPeriod} months</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Recoupment Percentage</span>
            <span className="font-medium text-gray-800">{fundsInfo.recoupmentPercentage}%</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Fund Use</span>
            <span className="font-medium text-gray-800">{fundsInfo.fundUse}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">SoundCheck Fees</span>
            <span className="font-medium text-gray-800">{formatCurrency(totalFees)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Monthly Payment</span>
            <span className="font-medium text-gray-800">{formatCurrency(monthlyPayment)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundsStep;



*/