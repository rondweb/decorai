
export interface FurnitureItem {
  itemName: string;
  price: number;
  retailer: string;
  url: string;
}

export interface DesignResultData {
  generatedImage: string;
  furniture: FurnitureItem[];
}

export enum AppState {
  IDLE,
  LOADING,
  RESULT,
  ERROR,
}
