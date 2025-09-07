import React from 'react';
import { TagIcon } from './icons';

const STORES = ["Amazon", "IKEA", "Target", "Walmart", "West Elm", "Crate & Barrel"];

interface StoreSelectorProps {
  selectedStores: string[];
  onStoresChange: (stores: string[]) => void;
}

const StoreSelector: React.FC<StoreSelectorProps> = ({ selectedStores, onStoresChange }) => {
  const handleCheckboxChange = (store: string) => {
    const newSelection = selectedStores.includes(store)
      ? selectedStores.filter((s) => s !== store)
      : [...selectedStores, store];
    onStoresChange(newSelection);
  };

  return (
    <div className="w-full p-4 bg-white rounded-xl shadow-lg">
      <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
        <TagIcon className="h-6 w-6 mr-2 text-indigo-500" />
        Preferred Stores (Optional)
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
        {STORES.map((store) => (
          <div key={store} className="flex items-center">
            <input
              id={`store-${store}`}
              type="checkbox"
              checked={selectedStores.includes(store)}
              onChange={() => handleCheckboxChange(store)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor={`store-${store}`} className="ml-2 block text-sm text-gray-900">
              {store}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreSelector;