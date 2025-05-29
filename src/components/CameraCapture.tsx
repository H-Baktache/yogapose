import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { classifyYogaPose, ClassificationResult } from '../services/aiService';

interface CameraCaptureProps {
  onCapture: (result: ClassificationResult, imageSrc: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturing, setCapturing] = useState<boolean>(false);
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [autoDetectMode, setAutoDetectMode] = useState<boolean>(false);
  const [detectionInterval, setDetectionInterval] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<ClassificationResult | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [detectedPose, setDetectedPose] = useState<string | null>(null);
  
  // Camera configuration
  const videoConstraints = {
    facingMode: facingMode,
    width: { ideal: 1280 },
    height: { ideal: 720 }
  };

  // Get the list of available cameras
  const handleDevices = useCallback((mediaDevices: MediaDeviceInfo[]) => {
    const videoDevices = mediaDevices.filter(({ kind }) => kind === "videoinput");
    setDevices(videoDevices);
  }, []);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(handleDevices)
      .catch(error => {
        console.error("Error enumerating devices:", error);
        setError("Unable to access camera devices");
      });
  }, [handleDevices]);

  // Clean up auto detection interval when component unmounts
  useEffect(() => {
    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, [detectionInterval]);

  // Start countdown before capture
  const startCountdown = () => {
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          captureImage();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Capture image from camera
  const captureImage = async () => {
    setCapturing(true);
    try {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          setAnalyzing(true);
          // Analyze the image with AI
          const result = await classifyYogaPose(imageSrc);
          
          if (!autoDetectMode) {
            onCapture(result, imageSrc);
          } else {
            setLastResult(result);
            setConfidence(result.confidence);
            setDetectedPose(result.poseName);
            
            // If confidence is high enough, send the result
            if (result.confidence > 0.7 && result.poseName !== 'No yoga pose detected') {
              onCapture(result, imageSrc);
              setAutoDetectMode(false);
              if (detectionInterval) {
                clearInterval(detectionInterval);
                setDetectionInterval(null);
              }
            }
          }
          
          setAnalyzing(false);
          setCapturing(false);
        }
      }
    } catch (err) {
      console.error("Error during capture:", err);
      setError("Error analyzing the pose. Please try again.");
      setCapturing(false);
      setAnalyzing(false);
    }
  };

  // Switch camera (front/back)
  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  // Event triggered when camera is ready
  const handleUserMedia = () => {
    setCameraReady(true);
  };

  // Event triggered when camera error occurs
  const handleUserMediaError = (error: string | DOMException) => {
    console.error("Error accessing camera:", error);
    setError("Unable to access camera. Please check permissions.");
  };
  
  // Enable/disable auto detection mode
  const toggleAutoDetectMode = () => {
    if (!autoDetectMode) {
      // Enable auto detection mode
      setAutoDetectMode(true);
      setConfidence(0);
      setDetectedPose(null);
      
      // Start periodic detection
      const intervalId = window.setInterval(() => {
        if (!capturing && !analyzing && cameraReady) {
          captureImage();
        }
      }, 2000); // Every 2 seconds
      
      setDetectionInterval(intervalId);
    } else {
      // Disable auto detection mode
      setAutoDetectMode(false);
      if (detectionInterval) {
        clearInterval(detectionInterval);
        setDetectionInterval(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-xl w-full relative animate-fadeIn">
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center bg-gradient-to-b from-black to-transparent p-4">
          <h3 className="text-white font-bold text-lg">
            {autoDetectMode ? 'Automatic Detection' : 'Live Detection'}
          </h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-red-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="relative">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMedia={handleUserMedia}
            onUserMediaError={handleUserMediaError}
            className="w-full h-auto"
          />
          
          {/* Auto detection information overlay */}
          {autoDetectMode && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center p-4">
              {analyzing ? (
                <div className="text-white text-center animate-pulse">
                  <svg className="animate-spin h-10 w-10 mx-auto mb-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-lg font-medium">Analyzing...</span>
                </div>
              ) : (
                <>
                  {detectedPose && confidence > 0.3 ? (
                    <div className="bg-white bg-opacity-80 p-4 rounded-lg text-center max-w-xs">
                      <h4 className="font-bold text-gray-800 mb-2">{detectedPose}</h4>
                      <div className="mb-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              confidence >= 0.8 ? 'bg-green-500' : 
                              confidence >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{Math.round(confidence * 100)}% confidence</span>
                      </div>
                      {confidence > 0.7 && (
                        <div className="text-green-600 font-medium text-sm animate-pulse mt-2">
                          Excellent pose! Saving...
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-white text-center">
                      <div className="text-xl font-medium mb-2">Take your yoga pose</div>
                      <div className="text-sm opacity-80">Hold the pose and stay in frame</div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          
          {/* Actions overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
            <div className="flex justify-between items-center">
              <button
                onClick={switchCamera}
                disabled={capturing || analyzing || devices.length <= 1}
                className="bg-white text-gray-800 p-2 rounded-full disabled:opacity-50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </button>
              
              {!autoDetectMode ? (
                <button
                  onClick={startCountdown}
                  disabled={!cameraReady || capturing || analyzing || countdown !== null}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {analyzing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : countdown !== null ? (
                    `${countdown}`
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      Capture
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={toggleAutoDetectMode}
                  disabled={!cameraReady}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  Stop
                </button>
              )}
              
              <button
                onClick={toggleAutoDetectMode}
                disabled={!cameraReady || capturing || analyzing || countdown !== null}
                className={`p-2 rounded-full transition-colors ${
                  autoDetectMode 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white text-gray-800'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Countdown */}
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-white text-6xl font-bold animate-pulse">{countdown}</div>
            </div>
          )}
        </div>
        
        {/* Automatic mode information messages */}
        {!autoDetectMode && (
          <div className="bg-indigo-50 text-indigo-700 p-4 border-t border-indigo-100">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="font-medium">Tip: Auto Mode</span>
            </div>
            <p className="text-sm ml-7">Enable auto mode (shield icon) for the app to detect your pose without having to press a button.</p>
          </div>
        )}
        
        {/* Error messages */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 border-t border-red-200">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture; 