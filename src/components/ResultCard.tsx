import React, { useState } from 'react';
import { ClassificationResult } from '../services/aiService';

interface ResultCardProps {
  result: ClassificationResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'benefits' | 'instructions'>('benefits');
  
  // Determine color based on confidence
  const getConfidenceColor = () => {
    if (result.confidence >= 0.8) return 'bg-green-500';
    if (result.confidence >= 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Format confidence percentage
  const confidencePercent = Math.round(result.confidence * 100);
  
  // Check if no pose was detected
  const noPostureDetected = result.poseName === 'No yoga pose detected';
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn border border-gray-200">
      <div className={`p-6 ${noPostureDetected ? 'bg-red-50' : 'bg-gradient-to-r from-indigo-50 to-purple-50'}`}>
        <div className="flex justify-between items-start mb-4">
          <h3 className={`text-xl font-bold ${noPostureDetected ? 'text-red-700' : 'text-indigo-800'}`}>
            {result.poseName}
          </h3>
          {result.sanskritName && !noPostureDetected && (
            <span className="text-indigo-600 text-sm bg-indigo-50 px-3 py-1 rounded-full">
              {result.sanskritName}
            </span>
          )}
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Confidence</span>
            <span className={`text-sm font-medium ${
              result.confidence >= 0.8 ? 'text-green-700' : 
              result.confidence >= 0.5 ? 'text-yellow-700' : 'text-red-700'
            }`}>
              {confidencePercent}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getConfidenceColor()}`}
              style={{ width: `${confidencePercent}%` }}
            ></div>
          </div>
        </div>
        
        {!noPostureDetected && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Level</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                result.level.includes('Beginner') ? 'bg-green-100 text-green-800' : 
                result.level.includes('Intermediate') ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {result.level}
              </span>
            </div>
          </div>
        )}
        
        <p className="text-gray-700 mb-6">{result.description}</p>
        
        {!noPostureDetected && result.imageUrl && (
          <div className="mb-6 rounded-lg overflow-hidden shadow-md">
            <img 
              src={result.imageUrl} 
              alt={result.poseName} 
              className="w-full h-auto object-cover"
              onError={(e) => {
                // Replace with default image in case of loading error
                e.currentTarget.src = "https://via.placeholder.com/600x400?text=Image+not+available";
              }}
            />
          </div>
        )}
        
        {/* Tabs */}
        {!noPostureDetected && (
          <div className="border-b border-gray-200">
            <div className="flex -mb-px">
              <button
                className={`mr-1 py-2 px-4 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'benefits'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('benefits')}
              >
                Benefits
              </button>
              <button
                className={`mr-1 py-2 px-4 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'instructions'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('instructions')}
              >
                Instructions
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Tab content */}
      <div className="p-6">
        {activeTab === 'benefits' && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">
              {noPostureDetected ? 'Suggestions' : 'Benefits'}
            </h4>
            <ul className="space-y-2">
              {result.benefits.length > 0 ? (
                result.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>{benefit}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 italic">No information available</li>
              )}
            </ul>
          </div>
        )}
        
        {activeTab === 'instructions' && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">
              {noPostureDetected ? 'Tips for better detection' : 'Instructions'}
            </h4>
            <ol className="space-y-2 list-decimal list-inside">
              {result.instructions.map((instruction, index) => (
                <li key={index} className="text-gray-700 pl-2">
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard; 