
import React, { useState, useCallback } from 'react';
import { analyzeMealImage } from '../services/apiService';
import type { NutritionalInfo } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import MealAnalysisResult from './MealAnalysisResult';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    base64: await base64EncodedDataPromise,
    mimeType: file.type
  };
};

const MealAnalyzer: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [nutritionalInfo, setNutritionalInfo] = useState<NutritionalInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
      setNutritionalInfo(null);
      setError(null);
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) {
      setError("Please select an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setNutritionalInfo(null);

    try {
      const { base64, mimeType } = await fileToGenerativePart(imageFile);
      const result = await analyzeMealImage(base64, mimeType);
      setNutritionalInfo(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  return (
    <Card>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Meal Analyzer</h2>
        <p className="text-gray-600 mb-6">Take a picture of your meal and let AI do the rest!</p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="w-full h-64 bg-base-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
          {previewUrl ? (
            <img src={previewUrl} alt="Meal preview" className="w-full h-full object-cover" />
          ) : (
            <p className="text-gray-500">Your meal photo will appear here</p>
          )}
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <label htmlFor="meal-upload" className="flex-1 cursor-pointer w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            <span>{imageFile ? 'Change Photo' : 'Upload Photo'}</span>
            <input id="meal-upload" name="meal-upload" type="file" accept="image/*" capture="environment" className="sr-only" onChange={handleImageChange} />
          </label>
          <Button onClick={handleAnalyze} disabled={!imageFile || isLoading} className="flex-1">
            {isLoading ? <Spinner /> : 'Analyze Meal'}
          </Button>
        </div>
      </div>

      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      {nutritionalInfo && <MealAnalysisResult nutritionalInfo={nutritionalInfo} />}
    </Card>
  );
};

export default MealAnalyzer;
