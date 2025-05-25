import React, { useState, useEffect } from 'react';
import { yogaPoses, YogaPose } from '../data/poses';
import CameraCapture from './CameraCapture';
import { comparePoses, PoseComparisonResult } from '../services/poseComparisonService';

// Types for sequence state
type Level = 'beginner' | 'intermediate' | 'advanced';
type SequenceMode = 'menu' | 'sequence' | 'complete';

const YogaSequence: React.FC = () => {
  // Main states
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [mode, setMode] = useState<SequenceMode>('menu');
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<PoseComparisonResult | null>(null);
  const [completedPoses, setCompletedPoses] = useState<number[]>([]);
  const [animateIn, setAnimateIn] = useState(false);

  // Filter poses by selected level
  const levelPoses = selectedLevel 
    ? yogaPoses.filter(pose => pose.category === selectedLevel)
    : [];

  // Get current pose
  const currentPose = levelPoses[currentPoseIndex] || null;

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle level selection
  const handleSelectLevel = (level: Level) => {
    setSelectedLevel(level);
    setMode('sequence');
    setCurrentPoseIndex(0);
    setCompletedPoses([]);
  };

  // Handle camera open
  const handleOpenCamera = () => {
    setShowCamera(true);
  };

  // Handle camera close
  const handleCloseCamera = () => {
    setShowCamera(false);
  };

  // Handle pose completion
  const handleNextPose = () => {
    // Add current pose to completed poses
    if (!completedPoses.includes(currentPoseIndex)) {
      setCompletedPoses([...completedPoses, currentPoseIndex]);
    }

    // Check if we've completed 3 poses
    if (completedPoses.length >= 2) { // Already completed 2, about to complete the 3rd
      setMode('complete');
    } else {
      // Move to next pose
      setCurrentPoseIndex(prevIndex => prevIndex + 1);
    }
    
    // Reset comparison result
    setComparisonResult(null);
  };

  // Handle going back to level menu
  const handleBackToMenu = () => {
    setSelectedLevel(null);
    setMode('menu');
    setCurrentPoseIndex(0);
    setCompletedPoses([]);
    setComparisonResult(null);
  };

  // Handle camera capture and pose comparison
  const handleCameraCapture = async (_, imageSrc: string) => {
    if (!currentPose) return;
    
    try {
      // Compare user pose with reference pose
      const result = await comparePoses(
        imageSrc,
        currentPose.image,
        currentPose.name
      );
      
      setComparisonResult(result);
      setShowCamera(false);
    } catch (error) {
      console.error('Error comparing poses:', error);
      setShowCamera(false);
    }
  };

  // Render level selection menu
  const renderLevelMenu = () => (
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-4xl mx-auto border border-gray-200 backdrop-blur-sm animate-fadeIn">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
          Yoga Pose Sequences
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose your level and practice a sequence of yoga poses. Our AI will guide you through each pose and provide feedback.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Beginner Level */}
        <div 
          onClick={() => handleSelectLevel('beginner')}
          className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-green-200 hover:border-green-300 transform hover:-translate-y-1"
        >
          <h3 className="text-xl font-bold text-green-700 mb-3">Beginner</h3>
          <p className="text-green-800 text-sm mb-4">Perfect for those new to yoga or looking to refine the fundamentals.</p>
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">3 poses</span>
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </div>
        </div>
        
        {/* Intermediate Level */}
        <div 
          onClick={() => handleSelectLevel('intermediate')}
          className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-blue-200 hover:border-blue-300 transform hover:-translate-y-1"
        >
          <h3 className="text-xl font-bold text-blue-700 mb-3">Intermediate</h3>
          <p className="text-blue-800 text-sm mb-4">For practitioners with some experience ready to deepen their practice.</p>
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">3 poses</span>
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </div>
        </div>
        
        {/* Advanced Level */}
        <div 
          onClick={() => handleSelectLevel('advanced')}
          className="bg-gradient-to-br from-purple-50 to-fuchsia-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-purple-200 hover:border-purple-300 transform hover:-translate-y-1"
        >
          <h3 className="text-xl font-bold text-purple-700 mb-3">Advanced</h3>
          <p className="text-purple-800 text-sm mb-4">Challenging poses for experienced yogis looking to master complex asanas.</p>
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">3 poses</span>
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  // Render sequence practice
  const renderSequence = () => {
    if (!currentPose) return null;
    
    return (
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-4xl mx-auto border border-gray-200 backdrop-blur-sm animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={handleBackToMenu}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Menu
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Pose {currentPoseIndex + 1}/3</span>
            <div className="flex space-x-1">
              {[0, 1, 2].map(index => (
                <div 
                  key={index} 
                  className={`h-2 w-8 rounded-full ${
                    completedPoses.includes(index) 
                      ? 'bg-green-500' 
                      : index === currentPoseIndex 
                        ? 'bg-indigo-500' 
                        : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Pose Image */}
          <div className="flex-1">
            <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100 p-2">
              <img 
                src={currentPose.image} 
                alt={currentPose.name} 
                className="w-full h-auto object-contain max-h-80 mx-auto"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mt-4 text-center">{currentPose.name}</h3>
          </div>
          
          {/* Camera or Result */}
          <div className="flex-1">
            {comparisonResult ? (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-lg">Your Result</h4>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 w-32">
                      <div 
                        className={`h-2.5 rounded-full ${
                          comparisonResult.matchPercentage >= 60 
                            ? 'bg-green-500' 
                            : comparisonResult.matchPercentage >= 45 
                              ? 'bg-yellow-500' 
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${comparisonResult.matchPercentage}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {Math.round(comparisonResult.matchPercentage)}%
                    </span>
                  </div>
                </div>
                
                {comparisonResult.isMatch ? (
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-4">
                    <div className="flex items-center text-green-800">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="font-medium">Well done! You're doing great with this pose. Keep practicing!</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-4">
                    <div className="flex items-start text-yellow-800">
                      <svg className="w-5 h-5 mr-2 text-yellow-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                      </svg>
                      <span className="font-medium">You're on the right track! Here's how to improve:</span>
                    </div>
                  </div>
                )}
                
                {!comparisonResult.isMatch && comparisonResult.feedback.length > 0 && (
                  <div className="bg-white border border-gray-100 rounded-lg p-4 mb-6">
                    <h5 className="font-semibold text-indigo-700 mb-3">Feedback:</h5>
                    <ul className="space-y-3">
                      {comparisonResult.feedback.map((item, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-700 pb-2 border-b border-gray-100 last:border-0">
                          <svg className="w-5 h-5 mr-2 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex justify-center">
                  {comparisonResult.isMatch ? (
                    <button
                      onClick={handleNextPose}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                    >
                      {completedPoses.length >= 2 ? 'Complete Sequence' : 'Next Pose'}
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={handleOpenCamera}
                      className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-lg hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                    >
                      Try Again
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 flex flex-col items-center justify-center h-full">
                <div className="text-center mb-6">
                  <svg className="w-20 h-20 mx-auto text-indigo-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <h4 className="font-bold text-lg text-gray-800 mb-2">Take a Photo of Your Pose</h4>
                  <p className="text-gray-600 text-sm">
                    Position yourself in the same pose shown in the reference image, then capture a photo for AI analysis.
                  </p>
                </div>
                <button
                  onClick={handleOpenCamera}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Open Camera
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render sequence completion
  const renderComplete = () => (
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-4xl mx-auto border border-gray-200 backdrop-blur-sm animate-fadeIn">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
          Sequence Completed!
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Congratulations! You've successfully completed the {selectedLevel} level sequence. 
          You can continue to the next level or return to the menu.
        </p>
      </div>
      
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleBackToMenu}
          className="px-6 py-3 bg-white border border-indigo-600 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-all duration-300 shadow-sm hover:shadow-md flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Menu
        </button>
        
        {selectedLevel !== 'advanced' && (
          <button
            onClick={() => {
              // Move to next level
              if (selectedLevel === 'beginner') {
                handleSelectLevel('intermediate');
              } else if (selectedLevel === 'intermediate') {
                handleSelectLevel('advanced');
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
          >
            Next Level
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className={`transition-all duration-1000 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {mode === 'menu' && renderLevelMenu()}
      {mode === 'sequence' && renderSequence()}
      {mode === 'complete' && renderComplete()}
      
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={handleCloseCamera}
        />
      )}
    </div>
  );
};

export default YogaSequence; 