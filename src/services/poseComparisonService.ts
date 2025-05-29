import { GoogleGenerativeAI } from '@google/generative-ai';

// Interface for comparison result
export interface PoseComparisonResult {
  isMatch: boolean;
  confidence: number;
  feedback: string[];
  matchPercentage: number;
}

// The API key is stored in Vite environment variables
// @ts-ignore - Ignore TypeScript error as Vite handles these environment variables correctly
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Initialize API
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Compare user pose with reference pose using Gemini
 * @param userImageBase64 - User's pose image encoded in base64
 * @param referencePoseUrl - URL of the reference pose image
 * @param poseName - Name of the yoga pose for context
 * @returns Comparison result with match status and feedback
 */
export const comparePoses = async (
  userImageBase64: string,
  referencePoseUrl: string,
  poseName: string
): Promise<PoseComparisonResult> => {
  try {
    // Generate model - Using recommended model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Prepare user image
    const userImageData = {
      inlineData: {
        data: userImageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''),
        mimeType: 'image/jpeg',
      },
    };
    
    // Prompt for comparison
    const prompt = `
      Compare these two yoga poses:
      
      1. The first image shows a person attempting to do the "${poseName}" yoga pose.
      2. The second image URL is a reference pose: ${referencePoseUrl}
      
      Please analyze both poses and determine:
      - If the person in the first image is correctly performing the "${poseName}" pose
      - What percentage match (0-100%) would you give to this attempt
      - Specific feedback on what they can improve
      
      Be very generous in your assessment. The person might be a beginner trying their best.
      Even if the pose is only approximately similar, consider it a success.
      
      Respond with a JSON object containing:
      {
        "isMatch": boolean (true if the match is 60% or higher),
        "confidence": number (your confidence in this assessment, 0-1),
        "matchPercentage": number (how close the poses match, 0-100),
        "feedback": string[] (array of specific improvement suggestions, empty if perfect)
      }
      
      Be encouraging and supportive in your feedback, focusing on 1-2 key elements that would most improve the pose.
    `;
    
    // Generate response
    const result = await model.generateContent([prompt, userImageData]);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response from API');
    }
    
    // Parse and validate JSON
    const parsedResult = JSON.parse(jsonMatch[0]);
    
    return {
      isMatch: parsedResult.isMatch || false,
      confidence: parsedResult.confidence || 0,
      matchPercentage: parsedResult.matchPercentage || 0,
      feedback: parsedResult.feedback || []
    };
  } catch (error) {
    console.error('Error comparing poses with Gemini:', error);
    throw new Error('Failed to compare poses with Gemini');
  }
}; 