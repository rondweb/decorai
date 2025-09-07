import React from 'react';
import { HomeIcon } from './icons';

const SPACE_TYPES = ["Living Room", "Bedroom", "Office", "Kitchen", "Dining Room", "Outdoor Patio"];

interface SpaceTypeSelectorProps {
  selectedSpaceType: string;
  onSpaceTypeChange: (spaceType: string) => void;
}

const SpaceTypeSelector: React.FC<SpaceTypeSelectorProps> = ({ selectedSpaceType, onSpaceTypeChange }) => {
  return (
    <div className="w-full p-4 bg-white rounded-xl shadow-lg">
      <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
        <HomeIcon className="h-6 w-6 mr-2 text-indigo-500" />
        Choose a Space Type
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {SPACE_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onSpaceTypeChange(type)}
            className={`w-full text-sm font-semibold py-2 px-3 rounded-md transition-all duration-200 ${
              selectedSpaceType === type
                ? 'bg-gradient-to-r from-indigo-600 to-purple-500 text-white shadow'
                : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SpaceTypeSelector;