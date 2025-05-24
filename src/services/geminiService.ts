import { GoogleGenerativeAI } from '@google/generative-ai';
import { ClassificationResult } from './aiService';

// L'API key est stockée dans les variables d'environnement de Vite
// @ts-ignore - Ignorer l'erreur TypeScript car Vite gère ces variables d'environnement correctement
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Initialisation de l'API
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Utilise l'API Gemini pour classifier une posture de yoga à partir d'une image
 * @param imageBase64 - Image encodée en base64
 * @returns Résultat de classification avec détails sur la posture
 */
export const classifyWithGemini = async (imageBase64: string): Promise<ClassificationResult> => {
  try {
    // Génération du modèle - Utilisation du modèle recommandé
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Préparation de l'image
    const imageData = {
      inlineData: {
        data: imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''),
        mimeType: 'image/jpeg',
      },
    };
    
    // Prompt pour la classification
    const prompt = `
      Analyse cette image et identifie la posture de yoga présentée.
      
      Réponds avec un objet JSON qui contient les informations suivantes:
      - poseName: le nom de la posture en français et en anglais (exemple: "Mountain Pose (Tadasana)")
      - confidence: un nombre entre 0 et 1 indiquant ta confiance dans cette classification
      - description: une brève description de la posture
      - benefits: un tableau des bienfaits de cette posture (5 maximum)
      - level: niveau de difficulté ("Débutant", "Intermédiaire", "Avancé" ou une combinaison comme "Débutant-Intermédiaire")
      - instructions: un tableau de conseils pour réaliser correctement la posture (6 maximum)
      - sanskritName: le nom de la posture en sanskrit (optionnel)
      
      Si aucune posture de yoga n'est visible, indique "Aucune posture de yoga détectée" comme poseName et 0.3 comme confidence.
    `;
    
    // Génération de la réponse
    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const text = response.text();
    
    // Extraction du JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Réponse non valide de l\'API');
    }
    
    // Analyse et validation du JSON
    const parsedResult = JSON.parse(jsonMatch[0]);
    
    return {
      poseName: parsedResult.poseName || 'Inconnu',
      confidence: parsedResult.confidence || 0,
      description: parsedResult.description || '',
      benefits: parsedResult.benefits || [],
      instructions: parsedResult.instructions || [],
      level: parsedResult.level || 'Débutant',
      sanskritName: parsedResult.sanskritName || undefined
    };
  } catch (error) {
    console.error('Erreur lors de la classification avec Gemini:', error);
    throw new Error('Échec de la classification de l\'image avec Gemini');
  }
}; 