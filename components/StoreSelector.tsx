import React from 'react';
import { TagIcon } from './icons';

const STORES = ["Amazon", "IKEA", "Target", "Walmart", "West Elm", "Crate & Barrel"];

interface StoreSelectorProps {
  selectedStores: string[];
  onStoresChange: (stores: string[]) => void;
}

const StoreSelector: React.FC<StoreSelectorProps> = ({ selectedStores, onStoresChange }) => {
  const handleStoreToggle = (store: string) => {
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
      <div className="flex flex-wrap gap-2">
        {STORES.map((store) => (
          <button
            key={store}
            type="button"
            onClick={() => handleStoreToggle(store)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              selectedStores.includes(store)
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
            }`}
          >
            {store}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StoreSelector;