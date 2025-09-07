import React, { useRef } from 'react';
import { UploadIcon } from './icons';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  previewUrl: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onFileChange(file);
  };

  return (
    <div 
      className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/50 bg-white/50 transition-colors"
      onClick={handleFileSelect}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      {previewUrl ? (
        <img src={previewUrl} alt="Space preview" className="w-full h-full object-cover rounded-xl" />
      ) : (
        <div className="text-gray-500">
          <UploadIcon className="mx-auto h-12 w-12" />
          <p className="mt-2 font-semibold">Click to upload a photo of your space</p>
          <p className="text-sm">PNG, JPG, WEBP</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;