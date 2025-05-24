import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Webcam from 'react-webcam';
import { classifyYogaPose, fileToBase64, ClassificationResult } from '../services/aiService';
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

  // Load history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('yogaClassifierHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (err) {
      console.error("Erreur lors du chargement de l'historique:", err);
    }
    
    // Animation d'entrée
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
      console.error("Erreur lors de la sauvegarde de l'historique:", err);
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
      setError('Veuillez télécharger une image valide.');
      return;
    }
    
    try {
      // Show preview
      const base64 = await fileToBase64(file);
      setImage(base64);
      setFileName(file.name);
    } catch (err) {
      setError('Erreur lors du chargement de l\'image.');
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

  const handleClassify = async () => {
    if (!image) {
      setError('Veuillez d\'abord télécharger une image.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const classificationResult = await classifyYogaPose(image);
      setResult(classificationResult);
      
      // Add to history
      if (classificationResult.poseName !== 'Aucune posture de yoga détectée' && classificationResult.confidence > 0.3) {
        setHistory(prev => [{ image, result: classificationResult }, ...prev.slice(0, 9)]);
      }
    } catch (err) {
      setError('Erreur lors de la classification. Veuillez réessayer.');
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
    setFileName(`historique-${index + 1}`);
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

  const handleCameraCapture = (result: ClassificationResult, imageSrc: string) => {
    setImage(imageSrc);
    setFileName('capture-camera.jpg');
    setResult(result);
    
    // Add to history
    if (result.poseName !== 'Aucune posture de yoga détectée' && result.confidence > 0.3) {
      setHistory(prev => [{ image: imageSrc, result }, ...prev.slice(0, 9)]);
    }
    setShowCamera(false);
  };

  // Référence à la webcam pour la capture d'image
  const webcamRef = React.useRef<Webcam>(null);

  return (
    <div className={`transition-all duration-1000 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-4xl mx-auto border border-gray-200 backdrop-blur-sm">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            Classifieur de postures de yoga
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Téléchargez une image ou utilisez votre caméra pour identifier et obtenir des détails sur votre posture de yoga.
            Notre intelligence artificielle avancée analysera votre posture avec précision.
          </p>
        </div>
        
        <div className="flex justify-end mb-4 space-x-3">
          <button 
            onClick={handleOpenCamera}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            Utiliser la caméra
          </button>
          
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-lg hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 shadow-sm"
          >
            <svg className={`w-5 h-5 mr-2 transition-transform duration-300 ${showHistory ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Historique
            {history.length > 0 && (
              <span className="ml-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {history.length}
              </span>
            )}
          </button>
        </div>

        {showHistory && (
          <div className="mb-6 bg-gradient-to-r from-gray-50 to-indigo-50 p-5 rounded-xl border border-indigo-100 shadow-inner animate-fadeIn">
            <div className="flex justify-between mb-4 items-center">
              <h3 className="text-lg font-semibold text-indigo-900">Historique des classifications</h3>
              {history.length > 0 && (
                <button 
                  onClick={clearHistory}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Effacer l'historique
                </button>
              )}
            </div>
            
            {history.length === 0 ? (
              <div className="text-center py-6 text-gray-500 flex flex-col items-center">
                <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p>Aucun historique disponible</p>
                <p className="text-sm mt-1">Les analyses seront enregistrées ici</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {history.map((item, index) => (
                  <div 
                    key={index} 
                    className="cursor-pointer group hover:opacity-90 transition-all duration-300 transform hover:scale-105"
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
                        <span className="bg-white/80 text-indigo-800 text-xs px-2 py-1 rounded font-medium">Charger</span>
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
                  <p className="text-indigo-600 font-medium">Déposez l'image ici...</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-2 font-medium">Glissez-déposez une image ici, ou cliquez pour sélectionner un fichier</p>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG ou GIF</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center my-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-3 text-gray-500 text-sm font-medium">OU</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <button 
              onClick={handleOpenCamera}
              className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-sm mb-6"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              Utiliser la caméra pour détecter ma posture
            </button>
            
            {image && (
              <div className="mt-6 animate-fadeIn">
                <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-800">
                  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Image sélectionnée
                </h3>
                <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-lg group">
                  <img 
                    src={image} 
                    alt="Posture de yoga" 
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
                        Analyse en cours...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                        Classifier cette posture
                      </span>
                    )}
                  </button>
                  <button
                    onClick={handleReset}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 flex items-center justify-center shadow-sm hover:shadow"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Réinitialiser
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
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Résultats de classification</h3>
                <p className="text-gray-600 mb-6">Téléchargez une image, utilisez votre caméra ou sélectionnez une image de l'historique pour voir les résultats ici.</p>
                <div className="text-xs text-gray-500 p-3 bg-white rounded-lg max-w-xs">
                  <p className="flex items-center">
                    <svg className="w-4 h-4 text-indigo-400 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Pour de meilleurs résultats, utilisez des images claires où la posture est bien visible.
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
            À propos de cette application
          </h3>
          <div className="space-y-4 text-indigo-700">
            <p>
              Cette application utilise l'intelligence artificielle avancée pour classifier les postures de yoga.
              Elle peut identifier différentes postures et fournir des informations détaillées sur chacune d'elles.
            </p>
            <p>
              Notre système est capable de reconnaître de nombreuses postures de yoga classiques et de fournir
              des conseils personnalisés pour améliorer votre pratique.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  <h4 className="font-medium text-gray-800">Précision</h4>
                </div>
                <p className="text-sm text-gray-600">Haute précision dans l'identification des postures de yoga et de leurs détails.</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                  </svg>
                  <h4 className="font-medium text-gray-800">Personnalisation</h4>
                </div>
                <p className="text-sm text-gray-600">Conseils personnalisés adaptés à chaque posture pour améliorer votre pratique.</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <h4 className="font-medium text-gray-800">Capture en direct</h4>
                </div>
                <p className="text-sm text-gray-600">Utilisez votre caméra pour une analyse en temps réel de vos postures de yoga.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCamera && (
        <CameraCapture onCapture={handleCameraCapture} onClose={handleCloseCamera} />
      )}
    </div>
  );
};

export default YogaClassifier; 