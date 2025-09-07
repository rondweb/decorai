import React from 'react';
import { SwatchIcon, CheckIcon } from './icons';

const PALETTES = [
  { name: 'Warm Neutrals', colors: ['bg-orange-100', 'bg-stone-300', 'bg-amber-600'] },
  { name: 'Cool Blues', colors: ['bg-sky-100', 'bg-slate-400', 'bg-blue-800'] },
  { name: 'Earthy Greens', colors: ['bg-lime-100', 'bg-teal-300', 'bg-green-800'] },
  { name: 'Monochromatic', colors: ['bg-gray-100', 'bg-gray-400', 'bg-gray-800'] },
  { name: 'Pastel Dreams', colors: ['bg-pink-100', 'bg-violet-200', 'bg-cyan-200'] },
  { name: 'Bold & Bright', colors: ['bg-yellow-300', 'bg-red-500', 'bg-blue-600'] },
];

interface ColorPaletteSelectorProps {
  selectedPalette: string;
  onPaletteChange: (paletteName: string) => void;
}

const ColorPaletteSelector: React.FC<ColorPaletteSelectorProps> = ({ selectedPalette, onPaletteChange }) => {
  return (
    <div className="w-full p-4 bg-white rounded-xl shadow-lg">
      <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
        <SwatchIcon className="h-6 w-6 mr-2 text-indigo-500" />
        Select a Color Palette
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {PALETTES.map((palette) => (
          <div
            key={palette.name}
            onClick={() => onPaletteChange(palette.name)}
            className={`relative cursor-pointer rounded-lg p-2 border-2 transition-all ${
              selectedPalette === palette.name ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-indigo-400'
            }`}
          >
            {selectedPalette === palette.name && (
                <div className="absolute top-1 right-1 bg-indigo-600 rounded-full p-0.5 shadow">
                    <CheckIcon className="h-3 w-3 text-white" />
                </div>
            )}
            <div className="flex space-x-1 h-8 rounded">
              {palette.colors.map((color, index) => (
                <div key={index} className={`w-1/3 h-full rounded ${color}`} />
              ))}
            </div>
            <p className="text-center text-xs font-semibold mt-2 text-gray-600">{palette.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPaletteSelector;