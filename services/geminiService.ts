import type { DesignResultData } from '../types';

export const generateDesign = async (
  base64Image: string, 
  mimeType: string, 
  budget: number,
  spaceType: string,
  colorPalette: string,
  preferredStores: string[],
  location: { lat: number; lon: number } | null
): Promise<DesignResultData> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64Image,
        mimeType,
        budget,
        spaceType,
        colorPalette,
        preferredStores,
        location,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response from server.' }));
      throw new Error(errorData.error || `Server responded with status: ${response.status}`);
    }

    const result: DesignResultData = await response.json();
    return result;

  } catch (error) {
    console.error("Error calling backend API:", error);
    throw new Error(error instanceof Error ? error.message : "An unknown error occurred while communicating with the server.");
  }
};