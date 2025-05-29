import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Webcam from 'react-webcam';
import { classifyYogaPose, fileToBase64, ClassificationResult } from '../services/aiService';
import { savePoseToHistory } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import ResultCard from './ResultCard';
import CameraCapture from './CameraCapture';

const YogaClassifier: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [history, setHistory] = useState<Array<{image: string, result: ClassificationResult}>>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [animateIn, setAnimateIn] = useState<boolean>(false);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const { user } = useAuth();

  // Load history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('yogaClassifierHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (err) {
      console.error("Error loading history:", err);
    }
    
    // Animation effect
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('yogaClassifierHistory', JSON.stringify(history));
    } catch (err) {
      console.error("Error saving history:", err);
    }
  }, [history]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Reset states
    setError(null);
    setResult(null);
    
    const file = acceptedFiles[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image.');
      return;
    }
    
    try {
      // Show preview
      const base64 = await fileToBase64(file);
      setImage(base64);
      setFileName(file.name);
    } catch (err) {
      setError('Error loading the image.');
      console.error(err);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  });

  // Save pose to Supabase database
  const savePoseToDatabase = async (classificationResult: ClassificationResult, imageUrl: string) => {
    if (!user) {
      console.log('User not authenticated, skipping database save');
      return;
    }
    
    if (classificationResult.poseName === 'No yoga pose detected' || classificationResult.confidence <= 0.3) {
      console.log('Low confidence pose, not saving to database');
      return;
    }
    
    try {
      setSaveStatus('saving');
      
      // Pass arrays directly instead of joining them as strings
      const poseData = {
        pose_name: classificationResult.poseName,
        confidence: classificationResult.confidence,
        image_url: imageUrl,
        description: classificationResult.description,
        benefits: classificationResult.benefits,  // Pass as array
        instructions: classificationResult.instructions, // Pass as array
        level: classificationResult.level,
        sanskrit_name: classificationResult.sanskritName,
      };
      
      const { data, error } = await savePoseToHistory(poseData);
      
      if (error) {
        console.error('Error saving pose to Supabase:', error);
        setSaveStatus('error');
      } else {
        console.log('Pose saved to Supabase:', data);
        setSaveStatus('success');
        
        // Reset status after a delay
        setTimeout(() => {
          setSaveStatus('idle');
        }, 3000);
      }
    } catch (err) {
      console.error('Exception while saving pose to database:', err);
      setSaveStatus('error');
    }
  };

  const handleClassify = async () => {
    if (!image) {
      setError('Please upload an image first.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const classificationResult = await classifyYogaPose(image);
      setResult(classificationResult);
      
      // Add to local history
      if (classificationResult.poseName !== 'No yoga pose detected' && classificationResult.confidence > 0.3) {
        setHistory(prev => [{ image, result: classificationResult }, ...prev.slice(0, 9)]);
        
        // Save to Supabase if user is authenticated
        await savePoseToDatabase(classificationResult, image);
      }
    } catch (err) {
      setError('Error during classification. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setFileName('');
    setResult(null);
    setError(null);
  };

  const loadFromHistory = (index: number) => {
    setImage(history[index].image);
    setResult(history[index].result);
    setFileName(`history-${index + 1}`);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('yogaClassifierHistory');
  };

  const handleOpenCamera = () => {
    setShowCamera(true);
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
  };

  const handleCameraCapture = async (result: ClassificationResult, imageSrc: string) => {
    setImage(imageSrc);
    setFileName('capture-camera.jpg');
    setResult(result);
    
    // Add to local history
    if (result.poseName !== 'No yoga pose detected' && result.confidence > 0.3) {
      setHistory(prev => [{ image: imageSrc, result }, ...prev.slice(0, 9)]);
      
      // Save to Supabase if user is authenticated
      await savePoseToDatabase(result, imageSrc);
    }
    setShowCamera(false);
  };

  // Reference to webcam for image capture
  const webcamRef = React.useRef<Webcam>(null);

  return (
    <div className={`transition-all duration-1000 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-4xl mx-auto border border-gray-200 backdrop-blur-sm">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            YOGASNAP
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload an image or use your camera to identify and get details about your yoga pose.
            Our advanced artificial intelligence will analyze your pose with precision.
          </p>
        </div>
        
        {/* Save status indicator */}
        {saveStatus === 'success' && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center animate-fadeIn">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Pose saved to your history. You can view it in the History section.</span>
          </div>
        )}
        
        {saveStatus === 'error' && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center animate-fadeIn">
            <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Failed to save pose to history. Please try again later.</span>
          </div>
        )}

        {/* Authentication notice */}
        {!user && (
          <div className="mb-6 bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-3 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Sign in to save your yoga poses and access them across devices.</span>
          </div>
        )}

        {/* History button */}
        <div className="mb-6 flex justify-between items-center">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center text-sm font-medium px-4 py-2 rounded-lg transition-all ${
              showHistory 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {showHistory ? 'Hide Recent History' : 'Show Recent History'}
          </button>
          {user && (
            <a 
              href="#/history" 
              className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#/history';
              }}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              View Full History
            </a>
          )}
        </div>

        {showHistory && (
          <div className="mb-6 bg-gradient-to-r from-gray-50 to-indigo-50 p-5 rounded-xl border border-indigo-100 shadow-inner animate-fadeIn">
            <div className="flex justify-between mb-4 items-center">
              <h3 className="text-lg font-semibold text-indigo-900">Classification History</h3>
              {history.length > 0 && (
                <button 
                  onClick={clearHistory}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Clear History
                </button>
              )}
            </div>
            
            {history.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p>No classifications in history yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {history.map((item, index) => (
                  <div 
                    key={index} 
                    className="group cursor-pointer" 
                    onClick={() => loadFromHistory(index)}
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-md">
                      <img src={item.image} alt={item.result.poseName} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-white text-xs font-medium truncate">{item.result.poseName}</p>
                        <div className="flex items-center mt-1">
                          <div className="h-1.5 flex-grow bg-white/20 rounded-full">
                            <div 
                              className={`h-1.5 rounded-full ${
                                item.result.confidence >= 0.8 ? 'bg-green-500' : 
                                item.result.confidence >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                              }`} 
                              style={{ width: `${item.result.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="ml-1 text-[10px] text-white/90">{Math.round(item.result.confidence * 100)}%</span>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white/80 text-indigo-800 text-xs px-2 py-1 rounded font-medium">Load</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col">
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-300 h-64 flex flex-col items-center justify-center ${
                isDragActive 
                  ? 'border-indigo-500 bg-indigo-50 shadow-inner scale-[1.02]' 
                  : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50'
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-indigo-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3-3m0 0l3 3m-3-3v8"></path>
                    </svg>
                  </div>
                  <p className="text-indigo-600 font-medium">Drop the image here...</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-2 font-medium">Drag and drop an image here, or click to select a file</p>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG or GIF</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center my-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-3 text-gray-500 text-sm font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <button 
              onClick={handleOpenCamera}
              className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-sm mb-6"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              Use camera to detect my pose
            </button>
            
            {image && (
              <div className="mt-6 animate-fadeIn">
                <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-800">
                  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Selected Image
                </h3>
                <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-lg group">
                  <img 
                    src={image} 
                    alt="Yoga Pose" 
                    className="w-full h-auto object-contain max-h-80 bg-gray-50"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white py-4 px-3">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                      </svg>
                      <span className="text-sm truncate">{fileName}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={handleClassify}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                        Classify this pose
                      </span>
                    )}
                  </button>
                  <button
                    onClick={handleReset}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 px-4 rounded-lg transition-all focus:outline-none"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>
            )}
            
            {error && (
              <div className="mt-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg animate-fadeIn">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p>{error}</p>
                </div>
              </div>
            )}
          </div>
          
          <div>
            {result ? (
              <ResultCard result={result} />
            ) : (
              <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-8 h-full flex flex-col items-center justify-center text-center border border-gray-200 shadow-inner">
                <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Classification Results</h3>
                <p className="text-gray-600 mb-6">Upload an image, use your camera, or select an image from history to see results here.</p>
                <div className="text-xs text-gray-500 p-3 bg-white rounded-lg max-w-xs">
                  <p className="flex items-center">
                    <svg className="w-4 h-4 text-indigo-400 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    For best results, use clear images where the pose is clearly visible.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 p-6 rounded-xl shadow-inner border border-indigo-100">
          <h3 className="text-xl font-semibold text-indigo-800 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            About this Application
          </h3>
          <div className="space-y-4 text-indigo-700">
            <p>
              This application uses advanced artificial intelligence to classify yoga poses.
              It can identify different poses and provide detailed information about each one.
            </p>
            <p>
              Our system is capable of recognizing many classic yoga poses and providing
              personalized advice to improve your practice.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  <h4 className="font-medium text-gray-800">Accuracy</h4>
                </div>
                <p className="text-sm text-gray-600">High precision in identifying yoga poses and their details.</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                  </svg>
                  <h4 className="font-medium text-gray-800">Personalization</h4>
                </div>
                <p className="text-sm text-gray-600">Personalized advice tailored to each pose to improve your practice.</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <h4 className="font-medium text-gray-800">Live Capture</h4>
                </div>
                <p className="text-sm text-gray-600">Use your camera for real-time analysis of your yoga poses.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCamera && (
        <CameraCapture 
          onCapture={handleCameraCapture}
          onClose={handleCloseCamera}
        />
      )}
    </div>
  );
};

export default YogaClassifier; 