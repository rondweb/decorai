
import { GoogleGenAI, Modality } from "@google/genai";
import type { DesignResultData, FurnitureItem } from '../../types';

// Define the environment variables we expect from Cloudflare
interface Env {
  API_KEY: string;
}

// Define the expected request body structure
interface GenerateRequestBody {
    base64Image: string;
    mimeType: string;
    budget: number;
    spaceType: string;
    colorPalette: string;
    preferredStores: string[];
    location: { lat: number; lon: number } | null;
}

function cleanJsonString(jsonString: string): string {
  // Remove markdown code block syntax if present
  let cleanStr = jsonString.replace(/^```json\s*|```$/g, '').trim();

  // Find the first occurrence of '{' or '['
  const startIndex = cleanStr.search(/[[{]/);
  if (startIndex === -1) {
    return cleanStr;
  }

  // Find the last occurrence of '}' or ']'
  const lastBrace = cleanStr.lastIndexOf('}');
  const lastBracket = cleanStr.lastIndexOf(']');
  const endIndex = Math.max(lastBrace, lastBracket);

  if (endIndex === -1 || endIndex < startIndex) {
    return cleanStr;
  }

  // Extract the substring that appears to be JSON
  return cleanStr.substring(startIndex, endIndex + 1);
}

// Fix: Replace PagesFunction with an inline type for the context object to resolve the undefined type error.
export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
  try {
    const {
      base64Image,
      mimeType,
      budget,
      spaceType,
      colorPalette,
      preferredStores,
      location
    // Fix: Use a type assertion as the default Request.json() is not generic.
    } = await context.request.json() as GenerateRequestBody;

    const apiKey = context.env.API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "The API_KEY environment variable is not configured on the server." }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const locationInfo = location 
      ? `The user is located near latitude ${location.lat} and longitude ${location.lon}. Prioritize retailers that are popular and accessible in this region.`
      : 'User location not provided.';

    const prompt = `You are an AI interior designer. Redecorate the space in the provided image based on the following criteria.

Criteria:
- Space Type: ${spaceType}
- Maximum Budget: $${budget}
- Color Palette: ${colorPalette}
- Style: Modern and minimalist
- Preferred Stores: ${preferredStores.length > 0 ? preferredStores.join(', ') : 'Any popular online retailer'}
- Location Hint: ${locationInfo}

Your response must contain two parts:
1. An image: The new photorealistic image of the decorated space.
2. Text: A valid JSON array for a shopping list.

The total cost of all items on the shopping list must not exceed the budget.

The text part of your response MUST BE ONLY the raw JSON data. Do not include explanations, introductory text, or markdown code blocks like \`\`\`json. The JSON must follow this exact schema:
[
  {
    "itemName": "string",
    "price": number,
    "retailer": "string",
    "url": "string"
  }
]`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let generatedImage: string | null = null;
    let furniture: FurnitureItem[] = [];
    
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          generatedImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        } else if (part.text) {
          try {
            const cleanedJson = cleanJsonString(part.text);
            furniture = JSON.parse(cleanedJson);
          } catch (e) {
            console.error("Failed to parse JSON from model response:", part.text, e);
            throw new Error("The AI returned an invalid item list.");
          }
        }
      }
    }

    if (!generatedImage || furniture.length === 0) {
      throw new Error("The AI failed to generate a complete design.");
    }

    const designResult: DesignResultData = { generatedImage, furniture };

    return new Response(JSON.stringify(designResult), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in Cloudflare function:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected server error occurred.";
    return new Response(JSON.stringify({ error: `Failed to generate design. ${errorMessage}` }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });
  }
};
