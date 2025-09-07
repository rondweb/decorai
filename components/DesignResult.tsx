import React from 'react';
import type { DesignResultData, FurnitureItem } from '../types';
import { ArrowPathIcon, PrintIcon } from './icons';

interface DesignResultProps {
  result: DesignResultData;
  onReset: () => void;
}

const ResultItem: React.FC<{ item: FurnitureItem }> = ({ item }) => (
    <li className="flex justify-between items-start py-4 px-4 bg-white border-b border-slate-100 last:border-0 print:border-b print:border-gray-200 print:py-3">
        <div>
            <p className="font-semibold text-gray-800">{item.itemName}</p>
            <p className="text-sm text-gray-500">{item.retailer}</p>
        </div>
        <p className="font-medium text-green-600 text-right">${item.price.toLocaleString()}</p>
    </li>
);


const DesignResult: React.FC<DesignResultProps> = ({ result, onReset }) => {
    const totalCost = result.furniture.reduce((sum, item) => sum + item.price, 0);

    const handlePrint = () => {
        window.print();
    };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none">
            <div className="p-4 md:p-6 text-center print:hidden">
                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">decor.ai has designed your space!</h2>
                <p className="text-gray-600 mt-1">Here's your new look and a curated shopping list.</p>
            </div>
            
            <div>
                <img src={result.generatedImage} alt="Generated interior design" className="w-full h-auto object-cover"/>
                
                <div className="p-4 md:p-6 bg-slate-50 print:bg-white">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Shopping List</h3>
                        <div className="flex items-center space-x-4">
                            <div className="text-lg font-semibold text-gray-700 bg-green-100 text-green-800 px-4 py-1 rounded-full print:bg-transparent print:text-black print:p-0 print:border print:border-gray-300">
                                Total: ${totalCost.toLocaleString()}
                            </div>
                            <button
                                onClick={handlePrint}
                                className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center print:hidden"
                            >
                                <PrintIcon className="h-5 w-5 mr-2" />
                                Get Shopping List
                            </button>
                        </div>
                    </div>
                    
                    <div className="rounded-lg border border-slate-200 overflow-hidden">
                        <ul className="space-y-0">
                            {result.furniture.map((item, index) => (
                                <ResultItem key={index} item={item} />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div className="mt-6 text-center print:hidden">
            <button
                onClick={onReset}
                className="bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:shadow-xl transition-all duration-300 shadow-lg flex items-center justify-center mx-auto"
            >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Start a New Design
            </button>
        </div>
    </div>
  );
};

export default DesignResult;