import React, { useState, useCallback } from 'react';
import { generateDesign } from './services/geminiService';
import type { DesignResultData } from './types';
import { AppState } from './types';
import FileUpload from './components/FileUpload';
import BudgetInput from './components/BudgetInput';
import DesignResult from './components/DesignResult';
import Loader from './components/Loader';
import SpaceTypeSelector from './components/SpaceTypeSelector';
import ColorPaletteSelector from './components/ColorPaletteSelector';
import StoreSelector from './components/StoreSelector';
import { fileToBase64 } from './utils/fileUtils';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [budget, setBudget] = useState<number>(2000);
  const [spaceType, setSpaceType] = useState<string>('Living Room');
  const [colorPalette, setColorPalette] = useState<string>('Warm Neutrals');
  const [preferredStores, setPreferredStores] = useState<string[]>(['Amazon', 'IKEA']);
  const [designResult, setDesignResult] = useState<DesignResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };
  
  const handleStoresChange = (stores: string[]) => {
      setPreferredStores(stores);
  };
  
  const getLocation = (): Promise<{ lat: number; lon: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        () => {
          // Error case (e.g., permission denied)
          resolve(null);
        }
      );
    });
  };

  const handleGenerateDesign = useCallback(async () => {
    if (!imageFile || budget <= 0) {
      setError("Please upload an image and set a valid budget.");
      return;
    }

    setAppState(AppState.LOADING);
    setError(null);

    try {
      const userLocation = await getLocation();
      const base64Image = await fileToBase64(imageFile);
      const result = await generateDesign(base64Image, imageFile.type, budget, spaceType, colorPalette, preferredStores, userLocation);
      setDesignResult(result);
      setAppState(AppState.RESULT);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred. Please try again.");
      setAppState(AppState.ERROR);
    }
  }, [imageFile, budget, spaceType, colorPalette, preferredStores]);

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setImageFile(null);
    setPreviewUrl(null);
    setBudget(2000);
    setSpaceType('Living Room');
    setColorPalette('Warm Neutrals');
    setPreferredStores(['Amazon', 'IKEA']);
    setDesignResult(null);
    setError(null);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.LOADING:
        return <Loader />;
      case AppState.RESULT:
        return designResult && <DesignResult result={designResult} onReset={handleReset} />;
      case AppState.ERROR:
      case AppState.IDLE:
      default:
        return (
          <div className="w-full max-w-lg mx-auto p-4 md:p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">decor.ai</h1>
              <p className="mt-3 text-lg text-gray-600">Upload a photo. Set your style. Get your dream space.</p>
            </div>
            <FileUpload onFileChange={handleFileChange} previewUrl={previewUrl} />
            <SpaceTypeSelector selectedSpaceType={spaceType} onSpaceTypeChange={setSpaceType} />
            <ColorPaletteSelector selectedPalette={colorPalette} onPaletteChange={setColorPalette} />
            <StoreSelector selectedStores={preferredStores} onStoresChange={handleStoresChange} />
            <BudgetInput budget={budget} onBudgetChange={setBudget} />
            {error && <p className="text-red-500 text-center">{error}</p>}
            <button
              onClick={handleGenerateDesign}
              disabled={!imageFile}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-bold py-3 px-4 rounded-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 shadow-lg flex items-center justify-center"
            >
              Generate Design
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <main className="w-full transition-all duration-500">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;