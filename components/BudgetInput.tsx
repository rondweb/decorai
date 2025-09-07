import React from 'react';
import { MoneyIcon } from './icons';

interface BudgetInputProps {
  budget: number;
  onBudgetChange: (value: number) => void;
}

const BudgetInput: React.FC<BudgetInputProps> = ({ budget, onBudgetChange }) => {
  return (
    <div className="w-full p-4 bg-white rounded-xl shadow-lg">
      <label htmlFor="budget" className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
        <MoneyIcon className="h-6 w-6 mr-2 text-indigo-500" />
        Set Your Maximum Budget
      </label>
      <div className="flex items-center space-x-4">
        <input
          id="budget"
          type="range"
          min="500"
          max="10000"
          step="100"
          value={budget}
          onChange={(e) => onBudgetChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500 text-lg w-24 text-right">
          ${budget.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default BudgetInput;