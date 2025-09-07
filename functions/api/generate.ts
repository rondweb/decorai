
import { GoogleGenAI, Modality } from "@google/genai";
import type { DesignResultData, FurnitureItem } from '../../types';

// Define as variáveis de ambiente que esperamos da Cloudflare
interface Env {
  API_KEY: string;
}

// Define a estrutura do corpo da requisição esperada
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
  // Remove a sintaxe de bloco de código markdown se presente
  let cleanStr = jsonString.replace(/^```json\s*|```$/g, '').trim();

  // Encontra a primeira ocorrência de '{' ou '['
  const startIndex = cleanStr.search(/[[{]/);
  if (startIndex === -1) {
    return cleanStr;
  }

  // Encontra a última ocorrência de '}' ou ']'
  const lastBrace = cleanStr.lastIndexOf('}');
  const lastBracket = cleanStr.lastIndexOf(']');
  const endIndex = Math.max(lastBrace, lastBracket);

  if (endIndex === -1 || endIndex < startIndex) {
    return cleanStr;
  }

  // Extrai a substring que parece ser JSON
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
      return new Response(JSON.stringify({ error: "A variável de ambiente API_KEY não está configurada no servidor." }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const locationInfo = location 
      ? `O usuário está localizado perto da latitude ${location.lat} e longitude ${location.lon}. Priorize varejistas que são populares e acessíveis nesta região.`
      : 'Localização do usuário não fornecida.';

    const prompt = `Você é um designer de interiores de IA. Redecore o espaço na imagem fornecida com base nos seguintes critérios.

Critérios:
- Tipo de Espaço: ${spaceType}
- Orçamento Máximo: $${budget}
- Paleta de Cores: ${colorPalette}
- Estilo: Moderno e minimalista
- Lojas Preferenciais: ${preferredStores.length > 0 ? preferredStores.join(', ') : 'Qualquer varejista online popular'}
- Dica de Localização: ${locationInfo}

Sua resposta deve conter duas partes:
1. Uma imagem: A nova imagem fotorrealista do espaço decorado.
2. Texto: Um array JSON válido para uma lista de compras.

O custo total de todos os itens na lista de compras não deve exceder o orçamento.

A parte de texto da sua resposta DEVE SER APENAS os dados JSON brutos. Não inclua explicações, texto introdutório ou blocos de código markdown como \`\`\`json. O JSON deve seguir este esquema exato:
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
            console.error("Falha ao analisar JSON da resposta do modelo:", part.text, e);
            throw new Error("A IA retornou uma lista de itens inválida.");
          }
        }
      }
    }

    if (!generatedImage || furniture.length === 0) {
      throw new Error("A IA não conseguiu gerar um design completo.");
    }

    const designResult: DesignResultData = { generatedImage, furniture };

    return new Response(JSON.stringify(designResult), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Erro na função da Cloudflare:", error);
    const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro inesperado no servidor.";
    return new Response(JSON.stringify({ error: `Falha ao gerar o design. ${errorMessage}` }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });
  }
};
