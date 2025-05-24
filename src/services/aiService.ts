import { classifyWithGemini } from './geminiService';

// Interface pour le résultat de classification
export interface ClassificationResult {
  poseName: string;
  confidence: number;
  description: string;
  benefits: string[];
  instructions: string[];
  level: string;
  sanskritName?: string;
  imageUrl?: string;
  isSimulation?: boolean;
}

/**
 * Classifie une image de posture de yoga en utilisant l'IA Gemini
 * @param imageBase64 - Image encodée en base64
 * @returns Résultat de classification avec détails sur la posture
 */
export const classifyYogaPose = async (imageBase64: string): Promise<ClassificationResult> => {
  // Utiliser uniquement l'API Gemini pour classifier l'image
  return await classifyWithGemini(imageBase64);
};

/**
 * Convertit une image File en base64
 * @param file - Fichier image
 * @returns Promise avec l'image encodée en base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}; 